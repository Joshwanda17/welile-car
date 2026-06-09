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
import NotFound from "./pages/NotFound";
import ExecutiveDashboard from "./pages/admin/ExecutiveDashboard";
import LoanDashboard from "./pages/admin/LoanDashboard";
import RecoveryDashboard from "./pages/admin/RecoveryDashboard";
import SavingsDashboard from "./pages/admin/SavingsDashboard";
import DealerDashboard from "./pages/admin/DealerDashboard";

const queryClient = new QueryClient();


const CUSTOMER_ROUTES = [
  '/dashboard', '/wallet', '/vehicles', '/cars', '/profile', 
  '/financing', '/logbook', '/settings', '/savings-history', 
  '/applications', '/my-vehicle', '/repayments', '/support'
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
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/executive" element={<ExecutiveDashboard />} />
        <Route path="/admin/loans" element={<LoanDashboard />} />
        <Route path="/admin/recovery" element={<RecoveryDashboard />} />
        <Route path="/admin/savings" element={<SavingsDashboard />} />
        <Route path="/admin/dealers" element={<DealerDashboard />} />
        <Route path="/cfo" element={<CfoPage />} />

        {/* Customer Routes with Sidebar */}
        <Route path="/dashboard" element={<CustomerLayout><DashboardPage /></CustomerLayout>} />
        <Route path="/vehicles" element={<CustomerLayout><VehiclesPage /></CustomerLayout>} />
        <Route path="/cars" element={<CustomerLayout><CarsPage /></CustomerLayout>} />
        <Route path="/wallet" element={<CustomerLayout><WalletPage /></CustomerLayout>} />
        <Route path="/profile" element={<CustomerLayout><ProfilePage /></CustomerLayout>} />
        <Route path="/financing" element={<CustomerLayout><FinancingPage /></CustomerLayout>} />
        <Route path="/logbook" element={<CustomerLayout><LogbookPage /></CustomerLayout>} />
        <Route path="/settings" element={<CustomerLayout><SettingsPage /></CustomerLayout>} />
        
        {/* Placeholder Routes mapped to existing pages for now */}
        <Route path="/savings-history" element={<CustomerLayout><WalletPage /></CustomerLayout>} />
        <Route path="/applications" element={<CustomerLayout><FinancingPage /></CustomerLayout>} />
        <Route path="/my-vehicle" element={<CustomerLayout><LogbookPage /></CustomerLayout>} />
        <Route path="/repayments" element={<CustomerLayout><FinancingPage /></CustomerLayout>} />
        <Route path="/support" element={<CustomerLayout><div className="p-8"><h1 className="text-2xl font-bold mb-4 text-slate-900">Support</h1><p className="text-slate-500">Support center coming soon.</p></div></CustomerLayout>} />
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
