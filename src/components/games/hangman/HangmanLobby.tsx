"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Link, Wifi, WifiOff } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";
import { getSocket } from "@/lib/socket";

interface HangmanLobbyProps {
  onCreateGame: (playerName: string) => void;
  onJoinGame: (playerName: string, gameCode: string) => void;
  gameCode?: string;
}

export default function HangmanLobby({ onCreateGame, onJoinGame, gameCode }: HangmanLobbyProps) {
  const [mode, setMode] = useState<"choose" | "create" | "join">("choose");
  const [playerName, setPlayerName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [connected, setConnected] = useState(false);

  const socket = getSocket();

  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    setConnected(socket.connected);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const handleCreate = () => {
    if (playerName.trim() && connected) onCreateGame(playerName.trim());
  };

  const handleJoin = () => {
    if (playerName.trim() && joinCode.trim() && connected) onJoinGame(playerName.trim(), joinCode.trim());
  };

  const shareUrl = gameCode ? `${window.location.origin}/games/hangman?code=${gameCode}` : "";

  if (gameCode) {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <div className="text-5xl mb-3">🪢</div>
          <h2 className="font-black text-3xl uppercase tracking-tight mb-2">Game Created!</h2>
          <p className="text-sm text-gray-500">Share this with your partner to start playing</p>
        </div>

        <div className="w-full max-w-sm bg-white border-[3px] border-black rounded-2xl shadow-brutal overflow-hidden">
          <div className="px-6 py-5 text-center border-b-[3px] border-black">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-2">Game Code</p>
            <div className="flex items-center justify-center gap-3">
              <span className="font-black text-5xl tracking-[0.25em]">{gameCode}</span>
              <button
                onClick={async () => {
                  await copyToClipboard(gameCode);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="p-2 rounded-lg border-[3px] border-black hover:bg-gray-100 transition-colors"
                title="Copy code"
              >
                {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-2">Or share link</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white border-[3px] border-black rounded-lg px-3 py-2 text-xs font-mono truncate">
                {shareUrl}
              </div>
              <button
                onClick={async () => {
                  await copyToClipboard(shareUrl);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="btn-action px-3 py-2 text-xs flex items-center gap-1.5 whitespace-nowrap"
              >
                <Link className="w-3.5 h-3.5" />
                {copiedLink ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 animate-pulse">Waiting for partner to join...</p>
      </div>
    );
  }

  if (mode === "choose") {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className={`flex items-center gap-1.5 text-xs font-bold ${connected ? "text-green-600" : "text-red-500"}`}>
          {connected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
          {connected ? "Connected" : "Disconnected — check server"}
        </div>

        <div className="text-center mb-2">
          <h2 className="font-black text-3xl uppercase tracking-tight mb-2">Hangman</h2>
          <p className="text-sm text-gray-500 max-w-xs">Guess the word before time runs out. Take turns picking words for each other!</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setMode("create")}
            disabled={!connected}
            className="btn-action px-8 py-5 text-lg flex flex-col items-center gap-1 min-w-[200px] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="text-2xl">🪢</span>
            <span>Create Game</span>
          </button>
          <button
            onClick={() => setMode("join")}
            disabled={!connected}
            className="btn-action px-8 py-5 text-lg flex flex-col items-center gap-1 min-w-[200px] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="text-2xl">🔤</span>
            <span>Join Game</span>
          </button>
        </div>
        {!connected && (
          <p className="text-xs text-red-500 text-center max-w-xs">
            Make sure you ran <code className="bg-red-100 px-1 rounded">npm run dev</code> to start the game server.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <h2 className="font-black text-2xl uppercase tracking-tight">
        {mode === "create" ? "Create Game" : "Join Game"}
      </h2>
      <div className="w-full max-w-sm flex flex-col gap-3">
        <input
          type="text"
          placeholder="Your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="input-brutal text-center text-lg font-bold uppercase tracking-wider"
          maxLength={20}
        />
        {mode === "join" && (
          <input
            type="text"
            placeholder="Game code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            className="input-brutal text-center text-2xl font-black tracking-[0.3em] uppercase"
            maxLength={6}
          />
        )}
        <div className="flex gap-3 mt-2">
          <button onClick={() => setMode("choose")} className="btn-action px-6 py-3 text-sm flex-1">
            Back
          </button>
          <button
            onClick={mode === "create" ? handleCreate : handleJoin}
            disabled={!playerName.trim() || (mode === "join" && !joinCode.trim()) || !connected}
            className="btn-action px-6 py-3 text-sm flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {mode === "create" ? "Create" : "Join"}
          </button>
        </div>
      </div>
    </div>
  );
}
