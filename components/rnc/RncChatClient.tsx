"use client";

import { useCallback, useEffect, useState } from "react";

type Bootstrap = {
  displayName: string;
  messages: string[];
};

function readBootstrap(): Bootstrap {
  const el = document.getElementById("rnc-chat-bootstrap");
  const raw = el?.textContent;
  if (!raw) {
    return { displayName: "Operator", messages: [] };
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === "object" &&
      "displayName" in parsed &&
      typeof (parsed as Bootstrap).displayName === "string" &&
      "messages" in parsed &&
      Array.isArray((parsed as Bootstrap).messages) &&
      (parsed as Bootstrap).messages.every((m) => typeof m === "string")
    ) {
      return parsed as Bootstrap;
    }
  } catch {
    /* ignore */
  }
  return { displayName: "Operator", messages: [] };
}

export default function RncChatClient() {
  const [ready, setReady] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const b = readBootstrap();
    setDisplayName(b.displayName);
    setMessages(b.messages);
    setReady(true);
  }, []);

  const send = useCallback(() => {
    const t = draft.trim();
    if (!t) return;
    setMessages((m) => [...m, t]);
    setDraft("");
  }, [draft]);

  if (!ready) {
    return (
      <main className="mx-auto flex max-w-lg flex-1 flex-col gap-4 px-4 py-12">
        <p className="font-mono text-sm text-zinc-500">Loading…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-0 w-full max-w-lg flex-1 flex-col gap-6 px-4 py-12">
      <header>
        <h1 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-[0.12em] text-[#fecaca]">
          RNC channel
        </h1>
        <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
          Session /{" "}
          <span className="text-[#fb923c]">{displayName}</span>
        </p>
      </header>

      <ul className="flex min-h-[12rem] flex-col gap-2 overflow-y-auto rounded border border-[#7f1d1d]/50 bg-black/40 p-4 font-mono text-sm text-zinc-300">
        {messages.length === 0 ? (
          <li className="text-zinc-600">No messages yet.</li>
        ) : (
          messages.map((m, i) => <li key={i}>{m}</li>)
        )}
      </ul>

      <div className="flex flex-col gap-2">
        <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
          Message
        </label>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          className="rounded border border-[#9a3412]/60 bg-[#0a0a0a] px-3 py-2 font-mono text-sm text-zinc-200 outline-none ring-[#ea580c] focus:border-[#ea580c] focus:ring-1"
        />
        <button
          type="button"
          onClick={send}
          className="self-end rounded border border-[#ea580c]/80 bg-[#431407]/60 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-[#ffedd5] hover:bg-[#431407]"
        >
          Send
        </button>
      </div>
    </main>
  );
}
