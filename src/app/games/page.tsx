"use client";

import Link from "next/link";
import { Shield, Palette, Heart, Type, User, ArrowLeft } from "lucide-react";

const GAMES = [
  {
    href: "/games/codenames",
    icon: Shield,
    title: "Codenames Duet",
    desc: "Cooperative word game for two",
    bg: "bg-[#e0f2fe]",
    players: "2 players",
  },
  {
    href: "/games/draw-guess",
    icon: Palette,
    title: "Draw & Guess",
    desc: "One draws, the other guesses",
    bg: "bg-[#fce7f3]",
    players: "2 players",
  },
  {
    href: "/games/know-me",
    icon: Heart,
    title: "How Well Do You Know Me?",
    desc: "Answer questions about each other",
    bg: "bg-[#f3e8ff]",
    players: "2 players",
  },
  {
    href: "/games/hangman",
    icon: Type,
    title: "Hangman",
    desc: "Guess the word before it's too late",
    bg: "bg-[#fef9c3]",
    players: "1-2 players",
  },
  {
    href: "/games/face-quiz",
    icon: User,
    title: "Who Is It?",
    desc: "Identify famous faces from blurry photos",
    bg: "bg-[#ffedd5]",
    players: "Solo",
  },
];

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-[var(--color-cream,#FFFBF5)] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="font-black text-4xl uppercase tracking-tight mb-2">
            Games
          </h1>
          <p className="text-sm text-gray-500">
            Play together with your partner
          </p>
        </div>

        <div className="w-full flex flex-col gap-3">
          {GAMES.map((game) => {
            const Icon = game.icon;
            return (
              <Link
                key={game.href}
                href={game.href}
                className="w-full bg-white border-[3px] border-black shadow-brutal rounded-xl p-5 hover:shadow-brutal-lg hover:-translate-y-0.5 transition-all flex items-center gap-4"
              >
                <div
                  className={`w-12 h-12 ${game.bg} border-2 border-black rounded-xl flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className="w-6 h-6 text-black" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-black text-base uppercase tracking-tight">
                    {game.title}
                  </h2>
                  <p className="text-sm text-gray-500">{game.desc}</p>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 px-2 py-1 rounded-lg flex-shrink-0">
                  {game.players}
                </span>
              </Link>
            );
          })}
        </div>

        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-black transition-colors font-bold"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
          Back to DateDrop
        </Link>
      </div>
    </div>
  );
}
