import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MissionCard } from '@/components/missions/MissionCard';
import type { Mission } from '@/types';
import { RoutePaths, SceneKeys } from '@/config/Constants';

const base: Mission = {
  id: 'demo',
  title: 'Título Demo',
  description: 'Descripción demo.',
  route: RoutePaths.MinigameAR,
  sceneKey: SceneKeys.MinigameAR,
};

describe('MissionCard', () => {
  it('muestra título y descripción', () => {
    render(<MissionCard mission={base} completed={false} />);
    expect(screen.getByText('Título Demo')).toBeInTheDocument();
    expect(screen.getByText('Descripción demo.')).toBeInTheDocument();
  });

  it('renderiza la imagen con su alt cuando hay image + imageAlt', () => {
    render(
      <MissionCard
        mission={{ ...base, image: '/assets/missions/demo.png', imageAlt: 'Un gliptodonte' }}
        completed={false}
      />,
    );
    const img = screen.getByAltText('Un gliptodonte') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('src')).toBe('/assets/missions/demo.png');
  });

  it('no renderiza <img> cuando la misión no tiene image', () => {
    render(<MissionCard mission={base} completed={false} />);
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('muestra el sello de completada solo cuando completed es true', () => {
    const { rerender } = render(<MissionCard mission={base} completed={false} />);
    expect(screen.queryByText(/completada/i)).toBeNull();
    rerender(<MissionCard mission={base} completed />);
    expect(screen.getByText(/completada/i)).toBeInTheDocument();
  });
});
