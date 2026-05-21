import { IconButton } from './IconButton';

export interface HelpButtonProps {
  onClick: () => void;
}

/**
 * Floating help FAB used inside every minigame. Fixed bottom-right.
 */
export function HelpButton({ onClick }: HelpButtonProps): React.JSX.Element {
  return (
    <IconButton
      label="Ayuda — abrir ¿Cómo jugar?"
      onClick={onClick}
      className="absolute bottom-4 right-4 z-30 h-14 w-14 text-2xl font-bold shadow-lg"
    >
      ?
    </IconButton>
  );
}
