import { NavLink } from 'react-router-dom';
import { FileText, Gauge, Home, Lightbulb, LineChart, Sparkles } from 'lucide-react';

const links = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Prediction', to: '/predict', icon: Gauge },
  { label: 'Results', to: '/results', icon: LineChart },
  { label: 'Explainability', to: '/explain', icon: Sparkles },
  { label: 'Model Info', to: '/model-info', icon: FileText },
  { label: 'About', to: '/about', icon: Lightbulb },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-950 lg:block">
      <div className="sticky top-20 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-white text-brand shadow-sm dark:bg-gray-900'
                    : 'text-gray-600 hover:bg-white hover:text-gray-950 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
}
