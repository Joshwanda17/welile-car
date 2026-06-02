import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  useAllProfiles,
  useUserTransactions,
  useAdminApproveFinancing,
  useAdminFlagUser,
  useAdminAssignAgent,
  type AdminProfile,
} from '@/hooks/useAdmin';
import { CARS } from '@/hooks/useProfile';
import { formatUGX } from '@/lib/format';
import { motion } from 'framer-motion';
import { Users, TrendingUp, DollarSign, Car, Unlock, FileText, Flag, UserCheck, LogOut, Eye } from 'lucide-react';
import { useState } from 'react';

const AdminPage = () => {
  const { isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: users = [], isLoading } = useAllProfiles();
  const approveFinancing = useAdminApproveFinancing();
  const flagUser = useAdminFlagUser();
  const assignAgent = useAdminAssignAgent();

  const [selectedUser, setSelectedUser] = useState<AdminProfile | null>(null);
  const [agentName, setAgentName] = useState('');
  const { data: userTransactions = [] } = useUserTransactions(selectedUser?.user_id ?? null);

  if (!authLoading && !isAdmin) { navigate('/'); return null; }
  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>;
  }

  const totalSavings = users.reduce((s, u) => s + u.wallet_balance, 0);
  const totalGrowth = users.reduce((s, u) => s + u.growth_earned, 0);
  const usersNear30 = users.filter(u => {
    if (!u.selected_car_id) return false;
    const car = CARS.find(c => c.id === u.selected_car_id);
    if (!car) return false;
    const pct = (u.wallet_balance / (car.price * 0.3)) * 100;
    return pct >= 20 && pct < 100;
  }).length;
  const usersUnlocked = users.filter(u => u.financing_unlocked).length;
  const totalFinancing = users.filter(u => u.financing_status === 'approved').length;

  const metrics = [
    { label: 'Total Savings', value: formatUGX(totalSavings), icon: DollarSign },
    { label: 'Growth Paid', value: formatUGX(totalGrowth), icon: TrendingUp },
    { label: 'Total Users', value: users.length.toString(), icon: Users },
    { label: 'Near 30%', value: usersNear30.toString(), icon: Car },
    { label: 'Unlocked', value: usersUnlocked.toString(), icon: Unlock },
    { label: 'Financing', value: totalFinancing.toString(), icon: FileText },
  ];

  const getUserProgress = (user: AdminProfile) => {
    if (!user.selected_car_id) return 0;
    const car = CARS.find(c => c.id === user.selected_car_id);
    if (!car) return 0;
    return Math.min(100, Math.round((user.wallet_balance / (car.price * 0.3)) * 100));
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="gradient-primary px-6 pt-12 pb-6 rounded-b-3xl flex items-center justify-between">
        <div>
          <p className="text-primary-foreground/70 text-sm">Admin Dashboard</p>
          <h1 className="text-primary-foreground text-xl font-bold font-heading">Welile Cars CFO</h1>
        </div>
        <button onClick={handleLogout} className="text-primary-foreground/70"><LogOut size={20} /></button>
      </div>

      <div className="px-4 -mt-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {metrics.map((m, i) => (
            <motion.div key={m.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }} className="bg-card rounded-2xl p-4 card-shadow">
              <m.icon size={16} className="text-primary mb-2" />
              <p className="text-lg font-bold font-heading">{m.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase">{m.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="px-4 mt-6">
        <h2 className="font-semibold text-sm mb-3">Users</h2>
        <div className="space-y-2">
          {users.map(user => {
            const car = CARS.find(c => c.id === user.selected_car_id);
            const progress = getUserProgress(user);
            return (
              <div key={user.id} className={`bg-card rounded-2xl p-4 card-shadow ${user.flagged ? 'ring-2 ring-destructive' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-[10px] text-muted-foreground">{user.phone}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                    user.financing_status === 'approved' ? 'bg-success/10 text-success' :
                    user.financing_status === 'pending' ? 'bg-warning/10 text-warning' :
                    'bg-secondary text-muted-foreground'
                  }`}>
                    {user.financing_status === 'none' ? 'Saving' : user.financing_status}
                  </span>
                </div>

                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>Savings: <span className="text-foreground font-medium">{formatUGX(user.wallet_balance)}</span></span>
                  <span>Progress: <span className="text-foreground font-medium">{progress}%</span></span>
                </div>
                {car && <p className="text-xs text-muted-foreground mt-1">Car: {car.name}</p>}
                {user.assigned_agent && <p className="text-xs text-muted-foreground">Agent: {user.assigned_agent}</p>}

                <div className="flex gap-2 mt-3">
                  {user.financing_status === 'pending' && (
                    <button onClick={() => approveFinancing.mutate(user.user_id)}
                      className="flex-1 h-8 bg-success/10 text-success rounded-xl text-xs font-medium">Approve</button>
                  )}
                  <button onClick={() => flagUser.mutate({ userId: user.user_id, flagged: user.flagged })}
                    className="h-8 px-3 bg-destructive/10 text-destructive rounded-xl text-xs font-medium flex items-center gap-1">
                    <Flag size={12} /> {user.flagged ? 'Unflag' : 'Flag'}
                  </button>
                  <button onClick={() => setSelectedUser(user)}
                    className="h-8 px-3 bg-secondary rounded-xl text-xs font-medium flex items-center gap-1">
                    <Eye size={12} /> Details
                  </button>
                </div>
              </div>
            );
          })}
          {users.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No users yet</p>
          )}
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-foreground/40 z-50 flex items-end justify-center" onClick={() => setSelectedUser(null)}>
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }}
            className="bg-card w-full max-w-lg rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <h2 className="font-bold font-heading text-lg mb-4">{selectedUser.name}</h2>
            <div className="space-y-2 text-sm">
              <p>Phone: {selectedUser.phone}</p>
              <p>Balance: {formatUGX(selectedUser.wallet_balance)}</p>
              <p>Growth: {formatUGX(selectedUser.growth_earned)}</p>
              <p>Referral Code: {selectedUser.referral_code}</p>
              <p>Status: {selectedUser.financing_status}</p>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Assign Agent</p>
              <div className="flex gap-2">
                <input value={agentName} onChange={e => setAgentName(e.target.value)} placeholder="Agent name"
                  className="flex-1 h-10 px-3 rounded-xl bg-secondary text-sm outline-none" />
                <button onClick={() => { assignAgent.mutate({ userId: selectedUser.user_id, agent: agentName }); setAgentName(''); }}
                  className="h-10 px-4 gradient-primary text-primary-foreground rounded-xl text-sm font-medium flex items-center gap-1">
                  <UserCheck size={14} /> Assign
                </button>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Transactions</p>
              {userTransactions.map(tx => (
                <div key={tx.id} className="flex justify-between text-xs py-1 border-b border-border">
                  <span className="capitalize">{tx.type}</span>
                  <span>{formatUGX(tx.amount)}</span>
                </div>
              ))}
            </div>

            <button onClick={() => setSelectedUser(null)}
              className="mt-4 w-full h-10 bg-secondary rounded-xl text-sm font-medium">Close</button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
