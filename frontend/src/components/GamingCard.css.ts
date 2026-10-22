import { createVar, globalStyle, style } from "@vanilla-extract/css";
import { vars } from "../styles/theme.css";

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
    "&:hover": { filter: "drop-shadow(0 20px 30px rgba(0,0,0,.6))" },
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

export const face = style({
  position: "relative",
  width: "100%",
  height: "100%",
  borderRadius: "4cqw",
  overflow: "hidden",
  background: vars.color.bg,
  isolation: "isolate",
});

/** Generated backdrop: a different pattern and palette per character seed (rerolled in the Studio). */
export const art = style({ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" });
/** Official art: fills the card, anchored to the top so faces stay visible. */
export const photo = style({ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 12%", display: "block" });
/** Starts just under the rating row and is anchored at the top, so heads are never cut off. */
export const photoTop = style({ position: "absolute", left: 0, top: "7%", width: "100%", height: "93%", objectFit: "cover", objectPosition: "50% 0%", display: "block" });
/** Ultimate Team style: the player's cut-out portrait sits above the name plate on the card background. */
export const photoFut = style({ position: "absolute", top: "8%", left: "22%", width: "70%", height: "auto", display: "block", filter: "drop-shadow(0 1.5cqw 2cqw rgba(0,0,0,.55))" });
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
  boxShadow: "0 0.6cqw 1.6cqw rgba(0,0,0,.5), inset 0 0 0 0.6cqw rgba(255,255,255,.35)",
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
  boxShadow: "0 0.4cqw 1.2cqw rgba(0,0,0,.5), inset 0 0 0 0.3cqw rgba(255,255,255,.4)",
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



/** Engraved lines inside the frame: one for Bronze–Gold, two for Platinum–Diamond, three for Ultra. */
const engraved = { position: "absolute", zIndex: 3, pointerEvents: "none", border: `0.35cqw solid ${inkVar}`, opacity: 0.55 } as const;
export const line1 = style({ ...engraved, inset: "1.6cqw", borderRadius: "3cqw" });
export const line2 = style({ ...engraved, inset: "3cqw", borderRadius: "2.4cqw", opacity: 0.35 });
export const line3 = style({ ...engraved, inset: "0.6cqw", borderRadius: "3.6cqw", borderWidth: "0.6cqw", opacity: 0.8 });

export const badge = style({ position: "absolute", top: "22cqw", right: "4.5cqw", zIndex: 4 });
