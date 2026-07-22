import type { MinigameResult } from '@/types';
import { Modal } from './Modal';

export interface ResultModalProps {
  id: string;
  open: boolean;
  result: MinigameResult | null;
  didYouKnow?: string;
  onAction: (action: 'retry' | 'next' | 'menu') => void;
  image?: string;
}

export function ResultModal({
  id,
  open,
  result,
  didYouKnow,
  onAction,
  image,
}: ResultModalProps): React.JSX.Element | null {
  if (!result) return null;
  return (
    <Modal
      id={id}
      open={open}
      closable={false}
      title={result.title}
      variant={result.variant}
      description={result.body}
      actions={[
        {
          label: result.primaryCta.label,
          variant: 'primary',
          onClick: () => onAction(result.primaryCta.action),
          autoFocus: true,
        },
        ...(result.secondaryCta
          ? [
            {
              label: result.secondaryCta.label,
              variant: 'secondary' as const,
              onClick: () => onAction(result.secondaryCta!.action),
            },
          ]
          : []),
      ]}
      narratable={`${result.title}. , ${result.body}. , ${didYouKnow ? '¿Sabías que...' + didYouKnow : ''}. , ${result.primaryCta.label}. , ${result.secondaryCta?.label ?? ''}`}
    >
      {image && (
        <div className="flex justify-center mb-4">
          <img
            src={image}
            alt="Ilustración del animal"
            className="max-h-64 w-auto object-contain rounded-lg border border-panel-border"
          />
        </div>
      )}
      {didYouKnow && (
        <p className="rounded-lg border border-panel-border bg-background/40 p-3 text-sm text-text-secondary">
          <strong>¿Sabías que…</strong> {didYouKnow}
        </p>
      )}
    </Modal>
  );
}
