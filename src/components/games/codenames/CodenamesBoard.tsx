"use client";

import { BoardCard, KeyCard } from "@/lib/games/codenames/game-state";

interface CodenamesBoardProps {
  board: BoardCard[][];
  keyCard: KeyCard;
  isSpymaster: boolean;
  currentTurn: number;
  myIndex: number;
  onGuess: (word: string) => void;
  disabled: boolean;
}

const cardColors: Record<string, string> = {
  agent: "bg-green-400 border-green-700",
  assassin: "bg-gray-900 border-black text-white",
  bystander: "bg-amber-200 border-amber-600",
};

export default function CodenamesBoard({
  board,
  keyCard,
  isSpymaster,
  currentTurn,
  myIndex,
  onGuess,
  disabled,
}: CodenamesBoardProps) {
  const isMyTurn = currentTurn === myIndex;

  return (
    <div className="w-full max-w-[400px] mx-auto">
      <div className="grid grid-cols-5 gap-2">
        {board.map((row, r) =>
          row.map((card, c) => {
            const cardType = keyCard.grid[r][c];
            const isRevealed = card.status === "revealed";
            const showColor = isRevealed || isSpymaster;

            return (
              <button
                key={`${r}-${c}`}
                onClick={() => {
                  if (!isRevealed && !disabled && isMyTurn) onGuess(card.word);
                }}
                disabled={isRevealed || disabled || !isMyTurn}
                className={`
                  relative aspect-square flex items-center justify-center
                  border-[3px] rounded-lg font-black text-[10px] sm:text-xs uppercase tracking-wider
                  transition-all duration-150
                  ${showColor ? cardColors[cardType] : "bg-white border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-y-0.5"}
                  ${isRevealed ? "opacity-80" : ""}
                  ${!isRevealed && !disabled && isMyTurn ? "cursor-pointer active:translate-y-0.5 active:shadow-none" : "cursor-default"}
                `}
              >
                <span className="leading-tight text-center px-0.5">{card.word}</span>
                {isRevealed && cardType === "agent" && (
                  <span className="absolute -top-1 -right-1 text-xs">✓</span>
                )}
                {isRevealed && cardType === "assassin" && (
                  <span className="absolute -top-1 -right-1 text-xs">💀</span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
