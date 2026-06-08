import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="sticky top-0 z-50 bg-slate-50 border-b border-slate-200/60 shadow-sm">
              <Navbar />
            </div>
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
              <Route path="/admin-dashboard" element={<AdminPage />} />
              <Route path="/admin-portal" element={<AdminPage />} />
              <Route path="/dashboard/admin" element={<AdminPage />} />
              <Route path="/admin-dashdoard" element={<AdminPage />} />
              <Route path="/cfo" element={<CfoPage />} />
              <Route path="/cfo-dashboard" element={<CfoPage />} />
              <Route path="/logbook" element={<LogbookPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
