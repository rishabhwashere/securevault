import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function OTPInput({ value, onChange, error }: OTPInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  const digits = value.padEnd(6).split('').slice(0, 6);

  return (
    <div className="grid gap-2">
      <div className="flex gap-2">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="text"
            value={digit.trim()}
            inputMode="numeric"
            maxLength={1}
            aria-label={`Digit ${index + 1}`}
            onChange={(event) => {
              const next = event.target.value.replace(/\D/g, '').slice(-1);
              const current = value.padEnd(6).split('');
              current[index] = next;
              onChange(current.join('').trim());
              if (next) refs.current[index + 1]?.focus();
            }}
            onKeyDown={(event) => {
              if (event.key === 'Backspace' && !digit.trim()) {
                refs.current[index - 1]?.focus();
              }
            }}
            className={cn(
              'focus-ring h-14 w-12 rounded-md border bg-white/70 text-center font-heading text-xl text-textPrimary transition',
              error ? 'border-danger/50' : 'border-line focus:border-brand'
            )}
          />
        ))}
      </div>
      {error ? <span className="text-xs text-danger">{error}</span> : null}
    </div>
  );
}
