import React, { useEffect, useState, useRef } from 'react';

const CustomCursor = ({ variant = 'default' }) => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [trailingPosition, setTrailingPosition] = useState({ x: -100, y: -100 });
  const [isPressed, setIsPressed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const requestRef = useRef(null);
  const targetPos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth Lerp loop for outer trailing circle (Odama.io liquid trailing effect)
    const animate = () => {
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.14;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.14;

      setTrailingPosition({
        x: currentPos.current.x,
        y: currentPos.current.y,
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const isHovered = variant === 'hover' || variant === 'project' || variant === 'navbarHover';
  const isProject = variant === 'project';

  return (
    <>
      {/* 1. Outer Trailing Fluid Circle (Odama.io style lerp spring circle) */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovered ? (isProject ? 90 : 68) : 36,
          height: isHovered ? (isProject ? 90 : 68) : 36,
          borderRadius: '50%',
          border: isHovered ? '1.5px solid #fa2a0e' : '1.5px solid rgba(250, 42, 14, 0.65)',
          backgroundColor: isHovered ? 'rgba(250, 42, 14, 0.12)' : 'transparent',
          transform: `translate3d(${trailingPosition.x - (isHovered ? (isProject ? 45 : 34) : 18)}px, ${trailingPosition.y - (isHovered ? (isProject ? 45 : 34) : 18)}px, 0) scale(${isPressed ? 0.82 : 1})`,
          transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease, border-color 0.3s ease, transform 0.1s ease-out',
          pointerEvents: 'none',
          zIndex: 999998,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: isHovered ? 'blur(2px)' : 'none',
        }}
      >
        {isProject && (
          <span
            style={{
              color: '#fa2a0e',
              fontSize: '10px',
              fontWeight: 900,
              letterSpacing: '1.5px',
            }}
          >
            VIEW
          </span>
        )}
      </div>

      {/* 2. Inner Precise Solid Red Center Dot */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovered ? 8 : 6,
          height: isHovered ? 8 : 6,
          borderRadius: '50%',
          backgroundColor: '#fa2a0e',
          transform: `translate3d(${mousePosition.x - (isHovered ? 4 : 3)}px, ${mousePosition.y - (isHovered ? 4 : 3)}px, 0) scale(${isPressed ? 0.6 : 1})`,
          transition: 'width 0.2s ease, height 0.2s ease, transform 0.05s ease-out',
          pointerEvents: 'none',
          zIndex: 999999,
        }}
      />
    </>
  );
};

export default CustomCursor;
