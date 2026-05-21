import { Modal } from './Modal';

export interface ConfirmModalProps {
  id: string;
  open: boolean;
  title: string;
  body: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export function ConfirmModal({
  id,
  open,
  title,
  body,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}: ConfirmModalProps): React.JSX.Element {
  return (
    <Modal
      id={id}
      open={open}
      closable
      onOpenChange={(o) => {
        if (!o) onCancel?.();
      }}
      title={title}
      description={body}
      variant="info"
      actions={[
        { label: confirmLabel, variant: 'primary', onClick: onConfirm, autoFocus: true },
        { label: cancelLabel, variant: 'secondary', onClick: () => onCancel?.() },
      ]}
    />
  );
}
