// =====================================================
// IRON 40 — exercise data + animated SVG figure rig
// =====================================================
// Poses are authored as positions (hip, hands, feet) plus a torso angle.
// Elbows and knees are solved with 2-bone IK, so feet stay planted while
// frames interpolate. Screen coords: x right (figure faces right), y down,
// ground at y=180. Torso angle t: -90 = upright, 180 = lying head-left.
// es/ks = elbow/knee bend side (+1 or -1) for the IK solver.

const BENCH_FLAT = `<rect x="50" y="130" width="122" height="8" rx="3" class="bench"/>
  <rect x="62" y="138" width="6" height="42" class="bench-leg"/><rect x="154" y="138" width="6" height="42" class="bench-leg"/>`;
const LYING = { hip: [150, 122], t: 180 };
const LYING_FEET = { fn: [180, 176], ff: [176, 176] };
const STAND = { hip: [120, 93], t: -90 };
const STAND_FEET = { fn: [124, 176], ff: [118, 176] };
// Push-up family: straight line from toes to shoulders, hands under the chest
const PUSH_FEET = { fn: [34, 176], ff: [30, 176] };
const PUSH_TOP = { hip: [108, 137], t: -27.7, hn: [156, 176], hf: [152, 176] };
const PUSH_BOTTOM = { hip: [115.1, 154.3], t: -15, hn: [156, 176], hf: [152, 176] }; // chest a fist above the floor
// Pull-up bar seen end-on, with an upright behind the body
const bar = (y) => ({ scene: `<line x1="126" y1="${y}" x2="126" y2="180" class="bench-pad" style="stroke-width:4;opacity:.6"/>
  <line x1="92" y1="${y}" x2="160" y2="${y}" class="bench-pad" style="stroke-width:5"/><circle cx="126" cy="${y}" r="4.5" class="hub"/>` });
const BAR_HIGH = bar(-24);
const BAR_TOP = bar(-46);
// Stretching props: an exercise mat on the floor, and a wall / door frame at x
const MAT = `<rect x="14" y="176" width="212" height="4" rx="2" class="bench"/>`;
const wall = (x) => `<rect x="${x}" y="-40" width="8" height="220" rx="2" class="bench"/>`;
// Machine props: a weight-stack tower at x (frame + plates), drawn behind the figure
const STACK = (x) => `<path d="M${x} 180V24H${x + 20}V180" class="frame"/>${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${x + 4}" y="${152 + i * 4.4}" width="12" height="3.6" rx="1" class="plate"/>`).join('')}<line x1="${x + 10}" y1="24" x2="${x + 10}" y2="152" class="cable"/>`;

const EXERCISES = [
  // ---------------- PUSH ----------------
  {
    id: 'db-bench', name: 'Dumbbell Bench Press', group: 'Push', equip: ['Dumbbell', 'Bench'],
    muscles: 'Chest, front shoulders, triceps',
    cues: ['Feet flat, shoulder blades squeezed together', 'Lower to mid-chest, elbows ~45° from your sides', 'Press up and slightly back over your shoulders'],
    mistake: 'Flaring elbows straight out to 90° — hard on aging shoulders.',
    tip40: 'Use a neutral (palms-facing) grip if your shoulders ache. Dumbbells let each arm find its own path.',
    easier: 'Push-up on a bench', harder: 'Barbell bench press',
    prop: 'db', es: -1, mus: { p: ['chest'], s: ['delts', 'triceps'] }, scene: BENCH_FLAT, ...LYING_FEET,
    frames: [{ ...LYING, hn: [100, 58] }, { ...LYING, hn: [106, 104] }],
    tempo: [{ label: 'Lower', dur: 2 }, { label: 'Press', dur: 1 }],
  },
  {
    id: 'incline-db', name: 'Incline Dumbbell Press', group: 'Push', equip: ['Dumbbell', 'Bench'],
    muscles: 'Upper chest, front shoulders, triceps',
    cues: ['Bench at 30–45°, back flat on the pad', 'Lower to upper chest with control', 'Press straight up, don’t clank the bells'],
    mistake: 'Setting the bench too steep — it turns into a shoulder press.',
    tip40: 'A lower incline (30°) is easier on the shoulder joint and still builds the upper chest.',
    easier: 'Flat dumbbell press', harder: 'Incline barbell press',
    prop: 'db', es: -1, mus: { p: ['chest', 'delts'], s: ['triceps'] }, fn: [178, 176], ff: [174, 176],
    scene: `<rect x="118" y="132" width="52" height="8" rx="3" class="bench"/>
      <line x1="144" y1="138" x2="86" y2="90" class="bench-pad"/>
      <rect x="140" y="140" width="6" height="40" class="bench-leg"/><rect x="96" y="104" width="6" height="76" class="bench-leg"/>`,
    frames: [{ hip: [138, 126], t: -140, hn: [100, 28] }, { hip: [138, 126], t: -140, hn: [104, 82] }],
    tempo: [{ label: 'Lower', dur: 2 }, { label: 'Press', dur: 1 }],
  },
  {
    id: 'bb-ohp', name: 'Barbell Overhead Press', group: 'Push', equip: ['Barbell'],
    muscles: 'Shoulders, triceps, upper back, core',
    cues: ['Squeeze glutes and brace your abs', 'Bar starts at collarbone, move your head back slightly', 'Press up and push your head “through the window” at the top'],
    mistake: 'Leaning way back and turning it into a standing incline press.',
    tip40: 'If overhead hurts, use a slightly wider grip or switch to the seated dumbbell version.',
    easier: 'Seated dumbbell shoulder press', harder: 'Push press',
    prop: 'bb', es: -1, mus: { p: ['delts'], s: ['triceps', 'abs'] }, ...STAND_FEET,
    frames: [{ ...STAND, hn: [131, 34] }, { ...STAND, hn: [124, -18] }],
    tempo: [{ label: 'Press', dur: 1 }, { label: 'Lower', dur: 2 }],
  },
  {
    id: 'db-shoulder', name: 'Seated Dumbbell Shoulder Press', group: 'Push', equip: ['Dumbbell', 'Bench'],
    muscles: 'Shoulders, triceps',
    cues: ['Back against an upright bench', 'Start with dumbbells at ear height', 'Press up until arms are nearly straight'],
    mistake: 'Arching the low back off the pad to push more weight.',
    tip40: 'Palms facing each other (neutral) and elbows slightly forward protects the rotator cuff.',
    easier: 'Single-arm press', harder: 'Barbell overhead press',
    prop: 'db', es: -1, mus: { p: ['delts'], s: ['triceps'] }, fn: [150, 176], ff: [146, 176],
    scene: `<rect x="80" y="134" width="62" height="8" rx="3" class="bench"/>
      <line x1="94" y1="134" x2="94" y2="62" class="bench-pad"/>
      <rect x="86" y="142" width="6" height="38" class="bench-leg"/><rect x="132" y="142" width="6" height="38" class="bench-leg"/>`,
    frames: [{ hip: [104, 126], t: -90, hn: [112, 68] }, { hip: [104, 126], t: -90, hn: [108, 12] }],
    tempo: [{ label: 'Press', dur: 1 }, { label: 'Lower', dur: 2 }],
  },
  // ---------------- PULL ----------------
  {
    id: 'db-row', name: 'One-Arm Dumbbell Row', group: 'Pull', equip: ['Dumbbell', 'Bench'],
    muscles: 'Lats, mid-back, rear shoulders, biceps',
    cues: ['Free hand on the bench, back flat', 'Pull the dumbbell toward your hip pocket', 'Lower all the way until you feel a stretch'],
    mistake: 'Twisting the torso open to heave the weight up.',
    tip40: 'The bench support takes load off your low back — the safest heavy row there is.',
    easier: 'Chest-supported row', harder: 'Barbell bent-over row',
    prop: 'db1', es: -1, esf: 1, mus: { p: ['back'], s: ['biceps', 'delts'] }, fn: [118, 176], ff: [86, 176],
    scene: `<rect x="150" y="148" width="72" height="8" rx="3" class="bench"/>
      <rect x="158" y="156" width="6" height="24" class="bench-leg"/><rect x="208" y="156" width="6" height="24" class="bench-leg"/>`,
    frames: [{ hip: [100, 100], t: -8, hn: [152, 154], hf: [168, 146] }, { hip: [100, 100], t: -8, hn: [128, 118], hf: [168, 146] }],
    tempo: [{ label: 'Row', dur: 1 }, { label: 'Lower', dur: 2 }],
  },
  {
    id: 'bb-row', name: 'Barbell Bent-Over Row', group: 'Pull', equip: ['Barbell'],
    muscles: 'Lats, mid-back, rear shoulders, biceps, hamstrings',
    cues: ['Hinge until torso is ~45°, knees soft', 'Pull the bar to your belly button', 'Keep your back flat the whole set'],
    mistake: 'Standing up more each rep and using momentum.',
    tip40: 'Brace hard and keep the hinge moderate. If your low back tires first, use the chest-supported row.',
    easier: 'One-arm dumbbell row', harder: 'Pendlay row',
    prop: 'bb', es: -1, mus: { p: ['back'], s: ['biceps', 'hams', 'lowback'] }, ...STAND_FEET,
    frames: [{ hip: [96, 98], t: -25, hn: [146, 136] }, { hip: [96, 98], t: -25, hn: [126, 104] }],
    tempo: [{ label: 'Row', dur: 1 }, { label: 'Lower', dur: 2 }],
  },
  {
    id: 'cs-row', name: 'Chest-Supported Dumbbell Row', group: 'Pull', equip: ['Dumbbell', 'Bench'],
    muscles: 'Upper back, lats, rear shoulders',
    cues: ['Lie chest-down on an incline bench', 'Let the dumbbells hang straight down', 'Row elbows back and squeeze shoulder blades'],
    mistake: 'Lifting your chest off the pad to cheat the weight up.',
    tip40: 'Zero low-back stress — ideal on days your back feels stiff.',
    easier: 'Lighter dumbbells, pause at top', harder: 'One-arm dumbbell row',
    prop: 'db', es: -1, mus: { p: ['back'], s: ['biceps', 'delts'] }, fn: [30, 176], ff: [26, 176],
    scene: `<line x1="82" y1="118" x2="134" y2="82" class="bench-pad"/>
      <rect x="90" y="114" width="6" height="66" class="bench-leg"/><rect x="120" y="96" width="6" height="84" class="bench-leg"/>`,
    frames: [{ hip: [80, 108], t: -35, hn: [124, 140] }, { hip: [80, 108], t: -35, hn: [110, 104] }],
    tempo: [{ label: 'Row', dur: 1 }, { label: 'Lower', dur: 2 }],
  },
  {
    id: 'db-pullover', name: 'Dumbbell Pullover', group: 'Pull', equip: ['Dumbbell', 'Bench'],
    muscles: 'Lats, chest, serratus',
    cues: ['Hold one dumbbell over your chest with both hands', 'Lower it back behind your head with a slight elbow bend', 'Pull it back over your chest'],
    mistake: 'Going too deep — stop when you feel a good stretch.',
    tip40: 'Keep the range comfortable. Stop short of any pinch in the front of the shoulder.',
    easier: 'Lighter dumbbell, shorter range', harder: 'Slow 3-second lowering',
    prop: 'dbg', es: -1, mus: { p: ['back', 'chest'], s: ['triceps'] }, scene: BENCH_FLAT, ...LYING_FEET,
    frames: [{ ...LYING, hn: [100, 60] }, { ...LYING, hn: [40, 112] }],
    tempo: [{ label: 'Lower back', dur: 2 }, { label: 'Pull over', dur: 1.5 }],
  },
  // ---------------- LEGS ----------------
  {
    id: 'goblet-squat', name: 'Goblet Squat', group: 'Legs', equip: ['Dumbbell'],
    muscles: 'Quads, glutes, core',
    cues: ['Hold one dumbbell at your chest', 'Sit down between your heels, chest up', 'Drive through mid-foot to stand'],
    mistake: 'Heels lifting or knees caving in.',
    tip40: 'The front weight keeps you upright — the most knee- and back-friendly squat to learn.',
    easier: 'Squat to a bench', harder: 'Barbell back squat',
    prop: 'dbg', es: -1, mus: { p: ['quads', 'glutes'], s: ['abs'] }, ...STAND_FEET,
    frames: [{ ...STAND, hn: [137, 50] }, { hip: [96, 138], t: -60, hn: [141, 100] }],
    tempo: [{ label: 'Sit down', dur: 2 }, { label: 'Stand', dur: 1 }],
  },
  {
    id: 'back-squat', name: 'Barbell Back Squat', group: 'Legs', equip: ['Barbell'],
    muscles: 'Quads, glutes, adductors, core',
    cues: ['Bar on upper back, not your neck', 'Big breath, brace, then sit back and down', 'Squat to a box or bench for a consistent depth'],
    mistake: 'Chasing depth your hips can’t control (lower back rounds).',
    tip40: 'Box squats to parallel give you a safe, repeatable depth every rep.',
    easier: 'Goblet squat', harder: 'Pause squat',
    prop: 'bb', es: 1, mus: { p: ['quads', 'glutes'], s: ['lowback', 'hams'] }, ...STAND_FEET,
    frames: [{ ...STAND, hn: [110, 33] }, { hip: [90, 136], t: -50, hn: [122, 85] }],
    tempo: [{ label: 'Sit down', dur: 2 }, { label: 'Stand', dur: 1 }],
  },
  {
    id: 'db-rdl', name: 'Dumbbell Romanian Deadlift', group: 'Legs', equip: ['Dumbbell'],
    muscles: 'Hamstrings, glutes, lower back',
    cues: ['Soft knees, push your hips back', 'Dumbbells slide down your thighs', 'Stop at mid-shin, squeeze glutes to stand'],
    mistake: 'Rounding the back to reach lower.',
    tip40: 'Strong hamstrings and glutes protect your lower back — this is a must-do after 40.',
    easier: 'Hip hinge with no weight', harder: 'Barbell RDL',
    prop: 'db', es: 1, mus: { p: ['hams', 'glutes'], s: ['lowback', 'forearms'] }, ...STAND_FEET,
    frames: [{ ...STAND, hn: [120, 103] }, { hip: [94, 102], t: -14, hn: [145, 150] }],
    tempo: [{ label: 'Hinge', dur: 2 }, { label: 'Stand', dur: 1 }],
  },
  {
    id: 'bb-rdl', name: 'Barbell Romanian Deadlift', group: 'Legs', equip: ['Barbell'],
    muscles: 'Hamstrings, glutes, lower back, grip',
    cues: ['Start standing with the bar at your hips', 'Push hips back, bar stays touching your legs', 'Feel the hamstring stretch, then drive hips forward'],
    mistake: 'Letting the bar drift away from your legs.',
    tip40: 'Stop where your back starts to round — for most of us that’s just below the knee.',
    easier: 'Dumbbell RDL', harder: 'Single-leg RDL',
    prop: 'bb', es: 1, mus: { p: ['hams', 'glutes'], s: ['lowback', 'forearms'] }, ...STAND_FEET,
    frames: [{ ...STAND, hn: [122, 103] }, { hip: [94, 102], t: -14, hn: [143, 150] }],
    tempo: [{ label: 'Hinge', dur: 2 }, { label: 'Stand', dur: 1 }],
  },
  {
    id: 'split-squat', name: 'Dumbbell Split Squat', group: 'Legs', equip: ['Dumbbell'],
    muscles: 'Quads, glutes, balance',
    cues: ['Long stance, back heel up', 'Drop the back knee straight down', 'Push through the front foot'],
    mistake: 'Short stance that drives the front knee way past the toes.',
    tip40: 'Hold something for balance if needed — single-leg work fixes left/right imbalances.',
    easier: 'Bodyweight split squat', harder: 'Rear-foot-elevated split squat',
    prop: 'db', es: 1, mus: { p: ['quads', 'glutes'], s: ['hams', 'calves'] }, fn: [142, 176], ff: [80, 170],
    frames: [{ hip: [114, 94], t: -90, hn: [116, 104] }, { hip: [110, 132], t: -88, hn: [112, 142] }],
    tempo: [{ label: 'Lower', dur: 2 }, { label: 'Drive up', dur: 1 }],
  },
  {
    id: 'hip-thrust', name: 'Barbell Hip Thrust', group: 'Legs', equip: ['Barbell', 'Bench'],
    muscles: 'Glutes, hamstrings',
    cues: ['Upper back on the bench edge, bar over hips (use a pad)', 'Chin tucked, drive hips up', 'Squeeze glutes hard for one second at the top'],
    mistake: 'Over-arching the lower back at the top instead of squeezing glutes.',
    tip40: 'Builds big glute strength with almost no spine compression.',
    easier: 'Glute bridge on the floor', harder: 'Single-leg hip thrust',
    prop: 'bbHip', es: 1, mus: { p: ['glutes'], s: ['hams'] }, fn: [178, 176], ff: [174, 176],
    scene: `<rect x="20" y="128" width="74" height="8" rx="3" class="bench"/>
      <rect x="28" y="136" width="6" height="44" class="bench-leg"/><rect x="80" y="136" width="6" height="44" class="bench-leg"/>`,
    frames: [{ hip: [128, 164], t: 223.5, hn: [126, 152] }, { hip: [140, 132], t: 191, hn: [140, 120] }],
    tempo: [{ label: 'Drive up', dur: 1 }, { label: 'Lower', dur: 2 }],
  },
  // ---------------- ARMS & CORE ----------------
  {
    id: 'db-curl', name: 'Dumbbell Curl', group: 'Arms & Core', equip: ['Dumbbell'],
    muscles: 'Biceps, forearms',
    cues: ['Elbows pinned to your sides', 'Curl up, turning palms up', 'Lower slowly all the way'],
    mistake: 'Swinging the body to move the weight.',
    tip40: 'Hammer curls (palms facing in) are gentler on the elbows if they get cranky.',
    easier: 'Hammer curl', harder: 'Incline curl',
    prop: 'db', es: -1, mus: { p: ['biceps'], s: ['forearms'] }, ...STAND_FEET,
    frames: [{ ...STAND, hn: [126, 100] }, { ...STAND, hn: [140, 46] }],
    tempo: [{ label: 'Curl', dur: 1 }, { label: 'Lower', dur: 2 }],
  },
  {
    id: 'skull-crusher', name: 'Dumbbell Skull Crusher', group: 'Arms & Core', equip: ['Dumbbell', 'Bench'],
    muscles: 'Triceps',
    cues: ['Arms straight up over your shoulders', 'Bend only at the elbows, lowering beside your head', 'Extend back up'],
    mistake: 'Letting elbows flare wide and drift.',
    tip40: 'Dumbbells with palms facing in are much easier on the elbows than an EZ bar.',
    easier: 'Cable/band pushdown', harder: 'Close-grip bench press',
    prop: 'db', es: -1, mus: { p: ['triceps'], s: [] }, scene: BENCH_FLAT, ...LYING_FEET,
    frames: [{ ...LYING, hn: [100, 58] }, { ...LYING, hn: [70, 96] }],
    tempo: [{ label: 'Lower', dur: 2 }, { label: 'Extend', dur: 1 }],
  },
  {
    id: 'farmer-carry', name: 'Farmer Carry', group: 'Arms & Core', equip: ['Dumbbell'],
    muscles: 'Grip, traps, core, whole body',
    cues: ['Heavy dumbbells at your sides', 'Stand tall, shoulders back and down', 'Walk with short, controlled steps'],
    mistake: 'Leaning or shrugging — stay tall and level.',
    tip40: 'Grip strength is one of the best predictors of healthy aging. Carry heavy things.',
    easier: 'Lighter weight, shorter walk', harder: 'Suitcase carry (one side)',
    prop: 'db', es: 1, mus: { p: ['forearms'], s: ['back', 'abs', 'calves'] }, timed: true,
    frames: [
      { hip: [120, 96], t: -90, hn: [121, 104], hf: [117, 104], fn: [140, 176], ff: [100, 176] },
      { hip: [120, 92], t: -90, hn: [121, 100], hf: [117, 100], fn: [120, 176], ff: [120, 160] },
      { hip: [120, 96], t: -90, hn: [121, 104], hf: [117, 104], fn: [100, 176], ff: [140, 176] },
      { hip: [120, 92], t: -90, hn: [121, 100], hf: [117, 100], fn: [120, 160], ff: [120, 176] },
    ],
    tempo: [{ label: 'Walk tall', dur: 0.4 }, { label: 'Walk tall', dur: 0.4 }, { label: 'Walk tall', dur: 0.4 }, { label: 'Walk tall', dur: 0.4 }],
  },
  // ---------------- CALISTHENICS (bodyweight) ----------------
  {
    id: 'push-up', name: 'Push-Up', group: 'Push', equip: ['Bodyweight'], bw: true,
    muscles: 'Chest, front shoulders, triceps, core',
    cues: ['Hands just outside shoulder width, body in one straight line', 'Lower until your chest is a fist from the floor', 'Push the floor away and finish with straight arms'],
    mistake: 'Hips sagging or piking — squeeze glutes and brace like a plank.',
    tip40: 'Wrists complain? Grip a pair of hex dumbbells or push-up handles to keep them straight.',
    easier: 'Incline push-up', harder: 'Decline push-up',
    prop: null, es: 1, mus: { p: ['chest'], s: ['triceps', 'delts', 'abs'] }, ...PUSH_FEET,
    frames: [PUSH_TOP, PUSH_BOTTOM],
    tempo: [{ label: 'Lower', dur: 2 }, { label: 'Push', dur: 1 }],
  },
  {
    id: 'incline-pushup', name: 'Incline Push-Up', group: 'Push', equip: ['Bodyweight', 'Bench'], bw: true,
    muscles: 'Chest, front shoulders, triceps',
    cues: ['Hands on the edge of a bench or counter', 'Walk your feet back until your body is straight', 'Touch your chest to the edge, then press away'],
    mistake: 'Letting the head drop toward the bench first.',
    tip40: 'The higher the surface, the easier it is — the perfect way to build up to floor push-ups.',
    easier: 'Wall push-up', harder: 'Push-up',
    prop: null, es: 1, mus: { p: ['chest'], s: ['triceps', 'delts'] }, fn: [76, 176], ff: [72, 176],
    scene: `<rect x="172" y="132" width="56" height="8" rx="3" class="bench"/>
      <rect x="180" y="140" width="6" height="40" class="bench-leg"/><rect x="214" y="140" width="6" height="40" class="bench-leg"/>`,
    frames: [{ hip: [129, 111], t: -50, hn: [178, 130], hf: [174, 130] }, { hip: [146, 135], t: -30, hn: [178, 130], hf: [174, 130] }],
    tempo: [{ label: 'Lower', dur: 2 }, { label: 'Push', dur: 1 }],
  },
  {
    id: 'decline-pushup', name: 'Decline Push-Up', group: 'Push', equip: ['Bodyweight', 'Bench'], bw: true,
    muscles: 'Upper chest, front shoulders, triceps',
    cues: ['Feet up on a bench, hands on the floor', 'Keep a straight line from heels to head', 'Lower your upper chest toward the floor'],
    mistake: 'Hips pushed high into a pike — that turns it into a shoulder press.',
    tip40: 'Start with a low step or box. Raise the height only once you own 12 clean reps.',
    easier: 'Push-up', harder: 'Feet higher, or a slow 3-second lower',
    prop: null, es: 1, mus: { p: ['chest', 'delts'], s: ['triceps', 'abs'] }, fn: [30, 130], ff: [26, 130],
    scene: `<rect x="0" y="134" width="60" height="8" rx="3" class="bench"/>
      <rect x="8" y="142" width="6" height="38" class="bench-leg"/><rect x="46" y="142" width="6" height="38" class="bench-leg"/>`,
    frames: [{ hip: [113, 119], t: -7.5, hn: [172, 176], hf: [168, 176] }, { hip: [113, 142], t: 8.3, hn: [172, 176], hf: [168, 176] }],
    tempo: [{ label: 'Lower', dur: 2 }, { label: 'Push', dur: 1 }],
  },
  {
    id: 'diamond-pushup', name: 'Close-Grip Push-Up', group: 'Arms & Core', equip: ['Bodyweight'], bw: true,
    muscles: 'Triceps, chest, front shoulders',
    cues: ['Hands under your chest, about a hand-width apart', 'Elbows brush your ribs on the way down', 'Lock out by squeezing your triceps'],
    mistake: 'Elbows flaring wide — it stops being a triceps exercise.',
    tip40: 'Skip the full diamond if your wrists or elbows ache; a narrow grip works the triceps just as well.',
    easier: 'Close-grip incline push-up', harder: 'Slow 3-second lower',
    prop: null, es: 1, mus: { p: ['triceps'], s: ['chest', 'delts'] }, ...PUSH_FEET,
    frames: [PUSH_TOP, PUSH_BOTTOM],
    tempo: [{ label: 'Lower', dur: 2 }, { label: 'Push', dur: 1 }],
  },
  {
    id: 'pike-pushup', name: 'Pike Push-Up', group: 'Push', equip: ['Bodyweight'], bw: true,
    muscles: 'Shoulders, triceps, upper chest',
    cues: ['Hips high in an upside-down V', 'Bend the elbows and lower the top of your head toward the floor', 'Press back up through your shoulders'],
    mistake: 'Elbows flaring straight out to the sides.',
    tip40: 'Go only as deep as feels smooth — this is the bodyweight overhead press, and shoulders set the limit.',
    easier: 'Hands on a bench (incline pike)', harder: 'Feet on a bench (decline pike)',
    prop: null, es: 1, mus: { p: ['delts'], s: ['triceps', 'chest'] }, fn: [86, 176], ff: [82, 176],
    frames: [{ hip: [103, 93], t: 30, hn: [152, 176], hf: [148, 176] }, { hip: [104, 104], t: 46, hn: [152, 176], hf: [148, 176] }],
    tempo: [{ label: 'Lower', dur: 2 }, { label: 'Press', dur: 1 }],
  },
  {
    id: 'pull-up', name: 'Pull-Up', group: 'Pull', equip: ['Bodyweight', 'Pull-up bar'], bw: true,
    muscles: 'Lats, upper back, biceps, grip',
    cues: ['Palms facing away, hands just outside your shoulders', 'Pull your elbows down to your ribs until your chin clears the bar', 'Lower all the way to straight arms'],
    mistake: 'Kicking and half reps — control every inch.',
    tip40: 'Can’t do one yet? Jump to the top and lower for 5 slow seconds. Those negatives build the strength fast.',
    easier: 'Band-assisted pull-up or slow negatives', harder: 'Weighted pull-up',
    prop: null, es: 1, mus: { p: ['back'], s: ['biceps', 'forearms'] }, fn: [100, 148], ff: [96, 150], ...BAR_HIGH,
    frames: [
      { hip: [129, 94], t: -95, hn: [126, -24], hf: [122, -24], fn: [118, 170], ff: [113, 171] },
      { hip: [129, 46], t: -95, hn: [126, -24], hf: [122, -24], fn: [116, 122], ff: [111, 123] },
    ],
    tempo: [{ label: 'Pull', dur: 1 }, { label: 'Lower', dur: 2 }],
  },
  {
    id: 'chin-up', name: 'Chin-Up', group: 'Pull', equip: ['Bodyweight', 'Pull-up bar'], bw: true,
    muscles: 'Biceps, lats, upper back',
    cues: ['Palms facing you, shoulder-width grip', 'Drive your elbows down and chest toward the bar', 'Lower slowly to a full hang'],
    mistake: 'Craning the neck to get the chin over.',
    tip40: 'Elbows cranky? A neutral grip (palms facing each other) is the friendliest option.',
    easier: 'Slow negatives or band-assisted', harder: 'Pause at the top for 2 seconds',
    prop: null, es: 1, mus: { p: ['biceps', 'back'], s: ['forearms'] }, fn: [100, 148], ff: [96, 150], ...BAR_HIGH,
    frames: [
      { hip: [129, 94], t: -95, hn: [126, -24], hf: [122, -24], fn: [118, 170], ff: [113, 171] },
      { hip: [129, 46], t: -95, hn: [126, -24], hf: [122, -24], fn: [116, 122], ff: [111, 123] },
    ],
    tempo: [{ label: 'Pull', dur: 1 }, { label: 'Lower', dur: 2 }],
  },
  {
    id: 'inverted-row', name: 'Inverted Row', group: 'Pull', equip: ['Bodyweight', 'Low bar'], bw: true,
    muscles: 'Upper back, lats, rear shoulders, biceps',
    cues: ['Hang under a waist-high bar (or rings, or a sturdy table)', 'Heels down, body straight like a plank', 'Pull your chest to the bar, then lower with control'],
    mistake: 'Hips dropping so only the arms move.',
    tip40: 'The more upright you stand, the easier it gets — a back exercise you can adjust to any level.',
    easier: 'Bend your knees or raise the bar', harder: 'Feet up on a bench',
    prop: null, es: 1, mus: { p: ['back'], s: ['biceps', 'delts'] }, fn: [190, 176], ff: [186, 176],
    scene: `<line x1="76" y1="100" x2="76" y2="180" class="bench-pad" style="stroke-width:4"/><circle cx="76" cy="100" r="4.5" class="hub"/>`,
    frames: [{ hip: [107, 166], t: 186.7, hn: [76, 100], hf: [72, 100] }, { hip: [116, 136], t: 208.6, hn: [76, 100], hf: [72, 100] }],
    tempo: [{ label: 'Row', dur: 1 }, { label: 'Lower', dur: 2 }],
  },
  {
    id: 'superman', name: 'Superman', group: 'Pull', equip: ['Bodyweight'], bw: true,
    muscles: 'Lower back, glutes, upper back',
    cues: ['Lie face down, arms reaching forward', 'Lift chest, arms and legs a few inches together', 'Hold for a breath, then lower slowly'],
    mistake: 'Cranking the head up — keep your eyes on the floor.',
    tip40: 'A strong lower back is cheap insurance. Small lifts held well beat big swinging ones.',
    easier: 'Lift arms only, then legs only', harder: 'Hold each rep for 3 seconds',
    prop: null, es: 1, mus: { p: ['lowback', 'glutes'], s: ['back', 'hams'] }, fn: [16, 174], ff: [12, 174],
    frames: [
      { hip: [100, 164], t: 0, hn: [214, 172], hf: [210, 172], fn: [16, 174], ff: [12, 174] },
      { hip: [100, 164], t: -12, hn: [212, 140], hf: [208, 140], fn: [20, 158], ff: [16, 158] },
    ],
    tempo: [{ label: 'Lift', dur: 1 }, { label: 'Lower', dur: 1.5 }],
  },
  {
    id: 'y-raise', name: 'Prone Y-Raise', group: 'Push', equip: ['Bodyweight'], bw: true,
    muscles: 'Rear and side shoulders, upper back',
    cues: ['Lie face down, arms overhead in a Y, thumbs up', 'Lift your arms by squeezing your shoulder blades', 'Lower slowly — no momentum'],
    mistake: 'Shrugging up toward your ears.',
    tip40: 'The rotator-cuff saver: balances all the pushing and keeps shoulders healthy overhead.',
    easier: 'Lift one arm at a time', harder: 'Hold light plates or water bottles',
    prop: null, es: 1, mus: { p: ['delts'], s: ['back'] }, fn: [16, 174], ff: [12, 174],
    frames: [{ hip: [100, 164], t: -4, hn: [214, 172], hf: [210, 172] }, { hip: [100, 164], t: -7, hn: [206, 130], hf: [202, 130] }],
    tempo: [{ label: 'Lift', dur: 1 }, { label: 'Lower', dur: 2 }],
  },
  {
    id: 'shoulder-tap', name: 'Plank Shoulder Tap', group: 'Arms & Core', equip: ['Bodyweight'], bw: true,
    muscles: 'Core, shoulders, chest',
    cues: ['High plank, feet a little wider than usual', 'Tap the opposite shoulder without rocking your hips', 'Alternate sides, slow and steady'],
    mistake: 'Hips swaying side to side — widen your feet.',
    tip40: 'Trains the anti-rotation strength that protects your lower back when you carry and twist.',
    easier: 'Hands on a bench', harder: 'Feet together',
    prop: null, es: 1, mus: { p: ['abs', 'delts'], s: ['chest'] }, ...PUSH_FEET,
    frames: [PUSH_TOP, { ...PUSH_TOP, hn: [150, 124] }, PUSH_TOP, { ...PUSH_TOP, hf: [146, 124] }],
    tempo: [{ label: 'Tap', dur: 0.6 }, { label: 'Down', dur: 0.6 }, { label: 'Tap', dur: 0.6 }, { label: 'Down', dur: 0.6 }],
  },
  {
    id: 'bench-dip', name: 'Bench Dip', group: 'Arms & Core', equip: ['Bodyweight', 'Bench'], bw: true,
    muscles: 'Triceps, chest, front shoulders',
    cues: ['Hands on the bench edge behind you, fingers forward', 'Bend your elbows straight back to about 90°', 'Press up to straight arms'],
    mistake: 'Dropping too deep — it strains the front of the shoulder.',
    tip40: 'Stop at 90° and keep your back close to the bench. Bent knees make it easier on the shoulders.',
    easier: 'Feet closer, knees bent more', harder: 'Legs straight, feet on a second bench',
    prop: null, es: 1, mus: { p: ['triceps'], s: ['chest', 'delts'] }, fn: [172, 176], ff: [168, 176],
    scene: `<rect x="56" y="120" width="64" height="8" rx="3" class="bench"/>
      <rect x="64" y="128" width="6" height="52" class="bench-leg"/><rect x="106" y="128" width="6" height="52" class="bench-leg"/>`,
    frames: [{ hip: [124, 110], t: -88, hn: [116, 118], hf: [112, 118] }, { hip: [126, 138], t: -88, hn: [116, 118], hf: [112, 118] }],
    tempo: [{ label: 'Lower', dur: 2 }, { label: 'Press', dur: 1 }],
  },
  {
    id: 'bw-squat', name: 'Bodyweight Squat', group: 'Legs', equip: ['Bodyweight'], bw: true,
    muscles: 'Quads, glutes',
    cues: ['Feet shoulder-width, toes slightly out', 'Reach your arms forward as you sit down between your heels', 'Stand up tall and squeeze your glutes'],
    mistake: 'Knees caving in on the way up.',
    tip40: 'Squat to a chair or bench at first — tap it lightly and stand. Same depth every rep.',
    easier: 'Squat to a bench', harder: 'Slow 4-second lower, or jump squat',
    prop: null, es: 1, mus: { p: ['quads', 'glutes'], s: ['hams'] }, ...STAND_FEET,
    frames: [{ ...STAND, hn: [122, 103] }, { hip: [96, 138], t: -60, hn: [174, 92] }],
    tempo: [{ label: 'Sit down', dur: 2 }, { label: 'Stand', dur: 1 }],
  },
  {
    id: 'reverse-lunge', name: 'Reverse Lunge', group: 'Legs', equip: ['Bodyweight'], bw: true,
    muscles: 'Quads, glutes, balance',
    cues: ['Step one foot back into a long stride', 'Lower the back knee toward the floor', 'Drive through the front heel to stand'],
    mistake: 'A short step that pushes the front knee far past the toes.',
    tip40: 'Stepping back instead of forward is much kinder to the knees — the best lunge after 40.',
    easier: 'Hold a wall or chair for balance', harder: 'Hold dumbbells, or add a knee drive',
    prop: null, es: 1, mus: { p: ['quads', 'glutes'], s: ['hams', 'calves'] }, ...STAND_FEET,
    frames: [
      { hip: [120, 93], t: -90, hn: [128, 98], hf: [124, 98], fn: [124, 176], ff: [118, 176] },
      { hip: [116, 104], t: -88, hn: [124, 108], hf: [120, 108], fn: [124, 176], ff: [92, 158] },
      { hip: [104, 130], t: -86, hn: [112, 134], hf: [108, 134], fn: [124, 176], ff: [60, 170] },
      { hip: [116, 104], t: -88, hn: [124, 108], hf: [120, 108], fn: [124, 176], ff: [92, 158] },
    ],
    tempo: [{ label: 'Step back', dur: 0.6 }, { label: 'Lower', dur: 1.2 }, { label: 'Drive up', dur: 0.8 }, { label: 'Step in', dur: 0.6 }],
  },
  {
    id: 'glute-bridge', name: 'Glute Bridge', group: 'Legs', equip: ['Bodyweight'], bw: true,
    muscles: 'Glutes, hamstrings',
    cues: ['Lie on your back, knees bent, feet flat', 'Drive through your heels and lift your hips', 'Squeeze your glutes at the top for a second'],
    mistake: 'Arching the lower back instead of using the glutes.',
    tip40: 'Wakes up glutes that sitting all day switches off — a big help for cranky lower backs.',
    easier: 'Smaller range, pause at the top', harder: 'Single-leg glute bridge',
    prop: null, es: 1, mus: { p: ['glutes'], s: ['hams', 'lowback'] }, fn: [168, 176], ff: [164, 176],
    frames: [{ hip: [130, 162], t: 180, hn: [132, 176], hf: [128, 176] }, { hip: [130, 128], t: 141, hn: [132, 176], hf: [128, 176] }],
    tempo: [{ label: 'Drive up', dur: 1 }, { label: 'Lower', dur: 2 }],
  },
  {
    id: 'wall-sit', name: 'Wall Sit', group: 'Legs', equip: ['Bodyweight'], bw: true, timed: true,
    muscles: 'Quads, glutes',
    cues: ['Back flat against a wall', 'Slide down until your thighs are near parallel', 'Hold, breathing steadily'],
    mistake: 'Knees drifting past your toes — walk your feet out further.',
    tip40: 'Builds knee-friendly leg strength with no impact. Sit higher until 60 seconds feels easy.',
    easier: 'Sit higher on the wall', harder: 'Hold a dumbbell on your lap',
    prop: null, es: 1, mus: { p: ['quads'], s: ['glutes'] }, fn: [136, 176], ff: [132, 176],
    scene: `<rect x="66" y="40" width="8" height="140" rx="2" class="bench"/>`,
    frames: [{ hip: [92, 130], t: -90, hn: [128, 124], hf: [124, 124] }, { hip: [92, 129], t: -90, hn: [128, 123], hf: [124, 123] }],
    tempo: [{ label: 'Hold', dur: 2 }, { label: 'Breathe', dur: 2 }],
  },
  {
    id: 'plank', name: 'Forearm Plank', group: 'Arms & Core', equip: ['Bodyweight'], bw: true, timed: true,
    muscles: 'Abs, deep core, shoulders, glutes',
    cues: ['Elbows under your shoulders, forearms on the floor', 'Squeeze glutes and pull your ribs down', 'One straight line — hold and breathe'],
    mistake: 'Hips sagging toward the floor.',
    tip40: 'Quality over clock: 30 tight seconds beats 2 sloppy minutes.',
    easier: 'Plank on your knees', harder: 'Lift one foot, or add shoulder taps',
    prop: null, es: -1, mus: { p: ['abs'], s: ['delts', 'glutes'] }, fn: [16, 176], ff: [12, 176],
    frames: [{ hip: [97, 155], t: -14.3, hn: [180, 176], hf: [176, 176] }, { hip: [97, 153], t: -15.3, hn: [180, 176], hf: [176, 176] }],
    tempo: [{ label: 'Hold', dur: 2 }, { label: 'Breathe', dur: 2 }],
  },
  {
    id: 'dead-bug', name: 'Dead Bug', group: 'Arms & Core', equip: ['Bodyweight'], bw: true,
    muscles: 'Abs, deep core',
    cues: ['On your back, arms up, knees bent at 90°', 'Press your lower back into the floor', 'Reach one arm back and the opposite leg out, then switch'],
    mistake: 'The lower back lifting off the floor as the leg goes out.',
    tip40: 'The safest serious ab exercise there is — zero strain on the spine or neck.',
    easier: 'Move only the legs', harder: 'Slower, and straighten the leg fully',
    prop: null, es: 1, mus: { p: ['abs'], s: [] }, fn: [172, 120], ff: [168, 120],
    frames: [
      { hip: [130, 162], t: 180, hn: [80, 100], hf: [76, 100], fn: [172, 120], ff: [168, 120] },
      { hip: [130, 162], t: 180, hn: [20, 152], hf: [76, 100], fn: [212, 152], ff: [168, 120] },
      { hip: [130, 162], t: 180, hn: [80, 100], hf: [76, 100], fn: [172, 120], ff: [168, 120] },
      { hip: [130, 162], t: 180, hn: [80, 100], hf: [16, 152], fn: [172, 120], ff: [208, 152] },
    ],
    tempo: [{ label: 'Reach', dur: 1.5 }, { label: 'Return', dur: 1 }, { label: 'Reach', dur: 1.5 }, { label: 'Return', dur: 1 }],
  },
  {
    id: 'knee-raise', name: 'Hanging Knee Raise', group: 'Arms & Core', equip: ['Bodyweight', 'Pull-up bar'], bw: true,
    muscles: 'Abs, hip flexors, grip',
    cues: ['Hang from the bar, shoulders set down', 'Curl your knees up toward your chest', 'Lower slowly without swinging'],
    mistake: 'Swinging to get the knees up.',
    tip40: 'Hanging also gently decompresses the spine and builds grip — two wins for the price of one.',
    easier: 'Lying knee tucks on the floor', harder: 'Straight-leg raises',
    prop: null, es: 1, mus: { p: ['abs'], s: ['forearms', 'quads'] }, fn: [126, 155], ff: [122, 155], ...BAR_TOP,
    frames: [
      { hip: [129, 72], t: -95, hn: [126, -46], hf: [122, -46], fn: [126, 155], ff: [122, 155] },
      { hip: [126, 72], t: -100, hn: [126, -46], hf: [122, -46], fn: [164, 108], ff: [160, 108] },
    ],
    tempo: [{ label: 'Raise', dur: 1 }, { label: 'Lower', dur: 2 }],
  },
  {
    id: 'calf-raise', name: 'Standing Calf Raise', group: 'Legs', equip: ['Bodyweight', 'Dumbbell'], bw: true,
    muscles: 'Calves, ankles',
    cues: ['Stand tall, feet hip-width, holding a wall or dumbbells', 'Rise as high as you can onto the balls of your feet', 'Pause for a second, then lower all the way down'],
    mistake: 'Bouncing through fast, short reps.',
    tip40: 'Strong calves and ankles mean better balance and fewer falls. Do these slowly with a full pause at the top.',
    easier: 'Hold a wall, both feet', harder: 'Single-leg, off the edge of a step',
    prop: null, es: 1, mus: { p: ['calves'], s: [] }, ...STAND_FEET,
    frames: [{ ...STAND, hn: [122, 103], fn: [124, 176], ff: [118, 176] }, { hip: [120, 85], t: -90, hn: [122, 95], fn: [124, 168], ff: [118, 168] }],
    tempo: [{ label: 'Rise & pause', dur: 1.5 }, { label: 'Lower', dur: 2 }],
  },
  {
    id: 'lateral-raise', name: 'Dumbbell Lateral Raise', group: 'Push', equip: ['Dumbbell'],
    muscles: 'Side shoulders, upper traps',
    cues: ['Light dumbbells at your sides, slight bend in the elbows', 'Raise out to the sides (slightly forward) to shoulder height', 'Lower slowly — no swinging'],
    mistake: 'Shrugging and swinging heavy weights up.',
    tip40: 'Go light and lift slightly in front of your body (the “scapular plane”) — it’s far kinder to aging shoulders.',
    easier: 'One arm at a time, or water bottles', harder: 'Slow 3-second lowering',
    prop: 'db', es: 1, mus: { p: ['delts'], s: [] }, ...STAND_FEET,
    frames: [{ ...STAND, hn: [123, 102], hf: [117, 102], aS: 1 }, { ...STAND, hn: [134, 46], hf: [110, 46], aS: 0.42, aSf: 0.42 }],
    tempo: [{ label: 'Raise', dur: 1 }, { label: 'Lower', dur: 2 }],
  },
  {
    id: 'side-plank', name: 'Side Plank', group: 'Arms & Core', equip: ['Bodyweight'], bw: true, timed: true,
    muscles: 'Obliques, deep core, glutes, shoulders',
    cues: ['On your side, elbow right under your shoulder', 'Stack your feet and lift your hips into a straight line', 'Hold and breathe, then switch sides'],
    mistake: 'Hips sagging or drifting backward.',
    tip40: 'Trains the side-to-side core strength that protects your lower back. Bend your knees to start.',
    easier: 'Knees bent on the floor', harder: 'Lift the top leg',
    prop: null, es: 1, esf: -1, mus: { p: ['abs'], s: ['glutes', 'delts'] }, fn: [20, 176], ff: [16, 176],
    frames: [{ hip: [99, 146], t: -19, hn: [108, 136], hf: [178, 176] }, { hip: [99, 143], t: -20, hn: [108, 133], hf: [178, 176] }],
    tempo: [{ label: 'Hold', dur: 2 }, { label: 'Breathe', dur: 2 }],
  },
  // ---------------- MACHINES & CABLES (gym with machines: Planet Fitness style) ----------------
  // lever = fixed pivot of a machine arm, cable = pulley point, pad = roller on the shin/thigh, sled = leg-press foot plate
  {
    id: 'leg-press', name: 'Leg Press', group: 'Legs', equip: ['Machine'], inc: 10,
    muscles: 'Quads, glutes, hamstrings',
    cues: ['Hips and lower back flat against the seat pad', 'Feet shoulder-width in the middle of the plate; lower until your knees reach about 90°', 'Press through your whole foot and stop just short of locking your knees'],
    mistake: 'Lowering so deep that your hips curl up off the seat — that rounds the lower back under load.',
    tip40: 'Heavy leg work with no bar on your spine. Keep the range where your hips stay down and your knees feel smooth.',
    easier: 'Shorter range, lighter stack', harder: 'Pause 2 seconds at the bottom, or one leg at a time',
    prop: 'sled', sled: true, footAng: -90, es: -1, mus: { p: ['quads', 'glutes'], s: ['hams'] }, fn: [146, 102], ff: [142, 103],
    scene: `${STACK(196)}<line x1="116" y1="120" x2="186" y2="142" class="frame"/><line x1="186" y1="142" x2="186" y2="180" class="frame"/>
      <rect x="44" y="134" width="58" height="8" rx="3" class="bench"/><rect x="66" y="142" width="6" height="38" class="bench-leg"/>
      <line x1="54" y1="132" x2="24" y2="90" class="bench-pad"/>`,
    frames: [{ hip: [70, 126], t: -125, hn: [80, 128], fn: [146, 102], ff: [142, 103] }, { hip: [70, 126], t: -125, hn: [80, 128], fn: [116, 92], ff: [112, 93] }],
    tempo: [{ label: 'Lower', dur: 2 }, { label: 'Press', dur: 1 }],
  },
  {
    id: 'leg-extension', name: 'Leg Extension', group: 'Legs', equip: ['Machine'],
    muscles: 'Quads',
    cues: ['Line your knees up with the machine’s pivot, pad just above your ankles', 'Straighten your legs smoothly and squeeze your quads for a second', 'Lower under control — don’t let the stack crash'],
    mistake: 'Kicking the weight up fast and swinging it back down.',
    tip40: 'Start light: it’s the one quad move with zero back load. If your kneecaps complain, stop a little short of fully straight.',
    easier: 'Lighter, or one leg at a time', harder: 'Pause 2 seconds at the top',
    prop: 'pad', pad: { seg: 'shin', u: 0.86, n: 8, r: 6.5 }, lever: [142, 112], footAng: 'shin', es: -1, mus: { p: ['quads'], s: [] }, fn: [140, 154], ff: [136, 155],
    scene: `${STACK(24)}<rect x="74" y="120" width="70" height="8" rx="3" class="bench"/><rect x="104" y="128" width="6" height="52" class="bench-leg"/>
      <line x1="80" y1="118" x2="78" y2="62" class="bench-pad"/><circle cx="142" cy="112" r="4.5" class="hub"/>`,
    frames: [{ hip: [96, 112], t: -92, hn: [114, 120], fn: [140, 154], ff: [136, 155] }, { hip: [96, 112], t: -93, hn: [114, 120], fn: [178, 108], ff: [174, 109] }],
    tempo: [{ label: 'Extend', dur: 1 }, { label: 'Lower', dur: 2 }],
  },
  {
    id: 'leg-curl', name: 'Seated Leg Curl', group: 'Legs', equip: ['Machine'],
    muscles: 'Hamstrings, calves',
    cues: ['Knees lined up with the pivot, thigh pad snug on top of your legs', 'Curl your heels down and back under the seat', 'Let the pad rise slowly until your legs are straight again'],
    mistake: 'Lifting your hips off the seat to finish the rep.',
    tip40: 'Hamstrings protect your knees and back, and this is the easiest way to train them hard without loading your spine.',
    easier: 'Smaller range, lighter stack', harder: 'Slow 3-second return',
    prop: 'pad', pad: { seg: 'shin', u: 0.9, n: -8, r: 6.5 }, lever: [138, 112], footAng: 'shin', es: -1, mus: { p: ['hams'], s: ['calves'] }, fn: [178, 106], ff: [174, 107],
    scene: `${STACK(20)}<rect x="68" y="120" width="72" height="8" rx="3" class="bench"/><rect x="100" y="128" width="6" height="52" class="bench-leg"/>
      <line x1="76" y1="118" x2="70" y2="60" class="bench-pad"/><rect x="114" y="91" width="30" height="8" rx="4" class="bench"/>
      <line x1="146" y1="95" x2="146" y2="112" class="frame"/><circle cx="138" cy="112" r="4.5" class="hub"/>`,
    frames: [{ hip: [94, 112], t: -95, hn: [110, 120], fn: [178, 106], ff: [174, 107] }, { hip: [94, 112], t: -95, hn: [110, 120], fn: [128, 152], ff: [124, 153] }],
    tempo: [{ label: 'Curl', dur: 1 }, { label: 'Return', dur: 2 }],
  },
  {
    id: 'seated-calf', name: 'Seated Calf Raise', group: 'Legs', equip: ['Machine'],
    muscles: 'Calves (the deep soleus), ankles',
    cues: ['Balls of your feet on the platform edge, knee pad snug on your lower thighs', 'Push up onto your toes as high as you can and pause', 'Lower slowly into a deep calf stretch'],
    mistake: 'Short, bouncy reps — the stretch and the pause do the work.',
    tip40: 'Bent-knee calf work builds the soleus, the muscle that keeps your ankles steady when you walk and climb stairs.',
    easier: 'Lighter, smaller range', harder: 'Pause 3 seconds at the top',
    prop: 'pad', pad: { seg: 'thigh', u: 0.9, n: 11, r: 6.5 }, lever: [198, 146], es: -1, mus: { p: ['calves'], s: [] }, fn: [142, 176], ff: [138, 176],
    scene: `<rect x="62" y="140" width="56" height="8" rx="3" class="bench"/><rect x="86" y="148" width="6" height="32" class="bench-leg"/>
      <line x1="198" y1="146" x2="198" y2="180" class="frame"/><circle cx="198" cy="146" r="4.5" class="hub"/>`,
    frames: [{ hip: [98, 134], t: -84, hn: [146, 118], fn: [142, 176], ff: [138, 176] }, { hip: [98, 134], t: -84, hn: [146, 112], fn: [142, 168], ff: [138, 168] }],
    tempo: [{ label: 'Rise & pause', dur: 1.5 }, { label: 'Lower', dur: 2 }],
  },
  {
    id: 'chest-press', name: 'Machine Chest Press', group: 'Push', equip: ['Machine'], inc: 10,
    muscles: 'Chest, front shoulders, triceps',
    cues: ['Seat height so the handles line up with your mid-chest', 'Shoulder blades back against the pad, then press straight out', 'Return slowly until your hands are just in front of your chest'],
    mistake: 'Shoulders rolling forward off the pad at the end of each rep.',
    tip40: 'The machine guides the path, so you can push hard safely without a spotter. Use the neutral handles if your shoulders ache.',
    easier: 'Lighter stack, shorter range', harder: 'Slow 3-second return, or one arm at a time',
    prop: 'handle', lever: [148, 6], es: -1, mus: { p: ['chest'], s: ['delts', 'triceps'] }, fn: [150, 176], ff: [146, 176],
    scene: `${STACK(198)}<rect x="80" y="134" width="62" height="8" rx="3" class="bench"/><rect x="108" y="142" width="6" height="38" class="bench-leg"/>
      <line x1="92" y1="132" x2="92" y2="56" class="bench-pad"/><line x1="148" y1="6" x2="198" y2="6" class="frame"/><circle cx="148" cy="6" r="4.5" class="hub"/>`,
    frames: [{ hip: [104, 126], t: -90, hn: [130, 78] }, { hip: [104, 126], t: -90, hn: [166, 76] }],
    tempo: [{ label: 'Press', dur: 1 }, { label: 'Return', dur: 2 }],
  },
  {
    id: 'pec-deck', name: 'Pec Deck Fly', group: 'Push', equip: ['Machine'],
    muscles: 'Chest, front shoulders',
    cues: ['Seat so the handles sit at chest height, slight bend in your elbows', 'Hug the handles together in front of your chest', 'Open slowly until you feel a stretch across your chest — no further'],
    mistake: 'Letting the arms fly back past your body at the open position.',
    tip40: 'Stop the stretch when your hands are in line with your shoulders. That limit keeps the front of the shoulder happy.',
    easier: 'Smaller range, lighter stack', harder: 'Pause 2 seconds with the handles together',
    prop: 'handle', es: -1, mus: { p: ['chest'], s: ['delts'] }, fn: [150, 176], ff: [146, 176],
    scene: `${STACK(198)}<rect x="80" y="134" width="62" height="8" rx="3" class="bench"/><rect x="108" y="142" width="6" height="38" class="bench-leg"/>
      <line x1="92" y1="132" x2="92" y2="50" class="bench-pad"/><line x1="92" y1="20" x2="198" y2="20" class="frame"/><line x1="92" y1="20" x2="92" y2="46" class="frame"/>`,
    frames: [{ hip: [104, 126], t: -90, hn: [121, 76], hf: [116, 76], aS: 0.34, aSf: 0.34 }, { hip: [104, 126], t: -90, hn: [158, 76], hf: [154, 76], aS: 1, aSf: 1 }],
    tempo: [{ label: 'Squeeze', dur: 1 }, { label: 'Open', dur: 2 }],
  },
  {
    id: 'machine-shoulder', name: 'Machine Shoulder Press', group: 'Push', equip: ['Machine'], inc: 10,
    muscles: 'Shoulders, triceps',
    cues: ['Seat height so the handles start at about ear level', 'Back flat on the pad, press up until your arms are nearly straight', 'Lower under control to ear height'],
    mistake: 'Arching your lower back off the pad to move more weight.',
    tip40: 'A fixed path and a back pad make this the safest way to load the shoulders. The neutral grip is the friendliest.',
    easier: 'Lighter stack, stop at forehead height', harder: 'Slow 3-second lowering',
    prop: 'handle', lever: [50, 44], es: -1, mus: { p: ['delts'], s: ['triceps'] }, fn: [150, 176], ff: [146, 176],
    scene: `${STACK(16)}<rect x="80" y="134" width="62" height="8" rx="3" class="bench"/><rect x="108" y="142" width="6" height="38" class="bench-leg"/>
      <line x1="92" y1="132" x2="92" y2="48" class="bench-pad"/><line x1="34" y1="44" x2="50" y2="44" class="frame"/><circle cx="50" cy="44" r="4.5" class="hub"/>`,
    frames: [{ hip: [104, 126], t: -90, hn: [112, 68] }, { hip: [104, 126], t: -90, hn: [108, 12] }],
    tempo: [{ label: 'Press', dur: 1 }, { label: 'Lower', dur: 2 }],
  },
  {
    id: 'lat-pulldown', name: 'Lat Pulldown', group: 'Pull', equip: ['Cable'],
    muscles: 'Lats, upper back, biceps',
    cues: ['Thighs snug under the pad, hands just outside shoulder width', 'Lean back slightly and pull the bar to your upper chest, elbows down to your ribs', 'Let it rise until your arms are straight and you feel the lats stretch'],
    mistake: 'Leaning way back and yanking the bar with your body weight.',
    tip40: 'The best way to build pull-up strength and a strong back at any weight. Never pull the bar behind your neck.',
    easier: 'Lighter stack, closer grip', harder: 'Pause 1 second with the bar at your chest',
    prop: 'handle', cable: [110, -40], es: -1, mus: { p: ['back'], s: ['biceps', 'forearms'] }, fn: [150, 176], ff: [146, 176],
    scene: `<line x1="164" y1="-44" x2="164" y2="180" class="frame"/><line x1="104" y1="-44" x2="164" y2="-44" class="frame"/><circle cx="110" cy="-40" r="5" class="hub"/>
      <rect x="80" y="136" width="58" height="8" rx="3" class="bench"/><rect x="106" y="144" width="6" height="36" class="bench-leg"/>
      <rect x="124" y="102" width="30" height="9" rx="4" class="bench"/><line x1="152" y1="106" x2="164" y2="106" class="frame"/>`,
    frames: [{ hip: [102, 128], t: -98, hn: [110, 12], hf: [106, 12] }, { hip: [102, 128], t: -104, hn: [114, 82], hf: [110, 82] }],
    tempo: [{ label: 'Pull', dur: 1 }, { label: 'Return', dur: 2 }],
  },
  {
    id: 'cable-row', name: 'Seated Cable Row', group: 'Pull', equip: ['Cable'],
    muscles: 'Mid-back, lats, rear shoulders, biceps',
    cues: ['Feet on the platform, knees soft, sit tall', 'Row the handle to your belly button, squeezing your shoulder blades together', 'Reach forward slowly until your arms are straight — keep your back flat'],
    mistake: 'Rocking far back and forth to swing the weight.',
    tip40: 'A big back builder with your chest up and spine supported by your legs. Keep the lean small and the squeeze big.',
    easier: 'Lighter stack, pause at the belly', harder: 'Slow 3-second return',
    prop: 'handle', cable: [204, 150], footAng: -78, es: -1, mus: { p: ['back'], s: ['biceps', 'delts'] }, fn: [150, 150], ff: [146, 152],
    scene: `<line x1="208" y1="70" x2="208" y2="180" class="frame"/><circle cx="204" cy="150" r="5" class="hub"/>
      <line x1="160" y1="132" x2="166" y2="174" class="bench-pad"/><line x1="166" y1="174" x2="208" y2="174" class="frame"/>
      <rect x="46" y="146" width="70" height="8" rx="3" class="bench"/><rect x="54" y="154" width="6" height="26" class="bench-leg"/><rect x="102" y="154" width="6" height="26" class="bench-leg"/>`,
    frames: [{ hip: [80, 138], t: -78, hn: [150, 106], hf: [146, 106] }, { hip: [80, 138], t: -93, hn: [102, 114], hf: [98, 114] }],
    tempo: [{ label: 'Row', dur: 1 }, { label: 'Return', dur: 2 }],
  },
  {
    id: 'face-pull', name: 'Cable Face Pull', group: 'Pull', equip: ['Cable'],
    muscles: 'Rear shoulders, upper back, rotator cuff',
    cues: ['Rope at face height, palms facing in, step back until the arms are straight', 'Pull the rope toward your eyes, elbows high and out to the sides', 'Finish with your hands beside your ears, then return slowly'],
    mistake: 'Going heavy and turning it into a low row with the elbows down.',
    tip40: 'The shoulder-health move: it balances all the pressing. Light weight, slow squeeze — 15 clean reps beats 8 heavy ones.',
    easier: 'Lighter, or use a band', harder: 'Hold the finish for 2 seconds',
    prop: 'handle', cable: [214, 30], es: 1, mus: { p: ['delts'], s: ['back'] }, ...STAND_FEET,
    scene: `<line x1="218" y1="-6" x2="218" y2="180" class="frame"/><circle cx="214" cy="30" r="5" class="hub"/>`,
    frames: [{ hip: [118, 93], t: -94, hn: [176, 40], hf: [172, 40], aS: 1, aSf: 1 }, { hip: [118, 93], t: -96, hn: [136, 30], hf: [132, 30], aS: 0.6, aSf: 0.6 }],
    tempo: [{ label: 'Pull', dur: 1 }, { label: 'Return', dur: 2 }],
  },
  {
    id: 'pushdown', name: 'Cable Triceps Pushdown', group: 'Arms & Core', equip: ['Cable'],
    muscles: 'Triceps',
    cues: ['Stand close to the cable, elbows pinned to your sides', 'Push the handle down until your arms are straight', 'Let your forearms come back up to parallel — elbows stay put'],
    mistake: 'Elbows drifting forward and the shoulders taking over.',
    tip40: 'The most elbow-friendly triceps exercise there is. A rope lets your wrists turn naturally.',
    easier: 'Lighter stack', harder: 'Slow 3-second return',
    prop: 'handle', cable: [150, -34], es: -1, mus: { p: ['triceps'], s: [] }, ...STAND_FEET,
    scene: `<line x1="178" y1="-38" x2="178" y2="180" class="frame"/><line x1="146" y1="-38" x2="178" y2="-38" class="frame"/><circle cx="150" cy="-34" r="5" class="hub"/>`,
    frames: [{ hip: [120, 93], t: -82, hn: [158, 70], hf: [154, 70] }, { hip: [120, 93], t: -82, hn: [138, 102], hf: [134, 102] }],
    tempo: [{ label: 'Push down', dur: 1 }, { label: 'Return', dur: 2 }],
  },
  {
    id: 'cable-curl', name: 'Cable Biceps Curl', group: 'Arms & Core', equip: ['Cable'],
    muscles: 'Biceps, forearms',
    cues: ['Stand a step back from the low pulley, elbows at your sides', 'Curl the handle up toward your shoulders', 'Lower slowly until your arms are straight'],
    mistake: 'Leaning back and swinging the hips to finish the rep.',
    tip40: 'The cable keeps tension on the whole rep with a smooth pull that’s easy on the elbows.',
    easier: 'Lighter stack', harder: 'Pause at the top for 2 seconds',
    prop: 'handle', cable: [176, 168], es: -1, mus: { p: ['biceps'], s: ['forearms'] }, ...STAND_FEET,
    scene: `<line x1="182" y1="96" x2="182" y2="180" class="frame"/><circle cx="176" cy="168" r="5" class="hub"/>`,
    frames: [{ ...STAND, hn: [128, 100], hf: [124, 100] }, { ...STAND, hn: [140, 46], hf: [136, 46] }],
    tempo: [{ label: 'Curl', dur: 1 }, { label: 'Lower', dur: 2 }],
  },
  {
    id: 'smith-squat', name: 'Smith Machine Squat', group: 'Legs', equip: ['Smith machine'],
    muscles: 'Quads, glutes, hamstrings',
    cues: ['Bar across your upper back, feet a half step in front of it', 'Sit down and back until your thighs are about parallel', 'Drive up through your whole foot; twist the bar back onto the hooks when done'],
    mistake: 'Feet directly under the bar — the fixed path then shoves your knees far forward.',
    tip40: 'The rails take balance out of the picture, so you can squat heavy without a spotter. Set the safety stops just below your bottom position.',
    easier: 'Squat to a bench', harder: 'Pause 2 seconds at the bottom',
    prop: 'bb', es: 1, mus: { p: ['quads', 'glutes'], s: ['hams'] }, fn: [136, 176], ff: [130, 176],
    scene: `<line x1="116" y1="-30" x2="116" y2="180" class="frame"/><line x1="96" y1="-30" x2="136" y2="-30" class="frame"/>`, top: -36,
    frames: [{ hip: [123, 93], t: -88, hn: [116, 34] }, { hip: [99, 138], t: -62, hn: [116, 85] }],
    tempo: [{ label: 'Sit down', dur: 2 }, { label: 'Stand', dur: 1 }],
  },
  {
    id: 'hip-abduction', name: 'Hip Abduction Machine', group: 'Legs', equip: ['Machine'],
    muscles: 'Outer glutes, hips',
    cues: ['Sit tall, pads on the outside of your knees', 'Push your knees apart as wide as is comfortable', 'Bring them back together slowly — don’t let the plates touch'],
    mistake: 'Rocking the torso to bang out fast reps.',
    tip40: 'Strong side glutes keep your knees tracking straight and your hips steady on stairs and uneven ground.',
    easier: 'Smaller range', harder: 'Lean slightly forward and pause 2 seconds open',
    prop: 'pad', pad: { seg: 'thigh', u: 0.88, n: 0, r: 7.5 }, es: -1, mus: { p: ['glutes'], s: [] }, fn: [146, 150], ff: [142, 151],
    scene: `${STACK(198)}<rect x="70" y="128" width="64" height="8" rx="3" class="bench"/><rect x="98" y="136" width="6" height="44" class="bench-leg"/>
      <line x1="82" y1="126" x2="72" y2="64" class="bench-pad"/><line x1="136" y1="158" x2="160" y2="158" class="frame"/><line x1="146" y1="158" x2="146" y2="180" class="frame"/>`,
    frames: [{ hip: [96, 120], t: -98, hn: [108, 126], lS: 1, lSf: 1, fn: [146, 150], ff: [142, 151] }, { hip: [96, 120], t: -98, hn: [108, 126], lS: 0.72, lSf: 0.72, fn: [134, 156], ff: [118, 138] }],
    tempo: [{ label: 'Push out', dur: 1 }, { label: 'Return', dur: 2 }],
  },
  {
    id: 'assisted-pullup', name: 'Assisted Pull-Up', group: 'Pull', equip: ['Machine'], assist: true, inc: 10,
    muscles: 'Lats, upper back, biceps',
    cues: ['Kneel on the pad and pick the assistance — more weight on the stack means more help', 'Pull your elbows down to your ribs until your chin clears the handles', 'Lower all the way to straight arms'],
    mistake: 'Bouncing off the pad at the bottom instead of controlling the lowering.',
    tip40: 'The weight is help, not load: take 10 lb off the assistance whenever every set reaches 12. Under ~40 lb of help, try real pull-ups.',
    easier: 'More assistance', harder: 'Less assistance, or slow 3-second lowering',
    prop: null, pad: { seg: 'shin', u: 0.18, n: 8, r: 7 }, lever: [52, 172], es: 1, mus: { p: ['back'], s: ['biceps', 'forearms'] }, fn: [92, 138], ff: [88, 139], ...BAR_HIGH,
    frames: [
      { hip: [129, 94], t: -95, hn: [126, -24], hf: [122, -24], fn: [92, 138], ff: [88, 139] },
      { hip: [129, 46], t: -95, hn: [126, -24], hf: [122, -24], fn: [92, 90], ff: [88, 91] },
    ],
    tempo: [{ label: 'Pull', dur: 1 }, { label: 'Lower', dur: 2 }],
  },
  {
    id: 'captains-chair', name: 'Captain’s Chair Knee Raise', group: 'Arms & Core', equip: ['Bodyweight', 'Power tower'], bw: true,
    muscles: 'Abs, hip flexors',
    cues: ['Back flat against the pad, forearms on the arm rests, legs hanging', 'Curl your knees up toward your chest, tilting your hips up at the top', 'Lower slowly without swinging'],
    mistake: 'Swinging the legs up and arching your lower back off the pad.',
    tip40: 'The arm pads take the strain off your grip and shoulders, so your abs do all the work. Exhale as the knees come up.',
    easier: 'Smaller range, one knee at a time', harder: 'Straight-leg raises, or hold a light dumbbell between your feet',
    prop: null, es: -1, mus: { p: ['abs'], s: ['quads'] }, fn: [116, 154], ff: [112, 154],
    scene: `<line x1="82" y1="-10" x2="82" y2="180" class="frame"/><rect x="86" y="2" width="10" height="94" rx="4" class="bench"/>
      <rect x="96" y="56" width="56" height="7" rx="3" class="bench"/><line x1="152" y1="44" x2="152" y2="66" class="frame"/><line x1="82" y1="60" x2="96" y2="60" class="frame"/>`,
    frames: [{ hip: [112, 72], t: -90, hn: [146, 50], hf: [142, 50], fn: [116, 154], ff: [112, 154] }, { hip: [112, 72], t: -92, hn: [146, 50], hf: [142, 50], fn: [154, 100], ff: [150, 100] }],
    tempo: [{ label: 'Raise', dur: 1 }, { label: 'Lower', dur: 2 }],
  },
  {
    id: 'neutral-pullup', name: 'Neutral-Grip Pull-Up', group: 'Pull', equip: ['Bodyweight', 'Pull-up bar'], bw: true,
    muscles: 'Lats, upper back, biceps, grip',
    cues: ['Grab the parallel handles, palms facing each other', 'Pull your elbows down to your ribs until your chin clears the handles', 'Lower all the way to straight arms'],
    mistake: 'Kicking and swinging to get the last rep.',
    tip40: 'Palms facing in is the easiest grip on your elbows and shoulders — the best pull-up for most of us after 40.',
    easier: 'Assisted pull-up machine or slow negatives', harder: 'Hold a dumbbell between your feet',
    prop: null, es: 1, mus: { p: ['back'], s: ['biceps', 'forearms'] }, fn: [100, 148], ff: [96, 150],
    scene: `${BAR_HIGH.scene}<line x1="124" y1="-31" x2="124" y2="-17" class="frame" style="stroke-width:5"/>`,
    frames: [
      { hip: [129, 94], t: -95, hn: [126, -24], hf: [122, -24], fn: [118, 170], ff: [113, 171] },
      { hip: [129, 46], t: -95, hn: [126, -24], hf: [122, -24], fn: [116, 122], ff: [111, 123] },
    ],
    tempo: [{ label: 'Pull', dur: 1 }, { label: 'Lower', dur: 2 }],
  },
  {
    id: 'tower-dip', name: 'Power Tower Dip', group: 'Arms & Core', equip: ['Bodyweight', 'Power tower'], bw: true,
    muscles: 'Triceps, chest, front shoulders',
    cues: ['Straight arms on the dip handles, shoulders pulled down away from your ears', 'Lean slightly forward and bend your elbows straight back', 'Stop when your upper arms are parallel to the floor, then press up'],
    mistake: 'Sinking too deep and letting the shoulders roll forward.',
    tip40: 'Go only to 90° at the elbow. Can’t do 6 clean reps yet? Use the assisted dip on the pull-up machine, or bench dips.',
    easier: 'Assisted dip or bench dip', harder: 'Hold a dumbbell between your feet',
    prop: null, es: -1, mus: { p: ['triceps', 'chest'], s: ['delts'] }, fn: [96, 132], ff: [92, 134],
    scene: `<line x1="70" y1="-10" x2="70" y2="180" class="frame"/><line x1="70" y1="86" x2="182" y2="86" class="frame" style="stroke-width:5"/><line x1="182" y1="86" x2="182" y2="180" class="frame"/>`,
    frames: [{ hip: [122, 72], t: -86, hn: [128, 80], hf: [124, 80], fn: [96, 132], ff: [92, 134] }, { hip: [111, 101], t: -78, hn: [128, 80], hf: [124, 80], fn: [86, 152], ff: [82, 154] }],
    tempo: [{ label: 'Lower', dur: 2 }, { label: 'Press', dur: 1 }],
  },
  // ---------------- STRETCHING (no load: never counted as training volume) ----------------
  {
    id: 'childs-pose', name: 'Child’s Pose', group: 'Stretch', equip: [], bw: true, stretch: true, timed: true,
    muscles: 'Lower back, lats, hips',
    cues: ['Kneel with big toes together and knees apart', 'Sit your hips back toward your heels and walk your hands forward', 'Rest your forehead down and breathe slowly into your back'],
    mistake: 'Forcing your hips down to your heels — let gravity do the work.',
    tip40: 'Knees complain? Put a pillow between your hips and heels. Ease in, hold for 30 seconds and stop at mild tension, never pain.',
    easier: 'A pillow under your hips or chest', harder: 'Walk your hands to one side to stretch the lats',
    prop: null, es: 1, mus: { p: ['lowback'], s: ['back'] }, fn: [70, 174], ff: [66, 174], scene: MAT,
    frames: [{ hip: [82, 140], t: 8, hn: [168, 173], hf: [164, 173] }, { hip: [72, 148], t: 14, hn: [186, 173], hf: [182, 173] }],
    tempo: [{ label: 'Ease in', dur: 2 }, { label: 'Hold & breathe', dur: 3 }],
  },
  {
    id: 'cat-cow', name: 'Cat-Cow', group: 'Stretch', equip: [], bw: true, stretch: true,
    muscles: 'Lower back, spine mobility, abs',
    cues: ['Hands under your shoulders, knees under your hips', 'Breathe out and round your back up like a cat, chin to chest', 'Breathe in and let your belly drop as you lift your chest and gaze'],
    mistake: 'Rushing — move slowly, one breath per position.',
    tip40: 'A gentle wake-up for a stiff spine. Move only as far as feels easy, and pad your knees with a folded towel.',
    easier: 'Smaller range, or seated on a chair', harder: 'Pause for 3 seconds in each position',
    prop: null, es: 1, mus: { p: ['lowback'], s: ['abs'] }, fn: [42, 174], ff: [38, 174], scene: MAT,
    frames: [{ hip: [82, 130], t: -20, hn: [136, 175], hf: [132, 175] }, { hip: [80, 127], t: -14, hn: [136, 175], hf: [132, 175] }],
    tempo: [{ label: 'Cat', dur: 2 }, { label: 'Cow', dur: 2 }],
  },
  {
    id: 'knee-chest', name: 'Knees-to-Chest', group: 'Stretch', equip: [], bw: true, stretch: true, timed: true,
    muscles: 'Lower back, glutes',
    cues: ['Lie on your back and bring both knees up', 'Hug your shins and draw your knees gently toward your chest', 'Keep your head down, shoulders relaxed, and breathe'],
    mistake: 'Yanking the knees in and lifting your head off the floor.',
    tip40: 'One of the kindest moves for a sore lower back. Hold behind the thighs if your knees don’t like deep bending, and stop at mild tension.',
    easier: 'One knee at a time', harder: 'Rock gently side to side',
    prop: null, es: 1, mus: { p: ['lowback'], s: ['glutes'] }, fn: [168, 130], ff: [164, 130], scene: MAT,
    frames: [{ hip: [130, 162], t: 180, hn: [130, 126], hf: [126, 126] }, { hip: [130, 162], t: 180, hn: [114, 132], hf: [110, 132], fn: [140, 118], ff: [136, 118] }],
    tempo: [{ label: 'Ease in', dur: 2 }, { label: 'Hold & breathe', dur: 3 }],
  },
  {
    id: 'supine-twist', name: 'Lying Spinal Twist', group: 'Stretch', equip: [], bw: true, stretch: true, timed: true,
    muscles: 'Lower back, glutes, obliques',
    cues: ['Lie on your back, arms out wide, one knee bent', 'Let the bent knee drop slowly across your body', 'Keep both shoulders down and breathe into the twist'],
    mistake: 'Forcing the knee to the floor — let it hang where it lands.',
    tip40: 'Twist gently and let gravity do it. Put a pillow under the knee if it doesn’t reach the floor, and hold 30 seconds per side.',
    easier: 'A pillow under the knee', harder: 'Straighten the top leg',
    prop: null, es: 1, mus: { p: ['lowback'], s: ['glutes', 'abs'] }, fn: [160, 176], ff: [210, 176], scene: MAT,
    frames: [{ hip: [130, 162], t: 180, hn: [18, 172], hf: [14, 172] }, { hip: [130, 162], t: 180, hn: [18, 172], hf: [14, 172], fn: [134, 170] }],
    tempo: [{ label: 'Ease in', dur: 2 }, { label: 'Hold & breathe', dur: 3 }],
  },
  {
    id: 'hamstring-stretch', name: 'Lying Hamstring Stretch', group: 'Stretch', equip: [], bw: true, stretch: true, timed: true,
    muscles: 'Hamstrings, calves',
    cues: ['Lie on your back, a towel or strap around one foot if you have one', 'Raise the leg, keeping it nearly straight', 'Ease it toward you until you feel a gentle pull, then breathe'],
    mistake: 'Locking the knee hard or lifting your hips off the floor.',
    tip40: 'Tight hamstrings pull on your lower back. Keep a soft knee, hold 30 seconds, and stop at mild tension — never bounce.',
    easier: 'Bend the other knee, foot flat', harder: 'Flex your foot toward you',
    prop: null, es: 1, mus: { p: ['hams'], s: ['calves'] }, fn: [184, 100], ff: [210, 176], scene: MAT,
    frames: [{ hip: [130, 162], t: 180, hn: [138, 134], hf: [134, 134] }, { hip: [130, 162], t: 180, hn: [128, 126], hf: [124, 126], fn: [134, 79] }],
    tempo: [{ label: 'Ease in', dur: 2 }, { label: 'Hold & breathe', dur: 3 }],
  },
  {
    id: 'quad-stretch', name: 'Standing Quad Stretch', group: 'Stretch', equip: [], bw: true, stretch: true, timed: true,
    muscles: 'Quads, hip flexors',
    cues: ['Stand tall with one hand on a wall', 'Hold your ankle and bring your heel toward your glutes', 'Knees side by side, squeeze your glutes and breathe'],
    mistake: 'Arching your lower back or letting the knee flare out.',
    tip40: 'Hold a wall for balance — no wobbling. Can’t reach your ankle? Loop a towel around it. Stop at mild tension.',
    easier: 'Lying on your side', harder: 'Tuck your pelvis under for more stretch',
    prop: null, es: 1, mus: { p: ['quads'], s: [] }, fn: [100, 104], ff: [120, 176], scene: wall(170),
    frames: [{ ...STAND, hn: [102, 106], hf: [166, 62] }, { ...STAND, hn: [100, 100], hf: [166, 60], fn: [98, 98] }],
    tempo: [{ label: 'Ease in', dur: 2 }, { label: 'Hold & breathe', dur: 3 }],
  },
  {
    id: 'hip-flexor', name: 'Kneeling Hip Flexor Stretch', group: 'Stretch', equip: [], bw: true, stretch: true, timed: true,
    muscles: 'Hip flexors, quads, glutes',
    cues: ['Kneel on one knee, the other foot flat in front', 'Tuck your tailbone under and squeeze the glute of the back leg', 'Shift your hips forward until you feel the front of the hip open'],
    mistake: 'Arching your lower back instead of tucking the pelvis.',
    tip40: 'Hours of sitting shorten these muscles. Pad the knee on the floor, ease in, and hold 30 seconds a side at mild tension.',
    easier: 'Hold a chair for balance', harder: 'Reach the same-side arm overhead',
    prop: null, es: 1, mus: { p: ['quads'], s: ['glutes'] }, fn: [46, 174], ff: [152, 176], scene: MAT,
    frames: [{ hip: [104, 134], t: -90, hn: [140, 132], hf: [136, 132] }, { hip: [116, 142], t: -92, hn: [114, 30], hf: [146, 136] }],
    tempo: [{ label: 'Ease in', dur: 2 }, { label: 'Hold & breathe', dur: 3 }],
  },
  {
    id: 'figure-four', name: 'Figure-4 Glute Stretch', group: 'Stretch', equip: [], bw: true, stretch: true, timed: true,
    muscles: 'Glutes, outer hips, lower back',
    cues: ['Lie on your back, cross one ankle over the other knee', 'Reach through and hold behind the lower thigh', 'Draw it toward your chest until you feel it deep in the glute'],
    mistake: 'Lifting your head and shoulders to pull harder.',
    tip40: 'Kinder to your knees and back than the seated pigeon. Keep your head down, ease in, and hold 30 seconds per side.',
    easier: 'Keep the bottom foot on the floor', harder: 'Gently press the crossed knee away',
    prop: null, es: 1, ks: -1, ksf: 1, mus: { p: ['glutes'], s: ['lowback'] }, fn: [158, 130], ff: [164, 176], scene: MAT,
    frames: [{ hip: [130, 162], t: 180, hn: [112, 174], hf: [108, 174] }, { hip: [130, 162], t: 180, hn: [108, 126], hf: [104, 126], fn: [112, 130], ff: [146, 118] }],
    tempo: [{ label: 'Ease in', dur: 2 }, { label: 'Hold & breathe', dur: 3 }],
  },
  {
    id: 'calf-stretch', name: 'Wall Calf Stretch', group: 'Stretch', equip: [], bw: true, stretch: true, timed: true,
    muscles: 'Calves, Achilles',
    cues: ['Hands on a wall, one foot stepped back', 'Back leg straight, heel pressed into the floor', 'Lean your hips toward the wall until the calf stretches, then breathe'],
    mistake: 'Letting the back heel lift or the foot turn out.',
    tip40: 'Tight calves are behind a lot of foot and Achilles trouble after 40. Hold 30 seconds, then bend the back knee slightly to reach the lower calf.',
    easier: 'Shorter step back', harder: 'Toes up against the wall',
    prop: null, es: -1, mus: { p: ['calves'], s: [] }, fn: [82, 176], ff: [146, 176], scene: wall(184),
    frames: [{ hip: [124, 104], t: -68, hn: [180, 52], hf: [178, 56] }, { hip: [132, 108], t: -64, hn: [180, 52], hf: [178, 56] }],
    tempo: [{ label: 'Ease in', dur: 2 }, { label: 'Hold & breathe', dur: 3 }],
  },
  {
    id: 'cross-shoulder', name: 'Cross-Body Shoulder Stretch', group: 'Stretch', equip: [], bw: true, stretch: true, timed: true,
    muscles: 'Rear shoulders, upper back',
    cues: ['Stand tall and bring one arm across your chest', 'Hold it above the elbow with your other hand', 'Draw it gently toward you, shoulders down, and breathe'],
    mistake: 'Shrugging the shoulder up or pulling on the elbow joint itself.',
    tip40: 'Keep the shoulder relaxed and down. Pull above the elbow, never on it, and stop at mild tension.',
    easier: 'Less pull, arm lower', harder: 'Turn your chest slightly away from the arm',
    prop: null, es: 1, esf: -1, mus: { p: ['delts'], s: ['back'] }, ...STAND_FEET,
    frames: [{ ...STAND, hn: [178, 56], hf: [124, 102] }, { ...STAND, hn: [178, 46], hf: [150, 48] }],
    tempo: [{ label: 'Ease in', dur: 2 }, { label: 'Hold & breathe', dur: 3 }],
  },
  {
    id: 'triceps-stretch', name: 'Overhead Triceps Stretch', group: 'Stretch', equip: [], bw: true, stretch: true, timed: true,
    muscles: 'Triceps, shoulders',
    cues: ['Raise one arm and bend the elbow so your hand drops behind your head', 'Hold the elbow with your other hand', 'Ease the elbow back and breathe, ribs down'],
    mistake: 'Arching your back to push the elbow further.',
    tip40: 'Shoulders tight overhead? Hold a towel behind your back instead. Ease in and stop at mild tension, never pain.',
    easier: 'Hold a towel behind your back', harder: 'Lean slightly away from the bent arm',
    prop: null, es: -1, mus: { p: ['triceps'], s: ['delts'] }, ...STAND_FEET,
    frames: [{ ...STAND, hf: [122, -20], hn: [134, 12] }, { ...STAND, hf: [108, 30], hn: [134, 10] }],
    tempo: [{ label: 'Ease in', dur: 2 }, { label: 'Hold & breathe', dur: 3 }],
  },
  {
    id: 'doorway-chest', name: 'Doorway Chest Stretch', group: 'Stretch', equip: [], bw: true, stretch: true, timed: true,
    muscles: 'Chest, front shoulders, biceps',
    cues: ['Forearm on a door frame, elbow at shoulder height', 'Step forward with the same-side foot', 'Let your chest open until you feel the stretch, then breathe'],
    mistake: 'Leaning in too far and feeling it in the front of the shoulder joint.',
    tip40: 'Undoes hours of hunching over a desk or phone. Keep the elbow at or below shoulder height and ease in gently.',
    easier: 'Smaller step forward', harder: 'Raise the elbow slightly for the upper chest',
    prop: null, es: 1, mus: { p: ['chest'], s: ['delts', 'biceps'] }, ...STAND_FEET, scene: wall(84),
    frames: [{ ...STAND, hn: [97, 16], hf: [124, 102] }, { hip: [128, 95], t: -84, hn: [97, 16], hf: [132, 104], fn: [142, 176], ff: [112, 176] }],
    tempo: [{ label: 'Ease in', dur: 2 }, { label: 'Hold & breathe', dur: 3 }],
  },
  {
    id: 'biceps-stretch', name: 'Wall Biceps Stretch', group: 'Stretch', equip: [], bw: true, stretch: true, timed: true,
    muscles: 'Biceps, chest, forearms',
    cues: ['Stand beside a wall, palm flat on it just behind you', 'Arm straight, thumb up, at shoulder height or a little lower', 'Turn your chest slowly away until the biceps stretches'],
    mistake: 'Locking the elbow hard or twisting fast.',
    tip40: 'Keep a tiny bend in the elbow and turn slowly. Lower the hand if the front of the shoulder pinches.',
    easier: 'Hand lower on the wall', harder: 'Turn your palm down toward the floor',
    prop: null, es: 1, mus: { p: ['biceps'], s: ['chest', 'forearms'] }, ...STAND_FEET, scene: wall(50),
    frames: [{ ...STAND, hn: [62, 56], hf: [124, 102] }, { hip: [126, 94], t: -88, hn: [63, 46], hf: [130, 103], fn: [130, 176], ff: [122, 176] }],
    tempo: [{ label: 'Ease in', dur: 2 }, { label: 'Hold & breathe', dur: 3 }],
  },
  {
    id: 'wrist-stretch', name: 'Wrist & Forearm Stretch', group: 'Stretch', equip: [], bw: true, stretch: true, timed: true,
    muscles: 'Forearms, wrists',
    cues: ['Arm straight out in front, palm facing forward', 'Gently pull your fingers back with the other hand', 'Hold and breathe, then flip the palm down to stretch the top'],
    mistake: 'Cranking the fingers back hard — wrists need gentle pressure.',
    tip40: 'Great for desk wrists and before push-ups. Pull lightly, hold 20–30 seconds, and stop at mild tension, never tingling.',
    easier: 'Bend the elbow slightly', harder: 'Palms on the floor, fingers pointing back',
    prop: null, es: 1, mus: { p: ['forearms'], s: [] }, ...STAND_FEET,
    frames: [{ ...STAND, hn: [174, 74], hf: [166, 80] }, { ...STAND, hn: [182, 44], hf: [180, 32] }],
    tempo: [{ label: 'Ease in', dur: 2 }, { label: 'Hold & breathe', dur: 3 }],
  },
];

const WARMUPS = [
  {
    id: 'wu-swings', name: 'Arm Swings', note: '30 sec',
    prop: null, es: 1, mus: { p: ['delts'], s: [] }, ...STAND_FEET,
    frames: [{ ...STAND, hn: [122, 103] }, { ...STAND, hn: [126, -20] }],
    tempo: [{ label: 'Up', dur: 1 }, { label: 'Down', dur: 1 }],
  },
  {
    id: 'wu-hinge', name: 'Hip Hinges', note: '10 reps',
    prop: null, es: 1, mus: { p: ['hams', 'glutes'], s: [] }, ...STAND_FEET,
    frames: [{ ...STAND, hn: [124, 92] }, { hip: [94, 102], t: -14, hn: [100, 100] }],
    tempo: [{ label: 'Hinge', dur: 1.5 }, { label: 'Stand', dur: 1 }],
  },
  {
    id: 'wu-squat', name: 'Bodyweight Squats', note: '10 reps',
    prop: null, es: 1, mus: { p: ['quads', 'glutes'], s: [] }, ...STAND_FEET,
    frames: [{ ...STAND, hn: [122, 103] }, { hip: [96, 138], t: -60, hn: [174, 92] }],
    tempo: [{ label: 'Sit down', dur: 1.5 }, { label: 'Stand', dur: 1 }],
  },
];

// Workouts A and B are the classic days (A is the free one). C–F are retired (hidden) — plan routines
// are built from PLAN_TEMPLATES below. lo/hi = rep range; rest in seconds.
const PROGRAM = {
  A: {
    name: 'Workout A', focus: 'Full body · dumbbell day',
    items: [
      { id: 'goblet-squat', sets: 3, lo: 10, hi: 12, rest: 90 },
      { id: 'db-bench', sets: 3, lo: 8, hi: 12, rest: 90 },
      { id: 'db-row', sets: 3, lo: 10, hi: 12, rest: 60, perSide: true },
      { id: 'db-rdl', sets: 3, lo: 10, hi: 12, rest: 90 },
      { id: 'db-shoulder', sets: 2, lo: 10, hi: 12, rest: 60 },
      { id: 'db-curl', sets: 2, lo: 10, hi: 12, rest: 60 },
    ],
  },
  B: {
    name: 'Workout B', focus: 'Full body · barbell day',
    items: [
      { id: 'back-squat', sets: 3, lo: 8, hi: 10, rest: 90 },
      { id: 'incline-db', sets: 3, lo: 8, hi: 12, rest: 90 },
      { id: 'bb-row', sets: 3, lo: 8, hi: 12, rest: 90 },
      { id: 'hip-thrust', sets: 3, lo: 10, hi: 12, rest: 90 },
      { id: 'split-squat', sets: 2, lo: 8, hi: 10, rest: 60, perSide: true },
      { id: 'skull-crusher', sets: 2, lo: 10, hi: 12, rest: 60 },
      { id: 'farmer-carry', sets: 3, lo: 30, hi: 40, rest: 60, timed: true },
    ],
  },
  C: { // retired: kept so old logs still show their name
    hidden: true, name: 'Workout C', focus: 'Upper body · press & pull',
    items: [
      { id: 'bb-ohp', sets: 3, lo: 6, hi: 10, rest: 90 },
      { id: 'db-bench', sets: 3, lo: 8, hi: 12, rest: 90 },
      { id: 'cs-row', sets: 3, lo: 10, hi: 12, rest: 60 },
      { id: 'chin-up', sets: 3, lo: 3, hi: 8, rest: 120 },
      { id: 'lateral-raise', sets: 2, lo: 12, hi: 15, rest: 45 },
      { id: 'bench-dip', sets: 2, lo: 8, hi: 12, rest: 60 },
    ],
  },
  D: { // retired: kept so old logs still show their name
    hidden: true, name: 'Workout D', focus: 'Lower body & core',
    items: [
      { id: 'back-squat', sets: 3, lo: 6, hi: 8, rest: 120 },
      { id: 'bb-rdl', sets: 3, lo: 8, hi: 10, rest: 90 },
      { id: 'reverse-lunge', sets: 2, lo: 8, hi: 12, rest: 60, perSide: true },
      { id: 'calf-raise', sets: 3, lo: 12, hi: 20, rest: 45 },
      { id: 'side-plank', sets: 2, lo: 20, hi: 40, rest: 45, timed: true, perSide: true },
      { id: 'dead-bug', sets: 2, lo: 6, hi: 10, rest: 45, perSide: true },
    ],
  },
  E: { // retired: kept so old logs still show their name
    hidden: true, name: 'Workout E', focus: 'Full body · back & chest',
    items: [
      { id: 'pull-up', sets: 3, lo: 3, hi: 8, rest: 120 },
      { id: 'incline-db', sets: 3, lo: 8, hi: 12, rest: 90 },
      { id: 'goblet-squat', sets: 3, lo: 10, hi: 12, rest: 90 },
      { id: 'db-rdl', sets: 3, lo: 10, hi: 12, rest: 90 },
      { id: 'db-pullover', sets: 2, lo: 10, hi: 12, rest: 60 },
      { id: 'y-raise', sets: 2, lo: 10, hi: 12, rest: 45 },
    ],
  },
  F: { // retired: kept so old logs still show their name
    hidden: true, name: 'Workout F', focus: 'Full body · arms & carries',
    items: [
      { id: 'split-squat', sets: 3, lo: 8, hi: 10, rest: 60, perSide: true },
      { id: 'bb-row', sets: 3, lo: 8, hi: 12, rest: 90 },
      { id: 'push-up', sets: 3, lo: 8, hi: 15, rest: 60 },
      { id: 'db-curl', sets: 3, lo: 10, hi: 12, rest: 60 },
      { id: 'skull-crusher', sets: 2, lo: 10, hi: 12, rest: 60 },
      { id: 'farmer-carry', sets: 3, lo: 30, hi: 40, rest: 60, timed: true },
      { id: 'knee-raise', sets: 2, lo: 8, hi: 12, rest: 60 },
    ],
  },
  // ---- Calisthenics: pick a full-body day or one area to focus on ----
  CF: {
    name: 'Calisthenics', chip: 'Full body', badge: 'Fb', cali: true, focus: 'Full body · bodyweight', mins: 40,
    items: [
      { id: 'push-up', sets: 3, lo: 8, hi: 15, rest: 90 },
      { id: 'inverted-row', sets: 3, lo: 8, hi: 12, rest: 90 },
      { id: 'reverse-lunge', sets: 3, lo: 8, hi: 12, rest: 60, perSide: true },
      { id: 'pike-pushup', sets: 2, lo: 6, hi: 10, rest: 90 },
      { id: 'glute-bridge', sets: 3, lo: 12, hi: 15, rest: 60 },
      { id: 'plank', sets: 3, lo: 30, hi: 45, rest: 60, timed: true },
    ],
  },
  CL: {
    name: 'Calisthenics · Legs', chip: 'Legs', badge: 'Lg', cali: true, focus: 'Quads, glutes, hamstrings', mins: 30,
    items: [
      { id: 'bw-squat', sets: 3, lo: 15, hi: 20, rest: 60 },
      { id: 'reverse-lunge', sets: 3, lo: 8, hi: 12, rest: 60, perSide: true },
      { id: 'glute-bridge', sets: 3, lo: 12, hi: 15, rest: 60 },
      { id: 'wall-sit', sets: 3, lo: 30, hi: 60, rest: 60, timed: true },
      { id: 'calf-raise', sets: 3, lo: 12, hi: 20, rest: 45 },
    ],
  },
  CC: {
    name: 'Calisthenics · Chest', chip: 'Chest', badge: 'Ch', cali: true, focus: 'Chest, shoulders, triceps', mins: 30,
    items: [
      { id: 'decline-pushup', sets: 3, lo: 6, hi: 12, rest: 90 },
      { id: 'push-up', sets: 3, lo: 8, hi: 15, rest: 90 },
      { id: 'incline-pushup', sets: 2, lo: 12, hi: 20, rest: 60 },
      { id: 'shoulder-tap', sets: 2, lo: 8, hi: 12, rest: 60, perSide: true },
    ],
  },
  CB: {
    name: 'Calisthenics · Back', chip: 'Back', badge: 'Bk', cali: true, focus: 'Lats, upper & lower back', mins: 30,
    items: [
      { id: 'pull-up', sets: 3, lo: 3, hi: 8, rest: 120 },
      { id: 'inverted-row', sets: 3, lo: 8, hi: 12, rest: 90 },
      { id: 'chin-up', sets: 2, lo: 3, hi: 8, rest: 120 },
      { id: 'superman', sets: 3, lo: 10, hi: 12, rest: 45 },
    ],
  },
  CS: {
    name: 'Calisthenics · Shoulders', chip: 'Shoulders', badge: 'Sh', cali: true, focus: 'Front, side & rear delts', mins: 25,
    items: [
      { id: 'pike-pushup', sets: 3, lo: 6, hi: 10, rest: 90 },
      { id: 'y-raise', sets: 3, lo: 10, hi: 12, rest: 45 },
      { id: 'lateral-raise', sets: 3, lo: 10, hi: 15, rest: 45 },
      { id: 'decline-pushup', sets: 2, lo: 6, hi: 12, rest: 90 },
      { id: 'shoulder-tap', sets: 2, lo: 8, hi: 12, rest: 60, perSide: true },
    ],
  },
  CA: {
    name: 'Calisthenics · Arms', chip: 'Arms', badge: 'Ar', cali: true, focus: 'Biceps, triceps, grip', mins: 25,
    items: [
      { id: 'chin-up', sets: 3, lo: 3, hi: 8, rest: 120 },
      { id: 'diamond-pushup', sets: 3, lo: 6, hi: 12, rest: 90 },
      { id: 'bench-dip', sets: 3, lo: 8, hi: 12, rest: 60 },
      { id: 'knee-raise', sets: 2, lo: 8, hi: 12, rest: 60 },
    ],
  },
  CX: {
    name: 'Calisthenics · Core', chip: 'Core', badge: 'Co', cali: true, focus: 'Abs & deep core', mins: 20,
    items: [
      { id: 'plank', sets: 3, lo: 30, hi: 60, rest: 45, timed: true },
      { id: 'dead-bug', sets: 3, lo: 6, hi: 10, rest: 45, perSide: true },
      { id: 'side-plank', sets: 2, lo: 20, hi: 40, rest: 45, timed: true, perSide: true },
      { id: 'knee-raise', sets: 3, lo: 8, hi: 12, rest: 60 },
      { id: 'shoulder-tap', sets: 2, lo: 8, hi: 12, rest: 45, perSide: true },
    ],
  },
  // ---- Stretching: short mobility routines (logged as sessions, never as training load) ----
  SF: {
    name: 'Stretch · Full body', chip: 'Full body', badge: 'S', stretch: true, focus: 'Back, hips, legs, shoulders, chest', mins: 10,
    items: [
      { id: 'childs-pose', sets: 2, lo: 20, hi: 30, rest: 10, timed: true },
      { id: 'cat-cow', sets: 2, lo: 8, hi: 10, rest: 10 },
      { id: 'hip-flexor', sets: 2, lo: 20, hi: 30, rest: 10, timed: true, perSide: true },
      { id: 'hamstring-stretch', sets: 2, lo: 20, hi: 30, rest: 10, timed: true, perSide: true },
      { id: 'figure-four', sets: 2, lo: 20, hi: 30, rest: 10, timed: true, perSide: true },
      { id: 'cross-shoulder', sets: 2, lo: 20, hi: 30, rest: 10, timed: true, perSide: true },
      { id: 'doorway-chest', sets: 2, lo: 20, hi: 30, rest: 10, timed: true, perSide: true },
      { id: 'triceps-stretch', sets: 2, lo: 20, hi: 30, rest: 10, timed: true, perSide: true },
    ],
  },
  SB: {
    name: 'Stretch · Lower back', chip: 'Lower back', badge: 'Lb', stretch: true, focus: 'Lower back, hips, glutes', mins: 8,
    items: [
      { id: 'cat-cow', sets: 2, lo: 8, hi: 10, rest: 10 },
      { id: 'childs-pose', sets: 2, lo: 20, hi: 30, rest: 10, timed: true },
      { id: 'knee-chest', sets: 2, lo: 20, hi: 30, rest: 10, timed: true },
      { id: 'supine-twist', sets: 2, lo: 20, hi: 30, rest: 10, timed: true, perSide: true },
      { id: 'figure-four', sets: 2, lo: 20, hi: 30, rest: 10, timed: true, perSide: true },
      { id: 'hip-flexor', sets: 2, lo: 20, hi: 30, rest: 10, timed: true, perSide: true },
    ],
  },
  SL: {
    name: 'Stretch · Legs', chip: 'Legs', badge: 'SL', stretch: true, focus: 'Hamstrings, quads, hips, calves', mins: 8,
    items: [
      { id: 'hamstring-stretch', sets: 2, lo: 20, hi: 30, rest: 10, timed: true, perSide: true },
      { id: 'quad-stretch', sets: 2, lo: 20, hi: 30, rest: 10, timed: true, perSide: true },
      { id: 'hip-flexor', sets: 2, lo: 20, hi: 30, rest: 10, timed: true, perSide: true },
      { id: 'figure-four', sets: 2, lo: 20, hi: 30, rest: 10, timed: true, perSide: true },
      { id: 'calf-stretch', sets: 2, lo: 20, hi: 30, rest: 10, timed: true, perSide: true },
    ],
  },
  SU: {
    name: 'Stretch · Arms & shoulders', chip: 'Arms & shoulders', badge: 'SU', stretch: true, focus: 'Shoulders, chest, arms, wrists', mins: 7,
    items: [
      { id: 'cross-shoulder', sets: 2, lo: 20, hi: 30, rest: 10, timed: true, perSide: true },
      { id: 'triceps-stretch', sets: 2, lo: 20, hi: 30, rest: 10, timed: true, perSide: true },
      { id: 'doorway-chest', sets: 2, lo: 20, hi: 30, rest: 10, timed: true, perSide: true },
      { id: 'biceps-stretch', sets: 2, lo: 20, hi: 30, rest: 10, timed: true, perSide: true },
      { id: 'wrist-stretch', sets: 2, lo: 20, hi: 30, rest: 10, timed: true, perSide: true },
    ],
  },
};

// Body areas for focusing the library, derived from each lift's primary muscles
const AREAS = {
  Chest: ['chest'], Back: ['back', 'lowback'], Shoulders: ['delts'], Arms: ['biceps', 'triceps', 'forearms'],
  Legs: ['quads', 'hams', 'glutes', 'calves'], Core: ['abs'],
};

// ---------------------------------------------------------------------------
// Rig
// ---------------------------------------------------------------------------
const IronRig = (() => {
  const NS = 'http://www.w3.org/2000/svg';
  const L = { thigh: 42, shin: 42, torso: 54, upper: 32, fore: 32, neck: 7, head: 10 };

  const el = (tag, attrs, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };

  // 2-bone IK: returns [joint, end]. s picks which side the joint bends to.
  function ik(a, t, l1, l2, s) {
    let d = Math.hypot(t[0] - a[0], t[1] - a[1]);
    // Soft limit: approach full extension smoothly instead of locking with a visible snap
    const max = l1 + l2, soft = max * 0.965;
    if (d > soft) d = soft + (max - soft) * (1 - Math.exp(-(d - soft) / (max - soft)));
    d = Math.max(d, Math.abs(l1 - l2) + 0.01);
    const base = Math.atan2(t[1] - a[1], t[0] - a[0]);
    const ang = Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d));
    const j = base - s * ang;
    const jx = a[0] + l1 * Math.cos(j), jy = a[1] + l1 * Math.sin(j);
    const e = Math.atan2(t[1] - jy, t[0] - jx);
    return [[jx, jy], [jx + l2 * Math.cos(e), jy + l2 * Math.sin(e)]];
  }

  const headAngle = (t) => (t > -100 && t < -12 ? t + (-90 - t) * 0.3 : t);
  function solve(p, ex) {
    const t = (p.t * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t);
    const hip = p.hip;
    const sh = [hip[0] + L.torso * c, hip[1] + L.torso * s];
    // Head: when hinged forward on your feet the gaze lifts a little toward the horizon (neutral neck)
    const na = headAngle(p.t), nc = Math.cos((na * Math.PI) / 180), ns = Math.sin((na * Math.PI) / 180);
    const hd = [sh[0] + (L.neck + L.head) * nc, sh[1] + (L.neck + L.head) * ns];
    const hnT = p.hn, hfT = p.hf || [hnT[0] - 4, hnT[1]];
    const fnT = p.fn || ex.fn, ffT = p.ff || ex.ff || [fnT[0] - 6, fnT[1]];
    const es = ex.es ?? 1, ks = ex.ks ?? 1;
    const aN = p.aS ?? 1, aF = p.aSf ?? aN; // arm length scale: <1 reads as the arm reaching toward the viewer
    const [en, hn] = ik(sh, hnT, L.upper * aN, L.fore * aN, es);
    const [ef, hf] = ik(sh, hfT, L.upper * aF, L.fore * aF, ex.esf ?? es);
    const lN = p.lS ?? 1, lF = p.lSf ?? lN; // leg length scale: <1 reads as the leg turning toward/away from the viewer (hip abduction)
    const [kn, an] = ik(hip, fnT, L.thigh * lN, L.shin * lN, ks);
    const [kf, af] = ik(hip, ffT, L.thigh * lF, L.shin * lF, ex.ksf ?? ks);
    return { hip, sh, hd, en, hn, ef, hf, kn, an, kf, af };
  }

  const lerp = (a, b, u) => {
    if (typeof a === 'number') return a + (b - a) * u;
    if (Array.isArray(a)) return a.map((v, i) => lerp(v, b[i], u));
    if (a && typeof a === 'object') {
      const o = {};
      for (const k in a) o[k] = k in b ? lerp(a[k], b[k], u) : a[k];
      return o;
    }
    return a;
  };
  // Smootherstep with a brief settle at each end, like a coached rep (no robotic constant speed)
  const ease = (u) => { const v = Math.min(1, Math.max(0, (u - 0.07) / 0.86)); return v * v * v * (v * (6 * v - 15) + 10); };

  // Detect moves where toes, hips and shoulders stay collinear in every key frame (push-up family)
  const lineCache = new WeakMap();
  function straightLine(ex) {
    if (lineCache.has(ex)) return lineCache.get(ex);
    let res = null;
    const feetOf = (f) => f.fn || ex.fn;
    const ok = ex.frames.length > 1 && ex.frames.every((f) => {
      const F = feetOf(f); if (!F) return false;
      const ang = (Math.atan2(f.hip[1] - F[1], f.hip[0] - F[0]) * 180) / Math.PI;
      return Math.abs(ang - f.t) < 4 && Math.abs(f.t) < 45;
    });
    if (ok) {
      const dist = (f) => Math.hypot(f.hip[0] - feetOf(f)[0], f.hip[1] - feetOf(f)[1]);
      res = { feet: (p) => p.fn || ex.fn, r: (p, a, b, u) => dist(a) + (dist(b) - dist(a)) * u };
    }
    lineCache.set(ex, res);
    return res;
  }
  function poseAt(ex, time) {
    const total = ex.tempo.reduce((s, p) => s + p.dur, 0);
    let tt = ((time % total) + total) % total;
    for (let i = 0; i < ex.frames.length; i++) {
      const dur = ex.tempo[i].dur;
      if (tt <= dur) {
        const a = ex.frames[i], b = ex.frames[(i + 1) % ex.frames.length];
        const pose = lerp(a, b, ease(tt / dur));
        const line = straightLine(ex);
        if (line) { // rotate the rigid body about the toes instead of letting the hips sag mid-rep
          const ang = (pose.t * Math.PI) / 180;
          const F = line.feet(pose), r = line.r(pose, a, b, ease(tt / dur));
          pose.hip = [F[0] + r * Math.cos(ang), F[1] + r * Math.sin(ang)];
        }
        return { pose, phase: ex.tempo[i], index: i };
      }
      tt -= dur;
    }
    return { pose: ex.frames[0], phase: ex.tempo[0], index: 0 };
  }

  // ---- Mannequin: limbs are tapered two-half shapes (front/back muscle),
  // torso is a side-profile split into chest/abs/back/low-back/glutes.
  // Half-widths per segment side: [start, belly, end].
  const W = {
    thigh: { f: [10, 12, 7], b: [10, 10.5, 7] },   // quads / hamstrings
    shin: { f: [6, 5.5, 4], b: [7, 9.5, 4] },      // shin / calves
    upper: { f: [6.5, 7.5, 5], b: [6.5, 8, 5] },   // biceps / triceps
    fore: { f: [5.5, 6, 3.5], b: [5.5, 5.5, 3.5] }, // forearms
  };
  const LIMB_MUSCLE = { thigh: ['quads', 'hams'], shin: [null, 'calves'], upper: ['biceps', 'triceps'], fore: ['forearms', 'forearms'] };
  // torso profile (t along hip->shoulder, offset from spine axis)
  const FRONT = [[-0.14, 7], [0, 11], [0.3, 11], [0.5, 10], [0.7, 14], [0.88, 13], [1.02, 6]];
  const BACK = [[-0.14, 9], [0.02, 16], [0.16, 14.5], [0.36, 9], [0.56, 11], [0.8, 13.5], [1.02, 8]];
  const TORSO_REGIONS = [
    ['pelvis', 1, -0.14, 0.05], ['abs', 1, 0.05, 0.55], ['chest', 1, 0.55, 1.02],
    ['glutes', -1, -0.14, 0.22], ['lowback', -1, 0.22, 0.5], ['back', -1, 0.5, 1.02],
  ];
  const prof = (pts, t) => {
    for (let i = 0; i < pts.length - 1; i++) {
      const [t0, v0] = pts[i], [t1, v1] = pts[i + 1];
      if (t <= t1) { const u = (t - t0) / (t1 - t0); return v0 + (v1 - v0) * (0.5 - 0.5 * Math.cos(Math.PI * u)); }
    }
    return pts[pts.length - 1][1];
  };
  const f1 = (n) => n.toFixed(1);

  function muscleClass(ex, m) {
    if (!m) return 'm';
    if (ex.mus?.p.includes(m)) return 'm on';
    if (ex.mus?.s.includes(m)) return 'm sec';
    return 'm';
  }

  function buildFigure(g, ex) {
    const f = { limbs: [], joints: [], torso: [] };
    const side = (far) => el('g', { class: far ? 'far' : 'near' }, g);
    const limb = (parent, name) => {
      const [mf, mb] = LIMB_MUSCLE[name];
      return { name, f: el('path', { class: muscleClass(ex, mf) }, parent), b: el('path', { class: muscleClass(ex, mb) }, parent) };
    };
    const joint = (parent, r) => el('circle', { r, class: 'm joint' }, parent);

    const core = (parent, w) => el('path', { class: 'limbcore', 'stroke-width': w }, parent);
    if (ex.lever) f.lever = el('line', { class: 'lever' }, g); // behind the body
    if (ex.cable) f.cable = el('line', { class: 'cable' }, g);
    const farG = side(true);
    const farLeg = core(farG, 15), farArm = core(farG, 9.5);
    f.far = { footAng: ex.footAng,
      jK: joint(farG, 7), jE: joint(farG, 5.5), jA: joint(farG, 4.5),
      thigh: limb(farG, 'thigh'), shin: limb(farG, 'shin'), foot: el('path', { class: 'm joint' }, farG),
      upper: limb(farG, 'upper'), fore: limb(farG, 'fore'), hand: joint(farG, 4.5),
      delt: el('ellipse', { rx: 11, ry: 8, class: muscleClass(ex, 'delts') }, farG),
      legCore: farLeg, armCore: farArm,
    };
    const nearG = side(false);
    f.neck = el('line', { class: 'neck' }, nearG);
    f.head = el('ellipse', { rx: 9.5, ry: 10.5, class: 'm head' }, nearG);
    f.torso = TORSO_REGIONS.map(([m, s, t0, t1]) => ({ m, s, t0, t1, el: el('path', { class: muscleClass(ex, m === 'pelvis' ? null : m) }, nearG) }));
    f.near = {
      legCore: core(nearG, 15),
      jK: joint(nearG, 7), jA: joint(nearG, 4.5),
      thigh: limb(nearG, 'thigh'), shin: limb(nearG, 'shin'), foot: el('path', { class: 'm joint' }, nearG), footAng: ex.footAng,
    };
    f.propG = el('g', {}, g);
    const armG = side(false);
    f.near.armCore = core(armG, 9.5);
    Object.assign(f.near, {
      jE: joint(armG, 5.5),
      upper: limb(armG, 'upper'), fore: limb(armG, 'fore'), hand: joint(armG, 4.5),
      delt: el('ellipse', { rx: 11.5, ry: 8.5, class: muscleClass(ex, 'delts') }, armG),
    });
    f.props = [];
    const plate = (r, cls) => {
      const pg = el('g', { class: cls }, f.propG);
      el('circle', { r, class: 'plate' }, pg);
      el('circle', { r: Math.max(2, r / 5), class: 'hub' }, pg);
      return pg;
    };
    if (ex.prop === 'db') f.props = [plate(7, 'prop far-prop'), plate(7, 'prop')];
    if (ex.prop === 'db1' || ex.prop === 'dbg') f.props = [plate(8, 'prop')];
    if (ex.prop === 'bb' || ex.prop === 'bbHip') f.props = [plate(17, 'prop bar')];
    // Machine parts that move with the body: a lever arm from a fixed pivot, a cable from a pulley,
    // a foot plate (leg press), a roller pad on the shin/thigh, and handle grips
    if (ex.sled) f.sled = el('rect', { width: 7, height: 50, rx: 2.5, class: 'roller' }, f.propG);
    if (ex.pad) f.pad = el('circle', { r: ex.pad.r || 6.5, class: 'roller' }, f.propG);
    if (ex.prop === 'handle') f.props = [el('rect', { width: 5, height: 13, rx: 2.5, class: 'grip far-prop' }, f.propG), el('rect', { width: 5, height: 13, rx: 2.5, class: 'grip' }, f.propG)];
    return f;
  }

  // one half (front s=1 / back s=-1) of a tapered limb from A to B
  function half(A, B, w, s) {
    const dx = B[0] - A[0], dy = B[1] - A[1], len = Math.hypot(dx, dy) || 1;
    const nx = (dy / len) * s, ny = (-dx / len) * s;
    const M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
    const p = (P, k) => `${f1(P[0] + nx * k)} ${f1(P[1] + ny * k)}`;
    return `M${p(A, 0)} L${p(A, w[0])} Q${p(M, w[1] * 1.3)} ${p(B, w[2])} L${p(B, 0)} Z`;
  }
  function drawLimb(l, A, B) {
    l.f.setAttribute('d', half(A, B, W[l.name].f, 1));
    l.b.setAttribute('d', half(A, B, W[l.name].b, -1));
  }
  const place = (c, P) => { c.setAttribute('cx', f1(P[0])); c.setAttribute('cy', f1(P[1])); };
  const footPath = (a) => {
    if (a[1] > 156 && a[1] < 174) // heel lifted (calf raise, back foot of a lunge): foot pivots on the toes
      return `M${f1(a[0] - 4)} ${f1(a[1] - 2)} L${f1(a[0] + 4)} ${f1(a[1] - 4)} L${f1(a[0] + 17)} 177 L${f1(a[0] + 15)} 180 L${f1(a[0] + 6)} 180 Z`;
    const y = Math.min(a[1], 176), g = Math.min(y + 5, 180);
    return `M${f1(a[0] - 4)} ${f1(y - 3)} L${f1(a[0] + 4)} ${f1(y - 3)} Q${f1(a[0] + 14)} ${f1(g - 3)} ${f1(a[0] + 14)} ${f1(g)} L${f1(a[0] - 5)} ${f1(g)} Z`;
  };

  function drawSide(s, j, far) {
    const hip = j.hip, kn = far ? j.kf : j.kn, an = far ? j.af : j.an, el_ = far ? j.ef : j.en, hd = far ? j.hf : j.hn;
    place(s.jK, kn); place(s.jA, an); place(s.jE, el_); place(s.hand, hd);
    // delt: ellipse capping the shoulder, aligned with the upper arm
    const ang = Math.atan2(el_[1] - j.sh[1], el_[0] - j.sh[0]);
    const dc = [j.sh[0] + Math.cos(ang) * 5, j.sh[1] + Math.sin(ang) * 5];
    place(s.delt, dc); s.delt.setAttribute('transform', `rotate(${f1((ang * 180) / Math.PI)} ${f1(dc[0])} ${f1(dc[1])})`);
    const pl = (pts) => 'M' + pts.map((q) => f1(q[0]) + ' ' + f1(q[1])).join(' L');
    s.legCore.setAttribute('d', pl([hip, kn, an])); s.armCore.setAttribute('d', pl([j.sh, el_, hd]));
    drawLimb(s.thigh, hip, kn); drawLimb(s.shin, kn, an);
    s.foot.setAttribute('d', footPath(an));
    // feet resting on a plate (fixed angle) or hanging free ('shin': sole square to the shin, e.g. leg extension)
    const fa = s.footAng === 'shin' ? (Math.atan2(an[1] - kn[1], an[0] - kn[0]) * 180) / Math.PI - 90 : s.footAng;
    if (fa) s.foot.setAttribute('transform', `rotate(${f1(fa)} ${f1(an[0])} ${f1(an[1])})`);
    drawLimb(s.upper, j.sh, el_); drawLimb(s.fore, el_, hd);
  }

  // roller pad: a point along the near shin or thigh (u = 0 at the top joint), pushed off the front (n > 0) or back (n < 0)
  function padPos(ex, j) {
    const [A, B] = ex.pad.seg === 'thigh' ? [j.hip, j.kn] : [j.kn, j.an];
    const dx = B[0] - A[0], dy = B[1] - A[1], len = Math.hypot(dx, dy) || 1, u = ex.pad.u ?? 0.85, n = ex.pad.n ?? 0;
    return [A[0] + dx * u + (dy / len) * n, A[1] + dy * u - (dx / len) * n];
  }
  const handsMid = (j) => [(j.hn[0] + j.hf[0]) / 2, (j.hn[1] + j.hf[1]) / 2];
  const propAnchor = (ex, j) =>
    ex.pad ? padPos(ex, j)
      : ex.sled ? [j.an[0] + 9, j.an[1]]
      : ex.prop === 'bbHip' ? [j.hip[0] + 2, j.hip[1] - 17]
      : ex.prop === 'dbg' ? [(j.hn[0] + j.hf[0]) / 2, (j.hn[1] + j.hf[1]) / 2]
      : j.hn;

  function drawFigure(f, ex, pose) {
    const j = solve(pose, ex);
    drawSide(f.far, j, true);
    drawSide(f.near, j, false);
    // torso regions
    const ux = (j.sh[0] - j.hip[0]) / L.torso, uy = (j.sh[1] - j.hip[1]) / L.torso;
    const nx = -uy, ny = ux; // anatomical front normal
    const at = (t, off) => [j.hip[0] + ux * L.torso * t + nx * off, j.hip[1] + uy * L.torso * t + ny * off];
    f.torso.forEach((r) => {
      const pts = [], N = 7;
      for (let i = 0; i <= N; i++) { const t = r.t0 + ((r.t1 - r.t0) * i) / N; pts.push(at(t, r.s * prof(r.s > 0 ? FRONT : BACK, t))); }
      const a0 = at(r.t1, 0), a1 = at(r.t0, 0);
      r.el.setAttribute('d', 'M' + pts.map((p) => f1(p[0]) + ' ' + f1(p[1])).join(' L') + ` L${f1(a0[0])} ${f1(a0[1])} L${f1(a1[0])} ${f1(a1[1])} Z`);
    });
    const nb = at(1.05, 1), hc = [j.hd[0], j.hd[1]];
    f.neck.setAttribute('x1', f1(nb[0])); f.neck.setAttribute('y1', f1(nb[1]));
    f.neck.setAttribute('x2', f1(hc[0])); f.neck.setAttribute('y2', f1(hc[1]));
    place(f.head, hc);
    f.head.setAttribute('transform', `rotate(${f1((headAngle(pose.t) + 90))} ${f1(hc[0])} ${f1(hc[1])})`);
    const pos = ex.prop === 'db' ? [j.hf, j.hn] : ex.prop === 'handle' ? [[j.hf[0] - 2.5, j.hf[1] - 6.5], [j.hn[0] - 2.5, j.hn[1] - 6.5]] : [propAnchor(ex, j)];
    f.props.forEach((p, i) => p.setAttribute('transform', `translate(${f1(pos[i][0])} ${f1(pos[i][1])})`));
    const line = (l, a, b) => { l.setAttribute('x1', f1(a[0])); l.setAttribute('y1', f1(a[1])); l.setAttribute('x2', f1(b[0])); l.setAttribute('y2', f1(b[1])); };
    if (f.pad) place(f.pad, padPos(ex, j));
    if (f.sled) f.sled.setAttribute('transform', `translate(${f1(j.an[0] + 6)} ${f1(j.an[1] - 27)})`);
    if (f.lever) line(f.lever, ex.lever, ex.pad ? padPos(ex, j) : ex.sled ? [j.an[0] + 12, j.an[1]] : handsMid(j));
    if (f.cable) line(f.cable, ex.cable, handsMid(j));
    return j;
  }

  // Creates an animated (or static) demo inside `container`.
  // opts: { static: bool, onPhase(label, dur) }
  function create(container, ex, opts = {}) {
    // crop the top of the viewBox to the highest point the figure reaches
    const cyc = ex.tempo.reduce((t, p) => t + p.dur, 0);
    let minY = 180;
    for (let i = 0; i < 24; i++) {
      const j = solve(poseAt(ex, (cyc * i) / 24).pose, ex);
      const pr = ex.prop === 'bb' || ex.prop === 'bbHip' ? 18 : ex.prop ? 9 : 5;
      minY = Math.min(minY, j.hd[1] - 12, j.hn[1] - pr, j.hf[1] - pr, j.hip[1] - 20);
    }
    // keep machine pulleys, pivots and frames in view
    [ex.cable, ex.lever].forEach((pt) => { if (pt) minY = Math.min(minY, pt[1] - 10); });
    if (ex.top != null) minY = Math.min(minY, ex.top);
    const vbY = Math.min(70, Math.floor(minY) - 8), vbH = 186 - vbY;
    const svg = el('svg', { viewBox: `0 ${vbY} 240 ${vbH}`, class: 'rig', role: 'img', 'aria-label': `${ex.name} demonstration` });
    if (opts.fit) container.style.aspectRatio = `240 / ${vbH}`;
    container.appendChild(svg);
    el('line', { x1: 0, y1: 180, x2: 240, y2: 180, class: 'ground' }, svg);
    { // soft contact shadow under the figure
      const f0 = ex.frames[0], fx = ((f0.fn || ex.fn)[0] + (f0.ff || ex.ff || f0.fn || ex.fn)[0]) / 2;
      const xs = [fx, ex.frames[0].hip[0]];
      el('ellipse', { cx: (Math.min(...xs) + Math.max(...xs)) / 2 + 4, cy: 181, rx: 46 + Math.abs(xs[0] - xs[1]) / 2, ry: 6, class: 'floor' }, svg);
    }
    if (ex.scene) { const sg = el('g', { class: 'scene' }, svg); sg.innerHTML = ex.scene; }

    // Weight path: sample the prop anchor across one cycle
    const anchorPath = el('path', { class: 'wpath' }, svg);
    if (ex.prop) {
      const total = ex.tempo.reduce((s, p) => s + p.dur, 0), pts = [];
      for (let i = 0; i <= 48; i++) pts.push(propAnchor(ex, solve(poseAt(ex, (total * i) / 48).pose, ex)));
      anchorPath.setAttribute('d', 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L'));
    }

    // Thumbnails are static; the demo stages always animate. They are content the
    // user opened on purpose, so they play even with Reduce Motion (iPhone setting) on.
    if (opts.static) {
      // Ghost of the end position behind the start position
      const ghostIdx = Math.floor(ex.frames.length / 2);
      const gg = el('g', { class: 'ghost' }, svg);
      drawFigure(buildFigure(gg, ex), ex, ex.frames[ghostIdx]);
      drawFigure(buildFigure(el('g', {}, svg), ex), ex, ex.frames[0]);
      opts.onPhase?.(ex.tempo.map((p) => `${p.label} ${p.dur}s`).join(' · '), 0);
      return { play() {}, pause() {}, setSpeed() {}, isPlaying: () => false, destroy() { svg.remove(); } };
    }

    const fig = buildFigure(el('g', {}, svg), ex);
    let time = 0, last = null, speed = 1, playing = true, raf = 0, lastPhase = -1;
    const frame = (now) => {
      if (!svg.isConnected) return;
      if (last != null && playing) time += ((now - last) / 1000) * speed;
      last = now;
      const { pose, phase, index } = poseAt(ex, time);
      drawFigure(fig, ex, pose);
      if (index !== lastPhase) { lastPhase = index; opts.onPhase?.(phase.label, phase.dur); }
      opts.onTime?.(((time % cyc) + cyc) % cyc, cyc);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return {
      play() { playing = true; },
      pause() { playing = false; },
      setSpeed(s) { speed = s; },
      isPlaying: () => playing,
      seek(t) { time = t; },   // jump to any point in the rep (seconds into one cycle)
      cycle: cyc,
      destroy() { cancelAnimationFrame(raf); svg.remove(); },
    };
  }

  return { create };
})();

const EX_BY_ID = Object.fromEntries([...EXERCISES, ...WARMUPS].map((e) => [e.id, e]));

// ---------------------------------------------------------------------------
// Muscle map: stylized front/back anatomy. Right half is defined once and
// mirrored. Each region is tagged with a muscle group key.
// ---------------------------------------------------------------------------
const MUSCLES = {
  chest: 'Chest', delts: 'Shoulders', biceps: 'Biceps', triceps: 'Triceps', forearms: 'Forearms',
  back: 'Upper back', lowback: 'Lower back', abs: 'Abs', glutes: 'Glutes', quads: 'Quads', hams: 'Hamstrings', calves: 'Calves',
};
const BACK_VIEW = new Set(['back', 'lowback', 'glutes', 'hams', 'triceps']);

const MuscleMap = (() => {
  const ARM_U = 'M71 58 Q79 62 78.5 78 Q76 87 71.5 87 Q68 74 69 60 Z';
  const ARM_L = 'M71.5 89 Q80 91 80.5 105 Q79.5 118 76.5 123 L72.5 123 Q69 107 70 91 Z';
  const DELT = 'M63 35.5 Q74 34 77.5 45 Q77 55 71.5 58.5 Q66 50 63.5 40 Z';
  const FRONT = [
    [null, 'M55 29 Q62 31 68 35.5 L56 36 Z'],
    ['delts', DELT],
    ['chest', 'M51 37 L63.5 37 Q70 44 69 54 Q60 60.5 51 57.5 Z'],
    ['biceps', ARM_U], ['forearms', ARM_L],
    [null, 'M72 124.5 Q78 125 78 131 Q76 136 73 135 Q71 130 72 124.5 Z'],
    ['abs', 'M51 59.5 h6.5 v9 h-6.5 Z'], ['abs', 'M51 70.5 h6.5 v9 h-6.5 Z'], ['abs', 'M51 81.5 h6.5 v9.5 h-6.5 Z'],
    ['abs', 'M59.5 59.5 Q66 61 67 72 Q66.5 87 62.5 96 L59.5 92 Z'],
    [null, 'M51 93 L59 94 Q65 100 64.5 108 L51 112 Z'],
    ['quads', 'M53.5 112.5 L65 107 Q71.5 121 69.5 149 Q66.5 162 61 164.5 Q55 150 53.5 130 Z'],
    ['quads', 'M51 114 L52.5 114 Q54.5 135 57 151 L51.5 151 Z'],
    [null, 'M57.5 166 Q61 164.5 65 166.5 Q65.5 170 61 171 Q57.5 170 57.5 166 Z'],
    ['calves', 'M57 172.5 Q66.5 172.5 66.5 186 Q64.5 203 62 209 L58.5 209 Q55 190 57 172.5 Z'],
    [null, 'M56.5 211 L63.5 211 Q67.5 215.5 64.5 218 L55.5 218 Z'],
  ];
  const BACK = [
    ['back', 'M50.5 26 L56 27.5 Q66 32.5 69 36.5 L50.5 51 Z'],
    ['delts', DELT],
    ['back', 'M51 52.5 L68.5 38.5 Q71.5 50 67.5 64 Q62.5 80 54 86 L51 86 Z'],
    ['triceps', ARM_U], ['forearms', ARM_L],
    [null, 'M72 124.5 Q78 125 78 131 Q76 136 73 135 Q71 130 72 124.5 Z'],
    ['lowback', 'M51 87.5 L54.5 87.5 Q62 83 64 92 L64.5 100 L51 102 Z'],
    ['glutes', 'M51 103.5 L64.5 101.5 Q70.5 109 68.5 121 Q60 128.5 51 125 Z'],
    ['hams', 'M52 127 Q60 129.5 68.5 123 Q70.5 141 67 158.5 Q62 166.5 58 164.5 Q53 148 52 127 Z'],
    ['calves', 'M57 168 Q67.5 168.5 67.5 183.5 Q65.5 196 62 207 L58.5 207 Q55 190 57 168 Z'],
    [null, 'M56.5 211 L63.5 211 Q67.5 215.5 64.5 218 L55.5 218 Z'],
  ];
  // label anchor points (right side) for % bubbles
  const ANCHOR = {
    chest: [60, 47, 'f'], delts: [72, 45, 'f'], biceps: [74, 72, 'f'], forearms: [75, 105, 'f'], abs: [55, 76, 'f'],
    quads: [62, 135, 'f'], calves: [61, 188, 'b'], back: [60, 62, 'b'], lowback: [57, 94, 'b'], glutes: [60, 113, 'b'],
    hams: [61, 145, 'b'], triceps: [74, 72, 'b'],
  };

  const head = '<ellipse cx="50" cy="14" rx="9" ry="11" class="mm-base"/><path d="M45 23 h10 v8 h-10 Z" class="mm-base"/>';
  const view = (parts, cls) => {
    const body = parts.map(([m, d]) => `<path d="${d}" class="mm ${m ? 'mm-' + m : 'mm-base'}" data-m="${m || ''}"/>`).join('');
    return `<g class="${cls}">${head}<g>${body}</g><g transform="translate(100 0) scale(-1 1)">${body}</g></g>`;
  };

  // levels: { muscle: 0..1 intensity } ; opts.views: 'front' | 'back' | 'both'
  let uid = 0;
  function svg(levels = {}, opts = {}) {
    const id = 'mm' + ++uid;
    const views = opts.views || 'both';
    const both = views === 'both';
    const w = both ? 210 : 100;
    let inner = '';
    if (views !== 'back') inner += view(FRONT, 'front');
    if (views !== 'front') inner += `<g transform="translate(${both ? 110 : 0} 0)">${view(BACK, 'back')}</g>`;
    const style = Object.entries(levels).filter(([, v]) => v > 0)
      .map(([m, v]) => `#${id} .mm-${m}{fill:color-mix(in srgb, var(--mus) ${Math.round(25 + v * 75)}%, var(--mm-base))}`).join('');
    return `<svg id="${id}" viewBox="0 0 ${w} 222" class="musclemap" role="img" aria-label="Muscle map"><style>${style}</style>${inner}</svg>`;
  }
  // map for one exercise: primary full, secondary partial; picks the better view
  function forExercise(ex, views) {
    const lv = {};
    ex.mus.s.forEach((m) => (lv[m] = 0.35));
    ex.mus.p.forEach((m) => (lv[m] = 1));
    const v = views || (BACK_VIEW.has(ex.mus.p[0]) ? 'back' : 'front');
    return svg(lv, { views: v });
  }
  return { svg, forExercise, ANCHOR };
})();

// ---------------------------------------------------------------------------
// Coaching tips for the 30s profile (the 40+ profile uses each exercise's tip40)
// ---------------------------------------------------------------------------
const TIP30 = {
  'db-bench': 'Build the habit of a full, controlled range now — it keeps your shoulders healthy for decades.',
  'incline-db': 'Upper chest is the most common weak spot. Prioritise it early and your pressing stays balanced.',
  'bb-ohp': 'Strict overhead pressing builds shoulders that can handle load later. Skip the leg drive until you own it.',
  'db-shoulder': 'Neutral grip now means healthy rotator cuffs later. Treat it as a habit, not just a fix.',
  'db-row': 'Aim to row as much as you press. Desk-job shoulders need the extra pulling.',
  'bb-row': 'Use a weight you can row with a still torso. Heaving teaches your back bad habits.',
  'cs-row': 'Great for chasing heavy back volume without tiring out your lower back.',
  'db-pullover': 'A shoulder-mobility bonus disguised as a lat exercise. Keep it in your rotation.',
  'goblet-squat': 'Groove a perfect squat pattern here before chasing heavy barbell numbers.',
  'back-squat': 'This is your decade to build a big base of leg strength. Add weight slowly and steadily.',
  'db-rdl': 'Your 30s are the best time to bulletproof your back. Strong hamstrings are part of that.',
  'bb-rdl': 'Film a set once in a while — rounding creeps in as the weights climb.',
  'split-squat': 'Single-leg work catches left/right imbalances early, before they turn into injuries.',
  'hip-thrust': 'Strong glutes protect your knees and back. Load this one up progressively.',
  'db-curl': 'Slow lowering builds stronger tendons, not just bigger arms.',
  'skull-crusher': 'Keep the reps smooth. Healthy elbows are easier to keep than to fix.',
  'farmer-carry': 'Grip strength you build now pays off for decades. Carry heavy, walk tall.',
  'push-up': 'Master 20 strict push-ups and you have a strength baseline for life.',
  'incline-pushup': 'A great high-rep finisher on days your chest needs volume without strain.',
  'decline-pushup': 'Raise your feet a little more every few weeks — that’s progressive overload with no gym.',
  'diamond-pushup': 'Great triceps builder that needs no equipment. Keep your elbows tucked.',
  'pike-pushup': 'This is the first step toward handstand push-ups. Build it patiently.',
  'pull-up': 'If you only master one bodyweight lift this decade, make it the strict pull-up.',
  'chin-up': 'Great for arm and back size together. Chase clean reps, not kipping reps.',
  'inverted-row': 'Lower the bar over time to keep progressing toward pull-ups.',
  'superman': 'Cheap insurance for a lower back that spends all day sitting.',
  'y-raise': 'Balances all the pressing. Healthy shoulders start with strong rear delts.',
  'shoulder-tap': 'Builds the anti-rotation core strength that heavy lifts rely on.',
  'bench-dip': 'Stop at 90° even when it feels easy — that keeps the front of your shoulder happy.',
  'bw-squat': 'Use high reps here as conditioning, and practise a deep, controlled bottom position.',
  'reverse-lunge': 'Add a knee drive at the top to train balance and power together.',
  'glute-bridge': 'Do a few sets on rest days to undo the effects of long hours sitting.',
  'wall-sit': 'A great finisher. Add time each week instead of adding weight.',
  'plank': 'Once 60 seconds is easy, make it harder — don’t just hold longer.',
  'dead-bug': 'Teaches the core bracing you’ll use in every heavy squat and deadlift.',
  'knee-raise': 'Progress to straight-leg raises — a sign of real core strength.',
  'calf-raise': 'Train calves through a full stretch — strong ankles now prevent sprains and Achilles trouble later.',
  'lateral-raise': 'Wider shoulders come from side delts. Light weight, strict reps, lots of sets.',
  'side-plank': 'Side planks build the obliques that brace every heavy lift. Work up to 45 seconds a side.',
  'childs-pose': 'A perfect cool-down after heavy squats and deadlifts. Breathe into your back and let it decompress.',
  'cat-cow': 'Two minutes of this after a day at a desk keeps your spine moving the way it should.',
  'knee-chest': 'Use it after long drives or flights to undo the stiffness before it settles in.',
  'supine-twist': 'A gentle twist before bed loosens a back that sat all day. Let gravity do the work.',
  'hamstring-stretch': 'Flexible hamstrings now mean deeper, safer hinges and squats for years. Hold, don’t bounce.',
  'quad-stretch': 'Balance on one leg while you hold it — you train stability for free.',
  'hip-flexor': 'If you sit all day, this is the stretch you need most. Squeeze the back glute to feel it.',
  'figure-four': 'Tight glutes and outer hips pull on your knees and back. Two holds a side after leg day.',
  'calf-stretch': 'Runners and lifters alike: supple calves keep your Achilles happy and your squat deeper.',
  'cross-shoulder': 'Balance all the pressing with some rear-shoulder mobility. Pull above the elbow, not on it.',
  'triceps-stretch': 'Good overhead mobility now keeps pressing and pull-ups pain-free later.',
  'doorway-chest': 'Undo phone posture: a daily chest opener keeps your shoulders back where they belong.',
  'biceps-stretch': 'Lots of curls and pull-ups tighten the biceps. Turn away slowly and keep the elbow soft.',
  'wrist-stretch': 'Desk work, push-ups and heavy grips all load the wrists. Thirty seconds a day keeps them happy.',
  'leg-press': 'Great for piling on leg volume after squats. Push the weight up over weeks, not the depth.',
  'leg-extension': 'A strong finisher for quad size. Squeeze at the top instead of swinging heavy.',
  'leg-curl': 'Most people under-train hamstrings. Build them now and your knees thank you later.',
  'seated-calf': 'Pair this with standing calf raises: bent knees hit the deep soleus, straight knees the upper calf.',
  'chest-press': 'Use it to push close to failure safely once your free-weight presses are done.',
  'pec-deck': 'A great chest finisher. Control the stretch and the shoulders stay healthy for decades.',
  'machine-shoulder': 'Lets you train shoulders hard on days your lower back or balance is tired.',
  'lat-pulldown': 'Build up to pulling your body weight here, and real pull-ups follow.',
  'cable-row': 'Row at least as much as you bench. Desk posture needs the extra pulling.',
  'face-pull': 'Do these every upper day. Rear delts and rotator cuffs you build now keep pressing pain-free.',
  'pushdown': 'High-rep pushdowns grow the triceps without beating up your elbows.',
  'cable-curl': 'Constant tension makes light weights count. Slow the lowering for bigger gains.',
  'smith-squat': 'Good for high-rep leg work or squatting without a spotter. Keep free squats in your week too.',
  'hip-abduction': 'Side glutes keep your knees tracking straight under heavy squats. A few hard sets a week is plenty.',
  'assisted-pullup': 'Treat it as a ladder: cut the assistance a little every few weeks until you need none.',
  'captains-chair': 'Curl the hips up at the top, not just the knees — that’s where the abs really work.',
  'neutral-pullup': 'Add a few pounds once 10 clean reps are easy — weighted pull-ups build a big back.',
  'tower-dip': 'One of the best upper-body builders there is. Earn depth slowly and keep the shoulders down.',
};

// ---------------------------------------------------------------------------
// Short YouTube form demos by Black trainers and creators (checked embeddable).
// Exercises without a matching video simply don't show the section.
// ---------------------------------------------------------------------------
const VIDEOS = {
  'bb-ohp': { id: "vSlBzu8P_-A", by: "Gabriel Sey", title: "HOW TO: BARBELL SHOULDER PRESS TO AVOID INJURY" },
  'db-shoulder': { id: "-Z7ydf_mFRw", by: "Gabriel Sey", title: "How to: Seated Dumbbell Shoulder Press (Tips) | Gabriel Sey" },
  'db-row': { id: "PIhb87fY3lI", by: "Gabriel Sey", title: "How to: Single Arm Dumbbell Row For That Cobra Back | Gabriel Sey" },
  'bb-row': { id: "qXrTDQG1oUQ", by: "Moorefitcoach", title: "Bent-Over Barbell Row | Proper Form for a Bigger Back" },
  'cs-row': { id: "ym-Mp8tCF00", by: "BEN MIGHTY", title: "HOW TO CHEST SUPPORTED DUMBBELL ROW" },
  'db-pullover': { id: "NVkOuImkXlM", by: "Gabriel Sey", title: "How To: Dumbbell Pull-overs - Chest vs Back | Gabriel Sey" },
  'goblet-squat': { id: "v90iIJzyvlQ", by: "That Guy Health", title: "GOBLET SQUAT | INSTRUCTIONS FOR BEGINNERS" },
  'back-squat': { id: "heGRCxHYtLQ", by: "Gabriel Sey", title: "How To: Squat (High Bar For Beginners) | Gabriel Sey" },
  'db-rdl': { id: "KrRtk8KbJik", by: "Peak Human Performance", title: "How To: DUMBBELL ROMANIAN DEADLIFT (RDL)" },
  'hip-thrust': { id: "367cuFJwXx4", by: "Fitgurlmel", title: "Hip Thrusts Tutorial for a Strong A$$" },
  'db-curl': { id: "XGFqO6HMnGQ", by: "Fitgurlmel", title: "Dumbbell Bicep Curls - Exercise Tutorial" },
  'push-up': { id: "V8dKBa9mcsc", by: "Andrew Alinda", title: "Fix Pushup Pain: Perfect Your FORM" },
  'diamond-pushup': { id: "B_PjBkPkTb8", by: "Hannibal For King", title: "Hannibal For King - How to do Diamond Push Ups" },
  'pike-pushup': { id: "YHAQ3x19kOU", by: "Andrew Alinda", title: "Pike Push Up | Do It Right" },
  'pull-up': { id: "nhkMgkhRvls", by: "Andrew Alinda", title: "Master the Pull Up Fix This Mistake Now!" },
  'chin-up': { id: "nwE_fhS8muE", by: "Gabriel Sey", title: "How To: Progression of the Chin Up and Pull Up" },
  'inverted-row': { id: "_V9smXNkrAk", by: "Andrew Alinda", title: "Inverted Rows: Calisthenics Exercise For ALL LEVELS" },
  'superman': { id: "VUT1RHyMEuc", by: "TpindellFitness", title: "How to Do Superman Exercises" },
  'shoulder-tap': { id: "8F-SW8XTbE8", by: "Fitgurlmel", title: "Shoulder Taps Tutorial" },
  'bw-squat': { id: "2t3Ab7a2ZM4", by: "Brittne Babe", title: "How To Squat Properly - The Perfect Form & Technique by Brittne Babe" },
  'glute-bridge': { id: "e8SUPcxej6g", by: "Koboko Fitness", title: "3 Moves for Better Glute Bridges 🍑" },
  'plank': { id: "6yxgA0d45PY", by: "Koboko Fitness", title: "Planks for Beginners! \\\\ Do this everyday for 30 days!" },
  'knee-raise': { id: "QhVjRuzgu8M", by: "Andrew Alinda", title: "Try Hanging Knee Raises To Sculpt Your Abs & Obliques" },
  'lateral-raise': { id: "U9bXmxU1ty0", by: "Gabriel Sey", title: "HOW TO: LATERAL RAISE PROPERLY FOR 3D DELTS" },
  // Stretches (OriGym "Stretching Demo" series)
  'childs-pose': { id: "V1AOIik_lwY", by: "OriGym", title: "How To Do Child's Pose | Stretching Demo" },
  'cat-cow': { id: "TWmG67J2wj0", by: "OriGym", title: "How To Do Cat Cow Stretch | Stretching Demo" },
  'knee-chest': { id: "SkrV4wjkhJY", by: "OriGym", title: "How To Do Knee To Chest Stretch Double | Stretching Demo" },
  'supine-twist': { id: "j64mu6MP6DU", by: "OriGym", title: "How To Do Supine Twist | Stretching Demo" },
  'hamstring-stretch': { id: "9gfcG47p_h4", by: "OriGym", title: "How To Do Lying Hamstring Sretch Using A Strap | Stretching Demo" },
  'quad-stretch': { id: "cQK7Umwvhck", by: "OriGym", title: "How To Do Standing Quad Stretch | Stretching Demo" },
  'hip-flexor': { id: "lqgIpm3bE3Y", by: "OriGym", title: "How To Do Kneeling Lunge | Stretching Demo" },
  'figure-four': { id: "GK7T97cqvO4", by: "OriGym", title: "How To Do Piriformis Stretch | Stretching Demo" },
  'calf-stretch': { id: "ttLUOooQXFk", by: "OriGym", title: "How To Do Wall Calf Stretch | Stretching Demo" },
  'cross-shoulder': { id: "Pg0JvLSfWwM", by: "OriGym", title: "How To Do Cross Body Shoulder Stretch | Stretching Demo" },
  'triceps-stretch': { id: "sCeXg7ws6GE", by: "OriGym", title: "How To Do Overhead Triceps Stretch (standing) | Stretching Demo" },
  'doorway-chest': { id: "NpK54Ak8iQI", by: "OriGym", title: "How To Do Doorway Pectoral Stretch | Stretching Demo" },
  'biceps-stretch': { id: "sQjgV2OF0jQ", by: "OriGym", title: "How To Do Wall Bicep Stretch | Stretching Demo" },
  'wrist-stretch': { id: "QEHw0W7K-S8", by: "OriGym", title: "How To Do Wrist Pull | Stretching Demo" },
  // Remaining strength moves (verified: Black demonstrator, embeddable)
  'db-bench': { id: "IKmYPng9BoM", by: "OriGym", title: "How To Do Dumbbell Chest Press | Exercise Demo" },
  'incline-db': { id: "qCTtpEcRihI", by: "BEN MIGHTY", title: "INCLINE DUMBBELL PRESS" },
  'bb-rdl': { id: "ry0_ORDlXSY", by: "TrainHeroic", title: "RDL - Short Demo" },
  'split-squat': { id: "Nu1zcGLooYE", by: "OriGym", title: "How To Do Dumbbell Split Squat | Exercise Demo" },
  'skull-crusher': { id: "Y0eJNJMbqnc", by: "OriGym", title: "How To Do Lying Dumbbell Triceps Extension | Exercise Demo" },
  'farmer-carry': { id: "0lJeIDMva6w", by: "Andre Williams", title: "How To Dumbbell Farmer's Walk" },
  'incline-pushup': { id: "lLQyBEMqdZc", by: "OriGym", title: "How To Do Incline Push Up with Medium Grip | Exercise Demo" },
  'decline-pushup': { id: "O4aHNWwPJdc", by: "OriGym", title: "How To Do Decline Push Up | Exercise Demo" },
  'y-raise': { id: "T1FcTq3WjMM", by: "FitFx Training", title: "Prone Y Raises | Strengthen Your Midback & Rotator Cuff; Improve Overhead Mobility" },
  'bench-dip': { id: "ljbFRv4hKE0", by: "Xavier Thompson Fitness", title: "HOW TO DO TRICEP BENCH DIPS for BIGGER TRICEPS", start: 9 },
  'reverse-lunge': { id: "aoT5WAJot-U", by: "OriGym", title: "How To Do Reverse Lunge | Exercise Demo" },
  'wall-sit': { id: "w7HPsuTZI6o", by: "OriGym", title: "How To Do Wall Sit | Exercise Demo" },
  'dead-bug': { id: "04tJXRzQbVw", by: "OriGym", title: "How To Do Dead Bug | Exercise Demo" },
  'calf-raise': { id: "Mf9UyNi-J1s", by: "OriGym", title: "How To Do Dumbbell Calf Raise | Exercise Demo" },
  'side-plank': { id: "FyZY96V3UUs", by: "OriGym", title: "How To Do Side Bridge | Exercise Demo" },
  // Machines & cables (verified: Black demonstrator, embeddable)
  'leg-press': { id: "1ZE0MrEVIxI", by: "OriGym", title: "How To Do Leg Press | Exercise Demo" },
  'leg-extension': { id: "XbAFTqhBUec", by: "OriGym", title: "How To Do Leg Extension | Exercise Demo" },
  'leg-curl': { id: "bsTBU3hWjq0", by: "88 Fitness Training LLC", title: "How To Use Gym Equipment || Seated Leg Curl" },
  'seated-calf': { id: "MSKwVb7svbA", by: "OriGym", title: "How To Do Calf Raise Machine | Exercise Demo" },
  'chest-press': { id: "f_IZgKWutSU", by: "OriGym", title: "How To Do Machine Chest Press | Exercise Demo" },
  'pec-deck': { id: "JYmszQs-mRs", by: "Wavvy Fitness", title: "How To Do A Pec Deck Fly (BEGINNER)" },
  'machine-shoulder': { id: "SGSf_OcxZA0", by: "OriGym", title: "How To Do Machine Shoulder Press | Exercise Demo" },
  'lat-pulldown': { id: "9tVPuc_zhec", by: "Wavvy Fitness", title: "How To Do Lat Pulldowns At Planet Fitness" },
  'cable-row': { id: "Kk536AACROk", by: "OriGym", title: "How To Do Seated Cable Row - Handle Attachment - Neutral Grip | Exercise Demo2" },
  'face-pull': { id: "l1N6fj1k378", by: "OriGym", title: "How To Do Face Pull | Exercise Demo" },
  'pushdown': { id: "jzaDGoNGYfI", by: "OriGym", title: "How To Do Standing Cable Tricep Pushdown | Exercise Demo" },
  'cable-curl': { id: "QAbv6yrg-IY", by: "OriGym", title: "How To Do ez Cable Curl | Exercise Demo" },
  'smith-squat': { id: "opqIaBuojpw", by: "OriGym", title: "How To Do Smith Rack Squat | Exercise Demo" },
  'hip-abduction': { id: "dPZCTvsManI", by: "OriGym", title: "How To Do Abductor Machine | Exercise Demo" },
  'assisted-pullup': { id: "KdmioYxFPtE", by: "Wavvy Fitness", title: "How To Use The Assisted Pull Up Machine" },
  'captains-chair': { id: "PSEQgOuibV0", by: "Stephen Matthews", title: "How to do “Dip Bar Knee Raises” - Bratha Man’s Workout Program" },
  'neutral-pullup': { id: "ZoIjQtcfsF0", by: "Serge Jr. Training", title: "Neutral Grip Pull-Up | Demo" },
  'tower-dip': { id: "sY7fselrLiE", by: "Andrew Alinda", title: "Dip Tutorial For Beginners | WITH PROGRESSIONS", start: 46 },
};

// ---------------------------------------------------------------------------
// Joints each exercise loads noticeably — used to swap moves for people
// protecting a joint. Unlisted = gentle on all five.
// ---------------------------------------------------------------------------
const JOINTS = { knee: 'Knees', shoulder: 'Shoulders', back: 'Lower back', wrist: 'Wrists', elbow: 'Elbows' };
const STRESS = {
  'db-bench': ['shoulder'], 'incline-db': ['shoulder'], 'bb-ohp': ['shoulder', 'back'], 'db-shoulder': ['shoulder'],
  'bb-row': ['back'], 'db-pullover': ['shoulder'], 'goblet-squat': ['knee'], 'back-squat': ['knee', 'back'],
  'db-rdl': ['back'], 'bb-rdl': ['back'], 'split-squat': ['knee'], 'db-curl': ['elbow'], 'skull-crusher': ['elbow'],
  'push-up': ['wrist', 'shoulder'], 'incline-pushup': ['wrist'], 'decline-pushup': ['wrist', 'shoulder'],
  'diamond-pushup': ['wrist', 'elbow'], 'pike-pushup': ['wrist', 'shoulder'], 'pull-up': ['shoulder', 'elbow'],
  'chin-up': ['elbow'], 'superman': ['back'], 'shoulder-tap': ['wrist'], 'bench-dip': ['shoulder'],
  'bw-squat': ['knee'], 'reverse-lunge': ['knee'], 'wall-sit': ['knee'], 'knee-raise': ['shoulder'],
  'childs-pose': ['knee'], 'cat-cow': ['wrist'], 'hip-flexor': ['knee'], 'wrist-stretch': ['wrist'],
  'leg-press': ['knee'], 'leg-extension': ['knee'], 'smith-squat': ['knee'], 'pec-deck': ['shoulder'], 'machine-shoulder': ['shoulder'],
  'cable-curl': ['elbow'], 'assisted-pullup': ['shoulder'], 'neutral-pullup': ['shoulder'], 'tower-dip': ['shoulder', 'elbow'],
};
// Equipment someone might not have (bodyweight is always available)
const GEAR = {
  Dumbbell: 'Dumbbells', Barbell: 'Barbell', Bench: 'Bench', 'Pull-up bar': 'Pull-up bar', 'Low bar': 'Low bar / rings',
  Machine: 'Machines', Cable: 'Cable station', 'Smith machine': 'Smith machine', 'Power tower': 'Power tower (dips / knee raises)',
};

// ---------------------------------------------------------------------------
// Your plan. Where you train presets the equipment chips (you can still fine-tune them);
// days per week picks a template. Each routine is a list of movement-pattern SLOTS; a slot is an
// ordered list of candidate exercises (best first) and the first one that fits your gear and
// joints wins (index.html: buildPlans). Compound slots ('c') prefer a lift not already used
// elsewhere in the plan, so the days stay genuinely different; isolation slots ('i') may repeat.
// ---------------------------------------------------------------------------
const LOCATIONS = {
  home: { name: 'Home', sub: 'Dumbbells + bench', gear: ['Dumbbell', 'Bench'] },
  machines: { name: 'Gym · machines', sub: 'Machines, cables, Smith, dumbbells — no barbell', gear: ['Machine', 'Cable', 'Smith machine', 'Power tower', 'Dumbbell', 'Bench', 'Pull-up bar'] },
  full: { name: 'Full gym', sub: 'Everything, barbell included', gear: Object.keys(GEAR) },
  bw: { name: 'Bodyweight', sub: 'No equipment · pull-up bar optional', gear: ['Pull-up bar'] },
};
// Why each pattern is in the plan (shown under the exercise name)
const PATTERNS = {
  squat: 'The squat pattern: your main builder for quads and glutes.',
  hinge: 'The hip hinge: hamstrings and glutes, the pattern that protects your lower back.',
  single: 'One leg at a time evens out left/right strength and trains balance.',
  quad: 'Isolates the quads with no load on your back.',
  hamcurl: 'Bends the knee against load — hamstrings that guard your knees.',
  calf: 'Calves and ankles for steadier walking, stairs and balance.',
  glute: 'Glutes and hips: power for every lift and a happier lower back.',
  hpush: 'Your main press: chest, front shoulders and triceps.',
  incline: 'Upper chest and shoulders at a joint-friendly angle.',
  vpush: 'Overhead strength for shoulders and triceps.',
  fly: 'Chest isolation after the presses: big stretch, light load.',
  hpull: 'Rowing for the mid-back balances all the pressing and builds posture.',
  vpull: 'Lats and upper back — the pull-up muscles.',
  rear: 'Rear shoulders and rotator cuff: shoulder-health insurance.',
  lateral: 'Side delts for wider, stronger shoulders.',
  biceps: 'Direct arm work for the biceps and elbow flexors.',
  triceps: 'Triceps finish every press and lock out every push.',
  coreflex: 'Abs that curl the pelvis up, trained after the big lifts.',
  coreanti: 'A core that resists arching: the bracing every heavy lift needs.',
  carry: 'Grip, traps and whole-body bracing — strength you use every day.',
};
// role: 'c' compound (6–10 reps free weights, 8–12 on machines), 'i' isolation (12–15). Calves and abduction run 12–20.
const SLOTS = {
  squat: { pat: 'squat', role: 'c', ids: ['back-squat', 'smith-squat', 'goblet-squat', 'leg-press', 'bw-squat'] },
  squatB: { pat: 'squat', role: 'c', ids: ['goblet-squat', 'smith-squat', 'back-squat', 'leg-press', 'bw-squat'] },
  legpress: { pat: 'squat', role: 'c', ids: ['leg-press', 'split-squat', 'goblet-squat', 'reverse-lunge', 'bw-squat'] },
  hinge: { pat: 'hinge', role: 'c', ids: ['bb-rdl', 'db-rdl', 'hip-thrust', 'glute-bridge'] },
  single: { pat: 'single', role: 'c', ids: ['split-squat', 'reverse-lunge'] },
  hingeOrSingle: { pat: 'single', role: 'c', ids: ['split-squat', 'reverse-lunge', 'db-rdl', 'bb-rdl', 'glute-bridge'] },
  quad: { pat: 'quad', role: 'i', ids: ['leg-extension', 'wall-sit'] },
  hamcurl: { pat: 'hamcurl', role: 'i', ids: ['leg-curl', 'glute-bridge'] },
  calf: { pat: 'calf', role: 'i', ids: ['seated-calf', 'calf-raise'] },
  calfB: { pat: 'calf', role: 'i', ids: ['calf-raise', 'seated-calf'] },
  glute: { pat: 'glute', role: 'g', ids: ['hip-thrust', 'hip-abduction', 'glute-bridge'] },
  hpush: { pat: 'hpush', role: 'c', ids: ['db-bench', 'chest-press', 'push-up', 'incline-pushup'] },
  hpushM: { pat: 'hpush', role: 'c', ids: ['chest-press', 'db-bench', 'push-up', 'incline-pushup'] },
  incline: { pat: 'incline', role: 'c', ids: ['incline-db', 'decline-pushup', 'push-up', 'incline-pushup'] },
  vpush: { pat: 'vpush', role: 'c', ids: ['bb-ohp', 'machine-shoulder', 'db-shoulder', 'pike-pushup'] },
  fly: { pat: 'fly', role: 'i', ids: ['pec-deck', 'db-pullover', 'push-up', 'incline-pushup'] },
  hpull: { pat: 'hpull', role: 'c', ids: ['bb-row', 'cable-row', 'db-row', 'cs-row', 'inverted-row', 'chin-up', 'pull-up'] },
  hpullB: { pat: 'hpull', role: 'c', ids: ['cable-row', 'cs-row', 'db-row', 'bb-row', 'inverted-row', 'chin-up', 'pull-up'] },
  vpull: { pat: 'vpull', role: 'c', ids: ['lat-pulldown', 'pull-up', 'assisted-pullup', 'chin-up', 'neutral-pullup', 'db-pullover', 'inverted-row'] },
  vpullB: { pat: 'vpull', role: 'c', ids: ['assisted-pullup', 'neutral-pullup', 'chin-up', 'lat-pulldown', 'pull-up', 'db-pullover', 'inverted-row'] },
  rear: { pat: 'rear', role: 'i', ids: ['face-pull', 'y-raise', 'superman'] },
  lateral: { pat: 'lateral', role: 'i', ids: ['lateral-raise', 'y-raise'] },
  biceps: { pat: 'biceps', role: 'i', ids: ['cable-curl', 'db-curl', 'chin-up'] },
  bicepsB: { pat: 'biceps', role: 'i', ids: ['db-curl', 'cable-curl', 'chin-up'] },
  triceps: { pat: 'triceps', role: 'i', ids: ['pushdown', 'skull-crusher', 'bench-dip', 'diamond-pushup'] },
  tricepsB: { pat: 'triceps', role: 'i', ids: ['tower-dip', 'skull-crusher', 'pushdown', 'bench-dip', 'diamond-pushup'] },
  coreflex: { pat: 'coreflex', role: 'i', ids: ['captains-chair', 'knee-raise', 'dead-bug'] },
  coreanti: { pat: 'coreanti', role: 'i', ids: ['plank', 'dead-bug', 'side-plank', 'shoulder-tap'] },
  carry: { pat: 'carry', role: 'i', ids: ['farmer-carry', 'plank'] },
};
// Routines per days-a-week, in rotation order. Compounds first, accessories after.
const PLAN_TEMPLATES = {
  2: [
    { key: '2A', badge: 'F1', name: 'Full Body 1', focus: 'Squat · press · row', why: 'Squat, press and row heavy while you’re fresh, then shoulders and core.',
      slots: ['squat', 'hpush', 'hpull', 'hinge', 'lateral', 'coreanti'] },
    { key: '2B', badge: 'F2', name: 'Full Body 2', focus: 'Single-leg · incline · pull-down', why: 'The other patterns — single-leg, incline and pull-down — so two days cover everything.',
      slots: ['hingeOrSingle', 'incline', 'vpull', 'quad', 'biceps', 'triceps'] },
  ],
  3: [
    { key: '3A', badge: 'FA', name: 'Full Body A', focus: 'Squat & Press', why: 'Legs and chest lead today; a row keeps your shoulders balanced.',
      slots: ['squat', 'hpush', 'hpullB', 'quad', 'triceps', 'coreanti'] },
    { key: '3B', badge: 'FB', name: 'Full Body B', focus: 'Hinge & Pull', why: 'Back-of-the-body day: the hinge and pull-downs build the back that sits all day.',
      slots: ['hinge', 'vpull', 'incline', 'hamcurl', 'biceps', 'coreflex'] },
    { key: '3C', badge: 'FC', name: 'Full Body C', focus: 'Single-leg & Shoulders', why: 'One leg at a time plus overhead work: balance, hips and healthy shoulders.',
      slots: ['single', 'vpush', 'hpull', 'glute', 'lateral', 'rear'] },
  ],
  4: [
    { key: '4A', badge: 'U1', name: 'Upper 1', focus: 'Chest & back strength', why: 'Heavy pressing and rowing, matched set for set to keep your shoulders healthy.',
      slots: ['hpush', 'hpull', 'incline', 'vpull', 'rear', 'triceps'] },
    { key: '4B', badge: 'L1', name: 'Lower 1', focus: 'Quads', why: 'Quad-focused legs: the squat pattern first, then machine work that spares your back.',
      slots: ['squat', 'legpress', 'quad', 'hamcurl', 'calf', 'coreanti'] },
    { key: '4C', badge: 'U2', name: 'Upper 2', focus: 'Shoulders & arms', why: 'Overhead strength, wider shoulders and direct arm work.',
      slots: ['vpush', 'vpullB', 'fly', 'lateral', 'biceps', 'tricepsB'] },
    { key: '4D', badge: 'L2', name: 'Lower 2', focus: 'Hips & hamstrings', why: 'Hamstrings and glutes: the muscles that protect your knees and lower back.',
      slots: ['hinge', 'single', 'hamcurl', 'glute', 'calfB', 'coreflex'] },
  ],
  5: [
    { key: '5A', badge: 'Pu', name: 'Push', focus: 'Chest, shoulders, triceps', why: 'All the pushing muscles in one session, machine-guided first so you can push hard.',
      slots: ['hpushM', 'vpush', 'fly', 'lateral', 'tricepsB', 'triceps'] },
    { key: '5B', badge: 'Pl', name: 'Pull', focus: 'Back, rear shoulders, biceps', why: 'Every pulling angle: pull-downs, rows and rear shoulders for posture.',
      slots: ['vpull', 'hpullB', 'hpull', 'rear', 'biceps', 'carry'] },
    { key: '5C', badge: 'Lg', name: 'Legs', focus: 'Quads, hamstrings, calves', why: 'Leg press leads so your quads get heavy work with your back supported.',
      slots: ['legpress', 'squatB', 'quad', 'hamcurl', 'calf', 'coreanti'] },
    { key: '5D', badge: 'Up', name: 'Upper', focus: 'Upper chest, back, arms', why: 'A second upper day with new angles: incline first, then rows and arms.',
      slots: ['incline', 'vpullB', 'hpush', 'rear', 'bicepsB', 'triceps'] },
    { key: '5E', badge: 'Lo', name: 'Lower', focus: 'Hips, hamstrings, glutes', why: 'A hinge-led lower day for hamstrings, glutes and a strong lower back.',
      slots: ['hinge', 'squat', 'hamcurl', 'glute', 'calfB', 'coreflex'] },
  ],
};
const PER_SIDE = new Set(['split-squat', 'reverse-lunge', 'db-row', 'side-plank', 'dead-bug', 'shoulder-tap']);
