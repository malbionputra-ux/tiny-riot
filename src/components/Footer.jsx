import React from 'react';
import { motion } from 'framer-motion';
import './Footer.css';

const Footer = ({ setCursorVariant }) => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <motion.div 
          className="footer-cta"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="footer-dot"></div>
          <h2>Mari mulai<br />proyek Anda.</h2>
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
            &copy; {new Date().getFullYear()} Tiny Riot Agency.
          </div>
          <div className="footer-socials">
            <a 
              href="#"
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              Instagram
            </a>
            <a 
              href="#"
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              Behance
            </a>
            <a 
              href="#"
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
