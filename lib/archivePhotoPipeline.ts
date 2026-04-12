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
import { getLocationBySlug, locations } from "@/types/locations";

type MatchMethod = "vision" | "caption" | "fallback" | "manual-review";
export type MatchEntityType = "character" | "location" | "unknown";
export type ArtStyleCategory =
  | "action-figure"
  | "plushie"
  | "comic-book"
  | "surreal-illustration"
  | "realistic-photo"
  | "anime-illustration"
  | "3d-render"
  | "location-photography"
  | "mixed-media"
  | "unknown";
export type ShotKind = "single-character" | "group-shot" | "location-only" | "object-focus" | "unknown";

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
    entityType: MatchEntityType;
    entityId: string;
    characterId: string;
    confidence: number;
    reason: string;
    method: MatchMethod;
    clues?: string[];
  };
  classification: {
    artStyle: ArtStyleCategory;
    shotKind: ShotKind;
    isMain: boolean;
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
  moderation?: {
    state?: "active" | "unassigned" | "removed";
    notes?: string;
    updatedAt?: string;
  };
};

type SightingStore = {
  version: 1;
  sightings: UploadedSighting[];
};

const STORAGE_PATH = path.join(process.cwd(), "data/runtime/character-sightings.json");
const UPLOADS_DIR = path.join(process.cwd(), "public/uploads/characters");
const RATIONALE_LOG_PATH = path.join(process.cwd(), "data/runtime/ingest-rationale-log.md");

const KNOWN_ART_STYLES: ArtStyleCategory[] = [
  "action-figure",
  "plushie",
  "comic-book",
  "surreal-illustration",
  "realistic-photo",
  "anime-illustration",
  "3d-render",
  "location-photography",
  "mixed-media",
  "unknown",
];

const KNOWN_SHOT_KINDS: ShotKind[] = ["single-character", "group-shot", "location-only", "object-focus", "unknown"];

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

function moderationState(sighting: UploadedSighting): "active" | "unassigned" | "removed" {
  return sighting.moderation?.state ?? "active";
}

function normalizeArtStyle(value: string | undefined): ArtStyleCategory {
  const normalized = (value || "").trim().toLowerCase();
  if (KNOWN_ART_STYLES.includes(normalized as ArtStyleCategory)) {
    return normalized as ArtStyleCategory;
  }
  if (normalized.includes("comic")) return "comic-book";
  if (normalized.includes("surreal")) return "surreal-illustration";
  if (normalized.includes("real") || normalized.includes("photo")) return "realistic-photo";
  if (normalized.includes("action") || normalized.includes("figure")) return "action-figure";
  if (normalized.includes("plush")) return "plushie";
  if (normalized.includes("anime")) return "anime-illustration";
  if (normalized.includes("render") || normalized.includes("3d")) return "3d-render";
  if (normalized.includes("location")) return "location-photography";
  if (normalized.includes("mixed")) return "mixed-media";
  return "unknown";
}

function normalizeShotKind(value: string | undefined): ShotKind {
  const normalized = (value || "").trim().toLowerCase();
  if (KNOWN_SHOT_KINDS.includes(normalized as ShotKind)) {
    return normalized as ShotKind;
  }
  if (normalized.includes("group")) return "group-shot";
  if (normalized.includes("location")) return "location-only";
  if (normalized.includes("object")) return "object-focus";
  if (normalized.includes("single") || normalized.includes("solo")) return "single-character";
  return "unknown";
}

function classifyFromCaption(caption: string): { artStyle: ArtStyleCategory; shotKind: ShotKind; clues: string[] } {
  const text = caption.toLowerCase();
  const clues: string[] = [];

  const artStyle: ArtStyleCategory =
    text.includes("action figure") || text.includes("figurine")
      ? "action-figure"
      : text.includes("plush") || text.includes("stuffed")
        ? "plushie"
        : text.includes("comic") || text.includes("panel")
          ? "comic-book"
          : text.includes("surreal") || text.includes("dream")
            ? "surreal-illustration"
            : text.includes("anime") || text.includes("manga")
              ? "anime-illustration"
              : text.includes("render") || text.includes("cgi") || text.includes("3d")
                ? "3d-render"
                : text.includes("location") || text.includes("landscape")
                  ? "location-photography"
                  : text.length
                    ? "realistic-photo"
                    : "unknown";

  const shotKind: ShotKind = text.includes("group") || text.includes("team") || text.includes("together")
    ? "group-shot"
    : text.includes("location") || text.includes("city") || text.includes("street") || text.includes("landscape")
      ? "location-only"
      : text.includes("object") || text.includes("item")
        ? "object-focus"
        : text.length
          ? "single-character"
          : "unknown";

  clues.push(`caption-style:${artStyle}`);
  clues.push(`caption-shot:${shotKind}`);
  return { artStyle, shotKind, clues };
}

async function appendRationaleLog(entry: string) {
  await fs.mkdir(path.dirname(RATIONALE_LOG_PATH), { recursive: true });
  await fs.appendFile(RATIONALE_LOG_PATH, `${entry}\n`, "utf8");
}

function inferSoloFromCaption(caption: string): "solo" | "group" | "unknown" {
  const text = caption.toLowerCase();
  const groupTokens = [" group", " team", " crowd", " with ", " and ", " together", "duo", "trio"];
  const soloTokens = [" solo", " alone", " portrait", "single", " headshot", "close-up"];
  if (groupTokens.some((token) => text.includes(token))) return "group";
  if (soloTokens.some((token) => text.includes(token))) return "solo";
  return "unknown";
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
  entityType: MatchEntityType;
  entityId: string;
  confidence: number;
  reason: string;
  artStyle: ArtStyleCategory;
  shotKind: ShotKind;
  clues: string[];
};

async function identifyByVision(args: {
  imageDataUrl: string;
  caption: string;
}): Promise<VisionMatch | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const characterCandidates = sagaCharacters.slice(0, 80).map((character) => ({
    id: character.id,
    name: character.name,
    role: character.role,
    description: character.description,
    tags: character.tags,
  }));
  const locationCandidates = locations.map((location) => ({
    id: location.slug,
    name: location.name,
    role: location.role,
    description: location.note,
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
            "You classify Boricuapunk uploads. Return strict JSON only with shape: {\"entityType\":\"character|location|unknown\",\"entityId\":string,\"confidence\":number,\"reason\":string,\"artStyle\":\"action-figure|plushie|comic-book|surreal-illustration|realistic-photo|anime-illustration|3d-render|location-photography|mixed-media|unknown\",\"shotKind\":\"single-character|group-shot|location-only|object-focus|unknown\",\"clues\":string[]}. Use unknown if uncertain.",
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Caption: ${args.caption || "(none)"}\nCharacter candidates: ${JSON.stringify(characterCandidates)}\nLocation candidates: ${JSON.stringify(locationCandidates)}`,
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

  const parse = (value: string): VisionMatch | null => {
    try {
      const parsed = JSON.parse(value) as Partial<VisionMatch>;
      const entityType =
        parsed.entityType === "character" || parsed.entityType === "location" || parsed.entityType === "unknown"
          ? parsed.entityType
          : "unknown";
      const entityId = String(parsed.entityId || "unknown").trim().toLowerCase() || "unknown";
      return {
        entityType,
        entityId,
        confidence: clampConfidence(Number(parsed.confidence ?? 0.4)),
        reason: String(parsed.reason || "Vision model matched manuscript descriptors."),
        artStyle: normalizeArtStyle(parsed.artStyle),
        shotKind: normalizeShotKind(parsed.shotKind),
        clues: Array.isArray(parsed.clues) ? parsed.clues.map((item) => String(item)).slice(0, 6) : [],
      };
    } catch {
      return null;
    }
  };

  const direct = parse(raw);
  if (direct) return direct;
  const jsonBlock = raw.match(/\{[\s\S]*\}/)?.[0];
  if (!jsonBlock) return null;
  return parse(jsonBlock);
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

function cardFromLocation(locationSlug: string) {
  const location = getLocationBySlug(locationSlug);
  if (!location) return null;
  return {
    id: location.slug,
    name: location.name,
    title: location.role,
    description: location.note,
    faction: location.faction,
    tags: ["observer", "mystery"] as CharacterTag[],
    threatLevel: "unknown" as ThreatLevel,
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
  const captionClassification = classifyFromCaption(safeCaption);

  let entityType: MatchEntityType = visionMatch?.entityType ?? "character";
  let entityId = visionMatch?.entityId ?? "unknown";
  let confidence = visionMatch?.confidence ?? 0.25;
  let reason = visionMatch?.reason ?? "No vision API configured; using caption matching fallback.";
  let method: MatchMethod = visionMatch ? "vision" : "fallback";
  let artStyle = visionMatch?.artStyle ?? captionClassification.artStyle;
  let shotKind = visionMatch?.shotKind ?? captionClassification.shotKind;
  const clues = [...(visionMatch?.clues ?? []), ...captionClassification.clues].slice(0, 8);

  if (!visionMatch) {
    const fallback = keywordMatch(safeCaption);
    entityType = "character";
    entityId = fallback.characterId;
    confidence = fallback.confidence;
    reason = fallback.reason;
    method = safeCaption ? "caption" : "fallback";
  }

  const matchedCharacter = entityType === "character" ? getSagaCharacterById(entityId) : undefined;
  const matchedLocation = entityType === "location" ? getLocationBySlug(entityId) : undefined;

  if (entityType === "location" && !matchedLocation) {
    entityType = "unknown";
    entityId = "unknown";
    confidence = Math.min(confidence, 0.45);
  }
  if (entityType === "character" && !matchedCharacter) {
    entityType = "unknown";
    entityId = "unknown";
    confidence = Math.min(confidence, 0.45);
  }

  const safeEntityType: MatchEntityType = entityType;
  const safeEntityId = safeEntityType === "unknown" ? "unknown" : entityId;

  const card =
    safeEntityType === "character" && matchedCharacter
      ? cardFromCharacter(matchedCharacter)
      : safeEntityType === "location"
        ? (cardFromLocation(safeEntityId) ?? unknownCard(safeCaption))
        : unknownCard(safeCaption);

  const quoteSeedCharacter =
    safeEntityType === "character" && matchedCharacter
      ? matchedCharacter
      : sagaCharacters.find((c) => c.id === "hackermouth") ?? sagaCharacters[0]!;

  const generatedQuotes =
    safeEntityType === "character" && matchedCharacter
      ? pickCharacterQuotes(matchedCharacter.id, quoteSeedCharacter)
      : [
          {
            id: shortId("q-unknown"),
            text:
              safeEntityType === "location"
                ? `Location signal locked: ${card.name}. The archive marks this scene as a world anchor.`
                : "The archive breathes first and identifies later.",
            style: "graffiti" as QuoteStyle,
            speakerName: "Hackermouth",
          },
        ];

  const effects = buildHackermouthEffects(quoteSeedCharacter);

  const soloHint = inferSoloFromCaption(safeCaption);
  const computedShotKind =
    shotKind === "unknown" && soloHint === "group"
      ? "group-shot"
      : shotKind === "unknown" && safeEntityType === "location"
        ? "location-only"
        : shotKind;

  const sighting: UploadedSighting = {
    id: shortId("sighting"),
    createdAt: new Date().toISOString(),
    source: args.source,
    imagePath: `/uploads/characters/${fileName}`,
    caption: safeCaption || undefined,
    match: {
      entityType: safeEntityType,
      entityId: safeEntityId,
      characterId: safeEntityType === "character" && matchedCharacter ? matchedCharacter.id : "unknown",
      confidence,
      reason,
      method,
      clues,
    },
    classification: {
      artStyle,
      shotKind: computedShotKind,
      isMain: safeEntityType === "character" && computedShotKind !== "group-shot",
    },
    card,
    quotes: generatedQuotes,
    hackermouthEffects: effects,
    moderation: {
      state: "active",
      notes: soloHint === "group" ? "Caption suggests group shot." : undefined,
      updatedAt: new Date().toISOString(),
    },
  };

  const store = await readStore();
  store.sightings = [sighting, ...store.sightings].slice(0, 300);
  await writeStore(store);

  const rationaleEntityLabel =
    sighting.match.entityType === "location"
      ? `location:${sighting.match.entityId}`
      : sighting.match.entityType === "character"
        ? `character:${sighting.match.entityId}`
        : "unknown";
  const rationaleLine = `- ${sighting.createdAt} | ${sighting.id} | ${rationaleEntityLabel} | style=${sighting.classification.artStyle} | shot=${sighting.classification.shotKind} | confidence=${sighting.match.confidence.toFixed(2)} | ${sighting.match.reason}`;
  await appendRationaleLog(rationaleLine);

  return sighting;
}

function normalizeLegacySighting(sighting: UploadedSighting): UploadedSighting {
  const entityType: MatchEntityType = sighting.match?.entityType
    ? sighting.match.entityType
    : sighting.match.characterId && sighting.match.characterId !== "unknown"
      ? "character"
      : "unknown";
  const entityId = sighting.match?.entityId || (entityType === "character" ? sighting.match.characterId : "unknown");
  const normalized: UploadedSighting = {
    ...sighting,
    match: {
      entityType,
      entityId,
      characterId: sighting.match.characterId || "unknown",
      confidence: sighting.match.confidence,
      reason: sighting.match.reason,
      method: sighting.match.method,
      clues: sighting.match.clues ?? [],
    },
    classification: {
      artStyle: normalizeArtStyle(sighting.classification?.artStyle),
      shotKind: normalizeShotKind(sighting.classification?.shotKind),
      isMain: sighting.classification?.isMain ?? (entityType === "character"),
    },
  };
  return normalized;
}

function pickDominantStyle(sightings: UploadedSighting[]): ArtStyleCategory | null {
  const counts = new Map<ArtStyleCategory, number>();
  for (const row of sightings) {
    if (!row.classification.isMain) continue;
    const style = row.classification.artStyle;
    if (style === "unknown") continue;
    counts.set(style, (counts.get(style) ?? 0) + 1);
  }
  let winner: ArtStyleCategory | null = null;
  let max = 0;
  for (const [style, count] of counts.entries()) {
    if (count > max) {
      winner = style;
      max = count;
    }
  }
  return winner;
}

export async function listSightings(args?:
  | number
  | {
      limit?: number;
      search?: string;
      style?: ArtStyleCategory | "any";
      shotKind?: ShotKind | "any";
      entityType?: MatchEntityType | "any";
      entityId?: string;
      mainOnly?: boolean;
      includeRemoved?: boolean;
      consistentMainStyle?: boolean;
    }): Promise<UploadedSighting[]> {
  const options = typeof args === "number" ? { limit: args } : args ?? {};
  const limit = Math.max(1, Math.min(options.limit ?? 40, 300));
  const style = options.style && options.style !== "any" ? normalizeArtStyle(options.style) : null;
  const shotKind = options.shotKind && options.shotKind !== "any" ? normalizeShotKind(options.shotKind) : null;
  const entityType = options.entityType && options.entityType !== "any" ? options.entityType : null;
  const entityId = (options.entityId || "").trim().toLowerCase();
  const search = (options.search || "").trim().toLowerCase();

  const store = await readStore();
  let rows = store.sightings.map((row) => normalizeLegacySighting(row));

  if (!options.includeRemoved) {
    rows = rows.filter((row) => moderationState(row) !== "removed");
  }
  if (style) rows = rows.filter((row) => row.classification.artStyle === style);
  if (shotKind) rows = rows.filter((row) => row.classification.shotKind === shotKind);
  if (entityType) rows = rows.filter((row) => row.match.entityType === entityType);
  if (entityId) rows = rows.filter((row) => row.match.entityId === entityId || row.card.id === entityId);
  if (options.mainOnly) rows = rows.filter((row) => row.classification.isMain);

  if (search) {
    rows = rows.filter((row) => {
      const blob = [row.card.name, row.card.title, row.card.description, row.caption ?? "", row.match.reason]
        .join(" ")
        .toLowerCase();
      return blob.includes(search);
    });
  }

  if (options.consistentMainStyle) {
    const dominant = pickDominantStyle(rows);
    if (dominant) {
      const consistent = rows.filter((row) => row.classification.artStyle === dominant && row.classification.isMain);
      const remainder = rows.filter((row) => !(row.classification.artStyle === dominant && row.classification.isMain));
      rows = [...consistent, ...remainder];
    }
  }

  return rows.slice(0, limit);
}

export async function listSightingsNeedingReview(args?: {
  limit?: number;
  threshold?: number;
}): Promise<UploadedSighting[]> {
  const limit = Math.max(1, Math.min(args?.limit ?? 40, 300));
  const threshold = clampConfidence(args?.threshold ?? 0.6);
  const rows = await listSightings({ limit: 500, includeRemoved: false });
  return rows
    .filter((sighting) => sighting.card.id === "unknown" || sighting.match.confidence < threshold)
    .slice(0, limit);
}

export async function reviewAssignSighting(args: {
  sightingId: string;
  characterId: string;
}): Promise<UploadedSighting> {
  return adminUpdateSighting({
    sightingId: args.sightingId,
    entityType: args.characterId === "unknown" ? "unknown" : "character",
    entityId: args.characterId,
  });
}

export async function adminUpdateSighting(args: {
  sightingId: string;
  entityType?: MatchEntityType;
  entityId?: string;
  artStyle?: ArtStyleCategory;
  shotKind?: ShotKind;
  isMain?: boolean;
  moderationState?: "active" | "unassigned" | "removed";
  notes?: string;
}): Promise<UploadedSighting> {
  const store = await readStore();
  const index = store.sightings.findIndex((sighting) => sighting.id === args.sightingId);
  if (index < 0) throw new Error("Sighting not found.");

  const current = normalizeLegacySighting(store.sightings[index]!);
  const nextEntityType = args.entityType ?? current.match.entityType;
  const nextEntityId = (args.entityId ?? current.match.entityId).trim().toLowerCase();

  const matchedCharacter = nextEntityType === "character" ? getSagaCharacterById(nextEntityId) : undefined;
  const matchedLocation = nextEntityType === "location" ? getLocationBySlug(nextEntityId) : undefined;

  const safeEntityType: MatchEntityType =
    nextEntityType === "character" && matchedCharacter
      ? "character"
      : nextEntityType === "location" && matchedLocation
        ? "location"
        : "unknown";
  const safeEntityId =
    safeEntityType === "character"
      ? matchedCharacter!.id
      : safeEntityType === "location"
        ? matchedLocation!.slug
        : "unknown";

  const reviewCharacter =
    matchedCharacter ?? sagaCharacters.find((character) => character.id === "hackermouth") ?? sagaCharacters[0]!;
  const nextCard =
    safeEntityType === "character"
      ? cardFromCharacter(matchedCharacter!)
      : safeEntityType === "location"
        ? (cardFromLocation(safeEntityId) ?? unknownCard(current.caption ?? ""))
        : unknownCard(current.caption ?? "");
  const nextQuotes =
    safeEntityType === "character"
      ? pickCharacterQuotes(matchedCharacter!.id, reviewCharacter)
      : [
          {
            id: shortId("q-unknown"),
            text:
              safeEntityType === "location"
                ? `Location signal locked: ${nextCard.name}. The archive marks this scene as a world anchor.`
                : "The archive breathes first and identifies later.",
            style: "graffiti" as QuoteStyle,
            speakerName: "Hackermouth",
          },
        ];

  const updated: UploadedSighting = {
    ...current,
    match: {
      entityType: safeEntityType,
      entityId: safeEntityId,
      characterId: safeEntityType === "character" ? matchedCharacter!.id : "unknown",
      confidence: safeEntityType === "unknown" ? 0.5 : 0.99,
      reason:
        safeEntityType === "character"
          ? `Manually reviewed and assigned to ${matchedCharacter!.name}.`
          : safeEntityType === "location"
            ? `Manually reviewed and assigned to location ${matchedLocation!.name}.`
            : "Manually reviewed and kept as Unknown Signal.",
      method: "manual-review",
      clues: ["manual-admin-update"],
    },
    classification: {
      artStyle: args.artStyle ? normalizeArtStyle(args.artStyle) : current.classification.artStyle,
      shotKind: args.shotKind ? normalizeShotKind(args.shotKind) : current.classification.shotKind,
      isMain: typeof args.isMain === "boolean" ? args.isMain : current.classification.isMain,
    },
    card: nextCard,
    quotes: nextQuotes,
    hackermouthEffects: buildHackermouthEffects(reviewCharacter),
    moderation: {
      state: args.moderationState ?? current.moderation?.state ?? "active",
      notes: args.notes ?? current.moderation?.notes,
      updatedAt: new Date().toISOString(),
    },
  };

  store.sightings[index] = updated;
  await writeStore(store);

  const rationaleEntityLabel =
    updated.match.entityType === "location"
      ? `location:${updated.match.entityId}`
      : updated.match.entityType === "character"
        ? `character:${updated.match.entityId}`
        : "unknown";
  await appendRationaleLog(
    `- ${new Date().toISOString()} | ${updated.id} | admin-update -> ${rationaleEntityLabel} | style=${updated.classification.artStyle} | shot=${updated.classification.shotKind} | ${updated.match.reason}`,
  );

  return updated;
}

export async function readIngestRationaleLog(limitLines = 240): Promise<string> {
  await fs.mkdir(path.dirname(RATIONALE_LOG_PATH), { recursive: true });
  try {
    const raw = await fs.readFile(RATIONALE_LOG_PATH, "utf8");
    const lines = raw.split("\n").filter(Boolean);
    return lines.slice(-Math.max(10, Math.min(limitLines, 1000))).join("\n");
  } catch {
    return "";
  }
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
