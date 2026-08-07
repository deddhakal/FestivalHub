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
      <section style={{ position:'relative', minHeight:'100vh', display:'flex', alignItems:'center', background:'linear-gradient(160deg,#FFF2EF 0%,#FFF6F3 50%,#FFEEE8 100%)', overflow:'hidden', paddingTop:'70px', paddingBottom:'20px' }}>

        {/* Background blobs */}
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:0 }}>
          <div style={{ position:'absolute', top:'50%', right:'5%', width:'55%', height:'85%', borderRadius:'50%', transform:'translateY(-50%)', background:'radial-gradient(ellipse at 50% 50%,rgba(255,160,130,0.38) 0%,rgba(255,200,170,0.22) 40%,transparent 72%)', filter:'blur(50px)' }} />
          <div style={{ position:'absolute', bottom:'-8%', left:'-5%', width:'35%', height:'45%', borderRadius:'50%', background:'radial-gradient(ellipse at 50% 50%,rgba(255,140,110,0.18) 0%,transparent 70%)', filter:'blur(60px)' }} />
          <div style={{ position:'absolute', top:'14%', left:'38%', color:'#FDA4AF', opacity:0.55, fontSize:'16px', fontWeight:900, userSelect:'none' }}>✦</div>
          <div style={{ position:'absolute', top:'8%', left:'46%', color:'#FCA5A5', opacity:0.35, fontSize:'11px', userSelect:'none' }}>✦</div>
          <div style={{ position:'absolute', top:'10%', right:'28%', width:'10px', height:'10px', borderRadius:'50%', background:'#FB7185', opacity:0.75 }} />
          <div style={{ position:'absolute', top:'22%', right:'14%', width:'6px', height:'6px', borderRadius:'50%', background:'#FDA4AF', opacity:0.5 }} />
        </div>

        <div style={{ width:'100%', maxWidth:'1400px', margin:'0 auto', padding:'0 64px', position:'relative', zIndex:1 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'48px', alignItems:'center' }}>

            {/* ── Left Column ── */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } } }}
            >
              {/* Eyebrow Badge */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } } }}
                style={{ display:'inline-flex', alignItems:'center', gap:'10px', marginBottom:'28px' }}
              >
                <div style={{ width:'10px', height:'10px', borderRadius:'50%', background:'#F43F5E', boxShadow:'0 0 8px rgba(244,63,94,0.6)', flexShrink:0 }} className="animate-pulse" />
                <span style={{ fontSize:'11px', fontWeight:800, letterSpacing:'0.18em', color:'#F43F5E', textTransform:'uppercase' }}>Ultimate Event Platform</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 18 } } }}
                style={{ fontFamily:"'Plus Jakarta Sans', sans-serif", fontWeight:800, color:'#0D1117', fontSize:'clamp(52px, 5vw, 70px)', lineHeight:1.1, letterSpacing:'-0.015em', marginBottom:'20px' }}
              >
                <span style={{ display:'block' }}>Create,</span>
                <span style={{ display:'block' }}>Manage &</span>
                <span style={{ display:'block' }}>Host Extraordinary</span>
                <span style={{ display:'block', position:'relative' }}>
                  <span style={{ background:'linear-gradient(135deg,#F43F5E 0%,#FF6B6B 60%,#FF8C42 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', display:'inline' }}>Events</span>
                  <svg style={{ position:'absolute', top:'8px', left:'calc(100% + 8px)', width:'56px', height:'26px', color:'#F43F5E', opacity:0.85, pointerEvents:'none' }} viewBox="0 0 56 26" fill="none">
                    <motion.path d="M3 20 C 8 20, 16 4, 36 3.5 C 45 3, 50 5.5, 53 8" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" initial={{ pathLength:0, opacity:0 }} animate={{ pathLength:1, opacity:1 }} transition={{ duration:1, delay:0.8, ease:'easeInOut' }} />
                    <motion.path d="M46 1 L 53 8 L 47 14" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.8, duration:0.3 }} />
                  </svg>
                </span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                style={{ color:'#64748B', fontSize:'16px', lineHeight:1.72, fontWeight:400, maxWidth:'440px', marginBottom:'32px' }}
              >
                From Sydney rooftop launches to Melbourne music festivals — plan, promote, and manage events effortlessly. Sell tickets, track registrations, and deliver unforgettable experiences, all from one powerful platform.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                style={{ display:'flex', alignItems:'center', gap:'16px', flexWrap:'wrap', marginBottom:'40px' }}
              >
                <Link to="/events"
                  style={{ display:'inline-flex', alignItems:'center', gap:'10px', background:'linear-gradient(135deg,#F43F5E 0%,#FF5533 100%)', color:'white', fontWeight:700, fontSize:'15px', padding:'14px 28px', borderRadius:'14px', boxShadow:'0 8px 24px rgba(244,63,94,0.32)', transition:'all 0.25s ease', textDecoration:'none' }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 14px 32px rgba(244,63,94,0.42)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(244,63,94,0.32)'; }}
                >
                  <Calendar size={18} />
                  Discover Events
                  <ArrowUpRight size={16} />
                </Link>
                <Link to="/admin/login"
                  style={{ display:'inline-flex', alignItems:'center', gap:'10px', background:'white', color:'#0F172A', fontWeight:600, fontSize:'15px', padding:'14px 28px', borderRadius:'14px', border:'1.5px solid #E2E8F0', boxShadow:'0 2px 10px rgba(0,0,0,0.04)', transition:'all 0.25s ease', textDecoration:'none' }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 20px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 10px rgba(0,0,0,0.04)'; }}
                >
                  <PlusSquare size={18} style={{ color:'#94A3B8' }} />
                  Create an Event
                </Link>
              </motion.div>

              {/* Stats Row */}
              <motion.div
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.45 } } }}
                style={{ display:'flex', alignItems:'center', borderTop:'1px solid rgba(0,0,0,0.07)', paddingTop:'24px' }}
              >
                {[
                  { icon: <Ticket size={16} className="text-coral-500" />, value: '6K+', label: 'Events Hosted', bg: '#FFF1EE' },
                  { icon: <Users size={16} style={{ color:'#F97316' }} />, value: '350K+', label: 'Happy Attendees', bg: '#FFF7ED' },
                  { icon: <ShieldCheck size={16} style={{ color:'#14B8A6' }} />, value: '99.9%', label: 'Secure & Reliable', bg: '#F0FDFA' },
                  { icon: <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#8B5CF6' }} className="animate-pulse" />, value: 'Live', label: 'Events Running', bg: '#F5F3FF' },
                ].map((s, i) => (
                  <motion.div key={i} variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }} style={{ display:'flex', alignItems:'center' }}>
                    {i > 0 && <div style={{ width:'1px', height:'36px', background:'#E2E8F0', margin:'0 20px', flexShrink:0 }} />}
                    <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                      <div style={{ width:'34px', height:'34px', borderRadius:'10px', background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{s.icon}</div>
                      <div>
                        <p style={{ fontWeight:800, color:'#0F172A', fontSize:'16px', lineHeight:1, margin:0 }}>{s.value}</p>
                        <p style={{ color:'#94A3B8', fontSize:'10px', fontWeight:500, margin:'3px 0 0 0' }}>{s.label}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* ── Right Column: Interactive Visual ── */}
            <div className="hidden lg:block" style={{ position:'relative', height:'620px', overflow:'visible' }}>

              {/* Decorative dots */}
              <div style={{ position:'absolute', top:'8px', right:'8px', opacity:0.4, pointerEvents:'none', zIndex:0 }}>
                {[...Array(16)].map((_, i) => (
                  <div key={i} style={{ display:'inline-block', width:'6px', height:'6px', borderRadius:'50%', background:'#FDA4AF', margin:'4px', opacity:0.6 }} />
                ))}
              </div>

              {/* Central Festival Image — shifted right in its column */}
              <motion.div
                initial={{ opacity: 0, scale: 0.88, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'360px', height:'450px', borderRadius:'28px', padding:'10px', background:'rgba(255,255,255,0.22)', border:'1.5px solid rgba(255,255,255,0.55)', boxShadow:'0 32px 80px rgba(0,0,0,0.14),0 0 0 1px rgba(255,200,180,0.2)', backdropFilter:'blur(12px)', zIndex:10 }}
              >
                <div style={{ width:'100%', height:'100%', borderRadius:'22px', overflow:'hidden', position:'relative' }}>
                  <motion.img
                    src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1200"
                    alt="Music festival crowd, Australia"
                    style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
                    animate={{ scale: [1, 1.04, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    fetchPriority="high"
                  />
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.3) 0%,transparent 55%)' }} />
                </div>
              </motion.div>

              {/* Card 1: Total Revenue — left of image, clearly offset */}
              <motion.div
                initial={{ opacity: 0, x: -30, y: 10 }} animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.9, delay: 0.7, type: 'spring', stiffness: 100 }}
                style={{ position:'absolute', top:'20%', left:'-5%', zIndex:20 }}
              >
                <motion.div animate={{ y: [-8, 8, -8] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ background:'rgba(18,24,40,0.93)', backdropFilter:'blur(24px)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'20px', padding:'18px 20px', width:'190px', boxShadow:'0 20px 50px rgba(0,0,0,0.28)' }}
                >
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px' }}>
                    <div style={{ width:'28px', height:'28px', borderRadius:'8px', background:'rgba(249,115,22,0.22)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <span style={{ color:'#FB923C', fontSize:'12px', fontWeight:700 }}>$</span>
                    </div>
                    <span style={{ color:'rgba(255,255,255,0.5)', fontSize:'11px', fontWeight:600 }}>Total Revenue</span>
                  </div>
                  <p style={{ color:'white', fontWeight:800, fontSize:'20px', marginBottom:'4px', letterSpacing:'-0.02em' }}>$1,842,650</p>
                  <p style={{ color:'#34D399', fontSize:'11px', fontWeight:700 }}>↑ 18.6% <span style={{ color:'rgba(255,255,255,0.3)', fontWeight:400 }}>this month</span></p>
                  <div style={{ marginTop:'14px', height:'38px', display:'flex', alignItems:'flex-end', gap:'3px' }}>
                    {[18,38,25,52,33,68,45,82,60,100].map((h,i) => (
                      <motion.div key={i} initial={{ height:0 }} animate={{ height:`${h}%` }} transition={{ delay:0.8+i*0.07, duration:0.65, type:'spring' }}
                        style={{ flex:1, background:'linear-gradient(to top,#059669,#34D399)', borderRadius:'2px 2px 0 0', minWidth:'4px' }} />
                    ))}
                  </div>
                </motion.div>
              </motion.div>

              {/* Card 2: Live Ticket Sales — top-right */}
              <motion.div
                initial={{ opacity:0, x:30, y:-20 }} animate={{ opacity:1, x:0, y:0 }}
                transition={{ duration:0.9, delay:0.75, type:'spring' }}
                style={{ position:'absolute', top:'3%', right:'2%', zIndex:20 }}
              >
                <motion.div animate={{ y:[8,-8,8] }} transition={{ duration:6, repeat:Infinity, ease:'easeInOut' }}
                  style={{ background:'rgba(255,255,255,0.94)', backdropFilter:'blur(24px)', border:'1px solid rgba(255,255,255,0.95)', borderRadius:'20px', padding:'16px 20px', width:'205px', boxShadow:'0 14px 40px rgba(0,0,0,0.09)' }}
                >
                  <div style={{ display:'flex', alignItems:'center', gap:'7px', marginBottom:'8px' }}>
                    <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#F43F5E', flexShrink:0 }} className="animate-pulse" />
                    <span style={{ color:'#94A3B8', fontSize:'11px', fontWeight:600 }}>Live Ticket Sales</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:'4px' }}>
                    <p style={{ color:'#0F172A', fontWeight:900, fontSize:'32px', lineHeight:1, letterSpacing:'-0.04em' }}>2,318</p>
                    <p style={{ color:'#10B981', fontSize:'12px', fontWeight:700, paddingBottom:'3px' }}>↑ 27.1%</p>
                  </div>
                  <p style={{ color:'#CBD5E1', fontSize:'10px', fontWeight:500, marginBottom:'10px' }}>Tickets Sold</p>
                  <svg width="100%" height="42" viewBox="0 0 170 42" style={{ overflow:'visible' }}>
                    <defs><linearGradient id="tg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F43F5E" stopOpacity="0.22" /><stop offset="100%" stopColor="#F43F5E" stopOpacity="0" /></linearGradient></defs>
                    <motion.path d="M0 37 C 22 37, 28 20, 52 27 C 76 34, 98 7, 128 11 C 152 14, 158 9, 170 5" fill="none" stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round" initial={{ pathLength:0 }} animate={{ pathLength:1 }} transition={{ duration:1.5, delay:1.1, ease:'easeInOut' }} />
                    <path d="M0 37 C 22 37, 28 20, 52 27 C 76 34, 98 7, 128 11 C 152 14, 158 9, 170 5 L 170 42 L 0 42 Z" fill="url(#tg2)" />
                  </svg>
                </motion.div>
              </motion.div>

              {/* Card 3: Attendees pill */}
              <motion.div
                initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }}
                transition={{ duration:0.9, delay:0.85, type:'spring' }}
                style={{ position:'absolute', bottom:'24%', left:'8%', zIndex:25 }}
              >
                <motion.div animate={{ y:[5,-5,5] }} transition={{ duration:4.5, repeat:Infinity, ease:'easeInOut' }}
                  style={{ background:'rgba(255,255,255,0.9)', backdropFilter:'blur(20px)', border:'1.5px solid rgba(255,255,255,0.95)', borderRadius:'60px', padding:'9px 18px 9px 9px', display:'flex', alignItems:'center', gap:'12px', boxShadow:'0 10px 30px rgba(0,0,0,0.08)' }}
                >
                  <div style={{ display:'flex' }}>
                    {['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80','https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=60&q=80','https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=60&q=80'].map((src,i) => (
                      <img key={i} src={src} alt="Attendee" style={{ width:'30px', height:'30px', borderRadius:'50%', border:'2px solid white', objectFit:'cover', marginLeft:i===0?0:'-8px', boxShadow:'0 2px 6px rgba(0,0,0,0.1)' }} />
                    ))}
                    <div style={{ width:'30px', height:'30px', borderRadius:'50%', border:'2px solid white', background:'#E2E8F0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'8px', fontWeight:700, color:'#64748B', marginLeft:'-8px' }}>+120</div>
                  </div>
                  <div>
                    <p style={{ fontWeight:700, color:'#0F172A', fontSize:'13px', lineHeight:1.2, margin:0 }}>480+ Attendees</p>
                    <p style={{ color:'#94A3B8', fontSize:'10px', fontWeight:500, margin:'2px 0 0 0' }}>joined this event</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Card 4: VIP Ticket — bottom-right, rotated */}
              <motion.div
                initial={{ opacity:0, x:28, rotateZ:8 }} animate={{ opacity:1, x:0, rotateZ:6 }}
                transition={{ duration:1, delay:0.88, type:'spring' }}
                style={{ position:'absolute', bottom:'5%', right:'0%', zIndex:20 }}
              >
                <motion.div whileHover={{ rotateZ:0, scale:1.04 }} animate={{ y:[-6,6,-6] }} transition={{ duration:5.5, repeat:Infinity, ease:'easeInOut' }}
                  style={{ background:'linear-gradient(145deg,#1C0930 0%,#2A0D42 55%,#180828 100%)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'22px', padding:'18px 20px', width:'215px', boxShadow:'0 22px 55px rgba(0,0,0,0.38)', color:'white', position:'relative', overflow:'hidden' }}
                >
                  <div style={{ position:'absolute', top:'-15px', right:'-15px', width:'90px', height:'90px', borderRadius:'50%', background:'rgba(236,72,153,0.22)', filter:'blur(28px)' }} />
                  <p style={{ fontSize:'8.5px', fontWeight:800, letterSpacing:'0.2em', color:'#F472B6', textTransform:'uppercase', marginBottom:'6px' }}>VIP Access</p>
                  <p style={{ fontWeight:700, fontSize:'16px', marginBottom:'3px' }}>Summer Sounds Festival</p>
                  <p style={{ fontSize:'10.5px', color:'rgba(255,255,255,0.42)', marginBottom:'14px', lineHeight:1.55 }}>17 - 19 Jan 2027<br />The Domain, Sydney</p>
                  <div style={{ background:'white', borderRadius:'10px', padding:'8px', display:'inline-block' }}>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(8, 7px)', gap:'1.5px' }}>
                      {[1,1,1,1,0,1,0,1,1,0,0,1,0,0,1,0,1,0,1,0,1,1,0,1,1,1,1,1,0,1,1,0,0,0,1,0,0,0,1,1,1,1,0,1,0,1,0,1,1,0,1,1,1,0,0,0,0,1,1,0,1,1,0,1].map((on,i) => (
                        <div key={i} style={{ width:'7px', height:'7px', borderRadius:'1px', background:on?'#0F172A':'transparent' }} />
                      ))}
                    </div>
                  </div>
                  <div style={{ position:'absolute', left:'-9px', top:'62%', width:'18px', height:'18px', borderRadius:'50%', background:'#FFF0EE' }} />
                  <div style={{ position:'absolute', right:'-9px', top:'62%', width:'18px', height:'18px', borderRadius:'50%', background:'#FFF0EE' }} />
                </motion.div>
              </motion.div>

              {/* Card 5: Ticket Sold notification */}
              <motion.div
                initial={{ opacity:0, scale:0.7, y:20 }} animate={{ opacity:1, scale:1, y:0 }}
                transition={{ duration:0.8, delay:1.05, type:'spring', stiffness:145 }}
                style={{ position:'absolute', bottom:'2%', left:'30%', zIndex:30 }}
              >
                <motion.div whileHover={{ scale:1.05 }}
                  style={{ background:'white', border:'1px solid rgba(226,232,240,0.7)', borderRadius:'18px', padding:'13px 22px 13px 14px', display:'flex', alignItems:'center', gap:'14px', boxShadow:'0 12px 36px rgba(0,0,0,0.1)', cursor:'default', position:'relative' }}
                >
                  <div style={{ position:'absolute', top:'10px', right:'12px', width:'8px', height:'8px', borderRadius:'50%', background:'#10B981', boxShadow:'0 0 6px rgba(16,185,129,0.5)' }} className="animate-pulse" />
                  <div style={{ width:'44px', height:'44px', borderRadius:'50%', flexShrink:0, background:'linear-gradient(135deg,#F43F5E 0%,#FF5533 100%)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 6px 16px rgba(244,63,94,0.3)' }}>
                    <Ticket size={20} color="white" />
                  </div>
                  <div>
                    <p style={{ fontWeight:700, color:'#0F172A', fontSize:'15px', lineHeight:1.25, margin:0 }}>Ticket Sold!</p>
                    <p style={{ color:'#94A3B8', fontSize:'11px', fontWeight:500, margin:'2px 0 0 0' }}>Just now</p>
                  </div>
                </motion.div>
              </motion.div>

            </div>{/* end right col */}
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