import type { LearnTopic } from '@/types';

export const LEARN_TOPICS: LearnTopic[] = [
  {
    id: 'animales-del-pasado',
    title: 'Animales del pasado',
    summary: 'Conocé a los gigantes que habitaron Sudamérica hace miles de años.',
    paragraphs: [
      'Los gliptodontes eran mamíferos con caparazón que vivían en las llanuras pampeanas.',
      'El tigre dientes de sable (Smilodon) cazaba presas grandes hace más de 10 000 años.',
    ],
  },
  {
    id: 'que-es-la-paleontologia',
    title: '¿Qué es la paleontología?',
    summary: 'La ciencia que estudia la vida del pasado a partir de los fósiles.',
    paragraphs: [
      'Los paleontólogos buscan, excavan y analizan restos para reconstruir cómo era la vida hace millones de años.',
      'Cada fósil es una pieza única de un rompecabezas enorme.',
    ],
  },
  {
    id: 'que-hacer-al-encontrar-un-fosil',
    title: '¿Qué hacer al encontrar un fósil?',
    summary: 'No lo toques. Avisá a un adulto y a las autoridades del museo más cercano.',
    paragraphs: [
      'Los fósiles son patrimonio de todos. Sacarlos del lugar destruye información científica importante.',
      'Marcá el lugar con una foto y comunicate con el museo de ciencias naturales más cercano.',
    ],
  },
];
