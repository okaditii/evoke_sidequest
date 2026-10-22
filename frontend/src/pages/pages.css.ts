import { globalStyle, style } from "@vanilla-extract/css";
import { gradient, marquee, vars } from "../styles/theme.css";

const tablet = "screen and (max-width: 1100px)";
const mobile = "screen and (max-width: 768px)";

// ---- home hero (original Muse layout)
export const hero = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "2rem",
  minHeight: "min(calc(100vh - 80px), 760px)",
  padding: "4rem 0",
  "@media": { [tablet]: { flexDirection: "column", textAlign: "center", minHeight: 0, paddingTop: "3rem" } },
});
export const heroContent = style({ maxWidth: "600px", display: "grid", gap: "1.5rem", justifyItems: "start", "@media": { [tablet]: { justifyItems: "center" } } });
export const heroTitle = style({ fontSize: "clamp(2.4rem, 5vw, 3.5rem)", lineHeight: 1.2 });
export const heroLead = style({ fontSize: "1.2rem", color: vars.color.textDim });
export const heroStats = style({ display: "grid", gridTemplateColumns: "repeat(4, auto)", gap: "1rem 2.2rem", marginTop: "0.8rem", "@media": { [tablet]: { justifyContent: "center" }, "screen and (max-width: 520px)": { gridTemplateColumns: "repeat(2, auto)" } } });
export const heroStat = style({ display: "grid", gap: "2px" });
export const heroStatNum = style({
  fontSize: "2rem",
  fontWeight: 700,
  lineHeight: 1.1,
  background: gradient.brand,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
});
export const heroStatLabel = style({ fontSize: "0.85rem", color: vars.color.textDim });

// ---- tier ticker
export const ticker = style({
  overflow: "hidden",
  borderTop: `1px solid ${vars.color.line}`,
  borderBottom: `1px solid ${vars.color.line}`,
  background: "rgba(10, 10, 18, 0.6)",
  padding: "0.9rem 0",
  maskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
  WebkitMaskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
});
export const tickerTrack = style({ display: "flex", gap: "2.6rem", width: "max-content", animation: `${marquee} 45s linear infinite` });
export const tickerItem = style({ display: "inline-flex", alignItems: "center", gap: "0.6rem", fontFamily: vars.font.logo, fontWeight: 700, fontSize: "1.25rem", whiteSpace: "nowrap" });
export const tickerGem = style({ width: "11px", height: "11px", transform: "rotate(45deg)", borderRadius: "2px", flex: "none" });

// ---- tier ladder
export const ladder = style({
  display: "grid",
  gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
  gap: "1.4rem",
  "@media": { [tablet]: { gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }, [mobile]: { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" } },
});
export const rung = style({ display: "grid", gap: "0.6rem", justifyItems: "center", textAlign: "center" });
export const rungName = style({ fontFamily: vars.font.logo, fontWeight: 700, fontSize: "1.2rem", marginTop: "0.4rem" });
export const rungTask = style({ fontSize: "0.82rem", color: vars.color.textDim });

// ---- grids
export const genreGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
  gap: "1.4rem",
  "@media": { [tablet]: { gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }, [mobile]: { gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "1rem" } },
});
export const gameGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "2.5rem",
  "@media": { [mobile]: { gridTemplateColumns: "1fr", gap: "1.4rem" } },
});
export const centerRow = style({ display: "flex", justifyContent: "center", marginTop: "2.5rem" });

// ---- genre tabs
export const tabs = style({ display: "flex", justifyContent: "center", gap: "0.6rem", flexWrap: "wrap", marginBottom: "2.6rem" });
export const tab = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.45rem",
  padding: "0.55rem 1.2rem",
  borderRadius: vars.radius.pill,
  border: `1px solid ${vars.color.line}`,
  background: vars.color.panel,
  color: vars.color.textDim,
  textDecoration: "none",
  fontSize: "0.95rem",
  transition: "all .3s ease",
  selectors: {
    "&:hover": { color: vars.color.text, borderColor: vars.color.lineHi },
    '&[aria-current="page"]': { background: gradient.primary, borderColor: "transparent", color: "#fff", boxShadow: vars.shadow.glow },
  },
});

// ---- game page
export const back = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  margin: "2rem 0 1rem",
  color: vars.color.textDim,
  textDecoration: "none",
  selectors: { "&:hover": { color: vars.color.text } },
});
export const banner = style({
  position: "relative",
  overflow: "hidden",
  minHeight: "320px",
  display: "flex",
  alignItems: "flex-end",
  borderRadius: "16px",
  border: `1px solid ${vars.color.line}`,
  boxShadow: vars.shadow.card,
  background: gradient.art,
  "@media": { [mobile]: { minHeight: "240px" } },
});
export const bannerArt = style({ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%" });
export const bannerFade = style({ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(15,15,26,.92) 0%, rgba(15,15,26,.55) 45%, transparent 75%), linear-gradient(0deg, rgba(15,15,26,.8), transparent 50%)" });
export const bannerBody = style({ position: "relative", padding: "2.2rem", display: "grid", gap: "0.7rem", maxWidth: "640px", "@media": { [mobile]: { padding: "1.3rem" } } });
export const bannerTitle = style({ fontFamily: vars.font.logo, fontWeight: 700, fontSize: "clamp(2.4rem, 6vw, 3.8rem)", lineHeight: 1.05 });
export const bannerTag = style({ fontSize: "1.1rem", color: "#e4e4ef" });

export const questList = style({ display: "grid", gap: "2rem" });
export const quest = style({
  display: "grid",
  gridTemplateColumns: "210px minmax(0, 1fr)",
  gap: "2rem",
  padding: "1.6rem",
  alignItems: "center",
  "@media": { "screen and (max-width: 640px)": { gridTemplateColumns: "1fr", justifyItems: "center", padding: "1.2rem" } },
});
export const questCard = style({ width: "100%", maxWidth: "210px" });
export const questBody = style({ display: "grid", gap: "0.85rem", alignContent: "start", width: "100%" });
export const questTitle = style({ fontSize: "1.5rem" });
export const objectives = style({ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.45rem" });
export const objective = style({
  display: "flex",
  gap: "0.7rem",
  alignItems: "center",
  fontSize: "0.95rem",
  cursor: "pointer",
  color: vars.color.textDim,
  selectors: { "&:has(input:checked)": { color: vars.color.text } },
});
globalStyle(`${objective} input`, { width: "18px", height: "18px", accentColor: vars.color.accent, flex: "none", margin: 0, cursor: "pointer" });
export const claimRow = style({ display: "flex", gap: "0.8rem", alignItems: "center", flexWrap: "wrap", paddingTop: "0.3rem" });
export const claimed = style({ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: vars.color.good });
export const notice = style({
  display: "flex",
  gap: "0.8rem",
  alignItems: "flex-start",
  padding: "0.9rem 1.1rem",
  margin: "0 auto 2.2rem",
  maxWidth: "860px",
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.line}`,
  borderLeft: `4px solid ${vars.color.accent}`,
  background: vars.color.panel,
  color: vars.color.textDim,
  fontSize: "0.9rem",
});

// ---- cards / deck toolbar
export const toolbar = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 2fr) repeat(4, minmax(0, 1fr))",
  gap: "0.7rem",
  marginBottom: "2.4rem",
  "@media": { [tablet]: { gridTemplateColumns: "1fr 1fr" } },
});
export const searchBox = style({ "@media": { [tablet]: { gridColumn: "1 / -1" } } });
export const tally = style({ display: "flex", justifyContent: "center", gap: "1.8rem", flexWrap: "wrap", marginBottom: "2.2rem" });
export const tallyItem = style({ display: "flex", alignItems: "baseline", gap: "0.4rem", color: vars.color.textDim });
export const tallyNum = style({ fontWeight: 700, fontSize: "1.6rem", color: vars.color.text });

// ---- studio (original upload section)
export const studio = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 300px",
  gap: "2.5rem",
  alignItems: "start",
  maxWidth: "1040px",
  margin: "0 auto",
  "@media": { [tablet]: { gridTemplateColumns: "1fr" } },
});
export const studioForm = style({ padding: "2rem" });
export const uploadBox = style({
  position: "relative",
  display: "grid",
  justifyItems: "center",
  gap: "0.4rem",
  padding: "2.4rem 1.5rem",
  border: "2px dashed rgba(255, 255, 255, 0.2)",
  borderRadius: vars.radius.lg,
  textAlign: "center",
  cursor: "pointer",
  color: vars.color.textDim,
  transition: "all .3s ease",
  selectors: { "&:hover, &[data-over='true']": { borderColor: vars.color.accent, background: "rgba(110, 69, 226, 0.06)" } },
});
export const uploadIcon = style({ width: "46px", height: "46px", color: vars.color.accent });
export const uploadInput = style({ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" });
export const segmented = style({ display: "flex", gap: "0.5rem", flexWrap: "wrap" });
export const seg = style({
  padding: "0.4rem 1rem",
  borderRadius: vars.radius.pill,
  border: "1px solid currentColor",
  background: "transparent",
  cursor: "pointer",
  fontSize: "0.85rem",
  fontWeight: 500,
  opacity: 0.5,
  transition: "all .25s ease",
  selectors: { '&[aria-pressed="true"]': { opacity: 1, background: "rgba(255,255,255,.08)", boxShadow: "0 0 14px -2px currentColor" } },
});
export const twoCol = style({ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", "@media": { "screen and (max-width: 560px)": { gridTemplateColumns: "1fr" } } });
export const preview = style({ position: "sticky", top: "100px", display: "grid", gap: "0.9rem", justifyItems: "center", "@media": { [tablet]: { position: "static" } } });
export const previewCard = style({ width: "100%", maxWidth: "300px" });
