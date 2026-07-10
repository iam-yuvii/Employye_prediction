import { motion } from 'framer-motion';

const sections = [
  {
    title: 'Problem Statement',
    body: 'Employee attrition affects hiring plans, team continuity, and operating cost. This system helps HR teams estimate attrition risk from structured employee data.',
  },
  {
    title: 'Dataset',
    body: 'The project uses original employee features such as age, department, job role, compensation, work-life balance, overtime, satisfaction ratings, tenure, and promotion history.',
  },
  {
    title: 'Machine Learning Workflow',
    body: 'The workflow loads raw data, cleans identifier and constant fields, encodes categorical indicators, engineers tenure and income ratios, preprocesses inputs, trains models, and evaluates performance.',
  },
  {
    title: 'Algorithms',
    body: 'The refactored machine learning package includes Logistic Regression, Decision Tree, Random Forest, XGBoost, and a tuned XGBoost model used by the backend API.',
  },
  {
    title: 'Evaluation',
    body: 'Model quality is reviewed with accuracy, precision, recall, F1 score, confusion matrix, ROC curve, and precision-recall analysis.',
  },
  {
    title: 'Hyperparameter Tuning',
    body: 'The tuned XGBoost model is selected with randomized search and stratified cross-validation using F1 score as the optimization target.',
  },
  {
    title: 'Explainable AI',
    body: 'The backend uses SHAP to return positive and negative feature contributors as structured JSON, making risk drivers visible to decision makers.',
  },
  {
    title: 'Business Insights',
    body: 'The interface helps teams examine overtime pressure, compensation patterns, promotion gaps, tenure signals, and satisfaction metrics before taking retention actions.',
  },
];

export function AboutPage() {
  return (
    <div className="page-shell">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">About</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
          Project overview
        </h1>
        <p className="mt-3 max-w-3xl text-gray-600 dark:text-gray-300">
          A clean frontend layer for an employee attrition machine learning system, designed
          for recruiters, HR analysts, and workforce planning teams.
        </p>
      </motion.div>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {sections.map((section, index) => (
          <motion.article
            key={section.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="surface p-6"
          >
            <h2 className="text-xl font-bold text-gray-950 dark:text-white">{section.title}</h2>
            <p className="mt-3 leading-7 text-gray-600 dark:text-gray-300">{section.body}</p>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
