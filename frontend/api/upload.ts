// Serverless upload route, deployed with the site at /api/upload. It pins a minted card's image to
// IPFS through Pinata, so the Pinata keys stay on the server and the site needs no separate backend.
// Locally, server.js serves the same route and Vite proxies /api to it.

declare const process: { env: Record<string, string | undefined> };

const PINATA_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";
/** Serverless request bodies are capped at 4.5 MB; card images are far smaller. */
const MAX_BYTES = 4 * 1024 * 1024;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

export async function POST(request: Request): Promise<Response> {
  const key = process.env.PINATA_API_KEY;
  const secret = process.env.PINATA_SECRET_KEY;
  if (!key || !secret) return json({ error: "The upload service isn't configured (missing Pinata keys)." }, 500);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: "Expected a multipart form upload." }, 400);
  }
  const file = form.get("file");
  if (!(file instanceof Blob) || file.size === 0) return json({ error: "No file uploaded." }, 400);
  if (file.size > MAX_BYTES) return json({ error: "The image is too large (4 MB max)." }, 413);

  const title = String(form.get("title") ?? "").slice(0, 120);
  const name = file instanceof File && file.name ? file.name : "card.svg";
  const out = new FormData();
  out.append("file", file, name);
  out.append("pinataMetadata", JSON.stringify({ name: title || name, keyvalues: { uploadedAt: new Date().toISOString() } }));
  out.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));

  try {
    const res = await fetch(PINATA_URL, { method: "POST", headers: { pinata_api_key: key, pinata_secret_api_key: secret }, body: out });
    const data = (await res.json().catch(() => ({}))) as { IpfsHash?: string; error?: unknown };
    if (!res.ok || !data.IpfsHash) return json({ error: "IPFS upload failed.", details: data.error ?? res.status }, 502);
    return json({ IpfsHash: data.IpfsHash });
  } catch {
    return json({ error: "Couldn't reach Pinata. Try again in a moment." }, 502);
  }
}
