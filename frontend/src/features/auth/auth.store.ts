import { create } from 'zustand';

const TOKEN_KEY = 'vaultx-token';
const USER_KEY = 'vaultx-user';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  token: string;
  user: AuthUser | null;
  setSession: (token: string, user: AuthUser) => void;
  logout: () => void;
}

function clearPersistedSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export const useAuthStore = create<AuthState>((set) => ({
  token: '',
  user: null,
  setSession: (token, user) => {
    set({ token, user });
  },
  logout: () => {
    clearPersistedSession();
    set({ token: '', user: null });
  }
}));

clearPersistedSession();
