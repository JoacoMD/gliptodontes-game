import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RoutePaths } from '@/config/Constants';
import { Button } from '@/components/ui/Button';
import { BoneButton } from '@/components/ui/BoneButton';
import { LEARN_TOPICS } from '@/data/learnTopics';
import { SaveStore } from '@/systems/SaveStore';
import { useNarrator } from '@/hooks/useNarrator';

export function LearnTopic(): React.JSX.Element | null {
  const { topicId } = useParams<{ categoryId: string; topicId: string }>();
  const navigate = useNavigate();
  const { speak } = useNarrator();

  const topic = useMemo(
    () => LEARN_TOPICS.find((t) => t.id === topicId),
    [topicId],
  );

  useEffect(() => {
    if (!topic) {
      navigate(RoutePaths.Learn, { replace: true });
      return;
    }
    SaveStore.markTopicVisited(topic.id);
  }, [topic, navigate]);

  if (!topic) return null;

  const narrate = () => {
    const factsText = topic.facts?.map((f) => `${f.label}: ${f.value}.`).join(' ') ?? '';
    const didYouKnow = topic.didYouKnow ? `¿Sabías que? ${topic.didYouKnow}` : '';
    speak(`${topic.title}. ${factsText} ${topic.paragraphs.join(' ')} ${didYouKnow}`, {
      interrupt: true,
    });
  };

  // Back target derives from the topic's own category, so it is always correct
  // even if the URL's :categoryId segment is missing or points at a different one.
  const backTo = `/aprender/${topic.categoryId}`;

  return (
    <article
      aria-labelledby="topic-title"
      className="flex h-full w-full flex-col p-6 bg-background/60"
    >
      <h1 id="topic-title" className="mb-4 text-center font-decorative text-3xl text-accent">
        {topic.title}
      </h1>

      <div className="flex-1 space-y-4 overflow-y-auto text-base leading-relaxed text-text-primary">
        {topic.facts && topic.facts.length > 0 && (
          <dl className="grid grid-cols-1 gap-2 rounded-xl border-2 border-panel-border bg-panel/60 p-4 sm:grid-cols-2">
            {topic.facts.map((f) => (
              <div key={f.label} className="flex flex-col">
                <dt className="text-xs font-bold uppercase tracking-wide text-text-secondary">
                  {f.label}
                </dt>
                <dd className="text-sm text-text-primary">{f.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {topic.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}

        {topic.didYouKnow && (
          <aside className="rounded-xl border-2 border-accent/60 bg-accent/10 p-4">
            <p className="mb-1 font-bold text-accent">¿Sabías que?</p>
            <p>{topic.didYouKnow}</p>
          </aside>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <Button fullWidth onClick={narrate}>
          Leer en voz alta
        </Button>
        <div className="flex items-center justify-start">
          <BoneButton
            onClick={() => navigate(backTo)}
            className="min-h-20 w-40 text-xl pb-2"
          >
            Volver
          </BoneButton>
        </div>
      </div>
    </article>
  );
}
