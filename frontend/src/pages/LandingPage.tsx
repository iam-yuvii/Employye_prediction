import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, BrainCircuit, ShieldCheck, Sparkles } from 'lucide-react';
import heroImage from '../assets/hr-dashboard-hero.png';
import { Button } from '../components/Button';
import { getHealth, getRootStatus } from '../services/api';

const features = [
  {
    icon: <BrainCircuit className="h-5 w-5" />,
    title: 'ML Risk Scoring',
    body: 'Score employee attrition risk using the trained backend model and saved preprocessing pipeline.',
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: 'Explainability',
    body: 'Review structured SHAP contributors without generating browser-side plots.',
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: 'Model Metrics',
    body: 'Track the model profile, classification metrics, training date, and feature count.',
  },
];

export function LandingPage() {
  const [apiStatus, setApiStatus] = useState('Checking API');

  useEffect(() => {
    Promise.all([getRootStatus(), getHealth()])
      .then(([root, health]) => {
        setApiStatus(`${root.status} - ${health.status}`);
      })
      .catch(() => setApiStatus('API unavailable'));
  }, []);

  return (
    <div>
      <section className="relative min-h-[620px] overflow-hidden bg-gray-950">
        <img
          src={heroImage}
          alt="HR analytics dashboard workstation"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-gray-950/10" />
        <div className="relative mx-auto flex min-h-[620px] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl text-white"
          >
            <div className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur">
              <ShieldCheck className="h-4 w-4" />
              {apiStatus}
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              AttritionIQ
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-gray-200">
              A polished workforce intelligence dashboard for predicting employee attrition,
              reviewing risk signals, and understanding model behavior.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/predict">
                <Button className="w-full sm:w-auto">
                  Start Prediction
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/model-info">
                <Button variant="secondary" className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20 sm:w-auto">
                  View Model
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="page-shell">
        <div className="grid gap-6 lg:grid-cols-3">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              whileHover={{ y: -4 }}
              className="surface p-6"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-brand dark:bg-blue-950">
                {feature.icon}
              </div>
              <h2 className="text-xl font-bold text-gray-950 dark:text-white">{feature.title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{feature.body}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
