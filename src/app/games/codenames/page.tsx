"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getSocket, disconnectSocket } from "@/lib/socket";
import { BoardCard, KeyCard } from "@/lib/games/codenames/game-state";
import GameLobby from "@/components/games/codenames/GameLobby";
import CodenamesBoard from "@/components/games/codenames/CodenamesBoard";
import ClueInput from "@/components/games/codenames/ClueInput";
import ClueDisplay from "@/components/games/codenames/ClueDisplay";
import TimerTokens from "@/components/games/codenames/TimerTokens";
import PlayerStatus from "@/components/games/codenames/PlayerStatus";
import CodenamesKeyCard from "@/components/games/codenames/CodenamesKeyCard";
import GameResults from "@/components/games/codenames/GameResults";
import { copyToClipboard } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type GamePhase = "lobby" | "waiting" | "playing" | "finished";

interface GameState {
  gameCode: string;
  board: BoardCard[][];
  keyCard: KeyCard;
  players: { name: string; index: number }[];
  currentTurn: number;
  tokensLeft: number;
  myIndex: number;
  agentsFound: number;
}

interface ClueInfo {
  clue: string;
  number: number;
  givenByName: string;
}

interface GameOverInfo {
  won: boolean;
  reason: string;
}

function CodenamesGame() {
  const searchParams = useSearchParams();
  const codeFromUrl = searchParams.get("code");

  const [phase, setPhase] = useState<GamePhase>("lobby");
  const [gameCode, setGameCode] = useState<string | undefined>(
    codeFromUrl || undefined,
  );
  const [game, setGame] = useState<GameState | null>(null);
  const [currentClue, setCurrentClue] = useState<ClueInfo | null>(null);
  const [gameOver, setGameOver] = useState<GameOverInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [waitingForPartner, setWaitingForPartner] = useState(false);

  const socket = getSocket();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to game server");
    });

    socket.on("player-joined", ({ players }) => {
      setWaitingForPartner(false);
    });

    socket.on("game-started", (data) => {
      setPhase("playing");
      setGame({
        gameCode: data.gameCode,
        board: data.board,
        keyCard: data.keyCard,
        players: data.players,
        currentTurn: data.currentTurn,
        tokensLeft: data.tokensLeft,
        myIndex: data.yourIndex,
        agentsFound: 0,
      });
      setCurrentClue(null);
      setGameOver(null);
    });

    socket.on("clue-given", (data) => {
      setCurrentClue({
        clue: data.clue,
        number: data.number,
        givenByName: data.givenByName,
      });
    });

    socket.on("guess-result", (data) => {
      setGame((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          board: data.board,
          tokensLeft: data.tokensLeft,
          currentTurn: data.currentTurn,
          agentsFound: data.agentsFound,
        };
      });
      if (data.type !== "agent") {
        setCurrentClue(null);
      }
    });

    socket.on("turn-changed", (data) => {
      setGame((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          currentTurn: data.currentTurn,
          tokensLeft: data.tokensLeft,
        };
      });
      setCurrentClue(null);
    });

    socket.on("game-over", (data) => {
      setPhase("finished");
      setGameOver({
        won: data.won,
        reason: data.reason,
      });
      setGame((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          board: data.board,
          agentsFound: data.agentsFound,
          tokensLeft: data.tokensLeft,
        };
      });
    });

    socket.on("player-left", ({ playerName }) => {
      setError(`${playerName} left the game`);
    });

    socket.on("guess-error", ({ error: err }) => {
      setError(err);
      setTimeout(() => setError(null), 3000);
    });

    return () => {
      socket.off("connect");
      socket.off("player-joined");
      socket.off("game-started");
      socket.off("clue-given");
      socket.off("guess-result");
      socket.off("turn-changed");
      socket.off("game-over");
      socket.off("player-left");
      socket.off("guess-error");
    };
  }, []);

  useEffect(() => {
    if (codeFromUrl && phase === "lobby") {
      setPhase("lobby");
    }
  }, [codeFromUrl]);

  const handleCreateGame = useCallback((playerName: string) => {
    socket.emit("create-game", { playerName }, (data: { gameCode: string }) => {
      setGameCode(data.gameCode);
      setPhase("waiting");
      setWaitingForPartner(true);
    });
  }, []);

  const handleJoinGame = useCallback((playerName: string, code: string) => {
    socket.emit(
      "join-game",
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

  const handleGiveClue = useCallback((clue: string, number: number) => {
    socket.emit("give-clue", { clue, number });
  }, []);

  const handleGuess = useCallback((word: string) => {
    socket.emit("make-guess", { word });
  }, []);

  const handleEndTurn = useCallback(() => {
    socket.emit("end-turn");
  }, []);

  const handleRestart = useCallback(() => {
    socket.emit("restart-game", null, () => {});
  }, []);

  const handleCopyLink = async () => {
    if (gameCode) {
      await copyToClipboard(
        `${window.location.origin}/games/codenames?code=${gameCode}`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isSpymaster = game ? game.myIndex === game.currentTurn : false;

  return (
    <div className="min-h-dvh bg-[var(--color-cream)] flex flex-col items-center justify-start overflow-x-hidden px-3 py-5 sm:p-4 md:justify-center">
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-xl border-[3px] border-black shadow-brutal font-bold text-sm z-50">
          {error}
        </div>
      )}

      <div className="w-full max-w-2xl flex flex-col items-center gap-5 sm:gap-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="font-black text-[1.75rem] sm:text-4xl uppercase tracking-tight leading-none">
            🕵️ Codenames Duet
          </h1>
          {game && (
            <p className="text-xs text-gray-500 mt-1">
              Room: <span className="font-black">{game.gameCode}</span>
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
          <GameLobby
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

        {/* Playing */}
        {phase === "playing" && game && (
          <div className="flex flex-col items-center gap-6 w-full">
            {/* Players & Tokens */}
            <PlayerStatus
              players={game.players}
              currentTurn={game.currentTurn}
              myIndex={game.myIndex}
              agentsFound={game.agentsFound}
            />

            <TimerTokens tokensLeft={game.tokensLeft} />

            {/* Clue Area */}
            {currentClue ? (
              <ClueDisplay
                clue={currentClue.clue}
                number={currentClue.number}
                givenByName={currentClue.givenByName}
              />
            ) : (
              <ClueInput
                onGiveClue={handleGiveClue}
                disabled={game.currentTurn !== game.myIndex}
              />
            )}

            {/* Board */}
            <CodenamesBoard
              board={game.board}
              keyCard={game.keyCard}
              isSpymaster={game.currentTurn === game.myIndex}
              currentTurn={game.currentTurn}
              myIndex={game.myIndex}
              onGuess={handleGuess}
              disabled={game.currentTurn !== game.myIndex}
            />

            {/* Key Card (always show to spymaster) */}
            <CodenamesKeyCard keyCard={game.keyCard} />

            {/* End Turn Button */}
            {game.currentTurn === game.myIndex && (
              <button
                onClick={handleEndTurn}
                className="btn-action px-6 py-2 text-sm"
              >
                End Turn
              </button>
            )}
          </div>
        )}

        {/* Game Over */}
        {phase === "finished" && gameOver && game && (
          <GameResults
            won={gameOver.won}
            reason={gameOver.reason}
            agentsFound={game.agentsFound}
            tokensLeft={game.tokensLeft}
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

export default function CodenamesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-[var(--color-cream)] flex items-center justify-center p-4">
          <div className="animate-pulse font-black text-xl uppercase">
            Loading...
          </div>
        </div>
      }
    >
      <CodenamesGame />
    </Suspense>
  );
}
