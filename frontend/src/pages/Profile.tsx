import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Card, Button, Input } from '@/components/ui';
import { useAuthStore } from '@/features/auth/auth.store';
import { useUpdateProfile } from '@/features/user/useUser';

async function uploadAvatar(token: string, file: File) {
  const formData = new FormData();
  formData.append('document', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || 'Upload failed');
  }

  return payload.filePath as string;
}

export function ProfilePage() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const updateProfile = useUpdateProfile();

  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    setName(user?.name ?? '');
    setAvatarUrl(user?.avatarUrl ?? '');
  }, [user]);

  const previewUrl = useMemo(() => {
    if (file) return URL.createObjectURL(file);
    return avatarUrl || '';
  }, [file, avatarUrl]);

  useEffect(() => {
    return () => {
      if (file) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [file, previewUrl]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) {
      toast.error('Please log in again.');
      return;
    }

    try {
      let nextAvatar = avatarUrl;
      if (file) {
        nextAvatar = await uploadAvatar(token, file);
      }

      await updateProfile.mutateAsync({
        token,
        payload: {
          name,
          avatarUrl: nextAvatar
        }
      });

      setFile(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Profile update failed';
      toast.error(message);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-textMuted">Profile</p>
        <h1 className="mt-3 font-heading text-4xl text-textPrimary">Keep your identity up to date.</h1>
      </div>

      <Card className="rounded-xl">
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-line bg-white/70 text-lg font-semibold text-textPrimary">
              {previewUrl ? (
                <img src={previewUrl} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <span>{user?.name?.[0]?.toUpperCase() ?? 'U'}</span>
              )}
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-medium uppercase tracking-[0.22em] text-textMuted">Profile photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                className="text-sm text-textMuted"
              />
              <p className="text-xs text-textMuted">Upload a square image for best results.</p>
            </div>
          </div>

          <Input
            label="Display name"
            placeholder="Your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Input label="Email" value={user?.email ?? ''} disabled />

          <div className="flex justify-end">
            <Button type="submit" loading={updateProfile.isPending}>
              Save profile
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
