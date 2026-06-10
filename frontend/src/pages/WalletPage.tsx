import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '@/config';
import { useAuth } from '@/hooks/useAuth';
import { carsData, Car } from '@/data/cars';
import { useProfile, useTransactions, useDeposit } from '@/hooks/useProfile';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedNumber from '@/components/AnimatedNumber';
import BottomNav from '@/components/BottomNav';
import { formatUGX, formatDate } from '@/lib/format';
import { ArrowDownLeft, ArrowUpRight, Sparkles, X, Check } from 'lucide-react';

const paymentMethods = [
  { id: 'mtn', name: 'MTN MoMo', color: '#FFCC00' },
  { id: 'airtel', name: 'Airtel Money', color: '#ED1C24' },
];

const quickAmounts = [50000, 100000, 200000, 500000];

const purchasePaymentMethods = [
  { id: 'wallet', name: 'Fund from Wallet', icon: 'account_balance_wallet' },
  { id: 'mtn', name: 'MTN MoMo', icon: 'phone_iphone' },
  { id: 'airtel', name: 'Airtel Money', icon: 'phone_iphone' },
  { id: 'bank', name: 'Bank Transfer', icon: 'account_balance' },
  { id: 'card', name: 'Credit Card', icon: 'credit_card' },
];

const WalletPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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

  // Purchase State
  const searchParams = new URLSearchParams(location.search);
  const purchaseCarId = searchParams.get('purchaseCarId');
  const [purchaseCar, setPurchaseCar] = useState<Car | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseMethod, setPurchaseMethod] = useState('wallet');
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    if (purchaseCarId) {
      const car = carsData.find(c => c.id === purchaseCarId);
      if (car) {
        setPurchaseCar(car);
        setShowPurchaseModal(true);
      }
    }
  }, [purchaseCarId]);

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

  const handlePurchase = () => {
    setShowPurchaseModal(false);
    const deficit = purchaseCar && dashboardData?.savings?.totalSaved < purchaseCar.priceUgx 
      ? purchaseCar.priceUgx - dashboardData.savings.totalSaved 
      : 0;
    navigate(`/payment-details?method=${purchaseMethod}&carId=${purchaseCar?.id}&deficit=${deficit}`);
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

      <div className="px-6 mt-4">
        <div className="bg-card rounded-2xl p-5 card-shadow">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Available Balance</p>
          <AnimatedNumber value={dashboardData.savings.totalSaved} className="text-3xl font-bold font-heading block mt-1" />
          {profile.savings_locked && (
            <p className="text-xs text-warning font-medium mt-2">🔒 Savings locked for car ownership</p>
          )}
          <button onClick={() => setShowDeposit(true)} disabled={profile.savings_locked}
            className="mt-4 w-full h-11 gradient-primary text-primary-foreground font-semibold rounded-2xl text-sm disabled:opacity-50">
            Deposit Money
          </button>
        </div>
      </div>

      <div className="px-6 mt-4 grid grid-cols-2 gap-3">
        <div className="bg-card rounded-2xl p-4 card-shadow">
          <p className="text-[10px] text-muted-foreground uppercase">Total Deposits</p>
          <p className="text-lg font-bold font-heading mt-1">{formatUGX(dashboardData.savings.totalSaved)}</p>
        </div>
        <div className="bg-card rounded-2xl p-4 card-shadow">
          <p className="text-[10px] text-muted-foreground uppercase">Growth Earned</p>
          <p className="text-lg font-bold font-heading mt-1 text-gradient">{formatUGX(dashboardData.savings.interestEarned)}</p>
        </div>
      </div>

      {/* Savings Calculator Widget */}
      <div className="px-6 mt-6">
        <div className="bg-primary rounded-3xl p-6 text-white shadow-lg shadow-primary/30">
          <h2 className="font-extrabold text-lg flex items-center gap-2 mb-4">
            <Sparkles size={18} /> Savings Calculator
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-primary/40 font-bold mb-1">Vehicle Target Deposit (UGX)</p>
              <input 
                type="number" 
                placeholder="e.g. 15000000"
                value={calcTarget}
                onChange={e => setCalcTarget(e.target.value)}
                className="w-full bg-white/20 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white transition font-medium"
              />
            </div>
            <div>
              <p className="text-xs text-primary/40 font-bold mb-1">Monthly Contribution (UGX)</p>
              <input 
                type="number" 
                placeholder="e.g. 500000"
                value={calcMonthly}
                onChange={e => setCalcMonthly(e.target.value)}
                className="w-full bg-white/20 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white transition font-medium"
              />
            </div>
            
            {calcResult && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/10 p-4 rounded-xl border border-white/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-primary/20">Estimated Time</span>
                  <span className="font-bold">{calcResult.estimatedMonths} Months</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-primary/20">Total Interest Earned</span>
                  <span className="font-bold text-emerald-300">+{formatUGX(calcResult.estimatedInterest)}</span>
                </div>
              </motion.div>
            )}

            <button 
              onClick={handleCalculate}
              disabled={isCalculating}
              className="w-full bg-white text-primary font-bold py-3 rounded-xl hover:bg-slate-50 transition disabled:opacity-50"
            >
              {isCalculating ? 'Calculating...' : 'Calculate Estimation'}
            </button>
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
              className="bg-white w-full max-w-lg rounded-t-3xl p-6"
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

      {/* Checkout / Purchase Modal */}
      <AnimatePresence>
        {showPurchaseModal && purchaseCar && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 z-50 flex items-end justify-center"
            onClick={() => !isPurchasing && !purchaseSuccess && setShowPurchaseModal(false)}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white w-full max-w-lg rounded-t-3xl p-6 relative overflow-y-auto max-h-[90vh] shadow-2xl"
              onClick={e => e.stopPropagation()}>
              
              {purchaseSuccess ? (
                <div className="py-12 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-success/20 text-success rounded-full flex items-center justify-center mb-6">
                    <Sparkles size={40} />
                  </div>
                  <h2 className="text-2xl font-bold font-heading mb-2">Purchase Successful!</h2>
                  <p className="text-muted-foreground">You are now the proud owner of the {purchaseCar.name}.</p>
                  <p className="text-sm mt-4 text-muted-foreground animate-pulse">Redirecting to marketplace...</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold font-heading text-lg">Checkout</h2>
                    <button onClick={() => setShowPurchaseModal(false)}><X size={20} className="text-muted-foreground" /></button>
                  </div>
                  
                  <div className="bg-[#4C158D] p-4 rounded-2xl flex gap-4 items-center mb-6 text-white shadow-lg shadow-[#4C158D]/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                    <img src={purchaseCar.image} alt={purchaseCar.name} className="w-24 h-16 object-contain drop-shadow-md relative z-10" />
                    <div className="relative z-10">
                      <p className="font-bold">{purchaseCar.name}</p>
                      <p className="text-white/90 font-bold text-lg drop-shadow-sm">{formatUGX(purchaseCar.priceUgx)}</p>
                    </div>
                  </div>

                  <p className="text-sm font-bold mb-3 uppercase tracking-wider text-muted-foreground">Select Payment Method</p>
                  <div className="space-y-3 mb-6">
                    {purchasePaymentMethods.map(pm => (
                      <button 
                        key={pm.id} 
                        onClick={() => setPurchaseMethod(pm.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                          purchaseMethod === pm.id ? 'border-primary bg-primary/5' : 'border-border hover:border-border/80'
                        }`}
                      >
                        <span className="material-symbols-outlined text-primary">{pm.icon}</span>
                        <span className="font-bold text-sm flex-1 text-left">{pm.name}</span>
                        {purchaseMethod === pm.id && <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center"><Check size={12} strokeWidth={4} /></div>}
                      </button>
                    ))}
                  </div>

                  {purchaseMethod === 'wallet' && dashboardData?.savings?.totalSaved < purchaseCar.priceUgx && (
                    <div className="mb-6 bg-orange-500/10 text-orange-600 p-3 rounded-xl text-sm font-semibold flex items-center gap-2">
                      <span className="material-symbols-outlined">info</span>
                      Your wallet balance is low. You will be prompted to top up your wallet via Mobile Money in the next step.
                    </div>
                  )}

                  <button 
                    onClick={handlePurchase}
                    disabled={isPurchasing}
                    className="w-full h-14 gradient-primary text-primary-foreground font-bold rounded-2xl disabled:opacity-50 text-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                  >
                    Continue to Payment Details
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

export default WalletPage;
