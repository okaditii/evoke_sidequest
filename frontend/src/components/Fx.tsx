import { useState } from "react";
import { gameById } from "../data/catalog";
import { powerFor } from "../lib/metadata";
import { useApp } from "../state/AppState";
import * as ui from "../styles/ui.css";
import * as s from "./Fx.css";
import { GamingCard, questCardProps, type GamingCardProps } from "./GamingCard";

/** Showcase cards for the hero. */
export function showcase(): GamingCardProps[] {
  const pick = (gameId: string, questId: string) => {
    const game = gameById(gameId)!;
    const quest = game.quests.find((q) => q.id === questId)!;
    return questCardProps(game, quest, powerFor(quest.tier, quest.id));
  };
  return [pick("valorant", "val-ace"), pick("lol", "lol-pentakill"), pick("fortnite", "fn-victory")];
}

/** Soft violet and teal light drifting behind the page. */
export function Orbs() {
  return (
    <div className={s.orbs} aria-hidden="true">
      <div className={s.orb.violet} />
      <div className={s.orb.teal} />
      <div className={s.orb.deep} />
    </div>
  );
}

/** The original Muse hero: three cards floating at different heights; each tilts and shines under the pointer. */
export function CardFan() {
  const [a, b, c] = showcase();
  return (
    <div className={s.art}>
      <div className={s.slot.one}>
        <div className={s.floating.a}>
          <GamingCard {...a!} />
        </div>
      </div>
      <div className={s.slot.two}>
        <div className={s.floating.b}>
          <GamingCard {...b!} />
        </div>
      </div>
      <div className={s.slot.three}>
        <div className={s.floating.c}>
          <GamingCard {...c!} />
        </div>
      </div>
    </div>
  );
}

const WELCOMED = "evoke:welcomed";
const seen = () => {
  try {
    return localStorage.getItem(WELCOMED) === "1";
  } catch {
    return true;
  }
};
const markSeen = () => {
  try {
    localStorage.setItem(WELCOMED, "1");
  } catch {
    // ignore
  }
};

/** The original Muse connect screen, shown on a first visit. */
export function Welcome() {
  const { account, connect, connecting } = useApp();
  const [show, setShow] = useState(() => !seen());
  if (!show || account) return null;
  const close = () => {
    markSeen();
    setShow(false);
  };
  return (
    <div className={s.welcome} role="dialog" aria-modal="true" aria-label="Welcome">
      <div className={s.welcomeInner}>
        <h1 className={s.welcomeTitle}>Evoke Sidequest</h1>
        <p className={s.welcomeSub}>Where your quests become legendary cards</p>
        <div className={s.dots} aria-hidden="true">
          <span className={s.dot} />
          <span className={s.dot} />
          <span className={s.dot} />
        </div>
        <button
          className={s.connect}
          disabled={connecting}
          onClick={async () => {
            if (await connect()) close();
          }}
        >
          {connecting && <span className={ui.spinner} />}
          <span>{connecting ? "Connecting..." : "Connect Wallet"}</span>
          {!connecting && (
            <svg className={s.connectArrow} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
        <button className={s.guest} onClick={close}>
          Explore the cards first
        </button>
      </div>
    </div>
  );
}
