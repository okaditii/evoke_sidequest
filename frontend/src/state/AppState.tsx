import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Address } from "viem";
import { fetchAllRewards, sameAddress, type Reward } from "../chain/rewards";
import { currentAccount, friendlyError, requestAccount } from "../chain/wallet";

export interface Toast {
  id: number;
  kind: "info" | "success" | "error";
  text: string;
  link?: { href: string; label: string };
}

interface AppState {
  account: Address | null;
  connecting: boolean;
  connect: () => Promise<Address | null>;
  /** Forget the wallet in this site (wallets can't be disconnected from a page). */
  disconnect: () => void;
  /** Game rewards only. Tokens minted before Evoke (plain uploads) are left out. */
  rewards: Reward[];
  mine: Reward[];
  /** How many non-game tokens the contract holds, so pages can say they're hidden. */
  legacyCount: number;
  loading: boolean;
  loadError: string | null;
  refresh: () => Promise<void>;
  toasts: Toast[];
  notify: (t: Omit<Toast, "id">) => void;
  dismiss: (id: number) => void;
}

const Ctx = createContext<AppState | null>(null);

const DISCONNECTED = "evoke:disconnected";
const store = {
  get: (k: string) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k: string, v: string | null) => {
    try {
      if (v === null) localStorage.removeItem(k);
      else localStorage.setItem(k, v);
    } catch {
      // storage blocked: the setting just won't persist
    }
  },
};

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Address | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [allTokens, setAllTokens] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextToast = useRef(1);

  const dismiss = useCallback((id: number) => setToasts((ts) => ts.filter((t) => t.id !== id)), []);
  const notify = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = nextToast.current++;
      setToasts((ts) => [...ts.slice(-3), { ...t, id }]);
      window.setTimeout(() => dismiss(id), t.kind === "error" ? 9000 : 6000);
    },
    [dismiss],
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setAllTokens(await fetchAllRewards());
      setLoadError(null);
    } catch (err) {
      setLoadError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const connect = useCallback(async () => {
    setConnecting(true);
    try {
      const a = await requestAccount();
      store.set(DISCONNECTED, null);
      setAccount(a);
      return a;
    } catch (err) {
      notify({ kind: "error", text: friendlyError(err) });
      return null;
    } finally {
      setConnecting(false);
    }
  }, [notify]);

  const disconnect = useCallback(() => {
    store.set(DISCONNECTED, "1");
    setAccount(null);
  }, []);

  useEffect(() => {
    void refresh();
    if (store.get(DISCONNECTED) !== "1") {
      void currentAccount().then(setAccount).catch(() => setAccount(null));
    }
    const eth = window.ethereum;
    if (!eth) return;
    const onAccounts = (accounts: Address[]) => {
      if (store.get(DISCONNECTED) !== "1") setAccount(accounts[0] ?? null);
    };
    eth.on("accountsChanged", onAccounts);
    return () => eth.removeListener("accountsChanged", onAccounts);
  }, [refresh]);

  const rewards = useMemo(() => allTokens.filter((r) => !r.meta.legacy), [allTokens]);
  const mine = useMemo(() => rewards.filter((r) => sameAddress(r.holder, account)), [rewards, account]);

  const value: AppState = {
    account,
    connecting,
    connect,
    disconnect,
    rewards,
    mine,
    legacyCount: allTokens.length - rewards.length,
    loading,
    loadError,
    refresh,
    toasts,
    notify,
    dismiss,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used inside AppStateProvider");
  return v;
}
