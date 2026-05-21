import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '@/config/Constants';
import { Button } from '@/components/ui/Button';
import { MISSIONS } from '@/data/missions';
import { useSave } from '@/hooks/useSave';

export function Missions(): React.JSX.Element {
  const navigate = useNavigate();
  const save = useSave();
  return (
    <section
      aria-label="Misiones"
      className="flex h-full w-full flex-col p-6"
    >
      <h1 className="mb-6 text-center font-decorative text-4xl text-accent">Misiones</h1>
      <ul className="flex flex-1 flex-col gap-4 overflow-y-auto">
        {MISSIONS.map((m) => {
          const done = save.completedMissions.includes(m.id);
          return (
            <li key={m.id}>
              <Button
                size="lg"
                fullWidth
                aria-describedby={`mission-desc-${m.id}`}
                onClick={() => navigate(m.route)}
              >
                <span className="flex w-full flex-col items-start gap-1">
                  <span className="font-semibold">
                    {m.title}
                    {done && <span className="ml-2 text-sm text-success" aria-label="Completada">✓</span>}
                  </span>
                  <span
                    id={`mission-desc-${m.id}`}
                    className="text-sm font-normal text-white/80"
                  >
                    {m.description}
                  </span>
                </span>
              </Button>
            </li>
          );
        })}
      </ul>
      <Button
        variant="ghost"
        fullWidth
        className="mt-6"
        onClick={() => navigate(RoutePaths.MainMenu)}
      >
        Volver
      </Button>
    </section>
  );
}
