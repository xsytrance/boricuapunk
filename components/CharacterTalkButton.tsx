"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

type ChatPayload = { response?: string; error?: string };

const REQUEST_TIMEOUT_MS = 20_000;

function resolveBackendCharacterId(characterId: string): string {
  if (characterId === "manus-neco") return "manus";
  return characterId;
}

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
    <p className="break-words text-xs leading-relaxed text-[#fecaca] md:text-sm">
      {text.slice(0, visibleCount)}
      {animate && visibleCount < text.length ? (
        <span className="ml-0.5 inline-block h-3 w-1 animate-pulse bg-[#fb923c] align-middle" />
      ) : null}
    </p>
  );
}

type Props = {
  characterId: string;
};

export default function CharacterTalkButton({ characterId }: Props) {
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
          commit_id: "people_of_pisces",
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
    <section className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-black/60 p-5 font-mono shadow-[inset_0_0_34px_rgba(0,0,0,0.65),0_0_40px_rgba(194,65,12,0.12)] md:p-6">
      <div className="flex items-center justify-between border-b border-[#9a3412]/70 pb-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.38em] text-[#fb923c]">Character Chat</p>
        <span className="text-[10px] uppercase tracking-[0.18em] text-[#fde68a]/90">live signal</span>
      </div>

      <div
        ref={logRef}
        className="mt-4 min-h-[400px] overflow-y-auto rounded border border-[#9a3412]/70 bg-black/65 p-4 shadow-[inset_0_0_24px_rgba(0,0,0,0.5)]"
      >
        {messages.length === 0 ? (
          <p className="text-sm text-zinc-500">Start a conversation...</p>
        ) : (
          <div className="space-y-3">
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
              <p className="animate-pulse text-sm text-[#fb923c]">[SIGNAL] decoding response...</p>
            ) : null}
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void handleSend();
            }
          }}
          placeholder="Say something..."
          className="w-full rounded border border-[#9a3412]/70 bg-[#0a0a0a] px-4 py-3 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-[#f97316]"
        />
        <button
          type="button"
          onClick={() => {
            void handleSend();
          }}
          disabled={!input.trim() || loading}
          className="rounded border border-[#9a3412]/70 bg-gradient-to-b from-[#7c2d12] to-[#431407] px-6 py-3 font-mono text-sm font-bold uppercase tracking-[0.2em] text-[#fde68a] transition hover:border-[#f97316] hover:from-[#9a3412] hover:to-[#7c2d12] disabled:opacity-50 disabled:hover:border-[#9a3412]/70 disabled:hover:from-[#7c2d12] disabled:to-[#431407]"
        >
          Send
        </button>
      </div>

      <div className="mt-3 flex justify-end">
        <Link
          href={`/chat/${characterId}`}
          className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#c2410c] transition hover:text-[#fb923c]"
        >
          Enter full experience →
        </Link>
      </div>
    </section>
  );
}
