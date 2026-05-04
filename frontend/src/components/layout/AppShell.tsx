import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { TopBar } from './TopBar';
import NomineeAlertModal from '../auth/NomineeAlertModal'; 
import { useAuth } from '../../features/auth/useAuth'; 

export function AppShell() {
  
  const { user } = useAuth(); 

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <TopBar />

      <div className="mx-auto flex max-w-[1600px] pt-16">
        <main className="min-h-[calc(100vh-4rem)] flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>

      <BottomNav />

      {}
      {user && <NomineeAlertModal />}
    </div>
  );
}