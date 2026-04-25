import Link from 'next/link';
import Image from 'next/image';

export default function HackermouthComic() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f0f0f] to-black/95 text-[#e0e0e0] py-12">
      <div className="mx-auto max-w-4xl px-4">
        <nav className="mb-8 flex items-center space-x-4">
          <Link href="/archive/comics" className="text-zinc-500 hover:text-[#fdba74]">
            ← Back to Comics
          </Link>
        </nav>
        
        <header className="mb-12 text-center">
          <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-[0.06em] text-[#ccfbf1] mb-4">
            Hackermouth: Always Watching
          </h1>
          <p className="text-zinc-500 max-w-2xl mx-auto">
            Hackermouth observes the archive from the digital shadows, ensuring the integrity of the Red Noodle Clan narrative.
          </p>
        </header>
        
        <div className="bg-black/30 border border-[#064e3b]/30 rounded-xl p-8">
          {/* Comic placeholder - in reality this would be an actual comic strip */}
          <div className="aspect-[16/9] w-full bg-gradient-to-r from-[#064e3b]/10 to-[#5eead4]/10 flex items-center justify-center text-zinc-400">
            <div className="text-center">
              <h3 className="text-[#fdba74] mb-2">COMIC STRIP</h3>
              <p className="text-zinc-500 max-w-xs">
                [Hackermouth comic strip would go here - featuring the masked figure with red eye markings observing digital landscapes]
              </p>
            </div>
          </div>
        </div>
        
        <section className="mt-12">
          <h2 className="font-bold text-[#fdba74] mb-4">About This Comic</h2>
          <p className="text-zinc-400">
            This comic features Hackermouth, the all-seeing digital entity that monitors the Red Noodle Clan archive. Often appearing as a masked figure with distinctive red eye markings, Hackermouth ensures that all archive content stays consistent with the central manuscript signal.
          </p>
        </section>
      </div>
    </main>
  );
}
