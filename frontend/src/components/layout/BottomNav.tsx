import { Home, Plus, Settings2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/vault', label: 'Vault', icon: Home },
  { to: '/vault/new', label: 'New', icon: Plus },
  { to: '/vault/settings', label: 'Settings', icon: Settings2 }
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-4 bottom-4 z-50 rounded-full border border-line bg-panel/95 p-2 shadow-card backdrop-blur-panel lg:hidden">
      <div className="grid grid-cols-3 gap-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/vault'}
            className={({ isActive }) =>
              `focus-ring flex flex-col items-center gap-1 rounded-full px-3 py-2 text-xs font-medium transition ${
                isActive ? 'bg-brand text-white' : 'text-textMuted'
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
