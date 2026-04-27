import { cn } from '@/lib/utils';

interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="focus-ring surface-card flex items-center justify-between gap-4 rounded-md px-3 py-2.5 text-left transition hover:border-brand/35 hover:bg-surface-raised"
    >
      <span className="text-sm font-medium text-textPrimary">{label}</span>
      <span
        className={cn(
          'flex h-6 w-11 items-center rounded-full p-1 transition',
          checked ? 'bg-brand' : 'bg-surface-sunken'
        )}
      >
        <span
          className={cn(
            'h-4 w-4 rounded-full bg-[#f5ecdd] shadow transition',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </span>
    </button>
  );
}
