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
const PUSH_BOTTOM = { hip: [116, 160], t: -10.9, hn: [156, 176], hf: [152, 176] };
// Pull-up bar seen end-on, with an upright behind the body
const bar = (y) => ({ scene: `<line x1="126" y1="${y}" x2="126" y2="180" class="bench-pad" style="stroke-width:4;opacity:.6"/>
  <line x1="92" y1="${y}" x2="160" y2="${y}" class="bench-pad" style="stroke-width:5"/><circle cx="126" cy="${y}" r="4.5" class="hub"/>` });
const BAR_HIGH = bar(-24);
const BAR_TOP = bar(-46);

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
    frames: [{ ...STAND, hn: [122, 103] }, { ...STAND, hn: [138, 44] }],
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
      { hip: [129, 94], t: -95, hn: [126, -24], hf: [122, -24], fn: [100, 148], ff: [96, 150] },
      { hip: [129, 46], t: -95, hn: [126, -24], hf: [122, -24], fn: [100, 100], ff: [96, 102] },
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
      { hip: [129, 94], t: -95, hn: [126, -24], hf: [122, -24], fn: [100, 148], ff: [96, 150] },
      { hip: [129, 46], t: -95, hn: [126, -24], hf: [122, -24], fn: [100, 100], ff: [96, 102] },
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

// Two alternating full-body days. lo/hi = rep range; rest in seconds.
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
  // ---- Calisthenics: pick a full-body day or one area to focus on ----
  CF: {
    name: 'Calisthenics', chip: 'Full body', badge: 'C', cali: true, focus: 'Full body · bodyweight', mins: 40,
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
      { id: 'knee-raise', sets: 3, lo: 8, hi: 12, rest: 60 },
      { id: 'shoulder-tap', sets: 2, lo: 8, hi: 12, rest: 45, perSide: true },
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
    d = Math.min(Math.max(d, Math.abs(l1 - l2) + 0.01), l1 + l2 - 0.01);
    const base = Math.atan2(t[1] - a[1], t[0] - a[0]);
    const ang = Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d));
    const j = base - s * ang;
    const jx = a[0] + l1 * Math.cos(j), jy = a[1] + l1 * Math.sin(j);
    const e = Math.atan2(t[1] - jy, t[0] - jx);
    return [[jx, jy], [jx + l2 * Math.cos(e), jy + l2 * Math.sin(e)]];
  }

  function solve(p, ex) {
    const t = (p.t * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t);
    const hip = p.hip;
    const sh = [hip[0] + L.torso * c, hip[1] + L.torso * s];
    const hd = [hip[0] + (L.torso + L.neck + L.head) * c, hip[1] + (L.torso + L.neck + L.head) * s];
    const hnT = p.hn, hfT = p.hf || [hnT[0] - 4, hnT[1]];
    const fnT = p.fn || ex.fn, ffT = p.ff || ex.ff || [fnT[0] - 6, fnT[1]];
    const es = ex.es ?? 1, ks = ex.ks ?? 1;
    const [en, hn] = ik(sh, hnT, L.upper, L.fore, es);
    const [ef, hf] = ik(sh, hfT, L.upper, L.fore, ex.esf ?? es);
    const [kn, an] = ik(hip, fnT, L.thigh, L.shin, ks);
    const [kf, af] = ik(hip, ffT, L.thigh, L.shin, ex.ksf ?? ks);
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
  const ease = (u) => 0.5 - 0.5 * Math.cos(Math.PI * u);

  function poseAt(ex, time) {
    const total = ex.tempo.reduce((s, p) => s + p.dur, 0);
    let tt = ((time % total) + total) % total;
    for (let i = 0; i < ex.frames.length; i++) {
      const dur = ex.tempo[i].dur;
      if (tt <= dur) {
        const a = ex.frames[i], b = ex.frames[(i + 1) % ex.frames.length];
        return { pose: lerp(a, b, ease(tt / dur)), phase: ex.tempo[i], index: i };
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

    const farG = side(true);
    f.far = {
      jK: joint(farG, 7), jE: joint(farG, 5.5), jA: joint(farG, 4.5),
      thigh: limb(farG, 'thigh'), shin: limb(farG, 'shin'), foot: el('path', { class: 'm joint' }, farG),
      upper: limb(farG, 'upper'), fore: limb(farG, 'fore'), hand: joint(farG, 4.5),
      delt: el('ellipse', { rx: 11, ry: 8, class: muscleClass(ex, 'delts') }, farG),
    };
    const nearG = side(false);
    f.neck = el('line', { class: 'neck' }, nearG);
    f.head = el('ellipse', { rx: 9.5, ry: 10.5, class: 'm head' }, nearG);
    f.torso = TORSO_REGIONS.map(([m, s, t0, t1]) => ({ m, s, t0, t1, el: el('path', { class: muscleClass(ex, m === 'pelvis' ? null : m) }, nearG) }));
    f.near = {
      jK: joint(nearG, 7), jA: joint(nearG, 4.5),
      thigh: limb(nearG, 'thigh'), shin: limb(nearG, 'shin'), foot: el('path', { class: 'm joint' }, nearG),
    };
    f.propG = el('g', {}, g);
    const armG = side(false);
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
    drawLimb(s.thigh, hip, kn); drawLimb(s.shin, kn, an);
    s.foot.setAttribute('d', footPath(an));
    drawLimb(s.upper, j.sh, el_); drawLimb(s.fore, el_, hd);
  }

  const propAnchor = (ex, j) =>
    ex.prop === 'bbHip' ? [j.hip[0] + 2, j.hip[1] - 17]
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
    f.head.setAttribute('transform', `rotate(${f1((pose.t + 90))} ${f1(hc[0])} ${f1(hc[1])})`);
    const pos = ex.prop === 'db' ? [j.hf, j.hn] : [propAnchor(ex, j)];
    f.props.forEach((p, i) => p.setAttribute('transform', `translate(${f1(pos[i][0])} ${f1(pos[i][1])})`));
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
};
