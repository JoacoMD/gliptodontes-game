import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Missions } from '@/screens/Missions';
import { MISSIONS } from '@/data/missions';
import { RoutePaths } from '@/config/Constants';

// vi.hoisted evita el error de "out-of-scope variables" al referenciar los mocks
// dentro de las factories de vi.mock (que se hoistean por encima de los imports).
const { navigateMock, speakMock, saveState, settingsState } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  speakMock: vi.fn(),
  saveState: { completedMissions: [] as string[] },
  // narratorEnabled: false → la región aria-live del componente se renderiza (modo
  // narrador apagado). Con true, el anuncio saldría por la región global #a11y-live.
  settingsState: { narratorEnabled: false },
}));

vi.mock('react-router-dom', () => ({ useNavigate: () => navigateMock }));
vi.mock('@/hooks/useSave', () => ({
  useSave: () => ({ completedMissions: saveState.completedMissions }),
}));
vi.mock('@/hooks/useNarrator', () => ({
  useNarrator: () => ({ speak: speakMock, stop: vi.fn() }),
}));
vi.mock('@/hooks/useSettings', () => ({
  useSettings: () => ({ narratorEnabled: settingsState.narratorEnabled }),
}));

beforeEach(() => {
  navigateMock.mockClear();
  speakMock.mockClear();
  saveState.completedMissions = [];
  settingsState.narratorEnabled = false;
});

describe('Missions — carrusel base', () => {
  it('muestra la primera misión y oculta la flecha izquierda', () => {
    render(<Missions />);
    expect(screen.getByText(MISSIONS[0].title)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Misión anterior' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Misión siguiente' })).toBeInTheDocument();
  });

  it('avanza a la siguiente misión con la flecha derecha', async () => {
    const user = userEvent.setup();
    render(<Missions />);
    await user.click(screen.getByRole('button', { name: 'Misión siguiente' }));
    expect(screen.getByText(MISSIONS[1].title)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Misión anterior' })).toBeInTheDocument();
  });

  it('oculta la flecha derecha en la última misión', async () => {
    const user = userEvent.setup();
    render(<Missions />);
    for (let i = 0; i < MISSIONS.length - 1; i++) {
      await user.click(screen.getByRole('button', { name: 'Misión siguiente' }));
    }
    expect(screen.getByText(MISSIONS[MISSIONS.length - 1].title)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Misión siguiente' })).toBeNull();
  });

  it('Jugar navega a la ruta de la misión visible', async () => {
    const user = userEvent.setup();
    render(<Missions />);
    await user.click(screen.getByRole('button', { name: 'Jugar' }));
    expect(navigateMock).toHaveBeenCalledWith(MISSIONS[0].route);
  });

  it('Volver navega al menú principal', async () => {
    const user = userEvent.setup();
    render(<Missions />);
    await user.click(screen.getByRole('button', { name: 'Volver' }));
    expect(navigateMock).toHaveBeenCalledWith(RoutePaths.MainMenu);
  });
});

describe('Missions — teclado, swipe y puntos', () => {
  it('cambia de misión con las flechas del teclado', async () => {
    render(<Missions />);
    const carrusel = screen.getByRole('group', { name: 'Selección de misiones' });
    fireEvent.keyDown(carrusel, { key: 'ArrowRight' });
    expect(screen.getByText(MISSIONS[1].title)).toBeInTheDocument();
    fireEvent.keyDown(carrusel, { key: 'ArrowLeft' });
    expect(screen.getByText(MISSIONS[0].title)).toBeInTheDocument();
  });

  it('renderiza un punto por misión y salta al tocarlo', async () => {
    const user = userEvent.setup();
    render(<Missions />);
    const dots = screen.getAllByRole('button', { name: /^Ir a misión/ });
    expect(dots).toHaveLength(MISSIONS.length);
    await user.click(dots[2]);
    expect(screen.getByText(MISSIONS[2].title)).toBeInTheDocument();
  });

  it('avanza con swipe hacia la izquierda', () => {
    render(<Missions />);
    const carrusel = screen.getByRole('group', { name: 'Selección de misiones' });
    fireEvent.pointerDown(carrusel, { clientX: 200 });
    fireEvent.pointerUp(carrusel, { clientX: 120 });
    expect(screen.getByText(MISSIONS[1].title)).toBeInTheDocument();
  });

  it('retrocede con swipe hacia la derecha', () => {
    render(<Missions />);
    const carrusel = screen.getByRole('group', { name: 'Selección de misiones' });
    // ir primero a la segunda misión
    fireEvent.keyDown(carrusel, { key: 'ArrowRight' });
    fireEvent.pointerDown(carrusel, { clientX: 120 });
    fireEvent.pointerUp(carrusel, { clientX: 200 });
    expect(screen.getByText(MISSIONS[0].title)).toBeInTheDocument();
  });

  it('no cambia de misión con un swipe por debajo del umbral', () => {
    render(<Missions />);
    const carrusel = screen.getByRole('group', { name: 'Selección de misiones' });
    // 20px < SWIPE_THRESHOLD (40px) → debe ser no-op
    fireEvent.pointerDown(carrusel, { clientX: 200 });
    fireEvent.pointerUp(carrusel, { clientX: 180 });
    expect(screen.getByText(MISSIONS[0].title)).toBeInTheDocument();
  });
});

describe('Missions — anuncios de accesibilidad', () => {
  it('la región aria-live refleja la misión actual y se actualiza al cambiar', () => {
    render(<Missions />);
    const live = document.querySelector('[aria-live="polite"]');
    expect(live?.textContent).toContain(`Misión 1 de ${MISSIONS.length}`);
    expect(live?.textContent).toContain(MISSIONS[0].title);

    const carrusel = screen.getByRole('group', { name: 'Selección de misiones' });
    fireEvent.keyDown(carrusel, { key: 'ArrowRight' });
    expect(live?.textContent).toContain(`Misión 2 de ${MISSIONS.length}`);
    expect(live?.textContent).toContain(MISSIONS[1].title);
  });

  it('llama al narrador al cambiar de misión', () => {
    render(<Missions />);
    speakMock.mockClear();
    const carrusel = screen.getByRole('group', { name: 'Selección de misiones' });
    fireEvent.keyDown(carrusel, { key: 'ArrowRight' });
    expect(speakMock).toHaveBeenCalledWith(
      expect.stringContaining(MISSIONS[1].title),
      { interrupt: true },
    );
  });

  it('el botón de sonido lee la misión actual con las instrucciones', async () => {
    const user = userEvent.setup();
    render(<Missions />);
    speakMock.mockClear();
    await user.click(screen.getByRole('button', { name: 'Escuchar descripción de esta misión' }));
    expect(speakMock).toHaveBeenCalledWith(
      expect.stringContaining(MISSIONS[0].title),
      { interrupt: true },
    );
    // También lee las acciones disponibles, no solo el título.
    expect(speakMock).toHaveBeenCalledWith(
      expect.stringContaining('Usa Jugar'),
      { interrupt: true },
    );
  });

  it('NO renderiza la región aria-live propia cuando el narrador TTS está activo (evita doble lectura)', () => {
    settingsState.narratorEnabled = true;
    render(<Missions />);
    expect(document.querySelector('[aria-live="polite"]')).toBeNull();
  });
});

describe('Missions — escenario visual (flechas, vecinas, resplandor)', () => {
  it('las flechas usan los assets de piedra', () => {
    render(<Missions />);
    const next = screen.getByRole('button', { name: 'Misión siguiente' });
    const img = next.querySelector('img');
    expect(img?.getAttribute('src')).toContain('flecha_derecha.png');
  });

  it('las tarjetas vecinas son decorativas: no agregan botones ni un segundo Jugar', () => {
    render(<Missions />);
    const carrusel = screen.getByRole('group', { name: 'Selección de misiones' });
    // ir a una misión del medio para tener vecina a ambos lados
    fireEvent.keyDown(carrusel, { key: 'ArrowRight' });
    expect(screen.getAllByRole('button', { name: 'Jugar' })).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: 'Misión anterior' })).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: 'Misión siguiente' })).toHaveLength(1);
  });

  it('la tarjeta vecina está dentro de un contenedor aria-hidden', () => {
    render(<Missions />); // index 0 → vecina derecha = misión 1
    const vecinaTitle = screen.getByText(MISSIONS[1].title);
    expect(vecinaTitle.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('al llegar a la última con la flecha, mueve el foco a la flecha anterior', async () => {
    const user = userEvent.setup();
    render(<Missions />);
    for (let i = 0; i < MISSIONS.length - 1; i++) {
      await user.click(screen.getByRole('button', { name: 'Misión siguiente' }));
    }
    expect(screen.getByRole('button', { name: 'Misión anterior' })).toHaveFocus();
  });

  it('al volver a la primera con la flecha, mueve el foco a la flecha siguiente', async () => {
    const user = userEvent.setup();
    render(<Missions />);
    await user.click(screen.getByRole('button', { name: 'Misión siguiente' }));
    await user.click(screen.getByRole('button', { name: 'Misión anterior' }));
    expect(screen.getByRole('button', { name: 'Misión siguiente' })).toHaveFocus();
  });
});
