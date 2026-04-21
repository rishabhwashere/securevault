import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { TopBar } from './TopBar';

export function AppShell() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute left-[-120px] top-[120px] h-[320px] w-[320px] rounded-full bg-brand/15 blur-3xl" />
      <div className="pointer-events-none absolute right-[-80px] top-[240px] h-[300px] w-[300px] rounded-full bg-accent/15 blur-3xl" />

      <TopBar />

      <div className="mx-auto flex max-w-[1600px] pt-16">
        <main className="min-h-[calc(100vh-4rem)] flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
