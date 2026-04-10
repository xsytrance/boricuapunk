"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Aligns with HackermouthNode click throttle — stable across renders via ref. */
const CONTEXT_DISPATCH_THROTTLE_MS = 800;

export default function HackermouthContextMenu() {
  const [open, setOpen] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const lastContextDispatchRef = useRef(0);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      const pad = 8;
      const mw = 200;
      const mh = 120;
      let nx = e.clientX;
      let ny = e.clientY;
      if (nx + mw + pad > window.innerWidth) nx = window.innerWidth - mw - pad;
      if (ny + mh + pad > window.innerHeight) ny = window.innerHeight - mh - pad;
      nx = Math.max(pad, nx);
      ny = Math.max(pad, ny);
      setX(nx);
      setY(ny);
      setOpen(true);
      const now = Date.now();
      if (now - lastContextDispatchRef.current >= CONTEXT_DISPATCH_THROTTLE_MS) {
        lastContextDispatchRef.current = now;
        window.dispatchEvent(new CustomEvent("hackermouth:context"));
      }
    };
    window.addEventListener("contextmenu", onContextMenu);
    return () => window.removeEventListener("contextmenu", onContextMenu);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const menu = menuRef.current;
      const inside =
        !!menu && e.target instanceof Node && menu.contains(e.target);
      // Chromium often delivers pointerdown(button=2) after contextmenu on the
      // same right-click; treating it as "outside" closed the menu immediately.
      if (e.button === 2) return;
      if (inside) return;
      close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  const onInspect = () => {
    close();
  };

  const onCopySignal = async () => {
    try {
      await navigator.clipboard.writeText("HACKERMOUTH://SIGNAL");
    } catch {
      /* ignore */
    }
    close();
  };

  if (!open) return null;

  return (
    <div
      ref={menuRef}
      className="hm-context-menu"
      role="menu"
      style={{ left: x, top: y }}
    >
      <button
        type="button"
        className="hm-context-item hm-context-item--action"
        role="menuitem"
        onClick={onInspect}
      >
        Inspect Node
      </button>
      <button
        type="button"
        className="hm-context-item hm-context-item--action"
        role="menuitem"
        onClick={onCopySignal}
      >
        Copy Signal
      </button>
      <button
        type="button"
        className="hm-context-item hm-context-item--action"
        role="menuitem"
        onClick={close}
      >
        Close
      </button>
    </div>
  );
}
