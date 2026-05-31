export type Difficulty = 1 | 2 | 3;

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  xp: number;
  stageId: string;
}

export interface Stage {
  id: string;
  title: string;
  emoji: string;
  description: string;
  unlockLevel: number;
  challenges: Challenge[];
}

export const STAGES: Stage[] = [
  {
    id: "stage1",
    title: "Lines & Control",
    emoji: "✏️",
    description: "Master confident, controlled lines — the foundation of everything.",
    unlockLevel: 0,
    challenges: [
      { id: "s1c1", stageId: "stage1", title: "Horizontal Lines", description: "Draw 20 straight horizontal lines across the page without a ruler.", difficulty: 1, xp: 10 },
      { id: "s1c2", stageId: "stage1", title: "Vertical Lines", description: "Draw 20 straight vertical lines without a ruler.", difficulty: 1, xp: 10 },
      { id: "s1c3", stageId: "stage1", title: "Diagonal Lines", description: "Draw 20 diagonal lines at a consistent angle.", difficulty: 1, xp: 10 },
      { id: "s1c4", stageId: "stage1", title: "Dot to Dot", description: "Place 10 pairs of dots and connect each pair with a straight line.", difficulty: 2, xp: 25 },
      { id: "s1c5", stageId: "stage1", title: "Smooth Curves", description: "Draw 10 smooth, flowing curves without lifting your pen.", difficulty: 1, xp: 10 },
      { id: "s1c6", stageId: "stage1", title: "Hatching", description: "Fill a 5x5 cm box with clean, evenly spaced hatching lines.", difficulty: 2, xp: 25 },
      { id: "s1c7", stageId: "stage1", title: "Crosshatching", description: "Fill a 5x5 cm box with crosshatching to create a gradient from light to dark.", difficulty: 2, xp: 25 },
    ],
  },
  {
    id: "stage2",
    title: "Basic Shapes",
    emoji: "⭕",
    description: "Everything in art starts with simple shapes. Learn to draw them cleanly.",
    unlockLevel: 2,
    challenges: [
      { id: "s2c1", stageId: "stage2", title: "Circles", description: "Draw 10 freehand circles of different sizes as round as possible.", difficulty: 1, xp: 10 },
      { id: "s2c2", stageId: "stage2", title: "Ellipses", description: "Draw 10 ellipses at different angles and proportions.", difficulty: 2, xp: 25 },
      { id: "s2c3", stageId: "stage2", title: "Squares", description: "Draw 10 clean squares with right angles freehand.", difficulty: 1, xp: 10 },
      { id: "s2c4", stageId: "stage2", title: "Rectangles", description: "Draw 5 rectangles of different proportions.", difficulty: 1, xp: 10 },
      { id: "s2c5", stageId: "stage2", title: "Shape Object", description: "Draw a simple everyday object (cup, phone, book) using only circles and squares.", difficulty: 2, xp: 25 },
      { id: "s2c6", stageId: "stage2", title: "Shape Face", description: "Draw a simple face using only basic shapes — no details.", difficulty: 2, xp: 25 },
    ],
  },
  {
    id: "stage3",
    title: "Form & 3D",
    emoji: "📦",
    description: "Turn flat shapes into 3D forms. This is where drawing comes alive.",
    unlockLevel: 4,
    challenges: [
      { id: "s3c1", stageId: "stage3", title: "Cylinders", description: "Draw 10 cylinders from different angles.", difficulty: 2, xp: 25 },
      { id: "s3c2", stageId: "stage3", title: "Cubes", description: "Draw 10 cubes showing three visible faces.", difficulty: 2, xp: 25 },
      { id: "s3c3", stageId: "stage3", title: "Spheres", description: "Draw 5 spheres that look round and 3D.", difficulty: 2, xp: 25 },
      { id: "s3c4", stageId: "stage3", title: "Cones", description: "Draw 5 cones from different angles.", difficulty: 1, xp: 10 },
      { id: "s3c5", stageId: "stage3", title: "Object Breakdown", description: "Pick a real object and break it down into basic 3D shapes. Draw the breakdown.", difficulty: 3, xp: 50 },
      { id: "s3c6", stageId: "stage3", title: "Shape Robot", description: "Draw a simple robot character made entirely of 3D shapes.", difficulty: 3, xp: 50 },
    ],
  },
  {
    id: "stage4",
    title: "Perspective",
    emoji: "📐",
    description: "Learn how to create depth and space in your drawings.",
    unlockLevel: 7,
    challenges: [
      { id: "s4c1", stageId: "stage4", title: "1-Point Box", description: "Draw a box in 1-point perspective with a horizon line and vanishing point.", difficulty: 2, xp: 25 },
      { id: "s4c2", stageId: "stage4", title: "1-Point Street", description: "Draw a simple street or hallway receding into a single vanishing point.", difficulty: 3, xp: 50 },
      { id: "s4c3", stageId: "stage4", title: "2-Point Box", description: "Draw a box in 2-point perspective.", difficulty: 2, xp: 25 },
      { id: "s4c4", stageId: "stage4", title: "2-Point Building", description: "Draw a simple building in 2-point perspective.", difficulty: 3, xp: 50 },
      { id: "s4c5", stageId: "stage4", title: "Room Interior", description: "Draw a simple room interior with furniture in perspective.", difficulty: 3, xp: 50 },
    ],
  },
  {
    id: "stage5",
    title: "Light & Shadow",
    emoji: "💡",
    description: "Understand light to make your drawings look real and dimensional.",
    unlockLevel: 10,
    challenges: [
      { id: "s5c1", stageId: "stage5", title: "Shade a Sphere", description: "Draw and shade a sphere with one light source. Show highlight, midtone, shadow and reflected light.", difficulty: 2, xp: 25 },
      { id: "s5c2", stageId: "stage5", title: "Shade a Cube", description: "Draw and shade a cube with one light source. Each face should be a different value.", difficulty: 2, xp: 25 },
      { id: "s5c3", stageId: "stage5", title: "Shade a Cylinder", description: "Draw and shade a cylinder with one light source.", difficulty: 2, xp: 25 },
      { id: "s5c4", stageId: "stage5", title: "Cast Shadow", description: "Draw an object and its correct cast shadow based on a defined light source.", difficulty: 3, xp: 50 },
      { id: "s5c5", stageId: "stage5", title: "Greyscale Render", description: "Do a full greyscale render of a simple object using at least 5 different values.", difficulty: 3, xp: 50 },
      { id: "s5c6", stageId: "stage5", title: "Two Light Sources", description: "Shade an object lit by two different light sources of different intensities.", difficulty: 3, xp: 50 },
    ],
  },
  {
    id: "stage6",
    title: "Texture & Detail",
    emoji: "🖌️",
    description: "Give your drawings surface, feel and life through texture.",
    unlockLevel: 13,
    challenges: [
      { id: "s6c1", stageId: "stage6", title: "Smooth Surface", description: "Draw and render a smooth surface like glass or skin.", difficulty: 2, xp: 25 },
      { id: "s6c2", stageId: "stage6", title: "Rough Surface", description: "Draw and render a rough surface like rock or wood.", difficulty: 2, xp: 25 },
      { id: "s6c3", stageId: "stage6", title: "Fabric Folds", description: "Draw a piece of fabric or clothing with realistic folds.", difficulty: 3, xp: 50 },
      { id: "s6c4", stageId: "stage6", title: "Hair Strands", description: "Draw flowing hair strands showing direction and volume.", difficulty: 3, xp: 50 },
      { id: "s6c5", stageId: "stage6", title: "Fur Texture", description: "Draw a patch of fur or animal coat with convincing texture.", difficulty: 3, xp: 50 },
    ],
  },
  {
    id: "stage7",
    title: "Anime Fundamentals",
    emoji: "🎌",
    description: "You've mastered the basics. Now start your anime journey.",
    unlockLevel: 16,
    challenges: [
      { id: "s7c1", stageId: "stage7", title: "Anime Head (Front)", description: "Draw an anime head from the front using correct proportions.", difficulty: 2, xp: 25 },
      { id: "s7c2", stageId: "stage7", title: "Anime Head (3/4)", description: "Draw an anime head in 3/4 view.", difficulty: 3, xp: 50 },
      { id: "s7c3", stageId: "stage7", title: "Anime Head (Side)", description: "Draw an anime head in side/profile view.", difficulty: 2, xp: 25 },
      { id: "s7c4", stageId: "stage7", title: "Face Proportions", description: "Sketch a face with guidelines showing correct anime proportions.", difficulty: 2, xp: 25 },
      { id: "s7c5", stageId: "stage7", title: "5 Expressions", description: "Draw the same face with 5 different emotions: happy, sad, angry, surprised, neutral.", difficulty: 3, xp: 50 },
      { id: "s7c6", stageId: "stage7", title: "5 Eye Styles", description: "Draw 5 different anime eye styles.", difficulty: 3, xp: 50 },
    ],
  },
];

export function xpForLevel(level: number): number {
  return level * 100;
}

export function levelFromXp(xp: number): number {
  let level = 1;
  let threshold = 100;
  while (xp >= threshold) {
    xp -= threshold;
    level++;
    threshold = level * 100;
  }
  return level;
}

export function xpIntoCurrentLevel(totalXp: number): number {
  let xp = totalXp;
  let level = 1;
  let threshold = 100;
  while (xp >= threshold) {
    xp -= threshold;
    level++;
    threshold = level * 100;
  }
  return xp;
}

export function xpForNextLevel(totalXp: number): number {
  const level = levelFromXp(totalXp);
  return level * 100;
}
