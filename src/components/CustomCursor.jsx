import React, { useEffect, useState, useRef } from 'react';

const CustomCursor = ({ variant = 'default' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const requestRef = useRef(null);
  const targetPos = useRef({ x: -100, y: -100 });
  const outerPos = useRef({ x: -100, y: -100 });
  const ghostPos = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });

  const outerCircleRef = useRef(null);
  const ghostCircleRef = useRef(null);
  const dotRef = useRef(null);
  const viewTextRef = useRef(null);

  // Variant flags
  const isHovered = variant === 'hover' || variant === 'project' || variant === 'navbarHover';
  const isProject = variant === 'project';
  const size = isHovered ? (isProject ? 88 : 66) : 24;
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

    let currentAngle = 0;
    let currentScaleX = 1;
    let currentScaleY = 1;

    // High performance 60FPS+ RAF animation loop (zero React re-renders)
    const animate = () => {
      // 1. Fast, pin-point lerp for center dot (0.4)
      const dotDx = targetPos.current.x - dotPos.current.x;
      const dotDy = targetPos.current.y - dotPos.current.y;
      dotPos.current.x += dotDx * 0.4;
      dotPos.current.y += dotDy * 0.4;

      if (dotRef.current) {
        const pressScale = isPressed ? 0.6 : 1;
        dotRef.current.style.transform = `translate3d(${dotPos.current.x - 4}px, ${dotPos.current.y - 4}px, 0) scale(${pressScale})`;
      }

      // 2. Organic fluid lerp for outer trailing ring (0.13)
      const dx = targetPos.current.x - outerPos.current.x;
      const dy = targetPos.current.y - outerPos.current.y;
      outerPos.current.x += dx * 0.13;
      outerPos.current.y += dy * 0.13;

      // 3. Ghost lerp trailing slightly behind outer ring for Motion Blur tail (0.28)
      const ghostDx = outerPos.current.x - ghostPos.current.x;
      const ghostDy = outerPos.current.y - ghostPos.current.y;
      ghostPos.current.x += ghostDx * 0.28;
      ghostPos.current.y += ghostDy * 0.28;

      // Speed & Angle calculation for dynamic stretch & motion blur
      const speed = Math.sqrt(dx * dx + dy * dy);

      if (speed > 0.1) {
        const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI);
        
        // Handle 360 angle wrap-around smoothly
        let angleDiff = targetAngle - currentAngle;
        while (angleDiff < -180) angleDiff += 360;
        while (angleDiff > 180) angleDiff -= 360;
        currentAngle += angleDiff * 0.14;
      }

      // Elegant, area-preserving stretch physics (ONLY in default mode during fast movement)
      const targetStretch = (!isHovered && speed > 2.5) ? Math.min((speed - 2.5) * 0.008, 0.18) : 0;
      const targetScaleX = 1 + targetStretch;
      const targetScaleY = 1 / targetScaleX; // Preserves circle area perfectly (liquid physics)

      currentScaleX += (targetScaleX - currentScaleX) * 0.14;
      currentScaleY += (targetScaleY - currentScaleY) * 0.14;

      // Motion Blur calculation: ONLY active during fast movements (speed > 3.0), NEVER when stationary or on hover
      const motionBlurPx = (!isHovered && speed > 3.0) ? Math.min((speed - 3.0) * 0.12, 4.2) : 0;

      if (outerCircleRef.current) {
        const pressScale = isPressed ? 0.82 : 1;
        const finalScaleX = currentScaleX * pressScale;
        const finalScaleY = currentScaleY * pressScale;

        outerCircleRef.current.style.transform = 
          `translate3d(${outerPos.current.x}px, ${outerPos.current.y}px, 0) ` +
          `rotate(${currentAngle}deg) ` +
          `scale(${finalScaleX}, ${finalScaleY})`;

        // Apply Motion Blur ONLY during fast movement
        if (motionBlurPx > 0.3) {
          const filterStr = `blur(${motionBlurPx.toFixed(1)}px)`;
          outerCircleRef.current.style.filter = filterStr;
          outerCircleRef.current.style.webkitFilter = filterStr;
        } else {
          outerCircleRef.current.style.filter = 'none';
          outerCircleRef.current.style.webkitFilter = 'none';
        }
      }

      // Update Motion Blur Ghost Tail (Active ONLY during fast movement in default mode)
      if (ghostCircleRef.current) {
        const ghostOpacity = (!isHovered && speed > 5.0) ? Math.min((speed - 5.0) * 0.03, 0.35) : 0;
        const ghostBlur = Math.min(2 + speed * 0.1, 6);
        ghostCircleRef.current.style.transform = 
          `translate3d(${ghostPos.current.x}px, ${ghostPos.current.y}px, 0) ` +
          `rotate(${currentAngle}deg) ` +
          `scale(${currentScaleX * 0.95}, ${currentScaleY * 0.95})`;
        ghostCircleRef.current.style.opacity = ghostOpacity.toString();
        ghostCircleRef.current.style.filter = `blur(${ghostBlur.toFixed(1)}px)`;
        ghostCircleRef.current.style.webkitFilter = `blur(${ghostBlur.toFixed(1)}px)`;
      }

      // 4. Counter-rotate VIEW text so it stays 100% horizontal and upright
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
  }, [isVisible, isPressed, isHovered]);

  if (!isVisible) return null;

  return (
    <>
      {/* 1. Motion Blur Ghost Trail (Appears dynamically during fast movements) */}
      <div
        ref={ghostCircleRef}
        style={{
          position: 'fixed',
          top: -halfSize,
          left: -halfSize,
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: '#fa2a0e',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 9999997,
          boxSizing: 'border-box',
          willChange: 'transform, opacity, filter',
        }}
      />

      {/* 2. Dynamic Main Outer Ring (Solid Red default, Glass Translucent Red on Hover, Velocity Blur) */}
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
          backgroundColor: isHovered ? 'rgba(250, 42, 14, 0.14)' : '#fa2a0e',
          opacity: 0.95,
          transition: 'width 0.35s cubic-bezier(0.16, 1, 0.3, 1), height 0.35s cubic-bezier(0.16, 1, 0.3, 1), top 0.35s cubic-bezier(0.16, 1, 0.3, 1), left 0.35s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease, border-color 0.3s ease',
          pointerEvents: 'none',
          zIndex: 9999998,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          willChange: 'transform, filter',
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
              userSelect: 'none',
            }}
          >
            VIEW
          </span>
        )}
      </div>

      {/* 3. Inner Precise Center Dot (Visible during hover for instant targeting) */}
      {isHovered && (
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


