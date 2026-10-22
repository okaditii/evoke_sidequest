import type { Tier } from "./metadata";

export interface TierLook {
  /** Frame stops, top-left to bottom-right: one metal per tier, no rainbow. */
  frame: string[];
  /** Tier accent for labels, gems and the backdrop tint. */
  glow: string;
  /** Text colour for the rating and card title. */
  ink: string;
  /** Frame thickness (card-width %): higher tiers get a heavier frame. */
  thickness: number;
  /** Engraved lines inside the frame: 0 for Base up to 3 for Ultra Legendary. */
  lines: number;
}

/**
 * Seven tiers told apart by flat, single-colour finishes (no glow): matte slate, copper, silver,
 * gold, cool platinum, ice diamond and black chrome for Ultra Legendary.
 * Shared by the on-screen card (CSS) and the minted card image (SVG).
 */
export const TIER_LOOK: Record<Tier, TierLook> = {
  base: { frame: ["#2e3038", "#4a4d58", "#5a5d68", "#44474f", "#2c2e35"], glow: "#8a8d9c", ink: "#c9cbd4", thickness: 2.2, lines: 0 },
  bronze: { frame: ["#4a2412", "#9a5229", "#d39461", "#a85d2c", "#552a14"], glow: "#c98450", ink: "#f2c49d", thickness: 2.6, lines: 1 },
  silver: { frame: ["#5f6670", "#b9c1cb", "#eef1f5", "#a3abb6", "#5f6670"], glow: "#cfd5dd", ink: "#f4f7fb", thickness: 2.8, lines: 1 },
  gold: { frame: ["#6e4a00", "#c99512", "#f6dd7a", "#cf9e1f", "#6e4a00"], glow: "#e8b93a", ink: "#ffe68f", thickness: 3.1, lines: 1 },
  platinum: { frame: ["#3a4249", "#6f7b84", "#b9c4cb", "#66727b", "#353c43"], glow: "#b6c3cb", ink: "#eef3f6", thickness: 3.3, lines: 2 },
  diamond: { frame: ["#2c4560", "#7ea6cc", "#dcebf8", "#6f98c0", "#2a425c"], glow: "#8fb7dc", ink: "#e6f0ff", thickness: 3.5, lines: 2 },
  ultra: { frame: ["#000000", "#16161a", "#55555e", "#16161a", "#000000"], glow: "#e4e4ea", ink: "#ffffff", thickness: 3.9, lines: 3 },
};

export const frameGradient = (tier: Tier, angle = 135) => {
  const stops = TIER_LOOK[tier].frame;
  return `linear-gradient(${angle}deg, ${stops.map((c, i) => `${c} ${Math.round((i / (stops.length - 1)) * 100)}%`).join(", ")})`;
};
