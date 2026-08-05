import { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useMotionValueEvent, useTransform } from 'framer-motion';
import { Ticket, Brain, Star, Map as MapIcon } from 'lucide-react';

const steps = [
  {
    id: "01.",
    title: "Seamless Ticketing",
    description: "Sell tickets with zero hassle, instant payouts, and flexible pricing tiers tailored for any event size.",
    icon: Ticket,
    tag: "Foundation",
  },
  {
    id: "02.",
    title: "Real-time Analytics",
    description: "Track sales, monitor attendee demographics, and view live check-in scan rates as they happen.",
    icon: Brain,
    tag: "Intelligence",
  },
  {
    id: "03.",
    title: "Audience Connection",
    description: "Connect with your attendees before, during, and after the event via live announcements and alerts.",
    icon: Star,
    tag: "Engagement",
  },
  {
    id: "04.",
    title: "Interactive Maps",
    description: "Provide custom, interactive venue maps to help attendees navigate stages and food courts effortlessly.",
    icon: MapIcon,
    tag: "Experience",
  },
];

const AnimatedBackground = ({ scrollYProgress }) => {
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.3, 1.6]);
  const bgRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.6, 0.3]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-surface-0 flex items-center justify-center">
      {/* Diffuse rotating background glow (Less shiny) */}
      <motion.div 
        className="absolute w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] rounded-[40%] bg-gradient-to-tr from-gold-500/20 via-coral-500/10 to-transparent blur-[120px]"
        style={{ 
          scale: bgScale,
          rotate: bgRotate,
          opacity: bgOpacity,
        }}
      />
      
      {/* Subtle inner core glow */}
      <motion.div 
        className="absolute w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-gold-400/15 blur-[80px]"
        style={{ 
          scale: bgScale,
          opacity: bgOpacity,
        }}
      />
      
      {/* Fine dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          color: "var(--color-ink-primary, #0A0A0A)"
        }}
      />

      {/* Rings - subtle layer on top */}
      <motion.svg
        className="absolute w-[150vw] h-[150vh] min-w-[1000px] min-h-[1000px] text-gold-500"
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
        style={{ scale: bgScale, rotate: bgRotate }}
      >
        <defs>
          <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffb703" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#ffb703" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#ffb703" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.ellipse
            key={i}
            cx="500" cy="500"
            rx={80 + i * 18}
            ry={280 + i * 12}
            fill="none"
            stroke="url(#lineGrad1)"
            strokeWidth="0.75"
            style={{ transformOrigin: "500px 500px" }}
            initial={{ rotate: i * 15 }}
            animate={{ rotate: i * 15 + 360 }}
            transition={{ duration: 180 + i * 4, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </motion.svg>
    </div>
  );
};

export default function WhyFestivalHub() {
  const containerRef = useRef(null);

  // Use "start start" so progress is exactly 0 when the section pins to the top of the screen
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [activeStep, setActiveStep] = useState(0);

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001,
  });

  const lineHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const step = Math.min(Math.floor(latest * steps.length), steps.length - 1);
    setActiveStep(step);
  });

  const ActiveIcon = steps[activeStep].icon;

  return (
    <section
      ref={containerRef}
      id="why-festivalhub"
      className="relative h-[400vh] w-full text-ink-primary bg-surface-0 transition-colors duration-500 rounded-t-[2.5rem] z-20 border-t border-surface-border"
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden z-10">
        
        <AnimatedBackground scrollYProgress={scrollYProgress} />
        
        {/* ─── Top Header Badge ─── */}
        <div className="absolute top-16 md:top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center gap-2">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink-primary">
             Why <span className="bg-gradient-to-r from-coral-500 to-gold-500 bg-clip-text text-transparent italic pr-1">FestivalHub</span>?
          </h2>
        </div>


        {/* ─── LEFT — Huge animated step number ─── */}
        <div className="w-[45%] h-full flex flex-col items-end justify-center pr-12 md:pr-24 gap-6 relative">

          {/* Step tag chip — sits above the number */}
          <div className="h-8 flex items-end">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-[10px] md:text-xs tracking-[0.4em] uppercase font-mono px-3 py-1 rounded-full border border-gold-500/40 text-gold-600 bg-gold-500/5 whitespace-nowrap">
                  {steps[activeStep].tag}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Gigantic number */}
          <div className="relative flex text-[80px] sm:text-[130px] md:text-[185px] lg:text-[235px] font-display font-extrabold tabular-nums leading-[0.85] tracking-tighter select-none">
            <span className="text-ink-primary/10">0</span>
            <div className="relative w-[0.6em] h-[1em] text-center text-ink-primary drop-shadow-xl grid" style={{ gridTemplateAreas: "'stack'" }}>
              <AnimatePresence>
                <motion.span
                  key={activeStep}
                  style={{ gridArea: 'stack' }}
                  initial={{ y: "50%", opacity: 0, scale: 0.8 }}
                  animate={{ y: "0%", opacity: 1, scale: 1 }}
                  exit={{ y: "-50%", opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center justify-center slashed-zero"
                >
                  {activeStep + 1}
                </motion.span>
              </AnimatePresence>
            </div>
            
            {/* The dot next to the number */}
            <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-gold-500 ml-4 shadow-[0_0_20px_rgba(255,183,3,0.4)] shrink-0 self-end mb-4 lg:mb-8" />
          </div>
        </div>

        {/* ─── CENTER — Glowing progress line ─── */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[55%] flex flex-col justify-between items-center z-30 pointer-events-none">
          {/* Track */}
          <div className="absolute top-0 bottom-0 w-[1px] bg-ink-primary/10" />

          {/* Glowing active fill */}
          <motion.div
            className="absolute top-0 w-[2px] bg-gradient-to-b from-gold-500 via-gold-500/80 to-gold-500/30 origin-top shadow-[0_0_20px_rgba(255,183,3,0.5)]"
            style={{ height: lineHeight }}
          />

          {steps.map((_, idx) => {
            const isActive = idx === activeStep;
            const isPast = idx < activeStep;

            return (
              <div key={idx} className="relative flex items-center justify-center p-2">
                <div
                  className={`flex items-center justify-center rounded-full transition-all duration-700 ${isActive
                    ? "w-4 h-4 bg-gold-500 shadow-[0_0_20px_6px_rgba(255,183,3,0.4)] scale-125"
                    : isPast
                      ? "w-3 h-3 bg-gold-500/70 scale-100"
                      : "w-2.5 h-2.5 bg-ink-primary/15 scale-75"
                    }`}
                >
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full border border-gold-500"
                      initial={{ opacity: 1, scale: 1 }}
                      animate={{ opacity: 0, scale: 3.5 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── RIGHT — Premium glass content card ─── */}
        <div className="w-[45%] ml-auto h-full flex items-center pl-12 md:pl-24 relative z-20">
          <div className="w-full max-w-lg grid" style={{ gridTemplateAreas: "'stack'" }}>
            <AnimatePresence>
              <motion.div
                key={activeStep}
                style={{ gridArea: 'stack' }}
                initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -40, filter: "blur(8px)" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                {/* Glass card */}
                <div className="relative rounded-3xl border border-ink-primary/10 bg-white/60 backdrop-blur-xl p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.04)] overflow-hidden">

                  {/* Inner glow */}
                  <div className="absolute -top-10 -left-10 w-40 h-40 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />

                  {/* Corner accents */}
                  <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-gold-500/50 rounded-tl-lg" />
                  <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-ink-primary/15 rounded-tr-lg" />
                  <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-ink-primary/15 rounded-bl-lg" />
                  <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-gold-500/50 rounded-br-lg" />

                  {/* Removed Step tag row */}

                  {/* Icon */}
                  <div className="w-14 h-14 mb-6 rounded-2xl bg-white border border-surface-border shadow-sm flex items-center justify-center">
                    <ActiveIcon className="w-7 h-7 text-gold-500" />
                  </div>

                  {/* Title */}
                  <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-ink-primary leading-tight mb-5">
                    {steps[activeStep].title}
                  </h2>

                  {/* Accent divider */}
                  <div className="w-12 h-[2px] bg-gradient-to-r from-gold-500 to-transparent rounded-full mb-5" />

                  {/* Description */}
                  <p className="text-base md:text-lg text-ink-secondary leading-relaxed font-medium">
                    {steps[activeStep].description}
                  </p>

                  {/* Progress pills */}
                  <div className="flex gap-1.5 mt-8 relative z-10">
                    {steps.map((_, i) => (
                      <div
                        key={i}
                        className={`h-[3px] rounded-full transition-all duration-700 ${i === activeStep
                          ? "w-8 bg-gold-500 shadow-[0_0_8px_rgba(255,183,3,0.5)]"
                          : i < activeStep
                            ? "w-4 bg-gold-500/40"
                            : "w-4 bg-surface-border"
                          }`}
                      />
                    ))}
                  </div>

                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
