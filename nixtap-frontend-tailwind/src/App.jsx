import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';

// Public Pages
import Landing from './pages/public/new-landing/Landing';
import PublicCard from './pages/public/PublicCard';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import VerifyOtp from './pages/auth/VerifyOtp';

// App Pages (Premium UI)
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/app/Dashboard';
import MyCards from './pages/app/MyCards';
import CreateCard from './pages/app/CreateCard';
import EditCard from './pages/app/EditCard';
import Templates from './pages/app/Templates';
import Leads from './pages/app/Leads';
import Appointments from './pages/app/Appointments';
import Analytics from './pages/app/Analytics';
import Feedback from './pages/app/Feedback';
import Premium from './pages/app/Premium';
import Settings from './pages/app/Settings';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, fetchUser, user } = useAuthStore();
  
  useEffect(() => {
    if (localStorage.getItem('nixtap_token') && !user) {
      fetchUser();
    }
  }, [user, fetchUser]);

  if (isLoading || (localStorage.getItem('nixtap_token') && !user)) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f0f13] text-brand-600">Loading...</div>;
  }

  if (!isAuthenticated && !localStorage.getItem('nixtap_token')) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const GuestRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const token = localStorage.getItem('nixtap_token');
  if (isAuthenticated || token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/c/:cardId" element={<PublicCard />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
        <Route path="/verify-otp" element={<GuestRoute><VerifyOtp /></GuestRoute>} />

        {/* Protected App Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="cards" element={<MyCards />} />
          <Route path="cards/create" element={<CreateCard />} />
          <Route path="cards/:id/edit" element={<EditCard />} />
          <Route path="templates" element={<Templates />} />
          <Route path="leads" element={<Leads />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="premium" element={<Premium />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch-all 404 route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

