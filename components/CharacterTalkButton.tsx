"use client";

import { useState } from "react";

type Props = {
  characterId: string;
};

function resolveBackendCharacterId(characterId: string): string {
  if (characterId === "manus-neco") return "manus";
  return characterId;
}

export default function CharacterTalkButton({ characterId }: Props) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!input || loading) return;
    const message = input;
    const backendCharacterId = resolveBackendCharacterId(characterId);
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          character_id: backendCharacterId,
          commit_id: "people_of_pisces",
          message,
        }),
      });

      const payload = (await response.json()) as { response?: string; error?: string };
      console.log(payload);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: payload.response || payload.error || "No response." },
      ]);
      setInput("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-black/60 p-5 shadow-[inset_0_0_34px_rgba(0,0,0,0.65)] md:p-6">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.38em] text-[#fb923c]">
        Character Chat
      </p>
      
      <div className="mt-4 rounded border border-[#9a3412]/70 bg-black/65 p-4 shadow-[inset_0_0_24px_rgba(0,0,0,0.5)]">
        {messages.length === 0 ? (
          <p className="text-sm text-zinc-500">Start a conversation...</p>
        ) : (
          <div className="space-y-3">
            {messages.map((m, i) => (
              <div key={i}>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#fb923c]">
                  {m.role === "user" ? "[You]" : `[${characterId}]`}
                </p>
                <p className="mt-1 break-words text-sm leading-relaxed text-zinc-300">{m.content}</p>
              </div>
            ))}
            {loading && <p className="animate-pulse text-sm text-[#fb923c]">...</p>}
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
          disabled={!input || loading}
          className="rounded border border-[#9a3412]/70 bg-gradient-to-b from-[#7c2d12] to-[#431407] px-6 py-3 font-mono text-sm font-bold uppercase tracking-[0.2em] text-[#fde68a] transition hover:border-[#f97316] hover:from-[#9a3412] hover:to-[#7c2d12] disabled:opacity-50 disabled:hover:border-[#9a3412]/70 disabled:hover:from-[#7c2d12] disabled:hover:to-[#431407]"
        >
          Send
        </button>
      </div>
    </section>
  );
}
