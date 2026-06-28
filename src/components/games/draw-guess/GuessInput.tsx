"use client";

import { useState } from "react";

interface GuessInputProps {
  onGuess: (word: string) => void;
  disabled: boolean;
  lastResult?: { word: string; correct: boolean } | null;
}

export default function GuessInput({ onGuess, disabled, lastResult }: GuessInputProps) {
  const [guess, setGuess] = useState("");

  const handleSubmit = () => {
    if (guess.trim() && !disabled) {
      onGuess(guess.trim().toLowerCase());
      setGuess("");
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">Your Guess</p>
      {lastResult && (
        <p className={`text-xs font-bold ${lastResult.correct ? "text-green-600" : "text-red-500"}`}>
          {lastResult.correct ? `✓ "${lastResult.word}" is correct!` : `"${lastResult.word}" — try again`}
        </p>
      )}
      <div className="flex gap-2 w-full max-w-sm">
        <input
          type="text"
          placeholder="Type your guess..."
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          disabled={disabled}
          className="input-brutal flex-1 text-center font-bold uppercase tracking-wider text-sm"
          autoComplete="off"
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !guess.trim()}
          className="btn-action px-5 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Guess
        </button>
      </div>
    </div>
  );
}
