import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Ticket, Star, X, ArrowUpRight, Calendar, PlusSquare, Users, ShieldCheck, Check } from 'lucide-react';
import WhyFestivalHub from '../components/WhyFestivalHub';

const TICKER_ITEMS_1 = [
  'Music Festivals',
  'Tech Conferences',
  'Corporate Seminars',
  'Art Exhibitions',
  'Networking Meetups',
  'Food & Drink Tastings',
  'Comedy Shows',
  'Virtual Events',
];

const TICKER_ITEMS_2 = [
  'Seamless Ticketing',
  'Real-time Analytics',
  'Instant Payouts',
  'Interactive Venue Maps',
  'Secure Check-ins',
  'Audience Engagement',
  'Global Reach',
  'Custom Branding',
];

function Ticker() {
  const items1 = [...TICKER_ITEMS_1, ...TICKER_ITEMS_1, ...TICKER_ITEMS_1];
  const items2 = [...TICKER_ITEMS_2, ...TICKER_ITEMS_2, ...TICKER_ITEMS_2];
  return (
    <div className="relative z-20 flex flex-col border-y border-surface-border bg-surface-1/40 shadow-soft backdrop-blur-md overflow-hidden">
      {/* Top Banner - Right to Left */}
      <div className="py-2.5 border-b border-surface-border/50">
        <div className="flex gap-0 animate-ticker whitespace-nowrap hover:[animation-play-state:paused]" style={{ width: 'max-content' }}>
          {items1.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-6 px-6 text-sm font-bold text-ink-primary uppercase tracking-widest">
              {item}
              <span className="text-coral-500">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Banner - Left to Right */}
      <div className="py-2.5 bg-brand-500">
        <div className="flex gap-0 animate-ticker-reverse whitespace-nowrap hover:[animation-play-state:paused]" style={{ width: 'max-content' }}>
          {items2.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-6 px-6 text-sm font-bold text-white uppercase tracking-widest">
              {item}
              <span className="text-gold-300">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactModal({ isOpen, onClose }) {
  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const honey = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const set = (k) => (e) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors(err => ({ ...err, [k]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    const nameVal = form.name.trim();
    if (!nameVal) {
      newErrors.name = "Name is required";
    } else if (nameVal.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s'-]+$/.test(nameVal)) {
      newErrors.name = "Name can only contain letters and spaces";
    }

    const emailVal = form.email.trim();
    if (!emailVal) {
      newErrors.email = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailVal)) {
      newErrors.email = "Please enter a valid email address";
    }

    const phoneVal = form.phone.trim();
    if (!phoneVal) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{9,10}$/.test(phoneVal.replace(/[-\s]/g, ''))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    const subjectVal = form.subject.trim();
    if (!subjectVal) {
      newErrors.subject = "Subject is required";
    } else if (subjectVal.length < 3) {
      newErrors.subject = "Subject must be at least 3 characters";
    }

    const msgVal = form.message.trim();
    if (!msgVal) {
      newErrors.message = "Message is required";
    } else if (msgVal.length < 10) {
      newErrors.message = "Message must be at least 10 characters to be meaningful";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (honey.current?.value) return;
    if (!validateForm()) return;

    setStatus("sending");
    try {
      const res = await fetch("https://formsubmit.co/ajax/deddhakal@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: form.subject,
          message: form.message,
          _captcha: "false",
        }),
      });
      if (res.ok) {
        setStatus("ok");
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      }
      else setStatus("err");
    } catch { setStatus("err"); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink-primary/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-surface-0 rounded-3xl shadow-2xl p-8 border border-surface-border"
          >
            <button onClick={onClose} className="absolute top-6 right-6 text-ink-tertiary hover:text-coral-500 transition-colors">
              <X size={20} />
            </button>

            <h3 className="text-2xl font-bold font-display text-ink-primary mb-2">Start a Conversation</h3>
            <p className="text-ink-secondary mb-6 text-sm">Tell us a bit about your event.</p>

            {status === "ok" ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-16 h-16 rounded-full border-2 border-brand-500 flex items-center justify-center text-brand-500 mb-4 text-2xl">✓</div>
                <h4 className="text-lg font-bold text-ink-primary mb-2">Message Sent Successfully!</h4>
                <p className="text-ink-secondary text-sm">We'll get back to you as soon as possible.</p>
                <button onClick={() => setStatus("idle")} className="mt-6 text-sm text-brand-500 font-bold uppercase tracking-widest hover:text-brand-600 transition-colors">
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
                <input ref={honey} type="text" name="_honey" defaultValue="" style={{ display: "none" }} tabIndex={-1} aria-hidden="true" />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-ink-tertiary uppercase tracking-widest mb-1">Name</label>
                    <input type="text" value={form.name} onChange={set("name")} className={`w-full bg-surface-100 border ${errors.name ? 'border-red-500' : 'border-surface-border'} rounded-lg px-4 py-2.5 text-sm text-ink-primary focus:outline-none focus:border-brand-500 transition-colors`} placeholder="Your name" />
                    {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink-tertiary uppercase tracking-widest mb-1">Email</label>
                    <input type="email" value={form.email} onChange={set("email")} className={`w-full bg-surface-100 border ${errors.email ? 'border-red-500' : 'border-surface-border'} rounded-lg px-4 py-2.5 text-sm text-ink-primary focus:outline-none focus:border-brand-500 transition-colors`} placeholder="you@email.com" />
                    {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-ink-tertiary uppercase tracking-widest mb-1">Phone</label>
                    <input type="tel" value={form.phone} onChange={set("phone")} className={`w-full bg-surface-100 border ${errors.phone ? 'border-red-500' : 'border-surface-border'} rounded-lg px-4 py-2.5 text-sm text-ink-primary focus:outline-none focus:border-brand-500 transition-colors`} placeholder="04XX XXX XXX" />
                    {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink-tertiary uppercase tracking-widest mb-1">Subject</label>
                    <input type="text" value={form.subject} onChange={set("subject")} className={`w-full bg-surface-100 border ${errors.subject ? 'border-red-500' : 'border-surface-border'} rounded-lg px-4 py-2.5 text-sm text-ink-primary focus:outline-none focus:border-brand-500 transition-colors`} placeholder="Event Planning" />
                    {errors.subject && <p className="text-red-500 text-[10px] mt-1">{errors.subject}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-tertiary uppercase tracking-widest mb-1">Message</label>
                  <textarea rows={4} value={form.message} onChange={set("message")} className={`w-full bg-surface-100 border ${errors.message ? 'border-red-500' : 'border-surface-border'} rounded-lg px-4 py-2.5 text-sm text-ink-primary focus:outline-none focus:border-brand-500 resize-none transition-colors`} placeholder="Tell us about your event..." />
                  {errors.message && <p className="text-red-500 text-[10px] mt-1">{errors.message}</p>}
                </div>

                <div className="flex items-center justify-between mt-2">
                  {status === "err" ? <span className="text-xs text-red-500">Something went wrong. Please try again.</span> : <span />}
                  <button type="submit" disabled={status === "sending"} className="group inline-flex items-center justify-center px-6 py-3 text-sm font-bold tracking-widest text-white uppercase transition-all duration-300 bg-coral-500 rounded-full hover:bg-coral-600 shadow-md disabled:opacity-50 ml-auto">
                    {status === "sending" ? "Sending..." : "Send Message"}
                    <ArrowUpRight size={16} className="ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function Home() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const ctaRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ctaRef,
    offset: ["start end", "start 20%"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001
  });

  const ctaScale = useTransform(smoothProgress, [0, 1], [0.85, 1]);
  const ctaY = useTransform(smoothProgress, [0, 1], [150, 0]);

  return (
    <div className="min-h-screen bg-surface-0">

      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center pt-24 pb-0 overflow-hidden bg-surface-0">
        
        {/* Background Grid & Glow */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: "linear-gradient(rgba(148, 163, 184, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.15) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-coral-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[100vw] h-[100vh] bg-noise opacity-[0.03] pointer-events-none mix-blend-overlay" />

        <div className="container relative z-10 flex flex-col items-center text-center px-6 mx-auto w-full max-w-[1400px]">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-surface-border shadow-sm mb-6"
          >
            <div className="w-2 h-2 rounded-full bg-coral-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-ink-secondary uppercase">The Ultimate Event Platform</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-ink-primary text-[56px] md:text-[80px] lg:text-[100px] leading-[0.9] tracking-tight mb-4 max-w-5xl"
          >
            Create, Manage & Host <br/>
            <span className="bg-gradient-to-r from-coral-500 via-red-500 to-orange-500 text-transparent bg-clip-text inline-block pb-2">Extraordinary Events</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-ink-secondary text-lg md:text-xl leading-relaxed font-medium max-w-2xl mb-8"
          >
            Plan, promote, and manage unforgettable festivals. Sell tickets, engage attendees, and run every event from one intelligent platform.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex items-center gap-4 flex-wrap justify-center mb-10"
          >
            <Link to="/events" className="group inline-flex items-center gap-2 bg-gradient-to-r from-coral-500 to-red-500 text-white font-bold text-[15px] px-8 py-4 rounded-xl shadow-[0_8px_24px_rgba(244,63,94,0.32)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(244,63,94,0.42)]">
              <Calendar size={18} />
              Discover Events
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
            <Link to="/admin/login" className="group inline-flex items-center gap-2 bg-white text-ink-primary font-bold text-[15px] px-8 py-4 rounded-xl border border-surface-border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <PlusSquare size={18} className="text-ink-tertiary transition-colors group-hover:text-ink-secondary" />
              Create an Event
            </Link>
          </motion.div>

          {/* Stats Row */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex items-center justify-center gap-12 md:gap-24 mb-12 flex-wrap"
          >
            {[
              { value: '10K+', label: 'Events Hosted', color: 'text-coral-500' },
              { value: '350K+', label: 'Happy Attendees', color: 'text-orange-500' },
              { value: '99.9%', label: 'Secure & Reliable', color: 'text-teal-500' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-display font-black text-4xl md:text-5xl text-ink-primary tracking-tight">{stat.value.replace('+', '').replace('%', '')}</span>
                  <span className={`font-display font-black text-2xl md:text-3xl ${stat.color}`}>{stat.value.includes('+') ? '+' : stat.value.includes('%') ? '%' : ''}</span>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-tertiary">{stat.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Apple-Style Dashboard Visual */}
          <motion.div
            initial={{ opacity: 0, y: 150, scale: 0.95, rotateX: 15 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
            className="w-full relative px-4 md:px-0"
          >
            {/* The Dashboard Mockup */}
            <div className="relative w-full max-w-5xl mx-auto aspect-[16/10] md:aspect-[16/9] bg-[#0B0F19] rounded-t-3xl md:rounded-t-[40px] border border-surface-border/60 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col text-left">
              
              {/* Mockup Top Bar */}
              <div className="h-12 border-b border-white/10 bg-white/5 flex items-center px-6 gap-2 backdrop-blur-md shrink-0">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="mx-auto flex items-center justify-center w-64 h-6 rounded-md bg-white/5 border border-white/10 text-[10px] text-slate-400 font-medium tracking-wide">festivalhub.com/dashboard</div>
              </div>

              {/* Dashboard App Content */}
              <div className="flex-1 flex w-full relative">
                
                {/* Sidebar */}
                <div className="w-[200px] border-r border-white/10 bg-white/5 flex-col p-4 gap-6 hidden md:flex">
                  <div className="flex items-center gap-2 px-2">
                     <div className="w-6 h-6 rounded bg-gradient-to-tr from-coral-500 to-orange-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]"></div>
                     <span className="text-white font-bold text-sm tracking-wide">FestivalHub</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {['Overview', 'Events', 'Attendees', 'Analytics', 'Settings'].map((item, i) => (
                      <div key={item} className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-3 transition-colors ${i === 0 ? 'bg-coral-500/10 text-coral-400' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
                        <div className={`w-3.5 h-3.5 rounded-sm ${i === 0 ? 'bg-coral-400/50 shadow-[0_0_8px_rgba(244,63,94,0.4)]' : 'border border-slate-500'}`}></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 flex flex-col gap-6 relative overflow-hidden">
                  
                  {/* Background glow for the main content */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-coral-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
                  
                  {/* Header */}
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-white text-xl font-bold mb-1">Overview</h3>
                      <p className="text-slate-400 text-xs">Here's what's happening with your events today.</p>
                    </div>
                    <div className="hidden sm:flex gap-2">
                       <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-slate-300 text-xs font-medium flex items-center gap-2 hover:bg-white/10 cursor-default transition-colors">
                         <Calendar size={14} className="text-coral-400" /> Last 30 Days
                       </div>
                    </div>
                  </div>

                  {/* Top Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: 'Total Revenue', value: '$124,500', trend: '+14.5%', positive: true, icon: <div className="w-5 h-5 rounded-full border-2 border-emerald-400 opacity-50" /> },
                      { label: 'Tickets Sold', value: '4,289', trend: '+22.1%', positive: true, icon: <Ticket size={20} className="text-orange-400 opacity-50" /> },
                      { label: 'Page Views', value: '89.2K', trend: '-2.4%', positive: false, icon: <Users size={20} className="text-blue-400 opacity-50" /> },
                    ].map((stat, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col gap-3 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                         <div className="absolute top-4 right-4 transition-transform group-hover:scale-110">
                           {stat.icon}
                         </div>
                         <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{stat.label}</span>
                         <div className="flex items-end gap-3">
                           <span className="text-white text-2xl font-black tracking-tight">{stat.value}</span>
                           <span className={`text-[11px] font-bold pb-1 ${stat.positive ? 'text-emerald-400' : 'text-red-400'}`}>{stat.trend}</span>
                         </div>
                      </div>
                    ))}
                  </div>

                  {/* Chart & Live Feed Row */}
                  <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
                     {/* Main Chart */}
                     <div className="flex-[2] bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col relative backdrop-blur-sm">
                        <span className="text-slate-300 text-sm font-bold mb-6">Revenue Analytics</span>
                        <div className="flex-1 flex items-end gap-2 pb-2">
                          {[40, 60, 30, 80, 50, 90, 70, 100, 60, 85, 75, 95].map((h, i) => (
                            <div key={i} className="flex-1 group relative h-full flex items-end">
                              <div className="w-full rounded-t-sm transition-all duration-500 hover:bg-coral-400 relative" style={{ height: `${h}%`, backgroundColor: i % 3 === 0 ? 'rgba(244,63,94,0.8)' : 'rgba(244,63,94,0.3)' }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-20 shadow-xl">${(h * 1.2).toFixed(1)}k</div>
                              </div>
                            </div>
                          ))}
                        </div>
                     </div>

                     {/* Live Event Feed (Image) */}
                     <div className="flex-1 bg-white/5 border border-white/10 rounded-xl relative overflow-hidden hidden lg:block group">
                        <img src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=600" alt="Live Event" className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-all duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent"></div>
                        <div className="absolute inset-0 p-5 flex flex-col justify-end pointer-events-none">
                          <div className="flex items-center gap-2 mb-2">
                             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                             <span className="text-red-400 text-[10px] font-bold tracking-widest uppercase">Live Now</span>
                          </div>
                          <h4 className="text-white font-bold text-sm mb-1 leading-tight">Summer Sounds Festival</h4>
                          <p className="text-slate-300 text-[10px] flex items-center gap-1 font-medium"><Users size={12} className="text-slate-400" /> 12,405 Attendees</p>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Glowing Reflection */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-t from-coral-500/10 to-orange-500/10 blur-[100px] -z-10" />
          </motion.div>

        </div>
      </section>

      {/* ─── Ticker ───────────────────────────────────────────── */}
      <Ticker />

      {/* ─── Why Festival Hub ─────────────────────────────────── */}
      <WhyFestivalHub />

      {/* ─── Event Planning CTA (Dark Theme Slide-Up Style) ──────── */}
      <motion.section
        ref={ctaRef}
        style={{
          scale: ctaScale,
          y: ctaY,
          transformOrigin: "bottom center",
          willChange: "transform"
        }}
        className="relative z-30 -mt-12 md:-mt-24 bg-[#141E34] rounded-t-[3rem] md:rounded-t-[4rem] shadow-[0_-20px_60px_rgba(0,0,0,0.3)] border-t border-white/10 overflow-hidden pt-fluid-xl pb-fluid-xl px-fluid-md lg:px-fluid-lg"
      >
        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 bg-noise opacity-[0.12] pointer-events-none z-0" aria-hidden="true" />

        {/* Massive Background Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none z-0">
          <h2 className="text-[18vw] font-black text-white whitespace-nowrap tracking-tighter uppercase opacity-[0.03]" aria-hidden="true">
            EVENTS
          </h2>
        </div>

        <div className="container relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">

          {/* Left Side: Typography */}
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-10 flex flex-col items-center lg:items-start">
              <div className="inline-flex items-center gap-3 mb-6 px-1">
                <div className="w-2 h-2 rounded-full bg-gold-500 shadow-[0_0_8px_rgba(234,179,8,0.8)] animate-pulse" />
                <span className="text-gold-500 font-mono text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase opacity-90">
                  GET IN TOUCH
                </span>
              </div>

              <div className="relative group w-fit" style={{ perspective: "1000px" }}>
                <h2
                  className="loop-glitch font-display text-[4rem] sm:text-[5.5rem] lg:text-[7rem] xl:text-[8rem] font-black text-white uppercase cursor-default select-none block whitespace-nowrap"
                  data-text="GOT AN EVENT"
                  style={{ lineHeight: "1", letterSpacing: "-0.03em", textShadow: "0 10px 40px rgba(0,0,0,0.5)" }}
                >
                  GOT AN EVENT
                </h2>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    margin: "0.4em 0 0.3em",
                  }}
                >
                  <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(234,179,8,0.5), transparent)" }} />
                  <span
                    className="font-display uppercase"
                    style={{
                      fontSize: "clamp(0.6rem, 1.4vw, 1rem)",
                      letterSpacing: "0.55em",
                      color: "rgba(234,179,8,0.65)",
                      fontWeight: 700,
                    }}
                  >
                    IN
                  </span>
                  <div style={{ flex: 1, height: "2px", background: "linear-gradient(90deg, transparent, rgba(234,179,8,0.5))" }} />
                </div>

                <h2
                  className="font-display text-[4.5rem] sm:text-[6rem] lg:text-[7.5rem] xl:text-[9rem] font-black uppercase cursor-default select-none block text-center"
                  style={{
                    lineHeight: "1",
                    letterSpacing: "-0.03em",
                    color: "transparent",
                    WebkitTextStroke: "1.5px rgba(234,179,8,0.6)",
                    background: "linear-gradient(105deg, rgba(234,179,8,0.15) 20%, rgba(234,179,8,0.95) 50%, rgba(234,179,8,0.15) 80%)",
                    backgroundSize: "300% 100%",
                    WebkitBackgroundClip: "text",
                    animation: "shimmer-text 4s ease-in-out infinite",
                    filter: "drop-shadow(0 0 20px rgba(234,179,8,0.15))",
                  }}
                >
                  MIND?
                </h2>
              </div>
            </div>

            <p className="text-lg md:text-xl text-blue-100/60 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Whether it's a massive music festival, a tech conference, or a private gathering, our expert team is here to help you bring your vision to life — anywhere in the world.
            </p>

            <button onClick={() => setIsContactModalOpen(true)} className="group inline-flex items-center justify-center px-10 py-5 text-sm font-bold tracking-widest text-white uppercase transition-all duration-300 bg-coral-500 rounded-full hover:bg-coral-600 shadow-xl hover:shadow-2xl">
              Start a Conversation
              <motion.span
                className="ml-3 font-normal"
                animate={{ x: [0, 5, 0], y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                ↗
              </motion.span>
            </button>
          </div>

          {/* Right Side: Spinning Circular Text */}
          <div className="relative shrink-0 w-64 h-64 md:w-80 md:h-80 flex items-center justify-center hidden sm:flex">
            {/* Center Icon/Button */}
            <div className="absolute w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-inner z-10 border border-white/20">
              <Star className="w-8 h-8 text-white opacity-80" />
            </div>

            {/* Spinning Text SVG */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="w-full h-full"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                <path
                  id="circlePath"
                  d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                  fill="none"
                />
                <text className="text-[11px] font-bold uppercase fill-white">
                  <textPath href="#circlePath" startOffset="0%" textLength="220">
                    {"PLAN • HOST • ORGANIZE •\u00A0"}
                  </textPath>
                </text>
              </svg>
            </motion.div>
          </div>

        </div>
      </motion.section>
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </div>
  );
}