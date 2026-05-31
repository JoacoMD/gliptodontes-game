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
            <button
              type="button"
              onClick={() => navigate(`/aprender/${t.id}`)}
              style={{
                backgroundImage: "url('/assets/ui/gliptodontes-container%201.png')",
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
              }}
              className="w-full min-h-[96px] px-8 py-5 text-left transition-[transform,filter] duration-200 hover:scale-[1.04] hover:drop-shadow-[0_0_18px_rgba(255,193,107,0.85)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <span className="flex w-full flex-col items-start gap-1">
                <span className="text-xl font-bold text-text-primary">{t.title}</span>
                <span className="text-sm font-normal text-text-secondary">{t.summary}</span>
              </span>
            </button>
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
