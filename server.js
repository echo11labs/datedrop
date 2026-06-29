const { createServer } = require("http");
const next = require("next");

const gamesEnabled = process.env.ENABLE_GAMES === "true";
const SocketIOServer = gamesEnabled ? require("socket.io").Server : null;

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

// ── Helpers ─────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateCode(chars, len) {
  let code = "";
  for (let i = 0; i < len; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// ── Codenames Word List ─────────────────────────────────────────────────
const WORD_LIST = [
  "AFRICA","AGENT","AIR","ALIEN","ALPS","AMAZON","AMBULANCE","AMERICA","ANGEL",
  "ANTARCTICA","APPLE","ARM","ATLANTIS","AUSTRALIA","AZTEC","BACK","BALL","BAND",
  "BANK","BAR","BARK","BAT","BATTERY","BEACH","BEAR","BEAT","BEER","BELL","BELT",
  "BERLIN","BISHOP","BLOCK","BOMB","BOND","BONE","BOOK","BOOM","BOOT","BOTTLE",
  "BOTTOM","BOX","BRIDGE","BRUSH","BUDAPEST","BUG","BUTTON","CAMERA","CAMP",
  "CANDLE","CANNON","CAR","CARD","CARPET","CASH","CASTLE","CAT","CAVE","CELLAR",
  "CENTER","CHAIR","CHANT","CHARM","CHASE","CHECK","CHICKEN","CHINA","CHOCOLATE",
  "CHURCH","CIRCLE","CLEOPATRA","CLIFF","CLOAK","CLOCK","CLOWN","COACH","COAST",
  "COMET","COMPUTER","CONCERT","COOKIE","COPY","CORE","CORN","CREAM","CRIME",
  "CROSS","CROW","CROWN","CRUSH","CYCLONE","DANCE","DEATH","DECORATION","DELTA",
  "DEMON","DESERT","DIAMOND","DIET","DINOSAUR","DIRECTOR","DISEASE","DJINN","DOG",
  "DOLPHIN","DOT","DRAFT","DRAGON","DRESS","DRILL","DRINK","DRIVE","DROPS",
  "DUNGEON","EAGLE","EARTH","EDINBURGH","EGYPT","EMBASSY","ENERGY","ENGINE",
  "EUROPE","FACULTY","FAN","FAUCET","FEED","FENNEL","FIGHTER","FIRE","FISH",
  "FLAME","FLASH","FLEA","FLOOR","FLUTE","FOG","FOOT","FORCE","FOREST","FORGE",
  "FRANCE","FROG","FROST","FUNGI","GALAXY","GAME","GARAGE","GARDEN","GAS",
  "GENEVA","GHOST","GIANT","GLACIER","GLOBE","GLOVE","GOAL","GOLD","GRACE",
  "GRASS","GREECE","GREEN","GROUND","GUITAR","HACKER","HAMMER","HAND","HAVANA",
  "HEART","HELICOPTER","HOCKEY","HOLIDAY","HONEY","HOOD","HOOK","HORNET","HORSE",
  "HOTEL","HOUSE","HYDRA","ICE","INDIA","IRON","ISTANBUL","JACK","JAIL","JAZZ",
  "JERUSALEM","JOCKEY","JUPITER","KANGAROO","KETCHUP","KID","KIWI","KNIGHT",
  "LAKE","LASER","LEADER","LEMON","LEVEL","LIGHT","LILY","LIMOUSINE","LINEN",
  "LION","LIPS","LIST","LIVER","LIZARD","LOG","LOVER","LUGGAGE","MACHINE","MADRID",
  "MAGIC","MAGNET","MANCHESTER","MAPLE","MARBLE","MARCH","MASCOT","MATCH","MAX",
  "MERCURY","MEXICO","MICROSCOPE","MILK","MINE","MINISTER","MINT","MISSILE",
  "MODEL","MONEY","MONKEY","MOSCOW","MUSEUM","NAIL","NAPOLEON","NEEDLE","NET",
  "NEWS","NINJA","NOBEL","NOODLE","NORTH","NOSE","NYC","OCTOPUS","OLIVE","OPERA",
  "ORANGE","ORGAN","OSLO","OX","OXYGEN","PALM","PANDA","PANAMA","PAPER","PARK",
  "PARTY","PASTA","PATCH","PEARL","PEN","PENGUIN","PHOENIX","PIANO","PIE","PILOT",
  "PIN","PIPE","PIRATE","PLANET","PLATE","PLATYPUS","PLAYER","PLUNGER","POCKET",
  "POEM","POISON","POLICE","POLO","POND","POPCORN","PORT","POST","POUND","PRESS",
  "PRINCESS","PRUNE","PUDDING","PYRAMID","QUEEN","QUICKSAND","RABBIT","RACKET",
  "RAIN","RANGE","RAVEN","RED","RIFLE","RING","RIPPLE","ROBOT","ROME","ROOT",
  "ROSE","ROULETTE","ROUND","ROW","RULER","SALAD","SALMON","SAND","SANDWICH",
  "SAW","SCALE","SCARF","SCENE","SCISSORS","SCORPION","SCREEN","SCREW","SEAL",
  "SECTOR","SEED","SERVER","SHADOW","SHARK","SHIRT","SHOCK","SHOE","SHOP","SHOT",
  "SINK","SITE","SIX","SKULL","SLATE","SLEEP","SLICE","SLUMBER","SMOKE","SNAIL",
  "SNAKE","SOLDIER","SOUL","SOUND","SPAIN","SPHERE","SPIDER","SPIRIT","SPONGE",
  "SPRING","SPY","STAFF","STAR","STATE","STATUE","STEEL","STICK","STOCK","STONE",
  "STOP","STRAWBERRY","STRIKE","STUDIO","SUN","SWAN","SWITCH","SYDNEY","TABLE",
  "TALK","TANK","TAPE","TARGET","TENT","TEXTILE","THEATER","THIEF","THING","TOKYO",
  "TOOTH","TOWER","TRAP","TREE","TRIANGLE","TRIP","TROPHY","TRUMPET","TUBE","TUNA",
  "TURKEY","TV","UNICORN","VACUUM","VAN","VENICE","VERSE","VEST","VETERAN",
  "VICTIM","VIOLIN","VIRUS","VOLCANO","WALRUS","WARSAW","WATER","WAVE","WEB",
  "WEDDING","WHALE","WHISKEY","WITCH","WIZARD","WOOD","WORM","YARD","YELLOW","ZEBRA","ZEN",
];

// ── Codenames Game Logic ────────────────────────────────────────────────
function getRandomWords(count) {
  return shuffle(WORD_LIST).slice(0, count);
}

function generateKeyCards() {
  const positions = Array.from({ length: 25 }, (_, i) => i);
  const sharedAgents = shuffle(positions).slice(0, 3);
  const remainingAfterShared = positions.filter((p) => !sharedAgents.includes(p));
  const sharedAssassin = remainingAfterShared[Math.floor(Math.random() * remainingAfterShared.length)];

  const side1Grid = new Array(25).fill("bystander");
  const side2Grid = new Array(25).fill("bystander");

  for (const pos of sharedAgents) {
    side1Grid[pos] = "agent";
    side2Grid[pos] = "agent";
  }
  side1Grid[sharedAssassin] = "assassin";
  side2Grid[sharedAssassin] = "assassin";

  const remaining1 = positions.filter(
    (p) => p !== sharedAssassin && !sharedAgents.includes(p) && side1Grid[p] === "bystander"
  );
  const shuffled1 = shuffle(remaining1);
  for (let i = 0; i < 6; i++) side1Grid[shuffled1[i]] = "agent";
  for (let i = 6; i < 8; i++) side1Grid[shuffled1[i]] = "assassin";

  const remaining2 = positions.filter(
    (p) => p !== sharedAssassin && !sharedAgents.includes(p) && side2Grid[p] === "bystander"
  );
  const shuffled2 = shuffle(remaining2);
  for (let i = 0; i < 6; i++) side2Grid[shuffled2[i]] = "agent";
  for (let i = 6; i < 8; i++) side2Grid[shuffled2[i]] = "assassin";

  const toGrid = (flat) => {
    const grid = [];
    for (let r = 0; r < 5; r++) grid.push(flat.slice(r * 5, r * 5 + 5));
    return grid;
  };

  return [{ grid: toGrid(side1Grid) }, { grid: toGrid(side2Grid) }];
}

function generateBoard(words) {
  const board = [];
  let idx = 0;
  for (let r = 0; r < 5; r++) {
    const row = [];
    for (let c = 0; c < 5; c++) {
      row.push({ word: words[idx], status: "hidden" });
      idx++;
    }
    board.push(row);
  }
  return board;
}

function createCodenamesGame(gameCode, socketId, playerName) {
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

function joinCodenamesGame(game, socketId, playerName) {
  game.players.push({ socketId, name: playerName, index: 1 });
}

function giveClue(game, playerIndex, clue, number) {
  game.lastClue = { clue: clue.toUpperCase(), number, givenBy: playerIndex };
  game.revealedThisTurn = [];
}

function makeGuess(game, playerIndex, word) {
  let targetRow = -1, targetCol = -1;
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (game.board[r][c].word === word && game.board[r][c].status === "hidden") {
        targetRow = r; targetCol = c; break;
      }
    }
    if (targetRow !== -1) break;
  }
  if (targetRow === -1) return { error: "Word not found or already revealed" };

  const cardType = game.keyCards[playerIndex].grid[targetRow][targetCol];
  game.board[targetRow][targetCol].status = "revealed";
  game.board[targetRow][targetCol].revealedBy = playerIndex;
  game.revealedThisTurn.push(word);

  if (cardType === "agent") {
    game.agentsFound++;
    if (game.agentsFound >= 15) return { type: "agent", gameOver: true, won: true, reason: "All agents found!" };
    return { type: "agent", gameOver: false };
  }
  if (cardType === "assassin") {
    return { type: "assassin", gameOver: true, won: false, reason: "Hit an assassin!" };
  }
  game.tokensLeft--;
  game.currentTurn = game.currentTurn === 0 ? 1 : 0;
  game.revealedThisTurn = [];
  if (game.tokensLeft <= 0) return { type: "bystander", gameOver: true, won: false, reason: "Ran out of time tokens" };
  return { type: "bystander", gameOver: false };
}

// ── Codenames In-Memory Store ───────────────────────────────────────────
const codenamesGames = new Map();

function generateCodenamesCode() {
  return generateCode("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);
}

// ── Draw & Guess Word List ──────────────────────────────────────────────
const DRAW_WORDS = [
  "cat","dog","fish","bird","horse","snake","frog","turtle","rabbit","lion",
  "elephant","monkey","penguin","whale","shark","butterfly","bee","owl","crab",
  "pizza","cake","ice cream","apple","banana","coffee","taco","sushi","donut","cookie",
  "watermelon","popcorn","hamburger","hot dog","pie","egg","cheese","bread",
  "house","car","tree","flower","sun","moon","star","rainbow","umbrella","key",
  "chair","table","lamp","clock","book","phone","shoe","hat","glasses","backpack",
  "camera","guitar","pencil","scissors","hammer","ball","kite","balloon","gift",
  "mountain","ocean","volcano","island","cloud","lightning","fire","ice","snow","wind",
  "river","bridge","forest","desert","cave","waterfall","beach","wave","rain",
  "dance","sleep","run","swim","jump","cook","read","sing","fly","cry",
  "laugh","hide","paint","build","dig","kick","throw","catch",
  "face","eye","hand","foot","nose","mouth","hair","ear",
  "baby","king","queen","pirate","astronaut","robot","superhero","wizard","clown","ninja",
  "airplane","boat","train","bicycle","bus","truck","helicopter","rocket","motorcycle","sailboat",
  "ghost","alien","dinosaur","dragon","unicorn","mermaid","zombie",
  "treasure","diamond","crown","sword","flag","tent","campfire","skateboard",
];

function getRandomDrawWord() {
  return DRAW_WORDS[Math.floor(Math.random() * DRAW_WORDS.length)];
}

// ── Draw & Guess Game Logic ─────────────────────────────────────────────
// Note: startDrawRound and endDrawTurn need `io` which is created in app.prepare().
// They are defined here but io is assigned via setIo() below.
let ioRef = null;

function setIo(ioInstance) {
  ioRef = ioInstance;
}

function getHint(word, level) {
  if (level === 1) {
    return word[0] + "_ ".repeat(word.length - 1);
  }
  if (word.length <= 2) return word;
  return word[0] + "_ ".repeat(word.length - 2) + word[word.length - 1];
}

function startDrawRound(game) {
  game.currentWord = getRandomDrawWord();
  game.phase = "drawing";
  game.guessedPlayers = [];
  game.hintsRevealed = 0;
  game.timer = 60;

  if (game.timerInterval) clearInterval(game.timerInterval);

  game.timerInterval = setInterval(() => {
    game.timer--;
    ioRef.to(game.code).emit("dg-timer", { timer: game.timer });

    if (game.timer === 30 && game.hintsRevealed === 0) {
      game.hintsRevealed = 1;
      ioRef.to(game.code).emit("dg-hint", { hint: getHint(game.currentWord, 1) });
    }
    if (game.timer === 15 && game.hintsRevealed === 1) {
      game.hintsRevealed = 2;
      ioRef.to(game.code).emit("dg-hint", { hint: getHint(game.currentWord, 2) });
    }

    if (game.timer <= 0) {
      clearInterval(game.timerInterval);
      game.timerInterval = null;
      endDrawTurn(game, false);
    }
  }, 1000);

  game.players.forEach((p) => {
    ioRef.to(p.socketId).emit("dg-round-start", {
      drawerIndex: game.currentDrawer,
      drawerName: game.players[game.currentDrawer].name,
      word: p.index === game.currentDrawer ? game.currentWord : null,
      round: game.round,
      totalRounds: game.totalRounds,
      scores: game.scores,
      timer: game.timer,
    });
  });
}

function endDrawTurn(game, guessedCorrectly) {
  clearInterval(game.timerInterval);
  game.timerInterval = null;

  game.currentDrawer = game.currentDrawer === 0 ? 1 : 0;

  if (game.currentDrawer === 0) {
    game.round++;
  }

  if (game.round > game.totalRounds) {
    game.phase = "finished";
    ioRef.to(game.code).emit("dg-game-over", {
      scores: game.scores,
      players: game.players.map((p) => ({ name: p.name, score: game.scores[p.index] })),
      rounds: game.totalRounds,
    });
  } else {
    game.phase = "waiting";
    ioRef.to(game.code).emit("dg-turn-end", {
      word: game.currentWord,
      round: game.round,
      totalRounds: game.totalRounds,
      scores: game.scores,
      nextDrawer: game.currentDrawer,
    });

    setTimeout(() => {
      if (game.phase === "waiting") startDrawRound(game);
    }, 3000);
  }
}

// ── Draw & Guess In-Memory Store ────────────────────────────────────────
const drawGames = new Map();

function generateDrawGameCode() {
  return "D" + generateCode("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 5);
}

function createDrawGame(code, socketId, playerName) {
  return {
    code,
    phase: "lobby",
    players: [{ socketId, name: playerName, index: 0 }],
    currentDrawer: 0,
    currentWord: null,
    round: 1,
    totalRounds: 3,
    scores: [0, 0],
    timer: 60,
    timerInterval: null,
    guessedPlayers: [],
    hintsRevealed: 0,
  };
}

// ── How Well Do You Know Me Game Store ──────────────────────────────────
const knowMeGames = new Map();

function generateKnowMeCode() {
  return "K" + generateCode("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 5);
}

function createKnowMeGame(code, socketId, playerName) {
  return {
    code,
    phase: "lobby",
    players: [{ socketId, name: playerName, index: 0 }],
    answers: { 0: null, 1: null },
    round: 1,
  };
}

const KNOW_ME_QUESTIONS = [
  { id: 1, text: "What's my favorite comfort food?" },
  { id: 2, text: "What song have I had on repeat lately?" },
  { id: 3, text: "What's my dream vacation destination?" },
  { id: 4, text: "What always makes me laugh?" },
  { id: 5, text: "What's my biggest pet peeve?" },
  { id: 6, text: "What's my favorite way to spend a Sunday?" },
  { id: 7, text: "What's my go-to coffee or drink order?" },
  { id: 8, text: "What movie can I watch over and over?" },
  { id: 9, text: "What's my love language?" },
  { id: 10, text: "What's the first thing I notice about someone?" },
];

function compareAnswers(myAnswers, partnerAnswers) {
  return KNOW_ME_QUESTIONS.map((q) => {
    const mine = (myAnswers.find((a) => a.questionId === q.id)?.text || "").toLowerCase().trim();
    const theirs = (partnerAnswers.find((a) => a.questionId === q.id)?.text || "").toLowerCase().trim();
    return {
      questionId: q.id,
      myAnswer: myAnswers.find((a) => a.questionId === q.id)?.text || "",
      partnerAnswer: partnerAnswers.find((a) => a.questionId === q.id)?.text || "",
      isMatch: mine !== "" && theirs !== "" && mine === theirs,
    };
  });
}

// ── Hangman Game Store ──────────────────────────────────────────────────
const hangmanGames = new Map();

const HANGMAN_WORDS = {
  food: ["pizza","sushi","tacos","pasta","curry","ramen","waffles","pancakes","chocolate","avocado","espresso","latte","brownie","cookie","burrito","dumplings","nachos","pretzel","cheesecake","macarons","fondue","gnocchi","risotto","croissant","bruschetta","tiramisu","smoothie","baguette","lasagna"],
  travel: ["paris","tokyo","bali","santorini","london","maldives","amsterdam","venice","barcelona","safari","cruise","backpacking","waterfall","lighthouse","mountain","island","cabin","beach","camping","roadtrip","explore","adventure","horizon","passport","suitcase","postcard","souvenir","temple","palace"],
  romance: ["kiss","hug","cuddle","heart","flowers","chocolate","date","soulmate","butterflies","forever","together","sparkle","moonlight","slowdance","picnic","handholding","loveletter","anniversary","sweetheart","darling","romantic","intimate","passion","embrace","tender","devotion","cherish","affection","heartbeat"],
  movies: ["titanic","inception","avatar","jaws","grease","coco","frozen","aladdin","batman","joker","matrix","gladiator","rocky","ghostbusters","deadpool","interstellar","psycho","cinderella","mulan","shrek","moana","dumbo","bambi","pinocchio","buzz","woody"],
  activities: ["dancing","cooking","hiking","swimming","painting","singing","gaming","reading","yoga","cycling","surfing","skating","bowling","karaoke","camping","fishing","jogging","pottery","gardening","baking","photography","meditation","snorkeling","skydiving","skiing","snowboarding"],
  nature: ["butterfly","dolphin","penguin","panda","unicorn","flamingo","sunflower","rainbow","aurora","volcano","canyon","meadow","orchid","bamboo","coral","starfish","seahorse","hummingbird","kitten","puppy","bunny","fox","owl","whale","tiger","eagle","wolf","bear","peacock"],
};

const HANGMAN_CATEGORIES = [
  { id: "food", name: "Food & Drinks", emoji: "🍕", hint: "Something you can eat or drink" },
  { id: "travel", name: "Travel & Places", emoji: "✈️", hint: "A place you might visit" },
  { id: "romance", name: "Love & Romance", emoji: "💕", hint: "Something related to love" },
  { id: "movies", name: "Movies & Shows", emoji: "🎬", hint: "A movie or character" },
  { id: "activities", name: "Activities", emoji: "🎯", hint: "Something you can do" },
  { id: "nature", name: "Nature & Animals", emoji: "🌿", hint: "Found in nature" },
];

function generateHangmanCode() {
  return "H" + generateCode("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 5);
}

function pickRandomWord(categoryId) {
  const words = HANGMAN_WORDS[categoryId] || HANGMAN_WORDS.food;
  return words[Math.floor(Math.random() * words.length)].toLowerCase();
}

function createHangmanGame(code, socketId, playerName) {
  return {
    code,
    phase: "lobby",
    players: [{ socketId, name: playerName, index: 0 }],
    scores: [0, 0],
    roundResults: [],
    round: 1,
    totalRounds: 6,
    currentHintGiver: 0,
    currentWord: "",
    currentCategory: "",
    categoryHint: "",
    guessedLetters: [],
    wrongGuesses: 0,
    maxWrong: 7,
    hintsUsed: 0,
    letterRevealsUsed: 0,
  };
}

function resetRoundState(game) {
  game.guessedLetters = [];
  game.wrongGuesses = 0;
  game.hintsUsed = 0;
  game.letterRevealsUsed = 0;
  game.currentWord = "";
  game.currentCategory = "";
  game.categoryHint = "";
}

function getWordDisplay(word, guessedLetters) {
  return word
    .split("")
    .map((ch) => (guessedLetters.includes(ch) ? ch : "_"))
    .join("");
}

function checkHangmanRound(game) {
  const wordLetters = new Set(game.currentWord.split(""));
  const allGuessed = [...wordLetters].every((l) => game.guessedLetters.includes(l));
  if (allGuessed) return { outcome: "won" };
  if (game.wrongGuesses >= game.maxWrong) return { outcome: "lost" };
  return { outcome: "ongoing" };
}

function endHangmanRound(game, outcome) {
  const guessedCorrectly = outcome === "won";
  const livesLeft = game.maxWrong - game.wrongGuesses;
  const scoreGain = guessedCorrectly ? Math.max(10, livesLeft * 10) : 0;
  const guesserIndex = game.currentHintGiver === 0 ? 1 : 0;
  if (guessedCorrectly) game.scores[guesserIndex] += scoreGain;

  const cat = HANGMAN_CATEGORIES.find((c) => c.id === game.currentCategory);
  game.roundResults.push({
    word: game.currentWord.toUpperCase(),
    category: cat ? cat.name : game.currentCategory,
    won: guessedCorrectly,
    wrongGuesses: game.wrongGuesses,
    maxWrong: game.maxWrong,
    guessedBy: game.players[guesserIndex].name,
    hintGiver: game.players[game.currentHintGiver].name,
    scoreGain,
  });

  return { guessedCorrectly, scoreGain };
}

// ── Server ──────────────────────────────────────────────────────────────
app.prepare().then(() => {
  const httpServer = createServer(handler);

  if (gamesEnabled && SocketIOServer) {
    const io = new SocketIOServer(httpServer, {
      cors: { origin: "*", methods: ["GET", "POST"] },
    });

    setIo(io);

    io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // ── Codenames Events ──────────────────────────────────────────────
    socket.on("create-game", ({ playerName }, callback) => {
      let gameCode;
      do { gameCode = generateCodenamesCode(); } while (codenamesGames.has(gameCode));
      const game = createCodenamesGame(gameCode, socket.id, playerName);
      codenamesGames.set(gameCode, game);
      socket.join(gameCode);
      socket.data = { gameCode, playerName, playerIndex: 0 };
      if (callback) callback({ gameCode });
      console.log(`Codenames game ${gameCode} created by ${playerName}`);
    });

    socket.on("join-game", ({ gameCode, playerName }, callback) => {
      const code = gameCode.toUpperCase();
      const game = codenamesGames.get(code);
      if (!game) { if (callback) callback({ error: "Game not found" }); return; }
      if (game.players.length >= 2) { if (callback) callback({ error: "Game is full" }); return; }
      joinCodenamesGame(game, socket.id, playerName);
      socket.join(code);
      socket.data = { gameCode: code, playerName, playerIndex: 1 };
      io.to(code).emit("player-joined", { players: game.players.map((p) => ({ name: p.name, index: p.index })) });
      game.phase = "playing";
      game.currentTurn = 0;
      game.players.forEach((p) => {
        io.to(p.socketId).emit("game-started", {
          gameCode: code,
          board: game.board,
          keyCard: game.keyCards[p.index],
          players: game.players.map((pl) => ({ name: pl.name, index: pl.index })),
          currentTurn: game.currentTurn,
          tokensLeft: game.tokensLeft,
          yourIndex: p.index,
        });
      });
      if (callback) callback({ gameCode: code });
      console.log(`Codenames game ${code}: ${playerName} joined`);
    });

    socket.on("give-clue", ({ clue, number }) => {
      const { gameCode, playerIndex } = socket.data || {};
      if (!gameCode) return;
      const game = codenamesGames.get(gameCode);
      if (!game || game.phase !== "playing" || game.currentTurn !== playerIndex) return;
      giveClue(game, playerIndex, clue, number);
      io.to(gameCode).emit("clue-given", { clue, number, givenBy: playerIndex, givenByName: game.players[playerIndex].name });
    });

    socket.on("make-guess", ({ word }) => {
      const { gameCode, playerIndex } = socket.data || {};
      if (!gameCode) return;
      const game = codenamesGames.get(gameCode);
      if (!game || game.phase !== "playing") return;
      const result = makeGuess(game, playerIndex, word);
      if (result.error) { socket.emit("guess-error", { error: result.error }); return; }
      io.to(gameCode).emit("guess-result", {
        word, type: result.type, board: game.board,
        tokensLeft: game.tokensLeft, currentTurn: game.currentTurn,
        agentsFound: game.agentsFound, totalAgents: 15,
      });
      if (result.gameOver) {
        io.to(gameCode).emit("game-over", {
          won: result.won, reason: result.reason, board: game.board,
          agentsFound: game.agentsFound, tokensLeft: game.tokensLeft,
        });
        game.phase = "finished";
      }
    });

    socket.on("end-turn", () => {
      const { gameCode, playerIndex } = socket.data || {};
      if (!gameCode) return;
      const game = codenamesGames.get(gameCode);
      if (!game || game.phase !== "playing" || game.currentTurn !== playerIndex) return;
      game.currentTurn = game.currentTurn === 0 ? 1 : 0;
      game.tokensLeft--;
      io.to(gameCode).emit("turn-changed", { currentTurn: game.currentTurn, tokensLeft: game.tokensLeft });
      if (game.tokensLeft <= 0 && game.agentsFound < 15) {
        game.phase = "finished";
        io.to(gameCode).emit("game-over", {
          won: false, reason: "Ran out of time tokens", board: game.board,
          agentsFound: game.agentsFound, tokensLeft: 0,
        });
      }
    });

    socket.on("restart-game", (_, callback) => {
      const { gameCode } = socket.data || {};
      if (!gameCode) return;
      const oldGame = codenamesGames.get(gameCode);
      if (!oldGame || oldGame.phase !== "finished") return;
      const newGame = createCodenamesGame(gameCode, oldGame.players[0].socketId, oldGame.players[0].name);
      joinCodenamesGame(newGame, oldGame.players[1].socketId, oldGame.players[1].name);
      newGame.phase = "playing";
      newGame.currentTurn = 0;
      codenamesGames.set(gameCode, newGame);
      newGame.players.forEach((p) => {
        io.to(p.socketId).emit("game-started", {
          gameCode,
          board: newGame.board,
          keyCard: newGame.keyCards[p.index],
          players: newGame.players.map((pl) => ({ name: pl.name, index: pl.index })),
          currentTurn: newGame.currentTurn,
          tokensLeft: newGame.tokensLeft,
          yourIndex: p.index,
        });
      });
      if (callback) callback({ ok: true });
    });

    // ── Draw & Guess Events ───────────────────────────────────────────
    socket.on("dg-create-game", ({ playerName }, callback) => {
      let code;
      do { code = generateDrawGameCode(); } while (drawGames.has(code));
      const game = createDrawGame(code, socket.id, playerName);
      drawGames.set(code, game);
      socket.join(code);
      socket.data = { drawGameCode: code, playerName, playerIndex: 0 };
      if (callback) callback({ gameCode: code });
      console.log(`Draw game ${code} created by ${playerName}. Total games: ${drawGames.size}`);
    });

    socket.on("dg-join-game", ({ gameCode, playerName }, callback) => {
      const code = gameCode.toUpperCase().trim();
      console.log(`Draw join attempt: code=${code}, games=[${[...drawGames.keys()].join(",")}]`);
      const game = drawGames.get(code);
      if (!game) {
        console.log(`Draw game ${code} NOT FOUND`);
        if (callback) callback({ error: "Game not found" });
        return;
      }
      if (game.players.length >= 2) {
        if (callback) callback({ error: "Game is full" });
        return;
      }
      game.players.push({ socketId: socket.id, name: playerName, index: 1 });
      socket.join(code);
      socket.data = { drawGameCode: code, playerName, playerIndex: 1 };

      io.to(code).emit("dg-player-joined", {
        players: game.players.map((p) => ({ name: p.name, index: p.index })),
      });

      game.phase = "playing";
      startDrawRound(game);
      if (callback) callback({ gameCode: code });
      console.log(`Draw game ${code}: ${playerName} joined`);
    });

    socket.on("dg-draw", (data) => {
      const { drawGameCode } = socket.data || {};
      if (!drawGameCode) return;
      socket.to(drawGameCode).emit("dg-draw-data", data);
    });

    socket.on("dg-guess", ({ word }) => {
      const { drawGameCode, playerIndex } = socket.data || {};
      if (!drawGameCode) return;
      const game = drawGames.get(drawGameCode);
      if (!game || game.phase !== "drawing") return;
      if (playerIndex === game.currentDrawer) return;

      const guess = word.toLowerCase().trim();
      const target = game.currentWord.toLowerCase();

      if (guess === target) {
        const timeBonus = Math.floor(game.timer * 2);
        game.scores[playerIndex] += 100 + timeBonus;
        game.scores[game.currentDrawer] += 50;

        io.to(drawGameCode).emit("dg-correct-guess", {
          guessedBy: playerIndex,
          guessedByName: game.players[playerIndex].name,
          word: game.currentWord,
          scores: game.scores,
          timeBonus,
        });

        endDrawTurn(game, true);
      } else {
        io.to(drawGameCode).emit("dg-wrong-guess", {
          guessedBy: playerIndex,
          word,
        });
      }
    });

    socket.on("dg-clear-canvas", () => {
      const { drawGameCode } = socket.data || {};
      if (!drawGameCode) return;
      socket.to(drawGameCode).emit("dg-clear-canvas");
    });

    socket.on("dg-restart", (_, callback) => {
      const { drawGameCode } = socket.data || {};
      if (!drawGameCode) return;
      const oldGame = drawGames.get(drawGameCode);
      if (!oldGame || oldGame.phase !== "finished") return;

      const newGame = createDrawGame(drawGameCode, oldGame.players[0].socketId, oldGame.players[0].name);
      newGame.players.push({ socketId: oldGame.players[1].socketId, name: oldGame.players[1].name, index: 1 });
      newGame.phase = "playing";
      drawGames.set(drawGameCode, newGame);

      newGame.players.forEach((p) => {
        io.to(p.socketId).emit("dg-game-restarted", {
          gameCode: drawGameCode,
          players: newGame.players.map((pl) => ({ name: pl.name, index: pl.index })),
        });
      });

      startDrawRound(newGame);
      if (callback) callback({ ok: true });
    });

    // ── How Well Do You Know Me Events ──────────────────────────────
    socket.on("hk-create-game", ({ playerName }, callback) => {
      let code;
      do { code = generateKnowMeCode(); } while (knowMeGames.has(code));
      const game = createKnowMeGame(code, socket.id, playerName);
      knowMeGames.set(code, game);
      socket.join(code);
      socket.data = { knowMeCode: code, playerName, playerIndex: 0 };
      if (callback) callback({ gameCode: code });
      console.log(`Know Me game ${code} created by ${playerName}`);
    });

    socket.on("hk-join-game", ({ gameCode, playerName }, callback) => {
      const code = gameCode.toUpperCase().trim();
      const game = knowMeGames.get(code);
      if (!game) {
        if (callback) callback({ error: "Game not found" });
        return;
      }
      if (game.players.length >= 2) {
        if (callback) callback({ error: "Game is full" });
        return;
      }
      game.players.push({ socketId: socket.id, name: playerName, index: 1 });
      socket.join(code);
      socket.data = { knowMeCode: code, playerName, playerIndex: 1 };

      io.to(code).emit("hk-player-joined", {
        players: game.players.map((p) => ({ name: p.name, index: p.index })),
      });

      // Start the game
      game.phase = "answering";
      game.players.forEach((p) => {
        io.to(p.socketId).emit("hk-game-start", {
          players: game.players.map((pl) => ({ name: pl.name, index: pl.index })),
          yourIndex: p.index,
        });
      });
      if (callback) callback({ gameCode: code });
      console.log(`Know Me game ${code}: ${playerName} joined`);
    });

    socket.on("hk-submit-answers", ({ gameCode, answers }) => {
      const { knowMeCode, playerIndex } = socket.data || {};
      const code = knowMeCode || gameCode;
      if (!code) return;
      const game = knowMeGames.get(code);
      if (!game) return;

      game.answers[playerIndex] = answers;
      console.log(`Know Me ${code}: Player ${playerIndex} submitted answers`);

      // Check if both players have submitted
      if (game.answers[0] && game.answers[1]) {
        // Build results from each player's perspective
        const results0 = compareAnswers(game.answers[0], game.answers[1]);
        const results1 = compareAnswers(game.answers[1], game.answers[0]);

        // Send reveal to each player with their perspective
        io.to(game.players[0].socketId).emit("hk-reveal-start", { results: results0 });
        io.to(game.players[1].socketId).emit("hk-reveal-start", { results: results1 });
        game.phase = "revealing";
      } else {
        // Notify the other player that this player is done
        const otherIndex = playerIndex === 0 ? 1 : 0;
        io.to(game.players[otherIndex].socketId).emit("hk-waiting");
      }
    });

    socket.on("hk-all-revealed", ({ gameCode }) => {
      const { knowMeCode, playerIndex } = socket.data || {};
      const code = knowMeCode || gameCode;
      if (!code) return;
      const game = knowMeGames.get(code);
      if (!game) return;

      game.phase = "finished";

      const results0 = compareAnswers(game.answers[0], game.answers[1]);
      const results1 = compareAnswers(game.answers[1], game.answers[0]);

      io.to(game.players[0].socketId).emit("hk-game-over", { results: results0 });
      io.to(game.players[1].socketId).emit("hk-game-over", { results: results1 });
    });

    socket.on("hk-restart", ({ gameCode }) => {
      const { knowMeCode } = socket.data || {};
      const code = knowMeCode || gameCode;
      if (!code) return;
      const oldGame = knowMeGames.get(code);
      if (!oldGame || oldGame.phase !== "finished") return;

      const newGame = createKnowMeGame(code, oldGame.players[0].socketId, oldGame.players[0].name);
      newGame.players.push({ socketId: oldGame.players[1].socketId, name: oldGame.players[1].name, index: 1 });
      newGame.phase = "answering";
      knowMeGames.set(code, newGame);

      newGame.players.forEach((p) => {
        io.to(p.socketId).emit("hk-game-restarted", {
          players: newGame.players.map((pl) => ({ name: pl.name, index: pl.index })),
          yourIndex: p.index,
        });
      });
    });

    // ── Hangman Events ────────────────────────────────────────────────
    socket.on("hm-create-game", ({ playerName }, callback) => {
      let code;
      do { code = generateHangmanCode(); } while (hangmanGames.has(code));
      const game = createHangmanGame(code, socket.id, playerName);
      hangmanGames.set(code, game);
      socket.join(code);
      socket.data = { hangmanCode: code, playerName, playerIndex: 0 };
      if (callback) callback({ gameCode: code });
      console.log(`Hangman game ${code} created by ${playerName}`);
    });

    socket.on("hm-join-game", ({ gameCode, playerName }, callback) => {
      const code = gameCode.toUpperCase().trim();
      const game = hangmanGames.get(code);
      if (!game) { if (callback) callback({ error: "Game not found" }); return; }
      if (game.players.length >= 2) { if (callback) callback({ error: "Game is full" }); return; }
      game.players.push({ socketId: socket.id, name: playerName, index: 1 });
      socket.join(code);
      socket.data = { hangmanCode: code, playerName, playerIndex: 1 };

      io.to(code).emit("hm-player-joined", {
        players: game.players.map((p) => ({ name: p.name, index: p.index })),
      });

      game.phase = "playing";
      game.players.forEach((p) => {
        io.to(p.socketId).emit("hm-game-start", {
          players: game.players.map((pl) => ({ name: pl.name, index: pl.index })),
          yourIndex: p.index,
          totalRounds: game.totalRounds,
          hintGiverIndex: game.currentHintGiver,
        });
      });
      // First hint giver selects category
      io.to(game.players[game.currentHintGiver].socketId).emit("hm-select-category", {
        categories: HANGMAN_CATEGORIES,
      });
      if (callback) callback({ gameCode: code });
      console.log(`Hangman game ${code}: ${playerName} joined`);
    });

    socket.on("hm-category-chosen", ({ category }) => {
      const { hangmanCode } = socket.data || {};
      if (!hangmanCode) return;
      const game = hangmanGames.get(hangmanCode);
      if (!game || game.phase !== "playing") return;

      const cat = HANGMAN_CATEGORIES.find((c) => c.id === category);
      game.currentCategory = category;
      game.categoryHint = cat ? cat.hint : "";
      game.currentWord = pickRandomWord(category);
      resetRoundState(game);

      // Send different views to each player
      const hintGiver = game.players[game.currentHintGiver];
      const guesser = game.players[game.currentHintGiver === 0 ? 1 : 0];

      // Hint Giver sees the word and category
      io.to(hintGiver.socketId).emit("hm-hint-giver-view", {
        word: game.currentWord,
        category: game.currentCategory,
        categoryHint: game.categoryHint,
        wordDisplay: getWordDisplay(game.currentWord, []),
        wrongGuesses: 0,
        maxWrong: game.maxWrong,
        round: game.round,
        totalRounds: game.totalRounds,
        scores: game.players.map((p, i) => ({ name: p.name, score: game.scores[i] })),
        yourName: hintGiver.name,
        partnerName: guesser.name,
      });

      // Guesser sees category hint and word length
      io.to(guesser.socketId).emit("hm-guesser-view", {
        category: game.currentCategory,
        categoryHint: game.categoryHint,
        wordLength: game.currentWord.length,
        wordDisplay: "_".repeat(game.currentWord.length),
        wrongGuesses: 0,
        maxWrong: game.maxWrong,
        guessedLetters: [],
        round: game.round,
        totalRounds: game.totalRounds,
        scores: game.players.map((p, i) => ({ name: p.name, score: game.scores[i] })),
        yourName: guesser.name,
        partnerName: hintGiver.name,
      });

      console.log(`Hangman ${hangmanCode}: category=${category}, word=${game.currentWord}`);
    });

    socket.on("hm-guess-letter", ({ letter }) => {
      const { hangmanCode } = socket.data || {};
      if (!hangmanCode) return;
      const game = hangmanGames.get(hangmanCode);
      if (!game || game.phase !== "playing") return;

      const l = letter.toLowerCase();
      if (game.guessedLetters.includes(l)) return;
      game.guessedLetters.push(l);

      const correct = game.currentWord.includes(l);
      if (!correct) game.wrongGuesses++;

      const display = getWordDisplay(game.currentWord, game.guessedLetters);

      // Broadcast to both players
      const hintGiver = game.players[game.currentHintGiver];
      const guesser = game.players[game.currentHintGiver === 0 ? 1 : 0];

      io.to(hintGiver.socketId).emit("hm-hint-giver-update", {
        wordDisplay: display,
        wrongGuesses: game.wrongGuesses,
        guessedLetters: game.guessedLetters,
        lastGuess: { letter: l, correct },
      });

      io.to(guesser.socketId).emit("hm-guesser-update", {
        wordDisplay: display,
        wrongGuesses: game.wrongGuesses,
        guessedLetters: game.guessedLetters,
        lastGuess: { letter: l, correct },
      });

      // Check round end
      const check = checkHangmanRound(game);
      if (check.outcome !== "ongoing") {
        const { guessedCorrectly, scoreGain } = endHangmanRound(game, check.outcome);

        io.to(hintGiver.socketId).emit("hm-round-end", {
          won: guessedCorrectly,
          word: game.currentWord,
          category: game.currentCategory,
          guessedBy: guesser.name,
          hintGiver: hintGiver.name,
          wrongGuesses: game.wrongGuesses,
          maxWrong: game.maxWrong,
          scoreGain,
          scores: game.players.map((p, i) => ({ name: p.name, score: game.scores[i] })),
          roundResults: game.roundResults,
        });

        io.to(guesser.socketId).emit("hm-round-end", {
          won: guessedCorrectly,
          word: game.currentWord,
          category: game.currentCategory,
          guessedBy: guesser.name,
          hintGiver: hintGiver.name,
          wrongGuesses: game.wrongGuesses,
          maxWrong: game.maxWrong,
          scoreGain,
          scores: game.players.map((p, i) => ({ name: p.name, score: game.scores[i] })),
          roundResults: game.roundResults,
        });

        // Next round or game over
        if (game.round >= game.totalRounds) {
          game.phase = "finished";
          setTimeout(() => {
            io.to(hangmanCode).emit("hm-game-over", {
              scores: game.players.map((p, i) => ({ name: p.name, score: game.scores[i] })),
              roundResults: game.roundResults,
            });
          }, 3000);
        } else {
          game.round++;
          game.currentHintGiver = game.currentHintGiver === 0 ? 1 : 0;
          setTimeout(() => {
            // Notify hint giver of new round
            const newHintGiver = game.players[game.currentHintGiver];
            const newGuesser = game.players[game.currentHintGiver === 0 ? 1 : 0];
            io.to(newHintGiver.socketId).emit("hm-select-category", {
              categories: HANGMAN_CATEGORIES,
              round: game.round,
              totalRounds: game.totalRounds,
            });
            io.to(newGuesser.socketId).emit("hm-waiting-category", {
              partnerName: newHintGiver.name,
              round: game.round,
              totalRounds: game.totalRounds,
            });
          }, 3000);
        }
      }
    });

    socket.on("hm-reveal-letter", () => {
      const { hangmanCode } = socket.data || {};
      if (!hangmanCode) return;
      const game = hangmanGames.get(hangmanCode);
      if (!game || game.phase !== "playing") return;

      // Find an unrevealed letter in the word
      const unrevealed = game.currentWord.split("").find((ch) => !game.guessedLetters.includes(ch));
      if (!unrevealed) return;

      game.guessedLetters.push(unrevealed);
      game.letterRevealsUsed++;

      const display = getWordDisplay(game.currentWord, game.guessedLetters);

      const hintGiver = game.players[game.currentHintGiver];
      const guesser = game.players[game.currentHintGiver === 0 ? 1 : 0];

      io.to(hintGiver.socketId).emit("hm-hint-giver-update", {
        wordDisplay: display,
        wrongGuesses: game.wrongGuesses,
        guessedLetters: game.guessedLetters,
        lastGuess: { letter: unrevealed, correct: true, revealed: true },
        letterRevealsUsed: game.letterRevealsUsed,
      });

      io.to(guesser.socketId).emit("hm-guesser-update", {
        wordDisplay: display,
        wrongGuesses: game.wrongGuesses,
        guessedLetters: game.guessedLetters,
        lastGuess: { letter: unrevealed, correct: true, revealed: true },
      });

      // Check if word is now complete
      const check = checkHangmanRound(game);
      if (check.outcome !== "ongoing") {
        const { guessedCorrectly, scoreGain } = endHangmanRound(game, check.outcome);
        const hintGiverP = game.players[game.currentHintGiver];
        const guesserP = game.players[game.currentHintGiver === 0 ? 1 : 0];

        io.to(hintGiverP.socketId).emit("hm-round-end", {
          won: guessedCorrectly, word: game.currentWord, category: game.currentCategory,
          guessedBy: guesserP.name, hintGiver: hintGiverP.name,
          wrongGuesses: game.wrongGuesses, maxWrong: game.maxWrong, scoreGain,
          scores: game.players.map((p, i) => ({ name: p.name, score: game.scores[i] })),
          roundResults: game.roundResults,
        });
        io.to(guesserP.socketId).emit("hm-round-end", {
          won: guessedCorrectly, word: game.currentWord, category: game.currentCategory,
          guessedBy: guesserP.name, hintGiver: hintGiverP.name,
          wrongGuesses: game.wrongGuesses, maxWrong: game.maxWrong, scoreGain,
          scores: game.players.map((p, i) => ({ name: p.name, score: game.scores[i] })),
          roundResults: game.roundResults,
        });

        if (game.round >= game.totalRounds) {
          game.phase = "finished";
          setTimeout(() => {
            io.to(hangmanCode).emit("hm-game-over", {
              scores: game.players.map((p, i) => ({ name: p.name, score: game.scores[i] })),
              roundResults: game.roundResults,
            });
          }, 3000);
        } else {
          game.round++;
          game.currentHintGiver = game.currentHintGiver === 0 ? 1 : 0;
          setTimeout(() => {
            const newHG = game.players[game.currentHintGiver];
            const newG = game.players[game.currentHintGiver === 0 ? 1 : 0];
            io.to(newHG.socketId).emit("hm-select-category", {
              categories: HANGMAN_CATEGORIES, round: game.round, totalRounds: game.totalRounds,
            });
            io.to(newG.socketId).emit("hm-waiting-category", {
              partnerName: newHG.name, round: game.round, totalRounds: game.totalRounds,
            });
          }, 3000);
        }
      }
    });

    socket.on("hm-restart", (_, callback) => {
      const { hangmanCode } = socket.data || {};
      if (!hangmanCode) return;
      const oldGame = hangmanGames.get(hangmanCode);
      if (!oldGame || oldGame.phase !== "finished") return;

      const newGame = createHangmanGame(hangmanCode, oldGame.players[0].socketId, oldGame.players[0].name);
      newGame.players.push({ socketId: oldGame.players[1].socketId, name: oldGame.players[1].name, index: 1 });
      newGame.phase = "playing";
      hangmanGames.set(hangmanCode, newGame);

      newGame.players.forEach((p) => {
        io.to(p.socketId).emit("hm-game-restarted", {
          players: newGame.players.map((pl) => ({ name: pl.name, index: pl.index })),
          yourIndex: p.index,
          totalRounds: newGame.totalRounds,
          hintGiverIndex: newGame.currentHintGiver,
        });
      });
      io.to(newGame.players[newGame.currentHintGiver].socketId).emit("hm-select-category", {
        categories: HANGMAN_CATEGORIES,
      });
    });

    // ── Disconnect ────────────────────────────────────────────────────
    socket.on("disconnect", () => {
      const { gameCode, playerName, drawGameCode, knowMeCode, hangmanCode } = socket.data || {};
      if (gameCode) {
        io.to(gameCode).emit("player-left", { playerName });
        console.log(`Codenames game ${gameCode}: ${playerName} disconnected`);
      }
      if (drawGameCode) {
        io.to(drawGameCode).emit("dg-player-left", { playerName });
        const game = drawGames.get(drawGameCode);
        if (game && game.timerInterval) {
          clearInterval(game.timerInterval);
          game.timerInterval = null;
        }
        console.log(`Draw game ${drawGameCode}: ${playerName} disconnected`);
      }
      if (knowMeCode) {
        io.to(knowMeCode).emit("hk-player-left", { playerName });
        console.log(`Know Me game ${knowMeCode}: ${playerName} disconnected`);
      }
      if (hangmanCode) {
        io.to(hangmanCode).emit("hm-player-left", { playerName });
        console.log(`Hangman game ${hangmanCode}: ${playerName} disconnected`);
      }
    });
    });
  } else {
    console.log("> Game service disabled. Set ENABLE_GAMES=true to enable Socket.IO games.");
  }

  httpServer
    .once("error", (err) => { console.error(err); process.exit(1); })
    .listen(port, () => { console.log(`> Ready on http://${hostname}:${port}`); });
});
