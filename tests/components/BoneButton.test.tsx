import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BoneButton } from '@/components/ui/BoneButton';

describe('BoneButton', () => {
  it('renderiza su texto y dispara onClick al clickear', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<BoneButton onClick={onClick}>Jugar</BoneButton>);
    const btn = screen.getByRole('button', { name: 'Jugar' });
    await user.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('no dispara onClick cuando está disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <BoneButton onClick={onClick} disabled>
        Volver
      </BoneButton>,
    );
    await user.click(screen.getByRole('button', { name: 'Volver' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('usa el asset de hueso como fondo', () => {
    render(<BoneButton>Jugar</BoneButton>);
    const btn = screen.getByRole('button', { name: 'Jugar' });
    expect(btn.style.backgroundImage).toContain('hueso.png');
  });
});
