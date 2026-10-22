import { style } from "@vanilla-extract/css";
import { gradient, vars } from "../styles/theme.css";

const mobile = "screen and (max-width: 980px)";

export const navbar = style({
  position: "sticky",
  top: 0,
  zIndex: 100,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1.5rem",
  padding: "1.2rem 3rem",
  background: "rgba(15, 15, 26, 0.8)",
  backdropFilter: "blur(10px)",
  borderBottom: `1px solid ${vars.color.line}`,
  "@media": { [mobile]: { padding: "0.9rem 1rem" } },
});

export const logoGroup = style({ display: "flex", alignItems: "center", gap: "1.5rem", minWidth: 0 });

export const logo = style({
  fontFamily: vars.font.logo,
  fontSize: "1.8rem",
  fontWeight: 700,
  textDecoration: "none",
  whiteSpace: "nowrap",
  background: gradient.logo,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  "@media": { "screen and (max-width: 420px)": { fontSize: "1.4rem" } },
});

export const walletPill = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "0.5rem 1rem",
  borderRadius: vars.radius.pill,
  background: vars.color.panelHi,
  color: vars.color.text,
  fontSize: "0.9rem",
  textDecoration: "none",
  whiteSpace: "nowrap",
  "@media": { "screen and (max-width: 560px)": { display: "none" } },
});

export const links = style({
  listStyle: "none",
  display: "flex",
  alignItems: "center",
  gap: "2rem",
  margin: 0,
  padding: 0,
  "@media": {
    [mobile]: {
      position: "fixed",
      top: "68px",
      left: 0,
      right: 0,
      flexDirection: "column",
      gap: "1.1rem",
      padding: "1.2rem 0 1.5rem",
      background: vars.color.bgRaised,
      borderBottom: `1px solid ${vars.color.line}`,
      transform: "translateY(-160%)",
      transition: "transform .3s ease",
    },
  },
});
export const linksOpen = style({ "@media": { [mobile]: { transform: "none" } } });

export const link = style({
  position: "relative",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  color: vars.color.textDim,
  textDecoration: "none",
  fontWeight: 500,
  transition: "color .3s ease",
  selectors: {
    "&::after": {
      content: "''",
      position: "absolute",
      left: 0,
      bottom: "-5px",
      width: 0,
      height: "2px",
      background: vars.color.accent,
      transition: "width .3s ease",
    },
    '&:hover, &[aria-current="page"]': { color: vars.color.text },
    '&:hover::after, &[aria-current="page"]::after': { width: "100%" },
  },
});

export const count = style({
  padding: "0 7px",
  borderRadius: vars.radius.pill,
  background: vars.color.accent,
  color: "#fff",
  fontSize: "11px",
  lineHeight: "18px",
});

export const authButton = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "0.5rem 1.1rem",
  border: "none",
  borderRadius: vars.radius.pill,
  background: vars.color.panelHi,
  color: vars.color.text,
  cursor: "pointer",
  transition: "all .3s ease",
  selectors: { "&:hover": { background: "rgba(255, 0, 0, 0.2)" } },
});

export const hamburger = style({
  display: "none",
  flexDirection: "column",
  gap: "5px",
  padding: "8px",
  background: "none",
  border: 0,
  cursor: "pointer",
  "@media": { [mobile]: { display: "flex" } },
});
export const line = style({ width: "25px", height: "2px", background: vars.color.text, transition: "all .3s ease" });

export const footer = style({
  background: vars.color.bgRaised,
  padding: "2rem 3rem",
  textAlign: "center",
  borderTop: `1px solid ${vars.color.line}`,
  color: vars.color.textDim,
  fontSize: "14px",
  display: "grid",
  gap: "0.8rem",
});
export const footerLinks = style({ display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap" });
export const footerLink = style({ color: vars.color.textDim, textDecoration: "none", transition: "color .3s ease", selectors: { "&:hover": { color: vars.color.text } } });
