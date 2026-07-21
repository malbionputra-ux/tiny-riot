import React from 'react';
import { motion } from 'framer-motion';
import './Footer.css';

const Footer = ({ setCursorVariant }) => {
  const textVariants = {
    hidden:  { y: '100%', opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <footer className="footer dark-section">
      <div className="footer-content">
        <motion.div 
          className="footer-cta"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <div style={{ overflow: 'hidden', paddingBottom: '5px' }}>
            <motion.span variants={textVariants} className="footer-meta" style={{ display: 'block' }}>GET IN TOUCH</motion.span>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <motion.h2 variants={textVariants}>Mari kolaborasi<br />bikin <em>loud impact.</em></motion.h2>
          </div>
          <motion.div variants={textVariants}>
            <a 
              href="mailto:hello@tinyriot.com" 
              className="email-link"
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              hello@tinyriot.com
            </a>
          </motion.div>
        </motion.div>
        
        <div className="footer-bottom">
          <div className="footer-copy">
            &copy; {new Date().getFullYear()} TINY RIOT. ALL RIGHTS RESERVED.
          </div>
          <div className="footer-socials">
            <a 
              href="#"
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              INSTAGRAM
            </a>
            <a 
              href="#"
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              BEHANCE
            </a>
            <a 
              href="#"
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              LINKEDIN
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

