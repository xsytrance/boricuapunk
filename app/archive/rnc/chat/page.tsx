import RncChatClient from "@/components/rnc/RncChatClient";
import { serializeJsonForHtml } from "@/lib/safeJsonForScript";

type Props = {
  searchParams: Promise<{ name?: string | string[] }>;
};

export default async function RncChatPage({ searchParams }: Props) {
  const sp = await searchParams;
  const raw = sp.name;
  const displayName =
    typeof raw === "string"
      ? raw
      : Array.isArray(raw)
        ? raw[0] ?? ""
        : "";

  const bootstrap = {
    displayName: displayName || "Operator",
    messages: [] as string[],
  };

  return (
    <>
      <script
        id="rnc-chat-bootstrap"
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonForHtml(bootstrap),
        }}
      />
      <RncChatClient />
    </>
  );
}
