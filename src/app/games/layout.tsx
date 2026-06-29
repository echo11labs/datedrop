"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, HeartHandshake } from "lucide-react";

function GamesPaused() {
  return (
    <main className="min-h-dvh bg-[var(--color-cream,#FFFBF5)] flex flex-col items-center justify-center overflow-x-hidden p-4 sm:p-5">
      <section className="w-full max-w-xl bg-white border-[3px] border-black rounded-3xl shadow-brutal p-5 text-center sm:p-7 md:p-10">
        <div className="w-16 h-16 mx-auto mb-6 bg-[#dcfce7] border-[3px] border-black rounded-2xl -rotate-3 flex items-center justify-center shadow-brutal">
          <HeartHandshake className="w-8 h-8" strokeWidth={2.5} />
        </div>

        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-black/35 mb-3">
          Paused for now
        </p>
        <h1 className="font-black text-[2rem] md:text-5xl uppercase tracking-tighter leading-none mb-4">
          Games are taking a break.
        </h1>
        <p className="text-base font-medium text-gray-500 leading-relaxed max-w-md mx-auto mb-8">
          DateDrop is focused on the proposal and planning experience right now.
          The games feature is hidden while that core flow gets polished.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-black text-white border-[3px] border-black rounded-2xl px-5 py-3 font-black text-sm uppercase shadow-brutal hover:-translate-y-0.5 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={3} />
          Back to DateDrop
        </Link>
      </section>
    </main>
  );
}

export default function GamesLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname !== "/games") {
    return <GamesPaused />;
  }

  return children;
}
