import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'glass-panel rounded-lg border border-line bg-panel/95 p-5 shadow-soft transition-all duration-200',
        className
      )}
      {...props}
    />
  );
}
