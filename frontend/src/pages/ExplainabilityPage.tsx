import { useState } from 'react';
import { motion } from 'framer-motion';
import { explain } from '../services/api';
import { defaultEmployee } from '../services/formConfig';
import { EmployeePayload, ExplanationResponse } from '../types/employee';
import { ErrorComponent } from '../components/ErrorComponent';
import { ExplanationCard } from '../components/ExplanationCard';
import { PredictionForm } from '../components/PredictionForm';
import { RiskCard } from '../components/RiskCard';

export function ExplainabilityPage() {
  const storedEmployee = localStorage.getItem('lastEmployee');
  const initialEmployee = storedEmployee
    ? (JSON.parse(storedEmployee) as EmployeePayload)
    : defaultEmployee;

  const [employee, setEmployee] = useState<EmployeePayload>(initialEmployee);
  const [result, setResult] = useState<ExplanationResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (employee.YearsInCurrentRole > employee.YearsAtCompany) {
      return 'Years in current role cannot exceed years at company.';
    }
    if (employee.TotalWorkingYears < employee.YearsAtCompany) {
      return 'Total working years cannot be lower than years at company.';
    }
    return '';
  };

  const submit = async () => {
    setError('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      const response = await explain(employee);
      setResult(response);
      localStorage.setItem('lastEmployee', JSON.stringify(employee));
      localStorage.setItem('lastPrediction', JSON.stringify(response));
      localStorage.setItem('lastExplanation', JSON.stringify(response));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Explanation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">Explainability</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
          SHAP contribution review
        </h1>
        <p className="mt-3 max-w-3xl text-gray-600 dark:text-gray-300">
          Submit an employee profile to retrieve structured positive and negative SHAP
          contributors from the backend.
        </p>
      </motion.div>
      <div className="mt-6 space-y-5">
        {error ? <ErrorComponent message={error} /> : null}
        {result ? (
          <div className="space-y-5">
            <RiskCard result={result} />
            <div className="grid gap-5 lg:grid-cols-2">
              <ExplanationCard
                title="Top Positive Contributors"
                items={result.positive_features}
                direction="positive"
              />
              <ExplanationCard
                title="Top Negative Contributors"
                items={result.negative_features}
                direction="negative"
              />
            </div>
          </div>
        ) : null}
        <PredictionForm
          value={employee}
          onChange={setEmployee}
          onSubmit={submit}
          loading={loading}
          submitLabel={loading ? 'Analyzing employee...' : 'Explain prediction'}
        />
      </div>
    </div>
  );
}
