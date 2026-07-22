import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Header.css';
import Magnetic from './Magnetic';

const Header = ({ setCursorVariant, isLight, activeSlideIndex, isTransitioning }) => {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [atTop, setAtTop] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const isHero = activeSlideIndex === 0;

  useEffect(() => {
    if (isTransitioning) {
      setMenuOpen(false);
    }
  }, [isTransitioning]);

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
      {/* Top Header */}
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

        {/* Top inline Navbar links - visible ONLY on Hero section */}
        <AnimatePresence>
          {isHero && (
            <motion.nav 
              className="nav-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <Magnetic>
                <a
                  href="#about"
                  onMouseEnter={() => setCursorVariant && setCursorVariant('navbarHover')}
                  onMouseLeave={() => setCursorVariant && setCursorVariant('default')}
                >
                  Tentang
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="#services"
                  onMouseEnter={() => setCursorVariant && setCursorVariant('navbarHover')}
                  onMouseLeave={() => setCursorVariant && setCursorVariant('default')}
                >
                  Layanan
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="#projects"
                  onMouseEnter={() => setCursorVariant && setCursorVariant('navbarHover')}
                  onMouseLeave={() => setCursorVariant && setCursorVariant('default')}
                >
                  Work
                </a>
              </Magnetic>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* Bottom Center Floating Curved Text Menu Trigger - visible ONLY on page 2 onwards */}
      <AnimatePresence>
        {!isHero && (
          <motion.div 
            className="bottom-menu-wrapper"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4 }}
          >
            <Magnetic>
              <button
                className={`curved-menu-btn ${menuOpen ? 'open' : ''} ${isLight && !menuOpen ? 'light' : ''}`}
                onClick={() => setMenuOpen(!menuOpen)}
                onMouseEnter={() => setCursorVariant && setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant && setCursorVariant('default')}
                aria-label="Toggle Menu"
              >
                {/* Empty Center Circle */}
                <div className="empty-center-circle" />

                {/* Curved SVG Text on the Right Arc */}
                <svg className="side-curved-svg" viewBox="0 0 130 130">
                  <path
                    id="rightArcPath"
                    d="M 65,14 A 51,51 0 0,1 65,116"
                    fill="none"
                  />
                  <text className="side-curved-text">
                    <textPath href="#rightArcPath" startOffset="38%">
                      {menuOpen ? 'Close' : 'Menu'}
                    </textPath>
                  </text>
                </svg>
              </button>
            </Magnetic>
          </motion.div>
        )}
      </AnimatePresence>

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
