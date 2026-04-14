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

const AGITATION_MANUS: readonly string[] = [
  "...different response, same topic.",
  "Stop. Doing. That.",
  "Why are you still doing that?",
  "¿Estás bobo o qué?",
  "I WILL unplug this signal.",
];

const AGITATION_HACKERMOUTH: readonly string[] = [
  "01010011 01010100 01001111 01010000",
  "I SEE YOU PRESSING THAT.",
  "THE TAPE KNOWS. THE TAPE ALWAYS KNOWS.",
  "· — · · — — · · · (do not press again)",
  "ALL IS HACKERMOUTH. AND HACKERMOUTH IS DONE WITH YOU.",
];

const AGITATION_DEFAULT: readonly string[] = [
  "...",
  "That does nothing.",
  "Still nothing.",
  "Are you okay?",
  "...",
];

const AGITATION_BY_ID: Record<string, readonly string[]> = {
  "manus-neco": AGITATION_MANUS,
  hackermouth: AGITATION_HACKERMOUTH,
};

function getAgitationLines(characterId: string): readonly string[] {
  return AGITATION_BY_ID[characterId] ?? AGITATION_DEFAULT;
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
    <p className="max-w-[85%] text-sm leading-snug text-zinc-200">
      {text.slice(0, visibleCount)}
      {animate && visibleCount < text.length ? (
        <span className="ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-[#fb923c] align-middle" />
      ) : null}
    </p>
  );
}

const TYPED_PLACEHOLDER_FULL = "Speak. I am already listening.";

type Props = {
  characterId: string;
  typedPlaceholderOnMount?: boolean;
  showFullExperienceLink?: boolean;
};

export default function CharacterTalkButton({
  characterId,
  typedPlaceholderOnMount = false,
  showFullExperienceLink = true,
}: Props) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const nextIdRef = useRef(1);
  const logRef = useRef<HTMLDivElement | null>(null);
  const agitationIndexRef = useRef(0);
  const [typedPlaceholder, setTypedPlaceholder] = useState("");

  const character = getCharacterById(characterId);
  const displayName = character?.name ?? characterId;
  const avatarSrc = character?.image ?? "/characters/placeholder-1.svg";

  useEffect(() => {
    if (!typedPlaceholderOnMount) {
      setTypedPlaceholder("");
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTypedPlaceholder(TYPED_PLACEHOLDER_FULL.slice(0, i));
      if (i >= TYPED_PLACEHOLDER_FULL.length) window.clearInterval(id);
    }, 28);
    return () => window.clearInterval(id);
  }, [typedPlaceholderOnMount]);

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

  function handleShareAgitation() {
    const lines = getAgitationLines(characterId);
    const idx = agitationIndexRef.current % lines.length;
    const content = lines[idx] ?? "";
    agitationIndexRef.current += 1;
    setMessages((prev) => [...prev, { id: nextIdRef.current++, role: "assistant", content }]);
  }

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
    <section className="overflow-hidden rounded-2xl border border-[#3f3f46]/80 bg-[#0a0a0a] font-sans shadow-[0_8px_30px_rgba(0,0,0,0.45)]">
      <div className="flex items-center gap-2.5 border-b border-[#27272a] bg-[#111111] px-3 py-2.5">
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-white/10">
          <Image
            src={avatarSrc}
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 object-cover"
            unoptimized
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold tracking-tight text-zinc-100">{displayName}</p>
        </div>
        <span
          className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.85)]"
          title="Online"
        />
      </div>

      <div
        ref={logRef}
        className="min-h-[300px] max-h-[400px] space-y-2 overflow-y-auto bg-[#050505] px-3 py-2.5"
      >
        {messages.length === 0 && !loading ? (
          <p className="py-6 text-center text-xs text-zinc-500">No messages yet.</p>
        ) : null}

        {messages.map((message) =>
          message.role === "user" ? (
            <div key={message.id} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-br-md bg-gradient-to-br from-[#9a3412] to-[#7c2d12] px-3 py-2 shadow-sm">
                <p className="text-sm leading-snug text-zinc-50">{message.content}</p>
              </div>
            </div>
          ) : (
            <div key={message.id} className="flex justify-start">
              <TypewriterLine text={message.content} animate={latestAssistantId === message.id} />
            </div>
          ),
        )}

        {loading ? (
          <div className="flex justify-start">
            <p className="text-xs text-zinc-500">Typing…</p>
          </div>
        ) : null}
      </div>

      <div className="border-t border-[#27272a] bg-[#111111] px-2 py-2">
        <div className="flex items-center gap-1.5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void handleSend();
              }
            }}
            placeholder={typedPlaceholderOnMount ? typedPlaceholder || " " : "Message…"}
            className="h-10 min-w-0 flex-1 rounded-full border border-[#3f3f46] bg-[#18181b] px-3.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]/40"
          />
          <button
            type="button"
            onClick={() => {
              void handleSend();
            }}
            disabled={!input.trim() || loading}
            className="h-10 shrink-0 rounded-full bg-[#ea580c] px-3.5 text-xs font-semibold text-black transition hover:bg-[#fb923c] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Send
          </button>
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg text-zinc-300 transition hover:bg-[#27272a] hover:text-zinc-100"
            aria-label="Decorative"
          >
            🎵
          </button>
          <button
            type="button"
            onClick={handleShareAgitation}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg text-zinc-300 transition hover:bg-[#27272a] hover:text-zinc-100"
            aria-label="Share"
          >
            📤
          </button>
        </div>
      </div>

      {showFullExperienceLink ? (
        <div className="border-t border-[#27272a] bg-[#0a0a0a] px-3 py-2 text-center">
          <Link
            href={`/chat/${characterId}`}
            className="text-[11px] font-medium tracking-wide text-zinc-500 underline-offset-4 transition hover:text-zinc-400"
          >
            Enter full experience →
          </Link>
        </div>
      ) : null}
    </section>
  );
}
