import { createVar, globalStyle, keyframes, style } from "@vanilla-extract/css";
import { foilShift, pulse, sweep, vars } from "../styles/theme.css";

export const frameVar = createVar();
export const glowVar = createVar();
export const inkVar = createVar();

/** Root: sized by its parent; everything inside scales with the card width (cqw). */
export const root = style({
  position: "relative",
  width: "100%",
  aspectRatio: "5 / 7",
  containerType: "inline-size",
  transform: "perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
  transformStyle: "preserve-3d",
  transition: "transform .2s ease-out, filter .3s ease",
  filter: "drop-shadow(0 14px 24px rgba(0,0,0,.55))",
  willChange: "transform",
  textAlign: "left",
  color: vars.color.text,
  selectors: {
    "&:hover": { filter: `drop-shadow(0 20px 30px rgba(0,0,0,.6)) drop-shadow(0 0 18px color-mix(in srgb, ${glowVar} 45%, transparent))` },
  },
});
export const clickable = style({ cursor: "pointer", border: 0, padding: 0, background: "none", display: "block", font: "inherit" });

/** Metallic tier frame (cqw resolves against the root, which is the size container). */
export const frame = style({
  position: "absolute",
  inset: 0,
  borderRadius: "6cqw",
  background: frameVar,
  boxShadow: "inset 0 0 0 0.6cqw rgba(255,255,255,.18)",
});
export const frameUltra = style({ backgroundSize: "300% 300%", animation: `${foilShift} 4s linear infinite alternate` });
/** Ultra Legendary: a soft aurora halo pulsing behind the card. */
export const aura = style({
  position: "absolute",
  inset: "-3%",
  borderRadius: "9cqw",
  background: "conic-gradient(from 0deg, #6e45e2, #ff5fb8, #ffd36b, #88d3ce, #5aa8ff, #6e45e2)",
  filter: "blur(5cqw)",
  opacity: 0.55,
  animation: `${pulse} 3s ease-in-out infinite`,
  zIndex: -1,
});
/** Base cards are matte: the art is a little washed out. */
export const faceBase = style({ filter: "saturate(.55) brightness(.92)" });

export const face = style({
  position: "relative",
  width: "100%",
  height: "100%",
  borderRadius: "4cqw",
  overflow: "hidden",
  background: vars.color.bg,
  isolation: "isolate",
});

export const art = style({ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" });
/** Official art: fills the card, anchored to the top so faces stay visible. */
export const photo = style({ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 12%", display: "block" });
/** Our own landscape banner, zoomed onto the character (left/top/width set inline per card). */
export const photoBanner = style({ position: "absolute", height: "auto", maxWidth: "none", display: "block" });
/** Game logo: the logo plate of our banner art, shown through a small window. */
export const logo = style({
  justifySelf: "start",
  display: "block",
  height: "7cqw",
  width: "auto",
  maxWidth: "44cqw",
  objectFit: "contain",
  objectPosition: "left center",
  filter: "brightness(0) invert(1) drop-shadow(0 0.6cqw 1.6cqw rgba(0,0,0,.8))",
  opacity: 0.92,
  marginBottom: "1cqw",
});
export const logoText = style({
  justifySelf: "start",
  padding: "0.6cqw 2.4cqw",
  borderRadius: "1.6cqw",
  background: "rgba(10,10,18,.7)",
  border: "0.3cqw solid rgba(201,187,255,.45)",
  fontFamily: vars.font.logo,
  fontWeight: 700,
  fontSize: "3.6cqw",
  letterSpacing: "0.06em",
  color: "#e6dcb0",
  marginBottom: "1cqw",
});
export const artFade = style({
  position: "absolute",
  inset: 0,
  background: "linear-gradient(180deg, rgba(10,10,18,.45) 0%, transparent 18%, transparent 40%, rgba(10,10,18,.88) 60%, #0a0a12 100%)",
});

// ---- top-left rating block
export const rating = style({ position: "absolute", top: "5cqw", left: "6cqw", display: "grid", justifyItems: "center", lineHeight: 1, zIndex: 2 });
export const power = style({ fontFamily: vars.font.display, fontWeight: 700, fontSize: "13cqw", letterSpacing: "-0.02em", color: inkVar, textShadow: "0 1cqw 3cqw rgba(0,0,0,.6)" });
export const ovr = style({ fontFamily: vars.font.display, fontWeight: 600, fontSize: "3.2cqw", letterSpacing: "0.14em", color: inkVar, opacity: 0.9, marginTop: "-0.4cqw" });
/** FUT-style skills grid: 3 columns × 2 rows. */
export const skills = style({ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.6cqw 2cqw", margin: "0.4cqw 0 1cqw" });
export const skill = style({ fontFamily: vars.font.display, fontWeight: 500, fontSize: "3.3cqw", letterSpacing: "0.05em", color: vars.color.textDim, whiteSpace: "nowrap" });
export const skillValue = style({ fontWeight: 700, fontSize: "4.2cqw", color: vars.color.text, marginRight: "0.4cqw" });
export const code = style({ fontFamily: vars.font.display, fontWeight: 600, fontSize: "4.4cqw", letterSpacing: "0.1em", marginTop: "1.2cqw", color: vars.color.text });
export const roleText = style({ fontFamily: vars.font.display, fontWeight: 400, fontSize: "3.2cqw", letterSpacing: "0.06em", textTransform: "uppercase", color: vars.color.textDim, marginTop: "0.8cqw" });

// ---- tier gem (top right)
export const gem = style({
  position: "absolute",
  top: "7cqw",
  right: "7cqw",
  width: "8.5cqw",
  height: "8.5cqw",
  transform: "rotate(45deg)",
  borderRadius: "1.2cqw",
  background: frameVar,
  boxShadow: `0 0 3cqw color-mix(in srgb, ${glowVar} 60%, transparent), inset 0 0 0 0.6cqw rgba(255,255,255,.35)`,
  zIndex: 2,
});

/** Tier name plaque, top centre. */
export const tierTag = style({
  position: "absolute",
  top: "4.6cqw",
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 2,
  padding: "0.7cqw 2.6cqw",
  borderRadius: "10cqw",
  background: frameVar,
  color: "#0d0d18",
  fontFamily: vars.font.display,
  fontWeight: 700,
  fontSize: "2.8cqw",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
  boxShadow: `0 0 2.4cqw color-mix(in srgb, ${glowVar} 45%, transparent), inset 0 0 0 0.3cqw rgba(255,255,255,.4)`,
});

// ---- bottom name plate
export const plate = style({ position: "absolute", left: 0, right: 0, bottom: 0, padding: "0 6.5cqw 5.5cqw", display: "grid", gap: "1cqw", zIndex: 2 });
export const character = style({
  fontFamily: vars.font.logo,
  fontWeight: 700,
  fontSize: "11cqw",
  lineHeight: 1.05,
  textShadow: "0 1cqw 3cqw rgba(0,0,0,.7)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});
export const characterMid = style({ fontSize: "9cqw" });
export const characterLong = style({ fontSize: "7.4cqw" });
export const title = style({ fontFamily: vars.font.display, fontWeight: 500, fontSize: "4.2cqw", letterSpacing: "0.1em", textTransform: "uppercase", color: inkVar, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" });
export const divider = style({ height: "0.5cqw", borderRadius: "1cqw", background: frameVar, margin: "1.2cqw 0 0.8cqw", opacity: 0.85 });
export const stats = style({
  display: "flex",
  justifyContent: "space-between",
  gap: "2cqw",
  fontFamily: vars.font.display,
  fontWeight: 500,
  fontSize: "3.2cqw",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: vars.color.textDim,
  whiteSpace: "nowrap",
});
export const statCut = style({ overflow: "hidden", textOverflow: "ellipsis" });

// ---- light
/** Pointer-following glare. */
export const glare = style({
  position: "absolute",
  inset: 0,
  zIndex: 3,
  pointerEvents: "none",
  background: "radial-gradient(circle at var(--gx, 50%) var(--gy, 30%), rgba(255,255,255,.22), transparent 45%)",
  mixBlendMode: "overlay",
  opacity: 0,
  transition: "opacity .3s ease",
});
globalStyle(`${root}:hover ${glare}`, { opacity: 1 });

/** Soft light sweep (gold and above). */
export const sheen = style({
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  width: "40%",
  zIndex: 3,
  pointerEvents: "none",
  background: "linear-gradient(90deg, transparent, rgba(185,166,255,.16), rgba(136,211,206,.14), transparent)",
  animation: `${sweep} 6s ease-in-out infinite`,
});

const twinkle = keyframes({ "0%, 100%": { opacity: 0.25 }, "50%": { opacity: 0.95 } });
/** Platinum and above: little sparkles across the card. */
export const sparkles = style({
  position: "absolute",
  inset: 0,
  zIndex: 3,
  pointerEvents: "none",
  backgroundImage: [
    "radial-gradient(circle, rgba(255,255,255,.95) 0 0.5cqw, transparent 0.9cqw)",
    "radial-gradient(circle, rgba(255,255,255,.8) 0 0.4cqw, transparent 0.8cqw)",
    "radial-gradient(circle, rgba(255,255,255,.9) 0 0.35cqw, transparent 0.7cqw)",
  ].join(", "),
  backgroundSize: "37cqw 41cqw, 29cqw 33cqw, 23cqw 27cqw",
  backgroundPosition: "4cqw 7cqw, 17cqw 22cqw, 9cqw 14cqw",
  mixBlendMode: "screen",
  animation: `${twinkle} 2.6s ease-in-out infinite`,
});
/** Diamond and above: holographic foil that shifts with the pointer. */
export const foil = style({
  position: "absolute",
  inset: 0,
  zIndex: 3,
  pointerEvents: "none",
  background:
    "repeating-linear-gradient(115deg, rgba(255,95,184,0) 0%, rgba(255,95,184,.22) 7%, rgba(255,211,107,.2) 14%, rgba(136,211,206,.22) 21%, rgba(90,168,255,.22) 28%, rgba(180,140,255,.22) 35%, rgba(255,95,184,0) 42%)",
  backgroundSize: "250% 250%",
  backgroundPosition: "var(--gx, 50%) var(--gy, 50%)",
  mixBlendMode: "color-dodge",
  opacity: 0.3,
  transition: "opacity .3s ease",
});
globalStyle(`${root}:hover ${foil}`, { opacity: 0.6 });

export const badge = style({ position: "absolute", top: "22cqw", right: "4.5cqw", zIndex: 4 });
