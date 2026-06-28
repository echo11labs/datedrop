"use client";

interface HangmanKeyboardProps {
  guessedLetters: Set<string>;
  onGuess: (letter: string) => void;
  disabled?: boolean;
}

const ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["Z","X","C","V","B","N","M"],
];

export default function HangmanKeyboard({ guessedLetters, onGuess, disabled }: HangmanKeyboardProps) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      {ROWS.map((row, ri) => (
        <div key={ri} className="flex gap-1.5">
          {row.map((letter) => {
            const isGuessed = guessedLetters.has(letter);
            return (
              <button
                key={letter}
                onClick={() => onGuess(letter)}
                disabled={isGuessed || disabled}
                className={`
                  w-8 h-10 sm:w-10 sm:h-12 rounded-lg border-[3px] border-black font-black text-sm sm:text-base
                  transition-all duration-150 select-none
                  ${isGuessed
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
                    : "bg-white hover:bg-yellow-200 hover:-translate-y-0.5 hover:shadow-brutal-sm active:translate-y-0 active:shadow-none cursor-pointer"
                  }
                  ${disabled && !isGuessed ? "opacity-40 cursor-not-allowed" : ""}
                `}
              >
                {letter}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
