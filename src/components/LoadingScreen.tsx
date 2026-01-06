import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 800;
    const interval = 15;
    const steps = duration / interval;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 200);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      {/* Rotating Banana */}
      <motion.div
        className="relative w-32 h-32 mb-12"
        animate={{ rotateY: 360 }}
        transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_0_30px_hsl(var(--primary)/0.5)]"
        >
          {/* Banana body */}
          <path
            d="M 30 70 Q 20 50 25 30 Q 35 10 55 15 Q 75 20 80 45 Q 82 65 70 80 Q 55 90 40 85 Q 30 80 30 70"
            fill="hsl(var(--primary))"
            stroke="hsl(var(--primary-glow))"
            strokeWidth="2"
          />
          {/* Banana tip */}
          <path
            d="M 55 15 Q 60 5 70 8"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Banana shine */}
          <path
            d="M 35 35 Q 45 30 55 35"
            fill="none"
            stroke="hsl(var(--primary-glow))"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
      </motion.div>

      {/* Loading Text */}
      <motion.p
        className="font-display text-2xl md:text-3xl text-primary mb-8 tracking-wider"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        Peeling the future...
      </motion.p>

      {/* Progress Bar */}
      <div className="w-64 h-1 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-primary-glow rounded-full"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Progress Percentage */}
      <motion.span
        className="mt-4 font-body text-sm text-muted-foreground tracking-widest"
      >
        {Math.round(progress)}%
      </motion.span>
    </motion.div>
  );
}
