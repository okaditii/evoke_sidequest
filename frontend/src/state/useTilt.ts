import { useCallback, useRef } from "react";

const canTilt = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * 3D tilt that follows the pointer. It writes CSS variables straight onto the element
 * (one update per animation frame, no React re-renders), so it costs almost nothing.
 * Styles read --rx / --ry for the rotation and --gx / --gy for the glare position.
 */
export function useTilt<T extends HTMLElement>(max = 10) {
  const frame = useRef(0);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<T>) => {
      if (!canTilt()) return;
      const el = e.currentTarget;
      const { clientX, clientY } = e;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const px = (clientX - r.left) / r.width - 0.5;
        const py = (clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--rx", `${(-py * max).toFixed(2)}deg`);
        el.style.setProperty("--ry", `${(px * max).toFixed(2)}deg`);
        el.style.setProperty("--gx", `${((px + 0.5) * 100).toFixed(1)}%`);
        el.style.setProperty("--gy", `${((py + 0.5) * 100).toFixed(1)}%`);
      });
    },
    [max],
  );

  const onPointerLeave = useCallback((e: React.PointerEvent<T>) => {
    cancelAnimationFrame(frame.current);
    const el = e.currentTarget;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }, []);

  return { onPointerMove, onPointerLeave };
}
