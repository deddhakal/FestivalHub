import { useState } from 'react';
import { getBookingByRef, deletePublicBooking } from '../services/api';
import { Link } from 'react-router-dom';
import DigitalTicket from '../components/DigitalTicket';

export default function ManageTicket() {
  const [ref, setRef] = useState('');
  const [email, setEmail] = useState('');
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!ref || !email) {
      setError('Please enter both your Booking Reference and Email Address.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const res = await getBookingByRef(ref, email);
      setTicket(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to find ticket. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you absolutely sure you want to cancel this booking? This cannot be undone.')) return;
    
    setLoading(true);
    try {
      await deletePublicBooking(ref, email);
      setTicket(null);
      setRef('');
      setEmail('');
      setSuccess('Ticket cancelled successfully. Your refund will be processed and sent to your original payment method within 3 working days.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to cancel booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-surface-0 flex flex-col lg:flex-row relative">
      
      {/* ── Prominent Global Navigation ── */}
      <div className="absolute top-6 left-6 lg:top-10 lg:left-12 z-50 no-print">
        <Link to="/" className="inline-flex items-center gap-2 text-white font-bold text-sm transition-all hover:-translate-x-1 bg-black/40 hover:bg-black/70 px-5 py-3 rounded-full backdrop-blur-xl border border-white/20 shadow-lg">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Return to Hub
        </Link>
      </div>

      {/* ── Visual Background / Left Split ── */}
      <div className={`relative w-full lg:w-1/2 h-[40vh] lg:h-screen overflow-hidden no-print transition-all duration-[800ms] ease-in-out ${ticket ? 'lg:w-[35%] opacity-80' : 'lg:w-1/2'}`}>
        <div className="absolute inset-0 bg-[#0a0a0a] z-0">
          {/* Cinematic Slow Pan Image */}
          <img 
            src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=2000&q=80" 
            alt="Festival crowd cheering"
            className="w-full h-full object-cover opacity-90" 
            style={{ animation: 'panZoom 35s ease-in-out infinite alternate' }} 
          />
        </div>
        
        {/* Gradients to blend into the form */}
        <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0a0a0a]/90 via-[#0a0a0a]/40 to-transparent z-10" />
        
        {/* Floating animated orbs to make it lively */}
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-brand-500/40 rounded-full blur-[60px] animate-pulse z-10" />
        <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-coral-500/30 rounded-full blur-[80px] animate-pulse delay-1000 z-10" style={{ animationDuration: '4s' }} />

        {/* Text Overlay */}
        <div className="absolute bottom-10 left-8 right-8 lg:bottom-20 lg:left-12 lg:right-16 z-20">
          <h2 className="text-white text-5xl lg:text-7xl font-black font-display leading-[1.05] tracking-tight mb-5 drop-shadow-xl">
            Your Portal<br/>To The Pit.
          </h2>
          <p className="text-white/90 text-lg max-w-md font-medium drop-shadow-md">
            Retrieve your digital ticket, manage bookings, and get ready for an unforgettable experience.
          </p>
        </div>
      </div>

      {/* ── Right Content / Form Area ── */}
      <div className={`w-full lg:w-1/2 flex-1 flex flex-col justify-center items-center p-fluid-md lg:p-fluid-xl transition-all duration-[800ms] ease-in-out bg-surface-0 h-full ${ticket ? 'lg:w-[65%]' : 'lg:w-1/2'}`}>
        <div className={`w-full mx-auto transition-all duration-700 ${ticket ? 'max-w-2xl' : 'max-w-lg'}`}>
          
          {/* Search Form */}
          {!ticket && (
            <div className="animate-fade-in no-print">
              <div className="mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 text-brand-500 text-xs font-bold tracking-widest uppercase mb-4 shadow-sm border border-brand-100">
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                  Ticket Access
                </div>
                <h1 className="font-display font-black text-4xl lg:text-5xl text-ink-primary mb-3 tracking-tight">Find My Booking</h1>
                <p className="text-ink-secondary text-lg">Enter your secure booking details below to manage your pass.</p>
              </div>

              <form onSubmit={handleSearch} className="space-y-6">
                <div className="space-y-2 group">
                  <label className="field-label text-xs uppercase tracking-widest text-ink-tertiary">Booking Reference</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      className="field-input uppercase py-4 pl-12 text-lg shadow-sm font-mono tracking-widest group-hover:border-brand-300 transition-colors" 
                      placeholder="e.g. FH-00101" 
                      value={ref} 
                      onChange={e => setRef(e.target.value.toUpperCase())} 
                    />
                    <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-ink-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                  </div>
                </div>
                
                <div className="space-y-2 group">
                  <label className="field-label text-xs uppercase tracking-widest text-ink-tertiary">Email Address</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      className="field-input py-4 pl-12 text-lg shadow-sm group-hover:border-brand-300 transition-colors" 
                      placeholder="ticket@example.com" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                    />
                    <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-ink-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 font-bold p-4 rounded-2xl text-sm border border-red-200 flex items-center gap-3 animate-shake">
                    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-mint-50 text-mint-700 font-bold p-4 rounded-2xl text-sm border border-mint-200 flex items-center gap-3 animate-fade-in">
                    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {success}
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg rounded-2xl mt-4 group">
                  {loading ? 'Searching Database...' : 'Retrieve Ticket'}
                  {!loading && (
                    <svg className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Ticket View */}
          {ticket && (
            <div className="animate-slide-up w-full">
              
              {/* Interactive Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 lg:mb-8 gap-4 no-print bg-white p-4 lg:p-5 rounded-3xl border border-surface-border shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-500">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <h2 className="font-display font-black text-xl text-ink-primary leading-tight">Booking Verified</h2>
                    <p className="text-ink-secondary text-sm">Valid pass for {ticket.eventName}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button onClick={handleCancel} disabled={loading} className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 font-bold px-4 py-2 rounded-full text-sm transition-colors disabled:opacity-50 flex-1 sm:flex-none">
                    Cancel
                  </button>
                </div>
              </div>

              {/* The Ticket Itself */}
              <div className="shadow-[0_20px_80px_-15px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden border border-surface-border">
                <DigitalTicket ticket={ticket} />
              </div>

              {/* Return Button */}
              <div className="mt-6 lg:mt-10 text-center no-print">
                <button onClick={() => { setTicket(null); setError(''); setSuccess(''); }} className="inline-flex items-center gap-2 text-ink-secondary hover:text-brand-500 font-bold text-sm transition-colors group">
                  <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  Lookup another ticket
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Dynamic Keyframes */}
      <style>{`
        @keyframes panZoom {
          0% { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.1) translate(-1%, -1%); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
}
