import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Activity, Zap } from 'lucide-react';
import './Layout.css';

const NAV_ITEMS = [
  { path: '/', label: 'ANASAYFA', icon: '🏠' },
  { path: '/football', label: 'FUTBOL', icon: '⚽' },
  { path: '/basketbol', label: 'BASKETBOL', icon: '🏀' },
  { path: '/tenis', label: 'TENİS', icon: '🎾' },
  { path: '/formula1', label: 'FORMULA 1', icon: '🏎️' },
  { path: '/mma', label: 'MMA', icon: '🥊' },
];

export default function Layout() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const timeStr = time.toLocaleTimeString('tr-TR', { hour12: false });

  return (
    <div className="layout">
      <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__inner">
          <Link to="/" className="navbar__logo">
            <Activity size={18} />
            <span>SPORTS<strong>CANLI</strong></span>
          </Link>

          <nav className={`navbar__nav ${menuOpen ? 'navbar__nav--open' : ''}`}>
            {NAV_ITEMS.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={location.pathname === item.path ? 'active' : ''}
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </nav>

          <div className="navbar__right">
            <div className="navbar__live">
              <span className="live-dot" /> CANLI
            </div>
            <div className="navbar__time">
              <Zap size={11} /> {timeStr}
            </div>
            <button
              className={`hamburger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        © 2026 SportsCanlı — Veriler: API-Sports
      </footer>
    </div>
  );
}
