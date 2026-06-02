import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useGetProgress, useApplyGrowth, CARS } from '@/hooks/useProfile';
import { motion } from 'framer-motion';
import AnimatedNumber from '@/components/AnimatedNumber';
import ProgressBar from '@/components/ProgressBar';
import BottomNav from '@/components/BottomNav';
import { formatUGX } from '@/lib/format';
import { TrendingUp, Target, Sparkles, Users } from 'lucide-react';

const DashboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading } = useProfile();
  const applyGrowth = useApplyGrowth();
  const progress = useGetProgress(profile);

  if (!authLoading && !user) { navigate('/'); return null; }
  if (isLoading || !profile) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>;
  }

  const car = CARS.find(c => c.id === profile.selected_car_id);
  const milestones = [10, 25, 50, 100];
  const achievedMilestones = milestones.filter(m => progress && progress.percentage >= m);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="gradient-primary px-6 pt-12 pb-8 rounded-b-3xl">
        <p className="text-primary-foreground/70 text-sm">Welcome back,</p>
        <h1 className="text-primary-foreground text-xl font-bold font-heading">{profile.name}</h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 bg-primary-foreground/10 backdrop-blur rounded-2xl p-5"
        >
          <p className="text-primary-foreground/70 text-xs uppercase tracking-wider">Total Balance</p>
          <AnimatedNumber
            value={profile.wallet_balance}
            className="text-primary-foreground text-3xl font-bold font-heading block mt-1"
          />
          <div className="flex gap-6 mt-4">
            <div>
              <p className="text-primary-foreground/60 text-[10px] uppercase">Deposits</p>
              <p className="text-primary-foreground text-sm font-semibold">{formatUGX(profile.total_deposits)}</p>
            </div>
            <div>
              <p className="text-primary-foreground/60 text-[10px] uppercase">Growth</p>
              <p className="text-primary-foreground text-sm font-semibold">{formatUGX(profile.growth_earned)}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="px-6 mt-6 space-y-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-4 card-shadow flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <TrendingUp size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold">Your savings grow up to 5% monthly</p>
            <p className="text-xs text-muted-foreground">2% base + 3% bonus with weekly deposits</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-secondary rounded-2xl p-4 flex items-center gap-3">
          <Users size={16} className="text-primary" />
          <p className="text-xs text-secondary-foreground">3 people unlocked cars this week · Most reach 30% in 6–8 months</p>
        </motion.div>

        {car && progress ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl p-5 card-shadow">
            <div className="flex items-center gap-2 mb-3">
              <Target size={16} className="text-primary" />
              <p className="font-semibold text-sm">{car.name}</p>
            </div>
            <p className="text-xs text-muted-foreground mb-1">
              Target: {formatUGX(progress.target)} (30% of {formatUGX(car.price)})
            </p>
            <ProgressBar percentage={progress.percentage} className="mb-3" />
            <p className="text-lg font-bold font-heading text-gradient">{progress.percentage}% of target</p>

            {progress.percentage < 100 ? (
              <p className="text-xs text-muted-foreground mt-1">
                You need <span className="font-semibold text-foreground">{formatUGX(progress.remaining)}</span> more
              </p>
            ) : (
              <div className="mt-3">
                <p className="text-sm font-semibold text-success flex items-center gap-1">
                  <Sparkles size={14} /> You've unlocked your car 🎉
                </p>
                <button onClick={() => navigate('/financing')}
                  className="mt-3 w-full h-11 gradient-primary text-primary-foreground font-semibold rounded-2xl text-sm">
                  Proceed to Financing
                </button>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              {milestones.map(m => (
                <div key={m} className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                  achievedMilestones.includes(m) ? 'gradient-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                }`}>{m}%</div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl p-5 card-shadow text-center">
            <p className="text-sm text-muted-foreground mb-3">Select a car to start tracking progress</p>
            <button onClick={() => navigate('/cars')}
              className="h-10 px-6 gradient-primary text-primary-foreground font-semibold rounded-2xl text-sm">
              Browse Cars
            </button>
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => navigate('/wallet')} className="bg-card rounded-2xl p-4 card-shadow text-left">
            <p className="text-xs text-muted-foreground">Quick Action</p>
            <p className="text-sm font-semibold mt-1">Deposit Money</p>
          </button>
          <button onClick={() => applyGrowth.mutate()} className="bg-card rounded-2xl p-4 card-shadow text-left">
            <p className="text-xs text-muted-foreground">Simulate</p>
            <p className="text-sm font-semibold mt-1">Apply Growth</p>
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="gradient-primary-soft rounded-2xl p-4">
          <p className="text-sm font-semibold text-secondary-foreground">Invite friends, grow faster</p>
          <p className="text-xs text-muted-foreground mt-1">Share your code and earn UGX 50,000 per referral</p>
          <div className="mt-3 bg-card rounded-xl px-4 py-2 flex items-center justify-between">
            <span className="font-mono font-bold text-sm">{profile.referral_code}</span>
            <button onClick={() => navigator.clipboard.writeText(profile.referral_code)}
              className="text-xs text-primary font-semibold">Copy</button>
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default DashboardPage;
