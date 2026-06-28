"use client";

import { useState } from "react";

interface ClueInputProps {
  onGiveClue: (clue: string, number: number) => void;
  disabled: boolean;
}

export default function ClueInput({ onGiveClue, disabled }: ClueInputProps) {
  const [clue, setClue] = useState("");
  const [number, setNumber] = useState(1);

  const handleSubmit = () => {
    if (clue.trim() && number >= 1) {
      onGiveClue(clue.trim(), number);
      setClue("");
      setNumber(1);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">Give a Clue</p>
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="One word..."
          value={clue}
          onChange={(e) => setClue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          disabled={disabled}
          className="input-brutal w-40 text-center font-bold uppercase tracking-wider text-sm"
          maxLength={20}
        />
        <span className="font-black text-lg">×</span>
        <div className="flex items-center gap-1 border-[3px] border-black rounded-xl bg-white px-3 py-2">
          <button
            onClick={() => setNumber(Math.max(1, number - 1))}
            disabled={disabled || number <= 1}
            className="font-black text-lg px-1 hover:bg-gray-100 rounded disabled:opacity-30"
          >
            −
          </button>
          <span className="font-black text-xl w-6 text-center">{number}</span>
          <button
            onClick={() => setNumber(Math.min(9, number + 1))}
            disabled={disabled || number >= 9}
            className="font-black text-lg px-1 hover:bg-gray-100 rounded disabled:opacity-30"
          >
            +
          </button>
        </div>
        <button
          onClick={handleSubmit}
          disabled={disabled || !clue.trim()}
          className="btn-action px-4 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );
}
