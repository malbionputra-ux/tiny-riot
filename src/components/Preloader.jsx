import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Preloader.css';

const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    let start = 0;
    const duration = 2000; // 2 seconds
    const intervalTime = 20;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const interval = setInterval(() => {
      start += increment;
      if (start >= 100) {
        setProgress(100);
        setIsComplete(true);
        clearInterval(interval);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 1000); // Wait for exit animation to finish
      } else {
        setProgress(Math.floor(start));
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="preloader"
          initial={{ y: 0 }}
          exit={{ 
            y: '-100%', 
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 } 
          }}
        >
          <div className="preloader-counter">
            {progress}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
