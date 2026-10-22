/// <reference types="vite/client" />
import type { EIP1193Provider } from "viem";

declare global {
  interface ImportMetaEnv {
    /** Sepolia RPC endpoint for reads. Defaults to a public node. */
    readonly VITE_RPC_URL?: string;
    /** Base URL of the upload server (server.js). Defaults to http://localhost:5000. */
    readonly VITE_UPLOAD_API?: string;
  }
  interface Window {
    ethereum?: EIP1193Provider;
  }
}
