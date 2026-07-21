import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import './Projects.css';

const projectsList = [
  {
    id: 1,
    title: 'Qiana Mineral Water',
    category: 'Social Media Strategy',
    year: '2024',
    img: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 2,
    title: 'Dunia Games',
    category: 'Creative Production',
    year: '2024',
    img: 'https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 3,
    title: 'Nunothemes',
    category: 'UI/UX Design & Dev',
    year: '2023',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 4,
    title: 'Yellow Truck Coffee',
    category: 'Brand Photoshoot',
    year: '2023',
    img: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 5,
    title: 'Aether Studio',
    category: 'Immersive Web',
    year: '2024',
    img: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 6,
    title: 'Vortex Dynamics',
    category: '3D Art & Motion',
    year: '2024',
    img: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  },
];

/* ── Single project card with 3D tilt on mouse move ── */
const ProjectCard = ({ project, index, setCursorVariant }) => {
  const cardRef = useRef(null);
  const rotateX = useSpring(0, { stiffness: 150, damping: 20, mass: 0.5 });
  const rotateY = useSpring(0, { stiffness: 150, damping: 20, mass: 0.5 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);   // -1 to 1
    const dy = (e.clientY - cy) / (rect.height / 2);  // -1 to 1
    rotateY.set(dx * 10);
    rotateX.set(-dy * 8);
  }, [rotateX, rotateY]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    setHovered(false);
    setCursorVariant('default');
  }, [rotateX, rotateY, setCursorVariant]);

  // Stagger: even = left col, odd = right col, vertical offset for odd
  const isRight = index % 2 === 1;
  const staggerDelay = index * 0.1;

  return (
    <motion.div
      className={`at-card-wrap ${isRight ? 'at-card-right' : 'at-card-left'}`}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: staggerDelay }}
    >
      <motion.div
        ref={cardRef}
        className="at-card"
        style={{ rotateX, rotateY, transformPerspective: 900 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => { setHovered(true); setCursorVariant('hover'); }}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.015 }}
        transition={{ scale: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
      >
        {/* Image */}
        <div className="at-card-image">
          <motion.img
            src={project.img}
            alt={project.title}
            animate={{ scale: hovered ? 1.06 : 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          />
          {/* Hover shimmer overlay */}
          <div className={`at-card-shimmer ${hovered ? 'visible' : ''}`} />
        </div>

        {/* Text overlay at bottom-left */}
        <div className="at-card-overlay">
          <span className="at-card-meta">→ {project.category} · {project.year}</span>
          <h3 className="at-card-title">{project.title}</h3>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── Classic list hover preview (unchanged) ── */
const Projects = ({ setCursorVariant }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [hoveredProject, setHoveredProject] = useState(null);

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

  return (
    <section className="projects-container dark-section" id="projects">

      {viewMode === 'grid' ? (
        <div className="at-grid-wrapper">
          {/* Header */}
          <div className="projects-section-header">
            <div className="header-meta">
              <span className="meta-eyebrow">PORTFOLIO</span>
              <h2 className="projects-title-main">Karya <em>Terpilih</em></h2>
            </div>
            <div className="view-toggle-container">
              <button
                className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >3D GRID</button>
              <button
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >CLASSIC LIST</button>
              <div className={`toggle-indicator ${viewMode}`} />
            </div>
          </div>

          {/* Staggered 2-column grid */}
          <div className="at-grid">
            {projectsList.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                setCursorVariant={setCursorVariant}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Classic List View */
        <div className="projects-list-wrapper">
          <div className="projects-section-header no-sticky">
            <div className="header-meta">
              <span className="meta-eyebrow">PORTFOLIO</span>
              <h2 className="projects-title-main">Karya <em>Terpilih</em></h2>
            </div>
            <div className="view-toggle-container">
              <button
                className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >3D GRID</button>
              <button
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >CLASSIC LIST</button>
              <div className={`toggle-indicator ${viewMode}`} />
            </div>
          </div>

          <div className="classic-list-content">
            {projectsList.map((project, index) => (
              <div
                key={project.id}
                className="list-row"
                onMouseEnter={() => { setHoveredProject(project); setCursorVariant('project'); }}
                onMouseLeave={() => { setHoveredProject(null); setCursorVariant('default'); }}
              >
                <div className="list-row-index">0{index + 1}</div>
                <div className="list-row-details">
                  <h2 className="list-row-title">{project.title}</h2>
                  <span className="list-row-category">{project.category}</span>
                </div>
                <div className="list-row-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          <AnimatePresence>
            {hoveredProject && (
              <motion.div
                className="list-hover-preview"
                initial={{ scale: 0.6, opacity: 0, rotate: -4 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.6, opacity: 0, rotate: 4 }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                style={{ position: 'fixed', left: cursorX, top: cursorY, x: '-50%', y: '-50%', pointerEvents: 'none', zIndex: 999 }}
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
