import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useRef, type ReactNode } from 'react';
import { EventKeys } from '@/config/Constants';
import { EventBus } from '@/systems/EventBus';
import { Button, type ButtonVariant } from '@/components/ui/Button';
import { useNarrator } from '@/hooks/useNarrator';

export type ModalVariant = 'info' | 'success' | 'failure';

export interface ModalAction {
  label: string;
  variant?: ButtonVariant;
  onClick: () => void;
  /** Hint that this action is the primary one (focused first by the dialog). */
  autoFocus?: boolean;
}

export interface ModalProps {
  id: string;
  open: boolean;
  /** false = no close on Esc / outside click (use for results that need a choice). */
  closable?: boolean;
  title: string;
  description?: string;
  children?: ReactNode;
  actions: ModalAction[];
  variant?: ModalVariant;
  onOpenChange?: (open: boolean) => void;
  narratable?: string;
}

const variantTitleClasses: Record<ModalVariant, string> = {
  info: 'text-accent',
  success: 'text-success',
  failure: 'text-failure',
};

export function Modal({
  id,
  open,
  closable = true,
  title,
  description,
  children,
  actions,
  variant = 'info',
  onOpenChange,
  narratable = '',
}: ModalProps): React.JSX.Element {
  const primaryRef = useRef<HTMLButtonElement>(null);

  const { speak } = useNarrator();
  const narrationText = `${narratable ?? ''}`;

  useEffect(() => {
    if (open) EventBus.emit(EventKeys.ModalOpened, id);
    else EventBus.emit(EventKeys.ModalClosed, id);
  }, [open, id]);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!closable && !next) return;
        onOpenChange?.(next);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 data-[state=open]:animate-in" />
        <Dialog.Content
          role={variant === 'failure' ? 'alertdialog' : 'dialog'}
          onOpenAutoFocus={(e) => {
            if (primaryRef.current) {
              e.preventDefault();
              primaryRef.current.focus();
            }
          }}
          onEscapeKeyDown={(e) => {
            if (!closable) e.preventDefault();
          }}
          onInteractOutside={(e) => {
            if (!closable) e.preventDefault();
          }}
          className="fixed left-1/2 top-1/2 z-50 w-[min(92%,520px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border-4 border-panel-border bg-panel p-6 shadow-2xl"
        >

          {narratable && (
            <div className="absolute right-4 top-4">
              <Button
                variant="secondary"
                size="sm"
                aria-label="Leer en voz alta"
                onClick={() =>
                  speak(narrationText, {
                    interrupt: true,
                  })
                }
              >
                🔊
              </Button>
            </div>
          )}

          <Dialog.Title
            className={`mb-3 text-center text-3xl font-bold ${variantTitleClasses[variant]}`}
          >
            {title}
          </Dialog.Title>
          {description && (
            <Dialog.Description className="mb-4 text-center text-base text-text-primary">
              {description}
            </Dialog.Description>
          )}
          {children && <div className="mb-4 text-text-primary">{children}</div>}


          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            {actions.map((a, i) => (
              <Button
                key={`${a.label}-${i}`}
                variant={a.variant ?? (i === 0 ? 'primary' : 'secondary')}
                onClick={a.onClick}
                ref={a.autoFocus ? primaryRef : undefined}
                fullWidth
              >
                {a.label}
              </Button>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
