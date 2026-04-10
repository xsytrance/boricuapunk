"use client";

import { useEffect, useRef } from "react";

const HM_CURSOR_AUTO = 'url("/cursors/hackermouth-pointer.svg") 3 2, auto';
const HM_CURSOR_POINTER =
  'url("/cursors/hackermouth-pointer.svg") 3 2, pointer';

const DURATION_MS = {
  hijack: 900,
  toast: 520,
  context: 300,
  nodeExpansion: 380,
  glitch: 450,
} as const;

/**
 * Swaps the site cursor to Hackermouth green only while Hackermouth is “doing something”
 * (events + brief hm-glitch). Idle = Manus pointer via CSS fallback.
 */
export default function HackermouthCursor() {
  const endAtRef = useRef(0);
  const revertTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const root = document.documentElement;

    const scheduleRevert = () => {
      if (revertTimerRef.current !== null) {
        clearTimeout(revertTimerRef.current);
        revertTimerRef.current = null;
      }
      const now = Date.now();
      const wait = Math.max(0, endAtRef.current - now);
      revertTimerRef.current = window.setTimeout(() => {
        revertTimerRef.current = null;
        endAtRef.current = 0;
        root.style.removeProperty("--hm-app-cursor");
        root.style.removeProperty("--hm-app-cursor-pointer");
      }, wait);
    };

    const arm = (ms: number) => {
      const now = Date.now();
      endAtRef.current = Math.max(endAtRef.current, now + ms);
      root.style.setProperty("--hm-app-cursor", HM_CURSOR_AUTO);
      root.style.setProperty("--hm-app-cursor-pointer", HM_CURSOR_POINTER);
      scheduleRevert();
    };

    const onHijack = () => arm(DURATION_MS.hijack);
    const onToast = () => arm(DURATION_MS.toast);
    const onContext = () => arm(DURATION_MS.context);
    const onNodeExpansion = () => arm(DURATION_MS.nodeExpansion);

    window.addEventListener("hackermouth:hijack", onHijack);
    window.addEventListener("hackermouth:toast", onToast);
    window.addEventListener("hackermouth:context", onContext);
    window.addEventListener("hackermouth:node-expansion", onNodeExpansion);

    let glitchOn = document.body.classList.contains("hm-glitch");
    const mo = new MutationObserver(() => {
      const nowGlitch = document.body.classList.contains("hm-glitch");
      if (nowGlitch && !glitchOn) {
        arm(DURATION_MS.glitch);
      }
      glitchOn = nowGlitch;
    });
    mo.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.removeEventListener("hackermouth:hijack", onHijack);
      window.removeEventListener("hackermouth:toast", onToast);
      window.removeEventListener("hackermouth:context", onContext);
      window.removeEventListener("hackermouth:node-expansion", onNodeExpansion);
      mo.disconnect();
      if (revertTimerRef.current !== null) {
        clearTimeout(revertTimerRef.current);
      }
      root.style.removeProperty("--hm-app-cursor");
      root.style.removeProperty("--hm-app-cursor-pointer");
    };
  }, []);

  return null;
}
