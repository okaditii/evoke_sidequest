import { useCallback, useState } from "react";
import type { Address, Hash } from "viem";
import { explorerTx } from "../chain/contract";
import { shortAddress } from "../chain/rewards";
import { friendlyError, giftReward, mintReward } from "../chain/wallet";
import { uploadToIpfs } from "../lib/ipfs";
import { useApp } from "./AppState";

export type Stage = "idle" | "upload" | "sign" | "confirm" | "gift" | "done" | "error";

export interface MintRequest {
  file: File;
  name: string;
  description: string;
  /** Send the new item straight to this wallet after minting (the contract always mints to the sender). */
  giftTo?: Address;
}

/** upload art to IPFS → sign mint → wait for it → optionally transfer to a player. */
export function useMintFlow() {
  const { account, connect, notify, refresh } = useApp();
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<Hash | null>(null);
  const [tokenId, setTokenId] = useState<bigint | null>(null);
  const [failedAt, setFailedAt] = useState<Stage | null>(null);

  const reset = useCallback(() => {
    setStage("idle");
    setError(null);
    setTxHash(null);
    setTokenId(null);
    setFailedAt(null);
  }, []);

  const run = useCallback(
    async (req: MintRequest): Promise<boolean> => {
      setError(null);
      setFailedAt(null);
      const who = account ?? (await connect());
      if (!who) return false;
      let current: Stage = "upload";
      const go = (st: Stage) => {
        current = st;
        setStage(st);
      };
      try {
        go("upload");
        const cid = await uploadToIpfs(req.file, req.name);
        go("sign");
        const { hash, tokenId: id } = await mintReward(who, cid, req.name, req.description, (h) => {
          setTxHash(h);
          go("confirm");
        });
        setTokenId(id);
        if (req.giftTo && id !== null) {
          go("gift");
          await giftReward(who, req.giftTo, id);
          notify({ kind: "success", text: `${req.name} minted and sent to ${shortAddress(req.giftTo)}.`, link: { href: explorerTx(hash), label: "Receipt" } });
        } else {
          notify({ kind: "success", text: `${req.name} is in your inventory.`, link: { href: explorerTx(hash), label: "Receipt" } });
        }
        setStage("done");
        await refresh();
        return true;
      } catch (err) {
        setError(friendlyError(err));
        setFailedAt(current);
        setStage("error");
        return false;
      }
    },
    [account, connect, notify, refresh],
  );

  return { stage, failedAt, error, txHash, tokenId, run, reset, busy: !["idle", "done", "error"].includes(stage) };
}
