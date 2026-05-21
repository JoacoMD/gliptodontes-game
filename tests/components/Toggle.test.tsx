import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toggle } from '@/components/ui/Toggle';

describe('Toggle', () => {
  it('renders as switch role with checked state', () => {
    render(<Toggle label="Sonido" checked={true} onChange={vi.fn()} />);
    const sw = screen.getByRole('switch', { name: /sonido/i });
    expect(sw).toBeChecked();
  });

  it('invokes onChange when clicked', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Toggle label="Sonido" checked={false} onChange={onChange} />);
    await user.click(screen.getByRole('switch', { name: /sonido/i }));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('invokes onChange when activated with Space', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Toggle label="Sonido" checked={false} onChange={onChange} />);
    const sw = screen.getByRole('switch', { name: /sonido/i });
    sw.focus();
    await user.keyboard(' ');
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
