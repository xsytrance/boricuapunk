/** Maps URL/dossier character ids to the engine `character_id` for `/api/chat`. */
export function resolveBackendCharacterId(characterId: string): string {
  if (characterId === "manus-neco") return "manus";
  return characterId;
}

export const PEOPLE_OF_PISCES_COMMIT = "people_of_pisces";
