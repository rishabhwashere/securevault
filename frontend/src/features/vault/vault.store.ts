import { create } from 'zustand';
import type { VaultSort } from './vault.types';

interface VaultUiState {
  search: string;
  selectedCategories: string[];
  sort: VaultSort;
  setSearch: (value: string) => void;
  setSelectedCategories: (values: string[]) => void;
  toggleCategory: (value: string) => void;
  setSort: (value: VaultSort) => void;
  clearFilters: () => void;
}

export const useVaultStore = create<VaultUiState>((set) => ({
  search: '',
  selectedCategories: [],
  sort: 'newest',
  setSearch: (search) => set({ search }),
  setSelectedCategories: (selectedCategories) => set({ selectedCategories }),
  toggleCategory: (value) =>
    set((state) => ({
      selectedCategories: state.selectedCategories.includes(value)
        ? state.selectedCategories.filter((item) => item !== value)
        : [...state.selectedCategories, value]
    })),
  setSort: (sort) => set({ sort }),
  clearFilters: () => set({ search: '', selectedCategories: [], sort: 'newest' })
}));
