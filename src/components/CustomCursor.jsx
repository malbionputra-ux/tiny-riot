import React, { useEffect, useState, useRef } from 'react';

const CustomCursor = ({ variant = 'default' }) => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isPressed, setIsPressed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const requestRef = useRef(null);
  const targetPos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });
  const outerCircleRef = useRef(null);

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

    // Dynamic Physics & Deformation Animation Loop (Odama.io Velocity Stretch & Rotate)
    let currentAngle = 0;
    let currentScaleX = 1;
    let currentScaleY = 1;

    const animate = () => {
      const dx = targetPos.current.x - currentPos.current.x;
      const dy = targetPos.current.y - currentPos.current.y;

      // Smooth Lerp Position
      currentPos.current.x += dx * 0.15;
      currentPos.current.y += dy * 0.15;

      // Velocity & Motion Vector
      const speed = Math.sqrt(dx * dx + dy * dy);
      
      // Calculate target angle & stretch based on cursor velocity
      if (speed > 0.5) {
        const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI);
        // Smooth rotation interpolation
        currentAngle += (targetAngle - currentAngle) * 0.2;
      }

      // Dynamic Stretch along motion axis (max 45% stretch)
      const targetStretch = Math.min(speed * 0.018, 0.45);
      const targetScaleX = 1 + targetStretch;
      const targetScaleY = 1 - targetStretch * 0.45;

      currentScaleX += (targetScaleX - currentScaleX) * 0.18;
      currentScaleY += (targetScaleY - currentScaleY) * 0.18;

      if (outerCircleRef.current) {
        const pressScale = isPressed ? 0.8 : 1;
        outerCircleRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0) rotate(${currentAngle}deg) scale(${currentScaleX * pressScale}, ${currentScaleY * pressScale})`;
      }

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
  }, [isVisible, isPressed]);

  if (!isVisible) return null;

  const isHovered = variant === 'hover' || variant === 'project' || variant === 'navbarHover';
  const isProject = variant === 'project';
  const size = isHovered ? (isProject ? 90 : 68) : 36;
  const halfSize = size / 2;

  return (
    <>
      {/* 1. Outer Dynamic Trailing Circle (Odama.io Velocity Stretch & Rotate) */}
      <div
        ref={outerCircleRef}
        style={{
          position: 'fixed',
          top: -halfSize,
          left: -halfSize,
          width: size,
          height: size,
          borderRadius: '50%',
          border: isHovered ? '1.5px solid #fa2a0e' : '1.5px solid rgba(250, 42, 14, 0.65)',
          backgroundColor: isHovered ? 'rgba(250, 42, 14, 0.12)' : 'transparent',
          transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1), top 0.3s cubic-bezier(0.16, 1, 0.3, 1), left 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease, border-color 0.3s ease',
          pointerEvents: 'none',
          zIndex: 999998,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          willChange: 'transform',
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
          willChange: 'transform',
        }}
      />
    </>
  );
};

export default CustomCursor;
