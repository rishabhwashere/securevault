const TOKEN_KEY = 'vaultx-token';
const USER_KEY = 'vaultx-user';

const readJson = (key) => {
  const value = localStorage.getItem(key);
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const state = {
  token: localStorage.getItem(TOKEN_KEY) || '',
  user: readJson(USER_KEY),
  vaultEntries: [],
  editingId: null
};

export function setSession(token, user) {
  state.token = token || '';
  state.user = user || null;

  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export function clearSession() {
  state.vaultEntries = [];
  state.editingId = null;
  setSession('', null);
}
