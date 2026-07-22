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
  const [appLoaded, setAppLoaded] = useState(false)
  
  // Refs for tracking scroll bounds
  const slideRefs = useRef({});

  const triggerTransition = (newIndex) => {
    if (isTransitioning || newIndex === activeSlideIndex) return;
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
      
      const now = Date.now();
      // Debounce wheel events slightly to prevent multiple rapid triggers
      if (now - lastWheelTime < 800) return;
      
      const activeId = SLIDES[activeSlideIndex];
      const container = slideRefs.current[activeId];
      
      if (e.deltaY > 0) {
        // Scrolling DOWN
        if (container) {
          const isAtBottom = Math.ceil(container.scrollHeight - container.scrollTop) <= container.clientHeight + 5;
          if (!isAtBottom) return; // Allow normal internal scroll
        }
        
        if (activeSlideIndex < SLIDES.length - 1) {
          lastWheelTime = now;
          triggerTransition(activeSlideIndex + 1);
        }
      } else if (e.deltaY < 0) {
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
  }, [activeSlideIndex, isTransitioning, appLoaded]);
  
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

  const handleOpenChat = () => {
    setHasInteractedChat(true);
    setChatOpen(true);
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
        
        {/* Slide 2: Services */}
        <div 
          className={`slide-container ${activeSlideIndex === 2 ? 'active' : ''}`}
          ref={el => slideRefs.current['services'] = el}
        >
          {activeSlideIndex === 2 && <Services setCursorVariant={setCursorVariant} />}
        </div>
        
        {/* Slide 3: Packages */}
        <div 
          className={`slide-container ${activeSlideIndex === 3 ? 'active' : ''}`}
          ref={el => slideRefs.current['packages'] = el}
        >
          {activeSlideIndex === 3 && <Packages setCursorVariant={setCursorVariant} />}
        </div>
        
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
      />
    </div>
  )
}

export default App
