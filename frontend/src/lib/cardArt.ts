/**
 * Card art drawn entirely in code: no images are loaded from anywhere.
 *
 * Every character gets its own portrait, seeded from its id, so the same character always looks the
 * same while no two characters share a look: palette pair, background pattern, silhouette, headgear,
 * eyes, genre motif and particles all vary. Colours stay inside the Muse palette (violet, deep indigo,
 * teal, lavender, navy).
 */

export const ART_W = 460;
export const ART_H = 660;

function rng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}
const pickOf = <T,>(r: () => number, list: readonly T[]): T => list[Math.floor(r() * list.length)]!;

/** Muse-palette pairs: [light, glow, deep]. */
const PALETTES = [
  ["#88d3ce", "#6e45e2", "#1b1440"],
  ["#b9a6ff", "#4a2dbf", "#130f2e"],
  ["#88d3ce", "#4a2dbf", "#0f1a2a"],
  ["#c9bbff", "#6e45e2", "#1a1035"],
  ["#a8e6e2", "#5b3cc4", "#121a30"],
  ["#d6ccff", "#3f6f8f", "#0f1726"],
  ["#88d3ce", "#8f6cf2", "#1d1235"],
] as const;

const PATTERNS = ["rings", "hex", "stars", "waves", "grid", "slashes"] as const;
const HEADGEAR = ["hood", "helmet", "spikes", "long", "twin", "cap", "mask", "horns", "phones", "crown", "bob", "beanie"] as const;
const GEAR = ["scarf", "collar", "pads", "none"] as const;

/**
 * Catalog characters get headgear by position in this list, so no two of them share a silhouette.
 * Anything else (Studio cards, older tokens) picks from the seed.
 */
const ASSIGNED: Record<string, (typeof HEADGEAR)[number]> = {
  sage: "long", jett: "spikes", reyna: "hood", victor: "helmet", sara: "bob", "victor-conqueror": "crown",
  nikki: "twin", jonesy: "cap", jinx: "horns", vi: "phones", ava: "beanie", "ct-operator": "mask",
  striker: "bob", keeper: "cap", scorpion: "mask", "sub-zero": "hood",
};
const EYES = ["slit", "round", "visor", "single"] as const;

export interface Portrait {
  /** Inner SVG markup in a 460×660 box (ids prefixed so it can be embedded in another SVG). */
  markup: string;
  /** Accent colour used, for matching UI touches. */
  accent: string;
}

function pattern(kind: (typeof PATTERNS)[number], r: () => number, c: string): string {
  const parts: string[] = [];
  const o = (a: number) => a.toFixed(2);
  switch (kind) {
    case "rings":
      for (let i = 1; i <= 7; i++) parts.push(`<circle cx="230" cy="250" r="${i * 46}" fill="none" stroke="${c}" stroke-opacity="${o(0.16 - i * 0.015)}" stroke-width="${i % 2 ? 1.5 : 1}"/>`);
      break;
    case "hex":
      for (let y = -20; y < 700; y += 52)
        for (let x = (y / 52) % 2 ? 30 : 0; x < 500; x += 60)
          parts.push(`<path d="M${x} ${y} l15 -26 h30 l15 26 l-15 26 h-30z" fill="none" stroke="${c}" stroke-opacity="${o(0.05 + r() * 0.09)}"/>`);
      break;
    case "stars": {
      const pts = Array.from({ length: 26 }, () => [r() * 460, r() * 460] as const);
      pts.forEach(([x, y], i) => {
        parts.push(`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(1 + r() * 1.8).toFixed(1)}" fill="${c}" fill-opacity="${o(0.3 + r() * 0.5)}"/>`);
        const n = pts[(i + 3) % pts.length]!;
        if (i % 3 === 0) parts.push(`<path d="M${x.toFixed(0)} ${y.toFixed(0)} L${n[0].toFixed(0)} ${n[1].toFixed(0)}" stroke="${c}" stroke-opacity=".12"/>`);
      });
      break;
    }
    case "waves":
      for (let i = 0; i < 9; i++) {
        const y = 60 + i * 52;
        const a = 14 + r() * 18;
        parts.push(`<path d="M-10 ${y} C 110 ${y - a}, 200 ${y + a}, 320 ${y} S 470 ${y - a}, 480 ${y}" fill="none" stroke="${c}" stroke-opacity="${o(0.07 + r() * 0.08)}" stroke-width="1.5"/>`);
      }
      break;
    case "grid":
      for (let x = 0; x <= 460; x += 38) parts.push(`<path d="M${x} 0 V660" stroke="${c}" stroke-opacity=".07"/>`);
      for (let y = 0; y <= 660; y += 38) parts.push(`<path d="M0 ${y} H460" stroke="${c}" stroke-opacity=".07"/>`);
      break;
    case "slashes":
      for (let i = -6; i < 14; i++) parts.push(`<path d="M${i * 46} 0 L${i * 46 + 260} 660" stroke="${c}" stroke-opacity="${o(0.04 + r() * 0.08)}" stroke-width="${(1 + r() * 6).toFixed(1)}"/>`);
      break;
  }
  return parts.join("");
}

/** A line-art motif behind the character, one per genre. */
function motif(genre: string | undefined, c: string): string {
  const s = `fill="none" stroke="${c}" stroke-opacity=".35" stroke-width="3"`;
  switch (genre) {
    case "tactical":
      return `<g ${s}><circle cx="230" cy="230" r="130"/><circle cx="230" cy="230" r="70" stroke-opacity=".22"/><path d="M230 70v90M230 300v90M70 230h90M300 230h90"/></g>`;
    case "royale":
      return `<g ${s}><path d="M110 210 Q230 70 350 210" /><path d="M110 210 L230 330 L350 210 M170 172 L230 330 L290 172"/><circle cx="230" cy="250" r="190" stroke-dasharray="10 12" stroke-opacity=".2"/></g>`;
    case "moba":
      return `<g ${s}><path d="M230 70 L320 230 L230 390 L140 230 Z"/><path d="M230 120 L285 230 L230 340 L175 230 Z" stroke-opacity=".22"/></g>`;
    case "sports":
      return `<g ${s}><circle cx="230" cy="230" r="140"/><path d="M230 160 l60 44 -23 70 h-74 l-23 -70 z"/><path d="M230 90v70M357 186l-67 18M103 186l67 18M314 343l-47 -69M146 343l47 -69" stroke-opacity=".25"/></g>`;
    case "fighting":
      return `<g ${s}><path d="M90 380 L360 90"/><path d="M120 400 L390 110" stroke-opacity=".2"/><path d="M370 380 L100 90" stroke-opacity=".28"/></g>`;
    default:
      return `<g ${s}><path d="M230 90 L360 230 L230 370 L100 230 Z" stroke-opacity=".25"/></g>`;
  }
}

function headgear(kind: (typeof HEADGEAR)[number], fill: string, rim: string, accent: string): string {
  const rimS = `stroke="${rim}" stroke-width="3"`;
  switch (kind) {
    case "hood":
      return `<path d="M130 330 C120 210 170 140 230 140 C290 140 340 210 330 330 C300 290 280 270 230 270 C180 270 160 290 130 330 Z" fill="${fill}" ${rimS}/>`;
    case "helmet":
      return `<path d="M150 285 C150 200 185 160 230 160 C275 160 310 200 310 285 Z" fill="${fill}" ${rimS}/><path d="M162 262 H298" stroke="${accent}" stroke-width="4" stroke-opacity=".8"/><path d="M230 160 V120" stroke="${rim}" stroke-width="4"/><circle cx="230" cy="114" r="7" fill="${accent}"/>`;
    case "spikes":
      return `<path d="M160 250 L150 170 L185 205 L195 140 L222 195 L240 125 L255 195 L285 145 L285 205 L320 172 L305 255 Z" fill="${fill}" ${rimS}/>`;
    case "long":
      return `<path d="M150 250 C140 170 185 150 230 150 C275 150 320 170 310 250 L330 420 L290 400 L285 280 L175 280 L170 400 L130 420 Z" fill="${fill}" ${rimS}/>`;
    case "twin":
      return `<path d="M160 240 C155 175 190 152 230 152 C270 152 305 175 300 240 Z" fill="${fill}" ${rimS}/><path d="M162 220 C110 260 100 360 120 470 C140 400 150 330 172 268 Z" fill="${fill}" ${rimS}/><path d="M298 220 C350 260 360 360 340 470 C320 400 310 330 288 268 Z" fill="${fill}" ${rimS}/>`;
    case "cap":
      return `<path d="M158 238 C158 180 192 160 230 160 C268 160 302 180 302 238 Z" fill="${fill}" ${rimS}/><path d="M150 236 H330 C330 248 320 254 300 254 H150 Z" fill="${fill}" ${rimS}/>`;
    case "mask":
      return `<path d="M168 250 C168 190 198 168 230 168 C262 168 292 190 292 250 Z" fill="${fill}" ${rimS}/><path d="M168 280 H292 V318 C270 334 190 334 168 318 Z" fill="${fill}" stroke="${accent}" stroke-opacity=".7" stroke-width="3"/>`;
    case "horns":
      return `<path d="M165 240 C150 200 170 160 230 160 C290 160 310 200 295 240 Z" fill="${fill}" ${rimS}/><path d="M178 200 C150 160 140 120 160 90 C168 130 185 160 205 178 Z" fill="${fill}" ${rimS}/><path d="M282 200 C310 160 320 120 300 90 C292 130 275 160 255 178 Z" fill="${fill}" ${rimS}/>`;
    case "phones":
      return `<path d="M160 250 C160 185 192 160 230 160 C268 160 300 185 300 250 Z" fill="${fill}" ${rimS}/><path d="M152 270 C152 170 308 170 308 270" fill="none" stroke="${rim}" stroke-width="7"/><rect x="138" y="252" width="24" height="46" rx="10" fill="${fill}" stroke="${accent}" stroke-width="3"/><rect x="298" y="252" width="24" height="46" rx="10" fill="${fill}" stroke="${accent}" stroke-width="3"/>`;
    case "crown":
      return `<path d="M162 248 C162 190 195 168 230 168 C265 168 298 190 298 248 Z" fill="${fill}" ${rimS}/><path d="M176 186 L186 130 L208 162 L230 116 L252 162 L274 130 L284 186 Z" fill="${fill}" stroke="${accent}" stroke-width="3"/><circle cx="230" cy="116" r="6" fill="${accent}"/>`;
    case "bob":
      return `<path d="M152 300 C140 200 180 156 230 156 C280 156 320 200 308 300 C296 280 290 250 280 230 C250 236 210 236 180 230 C170 250 164 280 152 300 Z" fill="${fill}" ${rimS}/>`;
    case "beanie":
      return `<path d="M160 236 C160 176 194 150 230 150 C266 150 300 176 300 236 Z" fill="${fill}" ${rimS}/><rect x="154" y="226" width="152" height="22" rx="8" fill="${fill}" stroke="${accent}" stroke-opacity=".8" stroke-width="3"/><circle cx="230" cy="146" r="12" fill="${fill}" ${rimS}/>`;
  }
}

function eyes(kind: (typeof EYES)[number], c: string): string {
  const glow = `fill="${c}" filter="url(#a-glow)"`;
  switch (kind) {
    case "slit":
      return `<path d="M188 266 L218 262 L216 270 Z" ${glow}/><path d="M272 266 L242 262 L244 270 Z" ${glow}/>`;
    case "round":
      return `<circle cx="204" cy="266" r="7" ${glow}/><circle cx="256" cy="266" r="7" ${glow}/>`;
    case "visor":
      return `<rect x="180" y="258" width="100" height="14" rx="7" ${glow}/>`;
    case "single":
      return `<circle cx="230" cy="264" r="11" ${glow}/><circle cx="230" cy="264" r="20" fill="none" stroke="${c}" stroke-opacity=".5" stroke-width="2"/>`;
  }
}

/** Portrait for a character. `power` (0..5) adds a little extra light for higher tiers. */
function accessory(kind: (typeof GEAR)[number], sw: number, light: string, glow: string): string {
  switch (kind) {
    case "scarf":
      return `<path d="M${230 - sw / 2} 432 Q230 470 ${230 + sw / 2} 432 L${230 + sw / 2 - 6} 452 Q230 492 ${230 - sw / 2 + 6} 452 Z" fill="${glow}" fill-opacity=".75"/><path d="M${230 + 30} 470 L${230 + 46} 560 L${230 + 14} 552 Z" fill="${glow}" fill-opacity=".6"/>`;
    case "collar":
      return `<path d="M185 420 L230 470 L275 420" fill="none" stroke="${light}" stroke-opacity=".75" stroke-width="5"/>`;
    case "pads":
      return `<path d="M${230 - sw} 520 C${230 - sw} 470 ${230 - sw + 50} 452 ${230 - sw + 90} 462 L${230 - sw + 70} 520 Z" fill="url(#a-body)" stroke="${light}" stroke-opacity=".7" stroke-width="3"/><path d="M${230 + sw} 520 C${230 + sw} 470 ${230 + sw - 50} 452 ${230 + sw - 90} 462 L${230 + sw - 70} 520 Z" fill="url(#a-body)" stroke="${light}" stroke-opacity=".7" stroke-width="3"/>`;
    case "none":
      return "";
  }
}

/** `bare` draws only the backdrop (no silhouette), for cards that show a character photo on top. */
export function portrait(seed: string, genre?: string, power = 0, bare = false): Portrait {
  const r = rng(seed);
  const [light, glow, deep] = pickOf(r, PALETTES);
  const pat = pickOf(r, PATTERNS);
  const gear = ASSIGNED[seed] ?? pickOf(r, HEADGEAR);
  const eye = pickOf(r, EYES);
  const extra = pickOf(r, GEAR);
  const lean = ((r() - 0.5) * 8).toFixed(1);
  const shift = Math.round((r() - 0.5) * 50);
  const headRx = 64 + Math.round(r() * 14);
  const headRy = 80 + Math.round(r() * 14);
  const shoulderW = 135 + Math.round(r() * 50);
  const fill = "url(#a-body)";
  const particles = Array.from({ length: 6 + power * 4 }, () => {
    const x = (r() * 460).toFixed(0);
    const y = (60 + r() * 420).toFixed(0);
    const sz = (1.5 + r() * 2.5).toFixed(1);
    return `<rect x="${x}" y="${y}" width="${sz}" height="${sz}" transform="rotate(45 ${x} ${y})" fill="${light}" fill-opacity="${(0.35 + r() * 0.5).toFixed(2)}"/>`;
  }).join("");

  const markup = `<defs>
    <radialGradient id="a-bg" cx=".5" cy=".38" r=".75"><stop offset="0" stop-color="${glow}" stop-opacity=".55"/><stop offset=".55" stop-color="${deep}"/><stop offset="1" stop-color="#0a0a12"/></radialGradient>
    <linearGradient id="a-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2350"/><stop offset="1" stop-color="#0d0c1c"/></linearGradient>
    <radialGradient id="a-halo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${light}" stop-opacity=".45"/><stop offset="1" stop-color="${light}" stop-opacity="0"/></radialGradient>
    <filter id="a-glow" x="-1" y="-1" width="3" height="3"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="${ART_W}" height="${ART_H}" fill="url(#a-bg)"/>
  ${pattern(pat, r, light)}
  ${motif(genre, light)}
  <circle cx="230" cy="250" r="${170 + power * 8}" fill="url(#a-halo)"/>
  ${particles}
  ${bare ? "" : `<g transform="translate(${shift} 0) rotate(${lean} 230 400)">
    <path d="M${230 - shoulderW} 660 C${230 - shoulderW} 470 ${230 - shoulderW / 2} 410 230 410 C${230 + shoulderW / 2} 410 ${230 + shoulderW} 470 ${230 + shoulderW} 660 Z" fill="${fill}" stroke="${light}" stroke-opacity=".55" stroke-width="3"/>
    <path d="M205 360 H255 V420 H205 Z" fill="${fill}"/>
    <ellipse cx="230" cy="275" rx="${headRx}" ry="${headRy}" fill="${fill}" stroke="${light}" stroke-opacity=".6" stroke-width="3"/>
    ${headgear(gear, fill, light, light)}
    ${eyes(eye, light)}
    <path d="M${230 - shoulderW + 40} 520 Q230 470 ${230 + shoulderW - 40} 520" fill="none" stroke="${glow}" stroke-opacity=".7" stroke-width="4"/>
    ${accessory(extra, shoulderW, light, glow)}
  </g>`}`;
  return { markup, accent: light };
}

/** Standalone portrait SVG (for <img>). */
export const portraitSvg = (seed: string, genre?: string, power = 0, bare = false) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ART_W} ${ART_H}" preserveAspectRatio="xMidYMid slice">${portrait(seed, genre, power, bare).markup}</svg>`;

/** Game cover: the game's monogram over a seeded pattern, in the same palette. */
export function coverSvg(seed: string, title: string, genre?: string): string {
  const r = rng(`cover:${seed}`);
  const [light, glow, deep] = pickOf(r, PALETTES);
  const pat = pickOf(r, PATTERNS);
  const right = r() > 0.5;
  const tilt = Math.round((r() - 0.5) * 30);
  const mx = right ? 20 : 170;
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 288" preserveAspectRatio="xMidYMid slice">
  <defs><radialGradient id="c-bg" cx=".7" cy=".3" r=".9"><stop offset="0" stop-color="${glow}" stop-opacity=".7"/><stop offset=".6" stop-color="${deep}"/><stop offset="1" stop-color="#0a0a12"/></radialGradient></defs>
  <rect width="460" height="288" fill="url(#c-bg)"/>
  <g transform="scale(1 .44)">${pattern(pat, r, light)}</g>
  <g transform="translate(${mx} -40) rotate(${tilt} 230 230) scale(.7)">${motif(genre, light)}</g>
  <text x="${right ? 426 : 34}" y="244" text-anchor="${right ? "end" : "start"}" font-family="'Playfair Display', Georgia, serif" font-weight="700" font-size="96" fill="${light}" fill-opacity=".9">${esc(title)}</text>
</svg>`;
}

export const svgDataUrl = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
