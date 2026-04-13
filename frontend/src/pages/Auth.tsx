import { Navigate } from 'react-router-dom';
import { AuthPanel } from '@/components/auth/AuthPanel';
import { useAuthStore } from '@/features/auth/auth.store';

export function AuthPage() {
  const token = useAuthStore((state) => state.token);

  if (token) {
    return <Navigate to="/vault" replace />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute left-[-120px] top-[140px] h-[360px] w-[360px] rounded-full bg-brand/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[-120px] top-[220px] h-[340px] w-[340px] rounded-full bg-accent/20 blur-3xl" />

      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.9fr] lg:items-center">
        <section className="relative overflow-hidden rounded-[32px] border border-line bg-white/35 p-8 shadow-soft backdrop-blur-panel md:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(31,107,95,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(199,134,70,0.16),transparent_36%)]" />
          <div className="relative max-w-2xl">
            <p className="text-xs uppercase tracking-[0.28em] text-textMuted">Private by default</p>
            <h1 className="mt-5 font-heading text-5xl leading-[0.96] text-textPrimary sm:text-6xl">
              Store passwords, notes, and sensitive files in one calm workspace.
            </h1>
          </div>
        </section>

        <section className="mx-auto w-full max-w-xl">
          <AuthPanel />
        </section>
      </div>
    </div>
  );
}
