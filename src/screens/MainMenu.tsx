import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '@/config/Constants';
import { Button } from '@/components/ui/Button';
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
      className="flex h-full w-full flex-col items-center justify-between gap-6 p-6 text-center"
    >
      <header className="mt-12 space-y-2">
        <p className="text-2xl text-text-secondary">Caminando sobre</p>
        <h1 className="font-decorative text-5xl text-accent">GLIPTODONTES</h1>
        <p className="text-xl text-text-secondary">y tigres dientes de sable</p>
      </header>
      <nav aria-label="Acciones principales" className="flex w-full flex-col items-center gap-4 pb-12">
        <Button size="lg" fullWidth onClick={() => navigate(RoutePaths.Missions)}>
          Empieza la aventura
        </Button>
        <Button size="lg" variant="secondary" fullWidth onClick={() => navigate(RoutePaths.Learn)}>
          Aprender más
        </Button>
        <Button size="md" variant="ghost" fullWidth onClick={() => navigate(RoutePaths.Settings)}>
          Ajustes
        </Button>
      </nav>
    </section>
  );
}
