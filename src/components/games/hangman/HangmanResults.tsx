"use client";

import { useRef } from "react";
import html2canvas from "html2canvas";

interface RoundResult {
  word: string;
  category: string;
  won: boolean;
  wrongGuesses: number;
  maxWrong: number;
  guessedBy: string;
  hintGiver: string;
  scoreGain: number;
}

interface HangmanResultsProps {
  results: RoundResult[];
  scores: { name: string; score: number }[];
  onRestart: () => void;
}

export default function HangmanResults({ results, scores, onRestart }: HangmanResultsProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const winner = scores[0].score > scores[1].score ? scores[0] : scores[1].score > scores[0].score ? scores[1] : null;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: "#fef9ee",
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = "date-drop-hangman-results.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error("Screenshot failed:", e);
    }
  };

  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-6">
      <div ref={cardRef} className="w-full bg-[#fef9ee] border-[3px] border-black rounded-2xl shadow-brutal p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🏆</div>
          <h2 className="font-black text-2xl sm:text-3xl uppercase tracking-tight">Hangman Results</h2>
        </div>

        {/* Scoreboard */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {scores.map((s, i) => (
            <div
              key={i}
              className={`border-[3px] border-black rounded-xl p-4 text-center shadow-brutal ${
                winner && winner.name === s.name ? "bg-yellow-200" : "bg-white"
              }`}
            >
              <p className="font-black text-3xl">{s.score}</p>
              <p className="font-bold text-sm uppercase tracking-tight">{s.name}</p>
              {winner && winner.name === s.name && <p className="text-xs font-bold text-yellow-700">👑 Winner!</p>}
            </div>
          ))}
        </div>

        {/* Round history */}
        <div className="space-y-2">
          {results.map((r, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border-[2px] ${
                r.won ? "border-green-400 bg-green-50" : "border-red-300 bg-red-50"
              }`}
            >
              <span className="text-lg">{r.won ? "✅" : "❌"}</span>
              <span className="text-xs text-gray-400 font-bold">R{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm uppercase tracking-tight truncate">{r.word}</p>
                <p className="text-[10px] text-gray-400 font-bold">
                  {r.category} · Hint: {r.hintGiver} · Guess: {r.guessedBy} · {r.wrongGuesses}/{r.maxWrong} wrong
                </p>
              </div>
              <span className="text-xs font-bold">{r.won ? `+${r.scoreGain}` : "+0"}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 w-full">
        <button onClick={handleDownload} className="btn-action px-6 py-3 text-sm flex-1">
          📸 Download Results
        </button>
        <button onClick={onRestart} className="btn-action px-6 py-3 text-sm flex-1">
          🔄 Play Again
        </button>
      </div>
    </div>
  );
}
