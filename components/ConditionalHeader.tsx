"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";

/** Hides the site header on immersive `/chat/*` routes. */
export default function ConditionalHeader() {
  const pathname = usePathname();
  if (pathname.startsWith("/chat/")) return null;
  return <Header />;
}
