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
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link-item"
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-svg-icon">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              <span>INSTAGRAM</span>
            </a>
            <a 
              href="https://behance.net" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link-item"
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="social-svg-icon">
                <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-4.726 3-3.101 0-5-2.001-5-5 0-3.001 2.015-5 5-5 2.946 0 4.536 1.868 4.717 4h-7.142c.189 1.579 1.488 2.274 2.544 2.274 1.189 0 1.943-.591 2.261-1.274h2.346zm-4.726-5.836c-1.127 0-1.896.726-2.115 1.836h4.195c-.149-1.077-.852-1.836-2.08-1.836zm-10.707-6.164h-8.293v14h8.508c2.997 0 5.492-1.637 5.492-4.668 0-1.849-1.037-3.181-2.457-3.79 1.139-.558 1.95-1.748 1.95-3.238 0-2.613-2.138-3.304-5.2-3.304zm-4.293 2.164h3.585c1.472 0 2.415.518 2.415 1.664 0 1.182-1.002 1.672-2.415 1.672h-3.585v-3.336zm0 5.418h3.799c1.611 0 2.701.575 2.701 1.86 0 1.341-1.09 1.894-2.701 1.894h-3.799v-3.754z"/>
              </svg>
              <span>BEHANCE</span>
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link-item"
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-svg-icon">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              <span>LINKEDIN</span>
            </a>
            <a 
              href="https://dribbble.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link-item"
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-svg-icon">
                <circle cx="12" cy="12" r="10" />
                <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94" />
                <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32" />
                <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72" />
              </svg>
              <span>DRIBBBLE</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

