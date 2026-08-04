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
    <div className="min-h-screen bg-festival-darker flex">

      {/* ── Sidebar ────────────────────────────────────── */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-60 bg-festival-card border-r border-festival-border
        flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
        {/* Brand */}
        <div className="p-5 border-b border-festival-border">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎪</span>
            <div>
              <p className="font-display font-bold text-white text-lg leading-none">
                Festival<span className="text-primary-400">Hub</span>
              </p>
              <p className="text-gray-500 text-xs mt-0.5">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-900/50 text-primary-300 border border-primary-800/50'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Admin user */}
        <div className="p-3 border-t border-festival-border">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-festival-darker mb-2">
            <div className="w-8 h-8 rounded-full bg-primary-800 flex items-center justify-center text-primary-300 font-bold text-sm shrink-0">
              {admin?.username?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{admin?.name || admin?.username}</p>
              <p className="text-gray-500 text-xs">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-900/10 transition-colors"
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main content ───────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-festival-border bg-festival-card/50 backdrop-blur-sm flex items-center px-4 gap-4 shrink-0">
          <button
            className="lg:hidden text-gray-400 hover:text-white p-1"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <div className="flex-1" />
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1"
          >
            🌐 View Site
          </a>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
