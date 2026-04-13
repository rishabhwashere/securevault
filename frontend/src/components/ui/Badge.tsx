import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'category' | 'status';
  statusTone?: 'active' | 'archived' | 'flagged';
  className?: string;
}

export function Badge({ children, variant = 'category', statusTone = 'active', className }: BadgeProps) {
  const styles =
    variant === 'category'
      ? 'border border-accent/20 bg-accent-light text-accent'
      : statusTone === 'flagged'
        ? 'border border-danger/20 bg-danger/10 text-danger'
        : statusTone === 'archived'
          ? 'border border-line bg-white/60 text-textMuted'
          : 'border border-brand/20 bg-brand-light text-brand';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium tracking-wide',
        styles,
        className
      )}
    >
      {children}
    </span>
  );
}
