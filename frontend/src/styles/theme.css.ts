import { createGlobalTheme, globalStyle, keyframes } from "@vanilla-extract/css";

/** The original Muse look: deep navy, violet primary, teal secondary, frosted glass, Playfair + Poppins. */
export const vars = createGlobalTheme(":root", {
  color: {
    bg: "#0f0f1a",
    bgRaised: "#0a0a12",
    panel: "rgba(255, 255, 255, 0.05)",
    panelHi: "rgba(255, 255, 255, 0.1)",
    line: "rgba(255, 255, 255, 0.1)",
    lineHi: "rgba(255, 255, 255, 0.2)",
    text: "#f5f5fa",
    textDim: "#a1a1b5",
    textMute: "#75758c",
    accent: "#6e45e2",
    accentHi: "#8f6cf2",
    violet: "#4a2dbf",
    violetHi: "#b9a6ff",
    /** Muse's teal secondary (named for where it's used: highlights and badges). */
    yellow: "#88d3ce",
    teal: "#88d3ce",
    good: "#4caf50",
    bad: "#f44336",
  },
  font: {
    logo: "'Playfair Display', Georgia, serif",
    display: "'Poppins', 'Segoe UI', system-ui, sans-serif",
    body: "'Poppins', 'Segoe UI', system-ui, -apple-system, sans-serif",
    mono: "ui-monospace, 'Cascadia Code', Consolas, monospace",
  },
  radius: { sm: "8px", md: "12px", lg: "15px", pill: "50px" },
  shadow: {
    card: "0 10px 30px rgba(0, 0, 0, 0.3)",
    glow: "0 4px 15px rgba(110, 69, 226, 0.4)",
    violet: "0 6px 20px rgba(110, 69, 226, 0.6)",
  },
});

export const gradient = {
  primary: `linear-gradient(to right, ${vars.color.accent}, ${vars.color.violet})`,
  brand: `linear-gradient(to right, ${vars.color.accent}, ${vars.color.teal})`,
  logo: `linear-gradient(to right, ${vars.color.text}, ${vars.color.teal})`,
  welcome: `linear-gradient(135deg, ${vars.color.bgRaised} 0%, ${vars.color.violet} 100%)`,
  art: "linear-gradient(45deg, #4a2dbf, #6e45e2, #88d3ce)",
};

// Continuous, transform/opacity-only animations: they never hold content back.
/** The original Muse float: bob and rock. */
export const float = keyframes({
  "0%, 100%": { transform: "translateY(0) rotate(-3deg)" },
  "50%": { transform: "translateY(-20px) rotate(3deg)" },
});
export const drift = keyframes({
  "0%, 100%": { transform: "translate(0, 0) scale(1)" },
  "50%": { transform: "translate(60px, -40px) scale(1.12)" },
});
export const spin = keyframes({ to: { transform: "rotate(360deg)" } });
export const sweep = keyframes({
  "0%": { transform: "translateX(-130%) skewX(-18deg)" },
  "55%, 100%": { transform: "translateX(230%) skewX(-18deg)" },
});
export const foilShift = keyframes({
  "0%": { backgroundPosition: "0% 50%" },
  "100%": { backgroundPosition: "200% 50%" },
});
export const pulse = keyframes({
  "0%, 100%": { transform: "scale(1)", opacity: 1 },
  "50%": { transform: "scale(1.2)", opacity: 0.7 },
});
export const pulseShadow = keyframes({
  "0%, 100%": { boxShadow: "0 0 0 0 rgba(255, 255, 255, 0.4)" },
  "70%": { boxShadow: "0 0 0 15px rgba(255, 255, 255, 0)" },
});
export const shimmer = keyframes({
  "0%": { backgroundPosition: "-400px 0" },
  "100%": { backgroundPosition: "400px 0" },
});
export const slideIn = keyframes({ from: { transform: "translateX(110%)" }, to: { transform: "none" } });
export const marquee = keyframes({ to: { transform: "translateX(-50%)" } });

globalStyle("*, *::before, *::after", { boxSizing: "border-box" });
globalStyle("html", { colorScheme: "dark", scrollBehavior: "smooth" });

globalStyle("body", {
  margin: 0,
  minHeight: "100vh",
  background: vars.color.bg,
  color: vars.color.text,
  fontFamily: vars.font.body,
  fontSize: "15px",
  lineHeight: 1.6,
  overflowX: "hidden",
  WebkitFontSmoothing: "antialiased",
});

globalStyle("h1, h2, h3, h4", { fontFamily: vars.font.display, fontWeight: 600, lineHeight: 1.2, margin: 0 });
globalStyle("p", { margin: 0 });
globalStyle("a", { color: vars.color.teal });
globalStyle("button, input, select, textarea", { font: "inherit", color: "inherit" });
globalStyle(":focus-visible", { outline: `2px solid ${vars.color.teal}`, outlineOffset: "3px" });
globalStyle("::selection", { background: vars.color.accent, color: "#fff" });

globalStyle("*", {
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animation: "none !important",
      transition: "none !important",
    },
  },
});
