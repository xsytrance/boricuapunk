"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { getCharacterById } from "@/data/characters";
import { PEOPLE_OF_PISCES_COMMIT, resolveBackendCharacterId } from "@/lib/chatCharacterId";

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

type ChatPayload = { response?: string; error?: string };

const REQUEST_TIMEOUT_MS = 20_000;
const SCENE_LABEL = "People of Pisces — a seven-story musician's tavern";

function TypewriterLine({ text, animate }: { text: string; animate: boolean }) {
  const [visibleCount, setVisibleCount] = useState(animate ? 0 : text.length);

  useEffect(() => {
    if (!animate) {
      setVisibleCount(text.length);
      return;
    }

    setVisibleCount(0);
    const timer = window.setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= text.length) {
          window.clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 16);

    return () => window.clearInterval(timer);
  }, [animate, text]);

  return (
    <p className="break-words text-sm leading-relaxed text-[#fecaca] md:text-base">
      {text.slice(0, visibleCount)}
      {animate && visibleCount < text.length ? (
        <span className="ml-0.5 inline-block h-3 w-1 animate-pulse bg-[#fb923c] align-middle md:h-4" />
      ) : null}
    </p>
  );
}

type Props = {
  characterId: string;
  characterName: string;
};

export default function CharacterFullChat({ characterId, characterName }: Props) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const nextIdRef = useRef(1);
  const logRef = useRef<HTMLDivElement | null>(null);

  const character = getCharacterById(characterId);
  const displayName = character?.name ?? characterName;
  const faction = character?.faction ?? "Unknown";
  const statusTag = character?.tag ?? "CLASSIFIED";
  const bannerCandidates = useMemo(() => {
    const list = [
      character?.image || "",
      "/images/manus/manus-hero.png",
      "/characters/manus-neco.svg",
    ].filter(Boolean);
    return Array.from(new Set(list));
  }, [character?.image]);
  const [bannerIndex, setBannerIndex] = useState(0);

  useEffect(() => {
    setBannerIndex(0);
  }, [characterId, bannerCandidates]);

  const bannerSrc = bannerCandidates[bannerIndex] ?? "/characters/manus-neco.svg";

  const latestAssistantId = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (messages[i]?.role === "assistant") return messages[i]!.id;
    }
    return null;
  }, [messages]);

  useEffect(() => {
    if (!logRef.current) return;
    logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages, loading]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const message = input.trim();
    const userMessage: ChatMessage = { id: nextIdRef.current++, role: "user", content: message };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const backendCharacterId = resolveBackendCharacterId(characterId);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          character_id: backendCharacterId,
          commit_id: PEOPLE_OF_PISCES_COMMIT,
          message,
        }),
        signal: controller.signal,
      });

      const payload = (await response.json()) as ChatPayload;
      const assistantMessage: ChatMessage = {
        id: nextIdRef.current++,
        role: "assistant",
        content: payload.response || payload.error || "No response.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const assistantMessage: ChatMessage = {
        id: nextIdRef.current++,
        role: "assistant",
        content:
          error instanceof DOMException && error.name === "AbortError"
            ? "SYSTEM ERROR: UPLINK TIMEOUT."
            : "SYSTEM ERROR: UPLINK FAILED.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      window.clearTimeout(timeout);
      setLoading(false);
    }
  }

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-[#050505] font-mono text-stone-200">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.045) 0px, rgba(255,255,255,0.045) 1px, transparent 1px, transparent 4px)",
        }}
      />

      <div className="relative z-10 flex h-full min-h-0 flex-col">
        <header className="h-[72px] max-h-[80px] shrink-0 border-b border-[#7f1d1d]/80 bg-black/88 px-3">
          <div className="flex h-full items-center justify-between gap-2">
            <Link
              href={`/characters/${characterId}`}
              className="shrink-0 text-[10px] font-bold uppercase tracking-[0.18em] text-[#fb923c] transition hover:text-[#fde68a]"
            >
              ← Back
            </Link>

            <div className="flex min-w-0 items-center gap-2">
              <p className="truncate text-sm font-[family-name:var(--font-display)] uppercase tracking-[0.08em] text-[#fecaca]">
                {displayName}
              </p>
              <span className="shrink-0 rounded border border-[#9a3412]/70 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#fde68a]">
                {statusTag}
              </span>
            </div>
          </div>
        </header>

        <section className="relative h-[110px] max-h-[120px] shrink-0 overflow-hidden border-b border-[#7f1d1d]/70">
          <Image
            src={bannerSrc}
            alt={displayName}
            fill
            className="object-cover object-center"
            unoptimized
            priority
            onError={() => {
              setBannerIndex((prev) => {
                const next = prev + 1;
                return next < bannerCandidates.length ? next : prev;
              });
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25" />
          <div className="absolute inset-x-0 bottom-0 p-2.5">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#fb923c]">{SCENE_LABEL}</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-[#fecaca]/90">{faction}</p>
          </div>
        </section>

        <div ref={logRef} className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
          {messages.length === 0 ? (
            <p className="text-xs uppercase tracking-[0.2em] text-[#fb923c]/85">[SIGNAL OPEN — SPEAK]</p>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#fb923c]">
                    {message.role === "user" ? "[You]" : `[${characterId}]`}
                  </p>
                  {message.role === "assistant" ? (
                    <TypewriterLine text={message.content} animate={latestAssistantId === message.id} />
                  ) : (
                    <p className="mt-1 break-words text-sm leading-relaxed text-zinc-300">{message.content}</p>
                  )}
                </div>
              ))}
              {loading ? (
                <p className="animate-pulse text-xs uppercase tracking-[0.16em] text-[#fb923c]">
                  [SIGNAL] decoding response...
                </p>
              ) : null}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 shrink-0 border-t border-[#9a3412]/80 bg-black/92 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void handleSend();
                }
              }}
              placeholder="Speak. I am already listening."
              className="h-11 w-full rounded border border-[#9a3412]/70 bg-[#0a0a0a] px-3 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-[#f97316]"
            />
            <button
              type="button"
              onClick={() => {
                void handleSend();
              }}
              disabled={!input.trim() || loading}
              className="h-11 shrink-0 rounded border border-[#9a3412]/70 bg-gradient-to-b from-[#7c2d12] to-[#431407] px-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#fde68a] transition hover:border-[#f97316] disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
