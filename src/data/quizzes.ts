import type { QuizQuestion } from '@/types';

export const ORIGIN_QUIZ: QuizQuestion[] = [
  {
    id: 'smilodon',
    prompt: 'El tigre dientes de sable venía de…',
    options: [
      { id: 'sudamerica', label: 'Sudamérica', correct: false },
      { id: 'norteamerica', label: 'Norteamérica', correct: true },
    ],
  },
  {
    id: 'gliptodonte',
    prompt: 'El gliptodonte habitaba originalmente en…',
    options: [
      { id: 'sudamerica', label: 'Sudamérica', correct: true },
      { id: 'norteamerica', label: 'Norteamérica', correct: false },
    ],
  },
];
