import type { Hash } from "viem";
import { explorerTx } from "../chain/contract";
import type { Stage } from "../state/useMintFlow";
import * as ui from "../styles/ui.css";
import * as s from "./MintProgress.css";

const STEPS: { stage: Stage; label: string }[] = [
  { stage: "upload", label: "Uploading artwork to IPFS" },
  { stage: "sign", label: "Approve the mint in your wallet" },
  { stage: "confirm", label: "Waiting for Sepolia to confirm" },
];
const GIFT_STEP = { stage: "gift" as Stage, label: "Sending it to the player" };

interface Props {
  stage: Stage;
  failedAt: Stage | null;
  error: string | null;
  txHash: Hash | null;
  withGift?: boolean;
}

export function MintProgress({ stage, failedAt, error, txHash, withGift }: Props) {
  if (stage === "idle") return null;
  const steps = withGift ? [...STEPS, GIFT_STEP] : STEPS;
  const current = stage === "error" ? failedAt : stage;
  const at = stage === "done" ? steps.length : steps.findIndex((st) => st.stage === current);
  return (
    <div className={s.box} aria-live="polite">
      <ol className={s.list}>
        {steps.map((st, i) => {
          const state = i < at ? "done" : i === at ? (stage === "error" ? "fail" : "now") : "todo";
          return (
            <li key={st.stage} className={s.step[state]}>
              <span className={s.marker}>
                {state === "done" ? "✓" : state === "fail" ? "!" : state === "now" ? <span className={ui.spinner} /> : i + 1}
              </span>
              {st.label}
            </li>
          );
        })}
      </ol>
      {stage === "done" && <p className={s.ok}>Done. It's on-chain.</p>}
      {error && <p className={ui.errorText}>{error}</p>}
      {txHash && (
        <a className={ui.mono} href={explorerTx(txHash)} target="_blank" rel="noreferrer">
          View transaction ↗
        </a>
      )}
    </div>
  );
}
