import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../services/api';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../components/UI';

/* ── Constants ───────────────────────────────────────────────── */
const STAGES = ['All Stages', 'Main Stage', 'Dance Arena', 'Garden Stage', 'Family Zone'];
const DAYS = [
  { label: 'All Days',    value: '' },
  { label: 'Fri 15 Aug', value: '2026-08-15' },
  { label: 'Sat 16 Aug', value: '2026-08-16' },
  { label: 'Sun 17 Aug', value: '2026-08-17' },
];

const CATEGORY_COLOR = {
  Electronic: 'text-blue-400',   Pop:     'text-pink-400',
  Rock:       'text-orange-400', Jazz:    'text-amber-400',
  Reggae:     'text-green-400',  Dance:   'text-purple-400',
  Acoustic:   'text-teal-400',   Family:  'text-sky-400',
  Ceremony:   'text-brand-400',  Wellness:'text-emerald-400',
};

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
function EventCard({ event }) {
  const low  = event.tickets_available < 30;
  const sold = event.tickets_available === 0;
  const catColor = CATEGORY_COLOR[event.category] || 'text-ink-secondary';

  return (
    <Link to={`/events/${event.id}`} className="card-interactive group block">
      <div className="p-5">

        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className={`text-2xs font-semibold uppercase tracking-widest ${catColor}`}>
              {event.category}
            </span>
            <div className="text-2xs text-ink-tertiary mt-0.5">
              {formatDateShort(event.event_date)}
              {' · '}
              {formatTime(event.start_time)}
              {event.end_time ? ` – ${formatTime(event.end_time)}` : ''}
            </div>
          </div>
          {sold ? (
            <span className="chip chip-danger shrink-0">Sold Out</span>
          ) : low ? (
            <span className="chip chip-warning shrink-0">Few Left</span>
          ) : null}
        </div>

        {/* Title */}
        <h3 className="font-display text-lg text-ink-primary leading-snug group-hover:text-brand-400 transition-colors duration-200 mb-1">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-ink-secondary line-clamp-2 leading-relaxed mb-4">
          {event.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-surface-border">
          <span className="text-xs text-ink-tertiary">{event.stage}</span>
          {!sold && (
            <span className="text-2xs text-ink-tertiary">
              {event.tickets_available} tickets
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

/* ── Day section header ──────────────────────────────────────── */
function DayHeader({ date }) {
  return (
    <div className="flex items-center gap-4 mb-5 mt-10 first:mt-0">
      <div className="shrink-0">
        <div className="font-display text-2xl text-ink-primary">
          {new Date(date).toLocaleDateString('en-AU', { weekday: 'long' })}
        </div>
        <div className="text-xs text-ink-tertiary">
          {new Date(date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>
      <div className="h-px flex-1 bg-surface-border" />
    </div>
  );
}

/* ── Search icon ─────────────────────────────────────────────── */
function SearchIcon() {
  return (
    <svg className="w-4 h-4 text-ink-tertiary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7 7 0 1116.65 16.65z" />
    </svg>
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

  const isFiltered = debouncedSearch || day || stage !== 'All Stages';

  // Group by day
  const grouped = events.reduce((acc, ev) => {
    if (!acc[ev.event_date]) acc[ev.event_date] = [];
    acc[ev.event_date].push(ev);
    return acc;
  }, {});

  const hasActiveFilter = search || day || stage !== 'All Stages';

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Page header */}
        <div className="py-10 md:py-14 border-b border-surface-border mb-8 animate-slide-up">
          <p className="eyebrow mb-3">August 15–17, 2026</p>
          <h1 className="font-display text-4xl md:text-5xl text-ink-primary mb-2">Event Schedule</h1>
          <p className="text-ink-secondary text-sm">Browse all performances across our three stages.</p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-2.5 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <SearchIcon />
            <input
              id="events-search"
              type="search"
              placeholder="Search events or artists…"
              className="field-input pl-9"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search events"
            />
          </div>

          {/* Day */}
          <select
            id="events-day-filter"
            className="field-input sm:w-40"
            value={day}
            onChange={e => setDay(e.target.value)}
            aria-label="Filter by day"
          >
            {DAYS.map(d => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>

          {/* Stage */}
          <select
            id="events-stage-filter"
            className="field-input sm:w-44"
            value={stage}
            onChange={e => setStage(e.target.value)}
            aria-label="Filter by stage"
          >
            {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          {/* Clear */}
          {hasActiveFilter && (
            <button
              className="btn-secondary btn-sm shrink-0"
              onClick={() => { setSearch(''); setDay(''); setStage('All Stages'); }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Result count */}
        {!loading && !error && (
          <p className="text-xs text-ink-tertiary mb-6">
            {events.length} event{events.length !== 1 ? 's' : ''}
            {isFiltered ? ' matching your filters' : ''}
          </p>
        )}

        {/* Content */}
        {loading && <LoadingSpinner text="Loading schedule…" />}
        {error   && <ErrorMessage message={error} />}
        {!loading && !error && events.length === 0 && (
          <EmptyState title="No events found" subtitle="Try adjusting your search or filters." />
        )}

        {!loading && !error && events.length > 0 && (
          isFiltered ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-fade-in">
              {events.map(ev => <EventCard key={ev.id} event={ev} />)}
            </div>
          ) : (
            <div>
              {Object.entries(grouped).map(([date, dayEvents]) => (
                <div key={date}>
                  <DayHeader date={date} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-2">
                    {dayEvents.map(ev => <EventCard key={ev.id} event={ev} />)}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
