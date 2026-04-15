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

export async function registerUser(values: RegisterValues) {
  const { confirmPassword, ...body } = values;
  void confirmPassword;
  
  // 1. Wait for the backend to respond
  const response = await request<any>('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  // 2. THE FIX: Catch the token and lock it in Local Storage!
  if (response && response.token) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user || response));
  }

  return response;
}

export async function loginUser(values: LoginValues) {
  // 1. Wait for the backend to respond
  const response = await request<any>('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values)
  });

  // 2. THE FIX: Catch the token and lock it in Local Storage!
  if (response && response.token) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user || response));
  }

  return response;
}
export function verifyOtp(code: string) {
  if (!/^\d{6}$/.test(code)) {
    throw new Error('Enter a valid 6-digit code');
  }

  return Promise.resolve({ success: true });
}
