import { Home, Plus, UserCircle2, UserPlus } from 'lucide-react'; // ✨ 1. Imported UserPlus
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/vault', label: 'Vault', icon: Home },
  { to: '/vault/new', label: 'New', icon: Plus },
  { to: '/nominee', label: 'Nominee', icon: UserPlus }, // ✨ 2. Added the Nominee object
  { to: '/vault/profile', label: 'Profile', icon: UserCircle2 }
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-4 bottom-4 z-50 rounded-full border border-line bg-panel/95 p-2 shadow-card backdrop-blur-panel lg:hidden">
      {/* ✨ 3. Changed grid-cols-3 to grid-cols-4 so all 4 items fit perfectly */}
      <div className="grid grid-cols-4 gap-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/vault'}
            className={({ isActive }) =>
              `focus-ring flex flex-col items-center gap-1 rounded-full px-3 py-2 text-xs font-medium transition ${
                isActive ? 'bg-brand text-background' : 'text-textMuted hover:text-textPrimary'
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}