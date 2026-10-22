import { globalStyle, style, styleVariants } from "@vanilla-extract/css";
import type { Tier } from "../lib/metadata";
import { TIER_LOOK } from "../lib/tiers";
import { gradient, shimmer, spin, vars } from "./theme.css";

export const mobile = "screen and (max-width: 768px)";

export const container = style({
  width: "100%",
  maxWidth: "1280px",
  margin: "0 auto",
  padding: "0 3rem",
  "@media": { [mobile]: { padding: "0 1rem" } },
});

export const section = style({ padding: "5rem 0", "@media": { [mobile]: { padding: "3.2rem 0" } } });

/** Centred heading block, as in the original Muse sections. */
export const sectionHeader = style({ display: "grid", justifyItems: "center", textAlign: "center", gap: "0.8rem", maxWidth: "800px", margin: "0 auto 3rem" });
export const kicker = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  fontSize: "13px",
  fontWeight: 500,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: vars.color.teal,
});
export const sectionTitle = style({
  fontSize: "clamp(1.9rem, 4vw, 2.5rem)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.8rem",
});
export const underline = style({ width: "64px", height: "3px", borderRadius: "3px", background: gradient.brand });
export const sectionLead = style({ color: vars.color.textDim });

export const gradientText = style({
  background: gradient.brand,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
});

export const dim = style({ color: vars.color.textDim });
export const mono = style({ fontFamily: vars.font.mono, fontSize: "13px" });
export const icon = style({ width: "1.1em", height: "1.1em", flex: "none" });

// ---- pill buttons with the violet glow
const buttonBase = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  border: "none",
  borderRadius: vars.radius.pill,
  padding: "0.9rem 1.9rem",
  fontWeight: 500,
  fontSize: "1.05rem",
  cursor: "pointer",
  textDecoration: "none",
  whiteSpace: "nowrap",
  transition: "all .3s ease",
  selectors: { "&:disabled": { opacity: 0.5, cursor: "not-allowed" } },
});

export const button = styleVariants({
  primary: [
    buttonBase,
    {
      background: gradient.primary,
      color: "#fff",
      boxShadow: vars.shadow.glow,
      selectors: { "&:hover:not(:disabled)": { transform: "translateY(-3px)", boxShadow: vars.shadow.violet } },
    },
  ],
  secondary: [
    buttonBase,
    {
      background: "transparent",
      color: vars.color.accentHi,
      border: `1px solid ${vars.color.accent}`,
      selectors: { "&:hover:not(:disabled)": { background: "rgba(110, 69, 226, 0.12)", transform: "translateY(-3px)" } },
    },
  ],
  soft: [
    buttonBase,
    {
      background: vars.color.panelHi,
      color: vars.color.text,
      selectors: { "&:hover:not(:disabled)": { background: "rgba(255, 255, 255, 0.16)" } },
    },
  ],
});

export const buttonSm = style({ padding: "0.5rem 1.1rem", fontSize: "0.9rem" });
export const buttonBlock = style({ width: "100%" });

export const spinner = style({
  width: "15px",
  height: "15px",
  borderRadius: "50%",
  border: "2px solid currentColor",
  borderRightColor: "transparent",
  animation: `${spin} .7s linear infinite`,
  flex: "none",
});

// ---- frosted glass
export const glass = style({
  position: "relative",
  background: vars.color.panel,
  border: `1px solid ${vars.color.line}`,
  borderRadius: vars.radius.lg,
  boxShadow: vars.shadow.card,
  backdropFilter: "blur(10px)",
});

/** The original gallery block: a darker rounded panel. */
/** Card area: cards sit straight on the page, no panel behind them. */
export const gallery = style({ padding: "1rem 0" });

/** Cards keep one width; rows are centred so a short last row never hangs on the left. */
export const cardGrid = style({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "2.5rem 2rem",
  "@media": { [mobile]: { gap: "1.4rem 0.9rem" } },
});
globalStyle(`${cardGrid} > *`, {
  flex: "0 0 230px",
  minWidth: 0,
  "@media": { [mobile]: { flexBasis: "calc((100% - 0.9rem) / 2)" } },
});

export const skeleton = style({
  aspectRatio: "5 / 7",
  borderRadius: "16px",
  background: "linear-gradient(90deg, rgba(255,255,255,.04) 0, rgba(255,255,255,.09) 40%, rgba(255,255,255,.04) 80%)",
  backgroundSize: "800px 100%",
  animation: `${shimmer} 1.4s linear infinite`,
});

export const empty = style({
  gridColumn: "1 / -1",
  textAlign: "center",
  padding: "3rem 1.5rem",
  color: vars.color.textDim,
  display: "grid",
  justifyItems: "center",
  gap: "1rem",
});
export const emptyIcon = style({ width: "48px", height: "48px", opacity: 0.5 });

// ---- tiers
export const tierText = styleVariants(
  Object.fromEntries(Object.entries(TIER_LOOK).map(([t, look]) => [t, { color: look.glow }])) as Record<Tier, { color: string }>,
);

export const tierPill = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "3px 12px",
  borderRadius: vars.radius.pill,
  border: "1px solid currentColor",
  background: "rgba(0,0,0,.3)",
  fontSize: "12px",
  fontWeight: 600,
  letterSpacing: "0.04em",
});

export const tag = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "3px 12px",
  borderRadius: vars.radius.pill,
  background: vars.color.panelHi,
  color: vars.color.textDim,
  fontSize: "12px",
});

// ---- forms (as in the original upload form)
export const field = style({ display: "grid", gap: "0.5rem", marginBottom: "1.4rem" });
export const label = style({ display: "flex", alignItems: "center", gap: "0.5rem", color: vars.color.textDim, fontSize: "14px" });
export const input = style({
  width: "100%",
  padding: "0.95rem 1rem",
  background: vars.color.panel,
  border: `1px solid ${vars.color.line}`,
  borderRadius: vars.radius.sm,
  fontSize: "1rem",
  outline: "none",
  transition: "all .3s ease",
  selectors: { "&:focus": { borderColor: vars.color.accent, boxShadow: "0 0 0 3px rgba(110, 69, 226, 0.3)" } },
});
globalStyle(`${input}::placeholder`, { color: vars.color.textMute });
globalStyle(`select${input} option, select${input} optgroup`, { background: vars.color.bg, color: vars.color.text });
export const help = style({ fontSize: "12px", color: vars.color.textMute });
export const errorText = style({ fontSize: "14px", color: vars.color.bad });

export const row = style({ display: "flex", gap: "0.8rem", alignItems: "center", flexWrap: "wrap" });
export const spread = style([row, { justifyContent: "space-between" }]);
