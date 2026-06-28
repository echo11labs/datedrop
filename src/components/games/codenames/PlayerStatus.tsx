"use client";

interface PlayerStatusProps {
  players: { name: string; index: number }[];
  currentTurn: number;
  myIndex: number;
  agentsFound: number;
  totalAgents?: number;
}

export default function PlayerStatus({
  players,
  currentTurn,
  myIndex,
  agentsFound,
  totalAgents = 15,
}: PlayerStatusProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-4">
        {players.map((p) => (
          <div
            key={p.index}
            className={`
              px-4 py-2 rounded-xl border-[3px] font-bold text-sm transition-all
              ${p.index === currentTurn ? "border-black shadow-brutal bg-yellow-200" : "border-gray-300 bg-white"}
            `}
          >
            {p.name}
            {p.index === myIndex && " (You)"}
            {p.index === currentTurn && " 🎯"}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="font-bold">Agents:</span>
        <span className="font-black text-lg">{agentsFound}/{totalAgents}</span>
      </div>
    </div>
  );
}
