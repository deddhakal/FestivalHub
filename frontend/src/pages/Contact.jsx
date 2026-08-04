import { useState } from 'react';
import { submitContact } from '../services/api';

const SUBJECTS = [
  'Ticket Inquiry',
  'Accessibility',
  'Vendor / Sponsorship',
  'Lost & Found',
  'General Question',
  'Media Enquiry',
  'Other',
];

const CONTACT_INFO = [
  {
    label: 'Venue',
    value: 'Melbourne Showgrounds\nEpsom Road, Ascot Vale VIC 3032',
  },
  {
    label: 'Dates',
    value: 'Friday 15 – Sunday 17 August 2026\nGates open from 3PM daily',
  },
  {
    label: 'Phone',
    value: '+61 3 9000 0000\nMon–Fri 9AM – 5PM AEST',
  },
  {
    label: 'Email',
    value: 'info@festivalhub.com.au',
  },
];

const FAQS = [
  {
    q: 'What should I bring?',
    a: 'Sunscreen, comfortable shoes, a valid ID, and your booking reference. Sealed water bottles are permitted.',
  },
  {
    q: 'Are there ATMs on site?',
    a: 'ATMs are at Gate A and Gate C. All vendors accept cashless payments including EFTPOS and Apple Pay.',
  },
  {
    q: 'Is the festival accessible?',
    a: 'Accessible parking is at Gate A. All stages have accessible viewing areas. Contact us for specific requirements.',
  },
  {
    q: 'Can I bring my own food?',
    a: 'Sealed non-alcoholic beverages are permitted. Outside glass and alcohol are not allowed onto the grounds.',
  },
];

function SuccessView({ onReset }) {
  return (
    <div className="card p-8 text-center animate-scale-in">
      <div className="w-12 h-12 rounded-full bg-green-950/60 border border-green-900/40 flex items-center justify-center mx-auto mb-5">
        <svg className="w-6 h-6 text-signal-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="font-display text-2xl text-ink-primary mb-2">Message Sent</h2>
      <p className="text-sm text-ink-secondary mb-6 max-w-xs mx-auto">
        Thank you for reaching out. Our team will respond within 24–48 hours.
      </p>
      <button onClick={onReset} className="btn-secondary btn-md">Send Another</button>
    </div>
  );
}

export default function Contact() {
  const [form,        setForm]        = useState({ name: '', email: '', subject: '', message: '' });
  const [errors,      setErrors]      = useState({});
  const [submitting,  setSubmitting]  = useState(false);
  const [success,     setSuccess]     = useState(false);
  const [serverError, setServerError] = useState('');

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
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Page header */}
        <div className="py-10 md:py-14 border-b border-surface-border mb-10 animate-slide-up">
          <p className="eyebrow mb-3">Get in touch</p>
          <h1 className="font-display text-4xl md:text-5xl text-ink-primary mb-2">Contact Organisers</h1>
          <p className="text-sm text-ink-secondary">Questions, accessibility needs, or media enquiries — we're here to help.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 xl:gap-16 mb-16">

          {/* Contact info — 2 cols */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <p className="eyebrow mb-4">Find us</p>
              <div className="space-y-4">
                {CONTACT_INFO.map(({ label, value }) => (
                  <div key={label} className="flex gap-4">
                    <div className="w-16 shrink-0">
                      <span className="eyebrow">{label}</span>
                    </div>
                    <p className="text-sm text-ink-secondary whitespace-pre-line leading-relaxed">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Social */}
            <div className="pt-4 border-t border-surface-border">
              <p className="eyebrow mb-3">Follow along</p>
              <div className="flex flex-wrap gap-2">
                {['Instagram', 'TikTok', 'Twitter', 'Facebook'].map(s => (
                  <span
                    key={s}
                    className="px-3 py-1.5 rounded border border-surface-border text-xs text-ink-tertiary hover:text-ink-secondary hover:border-surface-muted transition-colors cursor-pointer"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Form — 3 cols */}
          <div className="lg:col-span-3">
            {success ? (
              <SuccessView onReset={reset} />
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <p className="text-sm font-semibold text-ink-primary mb-1">Send us a message</p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="field-label">Full Name *</label>
                    <input
                      id="contact-name"
                      type="text"
                      className={errors.name ? 'field-input-error' : 'field-input'}
                      placeholder="Jane Smith"
                      value={form.name}
                      onChange={e => update('name', e.target.value)}
                      autoComplete="name"
                    />
                    {errors.name && <p className="field-error">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="field-label">Email *</label>
                    <input
                      id="contact-email"
                      type="email"
                      className={errors.email ? 'field-input-error' : 'field-input'}
                      placeholder="jane@example.com"
                      value={form.email}
                      onChange={e => update('email', e.target.value)}
                      autoComplete="email"
                    />
                    {errors.email && <p className="field-error">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="field-label">Topic</label>
                  <select
                    id="contact-subject"
                    className="field-input"
                    value={form.subject}
                    onChange={e => update('subject', e.target.value)}
                  >
                    <option value="">Select a topic (optional)</option>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="field-label">Message *</label>
                  <textarea
                    id="contact-message"
                    rows={6}
                    className={`${errors.message ? 'field-input-error' : 'field-input'} resize-none`}
                    placeholder="Tell us how we can help…"
                    value={form.message}
                    onChange={e => update('message', e.target.value)}
                  />
                  {errors.message && <p className="field-error">{errors.message}</p>}
                  <p className="text-2xs text-ink-tertiary mt-1 text-right">
                    {form.message.length} characters
                  </p>
                </div>

                {serverError && (
                  <div className="alert-danger rounded text-sm">{serverError}</div>
                )}

                <button
                  id="contact-submit"
                  type="submit"
                  disabled={submitting}
                  className="btn-primary btn-lg w-full"
                >
                  {submitting ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ section */}
        <div className="pt-10 border-t border-surface-border">
          <p className="eyebrow mb-6">Frequently Asked Questions</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="p-5 bg-surface-1 border border-surface-border rounded-xl">
                <p className="text-sm font-semibold text-ink-primary mb-2">{q}</p>
                <p className="text-xs text-ink-secondary leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
