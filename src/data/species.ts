export interface Species {
  id: string;
  name: string;
  origin: 'sudamerica' | 'norteamerica';
  era: string;
  funFact: string;
}

export const SPECIES: Species[] = [
  {
    id: 'gliptodonte',
    name: 'Gliptodonte',
    origin: 'sudamerica',
    era: 'Pleistoceno',
    funFact: 'Su caparazón estaba formado por miles de placas óseas llamadas osteodermos.',
  },
  {
    id: 'smilodon',
    name: 'Tigre dientes de sable',
    origin: 'norteamerica',
    era: 'Pleistoceno',
    funFact: 'Sus colmillos podían medir hasta 28 cm de largo.',
  },
];
