import { useCallback, useEffect } from 'react';
import {
  TOOL_DESCRIPTION,
  TOOL_LABEL,
  type Tool,
} from '@/minigames/excavation/types';

export interface ToolDockProps {
  selected: Tool;
  onSelect: (tool: Tool) => void;
}

const ORDER: readonly Tool[] = ['pick', 'chisel', 'brush'] as const;

const KEY_TO_TOOL: Record<string, Tool> = {
  '1': 'pick',
  '2': 'chisel',
  '3': 'brush',
};

const ICON: Record<Tool, string> = {
  pick: '/assets/excavation/tools/pickaxe.png',
  chisel: '/assets/excavation/tools/cincel.png',
  brush: '/assets/excavation/tools/brush.png',
};

export function ToolDock({ selected, onSelect }: ToolDockProps): React.JSX.Element {
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
      className="flex items-center justify-center gap-6"
    >
      {ORDER.map((tool, i) => {
        const isSelected = selected === tool;
        return (
          <button
            key={tool}
            type="button"
            aria-pressed={isSelected}
            aria-label={`${TOOL_LABEL[tool]}. ${TOOL_DESCRIPTION[tool]}`}
            aria-keyshortcuts={String(i + 1)}
            onClick={() => onSelect(tool)}
            className={[
              'flex h-20 w-20 items-center justify-center rounded-full border-4 bg-panel shadow-md transition-all',
              isSelected
                ? 'border-accent scale-110 ring-2 ring-accent/60'
                : 'border-panel-border hover:scale-105 hover:border-accent/70',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <img
              src={ICON[tool]}
              alt=""
              aria-hidden
              className="h-12 w-12 object-contain"
              draggable={false}
            />
            <span className="sr-only">
              {TOOL_LABEL[tool]} (atajo {i + 1})
            </span>
          </button>
        );
      })}
    </div>
  );
}
