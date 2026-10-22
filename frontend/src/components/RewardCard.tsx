import { sameAddress, type Reward } from "../chain/rewards";
import { CHARACTER_PHOTOS, gameByName, questById } from "../data/catalog";
import { powerFor, TIER_LABEL } from "../lib/metadata";
import { useApp } from "../state/AppState";
import * as ui from "../styles/ui.css";
import { GamingCard } from "./GamingCard";
import * as s from "./Reward.css";

export function TierPill({ reward }: { reward: Reward }) {
  return <span className={`${ui.tierPill} ${ui.tierText[reward.meta.tier]}`}>{TIER_LABEL[reward.meta.tier]}</span>;
}

/** Every reward is drawn as a card from its on-chain metadata; the same data always draws the same card. */
export function RewardCard({ reward, onOpen }: { reward: Reward; onOpen: (r: Reward) => void }) {
  const { account } = useApp();
  const owned = sameAddress(reward.holder, account);
  const game = gameByName(reward.meta.game);
  const quest = reward.meta.quest ? questById(reward.meta.quest)?.quest : undefined;
  const [first, ...rest] = reward.name.split(" · ");
  const character = reward.meta.character || first || reward.name;

  return (
    <GamingCard
      tier={reward.meta.tier}
      character={character}
      title={rest.join(" · ") || (quest ? quest.title : reward.meta.game)}
      role={quest?.reward.role}
      code={game?.code ?? reward.meta.game.replace(/[^a-z]/gi, "").slice(0, 3).toUpperCase()}
      genre={game?.genre ?? reward.meta.genre}
      seed={reward.meta.seed ?? reward.meta.characterId ?? quest?.reward.characterId ?? `${reward.name}:${reward.id}`}
      photo={CHARACTER_PHOTOS[reward.meta.characterId ?? quest?.reward.characterId ?? ""]}
      power={powerFor(reward.meta.tier, `${reward.id}`)}
      footer={quest?.title ?? game?.name ?? reward.meta.game}
      serial={`#${reward.id.toString()}`}
      badge={owned ? <span className={s.owned}>Yours</span> : undefined}
      onClick={() => onOpen(reward)}
      label={`${reward.name}, ${TIER_LABEL[reward.meta.tier]} card from ${reward.meta.game}`}
    />
  );
}
