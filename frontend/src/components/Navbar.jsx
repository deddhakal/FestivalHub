import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/',                label: 'Home' },
  { to: '/dashboard',       label: 'Dashboard' },
  { to: '/events',          label: 'Events' },
  { to: '/food-attractions',label: 'Food & Vendors' },
  { to: '/map',             label: 'Map' },
  { to: '/announcements',   label: 'Updates' },
  { to: '/manage-ticket',   label: 'My Ticket' },
  { to: '/contact',         label: 'Contact' },
];

function MenuIcon({ open }) {
  return (
    <span className="relative w-5 h-4 flex flex-col justify-between">
      <span className={`block h-px bg-ink-primary origin-left transition-all duration-250 ${open ? 'rotate-[33deg] w-[118%]' : 'w-full'}`} />
      <span className={`block h-px bg-ink-primary transition-all duration-200 ${open ? 'opacity-0 translate-x-2' : 'w-3/4 opacity-100'}`} />
      <span className={`block h-px bg-ink-primary origin-left transition-all duration-250 ${open ? '-rotate-[33deg] w-[118%]' : 'w-full'}`} />
    </span>
  );
}

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-lg border-b border-surface-border shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group" aria-label="FestivalHub — Home">
          {/* Wordmark */}
          <span className="font-display font-bold text-xl leading-none text-ink-primary">
            Festival<span className="text-coral-500">Hub</span>
          </span>
          <span className="hidden sm:block text-surface-muted text-sm leading-none">·</span>
          <span className="hidden sm:block text-ink-tertiary text-xs font-medium tracking-wide">2026</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link ${
                isActive(to) ? 'nav-link-active' : ''
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/booking" className="btn-primary btn-sm">
            Get Tickets
          </Link>
          <Link
            to="/admin/login"
            className="text-2xs text-ink-tertiary hover:text-ink-secondary transition-colors uppercase tracking-wider"
          >
            Admin
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 -mr-2 text-ink-primary"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <MenuIcon open={menuOpen} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white border-t border-surface-border px-4 pt-4 pb-6 flex flex-col gap-1 shadow-lift">
          {NAV_ITEMS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link ${
                isActive(to) ? 'nav-link-active' : ''
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="mt-3 pt-3 border-t border-surface-border">
            <Link to="/booking" className="btn-primary btn-md w-full">
              Get Tickets
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
