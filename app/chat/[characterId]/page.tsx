import { notFound, redirect } from "next/navigation";
import CharacterFullChat from "@/components/CharacterFullChat";
import { getCharacterById } from "@/data/characters";

type Props = { params: Promise<{ characterId: string }> };

export default async function CharacterImmersiveChatPage({ params }: Props) {
  const { characterId } = await params;
  const character = getCharacterById(characterId);
  if (!character) notFound();

  if (character.id === "hackermouth") {
    redirect("/characters/hackermouth");
  }

  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <CharacterFullChat characterId={character.id} characterName={character.name} />
    </main>
  );
}
