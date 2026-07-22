import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Header.css';
import Magnetic from './Magnetic';

const Header = ({ setCursorVariant, isLight }) => {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [atTop, setAtTop] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setAtTop(currentY < 10);

      if (currentY > lastScrollY && currentY > 80) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      {/* Top Header - Logo only */}
      <header className={`header ${visible ? 'header--visible' : 'header--hidden'} ${atTop ? 'header--top' : 'header--scrolled'} ${isLight ? 'header--light' : ''}`}>
        <Magnetic>
          <div
            className="logo"
            onMouseEnter={() => setCursorVariant && setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant && setCursorVariant('default')}
          >
            <img src="/assets/new-logo-transparent.png" alt="Logo" className="custom-logo" />
            <span className="logo-text">Tiny Riot</span>
          </div>
        </Magnetic>
      </header>

      {/* Bottom Center Floating Curved Text Menu Trigger */}
      <div className="bottom-menu-wrapper">
        <Magnetic>
          <button
            className={`circular-menu-btn ${menuOpen ? 'open' : ''} ${isLight && !menuOpen ? 'light' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            onMouseEnter={() => setCursorVariant && setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant && setCursorVariant('default')}
            aria-label="Toggle Menu"
          >
            {/* Curved SVG Text around the circle */}
            <svg className="curved-text-svg" viewBox="0 0 140 140">
              <path
                id="circlePath"
                d="M 70,70 m -50,0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0"
                fill="none"
              />
              <text className="curved-text-content">
                <textPath href="#circlePath" startOffset="0%">
                  {menuOpen ? 'CLOSE • CLOSE • CLOSE • CLOSE • ' : 'MENU • TINY RIOT • MENU • TINY RIOT • '}
                </textPath>
              </text>
            </svg>

            {/* Inner Icon Button */}
            <div className="inner-icon-circle">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </div>
          </button>
        </Magnetic>
      </div>

      {/* Slide Up Menu Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="menu-drawer-overlay"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="menu-drawer-container">
              <div className="drawer-meta-top">
                <span>NAVIGASI</span>
                <span>TINY RIOT © 2024</span>
              </div>

              <nav className="drawer-nav-list">
                <motion.a
                  href="#about"
                  onClick={() => setMenuOpen(false)}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  onMouseEnter={() => setCursorVariant && setCursorVariant('hover')}
                  onMouseLeave={() => setCursorVariant && setCursorVariant('default')}
                >
                  <span className="nav-num">01</span>
                  <span className="nav-label">Tentang</span>
                </motion.a>

                <motion.a
                  href="#services"
                  onClick={() => setMenuOpen(false)}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  onMouseEnter={() => setCursorVariant && setCursorVariant('hover')}
                  onMouseLeave={() => setCursorVariant && setCursorVariant('default')}
                >
                  <span className="nav-num">02</span>
                  <span className="nav-label">Layanan</span>
                </motion.a>

                <motion.a
                  href="#projects"
                  onClick={() => setMenuOpen(false)}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  onMouseEnter={() => setCursorVariant && setCursorVariant('hover')}
                  onMouseLeave={() => setCursorVariant && setCursorVariant('default')}
                >
                  <span className="nav-num">03</span>
                  <span className="nav-label">Work</span>
                </motion.a>
              </nav>

              <div className="drawer-footer-bottom">
                <div className="footer-col">
                  <h4>HUBUNGI KAMI</h4>
                  <p>hello@tinyriot.com</p>
                </div>
                <div className="footer-col">
                  <h4>LOKASI HQ</h4>
                  <p>Jakarta & Bandung, Indonesia</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
