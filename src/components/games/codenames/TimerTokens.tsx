"use client";

interface TimerTokensProps {
  tokensLeft: number;
  maxTokens?: number;
}

export default function TimerTokens({ tokensLeft, maxTokens = 9 }: TimerTokensProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">Tokens</p>
      <div className="flex gap-1.5">
        {Array.from({ length: maxTokens }, (_, i) => (
          <div
            key={i}
            className={`
              w-5 h-5 rounded-full border-[3px] transition-all duration-300
              ${
                i < tokensLeft
                  ? tokensLeft <= 3
                    ? "bg-red-400 border-red-700"
                    : "bg-green-400 border-green-700"
                  : "bg-gray-200 border-gray-400"
              }
            `}
          />
        ))}
      </div>
      <p className={`text-xs font-bold ${tokensLeft <= 3 ? "text-red-500" : "text-gray-500"}`}>
        {tokensLeft} remaining
      </p>
    </div>
  );
}
