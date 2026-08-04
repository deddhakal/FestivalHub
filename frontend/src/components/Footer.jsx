import { Link } from 'react-router-dom';

const LINKS = {
  'Experience': [
    { to: '/events',          label: 'Event Schedule' },
    { to: '/booking',         label: 'Book Tickets' },
    { to: '/map',             label: 'Festival Map' },
    { to: '/food-attractions',label: 'Food & Vendors' },
  ],
  'Information': [
    { to: '/announcements', label: 'Updates & Alerts' },
    { to: '/contact',       label: 'Contact Us' },
    { to: '/admin/login',   label: 'Admin' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface-0 mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">

          {/* Brand column */}
          <div>
            <div className="font-display text-xl text-ink-primary mb-3">
              Festival<span className="text-brand-500">Hub</span>
            </div>
            <p className="text-sm text-ink-tertiary leading-relaxed mb-5">
              Connecting the campus community through world-class events, hackathons, and culture.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-surface-border text-2xs text-ink-tertiary uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-signal-success animate-pulse" />
              Tickets on sale now
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group}>
              <p className="eyebrow mb-4">{group}</p>
              <ul className="space-y-2.5">
                {items.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-sm text-ink-secondary hover:text-ink-primary transition-colors duration-150"
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
        <div className="mt-12 pt-6 border-t border-surface-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs text-ink-tertiary">
            © 2026 Festival Hub Pty Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-xs text-ink-tertiary">
            <span>University Campus</span>
            <span className="text-surface-muted">·</span>
            <span>All Year Round</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
