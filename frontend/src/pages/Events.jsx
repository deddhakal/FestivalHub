import { useState, useEffect, useRef } from 'react';
import { getEvents } from '../services/api';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../components/UI';

const STAGES = ['All Stages', 'Main Stage', 'Dance Arena', 'Garden Stage', 'Family Zone'];

const CATEGORY_COLOR = {
  Electronic: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  Pop:        'text-pink-400 bg-pink-500/10 border-pink-500/20',
  Rock:       'text-orange-400 bg-orange-500/10 border-orange-500/20',
  Jazz:       'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Reggae:     'text-green-400 bg-green-500/10 border-green-500/20',
  Dance:      'text-purple-400 bg-purple-500/10 border-purple-500/20',
  Acoustic:   'text-teal-400 bg-teal-500/10 border-teal-500/20',
  Family:     'text-sky-400 bg-sky-500/10 border-sky-500/20',
  Ceremony:   'text-brand-400 bg-brand-500/10 border-brand-500/20',
  Wellness:   'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

function getCategoryGradient(category) {
  const gradients = {
    Electronic: 'from-blue-500 to-indigo-600',
    Pop:        'from-pink-500 to-rose-600',
    Rock:       'from-orange-500 to-red-600',
    Jazz:       'from-amber-400 to-orange-500',
    Reggae:     'from-green-500 to-emerald-600',
    Dance:      'from-purple-500 to-fuchsia-600',
    Acoustic:   'from-teal-400 to-emerald-500',
    Family:     'from-sky-400 to-blue-500',
    Ceremony:   'from-brand-400 to-brand-600',
    Wellness:   'from-emerald-400 to-teal-500',
  };
  return gradients[category] || 'from-surface-3 to-surface-2';
}

function formatTime(t)   { return t?.slice(0, 5) ?? '—'; }
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-AU', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
}
function formatDateShort(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-AU', {
    weekday: 'short', day: 'numeric', month: 'short',
  });
}

/* ── Event card ──────────────────────────────────────────────── */
function EventCard({ event, onClick }) {
  const low  = event.tickets_available < 30 && event.tickets_available > 0;
  const sold = event.tickets_available === 0;
  const catStyle = CATEGORY_COLOR[event.category] || 'text-ink-secondary bg-surface-2 border-surface-border';
  
  const hasImage = !!event.image_url;
  const bgImage = hasImage ? `url(http://localhost:5000${event.image_url})` : 'none';
  const gradientClass = hasImage ? 'bg-surface-2' : `bg-gradient-to-br ${getCategoryGradient(event.category)}`;

  return (
    <div onClick={() => onClick(event)} className="card-interactive group block overflow-hidden cursor-pointer flex flex-col h-full bg-surface-1/50 backdrop-blur-md">
      {/* Rich Image Header */}
      <div 
        className={`h-40 w-full bg-cover bg-center relative transition-transform duration-500 group-hover:scale-105 ${gradientClass}`}
        style={{ backgroundImage: bgImage }}
      >
        {/* Chips top right */}
        <div className="absolute top-3 right-3 flex gap-2">
          {sold ? (
            <span className="chip chip-danger shadow-sm backdrop-blur-md bg-red-500/90 text-white border-0">Sold Out</span>
          ) : low ? (
            <span className="chip chip-warning shadow-sm backdrop-blur-md bg-amber-500/90 text-white border-0">Few Left</span>
          ) : null}
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col z-10 bg-surface-0">
        <div className="flex items-start justify-between gap-3 mb-2">
          <span className={`text-2xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border ${catStyle}`}>
            {event.category}
          </span>
        </div>

        <h3 className="font-display text-xl text-ink-primary font-bold leading-snug group-hover:text-coral-500 transition-colors duration-200 mb-1 line-clamp-2">
          {event.title}
        </h3>

        <div className="text-xs font-semibold text-ink-tertiary mb-3 flex items-center gap-2">
          <span>📅 {formatDateShort(event.event_date)}</span>
          <span>•</span>
          <span>⏰ {formatTime(event.start_time)} {event.end_time && `– ${formatTime(event.end_time)}`}</span>
        </div>

        <p className="text-sm text-ink-secondary line-clamp-2 leading-relaxed mb-4 flex-1 break-words">
          {event.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-surface-border">
          <span className="text-sm font-bold text-ink-secondary">📍 {event.stage}</span>
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-ink-primary">
              {event.is_free ? 'Free' : `From $${Number(event.general_price).toFixed(2)}`}
            </span>
            {!sold && (
              <span className="text-xs font-bold text-coral-500 mt-0.5">
                {event.tickets_available} tickets left
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



/* ── Event Modal ─────────────────────────────────────────────── */
function EventModal({ event, onClose }) {
  if (!event) return null;
  const sold = event.tickets_available === 0;
  const hasImage = !!event.image_url;
  const bgImage = hasImage ? `url(http://localhost:5000${event.image_url})` : 'none';
  const gradientClass = hasImage ? 'bg-surface-2' : `bg-gradient-to-br ${getCategoryGradient(event.category)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ink-primary/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="bg-surface-0 shadow-lift rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up relative flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-surface-0/80 backdrop-blur-md rounded-full flex items-center justify-center text-ink-secondary hover:text-ink-primary hover:bg-surface-2 transition-all shadow-sm"
        >
          ✕
        </button>

        {/* Hero Image */}
        <div 
          className={`h-64 sm:h-80 w-full bg-cover bg-center relative shrink-0 rounded-t-[2rem] ${gradientClass}`}
          style={{ backgroundImage: bgImage }}
        >
        </div>

        {/* Content */}
        <div className="px-8 pb-8 pt-8 relative z-10 flex-1 flex flex-col">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="badge badge-primary">{event.category}</span>
            {sold && <span className="badge badge-coral">Sold Out</span>}
          </div>

          <h2 className="font-display font-bold text-4xl sm:text-5xl text-ink-primary leading-tight mb-4">{event.title}</h2>
          
          <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-ink-secondary mb-6 bg-surface-1 p-4 rounded-2xl border border-surface-border">
            <div className="flex items-center gap-2">
              <span className="text-xl">📅</span>
              <span>{formatDate(event.event_date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">⏰</span>
              <span>{formatTime(event.start_time)} {event.end_time && `– ${formatTime(event.end_time)}`}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📍</span>
              <span>{event.stage}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🎟️</span>
              <span>{event.is_free ? 'Free' : `Gen: $${Number(event.general_price).toFixed(2)} | VIP: $${Number(event.vip_price).toFixed(2)}`}</span>
            </div>
          </div>

          <div className="prose prose-sm sm:prose-base text-ink-secondary leading-relaxed mb-8 break-words max-w-full">
            <p>{event.description}</p>
          </div>

          <div className="mt-auto pt-6 border-t border-surface-border flex items-center justify-between gap-4">
            <div className="text-sm font-bold text-ink-secondary">
              Tickets Available: <span className={sold ? 'text-coral-500' : 'text-mint-600'}>{event.tickets_available}</span>
            </div>
            {!sold && (
              <a href={`/booking?event=${event.id}`} className="btn-primary btn-lg shadow-lift shrink-0">
                Book Ticket
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────── */
export default function Events() {
  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [search,  setSearch]  = useState('');
  const [stage,   setStage]   = useState('All Stages');
  const [day,     setDay]     = useState('');
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search
  const searchTimeout = useRef(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(searchTimeout.current);
  }, [search]);

  useEffect(() => {
    const params = {};
    if (stage !== 'All Stages') params.stage  = stage;
    if (day)                    params.date   = day;
    if (debouncedSearch)        params.search = debouncedSearch;

    setLoading(true);
    getEvents(params)
      .then(r => setEvents(r.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [stage, day, debouncedSearch]);

  const uniqueDates = [...new Set(events.map(ev => ev.event_date))].sort();
  const dynamicDays = [
    { label: 'All Days', value: '' },
    ...uniqueDates.map(date => ({
      label: new Date(date).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' }),
      value: date
    }))
  ];

  return (
    <div className="min-h-screen pt-20 pb-16 bg-surface-1/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Page header */}
        <div className="py-8 md:py-12 text-center animate-slide-up">
          <h1 className="font-display text-5xl md:text-6xl font-bold text-ink-primary mb-4 tracking-tight">Explore Events</h1>
          <p className="text-ink-secondary text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Discover performances, workshops, and gatherings happening across the city.
          </p>
        </div>

        {/* Dynamic Filters */}
        <div className="bg-surface-0 border border-surface-border rounded-2xl p-4 mb-8 shadow-soft sticky top-20 z-30 backdrop-blur-xl bg-surface-0/80 flex flex-col">
          
          {/* Top Bar: Search + Filter Toggle */}
          <div className="flex gap-3 md:gap-4 items-center w-full">
            <div className="relative flex-1">
              <svg className="w-4 h-4 text-ink-tertiary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7 7 0 1116.65 16.65z" />
              </svg>
              <input
                type="search"
                placeholder="Search events…"
                className="field-input pl-10 bg-surface-1 border-transparent focus:bg-surface-0 focus:border-coral-500 rounded-full w-full m-0 py-2"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-colors border ${
                showFilters || stage !== 'All Stages' || day 
                  ? 'bg-ink-primary text-surface-0 border-ink-primary' 
                  : 'bg-surface-1 text-ink-secondary border-surface-border hover:bg-surface-2'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="hidden sm:inline">Filters</span>
              {(stage !== 'All Stages' || day) && (
                <span className="w-2 h-2 rounded-full bg-coral-500"></span>
              )}
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="flex flex-col gap-5 animate-fade-in border-t border-surface-border pt-5 mt-4">
              {/* Stages Pills */}
              <div>
                <p className="text-xs font-bold text-ink-tertiary uppercase tracking-widest mb-3">Filter by Stage</p>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide max-w-full">
                  {STAGES.map(s => (
                    <button
                      key={s}
                      onClick={() => setStage(s)}
                      className={`shrink-0 px-4 py-1.5 rounded-full font-semibold text-xs transition-all duration-200 border ${
                        stage === s 
                          ? 'bg-ink-primary border-ink-primary text-white shadow-md' 
                          : 'bg-transparent border-surface-border text-ink-secondary hover:bg-surface-1'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Days Pills */}
              <div>
                <p className="text-xs font-bold text-ink-tertiary uppercase tracking-widest mb-3">Filter by Date</p>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {dynamicDays.map(d => (
                    <button
                      key={d.value}
                      onClick={() => setDay(d.value)}
                      className={`shrink-0 px-5 py-1.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                        day === d.value 
                          ? 'bg-coral-500 text-white shadow-md shadow-coral-500/20' 
                          : 'bg-surface-1 text-ink-secondary hover:bg-surface-2'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {loading && (
          <div className="py-20 flex justify-center">
            <LoadingSpinner text="Loading schedule…" />
          </div>
        )}
        
        {error && <ErrorMessage message={error} />}
        
        {!loading && !error && events.length === 0 && (
          <EmptyState title="No events found" subtitle="Try adjusting your filters or search term." />
        )}

        {!loading && !error && events.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            {events.map(ev => <EventCard key={ev.id} event={ev} onClick={setSelectedEvent} />)}
          </div>
        )}
      </div>

      {/* Modal */}
      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
