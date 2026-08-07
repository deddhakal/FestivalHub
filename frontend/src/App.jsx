import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Shared
import Navbar   from './components/Navbar';
import Footer   from './components/Footer';
import { LoadingSpinner } from './components/UI';

// Visitor pages (Lazy loaded)
const Home            = React.lazy(() => import('./pages/Home'));
const Dashboard       = React.lazy(() => import('./pages/Dashboard'));
const Events          = React.lazy(() => import('./pages/Events'));
const EventDetail     = React.lazy(() => import('./pages/EventDetail'));
const Booking         = React.lazy(() => import('./pages/Booking'));
const FestivalMap     = React.lazy(() => import('./pages/FestivalMap'));
const FoodAttractions = React.lazy(() => import('./pages/FoodAttractions'));
const Announcements   = React.lazy(() => import('./pages/Announcements'));
const Contact         = React.lazy(() => import('./pages/Contact'));
const ManageTicket    = React.lazy(() => import('./pages/ManageTicket'));

// Admin (Lazy loaded)
const AdminLogin          = React.lazy(() => import('./admin/AdminLogin'));
const AdminLayout         = React.lazy(() => import('./admin/AdminLayout'));
const AdminDashboard      = React.lazy(() => import('./admin/AdminDashboard'));
const ManageEvents        = React.lazy(() => import('./admin/ManageEvents'));
const ManageVendors       = React.lazy(() => import('./admin/ManageVendors'));
const ManageTickets       = React.lazy(() => import('./admin/ManageTickets'));
const ManageAnnouncements = React.lazy(() => import('./admin/ManageAnnouncements'));
const AdminMessages       = React.lazy(() => import('./admin/AdminMessages'));

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
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>}>
          <Routes>
            {/* ── Visitor routes ─────────────────────────── */}
            <Route path="/" element={<VisitorLayout><Home /></VisitorLayout>} />
            <Route path="/dashboard" element={<VisitorLayout><Dashboard /></VisitorLayout>} />
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
        </Suspense>
      </Router>
    </AuthProvider>
  );
}
