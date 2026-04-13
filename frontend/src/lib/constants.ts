export const categoryPalette: Record<string, string> = {
  Finance: 'bg-accent-light text-accent border-accent/20',
  Personal: 'bg-brand-light text-brand border-brand/20',
  Work: 'bg-[#efe9ff] text-[#6752b3] border-[#6752b3]/20',
  Social: 'bg-[#eaf6f1] text-[#2d7c63] border-[#2d7c63]/20',
  Shopping: 'bg-[#fff2ea] text-[#b66a39] border-[#b66a39]/20',
  General: 'bg-white/70 text-textMuted border-line'
};

export const defaultCategories = Object.keys(categoryPalette);

export const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'az', label: 'A-Z' },
  { value: 'za', label: 'Z-A' }
] as const;
