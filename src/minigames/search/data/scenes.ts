import type { SearchSceneDef } from '../types';

export const LAB_SCENE: SearchSceneDef = {
  id: 'lab',
  title: 'Laboratorio',
  intro: [
    'Estás preparando el equipo para una expedición.',
    'Encontrá las 6 herramientas escondidas en el laboratorio.',
    'Tocá cada una cuando la veas. Si te trabás, pedí una pista (tenés 2).',
  ],
  backgroundKey: 'search-lab-bg',
  backgroundPath: 'assets/search/search-lab-bg.png',
  didYouKnow:
    'Los paleontólogos pueden tardar semanas en limpiar un solo fósil con pinceles finos.',
  objects: [
    // Hitboxes calibradas contra public/assets/search/search-lab-bg.png (720×1280).
    {
      id: 'pincel',
      name: 'Pincel',
      category: 'tool',
      // Pincel apoyado junto a los frascos, parte superior izquierda del escritorio.
      hitbox: { x: 200, y: 620, w: 60, h: 110 },
      iconKey: 'search-icon-pincel',
      fact: 'Sirve para limpiar fósiles sin dañarlos.',
    },
    {
      id: 'martillo',
      name: 'Martillo',
      category: 'tool',
      // Martillo con mango claro sobre el cuaderno central.
      hitbox: { x: 360, y: 780, w: 100, h: 80 },
      iconKey: 'search-icon-martillo',
      fact: 'Permite fracturar roca para acceder a los fósiles.',
    },
    {
      id: 'lupa',
      name: 'Lupa',
      category: 'tool',
      // Lupa con mango verde en el centro del escritorio.
      hitbox: { x: 310, y: 870, w: 120, h: 90 },
      iconKey: 'search-icon-lupa',
      fact: 'Para observar detalles muy pequeños en los huesos.',
    },
    {
      id: 'cuaderno',
      name: 'Cuaderno de campo',
      category: 'tool',
      // Cuaderno abierto, centro-izquierda.
      hitbox: { x: 130, y: 790, w: 220, h: 70 },
      iconKey: 'search-icon-cuaderno',
      fact: 'Para anotar todo lo que se encuentra en el yacimiento.',
    },
    {
      id: 'gps',
      name: 'GPS',
      category: 'tool',
      // Aparato rectangular con pantalla, banda inferior central-derecha.
      hitbox: { x: 350, y: 970, w: 70, h: 70 },
      iconKey: 'search-icon-gps',
      fact: 'Para marcar la ubicación exacta de cada hallazgo.',
    },
    {
      id: 'cinta',
      name: 'Cinta métrica',
      category: 'tool',
      // Carrete amarillo redondo, esquina inferior derecha.
      hitbox: { x: 570, y: 960, w: 100, h: 80 },
      iconKey: 'search-icon-cinta',
      fact: 'Para medir el tamaño de los fósiles antes de moverlos.',
    },
  ],
};

export const SITE_SCENE: SearchSceneDef = {
  id: 'site',
  title: 'Yacimiento',
  intro: [
    'Estás excavando en un yacimiento de la Pampa.',
    'Encontrá los 6 fósiles parcialmente cubiertos por tierra y roca.',
    'Usá las pistas si te trabás (tenés 2).',
  ],
  backgroundKey: 'search-site-bg',
  backgroundPath: 'assets/search/search-site-bg.png',
  didYouKnow:
    'Los gliptodontes vivieron en Sudamérica hasta hace unos 10.000 años, al final de la última glaciación.',
  objects: [
    // Hitboxes calibradas contra public/assets/search/search-site-bg.png (720×1280).
    {
      id: 'placa-caparazon',
      name: 'Placa de caparazón',
      category: 'fossil',
      // Caparazón del gliptodonte semienterrado, mitad izquierda del pozo.
      hitbox: { x: 80, y: 520, w: 250, h: 200 },
      iconKey: 'search-icon-placa',
      fact: 'Cada caparazón de gliptodonte tenía miles de placas óseas.',
    },
    {
      id: 'diente',
      name: 'Diente',
      category: 'fossil',
      // Diente triangular marrón a la derecha del caparazón.
      hitbox: { x: 450, y: 520, w: 150, h: 150 },
      iconKey: 'search-icon-diente',
      fact: 'Por la forma del diente sabemos qué comía un animal extinto.',
    },
    {
      id: 'femur',
      name: 'Fémur',
      category: 'fossil',
      // Hueso largo cruzando entre piedras a la derecha.
      hitbox: { x: 420, y: 700, w: 260, h: 150 },
      iconKey: 'search-icon-femur',
      fact: 'El fémur es el hueso más grande del cuerpo y suele preservarse bien.',
    },
    {
      id: 'huella',
      name: 'Huella',
      category: 'fossil',
      // Icnita en arcilla, banda inferior izquierda-centro.
      hitbox: { x: 100, y: 860, w: 230, h: 140 },
      iconKey: 'search-icon-huella',
      fact: 'Las icnitas son huellas fosilizadas; cuentan cómo se movía un animal.',
    },
    {
      id: 'caracol',
      name: 'Caracol fósil',
      category: 'fossil',
      // Caracol en espiral, esquina inferior izquierda.
      hitbox: { x: 120, y: 1030, w: 140, h: 120 },
      iconKey: 'search-icon-caracol',
      fact: 'Los moluscos fósiles ayudan a fechar las capas de roca.',
    },
    {
      id: 'mandibula',
      name: 'Mandíbula',
      category: 'fossil',
      // Mandíbula con dientes, esquina inferior derecha.
      hitbox: { x: 400, y: 1050, w: 270, h: 120 },
      iconKey: 'search-icon-mandibula',
      fact: 'La mandíbula concentra mucha información sobre la dieta del animal.',
    },
  ],
};

export const MUSEUM_SCENE: SearchSceneDef = {
  id: 'museum',
  title: 'Museo',
  intro: [
    'Las piezas llegaron al museo y hay que identificarlas para la exhibición.',
    'Encontrá las 6 piezas catalogadas en la sala.',
    'Tenés 2 pistas, usalas con criterio.',
  ],
  backgroundKey: 'search-museum-bg',
  backgroundPath: 'assets/search/search-museum-bg.png',
  didYouKnow:
    'En los museos, las piezas se clasifican por especie, edad geológica y lugar de hallazgo.',
  objects: [
    // Hitboxes calibradas contra public/assets/search/search-museum-bg.png (720×1280).
    {
      id: 'caparazon-completo',
      name: 'Caparazón',
      category: 'specimen',
      // Caparazón completo sobre el pedestal, centro-izquierda.
      hitbox: { x: 120, y: 600, w: 260, h: 200 },
      iconKey: 'search-icon-caparazon-completo',
      fact: 'Un caparazón entero de gliptodonte podía pesar más de 400 kg.',
    },
    {
      id: 'cola-armadura',
      name: 'Cola con armadura',
      category: 'specimen',
      // Cola con púas sobre soporte, centro-derecha.
      hitbox: { x: 420, y: 730, w: 260, h: 100 },
      iconKey: 'search-icon-cola',
      fact: 'Algunos gliptodontes tenían colas con púas óseas para defenderse.',
    },
    {
      id: 'cartel',
      name: 'Cartel informativo',
      category: 'specimen',
      // Cartel "GLYPTODONT" en el frente del pedestal.
      hitbox: { x: 100, y: 820, w: 160, h: 110 },
      iconKey: 'search-icon-cartel',
      fact: 'Los carteles explican qué pieza es y cuándo vivió el animal.',
    },
    {
      id: 'reconstruccion',
      name: 'Reconstrucción',
      category: 'specimen',
      // Figura del mamífero reconstruido, abajo a la izquierda.
      hitbox: { x: 40, y: 1010, w: 200, h: 170 },
      iconKey: 'search-icon-reconstruccion',
      fact: 'Las reconstrucciones combinan huesos reales con réplicas.',
    },
    {
      id: 'vitrina',
      name: 'Vitrina',
      category: 'specimen',
      // Vitrina alta con estantes de fósiles, parte superior derecha.
      hitbox: { x: 320, y: 370, w: 260, h: 220 },
      iconKey: 'search-icon-vitrina',
      fact: 'Las vitrinas controlan la humedad para que los fósiles no se dañen.',
    },
    {
      id: 'etiqueta',
      name: 'Etiqueta de inventario',
      category: 'specimen',
      // Etiqueta de papel colgando, esquina inferior derecha.
      hitbox: { x: 460, y: 1060, w: 100, h: 140 },
      iconKey: 'search-icon-etiqueta',
      fact: 'Cada pieza tiene un código único en la colección del museo.',
    },
  ],
};

export const SEARCH_SCENES: SearchSceneDef[] = [LAB_SCENE, SITE_SCENE, MUSEUM_SCENE];
