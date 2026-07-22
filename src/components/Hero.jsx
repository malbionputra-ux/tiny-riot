import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AbstractWaves from './AbstractWaves';
import './Hero.css';

/* ═══════════════════════════════
   Hero Component
═══════════════════════════════ */
const Hero = ({ setCursorVariant, onOpenChat, chatOpen, hasInteractedChat }) => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const update = () => {
      const opt = { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      setTimeStr(new Date().toLocaleTimeString('id-ID', opt) + ' GMT+7');
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const textVariants = {
    hidden:  { y: '110%', opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section className="hero dark-section">
      <AbstractWaves />
      {/* Vignette overlay */}
      <div className="hero-overlay" />

      {/* Text content */}
      <motion.div
        className="hero-content"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.18, delayChildren: 0.2 } } }}
      >
        <div className="line-wrapper">
          <motion.h1 variants={textVariants} className="hero-title"
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            We design <em>loud</em>
          </motion.h1>
        </div>
        <div className="line-wrapper">
          <motion.h1 variants={textVariants} className="hero-title"
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            digital <em>experiences.</em>
          </motion.h1>
        </div>
        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.9 }}
          onMouseEnter={() => setCursorVariant('hover')}
          onMouseLeave={() => setCursorVariant('default')}
        >
          Kami membantu brand membangun reputasi digital yang berani dan lantang melalui kreativitas tanpa batas, teknologi mutakhir, serta strategi yang tajam.
        </motion.p>
        
        {/* LET'S TALK Button directly between subtitle and scroll indicator */}
        {!chatOpen && !hasInteractedChat && (
          <motion.button 
            layoutId="talk-pill-btn"
            className="hero-center-talk-btn"
            onClick={onOpenChat}
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 180, damping: 22 }}
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            <img src="/assets/new-logo-transparent.png" alt="Logo" className="custom-toggle-logo" />
            <span className="toggle-text">LET'S TALK</span>
          </motion.button>
        )}
        
        <motion.div 
          className="hero-scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <span className="scroll-text">SCROLL</span>
          <div className="scroll-line"></div>
        </motion.div>
      </motion.div>

      {/* Meta bar */}
      <div className="hero-metadata">
        <div className="meta-col">
          <span className="meta-label">OUR SERVICES</span>
          <span className="meta-value">CREATIVE / DEVELOPMENT / PRODUCTION</span>
        </div>
        <div className="meta-col">
          <span className="meta-label">HQ LOCAL TIME</span>
          <span className="meta-value">{timeStr || '17:00:00 GMT+7'}</span>
        </div>
        <div className="meta-col">
          <span className="meta-label">HQ LOCATIONS</span>
          <span className="meta-value">JAKARTA &amp; BANDUNG, INDONESIA</span>
        </div>
        <div className="meta-col">
          <span className="meta-label">AGENCY STATUS</span>
          <span className="meta-value highlight-status">OPEN FOR PROJECTS</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
