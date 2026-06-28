"use client";

import { KeyCard } from "@/lib/games/codenames/game-state";

interface CodenamesKeyCardProps {
  keyCard: KeyCard;
}

const cardColors: Record<string, string> = {
  agent: "bg-green-400 border-green-700",
  assassin: "bg-gray-900 border-black",
  bystander: "bg-amber-200 border-amber-600",
};

const cardLabels: Record<string, string> = {
  agent: "A",
  assassin: "X",
  bystander: "B",
};

export default function CodenamesKeyCard({ keyCard }: CodenamesKeyCardProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">Your Key Card</p>
      <div className="grid grid-cols-5 gap-0.5 w-[120px]">
        {keyCard.grid.map((row, r) =>
          row.map((type, c) => (
            <div
              key={`${r}-${c}`}
              className={`aspect-square rounded-sm border-[2px] flex items-center justify-center text-[8px] font-black text-white/80 ${cardColors[type]}`}
            >
              {cardLabels[type]}
            </div>
          ))
        )}
      </div>
      <div className="flex gap-3 mt-1 text-[10px]">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-green-400 border border-green-700 inline-block" /> Agent</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-gray-900 border border-black inline-block" /> Assassin</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-amber-200 border border-amber-600 inline-block" /> Bystander</span>
      </div>
    </div>
  );
}
