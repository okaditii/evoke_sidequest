import type { Address } from "viem";
import { decodeMeta, type DecodedMeta } from "../lib/metadata";
import { CONTRACT_ADDRESS, publicClient, rewardAbi } from "./contract";

export interface Reward {
  id: bigint;
  cid: string;
  name: string;
  meta: DecodedMeta;
  /** Who minted it (stored by the contract at mint time). */
  minter: Address;
  /** Who holds it now (ERC-721 ownerOf). */
  holder: Address;
}

const contract = { address: CONTRACT_ADDRESS, abi: rewardAbi } as const;

/** Reads every token with two multicalls (getArtwork + ownerOf), newest first. */
export async function fetchAllRewards(): Promise<Reward[]> {
  const total = await publicClient.readContract({ ...contract, functionName: "totalSupply" });
  const ids = Array.from({ length: Number(total) }, (_, i) => BigInt(i + 1));
  if (ids.length === 0) return [];

  const [details, holders] = await Promise.all([
    publicClient.multicall({
      contracts: ids.map((id) => ({ ...contract, functionName: "getArtwork", args: [id] }) as const),
    }),
    publicClient.multicall({
      contracts: ids.map((id) => ({ ...contract, functionName: "ownerOf", args: [id] }) as const),
    }),
  ]);

  const rewards: Reward[] = [];
  ids.forEach((id, i) => {
    const d = details[i];
    const h = holders[i];
    if (d.status !== "success" || h.status !== "success") return; // skip unreadable tokens
    const [cid, name, description, minter] = d.result;
    rewards.push({ id, cid, name, meta: decodeMeta(description), minter, holder: h.result });
  });
  return rewards.reverse();
}

export const sameAddress = (a?: string | null, b?: string | null) =>
  !!a && !!b && a.toLowerCase() === b.toLowerCase();

export const shortAddress = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;
