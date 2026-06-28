export type CardType = "agent" | "assassin" | "bystander";
export type CardStatus = "hidden" | "revealed";

export interface BoardCard {
  word: string;
  status: CardStatus;
  revealedBy?: number; // player index who revealed it
}

export interface KeyCard {
  grid: CardType[][]; // 5x5 grid of card types for this player's view
}

export interface Player {
  socketId: string;
  name: string;
  index: number;
}

export interface CodenamesGame {
  gameCode: string;
  phase: "lobby" | "playing" | "finished";
  board: BoardCard[][];
  keyCards: [KeyCard, KeyCard];
  players: Player[];
  currentTurn: number;
  tokensLeft: number;
  agentsFound: number;
  lastClue?: { clue: string; number: number; givenBy: number };
  revealedThisTurn: string[];
}
