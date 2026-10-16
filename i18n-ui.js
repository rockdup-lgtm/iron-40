// =====================================================
// IRON 40 — UI text in Español (Latinoamérica, neutral) and Português (Brasil)
// =====================================================
// Keys are the exact English text used in index.html (t('…') and data-i18n).
// {placeholders} are filled in by t(); keep every one of them in each translation.

// Same English word, different meaning: tc('nav', 'Back') looks up 'nav|Back' first, then 'Back'.
function tc(ctx, s, vars) {
  const k = ctx + '|' + s;
  return t(LANG !== 'en' && I18N[LANG] && I18N[LANG][k] ? k : s, vars);
}

Object.assign(I18N.es, {
  // ---- days ----
  'Sun': 'Dom', 'Mon': 'Lun', 'Tue': 'Mar', 'Wed': 'Mié', 'Thu': 'Jue', 'Fri': 'Vie', 'Sat': 'Sáb',

  // ---- tabs + page heads ----
  'Body': 'Cuerpo', 'Workout': 'Rutina', 'Recovery': 'Recuperación', 'Exercises': 'Ejercicios', 'Log': 'Registro',
  'Library': 'Biblioteca', 'Readiness': 'Disposición', 'Training log': 'Registro de entrenamiento', 'Progress': 'Progreso',
  'Today': 'Hoy', "Today's workout": 'Rutina de hoy', 'Your profile': 'Tu perfil',

  // ---- body map ----
  'Tap a muscle': 'Toca un músculo', 'Muscles': 'Músculos', 'This week': 'Esta semana', 'Front': 'Frente', 'Back': 'Espalda',
  'Chest': 'Pecho', 'Delts': 'Deltoides', 'Biceps': 'Bíceps', 'Abs': 'Abdomen', 'Quads': 'Cuádriceps',
  'Triceps': 'Tríceps', 'Glutes': 'Glúteos', 'Hams': 'Isquios', 'Calves': 'Pantorrillas',
  'Red = still recovering': 'Rojo = aún se recupera',
  'sets vs weekly target': 'series vs. meta semanal',
  'Tap any muscle on the body (or a name above) to see the exercises that train it, with animated form demos.':
    'Toca cualquier músculo del cuerpo (o un nombre arriba) para ver los ejercicios que lo trabajan, con demos animadas de la técnica.',
  'Fresh · ready to train': 'Fresco · listo para entrenar',
  '{n}% recovered': '{n}% recuperado',
  '{n} of {target} sets this week': '{n} de {target} series esta semana',
  'Trains your': 'Ejercicios para',
  'Main focus · {n}': 'Enfoque principal · {n}',
  'Also works it · {n}': 'También lo trabajan · {n}',

  // ---- library ----
  'All': 'Todos', 'Fits me': 'Para mí', 'Shoulders': 'Hombros', 'Arms': 'Brazos', 'Legs': 'Piernas', 'Core': 'Core',
  'Dumbbell': 'Mancuerna', 'Barbell': 'Barra', 'Bench': 'Banco', 'Bodyweight': 'Peso corporal',
  'Pull-up bar': 'Barra de dominadas', 'Low bar': 'Barra baja',
  '{n} movements': '{n} movimientos',

  // ---- today ----
  '{day} {n}, trained': '{day} {n}, con entreno',
  '{n}-week streak': 'Racha de {n} semanas',
  '{n} workout': '{n} entrenamiento',
  '{n} workouts': '{n} entrenamientos',
  'Start your streak': 'Empieza tu racha',
  'Done for today — nice work': 'Listo por hoy — buen trabajo',
  '{day} · training day': '{day} · día de entreno',
  '{day} · rest day': '{day} · día de descanso',
  'Easy week': 'Semana ligera',
  'Recover to get stronger': 'Recupérate para ganar fuerza',
  "You've trained hard for {n} weeks. This week: one fewer set and 10% less weight on everything. Joints and tendons catch up, and you come back stronger.":
    'Llevas {n} semanas entrenando duro. Esta semana: una serie menos y 10% menos de peso en todo. Tus articulaciones y tendones se ponen al día, y vuelves más fuerte.',
  'Skip easy week': 'Saltar semana ligera',
  'In progress': 'En curso',
  'Next session': 'Próxima sesión',
  'Up next': 'Lo que sigue',
  '{n} of 3 this week': '{n} de 3 esta semana',
  'Calisthenics': 'Calistenia',
  '{n} exercises': '{n} ejercicios',
  '{name} first': 'Primero: {name}',
  'Resume workout': 'Continuar rutina',
  'Start workout': 'Empezar rutina',
  'Plan: Mon · Wed · Fri — rest days help, but you can train anytime.':
    'Plan: lun · mié · vie — descansar ayuda, pero puedes entrenar cuando quieras.',
  'See all {n} exercises': 'Ver los {n} ejercicios',
  'adjusted for you': 'ajustado para ti',
  '{n} sets': '{n} series',
  'side': 'lado',
  '{label} (locked)': '{label} (bloqueado)',
  'Switch focus': 'Cambiar enfoque',
  'Unlock everything · {price}': 'Desbloquear todo · {price}',
  'Gym · {name}': 'Gym · {name}',
  'Alternates dumbbell & barbell days': 'Alterna días de mancuernas y barra',
  'Free · full-body dumbbell day': 'Gratis · cuerpo completo con mancuernas',
  'Barbell day': 'Día de barra',
  '~{n} min · bodyweight': '~{n} min · peso corporal',

  // ---- coaching hints ----
  'sec': 'seg', 'reps': 'reps', 'seconds': 'segundos',
  'no {gear}': 'sin {gear}',
  'easier on your {joint}': 'más suave para {joint}',
  'Swapped from {name}: {why}': 'Cambiado de {name}: {why}',
  'Swapped from {name}': 'Cambiado de {name}',
  'Go light: {why}': 'Usa poco peso: {why}',
  'Aim for {lo}–{hi} clean {unit}. Too hard? {easier}.': 'Busca {lo}–{hi} {unit} limpias. ¿Muy difícil? {easier}.',
  'First time: choose a weight you could do for ~3 more {unit} than the target.':
    'Primera vez: elige un peso con el que podrías hacer ~3 {unit} más que la meta.',
  'You hit {hi} {unit} on every set last time — level up: {harder}.':
    'La última vez lograste {hi} {unit} en cada serie — sube de nivel: {harder}.',
  'You hit {hi} {unit} last time, but it was all-out. Repeat it until it feels solid.':
    'La última vez lograste {hi} {unit}, pero al límite. Repítelo hasta que se sienta sólido.',
  'Last time best {n} {unit}. Stay here until every set reaches {hi}.':
    'Tu mejor marca la última vez: {n} {unit}. Quédate aquí hasta que cada serie llegue a {hi}.',
  'You hit {hi} {unit} last time, but it was all-out. Stay at {w} lb until it feels solid.':
    'La última vez lograste {hi} {unit}, pero al límite. Quédate en {w} lb hasta que se sienta sólido.',
  'You hit {hi} {unit} on every set last time — go up to {w} lb (+5).':
    'La última vez lograste {hi} {unit} en cada serie — sube a {w} lb (+5).',
  "Stuck at {w} lb for 3 sessions. Drop to {back} lb today and build back up — that's how you break through.":
    'Llevas 3 sesiones sin pasar de {w} lb. Hoy baja a {back} lb y vuelve a subir — así se rompe el estancamiento.',
  'Last time {w} lb. Stay here until all sets reach {hi} {unit}.':
    'La última vez: {w} lb. Quédate aquí hasta que todas las series lleguen a {hi} {unit}.',

  // ---- exercise detail ----
  'Pause': 'Pausa', 'Slow motion': 'Cámara lenta',
  'Drag through the full range of motion': 'Desliza por todo el rango de movimiento',
  'Drag to move through the full range of motion': 'Desliza para recorrer todo el rango de movimiento',
  '{label} · {n} sec': '{label} · {n} seg',
  '{w} lb × {r} · est. 1RM {v} lb': '{w} lb × {r} · 1RM est. {v} lb',
  '{name} progress, {n} sessions, best {best}': 'Progreso de {name}, {n} sesiones, mejor {best}',
  'Best {n}': 'Mejor {n}',
  'PR': 'RP',
  'Best {n} {unit}': 'Mejor: {n} {unit}',
  'Best {n} lb': 'Mejor: {n} lb',
  'Works:': 'Trabaja:',
  'Last:': 'Última vez:',
  'Your progress': 'Tu progreso',
  'Estimated 1-rep max per session (lb)': 'Máximo estimado a 1 repetición por sesión (lb)',
  'Best set per session ({unit})': 'Mejor serie por sesión ({unit})',
  'How to do it': 'Cómo hacerlo',
  'Watch it done': 'Míralo en acción',
  'Video demo by {by} · unlock to watch': 'Video de {by} · desbloquea para verlo',
  'Play video: {title}': 'Reproducir video: {title}',
  'Connect to the internet to watch this video.': 'Conéctate a internet para ver este video.',
  '30s tip': 'Consejo 30+',
  '40+ tip': 'Consejo 40+',
  'Avoid': 'Evita',
  'Easier': 'Más fácil',
  'Harder': 'Más difícil',
  'Close': 'Cerrar',
  'Primary': 'Principal',
  'Also works': 'También trabaja',
  'Animated form demo': 'Demo animada de la técnica',
  'Watch every rep and drag through the full range of motion.': 'Mira cada repetición y desliza por todo el rango de movimiento.',
  'Unlock · {price}': 'Desbloquear · {price}',

  // ---- workout ----
  'Warm-up · 5 min': 'Calentamiento · 5 min',
  'A proper warm-up primes your joints and lets you lift heavier.': 'Un buen calentamiento prepara tus articulaciones y te deja levantar más.',
  'Older joints need a proper warm-up.': 'Las articulaciones con años necesitan un buen calentamiento.',
  'Do each move, then 1 light set of your first exercise.': 'Haz cada movimiento y luego 1 serie ligera de tu primer ejercicio.',
  'Start lifting': 'A levantar',
  'Exercise {n} of {total}': 'Ejercicio {n} de {total}',
  'Swap': 'Cambiar',
  'Easy week · 10% lighter, one fewer set': 'Semana ligera · 10% menos peso, una serie menos',
  'each side': 'por lado',
  'rest {n}s': 'descanso {n} s',
  'effort: 2–3 {unit} left in the tank': 'esfuerzo: deja 2–3 {unit} en reserva',
  '{name} demonstration photo': 'Foto de demostración: {name}',
  'Set': 'Serie',
  'BW': 'PC',
  'Set {n} added weight': 'Serie {n}: peso añadido',
  'Set {n} weight': 'Serie {n}: peso',
  'Set {n} {unit}': 'Serie {n}: {unit}',
  'Complete set {n}': 'Completar serie {n}',
  'Form tips': 'Consejos de técnica',
  'nav|Back': 'Atrás',
  'Finish': 'Terminar',
  'Next exercise': 'Siguiente ejercicio',
  'Next: set {n}': 'Sigue: serie {n}',
  'Next: {name}': 'Sigue: {name}',
  'Last set done!': '¡Última serie lista!',
  'Leave workout?': '¿Salir de la rutina?',
  'Your progress is saved — you can resume from the Today tab.': 'Tu progreso está guardado — puedes continuar desde la pestaña Rutina.',
  'Keep going': 'Seguir',
  'Pause & exit': 'Pausar y salir',
  'Discard workout': 'Descartar rutina',
  'Swap exercise': 'Cambiar ejercicio',
  'Same muscles, filtered for your joints and equipment.': 'Mismos músculos, filtrado según tus articulaciones y tu equipo.',
  'Original': 'Original',
  'Cancel': 'Cancelar',
  '{name} complete': '{name} completado',
  'Sets': 'Series',
  'lb lifted': 'lb levantadas',
  'Reps': 'Repeticiones',
  'Minutes': 'Minutos',
  'No sets were checked off. Tap ✓ after each set to log it.': 'No marcaste ninguna serie. Toca ✓ después de cada serie para registrarla.',
  'est. 1RM {v} lb (was {prev})': '1RM est. {v} lb (antes {prev})',
  '{v} {unit} (was {prev})': '{v} {unit} (antes {prev})',
  'New personal records': 'Nuevos récords personales',
  'Save workout': 'Guardar rutina',

  // ---- rest timer ----
  'Recover · breathe': 'Recupera · respira',
  'How did that set feel?': '¿Cómo se sintió esa serie?',
  'Easy': 'Fácil', 'Solid': 'Sólida', 'Hard': 'Dura', 'All-out': 'Al límite',
  'Easy = 3+ reps left · Solid = 2 · Hard = 1 · All-out = none': 'Fácil = te quedan 3+ reps · Sólida = 2 · Dura = 1 · Al límite = 0',
  'Skip rest': 'Saltar descanso',
  'Go': '¡Ya!',
  'of {time}': 'de {time}',
  'next set': 'siguiente serie',
  'New personal record': 'Nuevo récord personal',
  'Est. 1RM {v} lb · up from {was} lb': '1RM est. {v} lb · antes {was} lb',
  'Up from {was} {unit}': 'Antes: {was} {unit}',

  // ---- weight / reps wheel ----
  'Type instead': 'Escribir',
  'Weight': 'Peso',
  'Save': 'Guardar',
  'Log set ✓': 'Registrar serie ✓',
  '{name} · set {n}': '{name} · serie {n}',
  'added lb': 'lb extra',

  // ---- streak + heatmap ----
  'rest day': 'día de descanso',
  'Training streak': 'Racha de entrenamiento',
  'week streak': 'semanas de racha',
  'best streak': 'mejor racha',
  'workouts': 'entrenamientos',
  'A streak week = 3+ workouts. Tap a day.': 'Semana de racha = 3+ entrenamientos. Toca un día.',
  'Less': 'Menos',
  'More': 'Más',

  // ---- recovery ----
  'Recovery tracking': 'Seguimiento de recuperación',
  'See which muscles are fresh and which are still recovering, based on what you trained.':
    'Mira qué músculos están frescos y cuáles aún se recuperan, según lo que entrenaste.',
  'Day since your<br>last workout': 'Día desde tu<br>último entreno',
  'Days since your<br>last workout': 'Días desde tu<br>último entreno',
  'Fresh muscle<br>groups': 'Grupos musculares<br>frescos',
  'Muscle readiness': 'Disposición muscular',
  'Red = still recovering. Train fresh muscles hardest.': 'Rojo = aún se recupera. Entrena más duro los músculos frescos.',
  'Finish a workout to start tracking recovery.': 'Termina una rutina para empezar a seguir tu recuperación.',

  // ---- history ----
  'Your training log': 'Tu registro de entrenamiento',
  'Every workout you finish is saved ({n} so far). Unlock to see your lifts, bests and history.':
    'Cada rutina que terminas se guarda ({n} hasta ahora). Desbloquea para ver tus levantamientos, marcas e historial.',
  'Every workout you finish is saved. Unlock to see your lifts, bests and history.':
    'Cada rutina que terminas se guarda. Desbloquea para ver tus levantamientos, marcas e historial.',
  'No workouts yet': 'Aún no hay entrenamientos',
  'Finish your first workout and your lifts show up here.': 'Termina tu primera rutina y tus levantamientos aparecerán aquí.',
  'Go to Today': 'Ir a Rutina',
  'Recent personal records': 'Récords personales recientes',
  'Est. 1RM {v} lb · {n} sessions': '1RM est. {v} lb · {n} sesiones',
  'Est. 1RM {v} lb · {n} session': '1RM est. {v} lb · {n} sesión',
  'Your lifts': 'Tus levantamientos',
  'Latest working set · tap a lift for its chart': 'Última serie efectiva · toca uno para ver su gráfica',
  'Workouts': 'Entrenamientos',

  // ---- unlock ----
  'Unlock Iron 40': 'Desbloquea Iron 40',
  'One-time purchase. No subscription.': 'Pago único. Sin suscripción.',
  'Animated form demos, the rep scrubber and video demos for all 39 exercises':
    'Demos animadas de técnica, el control de repetición y videos para los 39 ejercicios',
  'Workout B and all 7 calisthenics workouts — legs, chest, back, shoulders, arms, core':
    'Rutina B y las 7 rutinas de calistenia — piernas, pecho, espalda, hombros, brazos, core',
  'Recovery tracking for every muscle': 'Seguimiento de recuperación de cada músculo',
  'Your full training log, lifts and personal bests': 'Tu registro completo, levantamientos y récords personales',
  'Buy for {price}': 'Comprar por {price}',
  'Already bought it?': '¿Ya lo compraste?',
  'Paste your license key': 'Pega tu clave de licencia',
  'Activate': 'Activar',
  'Not now': 'Ahora no',
  'Paste the key from your purchase email.': 'Pega la clave del correo de tu compra.',
  'Checking…': 'Verificando…',
  'That key didn’t work.': 'Esa clave no funcionó.',
  'You need to be online to activate. Try again with a connection.': 'Necesitas conexión para activar. Inténtalo de nuevo con internet.',
  'Iron 40 unlocked': 'Iron 40 desbloqueado',
  'Everything is open on this phone: all demos, videos, recovery, progress and your log.':
    'Todo está abierto en este teléfono: demos, videos, recuperación, progreso y tu registro.',
  'Let’s lift': 'A entrenar',

  // ---- profile ----
  'Welcome to Iron 40': 'Te damos la bienvenida a Iron 40',
  'Free-weight and bodyweight training for men and women in their 30s and 40+: animated form demos, joint-smart tips and automatic progression.':
    'Entrenamiento con peso libre y peso corporal para hombres y mujeres de 30 y 40+: demos animadas de técnica, consejos que cuidan tus articulaciones y progresión automática.',
  'Language': 'Idioma',
  'Show me': 'Muéstrame',
  'Men': 'Hombres',
  'Women': 'Mujeres',
  'Age group': 'Edad',
  '30s': '30–39',
  'Sets the photos, coaching tips and recovery times. You can change it anytime from the profile button.':
    'Ajusta las fotos, los consejos y los tiempos de recuperación. Puedes cambiarlo cuando quieras desde el botón de perfil.',
  'Joints to protect': 'Articulaciones a cuidar',
  'Workouts swap in gentler moves that work the same muscles.': 'Las rutinas cambian a movimientos más suaves que trabajan los mismos músculos.',
  'Equipment I have': 'Equipo que tengo',
  'Check with your doctor before starting a new exercise program, especially with heart, blood pressure, or joint issues. Stop any exercise that causes sharp pain.':
    'Consulta a tu médico antes de empezar un nuevo programa de ejercicio, sobre todo si tienes problemas del corazón, de presión arterial o en las articulaciones. Detén cualquier ejercicio que cause dolor agudo.',
  'Your data · {n} workout on this device': 'Tus datos · {n} entrenamiento en este dispositivo',
  'Your data · {n} workouts on this device': 'Tus datos · {n} entrenamientos en este dispositivo',
  'Everything is stored only on this device. Save a backup now and then, and use it to move to a new phone.':
    'Todo se guarda solo en este dispositivo. Haz un respaldo de vez en cuando y úsalo para pasar a un teléfono nuevo.',
  'Save backup': 'Guardar respaldo',
  'Export CSV': 'Exportar CSV',
  'Restore': 'Restaurar',
  "I understand — let's lift": 'Entendido — a entrenar',

  // ---- backup / restore ----
  'Backup saved. Keep it somewhere safe (Files, iCloud Drive, email to yourself).':
    'Respaldo guardado. Guárdalo en un lugar seguro (Archivos, iCloud Drive o envíatelo por correo).',
  'CSV saved — opens in Numbers, Excel or Google Sheets.': 'CSV guardado — se abre en Numbers, Excel o Google Sheets.',
  'That file isn’t an Iron 40 backup.': 'Ese archivo no es un respaldo de Iron 40.',
  'this backup': 'este respaldo',
  'Restore {n} workout from {date}? This replaces the {m} on this device.':
    '¿Restaurar {n} entrenamiento de {date}? Esto reemplaza los {m} de este dispositivo.',
  'Restore {n} workouts from {date}? This replaces the {m} on this device.':
    '¿Restaurar {n} entrenamientos de {date}? Esto reemplaza los {m} de este dispositivo.',
  'Couldn’t read that file. Choose the .json backup Iron 40 saved.': 'No se pudo leer ese archivo. Elige el respaldo .json que guardó Iron 40.',
});

Object.assign(I18N.pt, {
  // ---- days ----
  'Sun': 'Dom', 'Mon': 'Seg', 'Tue': 'Ter', 'Wed': 'Qua', 'Thu': 'Qui', 'Fri': 'Sex', 'Sat': 'Sáb',

  // ---- tabs + page heads ----
  'Body': 'Corpo', 'Workout': 'Treino', 'Recovery': 'Recuperação', 'Exercises': 'Exercícios', 'Log': 'Histórico',
  'Library': 'Biblioteca', 'Readiness': 'Prontidão', 'Training log': 'Diário de treino', 'Progress': 'Progresso',
  'Today': 'Hoje', "Today's workout": 'Treino de hoje', 'Your profile': 'Seu perfil',

  // ---- body map ----
  'Tap a muscle': 'Toque em um músculo', 'Muscles': 'Músculos', 'This week': 'Esta semana', 'Front': 'Frente', 'Back': 'Costas',
  'Chest': 'Peito', 'Delts': 'Deltoides', 'Biceps': 'Bíceps', 'Abs': 'Abdômen', 'Quads': 'Quadríceps',
  'Triceps': 'Tríceps', 'Glutes': 'Glúteos', 'Hams': 'Posteriores', 'Calves': 'Panturrilhas',
  'Red = still recovering': 'Vermelho = ainda recuperando',
  'sets vs weekly target': 'séries vs. meta semanal',
  'Tap any muscle on the body (or a name above) to see the exercises that train it, with animated form demos.':
    'Toque em qualquer músculo do corpo (ou em um nome acima) para ver os exercícios que o trabalham, com demonstrações animadas da execução.',
  'Fresh · ready to train': 'Descansado · pronto para treinar',
  '{n}% recovered': '{n}% recuperado',
  '{n} of {target} sets this week': '{n} de {target} séries nesta semana',
  'Trains your': 'Exercícios para',
  'Main focus · {n}': 'Foco principal · {n}',
  'Also works it · {n}': 'Também trabalham · {n}',

  // ---- library ----
  'All': 'Todos', 'Fits me': 'Para mim', 'Shoulders': 'Ombros', 'Arms': 'Braços', 'Legs': 'Pernas', 'Core': 'Core',
  'Dumbbell': 'Halter', 'Barbell': 'Barra', 'Bench': 'Banco', 'Bodyweight': 'Peso corporal',
  'Pull-up bar': 'Barra fixa', 'Low bar': 'Barra baixa',
  '{n} movements': '{n} movimentos',

  // ---- today ----
  '{day} {n}, trained': '{day} {n}, treino feito',
  '{n}-week streak': 'Sequência de {n} semanas',
  '{n} workout': '{n} treino',
  '{n} workouts': '{n} treinos',
  'Start your streak': 'Comece sua sequência',
  'Done for today — nice work': 'Feito por hoje — mandou bem',
  '{day} · training day': '{day} · dia de treino',
  '{day} · rest day': '{day} · dia de descanso',
  'Easy week': 'Semana leve',
  'Recover to get stronger': 'Recupere para ficar mais forte',
  "You've trained hard for {n} weeks. This week: one fewer set and 10% less weight on everything. Joints and tendons catch up, and you come back stronger.":
    'Você treinou pesado por {n} semanas. Nesta semana: uma série a menos e 10% menos carga em tudo. Articulações e tendões se recuperam, e você volta mais forte.',
  'Skip easy week': 'Pular semana leve',
  'In progress': 'Em andamento',
  'Next session': 'Próxima sessão',
  'Up next': 'A seguir',
  '{n} of 3 this week': '{n} de 3 nesta semana',
  'Calisthenics': 'Calistenia',
  '{n} exercises': '{n} exercícios',
  '{name} first': 'Primeiro: {name}',
  'Resume workout': 'Retomar treino',
  'Start workout': 'Começar treino',
  'Plan: Mon · Wed · Fri — rest days help, but you can train anytime.':
    'Plano: seg · qua · sex — descansar ajuda, mas você pode treinar quando quiser.',
  'See all {n} exercises': 'Ver os {n} exercícios',
  'adjusted for you': 'ajustado para você',
  '{n} sets': '{n} séries',
  'side': 'lado',
  '{label} (locked)': '{label} (bloqueado)',
  'Switch focus': 'Mudar foco',
  'Unlock everything · {price}': 'Desbloquear tudo · {price}',
  'Gym · {name}': 'Academia · {name}',
  'Alternates dumbbell & barbell days': 'Alterna dias de halteres e barra',
  'Free · full-body dumbbell day': 'Grátis · corpo inteiro com halteres',
  'Barbell day': 'Dia de barra',
  '~{n} min · bodyweight': '~{n} min · peso corporal',

  // ---- coaching hints ----
  'sec': 'seg', 'reps': 'reps', 'seconds': 'segundos',
  'no {gear}': 'sem {gear}',
  'easier on your {joint}': 'mais leve para {joint}',
  'Swapped from {name}: {why}': 'Trocado de {name}: {why}',
  'Swapped from {name}': 'Trocado de {name}',
  'Go light: {why}': 'Vá leve: {why}',
  'Aim for {lo}–{hi} clean {unit}. Too hard? {easier}.': 'Busque {lo}–{hi} {unit} bem feitas. Muito difícil? {easier}.',
  'First time: choose a weight you could do for ~3 more {unit} than the target.':
    'Primeira vez: escolha uma carga com a qual você faria ~3 {unit} a mais que a meta.',
  'You hit {hi} {unit} on every set last time — level up: {harder}.':
    'Da última vez você fez {hi} {unit} em todas as séries — suba de nível: {harder}.',
  'You hit {hi} {unit} last time, but it was all-out. Repeat it until it feels solid.':
    'Da última vez você fez {hi} {unit}, mas no limite. Repita até ficar firme.',
  'Last time best {n} {unit}. Stay here until every set reaches {hi}.':
    'Sua melhor marca da última vez: {n} {unit}. Fique aqui até todas as séries chegarem a {hi}.',
  'You hit {hi} {unit} last time, but it was all-out. Stay at {w} lb until it feels solid.':
    'Da última vez você fez {hi} {unit}, mas no limite. Fique em {w} lb até ficar firme.',
  'You hit {hi} {unit} on every set last time — go up to {w} lb (+5).':
    'Da última vez você fez {hi} {unit} em todas as séries — suba para {w} lb (+5).',
  "Stuck at {w} lb for 3 sessions. Drop to {back} lb today and build back up — that's how you break through.":
    'Já são 3 sessões em {w} lb sem progredir. Hoje baixe para {back} lb e suba de novo — é assim que se rompe o platô.',
  'Last time {w} lb. Stay here until all sets reach {hi} {unit}.':
    'Da última vez: {w} lb. Fique aqui até todas as séries chegarem a {hi} {unit}.',

  // ---- exercise detail ----
  'Pause': 'Pausar', 'Slow motion': 'Câmera lenta',
  'Drag through the full range of motion': 'Arraste por toda a amplitude do movimento',
  'Drag to move through the full range of motion': 'Arraste para percorrer toda a amplitude do movimento',
  '{label} · {n} sec': '{label} · {n} seg',
  '{w} lb × {r} · est. 1RM {v} lb': '{w} lb × {r} · 1RM est. {v} lb',
  '{name} progress, {n} sessions, best {best}': 'Progresso em {name}, {n} sessões, melhor {best}',
  'Best {n}': 'Melhor {n}',
  'PR': 'PR',
  'Best {n} {unit}': 'Melhor: {n} {unit}',
  'Best {n} lb': 'Melhor: {n} lb',
  'Works:': 'Trabalha:',
  'Last:': 'Última vez:',
  'Your progress': 'Seu progresso',
  'Estimated 1-rep max per session (lb)': 'Máximo estimado de 1 repetição por sessão (lb)',
  'Best set per session ({unit})': 'Melhor série por sessão ({unit})',
  'How to do it': 'Como fazer',
  'Watch it done': 'Veja na prática',
  'Video demo by {by} · unlock to watch': 'Vídeo de {by} · desbloqueie para assistir',
  'Play video: {title}': 'Reproduzir vídeo: {title}',
  'Connect to the internet to watch this video.': 'Conecte-se à internet para assistir a este vídeo.',
  '30s tip': 'Dica 30+',
  '40+ tip': 'Dica 40+',
  'Avoid': 'Evite',
  'Easier': 'Mais fácil',
  'Harder': 'Mais difícil',
  'Close': 'Fechar',
  'Primary': 'Principal',
  'Also works': 'Também trabalha',
  'Animated form demo': 'Demonstração animada da execução',
  'Watch every rep and drag through the full range of motion.': 'Veja cada repetição e arraste por toda a amplitude do movimento.',
  'Unlock · {price}': 'Desbloquear · {price}',

  // ---- workout ----
  'Warm-up · 5 min': 'Aquecimento · 5 min',
  'A proper warm-up primes your joints and lets you lift heavier.': 'Um bom aquecimento prepara suas articulações e deixa você levantar mais.',
  'Older joints need a proper warm-up.': 'Articulações mais maduras precisam de um bom aquecimento.',
  'Do each move, then 1 light set of your first exercise.': 'Faça cada movimento e depois 1 série leve do seu primeiro exercício.',
  'Start lifting': 'Bora treinar',
  'Exercise {n} of {total}': 'Exercício {n} de {total}',
  'Swap': 'Trocar',
  'Easy week · 10% lighter, one fewer set': 'Semana leve · 10% mais leve, uma série a menos',
  'each side': 'cada lado',
  'rest {n}s': 'descanso {n} s',
  'effort: 2–3 {unit} left in the tank': 'esforço: deixe 2–3 {unit} na reserva',
  '{name} demonstration photo': 'Foto de demonstração: {name}',
  'Set': 'Série',
  'BW': 'PC',
  'Set {n} added weight': 'Série {n}: carga extra',
  'Set {n} weight': 'Série {n}: carga',
  'Set {n} {unit}': 'Série {n}: {unit}',
  'Complete set {n}': 'Concluir série {n}',
  'Form tips': 'Dicas de execução',
  'nav|Back': 'Voltar',
  'Finish': 'Finalizar',
  'Next exercise': 'Próximo exercício',
  'Next: set {n}': 'A seguir: série {n}',
  'Next: {name}': 'A seguir: {name}',
  'Last set done!': 'Última série feita!',
  'Leave workout?': 'Sair do treino?',
  'Your progress is saved — you can resume from the Today tab.': 'Seu progresso está salvo — você pode retomar pela aba Treino.',
  'Keep going': 'Continuar',
  'Pause & exit': 'Pausar e sair',
  'Discard workout': 'Descartar treino',
  'Swap exercise': 'Trocar exercício',
  'Same muscles, filtered for your joints and equipment.': 'Mesmos músculos, filtrados para suas articulações e seus equipamentos.',
  'Original': 'Original',
  'Cancel': 'Cancelar',
  '{name} complete': '{name} concluído',
  'Sets': 'Séries',
  'lb lifted': 'lb levantadas',
  'Reps': 'Repetições',
  'Minutes': 'Minutos',
  'No sets were checked off. Tap ✓ after each set to log it.': 'Nenhuma série foi marcada. Toque em ✓ depois de cada série para registrá-la.',
  'est. 1RM {v} lb (was {prev})': '1RM est. {v} lb (antes {prev})',
  '{v} {unit} (was {prev})': '{v} {unit} (antes {prev})',
  'New personal records': 'Novos recordes pessoais',
  'Save workout': 'Salvar treino',

  // ---- rest timer ----
  'Recover · breathe': 'Recupere · respire',
  'How did that set feel?': 'Como foi essa série?',
  'Easy': 'Fácil', 'Solid': 'Firme', 'Hard': 'Pesada', 'All-out': 'No limite',
  'Easy = 3+ reps left · Solid = 2 · Hard = 1 · All-out = none': 'Fácil = sobram 3+ reps · Firme = 2 · Pesada = 1 · No limite = 0',
  'Skip rest': 'Pular descanso',
  'Go': 'Vai!',
  'of {time}': 'de {time}',
  'next set': 'próxima série',
  'New personal record': 'Novo recorde pessoal',
  'Est. 1RM {v} lb · up from {was} lb': '1RM est. {v} lb · antes {was} lb',
  'Up from {was} {unit}': 'Antes: {was} {unit}',

  // ---- weight / reps wheel ----
  'Type instead': 'Digitar',
  'Weight': 'Carga',
  'Save': 'Salvar',
  'Log set ✓': 'Registrar série ✓',
  '{name} · set {n}': '{name} · série {n}',
  'added lb': 'lb extra',

  // ---- streak + heatmap ----
  'rest day': 'dia de descanso',
  'Training streak': 'Sequência de treinos',
  'week streak': 'semanas seguidas',
  'best streak': 'melhor sequência',
  'workouts': 'treinos',
  'A streak week = 3+ workouts. Tap a day.': 'Semana na sequência = 3+ treinos. Toque em um dia.',
  'Less': 'Menos',
  'More': 'Mais',

  // ---- recovery ----
  'Recovery tracking': 'Acompanhamento da recuperação',
  'See which muscles are fresh and which are still recovering, based on what you trained.':
    'Veja quais músculos estão descansados e quais ainda estão se recuperando, com base no que você treinou.',
  'Day since your<br>last workout': 'Dia desde seu<br>último treino',
  'Days since your<br>last workout': 'Dias desde seu<br>último treino',
  'Fresh muscle<br>groups': 'Grupos musculares<br>descansados',
  'Muscle readiness': 'Prontidão muscular',
  'Red = still recovering. Train fresh muscles hardest.': 'Vermelho = ainda recuperando. Treine mais pesado os músculos descansados.',
  'Finish a workout to start tracking recovery.': 'Conclua um treino para começar a acompanhar a recuperação.',

  // ---- history ----
  'Your training log': 'Seu diário de treino',
  'Every workout you finish is saved ({n} so far). Unlock to see your lifts, bests and history.':
    'Todo treino que você conclui fica salvo ({n} até agora). Desbloqueie para ver seus exercícios, recordes e histórico.',
  'Every workout you finish is saved. Unlock to see your lifts, bests and history.':
    'Todo treino que você conclui fica salvo. Desbloqueie para ver seus exercícios, recordes e histórico.',
  'No workouts yet': 'Nenhum treino ainda',
  'Finish your first workout and your lifts show up here.': 'Conclua seu primeiro treino e suas cargas aparecem aqui.',
  'Go to Today': 'Ir para Treino',
  'Recent personal records': 'Recordes pessoais recentes',
  'Est. 1RM {v} lb · {n} sessions': '1RM est. {v} lb · {n} sessões',
  'Est. 1RM {v} lb · {n} session': '1RM est. {v} lb · {n} sessão',
  'Your lifts': 'Suas cargas',
  'Latest working set · tap a lift for its chart': 'Última série válida · toque em um exercício para ver o gráfico',
  'Workouts': 'Treinos',

  // ---- unlock ----
  'Unlock Iron 40': 'Desbloqueie o Iron 40',
  'One-time purchase. No subscription.': 'Pagamento único. Sem assinatura.',
  'Animated form demos, the rep scrubber and video demos for all 39 exercises':
    'Demonstrações animadas, o controle de repetição e vídeos dos 39 exercícios',
  'Workout B and all 7 calisthenics workouts — legs, chest, back, shoulders, arms, core':
    'Treino B e os 7 treinos de calistenia — pernas, peito, costas, ombros, braços, core',
  'Recovery tracking for every muscle': 'Acompanhamento da recuperação de cada músculo',
  'Your full training log, lifts and personal bests': 'Seu diário completo, cargas e recordes pessoais',
  'Buy for {price}': 'Comprar por {price}',
  'Already bought it?': 'Já comprou?',
  'Paste your license key': 'Cole sua chave de licença',
  'Activate': 'Ativar',
  'Not now': 'Agora não',
  'Paste the key from your purchase email.': 'Cole a chave do e-mail da sua compra.',
  'Checking…': 'Verificando…',
  'That key didn’t work.': 'Essa chave não funcionou.',
  'You need to be online to activate. Try again with a connection.': 'Você precisa estar on-line para ativar. Tente de novo com conexão.',
  'Iron 40 unlocked': 'Iron 40 desbloqueado',
  'Everything is open on this phone: all demos, videos, recovery, progress and your log.':
    'Tudo liberado neste celular: demonstrações, vídeos, recuperação, progresso e seu histórico.',
  'Let’s lift': 'Bora treinar',

  // ---- profile ----
  'Welcome to Iron 40': 'Boas-vindas ao Iron 40',
  'Free-weight and bodyweight training for men and women in their 30s and 40+: animated form demos, joint-smart tips and automatic progression.':
    'Treino com pesos livres e peso corporal para homens e mulheres de 30 e 40+: demonstrações animadas, dicas que protegem as articulações e progressão automática.',
  'Language': 'Idioma',
  'Show me': 'Mostrar',
  'Men': 'Homens',
  'Women': 'Mulheres',
  'Age group': 'Faixa etária',
  '30s': '30–39',
  'Sets the photos, coaching tips and recovery times. You can change it anytime from the profile button.':
    'Define as fotos, as dicas e os tempos de recuperação. Você pode mudar quando quiser pelo botão de perfil.',
  'Joints to protect': 'Articulações a proteger',
  'Workouts swap in gentler moves that work the same muscles.': 'Os treinos trocam por movimentos mais suaves que trabalham os mesmos músculos.',
  'Equipment I have': 'Equipamentos que tenho',
  'Check with your doctor before starting a new exercise program, especially with heart, blood pressure, or joint issues. Stop any exercise that causes sharp pain.':
    'Consulte seu médico antes de começar um novo programa de exercícios, principalmente se tiver problemas cardíacos, de pressão ou nas articulações. Pare qualquer exercício que cause dor aguda.',
  'Your data · {n} workout on this device': 'Seus dados · {n} treino neste aparelho',
  'Your data · {n} workouts on this device': 'Seus dados · {n} treinos neste aparelho',
  'Everything is stored only on this device. Save a backup now and then, and use it to move to a new phone.':
    'Tudo fica salvo só neste aparelho. Faça um backup de vez em quando e use-o para passar para um celular novo.',
  'Save backup': 'Salvar backup',
  'Export CSV': 'Exportar CSV',
  'Restore': 'Restaurar',
  "I understand — let's lift": 'Entendi — bora treinar',

  // ---- backup / restore ----
  'Backup saved. Keep it somewhere safe (Files, iCloud Drive, email to yourself).':
    'Backup salvo. Guarde em um lugar seguro (Arquivos, iCloud Drive ou mande por e-mail para você).',
  'CSV saved — opens in Numbers, Excel or Google Sheets.': 'CSV salvo — abre no Numbers, Excel ou Google Planilhas.',
  'That file isn’t an Iron 40 backup.': 'Esse arquivo não é um backup do Iron 40.',
  'this backup': 'este backup',
  'Restore {n} workout from {date}? This replaces the {m} on this device.':
    'Restaurar {n} treino de {date}? Isso substitui os {m} deste aparelho.',
  'Restore {n} workouts from {date}? This replaces the {m} on this device.':
    'Restaurar {n} treinos de {date}? Isso substitui os {m} deste aparelho.',
  'Couldn’t read that file. Choose the .json backup Iron 40 saved.': 'Não foi possível ler esse arquivo. Escolha o backup .json que o Iron 40 salvou.',
});
