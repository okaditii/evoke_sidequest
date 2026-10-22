/**
 * The contract stores a free-text description per token. Evoke rewards keep their card data there
 * as `EVOKE1:` followed by JSON, so no contract change is needed. Tokens minted before Evoke
 * (plain descriptions) are flagged as legacy and hidden from the game pages.
 */

export const TIERS = ["bronze", "silver", "gold", "platinum", "diamond", "ultra"] as const;
export type Tier = (typeof TIERS)[number];

export const TIER_LABEL: Record<Tier, string> = {
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
  platinum: "Platinum",
  diamond: "Diamond",
  ultra: "Ultra Legendary",
};

/** What kind of task earns each tier (shown on the tier ladder). */
export const TIER_TASK: Record<Tier, string> = {
  bronze: "Everyday tasks",
  silver: "Daily streaks",
  gold: "Hard quests",
  platinum: "Event challenges",
  diamond: "Ranked feats",
  ultra: "Once-a-season legends",
};

export const TIER_RANK: Record<Tier, number> = { bronze: 0, silver: 1, gold: 2, platinum: 3, diamond: 4, ultra: 5 };

export interface RewardMeta {
  game: string;
  /** Genre id from the catalog. */
  genre?: string;
  tier: Tier;
  /** Character shown on the card. */
  character: string;
  /** Catalog character id. */
  characterId?: string;
  /** Seed for the generated card art (Studio cards); catalog cards use characterId. */
  seed?: string;
  lore: string;
  /** Set when the card was claimed from a quest. */
  quest?: string;
}

const PREFIX = "EVOKE1:";
const MAX_LORE = 600;

export function encodeMeta(meta: RewardMeta): string {
  const clean: RewardMeta = {
    game: meta.game.trim().slice(0, 60),
    ...(meta.genre ? { genre: meta.genre } : {}),
    tier: meta.tier,
    character: meta.character.trim().slice(0, 40),
    ...(meta.characterId ? { characterId: meta.characterId } : {}),
    ...(meta.seed ? { seed: meta.seed.slice(0, 40) } : {}),
    lore: meta.lore.trim().slice(0, MAX_LORE),
    ...(meta.quest ? { quest: meta.quest } : {}),
  };
  return PREFIX + JSON.stringify(clean);
}

export interface DecodedMeta extends RewardMeta {
  legacy: boolean;
}

const isTier = (v: unknown): v is Tier => TIERS.includes(v as Tier);
/** Cards minted before tiers existed used rarities; map them onto the ladder. */
const FROM_RARITY: Record<string, Tier> = { common: "bronze", rare: "silver", epic: "gold", legendary: "diamond", mythic: "ultra" };

/** Never throws: anything unparseable is treated as a legacy plain-text description. */
export function decodeMeta(description: string): DecodedMeta {
  const legacy: DecodedMeta = { game: "Legacy upload", tier: "bronze", character: "", lore: description, legacy: true };
  if (!description.startsWith(PREFIX)) return legacy;
  try {
    const raw = JSON.parse(description.slice(PREFIX.length)) as Record<string, unknown>;
    const tier = isTier(raw.tier) ? raw.tier : (FROM_RARITY[String(raw.rarity)] ?? "bronze");
    return {
      game: typeof raw.game === "string" && raw.game ? raw.game : "Unknown game",
      genre: typeof raw.genre === "string" ? raw.genre : undefined,
      tier,
      character: typeof raw.character === "string" ? raw.character : "",
      characterId: typeof raw.characterId === "string" ? raw.characterId : undefined,
      seed: typeof raw.seed === "string" ? raw.seed : undefined,
      lore: typeof raw.lore === "string" ? raw.lore : "",
      quest: typeof raw.quest === "string" ? raw.quest : undefined,
      legacy: false,
    };
  } catch {
    return legacy;
  }
}

/** Deterministic power rating inside the tier's band, so a card always shows the same number. */
export function powerFor(tier: Tier, seed: string): number {
  const bands: Record<Tier, [number, number]> = {
    bronze: [60, 69],
    silver: [70, 79],
    gold: [80, 86],
    platinum: [87, 91],
    diamond: [92, 96],
    ultra: [97, 99],
  };
  const [lo, hi] = bands[tier];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return lo + (h % (hi - lo + 1));
}

const SKILL_LABELS: Record<string, string[]> = {
  tactical: ["AIM", "UTL", "MOV", "IQ", "CLT", "TMW"],
  royale: ["AIM", "BLD", "MOV", "SRV", "IQ", "CLT"],
  moba: ["MEC", "LAN", "MAP", "TF", "FRM", "IQ"],
};

/**
 * Six gaming skills for a card, FUT-style. Deterministic per character and scaled to the overall
 * rating, so a card always shows the same numbers and higher tiers have higher stats.
 */
export function skillsFor(genre: string | undefined, power: number, seed: string): { label: string; value: number }[] {
  const labels = SKILL_LABELS[genre ?? ""] ?? SKILL_LABELS.tactical!;
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return labels.map((label, i) => {
    h = Math.imul(h ^ (h >>> 15), 2246822507) ^ i;
    const spread = ((h >>> 0) % 21) - 15; // -15 .. +5 around the overall
    return { label, value: Math.max(40, Math.min(99, power + spread)) };
  });
}
