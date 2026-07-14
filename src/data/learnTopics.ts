import type { LearnCategory, LearnTopic } from '@/types';

export const LEARN_CATEGORIES: LearnCategory[] = [
  {
    id: 'megafauna',
    title: 'La megafauna',
    summary: 'Los gigantes que habitaron la Pampa hace miles de años.',
  },
  {
    id: 'historia-tierra',
    title: 'La historia de la Tierra',
    summary: 'Cómo se movieron los continentes y llegaron estos animales.',
  },
  {
    id: 'fosiles-la-plata',
    title: 'Los fósiles en La Plata',
    summary: 'Dónde aparecieron y por qué hay que cuidarlos.',
  },
  {
    id: 'paleontologia',
    title: 'El trabajo del paleontólogo',
    summary: 'La ciencia que estudia la vida del pasado.',
  },
];

export const LEARN_TOPICS: LearnTopic[] = [
  // --- Categoría: megafauna ---
  {
    id: 'perezoso-gigante',
    categoryId: 'megafauna',
    title: 'Perezoso gigante',
    summary: 'Un perezoso del tamaño de un elefante que vivía en el suelo.',
    facts: [
      { label: 'Época', value: 'Hace más de 10 000 años (Pleistoceno)' },
      { label: 'Tamaño', value: 'Hasta 6 metros de largo y 4 toneladas' },
      { label: 'Qué comía', value: 'Plantas, hojas y ramas' },
      { label: 'Dónde vivía', value: 'Llanuras y bosques de la Pampa' },
    ],
    paragraphs: [
      'Era un pariente gigante de los perezosos actuales, pero vivía en el suelo.',
      'Podía pararse en dos patas apoyándose en su cola para alcanzar las hojas más altas de los árboles. Sus garras enormes le servían para bajar ramas.',
    ],
    didYouKnow: '¡Era tan grande como un elefante de hoy!',
  },
  {
    id: 'gliptodonte',
    categoryId: 'megafauna',
    title: 'Gliptodonte',
    summary: 'Un pariente gigante del armadillo, con caparazón de hueso.',
    facts: [
      { label: 'Época', value: 'Hace más de 10 000 años (Pleistoceno)' },
      { label: 'Tamaño', value: 'Cerca de 1,5 metros de alto, hasta 1 tonelada' },
      { label: 'Qué comía', value: 'Pastos y plantas bajas' },
      { label: 'Dónde vivía', value: 'Las llanuras pampeanas' },
    ],
    paragraphs: [
      'Era un pariente lejano de los armadillos, pero del tamaño de un auto chico.',
      'Tenía un caparazón redondo y duro hecho de hueso que lo protegía de los depredadores. Caminaba despacio comiendo pasto.',
    ],
    didYouKnow:
      'Su caparazón estaba formado por más de mil placas de hueso, y algunos tenían una cola con púas para defenderse.',
  },
  {
    id: 'toxodonte',
    categoryId: 'megafauna',
    title: 'Toxodonte',
    summary: 'Parecido a un rinoceronte sin cuerno, pero único de Sudamérica.',
    facts: [
      { label: 'Época', value: 'Hace más de 10 000 años (Pleistoceno)' },
      { label: 'Tamaño', value: 'Cerca de 2,7 metros de largo y 1,5 toneladas' },
      { label: 'Qué comía', value: 'Pastos y plantas' },
      { label: 'Dónde vivía', value: 'Cerca de ríos y lagunas de la Pampa' },
    ],
    paragraphs: [
      'Se parecía a un rinoceronte sin cuerno o a un hipopótamo, pero no era pariente de ninguno de los dos.',
      'Era un ungulado nativo, un grupo de animales que solo existió en Sudamérica. Tenía patas fuertes y cuerpo robusto.',
    ],
    didYouKnow:
      'Charles Darwin encontró un cráneo de toxodonte en su viaje por Sudamérica y quedó fascinado.',
  },
  {
    id: 'macrauquenia',
    categoryId: 'megafauna',
    title: 'Macrauquenia',
    summary: 'Un animal con cuerpo de camello y quizá una pequeña trompa.',
    facts: [
      { label: 'Época', value: 'Hace más de 10 000 años (Pleistoceno)' },
      { label: 'Tamaño', value: 'Cerca de 3 metros de largo' },
      { label: 'Qué comía', value: 'Hojas y plantas' },
      { label: 'Dónde vivía', value: 'Las llanuras de la Pampa' },
    ],
    paragraphs: [
      'Tenía el cuerpo parecido a un camello o una llama, con patas largas y cuello alto.',
      'También era un ungulado nativo, solo de Sudamérica. Podía correr para escapar de los depredadores.',
    ],
    didYouKnow:
      'Sus fosas nasales estaban arriba de la cabeza; algunos científicos creen que tenía una pequeña trompa.',
  },
  {
    id: 'mastodonte',
    categoryId: 'megafauna',
    title: 'Mastodonte',
    summary: 'Un pariente de los elefantes, con colmillos y trompa.',
    facts: [
      { label: 'Época', value: 'Hace más de 10 000 años (Pleistoceno)' },
      { label: 'Tamaño', value: 'Cerca de 2,5 a 3 metros de alto' },
      { label: 'Qué comía', value: 'Ramas, hojas y frutos' },
      { label: 'Dónde vivía', value: 'Bosques y llanuras' },
    ],
    paragraphs: [
      'Era un pariente de los elefantes actuales, con colmillos largos y trompa.',
      'Llegó a Sudamérica desde el norte cuando se conectaron los continentes.',
    ],
    didYouKnow: 'No es lo mismo que un mamut: eran parientes, pero especies distintas.',
  },
  {
    id: 'caballo-americano',
    categoryId: 'megafauna',
    title: 'Caballo americano',
    summary: 'Un caballo salvaje que vivió en la Pampa y se extinguió.',
    facts: [
      { label: 'Época', value: 'Hace más de 10 000 años (Pleistoceno)' },
      { label: 'Tamaño', value: 'Parecido a un caballo actual, algo más robusto' },
      { label: 'Qué comía', value: 'Pastos' },
      { label: 'Dónde vivía', value: 'Las llanuras pampeanas' },
    ],
    paragraphs: [
      'Era un caballo salvaje que vivió en Sudamérica hace miles de años.',
      'Llegó desde el norte cuando se unieron los continentes de América.',
    ],
    didYouKnow:
      'Los caballos se extinguieron en América y recién volvieron cuando los trajeron los españoles, hace unos 500 años.',
  },
  {
    id: 'tigre-dientes-de-sable',
    categoryId: 'megafauna',
    title: 'Tigre dientes de sable',
    summary: 'Un gran cazador con dos colmillos enormes.',
    facts: [
      { label: 'Época', value: 'Hace más de 10 000 años (Pleistoceno)' },
      { label: 'Tamaño', value: 'Cerca de 1,2 metros de alto' },
      { label: 'Qué comía', value: 'Otros animales grandes (era carnívoro)' },
      { label: 'Dónde vivía', value: 'Las llanuras de la Pampa' },
    ],
    paragraphs: [
      'Era un gran cazador con dos colmillos enormes en la mandíbula de arriba.',
      'Cazaba presas grandes como gliptodontes jóvenes o caballos. Era fuerte y musculoso.',
    ],
    didYouKnow:
      'No era realmente un tigre, y usaba sus colmillos para dar mordidas muy precisas.',
  },
  {
    id: 'oso-gigante',
    categoryId: 'megafauna',
    title: 'Oso gigante',
    summary: 'Uno de los osos más grandes que existió en el planeta.',
    facts: [
      { label: 'Época', value: 'Hace más de 10 000 años (Pleistoceno)' },
      { label: 'Tamaño', value: 'Hasta 3,5 metros parado y más de 1 tonelada' },
      { label: 'Qué comía', value: 'De todo: plantas, frutos y otros animales' },
      { label: 'Dónde vivía', value: 'Sudamérica, incluida la Pampa' },
    ],
    paragraphs: [
      'Fue uno de los osos más grandes que existió en el planeta.',
      'Parado en dos patas era mucho más alto que una persona. A pesar de su tamaño, comía de todo un poco.',
    ],
    didYouKnow: '¡Se lo considera el oso más grande que se conoce en la historia!',
  },
  {
    id: 'ave-del-terror',
    categoryId: 'megafauna',
    title: 'Ave del terror',
    summary: 'Un ave gigante que no volaba, pero corría y cazaba.',
    facts: [
      { label: 'Época', value: 'Antes y durante la megafauna' },
      { label: 'Tamaño', value: 'Hasta 3 metros de alto' },
      { label: 'Qué comía', value: 'Otros animales (era carnívora)' },
      { label: 'Dónde vivía', value: 'Las llanuras de Sudamérica' },
    ],
    paragraphs: [
      'Eran aves enormes que no podían volar, pero corrían muy rápido con sus patas fuertes.',
      'Tenían un pico gigante y filoso para cazar. Se las llama "aves del terror".',
    ],
    didYouKnow:
      'Fueron de los depredadores más temidos antes de que aparecieran los grandes mamíferos carnívoros.',
  },

  // --- Categoría: historia-tierra ---
  {
    id: 'deriva-continental',
    categoryId: 'historia-tierra',
    title: 'La deriva continental',
    summary: 'Los continentes se movieron y Sudamérica quedó aislada.',
    paragraphs: [
      'Hace muchísimos años los continentes estaban todos pegados formando uno solo.',
      'Con el tiempo se fueron separando muy lentamente, moviéndose apenas unos centímetros por año. Sudamérica quedó como una gran isla, separada del resto durante millones de años.',
    ],
    didYouKnow:
      'Como estuvo aislada tanto tiempo, en Sudamérica aparecieron animales únicos que no existían en ningún otro lugar del mundo.',
  },
  {
    id: 'gran-intercambio',
    categoryId: 'historia-tierra',
    title: 'El Gran Intercambio Americano',
    summary: 'Un puente de tierra conectó América del Norte y del Sur.',
    paragraphs: [
      'Hace unos 3 millones de años se formó un puente de tierra en Panamá que unió América del Norte con América del Sur.',
      'Entonces los animales pudieron cruzar de un lado al otro. Algunos subieron al norte y otros bajaron al sur.',
    ],
    didYouKnow:
      'Así llegaron a la Pampa los mastodontes, los caballos y los tigres dientes de sable, que venían del norte.',
  },

  // --- Categoría: fosiles-la-plata ---
  {
    id: 'fosiles-bajo-la-ciudad',
    categoryId: 'fosiles-la-plata',
    title: 'Fósiles bajo la ciudad',
    summary: 'Aparecieron fósiles al construir lugares conocidos de La Plata.',
    paragraphs: [
      'En La Plata se encontraron fósiles en lugares muy conocidos. Cuando se hacían obras para construir aparecían huesos antiguos bajo la tierra.',
      'Por ejemplo, se hallaron restos al construir el Estadio Ciudad de La Plata, el Teatro Argentino y el Cementerio.',
    ],
    didYouKnow:
      '¡Debajo de las ciudades donde vivimos pueden estar escondidos fósiles de miles de años!',
  },
  {
    id: 'importancia-fosiles',
    categoryId: 'fosiles-la-plata',
    title: 'Por qué son importantes',
    summary: 'Tienen valor científico y cultural para todos.',
    paragraphs: [
      'Los fósiles tienen valor científico: nos dan información para entender cómo era el pasado, cómo es el presente y hasta para imaginar el futuro.',
      'También tienen valor cultural, porque son parte de la historia de nuestra región.',
    ],
    didYouKnow:
      'Cada fósil es una pieza única de un rompecabezas gigante sobre la vida de hace miles de años.',
  },
  {
    id: 'fosiles-protegidos',
    categoryId: 'fosiles-la-plata',
    title: 'Los fósiles están protegidos',
    summary: 'Son patrimonio de todos y los cuida una ley.',
    paragraphs: [
      'Los fósiles son patrimonio de todos, no de una sola persona.',
      'Por eso están protegidos por una ley nacional que cuida el patrimonio arqueológico y paleontológico. Sacarlos de su lugar o venderlos está prohibido.',
    ],
    didYouKnow:
      'Al ser de todos, los fósiles importantes se guardan en museos para que cualquiera pueda conocerlos y estudiarlos.',
  },

  // --- Categoría: paleontologia ---
  {
    id: 'que-es-la-paleontologia',
    categoryId: 'paleontologia',
    title: '¿Qué es la paleontología?',
    summary: 'La ciencia que estudia la vida del pasado a partir de los fósiles.',
    paragraphs: [
      'Es la ciencia que estudia la vida del pasado a partir de los fósiles. Los paleontólogos buscan, excavan y analizan restos para reconstruir cómo era la vida hace millones de años.',
      'Cada fósil es una pieza única de un rompecabezas enorme.',
    ],
    didYouKnow:
      'Con un solo hueso, un paleontólogo puede descubrir cómo era, qué comía y cómo se movía un animal que ya no existe.',
  },
  {
    id: 'que-hacer-al-encontrar-un-fosil',
    categoryId: 'paleontologia',
    title: '¿Qué hago si encuentro un fósil?',
    summary: 'No lo toques, avisá a un adulto y llamá al museo.',
    paragraphs: [
      'Lo primero es no tocarlo, porque podrías romperlo o perder información importante. Avisá a un adulto y saquen una foto para marcar el lugar.',
      'Después hay que llamar al museo de ciencias naturales más cercano, que avisa a las autoridades responsables.',
    ],
    didYouKnow:
      'Sacar un fósil de su lugar destruye pistas científicas que no se pueden recuperar. Por eso lo mejor es dejarlo y avisar.',
  },
  {
    id: 'como-llegan-a-los-museos',
    categoryId: 'paleontologia',
    title: '¿Cómo llegan a los museos?',
    summary: 'Los paleontólogos los rescatan y los llevan a las colecciones.',
    paragraphs: [
      'Cuando se avisa de un hallazgo, un grupo de paleontólogos va al rescate. Con sus herramientas extraen el fósil con mucho cuidado, toman nota de todo lo que hay alrededor y fotografían el lugar.',
      'Después lo llevan al museo para que forme parte de las colecciones.',
    ],
    didYouKnow:
      'En el museo los fósiles se conservan y ordenan para poder estudiarlos y mostrarlos durante muchísimos años.',
  },
];

export function getTopicsByCategory(categoryId: string): LearnTopic[] {
  return LEARN_TOPICS.filter((t) => t.categoryId === categoryId);
}
