import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import AnimatedNumber from '@/components/AnimatedNumber';
import ProgressBar from '@/components/ProgressBar';
import BottomNav from '@/components/BottomNav';
import { formatUGX } from '@/lib/format';
import { TrendingUp, Target, Sparkles, CheckCircle2, Circle, Car, CreditCard, ChevronRight } from 'lucide-react';

interface DashboardData {
  health: {
    riskLevel: string;
    creditScore: number;
    qualificationStatus: string;
  };
  savings: {
    totalSaved: number;
    targetAmount: number;
    interestEarned: number;
    progressPercent: number;
    nextMilestone: {
      amountNeeded: number;
      message: string;
    };
  };
  journey: {
    currentStep: string;
    completedSteps: string[];
  };
  vehicle: any;
  repayment: any;
}

const JOURNEY_STEPS = ['Registered', 'Saving', 'Qualified', 'Financing', 'Released', 'Repayment'];

const DashboardPage = () => {
  const { user, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`http://${window.location.hostname}:3005/api/dashboard/summary`, {
          headers: { 'Authorization': `Bearer ${session?.access_token}` }
        });
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, session, authLoading, navigate]);

  if (loading || !data) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-pulse text-slate-400 font-medium">Loading Dashboard...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-slate-900 px-6 pt-12 pb-24 rounded-b-[40px]">
        <p className="text-slate-400 text-sm font-medium">Welcome back,</p>
        <h1 className="text-white text-2xl font-extrabold">{user?.name || 'User'}</h1>
      </div>

      <div className="px-6 -mt-16 space-y-6">
        
        {/* Financial Health Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
          className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center justify-between"
        >
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Financial Health</p>
            <h2 className="text-xl font-extrabold text-slate-900">{data.health.qualificationStatus}</h2>
            <div className="flex gap-3 mt-2">
              <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${data.health.riskLevel === 'Low' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                Risk: {data.health.riskLevel}
              </span>
            </div>
          </div>
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className={`${data.health.creditScore >= 70 ? 'text-emerald-500' : 'text-amber-500'}`} strokeWidth="3" strokeDasharray={`${data.health.creditScore}, 100`} stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] font-bold text-slate-500 leading-none">Score</span>
              <span className="text-sm font-black text-slate-900 leading-none">{data.health.creditScore}</span>
            </div>
          </div>
        </motion.div>

        {/* Savings Wallet Widget - Deposit Progress */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Deposit Progress</p>
              <div className="text-3xl font-black text-slate-900 flex items-baseline gap-1">
                <AnimatedNumber value={data.savings.totalSaved} />
                <span className="text-lg text-slate-400 font-medium">UGX</span>
              </div>
            </div>
            <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-emerald-100">
              <TrendingUp size={12} />
              +5% Growth
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-slate-500">Current Savings</span>
                <span className="text-slate-900">Required Deposit: {formatUGX(data.savings.targetAmount)}</span>
              </div>
              <ProgressBar percentage={data.savings.progressPercent} className="h-3" />
            </div>

            {/* Next Milestone */}
            <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 flex items-start gap-3">
              <div className="bg-purple-200 p-1.5 rounded-full text-purple-700 shrink-0 mt-0.5">
                <Target size={14} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Next Milestone</p>
                <p className="text-xs font-medium text-slate-600 mt-0.5">
                  Save <span className="font-bold text-purple-700">{formatUGX(data.savings.nextMilestone.amountNeeded)}</span> more {data.savings.nextMilestone.message}
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <p className="text-slate-500 text-xs font-semibold">Remaining:</p>
                <p className="text-slate-900 font-bold text-sm">{formatUGX(data.savings.targetAmount - data.savings.totalSaved)}</p>
              </div>
              <button onClick={() => navigate('/savings')} className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-colors">
                Deposit Now
              </button>
            </div>
          </div>
        </motion.div>

        {/* Ownership Journey Timeline Widget */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
        >
          <h3 className="font-extrabold text-slate-900 mb-6 flex items-center gap-2">
            <Sparkles size={18} className="text-purple-600" /> Ownership Journey
          </h3>
          <div className="relative">
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100 rounded-full" />
            <div className="space-y-6 relative">
              {JOURNEY_STEPS.map((step, idx) => {
                const isCompleted = data.journey.completedSteps.includes(step);
                const isCurrent = data.journey.currentStep === step;
                return (
                  <div key={step} className="flex gap-4">
                    <div className="relative mt-0.5 z-10 bg-white">
                      {isCompleted ? (
                        <CheckCircle2 size={24} className="text-emerald-500 fill-emerald-50" />
                      ) : isCurrent ? (
                        <div className="w-6 h-6 rounded-full border-4 border-purple-600 bg-white shadow-[0_0_0_4px_rgba(147,51,234,0.1)]" />
                      ) : (
                        <Circle size={24} className="text-slate-200" />
                      )}
                    </div>
                    <div>
                      <p className={`font-bold ${isCurrent ? 'text-purple-600' : isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                        {step}
                      </p>
                      {isCurrent && <p className="text-xs font-medium text-slate-500 mt-1">Keep depositing to reach your 30% target.</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Current Vehicle Widget (if exists, else placeholder) */}
        {data.vehicle ? (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
           className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
         >
           <h3 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
             <Car size={18} className="text-purple-600" /> Current Vehicle
           </h3>
           <div className="flex gap-4 items-center">
             <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center">
                <Car className="text-slate-400" size={32} />
             </div>
             <div>
               <p className="font-bold text-slate-900 text-lg">{data.vehicle.name}</p>
               <p className="text-sm font-medium text-slate-500">{data.vehicle.plateNumber}</p>
             </div>
           </div>
         </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Car size={100} />
            </div>
            <h3 className="font-extrabold mb-2 relative z-10">Looking for a car?</h3>
            <p className="text-slate-400 text-sm font-medium mb-6 relative z-10">Browse our marketplace and pick your dream car to set a target.</p>
            <button onClick={() => navigate('/vehicles')} className="flex items-center gap-2 bg-white text-slate-900 px-5 py-2.5 rounded-xl text-sm font-bold transition-transform hover:scale-[1.02] relative z-10">
              Browse Vehicles <ChevronRight size={16} />
            </button>
          </motion.div>
        )}

        {/* Repayment Summary Widget (if exists) */}
        {data.repayment && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
          >
            <h3 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <CreditCard size={18} className="text-purple-600" /> Repayment Summary
            </h3>
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">Next Payment</p>
                <p className="font-black text-slate-900">{formatUGX(data.repayment.nextAmount)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-500 mb-1">Due Date</p>
                <p className="font-bold text-red-500">{data.repayment.dueDate}</p>
              </div>
            </div>
          </motion.div>
        )}

      </div>

      <BottomNav />
    </div>
  );
};

export default DashboardPage;
