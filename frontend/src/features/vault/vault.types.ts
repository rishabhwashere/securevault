export type VaultSort = 'newest' | 'oldest' | 'az' | 'za';

export interface VaultFile {
  name: string;
  url: string;
  type: string;
  size?: number;
}

export interface VaultEntry {
  _id: string;
  title: string;
  category: string;
  url?: string;
  username?: string;
  password?: string;
  notes?: string;
  data?: string;
  tags?: string[];
  filePath?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface EntryPayload {
  title: string;
  category: string;
  url?: string;
  username?: string;
  password?: string;
  notes?: string;
  data?: string;
  tags?: string[];
  files?: File[];
}

export interface VaultStats {
  totalEntries: number;
  categories: number;
  filesAttached: number;
  lastUpdated?: string;
}
