import { Link } from 'react-router-dom';
import { Twitter, Instagram, Linkedin } from 'lucide-react';

const LINKS = {
  'Platform': [
    { to: '/events',          label: 'Browse Events' },
    { to: '/booking',         label: 'Book Tickets' },
    { to: '/admin/login',     label: 'Host an Event' },
    { to: '/announcements',   label: 'Updates & Alerts' },
  ],
  'Resources': [
    { to: '/map',             label: 'Venue Maps' },
    { to: '/food-attractions',label: 'Vendors' },
    { to: '/contact',         label: 'Help Center' },
    { to: '/contact',         label: 'Contact Support' },
  ],
  'Company': [
    { to: '#', label: 'About Us' },
    { to: '#', label: 'Careers' },
    { to: '#', label: 'Privacy Policy' },
    { to: '#', label: 'Terms of Service' },
  ]
};

export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface-0 mt-20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="font-display text-2xl text-ink-primary mb-4 font-bold">
              Festival<span className="text-brand-500">Hub</span>
            </div>
            <p className="text-sm text-ink-secondary leading-relaxed mb-6 max-w-md">
              The all-in-one event management platform. Whether you're organizing a local meetup or a massive music festival, we provide the tools you need to succeed.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-surface-border bg-white text-xs text-ink-primary shadow-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-signal-success"></span>
              </span>
              All systems operational
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group}>
              <p className="font-bold text-ink-primary mb-5 tracking-wide">{group}</p>
              <ul className="space-y-3">
                {items.map(({ to, label }, i) => (
                  <li key={i}>
                    <Link
                      to={to}
                      className="text-sm text-ink-secondary hover:text-brand-500 hover:underline underline-offset-4 transition-all duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-surface-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-ink-tertiary">
            © {new Date().getFullYear()} Festival Hub Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-xs text-ink-tertiary">
            <a href="#" className="hover:text-ink-primary transition-colors"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="hover:text-ink-primary transition-colors"><Linkedin className="w-4 h-4" /></a>
            <a href="#" className="hover:text-ink-primary transition-colors"><Instagram className="w-4 h-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
