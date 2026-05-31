export interface HelpButtonProps {
  onClick: () => void;
}

/**
 * Floating help FAB used inside every minigame. Fixed bottom-right.
 */
export function HelpButton({ onClick }: HelpButtonProps): React.JSX.Element {
  return (
    <button
      type="button"
      aria-label="Ayuda — abrir ¿Cómo jugar?"
      onClick={onClick}
      className="absolute bottom-4 right-4 z-30 h-14 w-14 transition-transform hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-full"
    >
      <img
        src="/assets/ui/boton_ayuda.png"
        alt=""
        aria-hidden
        className="h-full w-full select-none object-contain"
        draggable={false}
      />
    </button>
  );
}
