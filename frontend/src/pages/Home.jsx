import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Ticket, Star, X, ArrowUpRight } from 'lucide-react';
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
    } else if (!/^\d{10}$/.test(phoneVal.replace(/[-\s]/g, ''))) {
      newErrors.phone = "Phone number must be exactly 10 digits";
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
                    <input type="tel" value={form.phone} onChange={set("phone")} className={`w-full bg-surface-100 border ${errors.phone ? 'border-red-500' : 'border-surface-border'} rounded-lg px-4 py-2.5 text-sm text-ink-primary focus:outline-none focus:border-brand-500 transition-colors`} placeholder="Your phone number" />
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
      <section className="relative min-h-[90vh] flex items-center pt-fluid-xl pb-fluid-lg overflow-hidden bg-surface-0">
        {/* Soft Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-coral-100/40 via-brand-50/30 to-transparent pointer-events-none rounded-bl-[100px]" aria-hidden="true" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-brand-200/20 blur-[100px] rounded-full pointer-events-none" aria-hidden="true" />

        <div className="container relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-fluid-md lg:gap-8 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-600 mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                <span className="text-xs font-bold tracking-wide uppercase">The ultimate event platform</span>
              </div>

              <h1 className="font-display text-fluid-5xl font-extrabold text-ink-primary leading-[1.1] tracking-tight mb-6">
                Create, Manage & 
                <br />
                <span className="text-brand-500">Host Extraordinary</span>
                <br />
                Events
              </h1>

              <p className="text-fluid-lg text-ink-secondary leading-relaxed mb-10 font-medium max-w-xl mx-auto lg:mx-0">
                The all-in-one platform for organizers to launch their events, sell tickets, and create unforgettable experiences for attendees.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-4">
                <Link to="/events" className="btn-primary btn-lg shadow-lift text-lg px-8 py-4">
                  Discover Events
                </Link>
                <Link to="/admin/login" className="btn-secondary btn-lg text-lg px-8 py-4 bg-white border-surface-border">
                  Create an Event
                </Link>
              </div>
              
              {/* Trust/Stats Row */}
              <div className="mt-12 pt-8 border-t border-surface-border flex flex-wrap items-center justify-center lg:justify-start gap-8 opacity-90">
                 <div>
                   <p className="font-display text-3xl font-bold text-ink-primary mb-1">10k+</p>
                   <p className="text-xs font-bold text-ink-tertiary uppercase tracking-wider">Events Hosted</p>
                 </div>
                 <div className="w-px h-8 bg-surface-border hidden sm:block" />
                 <div>
                   <p className="font-display text-3xl font-bold text-ink-primary mb-1">2M+</p>
                   <p className="text-xs font-bold text-ink-tertiary uppercase tracking-wider">Tickets Sold</p>
                 </div>
                 <div className="w-px h-8 bg-surface-border hidden sm:block" />
                 <div>
                   <p className="font-display text-3xl font-bold text-ink-primary mb-1">4.9/5</p>
                   <p className="text-xs font-bold text-ink-tertiary uppercase tracking-wider">Organizer Rating</p>
                 </div>
              </div>
            </motion.div>

            {/* Right Graphic/Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="relative hidden lg:block"
            >
               <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-surface-border bg-white p-3 aspect-[4/3] rotate-2 hover:rotate-0 transition-transform duration-500">
                 <img 
                   src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1200" 
                   alt="Event management crowd" 
                   className="w-full h-full object-cover rounded-2xl"
                   fetchPriority="high"
                 />
                 <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5" />
               </div>
               
               {/* Floating Elements */}
               <motion.div 
                 animate={{ y: [-10, 10, -10] }}
                 transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                 className="absolute -bottom-6 -left-10 bg-white p-4 rounded-2xl shadow-xl border border-surface-border flex items-center gap-4 z-20"
               >
                 <div className="w-12 h-12 rounded-full bg-mint-100 flex items-center justify-center">
                    <span className="text-mint-500 font-bold text-xl">✓</span>
                 </div>
                 <div>
                    <p className="text-sm font-bold text-ink-primary">Ticket Sold!</p>
                    <p className="text-xs text-ink-tertiary">Just now</p>
                 </div>
               </motion.div>
            </motion.div>
            
          </div>
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
                  className="loop-glitch font-display text-[4rem] sm:text-[5.5rem] lg:text-[7rem] xl:text-[8rem] font-black text-white uppercase cursor-default select-none block"
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
                  <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(234,179,8,0.5))" }} />
                </div>
                
                <h2 
                  className="font-display text-[4.5rem] sm:text-[6rem] lg:text-[7.5rem] xl:text-[9rem] font-black uppercase cursor-default select-none block"
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
              Whether it's a massive music festival, a tech conference, or a private gathering, our expert team is here to help you bring your vision to life.
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
