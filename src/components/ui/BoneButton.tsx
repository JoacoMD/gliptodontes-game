import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

export interface BoneButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const baseClasses =
  'inline-flex select-none items-center justify-center bg-[length:100%_100%] bg-center bg-no-repeat font-bold text-primary transition-[transform,filter] duration-200 hover:scale-105 hover:drop-shadow-[0_0_14px_rgba(255,193,107,0.8)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-60';

export const BoneButton = forwardRef<HTMLButtonElement, BoneButtonProps>(function BoneButton(
  { className = '', children, style, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={rest.type ?? 'button'}
      className={[baseClasses, className].filter(Boolean).join(' ')}
      style={{ backgroundImage: "url('/assets/ui/hueso.png')", ...style }}
      {...rest}
    >
      {children}
    </button>
  );
});
