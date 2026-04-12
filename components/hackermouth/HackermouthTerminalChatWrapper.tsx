"use client";

import dynamic from "next/dynamic";

const HackermouthTerminalChat = dynamic(() => import("./HackermouthTerminalChat"), {
  ssr: false,
});

export default HackermouthTerminalChat;
