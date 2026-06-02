import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useRequestFinancing, CARS } from '@/hooks/useProfile';
import { motion } from 'framer-motion';
import { formatUGX } from '@/lib/format';
import BottomNav from '@/components/BottomNav';
import { useState } from 'react';

const FinancingPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading } = useProfile();
  const requestFinancing = useRequestFinancing();
  const [plan, setPlan] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  if (!authLoading && !user) { navigate('/'); return null; }
  if (isLoading || !profile) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>;
  }

  const car = CARS.find(c => c.id === profile.selected_car_id);
  if (!car) { navigate('/cars'); return null; }

  const saved = profile.wallet_balance;
  const remaining = car.price - saved;
  const target = car.price * 0.3;
  const isUnlocked = saved >= target;

  const plans = {
    daily: { label: 'Daily', amount: Math.round(remaining / 180), period: '6 months' },
    weekly: { label: 'Weekly', amount: Math.round(remaining / 26), period: '6 months' },
    monthly: { label: 'Monthly', amount: Math.round(remaining / 6), period: '6 months' },
  };

  const handleProceed = () => {
    requestFinancing.mutate();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-6 pt-12">
        <h1 className="text-2xl font-bold font-heading">Financing</h1>
        <p className="text-muted-foreground text-sm mt-1">{car.name}</p>
      </div>

      <div className="px-6 mt-6 space-y-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-5 card-shadow">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Car Price</span>
              <span className="font-semibold">{formatUGX(car.price)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Your Savings (30%)</span>
              <span className="font-semibold text-success">{formatUGX(saved)}</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between">
              <span className="text-sm font-semibold">To Finance (70%)</span>
              <span className="text-lg font-bold font-heading text-gradient">{formatUGX(remaining)}</span>
            </div>
          </div>
        </motion.div>

        {isUnlocked && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl p-5 card-shadow">
            <h2 className="font-semibold text-sm mb-3">Choose Payment Plan</h2>
            <div className="flex gap-2 mb-4">
              {(Object.keys(plans) as Array<keyof typeof plans>).map(p => (
                <button key={p} onClick={() => setPlan(p)}
                  className={`flex-1 h-10 rounded-xl text-sm font-medium transition ${
                    plan === p ? 'gradient-primary text-primary-foreground' : 'bg-secondary'
                  }`}>{plans[p].label}</button>
              ))}
            </div>
            <div className="text-center py-4">
              <p className="text-xs text-muted-foreground">You'll pay</p>
              <p className="text-3xl font-bold font-heading text-gradient mt-1">{formatUGX(plans[plan].amount)}</p>
              <p className="text-sm text-muted-foreground mt-1">per {plan.replace('ly', '')} for {plans[plan].period}</p>
            </div>
          </motion.div>
        )}

        {isUnlocked ? (
          <button onClick={handleProceed}
            className="w-full h-12 gradient-primary text-primary-foreground font-semibold rounded-2xl">
            Proceed to Financing
          </button>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">Save {formatUGX(target - saved)} more to unlock</p>
            <button onClick={() => navigate('/wallet')}
              className="mt-3 h-11 px-8 gradient-primary text-primary-foreground font-semibold rounded-2xl text-sm">
              Keep Saving
            </button>
          </div>
        )}

        {profile.financing_status !== 'none' && (
          <div className="bg-secondary rounded-2xl p-4 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
            <p className="font-semibold capitalize mt-1">{profile.financing_status}</p>
            {profile.savings_locked && (
              <p className="text-xs text-muted-foreground mt-2">🔒 Your savings are now part of your car ownership</p>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default FinancingPage;
