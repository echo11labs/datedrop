"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getSocket } from "@/lib/socket";
import { copyToClipboard } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { QUESTIONS } from "@/lib/games/know-me/questions";
import KnowMeLobby from "@/components/games/know-me/KnowMeLobby";
import KnowMeWaiting from "@/components/games/know-me/KnowMeWaiting";
import QuestionCard from "@/components/games/know-me/QuestionCard";
import RevealCard from "@/components/games/know-me/RevealCard";
import KnowMeResults from "@/components/games/know-me/KnowMeResults";

type GamePhase =
  | "lobby"
  | "waiting"
  | "answering"
  | "waitingForPartner"
  | "revealing"
  | "finished";

interface PlayerInfo {
  name: string;
  index: number;
}

interface Result {
  questionId: number;
  myAnswer: string;
  partnerAnswer: string;
  isMatch: boolean;
}

function KnowMeGame() {
  const searchParams = useSearchParams();
  const codeFromUrl = searchParams.get("code");

  const [phase, setPhase] = useState<GamePhase>("lobby");
  const [gameCode, setGameCode] = useState<string | undefined>(
    codeFromUrl || undefined,
  );
  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  const [myIndex, setMyIndex] = useState<number>(0);
  const [myName, setMyName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [myAnswers, setMyAnswers] = useState<Record<number, string>>({});
  const [revealIndex, setRevealIndex] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socket = getSocket();

  useEffect(() => {
    socket.on("hk-player-joined", ({ players: p }) => {
      setPlayers(p);
    });

    socket.on("hk-game-start", ({ players: p, yourIndex }) => {
      setPlayers(p);
      setMyIndex(yourIndex);
      setMyName(p[yourIndex].name);
      setPartnerName(p[yourIndex === 0 ? 1 : 0].name);
      setPhase("answering");
      setCurrentQuestion(0);
    });

    socket.on("hk-waiting", () => {
      setPhase("waitingForPartner");
    });

    socket.on("hk-reveal-start", ({ results: r }) => {
      setResults(r);
      setRevealIndex(0);
      setPhase("revealing");
    });

    socket.on("hk-game-over", ({ results: r }) => {
      setResults(r);
      setPhase("finished");
    });

    socket.on("hk-game-restarted", ({ players: p, yourIndex }) => {
      setPlayers(p);
      setMyIndex(yourIndex);
      setMyName(p[yourIndex].name);
      setPartnerName(p[yourIndex === 0 ? 1 : 0].name);
      setPhase("answering");
      setCurrentQuestion(0);
      setMyAnswers({});
      setRevealIndex(0);
      setResults([]);
    });

    socket.on("hk-player-left", ({ playerName }) => {
      setError(`${playerName} left the game`);
      setTimeout(() => setError(null), 5000);
    });

    return () => {
      socket.off("hk-player-joined");
      socket.off("hk-game-start");
      socket.off("hk-waiting");
      socket.off("hk-reveal-start");
      socket.off("hk-game-over");
      socket.off("hk-game-restarted");
      socket.off("hk-player-left");
    };
  }, []);

  const handleCreateGame = useCallback((playerName: string) => {
    socket.emit(
      "hk-create-game",
      { playerName },
      (data: { gameCode: string }) => {
        setGameCode(data.gameCode);
        setPhase("waiting");
      },
    );
  }, []);

  const handleJoinGame = useCallback((playerName: string, code: string) => {
    socket.emit(
      "hk-join-game",
      { gameCode: code, playerName },
      (data: { gameCode?: string; error?: string }) => {
        if (data.error) {
          setError(data.error);
          setTimeout(() => setError(null), 3000);
          return;
        }
        setGameCode(data.gameCode);
      },
    );
  }, []);

  const handleAnswer = useCallback(
    (answer: string) => {
      const q = QUESTIONS[currentQuestion];
      const newAnswers = { ...myAnswers, [q.id]: answer };
      setMyAnswers(newAnswers);

      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion((c) => c + 1);
      } else {
        socket.emit("hk-submit-answers", {
          gameCode,
          answers: Object.entries(newAnswers).map(([id, text]) => ({
            questionId: parseInt(id),
            text,
          })),
        });
        setPhase("waitingForPartner");
      }
    },
    [currentQuestion, myAnswers, gameCode],
  );

  const handleBack = useCallback(() => {
    if (currentQuestion > 0) setCurrentQuestion((c) => c - 1);
  }, [currentQuestion]);

  const handleNextReveal = useCallback(() => {
    if (revealIndex < results.length - 1) {
      setRevealIndex((r) => r + 1);
    } else {
      socket.emit("hk-all-revealed", { gameCode });
    }
  }, [revealIndex, results.length, gameCode]);

  const handleRestart = useCallback(() => {
    socket.emit("hk-restart", { gameCode });
  }, [gameCode]);

  const handleCopyLink = async () => {
    if (gameCode) {
      await copyToClipboard(
        `${window.location.origin}/games/know-me?code=${gameCode}`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const currentReveal = results[revealIndex];
  const currentQ = QUESTIONS[currentQuestion];

  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex flex-col items-center justify-center p-4">
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-xl border-[3px] border-black shadow-brutal font-bold text-sm z-50">
          {error}
        </div>
      )}

      <div className="w-full max-w-2xl flex flex-col items-center gap-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="font-black text-3xl sm:text-4xl uppercase tracking-tight">
            💑 How Well Do You Know Me?
          </h1>
          {gameCode && phase !== "lobby" && (
            <p className="text-xs text-gray-500 mt-1">
              Room: <span className="font-black">{gameCode}</span>
              <button
                onClick={handleCopyLink}
                className="ml-2 underline hover:no-underline"
              >
                {copied ? "Copied!" : "Share"}
              </button>
            </p>
          )}
        </div>

        {/* Lobby */}
        {phase === "lobby" && (
          <KnowMeLobby
            onCreateGame={handleCreateGame}
            onJoinGame={handleJoinGame}
            gameCode={gameCode}
          />
        )}

        {/* Waiting for partner */}
        {phase === "waiting" && gameCode && (
          <KnowMeWaiting
            gameCode={gameCode}
            message="Waiting for your partner to join..."
          />
        )}

        {/* Answering questions */}
        {phase === "answering" && currentQ && (
          <div className="w-full flex flex-col items-center gap-4">
            <div className="bg-[#fce7f3] border-[3px] border-black rounded-xl px-4 py-2 shadow-brutal-sm text-center">
              <p className="text-xs font-bold uppercase tracking-widest">
                Answering about{" "}
                <span className="text-pink-600">{partnerName}</span>
              </p>
            </div>
            <QuestionCard
              questionNumber={currentQuestion + 1}
              totalQuestions={QUESTIONS.length}
              question={currentQ.question}
              emoji={currentQ.emoji}
              partnerName={partnerName}
              onSubmit={handleAnswer}
              onBack={handleBack}
            />
          </div>
        )}

        {/* Waiting for partner to finish */}
        {phase === "waitingForPartner" && gameCode && (
          <KnowMeWaiting
            gameCode={gameCode}
            message="Waiting for your partner to finish answering..."
          />
        )}

        {/* Revealing answers */}
        {phase === "revealing" && currentReveal && (
          <div className="w-full flex flex-col items-center gap-4">
            <div className="bg-[#e0f2fe] border-[3px] border-black rounded-xl px-4 py-2 shadow-brutal-sm text-center">
              <p className="text-xs font-bold uppercase tracking-widest">
                Score:{" "}
                <span className="text-blue-600">
                  {results.filter((r) => r.isMatch).length * 10}
                </span>{" "}
                / {results.length * 10}
              </p>
            </div>
            <RevealCard
              questionNumber={revealIndex + 1}
              totalQuestions={results.length}
              question={
                QUESTIONS.find((q) => q.id === currentReveal.questionId)
                  ?.question || ""
              }
              emoji={
                QUESTIONS.find((q) => q.id === currentReveal.questionId)
                  ?.emoji || ""
              }
              myAnswer={currentReveal.myAnswer}
              partnerAnswer={currentReveal.partnerAnswer}
              isMatch={currentReveal.isMatch}
              myName={myName}
              partnerName={partnerName}
              onNext={handleNextReveal}
              isLast={revealIndex === results.length - 1}
            />
          </div>
        )}

        {/* Final results */}
        {phase === "finished" && (
          <KnowMeResults
            results={results}
            myName={myName}
            partnerName={partnerName}
            onRestart={handleRestart}
          />
        )}
        <Link
          href="/games"
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-black transition-colors font-bold mt-2"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
          Back to Games
        </Link>
      </div>
    </div>
  );
}

export default function KnowMePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center">
          <div className="animate-pulse font-black text-xl uppercase">
            Loading...
          </div>
        </div>
      }
    >
      <KnowMeGame />
    </Suspense>
  );
}
