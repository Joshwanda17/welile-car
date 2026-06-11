import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useRequestFinancing } from '@/hooks/useProfile';
import { carsData } from '@/data/cars';
import { motion, AnimatePresence } from 'framer-motion';
import { formatUGX } from '@/lib/format';
import BottomNav from '@/components/BottomNav';
import { useState, useEffect } from 'react';
import { API_URL } from '@/config';
import { 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  UserCheck, 
  CreditCard,
  AlertCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const FinancingPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading } = useProfile();
  const requestFinancing = useRequestFinancing();
  const [plan, setPlan] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Live Data State
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const { session } = useAuth();

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/dashboard/summary`, {
          headers: { 'Authorization': `Bearer ${session?.access_token}` }
        });
        if (res.ok) {
          setDashboardData(await res.json());
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingDashboard(false);
      }
    };
    fetchData();
  }, [user, session]);

  if (!authLoading && !user) { navigate('/'); return null; }
  if (isLoading || loadingDashboard || !profile || !dashboardData) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-pulse text-slate-400 font-bold">Loading Application...</div>
    </div>;
  }

  const car = carsData.find(c => c.id === profile.selected_car_id) || carsData[0];
  if (!car) { navigate('/vehicles'); return null; }

  const saved = dashboardData.savings.totalSaved;
  const target = car.priceUgx * 0.3;
  const remaining = car.priceUgx - target; // Amount to finance
  const isUnlocked = saved >= target;

  const monthlyInstallment = (remaining * 1.3) / 36;
  const plans = [
    { id: 'daily', label: 'Daily Payment', divisor: 30, period: '36 months' },
    { id: 'weekly', label: 'Weekly Payment', divisor: 4, period: '36 months' },
    { id: 'monthly', label: 'Monthly Payment', divisor: 1, period: '36 months' },
  ];

  const handleProceed = async () => {
    setIsSubmitting(true);
    try {
      // Simulate network request delay for UX
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      await requestFinancing.mutateAsync({
        carId: car.id,
        carName: car.name,
        carPrice: car.priceUgx,
        requestedAmount: remaining
      });
      
      setIsSubmitting(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        navigate('/my-vehicle');
      }, 3000);
      
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
      alert('Application failed. Please try again later.');
    }
  };

  const hasApplied = dashboardData.vehicle !== null;

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8 p-4 md:p-0 pt-8 md:pt-0">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Financing Application</h1>
          <p className="text-slate-500 font-medium">Finalize your loan application and get your vehicle.</p>
        </div>

        {hasApplied ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-50 border-2 border-emerald-500 rounded-3xl p-8 text-center shadow-xl shadow-emerald-500/20">
            <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-black text-emerald-900 mb-2">Application Approved</h2>
            <p className="text-emerald-700 font-medium mb-8">Your financing for the {car.name} is active.</p>
            <button onClick={() => navigate('/my-vehicle')} className="bg-emerald-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg">
              Go to My Vehicle Dashboard
            </button>
          </motion.div>
        ) : (
          <>
            {/* Hero Application Card */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm relative">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 bg-slate-100 flex items-center justify-center p-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent"></div>
                  <img src={car.image} alt={car.name} className="max-h-[250px] object-contain drop-shadow-xl relative z-10 mix-blend-multiply" />
                </div>
                <div className="md:w-1/2 p-8 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full w-max mb-4">
                    <FileText size={14} /> Application Draft
                  </div>
                  <p className="text-primary font-black uppercase tracking-wider text-xs mb-1">{car.year} • {car.make}</p>
                  <h2 className="text-3xl font-black text-slate-900 mb-4">{car.model}</h2>
                  <div className="flex justify-between items-end border-t border-slate-100 pt-4 mt-2">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Vehicle Price</p>
                      <p className="text-2xl font-black text-slate-900">{formatUGX(car.priceUgx)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Financing Breakdown */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-primary text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-white/5 rounded-full blur-[40px] pointer-events-none"></div>
                <h3 className="text-lg font-bold mb-6 relative z-10">Financing Structure</h3>
                
                <div className="space-y-6 relative z-10">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <p className="text-primary-fixed-dim text-[10px] uppercase font-bold">Your Deposit (30%)</p>
                        <p className="font-bold text-emerald-300 text-xl">{formatUGX(target)}</p>
                      </div>
                      {isUnlocked && <CheckCircle2 size={24} className="text-emerald-400" />}
                    </div>
                    <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                      <div className={`h-full ${isUnlocked ? 'bg-emerald-400' : 'bg-white/40'}`} style={{ width: `${Math.min(100, (saved/target)*100)}%` }}></div>
                    </div>
                    {!isUnlocked && <p className="text-xs text-white/60 mt-2">You currently have {formatUGX(saved)} saved.</p>}
                  </div>

                  <div className="w-full h-[1px] bg-white/10"></div>

                  <div>
                    <p className="text-primary-fixed-dim text-[10px] uppercase font-bold">Welile Finances (70%)</p>
                    <p className="font-black text-3xl">{formatUGX(remaining)}</p>
                  </div>
                </div>
              </motion.div>

              {/* Requirements Checklist */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <ShieldCheck size={20} className="text-primary" /> Application Requirements
                </h3>
                
                <div className="space-y-4 flex-grow">
                  <div className={`flex items-center gap-4 p-3 rounded-xl border ${isUnlocked ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUnlocked ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                      {isUnlocked ? <CheckCircle2 size={16} /> : <span className="font-bold text-xs">1</span>}
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${isUnlocked ? 'text-emerald-900' : 'text-slate-900'}`}>30% Deposit Reached</p>
                      <p className="text-xs text-slate-500">{isUnlocked ? 'Target met successfully.' : 'Keep saving to unlock.'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 rounded-xl border bg-emerald-50 border-emerald-100">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-emerald-100 text-emerald-600">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-emerald-900">Identity Verified (KYC)</p>
                      <p className="text-xs text-slate-500">National ID successfully linked.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 rounded-xl border bg-emerald-50 border-emerald-100">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-emerald-100 text-emerald-600">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-emerald-900">Income Verification</p>
                      <p className="text-xs text-slate-500">Proof of income submitted.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 rounded-xl border bg-emerald-50 border-emerald-100">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-emerald-100 text-emerald-600">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-emerald-900">Guarantor Details</p>
                      <p className="text-xs text-slate-500">2 guarantors successfully verified.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Commitments */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mt-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <FileText size={20} className="text-primary" /> Your Commitments
              </h3>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm text-slate-600">
                  <li className="flex items-start gap-3">
                    <FileText size={18} className="text-primary shrink-0 mt-0.5" />
                    <span><strong>Logbook Retention:</strong> Welile Car holds the original logbook until 100% of the financing is cleared.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheck size={18} className="text-primary shrink-0 mt-0.5" />
                    <span><strong>Comprehensive Insurance:</strong> Must be maintained active at all times.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                    <span><strong>Approved Maintenance:</strong> Major servicing must be done at certified partner garages.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                    <span><strong>Payment Defaults:</strong> Missing payments for 30 consecutive days may result in vehicle repossession.</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Payment Plan Selection */}
            {isUnlocked && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <CreditCard size={20} className="text-primary" /> Choose Payment Frequency
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {plans.map(p => {
                    const isSelected = plan === p.id;
                    return (
                      <div 
                        key={p.id}
                        onClick={() => setPlan(p.id as any)}
                        className={`border-2 rounded-2xl p-4 cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected ? 'border-primary bg-primary/5 shadow-inner' : 'border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-primary' : 'border-slate-300'}`}>
                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                          </div>
                          <span className="text-xs font-bold text-slate-400 uppercase">{p.period}</span>
                        </div>
                        <div>
                          <p className="text-slate-500 font-medium text-sm mb-1">{p.label}</p>
                          <p className="text-xl font-black text-slate-900">{formatUGX(Math.round(monthlyInstallment / p.divisor))}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button 
                  onClick={handleProceed}
                  disabled={isSubmitting}
                  className="mt-8 w-full py-4 bg-primary text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 hover:bg-[#3f2bc2] text-lg flex items-center justify-center disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing Application...
                    </span>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </motion.div>
            )}

            {!isUnlocked && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shrink-0">
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-900">Application Locked</h3>
                    <p className="text-sm text-amber-700 mt-1">You need to save {formatUGX(target - saved)} more to unlock the financing application for this vehicle.</p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/wallet')}
                  className="w-full md:w-auto px-8 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20 shrink-0"
                >
                  Continue Saving
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md bg-white border-0 p-0 overflow-hidden">
          <div className="bg-emerald-500 p-8 flex flex-col items-center justify-center text-white text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={48} strokeWidth={3} />
            </motion.div>
            <h2 className="text-3xl font-black mb-2">Application Approved!</h2>
            <p className="text-emerald-50">Your financing for the {car.name} is now active.</p>
          </div>
          <div className="p-6 bg-white text-center">
            <p className="text-slate-600 font-medium mb-6">Redirecting you to your new vehicle dashboard...</p>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: "100%" }} 
                transition={{ duration: 3, ease: "linear" }}
                className="bg-emerald-500 h-full"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="print:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

export default FinancingPage;
