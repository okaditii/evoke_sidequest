import { useApp } from "../state/AppState";
import * as s from "./Toasts.css";

export function Toasts() {
  const { toasts, dismiss } = useApp();
  return (
    <div className={s.stack} role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={s.toast[t.kind]}>
          <span className={s.text}>{t.text}</span>
          {t.link && (
            <a href={t.link.href} target="_blank" rel="noreferrer">
              {t.link.label}
            </a>
          )}
          <button className={s.x} onClick={() => dismiss(t.id)} aria-label="Dismiss">
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
