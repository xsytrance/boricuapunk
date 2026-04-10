import { promises as fs } from "node:fs";
import path from "node:path";
import { quotes, type Quote, type QuoteStyle } from "@/data/quotes";
import {
  characters as sagaCharacters,
  getSagaCharacterById,
  type Character as SagaCharacter,
  type CharacterTag,
  type ThreatLevel,
} from "@/types/characters";

type MatchMethod = "vision" | "caption" | "fallback";

export type GeneratedQuote = {
  id: string;
  text: string;
  style: QuoteStyle;
  speakerName: string;
};

export type UploadedSighting = {
  id: string;
  createdAt: string;
  source: "telegram" | "manual";
  imagePath: string;
  caption?: string;
  match: {
    characterId: string;
    confidence: number;
    reason: string;
    method: MatchMethod;
  };
  card: {
    id: string;
    name: string;
    title: string;
    description: string;
    faction?: string;
    tags: CharacterTag[];
    threatLevel?: ThreatLevel;
  };
  quotes: GeneratedQuote[];
  hackermouthEffects: string[];
};

type SightingStore = {
  version: 1;
  sightings: UploadedSighting[];
};

const STORAGE_PATH = path.join(process.cwd(), "data/runtime/character-sightings.json");
const UPLOADS_DIR = path.join(process.cwd(), "public/uploads/characters");

function shortId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function clampConfidence(value: number): number {
  if (!Number.isFinite(value)) return 0.5;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

function characterText(character: SagaCharacter): string {
  return [
    character.name,
    character.role,
    character.description,
    character.faction ?? "",
    character.tags.join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

function tokenSet(value: string): Set<string> {
  return new Set(
    value
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .map((token) => token.trim())
      .filter((token) => token.length >= 3),
  );
}

function keywordMatch(caption: string): { characterId: string; confidence: number; reason: string } {
  const captionTokens = tokenSet(caption);
  let best = sagaCharacters[0];
  let bestScore = -1;

  for (const character of sagaCharacters) {
    const charTokens = tokenSet(characterText(character));
    let score = 0;

    for (const token of captionTokens) {
      if (charTokens.has(token)) score += 1;
    }

    if (caption.includes(character.id) || caption.includes(character.name.toLowerCase())) {
      score += 3;
    }

    if (score > bestScore) {
      bestScore = score;
      best = character;
    }
  }

  if (bestScore <= 0) {
    return {
      characterId: "unknown",
      confidence: 0.22,
      reason: "No strong text clues in caption; stored as unknown field signal.",
    };
  }

  return {
    characterId: best.id,
    confidence: clampConfidence(0.35 + Math.min(bestScore, 8) * 0.07),
    reason: `Caption keywords align with ${best.name} manuscript descriptors.`,
  };
}

function pickQuoteStyle(tags: CharacterTag[]): QuoteStyle {
  return tags.includes("mystery") || tags.includes("corrupt") ? "graffiti" : "streetfighter";
}

function synthesizeQuoteFromDescription(character: SagaCharacter): GeneratedQuote {
  const sentence = character.description.split(/[.!?]/).find((line) => line.trim().length > 12)?.trim();
  const text = sentence
    ? `${sentence}.`
    : `${character.name} moves through the archive like an unsolved frequency.`;

  return {
    id: shortId(`q-${slugify(character.id)}`),
    text,
    style: pickQuoteStyle(character.tags),
    speakerName: character.name,
  };
}

function pickCharacterQuotes(characterId: string, fallbackCharacter: SagaCharacter): GeneratedQuote[] {
  const fromCanon = quotes
    .filter((q) => q.characterId === characterId)
    .slice(0, 3)
    .map((q) => ({
      id: q.id,
      text: q.text,
      style: q.style,
      speakerName: q.speakerName ?? fallbackCharacter.name,
    }));

  if (fromCanon.length > 0) return fromCanon;
  return [synthesizeQuoteFromDescription(fallbackCharacter)];
}

function buildHackermouthEffects(character: SagaCharacter): string[] {
  const effects = [
    `Archive signal overlays pulse when ${character.name} appears on screen.`,
    `Hackermouth threat meter syncs to ${character.name}'s dossier risk level (${character.threatLevel ?? "unknown"}).`,
  ];

  if (character.presence === "digital") {
    effects.push("UI scanlines intensify and cursor drift increases during digital-presence renders.");
  }

  if (character.tags.includes("enemy") || character.threatLevel === "high") {
    effects.push("Random node-expansion events trigger a hostile system takeover animation.");
  } else {
    effects.push("Low-threat ghost pings appear in sidebars as passive surveillance echoes.");
  }

  if (character.tags.includes("spiritual") || character.presence === "myth") {
    effects.push("Audio hum and text distortion appear briefly as a myth-frequency interference effect.");
  }

  return effects;
}

async function ensureRuntimeStore(): Promise<void> {
  await fs.mkdir(path.dirname(STORAGE_PATH), { recursive: true });
  await fs.mkdir(UPLOADS_DIR, { recursive: true });

  try {
    await fs.access(STORAGE_PATH);
  } catch {
    const seed: SightingStore = { version: 1, sightings: [] };
    await fs.writeFile(STORAGE_PATH, JSON.stringify(seed, null, 2), "utf8");
  }
}

async function readStore(): Promise<SightingStore> {
  await ensureRuntimeStore();
  const raw = await fs.readFile(STORAGE_PATH, "utf8");
  try {
    const parsed = JSON.parse(raw) as SightingStore;
    if (!Array.isArray(parsed.sightings)) throw new Error("invalid sightings");
    return parsed;
  } catch {
    return { version: 1, sightings: [] };
  }
}

async function writeStore(store: SightingStore): Promise<void> {
  await fs.writeFile(STORAGE_PATH, JSON.stringify(store, null, 2), "utf8");
}

type VisionMatch = {
  characterId: string;
  confidence: number;
  reason: string;
};

async function identifyByVision(args: {
  imageDataUrl: string;
  caption: string;
}): Promise<VisionMatch | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const candidates = sagaCharacters.slice(0, 60).map((character) => ({
    id: character.id,
    name: character.name,
    role: character.role,
    description: character.description,
    tags: character.tags,
  }));

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.BORICUAPUNK_VISION_MODEL ?? "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "You classify Boricuapunk character photos against canon manuscript descriptors. Return strict JSON only: {\"characterId\": string, \"confidence\": number 0..1, \"reason\": string}. If uncertain, use characterId \"unknown\".",
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Caption: ${args.caption || "(none)"}\nCandidates: ${JSON.stringify(candidates)}`,
            },
            {
              type: "input_image",
              image_url: args.imageDataUrl,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) return null;
  const payload = (await response.json()) as { output_text?: string };
  const raw = payload.output_text?.trim();
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as VisionMatch;
    if (!parsed.characterId || typeof parsed.characterId !== "string") return null;
    return {
      characterId: parsed.characterId,
      confidence: clampConfidence(parsed.confidence),
      reason: parsed.reason || "Vision model matched manuscript descriptors.",
    };
  } catch {
    const jsonBlock = raw.match(/\{[\s\S]*\}/)?.[0];
    if (!jsonBlock) return null;
    try {
      const parsed = JSON.parse(jsonBlock) as VisionMatch;
      return {
        characterId: parsed.characterId,
        confidence: clampConfidence(parsed.confidence),
        reason: parsed.reason || "Vision model matched manuscript descriptors.",
      };
    } catch {
      return null;
    }
  }
}

function cardFromCharacter(character: SagaCharacter) {
  return {
    id: character.id,
    name: character.name,
    title: character.role,
    description: character.description,
    faction: character.faction,
    tags: character.tags,
    threatLevel: character.threatLevel,
  };
}

function unknownCard(caption: string) {
  const name = "Unknown Signal";
  return {
    id: "unknown",
    name,
    title: "Unresolved Manuscript Echo",
    description:
      caption.trim() ||
      "New field upload pending full identification. Hackermouth marked this entry for human review.",
    faction: undefined,
    tags: ["unknown", "mystery", "observer"] as CharacterTag[],
    threatLevel: "unknown" as ThreatLevel,
  };
}

export async function ingestCharacterPhoto(args: {
  source: "telegram" | "manual";
  imageBuffer: Buffer;
  mimeType: string;
  caption?: string;
  extensionHint?: string;
}): Promise<UploadedSighting> {
  await ensureRuntimeStore();

  const safeCaption = (args.caption ?? "").trim();
  const extension = (args.extensionHint || args.mimeType.split("/")[1] || "jpg")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 5);
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension || "jpg"}`;
  const diskPath = path.join(UPLOADS_DIR, fileName);
  await fs.writeFile(diskPath, args.imageBuffer);

  const imageDataUrl = `data:${args.mimeType};base64,${args.imageBuffer.toString("base64")}`;
  const visionMatch = await identifyByVision({ imageDataUrl, caption: safeCaption });

  let matchCharacterId = visionMatch?.characterId ?? "unknown";
  let confidence = visionMatch?.confidence ?? 0.25;
  let reason = visionMatch?.reason ?? "No vision API configured; using caption matching fallback.";
  let method: MatchMethod = visionMatch ? "vision" : "fallback";

  if (!visionMatch) {
    const fallback = keywordMatch(safeCaption);
    matchCharacterId = fallback.characterId;
    confidence = fallback.confidence;
    reason = fallback.reason;
    method = safeCaption ? "caption" : "fallback";
  }

  const matchedCharacter = getSagaCharacterById(matchCharacterId);
  const card = matchedCharacter ? cardFromCharacter(matchedCharacter) : unknownCard(safeCaption);
  const quoteSeedCharacter = matchedCharacter ?? sagaCharacters.find((c) => c.id === "hackermouth") ?? sagaCharacters[0]!;

  const generatedQuotes =
    matchCharacterId === "unknown"
      ? [
          {
            id: shortId("q-unknown"),
            text: "The archive breathes first and identifies later.",
            style: "graffiti" as QuoteStyle,
            speakerName: "Hackermouth",
          },
        ]
      : pickCharacterQuotes(matchCharacterId, quoteSeedCharacter);

  const effects = buildHackermouthEffects(quoteSeedCharacter);

  const sighting: UploadedSighting = {
    id: shortId("sighting"),
    createdAt: new Date().toISOString(),
    source: args.source,
    imagePath: `/uploads/characters/${fileName}`,
    caption: safeCaption || undefined,
    match: {
      characterId: matchedCharacter?.id ?? "unknown",
      confidence,
      reason,
      method,
    },
    card,
    quotes: generatedQuotes,
    hackermouthEffects: effects,
  };

  const store = await readStore();
  store.sightings = [sighting, ...store.sightings].slice(0, 300);
  await writeStore(store);

  return sighting;
}

export async function listSightings(limit = 40): Promise<UploadedSighting[]> {
  const store = await readStore();
  return store.sightings.slice(0, Math.max(1, Math.min(limit, 200)));
}

function stableIndex(seed: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash % max;
}

export async function getEvolvingQuoteOfDay(): Promise<GeneratedQuote & { characterId: string }> {
  const sightings = await listSightings(80);
  const evolvedQuotes: Array<GeneratedQuote & { characterId: string }> = sightings.flatMap((s) =>
    s.quotes.map((q) => ({ ...q, characterId: s.card.id })),
  );

  const fallbackPool: Array<GeneratedQuote & { characterId: string }> = quotes.map((q: Quote) => ({
    id: q.id,
    text: q.text,
    style: q.style,
    speakerName: q.speakerName ?? getSagaCharacterById(q.characterId)?.name ?? "Unknown signal",
    characterId: q.characterId,
  }));

  const pool = evolvedQuotes.length >= 1 ? [...evolvedQuotes, ...fallbackPool] : fallbackPool;
  const seed = new Date().toISOString().slice(0, 10);
  const selected = pool[stableIndex(seed, pool.length)]!;
  return selected;
}
