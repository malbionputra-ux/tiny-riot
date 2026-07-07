import React from 'react';
import { motion } from 'framer-motion';
import './About.css';

const About = ({ setCursorVariant }) => {
  return (
    <section className="about" id="about">
      <div className="about-container">
        <motion.p 
          className="about-text"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          onMouseEnter={() => setCursorVariant('hover')}
          onMouseLeave={() => setCursorVariant('default')}
        >
          Hi! We are <span className="text-highlight">Tiny Riot</span>. We are a full-service creative house, based in Jakarta and Bandung, Indonesia. We believe that even a small voice can shake the world. We are here to help small brands create a <span className="text-highlight">strong and bold digital presence</span>. Through boundless creativity, a personal approach, and sharp strategy, we make every brand have a place in the digital crowd. With the spirit of <span className="text-highlight">'small team, loud impact'</span>, we are your partner to shine, not just be seen.
        </motion.p>
      </div>
    </section>
  );
};

export default About;
