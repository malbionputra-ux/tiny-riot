import React, { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import './Header.css';

import Magnetic from './Magnetic';

const Header = ({ setCursorVariant, isLight }) => {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [atTop, setAtTop] = useState(true);

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
    <header className={`header ${visible ? 'header--visible' : 'header--hidden'} ${atTop ? 'header--top' : 'header--scrolled'} ${isLight ? 'header--light' : ''}`}>
      <Magnetic>
        <div
          className="logo"
          onMouseEnter={() => setCursorVariant('hover')}
          onMouseLeave={() => setCursorVariant('default')}
        >
          <img src="/assets/new-logo-transparent.png" alt="Logo" className="custom-logo" />
          <span className="logo-text">Tiny Riot</span>
        </div>
      </Magnetic>

      <nav className="nav-menu">
        <Magnetic>
          <a
            href="#about"
            onMouseEnter={() => setCursorVariant('navbarHover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            Tentang
          </a>
        </Magnetic>
        <Magnetic>
          <a
            href="#services"
            onMouseEnter={() => setCursorVariant('navbarHover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            Layanan
          </a>
        </Magnetic>
        <Magnetic>
          <a
            href="#projects"
            onMouseEnter={() => setCursorVariant('navbarHover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            Work
          </a>
        </Magnetic>
      </nav>

      <button
        className="menu-btn"
        onMouseEnter={() => setCursorVariant('hover')}
        onMouseLeave={() => setCursorVariant('default')}
      >
        <Menu size={28} />
      </button>
    </header>
  );
};

export default Header;
