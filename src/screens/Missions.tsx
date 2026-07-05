import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '@/config/Constants';
import { BoneButton } from '@/components/ui/BoneButton';
import { MissionCard } from '@/components/missions/MissionCard';
import { MISSIONS } from '@/data/missions';
import { useSave } from '@/hooks/useSave';
import { useNarrator } from '@/hooks/useNarrator';
import { useSettings } from '@/hooks/useSettings';

const SWIPE_THRESHOLD = 40;

export function Missions(): React.JSX.Element {
  const navigate = useNavigate();
  const save = useSave();
  const { speak } = useNarrator();
  const { narratorEnabled } = useSettings();
  const [index, setIndex] = useState(0);

  const total = MISSIONS.length;
  const mission = MISSIONS[index];
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const completed = save.completedMissions.includes(mission.id);

  const announcement = `Misión ${index + 1} de ${total}: ${mission.title}. ${mission.description}`;

  useEffect(() => {
    speak(announcement, { interrupt: true });
  }, [announcement, speak]);

  const goTo = (next: number) => setIndex(Math.max(0, Math.min(total - 1, next)));
  const goPrev = () => goTo(index - 1);
  const goNext = () => goTo(index + 1);

  const pointerStartX = useRef<number | null>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const prevArrowRef = useRef<HTMLButtonElement>(null);
  const nextArrowRef = useRef<HTMLButtonElement>(null);
  const pendingFocus = useRef<'prev' | 'next' | null>(null);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext();
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    pointerStartX.current = e.clientX;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (pointerStartX.current === null) return;
    const dx = e.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (dx <= -SWIPE_THRESHOLD) goNext();
    else if (dx >= SWIPE_THRESHOLD) goPrev();
  };

  const onPrevArrowClick = () => {
    pendingFocus.current = 'prev';
    goPrev();
  };
  const onNextArrowClick = () => {
    pendingFocus.current = 'next';
    goNext();
  };

  useLayoutEffect(() => {
    const dir = pendingFocus.current;
    pendingFocus.current = null;
    if (dir === 'prev' && isFirst) {
      (nextArrowRef.current ?? groupRef.current)?.focus();
    } else if (dir === 'next' && isLast) {
      (prevArrowRef.current ?? groupRef.current)?.focus();
    }
  }, [index, isFirst, isLast]);

  return (
    <section aria-label="Misiones" className="flex h-full w-full flex-col p-6">
      <div className="mb-4 flex items-center gap-2 flex-row justify-center md:relative">
        <h1 className="mb-6 text-center font-decorative text-7xl md:text-8xl title-text">Misiones</h1>
        <button
          type="button"
          onClick={() =>
            speak(
              `${announcement}. Usa Jugar para comenzar, las flechas para cambiar de misión, o Volver para regresar al menú.`,
              { interrupt: true },
            )
          }
          aria-label="Escuchar descripción de esta misión"
          className="transition-[transform,filter] duration-200 hover:scale-105 hover:drop-shadow-[0_0_18px_rgba(255,193,107,0.85)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-lg"
        >
          <img src="/assets/ui/gliptodontes-sonido.png" alt="" aria-hidden="true" className="h-16 w-16" />
        </button>
      </div>

      {/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex -- carrusel ARIA con role="group": necesita foco y teclado propios */}
      <div
        ref={groupRef}
        role="group"
        aria-roledescription="carrusel"
        aria-label="Selección de misiones"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        className="relative flex flex-1 items-center justify-center rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
      {/* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */}
        {/* resplandor dorado detrás de la activa (decorativo, siempre visible) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[min(80vw,420px)] w-[min(80vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,214,120,0.85), rgba(255,214,120,0) 62%)' }}
        />

        {/* vecina anterior (decorativa, solo en pantallas anchas) */}
        {!isFirst && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-20 top-1/2 hidden w-[42%] max-w-75 -translate-x-1/4 -translate-y-1/2 scale-[0.82] opacity-50 md:block"
          >
            <MissionCard
              mission={MISSIONS[index - 1]}
              completed={save.completedMissions.includes(MISSIONS[index - 1].id)}
            />
          </div>
        )}

        {/* vecina siguiente (decorativa, solo en pantallas anchas) */}
        {!isLast && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-20 top-1/2 hidden w-[42%] max-w-75 translate-x-1/4 -translate-y-1/2 scale-[0.82] opacity-50 md:block"
          >
            <MissionCard
              mission={MISSIONS[index + 1]}
              completed={save.completedMissions.includes(MISSIONS[index + 1].id)}
            />
          </div>
        )}

        {/* flecha anterior */}
        {!isFirst && (
          <button
            type="button"
            ref={prevArrowRef}
            aria-label="Misión anterior"
            onClick={onPrevArrowClick}
            className="absolute left-0 top-1/2 z-20 aspect-[5/3] w-16 -translate-y-1/2 transition-transform duration-200 hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus md:left-30"
          >
            <img
              src="/assets/ui/flecha_izquierda.png"
              alt=""
              aria-hidden="true"
              className="h-full w-full object-contain scale-125"
            />
          </button>
        )}

        {/* tarjeta activa (con Jugar colgando del borde inferior) */}
        <div className="relative z-10 w-[100%] max-w-100">
          <MissionCard mission={mission} completed={completed} />
          <div className="absolute bottom-0 left-1/2 z-20 -translate-x-1/2 translate-y-1/2">
            <BoneButton
              onClick={() => navigate(mission.route)}
              className="min-h-20 w-44 text-2xl pb-2"
            >
              Jugar
            </BoneButton>
          </div>
        </div>

        {/* flecha siguiente */}
        {!isLast && (
          <button
            type="button"
            ref={nextArrowRef}
            aria-label="Misión siguiente"
            onClick={onNextArrowClick}
            className="absolute right-0 top-1/2 z-20 aspect-[5/3] w-16 -translate-y-1/2 transition-transform duration-200 hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus md:right-30"
          >
            <img
              src="/assets/ui/flecha_derecha.png"
              alt=""
              aria-hidden="true"
              className="h-full w-full object-contain scale-125"
            />
          </button>
        )}
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        {MISSIONS.map((m, i) => (
          <button
            key={m.id}
            type="button"
            aria-label={`Ir a misión ${i + 1}: ${m.title}`}
            aria-current={i === index}
            onClick={() => goTo(i)}
            className={[
              'h-3 w-3 rounded-full border-2 border-panel-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
              i === index ? 'bg-accent' : 'bg-panel',
            ].join(' ')}
          />
        ))}
      </div>

      {/*
        Región aria-live para el lector de pantalla. Solo se renderiza cuando el
        narrador TTS está apagado: con el narrador encendido, NarratorService.speak()
        ya publica el anuncio en la región global #a11y-live, así que renderizar esta
        además provocaría una doble lectura. Así queda exactamente un anuncio en cada modo.
      */}
      {!narratorEnabled && (
        <p aria-live="polite" className="sr-only">
          {announcement}
        </p>
      )}

      <div className="mt-8 flex items-center justify-start">
        <BoneButton
          onClick={() => navigate(RoutePaths.MainMenu)}
          className="min-h-20 w-40 text-xl  pb-2"
        >
          Volver
        </BoneButton>
      </div>
    </section>
  );
}
