import { Modal } from './Modal';

export interface HowToPlayContent {
  title?: string;
  body: string | string[];
  ctaLabel?: string;
}

export interface HowToPlayModalProps {
  id: string;
  open: boolean;
  content: HowToPlayContent;
  onStart: () => void;
}

export function HowToPlayModal({
  id,
  open,
  content,
  onStart,
}: HowToPlayModalProps): React.JSX.Element {
  const body = Array.isArray(content.body) ? content.body : [content.body];
  return (
    <Modal
      id={id}
      open={open}
      closable
      onOpenChange={(o) => {
        if (!o) onStart();
      }}
      title={content.title ?? '¿Cómo jugar?'}
      variant="info"
      actions={[
        {
          label: content.ctaLabel ?? 'Jugar',
          variant: 'primary',
          onClick: onStart,
          autoFocus: true,
        },
      ]}
      narratable={`${content.title ?? '¿Cómo jugar?'}. , ${content.body}. , ${content.ctaLabel ?? 'Jugar'}.`}
    >
      <ul className="space-y-2 text-base leading-snug">
        {body.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    </Modal>
  );
}
