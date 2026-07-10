import { NavLink } from 'react-router-dom';
import { Gauge, Home, Info, LineChart, Sparkles } from 'lucide-react';

const links = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Predict', to: '/predict', icon: Gauge },
  { label: 'Results', to: '/results', icon: LineChart },
  { label: 'Explain', to: '/explain', icon: Sparkles },
  { label: 'Model', to: '/model-info', icon: Info },
];

export function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 px-2 py-2 backdrop-blur dark:border-gray-800 dark:bg-gray-950/95 md:hidden">
      <div className="grid grid-cols-5 gap-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-lg px-1 py-2 text-[11px] font-semibold transition ${
                  isActive
                    ? 'bg-blue-50 text-brand dark:bg-blue-950'
                    : 'text-gray-500 dark:text-gray-400'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
