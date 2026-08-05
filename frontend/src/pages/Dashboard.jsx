import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents, getVendors, getAnnouncements } from '../services/api';
import { LoadingSpinner } from '../components/UI';
import { motion } from 'framer-motion';
import { Utensils, Coffee, ShoppingBag, Map, MapPin, Calendar, Clock, Ticket } from 'lucide-react';

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

const CATEGORY_IMAGES = {
  Electronic: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
  Pop:        'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&q=80',
  Rock:       'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&q=80',
  Jazz:       'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&q=80',
  Reggae:     'https://images.unsplash.com/photo-1440407876336-54a8b792bfe8?w=600&q=80',
  Dance:      'https://images.unsplash.com/photo-1547153760-18fc86324498?w=600&q=80',
  Acoustic:   'https://images.unsplash.com/photo-1510915361894-faa8b2d15328?w=600&q=80',
  Family:     'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600&q=80',
  Ceremony:   'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80',
  Wellness:   'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
};

const DEFAULT_EVENT_IMAGE = 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80';

const ANNOUNCEMENT_STYLES = {
  warning: { bar: 'bg-amber-500',  text: 'text-amber-400', label: 'Warning' },
  alert:   { bar: 'bg-red-500',    text: 'text-red-400',   label: 'Alert' },
  info:    { bar: 'bg-blue-500',   text: 'text-blue-400',  label: 'Info' },
  success: { bar: 'bg-green-500',  text: 'text-green-400', label: 'Update' },
};

/* ── Event card ──────────────────────────────────────────────── */
function EventCard({ event, index }) {
  const low  = event.tickets_available < 30;
  const sold = event.tickets_available === 0;
  const badgeClass = CATEGORY_BADGE[event.category] || 'badge-default';
  
  const imageUrl = event.image_url || CATEGORY_IMAGES[event.category] || DEFAULT_EVENT_IMAGE;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease: "easeOut", delay: index * 0.15 }}
    >
      <Link
        to={`/events/${event.id}`}
        className="card group block flex flex-col h-full bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-coral-500/10 border border-surface-border overflow-hidden"
      >
        <div className="h-48 w-full shrink-0 relative overflow-hidden">
          <img 
            src={imageUrl} 
            alt={event.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
          
          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
            <span className={`badge ${badgeClass} shadow-soft backdrop-blur-md bg-white/90`}>
              {event.category}
            </span>
            {sold ? (
              <span className="badge badge-coral shadow-soft bg-white/90">Sold Out</span>
            ) : low ? (
              <span className="badge badge-gold shadow-soft bg-white/90">Few Left</span>
            ) : (
              <span className="text-xs font-bold text-white bg-black/50 px-2 py-1 rounded-md backdrop-blur-sm">
                <Ticket className="w-3 h-3 inline mr-1" />
                {event.tickets_available}
              </span>
            )}
          </div>
        </div>
        
        <div className="p-5 flex flex-col gap-3 flex-1">
          <h3 className="font-display text-xl text-ink-primary font-bold leading-snug group-hover:text-coral-500 transition-colors duration-200 line-clamp-2">
            {event.title}
          </h3>

          <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-surface-border">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink-secondary">
              <MapPin className="w-4 h-4 text-coral-500" />
              <span className="truncate">{event.stage}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-ink-tertiary">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(event.event_date)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{formatTime(event.start_time)}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Announcement strip ──────────────────────────────────────── */
function AnnouncementStrip({ ann }) {
  const style = ANNOUNCEMENT_STYLES[ann.type] || ANNOUNCEMENT_STYLES.info;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-surface-border last:border-0 hover:bg-surface-2/50 p-2 rounded-xl transition-colors">
      <div className={`w-1 h-full min-h-6 rounded-full shrink-0 mt-0.5 ${style.bar}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-2xs font-bold uppercase tracking-wider ${style.text}`}>{style.label}</span>
          <span className="text-2xs text-ink-tertiary font-medium">{ann.title}</span>
        </div>
        <p className="text-xs text-ink-secondary line-clamp-1">{ann.content}</p>
      </div>
    </div>
  );
}

/* ── Vendor pill ─────────────────────────────────────────────── */
const VENDOR_ICONS = {
  Food: Utensils, Drinks: Coffee, Merchandise: ShoppingBag, Attraction: Map,
};

const VENDOR_IMAGES = {
  Food: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&q=80',
  Drinks: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=200&q=80',
  Merchandise: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=200&q=80',
  Attraction: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=200&q=80',
};

/* ── Main component ──────────────────────────────────────────── */
export default function Dashboard() {
  const [events,        setEvents]        = useState([]);
  const [vendors,       setVendors]       = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([getEvents(), getVendors(), getAnnouncements()])
      .then(([evRes, venRes, annRes]) => {
        setEvents(evRes.data.slice(0, 6));
        setVendors(venRes.data.slice(0, 4));
        setAnnouncements(annRes.data.slice(0, 4));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-surface-0 pt-24 pb-20">
      {/* ─── Main content grid ────────────────────────────────── */}
      <section className="section bg-surface-0 relative">
        {/* Soft background decor */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-coral-100/40 via-transparent to-transparent pointer-events-none" />
        
        <div className="container relative z-10">
          <div className="mb-10">
            <h1 className="font-display text-4xl md:text-5xl text-ink-primary font-bold">Dashboard</h1>
            <p className="text-ink-secondary mt-2">Your hub for the festival's upcoming events, updates, and more.</p>
          </div>

          {loading ? (
            <div className="py-20">
              <LoadingSpinner text="Loading dashboard..." />
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-10 xl:gap-14">

            {/* Left: Events ─────────────────────────────────── */}
            <div className="lg:col-span-2">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="flex items-end justify-between mb-8"
              >
                <div>
                  <p className="eyebrow text-coral-500 mb-2">Lineup</p>
                  <h2 className="font-display text-3xl md:text-4xl text-ink-primary">Upcoming Events</h2>
                </div>
                <Link to="/events" className="btn-ghost btn-md text-ink-secondary hover:text-coral-500 shrink-0 hidden sm:inline-flex">
                  Explore all events →
                </Link>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {events.map((ev, i) => <EventCard key={ev.id} event={ev} index={i} />)}
              </div>

              <div className="mt-8 sm:hidden">
                <Link to="/events" className="btn-secondary btn-md w-full">Explore all events</Link>
              </div>
            </div>

            {/* Right sidebar ─────────────────────────────────── */}
            <div className="space-y-8">

              {/* Announcements card */}
              {announcements.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="card bg-white border border-surface-border shadow-md"
                >
                  <div className="p-5 border-b border-surface-border flex items-center justify-between bg-surface-1/50">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <span className="absolute -inset-1 rounded-full bg-coral-500 opacity-30 animate-ping" />
                        <span className="relative block w-2.5 h-2.5 rounded-full bg-coral-500" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-ink-primary">Live Updates</span>
                    </div>
                    <Link to="/announcements" className="text-xs font-semibold text-ink-tertiary hover:text-coral-500 transition-colors">
                      View all
                    </Link>
                  </div>
                  <div className="p-4 space-y-1">
                    {announcements.map(ann => (
                      <AnnouncementStrip key={ann.id} ann={ann} />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Vendors snapshot */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
                className="card p-6 bg-white border border-surface-border shadow-md"
              >
                <div className="flex items-center justify-between mb-5">
                  <p className="eyebrow text-gold-500 mb-0">Food & Vendors</p>
                  <Utensils className="w-5 h-5 text-gold-500/50" />
                </div>
                <div className="grid grid-cols-1 gap-3 mb-6">
                  {vendors.slice(0, 4).map(v => {
                    const Icon = VENDOR_ICONS[v.category] || Utensils;
                    const vImage = VENDOR_IMAGES[v.category] || VENDOR_IMAGES.Food;
                    return (
                      <Link key={v.id} to="/food-attractions" className="group flex items-center gap-4 p-3 rounded-2xl bg-surface-1 hover:bg-white border border-transparent hover:border-surface-border hover:shadow-md transition-all">
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-sm relative">
                           <img src={vImage} alt={v.category} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                           <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-ink-primary font-bold truncate group-hover:text-coral-500 transition-colors">{v.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Icon className="w-3 h-3 text-ink-tertiary" />
                            <p className="text-xs text-ink-secondary">{v.category}</p>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
                <Link to="/food-attractions" className="btn-secondary btn-md w-full bg-surface-1 border-transparent hover:border-surface-border">
                  Browse all vendors
                </Link>
              </motion.div>

              {/* Map CTA */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
                className="card p-8 bg-gradient-to-br from-sky-50 to-white border border-sky-100 shadow-md relative overflow-hidden group"
              >
                <Map className="absolute -bottom-4 -right-4 w-32 h-32 text-sky-200/50 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-700" />
                <div className="relative z-10">
                  <p className="eyebrow text-sky-500 mb-2">Navigate the festival</p>
                  <h3 className="font-display text-2xl text-ink-primary mb-3">Interactive Map</h3>
                  <p className="text-sm text-ink-secondary leading-relaxed mb-6 font-medium">
                    Find stages, food courts, merch, medical and parking — all effortlessly on one map.
                  </p>
                  <Link to="/map" className="btn-secondary btn-md w-full border-sky-200 hover:border-sky-300 hover:text-sky-600 bg-white">
                    <MapPin className="w-4 h-4 mr-1" />
                    Open Map
                  </Link>
                </div>
              </motion.div>

            </div>
          </div>
          )}
        </div>
      </section>
    </div>
  );
}
