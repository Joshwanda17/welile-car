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


const AppLayout = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <>
      {!isLanding && (
        <div className="sticky top-0 z-50 bg-slate-50 border-b border-slate-200/60 shadow-sm">
          <Navbar />
        </div>
      )}
      <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/benefits" element={<BenefitsPage />} />
              <Route path="/vehicles" element={<VehiclesPage />} />
              <Route path="/get-started" element={<GetStartedPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/cars" element={<CarsPage />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/financing" element={<FinancingPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/executive" element={<ExecutiveDashboard />} />
              <Route path="/admin/loans" element={<LoanDashboard />} />
              <Route path="/admin/recovery" element={<RecoveryDashboard />} />
              <Route path="/admin/savings" element={<SavingsDashboard />} />
              <Route path="/admin/dealers" element={<DealerDashboard />} />
              <Route path="/cfo" element={<CfoPage />} />
              <Route path="/logbook" element={<LogbookPage />} />
              <Route path="/settings" element={<SettingsPage />} />
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
