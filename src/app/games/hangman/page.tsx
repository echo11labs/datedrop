"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  CATEGORIES,
  getRandomWord,
  getPrefilledLetters,
} from "@/lib/games/hangman/words";
import HangmanDrawing from "@/components/games/hangman/HangmanDrawing";

const MAX_WRONG = 7;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

type Phase = "menu" | "category" | "playing" | "won" | "lost";

const DIFFICULTY_CONFIG = {
  easy: {
    label: "Easy",
    color: "#dcfce7",
    border: "#22c55e",
    textColor: "#15803d",
    description: "~45% letters revealed + helpful hint",
  },
  medium: {
    label: "Medium",
    color: "#fef9c3",
    border: "#eab308",
    textColor: "#92400e",
    description: "~25% letters revealed + hint",
  },
  hard: {
    label: "Hard",
    color: "#fee2e2",
    border: "#ef4444",
    textColor: "#b91c1c",
    description: "~10% letters revealed, good luck!",
  },
} as const;

type Difficulty = "easy" | "medium" | "hard";

export default function HangmanPage() {
  const [phase, setPhase] = useState<Phase>("menu");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [wordEntry, setWordEntry] = useState<{
    word: string;
    hint: string;
    difficulty: "easy" | "medium" | "hard";
  }>({ word: "", hint: "", difficulty: "medium" });
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [prefilledLetters, setPrefilledLetters] = useState<Set<string>>(
    new Set(),
  );
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalPlayed, setTotalPlayed] = useState(0);
  const [totalWon, setTotalWon] = useState(0);
  const [lastCorrect, setLastCorrect] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [animLetter, setAnimLetter] = useState<string | null>(null);

  const word = wordEntry.word;
  const allGuessed = new Set([...guessedLetters, ...prefilledLetters]);

  const displayWord = word
    .split("")
    .map((ch) => (ch === " " ? " " : allGuessed.has(ch) ? ch : "_"));

  const isWon =
    word.length > 0 &&
    word.split("").every((ch) => ch === " " || allGuessed.has(ch));
  const isLost = wrongGuesses >= MAX_WRONG;

  // Timer
  useEffect(() => {
    if (!timerActive || isWon || isLost) return;
    if (timeLeft <= 0) {
      setTimerActive(false);
      return;
    }
    const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timerActive, timeLeft, isWon, isLost]);

  // Keyboard support
  const handleGuess = useCallback(
    (letter: string) => {
      const l = letter.toUpperCase();
      if (allGuessed.has(l) || isWon || isLost) return;
      setGuessedLetters((prev) => new Set([...prev, l]));
      setAnimLetter(l);
      setTimeout(() => setAnimLetter(null), 400);
      if (!word.includes(l)) {
        setWrongGuesses((w) => w + 1);
        setLastCorrect(null);
      } else {
        setLastCorrect(l);
      }
    },
    [allGuessed, isWon, isLost, word],
  );

  useEffect(() => {
    if (phase !== "playing") return;
    const handler = (e: KeyboardEvent) => {
      const l = e.key.toUpperCase();
      if (ALPHABET.includes(l)) handleGuess(l);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, handleGuess]);

  // Win/lose detection
  useEffect(() => {
    if (!word) return;
    if (isWon) {
      const bonus = hintUsed ? 0 : 20;
      const timeBonus = timerActive ? Math.floor(timeLeft / 2) : 0;
      const points =
        Math.max(10, (MAX_WRONG - wrongGuesses) * 15) + bonus + timeBonus;
      setScore((s) => s + points);
      setStreak((s) => s + 1);
      setTotalPlayed((t) => t + 1);
      setTotalWon((t) => t + 1);
      setTimerActive(false);
      setPhase("won");
    } else if (isLost) {
      setStreak(0);
      setTotalPlayed((t) => t + 1);
      setTimerActive(false);
      setPhase("lost");
    }
  }, [isWon, isLost]);

  const startGame = (catId: string) => {
    const entry = getRandomWord(catId);
    const pre = getPrefilledLetters(entry.word, difficulty);
    setWordEntry(entry);
    setPrefilledLetters(pre);
    setGuessedLetters(new Set());
    setWrongGuesses(0);
    setSelectedCategory(catId);
    setLastCorrect(null);
    setShowHint(false);
    setHintUsed(false);
    setTimeLeft(
      difficulty === "easy" ? 120 : difficulty === "medium" ? 90 : 60,
    );
    setTimerActive(true);
    setPhase("playing");
  };

  const playAgain = () => {
    setPhase("category");
  };

  const goHome = () => {
    setPhase("menu");
  };

  const catInfo = CATEGORIES.find((c) => c.id === selectedCategory);
  const diffCfg = DIFFICULTY_CONFIG[difficulty];
  const progressPct = Math.round((totalWon / Math.max(1, totalPlayed)) * 100);

  return (
    <div
      className="min-h-screen bg-[var(--color-cream,#fef9ee)] flex flex-col items-center pb-20"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Top bar */}
      <div className="w-full sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b-4 border-black px-4 md:px-8 py-3 flex items-center justify-between max-w-4xl mx-auto">
        <button
          onClick={goHome}
          className="font-black text-xl flex items-center gap-2 hover:opacity-70 transition-opacity"
        >
          🪢{" "}
          <span className="hidden sm:inline uppercase tracking-tight">
            Hangman
          </span>
        </button>

        <div className="flex items-center gap-3">
          {phase === "playing" && (
            <div
              className={`font-black text-sm px-3 py-1 rounded-full border-2 border-black ${timeLeft <= 15 ? "bg-red-200 animate-pulse" : "bg-[#e0f2fe]"}`}
            >
              ⏱ {timeLeft}s
            </div>
          )}
          <div className="font-black text-sm px-3 py-1 bg-black text-white rounded-full">
            🏆 {score}
          </div>
          {streak >= 2 && (
            <div className="font-black text-sm px-3 py-1 bg-[#fef08a] border-2 border-black rounded-full">
              🔥 {streak}
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-w-2xl px-4 pt-6 flex flex-col items-center gap-6">
        {/* ── MENU ──────────────────────────────── */}
        {phase === "menu" && (
          <div className="w-full flex flex-col items-center gap-8 mt-4">
            <div className="text-center">
              <div className="text-6xl mb-3">🪢</div>
              <h1 className="font-black text-4xl md:text-5xl uppercase tracking-tight">
                Hangman
              </h1>
              <p className="text-gray-500 text-sm mt-2">
                Guess the word — some letters are already revealed!
              </p>
            </div>

            {/* Stats */}
            {totalPlayed > 0 && (
              <div className="w-full grid grid-cols-3 gap-3">
                {[
                  { label: "Played", val: totalPlayed },
                  { label: "Won", val: totalWon },
                  { label: "Win Rate", val: `${progressPct}%` },
                ].map(({ label, val }) => (
                  <div
                    key={label}
                    className="bg-white border-4 border-black rounded-2xl p-4 text-center shadow-[4px_4px_0px_#000]"
                  >
                    <p className="font-black text-3xl">{val}</p>
                    <p className="text-[10px] font-bold uppercase text-gray-400 mt-1">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Difficulty Selection */}
            <div className="w-full">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 text-center">
                Choose Difficulty
              </p>
              <div className="grid grid-cols-3 gap-3">
                {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((d) => {
                  const cfg = DIFFICULTY_CONFIG[d];
                  return (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`border-4 border-black rounded-2xl p-4 text-center transition-all ${
                        difficulty === d
                          ? "shadow-[4px_4px_0px_#000] -translate-y-1"
                          : "shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 bg-white"
                      }`}
                      style={
                        difficulty === d ? { backgroundColor: cfg.color } : {}
                      }
                    >
                      <p className="font-black text-base uppercase">
                        {cfg.label}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-1 leading-tight">
                        {cfg.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setPhase("category")}
              className="w-full py-5 bg-black text-white font-black text-2xl uppercase tracking-tight rounded-2xl border-4 border-black shadow-[6px_6px_0px_#555] hover:-translate-y-1 transition-transform"
            >
              Let&apos;s Play 🎮
            </button>
          </div>
        )}

        {/* ── CATEGORY ───────────────────────────── */}
        {phase === "category" && (
          <div className="w-full flex flex-col items-center gap-6">
            <div className="text-center">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">
                Step 1 of 2
              </p>
              <h2 className="font-black text-3xl uppercase tracking-tight">
                Pick a Category
              </h2>
              <div
                className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full border-2 border-black text-sm font-bold"
                style={{ backgroundColor: diffCfg.color }}
              >
                {diffCfg.label} Mode
              </div>
            </div>

            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => startGame(c.id)}
                  className="bg-white border-4 border-black rounded-2xl p-4 shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:-translate-y-1 transition-all text-center"
                >
                  <span className="text-4xl block mb-2">{c.emoji}</span>
                  <span className="font-black text-xs uppercase tracking-tight block leading-tight">
                    {c.name}
                  </span>
                  <span className="text-[9px] text-gray-400 font-bold mt-1 block">
                    {c.words.length} words
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setPhase("menu")}
              className="text-sm font-bold text-gray-400 hover:text-black underline"
            >
              ← Back
            </button>
          </div>
        )}

        {/* ── PLAYING ────────────────────────────── */}
        {phase === "playing" && (
          <div className="w-full flex flex-col items-center gap-4">
            {/* Header row */}
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{catInfo?.emoji}</span>
                <div>
                  <p className="font-black text-sm uppercase">
                    {catInfo?.name}
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold">
                    {diffCfg.label} Mode
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-center">
                  <p className="font-black text-lg text-red-600">
                    {wrongGuesses}/{MAX_WRONG}
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold">WRONG</p>
                </div>
              </div>
            </div>

            {/* Hangman Drawing */}
            <div className="w-full flex justify-center">
              <HangmanDrawing
                wrongGuesses={wrongGuesses}
                maxWrong={MAX_WRONG}
              />
            </div>

            {/* Word display */}
            <div className="w-full bg-white border-4 border-black rounded-2xl px-4 py-5 shadow-[4px_4px_0px_#000] text-center">
              <div className="flex flex-wrap justify-center gap-2">
                {word.split("").map((ch, i) => {
                  if (ch === " ") return <div key={i} className="w-4" />;
                  const revealed = allGuessed.has(ch);
                  const isPrefilled = prefilledLetters.has(ch);
                  return (
                    <div
                      key={i}
                      className={`w-9 h-11 border-b-4 flex items-end justify-center pb-1 transition-all ${
                        revealed
                          ? isPrefilled
                            ? "border-gray-300"
                            : "border-black"
                          : "border-black"
                      }`}
                    >
                      {revealed ? (
                        <span
                          className={`font-black text-xl leading-none ${
                            isPrefilled ? "text-gray-400" : "text-black"
                          }`}
                          style={
                            animLetter === ch
                              ? { animation: "pop 0.3s ease" }
                              : {}
                          }
                        >
                          {ch}
                        </span>
                      ) : (
                        <span className="text-transparent select-none font-black text-xl">
                          ?
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-gray-400 font-bold mt-3 uppercase tracking-widest">
                {
                  displayWord.filter((c) => c !== " ").filter((c) => c !== "_")
                    .length
                }
                /{word.replace(/ /g, "").length} letters revealed
              </p>
            </div>

            {/* Hint */}
            <div className="w-full flex justify-between items-center">
              {!showHint ? (
                <button
                  onClick={() => {
                    setShowHint(true);
                    setHintUsed(true);
                  }}
                  className="text-xs font-black uppercase tracking-widest px-3 py-2 bg-white border-2 border-black rounded-xl hover:bg-gray-100 transition-colors"
                >
                  💡 Use Hint {hintUsed ? "" : "(no bonus)"}
                </button>
              ) : (
                <div className="flex-1 px-4 py-2 bg-[#fef9c3] border-2 border-[#eab308] rounded-xl">
                  <span className="text-xs font-black text-yellow-800">
                    💡 {wordEntry.hint}
                  </span>
                </div>
              )}
              {lastCorrect && (
                <div className="ml-3 px-3 py-2 bg-green-100 border-2 border-green-500 rounded-xl">
                  <span className="text-xs font-black text-green-700">
                    ✅ {lastCorrect} is correct!
                  </span>
                </div>
              )}
            </div>

            {/* Keyboard */}
            <div className="w-full">
              <div className="flex flex-wrap justify-center gap-2">
                {ALPHABET.map((l) => {
                  const isPre = prefilledLetters.has(l);
                  const isGuessed = guessedLetters.has(l);
                  const inWord = word.includes(l);
                  const used = isPre || isGuessed;

                  return (
                    <button
                      key={l}
                      onClick={() => handleGuess(l)}
                      disabled={used}
                      className={`w-10 h-10 md:w-11 md:h-11 font-black text-sm border-2 border-black rounded-xl transition-all ${
                        isPre
                          ? "bg-gray-200 text-gray-400 border-gray-300 cursor-default"
                          : isGuessed
                            ? inWord
                              ? "bg-[#dcfce7] text-green-800 border-green-400"
                              : "bg-[#fee2e2] text-red-400 border-red-300 line-through"
                            : "bg-white hover:bg-black hover:text-white hover:shadow-none shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 cursor-pointer"
                      }`}
                    >
                      {l}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── WON ───────────────────────────────── */}
        {phase === "won" && (
          <div className="w-full flex flex-col items-center gap-6 mt-4">
            <div className="w-full bg-[#dcfce7] border-4 border-black rounded-3xl p-8 text-center shadow-[6px_6px_0px_#000]">
              <div className="text-6xl mb-3">🎉</div>
              <h2 className="font-black text-3xl uppercase tracking-tight mb-1">
                You Got It!
              </h2>
              <p className="font-black text-2xl tracking-[0.2em] text-green-800 mb-3">
                {word}
              </p>
              <p className="text-sm text-gray-600">
                {wrongGuesses}/{MAX_WRONG} wrong guesses
              </p>
              {!hintUsed && (
                <p className="text-xs font-bold text-green-700 mt-1">
                  +20 no-hint bonus!
                </p>
              )}
              {streak >= 2 && (
                <div className="mt-3 inline-block px-4 py-2 bg-[#fef08a] border-2 border-black rounded-full">
                  <p className="font-black text-sm">🔥 {streak} Streak!</p>
                </div>
              )}
            </div>
            <div className="w-full flex gap-3">
              <button
                onClick={playAgain}
                className="flex-1 py-4 bg-black text-white font-black text-lg uppercase rounded-2xl border-4 border-black shadow-[4px_4px_0px_#555] hover:-translate-y-1 transition-transform"
              >
                Play Again →
              </button>
              <button
                onClick={goHome}
                className="px-5 py-4 bg-white font-black text-lg uppercase rounded-2xl border-4 border-black shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-transform"
              >
                🏠
              </button>
            </div>
          </div>
        )}

        {/* ── LOST ──────────────────────────────── */}
        {phase === "lost" && (
          <div className="w-full flex flex-col items-center gap-6 mt-4">
            <div className="w-full bg-[#fee2e2] border-4 border-black rounded-3xl p-8 text-center shadow-[6px_6px_0px_#000]">
              <div className="text-6xl mb-3">💀</div>
              <h2 className="font-black text-3xl uppercase tracking-tight mb-1">
                Hanged!
              </h2>
              <p className="text-sm text-gray-500 mb-3">The word was:</p>
              <p className="font-black text-3xl tracking-[0.2em] text-red-700">
                {word}
              </p>
              <p className="text-xs text-gray-500 mt-2">💡 {wordEntry.hint}</p>
              {streak > 0 && (
                <p className="text-xs text-gray-400 mt-2">
                  Streak broken at {streak}
                </p>
              )}
            </div>
            <div className="w-full flex gap-3">
              <button
                onClick={playAgain}
                className="flex-1 py-4 bg-black text-white font-black text-lg uppercase rounded-2xl border-4 border-black shadow-[4px_4px_0px_#555] hover:-translate-y-1 transition-transform"
              >
                Try Again →
              </button>
              <button
                onClick={goHome}
                className="px-5 py-4 bg-white font-black text-lg uppercase rounded-2xl border-4 border-black shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-transform"
              >
                🏠
              </button>
            </div>
          </div>
        )}

        <div className="w-full max-w-2xl px-4 flex justify-center mt-2 pb-4">
          <Link
            href="/games"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-black transition-colors font-bold"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
            Back to Games
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pop {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.4);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
