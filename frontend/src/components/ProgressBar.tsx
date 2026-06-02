import { motion } from 'framer-motion';

interface ProgressBarProps {
  percentage: number;
  className?: string;
}

const ProgressBar = ({ percentage, className = '' }: ProgressBarProps) => {
  return (
    <div className={`w-full h-4 bg-secondary rounded-full overflow-hidden ${className}`}>
      <motion.div
        className="h-full gradient-primary rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />
    </div>
  );
};

export default ProgressBar;
