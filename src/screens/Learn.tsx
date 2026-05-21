import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '@/config/Constants';
import { Button } from '@/components/ui/Button';
import { LEARN_TOPICS } from '@/data/learnTopics';

export function Learn(): React.JSX.Element {
  const navigate = useNavigate();
  return (
    <section aria-label="Aprender" className="flex h-full w-full flex-col p-6">
      <h1 className="mb-6 text-center font-decorative text-4xl text-accent">Aprender</h1>
      <ul className="flex flex-1 flex-col gap-4 overflow-y-auto">
        {LEARN_TOPICS.map((t) => (
          <li key={t.id}>
            <Button
              size="lg"
              fullWidth
              variant="secondary"
              onClick={() => navigate(`/aprender/${t.id}`)}
            >
              <span className="flex w-full flex-col items-start gap-1">
                <span className="font-semibold">{t.title}</span>
                <span className="text-sm font-normal text-text-secondary">{t.summary}</span>
              </span>
            </Button>
          </li>
        ))}
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
