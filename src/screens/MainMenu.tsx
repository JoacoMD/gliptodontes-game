import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '@/config/Constants';
import { useNarrator } from '@/hooks/useNarrator';

export function MainMenu(): React.JSX.Element {
  const navigate = useNavigate();
  const { speak } = useNarrator();
  useEffect(() => {
    speak('Bienvenido a Caminando sobre Gliptodontes. Elegí una opción para comenzar.', {
      interrupt: true,
    });
  }, [speak]);

  return (
    <section
      aria-label="Menú principal"
      className="relative flex h-full w-full flex-col items-center justify-between gap-6 p-6 text-center"
    >
      <header className="mt-12">
        <h1 className="sr-only">Caminando sobre Gliptodontes y tigres dientes de sable</h1>
        <img
          src="/assets/ui/titulo.png"
          alt=""
          aria-hidden
          className="mx-auto h-auto w-full max-w-sm select-none main-title"
          draggable={false}
        />
      </header>
      <nav aria-label="Acciones principales" className="flex w-full flex-col items-center gap-4 pb-12">
        <button
          type="button"
          aria-label="Empieza la aventura"
          onClick={() => navigate(RoutePaths.Missions)}
          className="w-full max-w-sm transition-[transform,filter] duration-200 hover:scale-105 hover:drop-shadow-[0_0_18px_rgba(255,193,107,0.85)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-lg"
        >
          <img
            src="/assets/ui/empieza_la_aventura.png"
            alt=""
            aria-hidden
            className="h-auto w-full select-none"
            draggable={false}
          />
        </button>
        <button
          type="button"
          aria-label="Aprender más"
          onClick={() => navigate(RoutePaths.Learn)}
          className="w-full max-w-sm transition-[transform,filter] duration-200 hover:scale-105 hover:drop-shadow-[0_0_18px_rgba(255,193,107,0.85)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-lg"
        >
          <img
            src="/assets/ui/aprender_mas.png"
            alt=""
            aria-hidden
            className="h-auto w-full select-none"
            draggable={false}
          />
        </button>
      </nav>

      <button
        type="button"
        aria-label="Ajustes"
        onClick={() => navigate(RoutePaths.Settings)}
        className="absolute bottom-6 right-4 h-16 w-16 transition-[transform,filter] duration-200 hover:scale-110 hover:drop-shadow-[0_0_16px_rgba(255,193,107,0.9)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-full"
      >
        <img
          src="/assets/ui/gliptodontes-settings 1.png"
          alt=""
          aria-hidden
          className="h-full w-full select-none object-contain scale-175"
          draggable={false}
        />
      </button>
    </section>
  );
}
