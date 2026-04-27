import { Navigate } from 'react-router-dom';
import { AuthPanel } from '@/components/auth/AuthPanel';
import { useAuthStore } from '@/features/auth/auth.store';

export function AuthPage() {
  const token = useAuthStore((state) => state.token);

  if (token) {
    return <Navigate to="/vault" replace />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute left-[-120px] top-[140px] h-[360px] w-[360px] rounded-full bg-brand/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[-120px] top-[220px] h-[340px] w-[340px] rounded-full bg-accent/20 blur-3xl" />

      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col items-center">
        <div className="flex w-full flex-1 items-start justify-center pt-12 sm:pt-16">
          <section className="mx-auto w-full max-w-xl">
            <AuthPanel />
          </section>
        </div>

        <p className="pb-2 text-xs uppercase tracking-[0.28em] text-textMuted">Private by Default</p>
      </div>
    </div>
  );
}
