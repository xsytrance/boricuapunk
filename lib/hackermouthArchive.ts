import type { CharacterTag, ThreatLevel } from "@/types/characters";
import { getFactionById } from "@/types/factions";

export type ArchiveHoverPayload = {
  characterId: string;
  tags: CharacterTag[];
  threatLevel?: ThreatLevel;
  factionId?: string;
};

const ENEMY_LINES = [
  "THREAT NODE HOVERED",
  "HOSTILE PROFILE",
  "TERMINATE CURSOR?",
  "ENEMY SIGNATURE LOGGED",
] as const;

const MYSTERY_LINES = [
  "…DATA …FRAGMENT…",
  "CANNOT PARSE NAME",
  "STATIC IN THE FILE",
  "WHO …AUTHORIZED… THIS",
] as const;

const ALLY_LINES = [
  "ALLIED SUBJECT",
  "SOFT LOCK OK",
  "WATCHING — FRIENDLY",
  "ARCHIVE SMILES",
] as const;

const ENTITY_LINES = [
  "NON-HUMAN WEIGHT DETECTED",
  "OMNISCIENT LAYER TOUCHED",
  "SIGIL OVERFLOW",
  "YOU BOW TO SYSTEMS",
] as const;

const CORRUPT_LINES = [
  "INTEGRITY BLEED",
  "SIGNAL ROT",
  "QUARANTINE …FAILED",
  "CORRUPTION SPIKE",
] as const;

const HIGH_THREAT = [
  "HIGH ALERT HOVER",
  "DO NOT SAVE",
  "PROFILE: DANGEROUS",
] as const;

const NEUTRAL_LINES = [
  "SUBJECT NOTED",
  "SCAN COMPLETE",
  "FILE OPEN",
] as const;

function has(tags: readonly CharacterTag[], t: CharacterTag) {
  return tags.includes(t);
}

function factionTone(factionId?: string): "ally" | "enemy" | "neutral" | "unknown" {
  if (!factionId) return "unknown";
  return getFactionById(factionId)?.alignment ?? "unknown";
}

export function archiveSignalHover(tags: readonly CharacterTag[]): boolean {
  return (
    has(tags, "corrupt") ||
    has(tags, "entity") ||
    has(tags, "unknown")
  );
}

/** 0 = calm … 1 = intense */
export function archiveHoverIntensity(p: ArchiveHoverPayload): number {
  let w = 0.2;
  if (p.threatLevel === "high") w += 0.35;
  if (p.threatLevel === "unknown") w += 0.15;
  if (has(p.tags, "enemy")) w += 0.25;
  if (has(p.tags, "corrupt")) w += 0.3;
  if (has(p.tags, "entity")) w += 0.2;
  if (has(p.tags, "unknown")) w += 0.15;
  const fa = factionTone(p.factionId);
  if (fa === "enemy") w += 0.2;
  if (fa === "ally") w -= 0.1;
  return Math.min(1, Math.max(0, w));
}

export function pickArchiveNodeFlash(
  p: ArchiveHoverPayload,
  rand: () => number,
): string {
  if (p.threatLevel === "high") {
    return HIGH_THREAT[Math.floor(rand() * HIGH_THREAT.length)]!;
  }
  if (has(p.tags, "corrupt")) {
    return CORRUPT_LINES[Math.floor(rand() * CORRUPT_LINES.length)]!;
  }
  if (has(p.tags, "entity")) {
    return ENTITY_LINES[Math.floor(rand() * ENTITY_LINES.length)]!;
  }
  if (has(p.tags, "enemy") || factionTone(p.factionId) === "enemy") {
    return ENEMY_LINES[Math.floor(rand() * ENEMY_LINES.length)]!;
  }
  if (has(p.tags, "mystery")) {
    return MYSTERY_LINES[Math.floor(rand() * MYSTERY_LINES.length)]!;
  }
  if (has(p.tags, "ally") || factionTone(p.factionId) === "ally") {
    return ALLY_LINES[Math.floor(rand() * ALLY_LINES.length)]!;
  }
  return NEUTRAL_LINES[Math.floor(rand() * NEUTRAL_LINES.length)]!;
}

export function pickArchiveToast(
  p: ArchiveHoverPayload,
  rand: () => number,
): string | null {
  const intensity = archiveHoverIntensity(p);
  if (rand() > 0.35 + intensity * 0.45) return null;
  return pickArchiveNodeFlash(p, rand);
}
