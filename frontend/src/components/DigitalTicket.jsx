export default function DigitalTicket({ ticket }) {
  if (!ticket) return null;

  const unitPrice = ticket.ticket_type === 'VIP' ? 120.00 : 45.00;
  const subtotal = unitPrice * ticket.quantity;
  const fee = subtotal * 0.05;
  const total = subtotal + fee;

  return (
    <div className="print-ticket">
      <div className="print-ticket-wrapper">
        {/* ── Invoice / Bill Section (Visible only in PDF/Print) ── */}
        <div className="hidden print:block w-full max-w-3xl mx-auto mb-4 border-b-2 border-dashed border-surface-muted pb-4">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="font-display font-black text-3xl text-ink-primary tracking-tight">Festival<span className="text-coral-500">Hub</span></h1>
              <p className="text-ink-tertiary font-bold mt-1">Tax Invoice & Receipt</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-ink-secondary uppercase tracking-widest mb-1">Invoice / Ref</p>
              <p className="font-mono text-xl font-bold text-ink-primary">{ticket.booking_ref}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <p className="text-xs font-bold text-ink-tertiary uppercase tracking-widest mb-1">Billed To</p>
              <p className="font-bold text-ink-primary text-lg">{ticket.visitor_name}</p>
              <p className="text-ink-secondary">{ticket.visitor_email}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-ink-tertiary uppercase tracking-widest mb-1">Date of Purchase</p>
              <p className="font-bold text-ink-primary text-lg">
                {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          <table className="w-full text-left border-collapse mb-4">
            <thead>
              <tr className="border-b-2 border-surface-primary">
                <th className="py-3 text-xs font-bold text-ink-tertiary uppercase tracking-widest">Description</th>
                <th className="py-3 text-xs font-bold text-ink-tertiary uppercase tracking-widest text-center">Qty</th>
                <th className="py-3 text-xs font-bold text-ink-tertiary uppercase tracking-widest text-right">Price</th>
                <th className="py-3 text-xs font-bold text-ink-tertiary uppercase tracking-widest text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-surface-border">
                <td className="py-4">
                  <p className="font-bold text-ink-primary text-lg">{ticket.event_title || ticket.event}</p>
                  <p className="text-ink-secondary text-sm">{ticket.ticket_type} Admission Ticket</p>
                </td>
                <td className="py-4 font-bold text-ink-primary text-center">{ticket.quantity}</td>
                <td className="py-4 font-bold text-ink-secondary text-right">${unitPrice.toFixed(2)}</td>
                <td className="py-4 font-bold text-ink-primary text-right">${subtotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-ink-secondary font-bold">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-ink-secondary font-bold">
                <span>Booking Fee (5%)</span>
                <span>${fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-ink-primary font-black text-2xl pt-4 border-t-2 border-surface-primary mb-6">
                <span>Total Paid</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-ink-tertiary">
                  * Note: Tickets can only be cancelled up to 24 hours before the event.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Boarding Pass Section ── */}
        <div className="bg-white rounded-2xl overflow-hidden border border-surface-border shadow-lift relative flex flex-col md:flex-row print:flex-row w-full max-w-3xl mx-auto break-inside-avoid print:scale-95 print:origin-top">

          {/* Left side / Top side : Event Info */}
          <div className="p-8 md:p-10 flex-1 relative bg-gradient-to-br from-[#FF6B6B] to-[#D94A4A] text-white shadow-inner">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />

            <div className="relative z-10 h-full flex flex-col">
              <div className="mb-10">
                <p className="font-display font-black text-lg opacity-90 tracking-widest uppercase mb-1">FestivalHub</p>
                <h3 className="font-display font-black text-4xl leading-tight">{ticket.event_title || ticket.event}</h3>
              </div>

              <div className="mt-auto grid grid-cols-2 gap-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">Date</p>
                  <p className="font-bold text-lg">
                    {ticket.event_date
                      ? new Date(ticket.event_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
                      : 'TBA'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">Time</p>
                  <p className="font-bold text-lg">{ticket.start_time?.slice(0, 5) || 'TBA'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">Location</p>
                  <p className="font-bold text-lg">{ticket.stage || 'TBA'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">Ticket Type</p>
                  <p className="font-bold text-lg flex items-center gap-2">
                    {ticket.ticket_type === 'VIP' ? '' : ''} {ticket.ticket_type}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Perforation line */}
          <div className="hidden md:flex print:flex flex-col justify-between items-center relative w-12 bg-white shrink-0">
            <div className="w-6 h-6 rounded-full bg-surface-0 -translate-y-3 shadow-inner" />
            <div className="flex-1 border-l-2 border-dashed border-surface-muted my-2" />
            <div className="w-6 h-6 rounded-full bg-surface-0 translate-y-3 shadow-inner" />
          </div>
          <div className="flex md:hidden print:hidden justify-between items-center relative h-8 bg-white">
            <div className="w-6 h-6 rounded-full bg-surface-0 -translate-x-3 shadow-inner" />
            <div className="flex-1 border-t-2 border-dashed border-surface-muted mx-2" />
            <div className="w-6 h-6 rounded-full bg-surface-0 translate-x-3 shadow-inner" />
          </div>

          {/* Right side / Bottom side : Attendee & Barcode */}
          <div className="p-8 md:p-10 bg-white md:w-80 flex flex-col items-center justify-center text-center">
            <p className="text-xs font-bold text-ink-tertiary uppercase tracking-wider mb-2">Admit</p>
            <p className="font-display font-black text-6xl text-ink-primary mb-2">{ticket.quantity}</p>
            <p className="font-bold text-ink-secondary mb-8">{ticket.quantity === 1 ? 'Person' : 'People'}</p>

            <div className="w-full bg-surface-0 rounded-xl p-4 mb-6 flex flex-col items-center justify-center border border-surface-border">
              {/* Authentic-looking Barcode visual */}
              <div className="flex h-16 w-full max-w-[200px] mb-3 items-end justify-between px-2 gap-[2px]">
                {[3, 1, 2, 4, 1, 1, 3, 2, 1, 4, 2, 3, 1, 2, 1, 3, 4, 1, 2].map((w, i) => (
                  <div key={i} className="bg-ink-primary h-full" style={{ width: `${w * 2}px` }} />
                ))}
              </div>
              <p className="font-mono font-bold text-ink-primary tracking-widest text-lg">{ticket.booking_ref}</p>
            </div>

            <p className="text-sm font-bold text-ink-primary uppercase tracking-wide">{ticket.visitor_name}</p>
            <p className="text-xs font-medium text-ink-tertiary truncate max-w-full">{ticket.visitor_email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
