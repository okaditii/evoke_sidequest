import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "../styles/theme.css";

export const box = style({
  display: "grid",
  gap: "8px",
  padding: "14px 16px",
  background: "rgba(0, 0, 0, 0.35)",
  border: `1px solid ${vars.color.line}`,
  borderRadius: vars.radius.md,
});

export const list = style({ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "8px" });

export const marker = style({
  display: "inline-grid",
  placeItems: "center",
  width: "22px",
  height: "22px",
  border: "2px solid currentColor",
  borderRadius: "50%",
  fontSize: "11px",
  flex: "none",
});

const stepBase = style({ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px" });

export const step = styleVariants({
  todo: [stepBase, { color: vars.color.textMute }],
  now: [stepBase, { color: vars.color.accent }],
  done: [stepBase, { color: vars.color.good }],
  fail: [stepBase, { color: vars.color.bad }],
});

export const ok = style({ margin: 0, color: vars.color.good, fontWeight: 600 });
