import Image from "next/image";
import Link from "next/link";

type CharacterCardProps = {
  id: string;
  name: string;
  title: string;
  image: string;
};

export default function CharacterCard({
  id,
  name,
  title,
  image,
}: CharacterCardProps) {
  return (
    <Link
      href={`/characters/${id}`}
      className="group block overflow-hidden rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      <article className="bp-card-surface relative overflow-hidden rounded border-[3px] border-[#9a3412]/90 bg-[#0a0a0a] shadow-[inset_0_0_40px_rgba(0,0,0,0.65),0_0_0_1px_rgba(0,0,0,0.9),0_4px_20px_rgba(0,0,0,0.8)] transition duration-300 ease-out will-change-transform hover:scale-[1.06] hover:border-[#f97316] hover:shadow-[inset_0_0_50px_rgba(127,29,29,0.15),0_0_36px_rgba(234,88,12,0.55),0_0_60px_rgba(234,88,12,0.2)]">
        <div
          className="pointer-events-none absolute inset-0 z-[1] opacity-[0.14] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative aspect-[4/5] w-full bg-gradient-to-b from-[#1c1917] to-[#0a0a0a]">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover object-top opacity-90 transition duration-300 group-hover:opacity-100"
            sizes="(max-width:768px) 50vw, 25vw"
            unoptimized
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10" />
          <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.5)]" />
        </div>
        <div className="relative z-[2] border-t-[3px] border-[#7f1d1d]/70 bg-gradient-to-b from-black/95 to-[#050505] px-3 py-3.5 shadow-[inset_0_2px_12px_rgba(0,0,0,0.6)]">
          <h2 className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-[#fde68a] md:text-sm md:tracking-wide">
            {name}
          </h2>
          <p className="mt-1.5 text-[10px] font-bold uppercase leading-tight tracking-[0.15em] text-[#fb923c]/95 md:text-xs">
            {title}
          </p>
        </div>
      </article>
    </Link>
  );
}
