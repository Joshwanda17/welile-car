import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useTransactions, useDeposit } from '@/hooks/useProfile';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedNumber from '@/components/AnimatedNumber';
import BottomNav from '@/components/BottomNav';
import { formatUGX, formatDate } from '@/lib/format';
import { ArrowDownLeft, ArrowUpRight, Sparkles, X } from 'lucide-react';

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

  if (!authLoading && !user) { navigate('/'); return null; }
  if (isLoading || !profile) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>;
  }

  const handleDeposit = () => {
    const val = parseInt(amount);
    if (!val || val < 1000) return;
    deposit.mutate({ amount: val, method });
    setAmount('');
    setShowDeposit(false);
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
          <AnimatedNumber value={profile.wallet_balance} className="text-3xl font-bold font-heading block mt-1" />
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
          <p className="text-lg font-bold font-heading mt-1">{formatUGX(profile.total_deposits)}</p>
        </div>
        <div className="bg-card rounded-2xl p-4 card-shadow">
          <p className="text-[10px] text-muted-foreground uppercase">Growth Earned</p>
          <p className="text-lg font-bold font-heading mt-1 text-gradient">{formatUGX(profile.growth_earned)}</p>
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
