export type Tool = 'pick' | 'chisel' | 'brush';

export const TOOL_LABEL: Record<Tool, string> = {
  pick: 'Pico',
  chisel: 'Cincel',
  brush: 'Pincel',
};

export const TOOL_DESCRIPTION: Record<Tool, string> = {
  pick: 'Para retirar la matriz más alejada del fósil.',
  chisel: 'Para acercarte al hueso con precisión.',
  brush: 'Para descubrir el fósil sin dañarlo.',
};

export type ExcavationStatus = 'idle' | 'playing' | 'paused' | 'success' | 'failure';

export type Zone = 'on' | 'near' | 'far';

export type Phase = 1 | 2;

export interface ExcavationState {
  status: ExcavationStatus;
  phase: Phase;
  /** Progreso de la fase actual (0..1). */
  progress: number;
  lives: number;
  timeLeft: number; // segundos; 0 si no hay límite
  timed: boolean;
  selectedTool: Tool;
}
