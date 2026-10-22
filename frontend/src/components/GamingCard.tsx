import { assignInlineVars } from "@vanilla-extract/dynamic";
import { useMemo, useState, type ReactNode } from "react";
import type { Game, Photo } from "../data/catalog";
import { portraitSvg, svgDataUrl } from "../lib/cardArt";
import { skillsFor, TIER_LABEL, type Tier } from "../lib/metadata";
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
  /** Character photo shown over the generated backdrop (falls back to the drawn portrait if it fails). */
  photo?: Photo;
  /** Official game logo (shown white). */
  logo?: string;
  /** Game name, used as a text logo when there's no logo image. */
  gameName?: string;
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
  const showPhoto = !!p.photo && !photoFailed;
  const art = useMemo(() => svgDataUrl(portraitSvg(p.seed, p.genre, 0, showPhoto)), [p.seed, p.genre, showPhoto]);
  const style = assignInlineVars({ [s.frameVar]: frameGradient(p.tier), [s.glowVar]: look.glow, [s.inkVar]: look.ink });
  const skills = useMemo(() => skillsFor(p.genre, p.power, p.seed), [p.genre, p.power, p.seed]);
  const label = p.label ?? `${p.character}, ${TIER_LABEL[p.tier]} card, overall ${p.power}`;

  const body = (
    <>
      <div className={s.frame} style={{ padding: `${look.thickness}cqw` }}>
        <div className={s.face}>
          <img className={s.art} src={art} alt="" decoding="async" />
          {p.tier !== "base" && <div className={s.tint} />}
          {showPhoto && p.photo!.fit === "fut" && (
            <img className={s.photoFut} src={p.photo!.src} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setPhotoFailed(true)} />
          )}
          {showPhoto && p.photo!.fit === "cover" && (
            <img className={s.photo} style={{ objectPosition: p.photo!.pos }} src={p.photo!.src} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setPhotoFailed(true)} />
          )}
          {showPhoto && p.photo!.fit === "banner" && (
            <img
              className={s.photoBanner}
              style={{ left: `${p.photo!.crop?.[0] ?? -95}%`, top: `${p.photo!.crop?.[1] ?? -6}%`, width: `${p.photo!.crop?.[2] ?? 290}%` }}
              src={p.photo!.src}
              alt=""
              loading="lazy"
              decoding="async"
              onError={() => setPhotoFailed(true)}
            />
          )}
          <div className={s.artFade} />
          <div className={s.rating}>
            <span className={s.power}>{p.power}</span>
            <span className={s.ovr}>OVR</span>
            <span className={s.code}>{p.code}</span>
            {p.role && <span className={s.roleText}>{p.role}</span>}
          </div>
          <div className={s.gem} title={TIER_LABEL[p.tier]} />
          <div className={s.tierTag}>{TIER_LABEL[p.tier]}</div>
          <div className={s.plate}>
            {p.logo ? (
              <img className={s.logo} src={p.logo} alt={p.gameName ?? p.code} loading="lazy" decoding="async" referrerPolicy="no-referrer" />
            ) : p.gameName ? (
              <div className={s.logoText}>{p.gameName}</div>
            ) : null}
            <div className={`${s.character} ${p.character.length > 13 ? s.characterLong : p.character.length > 10 ? s.characterMid : ""}`}>{p.character}</div>
            <div className={s.title}>{p.title}</div>
            <div className={s.divider} />
            <div className={s.skills}>
              {skills.map((k) => (
                <span key={k.label} className={s.skill}>
                  <b className={s.skillValue}>{k.value}</b> {k.label}
                </span>
              ))}
            </div>
            <div className={s.stats}>
              <span>{TIER_LABEL[p.tier]}</span>
              {p.footer && <span className={s.statCut}>{p.footer}</span>}
              {p.serial && <span>{p.serial}</span>}
            </div>
          </div>
          {look.lines >= 1 && <div className={s.line1} />}
          {look.lines >= 2 && <div className={s.line2} />}
          {look.lines >= 3 && <div className={s.line3} />}
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
    photo: quest.reward.photo,
    logo: game.logo,
    gameName: game.name,
    power,
    footer: quest.title,
  };
}
