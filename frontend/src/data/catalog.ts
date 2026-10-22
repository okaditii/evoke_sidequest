import type { Tier } from "../lib/metadata";

export type GenreId = "tactical" | "royale" | "moba";

export interface Genre {
  id: GenreId;
  name: string;
  blurb: string;
  color: string;
}

/** Character photo shown on a card: a portrait cropped to fill it. */
export interface Photo {
  src: string;
  fit: "cover" | "banner";
  /** CSS object-position. */
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
    /** Stable id; also seeds the card's backdrop and skill stats. */
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
  { id: "royale", name: "Battle Royale", blurb: "Victory Royales and last-one-standing cards.", color: "#88d3ce" },
  { id: "moba", name: "MOBA", blurb: "Champions and heroes earned one ranked climb at a time.", color: "#b9a6ff" },
];

// Official art, loaded at view time from the publishers' public asset servers. It is never copied
// into this repo or minted to IPFS; minted cards keep their generated art.
const valo = (uuid: string): Photo => ({ src: `https://media.valorant-api.com/agents/${uuid}/fullportrait.png`, fit: "cover", pos: "50% 8%" });
const lol = (champ: string): Photo => ({ src: `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champ}_0.jpg`, fit: "cover", pos: "50% 10%" });
const fn = (id: string): Photo => ({ src: `https://fortnite-api.com/images/cosmetics/br/${id.toLowerCase()}/featured.png`, fit: "cover", pos: "50% 20%" });
const steam = (hash: string): Photo => ({ src: `https://community.akamai.steamstatic.com/economy/image/${hash}/512fx512f`, fit: "cover", pos: "50% 25%" });
const dota = (hero: string): Photo => ({ src: `https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${hero}.png`, fit: "cover", pos: "50% 22%" });

/**
 * One row per card: [quest id, character, characterId, card title, role, tier, quest title, quest blurb,
 * three objectives, lore, photo].
 */
type Row = [string, string, string, string, string, Tier, string, string, [string, string, string], string, Photo];
const quests = (rows: Row[]): Quest[] =>
  rows.map(([id, character, characterId, cardTitle, role, tier, title, blurb, objectives, lore, photo]) => ({
    id,
    title,
    blurb,
    objectives,
    tier,
    reward: { name: `${character} · ${cardTitle}`, character, characterId, role, lore, photo },
  }));

export const GAMES: Game[] = [
  {
    id: "valorant",
    name: "Valorant",
    code: "VAL",
    genre: "tactical",
    tagline: "5v5 character-based tactical shooter. Every round is a story.",
    banner: "/assets/games/valorant.webp",
    palette: ["#1a0b10", "#ff4655"],
    quests: quests([
      ["val-heal", "Sage", "sage", "Barrier", "Sentinel", "bronze", "Field Medic", "Restore 1,000 health to teammates in one match.", ["Pick a healer agent", "Heal teammates for 1,000 HP", "Win the match"], "The wall that wins rounds.", valo("569fdd95-4d10-43ab-ca70-79becc718b46")],
      ["val-gekko", "Gekko", "gekko", "Wingman", "Initiator", "bronze", "Plant Buddy", "Plant the spike with Wingman three times.", ["Play Gekko", "Send Wingman to plant", "Do it three times"], "His crew has his back. Literally.", valo("e370fa57-4757-3604-3648-499e1f642d3f")],
      ["val-first-blood", "Jett", "jett", "Tailwind", "Duelist", "silver", "First Blood", "Open the round with the first kill, five times in one match.", ["Play an unrated or competitive match", "Get first blood in five rounds", "Finish the match"], "Gone before the smoke clears.", valo("add6443a-41bd-e414-f6ad-e58d267f4e95")],
      ["val-recon", "Sova", "sova", "Hunter's Fury", "Initiator", "silver", "Eyes Everywhere", "Reveal 20 enemies with recon in one match.", ["Pick an initiator", "Reveal 20 enemies", "Win the match"], "Nothing hides from the hunter.", valo("320b2a48-4d9b-a075-30f1-1f93a9b638fa")],
      ["val-skye", "Skye", "skye", "Seekers", "Initiator", "silver", "Pack Leader", "Flash five enemies for kills in one match.", ["Play Skye", "Assist five kills with flashes", "Win the match"], "Nature always finds its prey.", valo("6f2a04ca-43e0-be17-7f36-b3908627744d")],
      ["val-lockdown", "Killjoy", "killjoy", "Lockdown", "Sentinel", "gold", "Site Lockdown", "Hold a site alone with utility and win the round.", ["Set up turrets and alarms", "Hold the site solo", "Win the round"], "Genius at work. Do not touch.", valo("1e58de9c-4950-5125-93e9-a0aee9f98746")],
      ["val-paint", "Raze", "raze", "Showstopper", "Duelist", "gold", "Paint the Town", "Get three kills with one Showstopper.", ["Play Raze", "Charge Showstopper", "Take three kills with it"], "Boom first, ask questions never.", valo("f94c3b30-42be-e959-889c-5aa313dba261")],
      ["val-cypher", "Cypher", "cypher", "Neural Theft", "Sentinel", "gold", "Information Broker", "Catch ten enemies in trapwires in one match.", ["Play Cypher", "Trip ten enemies", "Win the match"], "He already knows where you are.", valo("117ed9e3-49f3-6512-3ccf-0cada7e3823b")],
      ["val-viper", "Viper", "viper", "Viper's Pit", "Controller", "gold", "Toxic Hold", "Win a round from inside Viper's Pit.", ["Play Viper", "Ult a site", "Win the round inside it"], "Breathe in. You won't like it.", valo("707eab51-4836-f488-046a-cda6bf494859")],
      ["val-shadows", "Omen", "omen", "From the Shadows", "Controller", "platinum", "From the Shadows", "Teleport behind the enemy and win a clutch.", ["Play Omen", "Teleport into a flank", "Win a 1v2 clutch"], "Scattered, but never gone.", valo("8e253930-4c05-31dd-1b6c-968525494517")],
      ["val-rush", "Neon", "neon", "Overdrive", "Duelist", "platinum", "High Gear", "Win a round in under 30 seconds.", ["Play Neon", "Sprint onto site", "Win before 0:30"], "Faster than the round timer.", valo("bb2a4828-46eb-8cd1-e765-15848195d751")],
      ["val-fade", "Fade", "fade", "Nightfall", "Initiator", "platinum", "Nightmare Fuel", "Mark an entire team with Nightfall.", ["Play Fade", "Hit all five with Nightfall", "Win the round"], "Your fears are her map.", valo("dade69b4-4f5a-8528-247b-219e5a1facd6")],
      ["val-ace", "Reyna", "reyna", "Empress", "Duelist", "diamond", "Ace the Round", "Take down all five enemies in a single round.", ["Play a competitive match", "Get five kills in one round", "Win that round"], "Every kill makes her stronger.", valo("a3bfb853-43b2-7238-a4f1-ad90e9e46bcc")],
      ["val-chamber", "Chamber", "chamber", "Tour de Force", "Sentinel", "diamond", "One Shot, One Kill", "Get five Operator kills in one round.", ["Play Chamber", "Use Tour de Force", "Five kills in one round"], "Precision is a luxury he never skips.", valo("22697a3d-45bf-8dd7-4fec-84a9e28c69d7")],
      ["val-clove", "Clove", "clove", "Not Dead Yet", "Controller", "diamond", "Not Dead Yet", "Win a round after coming back with Not Dead Yet.", ["Play Clove", "Use Not Dead Yet", "Win the round"], "Death is more of a suggestion.", valo("1dbf2edd-4729-0984-3115-daa5eed44993")],
      ["val-radiant", "Phoenix", "phoenix", "Run It Back", "Duelist", "ultra", "Rise to Radiant", "Reach Radiant in a ranked act.", ["Play ranked all act", "Reach Immortal", "Reach Radiant"], "Back from the ashes, every round.", valo("eb93336a-449b-9c1b-0a54-a891f7921d69")],
    ]),
  },
  {
    id: "lol",
    name: "League of Legends",
    code: "LOL",
    genre: "moba",
    tagline: "Pick a champion, climb the ladder, take the Nexus.",
    palette: ["#081521", "#38bdf8"],
    quests: quests([
      ["lol-first-tower", "Darius", "darius", "Noxian Might", "Fighter", "bronze", "First Tower", "Take the first tower of the game.", ["Play a ranked or normal game", "Take the first tower", "Win the game"], "Strength is the only law.", lol("Darius")],
      ["lol-garen", "Garen", "garen", "Demacian Justice", "Fighter", "bronze", "Spin to Win", "Get three kills with Judgment in one game.", ["Play Garen", "Spin into fights", "Three Judgment kills"], "Demacia never yields.", lol("Garen")],
      ["lol-mid", "Ahri", "ahri", "Spirit Rush", "Mage", "silver", "Mid Lane Master", "Win lane with a 30 CS lead by 15 minutes.", ["Play mid", "Lead by 30 CS at 15:00", "Win the game"], "Charm first. Questions later.", lol("Ahri")],
      ["lol-thresh", "Thresh", "thresh", "The Box", "Support", "silver", "Lantern Save", "Save three allies with your lantern.", ["Play Thresh", "Throw the lantern", "Save three allies"], "Every soul is a collectible.", lol("Thresh")],
      ["lol-snipe", "Caitlyn", "caitlyn", "Ace in the Hole", "Marksman", "gold", "Long Shot", "Land five ultimate snipes in one game.", ["Play Caitlyn", "Hit five Ace in the Hole", "Win the game"], "Piltover's finest never misses.", lol("Caitlyn")],
      ["lol-climb", "Vi", "vi", "Piltover Enforcer", "Fighter", "gold", "Ranked Climb", "Win ten ranked games in a season.", ["Finish placements", "Win ten ranked games", "End the season at Gold or higher"], "Punches first, asks questions never.", lol("Vi")],
      ["lol-akali", "Akali", "akali", "Perfect Execution", "Assassin", "gold", "Shroud Dance", "Get a double kill from inside your shroud.", ["Play Akali", "Fight in the shroud", "Get a double kill"], "The rogue assassin.", lol("Akali")],
      ["lol-light", "Lux", "lux", "Final Spark", "Mage", "platinum", "Final Spark", "Hit a three-champion Final Spark.", ["Play Lux", "Line up three champions", "Hit the Final Spark"], "The light always finds a way.", lol("Lux")],
      ["lol-zed", "Zed", "zed", "Death Mark", "Assassin", "platinum", "Shadow Strike", "Kill the enemy carry with Death Mark twice.", ["Play Zed", "Death Mark the carry", "Do it twice"], "The unseen is the deadliest.", lol("Zed")],
      ["lol-rewind", "Ekko", "ekko", "Chronobreak", "Assassin", "diamond", "Chronobreak", "Survive a fight with Chronobreak and win it.", ["Play Ekko", "Rewind out of certain death", "Win the fight"], "Time is on his side.", lol("Ekko")],
      ["lol-yone", "Yone", "yone", "Fate Sealed", "Fighter", "diamond", "Fate Sealed", "Pull three champions with Fate Sealed.", ["Play Yone", "Ult into three enemies", "Win the fight"], "One blade to seal, one to slay.", lol("Yone")],
      ["lol-pentakill", "Jinx", "jinx", "Get Jinxed", "Marksman", "ultra", "Pentakill", "Get a pentakill in a ranked game.", ["Play a ranked game", "Kill all five enemy champions in one fight", "Win the game"], "Rules are made to be broken. So are towers.", lol("Jinx")],
    ]),
  },
  {
    id: "fortnite",
    name: "Fortnite",
    code: "FNT",
    genre: "royale",
    tagline: "Drop in, build up, be the last one standing.",
    banner: "/assets/games/fortnite.webp",
    palette: ["#0b1030", "#8c2ae3"],
    quests: quests([
      ["fn-peel", "Peely", "peely", "Bananarama", "Brawler", "bronze", "Peel Out", "Eliminate an opponent while riding a vehicle.", ["Find a vehicle", "Eliminate someone from it", "Survive the next circle"], "Ripe and ready.", fn("cid_349_athena_commando_m_banana")],
      ["fn-brite", "Brite Bomber", "brite-bomber", "Rainbow Drop", "Bomber", "bronze", "Rainbow Drop", "Land at a named location and win the first fight.", ["Drop at a named location", "Win the first fight", "Survive two circles"], "Glitter is a weapon.", fn("CID_044_Athena_Commando_F_SciPop")],
      ["fn-builder", "Jonesy", "jonesy", "Builder", "Builder", "silver", "Master Builder", "Place 500 build pieces in one match.", ["Play a build mode match", "Place 500 build pieces", "Finish in the top 25"], "Walls, ramps, repeat.", fn("cid_883_athena_commando_m_chonejonesy")],
      ["fn-fish", "Fishstick", "fishstick", "Catch", "Angler", "silver", "Catch of the Day", "Catch five fish and win a fight with a fish item.", ["Fish five times", "Use a fish item in a fight", "Win the fight"], "Always smiling. Always hungry.", fn("cid_315_athena_commando_m_teriyakifish")],
      ["fn-renegade", "Renegade Raider", "renegade-raider", "Season One", "Raider", "gold", "Old School", "Win a match using only grey and green weapons.", ["Skip blue and better loot", "Make the top ten", "Win the match"], "Here since the first storm.", fn("CID_028_Athena_Commando_F")],
      ["fn-drift", "Drift", "drift", "Stage Five", "Outlaw", "gold", "Fully Evolved", "Get 15 eliminations across three matches.", ["Play three matches", "Get 15 eliminations", "Finish top ten once"], "The fox mask stays on.", fn("CID_161_Athena_Commando_M_Drift")],
      ["fn-victory", "Nikki", "nikki", "Victory", "Outlaw", "platinum", "Victory Royale", "Win a solo match.", ["Queue a solo match", "Reach the final five", "Take the Victory Royale"], "New on the island, already on the podium.", fn("character_cargolying")],
      ["fn-knight", "Black Knight", "black-knight", "Midnight Siege", "Knight", "platinum", "Hold the Castle", "Win the final circle from inside a build.", ["Build a fort in the last circle", "Hold it to the end", "Take the Victory Royale"], "The rarest armour on the island.", fn("CID_035_Athena_Commando_M_Medieval")],
      ["fn-raven", "Raven", "raven", "Nevermore", "Shadow", "diamond", "Nevermore", "Win a match with ten or more eliminations.", ["Queue any match", "Get ten eliminations", "Take the Victory Royale"], "The storm is afraid of him.", fn("cid_102_athena_commando_m_raven")],
      ["fn-golden", "Midas", "midas", "Golden Touch", "Boss", "ultra", "Golden Touch", "Win a Fortnite Champion Series qualifier.", ["Enter the qualifier", "Make the top 100", "Win the qualifier"], "Everything he touches turns legendary.", fn("cid_694_athena_commando_m_catburglar")],
    ]),
  },
  {
    id: "cs2",
    name: "Counter-Strike 2",
    code: "CS2",
    genre: "tactical",
    tagline: "Plant, defuse, clutch. The classic, rebuilt.",
    banner: "/assets/games/cs2.webp",
    palette: ["#101418", "#de9b35"],
    quests: quests([
      ["cs-entry", "Number K", "number-k", "Entry", "T Agent", "silver", "Entry Frag", "Open five rounds with the first kill.", ["Play a Premier match", "Get five opening kills", "Win the match"], "First through the door.", steam("i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIa-2lmxU-LR0dnuNm6E8Vl45Iv181z1fgn8oYby8iRe_OGnZ6psLM-FD3WZj7wuseM-GnG2lh4h5m2EmderdX7DaA9zW8N2QuBbtBG-mty2N-i0tADAy9USaSI87As")],
      ["cs-defuse", "Cmdr. Mae", "cmdr-mae", "Dead Cold", "CT Agent", "gold", "Ninja Defuse", "Defuse the bomb with an enemy still alive.", ["Play as CT", "Sneak to the planted bomb", "Defuse without being seen"], "The defuse kit clicks. The round is over.", steam("i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIa-2lmxU-LR0dnuNm6E8Vl45Iv181z1fh7lk6nz6iNP0OSveq1sLuSWQDGVlbx34-Q8HC3nk012tWzTzY79JHiQOgYpW8B3EeYN40HtxtzlNuz8p1uJLMIs6sE")],
      ["cs-heist", "Voltzmann", "voltzmann", "Safecracker", "T Agent", "gold", "Bank Job", "Win a pistol round and the round after it.", ["Play as T", "Win the pistol round", "Convert the next round"], "Every lock has a price.", steam("i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIa-2lmxU-LR0dnuNm6E8Vl45Iv181z1fgn8oYby8iRe_OGnZ6psLM-FD3WXj7536LVoFivmkEghsWXQmd37IniRPwUoCMFwEeAItxCwkdXvNr624wXAy9USEc8H9qQ")],
      ["cs-clutch", "Special Agent Ava", "ava", "Clutch Queen", "CT Agent", "diamond", "1v3 Clutch", "Win a round as the last one alive against three.", ["Play a Premier match", "Be last alive against three", "Win the round"], "Calm voice. Steady crosshair. Three down.", steam("i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIa-2lmxU-LR0dnuNm6E8Vl45Iv181z1fh7lk6nm_ytk-fO8YaVjNPLdXz6TkLdw5LY4Hnmwl0wktj7dn4r9I3OWPFApC5F1QeAO5xi4lIDiM_SiuVKk3V4ZcQ")],
      ["cs-major", "Sir Bloody Darryl", "darryl", "Miami", "T Agent", "ultra", "Major Champion", "Win a CS2 Major qualifier.", ["Enter the qualifier", "Make the playoffs", "Win the final"], "The Professionals don't lose finals.", steam("i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIa-2lmxU-LR0dnuNm6E8Vl45Iv181z1fgn8oYby8iRe_OGnZ6psLM-FD3WWj-gn47Q-GH7qxkhwsWjWyN6pJynGZld0CJR3QOdbtRa4lIGxY7_g7wfAy9USZdxTISw")],
    ]),
  },
  {
    id: "dota2",
    name: "Dota 2",
    code: "DOT",
    genre: "moba",
    tagline: "Five heroes, three lanes, one Ancient to destroy.",
    palette: ["#140707", "#c23c2a"],
    quests: quests([
      ["dota-axe", "Axe", "axe", "Culling Blade", "Initiator", "bronze", "Counter Helix", "Get a kill with Culling Blade.", ["Play Axe", "Blink into a fight", "Finish with Culling Blade"], "Axe is ready.", dota("axe")],
      ["dota-cm", "Crystal Maiden", "crystal-maiden", "Freezing Field", "Support", "silver", "Frozen Solid", "Hit three heroes with Freezing Field.", ["Play Crystal Maiden", "Channel Freezing Field", "Catch three heroes"], "Cold, calm and always outnumbered.", dota("crystal_maiden")],
      ["dota-pudge", "Pudge", "pudge", "Fresh Meat", "Disabler", "gold", "Fresh Meat", "Land ten hooks in one game.", ["Play Pudge", "Hook ten enemies", "Win the game"], "Get over here. No, the other one.", dota("pudge")],
      ["dota-lina", "Lina", "lina", "Laguna Blade", "Nuker", "platinum", "Slayer", "Get a rampage of spell kills with Lina.", ["Play Lina", "Chain your spells", "Get four kills in a fight"], "Fire answers every question.", dota("lina")],
      ["dota-jugg", "Juggernaut", "juggernaut", "Omnislash", "Carry", "platinum", "Blade Dance", "Win a fight with Omnislash.", ["Play Juggernaut", "Omnislash into a team", "Win the fight"], "One blade, many cuts.", dota("juggernaut")],
      ["dota-pa", "Phantom Assassin", "phantom-assassin", "Coup de Grace", "Carry", "diamond", "Coup de Grace", "Crit for over 1,000 damage.", ["Play Phantom Assassin", "Build for crits", "Land a 1,000+ crit"], "She never misses twice.", dota("phantom_assassin")],
      ["dota-invoker", "Invoker", "invoker", "Arsenal Magus", "Nuker", "ultra", "Ten Spells", "Cast all ten Invoker spells in one fight.", ["Play Invoker", "Invoke all ten spells", "Win the fight"], "Knowledge is the only power.", dota("invoker")],
    ]),
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
