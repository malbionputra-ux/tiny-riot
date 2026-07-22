import React from 'react';
import { motion } from 'framer-motion';
import './Projects.css';

const columnsData = [
  // Column 1
  [
    { 
      id: 1, 
      title: 'FOAM TALENT 2021', 
      desc: 'A digital exhibition celebrating emotional browsing', 
      img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
      height: '320px'
    },
    { 
      id: 5, 
      title: 'MOOOI', 
      desc: 'Multi-sensory flagship store', 
      img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80',
      height: '560px'
    }
  ],
  // Column 2
  [
    { 
      id: 2, 
      title: 'POWERHOUSE COMPANY', 
      desc: 'Giving meaning to space', 
      img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      height: '240px'
    },
    { 
      id: 6, 
      title: 'MOLLIE', 
      desc: 'Grow your way', 
      img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
      height: '640px'
    }
  ],
  // Column 3
  [
    { 
      id: 3, 
      title: 'FOAM TALENT 2020', 
      desc: 'An exhibition without walls', 
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80',
      height: '320px'
    },
    { 
      id: 7, 
      title: 'ABEL VITA ODOR', 
      desc: 'Sparking all senses but smell', 
      img: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80',
      height: '560px'
    }
  ],
  // Column 4
  [
    { 
      id: 4, 
      title: 'STELLAR DEVELOPMENT', 
      desc: 'Developing destinations', 
      img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
      height: '240px'
    },
    { 
      id: 8, 
      title: 'VITRA', 
      desc: 'Office chair finder', 
      img: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=1000&q=80',
      height: '640px'
    }
  ]
];

const Projects = ({ setCursorVariant }) => {
  return (
    <section className="projects-container light-section full-bleed-cases" id="projects">
      <div className="bia-cases-4col-grid">
        {columnsData.map((col, colIndex) => (
          <React.Fragment key={colIndex}>
            {colIndex === 2 && (
              <div className="bia-filter-work-divider">
                <span>FILTER WORK</span>
              </div>
            )}
            <div className="bia-grid-column">
              {col.map((item) => (
                <motion.div
                  key={item.id}
                  className="bia-case-card"
                  style={{ height: item.height }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  onMouseEnter={() => setCursorVariant && setCursorVariant('project')}
                  onMouseLeave={() => setCursorVariant && setCursorVariant('default')}
                >
                  <img src={item.img} alt={item.title} className="case-img" />
                  <div className="case-shadow-gradient" />
                  
                  <div className="case-info-tag">
                    <p className="case-caption-text">
                      <span className="case-title">{item.title}</span>
                      <span className="case-dot"> · </span>
                      <span className="case-desc">{item.desc}</span>
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default Projects;
