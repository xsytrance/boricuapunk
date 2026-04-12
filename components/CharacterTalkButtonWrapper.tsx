"use client";

import dynamic from "next/dynamic";

const CharacterTalkButton = dynamic(() => import("@/components/CharacterTalkButton"), {
  ssr: false,
});

export default CharacterTalkButton;
