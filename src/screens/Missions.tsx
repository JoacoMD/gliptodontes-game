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
      <h1 className="mb-6 text-center font-decorative text-8xl title-text">Misiones</h1>
      <ul className="flex flex-col md:flex-row md:flex-wrap overflow-y-auto gap-4 items-center">
        {MISSIONS.map((m) => {
          const done = save.completedMissions.includes(m.id);
          return (
            <li key={m.id} className="w-full max-w-[350px]">
              <button
                type="button"
                aria-describedby={`mission-desc-${m.id}`}
                onClick={() => navigate(m.route)}
                style={{
                  backgroundImage: "url('/assets/ui/gliptodontes-container%201.png')",
                  backgroundSize: '100% 100%',
                  backgroundRepeat: 'no-repeat',
                }}
                className="
                  w-full
                  max-w-[350px]
                  min-h-[96px]
                  px-10
                  py-12
                  text-left
                  transition-[transform,filter]
                  duration-200
                  hover:scale-[1.04]
                  hover:drop-shadow-[0_0_18px_rgba(255,193,107,0.85)]
                  active:scale-[0.98]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-focus
                  "              >
                <span className="flex w-full flex-col items-start gap-2 py-8 px-10">
                  <span className="text-2xl font-bold text-primary">
                    {m.title}
                    {done && <span className="ml-2 text-sm text-success" aria-label="Completada">✓</span>}
                  </span>
                  <span
                    id={`mission-desc-${m.id}`}
                    className="text-sm font-normal text-secondary"
                  >
                    {m.description}
                  </span>
                </span>
              </button>
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
