import { Link, NavLink } from 'react-router-dom';
import { BarChart3, BrainCircuit, Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

const links = [
  { label: 'Predict', to: '/predict' },
  { label: 'Explain', to: '/explain' },
  { label: 'Model', to: '/model-info' },
  { label: 'About', to: '/about' },
];

export function Navbar() {
  const { isDark, setIsDark } = useDarkMode();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-white">
            <BrainCircuit className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold text-gray-950 dark:text-white">AttritionIQ</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-50 text-brand dark:bg-blue-950'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/predict"
            className="hidden h-10 items-center gap-2 rounded-lg bg-gray-950 px-3 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200 sm:inline-flex"
          >
            <BarChart3 className="h-4 w-4" />
            Start
          </Link>
          <button
            type="button"
            onClick={() => setIsDark(!isDark)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition hover:bg-gray-100 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-900"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
