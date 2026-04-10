/**
 * Ambient “tape” infection layer — placeholder strips until PNG assets are added.
 * pointer-events: none — does not block interaction.
 */

export default function TapeOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[20] overflow-hidden"
      aria-hidden
    >
      {/* Corner / edge placeholders (replace src with PNGs later) */}
      <div
        className="hm-tape absolute left-0 top-0 h-24 w-32 origin-top-left bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-transparent opacity-[0.15] [background-size:100%_100%]"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="hm-tape absolute right-0 top-0 h-20 w-28 origin-top-right bg-gradient-to-bl from-[#1f1f1f] via-[#333] to-transparent opacity-[0.14]"
        style={{ animationDelay: "-1.5s" }}
      />
      <div
        className="hm-tape absolute bottom-0 left-0 h-28 w-36 origin-bottom-left bg-gradient-to-tr from-[#252525] via-[#1a1a1a] to-transparent opacity-[0.13]"
        style={{ animationDelay: "-3s" }}
      />
      <div
        className="hm-tape absolute bottom-0 right-0 h-24 w-32 origin-bottom-right bg-gradient-to-tl from-[#2a2a2a] to-transparent opacity-[0.12]"
        style={{ animationDelay: "-2s" }}
      />
      <div
        className="hm-tape absolute left-[15%] top-[40%] h-16 w-40 -rotate-6 bg-gradient-to-r from-[#222] via-[#333] to-transparent opacity-[0.1]"
        style={{ animationDelay: "-4s" }}
      />
      <div
        className="hm-tape absolute right-[10%] top-[55%] h-14 w-36 rotate-3 bg-gradient-to-l from-[#282828] to-transparent opacity-[0.11]"
        style={{ animationDelay: "-5.5s" }}
      />
    </div>
  );
}
