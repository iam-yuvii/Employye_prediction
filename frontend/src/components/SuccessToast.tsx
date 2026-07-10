import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function SuccessToast({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed right-4 top-20 z-50 flex items-center gap-2 rounded-lg bg-success px-4 py-3 text-sm font-semibold text-white shadow-panel"
    >
      <CheckCircle2 className="h-5 w-5" />
      {message}
    </motion.div>
  );
}
