import { useAuthStore } from './auth.store';
import { authService } from './auth.service';

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const setSession = useAuthStore((state) => state.setSession);

  return { user, token, setSession, logout };
};

export const useLogin = () => {
  const setSession = useAuthStore((state) => state.setSession);
  
  // We name this mutateAsync to match React Query syntax that AuthPanel expects
  const mutateAsync = async (credentials: any) => {
    try {
      const data = await authService.login(credentials);
      if (data && data.token) {
        setSession(data.token, data.user);
      }
      return data;
    } catch (error: any) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // We return both mutateAsync and login just to be safe
  return { mutateAsync, login: mutateAsync, isLoading: false };
};

export const useRegister = () => {
  const setSession = useAuthStore((state) => state.setSession);

  // We name this mutateAsync to fix the exact error in your console
  const mutateAsync = async (userData: any) => {
    try {
      const data = await authService.register(userData);
      // Automatically log the user in if the API returns a token upon registration
      if (data && data.token) {
        setSession(data.token, data.user);
      }
      return data;
    } catch (error: any) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  return { mutateAsync, register: mutateAsync, isLoading: false };
};