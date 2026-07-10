import { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  detail?: string;
  icon?: ReactNode;
}

export function MetricCard({ label, value, detail, icon }: MetricCardProps) {
  return (
    <div className="surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="mt-2 text-2xl font-bold text-gray-950 dark:text-white">{value}</p>
        </div>
        {icon ? <div className="rounded-lg bg-blue-50 p-2 text-brand dark:bg-blue-950">{icon}</div> : null}
      </div>
      {detail ? <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{detail}</p> : null}
    </div>
  );
}
