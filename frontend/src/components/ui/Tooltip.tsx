import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type { PropsWithChildren, ReactNode } from 'react';

interface TooltipProps extends PropsWithChildren {
  content: ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={150}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            sideOffset={8}
            className="z-[80] rounded-md border border-line bg-panel px-3 py-2 text-xs text-textPrimary shadow-soft backdrop-blur-panel"
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-panel" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
