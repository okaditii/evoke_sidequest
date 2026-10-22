import type { Reward } from "../chain/rewards";
import { Icon } from "../components/Icon";
import { RewardBrowser } from "../components/RewardBrowser";
import { useApp } from "../state/AppState";
import { href } from "../state/route";
import * as ui from "../styles/ui.css";

export function Rewards({ onOpen }: { onOpen: (r: Reward) => void }) {
  const { rewards, loading, loadError, refresh, legacyCount } = useApp();
  return (
    <section className={ui.section}>
      <div className={ui.container}>
        <div className={ui.sectionHeader}>
          <span className={ui.kicker}>Every pull, on-chain</span>
          <h2 className={ui.sectionTitle}>
            <Icon name="trophy" />
            All Cards
          </h2>
          <div className={ui.underline} />
          <p className={ui.sectionLead}>Read straight from the contract: who pulled each card and who holds it now.</p>
          <button className={`${ui.button.soft} ${ui.buttonSm}`} onClick={() => void refresh()} disabled={loading}>
            {loading && <span className={ui.spinner} />}
            Refresh
          </button>
          {legacyCount > 0 && (
            <p className={ui.help}>
              {legacyCount} earlier upload{legacyCount === 1 ? "" : "s"} on this contract {legacyCount === 1 ? "isn't a game card and is" : "aren't game cards and are"} hidden.
            </p>
          )}
        </div>
        {loadError && (
          <p className={ui.errorText} role="alert" style={{ textAlign: "center", marginBottom: "1rem" }}>
            Couldn't read the contract: {loadError}
          </p>
        )}
        <RewardBrowser
          items={rewards}
          loading={loading}
          onOpen={onOpen}
          empty={
            <div className={ui.empty}>
              <Icon name="trophy" className={ui.emptyIcon} />
              <p>No cards have been pulled yet.</p>
              <a className={ui.button.primary} href={href("games")}>
                Start a quest
              </a>
            </div>
          }
        />
      </div>
    </section>
  );
}
