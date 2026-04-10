/** UI/behavior keys (decoupled from saga `CharacterTag` in types/characters). */
export type CharacterBehaviorTag =
  | "primary"
  | "secondary"
  | "implied"
  | "mystery"
  | "artifact"
  | "enemy"
  | "ally"
  | "spiritual"
  | "system"
  | "environment"
  | "weapon"
  | "leader"
  | "mentor"
  | "warrior";

export type CharacterTagBehavior = {
  className: string;
  messagePool: readonly string[];
};

/**
 * Per-tag styling hooks and message lines for future UI / systems.
 * Pure data — no runtime or browser APIs.
 */
export const CHARACTER_TAG_BEHAVIOR: Record<
  CharacterBehaviorTag,
  CharacterTagBehavior
> = {
  primary: {
    className: "char-tag-primary",
    messagePool: ["ANCHOR SUBJECT.", "PRIMARY NODE."],
  },
  secondary: {
    className: "char-tag-secondary",
    messagePool: ["SECONDARY SIGNAL.", "SUPPORTING NODE."],
  },
  implied: {
    className: "char-tag-implied",
    messagePool: ["IMPLIED PRESENCE.", "INFERENCE REQUIRED."],
  },
  mystery: {
    className: "char-tag-mystery opacity-60 blur-[1px]",
    messagePool: [
      "…YOU SHOULD NOT SEE THIS ONE.",
      "THIS PRESENCE IS NOT MEANT FOR YOU.",
    ],
  },
  artifact: {
    className: "char-tag-artifact glow-artifact",
    messagePool: ["THE OBJECT REMEMBERS.", "DO NOT TOUCH THE RELIC."],
  },
  enemy: {
    className: "char-tag-enemy glitch-enemy",
    messagePool: ["THREAT DETECTED.", "HOSTILE SIGNAL."],
  },
  ally: {
    className: "char-tag-ally",
    messagePool: ["ALLIED FREQUENCY.", "FRIENDLY NODE."],
  },
  spiritual: {
    className: "char-tag-spiritual fade-spiritual",
    messagePool: ["…THEY ARE WATCHING.", "LISTEN CLOSELY."],
  },
  system: {
    className: "char-tag-system",
    messagePool: ["SYSTEM LAYER.", "PROTOCOL REFERENCED."],
  },
  environment: {
    className: "char-tag-environment",
    messagePool: ["TERRAIN DATA.", "ARENA ACTIVE."],
  },
  weapon: {
    className: "char-tag-weapon",
    messagePool: ["ARMAMENT SIGNATURE.", "LETHAL VECTOR."],
  },
  leader: {
    className: "char-tag-leader",
    messagePool: ["COMMAND STRUCTURE.", "HIGH-VALUE PROFILE."],
  },
  mentor: {
    className: "char-tag-mentor",
    messagePool: ["GUIDANCE CHANNEL.", "INSTRUCTOR ECHO."],
  },
  warrior: {
    className: "char-tag-warrior",
    messagePool: ["COMBAT CLASS.", "BLADE DISCIPLINE."],
  },
};

/** Preference order when picking one “primary” tag from a set. */
const PRIMARY_TAG_ORDER: readonly CharacterBehaviorTag[] = [
  "primary",
  "secondary",
  "implied",
  "mentor",
  "leader",
  "enemy",
  "ally",
  "artifact",
  "weapon",
  "warrior",
  "spiritual",
  "system",
  "environment",
  "mystery",
] as const;

export function getCharacterBehaviorClasses(
  tags: readonly CharacterBehaviorTag[],
): string {
  const seen = new Set<string>();
  const parts: string[] = [];
  for (const t of tags) {
    const cn = CHARACTER_TAG_BEHAVIOR[t].className.trim();
    if (!cn || seen.has(cn)) continue;
    seen.add(cn);
    parts.push(cn);
  }
  return parts.join(" ");
}

export function getCharacterMessagePool(
  tags: readonly CharacterBehaviorTag[],
): readonly string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const t of tags) {
    for (const line of CHARACTER_TAG_BEHAVIOR[t].messagePool) {
      if (seen.has(line)) continue;
      seen.add(line);
      out.push(line);
    }
  }
  return out;
}

export function getPrimaryCharacterTag(
  tags: readonly CharacterBehaviorTag[],
): CharacterBehaviorTag | null {
  if (!tags.length) return null;
  for (const candidate of PRIMARY_TAG_ORDER) {
    if (tags.includes(candidate)) return candidate;
  }
  return tags[0] ?? null;
}
