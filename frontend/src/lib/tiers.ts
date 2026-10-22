import type { Tier } from "./metadata";

export interface TierLook {
  /** Frame stops, top-left to bottom-right. Muted to sit inside the Muse palette. */
  frame: string[];
  /** Accent for glows, gems and tier labels. */
  glow: string;
  /** Text colour for the rating and card title. */
  ink: string;
}

/** Shared by the on-screen card (CSS) and the minted card image (SVG). */
export const TIER_LOOK: Record<Tier, TierLook> = {
  bronze: { frame: ["#3d2c26", "#8a6352", "#c49a84", "#7a5546", "#3a2a24"], glow: "#b98b74", ink: "#e3c2b0" },
  silver: { frame: ["#3a3c48", "#8f93a6", "#dcdfe9", "#888ca0", "#383a46"], glow: "#c3c7d6", ink: "#e8eaf2" },
  gold: { frame: ["#4a3b22", "#a88a52", "#e6d3a3", "#9c7f4b", "#45371f"], glow: "#d9c08a", ink: "#efe0bb" },
  platinum: { frame: ["#25403f", "#5f9c97", "#c9ece9", "#5a918c", "#233c3b"], glow: "#88d3ce", ink: "#d3f1ee" },
  diamond: { frame: ["#2a1a6e", "#6e45e2", "#c9bbff", "#5b3cc4", "#26196a"], glow: "#b9a6ff", ink: "#e1d9ff" },
  ultra: { frame: ["#4a2dbf", "#6e45e2", "#b9a6ff", "#88d3ce", "#6e45e2", "#4a2dbf"], glow: "#a58ef0", ink: "#f0ebff" },
};

export const frameGradient = (tier: Tier, angle = 135) => {
  const stops = TIER_LOOK[tier].frame;
  return `linear-gradient(${angle}deg, ${stops.map((c, i) => `${c} ${Math.round((i / (stops.length - 1)) * 100)}%`).join(", ")})`;
};
