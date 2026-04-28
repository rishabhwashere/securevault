export function VaultXLogo() {
  return (
    <div className="mx-auto flex w-fit flex-col items-center gap-2 text-center">
      <svg viewBox="0 0 96 96" aria-hidden="true" className="h-14 w-14 sm:h-16 sm:w-16">
        <defs>
          <linearGradient id="vault-logo-gradient" x1="18" y1="16" x2="78" y2="78" gradientUnits="userSpaceOnUse">
            <stop stopColor="#5B9BD5" />
            <stop offset="0.58" stopColor="#1F5FA6" />
            <stop offset="1" stopColor="#0B3060" />
          </linearGradient>
        </defs>
        <g fill="none" stroke="url(#vault-logo-gradient)" strokeLinecap="round" strokeLinejoin="round">
          <path d="M34 40v-8a14 14 0 0 1 28 0v8" strokeWidth="4.5" />
          <rect x="26" y="40" width="44" height="34" rx="10" strokeWidth="4.5" />
          <circle cx="48" cy="55" r="4" strokeWidth="4" />
          <path d="M48 59v7" strokeWidth="4" />
        </g>
      </svg>
      <span className="font-sans text-[11px] font-medium uppercase tracking-[0.34em] text-textMuted sm:text-xs">Secure Vault</span>
    </div>
  );
}
