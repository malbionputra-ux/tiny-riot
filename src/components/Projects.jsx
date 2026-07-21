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

  return (
    <section className="projects-container dark-section" id="projects">
      <div className="projects-list-wrapper">
        <div className="projects-section-header no-sticky">
          <div className="header-meta">
            <span className="meta-eyebrow">PORTFOLIO</span>
            <h2 className="projects-title-main">Karya <em>Terpilih</em></h2>
          </div>
        </div>

        <div className="classic-list-content">
          {projectsList.map((project, index) => (
            <div
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
            </div>
          ))}
        </div>

        <AnimatePresence>
          {listHovered && (
            <motion.div
              className="list-hover-preview"
              initial={{ scale: 0.6, opacity: 0, rotate: -4 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.6, opacity: 0, rotate: 4 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              style={{
                position: 'fixed',
                left: listMouseX.current,
                top: listMouseY.current,
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
    </section>
  );
};

export default Projects;
