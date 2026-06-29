"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import {
  PEOPLE_CLEAN,
  CATEGORY_META,
  generateOptions,
  getRandomPeople,
} from "@/lib/games/face-quiz/people";
import type { Person, Category } from "@/lib/games/face-quiz/people";

const TOTAL_ROUNDS = 8;
const MAX_HINTS = 3;
const BASE_POINTS = 300;

type Phase = "menu" | "playing" | "reveal" | "game-over";
type FilterMode = "all" | Category;

interface RoundResult {
  person: Person;
  correct: boolean;
  hintsUsed: number;
  pointsEarned: number;
}

function BlurImage({
  src,
  blur,
  alt,
}: {
  src: string;
  blur: number;
  alt: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-2xl">
        <span className="text-6xl">🤔</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl">
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-2xl flex items-center justify-center">
          <span className="text-4xl animate-spin">⏳</span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-all duration-700 rounded-2xl"
        style={{
          filter: `blur(${blur}px) brightness(0.9)`,
          transform: `scale(${1 + blur * 0.01})`,
        }}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

export default function FaceQuizPage() {
  const [phase, setPhase] = useState<Phase>("menu");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [queue, setQueue] = useState<Person[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<Person[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [timeLeft, setTimeLeft] = useState(20);
  const [timerActive, setTimerActive] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = queue[currentIndex] ?? null;
  const blurAmount = Math.max(0, 20 - hintsUsed * 7);

  // Timer countdown
  useEffect(() => {
    if (!timerActive || phase !== "playing") return;
    if (timeLeft <= 0) {
      handleAnswer(null);
      return;
    }
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timerActive, timeLeft, phase]);

  const startGame = useCallback((filter: FilterMode) => {
    const pool =
      filter === "all"
        ? PEOPLE_CLEAN
        : PEOPLE_CLEAN.filter((p) => p.category === filter);

    const shuffled = [...pool]
      .sort(() => Math.random() - 0.5)
      .slice(0, TOTAL_ROUNDS);
    if (shuffled.length < 2) return; // not enough people

    setQueue(shuffled);
    setCurrentIndex(0);
    setOptions(generateOptions(shuffled[0], PEOPLE_CLEAN));
    setHintsUsed(0);
    setSelectedId(null);
    setScore(0);
    setStreak(0);
    setResults([]);
    setTimeLeft(20);
    setTimerActive(true);
    setPhase("playing");
  }, []);

  const handleAnswer = useCallback(
    (personId: string | null) => {
      if (!current || phase !== "playing") return;
      setTimerActive(false);
      setSelectedId(personId ?? "__timeout__");

      const correct = personId === current.id;
      let pts = 0;
      if (correct) {
        const hintPenalty = hintsUsed * 60;
        const timePts = timeLeft * 5;
        pts = Math.max(30, BASE_POINTS - hintPenalty + timePts);
        setScore((s) => s + pts);
        setStreak((s) => s + 1);
      } else {
        setStreak(0);
      }

      setResults((prev) => [
        ...prev,
        { person: current, correct, hintsUsed, pointsEarned: pts },
      ]);
      setPhase("reveal");
    },
    [current, hintsUsed, phase, timeLeft],
  );

  const nextRound = useCallback(() => {
    const nextIdx = currentIndex + 1;
    if (nextIdx >= queue.length) {
      setPhase("game-over");
      return;
    }
    setCurrentIndex(nextIdx);
    setOptions(generateOptions(queue[nextIdx], PEOPLE_CLEAN));
    setHintsUsed(0);
    setSelectedId(null);
    setTimeLeft(20);
    setTimerActive(true);
    setPhase("playing");
  }, [currentIndex, queue]);

  const useHint = () => {
    if (hintsUsed < MAX_HINTS) {
      setHintsUsed((h) => h + 1);
      setTimeLeft((t) => Math.max(5, t + 5)); // +5s bonus for using hint
    }
  };

  const correctCount = results.filter((r) => r.correct).length;
  const grade =
    correctCount >= 7
      ? "🏆 Genius!"
      : correctCount >= 5
        ? "⭐ Great!"
        : correctCount >= 3
          ? "📚 Good Try"
          : "🌱 Keep Learning";
  const categories = Object.keys(CATEGORY_META) as Category[];

  return (
    <div
      className="min-h-dvh bg-[#fef9ee] flex flex-col items-center overflow-x-hidden pb-20"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Top bar */}
      <div className="w-full sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b-4 border-black px-3 py-3 flex items-center justify-between gap-2 md:px-8">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/games"
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-black transition-colors font-bold"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">Games</span>
          </Link>
          <button
            onClick={() => setPhase("menu")}
            className="font-black text-xl flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            🕵️{" "}
            <span className="hidden sm:inline uppercase tracking-tight">
              Who Is It?
            </span>
          </button>
        </div>
        <div className="flex items-center gap-3">
          {phase === "playing" && (
            <>
              <div
                className={`font-black text-sm px-3 py-1 rounded-full border-2 border-black ${timeLeft <= 5 ? "bg-red-200 animate-pulse" : "bg-[#e0f2fe]"}`}
              >
                ⏱ {timeLeft}s
              </div>
              <div className="text-xs font-bold text-gray-400">
                {currentIndex + 1}/{queue.length}
              </div>
            </>
          )}
          {phase !== "menu" && (
            <div className="font-black text-sm px-3 py-1 bg-black text-white rounded-full">
              🏆 {score}
            </div>
          )}
          {streak >= 2 && (
            <div className="font-black text-sm px-3 py-1 bg-[#fef08a] border-2 border-black rounded-full">
              🔥 {streak}
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-w-xl px-3 pt-5 flex flex-col items-center gap-5 sm:px-4 sm:pt-6 sm:gap-6">
        {/* ── MENU ───────────────────────────────── */}
        {phase === "menu" && (
          <div className="w-full flex flex-col items-center gap-8 mt-4">
            <div className="text-center">
              <div className="text-6xl mb-3">🕵️</div>
              <h1 className="font-black text-[2rem] md:text-5xl uppercase tracking-tight leading-none">
                Who Is It?
              </h1>
              <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">
                Identify famous people from their photos. Images start blurry —
                use hints to reveal more!
              </p>
            </div>

            <div className="w-full bg-white border-4 border-black rounded-2xl p-4 shadow-[4px_4px_0px_#000] space-y-3">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 text-center mb-2">
                How to play
              </p>
              {[
                ["🌫️", "Image starts blurred — can you guess from memory?"],
                ["💡", "Use up to 3 hints to reveal more (costs points)"],
                ["⏱️", "20 seconds per round — faster = more points"],
                ["🔥", "Build streaks for bonus bragging rights"],
              ].map(([icon, text]) => (
                <div
                  key={text as string}
                  className="flex items-center gap-3 text-sm"
                >
                  <span className="text-xl">{icon}</span>
                  <span className="text-gray-600">{text}</span>
                </div>
              ))}
            </div>

            {/* Category Filter */}
            <div className="w-full">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 text-center">
                Choose Category
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => setFilterMode("all")}
                  className={`border-4 border-black rounded-xl py-3 px-2 text-center transition-all ${filterMode === "all" ? "bg-black text-white shadow-none" : "bg-white shadow-[3px_3px_0px_#000] hover:-translate-y-0.5"}`}
                >
                  <div className="text-2xl">🌟</div>
                  <div className="font-black text-[10px] uppercase mt-1">
                    All
                  </div>
                </button>
                {categories.map((cat) => {
                  const meta = CATEGORY_META[cat];
                  return (
                    <button
                      key={cat}
                      onClick={() => setFilterMode(cat)}
                      className={`border-4 border-black rounded-xl py-3 px-2 text-center transition-all ${filterMode === cat ? "bg-black text-white shadow-none" : "bg-white shadow-[3px_3px_0px_#000] hover:-translate-y-0.5"}`}
                    >
                      <div className="text-2xl">{meta.emoji}</div>
                      <div className="font-black text-[10px] uppercase mt-1 leading-tight">
                        {meta.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => startGame(filterMode)}
              className="w-full py-5 bg-black text-white font-black text-2xl uppercase tracking-tight rounded-2xl border-4 border-black shadow-[6px_6px_0px_#555] hover:-translate-y-1 transition-transform"
            >
              Start Quiz 🕵️
            </button>
          </div>
        )}

        {/* ── PLAYING ────────────────────────────── */}
        {phase === "playing" && current && (
          <div className="w-full flex flex-col items-center gap-4">
            {/* Progress bar */}
            <div className="w-full h-2 bg-gray-200 rounded-full border-2 border-black overflow-hidden">
              <div
                className="h-full bg-black transition-all duration-500"
                style={{ width: `${(currentIndex / queue.length) * 100}%` }}
              />
            </div>

            {/* Category badge */}
            <div className="flex items-center gap-2 self-start">
              <span className="text-lg">
                {CATEGORY_META[current.category].emoji}
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-gray-500">
                {CATEGORY_META[current.category].label}
              </span>
            </div>

            {/* Blurred image */}
            <div className="w-full aspect-[4/3] max-h-72 border-4 border-black shadow-[6px_6px_0px_#000] rounded-2xl overflow-hidden bg-gray-100">
              <BlurImage
                src={current.imageUrl}
                blur={blurAmount}
                alt="Who is this?"
              />
            </div>

            {/* Blur indicator */}
            <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-widest self-start">
              {blurAmount === 0
                ? "🔍 Fully revealed"
                : blurAmount <= 7
                  ? "🔎 Almost clear"
                  : "🌫️ Blurred"}
            </div>

            {/* Hints */}
            {hintsUsed > 0 && (
              <div className="w-full space-y-2">
                {hintsUsed >= 1 && (
                  <div className="flex gap-2 items-start px-4 py-3 bg-[#fef9c3] border-2 border-[#eab308] rounded-xl">
                    <span className="text-sm">💡</span>
                    <span className="text-sm font-medium text-yellow-800">
                      {current.hint1}
                    </span>
                  </div>
                )}
                {hintsUsed >= 2 && (
                  <div className="flex gap-2 items-start px-4 py-3 bg-[#e0f2fe] border-2 border-blue-400 rounded-xl">
                    <span className="text-sm">💡</span>
                    <span className="text-sm font-medium text-blue-800">
                      {current.hint2}
                    </span>
                  </div>
                )}
                {hintsUsed >= 3 && (
                  <div className="flex gap-2 items-start px-4 py-3 bg-[#dcfce7] border-2 border-green-400 rounded-xl">
                    <span className="text-sm">💡</span>
                    <span className="text-sm font-medium text-green-800">
                      {current.hint3}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Hint button */}
            {hintsUsed < MAX_HINTS && (
              <button
                onClick={useHint}
                className="self-start text-xs font-black uppercase tracking-widest px-4 py-2 bg-white border-2 border-black rounded-xl hover:bg-gray-100 transition-colors shadow-[2px_2px_0px_#000]"
              >
                💡 Hint {hintsUsed + 1}/3{" "}
                <span className="text-gray-400 font-normal">(-60 pts)</span>
              </button>
            )}

            {/* Answer options */}
            <div className="w-full grid grid-cols-2 gap-3 mt-2">
              {options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleAnswer(opt.id)}
                  className="border-4 border-black bg-white rounded-2xl px-4 py-4 font-black text-sm uppercase tracking-tight text-center shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#000] hover:-translate-y-0.5 transition-all active:translate-y-0 active:shadow-none"
                >
                  {opt.name}
                </button>
              ))}
            </div>

            {/* I don't know */}
            <button
              onClick={() => handleAnswer(null)}
              className="text-xs font-bold text-gray-400 underline hover:text-black mt-1"
            >
              I don&apos;t know → Skip
            </button>
          </div>
        )}

        {/* ── REVEAL ─────────────────────────────── */}
        {phase === "reveal" &&
          current &&
          (() => {
            const lastResult = results[results.length - 1];
            const correct = lastResult?.correct ?? false;
            return (
              <div className="w-full flex flex-col items-center gap-5">
                {/* Result banner */}
                <div
                  className={`w-full border-4 border-black rounded-2xl p-5 text-center shadow-[5px_5px_0px_#000] ${correct ? "bg-[#dcfce7]" : "bg-[#fee2e2]"}`}
                >
                  <div className="text-4xl mb-2">{correct ? "🎉" : "😅"}</div>
                  <p className="font-black text-xl uppercase">
                    {correct ? "Correct!" : "Not quite!"}
                  </p>
                  {correct && lastResult.pointsEarned > 0 && (
                    <p className="font-bold text-green-700 text-sm mt-1">
                      +{lastResult.pointsEarned} points!
                    </p>
                  )}
                </div>

                {/* Revealed image */}
                <div className="w-full aspect-[4/3] max-h-64 border-4 border-black shadow-[6px_6px_0px_#000] rounded-2xl overflow-hidden bg-gray-100">
                  <BlurImage
                    src={current.imageUrl}
                    blur={0}
                    alt={current.name}
                  />
                </div>

                {/* Person info */}
                <div className="w-full bg-white border-4 border-black rounded-2xl p-5 shadow-[4px_4px_0px_#000]">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">
                      {CATEGORY_META[current.category].emoji}
                    </span>
                    <div>
                      <p className="font-black text-2xl uppercase tracking-tight">
                        {current.name}
                      </p>
                      <p className="text-xs text-gray-400 font-bold uppercase">
                        {CATEGORY_META[current.category].label}
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#fef9c3] border-2 border-[#eab308] rounded-xl p-3">
                    <p className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-1">
                      ⭐ Fun Fact
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {current.funFact}
                    </p>
                  </div>
                </div>

                {/* Next button */}
                <button
                  onClick={nextRound}
                  className="w-full py-5 bg-black text-white font-black text-xl uppercase tracking-tight rounded-2xl border-4 border-black shadow-[6px_6px_0px_#555] hover:-translate-y-1 transition-transform"
                >
                  {currentIndex + 1 >= queue.length
                    ? "See Results 🏆"
                    : "Next Person →"}
                </button>
              </div>
            );
          })()}

        {/* ── GAME OVER ──────────────────────────── */}
        {phase === "game-over" && (
          <div className="w-full flex flex-col items-center gap-6 mt-4">
            <div className="text-center">
              <div className="text-6xl mb-2">{grade.split(" ")[0]}</div>
              <h2 className="font-black text-3xl uppercase tracking-tight">
                {grade.split(" ").slice(1).join(" ")}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                You got {correctCount}/{results.length} correct
              </p>
            </div>

            {/* Score card */}
            <div className="w-full bg-black text-white border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_#555]">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="font-black text-3xl">{score}</p>
                  <p className="text-[10px] uppercase font-bold text-gray-400 mt-1">
                    Total Score
                  </p>
                </div>
                <div>
                  <p className="font-black text-3xl">
                    {correctCount}/{results.length}
                  </p>
                  <p className="text-[10px] uppercase font-bold text-gray-400 mt-1">
                    Correct
                  </p>
                </div>
                <div>
                  <p className="font-black text-3xl">
                    {Math.round((correctCount / results.length) * 100)}%
                  </p>
                  <p className="text-[10px] uppercase font-bold text-gray-400 mt-1">
                    Accuracy
                  </p>
                </div>
              </div>
            </div>

            {/* Round breakdown */}
            <div className="w-full space-y-2">
              {results.map((r, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 ${r.correct ? "border-green-400 bg-green-50" : "border-red-300 bg-red-50"}`}
                >
                  <span className="text-lg">{r.correct ? "✅" : "❌"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm uppercase truncate">
                      {r.person.name}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold">
                      {CATEGORY_META[r.person.category].label} · {r.hintsUsed}{" "}
                      hints used
                    </p>
                  </div>
                  {r.correct && (
                    <span className="font-black text-sm text-green-700">
                      +{r.pointsEarned}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="w-full flex gap-3">
              <button
                onClick={() => startGame(filterMode)}
                className="flex-1 py-4 bg-black text-white font-black text-lg uppercase rounded-2xl border-4 border-black shadow-[4px_4px_0px_#555] hover:-translate-y-1 transition-transform"
              >
                Play Again 🔄
              </button>
              <button
                onClick={() => setPhase("menu")}
                className="px-5 py-4 bg-white font-black text-lg uppercase rounded-2xl border-4 border-black shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-transform"
              >
                🏠
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
