import { useState, useEffect, useRef } from 'react';
import { getEvents } from '../services/api';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../components/UI';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const STAGES = ['All Stages', 'Main Stage', 'Dance Arena', 'Garden Stage', 'Family Zone'];

const createCustomIcon = (colorClass) => {
  return L.divIcon({
    className: 'bg-transparent border-none',
    html: `
      <div class="relative w-10 h-10 flex items-center justify-center transition-transform hover:scale-110">
        <div class="absolute inset-0 bg-white rounded-full shadow-lift flex items-center justify-center ${colorClass}">
          <span class="text-xl">📍</span>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -45]
  });
};

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
    <div onClick={() => onClick(event)} className="group relative block overflow-hidden cursor-pointer flex flex-col h-full bg-surface-0 rounded-3xl border border-surface-border/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2">
      {/* Decorative Blur Element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-[50px] group-hover:bg-coral-500/20 transition-colors duration-500"></div>

      {/* Modern Image Header */}
      <div className="relative h-56 w-full overflow-hidden p-3 z-10">
        <div 
          className={`relative w-full h-full rounded-2xl overflow-hidden ${gradientClass}`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
            style={{ backgroundImage: bgImage }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
          
          {/* Top Chips */}
          <div className="absolute top-3 right-3 flex gap-2 z-20">
            {sold ? (
              <span className="backdrop-blur-md bg-red-500/80 text-white font-bold uppercase tracking-widest text-[9px] px-3 py-1.5 rounded-full shadow-sm">Sold Out</span>
            ) : low ? (
              <span className="backdrop-blur-md bg-amber-500/80 text-white font-bold uppercase tracking-widest text-[9px] px-3 py-1.5 rounded-full shadow-sm">Few Left</span>
            ) : null}
          </div>

          {/* Bottom Left Category inside Image */}
          <div className="absolute bottom-3 left-3 z-20">
             <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm border ${
               hasImage ? 'bg-black/30 text-white border-white/20' : catStyle
             }`}>
              {event.category}
            </span>
          </div>
        </div>
      </div>
      
      <div className="px-6 pb-6 pt-2 flex-1 flex flex-col z-10 relative">
        <h3 className="font-display text-2xl text-ink-primary font-black leading-tight group-hover:text-brand-500 transition-colors duration-300 mb-3 line-clamp-2">
          {event.title}
        </h3>

        <div className="grid grid-cols-2 gap-y-2 text-xs font-semibold text-ink-tertiary mb-4">
          <span className="flex items-center gap-1.5"><span className="text-xl leading-none">📅</span> {formatDateShort(event.event_date)}</span>
          <span className="flex items-center gap-1.5"><span className="text-xl leading-none">⏰</span> {formatTime(event.start_time)}</span>
          <span className="flex items-center gap-1.5 col-span-2"><span className="text-xl leading-none">📍</span> <span className="truncate">{event.stage}</span></span>
        </div>

        <p className="text-sm text-ink-secondary/80 line-clamp-2 leading-relaxed mb-6 flex-1 font-medium">
          {event.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-surface-border/50 mt-auto">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-ink-tertiary uppercase tracking-widest mb-0.5">Tickets</span>
            <span className="text-lg font-black text-ink-primary leading-none">
              {event.is_free ? 'Free' : `From $${Number(event.general_price).toFixed(2)}`}
            </span>
          </div>
          {!sold && (
            <div className="w-10 h-10 rounded-full bg-surface-1 flex items-center justify-center text-ink-secondary group-hover:bg-brand-500 group-hover:text-white transition-colors duration-300 shadow-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



/* ── Event Modal ─────────────────────────────────────────────── */
function EventModal({ event, onClose }) {
  const [showMap, setShowMap] = useState(false);
  
  // Reset map view when opening a new event
  useEffect(() => {
    setShowMap(false);
  }, [event]);

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

        {/* Hero Area (Image or Map) */}
        <div 
          className={`h-72 sm:h-96 w-full relative shrink-0 rounded-t-[2rem] overflow-hidden ${gradientClass} transition-all duration-500`}
        >
          {showMap && event.latitude && event.longitude ? (
            <div className="absolute inset-0 z-10 animate-fade-in">
              <MapContainer 
                center={[event.latitude, event.longitude]} 
                zoom={17} 
                scrollWheelZoom={false} 
                className="w-full h-full"
              >
                <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                <Marker 
                  position={[event.latitude, event.longitude]}
                  icon={createCustomIcon('text-brand-500 bg-brand-50')}
                >
                  <Popup className="rounded-xl overflow-hidden shadow-lift border-none">
                    <div className="font-display font-bold text-ink-primary text-base mb-1">{event.title}</div>
                    <div className="text-xs font-bold text-brand-500 mb-1">{event.stage}</div>
                    <div className="text-xs font-medium text-ink-secondary">{event.category}</div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          ) : (
            <>
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105 hover:scale-100" style={{ backgroundImage: bgImage }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-surface-0 via-surface-0/40 to-transparent"></div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="px-8 pb-8 pt-0 relative z-10 flex-1 flex flex-col -mt-16 sm:-mt-24 pointer-events-none">
          <div className="flex flex-wrap gap-2 mb-4 pointer-events-auto">
            <span className="badge badge-primary shadow-sm backdrop-blur-md bg-surface-0/80 px-3 py-1 text-xs">{event.category}</span>
            {sold && <span className="badge badge-coral shadow-sm backdrop-blur-md bg-surface-0/80 px-3 py-1 text-xs">Sold Out</span>}
          </div>

          <h2 className="font-display font-extrabold text-4xl sm:text-6xl text-ink-primary leading-tight mb-6 drop-shadow-sm">{event.title}</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-semibold text-ink-secondary mb-8 bg-surface-0/80 backdrop-blur-xl p-5 rounded-2xl border border-surface-border shadow-soft">
            <div className="flex flex-col gap-1">
              <span className="text-xl">📅</span>
              <span className="text-ink-primary font-bold">{formatDate(event.event_date)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xl">⏰</span>
              <span className="text-ink-primary font-bold">{formatTime(event.start_time)} {event.end_time && `– ${formatTime(event.end_time)}`}</span>
            </div>
            <button onClick={() => { if(event.latitude && event.longitude) setShowMap(true); }} className="flex flex-col gap-1 group cursor-pointer hover:bg-surface-1 p-2 -m-2 rounded-xl transition-colors pointer-events-auto text-left">
              <span className="text-xl group-hover:scale-110 transition-transform origin-bottom">📍</span>
              <span className="text-ink-primary font-bold group-hover:text-brand-500 transition-colors flex items-center gap-1">
                {event.stage}
                {event.latitude && event.longitude && (
                  <svg className="w-3 h-3 text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                )}
              </span>
            </button>
            <div className="flex flex-col gap-1">
              <span className="text-xl">🎟️</span>
              <span className="text-ink-primary font-bold">{event.is_free ? 'Free' : `Gen: $${Number(event.general_price).toFixed(2)} | VIP: $${Number(event.vip_price).toFixed(2)}`}</span>
            </div>
          </div>

          <div className="prose prose-sm sm:prose-base text-ink-secondary leading-relaxed mb-8 break-words max-w-full pointer-events-auto">
            <p className="text-lg leading-relaxed">{event.description}</p>
          </div>

          <div className="mt-auto pt-6 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto">
            <div className="text-base font-bold text-ink-secondary bg-surface-1 px-4 py-2 rounded-xl flex-1 text-center sm:text-left">
              Tickets: <span className={sold ? 'text-coral-500 font-extrabold' : 'text-mint-600 font-extrabold'}>{event.tickets_available}</span>
            </div>
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
              <button 
                onClick={() => setShowMap(!showMap)} 
                disabled={!event.latitude || !event.longitude}
                className="btn-secondary btn-lg shadow-sm shrink-0 w-full sm:w-auto text-center flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{showMap ? '🖼️' : '📍'}</span> {showMap ? 'Hide Map' : 'View on Map'}
              </button>
              {event.is_free ? (
                <div className="flex items-center gap-2 px-4 py-3 bg-surface-1/50 rounded-xl text-ink-primary border border-surface-border/50 text-sm font-bold w-full sm:w-auto text-center justify-center shadow-sm">
                  🎟️ Free Entry • First come, first served (Limit 100)
                </div>
              ) : !sold && (
                <a href={`/booking?event=${event.id}`} className="btn-primary btn-lg shadow-[0_8px_20px_-8px_rgba(251,113,133,0.6)] hover:shadow-[0_12px_25px_-8px_rgba(251,113,133,0.8)] shrink-0 w-full sm:w-auto text-center">
                  Book Ticket Now
                </a>
              )}
            </div>
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
    <div className="min-h-screen pt-24 pb-20 bg-surface-50 relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface-1 via-surface-0 to-surface-0">
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-brand-500/5 to-transparent pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        
        {/* Compact Header & Controls Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 animate-slide-up">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl md:text-5xl font-black text-ink-primary tracking-tight mb-3">
              Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-coral-500">Events</span>
            </h1>
            <p className="text-ink-secondary text-base md:text-lg font-medium leading-relaxed">
              Discover breathtaking performances, workshops, and gatherings across the festival.
            </p>
          </div>

          {/* Integrated Search & Filter Button */}
          <div className="flex-1 w-full lg:max-w-md flex flex-col justify-end">
            <div className="flex gap-3 items-center w-full bg-surface-0 p-2 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-surface-border/50">
              <div className="relative flex-1 group">
                <svg className="w-5 h-5 text-ink-tertiary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-brand-500 transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7 7 0 1116.65 16.65z" />
                </svg>
                <input
                  type="search"
                  placeholder="Search events, stages..."
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-1/50 border-transparent focus:bg-surface-0 focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 rounded-xl text-sm font-medium transition-all outline-none"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                  showFilters || stage !== 'All Stages' || day 
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20' 
                    : 'bg-surface-1 text-ink-secondary hover:bg-surface-2'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="hidden sm:inline">Filters</span>
                {(stage !== 'All Stages' || day) && (
                  <span className="w-2 h-2 rounded-full bg-white shadow-sm"></span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Filter Panel */}
        {showFilters && (
          <div className="bg-surface-0 p-6 rounded-3xl shadow-soft border border-surface-border/50 mb-10 animate-fade-in flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Stages */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-bold text-ink-tertiary uppercase tracking-widest">Stage</p>
                  {stage !== 'All Stages' && (
                    <button onClick={() => setStage('All Stages')} className="text-xs text-brand-500 font-bold hover:underline">Clear</button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {STAGES.map(s => (
                    <button
                      key={s}
                      onClick={() => setStage(s)}
                      className={`px-4 py-2 rounded-xl font-semibold text-xs transition-all duration-200 border ${
                        stage === s 
                          ? 'bg-ink-primary border-ink-primary text-white shadow-md shadow-ink-primary/20 scale-[1.02]' 
                          : 'bg-surface-0 border-surface-border text-ink-secondary hover:bg-surface-1 hover:border-ink-tertiary'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px bg-surface-border/50"></div>

              {/* Dates */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-bold text-ink-tertiary uppercase tracking-widest">Date</p>
                  {day && (
                    <button onClick={() => setDay('')} className="text-xs text-brand-500 font-bold hover:underline">Clear</button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {dynamicDays.map(d => (
                    <button
                      key={d.value}
                      onClick={() => setDay(d.value)}
                      className={`px-4 py-2 rounded-xl font-semibold text-xs transition-all duration-200 border ${
                        day === d.value 
                          ? 'bg-brand-500 border-brand-500 text-white shadow-md shadow-brand-500/20 scale-[1.02]' 
                          : 'bg-surface-0 border-surface-border text-ink-secondary hover:bg-surface-1 hover:border-ink-tertiary'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in">
            {events.map(ev => <EventCard key={ev.id} event={ev} onClick={setSelectedEvent} />)}
          </div>
        )}
      </div>

      {/* Modal */}
      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
