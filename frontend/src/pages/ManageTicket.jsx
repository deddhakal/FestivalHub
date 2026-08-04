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
    <div className="min-h-screen bg-surface-0 flex flex-col pt-24 pb-20 px-6">
      <div className="container-sm max-w-2xl mx-auto flex-1 flex flex-col">
        
        {/* Navigation back */}
        <div className="mb-10 no-print">
          <Link to="/" className="text-ink-secondary hover:text-ink-primary font-bold text-sm">
            ← Back to Home
          </Link>
        </div>

        {/* ── Search Form (Hidden when printing) ── */}
        {!ticket && (
          <div className="card p-8 md:p-12 border border-surface-border animate-fade-in no-print">
            <div className="text-center mb-8">
              <h1 className="font-display font-black text-4xl text-ink-primary mb-3">Manage My Ticket</h1>
              <p className="text-ink-secondary font-medium">Enter your details to view, download, or cancel your booking.</p>
            </div>

            <form onSubmit={handleSearch} className="space-y-6">
              <div>
                <label className="field-label">Booking Reference</label>
                <input 
                  type="text" 
                  className="field-input uppercase" 
                  placeholder="e.g. FH-00101" 
                  value={ref} 
                  onChange={e => setRef(e.target.value.toUpperCase())} 
                />
              </div>
              <div>
                <label className="field-label">Email Address</label>
                <input 
                  type="email" 
                  className="field-input" 
                  placeholder="The email you used to book" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 font-bold p-4 rounded-xl text-sm border border-red-200">
                  ⚠️ {error}
                </div>
              )}

              {success && (
                <div className="bg-mint-50 text-mint-700 font-bold p-4 rounded-xl text-sm border border-mint-200 text-center animate-fade-in">
                  ✅ {success}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg mt-2">
                {loading ? 'Searching...' : 'Find My Ticket'}
              </button>
            </form>
          </div>
        )}

        {/* ── Ticket View ── */}
        {ticket && (
          <div className="animate-slide-up">
            
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between mb-8 gap-4 no-print">
              <div>
                <h2 className="font-display font-black text-2xl text-ink-primary">Your Digital Ticket</h2>
                <p className="text-ink-secondary text-sm mt-1">Present this ticket at the entrance.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={handleCancel} disabled={loading} className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 font-bold px-4 py-2 rounded-full transition-colors disabled:opacity-50">
                  Cancel Booking
                </button>
              </div>
            </div>

            <DigitalTicket ticket={ticket} />

            <div className="mt-8 text-center no-print">
              <button onClick={() => { setTicket(null); setError(''); setSuccess(''); }} className="text-ink-secondary hover:text-ink-primary font-bold text-sm">
                Lookup another ticket
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
