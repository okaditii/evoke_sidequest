import { useEffect, useState } from "react";
import type { Reward } from "./chain/rewards";
import { Welcome } from "./components/Fx";
import { Layout } from "./components/Layout";
import { RewardDialog } from "./components/RewardDialog";
import { Toasts } from "./components/Toasts";
import { gameById, genreById } from "./data/catalog";
import { GamePage } from "./pages/GamePage";
import { Games } from "./pages/Games";
import { Home } from "./pages/Home";
import { Inventory } from "./pages/Inventory";
import { Rewards } from "./pages/Rewards";
import { Studio } from "./pages/Studio";
import { useApp } from "./state/AppState";
import { useRoute, type Route } from "./state/route";

function title(route: Route): string {
  switch (route.page) {
    case "games":
      return route.param ? `${genreById(route.param)?.name ?? "Games"} games` : "Games";
    case "game":
      return gameById(route.param ?? "")?.name ?? "Game";
    case "rewards":
      return "All cards";
    case "inventory":
      return "My deck";
    case "studio":
      return "Card studio";
    default:
      return "";
  }
}

export function App() {
  const route = useRoute();
  const { rewards } = useApp();
  const [openId, setOpenId] = useState<bigint | null>(null);
  // Look the item up fresh each render so the dialog reflects transfers after a refresh.
  const open = openId === null ? null : (rewards.find((r) => r.id === openId) ?? null);
  const onOpen = (r: Reward) => setOpenId(r.id);

  useEffect(() => {
    const t = title(route);
    document.title = t ? `${t} · Evoke Sidequest` : "Evoke Sidequest";
  }, [route]);

  return (
    <Layout route={route}>
      {route.page === "home" && <Home onOpen={onOpen} />}
      {route.page === "games" && <Games genreId={route.param} />}
      {route.page === "game" && <GamePage gameId={route.param} onOpen={onOpen} />}
      {route.page === "rewards" && <Rewards onOpen={onOpen} />}
      {route.page === "inventory" && <Inventory onOpen={onOpen} />}
      {route.page === "studio" && <Studio />}
      <RewardDialog reward={open} onClose={() => setOpenId(null)} />
      <Toasts />
      <Welcome />
    </Layout>
  );
}
