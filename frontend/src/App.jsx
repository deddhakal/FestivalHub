import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Shared
import Navbar   from './components/Navbar';
import Footer   from './components/Footer';
import { LoadingSpinner } from './components/UI';

// Visitor pages
import Home            from './pages/Home';
import Events          from './pages/Events';
import EventDetail     from './pages/EventDetail';
import Booking         from './pages/Booking';
import FestivalMap     from './pages/FestivalMap';
import FoodAttractions from './pages/FoodAttractions';
import Announcements   from './pages/Announcements';
import Contact         from './pages/Contact';
import ManageTicket    from './pages/ManageTicket';

// Admin
import AdminLogin          from './admin/AdminLogin';
import AdminLayout         from './admin/AdminLayout';
import AdminDashboard      from './admin/AdminDashboard';
import ManageEvents        from './admin/ManageEvents';
import ManageVendors       from './admin/ManageVendors';
import ManageTickets       from './admin/ManageTickets';
import ManageAnnouncements from './admin/ManageAnnouncements';
import AdminMessages       from './admin/AdminMessages';

// ── Protected route wrapper ───────────────────────────────────
function RequireAdmin({ children }) {
  const { admin, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
  return admin ? children : <Navigate to="/admin/login" replace />;
}

// ── 404 page ─────────────────────────────────────────────────
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="font-display text-8xl text-surface-muted mb-6 select-none">404</p>
        <h1 className="font-display text-2xl text-ink-primary mb-2">Page not found</h1>
        <p className="text-sm text-ink-secondary mb-8">This page doesn't exist or has been moved.</p>
        <a href="/" className="btn-primary btn-md">Back to Home</a>
      </div>
    </div>
  );
}

// ── Visitor layout wrapper ───────────────────────────────────
function VisitorLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* ── Visitor routes ─────────────────────────── */}
          <Route path="/" element={<VisitorLayout><Home /></VisitorLayout>} />
          <Route path="/events" element={<VisitorLayout><Events /></VisitorLayout>} />
          <Route path="/events/:id" element={<VisitorLayout><EventDetail /></VisitorLayout>} />
          <Route path="/booking" element={<VisitorLayout><Booking /></VisitorLayout>} />
          <Route path="/map" element={<VisitorLayout><FestivalMap /></VisitorLayout>} />
          <Route path="/food-attractions" element={<VisitorLayout><FoodAttractions /></VisitorLayout>} />
          <Route path="/announcements" element={<VisitorLayout><Announcements /></VisitorLayout>} />
          <Route path="/contact" element={<VisitorLayout><Contact /></VisitorLayout>} />
          <Route path="/manage-ticket" element={<ManageTicket />} />

          {/* ── Admin login (no layout) ─────────────────── */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ── Protected admin routes ─────────────────── */}
          <Route path="/admin" element={
            <RequireAdmin><AdminLayout /></RequireAdmin>
          }>
            <Route index             element={<AdminDashboard />} />
            <Route path="events"        element={<ManageEvents />} />
            <Route path="vendors"       element={<ManageVendors />} />
            <Route path="tickets"       element={<ManageTickets />} />
            <Route path="announcements" element={<ManageAnnouncements />} />
            <Route path="messages"      element={<AdminMessages />} />
          </Route>

          {/* ── 404 ────────────────────────────────────── */}
          <Route path="*" element={<VisitorLayout><NotFound /></VisitorLayout>} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}
