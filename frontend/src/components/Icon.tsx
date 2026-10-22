import { icon } from "../styles/ui.css";

/** Small stroke icons drawn inline, so there's no icon font to download. */
const PATHS = {
  home: "M3 11 12 3l9 8M5 9.5V21h5v-6h4v6h5V9.5",
  games: "M6 8h12a4 4 0 0 1 4 4v1a4 4 0 0 1-7 2.6L14 15h-4l-1 .6A4 4 0 0 1 2 13v-1a4 4 0 0 1 4-4ZM7 11v3M5.5 12.5h3M15.5 12h.01M17.5 13.5h.01",
  trophy: "M8 4h8v5a4 4 0 0 1-8 0V4ZM8 6H4.5a3 3 0 0 0 3.5 4M16 6h3.5a3 3 0 0 1-3.5 4M12 13v4M8 21h8M9.5 17h5v4h-5z",
  bag: "M5 8h14l-1 13H6L5 8ZM9 8V6a3 3 0 0 1 6 0v2",
  anvil: "M3 7h13a5 5 0 0 1-5 5H9v2h3v3H6v-3h3v-2H8a5 5 0 0 1-5-5ZM16 7h5v3h-3",
  wallet: "M3 7a2 2 0 0 1 2-2h13v4M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2ZM16 14.5h.01",
  out: "M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l5-5-5-5M15 12H3",
  quest: "M7 3h10a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V5a2 2 0 0 1 2-2ZM9 8h6M9 12h6",
  gift: "M4 10h16v11H4zM2 7h20v3H2zM12 7v14M12 7c-2-4-6-4-6-1.5S10 7 12 7Zm0 0c2-4 6-4 6-1.5S14 7 12 7Z",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM20 20l-4-4",
  link: "M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5",
  check: "M5 12.5 10 17l9-10",
  upload: "M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3",
  arrow: "M5 12h14M13 6l6 6-6 6",
  back: "M19 12H5M11 6l-6 6 6 6",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6 6 18",
  sword: "M14.5 3H21v6.5L10 20.5 3.5 14 14.5 3ZM6 12l6 6M4 20l2-2",
  crosshair: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM12 1v5M12 18v5M1 12h5M18 12h5",
  flag: "M5 21V4M5 4h11l-2 4 2 4H5",
  castle: "M4 21V9l2-1V5h2v2h2V5h4v2h2V5h2v3l2 1v12H4ZM10 21v-5h4v5",
  ball: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM12 7l4 3-1.5 4.5h-5L8 10l4-3ZM12 3v4M20.5 9.5 16 10M3.5 9.5 8 10M17 19l-2.5-4.5M7 19l2.5-4.5",
  shield: "M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3ZM9 12l2 2 4-4",
  crown: "M3 8l4 4 5-7 5 7 4-4-2 11H5L3 8ZM5 19h14",
  flame: "M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-6 1 1 2 2 2 3 1-2 1-5 1-7Z",
  storm: "M12 3a9 9 0 1 0 9 9M12 7a5 5 0 1 0 5 5M12 11a1 1 0 1 0 1 1",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      className={className ?? icon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

export const GENRE_ICON: Record<string, IconName> = {
  tactical: "crosshair",
  royale: "storm",
  moba: "castle",
  sports: "ball",
  fighting: "sword",
  hero: "shield",
  strategy: "crown",
  action: "flame",
};
