import { style } from "@vanilla-extract/css";
import { gradient, vars } from "../styles/theme.css";

export const img = style({ width: "100%", height: "100%", objectFit: "cover", display: "block" });
export const artFallback = style({ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center", padding: "1rem", color: vars.color.textMute, fontSize: "13px" });

export const owned = style({
  display: "inline-block",
  padding: "4px 10px",
  borderRadius: vars.radius.pill,
  background: vars.color.accent,
  color: "#fff",
  fontSize: "12px",
  fontWeight: 600,
  boxShadow: "0 4px 12px rgba(0,0,0,.4)",
});

/** Minted image shown as a card (currentColor = tier colour). */
export const minted = style({
  position: "relative",
  display: "block",
  width: "100%",
  aspectRatio: "5 / 7",
  padding: 0,
  border: "2px solid currentColor",
  borderRadius: "18px",
  overflow: "hidden",
  background: "#0b0b14",
  cursor: "pointer",
  transform: "perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
  transition: "transform .2s ease-out, box-shadow .25s ease",
  boxShadow: "0 18px 40px -16px rgba(0,0,0,.8)",
  selectors: { "&:hover": { boxShadow: "0 0 30px -4px currentColor, 0 24px 44px -14px rgba(0,0,0,.85)" } },
});
export const mintedGlare = style({
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  background: "radial-gradient(circle at var(--gx, 50%) var(--gy, 30%), rgba(255,255,255,.3), transparent 45%)",
  mixBlendMode: "overlay",
});

// ---- detail dialog
export const dialog = style({
  width: "min(940px, calc(100vw - 32px))",
  maxHeight: "calc(100vh - 48px)",
  padding: 0,
  border: `1px solid ${vars.color.lineHi}`,
  borderRadius: vars.radius.lg,
  background: "linear-gradient(160deg, #15132a, #0a0a12 60%)",
  color: vars.color.text,
  overflow: "auto",
  boxShadow: "0 40px 100px rgba(0,0,0,.75)",
  selectors: { "&::backdrop": { background: "rgba(4, 4, 10, 0.8)", backdropFilter: "blur(6px)" } },
});
export const dialogGrid = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.1fr)",
  "@media": { "screen and (max-width: 720px)": { gridTemplateColumns: "1fr" } },
});
export const dialogArt = style({
  display: "grid",
  placeItems: "center",
  padding: "2rem",
  background: "radial-gradient(circle at 50% 40%, rgba(124,58,237,.35), transparent 70%)",
});
export const dialogCard = style({ width: "min(320px, 100%)" });
export const dialogBody = style({ padding: "2rem 1.8rem", display: "grid", gap: "1rem", alignContent: "start" });
export const dialogTitle = style({ fontFamily: vars.font.logo, fontWeight: 700, fontSize: "clamp(1.8rem, 4vw, 2.4rem)" });
export const facts = style({ display: "grid", gridTemplateColumns: "auto 1fr", gap: "0.55rem 1.2rem", margin: 0, fontSize: "14px" });
export const factKey = style({ color: vars.color.textMute });
export const factVal = style({ margin: 0, minWidth: 0, overflowWrap: "anywhere" });
export const lore = style({
  margin: 0,
  padding: "0.8rem 1rem",
  borderLeft: "3px solid transparent",
  borderImage: `${gradient.brand} 1`,
  background: vars.color.panel,
  color: vars.color.textDim,
  fontStyle: "italic",
});
export const close = style({ position: "absolute", top: "14px", right: "14px", zIndex: 2 });
export const giftBox = style({ borderTop: `1px solid ${vars.color.line}`, paddingTop: "1rem" });
