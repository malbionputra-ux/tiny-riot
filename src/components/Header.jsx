import React, { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import './Header.css';

const Header = ({ setCursorVariant }) => {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      setAtTop(currentY < 10);

      if (currentY > lastScrollY && currentY > 80) {
        // Scrolling DOWN → hide
        setVisible(false);
      } else {
        // Scrolling UP → show
        setVisible(true);
      }

      setLastScrollY(currentY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`header ${visible ? 'header--visible' : 'header--hidden'} ${atTop ? 'header--top' : 'header--scrolled'}`}>
      <div
        className="logo"
        onMouseEnter={() => setCursorVariant('hover')}
        onMouseLeave={() => setCursorVariant('default')}
      >
        <img src="/assets/Tiny_Riot_Logo.png" alt="Logo" className="custom-logo" />
        <span className="logo-text">Tiny Riot</span>
      </div>

      <nav className="nav-menu">
        <a
          href="#about"
          onMouseEnter={() => setCursorVariant('hover')}
          onMouseLeave={() => setCursorVariant('default')}
        >
          Tentang
        </a>
        <a
          href="#services"
          onMouseEnter={() => setCursorVariant('hover')}
          onMouseLeave={() => setCursorVariant('default')}
        >
          Layanan
        </a>
        <a
          href="#projects"
          onMouseEnter={() => setCursorVariant('hover')}
          onMouseLeave={() => setCursorVariant('default')}
        >
          Work
        </a>
      </nav>

      <button
        className="menu-btn"
        onMouseEnter={() => setCursorVariant('hover')}
        onMouseLeave={() => setCursorVariant('default')}
      >
        <Menu color="var(--color-text)" size={28} />
      </button>
    </header>
  );
};

export default Header;
