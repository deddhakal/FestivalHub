import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getEvents, createBooking } from '../services/api';
import { LoadingSpinner } from '../components/UI';

/* ── Confirmation ────────────────────────────────────────────── */
function ConfirmationView({ booking, event, onReset }) {
  return (
    <div className="min-h-screen pt-20 pb-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full animate-scale-in">
        <div className="card p-8 text-center">

          {/* Success mark */}
          <div className="w-14 h-14 rounded-full bg-green-950/60 border border-green-900/40 flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-signal-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="font-display text-2xl text-ink-primary mb-1">Booking Confirmed</h2>
          <p className="text-sm text-ink-secondary mb-8">
            Your tickets are reserved. See you at the festival.
          </p>

          {/* Reference number */}
          <div className="bg-surface-2 border border-surface-border rounded-lg p-4 mb-6 text-left space-y-3">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <span className="eyebrow">Reference</span>
              <span className="ref-code">{booking.booking_ref}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-tertiary">Event</span>
              <span className="text-ink-primary font-medium text-right max-w-[60%]">{booking.event}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-tertiary">Ticket</span>
              <span className="text-ink-primary font-medium">{booking.ticket_type}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-tertiary">Quantity</span>
              <span className="text-ink-primary font-medium">
                {booking.quantity} ticket{booking.quantity > 1 ? 's' : ''}
              </span>
            </div>
            {event && (
              <div className="flex justify-between text-sm">
                <span className="text-ink-tertiary">Date</span>
                <span className="text-ink-primary font-medium">
                  {new Date(event.event_date).toLocaleDateString('en-AU', {
                    weekday: 'short', day: 'numeric', month: 'short',
                  })} · {event.start_time?.slice(0,5)}
                </span>
              </div>
            )}
          </div>

          {/* Save notice */}
          <div className="alert-warning mb-6 text-xs rounded">
            Save your reference number <strong>{booking.booking_ref}</strong> — you'll need it at the gate.
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <button onClick={onReset} className="btn-secondary btn-md flex-1">
              Book Another
            </button>
            <Link to="/events" className="btn-primary btn-md flex-1">
              View Schedule
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Booking form ────────────────────────────────────────────── */
export default function Booking() {
  const [searchParams]   = useSearchParams();
  const [events,         setEvents]      = useState([]);
  const [loading,        setLoading]     = useState(true);
  const [submitting,     setSubmitting]  = useState(false);
  const [confirmed,      setConfirmed]   = useState(null);
  const [selectedEvent,  setSelectedEvent] = useState(null);
  const [errors,         setErrors]      = useState({});

  const [form, setForm] = useState({
    event_id:      searchParams.get('event') || '',
    visitor_name:  '',
    visitor_email: '',
    ticket_type:   'General',
    quantity:      1,
  });

  useEffect(() => {
    getEvents()
      .then(r => {
        const available = r.data.filter(e => e.tickets_available > 0);
        setEvents(available);
        if (form.event_id) {
          setSelectedEvent(available.find(e => String(e.id) === String(form.event_id)) || null);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const update = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
    if (field === 'event_id') {
      setSelectedEvent(events.find(e => String(e.id) === String(value)) || null);
    }
  };

  const validate = () => {
    const e = {};
    if (!form.event_id)               e.event_id      = 'Please select an event';
    if (!form.visitor_name.trim())    e.visitor_name  = 'Name is required';
    if (!form.visitor_email.trim())   e.visitor_email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.visitor_email))
                                      e.visitor_email = 'Invalid email address';
    if (form.quantity < 1 || form.quantity > 10)
                                      e.quantity      = 'Quantity must be between 1 and 10';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const res = await createBooking({ ...form, quantity: Number(form.quantity) });
      setConfirmed({ ...res.data, ticket_type: form.ticket_type, quantity: form.quantity });
    } catch (err) {
      setErrors({ submit: err.response?.data?.error || 'Booking failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <ConfirmationView
        booking={confirmed}
        event={selectedEvent}
        onReset={() => {
          setConfirmed(null);
          setForm({ event_id: '', visitor_name: '', visitor_email: '', ticket_type: 'General', quantity: 1 });
          setSelectedEvent(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Page header */}
        <div className="py-10 md:py-14 border-b border-surface-border mb-10 animate-slide-up">
          <p className="eyebrow mb-3">Reserve your spot</p>
          <h1 className="font-display text-4xl md:text-5xl text-ink-primary mb-2">Book Tickets</h1>
          <p className="text-sm text-ink-secondary">Select your event and ticket type to continue.</p>
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="grid lg:grid-cols-5 gap-10 xl:gap-16">

            {/* Form — 3 cols */}
            <form
              onSubmit={handleSubmit}
              className="lg:col-span-3 space-y-6"
              noValidate
            >
              {/* Event selection */}
              <div>
                <label htmlFor="booking-event" className="field-label">Event *</label>
                <select
                  id="booking-event"
                  className={errors.event_id ? 'field-input-error' : 'field-input'}
                  value={form.event_id}
                  onChange={e => update('event_id', e.target.value)}
                >
                  <option value="">Select an event…</option>
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id}>
                      {new Date(ev.event_date).toLocaleDateString('en-AU', { weekday:'short', day:'numeric', month:'short' })}
                      {' · '}{ev.start_time?.slice(0,5)}
                      {' — '}{ev.title}
                      {' ('}{ev.tickets_available} left{')'}
                    </option>
                  ))}
                </select>
                {errors.event_id && <p className="field-error">{errors.event_id}</p>}

                {/* Selected event preview */}
                {selectedEvent && (
                  <div className="mt-2.5 p-3.5 bg-surface-2 border border-surface-border rounded animate-fade-in">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-ink-primary font-medium">{selectedEvent.title}</p>
                        <p className="text-xs text-ink-tertiary mt-0.5">
                          {selectedEvent.stage} · {selectedEvent.start_time?.slice(0,5)}
                        </p>
                      </div>
                      <span className={`chip shrink-0 ${selectedEvent.tickets_available < 30 ? 'chip-warning' : 'chip-success'}`}>
                        {selectedEvent.tickets_available} left
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Ticket type */}
              <div>
                <p className="field-label mb-2">Ticket Type *</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { type: 'General', subtitle: 'Standard entry' },
                    { type: 'VIP',     subtitle: 'Premium access' },
                  ].map(({ type, subtitle }) => (
                    <button
                      key={type}
                      type="button"
                      id={`ticket-type-${type.toLowerCase()}`}
                      onClick={() => update('ticket_type', type)}
                      className={`p-4 rounded border-2 text-left transition-all duration-150 ${
                        form.ticket_type === type
                          ? 'border-brand-500 bg-brand-950/30'
                          : 'border-surface-border bg-surface-1 hover:border-surface-muted'
                      }`}
                    >
                      <p className="text-sm font-semibold text-ink-primary">{type}</p>
                      <p className="text-xs text-ink-tertiary mt-0.5">{subtitle}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Full name */}
              <div>
                <label htmlFor="booking-name" className="field-label">Full Name *</label>
                <input
                  id="booking-name"
                  type="text"
                  className={errors.visitor_name ? 'field-input-error' : 'field-input'}
                  placeholder="Jane Smith"
                  value={form.visitor_name}
                  onChange={e => update('visitor_name', e.target.value)}
                  autoComplete="name"
                />
                {errors.visitor_name && <p className="field-error">{errors.visitor_name}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="booking-email" className="field-label">Email Address *</label>
                <input
                  id="booking-email"
                  type="email"
                  className={errors.visitor_email ? 'field-input-error' : 'field-input'}
                  placeholder="jane@example.com"
                  value={form.visitor_email}
                  onChange={e => update('visitor_email', e.target.value)}
                  autoComplete="email"
                />
                {errors.visitor_email && <p className="field-error">{errors.visitor_email}</p>}
              </div>

              {/* Quantity */}
              <div>
                <p className="field-label">Number of Tickets *</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-surface-1 border border-surface-border rounded inline-flex">
                    <button
                      type="button"
                      onClick={() => update('quantity', Math.max(1, form.quantity - 1))}
                      className="w-9 h-9 flex items-center justify-center text-ink-secondary hover:text-ink-primary transition-colors"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="font-display text-xl text-ink-primary w-8 text-center tabular-nums">
                      {form.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => update('quantity', Math.min(10, form.quantity + 1))}
                      className="w-9 h-9 flex items-center justify-center text-ink-secondary hover:text-ink-primary transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-ink-tertiary">max 10 per booking</span>
                </div>
                {errors.quantity && <p className="field-error mt-1">{errors.quantity}</p>}
              </div>

              {/* Submit error */}
              {errors.submit && (
                <div className="alert-danger rounded text-sm">{errors.submit}</div>
              )}

              {/* Submit */}
              <button
                id="booking-submit"
                type="submit"
                disabled={submitting}
                className="btn-primary btn-lg w-full"
              >
                {submitting ? 'Confirming…' : 'Confirm Booking'}
              </button>
            </form>

            {/* Sidebar — 2 cols */}
            <aside className="lg:col-span-2 space-y-5">
              {/* Info card */}
              <div className="card p-5">
                <p className="eyebrow mb-3">What you need to know</p>
                <ul className="space-y-3">
                  {[
                    { label: 'Simulated booking', desc: 'No payment required. A booking reference is generated instantly.' },
                    { label: 'Bring your reference', desc: 'Present your booking ref at the gate on the day.' },
                    { label: 'Up to 10 tickets', desc: 'You can book up to 10 tickets per transaction.' },
                    { label: 'General vs VIP', desc: 'VIP includes premium viewing areas and dedicated entry.' },
                  ].map(({ label, desc }) => (
                    <li key={label} className="flex gap-3 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-600 mt-1.5 shrink-0" />
                      <div>
                        <span className="text-ink-primary font-medium">{label}</span>
                        <span className="text-ink-tertiary"> — {desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Lookup booking */}
              <div className="card p-5 bg-surface-2">
                <p className="eyebrow mb-2">Already booked?</p>
                <p className="text-xs text-ink-secondary mb-3">
                  Check your booking by looking up your reference number.
                </p>
                <Link to="/announcements" className="btn-secondary btn-sm w-full">
                  View Updates
                </Link>
              </div>
            </aside>

          </div>
        )}
      </div>
    </div>
  );
}
