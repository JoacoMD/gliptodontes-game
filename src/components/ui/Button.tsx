import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
}

const baseClasses =
  'inline-flex select-none items-center justify-center gap-2 rounded-xl border-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border-panel-border bg-accent text-white hover:bg-accent-alt active:translate-y-px',
  secondary:
    'border-panel-border bg-panel text-text-primary hover:bg-accent/20 active:translate-y-px',
  ghost: 'border-transparent bg-transparent text-text-primary hover:bg-panel/60',
  danger:
    'border-panel-border bg-failure text-white hover:bg-failure/80 active:translate-y-px',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-[40px] px-4 py-2 text-sm',
  md: 'min-h-[56px] px-5 py-3 text-base',
  lg: 'min-h-[72px] px-7 py-4 text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', fullWidth, className = '', children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={rest.type ?? 'button'}
      className={[
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
});
