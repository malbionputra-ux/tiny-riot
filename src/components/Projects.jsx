import React from 'react';
import { motion } from 'framer-motion';
import './Projects.css';

const projectsList = [
  { 
    id: 1, 
    title: 'DUNIA GAMES', 
    category: 'E-Sports Portal', 
    tag: 'Newly Added', 
    desc: 'Indonesia’s premier gaming platform & e-sports hub', 
    img: '/assets/dunia-games.jpg',
    aspect: 'aspect-tall'
  },
  { 
    id: 2, 
    title: 'BINAR ACADEMY', 
    category: 'EdTech Platform', 
    tag: 'Headless Web', 
    desc: 'Rebranding & digital learning flagship platform', 
    img: '/assets/binar.jpg',
    aspect: 'aspect-medium'
  },
  { 
    id: 3, 
    title: 'GOJEK DRIVER', 
    category: 'App Interface', 
    tag: 'UI/UX Case', 
    desc: 'Streamlining operations for millions of drivers', 
    img: '/assets/gojek.jpg',
    aspect: 'aspect-tall'
  },
  { 
    id: 4, 
    title: 'NEO BANKING', 
    category: 'Fintech Dashboard', 
    tag: 'Fintech', 
    desc: 'Next-gen wealth management & digital banking', 
    img: '/assets/neo.jpg',
    aspect: 'aspect-medium'
  },
  { 
    id: 5, 
    title: 'VORTEX DYNAMICS', 
    category: 'Web3 Platform', 
    tag: 'Web3 Ecosystem', 
    desc: 'Decentralized trading platform with real-time analytics', 
    img: '/assets/vortex.jpg',
    aspect: 'aspect-tall'
  },
  { 
    id: 6, 
    title: 'YELLOW TRUCK', 
    category: 'F&B E-Commerce', 
    tag: 'Branding & Store', 
    desc: 'Artisanal coffee experience brought to life online', 
    img: '/assets/yellow-truck.jpg',
    aspect: 'aspect-medium'
  },
];

const Projects = ({ setCursorVariant }) => {
  const textVariants = {
    hidden:  { y: '100%', opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="projects-container dark-section" id="projects">
      <div className="projects-grid-wrapper">
        <div className="projects-section-header no-sticky">
          <motion.div 
            className="header-meta"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <div style={{ overflow: 'hidden', paddingBottom: '5px' }}>
              <motion.span variants={textVariants} className="meta-eyebrow" style={{ display: 'block' }}>CASES & WORK</motion.span>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <motion.h2 variants={textVariants} className="projects-title-main">Karya <em>Terpilih</em></motion.h2>
            </div>
          </motion.div>
        </div>

        {/* Build in Amsterdam Exact 3-Column Portfolio Grid */}
        <motion.div 
          className="bia-portfolio-grid-exact"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {projectsList.map((project) => (
            <motion.div
              variants={cardVariants}
              key={project.id}
              className={`bia-card-item ${project.aspect}`}
              onMouseEnter={() => setCursorVariant && setCursorVariant('project')}
              onMouseLeave={() => setCursorVariant && setCursorVariant('default')}
            >
              <div className="bia-card-img-box">
                <img src={project.img} alt={project.title} loading="lazy" />
                <div className="bia-card-shadow-overlay" />
              </div>

              {project.tag && (
                <div className="bia-card-pill-tag">
                  {project.tag}
                </div>
              )}

              <div className="bia-card-text-overlay">
                <p className="bia-card-caption">
                  <strong className="caption-title">{project.title}</strong>
                  <span className="caption-dot"> • </span>
                  <span className="caption-desc">{project.desc}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
