import { useState, useEffect, useRef } from 'react';
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
    <span className="relative w-5 h-4 flex flex-col justify-between" aria-hidden="true">
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
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Trap focus for mobile menu
  useEffect(() => {
    if (menuOpen && menuRef.current) {
      const focusableElements = menuRef.current.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
      );
      const firstElement = focusableElements[0];
      if (firstElement) firstElement.focus();
    }
  }, [menuOpen]);

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? 'bg-white/95 backdrop-blur-lg border-b border-surface-border shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <nav className="container h-16 flex items-center justify-between" aria-label="Main Navigation">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500" aria-label="FestivalHub — Home">
          {/* Wordmark */}
          <span className="font-display font-bold text-fluid-xl leading-none text-ink-primary">
            Festival<span className="text-coral-500">Hub</span>
          </span>
          <span className="hidden sm:block text-surface-muted text-sm leading-none">·</span>
          <span className="hidden sm:block text-ink-tertiary text-xs font-medium tracking-wide">2026</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2">
          {NAV_ITEMS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link text-sm xl:text-base whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                isActive(to) ? 'nav-link-active' : ''
              }`}
              aria-current={isActive(to) ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <Link to="/events" className="btn-primary btn-sm">
            Get Tickets
          </Link>
          <Link
            to="/admin/login"
            className="text-2xs text-ink-tertiary hover:text-ink-secondary transition-colors uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded p-1"
          >
            Admin
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 -mr-2 text-ink-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <MenuIcon open={menuOpen} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        ref={menuRef}
        className={`lg:hidden transition-all duration-300 overflow-y-auto bg-white border-t border-surface-border shadow-lift origin-top ${
          menuOpen ? 'max-h-[calc(100vh-4rem)] opacity-100 py-4 scale-y-100' : 'max-h-0 opacity-0 py-0 scale-y-0'
        }`}
      >
        <div className="px-fluid-sm md:px-fluid-md flex flex-col gap-2">
          {NAV_ITEMS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link text-lg block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                isActive(to) ? 'nav-link-active' : ''
              }`}
              onClick={() => setMenuOpen(false)}
              aria-current={isActive(to) ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
          <div className="mt-4 pt-4 border-t border-surface-border flex flex-col gap-3">
            <Link to="/events" className="btn-primary btn-md w-full justify-center" onClick={() => setMenuOpen(false)}>
              Get Tickets
            </Link>
            <Link
              to="/admin/login"
              className="text-xs text-center text-ink-tertiary hover:text-ink-secondary transition-colors uppercase tracking-wider py-2"
              onClick={() => setMenuOpen(false)}
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
