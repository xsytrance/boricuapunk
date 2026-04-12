"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type ArchiveRoute = {
  href: string;
  title: string;
  copy: string;
  category: string;
  tags?: string[];
};

type ArchiveRouteFinderProps = {
  routes: ArchiveRoute[];
};

const ALL_CATEGORY = "all";

export default function ArchiveRouteFinder({ routes }: ArchiveRouteFinderProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL_CATEGORY);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(routes.map((route) => route.category))).sort();
    return [ALL_CATEGORY, ...unique];
  }, [routes]);

  const filteredRoutes = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return routes.filter((route) => {
      const categoryMatch = category === ALL_CATEGORY || route.category === category;
      if (!categoryMatch) {
        return false;
      }

      if (!normalized) {
        return true;
      }

      const haystack = [route.title, route.copy, route.href, route.category, ...(route.tags ?? [])]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalized);
    });
  }, [routes, query, category]);

  return (
    <section className="mb-6 rounded-md border-[3px] border-[#7f1d1d]/70 bg-black/60 p-4 shadow-[inset_0_0_30px_rgba(0,0,0,0.65)] md:mb-8 md:p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-[#fb923c]">Route finder</p>
      <p className="mt-2 text-sm text-zinc-500">
        Search and filter archive routes by topic, then jump directly into that section.
      </p>

      <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search routes, topics, or tags"
          className="w-full rounded border border-[#9a3412]/70 bg-black/70 px-3 py-2 text-sm text-[#ffedd5] placeholder:text-zinc-600 focus:border-[#f97316] focus:outline-none"
        />
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="w-full rounded border border-[#9a3412]/70 bg-black/70 px-3 py-2 text-sm uppercase tracking-[0.12em] text-[#fde68a] focus:border-[#f97316] focus:outline-none"
        >
          {categories.map((option) => (
            <option key={option} value={option} className="bg-black text-[#fde68a]">
              {option === ALL_CATEGORY ? "all categories" : option}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-600">
        {filteredRoutes.length} route{filteredRoutes.length === 1 ? "" : "s"} matched
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredRoutes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className="group rounded-md border-[3px] border-[#7f1d1d]/80 bg-gradient-to-b from-[#1a0a0a] via-[#0d0d0d] to-[#050505] p-5 shadow-[inset_0_0_32px_rgba(0,0,0,0.7),0_0_24px_rgba(234,88,12,0.12)] transition duration-300 hover:border-[#f97316] hover:shadow-[inset_0_0_40px_rgba(0,0,0,0.76),0_0_32px_rgba(234,88,12,0.2)]"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-[#fb923c]">
              /{route.href.replace(/^\//, "")}
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl uppercase tracking-[0.04em] text-[#fecaca] transition group-hover:text-[#ffedd5]">
              {route.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">{route.copy}</p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-600">
              {route.category}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}