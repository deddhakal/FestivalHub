import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ticket } from 'lucide-react';
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

export default function Home() {
  return (
    <div className="min-h-screen bg-surface-0">

      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-20 px-4 md:px-6 overflow-hidden bg-surface-0">
        {/* Soft Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-coral-100/40 via-brand-50/30 to-transparent pointer-events-none rounded-bl-[100px]" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-brand-200/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
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

              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-extrabold text-ink-primary leading-[1.1] tracking-tight mb-6">
                Create, Manage & 
                <br />
                <span className="text-brand-500">Host Extraordinary</span>
                <br />
                Events
              </h1>

              <p className="text-lg md:text-xl text-ink-secondary leading-relaxed mb-10 font-medium max-w-xl mx-auto lg:mx-0">
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

      {/* ─── Booking CTA ──────────────────────────────────────── */}
      <section className="section px-4 md:px-6 relative overflow-hidden bg-surface-0">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-coral-500 rounded-[2.5rem] p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl relative overflow-hidden text-center md:text-left"
          >
            {/* Decorative background for CTA */}
            <div className="absolute inset-0 z-0">
               <img src="https://images.unsplash.com/photo-1470229722913-7c092dbbba3a?w=1200&q=80" alt="Concert" className="w-full h-full object-cover opacity-20 mix-blend-overlay" loading="lazy" />
               <div className="absolute inset-0 bg-gradient-to-r from-coral-500 via-coral-500/90 to-transparent" />
            </div>

            <div className="relative z-10 max-w-2xl">
              <span className="badge bg-white/20 text-white border border-white/30 mb-6 text-sm px-5 py-2 backdrop-blur-sm">Don't miss out</span>
              <h2 className="font-display text-4xl md:text-6xl text-white mb-6 font-bold leading-tight">Secure your spot <br className="hidden md:block"/> at the next big event</h2>
              <p className="text-xl text-white/90 font-medium">Join thousands of attendees creating unforgettable memories.</p>
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-5 shrink-0 w-full md:w-auto">
              <Link to="/booking" className="btn-primary btn-lg shadow-lift bg-white text-coral-500 hover:bg-surface-0 w-full sm:w-auto">
                <Ticket className="w-5 h-5 mr-1" />
                Book Tickets Now
              </Link>
              <Link to="/contact" className="btn-secondary btn-lg bg-white/20 border-white/50 text-white hover:bg-white/30 hover:border-white backdrop-blur-sm w-full sm:w-auto">
                Get Help
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
