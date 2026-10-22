import type { GamingCardProps } from "../components/GamingCard";
import { ART_H, ART_W, portrait } from "./cardArt";
import { TIER_LABEL, TIER_RANK } from "./metadata";
import { TIER_LOOK } from "./tiers";

/**
 * The minted image: the same card as the on-screen GamingCard, as a self-contained 500×700 SVG
 * with the generated portrait inlined. Nothing is fetched. (Web fonts aren't available inside an
 * <img>, so text falls back to system fonts.)
 */
export type CardSpec = Pick<GamingCardProps, "tier" | "character" | "title" | "role" | "code" | "genre" | "seed" | "power" | "footer">;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const FONT = "'Poppins', 'Segoe UI', Arial, sans-serif";
const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif";

export function renderCardSvg(spec: CardSpec): string {
  const look = TIER_LOOK[spec.tier];
  const stops = look.frame.map((c, i) => `<stop offset="${(i / (look.frame.length - 1)).toFixed(2)}" stop-color="${c}"/>`).join("");
  const art = portrait(spec.seed, spec.genre, TIER_RANK[spec.tier]).markup;
  const footer = spec.footer ? esc(spec.footer.toUpperCase()) : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="700" viewBox="0 0 500 700">
  <defs>
    <linearGradient id="frame" x1="0" y1="0" x2="1" y2="1">${stops}</linearGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0a0a12" stop-opacity=".45"/><stop offset=".2" stop-color="#0a0a12" stop-opacity="0"/>
      <stop offset=".5" stop-color="#0a0a12" stop-opacity="0"/><stop offset=".72" stop-color="#0a0a12" stop-opacity=".9"/>
      <stop offset="1" stop-color="#0a0a12"/>
    </linearGradient>
    <clipPath id="face"><rect x="13" y="13" width="474" height="674" rx="20"/></clipPath>
  </defs>
  <rect width="500" height="700" rx="30" fill="url(#frame)"/>
  <g clip-path="url(#face)">
    <svg x="13" y="13" width="474" height="674" viewBox="0 0 ${ART_W} ${ART_H}" preserveAspectRatio="xMidYMid slice">${art}</svg>
    <rect x="13" y="13" width="474" height="674" fill="url(#fade)"/>
  </g>
  <g font-family="${FONT}" fill="#f5f5fa">
    <text x="72" y="96" text-anchor="middle" font-weight="700" font-size="64" fill="${look.ink}">${spec.power}</text>
    <text x="72" y="126" text-anchor="middle" font-weight="600" font-size="22" letter-spacing="2">${esc(spec.code)}</text>
    ${spec.role ? `<text x="72" y="150" text-anchor="middle" font-size="16" letter-spacing="1.5" fill="#a1a1b5">${esc(spec.role.toUpperCase())}</text>` : ""}
    <rect x="410" y="42" width="42" height="42" rx="6" transform="rotate(45 431 63)" fill="url(#frame)" stroke="#fff" stroke-opacity=".35" stroke-width="3"/>
    <text x="40" y="574" font-family="${SERIF}" font-weight="700" font-size="54">${esc(spec.character)}</text>
    <text x="40" y="606" font-weight="500" font-size="20" letter-spacing="3" fill="${look.ink}">${esc(spec.title.toUpperCase())}</text>
    <rect x="40" y="622" width="420" height="3" rx="1.5" fill="url(#frame)"/>
    <text x="40" y="656" font-weight="500" font-size="16" letter-spacing="2" fill="#a1a1b5">${esc(TIER_LABEL[spec.tier].toUpperCase())}</text>
    <text x="460" y="656" text-anchor="end" font-weight="500" font-size="16" letter-spacing="2" fill="#a1a1b5">${footer}</text>
  </g>
</svg>`;
}

export const svgToFile = (svg: string, name: string) =>
  new File([svg], `${name.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "card"}.svg`, { type: "image/svg+xml" });
