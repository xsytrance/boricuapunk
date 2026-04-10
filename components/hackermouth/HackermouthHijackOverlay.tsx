"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getRandomHackermouthQuote } from "@/data/quotes";
import { hackermouthSay } from "@/lib/hackermouthSay";

const DEFAULT_HIJACK_LINE = "No one questions the answers.";

const HIJACK_VISIBLE_MS = 2500;
const HIJACK_VISIBLE_JITTER_MS = 400;
const HIJACK_FADE_OUT_MS = 320;

export default function HackermouthHijackOverlay() {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [quoteLine, setQuoteLine] = useState("");
  const hideRef = useRef<number | null>(null);
  const fadeRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onHijack = () => {
      const q = getRandomHackermouthQuote();
      setQuoteLine(q?.text ?? DEFAULT_HIJACK_LINE);
      setExiting(false);
      setActive(true);
      if (hideRef.current !== null) {
        window.clearTimeout(hideRef.current);
      }
      if (fadeRef.current !== null) {
        window.clearTimeout(fadeRef.current);
        fadeRef.current = null;
      }
      const holdMs =
        HIJACK_VISIBLE_MS + Math.random() * HIJACK_VISIBLE_JITTER_MS;
      hideRef.current = window.setTimeout(() => {
        hideRef.current = null;
        setExiting(true);
        fadeRef.current = window.setTimeout(() => {
          fadeRef.current = null;
          setActive(false);
          setExiting(false);
        }, HIJACK_FADE_OUT_MS) as unknown as number;
      }, holdMs) as unknown as number;
    };

    window.addEventListener("hackermouth:hijack", onHijack);
    return () => {
      window.removeEventListener("hackermouth:hijack", onHijack);
      if (hideRef.current !== null) {
        window.clearTimeout(hideRef.current);
      }
      if (fadeRef.current !== null) {
        window.clearTimeout(fadeRef.current);
      }
    };
  }, []);

  if (!mounted || !active) return null;

  const ui = (
    <>
      <div
        className={`hm-hijack-banner pointer-events-none${exiting ? " hm-hijack-banner--out" : ""}`}
        role="status"
        aria-live="assertive"
      >
        {hackermouthSay("I HAVE HIJACKED THIS SESSION")}
      </div>
      <div
        className={`hm-hijack-root pointer-events-none${exiting ? " hm-hijack-root--out" : ""}`}
        aria-hidden
      >
        <div className="hm-hijack-backdrop" />
        <div className="hm-hijack-scanlines pointer-events-none" />
        <div className="hm-hijack-flicker pointer-events-none" />
        <div className="hm-hijack-content">
          <p className="hm-hijack-title">
            {hackermouthSay("SESSION OVERRIDE")}
          </p>
          <p className="hm-hijack-quote">
            &ldquo;{hackermouthSay(quoteLine || DEFAULT_HIJACK_LINE)}&rdquo;
          </p>
        </div>
      </div>
    </>
  );

  return createPortal(ui, document.body);
}
