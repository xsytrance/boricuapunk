"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";

const BASE_Y = 80;
const NEAR_RADIUS_PX = 150;
const CURSOR_PULL_MAX = 10;
const HOVER_THROTTLE_MS = 800;
const CLICK_THROTTLE_MS = 800;

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
      const pull = Math.min(CURSOR_PULL_MAX, dist * 0.12);
      setCursorPull({
        x: (dx / len) * pull,
        y: (dy / len) * pull,
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
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
  const displayText = nearText ?? flashText ?? "WATCHING";

  const chassisTransform = expansion
    ? `translate3d(${cursorPull.x}px, ${cursorPull.y}px, 0) scale(${expandScale})`
    : `translate3d(${cursorPull.x}px, ${cursorPull.y}px, 0) scale(1)`;

  return (
    <div
      ref={rootRef}
      className={`hm-node ${near ? "hm-node--near" : ""} ${expansion ? "hm-node--expand" : ""} ${idlePulse ? "hm-node--idle-pulse" : ""}`}
      style={{
        position: "fixed",
        top: `${BASE_Y}px`,
        left: `${leftPx}px`,
        right: "auto",
        bottom: "auto",
        transition: "left 0.4s ease, opacity 0.35s ease",
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
