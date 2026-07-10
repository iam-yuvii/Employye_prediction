import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts';
import { PredictionResponse } from '../types/employee';

export function RiskCard({ result }: { result: PredictionResponse }) {
  const percent = Math.round(result.probability * 100);
  const isHigh = result.risk_level === 'High' || result.prediction === 'High Risk';
  const color = isHigh ? '#DC2626' : result.risk_level === 'Medium' ? '#EAB308' : '#16A34A';

  return (
    <div className="surface overflow-hidden p-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div
            className="inline-flex items-center gap-2 rounded-lg px-3 py-1 text-sm font-semibold text-white"
            style={{ backgroundColor: color }}
          >
            {isHigh ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
            {result.risk_level} Risk
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-950 dark:text-white">
            {result.prediction}
          </h2>
          <p className="mt-2 max-w-xl text-gray-600 dark:text-gray-300">
            The model estimates this employee's attrition probability at {percent}%.
          </p>
        </div>
        <div className="h-44 w-full max-w-xs">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="96%"
              barSize={16}
              data={[{ name: 'Probability', value: percent, fill: color }]}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar dataKey="value" cornerRadius={8} background />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-gray-950 text-3xl font-bold dark:fill-white"
              >
                {percent}%
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
