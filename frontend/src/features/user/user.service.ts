import type { AuthUser } from '@/features/auth/auth.store';

async function request<T>(path: string, init: RequestInit) {
  const response = await fetch(path, init);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || 'Request failed');
  }

  return payload as T;
}

export function updateProfile(token: string, payload: { name?: string; avatarUrl?: string }) {
  return request<{ data: AuthUser; message?: string }>('/api/users/me', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
}
