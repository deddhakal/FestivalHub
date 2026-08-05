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

/* ── Success Animation ───────────────────────────────────────── */
function PaymentSuccessAnimation() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface-0 overflow-hidden">
      <style>{`
        @keyframes scaleUp {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes drawCheckMark {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes ripple {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          100% { box-shadow: 0 0 0 100px rgba(16, 185, 129, 0); }
        }
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes confettiDrop {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        .anim-scale-up {
          animation: scaleUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .anim-draw-check {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: drawCheckMark 0.6s ease-out forwards 0.4s;
        }
        .anim-ripple {
          animation: ripple 1.5s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
        }
        .anim-fade-up {
          opacity: 0;
          animation: fadeUp 0.6s ease-out forwards 0.7s;
        }
        .anim-fade-up-delayed {
          opacity: 0;
          animation: fadeUp 0.6s ease-out forwards 0.9s;
        }
        .confetti {
          position: absolute;
          top: -20px;
          width: 10px;
          height: 20px;
          border-radius: 4px;
          animation: confettiDrop 2.5s ease-in forwards;
        }
      `}</style>
      
      {/* Background glowing orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[600px] md:h-[600px] bg-emerald-400/10 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>

      {/* Confetti particles */}
      {[...Array(30)].map((_, i) => (
        <div 
          key={i} 
          className="confetti" 
          style={{ 
            left: `${Math.random() * 100}vw`, 
            background: ['#10B981', '#34D399', '#6EE7B7', '#FBBF24', '#F472B6', '#60A5FA'][Math.floor(Math.random() * 6)],
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${2 + Math.random() * 1.5}s`
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Checkmark Circle */}
        <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-tr from-emerald-500 to-mint-400 rounded-full flex items-center justify-center anim-scale-up anim-ripple mb-10 shadow-2xl shadow-emerald-500/40">
          <svg className="w-16 h-16 md:w-20 md:h-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" className="anim-draw-check" />
          </svg>
        </div>

        {/* Text */}
        <h2 className="font-display text-4xl md:text-6xl font-black text-ink-primary mb-4 anim-fade-up tracking-tight text-center px-4">
          Payment Successful!
        </h2>
        <p className="text-lg md:text-xl font-medium text-ink-secondary anim-fade-up-delayed text-center px-4 max-w-md">
          Your payment has been processed and your digital tickets are being generated.
        </p>
      </div>
    </div>
  );
}

/* ── Main Booking Component ──────────────────────────────────── */
export default function Booking() {
  const [searchParams]   = useSearchParams();
  const [events,         setEvents]      = useState([]);
  const [loading,        setLoading]     = useState(true);
  const [submitting,     setSubmitting]  = useState(false);
  const [confirmed,      setConfirmed]   = useState(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
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
    
    if (form.cardExpiry.length < 5) {
      e.cardExpiry = 'Valid expiry (MM/YY) required';
    } else {
      const [m, y] = form.cardExpiry.split('/');
      const month = parseInt(m, 10);
      const year = parseInt('20' + y, 10);
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();
      
      if (month < 1 || month > 12) {
        e.cardExpiry = 'Invalid month';
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        e.cardExpiry = 'Card has expired';
      }
    }

    if (form.cardCvc.length < 3 || form.cardCvc.length > 4) {
      e.cardCvc = 'Valid CVC required';
    }

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
      
      setShowSuccessAnimation(true);
      
      setTimeout(() => {
        setConfirmed({ 
          ...res.data, 
          visitor_name: form.visitor_name,
          visitor_email: form.visitor_email,
          ticket_type: form.ticket_type, 
          quantity: form.quantity 
        });
        setShowSuccessAnimation(false);
      }, 3500);

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
    <div className="min-h-[90vh] pt-16 pb-8 bg-surface-0 relative overflow-hidden">
      {/* Decorative ambient background blobs */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-coral-400/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-400/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">

        {loading ? (
          <div className="py-20 flex justify-center"><LoadingSpinner /></div>
        ) : showSuccessAnimation ? (
          <PaymentSuccessAnimation />
        ) : (
          <div className="grid lg:grid-cols-12 gap-6 xl:gap-8">

            {/* Left Column: Checkout Flow (8 cols) */}
            <div className="lg:col-span-7 xl:col-span-8">
              
              {/* Stepper (Minimalist) */}
              <div className="mb-4">
                <div className="flex items-center gap-3 sm:gap-6 max-w-2xl">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="contents">
                      <div className={`flex items-center gap-2.5 transition-colors ${step >= s ? 'text-ink-primary' : 'text-ink-tertiary'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2 ${
                          step >= s ? 'bg-ink-primary border-ink-primary text-white' : 'bg-transparent border-surface-border'
                        }`}>
                          {step > s ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            s
                          )}
                        </div>
                        <span className={`text-sm font-bold tracking-tight ${step === s ? 'text-ink-primary' : step > s ? 'text-ink-primary' : 'hidden sm:block'}`}>
                          {s === 1 ? 'Tickets' : s === 2 ? 'Details' : 'Payment'}
                        </span>
                      </div>
                      
                      {/* Line connecting steps */}
                      {s < 3 && (
                        <div className="flex-1 h-[2px] bg-surface-border/60 relative overflow-hidden rounded-full">
                          <div className={`absolute top-0 left-0 h-full bg-ink-primary transition-all duration-700 ease-out ${step > s ? 'w-full' : 'w-0'}`} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-xl border border-white shadow-xl shadow-surface-border/40 rounded-3xl p-5 sm:p-6 animate-fade-in relative overflow-hidden">
                
                {/* Step 1: Tickets */}
                {step === 1 && (
                  <div className="animate-slide-up">
                    <h2 className="font-display text-2xl font-bold text-ink-primary mb-4">Select your tickets</h2>
                    
                    <div className="space-y-5">
                      <div>
                        <label className="text-sm font-bold text-ink-primary mb-1 block">Which event are you attending?</label>
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
                              className={`p-3 rounded-2xl border-2 text-left transition-all duration-200 ${
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

                      <div className="pt-4 border-t border-surface-border">
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
                    <h2 className="font-display text-2xl font-bold text-ink-primary mb-1">Guest Details</h2>
                    <p className="text-sm text-ink-secondary font-medium mb-4">Who is the primary ticket holder for this booking?</p>
                    
                    <div className="space-y-5 max-w-md">
                      <div>
                        <label className="text-sm font-bold text-ink-primary mb-1 block">Full Legal Name</label>
                        <input
                          type="text"
                          className={errors.visitor_name ? 'field-input-error' : 'field-input bg-surface-1'}
                          placeholder="Enter your full name"
                          value={form.visitor_name}
                          onChange={e => update('visitor_name', e.target.value)}
                        />
                        {errors.visitor_name && <p className="text-xs text-coral-500 font-bold mt-1.5">{errors.visitor_name}</p>}
                      </div>

                      <div>
                        <label className="text-sm font-bold text-ink-primary mb-1 block">Email Address</label>
                        <input
                          type="email"
                          className={errors.visitor_email ? 'field-input-error' : 'field-input bg-surface-1'}
                          placeholder="Enter your email address"
                          value={form.visitor_email}
                          onChange={e => update('visitor_email', e.target.value)}
                        />
                        {errors.visitor_email && <p className="text-xs text-coral-500 font-bold mt-1.5">{errors.visitor_email}</p>}
                        <p className="text-xs font-medium text-ink-tertiary mt-2">Your tickets and receipt will be sent here.</p>
                      </div>

                      <div className="pt-4 flex gap-3">
                        <button onClick={() => setStep(1)} className="btn-secondary btn-lg">Back</button>
                        <button onClick={handleNextStep} className="btn-primary btn-lg flex-1">Continue to Payment</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Payment */}
                {step === 3 && (
                  <div className="animate-slide-up">
                    <h2 className="font-display text-2xl font-bold text-ink-primary mb-1">Payment</h2>
                    <p className="text-sm text-ink-secondary font-medium mb-4">All transactions are secure and encrypted.</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      
                      {/* Simulated Credit Card Form */}
                      <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-3xl border border-gray-800 shadow-2xl space-y-4 relative overflow-hidden text-white">
                        
                        {/* Abstract background for card */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-coral-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

                        <div className="absolute top-8 right-8 opacity-70">
                          {/* Chip icon mock */}
                          <div className="w-12 h-9 rounded bg-gradient-to-br from-yellow-100 to-yellow-400 opacity-80 border border-yellow-500/50 flex flex-col justify-evenly px-1 relative overflow-hidden">
                            <div className="w-full h-px bg-yellow-700/30"></div>
                            <div className="w-full h-px bg-yellow-700/30"></div>
                            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-yellow-700/30 -translate-x-1/2"></div>
                          </div>
                        </div>

                        <div className="relative z-10 pt-4">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Card Number</label>
                          <input
                            type="text"
                            maxLength="19"
                            placeholder="0000 0000 0000 0000"
                            className={`w-full bg-transparent border-b-2 ${errors.cardNumber ? 'border-coral-500' : 'border-gray-700 focus:border-white'} px-1 py-2 text-white font-mono text-xl tracking-widest focus:outline-none transition-colors placeholder-gray-600`}
                            value={form.cardNumber}
                            onChange={e => {
                              let val = e.target.value.replace(/\D/g, '');
                              val = val.replace(/(.{4})/g, '$1 ').trim();
                              update('cardNumber', val);
                            }}
                          />
                          {errors.cardNumber && <p className="text-xs text-coral-400 font-bold mt-1.5">{errors.cardNumber}</p>}
                        </div>

                        <div className="relative z-10">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Name on Card</label>
                          <input
                            type="text"
                            placeholder="Enter name on card"
                            className={`w-full bg-transparent border-b-2 ${errors.cardName ? 'border-coral-500' : 'border-gray-700 focus:border-white'} px-1 py-2 text-white font-display uppercase tracking-widest focus:outline-none transition-colors placeholder-gray-600`}
                            value={form.cardName}
                            onChange={e => update('cardName', e.target.value.toUpperCase())}
                          />
                          {errors.cardName && <p className="text-xs text-coral-400 font-bold mt-1.5">{errors.cardName}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-8 relative z-10">
                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Expiry</label>
                            <input
                              type="text"
                              maxLength="5"
                              placeholder="MM/YY"
                              className={`w-full bg-transparent border-b-2 ${errors.cardExpiry ? 'border-coral-500' : 'border-gray-700 focus:border-white'} px-1 py-2 text-white font-mono tracking-widest focus:outline-none transition-colors placeholder-gray-600`}
                              value={form.cardExpiry}
                              onChange={e => {
                                let val = e.target.value.replace(/\D/g, '');
                                if (val.length >= 2) val = val.slice(0,2) + '/' + val.slice(2);
                                update('cardExpiry', val);
                              }}
                            />
                            {errors.cardExpiry && <p className="text-xs text-coral-400 font-bold mt-1.5">{errors.cardExpiry}</p>}
                          </div>
                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">CVC</label>
                            <input
                              type="text"
                              maxLength="4"
                              placeholder="123"
                              className={`w-full bg-transparent border-b-2 ${errors.cardCvc ? 'border-coral-500' : 'border-gray-700 focus:border-white'} px-1 py-2 text-white font-mono tracking-widest focus:outline-none transition-colors placeholder-gray-600`}
                              value={form.cardCvc}
                              onChange={e => update('cardCvc', e.target.value.replace(/\D/g, ''))}
                            />
                            {errors.cardCvc && <p className="text-xs text-coral-400 font-bold mt-1.5">{errors.cardCvc}</p>}
                          </div>
                        </div>
                      </div>

                      {errors.submit && (
                        <div className="bg-coral-50 text-coral-600 font-bold p-4 rounded-xl text-sm border border-coral-200">
                          {errors.submit}
                        </div>
                      )}

                      <div className="pt-4 flex gap-3">
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
              <div className="bg-white/70 backdrop-blur-xl border border-white shadow-xl shadow-surface-border/40 rounded-3xl p-5 sm:p-6 sticky top-20">
                <h3 className="font-display text-xl font-bold text-ink-primary mb-4 border-b border-surface-border pb-3">
                  Order Summary
                </h3>
                
                {selectedEvent ? (
                  <div className="space-y-4">
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
