import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getEvent } from '../services/api';
import { LoadingSpinner, ErrorMessage } from '../components/UI';

const CATEGORY_COLOR = {
  Electronic: 'text-blue-400',   Pop:     'text-pink-400',
  Rock:       'text-orange-400', Jazz:    'text-amber-400',
  Reggae:     'text-green-400',  Dance:   'text-purple-400',
  Acoustic:   'text-teal-400',   Family:  'text-sky-400',
  Ceremony:   'text-brand-400',  Wellness:'text-emerald-400',
};

function BackArrow() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  );
}

function DetailItem({ label, value, highlight }) {
  return (
    <div className="p-4 bg-surface-2 border border-surface-border rounded-lg">
      <p className="eyebrow mb-1">{label}</p>
      <p className={`text-sm font-medium ${highlight ? 'text-signal-danger' : 'text-ink-primary'}`}>
        {value}
      </p>
    </div>
  );
}

export default function EventDetail() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [event,   setEvent]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    getEvent(id)
      .then(r => setEvent(r.data))
      .catch(e => setError(e.response?.data?.error || e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="pt-24"><LoadingSpinner /></div>;
  if (error)   return <div className="pt-24"><ErrorMessage message={error} /></div>;
  if (!event)  return null;

  const date   = new Date(event.event_date);
  const low    = event.tickets_available < 30;
  const sold   = event.tickets_available === 0;
  const catColor = CATEGORY_COLOR[event.category] || 'text-ink-secondary';

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 md:px-6">

        {/* Back */}
        <div className="py-6 border-b border-surface-border mb-8">
          <button
            onClick={() => navigate(-1)}
            className="btn-ghost btn-sm gap-2 -ml-1.5 text-ink-secondary"
          >
            <BackArrow />
            Back
          </button>
        </div>

        {/* Header */}
        <div className="animate-slide-up mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`text-2xs font-semibold uppercase tracking-widest ${catColor}`}>
              {event.category}
            </span>
            {sold && <span className="chip chip-danger">Sold Out</span>}
            {low && !sold && <span className="chip chip-warning">Selling Fast</span>}
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-ink-primary leading-tight mb-4">
            {event.title}
          </h1>

          <p className="text-ink-secondary leading-relaxed max-w-2xl">
            {event.description}
          </p>
        </div>

        {/* Detail grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <DetailItem
            label="Date"
            value={date.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })}
          />
          <DetailItem
            label="Time"
            value={`${event.start_time?.slice(0,5)} – ${event.end_time?.slice(0,5) || 'TBC'}`}
          />
          <DetailItem
            label="Stage"
            value={event.stage || 'TBC'}
          />
          <DetailItem
            label="Tickets"
            value={sold ? 'Sold Out' : `${event.tickets_available} remaining`}
            highlight={sold}
          />
          <DetailItem
            label="Cost"
            value={event.is_free ? 'Free' : `Gen: $${Number(event.general_price).toFixed(2)} | VIP: $${Number(event.vip_price).toFixed(2)}`}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-10 pb-10 border-b border-surface-border">
          {sold ? (
            <button disabled className="btn-primary btn-lg opacity-40 cursor-not-allowed">
              Sold Out
            </button>
          ) : (
            <Link to={`/booking?event=${event.id}`} id="book-tickets-btn" className="btn-primary btn-lg">
              Book Tickets
            </Link>
          )}
          <Link to="/events" className="btn-secondary btn-lg">
            ← All Events
          </Link>
        </div>

        {/* Info cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              label: 'Live Performance',
              body:  'Experience this event live with thousands of fellow festival-goers in an intimate outdoor atmosphere.',
            },
            {
              label: 'Food & Drinks',
              body:  '15+ vendors serving street food, craft drinks, and specialty coffee across the festival grounds.',
            },
            {
              label: 'Getting There',
              body:  'Shuttle buses depart Melbourne CBD every 30 min from 3 PM. Parking at Gate A (pre-booked only).',
            },
          ].map(({ label, body }) => (
            <div key={label} className="card p-5">
              <p className="eyebrow mb-2">{label}</p>
              <p className="text-xs text-ink-secondary leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
