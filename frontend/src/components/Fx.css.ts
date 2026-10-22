import { style, styleVariants } from "@vanilla-extract/css";
import { drift, float, gradient, pulse, pulseShadow, vars } from "../styles/theme.css";

// ---- background light (fixed, behind everything)
export const orbs = style({ position: "fixed", inset: 0, zIndex: -1, overflow: "hidden", pointerEvents: "none" });
const orbBase = style({ position: "absolute", borderRadius: "50%", filter: "blur(90px)", opacity: 0.35, willChange: "transform" });
export const orb = styleVariants({
  violet: [orbBase, { width: "520px", height: "520px", top: "-160px", right: "-120px", background: "#6e45e2", animation: `${drift} 22s ease-in-out infinite` }],
  teal: [orbBase, { width: "440px", height: "440px", bottom: "-160px", left: "-140px", background: "#88d3ce", opacity: 0.22, animation: `${drift} 26s ease-in-out -8s infinite` }],
  deep: [orbBase, { width: "380px", height: "380px", top: "40%", left: "45%", background: "#4a2dbf", opacity: 0.25, animation: `${drift} 30s ease-in-out -15s infinite` }],
});

// ---- hero: the original Muse floating card stack, now with gaming cards
export const art = style({
  position: "relative",
  width: "520px",
  height: "520px",
  flex: "none",
  "@media": {
    "screen and (max-width: 1100px)": { width: "440px", height: "460px" },
    "screen and (max-width: 520px)": { width: "330px", height: "360px" },
  },
});
const slotBase = style({ position: "absolute", width: "250px", "@media": { "screen and (max-width: 1100px)": { width: "210px" }, "screen and (max-width: 520px)": { width: "160px" } } });
export const slot = styleVariants({
  one: [slotBase, { top: "40px", left: "0", transform: "rotate(-6deg)", zIndex: 1 }],
  two: [slotBase, { top: "0", left: "27%", transform: "rotate(2deg)", zIndex: 3 }],
  three: [slotBase, { top: "60px", right: "0", transform: "rotate(8deg)", zIndex: 2 }],
});
export const floating = styleVariants({
  a: { animation: `${float} 6s ease-in-out infinite` },
  b: { animation: `${float} 6s ease-in-out -2s infinite` },
  c: { animation: `${float} 6s ease-in-out -4s infinite` },
});

// ---- welcome screen (the original login page)
export const welcome = style({
  position: "fixed",
  inset: 0,
  zIndex: 200,
  display: "grid",
  placeItems: "center",
  padding: "2rem",
  overflow: "auto",
  background: gradient.welcome,
});
export const welcomeInner = style({ textAlign: "center", maxWidth: "800px", display: "grid", justifyItems: "center" });
export const welcomeTitle = style({
  fontFamily: vars.font.logo,
  fontSize: "clamp(3.2rem, 10vw, 5rem)",
  fontWeight: 700,
  lineHeight: 1.1,
  marginBottom: "0.5rem",
  background: gradient.logo,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  textShadow: "0 0 20px rgba(110, 69, 226, 0.3)",
});
export const welcomeSub = style({ fontSize: "clamp(1.1rem, 3vw, 1.5rem)", color: vars.color.textDim, marginBottom: "2.5rem" });
export const dots = style({ display: "flex", gap: "1rem", justifyContent: "center", margin: "0 0 2rem" });
export const dot = style({
  width: "15px",
  height: "15px",
  borderRadius: "50%",
  background: vars.color.teal,
  animation: `${pulse} 2s ease-in-out infinite`,
  selectors: { "&:nth-child(2)": { animationDelay: ".3s" }, "&:nth-child(3)": { animationDelay: ".6s" } },
});
export const connect = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "1rem 2rem",
  borderRadius: vars.radius.pill,
  border: `2px solid ${vars.color.text}`,
  background: "transparent",
  color: vars.color.text,
  fontSize: "1.1rem",
  cursor: "pointer",
  animation: `${pulseShadow} 2s infinite`,
  transition: "all .3s ease",
  selectors: { "&:hover:not(:disabled)": { background: "rgba(255, 255, 255, 0.1)" } },
});
export const connectArrow = style({ transition: "transform .3s ease", selectors: { [`${connect}:hover &`]: { transform: "translateX(5px)" } } });
export const guest = style({
  marginTop: "1.4rem",
  background: "none",
  border: 0,
  color: vars.color.textDim,
  cursor: "pointer",
  textDecoration: "underline",
  textUnderlineOffset: "4px",
  selectors: { "&:hover": { color: vars.color.text } },
});
