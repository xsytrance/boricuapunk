"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { hackermouthSay } from "@/lib/hackermouthSay";

const BASE_Y = 80;
const SCROLL_FOLLOW_FACTOR = 0.11;
const SCROLL_FOLLOW_CAP_PX = 240;
const NEAR_RADIUS_PX = 170;
const CURSOR_PULL_MAX = 10;
const CURSOR_PULL_MAX_FOLLOW = 32;
const HOVER_THROTTLE_MS = 800;
const CLICK_THROTTLE_MS = 800;
const JITTER_INTERVAL_MIN_MS = 220;
const JITTER_INTERVAL_MAX_MS = 520;
const GLITCH_BURST_MIN_MS = 90;
const GLITCH_BURST_MAX_MS = 260;
const FOLLOW_MOUSE_MIN_MS = 3200;
const FOLLOW_MOUSE_MAX_MS = 8200;
const FOLLOW_MOUSE_COOLDOWN_MIN_MS = 7000;
const FOLLOW_MOUSE_COOLDOWN_MAX_MS = 16000;

type MessageType = "NAV" | "HOVER" | "IDLE" | "CLICK";

const POOLS: Record<MessageType, string[]> = {
  NAV: ["YOU MOVED", "I FOLLOW", "PATH CHANGED"],
  HOVER: ["INTERESTING", "YOU HESITATE", "CHOICES..."],
  IDLE: ["STILL THERE?", "WATCHING", "LISTENING"],
  CLICK: ["YOU CHOSE", "ACTION TAKEN", "INTERESTING MOVE"],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export default function HackermouthNode() {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const expandClearRef = useRef<number | null>(null);
  const flashClearRef = useRef<number | null>(null);
  const sideTimerRef = useRef<number | null>(null);
  const idleLoopRef = useRef<number | null>(null);
  const hoverLastRef = useRef(0);
  const clickLastRef = useRef(0);

  const [side, setSide] = useState<"left" | "right">("left");
  const [leftPx, setLeftPx] = useState(24);

  const [flashText, setFlashText] = useState<string | null>(null);
  const [messageFlash, setMessageFlash] = useState(false);
  const [idlePulse, setIdlePulse] = useState(false);

  const [near, setNear] = useState(false);
  const [nearPhrase, setNearPhrase] = useState("I SEE YOU");
  const [cursorPull, setCursorPull] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [jitter, setJitter] = useState({ x: 0, y: 0 });
  const [followMouse, setFollowMouse] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const [expansion, setExpansion] = useState(false);
  const [expandScale, setExpandScale] = useState(1.75);

  const flashMessage = useCallback((msg: string, withIdlePulse = false) => {
    if (flashClearRef.current !== null) {
      window.clearTimeout(flashClearRef.current);
    }
    setFlashText(msg);
    setMessageFlash(true);
    window.setTimeout(() => setMessageFlash(false), 420);
    if (withIdlePulse) {
      setIdlePulse(true);
      window.setTimeout(() => setIdlePulse(false), 700);
    }
    const dur = 3000 + Math.random() * 1000;
    flashClearRef.current = window.setTimeout(() => {
      setFlashText(null);
      flashClearRef.current = null;
    }, dur) as unknown as number;
  }, []);

  const triggerHackermouthMessage = useCallback(
    (type: MessageType) => {
      flashMessage(pick(POOLS[type]), type === "IDLE");
    },
    [flashMessage],
  );

  const updateLeftPx = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    const w = el.offsetWidth;
    setLeftPx(
      side === "left" ? 24 : Math.max(24, window.innerWidth - w - 24),
    );
  }, [side]);

  useLayoutEffect(() => {
    updateLeftPx();
  }, [side, expansion, flashText, updateLeftPx]);

  useEffect(() => {
    const onResize = () => updateLeftPx();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [updateLeftPx]);

  useEffect(() => {
    let active = true;
    const scheduleSide = () => {
      sideTimerRef.current = window.setTimeout(() => {
        if (!active) return;
        if (Math.random() < 0.2) {
          setSide((s) => (s === "left" ? "right" : "left"));
        }
        scheduleSide();
      }, 15000 + Math.random() * 15000) as unknown as number;
    };
    scheduleSide();
    return () => {
      active = false;
      if (sideTimerRef.current !== null) {
        window.clearTimeout(sideTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    triggerHackermouthMessage("NAV");
  }, [pathname, triggerHackermouthMessage]);

  useEffect(() => {
    const onPointerOver = (e: PointerEvent) => {
      const el = e.target;
      if (!(el instanceof HTMLElement)) return;
      if (
        !el.closest("a") &&
        !el.closest("button") &&
        !el.closest("[data-hoverable]")
      )
        return;
      const now = Date.now();
      if (now - hoverLastRef.current < HOVER_THROTTLE_MS) return;
      hoverLastRef.current = now;
      triggerHackermouthMessage("HOVER");
    };
    document.addEventListener("pointerover", onPointerOver, true);
    return () =>
      document.removeEventListener("pointerover", onPointerOver, true);
  }, [triggerHackermouthMessage]);

  useEffect(() => {
    const onClick = () => {
      const now = Date.now();
      if (now - clickLastRef.current < CLICK_THROTTLE_MS) return;
      clickLastRef.current = now;
      triggerHackermouthMessage("CLICK");
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [triggerHackermouthMessage]);

  useEffect(() => {
    const scheduleIdle = () => {
      idleLoopRef.current = window.setTimeout(() => {
        triggerHackermouthMessage("IDLE");
        scheduleIdle();
      }, 4000 + Math.random() * 4000) as unknown as number;
    };
    scheduleIdle();
    return () => {
      if (idleLoopRef.current !== null) {
        window.clearTimeout(idleLoopRef.current);
      }
    };
  }, [triggerHackermouthMessage]);

  useEffect(() => {
    const handler = () => {
      flashMessage("ACCESSING", false);
    };
    window.addEventListener("hackermouth:quote-appear", handler);
    return () => window.removeEventListener("hackermouth:quote-appear", handler);
  }, [flashMessage]);

  useEffect(() => {
    const listener = () => {
      if (expandClearRef.current !== null) {
        window.clearTimeout(expandClearRef.current);
      }
      setExpandScale(1.5 + Math.random() * 0.5);
      setExpansion(true);
      expandClearRef.current = window.setTimeout(() => {
        setExpansion(false);
        expandClearRef.current = null;
      }, 2000) as unknown as number;
    };
    window.addEventListener("hackermouth:node-expansion", listener);
    return () => {
      window.removeEventListener("hackermouth:node-expansion", listener);
      if (expandClearRef.current !== null) {
        window.clearTimeout(expandClearRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () =>
      window.removeEventListener("scroll", onScroll, { capture: true });
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = rootRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      setNear(dist < NEAR_RADIUS_PX);
      const len = Math.hypot(dx, dy) || 1;
      const cap = followMouse ? CURSOR_PULL_MAX_FOLLOW : CURSOR_PULL_MAX;
      const gain = followMouse ? 0.22 : 0.12;
      const pull = Math.min(cap, dist * gain);
      setCursorPull({
        x: (dx / len) * pull,
        y: (dy / len) * pull,
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [followMouse]);

  useEffect(() => {
    let timeoutId = 0;
    const scheduleJitter = () => {
      const delay =
        JITTER_INTERVAL_MIN_MS +
        Math.random() * (JITTER_INTERVAL_MAX_MS - JITTER_INTERVAL_MIN_MS);
      timeoutId = window.setTimeout(() => {
        setJitter({
          x: (Math.random() - 0.5) * 14,
          y: (Math.random() - 0.5) * 10,
        });
        scheduleJitter();
      }, delay) as unknown as number;
    };
    scheduleJitter();
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    let cooldownTimer = 0;
    const armFollow = () => {
      const wait =
        FOLLOW_MOUSE_COOLDOWN_MIN_MS +
        Math.random() *
          (FOLLOW_MOUSE_COOLDOWN_MAX_MS - FOLLOW_MOUSE_COOLDOWN_MIN_MS);
      cooldownTimer = window.setTimeout(() => {
        if (Math.random() < 0.42) {
          setFollowMouse(true);
          window.setTimeout(
            () => setFollowMouse(false),
            FOLLOW_MOUSE_MIN_MS +
              Math.random() * (FOLLOW_MOUSE_MAX_MS - FOLLOW_MOUSE_MIN_MS),
          );
        }
        armFollow();
      }, wait) as unknown as number;
    };
    armFollow();
    return () => window.clearTimeout(cooldownTimer);
  }, []);

  useEffect(() => {
    let glitchTimer = 0;
    const armGlitch = () => {
      const wait = 1400 + Math.random() * 5200;
      glitchTimer = window.setTimeout(() => {
        if (Math.random() < 0.55) {
          setGlitching(true);
          window.setTimeout(
            () => setGlitching(false),
            GLITCH_BURST_MIN_MS +
              Math.random() * (GLITCH_BURST_MAX_MS - GLITCH_BURST_MIN_MS),
          );
        }
        if (Math.random() < 0.28) {
          window.setTimeout(() => {
            setGlitching(true);
            window.setTimeout(
              () => setGlitching(false),
              GLITCH_BURST_MIN_MS +
                Math.random() * (GLITCH_BURST_MAX_MS - GLITCH_BURST_MIN_MS),
            );
          }, 40 + Math.random() * 120);
        }
        armGlitch();
      }, wait) as unknown as number;
    };
    armGlitch();
    return () => window.clearTimeout(glitchTimer);
  }, []);

  useEffect(() => {
    if (near) {
      setNearPhrase(Math.random() < 0.5 ? "I SEE YOU" : "DON'T LOOK AWAY");
    }
  }, [near]);

  useEffect(() => {
    return () => {
      if (flashClearRef.current !== null) {
        window.clearTimeout(flashClearRef.current);
      }
    };
  }, []);

  const nearText = near ? nearPhrase : null;
  const displayText = hackermouthSay(nearText ?? flashText ?? "WATCHING");

  const scrollNudge = Math.min(scrollY * SCROLL_FOLLOW_FACTOR, SCROLL_FOLLOW_CAP_PX);
  const topPx = BASE_Y + scrollNudge;

  const jx = jitter.x + cursorPull.x;
  const jy = jitter.y + cursorPull.y;

  const chassisTransform = expansion
    ? `translate3d(${jx}px, ${jy}px, 0) scale(${expandScale})`
    : `translate3d(${jx}px, ${jy}px, 0) scale(1)`;

  return (
    <div
      ref={rootRef}
      className={`hm-node ${near ? "hm-node--near" : ""} ${expansion ? "hm-node--expand" : ""} ${idlePulse ? "hm-node--idle-pulse" : ""} ${followMouse ? "hm-node--follow" : ""} ${glitching ? "hm-node--glitch" : ""}`}
      style={{
        position: "fixed",
        top: `${topPx}px`,
        left: `${leftPx}px`,
        right: "auto",
        bottom: "auto",
        transition: "left 0.4s ease, opacity 0.35s ease, top 0.12s ease-out",
      }}
      aria-hidden
    >
      <div className="hm-node-scroll">
        <div className="hm-node-tape-layer" />

        {expansion ? (
          <>
            <div
              className="hm-node-tape-strand hm-node-tape-strand--a"
              aria-hidden
            />
            <div
              className="hm-node-tape-strand hm-node-tape-strand--b"
              aria-hidden
            />
            <div
              className="hm-node-tape-strand hm-node-tape-strand--c"
              aria-hidden
            />
          </>
        ) : null}

        <div className="hm-node-drift">
          <div
            className="hm-node-chassis"
            style={{ transform: chassisTransform }}
          >
            <div
              className={`hm-node-msg-bundle ${messageFlash ? "hm-node-msg-bundle--flash" : ""}`}
            >
              <div className="hm-node-eye" />
              <div className="hm-node-text">{displayText}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
