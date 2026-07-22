import React, { useEffect, useState, useRef } from 'react'
import CustomCursor from './components/CustomCursor'
import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import Projects from './components/Projects'
import Packages from './components/Packages'
import Footer from './components/Footer'
import ChatWidget from './components/ChatWidget'
import LiquidTransition from './components/LiquidTransition'
import Preloader from './components/Preloader'
import './App.css'
import './slider.css'

const SLIDES = ['hero', 'projects', 'services', 'packages', 'footer'];

function App() {
  const [cursorVariant, setCursorVariant] = useState('default')
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [targetSlideIndex, setTargetSlideIndex] = useState(0)
  const [cardProgress, setCardProgress] = useState(0); // 0 (Services) to 1 (Packages)
  const [appLoaded, setAppLoaded] = useState(false)

  // Refs for tracking scroll bounds
  const slideRefs = useRef({});

  const triggerTransition = (newIndex) => {
    if (isTransitioning || newIndex === activeSlideIndex) return;

    if (activeSlideIndex === 2 && newIndex === 3) {
      setCardProgress(1);
      setActiveSlideIndex(3);
      return;
    }
    if (activeSlideIndex === 3 && newIndex === 2) {
      setCardProgress(0);
      setActiveSlideIndex(2);
      return;
    }

    setTargetSlideIndex(newIndex);
    setIsTransitioning(true);
  };

  // Called when the Liquid curtain is fully covering the screen
  const onCoverComplete = () => {
    setActiveSlideIndex(targetSlideIndex);
  };

  // Called when the Liquid curtain has fully exited
  const onTransitionEnd = () => {
    setIsTransitioning(false);
  };

  useEffect(() => {
    let lastWheelTime = 0;
    
    const handleWheel = (e) => {
      if (isTransitioning || !appLoaded) return;
      
      const rawDelta = typeof e.deltaY === 'number' && !Number.isNaN(e.deltaY) ? e.deltaY : 0;
      const activeId = SLIDES[activeSlideIndex];
      const container = slideRefs.current[activeId];

      // Progressive 3D card folding between Page 3 (Services, idx 2) and Page 4 (Packages, idx 3)
      if (activeSlideIndex === 2) {
        if (container) {
          const isAtBottom = Math.ceil(container.scrollHeight - container.scrollTop) <= container.clientHeight + 5;
          if (isAtBottom && rawDelta > 0) {
            // Scroll down at bottom of Services -> Open Packages card pelan-pelan
            const step = Math.min(Math.max(rawDelta * 0.0015, 0.03), 0.2);
            setCardProgress(prev => {
              const current = Number.isNaN(prev) ? 0 : prev;
              const next = Math.min(1, current + step);
              if (next >= 0.96) {
                setActiveSlideIndex(3);
                return 1;
              }
              return next;
            });
            return;
          } else if (cardProgress > 0 && rawDelta < 0) {
            // Scroll up while card is open -> Close card pelan-pelan
            const step = Math.min(Math.max(Math.abs(rawDelta) * 0.0015, 0.03), 0.2);
            setCardProgress(prev => {
              const current = Number.isNaN(prev) ? 0 : prev;
              const next = Math.max(0, current - step);
              return next;
            });
            return;
          }
        }
      } else if (activeSlideIndex === 3) {
        if (container) {
          const isAtTop = container.scrollTop <= 5;
          if (isAtTop && rawDelta < 0) {
            // Scroll up at top of Packages -> Close Packages card pelan-pelan
            const step = Math.min(Math.max(Math.abs(rawDelta) * 0.0015, 0.03), 0.2);
            setCardProgress(prev => {
              const current = Number.isNaN(prev) ? 1 : prev;
              const next = Math.max(0, current - step);
              if (next <= 0.04) {
                setActiveSlideIndex(2);
                return 0;
              }
              return next;
            });
            return;
          } else if (cardProgress < 1 && rawDelta > 0) {
            // Scroll down while card is closed -> Open card pelan-pelan
            const step = Math.min(Math.max(rawDelta * 0.0015, 0.03), 0.2);
            setCardProgress(prev => {
              const current = Number.isNaN(prev) ? 1 : prev;
              const next = Math.min(1, current + step);
              return next;
            });
            return;
          }
        }
      }
      
      const now = Date.now();
      if (now - lastWheelTime < 800) return;
      
      if (rawDelta > 0) {
        // Scrolling DOWN
        if (container) {
          const isAtBottom = Math.ceil(container.scrollHeight - container.scrollTop) <= container.clientHeight + 5;
          if (!isAtBottom) return; // Allow normal internal scroll
        }
        
        if (activeSlideIndex < SLIDES.length - 1) {
          lastWheelTime = now;
          triggerTransition(activeSlideIndex + 1);
        }
      } else if (rawDelta < 0) {
        // Scrolling UP
        if (container) {
          const isAtTop = container.scrollTop <= 5;
          if (!isAtTop) return; // Allow normal internal scroll
        }
        
        if (activeSlideIndex > 0) {
          lastWheelTime = now;
          triggerTransition(activeSlideIndex - 1);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [activeSlideIndex, isTransitioning, appLoaded, cardProgress]);
  
  // Basic touch support
  useEffect(() => {
    let touchStartY = 0;
    let lastTouchTime = 0;
    
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e) => {
      if (isTransitioning || !appLoaded) return;
      const touchEndY = e.touches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      
      if (Math.abs(deltaY) < 50) return; // Minimum swipe distance
      
      const now = Date.now();
      if (now - lastTouchTime < 800) return;
      
      const activeId = SLIDES[activeSlideIndex];
      const container = slideRefs.current[activeId];
      
      if (deltaY > 0) { // Swipe UP (scroll down)
        if (container) {
          const isAtBottom = Math.ceil(container.scrollHeight - container.scrollTop) <= container.clientHeight + 5;
          if (!isAtBottom) {
             touchStartY = touchEndY; // Reset
             return; 
          }
        }
        if (activeSlideIndex < SLIDES.length - 1) {
          lastTouchTime = now;
          triggerTransition(activeSlideIndex + 1);
        }
      } else { // Swipe DOWN (scroll up)
        if (container) {
          const isAtTop = container.scrollTop <= 5;
          if (!isAtTop) {
             touchStartY = touchEndY; // Reset
             return; 
          }
        }
        if (activeSlideIndex > 0) {
          lastTouchTime = now;
          triggerTransition(activeSlideIndex - 1);
        }
      }
    };
    
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [activeSlideIndex, isTransitioning, appLoaded]);

  const [chatOpen, setChatOpen] = useState(false);
  const [hasInteractedChat, setHasInteractedChat] = useState(false);
  const [isSpawningTrail, setIsSpawningTrail] = useState(false);

  const handleOpenChat = () => {
    setIsSpawningTrail(true);
    setTimeout(() => {
      setHasInteractedChat(true);
      setChatOpen(true);
    }, 950);
    setTimeout(() => {
      setIsSpawningTrail(false);
    }, 2000);
  };

  return (
    <div className="app-container">
      <Preloader onComplete={() => setAppLoaded(true)} />
      <CustomCursor variant={cursorVariant} />
      
      {/* The Liquid Wave Overlay */}
      {isTransitioning && (
        <LiquidTransition 
          isTransitioning={isTransitioning} 
          onCoverComplete={onCoverComplete} 
          onTransitionEnd={onTransitionEnd}
        />
      )}
      
      {/* We no longer use native page scrolling. The Header stays on top. */}
      <Header 
        setCursorVariant={setCursorVariant} 
        isLight={activeSlideIndex === 1 || activeSlideIndex === 2 || activeSlideIndex === 3} 
        activeSlideIndex={activeSlideIndex}
        isTransitioning={isTransitioning}
      />
      
      <main className="slider-main">
        {/* Slide 0: Hero */}
        <div 
          className={`slide-container ${activeSlideIndex === 0 ? 'active' : ''}`}
          ref={el => slideRefs.current['hero'] = el}
        >
          {activeSlideIndex === 0 && (
            <Hero 
              setCursorVariant={setCursorVariant} 
              onOpenChat={handleOpenChat}
              chatOpen={chatOpen}
              hasInteractedChat={hasInteractedChat}
            />
          )}
        </div>
        
        {/* Slide 1: Projects */}
        <div 
          className={`slide-container ${activeSlideIndex === 1 ? 'active' : ''}`}
          ref={el => slideRefs.current['projects'] = el}
        >
          {activeSlideIndex === 1 && <Projects setCursorVariant={setCursorVariant} />}
        </div>
        
        {/* Slide 2: Services (Background under Packages card) */}
        <div 
          className={`slide-container ${activeSlideIndex === 2 || activeSlideIndex === 3 || cardProgress > 0 ? 'active' : ''}`}
          ref={el => slideRefs.current['services'] = el}
          style={{
            zIndex: activeSlideIndex === 2 ? 10 : 5,
            backgroundColor: 'var(--color-bg-gray)'
          }}
        >
          {(activeSlideIndex === 2 || activeSlideIndex === 3 || cardProgress > 0) && (
            <Services setCursorVariant={setCursorVariant} />
          )}
        </div>
        
        {/* Slide 3: Packages (Plainthing Studio Progressive 3D Card Stack) */}
        <motion.div 
          className={`slide-container ${activeSlideIndex === 3 || activeSlideIndex === 2 || cardProgress > 0 ? 'active' : ''}`}
          ref={el => slideRefs.current['packages'] = el}
          initial={false}
          animate={{
            y: `${(1 - (Number.isNaN(cardProgress) ? 0 : Math.max(0, Math.min(1, cardProgress)))) * 100}%`,
            rotateX: (1 - (Number.isNaN(cardProgress) ? 0 : Math.max(0, Math.min(1, cardProgress)))) * 22,
            scale: 0.93 + (Number.isNaN(cardProgress) ? 0 : Math.max(0, Math.min(1, cardProgress))) * 0.07,
            borderTopLeftRadius: `${(1 - (Number.isNaN(cardProgress) ? 0 : Math.max(0, Math.min(1, cardProgress)))) * 32}px`,
            borderTopRightRadius: `${(1 - (Number.isNaN(cardProgress) ? 0 : Math.max(0, Math.min(1, cardProgress)))) * 32}px`
          }}
          transition={{
            type: 'spring',
            stiffness: 220,
            damping: 28,
            mass: 0.5
          }}
          style={{
            zIndex: activeSlideIndex === 3 || cardProgress > 0 ? 20 : 5,
            perspective: '1200px',
            transformOrigin: 'top center',
            boxShadow: cardProgress > 0 && cardProgress < 1 ? '0 -25px 60px rgba(0, 0, 0, 0.35)' : 'none',
            overflow: activeSlideIndex === 3 && cardProgress >= 0.95 ? 'auto' : 'hidden'
          }}
        >
          {(activeSlideIndex === 3 || activeSlideIndex === 2 || cardProgress > 0) && (
            <Packages setCursorVariant={setCursorVariant} />
          )}
        </motion.div>
        
        {/* Slide 4: Footer */}
        <div 
          className={`slide-container ${activeSlideIndex === 4 ? 'active' : ''}`}
          ref={el => slideRefs.current['footer'] = el}
        >
          {activeSlideIndex === 4 && <Footer setCursorVariant={setCursorVariant} />}
        </div>
      </main>
      
      <ChatWidget 
        setCursorVariant={setCursorVariant} 
        activeSlideIndex={activeSlideIndex} 
        chatOpen={chatOpen}
        setChatOpen={setChatOpen}
        hasInteractedChat={hasInteractedChat}
        setHasInteractedChat={setHasInteractedChat}
        isSpawningTrail={isSpawningTrail}
      />
    </div>
  )
}

export default App
