export type Tool = 'pick' | 'chisel' | 'brush';

/** Layer index -> the tool that clears it. */
export const TOOL_FOR_LAYER: readonly Tool[] = ['pick', 'chisel', 'brush'] as const;

export const TOOL_LABEL: Record<Tool, string> = {
  pick: 'Pico',
  chisel: 'Cincel',
  brush: 'Pincel',
};

export const TOOL_DESCRIPTION: Record<Tool, string> = {
  pick: 'Para romper la primera capa de tierra dura.',
  chisel: 'Para retirar la segunda capa de roca.',
  brush: 'Para limpiar suavemente la última capa de arena fina.',
};

export type ExcavationStatus = 'idle' | 'playing' | 'paused' | 'success' | 'failure';

export type LayerIndex = 0 | 1 | 2;

export interface ExcavationState {
  status: ExcavationStatus;
  layer: LayerIndex;
  layerPct: number; // 0..1
  lives: number;
  timeLeft: number; // seconds; 0 if no time limit
  timed: boolean;
  selectedTool: Tool;
}
