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
    theme: {
      shadowHex: "#F43F5E",
      hoverBorder: "group-hover:border-rose-500",
      iconBg: "bg-rose-500/10",
      iconText: "text-rose-600",
      iconHoverBg: "group-hover:bg-rose-500",
      iconHoverShadow: "group-hover:shadow-[0_0_15px_rgba(244,63,94,0.4)]",
      titleHover: "group-hover:text-rose-600",
      tagBorder: "border-rose-500/20",
      tagText: "text-rose-700",
      tagHoverBg: "group-hover:bg-rose-500/10",
      tagHoverBorder: "group-hover:border-rose-500/40"
    }
  },
  {
    id: "02.",
    title: "Real-time Analytics",
    description: "Track sales, monitor attendee demographics, and view live check-in scan rates as they happen.",
    icon: Brain,
    tag: "Intelligence",
    theme: {
      shadowHex: "#3B82F6",
      hoverBorder: "group-hover:border-blue-500",
      iconBg: "bg-blue-500/10",
      iconText: "text-blue-600",
      iconHoverBg: "group-hover:bg-blue-500",
      iconHoverShadow: "group-hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]",
      titleHover: "group-hover:text-blue-600",
      tagBorder: "border-blue-500/20",
      tagText: "text-blue-700",
      tagHoverBg: "group-hover:bg-blue-500/10",
      tagHoverBorder: "group-hover:border-blue-500/40"
    }
  },
  {
    id: "03.",
    title: "Audience Connection",
    description: "Connect with your attendees before, during, and after the event via live announcements and alerts.",
    icon: Star,
    tag: "Engagement",
    theme: {
      shadowHex: "#10B981",
      hoverBorder: "group-hover:border-emerald-500",
      iconBg: "bg-emerald-500/10",
      iconText: "text-emerald-600",
      iconHoverBg: "group-hover:bg-emerald-500",
      iconHoverShadow: "group-hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]",
      titleHover: "group-hover:text-emerald-600",
      tagBorder: "border-emerald-500/20",
      tagText: "text-emerald-700",
      tagHoverBg: "group-hover:bg-emerald-500/10",
      tagHoverBorder: "group-hover:border-emerald-500/40"
    }
  },
  {
    id: "04.",
    title: "Interactive Maps",
    description: "Provide custom, interactive venue maps to help attendees navigate stages and food courts effortlessly.",
    icon: MapIcon,
    tag: "Experience",
    theme: {
      shadowHex: "#FFB703",
      hoverBorder: "group-hover:border-gold-500",
      iconBg: "bg-gold-500/10",
      iconText: "text-gold-600",
      iconHoverBg: "group-hover:bg-gold-500",
      iconHoverShadow: "group-hover:shadow-[0_0_15px_rgba(255,183,3,0.4)]",
      titleHover: "group-hover:text-gold-600",
      tagBorder: "border-gold-500/20",
      tagText: "text-gold-700",
      tagHoverBg: "group-hover:bg-gold-500/10",
      tagHoverBorder: "group-hover:border-gold-500/40"
    }
  }
];

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-surface-0 flex items-center justify-center">
      {/* Diffuse rotating background glow */}
      <motion.div 
        className="absolute w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] rounded-[40%] bg-gradient-to-tr from-gold-500/10 via-coral-500/5 to-transparent blur-[120px]"
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }}
      />
      
      {/* Subtle inner core glow */}
      <motion.div 
        className="absolute w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-gold-400/10 blur-[80px]"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 8, repeat: Infinity, ease: "easeInOut" 
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
      <svg
        className="absolute w-[150vw] h-[150vh] min-w-[1000px] min-h-[1000px] text-gold-500"
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <style>
            {`
              @keyframes customSpin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}
          </style>
          <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffb703" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#ffb703" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ffb703" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        {Array.from({ length: 24 }).map((_, i) => {
          const duration = 40 + i * 2; // Much faster rotation (40-88 seconds)
          const startRotation = i * 15;
          const delay = -(duration * (startRotation / 360));
          return (
            <ellipse
              key={i}
              cx="500" cy="500"
              rx={80 + i * 18}
              ry={280 + i * 12}
              fill="none"
              stroke="url(#lineGrad1)"
              strokeWidth="1.25"
              style={{ 
                transformOrigin: "500px 500px",
                animation: `customSpin ${duration}s linear infinite`,
                animationDelay: `${delay}s`
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default function WhyFestivalHub() {
  return (
    <section
      id="why-festivalhub"
      className="relative w-full min-h-screen text-ink-primary bg-surface-0 transition-colors duration-500 rounded-t-[3rem] z-20 border-t border-surface-border overflow-hidden flex flex-col items-center justify-center py-24 md:py-32"
    >
      {/* ─── Background ─── */}
      <AnimatedBackground />
      
      {/* ─── Header ─── */}
      <div className="relative z-10 px-6 max-w-7xl w-full mx-auto flex flex-col items-center mb-16 md:mb-20">
        <h2 className="font-display text-4xl md:text-5xl lg:text-[4rem] lg:leading-[1.1] font-extrabold tracking-tight text-ink-primary mb-6 text-center">
           Why <span className="bg-gradient-to-r from-coral-500 to-gold-500 bg-clip-text text-transparent italic pr-2">FestivalHub</span>?
        </h2>
        <p className="text-ink-secondary text-lg lg:text-xl max-w-2xl text-center">
          Everything you need to manage, scale, and elevate your festival experience—built into one seamless platform.
        </p>
      </div>

      {/* ─── 4-Column Horizontal Features Grid ─── */}
      <div className="relative z-10 max-w-[1600px] w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-[2.5rem] border border-surface-border bg-white p-8 lg:p-10 overflow-hidden group hover:-translate-y-3 transition-all duration-500 flex flex-col h-full min-h-[400px] lg:min-h-[460px] cursor-pointer"
              style={{
                boxShadow: `0 -12px 0 ${step.theme.shadowHex}, 0 15px 40px rgba(0,0,0,0.06)`,
              }}
            >
              {/* Corner accents (Faint brackets mimicking the design) */}
              <div className={`absolute top-6 left-6 w-8 h-8 border-t-[3px] border-l-[3px] border-ink-primary/15 rounded-tl-xl transition-colors duration-500 ${step.theme.hoverBorder}`} />
              <div className={`absolute top-6 right-6 w-8 h-8 border-t-[3px] border-r-[3px] border-ink-primary/15 rounded-tr-xl transition-colors duration-500 ${step.theme.hoverBorder}`} />
              <div className={`absolute bottom-6 left-6 w-8 h-8 border-b-[3px] border-l-[3px] border-ink-primary/15 rounded-bl-xl transition-colors duration-500 ${step.theme.hoverBorder}`} />
              <div className={`absolute bottom-6 right-6 w-8 h-8 border-b-[3px] border-r-[3px] border-ink-primary/15 rounded-br-xl transition-colors duration-500 ${step.theme.hoverBorder}`} />

              <div className="relative z-10 flex flex-col h-full mt-4">
                {/* Icon Box */}
                <div className={`w-16 h-16 rounded-[1.25rem] ${step.theme.iconBg} flex items-center justify-center ${step.theme.iconText} mb-8 transform transition-all duration-500 group-hover:scale-110 ${step.theme.iconHoverBg} group-hover:text-white ${step.theme.iconHoverShadow}`}>
                  <Icon className="w-8 h-8" />
                </div>

                {/* Typography */}
                <h3 className={`font-display text-2xl lg:text-3xl font-bold tracking-tight text-ink-primary mb-4 transition-colors duration-300 ${step.theme.titleHover}`}>
                  {step.title}
                </h3>
                <p className="text-base lg:text-lg text-ink-secondary leading-relaxed font-medium mb-10">
                  {step.description}
                </p>

                {/* Bottom Tags */}
                <div className="mt-auto flex items-center">
                  <span className={`text-xs lg:text-sm font-semibold px-5 py-2 rounded-full border-2 ${step.theme.tagBorder} ${step.theme.tagText} bg-transparent whitespace-nowrap transition-all duration-500 ${step.theme.tagHoverBg} ${step.theme.tagHoverBorder}`}>
                    {step.tag}
                  </span>
                </div>
              </div>

              {/* Dynamic hover shadow overlay hack because arbitrary box-shadow with custom hex is complex in raw tailwind */}
              <div 
                className="absolute inset-0 rounded-[2.5rem] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  boxShadow: `0 30px 60px rgba(0,0,0,0.15)`,
                }}
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

