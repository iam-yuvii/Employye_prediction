import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { explain, predict } from '../services/api';
import { defaultEmployee } from '../services/formConfig';
import { EmployeePayload } from '../types/employee';
import { ErrorComponent } from '../components/ErrorComponent';
import { PredictionForm } from '../components/PredictionForm';
import { SuccessToast } from '../components/SuccessToast';

export function PredictionPage() {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<EmployeePayload>(defaultEmployee);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    if (employee.YearsInCurrentRole > employee.YearsAtCompany) {
      return 'Years in current role cannot exceed years at company.';
    }
    if (employee.YearsWithCurrManager > employee.YearsAtCompany) {
      return 'Years with current manager cannot exceed years at company.';
    }
    if (employee.YearsSinceLastPromotion > employee.YearsAtCompany) {
      return 'Years since last promotion cannot exceed years at company.';
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
      const result = await predict(employee);
      const explanation = await explain(employee);
      localStorage.setItem('lastEmployee', JSON.stringify(employee));
      localStorage.setItem('lastPrediction', JSON.stringify(result));
      localStorage.setItem('lastExplanation', JSON.stringify(explanation));
      setSuccess(true);
      setTimeout(() => navigate('/results', { state: { result, explanation, employee } }), 450);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prediction failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      {success ? <SuccessToast message="Prediction complete" /> : null}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">Prediction</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
          Employee risk profile
        </h1>
        <p className="mt-3 max-w-3xl text-gray-600 dark:text-gray-300">
          Enter original employee features. The backend computes engineered features and
          applies the saved preprocessing pipeline before scoring.
        </p>
      </motion.div>
      <div className="mt-6 space-y-5">
        {error ? <ErrorComponent message={error} /> : null}
        <PredictionForm
          value={employee}
          onChange={setEmployee}
          onSubmit={submit}
          loading={loading}
          submitLabel={loading ? 'Analyzing employee...' : 'Predict attrition risk'}
        />
      </div>
    </div>
  );
}
