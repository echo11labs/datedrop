"use client";

import { CATEGORIES } from "@/lib/games/hangman/words";

interface CategoryPickerProps {
  onSelect: (categoryId: string) => void;
  disabled?: boolean;
}

export default function CategoryPicker({ onSelect, disabled }: CategoryPickerProps) {
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-4">
      <div className="text-center">
        <h3 className="font-black text-xl uppercase tracking-tight">Pick a Category</h3>
        <p className="text-xs text-gray-500 mt-1">Choose a theme for the secret word</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            disabled={disabled}
            className="bg-white border-[3px] border-black rounded-xl p-4 shadow-brutal-sm hover:shadow-brutal hover:-translate-y-0.5 transition-all text-center disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="text-3xl block mb-1">{cat.emoji}</span>
            <span className="font-black text-xs uppercase tracking-tight block">{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
