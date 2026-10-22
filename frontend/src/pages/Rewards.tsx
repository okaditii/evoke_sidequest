import { useMemo, useState } from "react";
import type { Reward } from "../chain/rewards";
import { GamingCard, questCardProps } from "../components/GamingCard";
import { Icon } from "../components/Icon";
import { allQuests, GAMES, GENRES } from "../data/catalog";
import { powerFor, TIER_LABEL, TIER_RANK, TIERS, type Tier } from "../lib/metadata";
import { useApp } from "../state/AppState";
import { href } from "../state/route";
import * as ui from "../styles/ui.css";
import * as s from "./pages.css";

type Sort = "tier-desc" | "tier-asc" | "game";

/** The full collection: every card in the catalog, whether or not anyone has minted it yet. */
export function Rewards({ onOpen: _onOpen }: { onOpen: (r: Reward) => void }) {
  const { rewards } = useApp();
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState("all");
  const [game, setGame] = useState("all");
  const [tier, setTier] = useState<Tier | "all">("all");
  const [sort, setSort] = useState<Sort>("tier-desc");

  /** How many times each quest's card has been minted. */
  const pulls = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of rewards) if (r.meta.quest) m.set(r.meta.quest, (m.get(r.meta.quest) ?? 0) + 1);
    return m;
  }, [rewards]);

  const gameOptions = genre === "all" ? GAMES : GAMES.filter((g) => g.genre === genre);
  const cards = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = allQuests().filter(({ quest, game: g }) => {
      if (genre !== "all" && g.genre !== genre) return false;
      if (game !== "all" && g.id !== game) return false;
      if (tier !== "all" && quest.tier !== tier) return false;
      if (!needle) return true;
      return [quest.reward.name, quest.reward.character, quest.title, g.name].some((f) => f.toLowerCase().includes(needle));
    });
    if (sort === "game") return list;
    const dir = sort === "tier-desc" ? -1 : 1;
    return [...list].sort((a, b) => dir * (TIER_RANK[a.quest.tier] - TIER_RANK[b.quest.tier]));
  }, [q, genre, game, tier, sort]);

  return (
    <section className={ui.section}>
      <div className={ui.container}>
        <div className={ui.sectionHeader}>
          <span className={ui.kicker}>The full collection</span>
          <h2 className={ui.sectionTitle}>
            <Icon name="trophy" />
            All Cards
          </h2>
          <div className={ui.underline} />
          <p className={ui.sectionLead}>
            Every card you can earn: {allQuests().length} characters across {GAMES.length} games. Open one to see the quest
            that unlocks it.
          </p>
        </div>

        <div className={s.toolbar}>
          <input className={`${ui.input} ${s.searchBox}`} type="search" placeholder="Search characters, quests or games" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search cards" />
          <select
            className={ui.input}
            value={genre}
            onChange={(e) => {
              setGenre(e.target.value);
              setGame("all");
            }}
            aria-label="Genre"
          >
            <option value="all">All genres</option>
            {GENRES.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
          <select className={ui.input} value={game} onChange={(e) => setGame(e.target.value)} aria-label="Game">
            <option value="all">All games</option>
            {gameOptions.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
          <select className={ui.input} value={tier} onChange={(e) => setTier(e.target.value as typeof tier)} aria-label="Tier">
            <option value="all">All tiers</option>
            {TIERS.map((t) => (
              <option key={t} value={t}>
                {TIER_LABEL[t]}
              </option>
            ))}
          </select>
          <select className={ui.input} value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Sort">
            <option value="tier-desc">Highest tier first</option>
            <option value="tier-asc">Lowest tier first</option>
            <option value="game">By game</option>
          </select>
        </div>

        <div className={`${ui.gallery} ${ui.cardGrid}`}>
          {cards.length === 0 ? (
            <div className={ui.empty}>Nothing matches those filters.</div>
          ) : (
            cards.map(({ quest, game: g }) => {
              const n = pulls.get(quest.id) ?? 0;
              return (
                <GamingCard
                  key={quest.id}
                  {...questCardProps(g, quest, powerFor(quest.tier, quest.id))}
                  badge={n > 0 ? <span className={s.pulled}>Minted ×{n}</span> : undefined}
                  onClick={() => {
                    window.location.hash = href("game", g.id);
                  }}
                  label={`${quest.reward.name}, ${TIER_LABEL[quest.tier]} card from ${g.name}. Earned by: ${quest.title}`}
                />
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
