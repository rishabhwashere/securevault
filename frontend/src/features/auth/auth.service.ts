import type { LoginValues, RegisterValues } from '@/lib/validators';
import type { AuthUser } from './auth.store';

interface AuthResponse {
  token: string;
  user: AuthUser;
  message?: string;
}

async function request<T>(path: string, init: RequestInit) {
  const response = await fetch(path, init);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || 'Request failed');
  }

  return payload as T;
}

export function registerUser(values: RegisterValues) {
  const { confirmPassword, ...body } = values;
  void confirmPassword;
  return request<{ user: AuthUser; message: string }>('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

export function loginUser(values: LoginValues) {
  return request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values)
  });
}

export function verifyOtp(code: string) {
  if (!/^\d{6}$/.test(code)) {
    throw new Error('Enter a valid 6-digit code');
  }

  return Promise.resolve({ success: true });
}
