import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Packages from './Packages';
import Services from './Services';

export default function CardStackTransition({ 
  isTransitioning, 
  activeSlideIndex, 
  targetSlideIndex, 
  onCoverComplete, 
  onTransitionEnd, 
  setCursorVariant 
}) {
  const directionRef = useRef(null);

  if (!directionRef.current && isTransitioning) {
    if ((activeSlideIndex === 2 && targetSlideIndex === 3) || targetSlideIndex === 3) {
      directionRef.current = 'goingToPackages';
    } else if ((activeSlideIndex === 3 && targetSlideIndex === 2) || targetSlideIndex === 2) {
      directionRef.current = 'goingToServices';
    }
  }

  const mode = directionRef.current || (targetSlideIndex === 3 ? 'goingToPackages' : 'goingToServices');
  const isGoingToPackages = mode === 'goingToPackages';

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        if (onCoverComplete) onCoverComplete();
      }, 450);

      const endTimer = setTimeout(() => {
        if (onTransitionEnd) onTransitionEnd();
        directionRef.current = null;
      }, 920);

      return () => {
        clearTimeout(timer);
        clearTimeout(endTimer);
      };
    }
  }, [isTransitioning]);

  if (!isTransitioning) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 40,
        pointerEvents: 'none',
        perspective: '1200px',
        overflow: 'hidden'
      }}
    >
      {/* 1. Underneath Background Card: Always Services (Page 3) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'var(--color-bg-gray)',
          overflowY: 'auto',
          pointerEvents: 'auto'
        }}
      >
        <Services setCursorVariant={setCursorVariant} />
      </div>

      {/* 2. Top 3D Fold Card: Always Packages (Page 4) sliding UP (2->3) or DOWN (3->2) */}
      <motion.div
        initial={
          isGoingToPackages
            ? { y: '100%', rotateX: 20, scale: 0.93, borderTopLeftRadius: '32px', borderTopRightRadius: '32px' }
            : { y: '0%', rotateX: 0, scale: 1, borderTopLeftRadius: '0px', borderTopRightRadius: '0px' }
        }
        animate={
          isGoingToPackages
            ? { y: '0%', rotateX: 0, scale: 1, borderTopLeftRadius: '0px', borderTopRightRadius: '0px' }
            : { y: '100%', rotateX: 20, scale: 0.93, borderTopLeftRadius: '32px', borderTopRightRadius: '32px' }
        }
        transition={{
          duration: 0.9,
          ease: [0.16, 1, 0.3, 1]
        }}
        style={{
          width: '100%',
          height: '100vh',
          backgroundColor: 'var(--color-bg-gray)',
          transformOrigin: 'top center',
          boxShadow: '0 -25px 60px rgba(0, 0, 0, 0.35)',
          overflowY: 'auto',
          pointerEvents: 'auto'
        }}
      >
        <Packages setCursorVariant={setCursorVariant} />
      </motion.div>
    </div>
  );
}
