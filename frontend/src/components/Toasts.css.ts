import { style, styleVariants } from "@vanilla-extract/css";
import { slideIn, vars } from "../styles/theme.css";

export const stack = style({
  position: "fixed",
  right: "16px",
  bottom: "16px",
  zIndex: 50,
  display: "grid",
  gap: "10px",
  width: "min(400px, calc(100vw - 32px))",
});

const base = style({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px 14px",
  borderRadius: vars.radius.md,
  background: "#12111f",
  border: `1px solid ${vars.color.lineHi}`,
  borderLeftWidth: "5px",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
  fontSize: "14px",
  animation: `${slideIn} .3s ease-out`,
});

export const toast = styleVariants({
  info: [base, { borderLeftColor: vars.color.violetHi }],
  success: [base, { borderLeftColor: vars.color.good }],
  error: [base, { borderLeftColor: vars.color.bad }],
});

export const text = style({ flex: 1 });

export const x = style({
  background: "none",
  border: 0,
  color: vars.color.textMute,
  cursor: "pointer",
  padding: "2px 4px",
  selectors: { "&:hover": { color: vars.color.text } },
});
