"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CharacterTalkButton = dynamic(() => import("@/components/CharacterTalkButton"), {
  ssr: false,
});

type Props = {
  characterId: string;
};

/** Subtle fade-in + typewriter placeholder only — no full-screen overlays or pointer blocking. */
export default function CharacterTalkButtonWrapper({ characterId }: Props) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      setEntered(true);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className={`relative min-h-[520px] w-full transition-opacity duration-[900ms] ease-out ${
        entered ? "opacity-100" : "opacity-0"
      }`}
    >
      <CharacterTalkButton
        characterId={characterId}
        typedPlaceholderOnMount
        showFullExperienceLink
      />
    </div>
  );
}
