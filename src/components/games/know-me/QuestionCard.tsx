"use client";

import { useState } from "react";

interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  emoji: string;
  partnerName: string;
  onSubmit: (answer: string) => void;
  onBack: () => void;
  disabled?: boolean;
}

export default function QuestionCard({
  questionNumber,
  totalQuestions,
  question,
  emoji,
  partnerName,
  onSubmit,
  onBack,
  disabled,
}: QuestionCardProps) {
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    if (answer.trim()) {
      onSubmit(answer.trim());
      setAnswer("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && answer.trim()) handleSubmit();
  };

  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-6">
      {/* Progress bar */}
      <div className="w-full">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {Math.round((questionNumber / totalQuestions) * 100)}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full border-[2px] border-black overflow-hidden">
          <div
            className="h-full bg-black rounded-full transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="w-full bg-white border-[3px] border-black rounded-2xl shadow-brutal p-8 text-center">
        <div className="text-5xl mb-4">{emoji}</div>
        <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-2">
          What do you think {partnerName} would say?
        </p>
        <h3 className="font-black text-xl sm:text-2xl uppercase tracking-tight leading-tight">
          {question}
        </h3>
      </div>

      {/* Answer input */}
      <div className="w-full flex flex-col gap-3">
        <input
          type="text"
          placeholder="Type your answer..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          className="input-brutal text-center text-lg"
          autoFocus
          disabled={disabled}
          maxLength={100}
        />
        <div className="flex gap-3">
          {questionNumber > 1 && (
            <button onClick={onBack} className="btn-action px-4 py-3 text-sm" disabled={disabled}>
              ← Back
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={!answer.trim() || disabled}
            className="btn-action px-6 py-3 text-sm flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {questionNumber === totalQuestions ? "Submit All ✓" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}
