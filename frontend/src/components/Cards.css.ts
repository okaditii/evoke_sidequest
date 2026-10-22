import { style } from "@vanilla-extract/css";
import { gradient, vars } from "../styles/theme.css";

// ---- game tile (the original gallery card)
export const gameTile = style({
  display: "flex",
  flexDirection: "column",
  padding: "1rem",
  textDecoration: "none",
  color: vars.color.text,
  borderRadius: "16px",
  background: "rgba(255, 255, 255, 0.03)",
  border: `1px solid ${vars.color.line}`,
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
  transition: "transform .3s ease, box-shadow .3s ease, border-color .3s ease",
  selectors: {
    "&:hover": { transform: "translateY(-6px)", boxShadow: "0 6px 24px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(110, 69, 226, 0.6)" },
  },
});
export const cover = style({ position: "relative", aspectRatio: "16 / 10", overflow: "hidden", borderRadius: "10px", background: "#000" });
export const coverImg = style({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
  transition: "transform .5s ease",
  selectors: { [`${gameTile}:hover &`]: { transform: "scale(1.06)" } },
});
export const coverFallback = style({
  position: "absolute",
  inset: 0,
  display: "grid",
  placeItems: "center",
  padding: "1rem",
  textAlign: "center",
  fontFamily: vars.font.logo,
  fontWeight: 700,
  fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
  textShadow: "0 6px 24px rgba(0,0,0,.5)",
});
export const codeChip = style({
  position: "absolute",
  top: "10px",
  left: "10px",
  padding: "2px 10px",
  borderRadius: vars.radius.pill,
  background: "rgba(10, 10, 18, 0.7)",
  backdropFilter: "blur(6px)",
  color: vars.color.teal,
  fontSize: "12px",
  fontWeight: 600,
  letterSpacing: "0.08em",
});
export const tileBody = style({ padding: "1rem 0.2rem 0.2rem", display: "grid", gap: "0.55rem", flex: 1 });
export const tileName = style({ fontSize: "1.2rem" });
export const tagline = style({ color: vars.color.textDim, fontSize: "0.92rem", lineHeight: 1.45 });
export const tileStats = style({ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", gap: "0.5rem", fontSize: "0.8rem", color: vars.color.textDim });
export const tileStat = style({ display: "inline-flex", alignItems: "center", gap: "6px" });

// ---- genre tile
export const genreTile = style({
  display: "grid",
  justifyItems: "center",
  textAlign: "center",
  gap: "0.6rem",
  padding: "1.8rem 1.2rem",
  textDecoration: "none",
  color: vars.color.text,
  borderRadius: vars.radius.lg,
  background: vars.color.panel,
  border: `1px solid ${vars.color.line}`,
  boxShadow: vars.shadow.card,
  backdropFilter: "blur(10px)",
  transition: "transform .3s ease, box-shadow .3s ease",
  selectors: { "&:hover": { transform: "translateY(-5px)", boxShadow: "0 10px 30px rgba(0,0,0,.5), 0 0 0 1px var(--accent)" } },
});
export const genreIcon = style({
  width: "58px",
  height: "58px",
  display: "grid",
  placeItems: "center",
  borderRadius: "50%",
  background: gradient.primary,
  color: "#fff",
  boxShadow: vars.shadow.glow,
});
export const genreIconSvg = style({ width: "26px", height: "26px" });
export const genreName = style({ fontSize: "1.1rem" });
export const genreMeta = style({ fontSize: "0.85rem", color: vars.color.textDim });
export const genreCount = style({ fontSize: "0.8rem", color: vars.color.teal, fontWeight: 500 });

// ---- official game logo over the cover
export const logoScrim = style({
  position: "absolute",
  inset: 0,
  display: "grid",
  placeItems: "center start",
  padding: "1rem 1.4rem",
  background: "linear-gradient(90deg, rgba(10,10,18,.75) 0%, rgba(10,10,18,.35) 50%, transparent 75%)",
  pointerEvents: "none",
});
export const gameLogo = style({
  display: "block",
  maxWidth: "52%",
  maxHeight: "42%",
  width: "auto",
  height: "auto",
  objectFit: "contain",
  filter: "brightness(0) invert(1) drop-shadow(0 4px 14px rgba(0,0,0,.7))",
});
export const gameLogoText = style({
  maxHeight: "none",
  fontFamily: vars.font.logo,
  fontWeight: 700,
  fontSize: "clamp(1.5rem, 3.4vw, 2.2rem)",
  textAlign: "center",
  color: "#fff",
  filter: "none",
  textShadow: "0 4px 18px rgba(0,0,0,.7)",
});

/** The game's top character, standing on the right of the cover and fading into it. */
export const coverStar = style({
  position: "absolute",
  top: 0,
  right: 0,
  width: "58%",
  height: "100%",
  objectFit: "cover",
  maskImage: "linear-gradient(90deg, transparent 0%, #000 35%)",
  WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 35%)",
  transition: "transform .5s ease",
  selectors: { [`${gameTile}:hover &`]: { transform: "scale(1.05)" } },
});
