/** Uploads go through the existing Express/Pinata server (server.js), which keeps the API keys. */
const UPLOAD_API = import.meta.env.VITE_UPLOAD_API || "http://localhost:5000";

const GATEWAYS = ["https://gateway.pinata.cloud/ipfs/", "https://ipfs.io/ipfs/"];

export const gatewayUrl = (cid: string, gateway = 0) => `${GATEWAYS[gateway] ?? GATEWAYS[0]}${cid}`;
export const gatewayCount = GATEWAYS.length;

export async function uploadToIpfs(file: File, title: string): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("title", title);
  let res: Response;
  try {
    res = await fetch(`${UPLOAD_API}/upload`, { method: "POST", body: form });
  } catch {
    throw new Error("Can't reach the upload server. Start it with `node server.js` in the project folder.");
  }
  if (!res.ok) throw new Error(`Upload failed (HTTP ${res.status}).`);
  const data = (await res.json()) as { IpfsHash?: string };
  if (!data.IpfsHash) throw new Error("The upload server didn't return an IPFS hash.");
  return data.IpfsHash;
}
