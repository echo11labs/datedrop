"use client";

interface ClueDisplayProps {
  clue: string;
  number: number;
  givenByName: string;
}

export default function ClueDisplay({ clue, number, givenByName }: ClueDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">Current Clue</p>
      <div className="flex items-baseline gap-2">
        <span className="font-black text-2xl uppercase tracking-wider">{clue}</span>
        <span className="font-black text-lg text-gray-400">×{number}</span>
      </div>
      <p className="text-xs text-gray-400">from {givenByName}</p>
    </div>
  );
}
