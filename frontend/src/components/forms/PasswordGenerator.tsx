import * as Popover from '@radix-ui/react-popover';
import { KeyRound, RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button, Toggle } from '@/components/ui';
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter';

function generatePassword({
  length,
  uppercase,
  lowercase,
  numbers,
  symbols
}: {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}) {
  const pools = [
    uppercase ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : '',
    lowercase ? 'abcdefghijkmnopqrstuvwxyz' : '',
    numbers ? '23456789' : '',
    symbols ? '!@#$%^&*()_+-=[]{}' : ''
  ].join('');

  if (!pools) return '';

  return Array.from({ length }, () => pools[Math.floor(Math.random() * pools.length)]).join('');
}

interface PasswordGeneratorProps {
  onUse: (password: string) => void;
}

export function PasswordGenerator({ onUse }: PasswordGeneratorProps) {
  const [length, setLength] = useState(20);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    setPassword(generatePassword({ length, uppercase, lowercase, numbers, symbols }));
  }, [length, uppercase, lowercase, numbers, symbols]);

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button type="button" variant="secondary" className="px-3 py-2 text-xs">
          <KeyRound className="h-4 w-4" />
          Generate
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={10}
          align="end"
          className="z-[80] w-[320px] rounded-xl border border-line bg-panel p-4 shadow-card backdrop-blur-panel"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-textMuted">Generator</p>
              <h4 className="mt-1 font-heading text-xl text-textPrimary">Create a strong password</h4>
            </div>
            <button
              type="button"
              className="focus-ring rounded-full p-2 text-textMuted transition hover:bg-white/60 hover:text-brand"
              onClick={() => setPassword(generatePassword({ length, uppercase, lowercase, numbers, symbols }))}
              aria-label="Generate another password"
            >
              <RefreshCcw className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-4">
            <label className="grid gap-2 text-sm text-textMuted">
              <span className="flex items-center justify-between">
                <span>Length</span>
                <span className="font-medium text-textPrimary">{length}</span>
              </span>
              <input
                type="range"
                min={8}
                max={64}
                value={length}
                onChange={(event) => setLength(Number(event.target.value))}
              />
            </label>
            <Toggle checked={uppercase} onChange={setUppercase} label="Uppercase" />
            <Toggle checked={lowercase} onChange={setLowercase} label="Lowercase" />
            <Toggle checked={numbers} onChange={setNumbers} label="Numbers" />
            <Toggle checked={symbols} onChange={setSymbols} label="Symbols" />

            <div className="rounded-md border border-line bg-white/60 p-3">
              <p className="text-xs uppercase tracking-[0.22em] text-textMuted">Generated password</p>
              <p className="mt-2 break-all font-medium text-textPrimary">{password || 'Choose at least one option'}</p>
            </div>

            <PasswordStrengthMeter password={password} />

            <Button type="button" onClick={() => onUse(password)} disabled={!password} className="w-full">
              Use this password
            </Button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
