"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { PEOPLE_OF_PISCES_COMMIT, resolveBackendCharacterId } from "@/lib/chatCharacterId";

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

type ChatPayload = { response?: string; error?: string };

const REQUEST_TIMEOUT_MS = 20_000;

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
    <div className="flex min-h-[100dvh] flex-col bg-[#050505] px-3 pb-6 pt-4 font-mono md:px-6 md:pt-6">
      <div className="mb-4 shrink-0">
        <Link
          href={`/characters/${characterId}`}
          className="inline-block text-[10px] font-bold uppercase tracking-[0.28em] text-[#c2410c] transition hover:text-[#fb923c]"
        >
          ← Back to dossier
        </Link>
      </div>

      <header className="shrink-0 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-[0.08em] text-[#fecaca] [text-shadow:0_0_32px_rgba(251,146,60,0.55),0_0_60px_rgba(194,65,12,0.35)] md:text-4xl">
          {characterName}
        </h1>
        <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#fde68a]/90 md:text-xs">
          People of Pisces — a seven-story musician&apos;s tavern
        </p>
      </header>

      <div
        ref={logRef}
        className="mx-auto mt-6 h-[80vh] min-h-[240px] w-full max-w-4xl shrink-0 overflow-y-auto rounded-md border-[3px] border-[#9a3412]/80 bg-black/70 p-4 shadow-[inset_0_0_40px_rgba(0,0,0,0.65),0_0_36px_rgba(194,65,12,0.12)] md:p-5"
      >
        {messages.length === 0 ? (
          <p className="text-sm text-zinc-500">Start a conversation...</p>
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
                  <p className="mt-1 break-words text-sm leading-relaxed text-zinc-300 md:text-base">{message.content}</p>
                )}
              </div>
            ))}
            {loading ? (
              <p className="animate-pulse text-sm text-[#fb923c]">[SIGNAL] decoding response...</p>
            ) : null}
          </div>
        )}
      </div>

      <div className="mx-auto mt-4 flex w-full max-w-4xl shrink-0 gap-2">
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
          className="w-full rounded border border-[#9a3412]/70 bg-[#0a0a0a] px-4 py-3 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-[#f97316]"
        />
        <button
          type="button"
          onClick={() => {
            void handleSend();
          }}
          disabled={!input.trim() || loading}
          className="rounded border border-[#9a3412]/70 bg-gradient-to-b from-[#7c2d12] to-[#431407] px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#fde68a] transition hover:border-[#f97316] hover:from-[#9a3412] hover:to-[#7c2d12] disabled:opacity-50 md:px-6 md:text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}
