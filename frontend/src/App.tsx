import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import BenefitsPage from "./pages/BenefitsPage";
import VehiclesPage from "./pages/VehiclesPage";
import CarDetailsPage from "./pages/CarDetailsPage";
import GetStartedPage from "./pages/GetStartedPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import CarsPage from "./pages/CarsPage";
import CustomerLayout from "@/components/CustomerLayout";
import WalletPage from "./pages/WalletPage";
import ProfilePage from "./pages/ProfilePage";
import FinancingPage from "./pages/FinancingPage";
import AdminPage from "./pages/AdminPage";
import CfoPage from "./pages/CfoPage";
import LogbookPage from "./pages/LogbookPage";
import SettingsPage from "./pages/SettingsPage";
import PaymentDetailsPage from "./pages/PaymentDetailsPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";
import ExecutiveDashboard from "./pages/admin/ExecutiveDashboard";
import LoanDashboard from "./pages/admin/LoanDashboard";
import RecoveryDashboard from "./pages/admin/RecoveryDashboard";
import SavingsDashboard from "./pages/admin/SavingsDashboard";
import DealerDashboard from "./pages/admin/DealerDashboard";

const queryClient = new QueryClient();


const CUSTOMER_ROUTES = [
  '/dashboard', '/wallet', '/vehicles', '/cars', '/profile', 
  '/financing', '/logbook', '/settings', 
  '/applications', '/my-vehicle', '/repayments', '/support',
  '/payment-details'
];

const AppLayout = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/' || location.pathname === '/auth' || CUSTOMER_ROUTES.some(r => location.pathname.startsWith(r));

  return (
    <>
      {!hideNavbar && (
        <div className="sticky top-0 z-50 bg-slate-50 border-b border-slate-200/60 shadow-sm">
          <Navbar />
        </div>
      )}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/benefits" element={<BenefitsPage />} />
        <Route path="/get-started" element={<GetStartedPage />} />
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminPage /></ProtectedRoute>} />
        <Route path="/admin/executive" element={<ProtectedRoute requireAdmin><ExecutiveDashboard /></ProtectedRoute>} />
        <Route path="/admin/loans" element={<ProtectedRoute requireAdmin><LoanDashboard /></ProtectedRoute>} />
        <Route path="/admin/recovery" element={<ProtectedRoute requireAdmin><RecoveryDashboard /></ProtectedRoute>} />
        <Route path="/admin/savings" element={<ProtectedRoute requireAdmin><SavingsDashboard /></ProtectedRoute>} />
        <Route path="/admin/dealers" element={<ProtectedRoute requireAdmin><DealerDashboard /></ProtectedRoute>} />
        <Route path="/cfo" element={<ProtectedRoute><CfoPage /></ProtectedRoute>} />

        {/* Customer Routes with Sidebar */}
        <Route path="/dashboard" element={<ProtectedRoute><CustomerLayout><DashboardPage /></CustomerLayout></ProtectedRoute>} />
        <Route path="/vehicles" element={<ProtectedRoute><CustomerLayout><VehiclesPage /></CustomerLayout></ProtectedRoute>} />
        <Route path="/vehicles/:id" element={<ProtectedRoute><CustomerLayout><CarDetailsPage /></CustomerLayout></ProtectedRoute>} />
        <Route path="/cars" element={<ProtectedRoute><CustomerLayout><CarsPage /></CustomerLayout></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute><CustomerLayout><WalletPage /></CustomerLayout></ProtectedRoute>} />
        <Route path="/payment-details" element={<ProtectedRoute><CustomerLayout><PaymentDetailsPage /></CustomerLayout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><CustomerLayout><ProfilePage /></CustomerLayout></ProtectedRoute>} />
        <Route path="/financing" element={<ProtectedRoute><CustomerLayout><FinancingPage /></CustomerLayout></ProtectedRoute>} />
        <Route path="/logbook" element={<ProtectedRoute><CustomerLayout><LogbookPage /></CustomerLayout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><CustomerLayout><SettingsPage /></CustomerLayout></ProtectedRoute>} />
        
        {/* Placeholder Routes mapped to existing pages for now */}
        <Route path="/applications" element={<ProtectedRoute><CustomerLayout><FinancingPage /></CustomerLayout></ProtectedRoute>} />
        <Route path="/my-vehicle" element={<ProtectedRoute><CustomerLayout><LogbookPage /></CustomerLayout></ProtectedRoute>} />
        <Route path="/repayments" element={<ProtectedRoute><CustomerLayout><FinancingPage /></CustomerLayout></ProtectedRoute>} />
        <Route path="/support" element={<ProtectedRoute><CustomerLayout><div className="p-8"><h1 className="text-2xl font-bold mb-4 text-slate-900">Support</h1><p className="text-slate-500">Support center coming soon.</p></div></CustomerLayout></ProtectedRoute>} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppLayout />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
