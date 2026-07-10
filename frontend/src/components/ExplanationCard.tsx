import { ArrowDown, ArrowUp } from 'lucide-react';
import { FeatureImpact } from '../types/employee';

interface ExplanationCardProps {
  title: string;
  items: FeatureImpact[];
  direction: 'positive' | 'negative';
}

export function ExplanationCard({ title, items, direction }: ExplanationCardProps) {
  const isPositive = direction === 'positive';

  return (
    <div className="surface p-5">
      <h3 className="text-lg font-semibold text-gray-950 dark:text-white">{title}</h3>
      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No contributors returned.</p>
        ) : (
          items.map((item) => (
            <div
              key={`${item.feature}-${item.impact}`}
              className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-lg p-2 text-white ${isPositive ? 'bg-danger' : 'bg-success'}`}
                >
                  {isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {item.feature.replace(/^num__|^cat__/, '')}
                </span>
              </div>
              <span className={`text-sm font-bold ${isPositive ? 'text-danger' : 'text-success'}`}>
                {item.impact > 0 ? '+' : ''}
                {item.impact.toFixed(3)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
