export async function requestJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});

  // 1. Fetch token and STRIP extra quotes if they exist
  let token = sessionStorage.getItem('vaultx-token') || localStorage.getItem('token');
  if (token) {
    token = token.replace(/^"(.*)"$/, '$1'); // This removes accidental quotes!
    headers.set('Authorization', `Bearer ${token}`);
  }

  // 2. Set default Content-Type ONLY if we aren't sending files (FormData)
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // 3. Make the fetch request
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // 4. Parse payload safely
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      console.error("Unauthorized: Token may be missing or expired.");
    }
    throw new Error(payload.message || `Request failed with status ${response.status}`);
  }

  return payload as T;
}