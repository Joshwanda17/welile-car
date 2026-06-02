import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';

// Mock Profile type
export interface Profile {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  referral_code: string;
  referred_by: string | null;
  wallet_balance: number;
  total_deposits: number;
  deposits_this_month: number;
  growth_earned: number;
  last_deposit_date: string | null;
  last_growth_date: string | null;
  has_withdrawn_this_month: boolean;
  savings_locked: boolean;
  financing_unlocked: boolean;
  financing_status: string;
  selected_car_id: string | null;
  assigned_agent: string | null;
  flagged: boolean;
  created_at: string;
  updated_at: string;
}

export const CARS = [
  { id: 'wish', name: 'Toyota Wish', price: 10000000, image: '/cars/wish.jpg' },
  { id: 'premio', name: 'Toyota Premio', price: 12000000, image: '/cars/premio.jpg' },
  { id: 'vitz', name: 'Toyota Vitz', price: 8000000, image: '/cars/vitz.jpg' },
];

const getMockProfile = (userId: string): Profile => {
  const stored = localStorage.getItem(`mockProfile_${userId}`);
  if (stored) return JSON.parse(stored);
  
  const initial: Profile = {
    id: `prof_${userId}`,
    user_id: userId,
    name: 'Test User',
    phone: '',
    referral_code: 'ref123',
    referred_by: null,
    wallet_balance: 0,
    total_deposits: 0,
    deposits_this_month: 0,
    growth_earned: 0,
    last_deposit_date: null,
    last_growth_date: null,
    has_withdrawn_this_month: false,
    savings_locked: false,
    financing_unlocked: false,
    financing_status: 'none',
    selected_car_id: null,
    assigned_agent: null,
    flagged: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  localStorage.setItem(`mockProfile_${userId}`, JSON.stringify(initial));
  return initial;
};

const updateMockProfile = (userId: string, updates: Partial<Profile>) => {
  const profile = getMockProfile(userId);
  const updated = { ...profile, ...updates, updated_at: new Date().toISOString() };
  localStorage.setItem(`mockProfile_${userId}`, JSON.stringify(updated));
  return updated;
};

const getMockTransactions = (userId: string) => {
  const stored = localStorage.getItem(`mockTx_${userId}`);
  return stored ? JSON.parse(stored) : [];
};

const addMockTransaction = (userId: string, tx: any) => {
  const txs = getMockTransactions(userId);
  const newTx = { ...tx, id: `tx_${Date.now()}`, user_id: userId, created_at: new Date().toISOString() };
  localStorage.setItem(`mockTx_${userId}`, JSON.stringify([newTx, ...txs]));
  return newTx;
};

export function useProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      return getMockProfile(user.id);
    },
    enabled: !!user,
  });
}

export function useTransactions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      return getMockTransactions(user.id);
    },
    enabled: !!user,
  });
}

export function useDeposit() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ amount, method }: { amount: number; method: string }) => {
      if (!user) throw new Error('Not authenticated');

      addMockTransaction(user.id, { type: 'deposit', amount, method });

      const profile = getMockProfile(user.id);
      updateMockProfile(user.id, {
        wallet_balance: profile.wallet_balance + amount,
        total_deposits: profile.total_deposits + amount,
        deposits_this_month: profile.deposits_this_month + 1,
        last_deposit_date: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useSelectCar() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (carId: string) => {
      if (!user) throw new Error('Not authenticated');
      updateMockProfile(user.id, { selected_car_id: carId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useApplyGrowth() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');

      const profile = getMockProfile(user.id);
      if (profile.wallet_balance === 0 || profile.savings_locked) return;

      const baseRate = 0.02;
      const bonusRate = (!profile.has_withdrawn_this_month && profile.deposits_this_month >= 4) ? 0.03 : 0;
      const rate = baseRate + bonusRate;
      const growth = Math.round(profile.wallet_balance * rate);

      addMockTransaction(user.id, { type: 'growth', amount: growth, method: 'system' });

      updateMockProfile(user.id, {
        wallet_balance: profile.wallet_balance + growth,
        growth_earned: profile.growth_earned + growth,
        last_growth_date: new Date().toISOString(),
        deposits_this_month: 0,
        has_withdrawn_this_month: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useRequestFinancing() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');
      updateMockProfile(user.id, { financing_unlocked: true, financing_status: 'pending' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useGetProgress(profile: Profile | null | undefined) {
  if (!profile || !profile.selected_car_id) return null;
  const car = CARS.find(c => c.id === profile.selected_car_id);
  if (!car) return null;
  const target = car.price * 0.3;
  const percentage = Math.min(100, Math.round((profile.wallet_balance / target) * 100));
  return {
    target,
    progress: profile.wallet_balance,
    remaining: Math.max(0, target - profile.wallet_balance),
    percentage,
  };
}
