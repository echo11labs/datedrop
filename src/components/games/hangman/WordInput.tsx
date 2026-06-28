"use client";

import { useState } from "react";

interface WordInputProps {
  categoryEmoji: string;
  categoryName: string;
  onSubmit: (word: string) => void;
}

export default function WordInput({ categoryEmoji, categoryName, onSubmit }: WordInputProps) {
  const [word, setWord] = useState("");

  const handleSubmit = () => {
    const cleaned = word.trim().toLowerCase().replace(/[^a-z]/g, "");
    if (cleaned.length >= 3 && cleaned.length <= 20) {
      onSubmit(cleaned);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && word.trim().length >= 3) handleSubmit();
  };

  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-5">
      <div className="bg-[#fce7f3] border-[3px] border-black rounded-xl px-6 py-3 shadow-brutal text-center">
        <p className="text-xs font-bold uppercase tracking-widest">
          Category: {categoryEmoji} {categoryName}
        </p>
      </div>

      <div className="bg-white border-[3px] border-black rounded-2xl shadow-brutal p-8 text-center w-full">
        <h3 className="font-black text-xl uppercase tracking-tight mb-2">Secret Word</h3>
        <p className="text-xs text-gray-500 mb-4">Type a word for your partner to guess (3-20 letters)</p>
        <input
          type="text"
          placeholder="e.g. sunset"
          value={word}
          onChange={(e) => setWord(e.target.value.toLowerCase())}
          onKeyDown={handleKeyDown}
          className="input-brutal text-center text-2xl font-black tracking-[0.2em] uppercase w-full"
          maxLength={20}
          autoFocus
        />
        <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest font-bold">
          {word.length < 3
            ? `Type at least ${3 - word.length} more letter${3 - word.length !== 1 ? "s" : ""}`
            : "Ready to go!"}
        </p>
      </div>

      <button
        onClick={handleSubmit}
        disabled={word.trim().length < 3}
        className="btn-action px-8 py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Set Word & Start Guessing →
      </button>
    </div>
  );
}
