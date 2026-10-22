import { GameTile } from "../components/Cards";
import { GENRE_ICON, Icon } from "../components/Icon";
import { GAMES, GENRES, genreById } from "../data/catalog";
import { href } from "../state/route";
import * as ui from "../styles/ui.css";
import * as s from "./pages.css";

export function Games({ genreId }: { genreId?: string }) {
  const genre = genreId ? genreById(genreId) : undefined;
  const list = genre ? GAMES.filter((g) => g.genre === genre.id) : GAMES;

  return (
    <section className={ui.section}>
      <div className={ui.container}>
        <div className={ui.sectionHeader}>
          <span className={ui.kicker}>{genre ? "Genre" : "Library"}</span>
          <h2 className={ui.sectionTitle}>{genre ? genre.name : "All games"}</h2>
          <div className={ui.underline} />
          <p className={ui.sectionLead}>{genre ? genre.blurb : "Pick a game to see its quests and the cards they drop."}</p>
        </div>

        <nav className={s.tabs} aria-label="Genres">
          <a className={s.tab} href={href("games")} aria-current={!genre ? "page" : undefined}>
            All
          </a>
          {GENRES.map((g) => (
            <a key={g.id} className={s.tab} href={href("games", g.id)} aria-current={genre?.id === g.id ? "page" : undefined}>
              <Icon name={GENRE_ICON[g.id] ?? "games"} />
              {g.name}
            </a>
          ))}
        </nav>

        <div className={s.gameGrid}>
          {list.map((g) => (
            <GameTile key={g.id} game={g} />
          ))}
        </div>
      </div>
    </section>
  );
}
