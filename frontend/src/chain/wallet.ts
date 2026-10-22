import {
  createWalletClient,
  custom,
  decodeEventLog,
  encodeFunctionData,
  formatEther,
  numberToHex,
  type Address,
  type EIP1193Provider,
  type Hash,
  type Hex,
} from "viem";
import { CHAIN, CONTRACT_ADDRESS, publicClient, rewardAbi } from "./contract";

export function getProvider(): EIP1193Provider {
  if (!window.ethereum) {
    throw new Error("No wallet found. Install MetaMask (or another browser wallet) to claim rewards.");
  }
  return window.ethereum;
}

export async function requestAccount(): Promise<Address> {
  const [account] = (await getProvider().request({ method: "eth_requestAccounts" })) as Address[];
  if (!account) throw new Error("The wallet didn't share an account.");
  return account;
}

export async function currentAccount(): Promise<Address | null> {
  if (!window.ethereum) return null;
  const accounts = (await window.ethereum.request({ method: "eth_accounts" })) as Address[];
  return accounts[0] ?? null;
}

/** Make sure the wallet is on Sepolia, asking it to switch (or add the network) if not. */
export async function ensureChain(): Promise<void> {
  const provider = getProvider();
  const chainId = (await provider.request({ method: "eth_chainId" })) as string;
  if (Number(chainId) === CHAIN.id) return;
  try {
    await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: numberToHex(CHAIN.id) }] });
  } catch (err) {
    if ((err as { code?: number }).code !== 4902) throw err; // 4902: chain not added to the wallet
    await provider.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: numberToHex(CHAIN.id),
          chainName: CHAIN.name,
          nativeCurrency: CHAIN.nativeCurrency,
          rpcUrls: [...CHAIN.rpcUrls.default.http],
          blockExplorerUrls: [CHAIN.blockExplorers.default.url],
        },
      ],
    });
  }
  // Never send anywhere but Sepolia: re-check after the switch.
  const now = Number((await provider.request({ method: "eth_chainId" })) as string);
  if (now !== CHAIN.id) throw new Error("Switch your wallet to the Sepolia test network, then try again.");
}

/**
 * Checks a transaction against Sepolia before the wallet sees it: the sender has test ETH, the
 * call wouldn't revert, and how much gas it needs. Passing that gas limit means the wallet doesn't
 * have to estimate it itself, which is where vague "Internal JSON-RPC error" failures come from.
 */
async function preflight(account: Address, data: Hex): Promise<bigint> {
  const balance = await publicClient.getBalance({ address: account });
  if (balance === 0n) {
    throw new Error(`Your wallet ${account.slice(0, 6)}…${account.slice(-4)} has no Sepolia ETH for gas. Get some from a Sepolia faucet and try again.`);
  }
  const tx = { account, to: CONTRACT_ADDRESS, data } as const;
  await publicClient.call(tx); // throws with the revert reason if it would fail
  const gas = await publicClient.estimateGas(tx);
  const fees = await publicClient.estimateFeesPerGas();
  const limit = (gas * 13n) / 10n; // 30% headroom
  if (limit * fees.maxFeePerGas > balance) {
    throw new Error(`Not enough Sepolia ETH for gas: this needs about ${formatEther(limit * fees.maxFeePerGas)} ETH and the wallet has ${formatEther(balance)}.`);
  }
  return limit;
}

function walletClient(account: Address) {
  return createWalletClient({ account, chain: CHAIN, transport: custom(getProvider()) });
}

/** Mints a reward to the connected wallet and returns the new token id once it's confirmed. */
export async function mintReward(
  account: Address,
  cid: string,
  name: string,
  description: string,
  onSent?: (hash: Hash) => void,
): Promise<{ hash: Hash; tokenId: bigint | null }> {
  await ensureChain();
  const call = { functionName: "mintArtwork", args: [cid, name, description] } as const;
  const gas = await preflight(account, encodeFunctionData({ abi: rewardAbi, ...call }));
  const hash = await walletClient(account).writeContract({ address: CONTRACT_ADDRESS, abi: rewardAbi, ...call, gas });
  onSent?.(hash);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (receipt.status !== "success") throw new Error("The mint transaction failed on-chain.");
  let tokenId: bigint | null = null;
  for (const log of receipt.logs) {
    if (log.address.toLowerCase() !== CONTRACT_ADDRESS.toLowerCase()) continue;
    try {
      const ev = decodeEventLog({ abi: rewardAbi, data: log.data, topics: log.topics });
      if (ev.eventName === "Transfer") tokenId = ev.args.tokenId;
    } catch {
      // not a Transfer log
    }
  }
  return { hash, tokenId };
}

export async function giftReward(
  from: Address,
  to: Address,
  tokenId: bigint,
  onSent?: (hash: Hash) => void,
): Promise<Hash> {
  await ensureChain();
  const call = { functionName: "safeTransferFrom", args: [from, to, tokenId] } as const;
  const gas = await preflight(from, encodeFunctionData({ abi: rewardAbi, ...call }));
  const hash = await walletClient(from).writeContract({ address: CONTRACT_ADDRESS, abi: rewardAbi, ...call, gas });
  onSent?.(hash);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (receipt.status !== "success") throw new Error("The transfer failed on-chain.");
  return hash;
}

/** Turns wallet/RPC errors into one readable line. */
export function friendlyError(err: unknown): string {
  console.error("[evoke]", err); // full error for the browser console
  const e = err as { shortMessage?: string; message?: string; details?: string; code?: number; cause?: { code?: number } };
  if (e?.code === 4001 || e?.cause?.code === 4001 || /user rejected|denied/i.test(e?.message ?? "")) {
    return "You cancelled the request in your wallet.";
  }
  if (/insufficient funds/i.test(e?.message ?? "")) {
    return "Not enough Sepolia ETH for gas. Grab some from a Sepolia faucet and try again.";
  }
  if (/chain mismatch|does not match the target chain/i.test(e?.message ?? "")) {
    return "Your wallet is on a different network. Switch it to Sepolia and try again.";
  }
  const main = e?.shortMessage || e?.message?.split("\n")[0] || "Something went wrong.";
  return e?.details && !main.includes(e.details) ? `${main} (${e.details})` : main;
}
