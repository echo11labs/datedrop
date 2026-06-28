"use client";

import { useRef } from "react";
import html2canvas from "html2canvas";
import { Download, RotateCcw } from "lucide-react";

interface DrawGuessResultsProps {
  scores: { name: string; score: number }[];
  rounds: number;
  onRestart: () => void;
}

export default function DrawGuessResults({ scores, rounds, onRestart }: DrawGuessResultsProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const winner = scores[0]?.score >= scores[1]?.score ? scores[0] : scores[1];

  const handleScreenshot = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { scale: 3, backgroundColor: null });
      const link = document.createElement("a");
      link.download = "draw-guess-result.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Screenshot failed", err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        ref={cardRef}
        className="w-[390px] max-w-full rounded-2xl border-[3px] border-black shadow-brutal p-8 flex flex-col items-center gap-5 bg-gradient-to-br from-[#fef9c3] via-[#fce7f3] to-[#e0f2fe]"
      >
        <div className="font-black text-xs uppercase tracking-[0.3em] text-black/40">DateDrop × Draw & Guess</div>

        <div className="text-center">
          <h2 className="font-black text-4xl uppercase tracking-tight mb-2">Game Over!</h2>
          <p className="text-sm text-black/60 font-medium">{rounds} rounds completed</p>
        </div>

        <div className="flex gap-8 text-center">
          {scores.map((s, i) => (
            <div key={i}>
              <div className="font-black text-3xl">{s.score}</div>
              <div className="text-xs uppercase tracking-wider font-bold text-black/50">{s.name}</div>
            </div>
          ))}
        </div>

        <div className="bg-white/60 rounded-xl px-4 py-2 border-[2px] border-black/20">
          <p className="font-black text-sm">{winner?.name} wins!</p>
        </div>

        <div className="font-black text-xs uppercase tracking-[0.3em] text-black/30 mt-2">datedrop.app</div>
      </div>

      <div className="flex gap-3">
        <button onClick={onRestart} className="btn-action px-6 py-3 text-sm flex items-center gap-2">
          <RotateCcw className="w-4 h-4" /> Play Again
        </button>
        <button onClick={handleScreenshot} className="btn-action px-6 py-3 text-sm flex items-center gap-2">
          <Download className="w-4 h-4" /> Download Result
        </button>
      </div>
    </div>
  );
}
