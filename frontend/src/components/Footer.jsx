import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#141E34] overflow-hidden mt-0 pt-fluid-lg pb-fluid-lg">
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.12] pointer-events-none z-0" aria-hidden="true" />
      
      <div className="container relative z-10 flex flex-col lg:flex-row items-center lg:justify-between gap-8 text-center lg:text-left">
        
        {/* Brand */}
        <div className="font-display text-2xl text-white font-bold tracking-wide">
          Festival<span className="text-coral-500">Hub</span>
        </div>

        {/* Essential Links */}
        <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4" aria-label="Footer Navigation">
          <Link to="/events" className="text-fluid-sm font-semibold tracking-wide text-blue-100/60 hover:text-coral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 rounded transition-colors">Events</Link>
          <Link to="/booking" className="text-fluid-sm font-semibold tracking-wide text-blue-100/60 hover:text-coral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 rounded transition-colors">Tickets</Link>
          <Link to="/contact" className="text-fluid-sm font-semibold tracking-wide text-blue-100/60 hover:text-coral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 rounded transition-colors">Support</Link>
          <Link to="#" className="text-fluid-sm font-semibold tracking-wide text-blue-100/60 hover:text-coral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 rounded transition-colors">Terms</Link>
        </nav>

        {/* Copyright */}
        <div className="text-xs font-medium tracking-wide text-blue-100/40">
          © {new Date().getFullYear()} Festival Hub.
        </div>
        
      </div>
    </footer>
  );
}
