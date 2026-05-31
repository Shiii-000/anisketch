export type Difficulty = 1 | 2 | 3;

export interface Challenge {
  id: string;
  stageId: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  xp: number;
  minStarsToUnlock: number;
  goal: string;
  tips: string[];
  referenceUrl: string;
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

  // ─────────────────────────────────────────
  // STAGE 1 — Lines & Control
  // ─────────────────────────────────────────
  {
    id: "stage1", title: "Lines & Control", emoji: "✏️",
    description: "Master confident, controlled lines — the foundation of everything.",
    unlockLevel: 0,
    challenges: [
      { id:"s1c1", stageId:"stage1", title:"Horizontal Lines", difficulty:1, xp:10, minStarsToUnlock:0,
        description:"Draw 20 straight horizontal lines across the page without a ruler. Focus on keeping them parallel and evenly spaced.",
        goal:"Lines should be straight, consistent in spacing, and drawn with a single confident stroke.",
        tips:["Draw from your shoulder, not your wrist","Move fast — slow lines wobble more","Keep your elbow off the table"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Parallel line exercise from Drawabox" },
      { id:"s1c2", stageId:"stage1", title:"Vertical Lines", difficulty:1, xp:10, minStarsToUnlock:2,
        description:"Draw 20 straight vertical lines without a ruler. Try to keep them perfectly upright.",
        goal:"Lines should be straight top to bottom, evenly spaced, and not slanted.",
        tips:["Rotate your paper if vertical lines feel awkward","Use your whole arm","Don't tilt your wrist"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Vertical line exercise" },
      { id:"s1c3", stageId:"stage1", title:"Diagonal Lines", difficulty:1, xp:10, minStarsToUnlock:2,
        description:"Draw 20 diagonal lines at a consistent 45° angle.",
        goal:"All lines should be at the same angle, straight, and evenly spaced.",
        tips:["Pick your angle and stick to it","Ghosting method: hover before committing","Use a light pencil mark as a guide"],
        referenceUrl:"https://drawabox.com/img/lesson1/exc.png", referenceCaption:"Diagonal line exercise from Drawabox" },
      { id:"s1c4", stageId:"stage1", title:"Dot to Dot", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Place 10 pairs of dots and connect each pair with a single straight line.",
        goal:"Each line should start and end precisely on its dot with no overshoot.",
        tips:["Look at the destination dot, not your pen","Ghost the motion 2-3 times first","Speed helps accuracy here"],
        referenceUrl:"https://drawabox.com/img/lesson1/ghosted-lines.png", referenceCaption:"Ghosted line method from Drawabox" },
      { id:"s1c5", stageId:"stage1", title:"Smooth Curves", difficulty:1, xp:10, minStarsToUnlock:2,
        description:"Draw 10 smooth flowing C-shaped curves without lifting your pen.",
        goal:"Each curve should be smooth with no bumps or direction changes mid-stroke.",
        tips:["Draw from the shoulder for large curves","Think of the full arc before you start","Go faster — slow curves get wobbly"],
        referenceUrl:"https://drawabox.com/img/lesson1/curved-lines.png", referenceCaption:"Curve exercise from Drawabox" },
      { id:"s1c6", stageId:"stage1", title:"Hatching", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Fill a 5x5 cm box with evenly spaced parallel lines to create a smooth grey value.",
        goal:"Lines should be evenly spaced, all going the same direction, creating a consistent grey tone.",
        tips:["Keep spacing consistent","Don't vary pressure","Aim for lines that never touch"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Clean hatching example" },
      { id:"s1c7", stageId:"stage1", title:"Crosshatching", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Fill a box with crosshatching — two layers at different angles — going from light to dark.",
        goal:"Should show a clear gradient using layered hatching.",
        tips:["Let the first layer dry before crossing","Vary spacing to control darkness","3+ layers create deep darks"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Crosshatching value example" },
      { id:"s1c8", stageId:"stage1", title:"Varying Pressure", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Draw 10 lines that start thin, get thick in the middle, then go thin again — in one stroke.",
        goal:"Lines should show a smooth thickness change from thin to thick and back in a single confident stroke.",
        tips:["Increase pressure gradually mid-stroke","Don't stop — keep moving","This builds expressive line quality"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Pressure variation exercise" },
      { id:"s1c9", stageId:"stage1", title:"Overlapping Lines", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Draw groups of 5-6 lines that all overlap at a single point, like a fan or starburst.",
        goal:"Lines should converge cleanly at one point without gaps or over-extension.",
        tips:["Mark the convergence point first","Each line should pass through or stop at that point","Great for perspective prep"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Converging lines exercise" },
    ],
  },

  // ─────────────────────────────────────────
  // STAGE 2 — Basic Shapes
  // ─────────────────────────────────────────
  {
    id: "stage2", title: "Basic Shapes", emoji: "⭕",
    description: "Everything in art starts with simple shapes. Learn to draw them cleanly.",
    unlockLevel: 2,
    challenges: [
      { id:"s2c1", stageId:"stage2", title:"Circles", difficulty:1, xp:10, minStarsToUnlock:0,
        description:"Draw 10 freehand circles of different sizes — as round as possible.",
        goal:"Circles should be closed, round, and not egg-shaped or pointy.",
        tips:["Use your whole arm for big circles","Draw fast — slow circles become polygons","Ghost the motion first"],
        referenceUrl:"https://drawabox.com/img/lesson1/ellipses-table.png", referenceCaption:"Circle practice from Drawabox" },
      { id:"s2c2", stageId:"stage2", title:"Ellipses", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Draw 10 ellipses at different angles — from nearly circular to very flat.",
        goal:"Ellipses should be smooth, symmetric, and clearly different proportions.",
        tips:["An ellipse has 2 axes — draw those first","The degree changes as viewpoint changes","Go over the stroke 2-3 times to smooth it"],
        referenceUrl:"https://drawabox.com/img/lesson1/ellipses-in-planes.png", referenceCaption:"Ellipses in different planes" },
      { id:"s2c3", stageId:"stage2", title:"Squares", difficulty:1, xp:10, minStarsToUnlock:2,
        description:"Draw 10 clean squares freehand — all sides equal, all corners 90°.",
        goal:"Squares should have straight sides of equal length and right-angle corners.",
        tips:["Use a dot for each corner before connecting","Draw lightly at first","Check by eye that sides look equal"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Square freehand practice" },
      { id:"s2c4", stageId:"stage2", title:"Rectangles", difficulty:1, xp:10, minStarsToUnlock:2,
        description:"Draw 5 rectangles of very different proportions — from square-ish to very long and thin.",
        goal:"Opposite sides should look equal and parallel, corners right angles.",
        tips:["Think about the ratio before drawing","Draw the long sides first","Mark corners before connecting"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Rectangle proportion practice" },
      { id:"s2c5", stageId:"stage2", title:"Organic Shapes", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Draw 10 irregular organic shapes — blobs, kidney shapes, amoeba forms. Make each one unique.",
        goal:"Shapes should have smooth flowing edges with no straight lines — completely organic.",
        tips:["Think of clouds, puddles, leaves","Vary the size dramatically","Organic shapes are the basis of natural forms"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Organic shape practice" },
      { id:"s2c6", stageId:"stage2", title:"Negative Space", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Draw the SPACE AROUND an object rather than the object itself. Try with a chair or hand.",
        goal:"The negative space drawing should be recognizable as the silhouette of the original object.",
        tips:["Look at what surrounds the object","Don't draw the object — draw the gaps","This rewires how your brain sees shapes"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Negative space exercise" },
      { id:"s2c7", stageId:"stage2", title:"Shape Object", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Draw a simple everyday object using ONLY basic shapes — no curves or details.",
        goal:"Object should be recognizable using only circles, rectangles and triangles.",
        tips:["Squint at the object — what shapes do you see?","Start with the biggest shape first","Overlap shapes to build form"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Breaking objects into basic shapes" },
      { id:"s2c8", stageId:"stage2", title:"Shape Face", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Draw a simple face using only basic shapes — circle for head, oval eyes, triangle nose, rectangle mouth.",
        goal:"Face should be recognizable with correct proportional placement using only geometric shapes.",
        tips:["Head is an oval/egg shape","Eyes sit at the middle of the head height","Keep it simple — resist adding curves"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Geometric face construction" },
    ],
  },

  // ─────────────────────────────────────────
  // STAGE 3 — Form & 3D
  // ─────────────────────────────────────────
  {
    id: "stage3", title: "Form & 3D", emoji: "📦",
    description: "Turn flat shapes into 3D forms. This is where drawing comes alive.",
    unlockLevel: 4,
    challenges: [
      { id:"s3c1", stageId:"stage3", title:"Cylinders", difficulty:2, xp:25, minStarsToUnlock:0,
        description:"Draw 10 cylinders from different angles — upright, on their side, and at an angle.",
        goal:"Each cylinder should have two ellipses connected by straight lines, with the far ellipse slightly smaller.",
        tips:["The top ellipse is flatter when viewed from the side","Both ellipses must be the same width","Vertical sides should be straight and parallel"],
        referenceUrl:"https://drawabox.com/img/lesson1/cylinders.png", referenceCaption:"Cylinder construction from Drawabox" },
      { id:"s3c2", stageId:"stage3", title:"Cubes", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Draw 10 cubes showing three visible faces — from different angles.",
        goal:"Should clearly show 3 faces with correct foreshortening.",
        tips:["Start with the front face as a slightly tilted square","Parallel lines converge toward vanishing points","The top face is a diamond/rhombus shape"],
        referenceUrl:"https://drawabox.com/img/lesson1/rotated-boxes.png", referenceCaption:"Rotated boxes from Drawabox" },
      { id:"s3c3", stageId:"stage3", title:"Spheres", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Draw 5 spheres that look round and 3D — add an equator line to show the form.",
        goal:"Spheres should look round with an equator ellipse showing orientation in space.",
        tips:["Draw the circle first, then the equator ellipse","The equator can tilt in any direction","Add a small shadow underneath to ground it"],
        referenceUrl:"https://drawabox.com/img/lesson1/sphere-construction.png", referenceCaption:"Sphere construction from Drawabox" },
      { id:"s3c4", stageId:"stage3", title:"Cones", difficulty:1, xp:10, minStarsToUnlock:2,
        description:"Draw 5 cones from different angles — upright, tipped, and lying on their side.",
        goal:"Each cone should have a base ellipse and a tip, with straight sides touching the ellipse edges.",
        tips:["The base is an ellipse, not a circle","The tip should be centered above the base","When tipped, the ellipse tilts with the cone"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Cone from different angles" },
      { id:"s3c5", stageId:"stage3", title:"Organic 3D Forms", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Draw 5 organic 3D forms — like a potato, a pebble, a cloud puff. Add contour lines to show the surface.",
        goal:"Forms should look 3D with contour lines following the surface like wrapping lines on a parcel.",
        tips:["Contour lines wrap around the form","Where lines bunch together = curves away from you","Start with the silhouette, add contours after"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Organic 3D form with contour lines" },
      { id:"s3c6", stageId:"stage3", title:"Object Breakdown", difficulty:3, xp:50, minStarsToUnlock:2,
        description:"Pick a real object and break it into basic 3D shapes. Draw the wireframe breakdown next to the object sketch.",
        goal:"Should show the same object twice — once as a sketch, once as transparent 3D shapes.",
        tips:["Good objects: bottle, lamp, kettle, cup","Draw shapes overlapping and transparent","Label each shape if helpful"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Object broken into 3D shapes" },
      { id:"s3c7", stageId:"stage3", title:"Shape Robot", difficulty:3, xp:50, minStarsToUnlock:2,
        description:"Design a simple robot character made entirely of 3D shapes — boxes, cylinders, spheres.",
        goal:"Robot should clearly show multiple 3D forms assembled together with visible overlapping.",
        tips:["Start with the torso (a big box)","Add limbs as cylinders","Use spheres for joints and head"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Robot built from basic 3D shapes" },
    ],
  },

  // ─────────────────────────────────────────
  // STAGE 4 — Gesture & Movement (NEW)
  // ─────────────────────────────────────────
  {
    id: "stage4", title: "Gesture & Movement", emoji: "🏃",
    description: "Capture the energy and movement of a pose in seconds. The secret weapon of every good artist.",
    unlockLevel: 5,
    challenges: [
      { id:"s4c1", stageId:"stage4", title:"Line of Action", difficulty:1, xp:10, minStarsToUnlock:0,
        description:"Draw 10 single curved lines that capture the feeling of movement — running, jumping, bending, twisting.",
        goal:"Each line should feel dynamic and directional — like a spine that communicates energy.",
        tips:["One line = the whole body's energy","The more curved, the more dynamic","Straight lines feel stiff — push the curve"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Line of action examples" },
      { id:"s4c2", stageId:"stage4", title:"30 Second Gestures", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Do 5 gesture drawings in 30 seconds each. Use reference from line-of-action.com or any pose reference.",
        goal:"Each sketch should capture the overall pose and movement — not details. Loose, fast, energetic.",
        tips:["Don't draw clothes or details — draw the energy","Start with the line of action","Use Line-of-Action.com for free pose references"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"30-second gesture sketches" },
      { id:"s4c3", stageId:"stage4", title:"2 Minute Gestures", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Do 5 gesture drawings in 2 minutes each. Add a little more structure than the 30-second version.",
        goal:"Should show recognizable figure with correct proportions and dynamic pose.",
        tips:["Use the extra time to refine proportions","The torso and hips are the key masses","Check: is the weight balanced?"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"2-minute gesture drawing" },
      { id:"s4c4", stageId:"stage4", title:"Stick Figures with Weight", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Draw 5 stick figures doing different actions — but make them feel heavy and grounded with weight and balance.",
        goal:"Stick figures should show clear weight shift, balance point, and dynamic action.",
        tips:["The center of gravity must be over the feet","Hips and shoulders tilt opposite each other","Action = weight shifted to one side"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Weighted stick figure poses" },
      { id:"s4c5", stageId:"stage4", title:"Animals in Motion", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Draw 3 quick gesture sketches of animals in motion — a running dog, jumping cat, flying bird.",
        goal:"Animals should look like they're moving, with clear directional energy in the sketch.",
        tips:["Animals have strong lines of action too","A running dog is almost a diagonal line","Focus on silhouette and direction, not anatomy"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Animal gesture drawings" },
      { id:"s4c6", stageId:"stage4", title:"Exaggerated Poses", difficulty:3, xp:50, minStarsToUnlock:2,
        description:"Draw 3 poses with extreme exaggeration — make the action 200% more dramatic than a natural pose.",
        goal:"Poses should feel theatrical and expressive, with exaggerated curves and angles.",
        tips:["Push every curve further than feels natural","Think superhero comic poses","Exaggeration = storytelling through the body"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Exaggerated gesture poses" },
    ],
  },

  // ─────────────────────────────────────────
  // STAGE 5 — Perspective
  // ─────────────────────────────────────────
  {
    id: "stage5", title: "Perspective", emoji: "📐",
    description: "Learn how to create depth and space in your drawings.",
    unlockLevel: 7,
    challenges: [
      { id:"s5c1", stageId:"stage5", title:"1-Point Box", difficulty:2, xp:25, minStarsToUnlock:0,
        description:"Draw a horizon line, mark one vanishing point, and draw 3 boxes receding toward it.",
        goal:"All receding lines must converge exactly to the vanishing point.",
        tips:["Use a ruler for the receding lines at first","Front faces stay flat — only depth lines converge","Objects below horizon show top, above show bottom"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"1-point perspective boxes" },
      { id:"s5c2", stageId:"stage5", title:"1-Point Street", difficulty:3, xp:50, minStarsToUnlock:2,
        description:"Draw a simple street or hallway receding into a single vanishing point.",
        goal:"Street lines, building tops, windows — everything converges to one point.",
        tips:["Start with the vanishing point and horizon","Draw the ground lines first","Add buildings as simple boxes after"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Simple street in 1-point perspective" },
      { id:"s5c3", stageId:"stage5", title:"2-Point Box", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Draw a horizon with two vanishing points. Draw 3 boxes using both points.",
        goal:"Left edges go to left VP, right edges to right VP. Vertical edges stay perfectly vertical.",
        tips:["Put VPs far apart — close VPs cause distortion","Only vertical lines stay straight","Check every line goes to one of the two VPs"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"2-point perspective boxes" },
      { id:"s5c4", stageId:"stage5", title:"2-Point Building", difficulty:3, xp:50, minStarsToUnlock:2,
        description:"Draw a simple building corner in 2-point perspective with windows and a door.",
        goal:"Building should look solid and 3D with windows/doors also correctly in perspective.",
        tips:["Draw the main box first before adding details","Windows are smaller rectangles following the same VPs","Add a ground shadow to make it feel planted"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Building in 2-point perspective" },
      { id:"s5c5", stageId:"stage5", title:"Room Interior", difficulty:3, xp:50, minStarsToUnlock:2,
        description:"Draw a simple room interior in 1-point perspective with floor, ceiling, walls, and 2 pieces of furniture.",
        goal:"Room should feel like a real 3D space with furniture correctly scaled and in perspective.",
        tips:["Start with the back wall as a rectangle","Draw vanishing lines from each corner","Furniture = boxes in perspective"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Room interior in 1-point perspective" },
      { id:"s5c6", stageId:"stage5", title:"Stairs", difficulty:3, xp:50, minStarsToUnlock:2,
        description:"Draw a staircase going up in 1-point or 2-point perspective.",
        goal:"Each step should be the same height and depth with correct perspective lines.",
        tips:["Each step is just a flat box stacked on the previous","Mark equal divisions on a vertical line first","Use 1-point if the stairs go straight away from you"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Stairs in perspective" },
      { id:"s5c7", stageId:"stage5", title:"City Block", difficulty:3, xp:50, minStarsToUnlock:2,
        description:"Draw a simple city block with at least 3 buildings of different heights in 2-point perspective.",
        goal:"All buildings should share the same vanishing points and feel like they exist in the same space.",
        tips:["All buildings share the SAME two VPs","Vary heights by changing the vertical line length","Add simple windows to sell the scale"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"City block in 2-point perspective" },
    ],
  },

  // ─────────────────────────────────────────
  // STAGE 6 — Composition (NEW)
  // ─────────────────────────────────────────
  {
    id: "stage6", title: "Composition", emoji: "🖼️",
    description: "Learn where to place things in your drawing to create balance, tension and story.",
    unlockLevel: 8,
    challenges: [
      { id:"s6c1", stageId:"stage6", title:"Rule of Thirds", difficulty:1, xp:10, minStarsToUnlock:0,
        description:"Draw a 3x3 grid on your page. Place your main subject at one of the 4 intersection points in 3 different thumbnail sketches.",
        goal:"Each thumbnail should have the main subject clearly placed on a rule-of-thirds intersection.",
        tips:["Never place the subject dead center","The intersections are the sweet spots","Try horizontal AND vertical compositions"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Rule of thirds composition" },
      { id:"s6c2", stageId:"stage6", title:"Thumbnail Studies", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Do 6 tiny thumbnail sketches (5x5 cm) of the same scene with different compositions. Pick the best one.",
        goal:"Should show 6 clearly different compositions of the same subject, with one circled as your favourite.",
        tips:["Thumbnails are fast — 1-2 min each","Vary: portrait vs landscape, close vs far","Mark which one feels most interesting"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Thumbnail composition studies" },
      { id:"s6c3", stageId:"stage6", title:"Leading Lines", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Draw a scene where lines in the environment guide the viewer's eye to the main subject.",
        goal:"There should be at least 2 clear lines in the scene that point toward or frame the focal point.",
        tips:["Roads, fences, rivers make great leading lines","The lines don't have to be straight","Converging lines feel more powerful"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Leading lines composition" },
      { id:"s6c4", stageId:"stage6", title:"Framing", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Draw a scene where the subject is framed by something in the foreground — a doorway, trees, window.",
        goal:"The subject should sit inside a natural frame created by foreground elements.",
        tips:["The frame doesn't need to be complete — partial framing works","Dark frames make bright subjects pop","Think: window, arch, tunnel, branches"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Natural framing composition" },
      { id:"s6c5", stageId:"stage6", title:"Foreground, Mid, Background", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Draw a landscape with clear separation into three layers: foreground, middle ground, and background.",
        goal:"Three distinct depth layers should be clearly visible with overlapping between them.",
        tips:["Foreground is darkest and most detailed","Background is lightest and least detailed","Overlapping creates depth automatically"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Three-plane depth composition" },
      { id:"s6c6", stageId:"stage6", title:"Visual Weight", difficulty:3, xp:50, minStarsToUnlock:2,
        description:"Draw two compositions of the same objects — one balanced, one intentionally unbalanced to create tension.",
        goal:"The balanced composition should feel calm, the unbalanced one should feel uneasy or dynamic.",
        tips:["Large dark shapes have more visual weight","Isolated objects feel heavier than grouped ones","Unbalance creates tension and drama"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Visual weight balance study" },
    ],
  },

  // ─────────────────────────────────────────
  // STAGE 7 — Light & Shadow
  // ─────────────────────────────────────────
  {
    id: "stage7", title: "Light & Shadow", emoji: "💡",
    description: "Understand light to make your drawings look real and dimensional.",
    unlockLevel: 10,
    challenges: [
      { id:"s7c1", stageId:"stage7", title:"Shade a Sphere", difficulty:2, xp:25, minStarsToUnlock:0,
        description:"Draw a sphere and shade it with one light source. Show highlight, midtone, core shadow, reflected light, and cast shadow.",
        goal:"Should clearly show all 5 zones of light on the sphere.",
        tips:["Core shadow is NOT the darkest — reflected light makes the edge lighter","Cast shadow is darkest near the object","Blend midtones smoothly"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"5 zones of light on a sphere" },
      { id:"s7c2", stageId:"stage7", title:"Shade a Cube", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Draw a cube and shade it with one light source — each face a clearly different value.",
        goal:"Three visible faces should each be a distinct value: light, mid, dark.",
        tips:["Decide where the light is BEFORE shading","The top face is usually lightest","Use flat consistent tones on each face"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Cube with three value faces" },
      { id:"s7c3", stageId:"stage7", title:"Shade a Cylinder", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Draw a cylinder and shade it with one light source. Show the gradual wrap of light around the form.",
        goal:"Should show a smooth gradient from highlight to core shadow with reflected light on the dark edge.",
        tips:["The highlight on a cylinder is a vertical stripe","Shade wraps around — blend gradually","Add reflected light last as a subtle lighter area"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Cylinder shading with light wrap" },
      { id:"s7c4", stageId:"stage7", title:"Cast Shadow", difficulty:3, xp:50, minStarsToUnlock:2,
        description:"Draw a box on a surface with a defined light source. Draw the correct cast shadow shape on the ground.",
        goal:"Cast shadow should correctly match the shape of the object and stretch away from the light source.",
        tips:["Draw rays from the light through each corner","Where rays hit the ground = shadow corners","Shadows are longer when light is low"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Cast shadow construction method" },
      { id:"s7c5", stageId:"stage7", title:"Greyscale Render", difficulty:3, xp:50, minStarsToUnlock:2,
        description:"Do a full greyscale render of a simple object using at least 5 distinct values.",
        goal:"Should show a full value range from near-white to near-black with smooth transitions.",
        tips:["Make a value scale first","Reference your scale while shading","Dark darks make lights look brighter"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Full greyscale render with value scale" },
      { id:"s7c6", stageId:"stage7", title:"Two Light Sources", difficulty:3, xp:50, minStarsToUnlock:3,
        description:"Shade an object lit by two different light sources — one strong key light and one weak fill light.",
        goal:"Should show two distinct light sides with different intensities and two cast shadows.",
        tips:["Key light is bright and casts sharp shadow","Fill light is soft and reduces shadow darkness","Where both lights hit = brightest highlight"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Object with two light sources" },
    ],
  },

  // ─────────────────────────────────────────
  // STAGE 8 — Value Studies (NEW)
  // ─────────────────────────────────────────
  {
    id: "stage8", title: "Value Studies", emoji: "🌑",
    description: "Master the full range of light and dark — the key to making anything look real.",
    unlockLevel: 11,
    challenges: [
      { id:"s8c1", stageId:"stage8", title:"Value Scale", difficulty:1, xp:10, minStarsToUnlock:0,
        description:"Draw a row of 9 boxes and fill them with values from pure white to pure black in even steps.",
        goal:"Each box should be a clearly different value with smooth, even tones inside each box.",
        tips:["Box 1 = white (no shading)","Box 9 = pure black","Boxes 2-8 are evenly spaced in between"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"9-step value scale" },
      { id:"s8c2", stageId:"stage8", title:"Flat Value Shapes", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Draw a simple scene (apple on a table) using only 3 flat values — white, grey, black. No blending.",
        goal:"Scene should be clearly readable using only 3 values with no gradients.",
        tips:["Squint at your reference to simplify values","Light = white, mid = grey, dark = black","This is how animators think about light"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"3-value flat composition" },
      { id:"s8c3", stageId:"stage8", title:"Value Notan", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Draw a simple scene using only 2 values — pure black and pure white. No grey at all.",
        goal:"The scene should be clearly readable with a strong graphic quality using only black and white.",
        tips:["Notan is about the relationship of dark and light shapes","Don't think 'objects' — think 'dark shapes vs light shapes'","Strong notans make strong compositions"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Black and white notan study" },
      { id:"s8c4", stageId:"stage8", title:"5-Value Portrait", difficulty:3, xp:50, minStarsToUnlock:2,
        description:"Do a simple portrait using exactly 5 values. Plan your values before you start shading.",
        goal:"Portrait should be recognizable with clearly separated value zones — no random shading.",
        tips:["Plan: decide which areas are each value before drawing","Forehead and chin are usually lightest","Under the nose and chin are usually darkest"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"5-value portrait study" },
      { id:"s8c5", stageId:"stage8", title:"Dramatic Lighting", difficulty:3, xp:50, minStarsToUnlock:2,
        description:"Draw a simple object or face lit from below (horror lighting) or from the side (Rembrandt lighting). Use strong contrast.",
        goal:"Lighting should be clearly dramatic — most of the subject either very light or very dark.",
        tips:["Under-lighting: light comes from below, shadows go up","Rembrandt: small triangle of light under one eye","High contrast = dramatic mood"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Dramatic lighting study" },
    ],
  },

  // ─────────────────────────────────────────
  // STAGE 9 — Texture & Detail
  // ─────────────────────────────────────────
  {
    id: "stage9", title: "Texture & Detail", emoji: "🖌️",
    description: "Give your drawings surface, feel and life through texture.",
    unlockLevel: 13,
    challenges: [
      { id:"s9c1", stageId:"stage9", title:"Smooth Surface", difficulty:2, xp:25, minStarsToUnlock:0,
        description:"Draw and render a smooth surface object (glass, ceramic, polished metal). Focus on clean gradients and sharp highlights.",
        goal:"Should show a clean gradient with a sharp, clearly defined highlight and no texture marks.",
        tips:["Smooth surfaces have sharp, bright highlights","Blend very smoothly","Reflections are visible on very smooth surfaces"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Smooth surface rendering" },
      { id:"s9c2", stageId:"stage9", title:"Rough Surface", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Draw and render a rough surface (rock, brick, tree bark). Use mark-making to create texture.",
        goal:"Surface should look clearly rough with visible texture marks that follow the form.",
        tips:["Rough surfaces have soft, scattered highlights","Use irregular marks — vary size and direction","Let some white paper show through"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Rough surface mark-making" },
      { id:"s9c3", stageId:"stage9", title:"Wood Grain", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Draw a piece of wood showing realistic grain lines and knots.",
        goal:"Wood grain lines should follow the shape of the wood, with at least one knot showing concentric rings.",
        tips:["Grain lines are never perfectly parallel","Knots = oval shapes with lines wrapping around them","Vary the line spacing — tighter = harder wood"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Wood grain texture study" },
      { id:"s9c4", stageId:"stage9", title:"Fabric Folds", difficulty:3, xp:50, minStarsToUnlock:2,
        description:"Draw a piece of fabric hanging or draped showing at least 5 realistic folds.",
        goal:"Folds should show clear light and shadow with peaks (highlights) and valleys (shadows).",
        tips:["Folds always pull toward anchor points","The peak catches light, the valley is dark","Start with anchor points, then draw where fabric falls"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Fabric fold types and shading" },
      { id:"s9c5", stageId:"stage9", title:"Hair Strands", difficulty:3, xp:50, minStarsToUnlock:2,
        description:"Draw a flowing section of hair — show individual strands, volume, and a light source.",
        goal:"Hair should look volumetric with a clear highlight area and strand lines that follow the flow.",
        tips:["Draw hair in clumps first, then add strand lines","Strand lines follow the flow direction","Leave white areas for the highlight"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Hair volume and strand rendering" },
      { id:"s9c6", stageId:"stage9", title:"Fur Texture", difficulty:3, xp:50, minStarsToUnlock:2,
        description:"Draw a patch of animal fur — showing direction, volume, and light catching the tips.",
        goal:"Fur should show clear direction of growth with lighter tips and darker base.",
        tips:["Draw the darkest area first, leave tips light","Short strokes at base, longer at the tips","Vary stroke length and direction slightly"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Fur texture technique" },
    ],
  },

  // ─────────────────────────────────────────
  // STAGE 10 — Anime Fundamentals
  // ─────────────────────────────────────────
  {
    id: "stage10", title: "Anime Fundamentals", emoji: "🎌",
    description: "You've mastered the basics. Now begin your anime journey.",
    unlockLevel: 16,
    challenges: [
      { id:"s10c1", stageId:"stage10", title:"Anime Head (Front)", difficulty:2, xp:25, minStarsToUnlock:0,
        description:"Draw an anime head from the front using the standard construction method — circle + jaw.",
        goal:"Head should use the classic anime egg shape with correct placement of eyes at mid-height.",
        tips:["Start with a circle, add the chin below","Eyes sit at the exact middle of the head","Anime chins are sharper than realistic"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Anime head front construction" },
      { id:"s10c2", stageId:"stage10", title:"Anime Head (3/4)", difficulty:3, xp:50, minStarsToUnlock:2,
        description:"Draw an anime head in 3/4 view — the most common angle in anime art.",
        goal:"Head should show clear foreshortening with the far eye slightly smaller.",
        tips:["The center line of the face curves around the head","The far eye is smaller and closer to center","The ear sits on the side — don't forget it"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Anime head 3/4 view" },
      { id:"s10c3", stageId:"stage10", title:"Anime Head (Side)", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Draw an anime head in side/profile view.",
        goal:"Profile should show the characteristic anime flat forehead, small nose, slightly protruding mouth.",
        tips:["The nose in anime profile is very small","The back of the head is rounder than you think","Mouth sits close to the nose, far from the chin"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Anime head side profile" },
      { id:"s10c4", stageId:"stage10", title:"Face Proportions", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Draw a face with construction guidelines showing where eyes, nose, mouth and ears are placed.",
        goal:"Should show the horizontal eye line at mid-height and correct vertical spacing of features.",
        tips:["Eyes: halfway down the head","Nose: halfway between eyes and chin","Mouth: one third between nose and chin"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Anime face proportion guidelines" },
      { id:"s10c5", stageId:"stage10", title:"5 Expressions", difficulty:3, xp:50, minStarsToUnlock:2,
        description:"Draw the same face with 5 different emotions: happy, sad, angry, surprised, neutral.",
        goal:"Each expression should be clearly different and readable.",
        tips:["Eyebrows are the #1 tool for expression","Happy: curved up eyes + U mouth","Angry: V-shaped brows + tight mouth"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Anime expression reference sheet" },
      { id:"s10c6", stageId:"stage10", title:"5 Eye Styles", difficulty:3, xp:50, minStarsToUnlock:2,
        description:"Draw 5 different anime eye styles — from simple to detailed, male and female variations.",
        goal:"Each eye should look distinct while still being recognizable as an anime eye.",
        tips:["Female eyes are typically rounder and larger","Male eyes are narrower","The highlight is what makes anime eyes sparkle"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Anime eye style variations" },
    ],
  },

  // ─────────────────────────────────────────
  // STAGE 11 — Anime Hair (NEW)
  // ─────────────────────────────────────────
  {
    id: "stage11", title: "Anime Hair", emoji: "💇",
    description: "Master the iconic flowing hair styles that define anime characters.",
    unlockLevel: 17,
    challenges: [
      { id:"s11c1", stageId:"stage11", title:"Hair Flow Lines", difficulty:1, xp:10, minStarsToUnlock:0,
        description:"Draw 10 flowing hair strand groups — each one a cluster of parallel curved lines that taper to a point.",
        goal:"Each strand group should taper from thick at the root to a point at the tip.",
        tips:["Hair strands always start from the scalp","Taper to a point at the end","Curves flow in one direction — no zigzags"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Basic hair strand flow" },
      { id:"s11c2", stageId:"stage11", title:"Short Anime Hair", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Draw a head with short anime hair — spiky or neat, your choice.",
        goal:"Hair should look like it's growing from the head, with volume and direction.",
        tips:["Draw the head first, then add hair on top","Short spiky hair points away from the head","Group spikes in clumps, not individual strands"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Short anime hair styles" },
      { id:"s11c3", stageId:"stage11", title:"Long Flowing Hair", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Draw a head with long flowing anime hair hanging down past the shoulders.",
        goal:"Hair should flow naturally with volume at the top and strand separations lower down.",
        tips:["Hair parts at the top and falls in sections","Add a highlight stripe on the top of the head","The ends should be slightly uneven — not a straight line"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Long flowing anime hair" },
      { id:"s11c4", stageId:"stage11", title:"Twintails & Ponytail", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Draw two hairstyles: a ponytail and twintails (two high pigtails).",
        goal:"Both styles should show the hair gathered and tied, with natural flow from the tie point.",
        tips:["Where hair is tied it gets narrow, then fans out below","Tied hair has a bump at the tie point","Twintails are wider at top and taper down"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Ponytail and twintails" },
      { id:"s11c5", stageId:"stage11", title:"Hair in Wind", difficulty:3, xp:50, minStarsToUnlock:2,
        description:"Draw a character's hair blowing in the wind — showing direction and movement.",
        goal:"Hair should look like it's all being pushed in one direction with natural strand separation.",
        tips:["All hair flows in the same wind direction","Some strands cross in front of the face","The roots stay attached — tips fly free"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Hair in wind motion" },
      { id:"s11c6", stageId:"stage11", title:"Hair Shading", difficulty:3, xp:50, minStarsToUnlock:2,
        description:"Draw a full head of anime hair with proper shading — show volume, highlight, and shadow.",
        goal:"Hair should have a clear highlight band, mid tones, and shadow areas that show volume.",
        tips:["Highlight: a curved stripe across the top","Mid tone: the main hair color","Shadow: where hair overlaps or near the neck"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Anime hair shading and highlights" },
    ],
  },

  // ─────────────────────────────────────────
  // STAGE 12 — Anime Body (NEW)
  // ─────────────────────────────────────────
  {
    id: "stage12", title: "Anime Body", emoji: "🧍",
    description: "Learn anime body proportions and how to construct a full character.",
    unlockLevel: 19,
    challenges: [
      { id:"s12c1", stageId:"stage12", title:"Chibi Proportions", difficulty:1, xp:10, minStarsToUnlock:0,
        description:"Draw a chibi character — 2-3 heads tall with a big head and small body.",
        goal:"Character should have correct chibi proportions: head is 1/2 to 1/3 of total height.",
        tips:["Head = huge, body = tiny","Arms and legs are short and stubby","Chibi hands are like little mittens"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Chibi body proportions" },
      { id:"s12c2", stageId:"stage12", title:"Standard Proportions", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Draw a full body figure at standard anime proportions — 7-8 heads tall.",
        goal:"Figure should be 7-8 head lengths tall with correct placement of shoulders, waist, hips, knees.",
        tips:["Crotch is at the halfway point of the body","Shoulders are 2 head-widths wide","Knees are 2 heads above the floor"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Anime body proportion chart" },
      { id:"s12c3", stageId:"stage12", title:"Standing Pose", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Draw a full body character in a relaxed natural standing pose.",
        goal:"Figure should look naturally balanced with weight evenly distributed.",
        tips:["Weight should feel balanced over the feet","Relax the shoulders — don't make them stiff","A slight hip shift makes it feel more natural"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Natural standing pose" },
      { id:"s12c4", stageId:"stage12", title:"Action Pose", difficulty:3, xp:50, minStarsToUnlock:2,
        description:"Draw a full body character in a dynamic action pose — running, jumping, attacking.",
        goal:"Pose should feel energetic and dynamic with a clear line of action.",
        tips:["Start with the line of action","Exaggerate for more impact","The non-active limbs counterbalance the action"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Dynamic action pose" },
      { id:"s12c5", stageId:"stage12", title:"Male vs Female", difficulty:3, xp:50, minStarsToUnlock:2,
        description:"Draw both a male and female anime figure side by side showing the key differences.",
        goal:"Both figures should clearly read as different genders through proportions and silhouette alone.",
        tips:["Female: wider hips, narrower shoulders, rounder features","Male: wider shoulders, narrower hips, sharper jaw","Hair and clothes aside — silhouette should tell the story"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Male vs female anime proportions" },
    ],
  },

  // ─────────────────────────────────────────
  // STAGE 13 — Hands & Feet (NEW)
  // ─────────────────────────────────────────
  {
    id: "stage13", title: "Hands & Feet", emoji: "✋",
    description: "The hardest parts of the body — but once you get them, everything clicks.",
    unlockLevel: 21,
    challenges: [
      { id:"s13c1", stageId:"stage13", title:"Hand Construction", difficulty:2, xp:25, minStarsToUnlock:0,
        description:"Draw 5 hands using the box construction method — palm as a flat box, fingers as cylinders.",
        goal:"Each hand should show a clearly constructed palm box with finger cylinders attached.",
        tips:["The palm is a slightly irregular flat box","Fingers attach to the top edge of the box","Thumb attaches to the side of the box"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Hand construction from basic shapes" },
      { id:"s13c2", stageId:"stage13", title:"Finger Poses", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Draw 5 different finger poses — open hand, fist, pointing, peace sign, grabbing.",
        goal:"Each pose should be clearly recognizable and show correct finger proportions.",
        tips:["Fingers have 3 segments — use 3 boxes","The middle finger is longest","When making a fist, fingers wrap over the thumb"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Common hand poses" },
      { id:"s13c3", stageId:"stage13", title:"Anime Hands", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Simplify your hand drawings into the anime style — less detail, smoother, slightly stylized.",
        goal:"Hands should look recognizably anime — smooth with simple finger outlines and minimal knuckle detail.",
        tips:["Anime hands are smoother than realistic ones","Reduce knuckle bumps to almost nothing","Female hands are thinner and more tapered"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Anime hand style" },
      { id:"s13c4", stageId:"stage13", title:"Feet & Shoes", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Draw 3 feet from different angles, then draw the same views with anime school shoes.",
        goal:"Feet should show correct wedge shape and the shoes should follow the foot form.",
        tips:["Foot is a wedge shape — thick at heel, thin at toes","The big toe side is higher than the little toe side","School shoes are boxy — don't make them too pointed"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Feet and anime shoes" },
      { id:"s13c5", stageId:"stage13", title:"Expressive Hands", difficulty:3, xp:50, minStarsToUnlock:2,
        description:"Draw 3 hands showing emotion — a gentle open hand reaching out, a tight angry fist, a trembling scared hand.",
        goal:"Each hand should communicate its emotion clearly through pose and line quality.",
        tips:["Gentle = open, relaxed fingers","Angry = tight fist with tension lines","Scared = slightly spread fingers with irregular trembling lines"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Expressive hand poses" },
    ],
  },

  // ─────────────────────────────────────────
  // STAGE 14 — Clothing & Folds (NEW)
  // ─────────────────────────────────────────
  {
    id: "stage14", title: "Clothing & Folds", emoji: "👘",
    description: "Dress your characters and make fabric look natural and alive.",
    unlockLevel: 23,
    challenges: [
      { id:"s14c1", stageId:"stage14", title:"Fold Types", difficulty:2, xp:25, minStarsToUnlock:0,
        description:"Draw the 6 main fold types: tube, half-lock, diaper, zipper, drop, and inert folds.",
        goal:"Each fold type should be clearly labeled and show the correct shape and shadow pattern.",
        tips:["Tube folds: fabric hanging from two points","Diaper fold: pulled from below between two anchor points","Inert folds: fabric lying flat with no tension"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"6 types of fabric folds" },
      { id:"s14c2", stageId:"stage14", title:"School Uniform", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Draw a classic Japanese school uniform (seifuku or gakuran) on a simple figure.",
        goal:"Uniform should look like fabric on a body — not a painted-on shape. Show at least 3 fold points.",
        tips:["Fabric pulls toward joints when the body moves","Shoulders, elbows, and waist create tension points","Collar and tie have their own structure"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"School uniform clothing folds" },
      { id:"s14c3", stageId:"stage14", title:"Flowing Skirt", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Draw a character with a flowing skirt — show how the fabric moves and wraps around the legs.",
        goal:"Skirt should have clear volume with folds radiating from the waistband.",
        tips:["Folds radiate from the waistband downward","The hem flares out — it's wider at the bottom","In motion, the hem trails behind the direction of movement"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Flowing skirt construction" },
      { id:"s14c4", stageId:"stage14", title:"Hoodie & Casual Wear", difficulty:2, xp:25, minStarsToUnlock:2,
        description:"Draw a character in a loose hoodie. Show how loose fabric creates different folds than tight clothing.",
        goal:"Hoodie should look visibly loose and baggy with large soft folds, contrasting with tight clothing.",
        tips:["Loose clothing hides the body shape underneath","The hood adds a large fabric mass at the back","Drawstrings create their own fold patterns"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Loose hoodie fabric folds" },
      { id:"s14c5", stageId:"stage14", title:"Clothing in Action", difficulty:3, xp:50, minStarsToUnlock:2,
        description:"Draw a character mid-action (running or jumping) — show how the clothing reacts to the movement.",
        goal:"Clothing should feel dynamic — trailing behind, pulling at joints, and flaring where appropriate.",
        tips:["Fabric trails behind the direction of movement","Joints create stretch and compression","Add speed lines to enhance the motion feel"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Dynamic clothing in motion" },
    ],
  },

  // ─────────────────────────────────────────
  // STAGE 15 — Full Character (NEW)
  // ─────────────────────────────────────────
  {
    id: "stage15", title: "Full Character", emoji: "👑",
    description: "Put everything together and create your first complete anime character.",
    unlockLevel: 25,
    challenges: [
      { id:"s15c1", stageId:"stage15", title:"Character Silhouette", difficulty:2, xp:25, minStarsToUnlock:0,
        description:"Design a character using only a black silhouette — no details, just the overall shape and hair.",
        goal:"Silhouette should be immediately readable and interesting — recognizable as a specific character type.",
        tips:["A good silhouette works even without details","Unique hair shapes are key in anime","Break the silhouette with interesting poses or accessories"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Character silhouette design" },
      { id:"s15c2", stageId:"stage15", title:"Front View Character", difficulty:3, xp:50, minStarsToUnlock:2,
        description:"Draw a full body character from the front — head, hair, face, body, clothing, hands, and feet.",
        goal:"Complete character should show all body parts with consistent proportions and a defined outfit.",
        tips:["Start with a stick figure skeleton","Build up the body mass around it","Add clothing last on top of the body shape"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Full body front view character" },
      { id:"s15c3", stageId:"stage15", title:"3/4 View Character", difficulty:3, xp:50, minStarsToUnlock:2,
        description:"Draw the same character in a 3/4 view — the most common presentation angle.",
        goal:"Character should look like the same person as the front view but correctly foreshortened in 3/4.",
        tips:["The center line of the face is now off-center","Near shoulder is wider than far shoulder","Near side of the body is slightly larger"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"3/4 view character sheet" },
      { id:"s15c4", stageId:"stage15", title:"Expression Sheet", difficulty:3, xp:50, minStarsToUnlock:2,
        description:"Draw your character's face in 6 expressions: happy, sad, angry, surprised, embarrassed, determined.",
        goal:"All 6 expressions should be clearly different and recognizable as the same character.",
        tips:["Keep the face shape consistent — only features change","Embarrassed: raised cheeks, averted eyes, wavy mouth","Determined: slightly lowered brows, firm mouth"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"6-expression character sheet" },
      { id:"s15c5", stageId:"stage15", title:"Action Scene", difficulty:3, xp:50, minStarsToUnlock:2,
        description:"Draw your character in a dynamic action pose with a simple background in perspective.",
        goal:"Scene should tell a story — who is this character and what are they doing?",
        tips:["The background should enhance the action, not compete with it","Use perspective lines to add depth","Character should be the focal point — simplify the background"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Character in action scene" },
      { id:"s15c6", stageId:"stage15", title:"Final OC Reveal", difficulty:3, xp:200, minStarsToUnlock:2,
        description:"Create a complete original character (OC) reference sheet: front view, 3/4 view, face close-up, and 3 expressions. This is your final boss.",
        goal:"A complete character sheet that another artist could use to draw your character consistently.",
        tips:["Take your time — this is your masterpiece","Make sure proportions are consistent across all views","Add a name and a brief character description"],
        referenceUrl:"https://drawabox.com/img/lesson1/exb.png", referenceCaption:"Complete OC reference sheet" },
    ],
  },
];

export function xpForLevel(level: number): number { return level * 100; }

export function levelFromXp(xp: number): number {
  let level = 1; let threshold = 100;
  while (xp >= threshold) { xp -= threshold; level++; threshold = level * 100; }
  return level;
}

export function xpIntoCurrentLevel(totalXp: number): number {
  let xp = totalXp; let level = 1; let threshold = 100;
  while (xp >= threshold) { xp -= threshold; level++; threshold = level * 100; }
  return xp;
}

export function xpForNextLevel(totalXp: number): number {
  return levelFromXp(totalXp) * 100;
}
