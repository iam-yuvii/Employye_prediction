import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, SearchX } from 'lucide-react';
import { Button } from '../components/Button';

export function NotFoundPage() {
  return (
    <div className="page-shell">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="surface mx-auto max-w-2xl p-8 text-center"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-blue-50 text-brand dark:bg-blue-950">
          <SearchX className="h-7 w-7" />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-brand">404</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
          Page not found
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          The page you requested is not part of the AttritionIQ workspace.
        </p>
        <Link to="/" className="mt-6 inline-flex">
          <Button>
            <Home className="h-4 w-4" />
            Back to dashboard
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
