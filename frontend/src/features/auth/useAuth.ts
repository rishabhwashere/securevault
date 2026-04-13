import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { loginUser, registerUser, verifyOtp } from './auth.service';
import { useAuthStore } from './auth.store';

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setSession(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name}`);
    }
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success(data.message || `Account created for ${data.user.name}`);
    }
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: verifyOtp,
    onSuccess: () => {
      toast.success('Verification complete');
    }
  });
}
