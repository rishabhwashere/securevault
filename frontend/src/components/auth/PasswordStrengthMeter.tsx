import { cn } from '@/lib/utils';

const labels = ['Weak', 'Fair', 'Strong', 'Very strong'];

function calculateScore(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return Math.max(0, Math.min(4, score));
}

export function PasswordStrengthMeter({ password }: { password: string }) {
  const score = calculateScore(password);
  const label = labels[Math.max(0, score - 1)] ?? 'Weak';

  return (
    <div className="grid gap-2">
      <div className="flex gap-2">
        {[0, 1, 2, 3].map((item) => (
          <span
            key={item}
            className={cn(
              'h-2 flex-1 rounded-full transition',
              item < score
                ? score < 2
                  ? 'bg-danger'
                  : score < 3
                    ? 'bg-accent'
                    : 'bg-brand'
                : 'bg-textMuted/15'
            )}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-textMuted">{label}</span>
    </div>
  );
}
