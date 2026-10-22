import { useEffect, useState, type ReactNode } from "react";
import { CONTRACT_ADDRESS, explorerAddress } from "../chain/contract";
import { shortAddress } from "../chain/rewards";
import { useApp } from "../state/AppState";
import { href, type Page, type Route } from "../state/route";
import * as ui from "../styles/ui.css";
import { Icon, type IconName } from "./Icon";
import { Orbs } from "./Fx";
import * as s from "./Layout.css";

const LINKS: { page: Page; label: string; icon: IconName }[] = [
  { page: "home", label: "Home", icon: "home" },
  { page: "games", label: "Games", icon: "games" },
  { page: "rewards", label: "Cards", icon: "trophy" },
  { page: "inventory", label: "My Deck", icon: "bag" },
  { page: "studio", label: "Studio", icon: "anvil" },
];

const isActive = (link: Page, route: Route) => link === route.page || (link === "games" && route.page === "game");

export function Layout({ route, children }: { route: Route; children: ReactNode }) {
  const { account, connect, connecting, disconnect, mine } = useApp();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [route]);

  return (
    <>
      <nav className={s.navbar} aria-label="Main">
        <div className={s.logoGroup}>
          <a className={s.logo} href={href("home")}>
            Evoke Sidequest
          </a>
          {account && (
            <a className={s.walletPill} href={explorerAddress(account)} target="_blank" rel="noreferrer" title={account}>
              <Icon name="wallet" />
              {shortAddress(account)}
            </a>
          )}
        </div>
        <ul className={`${s.links} ${open ? s.linksOpen : ""}`}>
          {LINKS.map((l) => (
            <li key={l.page}>
              <a className={s.link} href={href(l.page)} aria-current={isActive(l.page, route) ? "page" : undefined}>
                <Icon name={l.icon} />
                {l.label}
                {l.page === "inventory" && mine.length > 0 && <span className={s.count}>{mine.length}</span>}
              </a>
            </li>
          ))}
          <li>
            {account ? (
              <button className={s.authButton} onClick={disconnect}>
                <Icon name="out" />
                Disconnect
              </button>
            ) : (
              <button className={`${ui.button.primary} ${ui.buttonSm}`} onClick={() => void connect()} disabled={connecting}>
                {connecting ? <span className={ui.spinner} /> : <Icon name="wallet" />}
                {connecting ? "Connecting…" : "Connect Wallet"}
              </button>
            )}
          </li>
        </ul>
        <button className={s.hamburger} onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
          <span className={s.line} style={open ? { transform: "translateY(7px) rotate(45deg)" } : undefined} />
          <span className={s.line} style={open ? { opacity: 0 } : undefined} />
          <span className={s.line} style={open ? { transform: "translateY(-7px) rotate(-45deg)" } : undefined} />
        </button>
      </nav>

      <Orbs />
      <main>{children}</main>

      <footer className={s.footer}>
        <p>© 2026 Evoke Sidequest · game reward cards on Ethereum Sepolia · a free, non-commercial fan project</p>
        <p style={{ fontSize: "12px", color: "#75758c", maxWidth: "900px", margin: "0 auto" }}>
          Evoke Sidequest isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone
          officially involved in producing or managing Riot Games properties. Riot Games and all associated properties
          are trademarks or registered trademarks of Riot Games, Inc. Portions of the materials used are trademarks
          and/or copyrighted works of Epic Games, Inc. All rights reserved by Epic. This material is not official and is
          not endorsed by Epic. Other game names are trademarks of their respective owners.
        </p>
        <p style={{ fontSize: "12px", color: "#75758c", maxWidth: "900px", margin: "0 auto" }}>
          Game logos:{" "}
          <a href="https://commons.wikimedia.org/" target="_blank" rel="noreferrer" style={{ color: "inherit" }}>
            Wikimedia Commons
          </a>{" "}
          (CC BY-SA). EA SPORTS FC player portraits from EA's ratings site. Mortal Kombat, God of War, Apex Legends and Overwatch art via their
          Fandom wikis; Clash Royale renders from the Clash Royale wiki. Art is shown from its source and never minted.
        </p>
        <div className={s.footerLinks}>
          <a className={s.footerLink} href={href("games")}>
            Games
          </a>
          <a className={s.footerLink} href={href("rewards")}>
            All cards
          </a>
          <a className={s.footerLink} href={explorerAddress(CONTRACT_ADDRESS)} target="_blank" rel="noreferrer">
            Contract {shortAddress(CONTRACT_ADDRESS)}
          </a>
        </div>
      </footer>
    </>
  );
}
