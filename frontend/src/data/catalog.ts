import type { Tier } from "../lib/metadata";

export type GenreId = "tactical" | "royale" | "moba" | "sports" | "fighting";

export interface Genre {
  id: GenreId;
  name: string;
  blurb: string;
  color: string;
}

export interface Quest {
  id: string;
  title: string;
  blurb: string;
  objectives: string[];
  /** Harder tasks give higher card tiers. */
  tier: Tier;
  reward: {
    /** Card title, e.g. "Jinx · Get Jinxed". */
    name: string;
    character: string;
    /** Stable id; also seeds the character's generated portrait. */
    characterId: string;
    role: string;
    lore: string;
  };
}

export interface Game {
  id: string;
  name: string;
  /** Three-letter code printed on cards. */
  code: string;
  genre: GenreId;
  tagline: string;
  /** Two theme colours (kept for older callers; art now comes from lib/cardArt). */
  palette: [string, string];
  quests: Quest[];
}

export const GENRES: Genre[] = [
  { id: "tactical", name: "Tactical Shooter", blurb: "Clutches, aces and agent cards.", color: "#8f6cf2" },
  { id: "royale", name: "Battle Royale", blurb: "Chicken dinners and last-squad-standing cards.", color: "#88d3ce" },
  { id: "moba", name: "MOBA", blurb: "Champions earned one ranked climb at a time.", color: "#b9a6ff" },
  { id: "sports", name: "Sports", blurb: "Match-winning moments, carded.", color: "#6fbfb9" },
  { id: "fighting", name: "Fighting", blurb: "Fatalities and flawless victories.", color: "#a58ef0" },
];

export const GAMES: Game[] = [
  {
    id: "valorant",
    name: "Valorant",
    code: "VAL",
    genre: "tactical",
    tagline: "5v5 character-based tactical shooter. Every round is a story.",
    palette: ["#1a0b10", "#ff4655"],
    quests: [
      {
        id: "val-first-blood",
        title: "First Blood",
        blurb: "Open the round with the first kill, five times in one match.",
        objectives: ["Play an unrated or competitive match", "Get first blood in five rounds", "Finish the match"],
        tier: "silver",
        reward: { name: "Jett · Tailwind", character: "Jett", characterId: "jett", role: "Duelist", lore: "Gone before the smoke clears." },
      },
      {
        id: "val-ace",
        title: "Ace the Round",
        blurb: "Take down all five enemies in a single round.",
        objectives: ["Play a competitive match", "Get five kills in one round", "Win that round"],
        tier: "diamond",
        reward: { name: "Reyna · Empress", character: "Reyna", characterId: "reyna", role: "Duelist", lore: "Every kill makes her stronger." },
      },
      {
        id: "val-heal",
        title: "Field Medic",
        blurb: "Restore 1,000 health to teammates in one match.",
        objectives: ["Pick a healer agent", "Heal teammates for 1,000 HP", "Win the match"],
        tier: "bronze",
        reward: { name: "Sage · Barrier", character: "Sage", characterId: "sage", role: "Sentinel", lore: "The wall that wins rounds." },
      },
    ],
  },
  {
    id: "bgmi",
    name: "BGMI",
    code: "BGM",
    genre: "royale",
    tagline: "100 players, one island, one chicken dinner.",
    palette: ["#1d1408", "#ffb020"],
    quests: [
      {
        id: "bgmi-drop",
        title: "Hot Drop",
        blurb: "Land in a hot zone and survive the first two minutes.",
        objectives: ["Drop at Pochinki or School", "Survive the first two minutes", "Get at least one kill"],
        tier: "bronze",
        reward: { name: "Victor · Hot Drop", character: "Victor", characterId: "victor", role: "Assaulter", lore: "First out of the plane, first into the fight." },
      },
      {
        id: "bgmi-dinner",
        title: "Winner Winner",
        blurb: "Win a classic match with your squad.",
        objectives: ["Queue a classic squad match", "Make the final circle", "Win the chicken dinner"],
        tier: "gold",
        reward: { name: "Sara · Chicken Dinner", character: "Sara", characterId: "sara", role: "Driver", lore: "Knows every road to the last circle." },
      },
      {
        id: "bgmi-conqueror",
        title: "Road to Conqueror",
        blurb: "Reach Conqueror tier in a ranked season.",
        objectives: ["Play ranked all season", "Reach Ace tier", "Reach Conqueror"],
        tier: "ultra",
        reward: { name: "Victor · Conqueror", character: "Victor", characterId: "victor-conqueror", role: "Assaulter", lore: "Top of the lobby. Top of the season." },
      },
    ],
  },
  {
    id: "fortnite",
    name: "Fortnite",
    code: "FNT",
    genre: "royale",
    tagline: "Drop in, build up, be the last one standing.",
    palette: ["#0b1030", "#8c2ae3"],
    quests: [
      {
        id: "fn-victory",
        title: "Victory Royale",
        blurb: "Win a solo match.",
        objectives: ["Queue a solo match", "Reach the final five", "Take the Victory Royale"],
        tier: "platinum",
        reward: { name: "Nikki · Victory", character: "Nikki", characterId: "nikki", role: "Outlaw", lore: "New on the island, already on the podium." },
      },
      {
        id: "fn-builder",
        title: "Master Builder",
        blurb: "Place 500 build pieces in one match.",
        objectives: ["Play a build mode match", "Place 500 build pieces", "Finish in the top 25"],
        tier: "silver",
        reward: { name: "Jonesy · Builder", character: "Jonesy", characterId: "jonesy", role: "Builder", lore: "Walls, ramps, repeat." },
      },
    ],
  },
  {
    id: "lol",
    name: "League of Legends",
    code: "LOL",
    genre: "moba",
    tagline: "Pick a champion, climb the ladder, take the Nexus.",
    palette: ["#081521", "#38bdf8"],
    quests: [
      {
        id: "lol-pentakill",
        title: "Pentakill",
        blurb: "Get a pentakill in a ranked game.",
        objectives: ["Play a ranked game", "Kill all five enemy champions in one fight", "Win the game"],
        tier: "ultra",
        reward: { name: "Jinx · Get Jinxed", character: "Jinx", characterId: "jinx", role: "Marksman", lore: "Rules are made to be broken. So are towers." },
      },
      {
        id: "lol-climb",
        title: "Ranked Climb",
        blurb: "Win ten ranked games in a season.",
        objectives: ["Finish placements", "Win ten ranked games", "End the season at Gold or higher"],
        tier: "gold",
        reward: { name: "Vi · Piltover Enforcer", character: "Vi", characterId: "vi", role: "Fighter", lore: "Punches first, asks questions never." },
      },
    ],
  },
  {
    id: "cs2",
    name: "Counter-Strike 2",
    code: "CS2",
    genre: "tactical",
    tagline: "Plant, defuse, clutch. The classic, rebuilt.",
    palette: ["#101418", "#de9b35"],
    quests: [
      {
        id: "cs-clutch",
        title: "1v3 Clutch",
        blurb: "Win a round as the last one alive against three.",
        objectives: ["Play a Premier match", "Be last alive against three", "Win the round"],
        tier: "diamond",
        reward: { name: "Ava · Clutch Queen", character: "Special Agent Ava", characterId: "ava", role: "CT Agent", lore: "Calm voice. Steady crosshair. Three down." },
      },
      {
        id: "cs-defuse",
        title: "Ninja Defuse",
        blurb: "Defuse the bomb with an enemy still alive.",
        objectives: ["Play as CT", "Sneak to the planted bomb", "Defuse without being seen"],
        tier: "gold",
        reward: { name: "Operator · Ninja", character: "CT Operator", characterId: "ct-operator", role: "CT Agent", lore: "The defuse kit clicks. The round is over." },
      },
    ],
  },
  {
    id: "eafc",
    name: "EA SPORTS FC",
    code: "EFC",
    genre: "sports",
    tagline: "The world's game, on your controller.",
    palette: ["#06150d", "#22c55e"],
    quests: [
      {
        id: "fc-hattrick",
        title: "Hat-trick Hero",
        blurb: "Score three goals with one player in a match.",
        objectives: ["Play an online match", "Score three with the same player", "Win the match"],
        tier: "gold",
        reward: { name: "Striker · Hat-trick", character: "Pro Clubs Striker", characterId: "striker", role: "ST", lore: "Three shots, three goals, one match ball." },
      },
      {
        id: "fc-cleansheet",
        title: "Clean Sheet",
        blurb: "Win without conceding a goal.",
        objectives: ["Play an online match", "Concede zero goals", "Win the match"],
        tier: "bronze",
        reward: { name: "Keeper · The Wall", character: "Pro Clubs Keeper", characterId: "keeper", role: "GK", lore: "Nothing gets past." },
      },
    ],
  },
  {
    id: "mk11",
    name: "Mortal Kombat 11",
    code: "MK1",
    genre: "fighting",
    tagline: "Finish him. Every match is a showdown.",
    palette: ["#1a0700", "#f97316"],
    quests: [
      {
        id: "mk-flawless",
        title: "Flawless Victory",
        blurb: "Win a round without taking damage.",
        objectives: ["Play a ranked or casual match", "Win a round at full health", "Win the match"],
        tier: "platinum",
        reward: { name: "Scorpion · Get Over Here", character: "Scorpion", characterId: "scorpion", role: "Ninja", lore: "Vengeance has a chain attached." },
      },
      {
        id: "mk-fatality",
        title: "Finish Him",
        blurb: "Land a fatality to end a match.",
        objectives: ["Learn a fatality input", "Win the match", "Perform the fatality"],
        tier: "silver",
        reward: { name: "Sub-Zero · Ice Cold", character: "Sub-Zero", characterId: "sub-zero", role: "Lin Kuei", lore: "Cold as the grave." },
      },
    ],
  },
];

export const genreById = (id: string) => GENRES.find((g) => g.id === id);
export const gameById = (id: string) => GAMES.find((g) => g.id === id);
export const gameByName = (name: string) => GAMES.find((g) => g.name.toLowerCase() === name.toLowerCase());
export const gamesInGenre = (id: GenreId) => GAMES.filter((g) => g.genre === id);
export const allQuests = () => GAMES.flatMap((g) => g.quests.map((q) => ({ quest: q, game: g })));
export const questById = (id: string) => allQuests().find((x) => x.quest.id === id);
