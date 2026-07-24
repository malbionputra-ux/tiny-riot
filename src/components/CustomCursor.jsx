import React, { useEffect, useState, useRef } from 'react';

const CustomCursor = ({ variant = 'default' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const requestRef = useRef(null);
  const targetPos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });

  const outerCircleRef = useRef(null);
  const dotRef = useRef(null);
  const viewTextRef = useRef(null);

  // Variant flags
  const isHovered = variant === 'hover' || variant === 'project' || variant === 'navbarHover';
  const isProject = variant === 'project';
  const isNormalHover = variant === 'hover' || variant === 'navbarHover';

  const size = isHovered ? (isProject ? 88 : 66) : 22;
  const halfSize = size / 2;

  useEffect(() => {
    const handleMouseMove = (e) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    let angle = 0;

    // 100% Cloned Odama.io 60FPS+ Physics Loop
    const animate = () => {
      // 1. Center dot instant/fast lerp (0.4)
      const dotDx = targetPos.current.x - dotPos.current.x;
      const dotDy = targetPos.current.y - dotPos.current.y;
      dotPos.current.x += dotDx * 0.4;
      dotPos.current.y += dotDy * 0.4;

      if (dotRef.current) {
        const pressScale = isPressed ? 0.6 : 1;
        dotRef.current.style.transform = `translate3d(${dotPos.current.x - 4}px, ${dotPos.current.y - 4}px, 0) scale(${pressScale})`;
      }

      // 2. Trailing ring fluid lerp (0.14 - exact Odama.io fluid factor)
      const dx = targetPos.current.x - currentPos.current.x;
      const dy = targetPos.current.y - currentPos.current.y;

      currentPos.current.x += dx * 0.14;
      currentPos.current.y += dy * 0.14;

      // Velocity & Direction vector
      const speed = Math.sqrt(dx * dx + dy * dy);

      // Angle aligns directly to exact movement vector (zero wobble)
      if (speed > 0.1) {
        angle = Math.atan2(dy, dx) * (180 / Math.PI);
      }

      // 100% Odama.io Capsule Stretch Math
      // Elongates along velocity vector, squishes height proportionally
      const stretch = (!isHovered && speed > 0.2) ? Math.min(speed * 0.006, 0.75) : 0;
      const scaleX = (1 + stretch) * (isPressed ? 0.82 : 1);
      const scaleY = Math.max(0.42, 1 - stretch * 0.45) * (isPressed ? 0.82 : 1);

      if (outerCircleRef.current) {
        outerCircleRef.current.style.transform = 
          `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0) ` +
          `rotate(${angle}deg) ` +
          `scale(${scaleX}, ${scaleY})`;
      }

      // 3. Counter-rotate VIEW text so it stays 100% horizontal and upright
      if (viewTextRef.current) {
        viewTextRef.current.style.transform = `rotate(${-angle}deg)`;
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
  }, [isVisible, isPressed, isHovered]);

  if (!isVisible) return null;

  return (
    <>
      {/* 1. Dynamic Outer Ring (Solid Red default & project hover, Gaussian Blur Glass ring on button hover) */}
      <div
        ref={outerCircleRef}
        style={{
          position: 'fixed',
          top: -halfSize,
          left: -halfSize,
          width: size,
          height: size,
          borderRadius: '50%',
          border: isNormalHover ? '1.5px solid #fa2a0e' : 'none',
          backgroundColor: isProject ? '#fa2a0e' : (isNormalHover ? 'rgba(250, 42, 14, 0.15)' : '#fa2a0e'),
          opacity: 0.96,
          transition: 'width 0.35s cubic-bezier(0.16, 1, 0.3, 1), height 0.35s cubic-bezier(0.16, 1, 0.3, 1), top 0.35s cubic-bezier(0.16, 1, 0.3, 1), left 0.35s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease, border-color 0.3s ease',
          pointerEvents: 'none',
          zIndex: 9999998,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          willChange: 'transform',
          backdropFilter: isNormalHover ? 'blur(8px)' : 'none',
          WebkitBackdropFilter: isNormalHover ? 'blur(8px)' : 'none',
          boxShadow: isProject ? '0 10px 30px rgba(250, 42, 14, 0.4)' : 'none',
        }}
      >
        {isProject && (
          <span
            ref={viewTextRef}
            style={{
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 900,
              letterSpacing: '2px',
              pointerEvents: 'none',
              display: 'inline-block',
              willChange: 'transform',
              userSelect: 'none',
            }}
          >
            VIEW
          </span>
        )}
      </div>

      {/* 2. Inner Precise Center Dot (Visible during button hover for instant targeting) */}
      {isNormalHover && (
        <div
          ref={dotRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: '#fa2a0e',
            pointerEvents: 'none',
            zIndex: 9999999,
            willChange: 'transform',
          }}
        />
      )}
    </>
  );
};

export default CustomCursor;
