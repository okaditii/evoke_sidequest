import { useEffect, useRef, useState, type FormEvent } from "react";
import { isAddress, type Address } from "viem";
import { explorerAddress, explorerToken, explorerTx } from "../chain/contract";
import { sameAddress, shortAddress, type Reward } from "../chain/rewards";
import { friendlyError, giftReward } from "../chain/wallet";
import { gameByName, genreById, questById } from "../data/catalog";
import { gatewayUrl } from "../lib/ipfs";
import { useApp } from "../state/AppState";
import { href } from "../state/route";
import * as ui from "../styles/ui.css";
import { Icon } from "./Icon";
import * as s from "./Reward.css";
import { RewardCard, TierPill } from "./RewardCard";

function AddressLink({ address, account }: { address: Address; account: Address | null }) {
  return (
    <a href={explorerAddress(address)} target="_blank" rel="noreferrer" className={ui.mono}>
      {shortAddress(address)}
      {sameAddress(address, account) ? " (you)" : ""}
    </a>
  );
}

export function RewardDialog({ reward, onClose }: { reward: Reward | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const { account, notify, refresh } = useApp();
  const [to, setTo] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (reward && !d.open) d.showModal();
    if (!reward && d.open) d.close();
    setTo("");
    setError(null);
  }, [reward]);

  if (!reward) return <dialog ref={ref} className={s.dialog} onClose={onClose} />;

  const owned = sameAddress(reward.holder, account);
  const quest = reward.meta.quest ? questById(reward.meta.quest)?.quest : undefined;
  const game = gameByName(reward.meta.game);
  const genre = genreById(game?.genre ?? reward.meta.genre ?? "");

  async function gift(e: FormEvent) {
    e.preventDefault();
    if (!account || !reward) return;
    const target = to.trim();
    if (!isAddress(target)) return setError("That isn't a valid wallet address (0x… with 40 hex characters).");
    if (sameAddress(target, account)) return setError("That's your own wallet.");
    setBusy(true);
    setError(null);
    try {
      const hash = await giftReward(account, target, reward.id, (h) =>
        notify({ kind: "info", text: "Gift sent. Waiting for confirmation…", link: { href: explorerTx(h), label: "View" } }),
      );
      notify({ kind: "success", text: `${reward.name} is now in ${shortAddress(target)}'s deck.`, link: { href: explorerTx(hash), label: "Receipt" } });
      onClose();
      await refresh();
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <dialog ref={ref} className={s.dialog} onClose={onClose} onClick={(e) => e.target === ref.current && onClose()} aria-labelledby="reward-title">
      <button className={`${ui.button.soft} ${ui.buttonSm} ${s.close}`} onClick={onClose} aria-label="Close">
        <Icon name="close" />
      </button>
      <div className={s.dialogGrid}>
        <div className={s.dialogArt}>
          <div className={s.dialogCard}>
            <RewardCard reward={reward} onOpen={() => undefined} />
          </div>
        </div>
        <div className={s.dialogBody}>
          <div className={ui.row}>
            <TierPill reward={reward} />
            <span className={ui.tag}>Card #{reward.id.toString()}</span>
          </div>
          <h2 id="reward-title" className={s.dialogTitle}>
            {reward.name}
          </h2>
          {reward.meta.lore && <p className={s.lore}>{reward.meta.lore}</p>}
          <dl className={s.facts}>
            <dt className={s.factKey}>Game</dt>
            <dd className={s.factVal}>
              {game ? (
                <a href={href("game", game.id)} onClick={onClose}>
                  {game.name}
                </a>
              ) : (
                reward.meta.game
              )}
              {genre ? ` · ${genre.name}` : ""}
            </dd>
            {quest && (
              <>
                <dt className={s.factKey}>Earned by</dt>
                <dd className={s.factVal}>{quest.title}</dd>
              </>
            )}
            <dt className={s.factKey}>Held by</dt>
            <dd className={s.factVal}>
              <AddressLink address={reward.holder} account={account} />
            </dd>
            <dt className={s.factKey}>Minted by</dt>
            <dd className={s.factVal}>
              <AddressLink address={reward.minter} account={account} />
            </dd>
            <dt className={s.factKey}>Proof</dt>
            <dd className={s.factVal}>
              <a href={explorerToken(reward.id)} target="_blank" rel="noreferrer">
                On Etherscan
              </a>
              {" · "}
              <a href={gatewayUrl(reward.cid)} target="_blank" rel="noreferrer">
                Minted image on IPFS
              </a>
            </dd>
          </dl>

          {owned && (
            <form className={s.giftBox} onSubmit={gift}>
              <div className={ui.field}>
                <label className={ui.label} htmlFor="gift-to">
                  <Icon name="gift" /> Gift to another player
                </label>
                <input id="gift-to" className={ui.input} placeholder="0x… wallet address" value={to} onChange={(e) => setTo(e.target.value)} spellCheck={false} autoComplete="off" />
                <span className={ui.help}>The card leaves your deck for good. Gas is paid in Sepolia ETH.</span>
              </div>
              {error && <p className={ui.errorText}>{error}</p>}
              <button className={ui.button.primary} disabled={busy || !to.trim()}>
                {busy ? <span className={ui.spinner} /> : <Icon name="gift" />}
                {busy ? "Sending…" : "Send gift"}
              </button>
            </form>
          )}
        </div>
      </div>
    </dialog>
  );
}
