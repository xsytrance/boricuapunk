import Link from 'next/link';
import Image from 'next/image';

export default function ManusNecoComic() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f0f0f] to-black/95 text-[#e0e0e0] py-12">
      <div className="mx-auto max-w-4xl px-4">
        <nav className="mb-8 flex items-center space-x-4">
          <Link href="/comics" className="text-zinc-500 hover:text-[#fdba74]">
            ← Back to Comics
          </Link>
        </nav>
        
        <header className="mb-12 text-center">
          <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-[0.06em] text-[#ccfbf1] mb-4">
            Manus Neco: Origin Story
          </h1>
          <p className="text-zinc-500 max-w-2xl mx-auto">
            The first appearance of Manus Neco in the Red Noodle Clan universe, emerging from the neon-drenched streets of Neo-San Juan.
          </p>
        </header>
        
        <div className="bg-black/30 border border-[#c2410c]/30 rounded-xl p-8">
          {/* Comic placeholder - in reality this would be an actual comic strip */}
          <div className="aspect-[16/9] w-full bg-gradient-to-r from-[#c2410c]/10 to-[#7f1d1d]/10 flex items-center justify-center text-zinc-400">
            <div className="text-center">
              <h3 className="text-[#fdba74] mb-2">COMIC STRIP</h3>
              <p className="text-zinc-500 max-w-xs">
                [Manus Neco comic strip would go here - featuring the character in their signature pose with the graffiti-style "MANUS NECO" text]
              </p>
            </div>
          </div>
        </div>
        
        <section className="mt-12">
          <h2 className="font-bold text-[#fdba74] mb-4">About This Comic</h2>
          <p className="text-zinc-400">
            This inaugural comic introduces Manus Neco, a key figure in the Red Noodle Clan lore. Known for their connection to the Hackermouth signal and their role in the digital underground of Neo-San Juan.
          </p>
        </section>
      </div>
    </main>
  );
}
