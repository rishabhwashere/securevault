import type { LoginValues, RegisterValues } from '@/lib/validators';
import type { AuthUser } from './auth.store';
import { requestJson } from '@/lib/request';

interface AuthResponse {
  token: string;
  user: AuthUser;
  message?: string;
}

export function registerUser(values: RegisterValues) {
  const { confirmPassword, ...body } = values;
  void confirmPassword;
  return requestJson<{ user: AuthUser; message: string }>('/api/auth/register', {
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

export function loginUser(values: LoginValues) {
  return requestJson<AuthResponse>('/api/auth/login', {
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
