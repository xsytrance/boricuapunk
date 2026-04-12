import { promises as fs } from "node:fs";
import path from "node:path";
import {
  characters as sagaCharacters,
  getSagaCharacterById,
  type Character,
  type CharacterTag,
  type ThreatLevel,
} from "@/types/characters";

type MatchMethod = "vision" | "caption" | "fallback" | "manual-review";
type ShotType = "single" | "group";

export type FigurineCandidate = {
  characterId: string;
  characterName: string;
  score: number;
};

export type FigurineSighting = {
  id: string;
  createdAt: string;
  source: "telegram" | "manual";
  imagePath: string;
  caption?: string;
  shotType: ShotType;
  match: {
    characterId: string;
    confidence: number;
    reason: string;
    method: MatchMethod;
  };
  candidates: FigurineCandidate[];
  card: {
    id: string;
    name: string;
    title: string;
    description: string;
    faction?: string;
    tags: CharacterTag[];
    threatLevel?: ThreatLevel;
  };
};

type FigurineStore = {
  version: 1;
  sightings: FigurineSighting[];
};

type VisionMatch = {
  characterId: string;
  confidence: number;
  reason: string;
};

const STORAGE_PATH = path.join(process.cwd(), "data/runtime/figurine-sightings.json");
const UPLOADS_DIR = path.join(process.cwd(), "public/uploads/figurines");

function shortId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function clampConfidence(value: number): number {
  if (!Number.isFinite(value)) return 0.5;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
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

function rankCandidatesByCaption(caption: string): FigurineCandidate[] {
  const captionTokens = tokenSet(caption);
  const loweredCaption = caption.toLowerCase();

  const scored = sagaCharacters
    .map((character) => {
      const strongTokens = tokenSet([character.id, character.name, character.role].join(" "));
      const weakTokens = tokenSet([character.description, character.faction ?? "", character.tags.join(" ")].join(" "));
      let score = 0;

      for (const token of captionTokens) {
        if (strongTokens.has(token)) score += 3;
        else if (weakTokens.has(token)) score += 1;
      }

      if (loweredCaption.includes(character.id) || loweredCaption.includes(character.name.toLowerCase())) {
        score += 4;
      }

      return {
        characterId: character.id,
        characterName: character.name,
        score,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 5);
}

async function identifyByVision(args: {
  imageDataUrl: string;
  caption: string;
  shotType: ShotType;
}): Promise<VisionMatch | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const candidates = sagaCharacters.slice(0, 80).map((character) => ({
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
            "You classify Boricuapunk figurine photos against canon character descriptors. Return strict JSON only: {\"characterId\": string, \"confidence\": number 0..1, \"reason\": string}. If uncertain or multi-figurine group is unclear, return characterId \"unknown\".",
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Shot type: ${args.shotType}. Caption: ${args.caption || "(none)"}. Candidates: ${JSON.stringify(candidates)}`,
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
      reason: parsed.reason || "Vision model matched figurine with manuscript descriptors.",
    };
  } catch {
    const jsonBlock = raw.match(/\{[\s\S]*\}/)?.[0];
    if (!jsonBlock) return null;
    try {
      const parsed = JSON.parse(jsonBlock) as VisionMatch;
      return {
        characterId: parsed.characterId,
        confidence: clampConfidence(parsed.confidence),
        reason: parsed.reason || "Vision model matched figurine with manuscript descriptors.",
      };
    } catch {
      return null;
    }
  }
}

function cardFromCharacter(character: Character) {
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
  return {
    id: "unknown",
    name: "Unknown Figurine",
    title: "Unresolved Character Figurine",
    description: caption.trim() || "Figurine pending assignment in review queue.",
    tags: ["unknown", "mystery", "observer"] as CharacterTag[],
    threatLevel: "unknown" as ThreatLevel,
  };
}

async function ensureStore(): Promise<void> {
  await fs.mkdir(path.dirname(STORAGE_PATH), { recursive: true });
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  try {
    await fs.access(STORAGE_PATH);
  } catch {
    const seed: FigurineStore = { version: 1, sightings: [] };
    await fs.writeFile(STORAGE_PATH, JSON.stringify(seed, null, 2), "utf8");
  }
}

async function readStore(): Promise<FigurineStore> {
  await ensureStore();
  const raw = await fs.readFile(STORAGE_PATH, "utf8");
  try {
    const parsed = JSON.parse(raw) as FigurineStore;
    if (!Array.isArray(parsed.sightings)) throw new Error("invalid sightings");
    return parsed;
  } catch {
    return { version: 1, sightings: [] };
  }
}

async function writeStore(store: FigurineStore): Promise<void> {
  await fs.writeFile(STORAGE_PATH, JSON.stringify(store, null, 2), "utf8");
}

export async function ingestFigurinePhoto(args: {
  source: "telegram" | "manual";
  imageBuffer: Buffer;
  mimeType: string;
  caption?: string;
  extensionHint?: string;
  shotType?: ShotType;
}): Promise<FigurineSighting> {
  await ensureStore();

  const shotType: ShotType = args.shotType === "group" ? "group" : "single";
  const safeCaption = (args.caption ?? "").trim();
  const extension = (args.extensionHint || args.mimeType.split("/")[1] || "jpg")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 5);
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension || "jpg"}`;
  await fs.writeFile(path.join(UPLOADS_DIR, fileName), args.imageBuffer);

  const imageDataUrl = `data:${args.mimeType};base64,${args.imageBuffer.toString("base64")}`;
  const visionMatch = await identifyByVision({ imageDataUrl, caption: safeCaption, shotType });

  const candidates = rankCandidatesByCaption(safeCaption);
  const topCandidate = candidates[0];

  let characterId = visionMatch?.characterId ?? topCandidate?.characterId ?? "unknown";
  let confidence = visionMatch?.confidence ?? clampConfidence(0.35 + Math.min(topCandidate?.score ?? 0, 8) * 0.07);
  let reason =
    visionMatch?.reason ??
    (topCandidate
      ? `Caption tokens align best with ${topCandidate.characterName}.`
      : "No strong caption clues; queued for review.");
  let method: MatchMethod = visionMatch ? "vision" : safeCaption ? "caption" : "fallback";

  if (shotType === "group") {
    confidence = clampConfidence(confidence * 0.78);
    reason = `${reason} Group shot detected; confidence intentionally reduced for review safety.`;
  }

  const matchedCharacter = getSagaCharacterById(characterId);
  if (!matchedCharacter) {
    characterId = "unknown";
    confidence = clampConfidence(Math.min(confidence, 0.45));
  }

  const sighting: FigurineSighting = {
    id: shortId("figurine"),
    createdAt: new Date().toISOString(),
    source: args.source,
    imagePath: `/uploads/figurines/${fileName}`,
    caption: safeCaption || undefined,
    shotType,
    match: {
      characterId: matchedCharacter?.id ?? "unknown",
      confidence,
      reason,
      method,
    },
    candidates,
    card: matchedCharacter ? cardFromCharacter(matchedCharacter) : unknownCard(safeCaption),
  };

  const store = await readStore();
  store.sightings = [sighting, ...store.sightings].slice(0, 500);
  await writeStore(store);
  return sighting;
}

export async function listFigurineSightings(limit = 40): Promise<FigurineSighting[]> {
  const store = await readStore();
  return store.sightings.slice(0, Math.max(1, Math.min(limit, 300)));
}

export async function listFigurinesNeedingReview(args?: {
  limit?: number;
  threshold?: number;
}): Promise<FigurineSighting[]> {
  const limit = Math.max(1, Math.min(args?.limit ?? 40, 300));
  const threshold = clampConfidence(args?.threshold ?? 0.7);
  const store = await readStore();
  return store.sightings
    .filter(
      (sighting) =>
        sighting.card.id === "unknown" || sighting.shotType === "group" || sighting.match.confidence < threshold,
    )
    .slice(0, limit);
}

export async function reviewAssignFigurine(args: {
  sightingId: string;
  characterId: string;
}): Promise<FigurineSighting> {
  const store = await readStore();
  const index = store.sightings.findIndex((sighting) => sighting.id === args.sightingId);
  if (index < 0) {
    throw new Error("Figurine sighting not found.");
  }

  const current = store.sightings[index]!;
  const normalizedCharacterId = args.characterId.trim().toLowerCase();
  const matchedCharacter = getSagaCharacterById(normalizedCharacterId);

  const updated: FigurineSighting = {
    ...current,
    match: {
      characterId: matchedCharacter?.id ?? "unknown",
      confidence: matchedCharacter ? 0.99 : 0.5,
      reason: matchedCharacter
        ? `Manually reviewed and assigned to ${matchedCharacter.name}.`
        : "Manually reviewed and kept as Unknown Figurine.",
      method: "manual-review",
    },
    card: matchedCharacter ? cardFromCharacter(matchedCharacter) : unknownCard(current.caption ?? ""),
  };

  store.sightings[index] = updated;
  await writeStore(store);
  return updated;
}