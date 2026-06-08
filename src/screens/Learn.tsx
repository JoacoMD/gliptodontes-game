import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '@/config/Constants';
import { Button } from '@/components/ui/Button';
import { LEARN_TOPICS } from '@/data/learnTopics';
import { useNarrator } from '@/hooks/useNarrator';
import { useEffect } from 'react';

export function Learn(): React.JSX.Element {
  const navigate = useNavigate();

  const { speak } = useNarrator();
  useEffect(() => {
    speak('Aprender. Aquí encontrarás distintos temas educativos. ', {
      interrupt: true,
    });
  }, [speak]);

  const readLearnMenu = (() => {
    speak(`
${LEARN_TOPICS.map(t => `${t.title}. ${t.summary}.`).join(' ')}
 ... 
Selecciona una tarjeta para comenzar a explorar. Cuando termines, utiliza el botón Volver para regresar al menú principal.
`, {
      interrupt: true,
    });
  })
  return (
    <section aria-label="Aprender" className="flex h-full w-full flex-col p-6">
      <div className="mb-4 flex flex-col items-center gap-2 md:flex-row md:justify-center md:relative">
        <h1 className="mb-4 text-center font-decorative text-8xl title-text">Aprender</h1>

        <button
          type="button"
          onClick={readLearnMenu}
          aria-label="Escuchar descripción de esta seccion"
          className=" transition-[transform,filter] duration-200 hover:scale-105 hover:drop-shadow-[0_0_18px_rgba(255,193,107,0.85)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-lg"
        >
          <img
            src="/assets/ui/gliptodontes-sonido.png"
            alt=""
            aria-hidden="true"
            className="h-14 w-14"
          />
        </button>
      </div>
      <br />
      <ul
        className="
          flex
          flex-col
          md:flex-row
          md:flex-wrap
          justify-center
          overflow-y-auto
          gap-4
          items-center
        "
      >
        {LEARN_TOPICS.map((t) => (
          <li key={t.id} className="flex w-full justify-center">
            <button
              type="button"
              onClick={() => navigate(`/aprender/${t.id}`)}
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

      py-10
      md:py-24

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
      <Button
        variant="ghost"
        fullWidth
        className="mt-6"
        onClick={() => navigate(RoutePaths.MainMenu)}
      >
        Volver
      </Button>
    </section >
  );
}
