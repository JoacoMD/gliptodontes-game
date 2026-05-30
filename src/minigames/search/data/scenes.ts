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
  didYouKnow:
    'Los paleontólogos pueden tardar semanas en limpiar un solo fósil con pinceles finos.',
  objects: [
    {
      id: 'pincel',
      name: 'Pincel',
      category: 'tool',
      hitbox: { x: 80, y: 420, w: 140, h: 120 },
      iconKey: 'search-icon-pincel',
      fact: 'Sirve para limpiar fósiles sin dañarlos.',
    },
    {
      id: 'martillo',
      name: 'Martillo',
      category: 'tool',
      hitbox: { x: 280, y: 500, w: 160, h: 130 },
      iconKey: 'search-icon-martillo',
      fact: 'Permite fracturar roca para acceder a los fósiles.',
    },
    {
      id: 'lupa',
      name: 'Lupa',
      category: 'tool',
      hitbox: { x: 500, y: 450, w: 140, h: 140 },
      iconKey: 'search-icon-lupa',
      fact: 'Para observar detalles muy pequeños en los huesos.',
    },
    {
      id: 'cuaderno',
      name: 'Cuaderno de campo',
      category: 'tool',
      hitbox: { x: 100, y: 720, w: 180, h: 140 },
      iconKey: 'search-icon-cuaderno',
      fact: 'Para anotar todo lo que se encuentra en el yacimiento.',
    },
    {
      id: 'gps',
      name: 'GPS',
      category: 'tool',
      hitbox: { x: 320, y: 760, w: 140, h: 130 },
      iconKey: 'search-icon-gps',
      fact: 'Para marcar la ubicación exacta de cada hallazgo.',
    },
    {
      id: 'cinta',
      name: 'Cinta métrica',
      category: 'tool',
      hitbox: { x: 500, y: 720, w: 150, h: 150 },
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
  didYouKnow:
    'Los gliptodontes vivieron en Sudamérica hasta hace unos 10.000 años, al final de la última glaciación.',
  objects: [
    {
      id: 'placa-caparazon',
      name: 'Placa de caparazón',
      category: 'fossil',
      hitbox: { x: 60, y: 440, w: 160, h: 130 },
      iconKey: 'search-icon-placa',
      fact: 'Cada caparazón de gliptodonte tenía miles de placas óseas.',
    },
    {
      id: 'diente',
      name: 'Diente',
      category: 'fossil',
      hitbox: { x: 260, y: 460, w: 120, h: 110 },
      iconKey: 'search-icon-diente',
      fact: 'Por la forma del diente sabemos qué comía un animal extinto.',
    },
    {
      id: 'femur',
      name: 'Fémur',
      category: 'fossil',
      hitbox: { x: 430, y: 440, w: 200, h: 130 },
      iconKey: 'search-icon-femur',
      fact: 'El fémur es el hueso más grande del cuerpo y suele preservarse bien.',
    },
    {
      id: 'huella',
      name: 'Huella',
      category: 'fossil',
      hitbox: { x: 80, y: 720, w: 200, h: 160 },
      iconKey: 'search-icon-huella',
      fact: 'Las icnitas son huellas fosilizadas; cuentan cómo se movía un animal.',
    },
    {
      id: 'caracol',
      name: 'Caracol fósil',
      category: 'fossil',
      hitbox: { x: 320, y: 760, w: 130, h: 130 },
      iconKey: 'search-icon-caracol',
      fact: 'Los moluscos fósiles ayudan a fechar las capas de roca.',
    },
    {
      id: 'mandibula',
      name: 'Mandíbula',
      category: 'fossil',
      hitbox: { x: 490, y: 740, w: 180, h: 150 },
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
  didYouKnow:
    'En los museos, las piezas se clasifican por especie, edad geológica y lugar de hallazgo.',
  objects: [
    {
      id: 'caparazon-completo',
      name: 'Caparazón',
      category: 'specimen',
      hitbox: { x: 80, y: 420, w: 240, h: 200 },
      iconKey: 'search-icon-caparazon-completo',
      fact: 'Un caparazón entero de gliptodonte podía pesar más de 400 kg.',
    },
    {
      id: 'cola-armadura',
      name: 'Cola con armadura',
      category: 'specimen',
      hitbox: { x: 380, y: 460, w: 240, h: 130 },
      iconKey: 'search-icon-cola',
      fact: 'Algunos gliptodontes tenían colas con púas óseas para defenderse.',
    },
    {
      id: 'cartel',
      name: 'Cartel informativo',
      category: 'specimen',
      hitbox: { x: 60, y: 660, w: 200, h: 110 },
      iconKey: 'search-icon-cartel',
      fact: 'Los carteles explican qué pieza es y cuándo vivió el animal.',
    },
    {
      id: 'reconstruccion',
      name: 'Reconstrucción',
      category: 'specimen',
      hitbox: { x: 290, y: 640, w: 180, h: 180 },
      iconKey: 'search-icon-reconstruccion',
      fact: 'Las reconstrucciones combinan huesos reales con réplicas.',
    },
    {
      id: 'vitrina',
      name: 'Vitrina',
      category: 'specimen',
      hitbox: { x: 500, y: 660, w: 180, h: 200 },
      iconKey: 'search-icon-vitrina',
      fact: 'Las vitrinas controlan la humedad para que los fósiles no se dañen.',
    },
    {
      id: 'etiqueta',
      name: 'Etiqueta de inventario',
      category: 'specimen',
      hitbox: { x: 60, y: 880, w: 200, h: 110 },
      iconKey: 'search-icon-etiqueta',
      fact: 'Cada pieza tiene un código único en la colección del museo.',
    },
  ],
};

export const SEARCH_SCENES: SearchSceneDef[] = [LAB_SCENE, SITE_SCENE, MUSEUM_SCENE];
