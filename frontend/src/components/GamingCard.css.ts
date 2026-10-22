import { createVar, globalStyle, style } from "@vanilla-extract/css";
import { foilShift, sweep, vars } from "../styles/theme.css";

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
  padding: "2.6cqw",
  borderRadius: "6cqw",
  background: frameVar,
  boxShadow: "inset 0 0 0 0.6cqw rgba(255,255,255,.18)",
});
export const frameUltra = style({ backgroundSize: "260% 260%", animation: `${foilShift} 6s ease-in-out infinite alternate` });

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
  width: "46cqw",
  height: "9.5cqw",
  borderRadius: "1.6cqw",
  backgroundSize: "112% auto",
  backgroundPosition: "50% 84%",
  backgroundRepeat: "no-repeat",
  boxShadow: "0 0.8cqw 2.4cqw rgba(0,0,0,.5)",
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
  background: "linear-gradient(180deg, rgba(10,10,18,.45) 0%, transparent 20%, transparent 50%, rgba(10,10,18,.9) 72%, #0a0a12 100%)",
});

// ---- top-left rating block
export const rating = style({ position: "absolute", top: "5cqw", left: "6cqw", display: "grid", justifyItems: "center", lineHeight: 1, zIndex: 2 });
export const power = style({ fontFamily: vars.font.display, fontWeight: 700, fontSize: "13cqw", letterSpacing: "-0.02em", color: inkVar, textShadow: "0 1cqw 3cqw rgba(0,0,0,.6)" });
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

/** Soft violet–teal sweep (gold and above). */
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

export const badge = style({ position: "absolute", top: "22cqw", right: "4.5cqw", zIndex: 4 });
