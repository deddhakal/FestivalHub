import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents, getVendors, getAnnouncements } from '../services/api';
import { LoadingSpinner } from '../components/UI';

/* ── Helpers ──────────────────────────────────────────────────── */
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' });
}

function formatTime(t) {
  return t?.slice(0, 5) ?? '—';
}

const CATEGORY_COLOR = {
  Electronic: 'text-blue-400',   Pop: 'text-pink-400',
  Rock:       'text-orange-400', Jazz: 'text-amber-400',
  Reggae:     'text-green-400',  Dance: 'text-purple-400',
  Acoustic:   'text-teal-400',   Family: 'text-sky-400',
  Ceremony:   'text-brand-400',  Wellness: 'text-emerald-400',
};

const ANNOUNCEMENT_STYLES = {
  warning: { bar: 'bg-amber-500',  text: 'text-amber-400', label: 'Warning' },
  alert:   { bar: 'bg-red-500',    text: 'text-red-400',   label: 'Alert' },
  info:    { bar: 'bg-blue-500',   text: 'text-blue-400',  label: 'Info' },
  success: { bar: 'bg-green-500',  text: 'text-green-400', label: 'Update' },
};

/* ── Hero ticker ─────────────────────────────────────────────── */
const TICKER_ITEMS = [
  'August 15–17, 2026',
  'Melbourne Showgrounds',
  '14+ Live Performances',
  '3 Stages',
  'Tickets Available Now',
  'General & VIP Access',
];

function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="overflow-hidden border-y border-surface-border bg-surface-1/40 py-2.5 select-none">
      <div className="flex gap-0 animate-ticker whitespace-nowrap" style={{ width: 'max-content' }}>
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-6 px-6 text-xs font-medium text-ink-tertiary uppercase tracking-[0.12em]">
            {item}
            <span className="text-brand-700">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Event card ──────────────────────────────────────────────── */
function EventCard({ event, index }) {
  const low  = event.tickets_available < 30;
  const sold = event.tickets_available === 0;
  const catColor = CATEGORY_COLOR[event.category] || 'text-ink-secondary';

  return (
    <Link
      to={`/events/${event.id}`}
      className="card-interactive group block animate-fade-in"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="p-5 flex flex-col gap-3">
        {/* Category + tickets */}
        <div className="flex items-center justify-between">
          <span className={`text-2xs font-semibold uppercase tracking-widest ${catColor}`}>
            {event.category}
          </span>
          {sold ? (
            <span className="chip chip-danger">Sold Out</span>
          ) : low ? (
            <span className="chip chip-warning">Few Left</span>
          ) : (
            <span className="chip chip-default">{event.tickets_available} left</span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-display text-lg text-ink-primary leading-snug group-hover:text-brand-400 transition-colors duration-200">
          {event.title}
        </h3>

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-auto">
          <span className="text-xs text-ink-tertiary">{formatDate(event.event_date)}</span>
          <span className="text-xs text-ink-tertiary">{formatTime(event.start_time)}</span>
          <span className="text-xs text-ink-tertiary">{event.stage}</span>
        </div>
      </div>
    </Link>
  );
}

/* ── Announcement strip ──────────────────────────────────────── */
function AnnouncementStrip({ ann }) {
  const style = ANNOUNCEMENT_STYLES[ann.type] || ANNOUNCEMENT_STYLES.info;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-surface-border last:border-0">
      <div className={`w-1 h-full min-h-4 rounded-full shrink-0 mt-0.5 ${style.bar}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-2xs font-semibold uppercase tracking-wider ${style.text}`}>{style.label}</span>
          <span className="text-2xs text-ink-tertiary">{ann.title}</span>
        </div>
        <p className="text-xs text-ink-secondary line-clamp-1">{ann.content}</p>
      </div>
    </div>
  );
}

/* ── Vendor pill ─────────────────────────────────────────────── */
const VENDOR_ICONS = {
  Food: '⬡', Drinks: '⬡', Merchandise: '⬡', Attraction: '⬡',
};
const VENDOR_LABELS = {
  Food: 'Food', Drinks: 'Drinks', Merchandise: 'Merch', Attraction: 'Attractions',
};

/* ── Main component ──────────────────────────────────────────── */
export default function Home() {
  const [events,        setEvents]        = useState([]);
  const [vendors,       setVendors]       = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([getEvents(), getVendors(), getAnnouncements()])
      .then(([evRes, venRes, annRes]) => {
        setEvents(evRes.data.slice(0, 6));
        setVendors(venRes.data.slice(0, 8));
        setAnnouncements(annRes.data.slice(0, 4));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner text="Loading festival info..." />
    </div>
  );

  return (
    <div className="min-h-screen">

      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-4 md:px-6">
        {/* Subtle radial wash — not a glow, just a tonal shift */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(180,83,9,0.07) 0%, transparent 70%)',
          }}
          aria-hidden
        />

        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl animate-slide-up">

            {/* Event badge */}
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="eyebrow">Melbourne Showgrounds</span>
              <span className="text-surface-muted text-2xs">·</span>
              <span className="eyebrow">Aug 15–17, 2026</span>
            </div>

            {/* Main heading — editorial typographic treatment */}
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl xl:text-8xl text-ink-primary leading-[0.92] tracking-tight mb-6">
              Festival
              <br />
              <span className="text-brand-500">Hub</span>{' '}
              <span className="text-ink-tertiary text-4xl sm:text-5xl md:text-6xl">2026</span>
            </h1>

            <p className="text-base md:text-lg text-ink-secondary leading-relaxed max-w-lg mb-10">
              Three days of world-class music across three stages —
              live performances, food, and culture in the heart of Melbourne.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/booking" className="btn-primary btn-lg">
                Get Tickets
              </Link>
              <Link to="/events" className="btn-secondary btn-lg">
                View Schedule
              </Link>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-16 pt-8 border-t border-surface-border grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-10">
            {[
              { value: '14+',  label: 'Performances' },
              { value: '3',    label: 'Stages' },
              { value: '15+',  label: 'Vendors' },
              { value: '3',    label: 'Days' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="font-display text-3xl md:text-4xl text-ink-primary">{value}</div>
                <div className="text-xs text-ink-tertiary mt-0.5 uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Ticker ───────────────────────────────────────────── */}
      <Ticker />

      {/* ─── Main content grid ────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8 xl:gap-12">

            {/* Left: Events ─────────────────────────────────── */}
            <div className="lg:col-span-2">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="eyebrow mb-1">Lineup</p>
                  <h2 className="font-display text-2xl md:text-3xl text-ink-primary">Upcoming Performances</h2>
                </div>
                <Link to="/events" className="btn-ghost btn-sm text-ink-secondary hover:text-ink-primary shrink-0">
                  All events →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {events.map((ev, i) => <EventCard key={ev.id} event={ev} index={i} />)}
              </div>

              <div className="mt-4 sm:hidden">
                <Link to="/events" className="btn-secondary btn-md w-full">View full schedule</Link>
              </div>
            </div>

            {/* Right sidebar ─────────────────────────────────── */}
            <div className="space-y-6">

              {/* Announcements card */}
              {announcements.length > 0 && (
                <div className="card">
                  <div className="p-4 border-b border-surface-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-signal-success animate-pulse" />
                      <span className="text-xs font-semibold uppercase tracking-widest text-ink-tertiary">Live Updates</span>
                    </div>
                    <Link to="/announcements" className="text-2xs text-ink-tertiary hover:text-ink-secondary transition-colors">
                      All →
                    </Link>
                  </div>
                  <div className="p-4">
                    {announcements.map(ann => (
                      <AnnouncementStrip key={ann.id} ann={ann} />
                    ))}
                  </div>
                </div>
              )}

              {/* Vendors snapshot */}
              <div className="card p-4">
                <p className="eyebrow mb-4">Food & Vendors</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {vendors.slice(0, 6).map(v => (
                    <div key={v.id} className="flex items-center gap-2 p-2.5 rounded bg-surface-2 border border-surface-border">
                      <div className="w-5 h-5 rounded bg-brand-900/40 border border-brand-800/40 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-ink-primary font-medium truncate">{v.name}</p>
                        <p className="text-2xs text-ink-tertiary">{v.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/food-attractions" className="btn-secondary btn-sm w-full text-center">
                  Browse all vendors
                </Link>
              </div>

              {/* Map CTA */}
              <div className="card p-5 bg-surface-2">
                <p className="eyebrow mb-2">Navigate the festival</p>
                <h3 className="font-display text-xl text-ink-primary mb-2">Interactive Map</h3>
                <p className="text-xs text-ink-secondary leading-relaxed mb-4">
                  Find stages, food courts, merch, medical and parking — all on one map.
                </p>
                <Link to="/map" className="btn-secondary btn-sm w-full">Open Map</Link>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ─── Booking CTA ──────────────────────────────────────── */}
      <section className="section-sm px-4 md:px-6">
        <div className="container">
          <div className="border border-surface-border rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="eyebrow mb-2">Don't miss out</p>
              <h2 className="font-display text-2xl md:text-3xl text-ink-primary mb-1">Secure your spot now</h2>
              <p className="text-sm text-ink-secondary">General Admission and VIP tickets available.</p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link to="/booking" className="btn-primary btn-lg">Book Tickets</Link>
              <Link to="/contact" className="btn-secondary btn-lg">Get Help</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
