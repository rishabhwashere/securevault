export function VaultXLogo() {
  return (
    <div className="mx-auto flex w-fit flex-col items-center gap-3 text-center">
      <svg
        viewBox="0 0 120 120"
        aria-hidden="true"
        className="h-20 w-20 text-[#c1ab63] drop-shadow-[0_8px_18px_rgba(193,171,99,0.18)] sm:h-24 sm:w-24"
      >
        <circle cx="60" cy="56" r="34" fill="none" stroke="currentColor" strokeWidth="4" />
        <path d="M60 8v96" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <span className="font-sans text-sm tracking-[0.52em] text-textPrimary/90 sm:text-base">vaultX</span>
    </div>
  );
}
