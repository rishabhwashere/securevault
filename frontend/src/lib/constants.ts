export const categoryPalette: Record<string, string> = {
  Finance: 'bg-[#1d1d1d] text-[#f0f0f0] border-white/10',
  Personal: 'bg-[#181818] text-[#dddddd] border-white/10',
  Work: 'bg-[#212121] text-[#cfcfcf] border-white/10',
  Social: 'bg-[#161616] text-[#bababa] border-white/10',
  Shopping: 'bg-[#252525] text-[#e2e2e2] border-white/10',
  General: 'bg-surface-muted text-textMuted border-line'
};

export const defaultCategories = Object.keys(categoryPalette);

export const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'az', label: 'A-Z' },
  { value: 'za', label: 'Z-A' }
] as const;
