import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getEvents, createBooking } from '../services/api';
import { LoadingSpinner } from '../components/UI';

import DigitalTicket from '../components/DigitalTicket';

/* ── Confirmation ────────────────────────────────────────────── */
function ConfirmationView({ booking, event, onReset }) {
  // Merge booking and event details for the ticket component
  const ticketData = {
    ...booking,
    event_title: event?.title || booking.event,
    event_date: event?.event_date,
    stage: event?.stage,
    start_time: event?.start_time
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex flex-col items-center justify-center px-4 md:px-6 bg-surface-0">
      
      <div className="max-w-3xl w-full animate-scale-in flex flex-col items-center">
        {/* Success mark */}
        <div className="w-16 h-16 rounded-full bg-mint-50 border border-mint-200 flex items-center justify-center mx-auto mb-6 no-print">
          <svg className="w-8 h-8 text-mint-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="font-display text-4xl font-black text-ink-primary mb-2 no-print text-center">Booking Confirmed!</h2>
        <p className="text-sm font-bold text-ink-secondary mb-10 no-print text-center">
          Your tickets are secured. Present this digital ticket at the entrance.
        </p>

        {/* Toolbar */}
        <div className="flex gap-3 mb-6 w-full justify-end no-print">
          <button onClick={() => window.print()} className="btn-secondary">
            📥 Download PDF
          </button>
        </div>

        {/* Digital Ticket */}
        <div className="w-full mb-10">
          <DigitalTicket ticket={ticketData} />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md no-print">
          <button onClick={onReset} className="btn-secondary btn-lg flex-1">
            Book Another
          </button>
          <Link to="/" className="btn-primary btn-lg flex-1 text-center">
            Back to Home
          </Link>
        </div>
      </div>

    </div>
  );
}

/* ── Checkout Steps ──────────────────────────────────────────── */
const STEP_ICONS = {
  1: '🎫',
  2: '👤',
  3: '💳'
};

/* ── Main Booking Component ──────────────────────────────────── */
export default function Booking() {
  const [searchParams]   = useSearchParams();
  const [events,         setEvents]      = useState([]);
  const [loading,        setLoading]     = useState(true);
  const [submitting,     setSubmitting]  = useState(false);
  const [confirmed,      setConfirmed]   = useState(null);
  const [selectedEvent,  setSelectedEvent] = useState(null);
  
  // Checkout State
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    event_id:      searchParams.get('event') || '',
    visitor_name:  '',
    visitor_email: '',
    ticket_type:   'General',
    quantity:      1,
    // Payment mock fields
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: ''
  });

  const getTicketPrice = (type) => {
    if (!selectedEvent || selectedEvent.is_free) return 0;
    return type === 'VIP' ? Number(selectedEvent.vip_price) : Number(selectedEvent.general_price);
  };

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

  const validateStep1 = () => {
    const e = {};
    if (!form.event_id) e.event_id = 'Please select an event to attend';
    if (form.quantity < 1 || form.quantity > 10) e.quantity = 'Select between 1 and 10 tickets';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.visitor_name.trim()) e.visitor_name = 'Full name is required';
    if (!form.visitor_email.trim()) e.visitor_email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.visitor_email)) e.visitor_email = 'Please enter a valid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    const e = {};
    if (!form.cardName.trim()) e.cardName = 'Name on card is required';
    if (form.cardNumber.replace(/\s/g, '').length < 15) e.cardNumber = 'Valid card number required';
    if (form.cardExpiry.length < 5) e.cardExpiry = 'Valid expiry (MM/YY) required';
    if (form.cardCvc.length < 3) e.cardCvc = 'CVC required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) setStep(2);
    if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;
    
    setSubmitting(true);
    try {
      // In a real app, we would process the Stripe payment here before creating the booking.
      const res = await createBooking({ 
        event_id: form.event_id,
        visitor_name: form.visitor_name,
        visitor_email: form.visitor_email,
        ticket_type: form.ticket_type,
        quantity: Number(form.quantity) 
      });
      setConfirmed({ 
        ...res.data, 
        visitor_name: form.visitor_name,
        visitor_email: form.visitor_email,
        ticket_type: form.ticket_type, 
        quantity: form.quantity 
      });
    } catch (err) {
      setErrors({ submit: err.response?.data?.error || 'Booking failed. Please try again later.' });
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
          setStep(1);
          setForm({ event_id: '', visitor_name: '', visitor_email: '', ticket_type: 'General', quantity: 1, cardName: '', cardNumber: '', cardExpiry: '', cardCvc: '' });
          setSelectedEvent(null);
        }}
      />
    );
  }

  const subtotal = getTicketPrice(form.ticket_type) * form.quantity;
  const fee = subtotal * 0.05; // 5% booking fee
  const total = subtotal + fee;

  return (
    <div className="min-h-screen pt-24 pb-16 bg-surface-0">
      <div className="max-w-6xl mx-auto px-4 md:px-6">

        {loading ? (
          <div className="py-20 flex justify-center"><LoadingSpinner /></div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-10 xl:gap-16">

            {/* Left Column: Checkout Flow (8 cols) */}
            <div className="lg:col-span-7 xl:col-span-8">
              
              {/* Stepper */}
              <div className="flex items-center justify-between mb-10 px-2">
                {[1, 2, 3].map(s => (
                  <div key={s} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                      step >= s ? 'bg-coral-500 text-white shadow-soft' : 'bg-surface-2 text-ink-tertiary'
                    }`}>
                      {step > s ? '✓' : STEP_ICONS[s]}
                    </div>
                    {s < 3 && (
                      <div className={`w-12 sm:w-20 md:w-32 h-1 mx-2 rounded-full transition-all duration-300 ${
                        step > s ? 'bg-coral-500' : 'bg-surface-2'
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              <div className="card shadow-soft p-6 sm:p-10 animate-fade-in relative overflow-hidden">
                
                {/* Step 1: Tickets */}
                {step === 1 && (
                  <div className="animate-slide-up">
                    <h2 className="font-display text-3xl font-bold text-ink-primary mb-6">Select your tickets</h2>
                    
                    <div className="space-y-8">
                      <div>
                        <label className="text-sm font-bold text-ink-primary mb-2 block">Which event are you attending?</label>
                        <select
                          className={errors.event_id ? 'field-input-error' : 'field-input bg-surface-1'}
                          value={form.event_id}
                          onChange={e => update('event_id', e.target.value)}
                        >
                          <option value="">Select an event from the schedule…</option>
                          {events.map(ev => (
                            <option key={ev.id} value={ev.id}>
                              {new Date(ev.event_date).toLocaleDateString('en-US', { weekday:'short', day:'numeric', month:'short' })}
                              {' — '}{ev.title}
                            </option>
                          ))}
                        </select>
                        {errors.event_id && <p className="text-xs text-coral-500 font-bold mt-1.5">{errors.event_id}</p>}
                      </div>

                      <div>
                        <label className="text-sm font-bold text-ink-primary mb-3 block">Ticket Type</label>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {[
                            { type: 'General', subtitle: 'Standard festival entry', price: getTicketPrice('General') },
                            { type: 'VIP', subtitle: 'Premium access & backstage', price: getTicketPrice('VIP') },
                          ].map(({ type, subtitle, price }) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => update('ticket_type', type)}
                              className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                                form.ticket_type === type
                                  ? 'border-coral-500 bg-coral-50 shadow-soft'
                                  : 'border-surface-border bg-surface-0 hover:border-surface-muted hover:bg-surface-1'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <p className="text-base font-bold text-ink-primary">{type}</p>
                                <p className="text-base font-bold text-ink-primary">${price}</p>
                              </div>
                              <p className="text-sm font-medium text-ink-tertiary">{subtitle}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-bold text-ink-primary mb-3 block">Quantity</label>
                        <div className="flex items-center gap-5 bg-surface-1 border border-surface-border rounded-xl p-2 w-fit">
                          <button
                            type="button"
                            onClick={() => update('quantity', Math.max(1, form.quantity - 1))}
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-ink-secondary hover:bg-surface-2 hover:text-ink-primary transition-colors text-xl font-bold"
                          >
                            −
                          </button>
                          <span className="font-display text-2xl font-bold text-ink-primary w-10 text-center">
                            {form.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => update('quantity', Math.min(10, form.quantity + 1))}
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-ink-secondary hover:bg-surface-2 hover:text-ink-primary transition-colors text-xl font-bold"
                          >
                            +
                          </button>
                        </div>
                        {errors.quantity && <p className="text-xs text-coral-500 font-bold mt-1.5">{errors.quantity}</p>}
                      </div>

                      <div className="pt-6 border-t border-surface-border">
                        <button onClick={handleNextStep} className="btn-primary btn-lg w-full sm:w-auto px-12">
                          Continue to Details
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Details */}
                {step === 2 && (
                  <div className="animate-slide-up">
                    <h2 className="font-display text-3xl font-bold text-ink-primary mb-2">Guest Details</h2>
                    <p className="text-sm text-ink-secondary font-medium mb-8">Who is the primary ticket holder for this booking?</p>
                    
                    <div className="space-y-6 max-w-md">
                      <div>
                        <label className="text-sm font-bold text-ink-primary mb-2 block">Full Legal Name</label>
                        <input
                          type="text"
                          className={errors.visitor_name ? 'field-input-error' : 'field-input bg-surface-1'}
                          placeholder="E.g. Jane Smith"
                          value={form.visitor_name}
                          onChange={e => update('visitor_name', e.target.value)}
                        />
                        {errors.visitor_name && <p className="text-xs text-coral-500 font-bold mt-1.5">{errors.visitor_name}</p>}
                      </div>

                      <div>
                        <label className="text-sm font-bold text-ink-primary mb-2 block">Email Address</label>
                        <input
                          type="email"
                          className={errors.visitor_email ? 'field-input-error' : 'field-input bg-surface-1'}
                          placeholder="jane@example.com"
                          value={form.visitor_email}
                          onChange={e => update('visitor_email', e.target.value)}
                        />
                        {errors.visitor_email && <p className="text-xs text-coral-500 font-bold mt-1.5">{errors.visitor_email}</p>}
                        <p className="text-xs font-medium text-ink-tertiary mt-2">Your tickets and receipt will be sent here.</p>
                      </div>

                      <div className="pt-8 flex gap-3">
                        <button onClick={() => setStep(1)} className="btn-secondary btn-lg">Back</button>
                        <button onClick={handleNextStep} className="btn-primary btn-lg flex-1">Continue to Payment</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Payment */}
                {step === 3 && (
                  <div className="animate-slide-up">
                    <h2 className="font-display text-3xl font-bold text-ink-primary mb-2">Payment</h2>
                    <p className="text-sm text-ink-secondary font-medium mb-8">All transactions are secure and encrypted.</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      
                      {/* Simulated Credit Card Form */}
                      <div className="bg-surface-1 p-6 rounded-2xl border border-surface-border space-y-5 relative overflow-hidden">
                        
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                          <svg className="w-16 h-16 text-ink-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-widest text-ink-secondary mb-2 block">Card Number</label>
                          <input
                            type="text"
                            maxLength="19"
                            placeholder="0000 0000 0000 0000"
                            className={`w-full bg-white border ${errors.cardNumber ? 'border-coral-500 focus:ring-coral-500' : 'border-surface-muted focus:ring-sky-500'} rounded-xl px-4 py-3 text-ink-primary font-medium focus:outline-none focus:ring-2`}
                            value={form.cardNumber}
                            onChange={e => {
                              let val = e.target.value.replace(/\D/g, '');
                              val = val.replace(/(.{4})/g, '$1 ').trim();
                              update('cardNumber', val);
                            }}
                          />
                          {errors.cardNumber && <p className="text-xs text-coral-500 font-bold mt-1.5">{errors.cardNumber}</p>}
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-widest text-ink-secondary mb-2 block">Name on Card</label>
                          <input
                            type="text"
                            placeholder="JANE SMITH"
                            className={`w-full bg-white border ${errors.cardName ? 'border-coral-500 focus:ring-coral-500' : 'border-surface-muted focus:ring-sky-500'} rounded-xl px-4 py-3 text-ink-primary font-medium uppercase focus:outline-none focus:ring-2`}
                            value={form.cardName}
                            onChange={e => update('cardName', e.target.value.toUpperCase())}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-ink-secondary mb-2 block">Expiry</label>
                            <input
                              type="text"
                              maxLength="5"
                              placeholder="MM/YY"
                              className={`w-full bg-white border ${errors.cardExpiry ? 'border-coral-500 focus:ring-coral-500' : 'border-surface-muted focus:ring-sky-500'} rounded-xl px-4 py-3 text-ink-primary font-medium focus:outline-none focus:ring-2`}
                              value={form.cardExpiry}
                              onChange={e => {
                                let val = e.target.value.replace(/\D/g, '');
                                if (val.length >= 2) val = val.slice(0,2) + '/' + val.slice(2);
                                update('cardExpiry', val);
                              }}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-ink-secondary mb-2 block">CVC</label>
                            <input
                              type="text"
                              maxLength="4"
                              placeholder="123"
                              className={`w-full bg-white border ${errors.cardCvc ? 'border-coral-500 focus:ring-coral-500' : 'border-surface-muted focus:ring-sky-500'} rounded-xl px-4 py-3 text-ink-primary font-medium focus:outline-none focus:ring-2`}
                              value={form.cardCvc}
                              onChange={e => update('cardCvc', e.target.value.replace(/\D/g, ''))}
                            />
                          </div>
                        </div>
                      </div>

                      {errors.submit && (
                        <div className="bg-coral-50 text-coral-600 font-bold p-4 rounded-xl text-sm border border-coral-200">
                          {errors.submit}
                        </div>
                      )}

                      <div className="pt-6 flex gap-3">
                        <button type="button" onClick={() => setStep(2)} className="btn-secondary btn-lg">Back</button>
                        <button type="submit" disabled={submitting} className="btn-primary btn-lg flex-1">
                          {submitting ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Order Summary (4 cols) */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="card shadow-soft p-6 sticky top-24">
                <h3 className="font-display text-xl font-bold text-ink-primary mb-6 border-b border-surface-border pb-4">
                  Order Summary
                </h3>
                
                {selectedEvent ? (
                  <div className="space-y-6">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-ink-tertiary block mb-1">Event</span>
                      <p className="text-sm font-bold text-ink-primary">{selectedEvent.title}</p>
                      <p className="text-sm font-medium text-ink-secondary mt-1">
                        {new Date(selectedEvent.event_date).toLocaleDateString('en-US', { weekday:'short', day:'numeric', month:'short' })}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-ink-tertiary block mb-1">Tickets</span>
                      <div className="flex justify-between items-center text-sm font-medium text-ink-secondary">
                        <span>{form.quantity}x {form.ticket_type}</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="border-t border-surface-border pt-4 space-y-3">
                      <div className="flex justify-between items-center text-sm font-medium text-ink-secondary">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-medium text-ink-secondary">
                        <span>Booking Fee (5%)</span>
                        <span>${fee.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="border-t border-surface-border pt-4 flex justify-between items-center">
                      <span className="text-base font-bold text-ink-primary">Total due</span>
                      <span className="font-display text-2xl font-bold text-ink-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-10 text-center text-ink-tertiary">
                    <p className="text-sm font-medium">Select an event to see your summary.</p>
                  </div>
                )}
                
                {/* Security badges */}
                <div className="mt-8 flex items-center justify-center gap-2 text-xs font-bold text-ink-tertiary">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  SECURE CHECKOUT
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
