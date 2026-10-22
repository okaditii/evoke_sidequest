import { useMemo, useState, type ReactNode } from "react";
import type { Reward } from "../chain/rewards";
import { gameByName, GAMES, GENRES } from "../data/catalog";
import { TIER_LABEL, TIER_RANK, TIERS, type Tier } from "../lib/metadata";
import * as s from "../pages/pages.css";
import * as ui from "../styles/ui.css";
import { RewardCard } from "./RewardCard";

type Sort = "newest" | "oldest" | "tier";

const genreOf = (r: Reward) => gameByName(r.meta.game)?.genre ?? r.meta.genre;

interface Props {
  items: Reward[];
  loading: boolean;
  empty: ReactNode;
  onOpen: (r: Reward) => void;
}

export function RewardBrowser({ items, loading, empty, onOpen }: Props) {
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState("all");
  const [game, setGame] = useState("all");
  const [tier, setTier] = useState<Tier | "all">("all");
  const [sort, setSort] = useState<Sort>("newest");

  const gameOptions = genre === "all" ? GAMES : GAMES.filter((g) => g.genre === genre);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = items.filter((r) => {
      if (genre !== "all" && genreOf(r) !== genre) return false;
      if (game !== "all" && r.meta.game !== game) return false;
      if (tier !== "all" && r.meta.tier !== tier) return false;
      if (!needle) return true;
      return [r.name, r.meta.character, r.meta.game, r.meta.lore, `#${r.id}`, r.holder].some((f) => f.toLowerCase().includes(needle));
    });
    if (sort === "oldest") return [...list].sort((a, b) => Number(a.id - b.id));
    if (sort === "tier") return [...list].sort((a, b) => TIER_RANK[b.meta.tier] - TIER_RANK[a.meta.tier] || Number(b.id - a.id));
    return list; // already newest first
  }, [items, q, genre, game, tier, sort]);

  if (loading && items.length === 0) {
    return (
      <div className={ui.cardGrid} aria-busy="true">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className={ui.skeleton} />
        ))}
      </div>
    );
  }
  if (items.length === 0) return <div className={ui.cardGrid}>{empty}</div>;

  return (
    <>
      <div className={s.toolbar}>
        <input className={`${ui.input} ${s.searchBox}`} type="search" placeholder="Search characters, games or #id" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search cards" />
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
            <option key={g.id} value={g.name}>
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
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="tier">Highest tier first</option>
        </select>
      </div>
      <div className={ui.cardGrid}>
        {shown.length === 0 ? (
          <div className={ui.empty}>Nothing matches those filters.</div>
        ) : (
          shown.map((r) => <RewardCard key={r.id.toString()} reward={r} onOpen={onOpen} />)
        )}
      </div>
    </>
  );
}
