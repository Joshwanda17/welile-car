import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '@/config';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { formatUGX } from '@/lib/format';
import { PlusCircle, ListOrdered, FileText, Car, LifeBuoy, CheckCircle2, Circle, TrendingUp, Target, Clock, ArrowRight } from 'lucide-react';
import { carsData } from '@/data/cars';

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
    monthlyContribution: number;
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
}

const JOURNEY_STEPS = [
  'Registered', 
  'Saving', 
  'Qualified', 
  'Financing Approved', 
  'Vehicle Released', 
  'Repayment Active'
];

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
        const res = await fetch(`${API_URL}/dashboard/summary`, {
          headers: { 'Authorization': `Bearer ${session?.access_token}` }
        });
        if (res.ok) {
          const json = await res.json();
          // Map backend data to our new layout structure if necessary, or just use as is
          setData({
            ...json,
            health: json.health || {
              riskLevel: 'Low',
              creditScore: 85,
              qualificationStatus: 'Building Deposit'
            },
            savings: {
              ...json.savings,
              monthlyContribution: 500000,
              nextMilestone: json.savings?.nextMilestone || {
                amountNeeded: 6600000,
                message: "Keep saving!"
              }
            }
          });
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
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse text-slate-400 font-medium">Loading Dashboard...</div>
      </div>
    );
  }

  const isQualified = data.health.creditScore >= 70 && data.savings.progressPercent >= 30;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h1>
        <p className="text-slate-500 font-medium">Here is your vehicle ownership progress.</p>
      </div>

      {/* Section 1: Savings Wallet (Top Priority) */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-primary text-white rounded-3xl p-6 shadow-xl shadow-primary/20 relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-white/5 rounded-full blur-[40px]"></div>
        
        <div className="relative z-10">
          <p className="text-primary-fixed-dim font-bold uppercase tracking-wider text-xs mb-1">Savings Balance</p>
          <h2 className="text-4xl font-black mb-6">{formatUGX(data.savings.totalSaved)}</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/10 p-3 rounded-2xl">
              <p className="text-primary-fixed-dim text-[10px] uppercase font-bold mb-1">Deposit Goal</p>
              <p className="font-bold">{formatUGX(data.savings.targetAmount)}</p>
            </div>
            <div className="bg-white/10 p-3 rounded-2xl">
              <p className="text-primary-fixed-dim text-[10px] uppercase font-bold mb-1">Progress</p>
              <p className="font-bold">{data.savings.progressPercent}%</p>
            </div>
            <div className="bg-white/10 p-3 rounded-2xl">
              <p className="text-primary-fixed-dim text-[10px] uppercase font-bold mb-1">Interest Earned</p>
              <p className="font-bold text-emerald-300">+{formatUGX(data.savings.interestEarned)}</p>
            </div>
            <div className="bg-white/10 p-3 rounded-2xl">
              <p className="text-primary-fixed-dim text-[10px] uppercase font-bold mb-1">Monthly Contrib.</p>
              <p className="font-bold">{formatUGX(data.savings.monthlyContribution)}</p>
            </div>
          </div>
          
          <button onClick={() => navigate('/wallet')} className="w-full md:w-auto bg-white text-primary hover:bg-slate-50 font-bold px-8 py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
            <PlusCircle size={18} /> Add Money
          </button>
        </div>
      </motion.div>

      {/* Section 2: Ownership Journey Tracker */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm overflow-x-auto">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Ownership Journey</h3>
        <div className="flex justify-between items-start min-w-[600px] relative">
          <div className="absolute top-4 left-6 right-6 h-1 bg-slate-100 rounded-full z-0"></div>
          {JOURNEY_STEPS.map((step, idx) => {
            // Mock logic for step progression
            const isCompleted = idx < 2 || (idx === 2 && isQualified);
            const isCurrent = (idx === 1 && !isQualified) || (idx === 2 && isQualified) || (idx === 3 && data.journey.currentStep === 'Financing Approved');
            
            return (
              <div key={step} className="relative z-10 flex flex-col items-center w-24 text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 border-4 bg-white ${
                  isCompleted ? 'border-emerald-500 text-emerald-500' : isCurrent ? 'border-primary text-primary shadow-[0_0_0_4px_rgba(52,0,105,0.1)]' : 'border-slate-200 text-slate-300'
                }`}>
                  {isCompleted ? <CheckCircle2 size={16} /> : <Circle size={10} className={isCurrent ? 'fill-primary' : 'fill-slate-200'} />}
                </div>
                <span className={`text-[11px] font-bold ${isCurrent ? 'text-primary' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 3: Qualification Status */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Target size={20} className="text-primary" /> Qualification Status</h3>
          <div className="flex gap-4 items-center mb-6">
            <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className={`${isQualified ? 'text-emerald-500' : 'text-amber-500'}`} strokeWidth="3" strokeDasharray={`${data.health.creditScore}, 100`} stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold text-slate-500 leading-none">Score</span>
                <span className="text-base font-black text-slate-900 leading-none mt-1">{data.health.creditScore}/100</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Risk Level: <span className={`font-bold ${data.health.riskLevel === 'Low' ? 'text-emerald-600' : 'text-amber-600'}`}>{data.health.riskLevel}</span></p>
              <p className="text-sm font-medium text-slate-500">Status: <span className={`font-bold ${isQualified ? 'text-emerald-600' : 'text-slate-900'}`}>{isQualified ? 'Eligible for Financing' : 'Building Deposit'}</span></p>
            </div>
          </div>
          
          {!isQualified && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm font-medium text-amber-800">
              You need <span className="font-bold">{formatUGX(data.savings.nextMilestone.amountNeeded)}</span> more savings to qualify.
            </div>
          )}
        </motion.div>

        {/* Section 4: Savings Goals */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><TrendingUp size={20} className="text-primary" /> Savings Goals</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <span className="text-sm text-slate-500 font-medium">Deposit Target</span>
                <span className="font-bold text-slate-900">{formatUGX(data.savings.targetAmount)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <span className="text-sm text-slate-500 font-medium">Remaining Amount</span>
                <span className="font-bold text-slate-900">{formatUGX(data.savings.targetAmount - data.savings.totalSaved)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 font-medium">Est. Completion</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1"><Clock size={14} /> December 2026</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Section 6: Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <button onClick={() => navigate('/wallet')} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-primary hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors"><PlusCircle size={20} /></div>
            <span className="text-xs font-bold text-slate-700">Add Savings</span>
          </button>
          <button onClick={() => navigate('/savings-history')} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-primary hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors"><ListOrdered size={20} /></div>
            <span className="text-xs font-bold text-slate-700">Transactions</span>
          </button>
          <button onClick={() => navigate('/financing')} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-primary hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors"><FileText size={20} /></div>
            <span className="text-xs font-bold text-slate-700">Apply Financing</span>
          </button>
          <button onClick={() => navigate('/vehicles')} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-primary hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors"><Car size={20} /></div>
            <span className="text-xs font-bold text-slate-700">Browse Vehicles</span>
          </button>
          <button onClick={() => navigate('/support')} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-primary hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors"><LifeBuoy size={20} /></div>
            <span className="text-xs font-bold text-slate-700">Support</span>
          </button>
        </div>
      </motion.div>

      {/* Section 5: Featured Vehicle Suggestions (Only after wallet & goals) */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-lg font-bold text-slate-900">Featured Vehicles</h3>
          <button onClick={() => navigate('/vehicles')} className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">View All <ArrowRight size={12} /></button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {carsData.slice(0, 3).map(car => (
            <div key={car.id} className="bg-white rounded-[24px] border border-slate-100 p-4 shadow-sm hover:shadow-md transition-all">
              <div className="h-32 flex items-center justify-center mb-4">
                <img src={car.image} alt={car.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-lg leading-tight mb-1">{car.name}</h4>
              <p className="text-primary font-black text-sm mb-4">{formatUGX(car.priceUgx)}</p>
              
              <div className="space-y-2 mb-4 bg-slate-50 p-3 rounded-xl">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-500">Required Deposit (30%)</span>
                  <span className="text-slate-900">{formatUGX(car.priceUgx * 0.3)}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-500">Est. Monthly (36m)</span>
                  <span className="text-slate-900">{formatUGX((car.priceUgx * 0.7 * 1.3) / 36)}</span>
                </div>
              </div>

              <button onClick={() => navigate('/vehicles/' + car.id)} className="w-full border-2 border-slate-100 hover:border-primary hover:bg-primary hover:text-white text-slate-700 font-bold py-2 rounded-xl text-xs transition-all">
                View Details
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
