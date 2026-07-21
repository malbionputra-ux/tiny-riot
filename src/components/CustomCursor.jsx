import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = ({ variant }) => {
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', mouseMove);
    return () => {
      window.removeEventListener('mousemove', mouseMove);
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 10,
      y: mousePosition.y - 10,
      backgroundColor: 'transparent',
      border: '1px solid #ff0000',
      width: 20,
      height: 20,
    },
    hover: {
      x: mousePosition.x - 40,
      y: mousePosition.y - 40,
      width: 80,
      height: 80,
      backgroundColor: 'rgba(255, 0, 0, 0.2)',
      border: 'none',
      mixBlendMode: 'difference',
    },
    navbarHover: {
      x: mousePosition.x - 45,
      y: mousePosition.y - 18,
      width: 90,
      height: 36,
      backgroundColor: '#ffffff',
      border: 'none',
      mixBlendMode: 'difference',
      borderRadius: '24px',
    },
    project: {
      x: mousePosition.x - 40,
      y: mousePosition.y - 40,
      width: 80,
      height: 80,
      backgroundColor: '#ff0000',
      border: 'none',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 'bold'
    }
  };

  return (
    <motion.div
      className="custom-cursor"
      variants={variants}
      animate={variant}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 28,
        mass: 0.5,
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        borderRadius: '50%',
      }}
    >
      {variant === 'project' && <span>VIEW</span>}
    </motion.div>
  );
};

export default CustomCursor;
