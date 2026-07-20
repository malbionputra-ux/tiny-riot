import React from 'react';
import { motion } from 'framer-motion';
import './Footer.css';

const Footer = ({ setCursorVariant }) => {
  return (
    <footer className="footer dark-section">
      <div className="footer-content">
        <motion.div 
          className="footer-cta"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="footer-meta">GET IN TOUCH</span>
          <h2>Mari kolaborasi<br />bikin <em>loud impact.</em></h2>
          <a 
            href="mailto:hello@tinyriot.com" 
            className="email-link"
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            hello@tinyriot.com
          </a>
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

