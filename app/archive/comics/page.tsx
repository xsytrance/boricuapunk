"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';

type FeaturedComic = {
  href: string;
  title: string;
  summary: string;
  issue: string;
  signal: string;
  accent: string;
};

const featuredComics: FeaturedComic[] = [
  {
    href: '/archive/comics/manus-neco-1',
    title: 'Manus Neco: Origin',
    summary: 'First appearance of Manus Neco in the Red Noodle Clan universe.',
    issue: 'Issue 01',
    signal: 'Street signal // live',
    accent: 'from-[#c2410c]/30 via-[#7f1d1d]/25 to-[#431407]/40',
  },
  {
    href: '/archive/comics/hackermouth-watch',
    title: 'Hackermouth: Always Watching',
    summary: 'Hackermouth observes the archive from the digital shadows and turns surveillance into prophecy.',
    issue: 'Signal file',
    signal: 'Archive feed // unstable',
    accent: 'from-[#042f2e]/40 via-[#134e4a]/25 to-[#071b1a]/45',
  },
];

const uploadRules = [
  'Upload one image at a time.',
  'Accepted file types: JPG, PNG, GIF, WebP.',
  'Maximum size: 10MB.',
  'After upload, you will get a direct image link back.',
];

export default function ComicsPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const selectedFileMeta = useMemo(() => {
    if (!selectedFile) return null;

    return {
      name: selectedFile.name,
      sizeLabel: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`,
      typeLabel: selectedFile.type || 'Unknown file type',
    };
  }, [selectedFile]);

  const resetSelection = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setUploadComplete(false);
    setUploadedUrl('');
    setError('');
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setUploadComplete(false);
    setUploadedUrl('');
    setError('');

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl('');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('Please choose a comic image first.');
      return;
    }

    setUploading(true);
    setError('');
    setUploadComplete(false);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/archive/api/uploads', {
        method: 'POST',
        body: formData,
      });

      const result = (await response.json()) as { error?: string; fileUrl?: string };

      if (!response.ok || !result.fileUrl) {
        throw new Error(result.error || 'Upload failed');
      }

      setUploadComplete(true);
      setUploadedUrl(result.fileUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f0f0f] via-black to-[#050505] py-10 text-[#e0e0e0] md:py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[28px] border border-[#9a3412]/35 bg-[linear-gradient(135deg,rgba(24,24,27,0.96),rgba(10,10,10,0.92)),radial-gradient(circle_at_top,rgba(20,184,166,0.10),transparent_36%)] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.38)] sm:p-8 lg:p-10">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#fb923c]/80 to-transparent" />
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)] lg:items-start">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-[#14b8a6]/35 bg-[#042f2e]/75 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.26em] text-[#99f6e4]">
                  Comics intake // ready
                </span>
                <span className="rounded-full border border-[#9a3412]/55 bg-black/50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[#fdba74]">
                  Archive submissions
                </span>
              </div>

              <div className="space-y-4">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.34em] text-[#fb923c]">
                  Red Noodle Clan // comic forge
                </p>
                <h1 className="font-[family-name:var(--font-display)] text-4xl uppercase tracking-[0.05em] text-[#ccfbf1] md:text-5xl">
                  Upload and browse comic strips.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
                  This page is the comic intake desk for Boricuapunk. If you are not technical, that is fine. Choose one image, press upload, and the archive will hand you a direct link back.
                </p>
                <p className="max-w-2xl rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-zinc-300">
                  Plain English version: pick your comic image, upload it here, and then use the link or preview to keep building your archive.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/archive/"
                  className="inline-flex items-center justify-center rounded-full border border-[#9a3412]/70 bg-black/55 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#fde68a] transition hover:border-[#f97316] hover:text-[#fff7ed]"
                >
                  Return to archive
                </Link>
                <a
                  href="https://t.me/kodenbushi_bot"
                  className="inline-flex items-center justify-center rounded-full border border-[#14b8a6]/40 bg-[#042f2e]/65 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#99f6e4] transition hover:border-[#5eead4] hover:text-[#ecfeff]"
                >
                  Ask Koden for prompt help
                </a>
              </div>
            </div>

            <aside className="rounded-[24px] border border-[#9a3412]/35 bg-black/40 p-5 backdrop-blur-sm">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#fb923c]">
                How uploads work
              </p>
              <ol className="mt-4 space-y-3">
                {uploadRules.map((rule, index) => (
                  <li key={rule} className="flex gap-3 rounded-2xl border border-white/6 bg-white/[0.03] p-4">
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#9a3412]/60 bg-black/60 font-mono text-[10px] uppercase tracking-[0.12em] text-[#fde68a]">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-6 text-zinc-300">{rule}</p>
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)]">
          <form
            onSubmit={handleUpload}
            className="rounded-[28px] border border-[#9a3412]/35 bg-[linear-gradient(180deg,rgba(15,15,15,0.92),rgba(8,8,8,0.98))] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:p-8"
          >
            <div className="space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#fb923c]">
                Submit a comic
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-[0.04em] text-[#fecaca] sm:text-3xl">
                One clear upload flow.
              </h2>
              <p className="text-sm leading-6 text-zinc-400 sm:text-base">
                Start with one image. If you need help describing it, naming it, or turning it into a better archive entry, ask Koden in Telegram after the upload finishes.
              </p>
            </div>

            <div className="mt-6 space-y-5">
              <label
                htmlFor="comic-upload"
                className="block cursor-pointer rounded-[24px] border border-dashed border-[#14b8a6]/35 bg-[linear-gradient(180deg,rgba(4,47,46,0.22),rgba(0,0,0,0.35))] p-6 transition hover:border-[#5eead4]/55 hover:bg-[#052f2c]/30"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#99f6e4]">
                      Step 1 // choose image
                    </p>
                    <h3 className="text-xl font-semibold text-[#ecfeff]">
                      {selectedFile ? selectedFile.name : 'Select a comic image to upload'}
                    </h3>
                    <p className="max-w-lg text-sm leading-6 text-zinc-300">
                      JPG, PNG, GIF, or WebP. Maximum size 10MB. Click here to browse your files.
                    </p>
                  </div>
                  <span className="inline-flex items-center justify-center rounded-full border border-[#9a3412]/70 bg-black/60 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#fde68a]">
                    Browse files
                  </span>
                </div>
                <input
                  id="comic-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>

              {selectedFileMeta ? (
                <div className="grid gap-4 rounded-[24px] border border-white/8 bg-white/[0.03] p-4 md:grid-cols-[180px_minmax(0,1fr)]">
                  <div className="relative overflow-hidden rounded-2xl border border-[#9a3412]/30 bg-black/50 aspect-[4/5]">
                    {previewUrl ? (
                      <Image
                        src={previewUrl}
                        alt="Comic preview"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#fb923c]">
                        Step 2 // confirm selection
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-white">Ready to upload</h3>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/6 bg-black/35 p-3">
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Filename</p>
                        <p className="mt-1 text-sm text-zinc-200 break-all">{selectedFileMeta.name}</p>
                      </div>
                      <div className="rounded-2xl border border-white/6 bg-black/35 p-3">
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">File size</p>
                        <p className="mt-1 text-sm text-zinc-200">{selectedFileMeta.sizeLabel}</p>
                      </div>
                      <div className="rounded-2xl border border-white/6 bg-black/35 p-3 sm:col-span-2">
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Type</p>
                        <p className="mt-1 text-sm text-zinc-200">{selectedFileMeta.typeLabel}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={resetSelection}
                      className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-300 transition hover:border-[#fb923c]/55 hover:text-white"
                    >
                      Remove selection
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-[24px] border border-white/8 bg-white/[0.03] px-4 py-5 text-sm leading-6 text-zinc-400">
                  No image selected yet. Choose a file first, then this page will show you a preview before upload.
                </div>
              )}

              {error ? (
                <div className="rounded-2xl border border-red-500/30 bg-red-950/20 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              ) : null}

              {uploadComplete && uploadedUrl ? (
                <div className="rounded-[24px] border border-[#14b8a6]/35 bg-[#031513]/45 p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#99f6e4]">
                    Step 3 // upload complete
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-[#ecfeff]">Your comic is in the archive stream.</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    The upload succeeded. You can open the image directly, copy the link, or ask Koden to help turn it into a stronger comic entry next.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href={uploadedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-[#14b8a6]/40 bg-[#042f2e]/60 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#99f6e4] transition hover:border-[#5eead4] hover:text-[#ecfeff]"
                    >
                      Open uploaded image
                    </a>
                    <button
                      type="button"
                      onClick={resetSelection}
                      className="inline-flex items-center justify-center rounded-full border border-[#9a3412]/60 bg-black/55 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#fde68a] transition hover:border-[#f97316] hover:text-[#fff7ed]"
                    >
                      Upload another comic
                    </button>
                  </div>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={uploading || !selectedFile}
                className="inline-flex w-full items-center justify-center rounded-full border border-[#f97316]/70 bg-[linear-gradient(90deg,#c2410c,#7f1d1d)] px-6 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading ? 'Uploading comic…' : 'Upload comic image'}
              </button>
            </div>
          </form>

          <aside className="rounded-[28px] border border-[#9a3412]/35 bg-black/35 p-6 sm:p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#fb923c]">
              Need help after upload?
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl uppercase tracking-[0.04em] text-[#fecaca]">
              Ask for cleaner prompts, titles, and lore.
            </h2>
            <div className="mt-5 space-y-4">
              {[
                'Koden, give this comic a better title.',
                'Koden, write a darker description for this upload.',
                'Koden, help me place this comic inside the Boricuapunk timeline.',
                'Koden, give me 3 versions of the comic card text.',
              ].map((prompt, index) => (
                <div key={prompt} className="rounded-2xl border border-white/6 bg-white/[0.03] p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#fb923c]">
                    prompt {String(index + 1).padStart(2, '0')}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">{prompt}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="rounded-[28px] border border-[#9a3412]/35 bg-black/35 p-6 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#fb923c]">
                Featured comics
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl uppercase tracking-[0.04em] text-[#fecaca] sm:text-3xl">
                Existing archive signals.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-zinc-400">
              Browse the comic material already living in the archive while you prepare the next upload.
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {featuredComics.map((comic) => (
              <Link key={comic.href} href={comic.href} className="group block">
                <article className="rounded-[24px] border border-[#9a3412]/30 bg-[linear-gradient(180deg,rgba(24,24,27,0.86),rgba(8,8,8,0.96))] p-5 transition hover:border-[#f97316]/75 hover:shadow-[0_0_32px_rgba(234,88,12,0.14)]">
                  <div className={`mb-5 flex aspect-[16/9] items-center justify-center rounded-[20px] border border-white/6 bg-gradient-to-br ${comic.accent}`}>
                    <div className="grid grid-cols-3 gap-2 opacity-80">
                      {Array.from({ length: 9 }).map((_, index) => (
                        <span key={index} className="h-5 w-5 rounded bg-white/20" />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-[#14b8a6]/30 bg-[#042f2e]/45 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#99f6e4]">
                      {comic.issue}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                      {comic.signal}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-[#fff1f2]">{comic.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{comic.summary}</p>
                </article>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
