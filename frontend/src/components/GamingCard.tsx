import { assignInlineVars } from "@vanilla-extract/dynamic";
import { useMemo, useState, type ReactNode } from "react";
import { CHARACTER_PHOTOS, type Game } from "../data/catalog";
import { portraitSvg, svgDataUrl } from "../lib/cardArt";
import { TIER_LABEL, TIER_RANK, type Tier } from "../lib/metadata";
import { frameGradient, TIER_LOOK } from "../lib/tiers";
import { useTilt } from "../state/useTilt";
import * as s from "./GamingCard.css";

export interface GamingCardProps {
  tier: Tier;
  character: string;
  title: string;
  role?: string;
  code: string;
  genre?: string;
  /** Seeds the generated portrait; the same seed always draws the same art. */
  seed: string;
  /** Official art URL shown over the generated portrait (falls back to it if the image fails). */
  photo?: string;
  power: number;
  /** Small text bottom-right, e.g. the quest name. */
  footer?: string;
  serial?: string;
  badge?: ReactNode;
  onClick?: () => void;
  label?: string;
  /** Disable pointer tilt (for small thumbnails). */
  still?: boolean;
}

export function GamingCard(p: GamingCardProps) {
  const tilt = useTilt<HTMLElement>(12);
  const [photoFailed, setPhotoFailed] = useState(false);
  const look = TIER_LOOK[p.tier];
  const rank = TIER_RANK[p.tier];
  const art = useMemo(() => svgDataUrl(portraitSvg(p.seed, p.genre, rank)), [p.seed, p.genre, rank]);
  const style = assignInlineVars({ [s.frameVar]: frameGradient(p.tier), [s.glowVar]: look.glow, [s.inkVar]: look.ink });
  const label = p.label ?? `${p.character}, ${TIER_LABEL[p.tier]} card`;

  const body = (
    <>
      <div className={`${s.frame} ${p.tier === "ultra" ? s.frameUltra : ""}`}>
        <div className={s.face}>
          <img className={s.art} src={art} alt="" decoding="async" />
          {p.photo && !photoFailed && (
            <img className={s.photo} src={p.photo} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setPhotoFailed(true)} />
          )}
          <div className={s.artFade} />
          <div className={s.rating}>
            <span className={s.power}>{p.power}</span>
            <span className={s.code}>{p.code}</span>
            {p.role && <span className={s.roleText}>{p.role}</span>}
          </div>
          <div className={s.gem} title={TIER_LABEL[p.tier]} />
          <div className={s.plate}>
            <div className={s.character}>{p.character}</div>
            <div className={s.title}>{p.title}</div>
            <div className={s.divider} />
            <div className={s.stats}>
              <span>{TIER_LABEL[p.tier]}</span>
              {p.footer && <span className={s.statCut}>{p.footer}</span>}
              {p.serial && <span>{p.serial}</span>}
            </div>
          </div>
          {rank >= 2 && <div className={s.sheen} />}
          <div className={s.glare} />
        </div>
      </div>
      {p.badge && <div className={s.badge}>{p.badge}</div>}
    </>
  );

  const handlers = p.still ? {} : tilt;
  if (p.onClick) {
    return (
      <button className={`${s.root} ${s.clickable}`} style={style} onClick={p.onClick} aria-label={label} {...handlers}>
        {body}
      </button>
    );
  }
  return (
    <div className={s.root} style={style} role="img" aria-label={label} {...handlers}>
      {body}
    </div>
  );
}

/** Card for a catalog quest's reward. */
export function questCardProps(game: Game, quest: Game["quests"][number], power: number): GamingCardProps {
  return {
    tier: quest.tier,
    character: quest.reward.character,
    title: quest.reward.name.split(" · ")[1] ?? quest.reward.name,
    role: quest.reward.role,
    code: game.code,
    genre: game.genre,
    seed: quest.reward.characterId,
    photo: CHARACTER_PHOTOS[quest.reward.characterId],
    power,
    footer: quest.title,
  };
}
