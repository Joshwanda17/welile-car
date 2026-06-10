import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '@/config';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useTransactions, useDeposit } from '@/hooks/useProfile';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedNumber from '@/components/AnimatedNumber';
import BottomNav from '@/components/BottomNav';
import { formatUGX, formatDate } from '@/lib/format';
import { ArrowDownLeft, ArrowUpRight, Sparkles, X, Wallet, Car, TrendingUp, ShieldCheck } from 'lucide-react';

const paymentMethods = [
  { id: 'mtn', name: 'MTN MoMo', color: '#FFCC00' },
  { id: 'airtel', name: 'Airtel Money', color: '#ED1C24' },
];

const quickAmounts = [50000, 100000, 200000, 500000];

const WalletPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading } = useProfile();
  const { data: transactions = [] } = useTransactions();
  const deposit = useDeposit();
  const [showDeposit, setShowDeposit] = useState(false);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('mtn');

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
          const json = await res.json();
          setDashboardData(json);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingDashboard(false);
      }
    };
    fetchData();
  }, [user, session]);

  // Calculator State
  const [calcTarget, setCalcTarget] = useState('');
  const [calcMonthly, setCalcMonthly] = useState('');
  const [calcResult, setCalcResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  if (!authLoading && !user) { navigate('/'); return null; }
  if (isLoading || loadingDashboard || !profile || !dashboardData) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>;
  }

  const handleDeposit = async () => {
    const val = parseInt(amount);
    if (!val || val < 1000) return;
    await deposit.mutateAsync({ amount: val, method });
    
    // Refresh dashboard data
    const res = await fetch(`${API_URL}/dashboard/summary`, {
      headers: { 'Authorization': `Bearer ${session?.access_token}` }
    });
    if (res.ok) {
      setDashboardData(await res.json());
    }

    setAmount('');
    setShowDeposit(false);
  };

  const handleCalculate = async () => {
    if (!calcTarget || !calcMonthly) return;
    setIsCalculating(true);
    try {
      const res = await fetch(`${API_URL}/savings/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetAmount: parseInt(calcTarget),
          monthlyContribution: parseInt(calcMonthly)
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCalcResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCalculating(false);
    }
  };

  const iconForType = (type: string) => {
    if (type === 'deposit') return <ArrowDownLeft size={16} className="text-success" />;
    if (type === 'growth') return <Sparkles size={16} className="text-primary" />;
    return <ArrowUpRight size={16} className="text-destructive" />;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-6 pt-12">
        <h1 className="text-2xl font-bold font-heading">Wallet</h1>
      </div>

      <div className="px-4 mt-4">
        <div className="bg-[#6b2cc4] rounded-[32px] p-6 text-white shadow-2xl shadow-[#6b2cc4]/30 relative overflow-hidden">
          {/* Active Badge */}
          <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold tracking-wider text-white">ACTIVE</span>
          </div>
          
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#6b2cc4]">
              <Wallet size={20} />
            </div>
            <p className="font-bold tracking-widest text-sm text-white/90">WELILE WALLET</p>
          </div>

          {/* Balance */}
          <p className="text-xs text-white/70 uppercase tracking-widest mb-2 flex items-center gap-2 font-medium">
            <Wallet size={14} className="opacity-70" /> WITHDRAWABLE BALANCE
          </p>
          <AnimatedNumber value={profile.wallet_balance} className="text-4xl md:text-5xl font-extrabold tracking-tight block mb-8" />

          {/* 3 Grid Boxes */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-white/10 rounded-2xl p-3 flex flex-col items-center justify-center backdrop-blur-md">
               <Car size={18} className="text-white/70 mb-2" />
               <p className="text-[9px] text-white/60 uppercase tracking-wider mb-1 font-semibold">Vehicles</p>
               <p className="text-base font-bold">1</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-3 flex flex-col items-center justify-center backdrop-blur-md">
               <TrendingUp size={18} className="text-white/70 mb-2" />
               <p className="text-[9px] text-white/60 uppercase tracking-wider mb-1 font-semibold">Growth/Mo</p>
               <p className="text-base font-bold">5%</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-3 flex flex-col items-center justify-center backdrop-blur-md">
               <ShieldCheck size={18} className="text-white/70 mb-2" />
               <p className="text-[9px] text-white/60 uppercase tracking-wider mb-1 font-semibold">Target</p>
               <p className="text-base font-bold">30%</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4 px-1">
             <span className="text-white/80 text-sm font-medium">Invested (Deposits)</span>
             <span className="text-white font-bold">{formatUGX(profile.total_deposits)}</span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mb-8">
             <button onClick={() => setShowDeposit(true)} disabled={profile.savings_locked} className="flex-1 bg-white text-[#6b2cc4] rounded-2xl py-3.5 px-4 flex items-center justify-center gap-2 font-bold text-sm shadow-sm hover:bg-white/90 disabled:opacity-50 transition-all">
               <ArrowDownLeft size={18} className="text-emerald-500" />
               Deposit
             </button>
             <button className="flex-1 bg-white text-[#6b2cc4] rounded-2xl py-3.5 px-4 flex items-center justify-center gap-2 font-bold text-sm shadow-sm hover:bg-white/90 transition-all">
               <ArrowUpRight size={18} className="text-rose-500" />
               Withdraw
             </button>
          </div>

          {/* Banner at bottom */}
          <div className="bg-[#4d169e] border border-[#7f41df]/50 rounded-2xl p-4 shadow-inner">
             <p className="text-[10px] text-[#ffc107] font-bold tracking-widest uppercase flex items-center gap-1.5 mb-2">
               <Sparkles size={12} />
               BALANCE GROWING · 5% / INSTALLMENT
             </p>
             <p className="text-sm text-white/80 font-medium">
                <span className="font-bold text-white">{formatUGX(profile.total_deposits)}</span> parked · 
                <span className="text-emerald-400 font-bold ml-1">+{formatUGX(profile.growth_earned)}</span> earned
             </p>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6">
        <h2 className="font-semibold text-sm mb-3">Transaction History</h2>
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No transactions yet</p>
        ) : (
          <div className="space-y-2">
            {transactions.map(tx => (
              <div key={tx.id} className="bg-card rounded-xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  {iconForType(tx.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium capitalize">{tx.type}{tx.method ? ` · ${tx.method}` : ''}</p>
                  <p className="text-[10px] text-muted-foreground">{formatDate(tx.created_at)}</p>
                </div>
                <p className={`text-sm font-semibold ${tx.type === 'withdrawal' ? 'text-destructive' : 'text-success'}`}>
                  {tx.type === 'withdrawal' ? '-' : '+'}{formatUGX(tx.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showDeposit && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/40 z-50 flex items-end justify-center"
            onClick={() => setShowDeposit(false)}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-card w-full max-w-lg rounded-t-3xl p-6"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold font-heading text-lg">Deposit Money</h2>
                <button onClick={() => setShowDeposit(false)}><X size={20} className="text-muted-foreground" /></button>
              </div>
              <div className="flex gap-3 mb-4">
                {paymentMethods.map(pm => (
                  <button key={pm.id} onClick={() => setMethod(pm.id)}
                    className={`flex-1 h-12 rounded-2xl text-sm font-medium border-2 transition ${
                      method === pm.id ? 'border-primary bg-secondary' : 'border-border'
                    }`}>{pm.name}</button>
                ))}
              </div>
              <input type="number" placeholder="Enter amount (UGX)" value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full h-14 px-4 rounded-2xl bg-secondary text-foreground text-lg font-semibold placeholder:text-muted-foreground placeholder:text-base placeholder:font-normal outline-none focus:ring-2 focus:ring-primary transition" />
              <div className="flex gap-2 mt-3">
                {quickAmounts.map(qa => (
                  <button key={qa} onClick={() => setAmount(qa.toString())}
                    className="flex-1 h-9 rounded-xl bg-secondary text-xs font-medium hover:bg-accent transition">
                    {(qa / 1000)}K
                  </button>
                ))}
              </div>
              <button onClick={handleDeposit}
                className="mt-6 w-full h-12 gradient-primary text-primary-foreground font-semibold rounded-2xl">
                Confirm Deposit
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

export default WalletPage;
