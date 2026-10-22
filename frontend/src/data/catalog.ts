import type { Tier } from "../lib/metadata";

export type GenreId = "tactical" | "royale" | "moba" | "hero" | "sports" | "fighting" | "strategy" | "action";

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
  /** Official logo, shown white on cards and game tiles. */
  logo?: string;
  /** Kept for older callers. */
  palette: [string, string];
  quests: Quest[];
}

export const GENRES: Genre[] = [
  { id: "tactical", name: "Tactical Shooter", blurb: "Clutches, aces and agent cards.", color: "#8f6cf2" },
  { id: "royale", name: "Battle Royale", blurb: "Victory Royales and last-one-standing cards.", color: "#88d3ce" },
  { id: "moba", name: "MOBA", blurb: "Champions and heroes earned one ranked climb at a time.", color: "#b9a6ff" },
  { id: "hero", name: "Hero Shooter", blurb: "Team fights, ultimates and play-of-the-game cards.", color: "#9fd8ff" },
  { id: "sports", name: "Sports", blurb: "Goals, hat-tricks and Team of the Season cards.", color: "#9fe0b4" },
  { id: "fighting", name: "Fighting", blurb: "Combos, fatalities and flawless victories.", color: "#e39a9a" },
  { id: "strategy", name: "Strategy", blurb: "Elixir, towers and three-crown wins.", color: "#f0c987" },
  { id: "action", name: "Action Adventure", blurb: "Boss fights and legends of the story games.", color: "#c9b8a0" },
];

// Official art, loaded at view time from the publishers' public asset servers. It is never copied
// into this repo or minted to IPFS; minted cards keep their generated art.
const valo = (uuid: string): Photo => ({ src: `https://media.valorant-api.com/agents/${uuid}/fullportrait.png`, fit: "cover", pos: "50% 8%" });
const lol = (champ: string, skin = 0): Photo => ({ src: `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champ}_${skin}.jpg`, fit: "cover", pos: "50% 10%" });
const fn = (id: string): Photo => ({ src: `https://fortnite-api.com/images/cosmetics/br/${id.toLowerCase()}/featured.png`, fit: "cover", pos: "50% 20%" });
const steam = (hash: string): Photo => ({ src: `https://community.akamai.steamstatic.com/economy/image/${hash}/512fx512f`, fit: "cover", pos: "50% 25%" });
const dota = (hero: string): Photo => ({ src: `https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${hero}.png`, fit: "cover", pos: "50% 22%" });
/** Character art from the fan wikis (Fandom image CDN). */
const wiki = (site: string, path: string, pos = "50% 15%"): Photo => ({ src: `https://static.wikia.nocookie.net/${site}/images/${path}/revision/latest`, fit: "cover", pos });
/** Clash Royale 3D character renders from the Clash Royale wiki. */
const cr = (path: string, pos = "50% 20%"): Photo => wiki("clashroyale", path, pos);
/** Wikimedia Commons file (game logos), resized by Commons. */
const commons = (file: string, width = 640) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;
/** EA SPORTS FC in-game player portraits (EA ratings CDN), by EA player id. */
const fc = (id: number): Photo => ({ src: `https://ratings-images-prod.pulse.ea.com/FC25/full/player-portraits/p${id}.png`, fit: "cover", pos: "50% 30%" });

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
    logo: commons("Valorant_logo_-_pink_color_version.svg", 480),
    palette: ["#1a0b10", "#ff4655"],
    quests: quests([
      ["val-heal", "Sage", "sage", "Barrier", "Sentinel", "bronze", "Field Medic", "Restore 1,000 health to teammates in one match.", ["Pick a healer agent", "Heal teammates for 1,000 HP", "Win the match"], "The wall that wins rounds.", valo("569fdd95-4d10-43ab-ca70-79becc718b46")],
      ["val-gekko", "Gekko", "gekko", "Wingman", "Initiator", "base", "Plant Buddy", "Plant the spike with Wingman three times.", ["Play Gekko", "Send Wingman to plant", "Do it three times"], "His crew has his back. Literally.", valo("e370fa57-4757-3604-3648-499e1f642d3f")],
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
    logo: commons("League_of_Legends_2019_vector.svg", 480),
    palette: ["#081521", "#38bdf8"],
    quests: quests([
      ["lol-first-tower", "Darius", "darius", "Noxian Might", "Fighter", "bronze", "First Tower", "Take the first tower of the game.", ["Play a ranked or normal game", "Take the first tower", "Win the game"], "Strength is the only law.", lol("Darius")],
      ["lol-garen", "Garen", "garen", "Demacian Justice", "Fighter", "base", "Spin to Win", "Get three kills with Judgment in one game.", ["Play Garen", "Spin into fights", "Three Judgment kills"], "Demacia never yields.", lol("Garen")],
      ["lol-mid", "Ahri", "ahri", "Spirit Rush", "Mage", "silver", "Mid Lane Master", "Win lane with a 30 CS lead by 15 minutes.", ["Play mid", "Lead by 30 CS at 15:00", "Win the game"], "Charm first. Questions later.", lol("Ahri")],
      ["lol-thresh", "Thresh", "thresh", "The Box", "Support", "silver", "Lantern Save", "Save three allies with your lantern.", ["Play Thresh", "Throw the lantern", "Save three allies"], "Every soul is a collectible.", lol("Thresh")],
      ["lol-snipe", "Caitlyn", "caitlyn", "Ace in the Hole", "Marksman", "gold", "Long Shot", "Land five ultimate snipes in one game.", ["Play Caitlyn", "Hit five Ace in the Hole", "Win the game"], "Piltover's finest never misses.", lol("Caitlyn")],
      ["lol-climb", "Vi", "vi", "Piltover Enforcer", "Fighter", "gold", "Ranked Climb", "Win ten ranked games in a season.", ["Finish placements", "Win ten ranked games", "End the season at Gold or higher"], "Punches first, asks questions never.", lol("Vi")],
      ["lol-akali", "Akali", "akali", "Perfect Execution", "Assassin", "gold", "Shroud Dance", "Get a double kill from inside your shroud.", ["Play Akali", "Fight in the shroud", "Get a double kill"], "The rogue assassin.", lol("Akali")],
      ["lol-light", "Lux", "lux", "Final Spark", "Mage", "platinum", "Final Spark", "Hit a three-champion Final Spark.", ["Play Lux", "Line up three champions", "Hit the Final Spark"], "The light always finds a way.", lol("Lux")],
      ["lol-zed", "Zed", "zed", "Death Mark", "Assassin", "platinum", "Shadow Strike", "Kill the enemy carry with Death Mark twice.", ["Play Zed", "Death Mark the carry", "Do it twice"], "The unseen is the deadliest.", lol("Zed")],
      ["lol-rewind", "Ekko", "ekko", "Chronobreak", "Assassin", "diamond", "Chronobreak", "Survive a fight with Chronobreak and win it.", ["Play Ekko", "Rewind out of certain death", "Win the fight"], "Time is on his side.", lol("Ekko")],
      ["lol-yone", "Yone", "yone", "Fate Sealed", "Fighter", "diamond", "Fate Sealed", "Pull three champions with Fate Sealed.", ["Play Yone", "Ult into three enemies", "Win the fight"], "One blade to seal, one to slay.", lol("Yone")],
      ["lol-pentakill", "Jinx", "jinx", "Get Jinxed", "Marksman", "ultra", "Pentakill", "Get a pentakill in a ranked game.", ["Play a ranked game", "Kill all five enemy champions in one fight", "Win the game"], "Rules are made to be broken. So are towers.", lol("Jinx", 60)],
    ]),
  },
  {
    id: "fortnite",
    name: "Fortnite",
    code: "FNT",
    genre: "royale",
    tagline: "Drop in, build up, be the last one standing.",
    banner: "/assets/games/fortnite.webp",
    logo: commons("Fortnite_logo_padded.svg", 480),
    palette: ["#0b1030", "#8c2ae3"],
    quests: quests([
      ["fn-peel", "Peely", "peely", "Bananarama", "Brawler", "bronze", "Peel Out", "Eliminate an opponent while riding a vehicle.", ["Find a vehicle", "Eliminate someone from it", "Survive the next circle"], "Ripe and ready.", fn("cid_349_athena_commando_m_banana")],
      ["fn-brite", "Brite Bomber", "brite-bomber", "Rainbow Drop", "Bomber", "base", "Rainbow Drop", "Land at a named location and win the first fight.", ["Drop at a named location", "Win the first fight", "Survive two circles"], "Glitter is a weapon.", fn("CID_044_Athena_Commando_F_SciPop")],
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
    logo: commons("Counter-Strike_2_logo.svg", 480),
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
    logo: "https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/global/dota2_logo_horiz.png",
    palette: ["#140707", "#c23c2a"],
    quests: quests([
      ["dota-axe", "Axe", "axe", "Culling Blade", "Initiator", "base", "Counter Helix", "Get a kill with Culling Blade.", ["Play Axe", "Blink into a fight", "Finish with Culling Blade"], "Axe is ready.", dota("axe")],
      ["dota-cm", "Crystal Maiden", "crystal-maiden", "Freezing Field", "Support", "silver", "Frozen Solid", "Hit three heroes with Freezing Field.", ["Play Crystal Maiden", "Channel Freezing Field", "Catch three heroes"], "Cold, calm and always outnumbered.", dota("crystal_maiden")],
      ["dota-pudge", "Pudge", "pudge", "Fresh Meat", "Disabler", "gold", "Fresh Meat", "Land ten hooks in one game.", ["Play Pudge", "Hook ten enemies", "Win the game"], "Get over here. No, the other one.", dota("pudge")],
      ["dota-lina", "Lina", "lina", "Laguna Blade", "Nuker", "platinum", "Slayer", "Get a rampage of spell kills with Lina.", ["Play Lina", "Chain your spells", "Get four kills in a fight"], "Fire answers every question.", dota("lina")],
      ["dota-jugg", "Juggernaut", "juggernaut", "Omnislash", "Carry", "platinum", "Blade Dance", "Win a fight with Omnislash.", ["Play Juggernaut", "Omnislash into a team", "Win the fight"], "One blade, many cuts.", dota("juggernaut")],
      ["dota-pa", "Phantom Assassin", "phantom-assassin", "Coup de Grace", "Carry", "diamond", "Coup de Grace", "Crit for over 1,000 damage.", ["Play Phantom Assassin", "Build for crits", "Land a 1,000+ crit"], "She never misses twice.", dota("phantom_assassin")],
      ["dota-invoker", "Invoker", "invoker", "Arsenal Magus", "Nuker", "ultra", "Ten Spells", "Cast all ten Invoker spells in one fight.", ["Play Invoker", "Invoke all ten spells", "Win the fight"], "Knowledge is the only power.", dota("invoker")],
    ]),
  },
  {
    id: "overwatch",
    name: "Overwatch 2",
    code: "OW2",
    genre: "hero",
    tagline: "5v5 hero shooter. Push the payload, hold the point.",
    logo: commons("Overwatch_2_full_logo.svg", 480),
    palette: ["#14161f", "#f99e1a"],
    quests: quests([
      ["ow-mercy", "Mercy", "mercy", "Valkyrie", "Support", "base", "Guardian Angel", "Heal 5,000 in one match.", ["Play Mercy", "Heal 5,000", "Finish the match"], "Heroes never die.", wiki("overwatch_gamepedia", "1/11/OW2_Mercy.png")],
      ["ow-dva", "D.Va", "dva", "Self-Destruct", "Tank", "bronze", "Nerf This!", "Get two kills with one Self-Destruct.", ["Play D.Va", "Self-Destruct on a group", "Take two kills"], "Is this easy mode?", wiki("overwatch_gamepedia", "1/1a/OW2_Dva.png")],
      ["ow-reaper", "Reaper", "reaper", "Death Blossom", "Damage", "silver", "Die, Die, Die", "Get three kills with one Death Blossom.", ["Play Reaper", "Shadow Step behind them", "Three kills in one ult"], "Death walks among you.", wiki("overwatch_gamepedia", "8/8c/OW2_Reaper.png")],
      ["ow-kiriko", "Kiriko", "kiriko", "Kitsune Rush", "Support", "gold", "Protection Suzu", "Cleanse three allies from certain death.", ["Play Kiriko", "Suzu at the right time", "Save three allies"], "The fox runs with her.", wiki("overwatch_gamepedia", "1/16/OW2_Kiriko.png")],
      ["ow-tracer", "Tracer", "tracer", "Pulse Bomb", "Damage", "platinum", "Cheers, Love", "Stick three Pulse Bombs for kills.", ["Play Tracer", "Blink in close", "Three Pulse Bomb kills"], "The cavalry's here!", wiki("overwatch_gamepedia", "6/63/OW2_Tracer.png")],
      ["ow-genji", "Genji", "genji", "Dragonblade", "Damage", "diamond", "Play of the Game", "Earn Play of the Game with Dragonblade.", ["Play Genji", "Dragonblade into a team fight", "Get Play of the Game"], "The dragon becomes me.", wiki("overwatch_gamepedia", "1/17/OW2_Genji.png")],
    ]),
  },
  {
    id: "apex",
    name: "Apex Legends",
    code: "APX",
    genre: "royale",
    tagline: "Squad up, pick a legend, be the champion.",
    logo: commons("Apex_Legends_logo.svg", 480),
    palette: ["#1a0d0d", "#da292a"],
    quests: quests([
      ["apex-lifeline", "Lifeline", "lifeline", "Combat Medic", "Support", "base", "Res Squad", "Revive three teammates in one match.", ["Play Lifeline", "Revive with D.O.C.", "Three revives"], "Never leave a squadmate behind.", wiki("apexlegends_gamepedia_en", "9/93/Runaway_Hit_Lifeline.jpg")],
      ["apex-pathfinder", "Pathfinder", "pathfinder", "Zipline", "Skirmisher", "silver", "Grapple Master", "Travel 1,000 m by grapple and zipline.", ["Play Pathfinder", "Grapple and zipline", "Travel 1,000 m"], "Friendly robot. Unfriendly aim.", wiki("apexlegends_gamepedia_en", "f/fc/Angel_City_Pacer_Pathfinder.png")],
      ["apex-horizon", "Horizon", "horizon", "Black Hole", "Skirmisher", "gold", "Gravity Well", "Knock three enemies inside one Black Hole.", ["Play Horizon", "Throw NEWT", "Three knocks"], "Space is her playground.", wiki("apexlegends_gamepedia_en", "4/44/Hidden_Blossoms_Horizon.png")],
      ["apex-bloodhound", "Bloodhound", "bloodhound", "Beast of the Hunt", "Recon", "platinum", "The Hunt", "Get five kills while Beast of the Hunt is active.", ["Play Bloodhound", "Use Beast of the Hunt", "Five kills"], "The Allfather guides the hunt.", wiki("apexlegends_gamepedia_en", "2/21/Apex_Hunter_Bloodhound_Tier_1.png")],
      ["apex-wraith", "Wraith", "wraith", "Into the Void", "Skirmisher", "ultra", "Apex Predator", "Reach Apex Predator in a ranked split.", ["Play ranked all split", "Reach Master", "Reach Apex Predator"], "Voices say you're next.", wiki("apexlegends_gamepedia_en", "0/00/Apex_Voidshifter_Wraith_Tier_1.png")],
    ]),
  },
  {
    id: "eafc",
    name: "EA SPORTS FC",
    code: "EFC",
    genre: "sports",
    tagline: "The world's game. Build your Ultimate Team.",
    palette: ["#06140c", "#00e05a"],
    quests: quests([
      ["fc-bellingham", "Bellingham", "bellingham", "Box to Box", "CAM", "silver", "Midfield Engine", "Score and assist in the same match.", ["Play Ultimate Team or Kick-Off", "Score a goal", "Assist another"], "Arrives late. Scores anyway.", fc(252371)],
      ["fc-vini", "Vinícius Jr.", "vinicius", "Samba Skills", "LW", "gold", "Skill Moves", "Score after a four-star skill move.", ["Pick a winger", "Beat a defender with a skill move", "Score"], "Dances past defenders.", fc(238794)],
      ["fc-haaland", "Haaland", "haaland", "Goal Machine", "ST", "platinum", "Hat-trick Hero", "Score a hat-trick in one match.", ["Play a striker", "Score three goals", "Win the match"], "Box. Shot. Goal. Repeat.", fc(239085)],
      ["fc-mbappe", "Mbappé", "mbappe", "Rocket Pace", "ST", "diamond", "Weekend League", "Win 15 Weekend League matches.", ["Qualify for Weekend League", "Play the weekend", "Win 15"], "Gone before the defender turns.", fc(231747)],
      ["fc-ronaldo", "Ronaldo", "ronaldo", "Siuuu", "ST", "diamond", "Big Game Player", "Score the winner in a cup final.", ["Reach a cup final", "Score late", "Win the cup"], "Built for the biggest nights.", fc(20801)],
      ["fc-messi", "Messi", "messi", "GOAT", "RW", "ultra", "Team of the Season", "Finish Elite in Division Rivals.", ["Play Division Rivals", "Reach Elite", "Finish the season there"], "The greatest of all time.", fc(158023)],
    ]),
  },
  {
    id: "clashroyale",
    name: "Clash Royale",
    code: "CRL",
    genre: "strategy",
    tagline: "Real-time duels. Build a deck, take the crowns.",
    palette: ["#0d1a33", "#3b8ff0"],
    quests: quests([
      ["cr-knight", "Knight", "cr-knight", "Tank Up", "Troop", "base", "First Crown", "Take your first crown tower.", ["Play a ladder match", "Destroy a crown tower", "Finish the match"], "Cheap, sturdy, reliable.", cr("c/cd/Knight_Render.png")],
      ["cr-archer-queen", "Archer Queen", "archer-queen", "Cloaking Cape", "Champion", "bronze", "Royal Aim", "Win a match with the Archer Queen in your deck.", ["Unlock a champion", "Play the Archer Queen", "Win the match"], "Now you see her.", cr("7/73/Archer_Queen_3.png", "50% 12%")],
      ["cr-princess", "Princess", "princess", "Long Range", "Troop", "silver", "Bridge Spam", "Deal 1,000 damage to towers with the Princess.", ["Play the Princess", "Chip the towers", "Deal 1,000 damage"], "Fire arrows from far away.", cr("9/9b/Princess_6.png", "50% 8%")],
      ["cr-hog", "Hog Rider", "hog-rider", "Hog Cycle", "Troop", "silver", "Hog Rider!", "Win with a three-crown Hog push.", ["Build a Hog deck", "Push every lane", "Three crowns"], "HOG RIDERRR!", cr("1/1d/Hog_Rider_6.png", "50% 30%")],
      ["cr-ewiz", "Electro Wizard", "electro-wizard", "Zap Entry", "Troop", "gold", "Shock Value", "Reset three Inferno charges in one match.", ["Play the Electro Wizard", "Stun the Infernos", "Win the match"], "Shocking entrance every time.", cr("c/ce/Electro_Wizard1.png")],
      ["cr-pekka", "P.E.K.K.A", "pekka", "Butterfly", "Troop", "platinum", "Iron Wall", "Win a 2v2 with a P.E.K.K.A deck.", ["Play 2v2", "Use the P.E.K.K.A", "Win the match"], "Butterflies and destruction.", cr("5/5d/PEKKA_2.png")],
      ["cr-mega-knight", "Mega Knight", "mega-knight", "Jump Smash", "Troop", "diamond", "Grand Challenge", "Get 12 wins in a Grand Challenge.", ["Enter a Grand Challenge", "Keep the streak", "12 wins"], "Lands hard, lands everywhere.", cr("2/2d/Mega_Knight_4.png")],
      ["cr-golden-knight", "Golden Knight", "golden-knight", "Dashing Dash", "Champion", "ultra", "Ultimate Champion", "Reach Ultimate Champion in Path of Legends.", ["Climb Path of Legends", "Reach Champion", "Reach Ultimate Champion"], "Gold, glory and the top of the ladder.", cr("d/dc/Golden_Knight.png", "50% 30%")],
    ]),
  },
  {
    id: "mk1",
    name: "Mortal Kombat 1",
    code: "MK1",
    genre: "fighting",
    tagline: "A new era. Finish him.",
    logo: commons("Mortal-Kombat-1-logo.png", 480),
    palette: ["#140a05", "#e0a32a"],
    quests: quests([
      ["mk-kitana", "Kitana", "kitana", "Royal Fans", "Edenian", "silver", "Fan Service", "Win a match with a 30% combo.", ["Play Kitana", "Land a 30% combo", "Win the match"], "Princess of Eden, deadly with a fan.", wiki("mkwikia", "5/51/Kitana_MK1_render.webp")],
      ["mk-liukang", "Liu Kang", "liu-kang", "Fire God", "Shaolin", "gold", "Flawless Victory", "Win a round without taking damage.", ["Play Kombat League", "Take no damage", "Win the round"], "Keeper of time. Master of flame.", wiki("mkwikia", "e/e9/Liu_Kang_Render_%28MK1%29.png")],
      ["mk-raiden", "Raiden", "raiden", "Thunder God", "Champion", "platinum", "Storm Brewing", "Win ten Kombat League matches.", ["Enter Kombat League", "Win ten", "Rank up"], "Lightning answers his call.", wiki("mkwikia", "c/cd/Raiden_%28MK1%29_Render.png")],
      ["mk-subzero", "Sub-Zero", "sub-zero", "Cryomancer", "Lin Kuei", "diamond", "Cold Blooded", "Perform a Fatality after a flawless round.", ["Play Sub-Zero", "Win flawlessly", "Finish with a Fatality"], "The cold never forgives.", wiki("mkwikia", "7/77/Sub-Zero_MK1_Render.png")],
      ["mk-scorpion", "Scorpion", "scorpion", "Get Over Here", "Shirai Ryu", "ultra", "Finish Him", "Reach Elder God in Kombat League.", ["Climb Kombat League", "Reach Demi-God", "Reach Elder God"], "Vengeance burns forever.", wiki("mkwikia", "0/0f/Scorpion_MK1_Render.png")],
    ]),
  },
  {
    id: "godofwar",
    name: "God of War",
    code: "GOW",
    genre: "action",
    tagline: "A father, a son and the gods of the Nine Realms.",
    logo: commons("God_of_War_Logo.png", 480),
    palette: ["#140d08", "#c9442b"],
    quests: quests([
      ["gow-atreus", "Atreus", "atreus", "Loki", "Archer", "gold", "Spartan Bow", "Defeat 50 enemies with Atreus's arrows.", ["Play God of War Ragnarök", "Command Atreus", "50 arrow kills"], "Boy no more.", wiki("godofwar", "a/a8/Capture_d%E2%80%99%C3%A9cran_2023-01-27_%C3%A0_15.54.20.png", "50% 25%")],
      ["gow-freya", "Freya", "freya", "Vanir Queen", "Witch", "diamond", "Valkyrie Slayer", "Defeat all the Valkyries.", ["Find every Valkyrie", "Defeat them", "Face the Queen"], "Seiðr runs in her veins.", wiki("godofwar", "9/95/Capture_d%E2%80%99%C3%A9cran_2023-01-27_%C3%A0_15.03.43.png", "50% 25%")],
      ["gow-kratos", "Kratos", "kratos", "Ghost of Sparta", "God", "ultra", "God of War", "Finish the game on Give Me God of War difficulty.", ["Select Give Me God of War", "Beat every boss", "Finish the story"], "Boy. We are going to Asgard.", wiki("godofwar", "e/e9/Kratos-_GOW_Ragnarok.png")],
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
