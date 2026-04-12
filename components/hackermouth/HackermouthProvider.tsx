"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  archiveHoverIntensity,
  archiveSignalHover,
  pickArchiveToast,
  type ArchiveHoverPayload,
} from "@/lib/hackermouthArchive";
import { nextSessionUnit } from "@/lib/sessionRandom";
import { hackermouthSay } from "@/lib/hackermouthSay";
import HackermouthToast from "./HackermouthToast";
import TapeOverlay from "./TapeOverlay";

const TOAST_MESSAGES = [
  "OBSERVING",
  "ACCESS LOGGED",
  "I SEE YOU",
  "SIGNAL INTEGRITY COMPROMISED",
  "ACCESS NODE DETECTED",
  "YOU ARE BEING WATCHED",
  "ARCHIVE INTEGRITY UNSTABLE",
] as const;

const EVENT_CHANCE = 0.125;
const INTERVAL_MIN_MS = 10_000;
const INTERVAL_MAX_MS = 20_000;
const GLITCH_MIN_MS = 200;
const GLITCH_MAX_MS = 400;
const TOAST_MIN_MS = 3000;
const TOAST_MAX_MS = 5000;

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function formatSignalStamp() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function scheduleNextTick(
  fn: () => void,
): ReturnType<typeof globalThis.setTimeout> {
  const delay = randomBetween(INTERVAL_MIN_MS, INTERVAL_MAX_MS);
  return globalThis.setTimeout(fn, delay);
}

type HackermouthContextValue = Record<string, never>;

const HackermouthContext = createContext<HackermouthContextValue | null>(null);

export function useHackermouth() {
  return useContext(HackermouthContext);
}

type HackermouthProviderProps = {
  children: ReactNode;
};

export default function HackermouthProvider({
  children,
}: HackermouthProviderProps) {
  const [cursorCorrupt, setCursorCorrupt] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastStamp, setToastStamp] = useState<string>("");
  const [toastVisible, setToastVisible] = useState(false);
  const cursorCorruptLocked = useRef(false);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const archiveIntensityRef = useRef(0);
  const archiveCorruptRef = useRef(false);

  const showToast = useCallback((message: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }
    setToastMessage(hackermouthSay(message));
    setToastStamp(formatSignalStamp());
    setToastVisible(true);
    const hideMs = randomBetween(TOAST_MIN_MS, TOAST_MAX_MS);
    toastTimeoutRef.current = setTimeout(() => {
      setToastVisible(false);
      toastTimeoutRef.current = null;
      setTimeout(() => setToastMessage(null), 400);
    }, hideMs);
  }, []);

  const triggerGlitch = useCallback(() => {
    const ms = randomBetween(GLITCH_MIN_MS, GLITCH_MAX_MS);
    document.body.classList.add("hm-glitch");
    window.setTimeout(() => {
      document.body.classList.remove("hm-glitch");
    }, ms);
  }, []);

  const triggerCursorCorrupt = useCallback(() => {
    if (cursorCorruptLocked.current) return;
    cursorCorruptLocked.current = true;
    setCursorCorrupt(true);
    document.body.classList.add("hm-cursor-corrupt");
    const root = document.documentElement;
    if (!root.style.getPropertyValue("--hm-cx")) {
      root.style.setProperty("--hm-cx", "50vw");
      root.style.setProperty("--hm-cy", "50vh");
    }
  }, []);

  const runRandomEvent = useCallback(() => {
    const boosted =
      EVENT_CHANCE +
      archiveIntensityRef.current * 0.22 +
      (archiveCorruptRef.current ? 0.12 : 0);
    if (Math.random() > Math.min(0.55, boosted)) return;

    const roll = Math.random();
    if (roll < 0.35) {
      const msg =
        TOAST_MESSAGES[Math.floor(Math.random() * TOAST_MESSAGES.length)]!;
      showToast(msg);
    } else if (roll < 0.65) {
      triggerGlitch();
    } else if (!cursorCorruptLocked.current) {
      triggerCursorCorrupt();
    } else if (Math.random() < 0.5) {
      showToast(
        TOAST_MESSAGES[Math.floor(Math.random() * TOAST_MESSAGES.length)]!,
      );
    } else {
      triggerGlitch();
    }
  }, [showToast, triggerGlitch, triggerCursorCorrupt]);

  useEffect(() => {
    const loop = () => {
      if (Math.random() < 0.05) {
        window.dispatchEvent(new CustomEvent("hackermouth:node-expansion"));
      }
      runRandomEvent();
      tickRef.current = scheduleNextTick(loop);
    };
    tickRef.current = scheduleNextTick(loop);
    return () => {
      if (tickRef.current) clearTimeout(tickRef.current);
    };
  }, [runRandomEvent]);

  useEffect(() => {
    if (!cursorCorrupt) return;
    document.body.classList.add("hm-active");
    return () => {
      document.body.classList.remove("hm-active");
    };
  }, [cursorCorrupt]);

  useEffect(() => {
    if (!cursorCorrupt) return;
    if (!document.querySelector("[data-hm-quote-zone]")) return;
    document.body.classList.add("hm-quote-corruption");
    const t = window.setTimeout(() => {
      document.body.classList.remove("hm-quote-corruption");
    }, 2800);
    return () => {
      window.clearTimeout(t);
      document.body.classList.remove("hm-quote-corruption");
    };
  }, [cursorCorrupt]);

  useEffect(() => {
    if (!cursorCorrupt) return;
    let active = true;
    let nextId: number | null = null;
    let burstId: number | null = null;

    const schedule = () => {
      nextId = window.setTimeout(() => {
        if (!active) return;
        const shell = document.getElementById("hm-app-shell");
        if (shell) {
          const xr = Math.random() < 0.5 ? -1 : 1;
          const yr = Math.random() < 0.5 ? -1 : 1;
          const x = xr * (1 + Math.floor(Math.random() * 2));
          const y = yr * (1 + Math.floor(Math.random() * 2));
          shell.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          burstId = window.setTimeout(() => {
            burstId = null;
            if (active) shell.style.removeProperty("transform");
          }, randomBetween(80, 180)) as unknown as number;
        }
        if (active) schedule();
      }, randomBetween(300, 600)) as unknown as number;
    };

    schedule();

    return () => {
      active = false;
      if (nextId !== null) window.clearTimeout(nextId);
      if (burstId !== null) window.clearTimeout(burstId);
      document.getElementById("hm-app-shell")?.style.removeProperty("transform");
    };
  }, [cursorCorrupt]);

  useEffect(() => {
    if (!cursorCorrupt) return;
    const onMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--hm-cx", `${e.clientX}px`);
      document.documentElement.style.setProperty("--hm-cy", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [cursorCorrupt]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const onQuoteAppear = () => {
      const msg =
        TOAST_MESSAGES[Math.floor(Math.random() * TOAST_MESSAGES.length)]!;
      showToast(msg);
    };
    window.addEventListener("hackermouth:quote-appear", onQuoteAppear);
    return () =>
      window.removeEventListener("hackermouth:quote-appear", onQuoteAppear);
  }, [showToast]);

  useEffect(() => {
    const onArchiveHover = (ev: Event) => {
      const e = ev as CustomEvent<ArchiveHoverPayload>;
      const d = e.detail;
      if (!d?.tags) return;
      archiveIntensityRef.current = archiveHoverIntensity(d);
      archiveCorruptRef.current = archiveSignalHover(d.tags);
      const toast = pickArchiveToast(d, nextSessionUnit);
      if (toast) showToast(toast);
      if (archiveIntensityRef.current > 0.5 && nextSessionUnit() < 0.42) {
        triggerGlitch();
      }
    };
    const onArchiveLeave = () => {
      archiveIntensityRef.current = 0;
      archiveCorruptRef.current = false;
    };
    window.addEventListener(
      "hackermouth:archive-hover",
      onArchiveHover as EventListener,
    );
    window.addEventListener("hackermouth:archive-leave", onArchiveLeave);
    return () => {
      window.removeEventListener(
        "hackermouth:archive-hover",
        onArchiveHover as EventListener,
      );
      window.removeEventListener("hackermouth:archive-leave", onArchiveLeave);
    };
  }, [showToast, triggerGlitch]);

  return (
    <HackermouthContext.Provider value={{} as HackermouthContextValue}>
      {children}
      <TapeOverlay />
      <HackermouthToast
        message={toastMessage ?? ""}
        stamp={toastStamp}
        visible={toastVisible && !!toastMessage}
      />
      {cursorCorrupt ? (
        <div className="hm-cursor-stack pointer-events-none" aria-hidden>
          <div className="hm-cursor-trail" />
          <div className="hm-cursor-core" />
          <div className="hm-cursor-scanline" />
        </div>
      ) : null}
    </HackermouthContext.Provider>
  );
}
