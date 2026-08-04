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

const CATEGORY_BADGE = {
  Electronic: 'badge-lavender', Pop: 'badge-coral',
  Rock:       'badge-gold',     Jazz: 'badge-sky',
  Reggae:     'badge-mint',     Dance: 'badge-lavender',
  Acoustic:   'badge-gold',     Family: 'badge-sky',
  Ceremony:   'badge-coral',    Wellness: 'badge-mint',
};

const ANNOUNCEMENT_STYLES = {
  warning: { bar: 'bg-amber-500',  text: 'text-amber-400', label: 'Warning' },
  alert:   { bar: 'bg-red-500',    text: 'text-red-400',   label: 'Alert' },
  info:    { bar: 'bg-blue-500',   text: 'text-blue-400',  label: 'Info' },
  success: { bar: 'bg-green-500',  text: 'text-green-400', label: 'Update' },
};

const TICKER_ITEMS = [
  'Upcoming Events',
  'Music Festivals',
  'Hackathons',
  'Workshops',
  'Art & Culture',
  'Food Markets',
  'Student Meetups',
  'Campus Gatherings',
];

function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="overflow-hidden border-y border-surface-border bg-surface-1/40 py-2.5 select-none">
      <div className="flex gap-0 animate-ticker whitespace-nowrap" style={{ width: 'max-content' }}>
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-6 px-6 text-sm font-bold text-ink-tertiary uppercase tracking-widest">
            {item}
            <span className="text-coral-500/50">✦</span>
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
  const badgeClass = CATEGORY_BADGE[event.category] || 'badge-default';

  // For visual flair, we assign a solid color banner based on index
  const banners = ['bg-coral-100', 'bg-sky-100', 'bg-gold-100', 'bg-lavender-100', 'bg-mint-100'];
  const bannerColor = banners[index % banners.length];

  return (
    <Link
      to={`/events/${event.id}`}
      className="card-interactive group block animate-fade-in flex flex-col"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className={`h-24 w-full ${bannerColor} shrink-0`} />
      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Category + tickets */}
        <div className="flex items-center justify-between">
          <span className={badgeClass}>
            {event.category}
          </span>
          {sold ? (
            <span className="badge badge-coral">Sold Out</span>
          ) : low ? (
            <span className="badge badge-gold">Few Left</span>
          ) : (
            <span className="text-xs font-semibold text-ink-tertiary">{event.tickets_available} left</span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-display text-lg text-ink-primary font-bold leading-snug group-hover:text-coral-500 transition-colors duration-200 line-clamp-2 mt-1">
          {event.title}
        </h3>

        {/* Meta row */}
        <div className="flex flex-col gap-1 mt-auto pt-4 border-t border-surface-border">
          <span className="text-sm font-semibold text-ink-secondary">📍 {event.stage}</span>
          <span className="text-sm text-ink-tertiary">📅 {formatDate(event.event_date)} • {formatTime(event.start_time)}</span>
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
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 md:px-6 overflow-hidden">
        {/* Decorative Floating Elements */}
        <div className="absolute top-[15%] left-[5%] text-4xl animate-float-slow select-none opacity-80" aria-hidden>🌸</div>
        <div className="absolute top-[10%] right-[10%] text-5xl animate-float-med select-none opacity-70" aria-hidden>🎈</div>
        <div className="absolute bottom-[20%] left-[15%] text-3xl animate-float-fast select-none opacity-60" aria-hidden>✨</div>
        <div className="absolute bottom-[10%] right-[5%] text-4xl animate-float-med select-none opacity-80" aria-hidden>🎊</div>
        
        {/* Soft Background Blob */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-coral-100/30 via-transparent to-sky-100/30 pointer-events-none" aria-hidden />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="max-w-3xl mx-auto animate-slide-up">

            {/* Event badge */}
            <div className="inline-flex items-center gap-2 mb-6 bg-white px-4 py-1.5 rounded-full shadow-soft border border-surface-border">
              <span className="text-xl">🎓</span>
              <span className="text-sm font-bold text-ink-secondary">Discover Campus Life</span>
            </div>

            {/* Main heading */}
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-ink-primary leading-[1.15] tracking-tight mb-6">
              Celebrate Every
              <br />
              <span className="text-coral-500">Campus Moment</span>
            </h1>

            <p className="text-lg md:text-xl text-ink-secondary leading-relaxed max-w-2xl mx-auto mb-10 font-medium text-balance">
              Discover festivals, hackathons, concerts, workshops, and unforgettable memories curated just for you.
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
          <div className="mt-16 pt-10 border-t border-surface-border grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-10">
            {[
              { value: '25+',  label: 'Active Clubs' },
              { value: '100+', label: 'Events Yearly' },
              { value: '5k+',  label: 'Students' },
              { value: '1',    label: 'Community' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="font-display text-4xl md:text-5xl text-coral-500 font-bold mb-2">{value}</div>
                <div className="text-sm font-bold text-ink-secondary tracking-widest uppercase">{label}</div>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <span className="w-2 h-2 rounded-full bg-coral-500 animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-widest text-ink-secondary">Live Updates</span>
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
                    <div key={v.id} className="flex items-center gap-2 p-2.5 rounded-2xl bg-surface-2 border border-surface-border transition-transform hover:-translate-y-0.5">
                      <div className="text-xl shrink-0">{VENDOR_ICONS[v.category] || '⛺'}</div>
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
      <section className="section-sm px-4 md:px-6 relative overflow-hidden">
        <div className="container">
          <div className="bg-coral-100 rounded-[2rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-soft relative overflow-hidden text-center md:text-left">
            <div className="relative z-10">
              <span className="badge badge-coral mb-4 text-sm px-4 py-1.5">Don't miss out</span>
              <h2 className="font-display text-3xl md:text-5xl text-coral-600 mb-4 font-bold">Secure your spot now</h2>
              <p className="text-lg text-coral-500/80 font-semibold">Join thousands of students creating unforgettable memories.</p>
            </div>
            <div className="relative z-10 flex flex-wrap justify-center gap-4 shrink-0">
              <Link to="/booking" className="btn-primary btn-lg shadow-lift">Book Tickets Now</Link>
              <Link to="/contact" className="btn-secondary btn-lg bg-white/50 border-coral-200 text-coral-600 hover:border-coral-300">Get Help</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
