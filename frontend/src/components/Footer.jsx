import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#141E34] overflow-hidden mt-0 pt-10 pb-10">
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.12] pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand */}
        <div className="font-display text-xl text-white font-bold tracking-wide">
          Festival<span className="text-coral-500">Hub</span>
        </div>

        {/* Essential Links */}
        <div className="flex flex-wrap items-center justify-center gap-8">
          <Link to="/events" className="text-sm font-semibold tracking-wide text-blue-100/60 hover:text-coral-400 transition-colors">Events</Link>
          <Link to="/booking" className="text-sm font-semibold tracking-wide text-blue-100/60 hover:text-coral-400 transition-colors">Tickets</Link>
          <Link to="/contact" className="text-sm font-semibold tracking-wide text-blue-100/60 hover:text-coral-400 transition-colors">Support</Link>
          <Link to="#" className="text-sm font-semibold tracking-wide text-blue-100/60 hover:text-coral-400 transition-colors">Terms</Link>
        </div>

        {/* Copyright */}
        <div className="text-xs font-medium tracking-wide text-blue-100/40">
          © {new Date().getFullYear()} Festival Hub.
        </div>
        
      </div>
    </footer>
  );
}
