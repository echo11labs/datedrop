// Drawing prompts for Draw & Guess — easy-to-draw words
export const DRAW_WORDS: string[] = [
  // Animals
  "cat","dog","fish","bird","horse","snake","frog","turtle","rabbit","lion",
  "elephant","monkey","penguin","whale","shark","butterfly","bee","owl","frog","crab",
  // Food
  "pizza","cake","ice cream","apple","banana","coffee","taco","sushi","donut","cookie",
  "watermelon","popcorn","hamburger","hot dog","cake","pie","egg","cheese","bread","cookie",
  // Objects
  "house","car","tree","flower","sun","moon","star","rainbow","umbrella","key",
  "chair","table","lamp","clock","book","phone","shoe","hat","glasses","backpack",
  "camera","guitar","pencil","scissors","hammer","nail","ball","kite","balloon","gift",
  // Nature
  "mountain","ocean","volcano","island","cloud","lightning","fire","ice","snow","wind",
  "river","bridge","forest","desert","cave","waterfall","beach","wave","rain","fog",
  // Actions
  "dance","sleep","run","swim","jump","cook","read","sing","fly","cry",
  "laugh","hide","paint","build","dig","kick","throw","catch","push","pull",
  // People & body
  "face","eye","hand","foot","nose","mouth","hair","ear","tooth","tongue",
  "baby","king","queen","pirate","astronaut","robot","superhero","wizard","clown","ninja",
  // Vehicles
  "airplane","boat","train","bicycle","bus","truck","helicopter","rocket","motorcycle","sailboat",
  // Misc fun
  "magic","ghost","alien","dinosaur","dragon","unicorn","mermaid","robot","zombie","pirate",
  "treasure","diamond","crown","sword","shield","flag","tent","campfire","fishing","skateboard",
];

export function getRandomDrawWord(): string {
  return DRAW_WORDS[Math.floor(Math.random() * DRAW_WORDS.length)];
}

export function getMultipleWords(count: number): string[] {
  const shuffled = [...DRAW_WORDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
