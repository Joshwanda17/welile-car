import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'growth';
  amount: number;
  method?: string;
  date: string;
}

export interface Car {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  password: string;
  walletBalance: number;
  totalDeposits: number;
  growthEarned: number;
  selectedCarId: string | null;
  transactions: Transaction[];
  referralCode: string;
  referredBy: string | null;
  lastGrowthDate: string | null;
  lastDepositDate: string | null;
  depositsThisMonth: number;
  hasWithdrawnThisMonth: boolean;
  financingUnlocked: boolean;
  financingStatus: 'none' | 'pending' | 'approved' | 'processing' | 'assigned' | 'repaying';
  savingsLocked: boolean;
  assignedAgent: string | null;
  flagged: boolean;
  createdAt: string;
}

export const CARS: Car[] = [
  { id: 'wish', name: 'Toyota Wish', price: 10000000, image: '/cars/wish.jpg' },
  { id: 'premio', name: 'Toyota Premio', price: 12000000, image: '/cars/premio.jpg' },
  { id: 'vitz', name: 'Toyota Vitz', price: 8000000, image: '/cars/vitz.jpg' },
];

interface AppState {
  currentUser: User | null;
  users: User[];
  isAdmin: boolean;
  login: (phone: string, password: string) => boolean;
  signup: (name: string, phone: string, password: string, referralCode?: string) => boolean;
  logout: () => void;
  deposit: (amount: number, method: string) => void;
  selectCar: (carId: string) => void;
  applyGrowth: () => void;
  requestFinancing: () => void;
  adminApproveFinancing: (userId: string) => void;
  adminFlagUser: (userId: string) => void;
  adminAssignAgent: (userId: string, agent: string) => void;
  loginAsAdmin: () => void;
  getProgress: () => { target: number; progress: number; remaining: number; percentage: number } | null;
}

const generateId = () => Math.random().toString(36).substring(2, 9);
const generateReferralCode = (name: string) => name.substring(0, 3).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();

const ADMIN_PHONE = '0700000000';
const ADMIN_PASS = 'admin123';

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],
      isAdmin: false,

      login: (phone, password) => {
        if (phone === ADMIN_PHONE && password === ADMIN_PASS) {
          set({ isAdmin: true, currentUser: null });
          return true;
        }
        const user = get().users.find(u => u.phone === phone && u.password === password);
        if (user) {
          set({ currentUser: user, isAdmin: false });
          return true;
        }
        return false;
      },

      signup: (name, phone, password, referralCode) => {
        const exists = get().users.find(u => u.phone === phone);
        if (exists) return false;

        const newUser: User = {
          id: generateId(),
          name,
          phone,
          password,
          walletBalance: 0,
          totalDeposits: 0,
          growthEarned: 0,
          selectedCarId: null,
          transactions: [],
          referralCode: generateReferralCode(name),
          referredBy: referralCode || null,
          lastGrowthDate: null,
          lastDepositDate: null,
          depositsThisMonth: 0,
          hasWithdrawnThisMonth: false,
          financingUnlocked: false,
          financingStatus: 'none',
          savingsLocked: false,
          assignedAgent: null,
          flagged: false,
          createdAt: new Date().toISOString(),
        };

        // If referred, give referrer bonus
        const users = [...get().users];
        if (referralCode) {
          const referrer = users.find(u => u.referralCode === referralCode);
          if (referrer) {
            referrer.walletBalance += 50000;
            referrer.transactions.push({
              id: generateId(),
              type: 'growth',
              amount: 50000,
              date: new Date().toISOString(),
            });
          }
        }

        set({ users: [...users, newUser], currentUser: newUser, isAdmin: false });
        return true;
      },

      logout: () => set({ currentUser: null, isAdmin: false }),

      deposit: (amount, method) => {
        const { currentUser, users } = get();
        if (!currentUser || currentUser.savingsLocked) return;

        const tx: Transaction = {
          id: generateId(),
          type: 'deposit',
          amount,
          method,
          date: new Date().toISOString(),
        };

        const updated: User = {
          ...currentUser,
          walletBalance: currentUser.walletBalance + amount,
          totalDeposits: currentUser.totalDeposits + amount,
          transactions: [tx, ...currentUser.transactions],
          lastDepositDate: new Date().toISOString(),
          depositsThisMonth: currentUser.depositsThisMonth + 1,
        };

        set({
          currentUser: updated,
          users: users.map(u => u.id === updated.id ? updated : u),
        });
      },

      selectCar: (carId) => {
        const { currentUser, users } = get();
        if (!currentUser) return;
        const updated = { ...currentUser, selectedCarId: carId };
        set({
          currentUser: updated,
          users: users.map(u => u.id === updated.id ? updated : u),
        });
      },

      applyGrowth: () => {
        const { currentUser, users } = get();
        if (!currentUser || currentUser.walletBalance === 0 || currentUser.savingsLocked) return;

        const baseRate = 0.02;
        const bonusRate = (!currentUser.hasWithdrawnThisMonth && currentUser.depositsThisMonth >= 4) ? 0.03 : 0;
        const rate = baseRate + bonusRate;
        const growth = Math.round(currentUser.walletBalance * rate);

        const tx: Transaction = {
          id: generateId(),
          type: 'growth',
          amount: growth,
          date: new Date().toISOString(),
        };

        const updated: User = {
          ...currentUser,
          walletBalance: currentUser.walletBalance + growth,
          growthEarned: currentUser.growthEarned + growth,
          transactions: [tx, ...currentUser.transactions],
          lastGrowthDate: new Date().toISOString(),
          depositsThisMonth: 0,
          hasWithdrawnThisMonth: false,
        };

        set({
          currentUser: updated,
          users: users.map(u => u.id === updated.id ? updated : u),
        });
      },

      requestFinancing: () => {
        const { currentUser, users } = get();
        if (!currentUser) return;
        const updated: User = {
          ...currentUser,
          financingUnlocked: true,
          financingStatus: 'pending',
        };
        set({
          currentUser: updated,
          users: users.map(u => u.id === updated.id ? updated : u),
        });
      },

      adminApproveFinancing: (userId) => {
        const users = get().users.map(u =>
          u.id === userId ? { ...u, financingStatus: 'approved' as const, savingsLocked: true } : u
        );
        set({ users });
      },

      adminFlagUser: (userId) => {
        const users = get().users.map(u =>
          u.id === userId ? { ...u, flagged: !u.flagged } : u
        );
        set({ users });
      },

      adminAssignAgent: (userId, agent) => {
        const users = get().users.map(u =>
          u.id === userId ? { ...u, assignedAgent: agent } : u
        );
        set({ users });
      },

      loginAsAdmin: () => set({ isAdmin: true, currentUser: null }),

      getProgress: () => {
        const { currentUser } = get();
        if (!currentUser || !currentUser.selectedCarId) return null;
        const car = CARS.find(c => c.id === currentUser.selectedCarId);
        if (!car) return null;
        const target = car.price * 0.3;
        const percentage = Math.min(100, Math.round((currentUser.walletBalance / target) * 100));
        return {
          target,
          progress: currentUser.walletBalance,
          remaining: Math.max(0, target - currentUser.walletBalance),
          percentage,
        };
      },
    }),
    { name: 'welile-cars-store' }
  )
);
