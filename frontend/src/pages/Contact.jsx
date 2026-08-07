import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { submitContact } from '../services/api';

const SUBJECTS = [
  'Event Details',
  'Ticket Enquiry',
  'VIP & Table Service',
  'Media & Press',
  'Sponsorships',
  'General Enquiry',
];

const CONTACT_INFO = [
  {
    label: 'Box Office',
    value: 'Open Event Days Only\n12PM - 10PM',
    icon: (
      <svg className="w-6 h-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    )
  },
  {
    label: 'VIP Concierge',
    value: '+1 (800) 999-FEST',
    icon: (
      <svg className="w-6 h-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    )
  },
  {
    label: 'Support',
    value: 'support@festivalhub.com',
    icon: (
      <svg className="w-6 h-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
];

const FAQS = [
  {
    q: 'How do I access my tickets?',
    a: 'Tickets are emailed directly and available in your account dashboard.',
  },
  {
    q: 'Can I upgrade to VIP?',
    a: 'Yes, VIP upgrades are available on the event day, subject to capacity.',
  },
  {
    q: 'What is the refund policy?',
    a: 'All sales are final. Tickets can be transferred via your dashboard.',
  },
  {
    q: 'Are there age restrictions?',
    a: 'Most events are 18+. Check the specific event page for details.',
  },
];

function SuccessView({ onReset }) {
  return (
    <div className="p-10 text-center animate-scale-in flex flex-col items-center justify-center h-full min-h-[400px]">
      <div className="w-20 h-20 rounded-full bg-mint-100 border-4 border-white shadow-soft flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-mint-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="font-display text-4xl text-ink-primary font-bold mb-4">Request Sent</h2>
      <p className="text-lg text-ink-secondary mb-8 max-w-md mx-auto leading-relaxed">
        We've received your transmission. Our festival crew will be in touch shortly to assist you.
      </p>
      <button onClick={onReset} className="btn-secondary btn-lg rounded-full">
        Send Another Message
      </button>
    </div>
  );
}

export default function Contact() {
  const location = useLocation();
  
  const [form,        setForm]        = useState({ name: '', email: '', subject: '', message: '' });
  const [errors,      setErrors]      = useState({});
  const [submitting,  setSubmitting]  = useState(false);
  const [success,     setSuccess]     = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const subjectParam = searchParams.get('subject');
    if (subjectParam && SUBJECTS.includes(subjectParam)) {
      setForm(f => ({ ...f, subject: subjectParam }));
    }
  }, [location]);

  const update = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Name is required';
    if (!form.email.trim())   e.email   = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address';
    if (!form.message.trim()) e.message = 'Message is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    setServerError('');
    try {
      await submitContact(form);
      setSuccess(true);
    } catch (err) {
      setServerError(err.response?.data?.error || 'Failed to send. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setSuccess(false);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen pt-fluid-xl pb-fluid-lg relative overflow-hidden bg-surface-0 flex flex-col justify-center">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[600px] h-[600px] bg-coral-500/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-brand-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="container relative z-10 w-full">
        {/* 50/50 Split Grid, Vertically Centered */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-16rem)]">
          
          {/* Left Text & Info Column */}
          <div className="pt-4 lg:pt-0">
            <div className="animate-slide-up">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 text-brand-500 text-sm font-bold tracking-widest uppercase mb-6 shadow-sm border border-brand-100">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                Contact Organisers
              </span>
              
              <h1 className="text-5xl lg:text-7xl font-display font-black text-ink-primary mb-6 leading-[1.1] tracking-tight">
                Reach <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-coral-500">
                  The Hub.
                </span>
              </h1>
              
              <p className="text-lg text-ink-secondary mb-10 leading-relaxed max-w-md">
                Got a question about event details, looking for a VIP ticket enquiry, or need support? Drop us a line.
              </p>
            </div>

            {/* Horizontal 2-col info cards to stay compact and symmetric */}
            <div className="grid sm:grid-cols-2 gap-4 max-w-lg mb-8">
              {CONTACT_INFO.slice(0, 2).map(({ label, value, icon }) => (
                <div key={label} className="p-4 rounded-2xl bg-white shadow-sm border border-surface-border hover:shadow-soft transition-all group flex flex-col">
                  <div className="w-10 h-10 rounded-xl bg-surface-1 flex items-center justify-center mb-3 group-hover:bg-brand-50 transition-colors">
                    {icon}
                  </div>
                  <p className="text-xs font-bold tracking-widest text-ink-tertiary uppercase mb-1">{label}</p>
                  <p className="text-ink-primary font-semibold text-sm whitespace-pre-line leading-relaxed">{value}</p>
                </div>
              ))}
            </div>
            
            {/* Social Links inline */}
            <div className="flex items-center gap-4">
              <p className="eyebrow !mb-0 mr-2">Follow Us</p>
              <div className="flex gap-2">
                {['Instagram', 'Twitter'].map(s => (
                  <button key={s} className="px-4 py-1.5 rounded-xl bg-white border border-surface-border text-sm font-bold text-ink-secondary hover:text-brand-500 hover:border-brand-200 hover:bg-brand-50 transition-all shadow-sm">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="w-full max-w-xl mx-auto lg:ml-auto lg:mr-0">
            <div className="bg-white/80 backdrop-blur-2xl border border-white rounded-[2.5rem] p-6 md:p-10 shadow-[0_20px_80px_-15px_rgba(0,0,0,0.07)] relative w-full h-full flex flex-col justify-center">
              <div className="absolute inset-0 bg-noise opacity-[0.02] mix-blend-multiply pointer-events-none rounded-[2.5rem]" />
              
              {success ? (
                <div className="relative z-10"><SuccessView onReset={reset} /></div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6 relative z-10">
                  <div className="space-y-1 mb-2">
                    <h3 className="text-2xl font-display font-bold text-ink-primary">Send us a message</h3>
                    <p className="text-ink-secondary text-sm">We'll reply to you shortly.</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label htmlFor="contact-name" className="field-label !mb-0">Full Name</label>
                      <input
                        id="contact-name"
                        type="text"
                        className={`${errors.name ? 'field-input-error' : 'field-input'} shadow-sm py-3`}
                        placeholder="e.g. Alex Johnson"
                        value={form.name}
                        onChange={e => update('name', e.target.value)}
                        autoComplete="name"
                      />
                      {errors.name && <p className="field-error">{errors.name}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="contact-email" className="field-label !mb-0">Email Address</label>
                      <input
                        id="contact-email"
                        type="email"
                        className={`${errors.email ? 'field-input-error' : 'field-input'} shadow-sm py-3`}
                        placeholder="e.g. alex@example.com"
                        value={form.email}
                        onChange={e => update('email', e.target.value)}
                        autoComplete="email"
                      />
                      {errors.email && <p className="field-error">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-subject" className="field-label !mb-0">Topic of Enquiry</label>
                    <select
                      id="contact-subject"
                      className="field-input shadow-sm py-3 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1rem_center] bg-[length:0.75rem_auto]"
                      value={form.subject}
                      onChange={e => update('subject', e.target.value)}
                    >
                      <option value="">Select a topic (e.g. Ticket Enquiry)</option>
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-end mb-1.5">
                      <label htmlFor="contact-message" className="field-label !mb-0">Message</label>
                      <span className="text-xs font-semibold text-ink-tertiary">{form.message.length} chars</span>
                    </div>
                    <textarea
                      id="contact-message"
                      rows={4}
                      className={`${errors.message ? 'field-input-error' : 'field-input'} shadow-sm resize-none py-3`}
                      placeholder="e.g. I'm looking for details regarding VIP table service..."
                      value={form.message}
                      onChange={e => update('message', e.target.value)}
                    />
                    {errors.message && <p className="field-error">{errors.message}</p>}
                  </div>

                  {serverError && (
                    <div className="alert-danger rounded-xl text-sm font-bold">{serverError}</div>
                  )}

                  <button
                    id="contact-submit"
                    type="submit"
                    disabled={submitting}
                    className="btn-primary btn-lg w-full text-lg group rounded-2xl py-3.5"
                  >
                    {submitting ? 'Transmitting...' : 'Send Message'}
                    {!submitting && (
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-16 border-t border-surface-border pt-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <p className="eyebrow text-coral-500 mb-2">Support</p>
              <h2 className="text-3xl font-display font-bold text-ink-primary">Frequently Asked</h2>
            </div>
            <p className="text-ink-secondary md:max-w-xs mt-4 md:mt-0 text-sm">
              Quick answers to common questions about tickets, refunds, and VIP access.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="group flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-surface-1 flex items-center justify-center shrink-0 text-brand-500 font-bold group-hover:bg-brand-50 transition-colors">
                  ?
                </div>
                <div>
                  <h4 className="text-base font-bold text-ink-primary mb-1 leading-tight">{q}</h4>
                  <p className="text-ink-secondary text-sm leading-relaxed">{a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
