import { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/admin',               icon: '📊', label: 'Dashboard',     end: true },
  { to: '/admin/events',        icon: '🎭', label: 'Events' },
  { to: '/admin/vendors',       icon: '🍔', label: 'Vendors' },
  { to: '/admin/tickets',       icon: '🎟️', label: 'Tickets' },
  { to: '/admin/announcements', icon: '📢', label: 'Announcements' },
  { to: '/admin/messages',      icon: '✉️', label: 'Messages' },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate          = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-surface-0 flex font-sans text-ink-primary">

      {/* ── Sidebar ────────────────────────────────────── */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-surface-1 border-r border-surface-border
        flex flex-col transition-transform duration-300 shadow-soft
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
        {/* Brand */}
        <div className="p-6 border-b border-surface-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-coral-100 flex items-center justify-center text-xl shadow-inner">
              🎪
            </div>
            <div>
              <p className="font-display font-bold text-ink-primary text-xl leading-none">
                Festival<span className="text-coral-500">Hub</span>
              </p>
              <p className="text-ink-tertiary font-bold text-xs mt-1 uppercase tracking-wider">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {NAV_ITEMS.map(({ to, icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-coral-50 text-coral-600 shadow-sm border border-coral-100'
                    : 'text-ink-secondary hover:text-ink-primary hover:bg-surface-2'
                }`
              }
            >
              <span className="text-lg">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Admin user */}
        <div className="p-4 border-t border-surface-border bg-surface-1">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-2 mb-3 border border-surface-border">
            <div className="w-9 h-9 rounded-full bg-coral-500 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-soft">
              {admin?.username?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-ink-primary text-sm font-bold truncate">{admin?.name || admin?.username}</p>
              <p className="text-ink-tertiary font-medium text-xs">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-signal-danger hover:bg-red-50 hover:text-red-700 transition-colors border border-transparent hover:border-red-100"
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-ink-primary/20 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main content ───────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 border-b border-surface-border bg-surface-1/80 backdrop-blur-md flex items-center px-6 gap-4 shrink-0 z-20 sticky top-0">
          <button
            className="lg:hidden text-ink-secondary hover:text-ink-primary p-2 bg-surface-2 rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex-1" />
          
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary btn-sm flex items-center gap-2"
          >
            <span>🌐</span> View Public Site
          </a>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 bg-surface-0">
          <div className="max-w-6xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
