import { useCallback, useEffect } from 'react';
import {
  TOOL_DESCRIPTION,
  TOOL_FOR_LAYER,
  TOOL_LABEL,
  type Tool,
} from '@/minigames/excavation/types';

export interface ToolDockProps {
  selected: Tool;
  /** Tool the current layer requires; gets a subtle "suggested" outline. */
  required?: Tool;
  onSelect: (tool: Tool) => void;
}

const ORDER: readonly Tool[] = TOOL_FOR_LAYER;

const KEY_TO_TOOL: Record<string, Tool> = {
  '1': 'pick',
  '2': 'chisel',
  '3': 'brush',
};

const ICON: Record<Tool, string> = {
  pick: '⛏️', // pickaxe
  chisel: '🪛', // chisel
  brush: '🫒', // brush
};

export function ToolDock({ selected, required, onSelect }: ToolDockProps): React.JSX.Element {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      const tool = KEY_TO_TOOL[e.key];
      if (tool && e.target === document.body) {
        onSelect(tool);
      }
    },
    [onSelect],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
    };
  }, [handleKey]);

  return (
    <div
      role="toolbar"
      aria-label="Herramientas de excavación"
      aria-keyshortcuts="1 2 3"
      className="flex items-stretch justify-around gap-3"
    >
      {ORDER.map((tool, i) => {
        const isSelected = selected === tool;
        const isRequired = required === tool;
        return (
          <button
            key={tool}
            type="button"
            aria-pressed={isSelected}
            aria-label={`${TOOL_LABEL[tool]}. ${TOOL_DESCRIPTION[tool]}`}
            aria-keyshortcuts={String(i + 1)}
            onClick={() => onSelect(tool)}
            className={[
              'flex flex-1 flex-col items-center justify-center gap-1 rounded-xl border-2 px-3 py-3 transition-colors min-h-[88px]',
              isSelected
                ? 'border-panel-border bg-accent text-white'
                : 'border-panel-border bg-panel text-text-primary hover:bg-accent/20',
              isRequired && !isSelected ? 'ring-2 ring-accent ring-offset-2' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <span aria-hidden className="text-3xl">
              {ICON[tool]}
            </span>
            <span className="text-sm font-semibold">{TOOL_LABEL[tool]}</span>
            <span aria-hidden className="text-[10px] text-current/70">
              [{i + 1}]
            </span>
          </button>
        );
      })}
    </div>
  );
}
