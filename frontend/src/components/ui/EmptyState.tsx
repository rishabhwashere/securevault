import { ArchiveX } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  copy: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondaryAction?: () => void;
}

export function EmptyState({
  title,
  copy,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondaryAction
}: EmptyStateProps) {
  return (
    <div className="glass-panel flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed px-6 py-10 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand-light text-brand">
        <ArchiveX className="h-8 w-8" aria-hidden="true" />
      </div>
      <h3 className="font-heading text-3xl text-textPrimary">{title}</h3>
      <p className="mt-3 max-w-md text-sm leading-7 text-textMuted">{copy}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {actionLabel ? <Button onClick={onAction}>{actionLabel}</Button> : null}
        {secondaryLabel ? (
          <button
            type="button"
            onClick={onSecondaryAction}
            className="focus-ring text-sm font-medium text-brand transition hover:text-brand-deep"
          >
            {secondaryLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
