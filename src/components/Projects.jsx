import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Projects.css';

const mainLeftColumns = [
  // Col 1
  [
    { id: 1, title: 'FOAM TALENT 2021', desc: 'A digital exhibition celebrating emotional browsing', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80', height: '320px' },
    { id: 5, title: 'MOOOI', desc: 'Multi-sensory flagship store', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80', height: '560px' }
  ],
  // Col 2
  [
    { id: 2, title: 'POWERHOUSE COMPANY', desc: 'Giving meaning to space', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80', height: '240px' },
    { id: 6, title: 'MOLLIE', desc: 'Grow your way', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80', height: '640px' }
  ]
];

const mainRightColumns = [
  // Col 3
  [
    { id: 3, title: 'FOAM TALENT 2020', desc: 'An exhibition without walls', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80', height: '320px' },
    { id: 7, title: 'ABEL VITA ODOR', desc: 'Sparking all senses but smell', img: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80', height: '560px' }
  ],
  // Col 4
  [
    { id: 4, title: 'STELLAR DEVELOPMENT', desc: 'Developing destinations', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80', height: '240px' },
    { id: 8, title: 'VITRA', desc: 'Office chair finder', img: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=1000&q=80', height: '640px' }
  ]
];

// 16 Curated Projects for the Expanded Gallery
const expandedColumns = [
  // Col 1
  [
    { id: 101, title: 'FOAM TALENT 2021', desc: 'A digital exhibition celebrating emotional browsing', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80', height: '340px' },
    { id: 102, title: 'MOOOI', desc: 'Multi-sensory flagship store', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80', height: '540px' },
    { id: 103, title: 'RIMOWA', desc: "Crafted for life's journeys", img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80', height: '380px' },
    { id: 104, title: 'POLSTAR', desc: 'Pure progressive performance', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80', height: '480px' }
  ],
  // Col 2
  [
    { id: 105, title: 'POWERHOUSE COMPANY', desc: 'Giving meaning to space', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80', height: '260px' },
    { id: 106, title: 'MOLLIE', desc: 'Grow your way', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80', height: '620px' },
    { id: 107, title: 'B&O PLAY', desc: 'Sound defined by design & heritage', img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80', height: '340px' },
    { id: 108, title: 'ACNE STUDIOS', desc: 'High fashion digital store', img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80', height: '520px' }
  ],
  // Col 3
  [
    { id: 109, title: 'FOAM TALENT 2020', desc: 'An exhibition without walls', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80', height: '340px' },
    { id: 110, title: 'ABEL VITA ODOR', desc: 'Sparking all senses but smell', img: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80', height: '560px' },
    { id: 111, title: 'AESOP', desc: 'Formulations for skin, hair & body', img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80', height: '400px' },
    { id: 112, title: 'HAY DESIGN', desc: 'Everyday objects by international designers', img: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1000&q=80', height: '460px' }
  ],
  // Col 4
  [
    { id: 113, title: 'STELLAR DEVELOPMENT', desc: 'Developing destinations', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80', height: '260px' },
    { id: 114, title: 'VITRA', desc: 'Office chair finder & spatial experience', img: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=1000&q=80', height: '620px' },
    { id: 115, title: 'KINFOLK', desc: 'Slow living & conscious culture', img: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1000&q=80', height: '360px' },
    { id: 116, title: 'BYREDO', desc: 'Emotions transformed into scent', img: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=80', height: '500px' }
  ]
];

const Projects = ({ setCursorVariant }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleOpenGallery = () => {
    setIsExpanded(true);
  };

  const handleCloseGallery = () => {
    setIsExpanded(false);
  };

  return (
    <section className="projects-container light-section full-bleed-cases" id="projects">
      {/* ── Standard Page Cases Grid ── */}
      <div className="bia-cases-wrapper">
        {/* Left 2 Columns */}
        <div className="bia-cases-half">
          {mainLeftColumns.map((col, cIdx) => (
            <div key={cIdx} className="bia-grid-column">
              {col.map((item, itemIdx) => {
                const globalIndex = cIdx * 2 + itemIdx;
                return (
                  <motion.div
                    key={item.id}
                    className="bia-case-card"
                    style={{ height: item.height }}
                    initial={{ opacity: 0, y: 40, scale: 0.97 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.08 }}
                    transition={{ duration: 0.8, delay: globalIndex * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    onMouseEnter={() => setCursorVariant && setCursorVariant('project')}
                    onMouseLeave={() => setCursorVariant && setCursorVariant('default')}
                  >
                    <motion.img 
                      src={item.img} 
                      alt={item.title} 
                      className="case-img"
                      initial={{ scale: 1.25, opacity: 0.4 }}
                      whileInView={{ scale: 1.0, opacity: 1 }}
                      viewport={{ once: true, amount: 0.08 }}
                      transition={{ duration: 1.1, delay: globalIndex * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    />
                    <div className="case-shadow-gradient" />
                    <motion.div 
                      className="case-info-tag"
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: globalIndex * 0.1 + 0.15, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p className="case-caption-text">
                        <span className="case-title">{item.title}</span>
                        <span className="case-dot"> · </span>
                        <span className="case-desc">{item.desc}</span>
                      </p>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Center Seam: Vertical Standing SEE MORE */}
        <div className="bia-center-seam">
          <div className="bia-see-more-sticky">
            <button 
              className="see-more-vertical-btn" 
              type="button"
              onClick={handleOpenGallery}
              onMouseEnter={() => setCursorVariant && setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant && setCursorVariant('default')}
            >
              SEE MORE
            </button>
          </div>
        </div>

        {/* Right 2 Columns */}
        <div className="bia-cases-half">
          {mainRightColumns.map((col, cIdx) => (
            <div key={cIdx} className="bia-grid-column">
              {col.map((item, itemIdx) => {
                const globalIndex = (cIdx + 2) * 2 + itemIdx;
                return (
                  <motion.div
                    key={item.id}
                    className="bia-case-card"
                    style={{ height: item.height }}
                    initial={{ opacity: 0, y: 40, scale: 0.97 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.08 }}
                    transition={{ duration: 0.8, delay: globalIndex * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    onMouseEnter={() => setCursorVariant && setCursorVariant('project')}
                    onMouseLeave={() => setCursorVariant && setCursorVariant('default')}
                  >
                    <motion.img 
                      src={item.img} 
                      alt={item.title} 
                      className="case-img"
                      initial={{ scale: 1.25, opacity: 0.4 }}
                      whileInView={{ scale: 1.0, opacity: 1 }}
                      viewport={{ once: true, amount: 0.08 }}
                      transition={{ duration: 1.1, delay: globalIndex * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    />
                    <div className="case-shadow-gradient" />
                    <motion.div 
                      className="case-info-tag"
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: globalIndex * 0.1 + 0.15, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p className="case-caption-text">
                        <span className="case-title">{item.title}</span>
                        <span className="case-dot"> · </span>
                        <span className="case-desc">{item.desc}</span>
                      </p>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ── Split-Door Opening & Expanded Gallery Modal ── */}
      <AnimatePresence>
        {isExpanded && (
          <div 
            className="expanded-gallery-overlay"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {/* 1. Left Door Panel (Carries Left Images & slides to the LEFT) */}
            <motion.div 
              className="door-panel door-panel-left"
              initial={{ x: '0%' }}
              animate={{ x: '-100%' }}
              exit={{ x: '0%' }}
              transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
            >
              <div className="door-cases-content">
                {mainLeftColumns.map((col, cIdx) => (
                  <div key={cIdx} className="bia-grid-column">
                    {col.map((item) => (
                      <div key={item.id} className="bia-case-card" style={{ height: item.height }}>
                        <img src={item.img} alt={item.title} className="case-img" />
                        <div className="case-shadow-gradient" />
                        <div className="case-info-tag">
                          <p className="case-caption-text">
                            <span className="case-title">{item.title}</span>
                            <span className="case-dot"> · </span>
                            <span className="case-desc">{item.desc}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="door-seam-glow-left" />
            </motion.div>

            {/* 2. Right Door Panel (Carries Right Images & slides to the RIGHT) */}
            <motion.div 
              className="door-panel door-panel-right"
              initial={{ x: '0%' }}
              animate={{ x: '100%' }}
              exit={{ x: '0%' }}
              transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
            >
              <div className="door-cases-content">
                {mainRightColumns.map((col, cIdx) => (
                  <div key={cIdx} className="bia-grid-column">
                    {col.map((item) => (
                      <div key={item.id} className="bia-case-card" style={{ height: item.height }}>
                        <img src={item.img} alt={item.title} className="case-img" />
                        <div className="case-shadow-gradient" />
                        <div className="case-info-tag">
                          <p className="case-caption-text">
                            <span className="case-title">{item.title}</span>
                            <span className="case-dot"> · </span>
                            <span className="case-desc">{item.desc}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="door-seam-glow-right" />
            </motion.div>

            {/* 3. Expanded Gallery Content (Revealed inside door split) */}
            <motion.div 
              className="expanded-gallery-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              {/* Header Bar */}
              <div className="expanded-gallery-header">
                <div className="gallery-header-info">
                  <span className="gallery-meta-tag">PORTFOLIO // 16 FEATURED CASES</span>
                  <h2 className="gallery-header-title">Selected Works</h2>
                </div>
                <button 
                  className="gallery-close-btn"
                  onClick={handleCloseGallery}
                  onMouseEnter={() => setCursorVariant && setCursorVariant('hover')}
                  onMouseLeave={() => setCursorVariant && setCursorVariant('default')}
                >
                  <span className="close-text">CLOSE</span>
                  <span className="close-icon">✕</span>
                </button>
              </div>

              {/* 4-Column Grid with Ultra-Modern 3D Blur-Up Staggered Entrance Animations */}
              <div className="expanded-grid-wrapper">
                {expandedColumns.map((col, colIdx) => (
                  <div key={colIdx} className="bia-grid-column">
                    {col.map((item, itemIdx) => {
                      const itemDelay = 0.38 + colIdx * 0.1 + itemIdx * 0.08;
                      return (
                        <motion.div
                          key={item.id}
                          className="bia-case-card expanded-case-card"
                          style={{ height: item.height }}
                          initial={{ 
                            opacity: 0, 
                            y: 150, 
                            scale: 0.86, 
                            rotateX: 12,
                            filter: 'blur(10px)' 
                          }}
                          animate={{ 
                            opacity: 1, 
                            y: 0, 
                            scale: 1, 
                            rotateX: 0,
                            filter: 'blur(0px)' 
                          }}
                          transition={{ 
                            duration: 1.15, 
                            delay: itemDelay, 
                            ease: [0.16, 1, 0.3, 1] 
                          }}
                          onMouseEnter={() => setCursorVariant && setCursorVariant('project')}
                          onMouseLeave={() => setCursorVariant && setCursorVariant('default')}
                        >
                          <motion.img 
                            src={item.img} 
                            alt={item.title} 
                            className="case-img"
                            initial={{ scale: 1.35, opacity: 0.2 }}
                            animate={{ scale: 1.0, opacity: 1 }}
                            transition={{ 
                              duration: 1.35, 
                              delay: itemDelay, 
                              ease: [0.16, 1, 0.3, 1] 
                            }}
                          />
                          <div className="case-shadow-gradient" />
                          <motion.div 
                            className="case-info-tag"
                            initial={{ y: 25, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ 
                              duration: 0.7, 
                              delay: itemDelay + 0.15, 
                              ease: [0.16, 1, 0.3, 1] 
                            }}
                          >
                            <p className="case-caption-text">
                              <span className="case-title">{item.title}</span>
                              <span className="case-dot"> · </span>
                              <span className="case-desc">{item.desc}</span>
                            </p>
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;

