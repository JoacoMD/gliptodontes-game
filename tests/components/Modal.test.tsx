import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Modal } from '@/components/modals/Modal';

function Harness({ closable = true }: { closable?: boolean }) {
  const [open, setOpen] = useState(true);
  return (
    <Modal
      id="t"
      open={open}
      closable={closable}
      title="Título de prueba"
      description="Descripción"
      actions={[
        { label: 'OK', onClick: () => setOpen(false), autoFocus: true },
        { label: 'Cancelar', variant: 'secondary', onClick: () => setOpen(false) },
      ]}
      onOpenChange={setOpen}
    />
  );
}

describe('Modal', () => {
  it('renders title and actions and closes on primary click', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    expect(screen.getByRole('dialog', { name: /título de prueba/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'OK' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes with Escape when closable', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('does not close with Escape when not closable', async () => {
    const user = userEvent.setup();
    render(<Harness closable={false} />);
    await user.keyboard('{Escape}');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('uses alertdialog role for failure variant', () => {
    render(
      <Modal
        id="t"
        open
        variant="failure"
        title="Oops"
        actions={[{ label: 'OK', onClick: vi.fn() }]}
      />,
    );
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });
});
