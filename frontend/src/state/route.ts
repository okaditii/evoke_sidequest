import { useEffect, useState } from "react";

export const PAGES = ["home", "games", "game", "rewards", "inventory", "studio"] as const;
export type Page = (typeof PAGES)[number];
export interface Route {
  page: Page;
  /** Genre id for #/games/:genre, game id for #/game/:id. */
  param?: string;
}

const parse = (): Route => {
  const [page, param] = window.location.hash.replace(/^#\/?/, "").split("/");
  return PAGES.includes(page as Page) ? { page: page as Page, param: param ? decodeURIComponent(param) : undefined } : { page: "home" };
};

/** Tiny hash router (#/games/rpg, #/game/hollowroot, ...) so pages are linkable without a server. */
export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(parse);
  useEffect(() => {
    const onHash = () => {
      setRoute(parse());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return route;
}

export const href = (page: Page, param?: string) => `#/${page}${param ? `/${encodeURIComponent(param)}` : ""}`;
