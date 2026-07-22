import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RoutePaths } from '@/config/Constants';
import { BoneButton } from '@/components/ui/BoneButton';
import { LEARN_CATEGORIES, getTopicsByCategory } from '@/data/learnTopics';
import { useNarrator } from '@/hooks/useNarrator';

export function LearnCategory(): React.JSX.Element | null {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { speak } = useNarrator();

  const category = useMemo(
    () => LEARN_CATEGORIES.find((c) => c.id === categoryId),
    [categoryId],
  );
  const topics = useMemo(
    () => (categoryId ? getTopicsByCategory(categoryId) : []),
    [categoryId],
  );

  useEffect(() => {
    if (!category) {
      navigate(RoutePaths.Learn, { replace: true });
      return;
    }
    speak(`${category.title}. ${category.summary}`, { interrupt: true });
  }, [category, navigate, speak]);

  if (!category) return null;

  return (
    <section aria-label={category.title} className="flex h-full w-full flex-col p-6">
      <h1 className="mb-2 text-center font-decorative text-5xl md:text-7xl title-text">
        {category.title}
      </h1>
      <p className="mb-4 text-center text-sm text-text-secondary">{category.summary}</p>
      <ul className="flex flex-col md:flex-row md:flex-wrap justify-center overflow-y-auto gap-4 items-center">
        {topics.map((t) => (
          <li key={t.id} className="flex w-full justify-center">
            <button
              type="button"
              onClick={() => navigate(`/aprender/${category.id}/${t.id}`)}
              style={{
                backgroundImage: "url('/assets/ui/gliptodontes-container%201.png')",
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
              }}
              className="
              w-full
              max-w-[300px]
              md:max-w-[450px]
              min-h-[72px]
              md:min-h-[96px]
              pl-10
              md:pl-16
              pr-16
              md:pr-26
              py-8
              md:py-16
              text-left
              transition-[transform,filter]
              duration-200
              hover:scale-[1.04]
              hover:drop-shadow-[0_0_18px_rgba(255,193,107,0.85)]
              active:scale-[0.98]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-focus
            "
            >
              <span className="flex w-full flex-col items-start gap-1 py-4 px-6 md:py-6 md:px-9">
                <span className="text-lg md:text-xl font-bold text-text-primary">
                  {t.title}
                </span>
                <span className="text-xs md:text-sm font-normal text-text-secondary">
                  {t.summary}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex items-center justify-start">
        <BoneButton
          onClick={() => navigate(RoutePaths.Learn)}
          className="min-h-20 w-40 text-xl pb-2"
        >
          Volver
        </BoneButton>
      </div>
    </section>
  );
}
