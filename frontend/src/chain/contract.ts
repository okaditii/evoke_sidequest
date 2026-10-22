import { createPublicClient, http, type Address } from "viem";
import { sepolia } from "viem/chains";

/** The deployed ArtGallery (ERC-721) contract. Unchanged; this site is only a new frontend for it. */
export const CONTRACT_ADDRESS: Address = "0xCDc6E9B074F2422f2BD1EdfCC9C9813ac0E52f57";
export const CHAIN = sepolia;

const RPC_URL = import.meta.env.VITE_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";

export const publicClient = createPublicClient({ chain: CHAIN, transport: http(RPC_URL) });

/** Only the parts of the ArtGallery ABI this site uses. */
export const rewardAbi = [
  {
    type: "function",
    name: "mintArtwork",
    stateMutability: "nonpayable",
    inputs: [
      { name: "ipfsHash", type: "string" },
      { name: "title", type: "string" },
      { name: "description", type: "string" },
    ],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "getArtwork",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [
      { name: "ipfsHash", type: "string" },
      { name: "title", type: "string" },
      { name: "description", type: "string" },
      { name: "owner", type: "address" },
    ],
  },
  {
    type: "function",
    name: "totalSupply",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "ownerOf",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ type: "address" }],
  },
  {
    type: "function",
    name: "safeTransferFrom",
    stateMutability: "nonpayable",
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "tokenId", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "event",
    name: "Transfer",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "tokenId", type: "uint256", indexed: true },
    ],
  },
] as const;

export const explorerTx = (hash: string) => `${CHAIN.blockExplorers.default.url}/tx/${hash}`;
export const explorerAddress = (a: string) => `${CHAIN.blockExplorers.default.url}/address/${a}`;
export const explorerToken = (id: bigint) =>
  `${CHAIN.blockExplorers.default.url}/nft/${CONTRACT_ADDRESS}/${id.toString()}`;
