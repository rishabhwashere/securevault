import type { LoginValues, RegisterValues } from '@/lib/validators';
import type { AuthUser } from './auth.store';
import { requestJson } from '@/lib/request';

interface AuthResponse {
  token: string;
  user: AuthUser;
  message?: string;
}

// Exporting as a single object named 'authService' to fix the missing export error!
export const authService = {
  
  register: async (values: RegisterValues) => {
    const { confirmPassword, ...body } = values;
    
    // We await the response from the server
    const response = await requestJson<{ user: AuthUser; token?: string; message: string }>('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    return response;
  },

  login: async (values: LoginValues) => {
    // We await the response from the server
    const response = await requestJson<AuthResponse>('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });

    return response;
  },

  verifyOtp: async (code: string) => {
    if (!/^\d{6}$/.test(code)) {
      throw new Error('Enter a valid 6-digit code');
    }
    return Promise.resolve({ success: true });
  }
};