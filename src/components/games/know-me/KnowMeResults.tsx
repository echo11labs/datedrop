"use client";

import { useRef } from "react";
import html2canvas from "html2canvas";
import { QUESTIONS } from "@/lib/games/know-me/questions";

interface Result {
  questionId: number;
  myAnswer: string;
  partnerAnswer: string;
  isMatch: boolean;
}

interface KnowMeResultsProps {
  results: Result[];
  myName: string;
  partnerName: string;
  onRestart: () => void;
}

export default function KnowMeResults({ results, myName, partnerName, onRestart }: KnowMeResultsProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const matchCount = results.filter((r) => r.isMatch).length;
  const totalQuestions = results.length;
  const score = matchCount * 10;
  const maxScore = totalQuestions * 10;
  const percentage = Math.round((matchCount / totalQuestions) * 100);

  const getTitle = () => {
    if (percentage >= 90) return "Soulmates! 💕";
    if (percentage >= 70) return "Deeply Connected! 💗";
    if (percentage >= 50) return "Getting There! 💛";
    return "Room to Grow! 💪";
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: "#fef9ee",
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `date-drop-know-me-results.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error("Screenshot failed:", e);
    }
  };

  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-6">
      {/* Screenshot card */}
      <div ref={cardRef} className="w-full bg-[#fef9ee] border-[3px] border-black rounded-2xl shadow-brutal p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">💑</div>
          <h2 className="font-black text-2xl sm:text-3xl uppercase tracking-tight">How Well Do You Know Me?</h2>
          <p className="text-xs text-gray-500 mt-1">{myName} & {partnerName}</p>
        </div>

        {/* Score */}
        <div className="bg-white border-[3px] border-black rounded-xl p-6 shadow-brutal text-center mb-6">
          <p className="text-5xl sm:text-6xl font-black">{score}<span className="text-2xl text-gray-400">/{maxScore}</span></p>
          <p className="font-black text-lg uppercase tracking-tight mt-2">{getTitle()}</p>
          <p className="text-sm text-gray-500 mt-1">{matchCount} out of {totalQuestions} matched ({percentage}%)</p>
        </div>

        {/* Answer summary */}
        <div className="space-y-2">
          {results.map((r, i) => {
            const q = QUESTIONS.find((q) => q.id === r.questionId)!;
            return (
              <div
                key={r.questionId}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border-[2px] ${
                  r.isMatch ? "border-green-400 bg-green-50" : "border-gray-200 bg-white"
                }`}
              >
                <span className="text-lg">{r.isMatch ? "✅" : "❌"}</span>
                <span className="text-lg">{q.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-400 truncate">{q.question}</p>
                  <p className="text-xs font-bold truncate">
                    <span className="text-blue-600">{r.myAnswer}</span>
                    {" vs "}
                    <span className="text-pink-600">{r.partnerAnswer}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action buttons */}
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
