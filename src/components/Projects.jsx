import React, { useState, useRef, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  AnimatePresence,
} from 'framer-motion';
import './Projects.css';

const projectsList = [
  { id: 1, title: 'Qiana Mineral Water', category: 'Social Media Strategy', year: '2024',
    img: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
  { id: 2, title: 'Dunia Games', category: 'Creative Production', year: '2024',
    img: 'https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
  { id: 3, title: 'Nunothemes', category: 'UI/UX Design & Dev', year: '2023',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
  { id: 4, title: 'Yellow Truck Coffee', category: 'Brand Photoshoot', year: '2023',
    img: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
  { id: 5, title: 'Aether Studio', category: 'Immersive Web', year: '2024',
    img: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
  { id: 6, title: 'Vortex Dynamics', category: '3D Art & Motion', year: '2024',
    img: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
];

/* ─────────────────────────────────────────────────────────
   3D scatter positions — curated so they look great
   tx/ty in px (from scene center), tz in px, ry/rx in deg
──────────────────────────────────────────────────────── */
const SCATTER = [
  { tx: -580, ty:  -60, tz: -180, ry:  28, rx: -3 }, // far left
  { tx: -240, ty:   80, tz:   60, ry:  12, rx: -1 }, // left-center
  { tx:   20, ty:  -40, tz:  260, ry:   0, rx:  0 }, // center front ★
  { tx:  290, ty:   90, tz:   60, ry: -14, rx: -1 }, // right-center
  { tx:  590, ty:  -50, tz: -180, ry: -30, rx: -3 }, // far right
  { tx:  -80, ty:  260, tz: -340, ry:   6, rx:   9 }, // depth bottom
];

const Projects = ({ setCursorVariant }) => {
  const [viewMode, setViewMode]   = useState('spiral');
  const [hoveredId, setHoveredId] = useState(null);
  const [activeIdx, setActiveIdx] = useState(2); // center card starts active
  const containerRef = useRef(null);

  /* ── Scroll → scene Y-rotation ── */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Full scroll: scene rotates -25° → +25° (slow panorama)
  const scrollRotY = useTransform(scrollYProgress, [0, 1], [-25, 25]);
  const springRotY = useSpring(scrollRotY, { stiffness: 28, damping: 18, mass: 1.2 });

  /* ── Mouse parallax ── */
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

  const mRotY = useSpring(useTransform(mouseX, [-1, 1], [-9,  9]), { stiffness: 55, damping: 20 });
  const mRotX = useSpring(useTransform(mouseY, [-1, 1], [ 5, -5]), { stiffness: 55, damping: 20 });

  // Combined scene rotation
  const totalRotY = useTransform([springRotY, mRotY], ([a, b]) => a + b);

  /* ── Track active card from scroll ── */
  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      const idx = Math.round(v * (projectsList.length - 1));
      setActiveIdx(Math.min(Math.max(idx, 0), projectsList.length - 1));
    });
    return unsub;
  }, [scrollYProgress]);

  /* ── Classic list preview ── */
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

  return (
    <section className="projects-container dark-section">

      {viewMode === 'spiral' ? (
        /* ═══ 3D SCATTER VIEW ═══ */
        <div className="projects-scroll-track" ref={containerRef}>
          <div className="projects-sticky-wrapper">

            {/* UI Overlay (header + toggle + active title) */}
            <div className="projects-interface-overlay">
              <div className="projects-section-header">
                <div className="header-meta">
                  <span className="meta-eyebrow">PORTFOLIO</span>
                  <h2 className="projects-title-main">Karya <em>Terpilih</em></h2>
                </div>
                <div className="view-toggle-container">
                  <button className={`toggle-btn ${viewMode === 'spiral' ? 'active' : ''}`} onClick={() => setViewMode('spiral')}>3D VIEW</button>
                  <button className={`toggle-btn ${viewMode === 'list'   ? 'active' : ''}`} onClick={() => setViewMode('list')}>LIST</button>
                  <div className={`toggle-indicator ${viewMode}`} />
                </div>
              </div>

              {/* Active card info — bottom center */}
              <div className="spiral-title-overlay">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIdx}
                    className="spiral-overlay-content"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="overlay-category">
                      → {projectsList[activeIdx].category} · {projectsList[activeIdx].year}
                    </span>
                    <h2 className="overlay-title">{projectsList[activeIdx].title}</h2>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* ── 3D Perspective Scene ── */}
            <div className="spiral-viewport">
              <motion.div
                className="spiral-scene"
                style={{ rotateY: totalRotY, rotateX: mRotX }}
              >
                {projectsList.map((project, i) => {
                  const pos       = SCATTER[i];
                  const isHovered = hoveredId === project.id;
                  const isActive  = i === activeIdx;

                  // Compute distance-based dimming: cards far from active get darker
                  const distFromActive = Math.abs(i - activeIdx);
                  const baseBrightness = isActive ? 0.95 : Math.max(0.35, 0.95 - distFromActive * 0.18);
                  const baseSaturate   = isActive ? 1    : Math.max(0.3,  1    - distFromActive * 0.22);

                  return (
                    <motion.div
                      key={project.id}
                      className="at3d-card-wrap"
                      style={{
                        x: pos.tx,
                        y: pos.ty,
                        z: pos.tz,
                        rotateY: pos.ry,
                        rotateX: pos.rx,
                      }}
                      animate={{
                        scale:  isHovered ? 1.06 : isActive ? 1.02 : 1,
                        filter: `brightness(${isHovered ? 1 : baseBrightness}) saturate(${isHovered ? 1 : baseSaturate})`,
                        z:      isHovered ? pos.tz + 100 : pos.tz,
                      }}
                      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                      onMouseEnter={() => { setHoveredId(project.id); setCursorVariant('hover'); }}
                      onMouseLeave={() => { setHoveredId(null);       setCursorVariant('default'); }}
                    >
                      <div className={`at3d-card-inner ${isActive ? 'is-active' : ''}`}>
                        <div className="at3d-image-wrap">
                          <motion.img
                            src={project.img}
                            alt={project.title}
                            animate={{ scale: isHovered ? 1.07 : 1 }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </div>
                        {/* Text overlay — always visible for hovered or active */}
                        <motion.div
                          className="at3d-overlay"
                          animate={{ opacity: isHovered || isActive ? 1 : 0.5 }}
                          transition={{ duration: 0.4 }}
                        >
                          <span className="at3d-meta">→ {project.category} · {project.year}</span>
                          <h3 className="at3d-title">{project.title}</h3>
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

          </div>
        </div>

      ) : (
        /* ═══ CLASSIC LIST VIEW ═══ */
        <div className="projects-list-wrapper">
          <div className="projects-section-header no-sticky">
            <div className="header-meta">
              <span className="meta-eyebrow">PORTFOLIO</span>
              <h2 className="projects-title-main">Karya <em>Terpilih</em></h2>
            </div>
            <div className="view-toggle-container">
              <button className={`toggle-btn ${viewMode === 'spiral' ? 'active' : ''}`} onClick={() => setViewMode('spiral')}>3D VIEW</button>
              <button className={`toggle-btn ${viewMode === 'list'   ? 'active' : ''}`} onClick={() => setViewMode('list')}>LIST</button>
              <div className={`toggle-indicator ${viewMode}`} />
            </div>
          </div>

          <div className="classic-list-content">
            {projectsList.map((project, index) => (
              <div
                key={project.id}
                className="list-row"
                onMouseEnter={() => { setListHovered(project); setCursorVariant('project'); }}
                onMouseLeave={() => { setListHovered(null);    setCursorVariant('default'); }}
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
                animate={{ scale: 1,   opacity: 1, rotate: 0  }}
                exit={{ scale: 0.6,    opacity: 0, rotate: 4  }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                style={{ position: 'fixed', left: previewX, top: previewY, x: '-50%', y: '-50%', pointerEvents: 'none', zIndex: 999 }}
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
