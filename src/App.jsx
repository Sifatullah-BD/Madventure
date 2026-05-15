import React, { lazy, Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, Link, useLocation } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Loader2 } from 'lucide-react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LoginModal from './components/LoginModal';
import SocialProofToast from './components/SocialProofToast';
import SOSButton from './components/emergency/SOSButton';
import ChatWidget from './components/community/ChatWidget';
import NotificationButton from './components/NotificationButton';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider, useToast } from './components/ui/Toast';

// Lazy load all pages
const Home = lazy(() => import('./pages/Home'));
const Destinations = lazy(() => import('./pages/Destinations'));
const DistrictDetails = lazy(() => import('./pages/DistrictDetails'));
const PlaceDetails = lazy(() => import('./pages/PlaceDetails'));
const Solutions = lazy(() => import('./pages/Solutions'));
const OnSpotGuide = lazy(() => import('./pages/OnSpotGuide'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const SmartPlanner = lazy(() => import('./pages/SmartPlanner'));
const Emergency = lazy(() => import('./pages/Emergency'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/Terms'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const PartnerDashboard = lazy(() => import('./pages/PartnerDashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Community = lazy(() => import('./pages/Community'));
const LostFound = lazy(() => import('./pages/LostFound'));
const Partner = lazy(() => import('./pages/Partner'));
const Adventures = lazy(() => import('./pages/Adventures'));
const TicketBooking = lazy(() => import('./pages/TicketBooking'));
const TourEvents = lazy(() => import('./pages/TourEvents'));
const StudentTours = lazy(() => import('./pages/StudentTours'));
const TripEssentials = lazy(() => import('./pages/TripEssentials'));
const TourDetails = lazy(() => import('./pages/TourDetails'));
const AgencyDashboard = lazy(() => import('./pages/AgencyDashboard'));
const AgencyProfile = lazy(() => import('./pages/AgencyProfile'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Settings = lazy(() => import('./pages/Settings'));
const Shop = lazy(() => import('./pages/Shop'));
const CreateEvent = lazy(() => import('./pages/CreateEvent'));
const TravelStats = lazy(() => import('./pages/TravelStats'));
const UpcomingEvents = lazy(() => import('./pages/UpcomingEvents'));
const Wallet = lazy(() => import('./pages/Wallet'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const TourPlans = lazy(() => import('./pages/TourPlans'));
const Explore = lazy(() => import('./pages/Explore'));
const BusinessDetail = lazy(() => import('./pages/BusinessDetail'));
const BusinessRegister = lazy(() => import('./pages/BusinessRegister'));
const VendorRegistration = lazy(() => import('./pages/VendorRegistration'));
const BusinessDashboardPage = lazy(() => import('./pages/BusinessDashboardPage'));
const Checkout = lazy(() => import('./pages/Checkout'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const PaymentFail = lazy(() => import('./pages/PaymentFail'));
const TourBookingFlow = lazy(() => import('./pages/TourBookingFlow'));
const HotelBookingFlow = lazy(() => import('./pages/HotelBookingFlow'));
const BookingConfirmation = lazy(() => import('./pages/BookingConfirmation'));
const BookingHistory = lazy(() => import('./pages/BookingHistory'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Marketplace Routes
const MarketplaceHome = lazy(() => import('./features/marketplace/pages/MarketplaceHome'));
const GuideList = lazy(() => import('./features/marketplace/pages/GuideList'));
const TransportList = lazy(() => import('./features/marketplace/pages/TransportList'));
const FoodList = lazy(() => import('./features/marketplace/pages/FoodList'));
const VendorProfile = lazy(() => import('./features/marketplace/pages/VendorProfile'));

// Blog Routes
const BlogList = lazy(() => import('./features/blog/BlogList'));
const BlogDetail = lazy(() => import('./features/blog/BlogDetail'));
const BlogEditor = lazy(() => import('./admin/BlogEditor'));

import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import FloatingBackButton from './components/FloatingBackButton';

import WelcomePopup from './components/WelcomePopup';
import LiveSupportWidget from './components/ui/LiveSupportWidget';
import ScrollToTop from './components/ScrollToTop';
import { cacheEmergencyData, getOfflineData } from './utils/offlineCache';

import { useAuth } from './hooks/useAuth';

const AppContent = () => {
  const { user, setUser, logout } = useAuth();
  const toast = useToast();

  const [theme, setTheme] = useState(() => {
    // Check local storage for saved theme, otherwise check system preference
    const savedTheme = localStorage.getItem('madventure_theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Apply theme to document element
  React.useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('madventure_theme', theme);
  }, [theme]);

  // Offline and Service Worker handling
  React.useEffect(() => {
    if (navigator.onLine) {
      cacheEmergencyData();
      setIsOffline(false);
    } else {
      setIsOffline(true);
    }

    const handleOnline = () => {
      setIsOffline(false);
      cacheEmergencyData();
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('SW Registration successful:', reg.scope))
        .catch(err => console.log('SW Registration failed:', err));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogin = (userData) => {
    // Auth state is handled inside AuthContext. Just manage UI.
    setShowLogin(false);
    setShowWelcome(true);
    navigate('/dashboard');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleUpdateRole = (newRole) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = {
        ...prev,
        role: newRole,
        app_role: String(newRole || 'traveler').toLowerCase(),
      };
      try {
        localStorage.setItem('madventure_user', JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const handleUpdateUser = (updatedUser) => {
    const merged = { ...updatedUser };
    if (merged.role && !merged.app_role) {
      merged.app_role = String(merged.role).toLowerCase();
    }
    setUser(merged);
    try {
      localStorage.setItem('madventure_user', JSON.stringify(merged));
    } catch {
      /* ignore */
    }
  };

  const isDarkPage = location.pathname === '/adventures';

  return (
    <div className={`font-sans text-gray-900 bg-background h-screen overflow-hidden flex flex-col ${theme === 'dark' ? 'dark' : ''} `}>
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
        <Navbar
          user={user}
          onOpenLogin={() => setShowLogin(true)}
          onLogout={handleLogout}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          theme={theme}
          setTheme={setTheme}
        />

        <LoginModal
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
        />

        <WelcomePopup show={showWelcome} onClose={() => setShowWelcome(false)} />
        <FloatingBackButton user={user} />
        <SOSButton />

        {isOffline && (
            <div className="bg-yellow-500 text-yellow-900 px-4 py-2 text-center text-sm font-bold flex justify-center items-center gap-2 z-40 relative shadow-sm">
                <span>📵 Offline মোড (ইন্টারনেট কানেকশন নেই)। কিছু ফিচারের আপডেট সীমাবদ্ধ হতে পারে, তবে ইমার্জেন্সি সাপোর্ট চালু আছে।</span>
            </div>
        )}

        <SocialProofToast />
        <NotificationButton />
        <ChatWidget />

        <div className="flex flex-grow relative">
          {isSidebarOpen && user && <Sidebar user={user} />}
          <main className={`flex-grow ${user && !isDarkPage ? 'bg-gray-50' : ''} flex flex-col`}>
            <div className="flex-grow max-w-[1140px] mx-auto w-full">
              <ErrorBoundary>
                <Suspense fallback={
                  <div className="flex-grow flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-12 h-12 text-primary animate-spin" />
                      <p className="text-sm font-bold text-gray-500 animate-pulse">Loading Madventure...</p>
                    </div>
                  </div>
                }>
                  <Routes>
                    <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Home user={user} onOpenLogin={() => setShowLogin(true)} />} />
                    <Route path="/destinations" element={<Destinations user={user} onOpenLogin={() => setShowLogin(true)} />} />
                    <Route path="/district/:id" element={<DistrictDetails />} />
                    <Route path="/student-tours" element={<StudentTours />} />
                    <Route path="/trip-essentials" element={<TripEssentials />} />
                    <Route path="/place/:id" element={<PlaceDetails />} />
                    <Route path="/solutions" element={<Solutions />} />
                    <Route path="/guide" element={<OnSpotGuide />} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard user={user} /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile user={user} onLogout={handleLogout} onUpdateRole={handleUpdateRole} onUpdateUser={handleUpdateUser} /></ProtectedRoute>} />
                    <Route path="/planner" element={<SmartPlanner user={user} />} />
                    <Route path="/adventures" element={<Adventures />} />
                    <Route path="/tickets" element={<TicketBooking />} />
                    <Route path="/tours" element={<TourEvents />} />
                    <Route path="/tours/create" element={<RoleProtectedRoute allowedRoles={['agency', 'hotel_owner', 'admin', 'super_admin']}><CreateEvent /></RoleProtectedRoute>} />
                    <Route path="/tours/:id" element={<TourDetails />} />
                    <Route path="/tours/:id/book" element={<ProtectedRoute><TourBookingFlow /></ProtectedRoute>} />
                    <Route path="/bookings" element={<ProtectedRoute><BookingHistory /></ProtectedRoute>} />
                    <Route path="/hotels/:districtId/:hotelId/book" element={<ProtectedRoute><HotelBookingFlow /></ProtectedRoute>} />
                    <Route path="/booking-confirmation" element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>} />
                    <Route path="/agency/dashboard" element={<RoleProtectedRoute allowedRoles={['agency', 'hotel_owner', 'admin', 'super_admin']}><AgencyDashboard /></RoleProtectedRoute>} />
                    <Route path="/agency/:id" element={<AgencyProfile />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/community" element={<Community user={user} onOpenLogin={() => setShowLogin(true)} />} />
                    <Route path="/lost-found" element={<LostFound />} />
                    <Route path="/safety" element={<Emergency user={user} onOpenLogin={() => setShowLogin(true)} />} />
                    <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                    <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
                    <Route path="/payment-fail" element={<ProtectedRoute><PaymentFail /></ProtectedRoute>} />
                    <Route path="/partner" element={<Partner />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/refund" element={<RefundPolicy />} />
                    <Route path="/partner-dashboard" element={<PartnerDashboard />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/stats" element={<TravelStats />} />
                    <Route path="/events" element={<UpcomingEvents />} />
                    <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/tour-plans" element={<TourPlans />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/business/:slug" element={<BusinessDetail />} />
                    <Route path="/register/business" element={<BusinessRegister />} />
                    <Route path="/business/dashboard" element={<BusinessDashboardPage />} />
                    <Route path="/marketplace" element={<MarketplaceHome />} />
                    <Route path="/marketplace/register" element={<VendorRegistration />} />
                    <Route path="/marketplace/guides" element={<GuideList />} />
                    <Route path="/marketplace/transport" element={<TransportList />} />
                    <Route path="/marketplace/food" element={<FoodList />} />
                    <Route path="/marketplace/vendor/:slug" element={<VendorProfile />} />
                    <Route path="/admin" element={<ProtectedRoute><RoleProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminDashboard /></RoleProtectedRoute></ProtectedRoute>} />
                    
                    {/* Blog Routes */}
                    <Route path="/blog" element={<BlogList />} />
                    <Route path="/blog/:slug" element={<BlogDetail />} />
                    <Route path="/admin/blog/create" element={<ProtectedRoute><RoleProtectedRoute allowedRoles={['admin', 'super_admin']}><BlogEditor /></RoleProtectedRoute></ProtectedRoute>} />
                    <Route path="/admin/blog/edit/:id" element={<ProtectedRoute><RoleProtectedRoute allowedRoles={['admin', 'super_admin']}><BlogEditor /></RoleProtectedRoute></ProtectedRoute>} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </div>
            
            <LiveSupportWidget />
          </main>
        </div>

        {/* Footer - Global for all users and pages */}
        <footer className="w-full bg-[#1B5E20] dark:bg-[#052e16] text-white py-8 mt-auto shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-10 relative box-border">
          <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Column 1: Brand */}
              <div className="col-span-1 space-y-3">
                <img src="/madventure-logo-v2.png" alt="Madventure" className="h-12 w-auto mb-2" />
                <p className="text-green-100 text-xs leading-relaxed max-w-xs">
                  Your trusted companion for exploring the hidden wonders of Bangladesh.
                </p>
                <Link to="/about" className="inline-block text-xs font-bold text-primary hover:text-white transition-colors border-b border-primary hover:border-white pb-0.5">
                  Read About Us
                </Link>
              </div>

              {/* Column 2: Explore */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-primary uppercase tracking-wider">Explore</h3>
                <ul className="space-y-2 text-xs text-gray-300">
                  <li><Link to="/destinations" className="hover:text-white transition-colors flex items-center gap-1">Destinations</Link></li>
                  <li><Link to="/planner" className="hover:text-white transition-colors flex items-center gap-1">Smart Planner</Link></li>
                  <li><Link to="/adventures" className="hover:text-white transition-colors flex items-center gap-1">Adventures</Link></li>
                  <li><Link to="/community" className="hover:text-white transition-colors flex items-center gap-1">Community</Link></li>
                </ul>
              </div>

              {/* Column 3: Support */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-primary uppercase tracking-wider">Support</h3>
                <ul className="space-y-2 text-xs text-gray-300">
                  <li><Link to="/safety" className="hover:text-white transition-colors flex items-center gap-1">Safety Center</Link></li>
                  <li><Link to="/solutions" className="hover:text-white transition-colors flex items-center gap-1">Help Center / FAQ</Link></li>
                  <li><Link to="/partner" className="hover:text-white transition-colors flex items-center gap-1">Partner with Us</Link></li>
                  <li><a href="mailto:madventurepim19@gmail.com" className="hover:text-white transition-colors flex items-center gap-1">Contact: madventurepim19@gmail.com</a></li>
                </ul>
              </div>

              {/* Column 4: Connect */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-primary uppercase tracking-wider">Stay Updated</h3>
                <div className="mb-3">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const email = e.target.email.value;
                    if (email) {
                      toast.success(`Thanks for subscribing! We'll notify ${email} about upcoming tour events.`);
                      e.target.reset();
                    }
                  }} className="flex bg-white/10 rounded-lg p-1 border border-white/20 focus-within:border-primary transition-colors" >
                    <input
                      name="email"
                      type="email"
                      placeholder="Email address"
                      required
                      className="bg-transparent w-full px-3 py-1 text-xs text-white placeholder-gray-400 outline-none"
                    />
                    <button type="submit" className="bg-primary hover:bg-primary-hover text-forest-dark px-3 py-1 rounded-md text-xs font-bold transition-colors">
                      Notify
                    </button>
                  </form >
                </div >

                <div className="flex space-x-3">
                  <a href="https://facebook.com/madventure" target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-primary hover:text-forest-dark transition-all text-white tooltip-trigger" title="Facebook">
                    <Facebook size={16} />
                  </a>
                  <a href="https://instagram.com/madventure" target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-primary hover:text-forest-dark transition-all text-white tooltip-trigger" title="Instagram">
                    <Instagram size={16} />
                  </a>
                  <a href="https://youtube.com/madventure" target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-primary hover:text-forest-dark transition-all text-white tooltip-trigger" title="YouTube">
                    <Youtube size={16} />
                  </a>
                </div>
              </div >
            </div >

            <div className="border-t border-white/20 pt-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-green-100">
              <p>&copy; 2025 Madventure. All rights reserved.</p>
              <div className="flex gap-4">
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <span>|</span>
                <Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
                <span>|</span>
                <Link to="/refund" className="hover:text-white transition-colors">Refund Policy</Link>
              </div>
            </div>
          </div >
        </footer >
      </div >
    </div >
  );
};

import { LanguageProvider } from './context/LanguageContext';

import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <Router>
      <HelmetProvider>
        <LanguageProvider>
          <ToastProvider>
            <ScrollToTop />
            <AppContent />
          </ToastProvider>
        </LanguageProvider>
      </HelmetProvider>
    </Router>
  );
}

export default App;
