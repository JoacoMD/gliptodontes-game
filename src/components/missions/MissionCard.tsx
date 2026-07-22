import type { Mission } from '@/types';

export interface MissionCardProps {
  mission: Mission;
  completed: boolean;
}

export function MissionCard({ mission, completed }: MissionCardProps): React.JSX.Element {
  return (
    <article
      className="relative flex aspect-[16/9] w-full max-w-[400px] flex-col items-center justify-center gap-1 overflow-hidden px-[14%] text-center"
      style={{
        maxWidth: 'calc(400px * var(--font-scale))',
        backgroundImage: "url('/assets/ui/gliptodontes-container%201.png')",
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {completed && (
        <span className="pointer-events-none absolute right-[7%] top-[8%] -rotate-12 rounded-md border-2 border-success bg-white px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-success opacity-90">
          Completada ✓
        </span>
      )}
      {mission.image && (
        <img
          src={mission.image}
          alt={mission.imageAlt ?? ''}
          className="mb-1 h-[28%] w-auto rounded object-contain"
        />
      )}
      <div className="flex w-[80%] flex-col items-center justify-center text-center">
        <span className="text-xl font-bold leading-tight text-primary">
          {mission.title}
        </span>

        <span className="mt-1 text-lg leading-snug text-secondary">
          {mission.description}
        </span>
      </div>
    </article>
  );
}
