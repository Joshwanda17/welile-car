import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import type { Profile } from './useProfile';

export type AdminProfile = Profile;
export type AdminTransaction = any;

const getAllMockProfiles = (): AdminProfile[] => {
  const keys = Object.keys(localStorage).filter(k => k.startsWith('mockProfile_'));
  return keys.map(k => JSON.parse(localStorage.getItem(k) || '{}'));
};

const getMockTransactionsForUser = (userId: string) => {
  const stored = localStorage.getItem(`mockTx_${userId}`);
  return stored ? JSON.parse(stored) : [];
};

const updateMockProfileAdmin = (userId: string, updates: Partial<AdminProfile>) => {
  const key = `mockProfile_${userId}`;
  const stored = localStorage.getItem(key);
  if (stored) {
    const profile = JSON.parse(stored);
    const updated = { ...profile, ...updates, updated_at: new Date().toISOString() };
    localStorage.setItem(key, JSON.stringify(updated));
  }
};

export function useAllProfiles() {
  const { isAdmin } = useAuth();

  return useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      return getAllMockProfiles();
    },
    enabled: isAdmin,
  });
}

export function useUserTransactions(userId: string | null) {
  const { isAdmin } = useAuth();

  return useQuery({
    queryKey: ['admin-transactions', userId],
    queryFn: async () => {
      if (!userId) return [];
      return getMockTransactionsForUser(userId);
    },
    enabled: isAdmin && !!userId,
  });
}

export function useAdminApproveFinancing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      updateMockProfileAdmin(userId, { financing_status: 'approved', savings_locked: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
    },
  });
}

export function useAdminFlagUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, flagged }: { userId: string; flagged: boolean }) => {
      updateMockProfileAdmin(userId, { flagged: !flagged });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
    },
  });
}

export function useAdminAssignAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, agent }: { userId: string; agent: string }) => {
      updateMockProfileAdmin(userId, { assigned_agent: agent });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
    },
  });
}
