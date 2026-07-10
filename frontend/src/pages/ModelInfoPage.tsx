import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BrainCircuit, Calendar, Database, Target } from 'lucide-react';
import { getModelInfo } from '../services/api';
import { ErrorComponent } from '../components/ErrorComponent';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { MetricCard } from '../components/MetricCard';
import { ModelInfo } from '../types/employee';

interface ModelComparisonRow {
  model: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  rocAuc: number;
  prAuc: number;
}

interface ConfusionMatrix {
  model: string;
  matrix: number[][];
}

interface PerformanceAsset {
  modelComparison: ModelComparisonRow[];
  confusionMatrices: ConfusionMatrix[];
  rocCurve: { fpr: number; tpr: number }[];
  prCurve: { recall: number; precision: number }[];
}

function formatMetric(value: number | null) {
  return value === null ? 'N/A' : `${Math.round(value * 100)}%`;
}

export function ModelInfoPage() {
  const [model, setModel] = useState<ModelInfo | null>(null);
  const [performance, setPerformance] = useState<PerformanceAsset | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getModelInfo(),
      fetch('/model-performance.json').then((response) => response.json() as Promise<PerformanceAsset>),
    ])
      .then(([modelInfo, performanceAsset]) => {
        setModel(modelInfo);
        setPerformance(performanceAsset);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load model info.'))
      .finally(() => setLoading(false));
  }, []);

  const chartData = model
    ? [
        { name: 'Accuracy', value: model.training_accuracy },
        { name: 'Precision', value: model.precision },
        { name: 'Recall', value: model.recall },
        { name: 'F1', value: model.f1_score },
        { name: 'ROC AUC', value: model.roc_auc },
        { name: 'PR AUC', value: model.pr_auc },
      ].map((item) => ({ ...item, value: item.value === null ? 0 : Number((item.value * 100).toFixed(1)) }))
    : [];

  return (
    <div className="page-shell">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">Model</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
          Model information
        </h1>
      </motion.div>

      <div className="mt-6">
        {loading ? <LoadingSpinner label="Loading model metadata" /> : null}
        {error ? <ErrorComponent message={error} /> : null}
      </div>

      {model ? (
        <div className="mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Model" value={model.model_name} icon={<BrainCircuit className="h-5 w-5" />} />
            <MetricCard label="Algorithm" value={model.algorithm} icon={<Target className="h-5 w-5" />} />
            <MetricCard label="Features" value={String(model.number_of_features)} icon={<Database className="h-5 w-5" />} />
            <MetricCard
              label="Training Date"
              value={model.training_date ? new Date(model.training_date).toLocaleDateString() : 'N/A'}
              icon={<Calendar className="h-5 w-5" />}
            />
          </div>

          <div className="surface p-6">
            <h2 className="text-xl font-bold text-gray-950 dark:text-white">Evaluation Metrics</h2>
            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                  <Bar dataKey="value" fill="#2563EB" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard label="Accuracy" value={formatMetric(model.training_accuracy)} />
            <MetricCard label="Precision" value={formatMetric(model.precision)} />
            <MetricCard label="Recall" value={formatMetric(model.recall)} />
            <MetricCard label="F1 Score" value={formatMetric(model.f1_score)} />
            <MetricCard label="ROC AUC" value={formatMetric(model.roc_auc)} />
            <MetricCard label="PR AUC" value={formatMetric(model.pr_auc)} />
          </div>

          {performance ? (
            <>
              <div className="surface p-6">
                <h2 className="text-xl font-bold text-gray-950 dark:text-white">Model Comparison</h2>
                <div className="mt-6 overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="text-gray-500 dark:text-gray-400">
                      <tr>
                        {['Model', 'Accuracy', 'Precision', 'Recall', 'F1', 'ROC-AUC', 'PR-AUC'].map((heading) => (
                          <th key={heading} className="whitespace-nowrap px-3 py-2 font-semibold">
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {performance.modelComparison.map((row) => (
                        <tr key={row.model} className="border-t border-gray-200 dark:border-gray-800">
                          <td className="whitespace-nowrap px-3 py-3 font-semibold text-gray-950 dark:text-white">{row.model}</td>
                          <td className="px-3 py-3">{formatMetric(row.accuracy)}</td>
                          <td className="px-3 py-3">{formatMetric(row.precision)}</td>
                          <td className="px-3 py-3">{formatMetric(row.recall)}</td>
                          <td className="px-3 py-3">{formatMetric(row.f1)}</td>
                          <td className="px-3 py-3">{formatMetric(row.rocAuc)}</td>
                          <td className="px-3 py-3">{formatMetric(row.prAuc)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="surface p-6">
                  <h2 className="text-xl font-bold text-gray-950 dark:text-white">ROC Curve</h2>
                  <div className="mt-6 h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performance.rocCurve}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="fpr" tickFormatter={(value) => `${Math.round(Number(value) * 100)}%`} />
                        <YAxis tickFormatter={(value) => `${Math.round(Number(value) * 100)}%`} />
                        <Tooltip formatter={(value) => `${Math.round(Number(value) * 100)}%`} />
                        <Legend />
                        <Line type="monotone" dataKey="tpr" name="True positive rate" stroke="#2563EB" strokeWidth={3} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="surface p-6">
                  <h2 className="text-xl font-bold text-gray-950 dark:text-white">Precision-Recall Curve</h2>
                  <div className="mt-6 h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performance.prCurve}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="recall" tickFormatter={(value) => `${Math.round(Number(value) * 100)}%`} />
                        <YAxis tickFormatter={(value) => `${Math.round(Number(value) * 100)}%`} />
                        <Tooltip formatter={(value) => `${Math.round(Number(value) * 100)}%`} />
                        <Legend />
                        <Line type="monotone" dataKey="precision" name="Precision" stroke="#16A34A" strokeWidth={3} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="surface p-6">
                <h2 className="text-xl font-bold text-gray-950 dark:text-white">Confusion Matrix</h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {performance.confusionMatrices.map((matrix) => (
                    <div key={matrix.model} className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                      <h3 className="font-semibold text-gray-950 dark:text-white">{matrix.model}</h3>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {matrix.matrix.flatMap((row, rowIndex) =>
                          row.map((value, columnIndex) => (
                            <div
                              key={`${rowIndex}-${columnIndex}`}
                              className="rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-950"
                            >
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {rowIndex === 0 ? 'Actual No' : 'Actual Yes'} / {columnIndex === 0 ? 'Pred No' : 'Pred Yes'}
                              </p>
                              <p className="mt-1 text-2xl font-bold text-brand">{value}</p>
                            </div>
                          )),
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
