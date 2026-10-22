import { useEffect, useMemo, useState } from "react";
import type { Address } from "viem";
import type { Reward } from "../chain/rewards";
import type { Game, Quest } from "../data/catalog";
import { renderCardSvg, svgToFile } from "../lib/cardSvg";
import { encodeMeta, powerFor, TIER_LABEL, TIER_TASK } from "../lib/metadata";
import * as s from "../pages/pages.css";
import { useApp } from "../state/AppState";
import { useMintFlow } from "../state/useMintFlow";
import * as ui from "../styles/ui.css";
import { GamingCard, questCardProps } from "./GamingCard";
import { Icon } from "./Icon";
import { MintProgress } from "./MintProgress";
import { RewardCard } from "./RewardCard";

const progressKey = (account: Address | null, questId: string) => `evoke:progress:${account ?? "guest"}:${questId}`;

function loadProgress(key: string, n: number): boolean[] {
  try {
    const v = JSON.parse(localStorage.getItem(key) ?? "null") as unknown;
    if (Array.isArray(v) && v.length === n) return v.map(Boolean);
  } catch {
    // storage unavailable or corrupt: start fresh
  }
  return Array(n).fill(false);
}

interface Props {
  game: Game;
  quest: Quest;
  claimedReward?: Reward;
  onOpen: (r: Reward) => void;
}

export function QuestCard({ game, quest, claimedReward, onOpen }: Props) {
  const { account } = useApp();
  const flow = useMintFlow();
  const key = progressKey(account, quest.id);
  const [done, setDone] = useState<boolean[]>(() => loadProgress(key, quest.objectives.length));
  useEffect(() => setDone(loadProgress(key, quest.objectives.length)), [key, quest.objectives.length]);

  const toggle = (i: number) =>
    setDone((d) => {
      const next = d.map((v, j) => (j === i ? !v : v));
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // progress just won't persist
      }
      return next;
    });

  const card = useMemo(() => questCardProps(game, quest, powerFor(quest.tier, quest.id)), [game, quest]);
  const complete = done.every(Boolean);

  async function claim() {
    const svg = renderCardSvg(card);
    await flow.run({
      file: svgToFile(svg, quest.reward.name),
      name: quest.reward.name,
      description: encodeMeta({
        game: game.name,
        genre: game.genre,
        tier: quest.tier,
        character: quest.reward.character,
        characterId: quest.reward.characterId,
        lore: quest.reward.lore,
        quest: quest.id,
      }),
    });
  }

  return (
    <article className={`${ui.glass} ${s.quest}`}>
      <div className={s.questCard}>
        {claimedReward ? <RewardCard reward={claimedReward} onOpen={onOpen} /> : <GamingCard {...card} />}
      </div>
      <div className={s.questBody}>
        <div className={ui.spread}>
          <span className={`${ui.tierPill} ${ui.tierText[quest.tier]}`}>{TIER_LABEL[quest.tier]} card</span>
          <span className={ui.tag}>{TIER_TASK[quest.tier]}</span>
        </div>
        <h3 className={s.questTitle}>{quest.title}</h3>
        <p className={ui.dim}>{quest.blurb}</p>

        {!claimedReward && (
          <ul className={s.objectives}>
            {quest.objectives.map((o, i) => (
              <li key={o}>
                <label className={s.objective}>
                  <input type="checkbox" checked={done[i] ?? false} onChange={() => toggle(i)} disabled={flow.busy} />
                  {o}
                </label>
              </li>
            ))}
          </ul>
        )}

        <div className={s.claimRow}>
          {claimedReward ? (
            <button className={`${ui.button.soft} ${ui.buttonSm}`} onClick={() => onOpen(claimedReward)}>
              <span className={s.claimed}>
                <Icon name="check" />
                Card claimed
              </span>
            </button>
          ) : (
            <button className={ui.button.primary} disabled={!complete || flow.busy} onClick={() => void claim()}>
              {flow.busy ? <span className={ui.spinner} /> : <Icon name="trophy" />}
              {flow.busy ? "Claiming…" : complete ? (account ? "Claim card" : "Connect & claim") : `${done.filter(Boolean).length}/${done.length} done`}
            </button>
          )}
        </div>
        <MintProgress stage={flow.stage} failedAt={flow.failedAt} error={flow.error} txHash={flow.txHash} />
      </div>
    </article>
  );
}
