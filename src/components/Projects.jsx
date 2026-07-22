import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Projects.css';

const projectsList = [
  { id: 1, title: 'Dunia Games', category: 'E-Sports Portal', year: '2023', img: '/assets/dunia-games.jpg' },
  { id: 2, title: 'Binar Academy', category: 'EdTech Platform', year: '2022', img: '/assets/binar.jpg' },
  { id: 3, title: 'Gojek Driver', category: 'App Interface', year: '2024', img: '/assets/gojek.jpg' },
  { id: 4, title: 'Neo Banking', category: 'Fintech Dashboard', year: '2023', img: '/assets/neo.jpg' },
  { id: 5, title: 'Vortex Dynamics', category: 'Web3 Platform', year: '2024', img: '/assets/vortex.jpg' },
  { id: 6, title: 'Yellow Truck Coffee', category: 'F&B E-Commerce', year: '2022', img: '/assets/yellow-truck.jpg' },
];

const Projects = ({ setCursorVariant }) => {
  const [listHovered, setListHovered] = useState(null);
  const listMouseX = useRef(0);
  const listMouseY = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      listMouseX.current = e.clientX;
      listMouseY.current = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const textVariants = {
    hidden:  { y: '100%', opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <section className="projects-container dark-section" id="projects">
      <div className="projects-list-wrapper">
        <div className="projects-section-header no-sticky">
          <motion.div 
            className="header-meta"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <div style={{ overflow: 'hidden', paddingBottom: '5px' }}>
              <motion.span variants={textVariants} className="meta-eyebrow" style={{ display: 'block' }}>PORTFOLIO</motion.span>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <motion.h2 variants={textVariants} className="projects-title-main">Karya <em>Terpilih</em></motion.h2>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="classic-list-content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {projectsList.map((project, index) => (
            <motion.div
              variants={itemVariants}
              key={project.id}
              className="list-row"
              onMouseEnter={() => {
                setListHovered(project);
                if (setCursorVariant) setCursorVariant('project');
              }}
              onMouseLeave={() => {
                setListHovered(null);
                if (setCursorVariant) setCursorVariant('default');
              }}
            >
              <div className="list-row-index">0{index + 1}</div>
              <div className="list-row-details">
                <h3 className="list-row-title">{project.title}</h3>
                <span className="list-row-category">{project.category}</span>
              </div>
              <div className="list-row-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <AnimatePresence>
          {listHovered && (
            <>
              {/* Left Floating Image */}
              <motion.div
                className="list-side-preview left"
                initial={{ scale: 0.8, opacity: 0, rotate: -15, x: -80, y: '-50%' }}
                animate={{ scale: 1, opacity: 1, rotate: -6, x: 0, y: '-50%' }}
                exit={{ scale: 0.8, opacity: 0, rotate: -15, x: -80, y: '-50%' }}
                transition={{ type: 'spring', damping: 22, stiffness: 120 }}
              >
                <div className="preview-image-container">
                  <img src={listHovered.img} alt={listHovered.title} />
                </div>
              </motion.div>

              {/* Right Floating Image */}
              <motion.div
                className="list-side-preview right"
                initial={{ scale: 0.8, opacity: 0, rotate: 15, x: 80, y: '-50%' }}
                animate={{ scale: 1, opacity: 1, rotate: 8, x: 0, y: '-50%' }}
                exit={{ scale: 0.8, opacity: 0, rotate: 15, x: 80, y: '-50%' }}
                transition={{ type: 'spring', damping: 22, stiffness: 120, delay: 0.05 }}
              >
                <div className="preview-image-container">
                  <img src={listHovered.img} alt={listHovered.title} />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Projects;
