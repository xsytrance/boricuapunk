"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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
    <p className="break-words text-xs leading-relaxed text-[#2cffb3] md:text-sm">
      {text.slice(0, visibleCount)}
      {animate && visibleCount < text.length ? <span className="ml-0.5 inline-block h-3 w-1 animate-pulse bg-[#2cffb3] align-middle" /> : null}
    </p>
  );
}

export default function HackermouthTerminalChat() {
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
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          character_id: "hackermouth",
          commit_id: "hackermouth_active",
          message,
        }),
        signal: controller.signal,
      });

      const payload = (await response.json()) as ChatPayload;
      const assistantMessage: ChatMessage = {
        id: nextIdRef.current++,
        role: "assistant",
        content: payload.response || payload.error || "SIGNAL LOST.",
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
    <section className="rounded-md border-[2px] border-[#0f766e]/70 bg-black p-4 font-mono shadow-[0_0_24px_rgba(20,184,166,0.2),inset_0_0_40px_rgba(0,0,0,0.8)] md:p-5">
      <div className="flex items-center justify-between border-b border-[#134e4a]/70 pb-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#5eead4]">Hackermouth Terminal</p>
        <span className="text-[10px] uppercase tracking-[0.18em] text-[#2dd4bf]/80">live signal</span>
      </div>

      <div
        ref={logRef}
        className="mt-3 h-56 overflow-y-auto rounded border border-[#134e4a]/60 bg-[#020807] p-3 md:h-64"
      >
        {messages.length === 0 ? (
          <p className="text-xs text-[#14b8a6]/80">[SYSTEM] Channel open. You are observed.</p>
        ) : (
          <div className="space-y-2">
            {messages.map((message) => (
              <div key={message.id}>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#0d9488]/80">
                  {message.role === "user" ? "[you]" : "[hackermouth]"}
                </p>
                {message.role === "assistant" ? (
                  <TypewriterLine text={message.content} animate={latestAssistantId === message.id} />
                ) : (
                  <p className="break-words text-xs leading-relaxed text-[#99f6e4] md:text-sm">{message.content}</p>
                )}
              </div>
            ))}
            {loading ? <p className="animate-pulse text-xs text-[#2dd4bf]">[SYSTEM] decoding response...</p> : null}
          </div>
        )}
      </div>

      <div className="mt-3 flex gap-2">
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
          className="w-full rounded border border-[#115e59] bg-[#031311] px-3 py-2 text-sm text-[#99f6e4] outline-none placeholder:text-[#2dd4bf]/70 focus:border-[#2dd4bf]"
        />
        <button
          type="button"
          onClick={() => {
            void handleSend();
          }}
          disabled={loading}
          className={`rounded border border-[#14b8a6]/70 bg-[#042f2e] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#99f6e4] transition hover:border-[#5eead4] hover:text-[#ccfbf1] ${loading ? "opacity-50" : ""}`}
        >
          TRANSMIT
        </button>
      </div>
    </section>
  );
}
