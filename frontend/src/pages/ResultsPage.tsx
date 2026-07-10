import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, Gauge, Lightbulb } from 'lucide-react';
import { Button } from '../components/Button';
import { ExplanationCard } from '../components/ExplanationCard';
import { MetricCard } from '../components/MetricCard';
import { RiskCard } from '../components/RiskCard';
import { ExplanationResponse, PredictionResponse } from '../types/employee';

function getResult(locationState: unknown): PredictionResponse | null {
  if (
    locationState &&
    typeof locationState === 'object' &&
    'result' in locationState
  ) {
    return (locationState as { result: PredictionResponse }).result;
  }

  const stored = localStorage.getItem('lastPrediction');
  return stored ? (JSON.parse(stored) as PredictionResponse) : null;
}

function getExplanation(locationState: unknown): ExplanationResponse | null {
  if (
    locationState &&
    typeof locationState === 'object' &&
    'explanation' in locationState
  ) {
    return (locationState as { explanation: ExplanationResponse }).explanation;
  }

  const stored = localStorage.getItem('lastExplanation');
  return stored ? (JSON.parse(stored) as ExplanationResponse) : null;
}

export function ResultsPage() {
  const location = useLocation();
  const result = getResult(location.state);
  const explanation = getExplanation(location.state);

  if (!result) {
    return (
      <div className="page-shell">
        <div className="surface p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-950 dark:text-white">No prediction yet</h1>
          <p className="mt-3 text-gray-600 dark:text-gray-300">Run an employee prediction to view results.</p>
          <Link to="/predict" className="mt-6 inline-flex">
            <Button>Start Prediction</Button>
          </Link>
        </div>
      </div>
    );
  }

  const probability = `${Math.round(result.probability * 100)}%`;

  return (
    <div className="page-shell">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">Results</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
          Attrition prediction result
        </h1>
      </motion.div>
      <div className="mt-6 space-y-6">
        <RiskCard result={result} />
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Prediction" value={result.prediction} icon={<Gauge className="h-5 w-5" />} />
          <MetricCard label="Risk Level" value={result.risk_level} detail="Coarse business risk band" />
          <MetricCard label="Probability" value={probability} icon={<Activity className="h-5 w-5" />} />
        </div>
        {explanation ? (
          <>
            <div className="grid gap-5 lg:grid-cols-2">
              <ExplanationCard
                title="Top Positive SHAP Features"
                items={explanation.positive_features}
                direction="positive"
              />
              <ExplanationCard
                title="Top Negative SHAP Features"
                items={explanation.negative_features}
                direction="negative"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="surface p-6"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                  <Lightbulb className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-bold text-gray-950 dark:text-white">
                  Business Recommendations
                </h2>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {explanation.business_recommendations.map((recommendation) => (
                  <div
                    key={recommendation}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200"
                  >
                    {recommendation}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        ) : null}
        <Link to="/explain" className="inline-flex">
          <Button>
            Explain this profile
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
