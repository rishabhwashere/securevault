export async function requestJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});

  let token = sessionStorage.getItem('vaultx-token') || localStorage.getItem('token');
  if (token) {
    token = token.replace(/^"(.*)"$/, '$1'); 
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // --- THE HARDWIRED FIX ---
  // If the request is looking for an API, we force it to go to Render!
  let finalUrl = url;
  if (url.startsWith('/api')) {
    finalUrl = 'https://vaultx-o3nd.onrender.com' + url;
  }

  const response = await fetch(finalUrl, {
    ...options,
    headers,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || `Request failed with status ${response.status}`);
  }

  return payload as T;
}