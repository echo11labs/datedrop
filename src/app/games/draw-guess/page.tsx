"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getSocket } from "@/lib/socket";
import { copyToClipboard } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DrawGuessLobby from "@/components/games/draw-guess/DrawGuessLobby";
import DrawingCanvas, {
  DrawData,
  DrawingCanvasHandle,
} from "@/components/games/draw-guess/DrawingCanvas";
import GuessInput from "@/components/games/draw-guess/GuessInput";
import DrawGuessResults from "@/components/games/draw-guess/DrawGuessResults";

type GamePhase = "lobby" | "waiting" | "drawing" | "roundEnd" | "finished";

interface PlayerInfo {
  name: string;
  index: number;
}

function DrawGuessGame() {
  const searchParams = useSearchParams();
  const codeFromUrl = searchParams.get("code");

  const [phase, setPhase] = useState<GamePhase>("lobby");
  const [gameCode, setGameCode] = useState<string | undefined>(
    codeFromUrl || undefined,
  );
  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  const [myIndex, setMyIndex] = useState<number>(0);
  const [currentDrawer, setCurrentDrawer] = useState<number>(0);
  const [myWord, setMyWord] = useState<string | null>(null);
  const [timer, setTimer] = useState(60);
  const [scores, setScores] = useState<number[]>([0, 0]);
  const [round, setRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(3);
  const [hint, setHint] = useState<string | null>(null);
  const [lastGuess, setLastGuess] = useState<{
    word: string;
    correct: boolean;
  } | null>(null);
  const [gameOverData, setGameOverData] = useState<{
    scores: { name: string; score: number }[];
    rounds: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [waitingForPartner, setWaitingForPartner] = useState(false);

  const canvasRef = useRef<DrawingCanvasHandle | null>(null);
  const socket = getSocket();

  useEffect(() => {
    socket.on("dg-player-joined", ({ players: p }) => {
      setPlayers(p);
      setWaitingForPartner(false);
    });

    socket.on("dg-round-start", (data) => {
      setPhase("drawing");
      setCurrentDrawer(data.drawerIndex);
      setMyWord(data.word);
      setRound(data.round);
      setTotalRounds(data.totalRounds);
      setScores(data.scores);
      setTimer(data.timer);
      setHint(null);
      setLastGuess(null);
    });

    socket.on("dg-draw-data", (data: DrawData) => {
      // Replay drawing on local canvas
      canvasRef.current?.drawOnCanvas?.(data);
    });

    socket.on("dg-clear-canvas", () => {
      canvasRef.current?.drawOnCanvas?.({ type: "clear" });
    });

    socket.on("dg-timer", ({ timer: t }) => {
      setTimer(t);
    });

    socket.on("dg-hint", ({ hint: h }) => {
      setHint(h);
    });

    socket.on("dg-correct-guess", (data) => {
      setScores(data.scores);
      setLastGuess({ word: data.word, correct: true });
    });

    socket.on("dg-wrong-guess", ({ word }) => {
      setLastGuess({ word, correct: false });
    });

    socket.on("dg-turn-end", (data) => {
      setPhase("roundEnd");
      setRound(data.round);
      setScores(data.scores);
      setCurrentDrawer(data.nextDrawer);
    });

    socket.on("dg-game-over", (data) => {
      setPhase("finished");
      setGameOverData({ scores: data.players, rounds: data.rounds });
    });

    socket.on("dg-game-restarted", () => {
      setPhase("waiting");
      setWaitingForPartner(false);
    });

    socket.on("dg-player-left", ({ playerName }) => {
      setError(`${playerName} left the game`);
      setTimeout(() => setError(null), 5000);
    });

    return () => {
      socket.off("dg-player-joined");
      socket.off("dg-round-start");
      socket.off("dg-draw-data");
      socket.off("dg-clear-canvas");
      socket.off("dg-timer");
      socket.off("dg-hint");
      socket.off("dg-correct-guess");
      socket.off("dg-wrong-guess");
      socket.off("dg-turn-end");
      socket.off("dg-game-over");
      socket.off("dg-game-restarted");
      socket.off("dg-player-left");
    };
  }, []);

  const handleCreateGame = useCallback((playerName: string) => {
    socket.emit(
      "dg-create-game",
      { playerName },
      (data: { gameCode: string }) => {
        setGameCode(data.gameCode);
        setPhase("waiting");
        setWaitingForPartner(true);
      },
    );
  }, []);

  const handleJoinGame = useCallback((playerName: string, code: string) => {
    socket.emit(
      "dg-join-game",
      { gameCode: code, playerName },
      (data: { gameCode?: string; error?: string }) => {
        if (data.error) {
          setError(data.error);
          setTimeout(() => setError(null), 3000);
          return;
        }
        setGameCode(data.gameCode);
        // Don't set phase here — dg-round-start will set it to "drawing"
      },
    );
  }, []);

  const handleDraw = useCallback((data: DrawData) => {
    socket.emit("dg-draw", data);
  }, []);

  const handleClear = useCallback(() => {
    socket.emit("dg-clear-canvas");
  }, []);

  const handleGuess = useCallback((word: string) => {
    socket.emit("dg-guess", { word });
  }, []);

  const handleRestart = useCallback(() => {
    socket.emit("dg-restart", null, () => {});
  }, []);

  const handleCopyLink = async () => {
    if (gameCode) {
      await copyToClipboard(
        `${window.location.origin}/games/draw-guess?code=${gameCode}`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isMyTurn = currentDrawer === myIndex;
  const isDrawer = phase === "drawing" && isMyTurn;

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
            🎨 Draw & Guess
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
          <DrawGuessLobby
            onCreateGame={handleCreateGame}
            onJoinGame={handleJoinGame}
            gameCode={gameCode}
          />
        )}

        {/* Waiting */}
        {phase === "waiting" && waitingForPartner && (
          <div className="flex flex-col items-center gap-4">
            <div className="animate-pulse text-2xl">⏳</div>
            <p className="font-bold text-lg">
              Waiting for your partner to join...
            </p>
            <p className="text-sm text-gray-500">
              Share code: <span className="font-black text-xl">{gameCode}</span>
            </p>
          </div>
        )}

        {/* Waiting for next round */}
        {phase === "roundEnd" && (
          <div className="flex flex-col items-center gap-4">
            <div className="animate-bounce text-2xl">🔄</div>
            <p className="font-bold text-lg">Next round starting...</p>
            <div className="flex gap-6">
              {players.map((p) => (
                <div key={p.index} className="text-center">
                  <p className="font-black text-xl">{scores[p.index]}</p>
                  <p className="text-xs text-gray-500">{p.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Drawing Phase */}
        {phase === "drawing" && (
          <div className="flex flex-col items-center gap-4 w-full">
            {/* Status bar */}
            <div className="w-full flex items-center justify-between bg-white border-[3px] border-black rounded-xl px-4 py-3 shadow-brutal">
              <div className="flex items-center gap-3">
                {players.map((p) => (
                  <div
                    key={p.index}
                    className={`px-3 py-1 rounded-lg border-[2px] font-bold text-sm ${
                      p.index === currentDrawer
                        ? "border-black bg-yellow-200 shadow-brutal-sm"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {p.name}
                    {p.index === myIndex && " (You)"}
                    {p.index === currentDrawer && " 🎨"}
                  </div>
                ))}
              </div>
              <div className="text-right">
                <p
                  className={`font-black text-2xl ${timer <= 10 ? "text-red-500 animate-pulse" : ""}`}
                >
                  {timer}s
                </p>
                <p className="text-[10px] text-gray-400 uppercase font-bold">
                  Round {round}/{totalRounds}
                </p>
              </div>
            </div>

            {/* Word display */}
            {isMyTurn ? (
              <div className="bg-white border-[3px] border-black rounded-xl px-6 py-3 shadow-brutal text-center">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                  Draw this word
                </p>
                <p className="font-black text-3xl uppercase tracking-wider">
                  {myWord}
                </p>
              </div>
            ) : hint ? (
              <div className="bg-[#fef9c3] border-[3px] border-black rounded-xl px-6 py-3 shadow-brutal text-center">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                  Hint
                </p>
                <p className="font-black text-2xl tracking-[0.3em]">{hint}</p>
              </div>
            ) : (
              <div className="bg-[#fce7f3] border-[3px] border-black rounded-xl px-6 py-3 shadow-brutal text-center">
                <p className="font-bold text-sm">
                  {players[currentDrawer]?.name} is drawing...
                </p>
              </div>
            )}

            {/* Canvas */}
            <DrawingCanvas
              ref={canvasRef}
              isDrawing={isDrawer}
              onDraw={handleDraw}
              onClear={handleClear}
              disabled={!isDrawer}
            />

            {/* Guess input (for guesser) */}
            {!isMyTurn && (
              <GuessInput
                onGuess={handleGuess}
                disabled={false}
                lastResult={lastGuess}
              />
            )}
          </div>
        )}

        {/* Game Over */}
        {phase === "finished" && gameOverData && (
          <DrawGuessResults
            scores={gameOverData.scores}
            rounds={gameOverData.rounds}
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

export default function DrawGuessPage() {
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
      <DrawGuessGame />
    </Suspense>
  );
}
