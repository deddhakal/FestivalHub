import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { Ticket, BarChart3, Users, Map as MapIcon } from 'lucide-react';

const POINTS = [
  {
    id: 1,
    title: 'Seamless Ticketing',
    desc: 'Sell tickets with zero hassle, instant payouts, and flexible pricing tiers tailored for any event size.',
    icon: Ticket,
  },
  {
    id: 2,
    title: 'Real-time Analytics',
    desc: 'Track sales, monitor attendee demographics, and view live check-in scan rates as they happen.',
    icon: BarChart3,
  },
  {
    id: 3,
    title: 'Audience Engagement',
    desc: 'Connect with your attendees before, during, and after the event via live announcements and alerts.',
    icon: Users,
  },
  {
    id: 4,
    title: 'Interactive Maps',
    desc: 'Provide custom, interactive venue maps to help attendees navigate stages and food courts effortlessly.',
    icon: MapIcon,
  },
];

export default function WhyFestivalHub() {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((v) => {
      // Divide the scroll space into 4 equal regions
      const index = Math.min(Math.floor(v * 4), 3);
      setActiveIndex(index);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const activePoint = POINTS[activeIndex];
  const Icon = activePoint.icon;

  return (
    <section ref={containerRef} className="h-[400vh] bg-surface-0 relative border-t border-surface-border">
      
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
        
        {/* Decorative Background Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="container relative z-10 w-full px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center">
            
            {/* Left: Fancy Title & Huge Number */}
            <div className="lg:w-1/2 flex flex-col justify-center pb-12 lg:pb-0 w-full">
              
              <div className="mb-4 lg:mb-8">
                <h2 className="font-display text-5xl md:text-6xl font-extrabold tracking-tight text-ink-primary">
                  Why <span className="bg-gradient-to-r from-coral-500 to-gold-500 bg-clip-text text-transparent italic pr-2">FestivalHub</span>?
                </h2>
                <div className="w-24 h-1.5 bg-gradient-to-r from-coral-500 to-gold-500 mt-4 rounded-full" />
              </div>

              <div className="flex items-baseline font-display text-[8rem] md:text-[12rem] lg:text-[16rem] leading-[0.8] font-bold tracking-tighter select-none">
                <span className="text-surface-muted/50">0</span>
                <div className="relative w-[0.8em] h-[1em] overflow-hidden flex items-center justify-center text-ink-primary">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={activeIndex}
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: "-100%", opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className="absolute"
                    >
                      {activeIndex + 1}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <span className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full bg-gold-500 ml-2 md:ml-4 lg:mb-6 shadow-[0_0_20px_rgba(255,183,3,0.4)]" />
              </div>
            </div>

            {/* Right: The Single Active Card that transitions in place */}
            <div className="lg:w-1/2 relative lg:pl-20 w-full">
              {/* Connector Dot & Line */}
              <div className="absolute left-10 top-0 bottom-0 w-px bg-surface-border hidden lg:block" />
              <div className="absolute left-10 top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-[4px] border-surface-0 bg-gold-500 hidden lg:block shadow-sm z-10 transition-all duration-300" />
              
              <div className="relative w-full h-[350px] md:h-[400px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 60, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -60, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 md:p-12 shadow-soft border border-surface-border h-full flex flex-col justify-center relative overflow-hidden group">
                      
                      {/* Step indicator */}
                      <div className="absolute top-8 right-8 text-xs font-bold tracking-widest text-ink-tertiary">
                        STEP 0{activeIndex + 1}.
                      </div>

                      {/* Decorative corner borders */}
                      <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-gold-500/30 rounded-tl-[2rem]" />
                      <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-gold-500/30 rounded-br-[2rem]" />

                      <div className="w-16 h-16 rounded-2xl bg-gold-50 border border-gold-100 flex items-center justify-center mb-6 relative z-10">
                        <Icon className="w-8 h-8 text-gold-500" />
                      </div>
                      
                      <h3 className="font-display text-3xl font-bold text-ink-primary mb-4 relative z-10">
                        {activePoint.title}
                      </h3>
                      
                      <p className="text-lg text-ink-secondary leading-relaxed relative z-10">
                        {activePoint.desc}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
