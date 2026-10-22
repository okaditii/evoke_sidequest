import { useState } from "react";
import { explorerTx } from "../chain/contract";
import type { Reward } from "../chain/rewards";
import { burnReward, friendlyError } from "../chain/wallet";
import { Icon } from "../components/Icon";
import { RewardBrowser } from "../components/RewardBrowser";
import { TIER_LABEL, TIERS } from "../lib/metadata";
import { useApp } from "../state/AppState";
import { href } from "../state/route";
import * as ui from "../styles/ui.css";
import * as s from "./pages.css";

export function Inventory({ onOpen }: { onOpen: (r: Reward) => void }) {
  const { account, connect, connecting, mine, loading, notify, refresh } = useApp();
  const games = new Set(mine.map((m) => m.meta.game)).size;
  const [clearing, setClearing] = useState<"idle" | "confirm" | "busy">("idle");

  /** Sends every card in the deck to the dead address, one wallet signature per card. */
  async function clearDeck() {
    if (!account) return;
    if (clearing === "idle") return setClearing("confirm");
    setClearing("busy");
    let removed = 0;
    try {
      for (const r of mine) {
        const hash = await burnReward(account, r.id);
        removed++;
        notify({ kind: "info", text: `Removed ${r.name} (${removed}/${mine.length}).`, link: { href: explorerTx(hash), label: "Receipt" } });
      }
      notify({ kind: "success", text: "Your deck is clear." });
    } catch (err) {
      notify({ kind: "error", text: friendlyError(err) });
    } finally {
      setClearing("idle");
      await refresh();
    }
  }

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
                <button className={`${ui.button.soft} ${ui.buttonSm}`} disabled={clearing === "busy"} onClick={() => void clearDeck()}>
                  {clearing === "busy" ? <span className={ui.spinner} /> : <Icon name="close" />}
                  {clearing === "confirm" ? `Remove all ${mine.length} cards for good?` : clearing === "busy" ? "Removing…" : "Clear deck"}
                </button>
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
