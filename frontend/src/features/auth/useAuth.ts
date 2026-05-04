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
  return { mutateAsync, login: mutateAsync, isLoading: false };
};

export const useRegister = () => {
  const setSession = useAuthStore((state) => state.setSession);

  
  const mutateAsync = async (userData: any) => {
    try {
      const data = await authService.register(userData);
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