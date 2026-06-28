"use client";

import { useEffect, useState } from "react";

interface HangmanDrawingProps {
  wrongGuesses: number;
  maxWrong: number;
}

export default function HangmanDrawing({ wrongGuesses, maxWrong }: HangmanDrawingProps) {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (wrongGuesses > 0) {
      setAnimating(true);
      const t = setTimeout(() => setAnimating(false), 400);
      return () => clearTimeout(t);
    }
  }, [wrongGuesses]);

  const bodyParts = [
    // Head
    <circle key="head" cx="200" cy="80" r="20" className={`transition-all duration-300 ${wrongGuesses >= 1 ? "fill-black" : "fill-transparent"}`} />,
    // Body
    <line key="body" x1="200" y1="100" x2="200" y2="160" className={`transition-all duration-300 ${wrongGuesses >= 2 ? "stroke-black stroke-[3px]" : "stroke-transparent"}`} />,
    // Left arm
    <line key="larm" x1="200" y1="120" x2="170" y2="145" className={`transition-all duration-300 ${wrongGuesses >= 3 ? "stroke-black stroke-[3px]" : "stroke-transparent"}`} />,
    // Right arm
    <line key="rarm" x1="200" y1="120" x2="230" y2="145" className={`transition-all duration-300 ${wrongGuesses >= 4 ? "stroke-black stroke-[3px]" : "stroke-transparent"}`} />,
    // Left leg
    <line key="lleg" x1="200" y1="160" x2="175" y2="200" className={`transition-all duration-300 ${wrongGuesses >= 5 ? "stroke-black stroke-[3px]" : "stroke-transparent"}`} />,
    // Right leg
    <line key="rleg" x1="200" y1="160" x2="225" y2="200" className={`transition-all duration-300 ${wrongGuesses >= 6 ? "stroke-black stroke-[3px]" : "stroke-transparent"}`} />,
  ];

  // Face expressions based on wrong guesses
  const face = wrongGuesses >= 1 ? (
    <g className="transition-all duration-300">
      {wrongGuesses < maxWrong ? (
        // Worried face
        <>
          <circle cx="192" cy="77" r="2" fill="black" />
          <circle cx="208" cy="77" r="2" fill="black" />
          <path d="M193 88 Q200 85 207 88" stroke="black" strokeWidth="2" fill="none" />
        </>
      ) : (
        // Dead face
        <>
          <line x1="190" y1="74" x2="196" y2="80" stroke="black" strokeWidth="2" />
          <line x1="196" y1="74" x2="190" y2="80" stroke="black" strokeWidth="2" />
          <line x1="204" y1="74" x2="210" y2="80" stroke="black" strokeWidth="2" />
          <line x1="210" y1="74" x2="204" y2="80" stroke="black" strokeWidth="2" />
          <path d="M192 90 Q200 86 208 90" stroke="black" strokeWidth="2" fill="none" />
        </>
      )}
    </g>
  ) : null;

  const isDead = wrongGuesses >= maxWrong;

  return (
    <div className={`relative ${animating ? "animate-bounce" : ""}`}>
      <svg
        viewBox="0 0 300 240"
        className={`w-full max-w-[280px] transition-all duration-300 ${isDead ? "opacity-100" : ""}`}
      >
        {/* Gallows */}
        <line x1="40" y1="230" x2="160" y2="230" stroke="black" strokeWidth="4" strokeLinecap="round" />
        <line x1="80" y1="230" x2="80" y2="30" stroke="black" strokeWidth="4" strokeLinecap="round" />
        <line x1="80" y1="30" x2="200" y2="30" stroke="black" strokeWidth="4" strokeLinecap="round" />
        <line x1="200" y1="30" x2="200" y2="60" stroke="black" strokeWidth="4" strokeLinecap="round" />

        {/* Rope */}
        <line x1="200" y1="30" x2="200" y2="60" stroke="#8B4513" strokeWidth="3" strokeLinecap="round" />

        {/* Ground shadow */}
        {wrongGuesses >= 1 && (
          <ellipse cx="200" cy="210" rx="30" ry="5" fill="black" opacity="0.1" className="transition-all duration-300" />
        )}

        {/* Body parts */}
        {bodyParts}

        {/* Face */}
        {face}

        {/* Heart above head (alive) */}
        {wrongGuesses === 0 && (
          <text x="200" y="45" textAnchor="middle" fontSize="14" className="animate-pulse">💕</text>
        )}

        {/* Dead indicator */}
        {isDead && (
          <text x="250" y="80" textAnchor="middle" fontSize="20">💀</text>
        )}
      </svg>

      {/* Wrong guess counter */}
      <div className="flex justify-center gap-1.5 mt-2">
        {Array.from({ length: maxWrong }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full border-[2px] border-black transition-all duration-300 ${
              i < wrongGuesses ? "bg-red-500" : "bg-green-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
