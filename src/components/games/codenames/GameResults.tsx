"use client";

import { useRef } from "react";
import html2canvas from "html2canvas";
import { Download, RotateCcw } from "lucide-react";

interface GameResultsProps {
  won: boolean;
  reason: string;
  agentsFound: number;
  tokensLeft: number;
  onRestart: () => void;
}

export default function GameResults({ won, reason, agentsFound, tokensLeft, onRestart }: GameResultsProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleScreenshot = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: null,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `codenames-result.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Screenshot failed", err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        ref={cardRef}
        className={`
          w-[390px] max-w-full rounded-2xl border-[3px] border-black shadow-brutal p-8 flex flex-col items-center gap-5
          ${won ? "bg-gradient-to-br from-green-100 to-emerald-200" : "bg-gradient-to-br from-red-100 to-rose-200"}
        `}
      >
        <div className="font-black text-xs uppercase tracking-[0.3em] text-black/40">DateDrop × Codenames</div>

        <div className="text-center">
          <h2 className="font-black text-4xl uppercase tracking-tight mb-2">
            {won ? "Mission Complete!" : "Mission Failed"}
          </h2>
          <p className="text-sm text-black/60 font-medium">{reason}</p>
        </div>

        <div className="flex gap-8 text-center">
          <div>
            <div className="font-black text-3xl">{agentsFound}<span className="text-lg text-black/40">/15</span></div>
            <div className="text-xs uppercase tracking-wider font-bold text-black/50">Agents Found</div>
          </div>
          <div>
            <div className="font-black text-3xl">{tokensLeft}</div>
            <div className="text-xs uppercase tracking-wider font-bold text-black/50">Tokens Left</div>
          </div>
        </div>

        <div className="font-black text-xs uppercase tracking-[0.3em] text-black/30 mt-2">datedrop.app</div>
      </div>

      <div className="flex gap-3">
        <button onClick={onRestart} className="btn-action px-6 py-3 text-sm flex items-center gap-2">
          <RotateCcw className="w-4 h-4" /> Play Again
        </button>
        <button onClick={handleScreenshot} className="btn-action px-6 py-3 text-sm flex items-center gap-2">
          <Download className="w-4 h-4" /> Download Result
        </button>
      </div>
    </div>
  );
}
