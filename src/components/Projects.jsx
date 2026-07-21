import React, { useState, useRef, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
  AnimatePresence,
} from 'framer-motion';
import './Projects.css';

const projectsList = [
  { id: 1, title: 'Qiana Mineral Water',  category: 'Social Media Strategy',    year: '2024',
    img: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
  { id: 2, title: 'Dunia Games',           category: 'Creative Production',       year: '2024',
    img: 'https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
  { id: 3, title: 'Nunothemes',            category: 'UI/UX Design & Dev',        year: '2023',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
  { id: 4, title: 'Yellow Truck Coffee',   category: 'Brand Photoshoot',          year: '2023',
    img: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
  { id: 5, title: 'Aether Studio',         category: 'Immersive Web',             year: '2024',
    img: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
  { id: 6, title: 'Vortex Dynamics',       category: '3D Art & Motion',           year: '2024',
    img: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
];

/* ─────────────────────────────────────────────
   Circular 3D Carousel — each card on a circle
   As scroll progresses, the circle rotates so
   each card comes to the front position.
────────────────────────────────────────────── */
const TOTAL   = projectsList.length;
const ROTATIONS = 1; // how many full rotations over the whole scroll

const Projects = ({ setCursorVariant }) => {
  const [viewMode,   setViewMode]   = useState('spiral');
  const [activeIdx,  setActiveIdx]  = useState(0);
  const [winW,       setWinW]       = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const containerRef = useRef(null);

  /* ── Window width for responsive radius ── */
  useEffect(() => {
    const onResize = () => setWinW(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobile = winW < 768;
  const radius   = isMobile ? 200 : winW < 1100 ? 320 : 500;

  /* ── Scroll progress ── */
  const { scrollYProgress } = useScroll({
    target:  containerRef,
    offset: ['start start', 'end end'],
  });

  /* ── Mouse parallax — tilts the whole scene subtly ── */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const onMove = (e) => {
      mouseX.set((e.clientX / window.innerWidth  - 0.5) * 2);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mouseX, mouseY]);

  const sceneRotY = useSpring(
    useTransform(mouseX, [-1, 1], [-9, 9]),
    { stiffness: 50, damping: 22 }
  );
  const sceneRotX = useSpring(
    useTransform(mouseY, [-1, 1], [5, -5]),
    { stiffness: 50, damping: 22 }
  );

  /* ── Track which card is frontmost ── */
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    let maxZ = -Infinity, frontIdx = 0;
    projectsList.forEach((_, i) => {
      const base  = (i / TOTAL) * Math.PI * 2;
      const angle = base + latest * Math.PI * 2 * ROTATIONS;
      const z     = Math.cos(angle);
      if (z > maxZ) { maxZ = z; frontIdx = i; }
    });
    setActiveIdx(frontIdx);
  });

  /* ────────────────────────────────────────────────────────────
     Per-card transforms — hooks called unconditionally at top
     level; projectsList.length is constant (6) so hook order
     never changes between renders.
  ──────────────────────────────────────────────────────────── */
  const cardTransforms = projectsList.map((_, i) => {
    const base  = (i / TOTAL) * Math.PI * 2;
    const angle = useTransform(                                    // eslint-disable-line
      scrollYProgress,
      [0, 1],
      [base, base + Math.PI * 2 * ROTATIONS]
    );
    const x       = useTransform(angle, (a) => Math.sin(a) * radius);
    const z       = useTransform(angle, (a) => Math.cos(a) * radius);
    const rotateY = useTransform(angle, (a) => -(a * 180) / Math.PI);
    const scale   = useTransform(z, [-radius, radius], [0.68, 1.12]);
    const opacity = useTransform(
      z,
      [-radius, -radius * 0.4, 0, radius * 0.4, radius],
      [0,       0.22,          0.55, 0.8,         1]
    );
    return { x, z, rotateY, scale, opacity };
  });

  /* ── Classic list mouse-follow preview ── */
  const listMouseX = useMotionValue(0);
  const listMouseY = useMotionValue(0);
  const [listHovered, setListHovered] = useState(null);
  const previewX = useSpring(listMouseX, { damping: 25, stiffness: 200 });
  const previewY = useSpring(listMouseY, { damping: 25, stiffness: 200 });

  useEffect(() => {
    const onMove = (e) => { listMouseX.set(e.clientX); listMouseY.set(e.clientY); };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [listMouseX, listMouseY]);

  /* ──────────────────────────────────────────────────── RENDER ── */
  return (
    <section className="projects-container dark-section" id="projects">

      {/* ═══════════════ 3D CAROUSEL ═══════════════ */}
      {viewMode === 'spiral' ? (
        <div className="projects-scroll-track" ref={containerRef}>
          <div className="projects-sticky-wrapper">

            {/* UI overlay */}
            <div className="projects-interface-overlay">
              <div className="projects-section-header">
                <div className="header-meta">
                  <span className="meta-eyebrow">PORTFOLIO</span>
                  <h2 className="projects-title-main">Karya <em>Terpilih</em></h2>
                </div>
                <div className="view-toggle-container">
                  <button
                    className={`toggle-btn ${viewMode === 'spiral' ? 'active' : ''}`}
                    onClick={() => setViewMode('spiral')}
                  >3D CAROUSEL</button>
                  <button
                    className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >LIST</button>
                  <div className={`toggle-indicator ${viewMode}`} />
                </div>
              </div>

              {/* Active card title — bottom center */}
              <div className="spiral-title-overlay">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIdx}
                    className="spiral-overlay-content"
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0  }}
                    exit={  { opacity: 0, y: -22 }}
                    transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="overlay-category">
                      → {projectsList[activeIdx].category} · {projectsList[activeIdx].year}
                    </span>
                    <h2 className="overlay-title">{projectsList[activeIdx].title}</h2>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* ── 3D Perspective scene ── */}
            <div className="spiral-viewport">
              <motion.div
                className="spiral-scene"
                style={{ rotateY: sceneRotY, rotateX: sceneRotX }}
              >
                {projectsList.map((project, i) => {
                  const { x, z, rotateY, scale, opacity } = cardTransforms[i];
                  const isActive = i === activeIdx;

                  return (
                    <motion.div
                      key={project.id}
                      className="carousel-card-wrap"
                      style={{
                        x,
                        z,
                        rotateY,
                        scale,
                        opacity,
                        pointerEvents: isActive ? 'auto' : 'none',
                      }}
                      onMouseEnter={() => { if (isActive) setCursorVariant('hover'); }}
                      onMouseLeave={() => setCursorVariant('default')}
                    >
                      <div className={`carousel-card-inner ${isActive ? 'is-active' : ''}`}>
                        {/* Image */}
                        <div className="carousel-img-wrap">
                          <img src={project.img} alt={project.title} />
                        </div>

                        {/* Overlay text (visible on active) */}
                        <motion.div
                          className="carousel-overlay"
                          animate={{ opacity: isActive ? 1 : 0.4 }}
                          transition={{ duration: 0.5 }}
                        >
                          <span className="carousel-meta">
                            → {project.category} · {project.year}
                          </span>
                          <h3 className="carousel-title">{project.title}</h3>
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* Scroll hint */}
            <div className="scroll-hint">
              <span>SCROLL TO EXPLORE</span>
              <div className="scroll-hint-line" />
            </div>

          </div>
        </div>

      ) : (
        /* ═══════════════ CLASSIC LIST ═══════════════ */
        <div className="projects-list-wrapper">
          <div className="projects-section-header no-sticky">
            <div className="header-meta">
              <span className="meta-eyebrow">PORTFOLIO</span>
              <h2 className="projects-title-main">Karya <em>Terpilih</em></h2>
            </div>
            <div className="view-toggle-container">
              <button
                className={`toggle-btn ${viewMode === 'spiral' ? 'active' : ''}`}
                onClick={() => setViewMode('spiral')}
              >3D CAROUSEL</button>
              <button
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >LIST</button>
              <div className={`toggle-indicator ${viewMode}`} />
            </div>
          </div>

          <div className="classic-list-content">
            {projectsList.map((project, index) => (
              <div
                key={project.id}
                className="list-row"
                onMouseEnter={() => { setListHovered(project); setCursorVariant('project'); }}
                onMouseLeave={() => { setListHovered(null); setCursorVariant('default'); }}
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
            {listHovered && (
              <motion.div
                className="list-hover-preview"
                initial={{ scale: 0.6, opacity: 0, rotate: -4 }}
                animate={{ scale: 1,   opacity: 1, rotate:  0 }}
                exit={  { scale: 0.6, opacity: 0, rotate:  4 }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                style={{
                  position: 'fixed',
                  left: previewX,
                  top:  previewY,
                  x: '-50%',
                  y: '-50%',
                  pointerEvents: 'none',
                  zIndex: 999,
                }}
              >
                <div className="preview-image-container">
                  <img src={listHovered.img} alt={listHovered.title} />
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
