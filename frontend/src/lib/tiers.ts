import type { Tier } from "./metadata";

export interface TierLook {
  /** Frame stops, top-left to bottom-right. */
  frame: string[];
  /** Accent for glows, gems and tier labels. */
  glow: string;
  /** Text colour for the rating and card title. */
  ink: string;
  /** Frame thickness (card-width %): higher tiers get a heavier frame. */
  thickness: number;
}

/**
 * Seven clearly different tiers: a matte slate base, three real metals, then increasingly
 * magical finishes (icy platinum, prismatic diamond, animated aurora for Ultra Legendary).
 * Shared by the on-screen card (CSS) and the minted card image (SVG).
 */
export const TIER_LOOK: Record<Tier, TierLook> = {
  base: { frame: ["#2b2d36", "#4a4d5a", "#5e6170", "#454856", "#2a2c35"], glow: "#8a8d9c", ink: "#c9cbd4", thickness: 2.2 },
  bronze: { frame: ["#4a2412", "#a5582a", "#e3a26a", "#b4642f", "#5a2c14"], glow: "#d0874f", ink: "#f2c49d", thickness: 2.6 },
  silver: { frame: ["#5f6670", "#c9d0d9", "#ffffff", "#aab2bd", "#646b75"], glow: "#e3e8ef", ink: "#f4f7fb", thickness: 2.8 },
  gold: { frame: ["#6e4a00", "#d9a514", "#fff1a6", "#e2b028", "#7a5200"], glow: "#ffcf3f", ink: "#ffe68f", thickness: 3.1 },
  platinum: { frame: ["#3a6d70", "#9eeee8", "#f3fffe", "#7fdcd5", "#336468"], glow: "#8ff2ea", ink: "#dbfffc", thickness: 3.3 },
  diamond: { frame: ["#26318f", "#6aa2ff", "#e6efff", "#b08cff", "#4b2ca8", "#7fc6ff"], glow: "#9cc3ff", ink: "#e6f0ff", thickness: 3.5 },
  ultra: { frame: ["#6e45e2", "#ff5fb8", "#ffd36b", "#88d3ce", "#5aa8ff", "#b48cff", "#6e45e2"], glow: "#ff8ad8", ink: "#fff0fb", thickness: 3.9 },
};

export const frameGradient = (tier: Tier, angle = 135) => {
  const stops = TIER_LOOK[tier].frame;
  return `linear-gradient(${angle}deg, ${stops.map((c, i) => `${c} ${Math.round((i / (stops.length - 1)) * 100)}%`).join(", ")})`;
};
