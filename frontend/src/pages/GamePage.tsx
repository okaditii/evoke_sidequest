import { useMemo } from "react";
import { sameAddress, type Reward } from "../chain/rewards";
import { GameArt } from "../components/Cards";
import { GENRE_ICON, Icon } from "../components/Icon";
import { QuestCard } from "../components/QuestCard";
import { RewardCard } from "../components/RewardCard";
import { gameById, genreById } from "../data/catalog";
import { TIER_RANK } from "../lib/metadata";
import { useApp } from "../state/AppState";
import { href } from "../state/route";
import * as ui from "../styles/ui.css";
import * as s from "./pages.css";

export function GamePage({ gameId, onOpen }: { gameId?: string; onOpen: (r: Reward) => void }) {
  const { rewards, account } = useApp();
  const game = gameId ? gameById(gameId) : undefined;

  const earned = useMemo(() => (game ? rewards.filter((r) => r.meta.game === game.name) : []), [rewards, game]);
  /** A quest counts as claimed once this wallet has minted its card (even if later gifted away). */
  const claimed = useMemo(() => {
    const m = new Map<string, Reward>();
    for (const r of earned) if (r.meta.quest && sameAddress(r.minter, account) && !m.has(r.meta.quest)) m.set(r.meta.quest, r);
    return m;
  }, [earned, account]);

  if (!game) {
    return (
      <section className={ui.section}>
        <div className={`${ui.container} ${ui.empty}`}>
          <p>That game isn't on Evoke yet.</p>
          <a className={ui.button.primary} href={href("games")}>
            Browse games
          </a>
        </div>
      </section>
    );
  }
  const genre = genreById(game.genre)!;
  const quests = [...game.quests].sort((a, b) => TIER_RANK[a.tier] - TIER_RANK[b.tier]);

  return (
    <div className={ui.container}>
      <a className={s.back} href={href("games", genre.id)}>
        <Icon name="back" />
        {genre.name}
      </a>
      <header className={s.banner}>
        <GameArt game={game} className={s.bannerArt} />
        <div className={s.bannerFade} />
        <div className={s.bannerBody}>
          <span className={ui.kicker} style={{ color: genre.color }}>
            <Icon name={GENRE_ICON[genre.id] ?? "games"} />
            {genre.name}
          </span>
          {game.logo && <img className={s.bannerLogo} src={game.logo} alt="" referrerPolicy="no-referrer" />}
          <h1 className={s.bannerTitle}>{game.name}</h1>
          <p className={s.bannerTag}>{game.tagline}</p>
        </div>
      </header>

      <section className={ui.section}>
        <div className={ui.sectionHeader}>
          <span className={ui.kicker}>
            {claimed.size} of {game.quests.length} claimed
          </span>
          <h2 className={ui.sectionTitle}>
            <Icon name="quest" />
            Quests
          </h2>
          <div className={ui.underline} />
          {!account && <p className={ui.sectionLead}>Connect your wallet to claim cards.</p>}
        </div>
        <div className={s.notice}>
          <Icon name="quest" />
          <span>
            Progress is self-reported in this build and saved in your browser. In a live game, the game server would
            confirm a quest was finished before the claim goes through.
          </span>
        </div>
        <div className={s.questList}>
          {quests.map((q) => (
            <QuestCard key={q.id} game={game} quest={q} claimedReward={claimed.get(q.id)} onOpen={onOpen} />
          ))}
        </div>
      </section>

      <section className={ui.section} style={{ paddingTop: 0 }}>
        <div className={ui.sectionHeader}>
          <span className={ui.kicker}>From the chain</span>
          <h2 className={ui.sectionTitle}>Pulled in {game.code}</h2>
          <div className={ui.underline} />
        </div>
        <div className={ui.cardGrid}>
          {earned.length === 0 ? (
            <div className={ui.empty}>
              <Icon name="trophy" className={ui.emptyIcon} />
              <p>No one has pulled a card here yet. Be the first.</p>
            </div>
          ) : (
            earned.map((r) => <RewardCard key={r.id.toString()} reward={r} onOpen={onOpen} />)
          )}
        </div>
      </section>
    </div>
  );
}
