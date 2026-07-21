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
          initial={{ x: 0 }}
          exit={{ 
            x: '100%', 
            transition: { duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.5 } 
          }}
        >
          <div className="vektora-content">
             <motion.img 
                src="/assets/new-logo-transparent.png" 
                alt="Logo" 
                className="vektora-logo"
                initial={{ opacity: 0, rotateZ: -20, y: 50 }}
                animate={{ opacity: 1, rotateZ: 0, y: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
             />
             <motion.h1 
                className="vektora-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.8, delay: 0.2 }}
             >
               Almost There
             </motion.h1>
             <motion.div 
                className="vektora-count"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.8, delay: 0.4 }}
             >
               {progress}
             </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
