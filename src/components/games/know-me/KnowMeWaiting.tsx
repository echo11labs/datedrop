"use client";

interface KnowMeWaitingProps {
  gameCode: string;
  message: string;
}

export default function KnowMeWaiting({ gameCode, message }: KnowMeWaitingProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="animate-pulse text-4xl">💑</div>
      <p className="font-bold text-lg text-center">{message}</p>
      <p className="text-sm text-gray-500">
        Room: <span className="font-black text-lg">{gameCode}</span>
      </p>
    </div>
  );
}
