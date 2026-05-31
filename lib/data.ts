export type Difficulty = 1 | 2 | 3;

export interface Challenge {
  id: string;
  stageId: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  xp: number;
  // Progression
  minStarsToUnlock: number; // stars needed on PREVIOUS challenge to unlock this one
  // Reference
  goal: string;             // what a good result looks like
  tips: string[];           // common mistakes / advice
  referenceUrl: string;     // example image URL
  referenceCaption: string;
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
      {
        id: "s1c1", stageId: "stage1", title: "Horizontal Lines", difficulty: 1, xp: 10, minStarsToUnlock: 0,
        description: "Draw 20 straight horizontal lines across the page without a ruler. Focus on keeping them parallel and evenly spaced.",
        goal: "Lines should be straight, consistent in spacing, and drawn with a single confident stroke — no sketching or retracing.",
        tips: ["Draw from your shoulder, not your wrist", "Move fast — slow lines wobble more", "Keep your elbow off the table"],
        referenceUrl: "https://i.imgur.com/line-practice.png",
        referenceCaption: "Example of clean parallel horizontal lines",
      },
      {
        id: "s1c2", stageId: "stage1", title: "Vertical Lines", difficulty: 1, xp: 10, minStarsToUnlock: 2,
        description: "Draw 20 straight vertical lines without a ruler. Try to keep them perfectly upright.",
        goal: "Lines should be straight top to bottom, evenly spaced, and not slanted.",
        tips: ["Rotate your paper if vertical lines feel awkward", "Use your whole arm movement", "Don't tilt your wrist"],
        referenceUrl: "https://drawabox.com/img/lesson1/exb.png",
        referenceCaption: "Vertical line exercise from Drawabox",
      },
      {
        id: "s1c3", stageId: "stage1", title: "Diagonal Lines", difficulty: 1, xp: 10, minStarsToUnlock: 2,
        description: "Draw 20 diagonal lines at a consistent 45° angle.",
        goal: "All lines should be at the same angle, straight, and evenly spaced.",
        tips: ["Pick your angle before you start and stick to it", "Use a light pencil mark as a guide angle", "Ghosting method: hover before you commit"],
        referenceUrl: "https://drawabox.com/img/lesson1/exc.png",
        referenceCaption: "Diagonal line exercise from Drawabox",
      },
      {
        id: "s1c4", stageId: "stage1", title: "Dot to Dot", difficulty: 2, xp: 25, minStarsToUnlock: 2,
        description: "Place 10 pairs of dots on the page and connect each pair with a single straight line.",
        goal: "Each line should start and end precisely on its dot, with no overshoot.",
        tips: ["Look at the destination dot, not your pen tip", "Ghost the motion 2-3 times before touching paper", "Speed helps accuracy here"],
        referenceUrl: "https://drawabox.com/img/lesson1/ghosted-lines.png",
        referenceCaption: "Ghosted line method from Drawabox",
      },
      {
        id: "s1c5", stageId: "stage1", title: "Smooth Curves", difficulty: 1, xp: 10, minStarsToUnlock: 2,
        description: "Draw 10 smooth, flowing C-shaped curves without lifting your pen.",
        goal: "Each curve should be smooth with no bumps or direction changes mid-stroke.",
        tips: ["Draw from the shoulder for large curves", "Think of the full arc before you start", "Go faster — slow curves get wobbly"],
        referenceUrl: "https://drawabox.com/img/lesson1/curved-lines.png",
        referenceCaption: "Curve exercise from Drawabox",
      },
      {
        id: "s1c6", stageId: "stage1", title: "Hatching", difficulty: 2, xp: 25, minStarsToUnlock: 2,
        description: "Fill a 5x5 cm box with evenly spaced parallel lines (hatching). Try to create a smooth grey value.",
        goal: "Lines should be evenly spaced and all going the same direction — creating a consistent grey tone.",
        tips: ["Keep spacing consistent — use your first line as reference", "Don't vary pressure", "Aim for lines that never touch"],
        referenceUrl: "https://i.imgur.com/hatching-example.jpg",
        referenceCaption: "Clean hatching example",
      },
      {
        id: "s1c7", stageId: "stage1", title: "Crosshatching", difficulty: 2, xp: 25, minStarsToUnlock: 2,
        description: "Fill a 5x5 cm box with crosshatching — two layers of lines at different angles. Go from light to dark.",
        goal: "Should show a clear gradient from light on one side to dark on the other using layered hatching.",
        tips: ["Let the first layer dry before crossing it", "Vary spacing to control darkness", "3+ layers can create very deep darks"],
        referenceUrl: "https://i.imgur.com/crosshatch-example.jpg",
        referenceCaption: "Crosshatching value example",
      },
    ],
  },
  {
    id: "stage2",
    title: "Basic Shapes",
    emoji: "⭕",
    description: "Everything in art starts with simple shapes. Learn to draw them cleanly.",
    unlockLevel: 2,
    challenges: [
      {
        id: "s2c1", stageId: "stage2", title: "Circles", difficulty: 1, xp: 10, minStarsToUnlock: 0,
        description: "Draw 10 freehand circles of different sizes — as round as possible.",
        goal: "Circles should be closed, round, and not egg-shaped or pointy.",
        tips: ["Use your whole arm for big circles", "Draw fast — slow circles become polygons", "Try the ghosting method first"],
        referenceUrl: "https://drawabox.com/img/lesson1/ellipses-table.png",
        referenceCaption: "Circle/ellipse practice from Drawabox",
      },
      {
        id: "s2c2", stageId: "stage2", title: "Ellipses", difficulty: 2, xp: 25, minStarsToUnlock: 2,
        description: "Draw 10 ellipses at different angles and proportions — from nearly circular to very flat.",
        goal: "Ellipses should be smooth, symmetric, and clearly different proportions from each other.",
        tips: ["An ellipse has 2 axes — draw those first", "The degree (fatness) changes as your viewpoint changes", "Go over the stroke 2-3 times to smooth it"],
        referenceUrl: "https://drawabox.com/img/lesson1/ellipses-in-planes.png",
        referenceCaption: "Ellipses in different planes from Drawabox",
      },
      {
        id: "s2c3", stageId: "stage2", title: "Squares", difficulty: 1, xp: 10, minStarsToUnlock: 2,
        description: "Draw 10 clean squares freehand — all sides equal, all corners 90°.",
        goal: "Squares should have straight sides of equal length and right-angle corners.",
        tips: ["Draw lightly at first — adjust corners after", "Use a dot for each corner before connecting", "Check by eye that sides look equal"],
        referenceUrl: "https://i.imgur.com/square-practice.jpg",
        referenceCaption: "Square freehand practice",
      },
      {
        id: "s2c4", stageId: "stage2", title: "Rectangles", difficulty: 1, xp: 10, minStarsToUnlock: 2,
        description: "Draw 5 rectangles of very different proportions — from square-ish to very long and thin.",
        goal: "Opposite sides should look equal and parallel, corners should be right angles.",
        tips: ["Think about the ratio before drawing (1:2, 1:4 etc.)", "Draw the long sides first", "Mark corners lightly before connecting"],
        referenceUrl: "https://i.imgur.com/rectangle-practice.jpg",
        referenceCaption: "Rectangle proportion practice",
      },
      {
        id: "s2c5", stageId: "stage2", title: "Shape Object", difficulty: 2, xp: 25, minStarsToUnlock: 2,
        description: "Draw a simple everyday object (cup, phone, book) using ONLY basic shapes — no details.",
        goal: "Object should be recognizable using only circles, rectangles and triangles — no curved details.",
        tips: ["Squint at the object — what shapes do you see?", "Start with the biggest shape first", "Overlap shapes to build the form"],
        referenceUrl: "https://i.imgur.com/shape-breakdown.jpg",
        referenceCaption: "Breaking objects into basic shapes",
      },
      {
        id: "s2c6", stageId: "stage2", title: "Shape Face", difficulty: 2, xp: 25, minStarsToUnlock: 2,
        description: "Draw a simple face using only basic shapes — circle for head, oval eyes, triangle nose, rectangle mouth.",
        goal: "Face should be recognizable with correct proportional placement using only geometric shapes.",
        tips: ["Head is roughly an oval/egg shape", "Eyes sit at the middle of the head height", "Keep it simple — resist adding curves"],
        referenceUrl: "https://i.imgur.com/shape-face.jpg",
        referenceCaption: "Geometric face construction",
      },
    ],
  },
  {
    id: "stage3",
    title: "Form & 3D",
    emoji: "📦",
    description: "Turn flat shapes into 3D forms. This is where drawing comes alive.",
    unlockLevel: 4,
    challenges: [
      {
        id: "s3c1", stageId: "stage3", title: "Cylinders", difficulty: 2, xp: 25, minStarsToUnlock: 0,
        description: "Draw 10 cylinders from different angles — some upright, some on their side, some at an angle.",
        goal: "Each cylinder should have two ellipses (top/bottom) connected by two straight lines, with the far ellipse slightly smaller.",
        tips: ["The top ellipse is flatter when viewed from the side", "Both ellipses must be the same width", "The vertical sides should be straight and parallel"],
        referenceUrl: "https://drawabox.com/img/lesson1/cylinders.png",
        referenceCaption: "Cylinder construction from Drawabox",
      },
      {
        id: "s3c2", stageId: "stage3", title: "Cubes", difficulty: 2, xp: 25, minStarsToUnlock: 2,
        description: "Draw 10 cubes showing three visible faces — from different angles.",
        goal: "Should clearly show 3 faces with correct foreshortening — no face should look perfectly square.",
        tips: ["Start with the front face as a slightly tilted square", "Parallel lines on a cube converge toward vanishing points", "The top face is a diamond/rhombus shape"],
        referenceUrl: "https://drawabox.com/img/lesson1/rotated-boxes.png",
        referenceCaption: "Rotated boxes from Drawabox",
      },
      {
        id: "s3c3", stageId: "stage3", title: "Spheres", difficulty: 2, xp: 25, minStarsToUnlock: 2,
        description: "Draw 5 spheres that look round and 3D — add a simple equator line to show the form.",
        goal: "Spheres should look round with an equator ellipse showing its orientation in space.",
        tips: ["Draw the circle first, then the equator ellipse", "The equator can tilt in any direction", "Add a small shadow underneath to ground it"],
        referenceUrl: "https://drawabox.com/img/lesson1/sphere-construction.png",
        referenceCaption: "Sphere construction from Drawabox",
      },
      {
        id: "s3c4", stageId: "stage3", title: "Cones", difficulty: 1, xp: 10, minStarsToUnlock: 2,
        description: "Draw 5 cones from different angles — upright, tipped, and lying on their side.",
        goal: "Each cone should have a base ellipse and a tip, with straight sides touching the ellipse edges.",
        tips: ["The base is an ellipse, not a circle", "The tip should be exactly centered above the base", "When tipped, the ellipse tilts with the cone"],
        referenceUrl: "https://i.imgur.com/cone-construction.jpg",
        referenceCaption: "Cone from different angles",
      },
      {
        id: "s3c5", stageId: "stage3", title: "Object Breakdown", difficulty: 3, xp: 50, minStarsToUnlock: 2,
        description: "Pick a real object and break it into basic 3D shapes. Draw the wireframe breakdown next to the object sketch.",
        goal: "Should show the same object twice — once as a sketch, once as transparent 3D shapes that make it up.",
        tips: ["Good objects: bottle, lamp, kettle, cup", "Draw the shapes overlapping and transparent", "Label each shape if helpful"],
        referenceUrl: "https://i.imgur.com/3d-breakdown.jpg",
        referenceCaption: "Object broken into 3D shapes",
      },
      {
        id: "s3c6", stageId: "stage3", title: "Shape Robot", difficulty: 3, xp: 50, minStarsToUnlock: 2,
        description: "Design a simple robot character made entirely of 3D shapes — boxes, cylinders, spheres.",
        goal: "Robot should clearly show multiple 3D forms assembled together, with visible overlapping and foreshortening.",
        tips: ["Start with the torso (a big box)", "Add limbs as cylinders", "Use spheres for joints and head"],
        referenceUrl: "https://i.imgur.com/shape-robot.jpg",
        referenceCaption: "Robot built from basic 3D shapes",
      },
    ],
  },
  {
    id: "stage4",
    title: "Perspective",
    emoji: "📐",
    description: "Learn how to create depth and space in your drawings.",
    unlockLevel: 7,
    challenges: [
      {
        id: "s4c1", stageId: "stage4", title: "1-Point Box", difficulty: 2, xp: 25, minStarsToUnlock: 0,
        description: "Draw a horizon line, mark one vanishing point, and draw 3 boxes receding toward it.",
        goal: "All receding lines must converge exactly to the vanishing point. Front faces are flat squares.",
        tips: ["Use a ruler for the receding lines at first", "The front face stays flat — only depth lines converge", "Objects below the horizon show their top, above show their bottom"],
        referenceUrl: "https://i.imgur.com/1point-perspective.jpg",
        referenceCaption: "1-point perspective boxes",
      },
      {
        id: "s4c2", stageId: "stage4", title: "1-Point Street", difficulty: 3, xp: 50, minStarsToUnlock: 2,
        description: "Draw a simple street or hallway receding into a single vanishing point.",
        goal: "Street lines, building tops, windows — everything should converge to one point on the horizon.",
        tips: ["Start with the vanishing point and horizon", "Draw the ground lines first", "Add buildings as simple boxes after"],
        referenceUrl: "https://i.imgur.com/1point-street.jpg",
        referenceCaption: "Simple street in 1-point perspective",
      },
      {
        id: "s4c3", stageId: "stage4", title: "2-Point Box", difficulty: 2, xp: 25, minStarsToUnlock: 2,
        description: "Draw a horizon line with two vanishing points at the edges. Draw 3 boxes using both points.",
        goal: "Left-facing edges go to the left VP, right-facing edges go to the right VP. Vertical edges stay perfectly vertical.",
        tips: ["Put your VPs far apart — close VPs cause distortion", "Only vertical lines stay straight — everything else converges", "Check every line goes to one of the two VPs"],
        referenceUrl: "https://i.imgur.com/2point-perspective.jpg",
        referenceCaption: "2-point perspective boxes",
      },
      {
        id: "s4c4", stageId: "stage4", title: "2-Point Building", difficulty: 3, xp: 50, minStarsToUnlock: 2,
        description: "Draw a simple building corner in 2-point perspective with windows and a door.",
        goal: "Building should look solid and 3D with windows/doors also correctly in perspective.",
        tips: ["Draw the main box first before adding details", "Windows are just smaller rectangles following the same VPs", "Add a ground shadow to make it feel planted"],
        referenceUrl: "https://i.imgur.com/2point-building.jpg",
        referenceCaption: "Building in 2-point perspective",
      },
      {
        id: "s4c5", stageId: "stage4", title: "Room Interior", difficulty: 3, xp: 50, minStarsToUnlock: 2,
        description: "Draw a simple room interior in 1-point perspective — floor, ceiling, walls, and at least 2 pieces of furniture.",
        goal: "Room should feel like a real 3D space with furniture correctly scaled and in perspective.",
        tips: ["Start with the back wall as a rectangle", "Draw vanishing lines from each corner", "Furniture = boxes in perspective"],
        referenceUrl: "https://i.imgur.com/room-perspective.jpg",
        referenceCaption: "Room interior in 1-point perspective",
      },
    ],
  },
  {
    id: "stage5",
    title: "Light & Shadow",
    emoji: "💡",
    description: "Understand light to make your drawings look real and dimensional.",
    unlockLevel: 10,
    challenges: [
      {
        id: "s5c1", stageId: "stage5", title: "Shade a Sphere", difficulty: 2, xp: 25, minStarsToUnlock: 0,
        description: "Draw a sphere and shade it with one light source. Show highlight, midtone, core shadow, reflected light, and cast shadow.",
        goal: "Should clearly show all 5 zones of light: highlight, midtone, core shadow, reflected light, and cast shadow on the ground.",
        tips: ["The core shadow is NOT the darkest area — reflected light makes the edge lighter", "Cast shadow is darkest near the object", "Blend midtones smoothly — no harsh lines"],
        referenceUrl: "https://i.imgur.com/sphere-shading.jpg",
        referenceCaption: "5 zones of light on a sphere",
      },
      {
        id: "s5c2", stageId: "stage5", title: "Shade a Cube", difficulty: 2, xp: 25, minStarsToUnlock: 2,
        description: "Draw a cube and shade it with one light source — each face should be a clearly different value.",
        goal: "Three visible faces should each be a distinct value: light, mid, dark. No two faces the same tone.",
        tips: ["Decide where the light is BEFORE shading", "The top face is usually lightest", "Use flat consistent tones on each face — no gradients needed"],
        referenceUrl: "https://i.imgur.com/cube-shading.jpg",
        referenceCaption: "Cube with three value faces",
      },
      {
        id: "s5c3", stageId: "stage5", title: "Shade a Cylinder", difficulty: 2, xp: 25, minStarsToUnlock: 2,
        description: "Draw a cylinder and shade it with one light source. Show the gradual wrap of light around the form.",
        goal: "Should show a smooth gradient from highlight to core shadow, with reflected light on the dark edge.",
        tips: ["The highlight on a cylinder is a vertical stripe, not a dot", "Shade wraps around — blend from light to dark gradually", "Add the reflected light last as a subtle lighter area"],
        referenceUrl: "https://i.imgur.com/cylinder-shading.jpg",
        referenceCaption: "Cylinder shading with light wrap",
      },
      {
        id: "s5c4", stageId: "stage5", title: "Cast Shadow", difficulty: 3, xp: 50, minStarsToUnlock: 2,
        description: "Draw a box on a surface with a defined light source. Draw the correct cast shadow shape on the ground.",
        goal: "Cast shadow should correctly match the shape of the object and stretch away from the light source.",
        tips: ["Draw rays from the light source through each corner of the object", "Where the rays hit the ground = shadow corners", "Shadows are longer when the light is low"],
        referenceUrl: "https://i.imgur.com/cast-shadow.jpg",
        referenceCaption: "Cast shadow construction method",
      },
      {
        id: "s5c5", stageId: "stage5", title: "Greyscale Render", difficulty: 3, xp: 50, minStarsToUnlock: 2,
        description: "Do a full greyscale render of a simple object (bottle, apple, cup) using at least 5 distinct values.",
        goal: "Should show a full value range from near-white to near-black with smooth transitions between at least 5 tones.",
        tips: ["Make a value scale first (5 boxes from white to black)", "Reference your scale while shading", "Dark darks make lights look brighter"],
        referenceUrl: "https://i.imgur.com/greyscale-render.jpg",
        referenceCaption: "Full greyscale render with value scale",
      },
      {
        id: "s5c6", stageId: "stage5", title: "Two Light Sources", difficulty: 3, xp: 50, minStarsToUnlock: 3,
        description: "Shade an object lit by two different light sources — one strong (key light) and one weak (fill light).",
        goal: "Should show two distinct light sides with different intensities and two cast shadows going different directions.",
        tips: ["Key light is bright and casts a sharp shadow", "Fill light is soft and reduces shadow darkness", "Where both lights hit = brightest highlight"],
        referenceUrl: "https://i.imgur.com/two-lights.jpg",
        referenceCaption: "Object with two light sources",
      },
    ],
  },
  {
    id: "stage6",
    title: "Texture & Detail",
    emoji: "🖌️",
    description: "Give your drawings surface, feel and life through texture.",
    unlockLevel: 13,
    challenges: [
      {
        id: "s6c1", stageId: "stage6", title: "Smooth Surface", difficulty: 2, xp: 25, minStarsToUnlock: 0,
        description: "Draw and render a smooth surface object (glass, ceramic, polished metal). Focus on clean gradients and sharp highlights.",
        goal: "Should show a clean gradient with a sharp, clearly defined highlight and no texture marks.",
        tips: ["Smooth surfaces have sharp, bright highlights", "Blend very smoothly — use a blending stump or fingertip", "Reflections are visible on very smooth surfaces"],
        referenceUrl: "https://i.imgur.com/smooth-surface.jpg",
        referenceCaption: "Smooth surface rendering",
      },
      {
        id: "s6c2", stageId: "stage6", title: "Rough Surface", difficulty: 2, xp: 25, minStarsToUnlock: 2,
        description: "Draw and render a rough surface (rock, brick, tree bark). Use mark-making to create texture.",
        goal: "Surface should look clearly rough with visible texture marks that follow the form of the object.",
        tips: ["Rough surfaces have soft, scattered highlights", "Use irregular marks — vary size and direction", "Let some white paper show through for sparkle"],
        referenceUrl: "https://i.imgur.com/rough-surface.jpg",
        referenceCaption: "Rough surface mark-making",
      },
      {
        id: "s6c3", stageId: "stage6", title: "Fabric Folds", difficulty: 3, xp: 50, minStarsToUnlock: 2,
        description: "Draw a piece of fabric hanging or draped, showing at least 5 realistic folds.",
        goal: "Folds should show clear light and shadow with peaks (highlights) and valleys (shadows).",
        tips: ["Folds always pull toward anchor points", "The peak of a fold catches light, the valley is dark", "Start with the anchor points, then draw where fabric falls"],
        referenceUrl: "https://i.imgur.com/fabric-folds.jpg",
        referenceCaption: "Fabric fold types and shading",
      },
      {
        id: "s6c4", stageId: "stage6", title: "Hair Strands", difficulty: 3, xp: 50, minStarsToUnlock: 2,
        description: "Draw a flowing section of hair — show individual strands, volume, and a light source.",
        goal: "Hair should look volumetric with a clear highlight area and individual strand lines that follow the flow.",
        tips: ["Draw hair in clumps/chunks first, then add strand lines", "Strand lines follow the flow direction", "Leave white areas for the highlight — don't draw there"],
        referenceUrl: "https://i.imgur.com/hair-strands.jpg",
        referenceCaption: "Hair volume and strand rendering",
      },
      {
        id: "s6c5", stageId: "stage6", title: "Fur Texture", difficulty: 3, xp: 50, minStarsToUnlock: 2,
        description: "Draw a patch of animal fur — showing direction, volume, and light catching the tips.",
        goal: "Fur should show clear direction of growth with lighter tips and darker base, giving a fluffy feeling.",
        tips: ["Draw the darkest area first, leave tips light", "Short strokes at the base, longer at the tips", "Vary stroke length and direction slightly"],
        referenceUrl: "https://i.imgur.com/fur-texture.jpg",
        referenceCaption: "Fur texture technique",
      },
    ],
  },
  {
    id: "stage7",
    title: "Anime Fundamentals",
    emoji: "🎌",
    description: "You've mastered the basics. Now begin your anime journey.",
    unlockLevel: 16,
    challenges: [
      {
        id: "s7c1", stageId: "stage7", title: "Anime Head (Front)", difficulty: 2, xp: 25, minStarsToUnlock: 0,
        description: "Draw an anime head from the front using the standard construction method — circle + jaw.",
        goal: "Head should use the classic anime egg shape with correct placement of eyes at mid-height and chin that tapers to a point.",
        tips: ["Start with a circle, add the chin below", "Eyes sit at the exact middle of the head", "Anime chins are sharper than realistic ones"],
        referenceUrl: "https://i.imgur.com/anime-head-front.jpg",
        referenceCaption: "Anime head front construction",
      },
      {
        id: "s7c2", stageId: "stage7", title: "Anime Head (3/4)", difficulty: 3, xp: 50, minStarsToUnlock: 2,
        description: "Draw an anime head in 3/4 view — the most common angle in anime art.",
        goal: "Head should show clear foreshortening with the far eye slightly smaller and the nose/chin offset from center.",
        tips: ["The center line of the face curves around the head", "The far eye is smaller and closer to center line", "The ear sits on the side — don't forget it!"],
        referenceUrl: "https://i.imgur.com/anime-head-34.jpg",
        referenceCaption: "Anime head 3/4 view construction",
      },
      {
        id: "s7c3", stageId: "stage7", title: "Anime Head (Side)", difficulty: 2, xp: 25, minStarsToUnlock: 2,
        description: "Draw an anime head in side/profile view.",
        goal: "Profile should show the characteristic anime flat forehead, small nose, and slightly protruding mouth.",
        tips: ["The nose in anime profile is very small", "The back of the head is rounder than you think", "Mouth sits close to the nose, far from the chin"],
        referenceUrl: "https://i.imgur.com/anime-head-side.jpg",
        referenceCaption: "Anime head side profile",
      },
      {
        id: "s7c4", stageId: "stage7", title: "Face Proportions", difficulty: 2, xp: 25, minStarsToUnlock: 2,
        description: "Draw a face with construction guidelines showing where eyes, nose, mouth and ears are placed.",
        goal: "Should show the horizontal eye line at mid-height and correct vertical spacing of facial features with visible guidelines.",
        tips: ["Eyes: halfway down the head", "Nose: halfway between eyes and chin", "Mouth: one third between nose and chin"],
        referenceUrl: "https://i.imgur.com/anime-proportions.jpg",
        referenceCaption: "Anime face proportion guidelines",
      },
      {
        id: "s7c5", stageId: "stage7", title: "5 Expressions", difficulty: 3, xp: 50, minStarsToUnlock: 2,
        description: "Draw the same face with 5 different emotions: happy, sad, angry, surprised, neutral.",
        goal: "Each expression should be clearly different and readable, using eyebrows and mouth shape as the main tools.",
        tips: ["Eyebrows are the #1 tool for expression", "Happy: curved up eyes + U mouth", "Angry: V-shaped brows + tight mouth"],
        referenceUrl: "https://i.imgur.com/anime-expressions.jpg",
        referenceCaption: "Anime expression reference sheet",
      },
      {
        id: "s7c6", stageId: "stage7", title: "5 Eye Styles", difficulty: 3, xp: 50, minStarsToUnlock: 2,
        description: "Draw 5 different anime eye styles — from simple to detailed, male and female variations.",
        goal: "Each eye should look distinct in style while still being recognizable as an anime eye with iris, pupil, and highlight.",
        tips: ["Female eyes are typically rounder and larger", "Male eyes are narrower and less decorative", "The highlight is what makes anime eyes sparkle — don't skip it"],
        referenceUrl: "https://i.imgur.com/anime-eyes.jpg",
        referenceCaption: "Anime eye style variations",
      },
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
