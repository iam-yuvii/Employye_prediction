import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Layout } from './components/Layout';
import { LoadingSpinner } from './components/LoadingSpinner';

const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((module) => ({ default: module.AboutPage })),
);
const ExplainabilityPage = lazy(() =>
  import('./pages/ExplainabilityPage').then((module) => ({
    default: module.ExplainabilityPage,
  })),
);
const LandingPage = lazy(() =>
  import('./pages/LandingPage').then((module) => ({ default: module.LandingPage })),
);
const ModelInfoPage = lazy(() =>
  import('./pages/ModelInfoPage').then((module) => ({
    default: module.ModelInfoPage,
  })),
);
const PredictionPage = lazy(() =>
  import('./pages/PredictionPage').then((module) => ({
    default: module.PredictionPage,
  })),
);
const ResultsPage = lazy(() =>
  import('./pages/ResultsPage').then((module) => ({ default: module.ResultsPage })),
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
);

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
      >
        <Suspense fallback={<div className="page-shell"><LoadingSpinner label="Loading page" /></div>}>
          <Routes location={location}>
            <Route element={<Layout />}>
              <Route index element={<LandingPage />} />
              <Route path="/predict" element={<PredictionPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/explain" element={<ExplainabilityPage />} />
              <Route path="/model-info" element={<ModelInfoPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return <AnimatedRoutes />;
}
