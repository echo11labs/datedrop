// "Who Are They?" — Celebrity Face Quiz
// Images sourced from Wikimedia Commons (free CDN, no API key, globally cached)
// Format: https://upload.wikimedia.org/wikipedia/commons/thumb/[hash]/filename.jpg/300px-filename.jpg

export interface Person {
  id: string;
  name: string;
  category: Category;
  emoji: string;
  hint1: string;       // Shown after 1st wrong guess
  hint2: string;       // Shown after 2nd wrong guess
  hint3: string;       // Shown after 3rd wrong guess - easy giveaway
  funFact: string;     // Shown after revealing answer
  imageUrl: string;    // Wikimedia Commons URL
  difficulty: "easy" | "medium" | "hard";
  alternateNames?: string[]; // accepted alternate answers for typed mode
}

export type Category = "actors" | "athletes" | "musicians" | "scientists" | "politicians" | "icons";

export const CATEGORY_META: Record<Category, { label: string; emoji: string }> = {
  actors:     { label: "Actors & Film", emoji: "🎬" },
  athletes:   { label: "Athletes",      emoji: "🏅" },
  musicians:  { label: "Musicians",     emoji: "🎵" },
  scientists: { label: "Scientists",    emoji: "🔬" },
  politicians:{ label: "Leaders",       emoji: "🌍" },
  icons:      { label: "Cultural Icons",emoji: "✨" },
};

export const PEOPLE: Person[] = [
  // ─── ACTORS ───────────────────────────────────
  {
    id: "morgan-freeman",
    name: "Morgan Freeman",
    category: "actors",
    emoji: "🎬",
    hint1: "He has one of the most recognizable voices in Hollywood",
    hint2: "He played God in a 2003 comedy film",
    hint3: "He narrated and starred in The Shawshank Redemption",
    funFact: "Morgan Freeman started acting on television at age 9 in a school play and didn't land his first major film role until his 50s!",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Morgan_Freeman_-_2009.jpg/300px-Morgan_Freeman_-_2009.jpg",
    difficulty: "easy",
  },
  {
    id: "meryl-streep",
    name: "Meryl Streep",
    category: "actors",
    emoji: "🎬",
    hint1: "She has won more Academy Awards than any other actor",
    hint2: "She starred in 'The Devil Wears Prada' and 'Sophie's Choice'",
    hint3: "Often called the 'greatest actress of her generation'",
    funFact: "Meryl Streep has received 21 Academy Award nominations — far more than any other actor in history!",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Meryl_Streep_2_June_2012.jpg/300px-Meryl_Streep_2_June_2012.jpg",
    difficulty: "easy",
  },
  {
    id: "tom-hanks",
    name: "Tom Hanks",
    category: "actors",
    emoji: "🎬",
    hint1: "Life is like a box of chocolates...",
    hint2: "He played a volleyball's best friend in a desert island film",
    hint3: "He played Forrest Gump in the iconic 1994 film",
    funFact: "Tom Hanks won back-to-back Best Actor Oscars in 1994 and 1995 — the only person to do so since Spencer Tracy in 1937-38!",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Tom_Hanks_TIFF_2019.jpg/300px-Tom_Hanks_TIFF_2019.jpg",
    difficulty: "easy",
  },
  {
    id: "scarlett-johansson",
    name: "Scarlett Johansson",
    category: "actors",
    emoji: "🎬",
    hint1: "She has played a Marvel superhero",
    hint2: "She is the highest-grossing actress of all time",
    hint3: "She played Black Widow in the Avengers films",
    funFact: "Scarlett Johansson was the world's highest-paid actress for two consecutive years and is the 9th highest-grossing box office star of all time.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Scarlett_Johansson_by_Gage_Skidmore_2_%28cropped%29.jpg/300px-Scarlett_Johansson_by_Gage_Skidmore_2_%28cropped%29.jpg",
    difficulty: "easy",
  },
  {
    id: "benedict-cumberbatch",
    name: "Benedict Cumberbatch",
    category: "actors",
    emoji: "🎬",
    hint1: "He played a brilliant, socially awkward consulting detective on BBC",
    hint2: "He is a Marvel sorcerer supreme",
    hint3: "His character says 'Elementary, my dear Watson' (well, sort of)",
    funFact: "Benedict Cumberbatch's unusual name became a popular internet meme, with fans inventing creative variations like 'Bandicoot Crumblesnatch'!",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Benedict_Cumberbatch_2016.png/300px-Benedict_Cumberbatch_2016.png",
    difficulty: "medium",
  },
  {
    id: "viola-davis",
    name: "Viola Davis",
    category: "actors",
    emoji: "🎬",
    hint1: "She is the first Black actress to win the Triple Crown of Acting",
    hint2: "She starred in 'How to Get Away with Murder'",
    hint3: "She won an Oscar for 'Fences' alongside Denzel Washington",
    funFact: "Viola Davis is one of only 24 people to achieve the 'Triple Crown of Acting' — winning Emmy, Grammy, Oscar, and Tony awards.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Viola_Davis_at_the_CFDA_Awards%2C_cropped.jpg/300px-Viola_Davis_at_the_CFDA_Awards%2C_cropped.jpg",
    difficulty: "medium",
  },

  // ─── ATHLETES ─────────────────────────────────
  {
    id: "usain-bolt",
    name: "Usain Bolt",
    category: "athletes",
    emoji: "🏅",
    hint1: "He is the fastest human ever recorded",
    hint2: "He's a Jamaican sprinter famous for a lightning pose",
    hint3: "He holds the 100m world record at 9.58 seconds",
    funFact: "Usain Bolt is so fast that scientists calculated he could outrun a T-Rex! He covered 100m in 9.58 seconds at Berlin 2009.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Usain_Bolt_competing_in_Berlin.jpg/300px-Usain_Bolt_competing_in_Berlin.jpg",
    difficulty: "easy",
  },
  {
    id: "serena-williams",
    name: "Serena Williams",
    category: "athletes",
    emoji: "🏅",
    hint1: "She dominated women's tennis for two decades",
    hint2: "She has 23 Grand Slam singles titles",
    hint3: "She and her sister both became tennis legends",
    funFact: "Serena Williams won the Australian Open in 2017 while 8 weeks pregnant, making it her 23rd Grand Slam — the most by any player in the Open Era!",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Serena_Williams_at_the_2013_US_Open.jpg/300px-Serena_Williams_at_the_2013_US_Open.jpg",
    difficulty: "easy",
  },
  {
    id: "michael-jordan",
    name: "Michael Jordan",
    category: "athletes",
    emoji: "🏅",
    hint1: "He is often considered the greatest basketball player of all time",
    hint2: "His shoe brand Nike is worth over $5 billion",
    hint3: "Space Jam starred this Chicago Bulls legend",
    funFact: "Michael Jordan was actually cut from his high school varsity basketball team as a sophomore — a rejection he says motivated him to become great!",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Michael_Jordan_in_2014.jpg/300px-Michael_Jordan_in_2014.jpg",
    difficulty: "easy",
  },
  {
    id: "simone-biles",
    name: "Simone Biles",
    category: "athletes",
    emoji: "🏅",
    hint1: "She has moves named after her in gymnastics code of points",
    hint2: "She is the most decorated American gymnast",
    hint3: "She famously prioritized mental health at Tokyo 2020 Olympics",
    funFact: "Simone Biles has 4 gymnastic skills named after her — more than any other gymnast — because she's the only person who can perform them!",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Simone_Biles_-_2016_Summer_Olympics_in_Rio_de_Janeiro_%281%29.jpg/300px-Simone_Biles_-_2016_Summer_Olympics_in_Rio_de_Janeiro_%281%29.jpg",
    difficulty: "medium",
  },
  {
    id: "lionel-messi",
    name: "Lionel Messi",
    category: "athletes",
    emoji: "🏅",
    hint1: "He is an Argentine football superstar",
    hint2: "He won the World Cup with Argentina in 2022",
    hint3: "He's known as 'La Pulga' and won 8 Ballon d'Or awards",
    funFact: "As a child, Lionel Messi had a growth hormone deficiency. Barcelona FC paid for his treatments — reportedly writing the deal on a napkin!",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg/300px-Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg",
    difficulty: "easy",
  },
  {
    id: "naomi-osaka",
    name: "Naomi Osaka",
    category: "athletes",
    emoji: "🏅",
    hint1: "She is a Japanese-American tennis champion",
    hint2: "She lit the Olympic flame at Tokyo 2020",
    hint3: "She won her first Grand Slam at the 2018 US Open",
    funFact: "Naomi Osaka speaks English and Japanese and is the first Asian player to be ranked No.1 in both the WTA and ATP rankings combined.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Naomi_Osaka_2019_pan_am.jpg/300px-Naomi_Osaka_2019_pan_am.jpg",
    difficulty: "medium",
  },

  // ─── MUSICIANS ───────────────────────────────
  {
    id: "beyonce",
    name: "Beyoncé",
    category: "musicians",
    emoji: "🎵",
    hint1: "She was in a famous girl group before going solo",
    hint2: "She has one of the best-selling albums of all time",
    hint3: "Single Ladies, Crazy in Love, Formation — Queen Bey",
    funFact: "Beyoncé holds the record for the most Grammy wins by any artist in history — 32 wins and counting, including most wins in a single night!",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Beyonc%C3%A9_at_The_Lion_King_European_Premiere_2019.png/300px-Beyonc%C3%A9_at_The_Lion_King_European_Premiere_2019.png",
    difficulty: "easy",
  },
  {
    id: "taylor-swift",
    name: "Taylor Swift",
    category: "musicians",
    emoji: "🎵",
    hint1: "She started as a country singer from Pennsylvania",
    hint2: "Her Eras Tour is the highest-grossing concert tour ever",
    hint3: "She famously 're-recorded' her albums to own her music",
    funFact: "Taylor Swift's Eras Tour generated over $1 billion in revenue — so much that economists credited her with boosting GDP in multiple countries!",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png/300px-191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png",
    difficulty: "easy",
  },
  {
    id: "freddie-mercury",
    name: "Freddie Mercury",
    category: "musicians",
    emoji: "🎵",
    hint1: "He was the flamboyant lead vocalist of a legendary rock band",
    hint2: "His band performed one of the greatest live concerts at Wembley",
    hint3: "He sang Bohemian Rhapsody, We Will Rock You, and We Are the Champions",
    funFact: "Freddie Mercury was born Farrokh Bulsara in Zanzibar and had four extra incisors that he refused to have removed, believing they gave him a wider vocal range!",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Freddie_Mercury_performing_in_New_Haven%2C_CT%2C_November_1977.jpg/300px-Freddie_Mercury_performing_in_New_Haven%2C_CT%2C_November_1977.jpg",
    difficulty: "medium",
  },
  {
    id: "david-bowie",
    name: "David Bowie",
    category: "musicians",
    emoji: "🎵",
    hint1: "He created iconic alter egos like Ziggy Stardust",
    hint2: "He had two different colored eyes",
    hint3: "Space Oddity and Let's Dance are among his famous tracks",
    funFact: "David Bowie's two different-colored eyes (one blue, one dark) were actually caused by a pupil dilation from a fistfight over a girl at age 15!",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/David-Bowie_Chicago_2002-08-08_photo-by-Adam-Bielawski-cropped.jpg/300px-David-Bowie_Chicago_2002-08-08_photo-by-Adam-Bielawski-cropped.jpg",
    difficulty: "medium",
  },
  {
    id: "adele",
    name: "Adele",
    category: "musicians",
    emoji: "🎵",
    hint1: "She is a British singer with a massive powerhouse voice",
    hint2: "Her albums are named after her age when she recorded them",
    hint3: "Hello, Rolling in the Deep, Someone Like You...",
    funFact: "Adele's album '21' spent 24 weeks at #1 on the Billboard 200 — the longest run by a solo female artist since 1984!",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Adele_2016.jpg/300px-Adele_2016.jpg",
    difficulty: "easy",
  },
  {
    id: "prince",
    name: "Prince",
    category: "musicians",
    emoji: "🎵",
    hint1: "He was known for his purple outfits and Minneapolis sound",
    hint2: "He briefly changed his name to an unpronounceable symbol",
    hint3: "Purple Rain is his most iconic album and film",
    funFact: "Prince was so prolific that it's estimated he left behind a vault of over 500 unreleased songs — enough to release an album every year for decades!",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Prince_at_Coachella_001.jpg/300px-Prince_at_Coachella_001.jpg",
    difficulty: "medium",
  },

  // ─── SCIENTISTS ──────────────────────────────
  {
    id: "albert-einstein",
    name: "Albert Einstein",
    category: "scientists",
    emoji: "🔬",
    hint1: "He developed the theory of special relativity",
    hint2: "His most famous equation involves energy, mass, and the speed of light",
    hint3: "E=mc² is his most famous formula",
    funFact: "Albert Einstein failed his first entrance exam to the Swiss Federal Polytechnic School. He also couldn't speak fluently until he was 9 years old!",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Albert_Einstein_Head.jpg/300px-Albert_Einstein_Head.jpg",
    difficulty: "easy",
  },
  {
    id: "marie-curie",
    name: "Marie Curie",
    category: "scientists",
    emoji: "🔬",
    hint1: "She was the first woman to win a Nobel Prize",
    hint2: "She discovered two elements on the periodic table",
    hint3: "She discovered polonium and radium",
    funFact: "Marie Curie was so radioactive that her personal notebooks are kept in lead-lined boxes in Paris — and you need protective gear to view them!",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Marie_Curie_c1920.jpg/300px-Marie_Curie_c1920.jpg",
    difficulty: "easy",
  },
  {
    id: "stephen-hawking",
    name: "Stephen Hawking",
    category: "scientists",
    emoji: "🔬",
    hint1: "He wrote 'A Brief History of Time'",
    hint2: "He was a theoretical physicist who had ALS",
    hint3: "He communicated via a speech-generating device from his wheelchair",
    funFact: "Stephen Hawking was given 2 years to live when diagnosed with ALS at 21. He lived to 76 and made some of the greatest scientific contributions in history!",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Stephen_Hawking.StarChild.jpg/300px-Stephen_Hawking.StarChild.jpg",
    difficulty: "easy",
  },
  {
    id: "nikola-tesla",
    name: "Nikola Tesla",
    category: "scientists",
    emoji: "🔬",
    hint1: "He invented the AC electrical system",
    hint2: "A famous electric car company is named after him",
    hint3: "He had a famous rivalry with Thomas Edison",
    funFact: "Nikola Tesla claimed he never slept more than 2 hours a night and once said he needed no more than that. He also had an extreme phobia of pearls!",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/N.Tesla.JPG/300px-N.Tesla.JPG",
    difficulty: "medium",
  },
  {
    id: "jane-goodall",
    name: "Jane Goodall",
    category: "scientists",
    emoji: "🔬",
    hint1: "She spent decades living with and studying wild chimpanzees",
    hint2: "She is a British primatologist and conservationist",
    hint3: "She studied chimps in the Gombe Stream National Park in Tanzania",
    funFact: "Jane Goodall discovered that chimpanzees make and use tools — a finding so shocking that her mentor Louis Leakey said 'Now we must redefine tool, redefine man, or accept chimpanzees as humans.'",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Jane_Goodall_2015.jpg/300px-Jane_Goodall_2015.jpg",
    difficulty: "medium",
  },

  // ─── POLITICIANS / LEADERS ────────────────────
  {
    id: "malala-yousafzai",
    name: "Malala Yousafzai",
    category: "politicians",
    emoji: "🌍",
    hint1: "She is the youngest Nobel Peace Prize laureate",
    hint2: "She was shot by the Taliban for advocating for girls' education",
    hint3: "She's a Pakistani activist who survived an assassination attempt at 15",
    funFact: "Malala Yousafzai became the youngest Nobel Peace Prize winner at age 17, and is the only person to have received the Pakistani National Youth Peace Prize twice!",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Malala_Yousafzai_in_2021.jpg/300px-Malala_Yousafzai_in_2021.jpg",
    difficulty: "medium",
  },
  {
    id: "nelson-mandela",
    name: "Nelson Mandela",
    category: "politicians",
    emoji: "🌍",
    hint1: "He spent 27 years in prison for his political beliefs",
    hint2: "He led the anti-apartheid movement in South Africa",
    hint3: "He became South Africa's first Black president after his release",
    funFact: "Nelson Mandela was on the US terrorist watch list until 2008 — 15 years after winning the Nobel Peace Prize! He was removed only after a special act of Congress.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Nelson_Mandela-2008_%28edit%29.jpg/300px-Nelson_Mandela-2008_%28edit%29.jpg",
    difficulty: "easy",
  },
  {
    id: "angela-merkel",
    name: "Angela Merkel",
    category: "politicians",
    emoji: "🌍",
    hint1: "She was Germany's Chancellor for 16 years",
    hint2: "She was a quantum chemist before entering politics",
    hint3: "She is often described as the most powerful woman in the world during her tenure",
    funFact: "Angela Merkel holds a doctorate in quantum chemistry and published scientific papers before becoming a politician. Her research earned her a spot in a scientific journal!",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Angela_Merkel_2019_%28cropped%29.jpg/300px-Angela_Merkel_2019_%28cropped%29.jpg",
    difficulty: "medium",
  },

  // ─── CULTURAL ICONS ───────────────────────────
  {
    id: "oprah-winfrey",
    name: "Oprah Winfrey",
    category: "icons",
    emoji: "✨",
    hint1: "She runs a famous book club and media empire",
    hint2: "Her legendary talk show ran for 25 seasons",
    hint3: "YOU get a car! YOU get a car! Everybody gets a car!",
    funFact: "Oprah Winfrey was fired from her first TV job as a news anchor at 22 for being 'unfit for television news.' She became the first Black female billionaire in history!",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Oprah_in_2014.jpg/300px-Oprah_in_2014.jpg",
    difficulty: "easy",
  },
  {
    id: "marilyn-monroe",
    name: "Marilyn Monroe",
    category: "icons",
    emoji: "✨",
    hint1: "She was the quintessential Hollywood blonde bombshell",
    hint2: "She sang Happy Birthday to President JFK",
    hint3: "Some Like It Hot and Gentlemen Prefer Blondes were her films",
    funFact: "Marilyn Monroe was reportedly the first woman to appear on a US postage stamp in 1995, and she was also an accomplished actress who studied at the Actors Studio in New York!",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Marilyn_Monroe_-_publicity.JPG/300px-Marilyn_Monroe_-_publicity.JPG",
    difficulty: "easy",
  },
  {
    id: "frida-kahlo",
    name: "Frida Kahlo",
    category: "icons",
    emoji: "✨",
    hint1: "She was a Mexican painter known for her self-portraits",
    hint2: "She is famous for her unibrow and flower crown aesthetic",
    hint3: "She painted through chronic pain after a near-fatal bus accident",
    funFact: "Frida Kahlo suffered over 35 surgeries in her lifetime after a devastating bus accident at 18. She painted 143 paintings, of which 55 are self-portraits — often while bedridden!",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg/300px-Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg",
    difficulty: "medium",
  },
  {
    id: "elon-musk",
    name: "Elon Musk",
    category: "icons",
    emoji: "✨",
    hint1: "He founded a company that makes electric cars",
    hint2: "He also runs a company trying to colonize Mars",
    hint3: "Tesla and SpaceX are two of his companies",
    funFact: "Elon Musk taught himself to code at age 10 and sold his first video game, Blastar, at age 12 for $500. He grew up in South Africa!",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/300px-Elon_Musk_Royal_Society_%28crop2%29.jpg",
    difficulty: "easy",
  },
  {
    id: "greta-thunberg",
    name: "Greta Thunberg",
    category: "icons",
    emoji: "✨",
    hint1: "She started a global climate movement as a teenager",
    hint2: "She addressed world leaders at the UN saying 'How dare you!'",
    hint3: "Her school strike for climate inspired millions worldwide",
    funFact: "Greta Thunberg has Asperger's syndrome, OCD, and selective mutism, and calls her neurodivergence her 'superpower' — she wouldn't have become an activist without it!",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Greta_Thunberg_4.jpg/300px-Greta_Thunberg_4.jpg",
    difficulty: "medium",
  },
];

// Remove duplicated ID issue (quick fix)
export const PEOPLE_CLEAN = PEOPLE.filter((p, index, self) =>
  index === self.findIndex((t) => t.id === p.id)
);

export function getRandomPeople(count: number, excludeIds: string[] = []): Person[] {
  const available = PEOPLE_CLEAN.filter((p) => !excludeIds.includes(p.id));
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function generateOptions(correct: Person, all: Person[]): Person[] {
  const wrong = all
    .filter((p) => p.id !== correct.id && p.category === correct.category)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  
  // If not enough same-category, fill with random
  const extra = all
    .filter((p) => p.id !== correct.id && !wrong.find(w => w.id === p.id))
    .sort(() => Math.random() - 0.5)
    .slice(0, 3 - wrong.length);

  const options = [...wrong, ...extra, correct].sort(() => Math.random() - 0.5);
  return options;
}
