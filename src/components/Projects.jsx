import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence, useMotionValueEvent } from 'framer-motion';
import './Projects.css';

const projectsList = [
  { id: 1, title: 'Qiana Mineral Water', category: 'Social Media Strategy', img: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
  { id: 2, title: 'Dunia Games', category: 'Creative Production', img: 'https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
  { id: 3, title: 'Nunothemes', category: 'UI/UX Design & Development', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
  { id: 4, title: 'Yellow Truck Coffee', category: 'Product Branding Photoshoot', img: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
  { id: 5, title: 'Aether Studio', category: 'Immersive Web Development', img: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
  { id: 6, title: 'Vortex Dynamics', category: '3D Art Direction & Motion', img: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' }
];

const Projects = ({ setCursorVariant }) => {
  const [viewMode, setViewMode] = useState('spiral'); // 'spiral' or 'list'
  const [hoveredProject, setHoveredProject] = useState(null);
  const [activeSpiralIndex, setActiveSpiralIndex] = useState(0);
  const containerRef = useRef(null);

  // Responsive Width for Spiral calculations
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const radius = isMobile ? 180 : windowWidth < 1024 ? 280 : 400;

  // Mouse positioning for classic list preview (smooth follow)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Scroll Progress for the 3D spiral track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Calculate the front-most card dynamically based on scroll rotation
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (viewMode !== 'spiral') return;

    let maxZ = -Infinity;
    let activeIdx = 0;

    projectsList.forEach((project, index) => {
      const total = projectsList.length;
      const baseAngle = (index / total) * Math.PI * 2;
      const currentAngle = baseAngle + latest * Math.PI * 3.5;
      
      const zValue = Math.cos(currentAngle);
      if (zValue > maxZ) {
        maxZ = zValue;
        activeIdx = index;
      }
    });

    setActiveSpiralIndex(activeIdx);
  });

  // Sync active spiral project to hoveredProject state for the typography overlay
  useEffect(() => {
    if (viewMode === 'spiral') {
      setHoveredProject(projectsList[activeSpiralIndex]);
    } else {
      setHoveredProject(null);
    }
  }, [activeSpiralIndex, viewMode]);

  // Define transforms unconditionally at the top level of the component
  const projectTransforms = projectsList.map((project, index) => {
    const total = projectsList.length;
    const baseAngle = (index / total) * Math.PI * 2;
    const angle = useTransform(scrollYProgress, [0, 1], [baseAngle, baseAngle + Math.PI * 3.5]);

    const x = useTransform(angle, (a) => Math.sin(a) * radius);
    const z = useTransform(angle, (a) => Math.cos(a) * radius);
    
    const rotateY = useTransform(angle, (a) => -(a * 180) / Math.PI);
    
    const y = useTransform(angle, (a) => {
      let diffAngle = a % (Math.PI * 2);
      if (diffAngle < 0) diffAngle += Math.PI * 2;
      if (diffAngle > Math.PI) {
        diffAngle -= Math.PI * 2;
      }
      
      const pitch = isMobile ? 80 : 130;
      const pitchInAngle = pitch / ((Math.PI * 2) / total);
      return diffAngle * pitchInAngle;
    });

    const opacity = useTransform(
      z,
      [-radius, -radius * 0.5, 0, radius],
      [0, 0.35, 0.7, 1]
    );

    const scale = useTransform(z, [-radius, radius], [0.65, 1.25]);

    return { x, y, z, rotateY, scale, opacity };
  });

  // Render project card for the 3D Spiral helix view using pre-computed transforms
  const renderSpiralCard = (project, index) => {
    const { x, y, z, rotateY, scale, opacity } = projectTransforms[index];
    const isActive = index === activeSpiralIndex;

    return (
      <motion.div
        key={project.id}
        className="spiral-card-wrapper"
        style={{
          x,
          y,
          z,
          rotateY,
          scale,
          opacity,
          pointerEvents: isActive ? 'auto' : 'none'
        }}
        onMouseEnter={() => {
          if (isActive) setCursorVariant('project');
        }}
        onMouseLeave={() => {
          setCursorVariant('default');
        }}
      >
        <div className={`spiral-card-inner ${isActive ? 'active' : ''}`}>
          <div className="spiral-image-wrapper">
            <img src={project.img} alt={project.title} />
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <section className="projects-container dark-section">
      {viewMode === 'spiral' ? (
        /* Spiral View: Sticky Container for Scroll Pinning */
        <div className="projects-scroll-track" ref={containerRef}>
          <div className="projects-sticky-wrapper">
            <div className="projects-interface-overlay">
              <div className="projects-section-header">
                <div className="header-meta">
                  <span className="meta-eyebrow">PORTFOLIO</span>
                  <h2 className="projects-title-main">Karya <em>Terpilih</em></h2>
                </div>
                {/* Floating View Toggle */}
                <div className="view-toggle-container">
                  <button 
                    className={`toggle-btn ${viewMode === 'spiral' ? 'active' : ''}`}
                    onClick={() => setViewMode('spiral')}
                  >
                    3D SPIRAL
                  </button>
                  <button 
                    className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    CLASSIC LIST
                  </button>
                  <div className={`toggle-indicator ${viewMode}`} />
                </div>
              </div>

              {/* Title overlay in the center */}
              <div className="spiral-title-overlay">
                <AnimatePresence mode="wait">
                  {hoveredProject && (
                    <motion.div
                      key={hoveredProject.id}
                      initial={{ opacity: 0, y: 40, rotateX: 10, skewY: 3 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0, skewY: 0 }}
                      exit={{ opacity: 0, y: -40, rotateX: -10, skewY: -3 }}
                      transition={{ duration: 0.35, ease: [0.215, 0.61, 0.355, 1] }}
                      className="spiral-overlay-content"
                    >
                      <span className="overlay-category">{hoveredProject.category}</span>
                      <h2 className="overlay-title">{hoveredProject.title}</h2>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* 3D Helix Scene */}
            <div className="spiral-viewport">
              <div className="spiral-scene">
                {projectsList.map((project, idx) => renderSpiralCard(project, idx))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Classic List View: Flows naturally */
        <div className="projects-list-wrapper">
          <div className="projects-section-header no-sticky">
            <div className="header-meta">
              <span className="meta-eyebrow">PORTFOLIO</span>
              <h2 className="projects-title-main">Karya <em>Terpilih</em></h2>
            </div>
            {/* View Toggle */}
            <div className="view-toggle-container">
              <button 
                className={`toggle-btn ${viewMode === 'spiral' ? 'active' : ''}`}
                onClick={() => setViewMode('spiral')}
              >
                3D SPIRAL
              </button>
              <button 
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                CLASSIC LIST
              </button>
              <div className={`toggle-indicator ${viewMode}`} />
            </div>
          </div>

          <div className="classic-list-content">
            {projectsList.map((project, index) => (
              <div
                key={project.id}
                className="list-row"
                onMouseEnter={() => {
                  setHoveredProject(project);
                  setCursorVariant('project');
                }}
                onMouseLeave={() => {
                  setHoveredProject(null);
                  setCursorVariant('default');
                }}
              >
                <div className="list-row-index">0{index + 1}</div>
                <div className="list-row-details">
                  <h2 className="list-row-title">{project.title}</h2>
                  <span className="list-row-category">{project.category}</span>
                </div>
                <div className="list-row-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Mouse follow image preview */}
          <AnimatePresence>
            {hoveredProject && (
              <motion.div
                className="list-hover-preview"
                initial={{ scale: 0.6, opacity: 0, rotate: -4 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.6, opacity: 0, rotate: 4 }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                style={{
                  position: 'fixed',
                  left: cursorX,
                  top: cursorY,
                  x: '-50%',
                  y: '-50%',
                  pointerEvents: 'none',
                  zIndex: 999
                }}
              >
                <div className="preview-image-container">
                  <img src={hoveredProject.img} alt={hoveredProject.title} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
};

export default Projects;

