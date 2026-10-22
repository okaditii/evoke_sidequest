import type { Reward } from "../chain/rewards";
import { Icon } from "../components/Icon";
import { RewardBrowser } from "../components/RewardBrowser";
import { TIER_LABEL, TIERS } from "../lib/metadata";
import { useApp } from "../state/AppState";
import { href } from "../state/route";
import * as ui from "../styles/ui.css";
import * as s from "./pages.css";

export function Inventory({ onOpen }: { onOpen: (r: Reward) => void }) {
  const { account, connect, connecting, mine, loading } = useApp();
  const games = new Set(mine.map((m) => m.meta.game)).size;

  return (
    <section className={ui.section}>
      <div className={ui.container}>
        <div className={ui.sectionHeader}>
          <span className={ui.kicker}>Your collection</span>
          <h2 className={ui.sectionTitle}>
            <Icon name="bag" />
            My Deck
          </h2>
          <div className={ui.underline} />
          <p className={ui.sectionLead}>Every card your wallet holds. Open one to see where it came from, or gift it to a friend.</p>
        </div>

        {!account ? (
          <div className={ui.empty}>
            <Icon name="wallet" className={ui.emptyIcon} />
            <p>Connect your wallet to see your deck.</p>
            <button className={ui.button.primary} onClick={() => void connect()} disabled={connecting}>
              {connecting ? <span className={ui.spinner} /> : <Icon name="wallet" />}
              Connect Wallet
            </button>
          </div>
        ) : (
          <>
            {mine.length > 0 && (
              <div className={s.tally} aria-label="Your cards by tier">
                <span className={s.tallyItem}>
                  <span className={s.tallyNum}>{mine.length}</span> cards
                </span>
                <span className={s.tallyItem}>
                  <span className={s.tallyNum}>{games}</span> games
                </span>
                {TIERS.map((t) => {
                  const n = mine.filter((m) => m.meta.tier === t).length;
                  return n ? (
                    <span key={t} className={`${s.tallyItem} ${ui.tierText[t]}`}>
                      <span className={s.tallyNum}>{n}</span> {TIER_LABEL[t]}
                    </span>
                  ) : null;
                })}
              </div>
            )}
            <RewardBrowser
              items={mine}
              loading={loading}
              onOpen={onOpen}
              empty={
                <div className={ui.empty}>
                  <Icon name="bag" className={ui.emptyIcon} />
                  <p>Your deck is empty. Finish a quest to pull your first card.</p>
                  <a className={ui.button.primary} href={href("games")}>
                    Start a quest
                  </a>
                </div>
              }
            />
          </>
        )}
      </div>
    </section>
  );
}
