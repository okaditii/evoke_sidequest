/**
 * Uploads go to /api/upload on the same site: a serverless function in production (api/upload.ts),
 * server.js behind the Vite proxy locally. Both keep the Pinata keys server-side.
 * VITE_UPLOAD_API can point at a separately hosted server.js instead.
 */
const UPLOAD_URL = import.meta.env.VITE_UPLOAD_API ? `${import.meta.env.VITE_UPLOAD_API.replace(/\/$/, "")}/upload` : "/api/upload";

const GATEWAYS = ["https://gateway.pinata.cloud/ipfs/", "https://ipfs.io/ipfs/"];

export const gatewayUrl = (cid: string, gateway = 0) => `${GATEWAYS[gateway] ?? GATEWAYS[0]}${cid}`;
export const gatewayCount = GATEWAYS.length;

export async function uploadToIpfs(file: File, title: string): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("title", title);
  let res: Response;
  try {
    res = await fetch(UPLOAD_URL, { method: "POST", body: form });
  } catch {
    throw new Error("Can't reach the upload service. Check your connection and try again.");
  }
  const data = (await res.json().catch(() => ({}))) as { IpfsHash?: string; error?: string };
  if (!res.ok) throw new Error(data.error ?? `Upload failed (HTTP ${res.status}).`);
  if (!data.IpfsHash) throw new Error("The upload server didn't return an IPFS hash.");
  return data.IpfsHash;
}
