import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './LiquidTransition.css';

export default function LiquidTransition({ isTransitioning, onCoverComplete, onTransitionEnd, color = '#050505' }) {
  const [phase, setPhase] = useState('idle'); // idle, entering, covering, exiting

  useEffect(() => {
    if (isTransitioning) {
      setPhase('entering');
    }
  }, [isTransitioning]);

  const handleAnimationComplete = (definition) => {
    if (phase === 'entering') {
      setPhase('covering');
      if (onCoverComplete) onCoverComplete();
      
      // Short delay while screen is fully black, then exit
      setTimeout(() => {
        setPhase('exiting');
      }, 50);
    } else if (phase === 'exiting') {
      setPhase('idle');
      if (onTransitionEnd) onTransitionEnd();
    }
  };

  if (phase === 'idle') return null;

  // We use two variants: one for entering from bottom, one for exiting to top
  const variants = {
    initial: {
      top: 'auto',
      bottom: 0,
      height: '0vh',
      borderTopLeftRadius: '50% 10vw',
      borderTopRightRadius: '50% 10vw',
      borderBottomLeftRadius: '0% 0px',
      borderBottomRightRadius: '0% 0px',
    },
    entering: {
      top: 'auto',
      bottom: 0,
      height: '120vh',
      borderTopLeftRadius: '0% 0px',
      borderTopRightRadius: '0% 0px',
      borderBottomLeftRadius: '0% 0px',
      borderBottomRightRadius: '0% 0px',
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
    },
    covering: {
      top: 0,
      bottom: 'auto',
      height: '120vh',
      borderRadius: '0% 0px'
    },
    exiting: {
      top: 0,
      bottom: 'auto',
      height: '0vh',
      borderBottomLeftRadius: '50% 10vw',
      borderBottomRightRadius: '50% 10vw',
      borderTopLeftRadius: '0% 0px',
      borderTopRightRadius: '0% 0px',
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
    }
  };

  return (
    <motion.div
      className="liquid-curtain"
      style={{ backgroundColor: color }}
      variants={variants}
      initial="initial"
      animate={phase}
      onAnimationComplete={handleAnimationComplete}
    />
  );
}
