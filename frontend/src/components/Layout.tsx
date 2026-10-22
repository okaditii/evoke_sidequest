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
        <p>© 2026 Evoke Sidequest · game reward cards on Ethereum Sepolia · not affiliated with the games or publishers shown</p>
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
