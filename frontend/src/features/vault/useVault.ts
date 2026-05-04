import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useMemo } from 'react';
import { useAuthStore } from '@/features/auth/auth.store';
import {
  approveEntryAccess,
  createShareLink,
  createVaultEntry,
  deleteVaultEntry,
  getVaultEntries,
  getVaultEntry,
  getVaultShareLinks, // <-- Added here
  requestEntryApproval,
  updateVaultEntry
} from './vault.service';
import { useVaultStore } from './vault.store';
import type { EntryPayload, VaultEntry, VaultStats } from './vault.types';

export function useVaultEntries() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ['vault', 'entries'],
    queryFn: () => getVaultEntries(), 
    enabled: Boolean(token)
  });
}

export function useVaultEntry(id?: string) {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ['vault', 'entry', id],
    queryFn: () => getVaultEntry(id as string), 
    enabled: Boolean(token && id)
  });
}

export function useVaultShareLinks(id?: string) {
  return useQuery({
    queryKey: ['vault', 'share-links', id],
    queryFn: () => getVaultShareLinks(id as string),
    enabled: Boolean(id) 
  });
}

export function useCreateEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: EntryPayload) => createVaultEntry(payload), 
    onSuccess: () => {
      toast.success('Vault entry saved');
      queryClient.invalidateQueries({ queryKey: ['vault'] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Unable to save vault entry';
      toast.error(message);
    }
  });
}

export function useCreateShareLink(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { filePath: string; password: string }) => createShareLink(id, payload),
    onSuccess: (data: any) => {
      toast.success(data.message || 'Share link created');
      queryClient.invalidateQueries({ queryKey: ['vault', 'share-links', id] });
    }
  });
}

export function useRequestEntryApproval(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => requestEntryApproval(id),
    onSuccess: (data: any) => {
      toast.success(data.message || 'Approval request sent');
      queryClient.invalidateQueries({ queryKey: ['vault'] });
    }
  });
}

export function useApproveEntryAccess(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => approveEntryAccess(id),
    onSuccess: (data: any) => {
      toast.success(data.message || 'Access approved');
      queryClient.invalidateQueries({ queryKey: ['vault'] });
    }
  });
}

export function useUpdateEntry(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: EntryPayload) => updateVaultEntry(id, payload), 
    onSuccess: () => {
      toast.success('Vault entry updated');
      queryClient.invalidateQueries({ queryKey: ['vault'] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Unable to update vault entry';
      toast.error(message);
    }
  });
}

export function useDeleteEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteVaultEntry(id), 
    onSuccess: () => {
      toast.success('Vault entry deleted');
      queryClient.invalidateQueries({ queryKey: ['vault'] });
    }
  });
}

export function useFilteredEntries(entries: VaultEntry[] = []) {
  const search = useVaultStore((state) => state.search);
  const selectedCategories = useVaultStore((state) => state.selectedCategories);
  const sort = useVaultStore((state) => state.sort);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...entries]
      .filter((entry) => {
        const categoryMatch =
          selectedCategories.length === 0 || selectedCategories.includes(entry.category || 'General');

        if (!categoryMatch) return false;
        if (!query) return true;

        const haystack = [entry.title, entry.category, entry.url, entry.username, entry.notes, entry.data]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return haystack.includes(query);
      })
      .sort((a, b) => {
        if (sort === 'oldest') {
          return new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime();
        }
        if (sort === 'az') return a.title.localeCompare(b.title);
        if (sort === 'za') return b.title.localeCompare(a.title);
        return new Date(b.updatedAt ?? b.createdAt ?? 0).getTime() - new Date(a.updatedAt ?? a.createdAt ?? 0).getTime();
      });
  }, [entries, search, selectedCategories, sort]);

  return filtered;
}

export function getVaultStats(entries: VaultEntry[] = []): VaultStats {
  return {
    totalEntries: entries.length,
    categories: new Set(entries.map((entry) => entry.category || 'General')).size,
    filesAttached: entries.reduce((count, entry) => count + (entry.attachmentCount ?? entry.filePath?.length ?? 0), 0),
    lastUpdated: entries
      .map((entry) => entry.updatedAt || entry.createdAt)
      .filter(Boolean)
      .sort()
      .at(-1)
  };
}