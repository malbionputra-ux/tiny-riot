import React, { useEffect, useState, useRef } from 'react';

const CustomCursor = ({ variant = 'default' }) => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isPressed, setIsPressed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const requestRef = useRef(null);
  const targetPos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });
  const outerCircleRef = useRef(null);
  const viewTextRef = useRef(null);

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

    let currentAngle = 0;
    let currentScaleX = 1;
    let currentScaleY = 1;

    // High performance 60FPS animation loop (Odama.io exact physics)
    const animate = () => {
      const dx = targetPos.current.x - currentPos.current.x;
      const dy = targetPos.current.y - currentPos.current.y;

      // Organic Lerp factor (0.12 gives that classic fluid Odama feel)
      currentPos.current.x += dx * 0.12;
      currentPos.current.y += dy * 0.12;

      // Speed & Angle calculation
      const speed = Math.sqrt(dx * dx + dy * dy);

      if (speed > 0.1) {
        const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI);
        
        // Handle angle wrap-around for smooth 360 rotation
        let angleDiff = targetAngle - currentAngle;
        while (angleDiff < -180) angleDiff += 360;
        while (angleDiff > 180) angleDiff -= 360;
        currentAngle += angleDiff * 0.15;
      }

      // Dynamic stretch calculation based on speed
      const targetStretch = Math.min(speed * 0.02, 0.5);
      const targetScaleX = 1 + targetStretch;
      const targetScaleY = 1 - targetStretch * 0.4;

      currentScaleX += (targetScaleX - currentScaleX) * 0.15;
      currentScaleY += (targetScaleY - currentScaleY) * 0.15;

      if (outerCircleRef.current) {
        const pressScale = isPressed ? 0.8 : 1;
        const finalScaleX = currentScaleX * pressScale;
        const finalScaleY = currentScaleY * pressScale;

        outerCircleRef.current.style.transform = 
          `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0) ` +
          `rotate(${currentAngle}deg) ` +
          `scale(${finalScaleX}, ${finalScaleY})`;
      }

      // Counter-rotate text so VIEW text always stays perfectly horizontal and upright!
      if (viewTextRef.current) {
        viewTextRef.current.style.transform = `rotate(${-currentAngle}deg)`;
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
  const size = isHovered ? (isProject ? 88 : 66) : 24;
  const halfSize = size / 2;

  return (
    <>
      {/* 1. Dynamic Trailing Circle: Solid Red default, Glass Translucent Red on Hover */}
      <div
        ref={outerCircleRef}
        style={{
          position: 'fixed',
          top: -halfSize,
          left: -halfSize,
          width: size,
          height: size,
          borderRadius: '50%',
          border: isHovered ? '1.5px solid #fa2a0e' : 'none',
          backgroundColor: isHovered ? 'rgba(250, 42, 14, 0.15)' : '#fa2a0e',
          opacity: 0.92,
          transition: 'width 0.35s cubic-bezier(0.16, 1, 0.3, 1), height 0.35s cubic-bezier(0.16, 1, 0.3, 1), top 0.35s cubic-bezier(0.16, 1, 0.3, 1), left 0.35s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease, border-color 0.3s ease',
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
            ref={viewTextRef}
            style={{
              color: '#fa2a0e',
              fontSize: '10px',
              fontWeight: 900,
              letterSpacing: '1.5px',
              pointerEvents: 'none',
              display: 'inline-block',
              willChange: 'transform',
            }}
          >
            VIEW
          </span>
        )}
      </div>

      {/* 2. Inner Precise Center Dot (visible during hover for precise targeting) */}
      {isHovered && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: '#fa2a0e',
            transform: `translate3d(${mousePosition.x - 4}px, ${mousePosition.y - 4}px, 0) scale(${isPressed ? 0.6 : 1})`,
            transition: 'width 0.25s ease, height 0.25s ease, transform 0.05s ease-out',
            pointerEvents: 'none',
            zIndex: 999999,
            willChange: 'transform',
          }}
        />
      )}
    </>
  );
};

export default CustomCursor;
