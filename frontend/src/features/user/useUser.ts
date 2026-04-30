import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateProfile } from './user.service';
import { useAuthStore } from '@/features/auth/auth.store';

export function useUpdateProfile() {
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: ({ token, payload }: { token: string; payload: { name?: string; avatarUrl?: string } }) =>
      updateProfile(token, payload),
    onSuccess: (data) => {
      updateUser(data.data);
      toast.success(data.message || 'Profile updated');
    }
  });
}
