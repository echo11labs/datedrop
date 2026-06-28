"use client";

interface RevealCardProps {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  emoji: string;
  myAnswer: string;
  partnerAnswer: string;
  isMatch: boolean;
  myName: string;
  partnerName: string;
  onNext: () => void;
  isLast: boolean;
}

export default function RevealCard({
  questionNumber,
  totalQuestions,
  question,
  emoji,
  myAnswer,
  partnerAnswer,
  isMatch,
  myName,
  partnerName,
  onNext,
  isLast,
}: RevealCardProps) {
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-6">
      {/* Progress */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Reveal {questionNumber}/{totalQuestions}
        </span>
      </div>

      {/* Question */}
      <div className="text-center">
        <span className="text-3xl">{emoji}</span>
        <h3 className="font-black text-lg uppercase tracking-tight mt-2">{question}</h3>
      </div>

      {/* Answers comparison */}
      <div className="w-full grid grid-cols-2 gap-3">
        {/* My answer */}
        <div className={`border-[3px] border-black rounded-xl p-4 text-center shadow-brutal ${isMatch ? "bg-green-100" : "bg-white"}`}>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">{myName} said about {partnerName}</p>
          <p className="font-black text-base sm:text-lg uppercase tracking-tight break-words">{myAnswer || "(no answer)"}</p>
        </div>
        {/* Partner answer */}
        <div className={`border-[3px] border-black rounded-xl p-4 text-center shadow-brutal ${isMatch ? "bg-green-100" : "bg-white"}`}>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">{partnerName} said about {myName}</p>
          <p className="font-black text-base sm:text-lg uppercase tracking-tight break-words">{partnerAnswer || "(no answer)"}</p>
        </div>
      </div>

      {/* Match indicator */}
      <div className={`w-full border-[3px] border-black rounded-xl px-6 py-4 text-center shadow-brutal ${isMatch ? "bg-green-200" : "bg-red-100"}`}>
        {isMatch ? (
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">✅</span>
            <span className="font-black text-lg uppercase">Match! +10 pts</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">❌</span>
            <span className="font-black text-lg uppercase text-red-600">No match</span>
          </div>
        )}
      </div>

      {/* Next button */}
      <button
        onClick={onNext}
        className="btn-action px-8 py-3 text-sm w-full"
      >
        {isLast ? "See Final Results →" : "Next Reveal →"}
      </button>
    </div>
  );
}
