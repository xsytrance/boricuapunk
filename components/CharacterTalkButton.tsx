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
    <div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Say something..."
        style={{ marginTop: "8px", width: "100%" }}
      />
      <button
        type="button"
        onClick={() => {
          void handleSend();
        }}
        disabled={!input || loading}
        className="mt-2 rounded border border-[#9a3412]/70 bg-black/65 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#fde68a] disabled:opacity-60"
      >
        Talk
      </button>
      {loading && <div>...</div>}
      <div style={{ marginTop: "8px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: "4px" }}>
            <strong>{m.role === "user" ? "You" : characterId}:</strong> {m.content}
          </div>
        ))}
      </div>
    </div>
  );
}
