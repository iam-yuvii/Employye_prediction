import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-6 text-sm font-medium text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
      <Loader2 className="h-5 w-5 animate-spin text-brand" />
      {label}
    </div>
  );
}
