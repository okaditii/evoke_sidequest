import { useMemo, type CSSProperties } from "react";
import { gamesInGenre, genreById, type Game, type Genre } from "../data/catalog";
import { coverSvg, svgDataUrl } from "../lib/cardArt";
import { TIER_LABEL, TIER_RANK } from "../lib/metadata";
import { useApp } from "../state/AppState";
import { href } from "../state/route";
import * as ui from "../styles/ui.css";
import * as s from "./Cards.css";
import { GENRE_ICON, Icon } from "./Icon";

const accent = (color: string) => ({ "--accent": color }) as CSSProperties;

/** Generated cover in the Muse palette, with the game's top character standing in it. */
export function GameArt({ game, className }: { game: Game; className?: string }) {
  const src = useMemo(() => svgDataUrl(coverSvg(game.id, "", game.genre)), [game]);
  const star = [...game.quests].sort((a, b) => TIER_RANK[b.tier] - TIER_RANK[a.tier])[0]?.reward.photo;
  return (
    <>
      <img className={className ?? s.coverImg} src={src} alt="" decoding="async" />
      {star && (
        <img
          className={s.coverStar}
          src={star.src}
          alt=""
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          style={{ objectPosition: star.pos }}
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      )}
    </>
  );
}

/** The game's official logo in white, or its name where we have no logo. */
export function GameLogo({ game, className }: { game: Game; className?: string }) {
  return game.logo ? (
    <img className={className ?? s.gameLogo} src={game.logo} alt={game.name} loading="lazy" decoding="async" referrerPolicy="no-referrer" />
  ) : (
    <span className={`${className ?? s.gameLogo} ${s.gameLogoText}`}>{game.name}</span>
  );
}

export function GameTile({ game }: { game: Game }) {
  const { rewards } = useApp();
  const genre = genreById(game.genre)!;
  const earned = rewards.filter((r) => r.meta.game === game.name).length;
  const top = [...game.quests].sort((a, b) => TIER_RANK[b.tier] - TIER_RANK[a.tier])[0];
  return (
    <a className={s.gameTile} href={href("game", game.id)} style={accent(genre.color)}>
      <div className={s.cover}>
        <GameArt game={game} />
        <div className={s.logoScrim}>
          <GameLogo game={game} />
        </div>
        <span className={s.codeChip}>{game.code}</span>
      </div>
      <div className={s.tileBody}>
        <h3 className={s.tileName}>{game.name}</h3>
        <p className={s.tagline}>{game.tagline}</p>
        <div className={s.tileStats}>
          <span className={s.tileStat}>
            <Icon name="quest" />
            {game.quests.length} quests · {earned} earned
          </span>
          {top && <span className={`${ui.tierPill} ${ui.tierText[top.tier]}`}>Up to {TIER_LABEL[top.tier]}</span>}
        </div>
      </div>
    </a>
  );
}

export function GenreTile({ genre }: { genre: Genre }) {
  const games = gamesInGenre(genre.id);
  return (
    <a className={s.genreTile} href={href("games", genre.id)} style={accent(genre.color)}>
      <span className={s.genreIcon}>
        <Icon name={GENRE_ICON[genre.id] ?? "games"} className={s.genreIconSvg} />
      </span>
      <h3 className={s.genreName}>{genre.name}</h3>
      <p className={s.genreMeta}>{genre.blurb}</p>
      <p className={s.genreCount}>
        {games.length} {games.length === 1 ? "game" : "games"} · {games.reduce((n, g) => n + g.quests.length, 0)} quests
      </p>
    </a>
  );
}
