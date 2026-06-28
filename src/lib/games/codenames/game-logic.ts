import { CodenamesGame, BoardCard, KeyCard, CardType } from "./game-state";
import { getRandomWords } from "./word-list";

// Codenames Duet key card layout rules:
// Each player's key has:
//   9 agents (green) - 3 of these are also green on the other side (shared)
//   3 assassins (black) - 1 is black on both sides (shared)
//   3 bystanders (beige)
// Total unique agents: 15 (9 + 9 - 3 shared = 15)
// Total assassins: 5 (3 + 3 - 1 shared = 5)
// Remaining: bystanders

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateKeyCards(): [KeyCard, KeyCard] {
  // Positions 0-24 in the 5x5 grid
  const positions = Array.from({ length: 25 }, (_, i) => i);

  // Shared agents: 3 positions that are green on BOTH sides
  const sharedAgents = shuffle(positions).slice(0, 3);

  // Shared assassin: 1 position that is black on BOTH sides
  const remainingAfterShared = positions.filter((p) => !sharedAgents.includes(p));
  const sharedAssassin = remainingAfterShared[Math.floor(Math.random() * remainingAfterShared.length)];

  // For each side, we need:
  //   9 green total (3 shared + 6 unique)
  //   3 black total (1 shared + 2 unique)
  //   3 beige (bystanders)

  const side1Grid: CardType[] = new Array(25).fill("bystander");
  const side2Grid: CardType[] = new Array(25).fill("bystander");

  // Place shared agents (green on both sides)
  for (const pos of sharedAgents) {
    side1Grid[pos] = "agent";
    side2Grid[pos] = "agent";
  }

  // Place shared assassin (black on both sides)
  side1Grid[sharedAssassin] = "assassin";
  side2Grid[sharedAssassin] = "assassin";

  // Remaining positions for side 1: need 6 more agents, 2 more assassins
  const remaining1 = positions.filter(
    (p) => p !== sharedAssassin && !sharedAgents.includes(p) && side1Grid[p] === "bystander"
  );
  const shuffled1 = shuffle(remaining1);
  for (let i = 0; i < 6; i++) side1Grid[shuffled1[i]] = "agent";
  for (let i = 6; i < 8; i++) side1Grid[shuffled1[i]] = "assassin";

  // Remaining positions for side 2: need 6 more agents, 2 more assassins
  const remaining2 = positions.filter(
    (p) => p !== sharedAssassin && !sharedAgents.includes(p) && side2Grid[p] === "bystander"
  );
  const shuffled2 = shuffle(remaining2);
  for (let i = 0; i < 6; i++) side2Grid[shuffled2[i]] = "agent";
  for (let i = 6; i < 8; i++) side2Grid[shuffled2[i]] = "assassin";

  // Convert to 5x5 grids
  const toGrid = (flat: CardType[]): CardType[][] => {
    const grid: CardType[][] = [];
    for (let r = 0; r < 5; r++) {
      grid.push(flat.slice(r * 5, r * 5 + 5));
    }
    return grid;
  };

  return [{ grid: toGrid(side1Grid) }, { grid: toGrid(side2Grid) }];
}

function generateBoard(words: string[]): BoardCard[][] {
  const board: BoardCard[][] = [];
  let idx = 0;
  for (let r = 0; r < 5; r++) {
    const row: BoardCard[] = [];
    for (let c = 0; c < 5; c++) {
      row.push({ word: words[idx], status: "hidden" });
      idx++;
    }
    board.push(row);
  }
  return board;
}

export function createGame(
  gameCode: string,
  socketId: string,
  playerName: string
): CodenamesGame {
  const words = getRandomWords(25);
  const keyCards = generateKeyCards();
  const board = generateBoard(words);

  return {
    gameCode,
    phase: "lobby",
    board,
    keyCards,
    players: [{ socketId, name: playerName, index: 0 }],
    currentTurn: 0,
    tokensLeft: 9,
    agentsFound: 0,
    revealedThisTurn: [],
  };
}

export function joinGame(game: CodenamesGame, socketId: string, playerName: string) {
  game.players.push({ socketId, name: playerName, index: 1 });
}

export function giveClue(game: CodenamesGame, playerIndex: number, clue: string, number: number) {
  game.lastClue = { clue: clue.toUpperCase(), number, givenBy: playerIndex };
  game.revealedThisTurn = [];
}

export function makeGuess(game: CodenamesGame, playerIndex: number, word: string) {
  // Find the card on the board
  let targetRow = -1;
  let targetCol = -1;
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (game.board[r][c].word === word && game.board[r][c].status === "hidden") {
        targetRow = r;
        targetCol = c;
        break;
      }
    }
    if (targetRow !== -1) break;
  }

  if (targetRow === -1) {
    return { error: "Word not found or already revealed" };
  }

  // Check what type of card it is (from the current guesser's perspective)
  const cardType = game.keyCards[playerIndex].grid[targetRow][targetCol];

  // Reveal the card
  game.board[targetRow][targetCol].status = "revealed";
  game.board[targetRow][targetCol].revealedBy = playerIndex;
  game.revealedThisTurn.push(word);

  if (cardType === "agent") {
    game.agentsFound++;
    // Check win condition
    if (game.agentsFound >= 15) {
      return { type: "agent", gameOver: true, won: true, reason: "All agents found!" };
    }
    // Can keep guessing
    return { type: "agent", gameOver: false };
  }

  if (cardType === "assassin") {
    return { type: "assassin", gameOver: true, won: false, reason: "Hit an assassin!" };
  }

  // Bystander - turn ends, lose a token
  game.tokensLeft--;
  game.currentTurn = game.currentTurn === 0 ? 1 : 0;
  game.revealedThisTurn = [];

  if (game.tokensLeft <= 0) {
    return { type: "bystander", gameOver: true, won: false, reason: "Ran out of time tokens" };
  }

  return { type: "bystander", gameOver: false };
}

export function restartGame(game: CodenamesGame) {
  const words = getRandomWords(25);
  const keyCards = generateKeyCards();
  const board = generateBoard(words);

  game.board = board;
  game.keyCards = keyCards;
  game.phase = "playing";
  game.currentTurn = 0;
  game.tokensLeft = 9;
  game.agentsFound = 0;
  game.lastClue = undefined;
  game.revealedThisTurn = [];
}
