import type { Tier } from "../lib/metadata";

export type GenreId = "tactical" | "royale" | "moba" | "sports" | "fighting";

export interface Genre {
  id: GenreId;
  name: string;
  blurb: string;
  color: string;
}

/**
 * Character photo shown on a card.
 * - "cover": a portrait, cropped to fill the card.
 * - "banner": one of our own landscape game banners, zoomed onto the character;
 *   `crop` is [left %, top %, width %] of the zoomed image, so cards from the same banner differ.
 */
export interface Photo {
  src: string;
  fit: "cover" | "banner";
  /** CSS object-position for "cover" photos. */
  pos?: string;
  crop?: [number, number, number];
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
    /** Stable id; also seeds the card's generated backdrop. */
    characterId: string;
    role: string;
    lore: string;
    photo: Photo;
  };
}

export interface Game {
  id: string;
  name: string;
  /** Three-letter code printed on cards. */
  code: string;
  genre: GenreId;
  tagline: string;
  /** Our own banner (public/assets/games); its logo plate is used as the card logo. */
  banner?: string;
  /** Kept for older callers. */
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

// Official art, loaded at view time from the publishers' public asset servers (never copied into
// this repo or minted to IPFS; minted cards keep their generated art).
const valo = (uuid: string): Photo => ({ src: `https://media.valorant-api.com/agents/${uuid}/fullportrait.png`, fit: "cover", pos: "50% 8%" });
const lol = (champ: string): Photo => ({ src: `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champ}_0.jpg`, fit: "cover", pos: "50% 10%" });
const fn = (id: string): Photo => ({ src: `https://fortnite-api.com/images/cosmetics/br/${id}/featured.png`, fit: "cover", pos: "50% 20%" });
const steam = (hash: string): Photo => ({ src: `https://community.akamai.steamstatic.com/economy/image/${hash}/512fx512f`, fit: "cover", pos: "50% 25%" });
/** Our own banner art, zoomed to a different spot per card. */
const own = (game: string, crop: [number, number, number]): Photo => ({ src: `/assets/games/${game}.webp`, fit: "banner", crop });

const q = (
  id: string,
  title: string,
  blurb: string,
  objectives: string[],
  tier: Tier,
  reward: Quest["reward"],
): Quest => ({ id, title, blurb, objectives, tier, reward });

export const GAMES: Game[] = [
  {
    id: "valorant",
    name: "Valorant",
    code: "VAL",
    genre: "tactical",
    tagline: "5v5 character-based tactical shooter. Every round is a story.",
    banner: "/assets/games/valorant.webp",
    palette: ["#1a0b10", "#ff4655"],
    quests: [
      q("val-heal", "Field Medic", "Restore 1,000 health to teammates in one match.", ["Pick a healer agent", "Heal teammates for 1,000 HP", "Win the match"], "bronze",
        { name: "Sage · Barrier", character: "Sage", characterId: "sage", role: "Sentinel", lore: "The wall that wins rounds.", photo: valo("569fdd95-4d10-43ab-ca70-79becc718b46") }),
      q("val-first-blood", "First Blood", "Open the round with the first kill, five times in one match.", ["Play an unrated or competitive match", "Get first blood in five rounds", "Finish the match"], "silver",
        { name: "Jett · Tailwind", character: "Jett", characterId: "jett", role: "Duelist", lore: "Gone before the smoke clears.", photo: valo("add6443a-41bd-e414-f6ad-e58d267f4e95") }),
      q("val-recon", "Eyes Everywhere", "Reveal 20 enemies with recon in one match.", ["Pick an initiator", "Reveal 20 enemies", "Win the match"], "silver",
        { name: "Sova · Hunter's Fury", character: "Sova", characterId: "sova", role: "Initiator", lore: "Nothing hides from the hunter.", photo: valo("320b2a48-4d9b-a075-30f1-1f93a9b638fa") }),
      q("val-lockdown", "Site Lockdown", "Hold a site alone with utility and win the round.", ["Set up turrets and alarms", "Hold the site solo", "Win the round"], "gold",
        { name: "Killjoy · Lockdown", character: "Killjoy", characterId: "killjoy", role: "Sentinel", lore: "Genius at work. Do not touch.", photo: valo("1e58de9c-4950-5125-93e9-a0aee9f98746") }),
      q("val-paint", "Paint the Town", "Get three kills with one Showstopper.", ["Play Raze", "Charge Showstopper", "Take three kills with it"], "gold",
        { name: "Raze · Showstopper", character: "Raze", characterId: "raze", role: "Duelist", lore: "Boom first, ask questions never.", photo: valo("f94c3b30-42be-e959-889c-5aa313dba261") }),
      q("val-shadows", "From the Shadows", "Teleport behind the enemy and win a clutch.", ["Play Omen", "Teleport into a flank", "Win a 1v2 clutch"], "platinum",
        { name: "Omen · From the Shadows", character: "Omen", characterId: "omen", role: "Controller", lore: "Scattered, but never gone.", photo: valo("8e253930-4c05-31dd-1b6c-968525494517") }),
      q("val-rush", "High Gear", "Win a round in under 30 seconds.", ["Play Neon", "Sprint onto site", "Win before 0:30"], "platinum",
        { name: "Neon · Overdrive", character: "Neon", characterId: "neon", role: "Duelist", lore: "Faster than the round timer.", photo: valo("bb2a4828-46eb-8cd1-e765-15848195d751") }),
      q("val-ace", "Ace the Round", "Take down all five enemies in a single round.", ["Play a competitive match", "Get five kills in one round", "Win that round"], "diamond",
        { name: "Reyna · Empress", character: "Reyna", characterId: "reyna", role: "Duelist", lore: "Every kill makes her stronger.", photo: valo("a3bfb853-43b2-7238-a4f1-ad90e9e46bcc") }),
      q("val-radiant", "Rise to Radiant", "Reach Radiant in a ranked act.", ["Play ranked all act", "Reach Immortal", "Reach Radiant"], "ultra",
        { name: "Phoenix · Run It Back", character: "Phoenix", characterId: "phoenix", role: "Duelist", lore: "Back from the ashes, every round.", photo: valo("eb93336a-449b-9c1b-0a54-a891f7921d69") }),
    ],
  },
  {
    id: "bgmi",
    name: "BGMI",
    code: "BGM",
    genre: "royale",
    tagline: "100 players, one island, one chicken dinner.",
    banner: "/assets/games/bgmi.webp",
    palette: ["#1d1408", "#ffb020"],
    quests: [
      q("bgmi-drop", "Hot Drop", "Land in a hot zone and survive the first two minutes.", ["Drop at Pochinki or School", "Survive the first two minutes", "Get at least one kill"], "bronze",
        { name: "Victor · Hot Drop", character: "Victor", characterId: "victor", role: "Assaulter", lore: "First out of the plane, first into the fight.", photo: own("bgmi", [-95, -6, 290]) }),
      q("bgmi-dinner", "Winner Winner", "Win a classic match with your squad.", ["Queue a classic squad match", "Make the final circle", "Win the chicken dinner"], "gold",
        { name: "Sara · Chicken Dinner", character: "Sara", characterId: "sara", role: "Driver", lore: "Knows every road to the last circle.", photo: own("bgmi", [-150, -20, 340]) }),
      q("bgmi-conqueror", "Road to Conqueror", "Reach Conqueror tier in a ranked season.", ["Play ranked all season", "Reach Ace tier", "Reach Conqueror"], "ultra",
        { name: "Victor · Conqueror", character: "Victor", characterId: "victor-conqueror", role: "Assaulter", lore: "Top of the lobby. Top of the season.", photo: own("bgmi", [-60, -2, 250]) }),
    ],
  },
  {
    id: "fortnite",
    name: "Fortnite",
    code: "FNT",
    genre: "royale",
    tagline: "Drop in, build up, be the last one standing.",
    banner: "/assets/games/fortnite.webp",
    palette: ["#0b1030", "#8c2ae3"],
    quests: [
      q("fn-builder", "Master Builder", "Place 500 build pieces in one match.", ["Play a build mode match", "Place 500 build pieces", "Finish in the top 25"], "silver",
        { name: "Jonesy · Builder", character: "Jonesy", characterId: "jonesy", role: "Builder", lore: "Walls, ramps, repeat.", photo: fn("cid_883_athena_commando_m_chonejonesy") }),
      q("fn-peel", "Peel Out", "Eliminate an opponent while riding a vehicle.", ["Find a vehicle", "Eliminate someone from it", "Survive the next circle"], "bronze",
        { name: "Peely · Bananarama", character: "Peely", characterId: "peely", role: "Brawler", lore: "Ripe and ready.", photo: fn("cid_349_athena_commando_m_banana") }),
      q("fn-fish", "Catch of the Day", "Catch five fish and win a fight with a fish item.", ["Fish five times", "Use a fish item in a fight", "Win the fight"], "silver",
        { name: "Fishstick · Catch", character: "Fishstick", characterId: "fishstick", role: "Angler", lore: "Always smiling. Always hungry.", photo: fn("cid_315_athena_commando_m_teriyakifish") }),
      q("fn-victory", "Victory Royale", "Win a solo match.", ["Queue a solo match", "Reach the final five", "Take the Victory Royale"], "platinum",
        { name: "Nikki · Victory", character: "Nikki", characterId: "nikki", role: "Outlaw", lore: "New on the island, already on the podium.", photo: fn("character_cargolying") }),
      q("fn-raven", "Nevermore", "Win a match with ten or more eliminations.", ["Queue any match", "Get ten eliminations", "Take the Victory Royale"], "diamond",
        { name: "Raven · Nevermore", character: "Raven", characterId: "raven", role: "Shadow", lore: "The storm is afraid of him.", photo: fn("cid_102_athena_commando_m_raven") }),
      q("fn-golden", "Golden Touch", "Win the Fortnite Champion Series qualifier.", ["Enter the qualifier", "Make the top 100", "Win the qualifier"], "ultra",
        { name: "Midas · Golden Touch", character: "Midas", characterId: "midas", role: "Boss", lore: "Everything he touches turns legendary.", photo: fn("cid_694_athena_commando_m_catburglar") }),
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
      q("lol-first-tower", "First Tower", "Take the first tower of the game.", ["Play a ranked or normal game", "Take the first tower", "Win the game"], "bronze",
        { name: "Darius · Noxian Might", character: "Darius", characterId: "darius", role: "Fighter", lore: "Strength is the only law.", photo: lol("Darius") }),
      q("lol-mid", "Mid Lane Master", "Win lane with a 30 CS lead by 15 minutes.", ["Play mid", "Lead by 30 CS at 15:00", "Win the game"], "silver",
        { name: "Ahri · Spirit Rush", character: "Ahri", characterId: "ahri", role: "Mage", lore: "Charm first. Questions later.", photo: lol("Ahri") }),
      q("lol-snipe", "Long Shot", "Land five ultimate snipes in one game.", ["Play Caitlyn", "Hit five Ace in the Hole", "Win the game"], "gold",
        { name: "Caitlyn · Ace in the Hole", character: "Caitlyn", characterId: "caitlyn", role: "Marksman", lore: "Piltover's finest never misses.", photo: lol("Caitlyn") }),
      q("lol-climb", "Ranked Climb", "Win ten ranked games in a season.", ["Finish placements", "Win ten ranked games", "End the season at Gold or higher"], "gold",
        { name: "Vi · Piltover Enforcer", character: "Vi", characterId: "vi", role: "Fighter", lore: "Punches first, asks questions never.", photo: lol("Vi") }),
      q("lol-light", "Final Spark", "Hit a three-champion Final Spark.", ["Play Lux", "Line up three champions", "Hit the Final Spark"], "platinum",
        { name: "Lux · Final Spark", character: "Lux", characterId: "lux", role: "Mage", lore: "The light always finds a way.", photo: lol("Lux") }),
      q("lol-rewind", "Chronobreak", "Survive a fight with Chronobreak and win it.", ["Play Ekko", "Rewind out of certain death", "Win the fight"], "diamond",
        { name: "Ekko · Chronobreak", character: "Ekko", characterId: "ekko", role: "Assassin", lore: "Time is on his side.", photo: lol("Ekko") }),
      q("lol-pentakill", "Pentakill", "Get a pentakill in a ranked game.", ["Play a ranked game", "Kill all five enemy champions in one fight", "Win the game"], "ultra",
        { name: "Jinx · Get Jinxed", character: "Jinx", characterId: "jinx", role: "Marksman", lore: "Rules are made to be broken. So are towers.", photo: lol("Jinx") }),
    ],
  },
  {
    id: "cs2",
    name: "Counter-Strike 2",
    code: "CS2",
    genre: "tactical",
    tagline: "Plant, defuse, clutch. The classic, rebuilt.",
    banner: "/assets/games/cs2.webp",
    palette: ["#101418", "#de9b35"],
    quests: [
      q("cs-entry", "Entry Frag", "Open five rounds with the first kill.", ["Play a Premier match", "Get five opening kills", "Win the match"], "silver",
        { name: "Number K · Entry", character: "Number K", characterId: "number-k", role: "T Agent", lore: "First through the door.", photo: steam("i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIa-2lmxU-LR0dnuNm6E8Vl45Iv181z1fgn8oYby8iRe_OGnZ6psLM-FD3WZj7wuseM-GnG2lh4h5m2EmderdX7DaA9zW8N2QuBbtBG-mty2N-i0tADAy9USaSI87As") }),
      q("cs-defuse", "Ninja Defuse", "Defuse the bomb with an enemy still alive.", ["Play as CT", "Sneak to the planted bomb", "Defuse without being seen"], "gold",
        { name: "Cmdr. Mae · Dead Cold", character: "Cmdr. Mae", characterId: "cmdr-mae", role: "CT Agent", lore: "The defuse kit clicks. The round is over.", photo: steam("i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIa-2lmxU-LR0dnuNm6E8Vl45Iv181z1fh7lk6nz6iNP0OSveq1sLuSWQDGVlbx34-Q8HC3nk012tWzTzY79JHiQOgYpW8B3EeYN40HtxtzlNuz8p1uJLMIs6sE") }),
      q("cs-heist", "Bank Job", "Win a pistol round and the round after it.", ["Play as T", "Win the pistol round", "Convert the next round"], "gold",
        { name: "Voltzmann · Safecracker", character: "Voltzmann", characterId: "voltzmann", role: "T Agent", lore: "Every lock has a price.", photo: steam("i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIa-2lmxU-LR0dnuNm6E8Vl45Iv181z1fgn8oYby8iRe_OGnZ6psLM-FD3WXj7536LVoFivmkEghsWXQmd37IniRPwUoCMFwEeAItxCwkdXvNr624wXAy9USEc8H9qQ") }),
      q("cs-clutch", "1v3 Clutch", "Win a round as the last one alive against three.", ["Play a Premier match", "Be last alive against three", "Win the round"], "diamond",
        { name: "Ava · Clutch Queen", character: "Special Agent Ava", characterId: "ava", role: "CT Agent", lore: "Calm voice. Steady crosshair. Three down.", photo: steam("i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIa-2lmxU-LR0dnuNm6E8Vl45Iv181z1fh7lk6nm_ytk-fO8YaVjNPLdXz6TkLdw5LY4Hnmwl0wktj7dn4r9I3OWPFApC5F1QeAO5xi4lIDiM_SiuVKk3V4ZcQ") }),
      q("cs-major", "Major Champion", "Win a CS2 Major qualifier.", ["Enter the qualifier", "Make the playoffs", "Win the final"], "ultra",
        { name: "Sir Bloody Darryl · Miami", character: "Sir Bloody Darryl", characterId: "darryl", role: "T Agent", lore: "The Professionals don't lose finals.", photo: steam("i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIa-2lmxU-LR0dnuNm6E8Vl45Iv181z1fgn8oYby8iRe_OGnZ6psLM-FD3WWj-gn47Q-GH7qxkhwsWjWyN6pJynGZld0CJR3QOdbtRa4lIGxY7_g7wfAy9USZdxTISw") }),
    ],
  },
  {
    id: "eafc",
    name: "EA SPORTS FC",
    code: "EFC",
    genre: "sports",
    tagline: "The world's game, on your controller.",
    banner: "/assets/games/eafc.webp",
    palette: ["#06150d", "#22c55e"],
    quests: [
      q("fc-cleansheet", "Clean Sheet", "Win without conceding a goal.", ["Play an online match", "Concede zero goals", "Win the match"], "bronze",
        { name: "Keeper · The Wall", character: "Pro Clubs Keeper", characterId: "keeper", role: "GK", lore: "Nothing gets past.", photo: own("eafc", [-120, -14, 320]) }),
      q("fc-hattrick", "Hat-trick Hero", "Score three goals with one player in a match.", ["Play an online match", "Score three with the same player", "Win the match"], "gold",
        { name: "Striker · Hat-trick", character: "Pro Clubs Striker", characterId: "striker", role: "ST", lore: "Three shots, three goals, one match ball.", photo: own("eafc", [-80, -4, 270]) }),
    ],
  },
  {
    id: "mk11",
    name: "Mortal Kombat 11",
    code: "MK1",
    genre: "fighting",
    tagline: "Finish him. Every match is a showdown.",
    banner: "/assets/games/mk11.webp",
    palette: ["#1a0700", "#f97316"],
    quests: [
      q("mk-fatality", "Finish Him", "Land a fatality to end a match.", ["Learn a fatality input", "Win the match", "Perform the fatality"], "silver",
        { name: "Sub-Zero · Ice Cold", character: "Sub-Zero", characterId: "sub-zero", role: "Lin Kuei", lore: "Cold as the grave.", photo: own("mk11", [-130, -16, 330]) }),
      q("mk-flawless", "Flawless Victory", "Win a round without taking damage.", ["Play a ranked or casual match", "Win a round at full health", "Win the match"], "platinum",
        { name: "Scorpion · Get Over Here", character: "Scorpion", characterId: "scorpion", role: "Ninja", lore: "Vengeance has a chain attached.", photo: own("mk11", [-85, -5, 275]) }),
    ],
  },
];

export const genreById = (id: string) => GENRES.find((g) => g.id === id);
export const gameById = (id: string) => GAMES.find((g) => g.id === id);
export const gameByName = (name: string) => GAMES.find((g) => g.name.toLowerCase() === name.toLowerCase());
export const gamesInGenre = (id: GenreId) => GAMES.filter((g) => g.genre === id);
export const allQuests = () => GAMES.flatMap((g) => g.quests.map((qq) => ({ quest: qq, game: g })));
export const questById = (id: string) => allQuests().find((x) => x.quest.id === id);
/** Photo for a catalog character id, if any. */
export const photoFor = (characterId: string | undefined) =>
  characterId ? allQuests().find(({ quest }) => quest.reward.characterId === characterId)?.quest.reward.photo : undefined;
