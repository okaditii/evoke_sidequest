import { useMemo } from "react";
import type { Reward } from "../chain/rewards";
import { GameTile, GenreTile } from "../components/Cards";
import { CardFan } from "../components/Fx";
import { GamingCard, questCardProps } from "../components/GamingCard";
import { Icon } from "../components/Icon";
import { RewardCard } from "../components/RewardCard";
import { allQuests, GAMES, GENRES } from "../data/catalog";
import { powerFor, TIER_LABEL, TIER_TASK, TIERS, type Tier } from "../lib/metadata";
import { frameGradient, TIER_LOOK } from "../lib/tiers";
import { useApp } from "../state/AppState";
import { href } from "../state/route";
import * as ui from "../styles/ui.css";
import * as s from "./pages.css";

/** One example card per tier for the ladder, each from a different game where possible. */
function ladderCards() {
  const used = new Set<string>();
  return TIERS.map((tier: Tier) => {
    const options = allQuests().filter(({ quest }) => quest.tier === tier);
    const found = options.find(({ game }) => !used.has(game.id)) ?? options[0]!;
    used.add(found.game.id);
    return { tier, props: questCardProps(found.game, found.quest, powerFor(tier, found.quest.id)) };
  });
}

function Ticker() {
  const items = [...TIERS, ...TIERS];
  return (
    <div className={s.ticker} aria-hidden="true">
      <div className={s.tickerTrack}>
        {[...items, ...items].map((t, i) => (
          <span key={i} className={s.tickerItem} style={{ color: TIER_LOOK[t].glow }}>
            <span className={s.tickerGem} style={{ background: frameGradient(t) }} />
            {TIER_LABEL[t]}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Home({ onOpen }: { onOpen: (r: Reward) => void }) {
  const { rewards, loading } = useApp();
  const ladder = useMemo(ladderCards, []);
  const players = useMemo(() => new Set(rewards.map((r) => r.holder.toLowerCase())).size, [rewards]);
  const n = (v: number) => (loading ? "…" : v.toLocaleString());

  return (
    <>
      <div className={ui.container}>
        <section className={s.hero}>
          <div className={s.heroContent}>
            <h1 className={s.heroTitle}>
              Discover & Collect <span className={ui.gradientText}>Legendary Game Cards</span>
            </h1>
            <p className={s.heroLead}>
              Finish sidequests in Valorant, League, EA SPORTS FC, Clash Royale, Mortal Kombat, God of War and more. Every one drops a character card into your
              wallet, from Bronze all the way to Ultra Legendary.
            </p>
            <div className={ui.row}>
              <a className={ui.button.primary} href={href("games")}>
                <Icon name="games" />
                Get Started
              </a>
              <a className={ui.button.secondary} href={href("rewards")}>
                <Icon name="trophy" />
                See the cards
              </a>
            </div>
            <div className={s.heroStats}>
              {[
                { v: n(GAMES.length), l: "Games" },
                { v: n(allQuests().length), l: "Quests" },
                { v: n(rewards.length), l: "Cards pulled" },
                { v: n(players), l: "Players" },
              ].map((st) => (
                <div key={st.l} className={s.heroStat}>
                  <span className={s.heroStatNum}>{st.v}</span>
                  <span className={s.heroStatLabel}>{st.l}</span>
                </div>
              ))}
            </div>
          </div>
          <CardFan />
        </section>
      </div>

      <Ticker />

      <section className={ui.section}>
        <div className={ui.container}>
          <div className={ui.sectionHeader}>
            <span className={ui.kicker}>Seven tiers</span>
            <h2 className={ui.sectionTitle}>
              <Icon name="trophy" />
              Climb the Ladder
            </h2>
            <div className={ui.underline} />
            <p className={ui.sectionLead}>The harder the task, the shinier the card. Hover one to catch the light.</p>
          </div>
          <div className={s.ladder}>
            {ladder.map(({ tier, props }) => (
              <div key={tier} className={s.rung}>
                <GamingCard {...props} />
                <span className={s.rungName} style={{ color: TIER_LOOK[tier].glow }}>
                  {TIER_LABEL[tier]}
                </span>
                <span className={s.rungTask}>{TIER_TASK[tier]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={ui.section} style={{ paddingTop: 0 }}>
        <div className={ui.container}>
          <div className={ui.sectionHeader}>
            <span className={ui.kicker}>Pick your arena</span>
            <h2 className={ui.sectionTitle}>
              <Icon name="games" />
              Browse by Genre
            </h2>
            <div className={ui.underline} />
          </div>
          <div className={s.genreGrid}>
            {GENRES.map((g) => (
              <GenreTile key={g.id} genre={g} />
            ))}
          </div>
        </div>
      </section>

      <section className={ui.section} style={{ paddingTop: 0 }}>
        <div className={ui.container}>
          <div className={ui.sectionHeader}>
            <span className={ui.kicker}>Now playing</span>
            <h2 className={ui.sectionTitle}>
              <Icon name="flag" />
              Featured Games
            </h2>
            <div className={ui.underline} />
          </div>
          <div className={s.gameGrid}>
            {GAMES.slice(0, 6).map((g) => (
              <GameTile key={g.id} game={g} />
            ))}
          </div>
          <div className={s.centerRow}>
            <a className={ui.button.soft} href={href("games")}>
              All {GAMES.length} games
              <Icon name="arrow" />
            </a>
          </div>
        </div>
      </section>

      {rewards.length > 0 && (
        <section className={ui.section} style={{ paddingTop: 0 }}>
          <div className={ui.container}>
            <div className={ui.sectionHeader}>
              <span className={ui.kicker}>Fresh pulls</span>
              <h2 className={ui.sectionTitle}>
                <Icon name="trophy" />
                Latest Drops
              </h2>
              <div className={ui.underline} />
            </div>
            <div className={`${ui.gallery} ${ui.cardGrid}`}>
              {rewards.slice(0, 5).map((r) => (
                <RewardCard key={r.id.toString()} reward={r} onOpen={onOpen} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
