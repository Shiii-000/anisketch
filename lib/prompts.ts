export interface DrawingPrompt {
  subject: string;
  style: string;
  constraint: string;
}

const SUBJECTS = [
  "a coffee cup", "a simple chair", "a candle", "a book stack", "a potted plant",
  "a lantern", "a sword", "a mushroom", "a cloud", "a mountain",
  "a window", "a door", "a bottle", "a hat", "a pair of shoes",
  "a apple", "a crystal", "a feather", "a scroll", "a compass",
  "a tree", "a bridge", "a lighthouse", "a tent", "a campfire",
];

const STYLES = [
  "in anime style", "as a sketch", "with minimal lines", "as a cartoon",
  "in a realistic style", "as a chibi version", "with heavy shadows",
  "with only outlines", "in a cute style", "as a doodle",
];

const CONSTRAINTS = [
  "using only straight lines", "without lifting your pen",
  "in under 5 minutes", "using only 3 shading values",
  "from imagination only", "with exaggerated proportions",
  "focusing on texture", "with a clear light source",
  "using hatching only", "as small as possible",
  "with a fun expression", "from an unusual angle",
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generatePrompt(seed?: number): DrawingPrompt {
  const rand = seededRandom(seed ?? Math.floor(Math.random() * 999999));
  return {
    subject: SUBJECTS[Math.floor(rand() * SUBJECTS.length)],
    style: STYLES[Math.floor(rand() * STYLES.length)],
    constraint: CONSTRAINTS[Math.floor(rand() * CONSTRAINTS.length)],
  };
}

export function getDailyPromptSeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}
