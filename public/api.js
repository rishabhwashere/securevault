const jsonHeaders = {
  'Content-Type': 'application/json'
};

async function request(path, options = {}) {
  const response = await fetch(path, options);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || 'Request failed');
  }

  return payload;
}

export function createApi(token) {
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  return {
    register: (body) =>
      request('/api/auth/register', { method: 'POST', headers: jsonHeaders, body: JSON.stringify(body) }),

    login: (body) =>
      request('/api/auth/login', { method: 'POST', headers: jsonHeaders, body: JSON.stringify(body) }),

    getVaultEntries: () =>
      request('/api/vault', { headers: authHeaders }),

    createVaultEntry: (formData) =>
      request('/api/vault', { method: 'POST', headers: authHeaders, body: formData }),

    updateVaultEntry: (id, body) =>
      request(`/api/vault/${id}`, { method: 'PUT', headers: { ...jsonHeaders, ...authHeaders }, body: JSON.stringify(body) }),

    deleteVaultEntry: (id) =>
      request(`/api/vault/${id}`, { method: 'DELETE', headers: authHeaders }),

    // --- NEW SHARE ENDPOINTS ---
    generateShareLink: (vaultId, body) =>
      request(`/api/share/generate/${vaultId}`, {
        method: 'POST',
        headers: { ...jsonHeaders, ...authHeaders },
        body: JSON.stringify(body)
      }),

    accessShareLink: (token, body) =>
      request(`/api/share/access/${token}`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(body)
      })
  };
}