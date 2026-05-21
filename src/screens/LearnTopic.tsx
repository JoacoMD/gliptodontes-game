import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RoutePaths } from '@/config/Constants';
import { Button } from '@/components/ui/Button';
import { LEARN_TOPICS } from '@/data/learnTopics';
import { SaveStore } from '@/systems/SaveStore';
import { useNarrator } from '@/hooks/useNarrator';

export function LearnTopic(): React.JSX.Element {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { speak } = useNarrator();
  const topic = useMemo(
    () => LEARN_TOPICS.find((t) => t.id === topicId) ?? LEARN_TOPICS[0]!,
    [topicId],
  );

  useEffect(() => {
    SaveStore.markTopicVisited(topic.id);
  }, [topic.id]);

  return (
    <article
      aria-labelledby="topic-title"
      className="flex h-full w-full flex-col p-6"
    >
      <h1 id="topic-title" className="mb-4 text-center font-decorative text-3xl text-accent">
        {topic.title}
      </h1>
      <div className="flex-1 space-y-4 overflow-y-auto text-base leading-relaxed text-text-primary">
        {topic.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <Button
          fullWidth
          onClick={() => speak(`${topic.title}. ${topic.paragraphs.join(' ')}`, { interrupt: true })}
        >
          Leer en voz alta
        </Button>
        <Button variant="ghost" fullWidth onClick={() => navigate(RoutePaths.Learn)}>
          Volver
        </Button>
      </div>
    </article>
  );
}
