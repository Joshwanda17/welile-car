import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  useAllProfiles,
  useUserTransactions,
  useAdminApproveFinancing,
  useAdminFlagUser,
  useAdminAssignAgent,
  useSubmitCfoRequest,
  useCfoRequests,
  type AdminProfile,
  type CfoRequest,
} from '@/hooks/useAdmin';
import { CARS } from '@/hooks/useProfile';
import { formatUGX } from '@/lib/format';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Car, 
  Unlock, 
  FileText, 
  Flag, 
  UserCheck, 
  LogOut, 
  Eye, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertTriangle,
  History,
  X,
  User as UserIcon,
  Phone,
  Calendar,
  Activity
} from 'lucide-react';
import { useState } from 'react';

import { toast } from 'sonner';

const AdminPage = () => {
  const { isAdmin, loading: authLoading, signOut, signIn } = useAuth();
  const navigate = useNavigate();
  const { data: users = [], isLoading } = useAllProfiles();
  const approveFinancing = useAdminApproveFinancing();
  const flagUser = useAdminFlagUser();
  const assignAgent = useAdminAssignAgent();
  const submitCfoRequest = useSubmitCfoRequest();
  const { data: cfoRequests = [] } = useCfoRequests();

  const [selectedUser, setSelectedUser] = useState<AdminProfile | null>(null);
  const [agentName, setAgentName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'near30' | 'flagged' | 'cfo_requests'>('all');
  
  // CFO Request Modal states
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestDetails, setRequestDetails] = useState('');
  const [requestUser, setRequestUser] = useState<AdminProfile | null>(null);

  const { data: userTransactions = [] } = useUserTransactions(selectedUser?.user_id ?? null);

  // Login Form States
  const [email, setEmail] = useState('admin@admin.com');
  const [password, setPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const handleAdminLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setLoginError(error);
      }
    } catch (err) {
      setLoginError('An error occurred during authentication.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRequestFinancing = (user: AdminProfile) => {
    setRequestUser(user);
    const carName = CARS.find(c => c.id === user.selected_car_id)?.name || 'selected vehicle';
    const progress = getUserProgress(user);
    setRequestDetails(`User ${user.name} has saved ${formatUGX(user.wallet_balance)} towards a ${carName} (${progress}% of target savings). Admin requesting credit line release and vehicle purchase approval.`);
    setRequestModalOpen(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-[#4C158D] rounded-full animate-spin"></div>
        <div className="text-slate-500 font-bold text-sm tracking-wide">Checking permissions...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 px-4 py-12 text-white font-sans selection:bg-primary/20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-[440px] bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 sm:p-10 rounded-[32px] shadow-2xl relative overflow-hidden"
        >
          {/* Subtle decoration */}
          <div className="absolute top-[-50px] right-[-50px] w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

          <div className="text-center mb-8 relative z-10">
            <div className="w-16 h-16 bg-gradient-to-tr from-[#4C158D] to-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#4C158D]/20">
              <Unlock size={28} className="text-white" />
            </div>
            <h1 className="font-chewy text-4xl tracking-wide mb-1.5 text-white">Welile Cars</h1>
            <p className="text-indigo-300/80 font-bold text-xs uppercase tracking-widest">Operations Panel Gate</p>
            <p className="text-slate-400 text-sm font-medium mt-3">
              This space is restricted. Please sign in with administrator credentials to manage customers and payments.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 relative z-10">
            <div>
              <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@admin.com"
                className="w-full h-13 px-4 rounded-xl bg-slate-950/60 border border-slate-800 outline-none focus:border-[#4C158D] transition text-sm font-semibold text-white placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-13 px-4 rounded-xl bg-slate-950/60 border border-slate-800 outline-none focus:border-[#4C158D] transition text-sm font-semibold text-white placeholder:text-slate-600"
              />
            </div>

            {loginError && (
              <p className="text-red-400 text-xs font-semibold text-center mt-2">{loginError}</p>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full h-13 mt-6 bg-[#4C158D] hover:bg-[#3f2bc2] text-white font-bold text-[14px] rounded-xl transition disabled:opacity-50 shadow-lg shadow-[#4C158D]/20 flex items-center justify-center gap-2"
            >
              {loginLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="relative z-10 border-t border-slate-800/80 mt-6 pt-6 flex flex-col gap-3">
            <button
              onClick={() => handleAdminLogin()}
              disabled={loginLoading}
              className="w-full h-11 bg-white/5 border border-white/10 hover:bg-white/10 text-indigo-200 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
            >
              <span>Instant Admin Login</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full h-11 bg-slate-950/40 hover:bg-slate-950 text-slate-400 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
            >
              <span>Return to Home</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-[#4C158D] rounded-full animate-spin"></div>
        <div className="text-slate-500 font-bold text-sm tracking-wide">Loading Admin Workspace...</div>
      </div>
    );
  }

  // Dashboard Stats Calculations
  const totalSavings = users.reduce((s, u) => s + u.wallet_balance, 0);
  const totalGrowth = users.reduce((s, u) => s + u.growth_earned, 0);
  
  const getUserProgress = (user: AdminProfile) => {
    if (!user.selected_car_id) return 0;
    const car = CARS.find(c => c.id === user.selected_car_id);
    if (!car) return 0;
    const target = (user.selected_car_price || car.price) * 0.3;
    return Math.min(100, Math.round((user.wallet_balance / target) * 100));
  };

  const usersSaving = users.filter(u => {
    if (!u.selected_car_id) return true;
    const progress = getUserProgress(u);
    return progress < 30;
  });

  const usersReached30 = users.filter(u => {
    if (!u.selected_car_id) return false;
    const progress = getUserProgress(u);
    return progress >= 30;
  });

  const usersPending = users.filter(u => u.financing_status === 'pending' || (getUserProgress(u) >= 100 && u.financing_status !== 'approved'));
  const usersApproved = users.filter(u => u.financing_status === 'approved');

  // Aggregated Transactions Feed (Monitoring Platform Activity)
  const getMockTransactionsForUser = (userId: string) => {
    const stored = localStorage.getItem(`mockTx_${userId}`);
    return stored ? JSON.parse(stored) : [];
  };

  const allTransactions = users.flatMap(user => {
    const txs = getMockTransactionsForUser(user.user_id);
    return txs.map((tx: any) => ({
      ...tx,
      userName: user.name,
      userPhone: user.phone,
    }));
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Filtered Users List
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.phone.includes(searchQuery);
    
    if (!matchesSearch) return false;
    
    const progress = getUserProgress(user);
    
    if (activeFilter === 'pending') {
      return user.financing_status === 'pending' || (progress >= 100 && user.financing_status !== 'approved');
    }
    if (activeFilter === 'saving') {
      return !user.selected_car_id || progress < 30;
    }
    if (activeFilter === 'reached30') {
      return user.selected_car_id && progress >= 30;
    }
    if (activeFilter === 'flagged') return user.flagged;
    
    return true;
  });

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const userTransactionsWithBalance = (() => {
    const sorted = [...userTransactions].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    let bal = 0;
    return sorted.map(tx => {
      bal += (tx.type === 'deposit' ? tx.amount : -tx.amount);
      return { ...tx, runningBalance: bal };
    }).reverse();
  })();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      
      {/* Premium Header */}
      <header className="bg-slate-900 text-white px-6 py-8 sm:px-12 rounded-b-[40px] shadow-xl relative overflow-hidden">
        <div className="absolute top-[-30%] right-[-10%] w-96 h-96 rounded-full bg-[#4C158D] opacity-20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <p className="text-indigo-400 font-bold uppercase tracking-wider text-xs">CFO & Risk Control Portal</p>
            <h1 className="font-chewy text-4xl tracking-wide mt-1 text-white">Welile Cars Operations</h1>
          </div>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 bg-white/10 hover:bg-red-500/20 border border-white/10 px-5 py-2.5 rounded-xl font-bold text-sm transition-all text-white/90 hover:text-white hover:border-red-500/30"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Users list and filters (8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Metrics Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-md shadow-slate-100 flex flex-col justify-between h-28">
              <DollarSign size={20} className="text-[#4C158D]" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Savings</p>
                <p className="text-xl font-black text-slate-800">{formatUGX(totalSavings)}</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-md shadow-slate-100 flex flex-col justify-between h-28">
              <TrendingUp size={20} className="text-emerald-500" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Growth Credited</p>
                <p className="text-xl font-black text-slate-800">{formatUGX(totalGrowth)}</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-md shadow-slate-100 flex flex-col justify-between h-28">
              <Users size={20} className="text-blue-500" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Customers</p>
                <p className="text-xl font-black text-slate-800">{users.length}</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-md shadow-slate-100 flex flex-col justify-between h-28">
              <Unlock size={20} className="text-amber-500" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Needs Review</p>
                <p className="text-xl font-black text-slate-800">{usersPending.length}</p>
              </div>
            </div>
          </div>

          {/* Table / List Controls */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-md shadow-slate-100 p-6 space-y-6">
            
            {/* Search and Filters Header */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search customer by name or phone..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-11 pr-4 py-3 text-sm font-semibold outline-none focus:border-[#4C158D] focus:bg-white transition-all text-slate-800"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-slate-100 pb-4 overflow-x-auto">
              <button 
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeFilter === 'all' 
                    ? 'bg-[#4C158D] text-white shadow-md shadow-[#4C158D]/20' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                All Users ({users.length})
              </button>
              <button 
                onClick={() => setActiveFilter('pending')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeFilter === 'pending' 
                    ? 'bg-[#4C158D] text-white shadow-md shadow-[#4C158D]/20' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                Pending Review ({usersPending.length})
              </button>
              <button 
                onClick={() => setActiveFilter('saving')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeFilter === 'saving' 
                    ? 'bg-[#4C158D] text-white shadow-md shadow-[#4C158D]/20' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                Saving ({usersSaving.length})
              </button>
              <button 
                onClick={() => setActiveFilter('reached30')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeFilter === 'reached30' 
                    ? 'bg-[#4C158D] text-white shadow-md shadow-[#4C158D]/20' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                Deposited 30%+ ({usersReached30.length})
              </button>
              <button 
                onClick={() => setActiveFilter('flagged')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeFilter === 'flagged' 
                    ? 'bg-[#4C158D] text-white shadow-md shadow-[#4C158D]/20' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                Flagged Accounts
              </button>
              <button 
                onClick={() => setActiveFilter('cfo_requests')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeFilter === 'cfo_requests' 
                    ? 'bg-[#4C158D] text-white shadow-md shadow-[#4C158D]/20' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                Sent CFO Requests ({cfoRequests.length})
              </button>
            </div>

            {/* Customers List / CFO Requests */}
            <div className="space-y-4">
              {activeFilter === 'cfo_requests' ? (
                cfoRequests.map((req) => (
                  <div 
                    key={req.id} 
                    className={`bg-white rounded-2xl border p-5 flex flex-col justify-between hover:shadow-md transition-all duration-300 ${
                      req.status === 'pending' ? 'border-amber-100 bg-amber-50/10' :
                      req.status === 'approved' ? 'border-emerald-100 bg-emerald-50/10' :
                      'border-rose-100 bg-rose-50/10'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          req.type === 'financing_approval' ? 'bg-indigo-100 text-indigo-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {req.type === 'financing_approval' ? 'Financing Approval' : 'Unflag Request'}
                        </span>
                        <h4 className="font-extrabold text-slate-800 mt-2 text-sm">{req.user_name}</h4>
                        <p className="text-xs text-slate-400 font-semibold">{req.user_phone}</p>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        req.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        req.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-rose-100 text-rose-755'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mt-3 text-xs font-semibold text-slate-500">
                      {req.details}
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold mt-3 pt-3 border-t border-slate-100 flex justify-between">
                      <span>Requested: {new Date(req.requested_at).toLocaleDateString()}</span>
                      {req.resolved_at && <span>Resolved: {new Date(req.resolved_at).toLocaleDateString()}</span>}
                    </div>
                  </div>
                ))
              ) : (
                filteredUsers.map(user => {
                  const car = CARS.find(c => c.id === user.selected_car_id);
                  const progress = getUserProgress(user);
                  return (
                    <div 
                      key={user.id} 
                      onClick={() => setSelectedUser(user)}
                      className={`bg-white rounded-2xl border p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-300 cursor-pointer ${
                        user.flagged 
                          ? 'border-red-200 bg-red-50/20' 
                          : 'border-slate-100 hover:border-slate-300'
                      }`}
                    >
                      
                      {/* Customer Header */}
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-extrabold text-slate-800 text-base">{user.name}</p>
                            {user.flagged && (
                              <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                                <AlertTriangle size={10} /> Flagged
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 font-semibold mt-0.5">{user.phone}</p>
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                          user.financing_status === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          user.financing_status === 'rejected' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                          user.financing_status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                          (progress >= 100 && user.financing_status !== 'approved') ? 'bg-emerald-500 text-white border border-emerald-600 animate-pulse' :
                          'bg-slate-50 text-slate-400 border border-slate-100'
                        }`}>
                          {user.financing_status === 'approved' ? 'Approved' :
                           user.financing_status === 'rejected' ? 'CFO Rejected' :
                           user.financing_status === 'pending' ? 'CFO Pending' :
                           (progress >= 100 && user.financing_status !== 'approved') ? 'Target Reached (Ready)' :
                           'Saving'}
                        </span>
                      </div>

                      {/* Progress Bar target */}
                      {car && (
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-400">Target (30% of {car.name} {user.selected_car_condition ? `(${user.selected_car_condition})` : ''}):</span>
                            <span className="text-slate-700">{formatUGX(user.wallet_balance)} / {formatUGX((user.selected_car_price || car.price) * 0.3)} ({progress}%)</span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                progress >= 100 ? 'bg-emerald-500' : 'bg-[#4C158D]'
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Meta Details */}
                      <div className="grid grid-cols-2 gap-4 mt-4 text-xs font-semibold pt-4 border-t border-slate-100">
                        <div>
                          <span className="text-slate-400">Assigned Agent:</span>
                          <span className="text-slate-700 ml-1.5">{user.assigned_agent || 'None Assigned'}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-400">Referral Code:</span>
                          <span className="text-slate-700 ml-1.5">{user.referral_code}</span>
                        </div>
                      </div>

                      {/* Action Controls */}
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                        {(() => {
                          const activeReq = cfoRequests.find(r => r.user_id === user.user_id && r.type === 'financing_approval');
                          if (activeReq) {
                            if (activeReq.status === 'pending') {
                              return (
                                <div className="flex-1 h-9 bg-amber-50 text-amber-600 border border-amber-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
                                  <AlertTriangle size={14} className="animate-bounce" />
                                  <span>CFO Review Pending</span>
                                </div>
                              );
                            }
                            if (activeReq.status === 'rejected') {
                              return (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleRequestFinancing(user); }}
                                  className="flex-1 h-9 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                                >
                                  <X size={14} />
                                  <span>CFO Rejected (Retry)</span>
                                </button>
                              );
                            }
                          }
                          
                          if (user.financing_status === 'pending' || (progress >= 100 && user.financing_status !== 'approved')) {
                            return (
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleRequestFinancing(user); }}
                                className="flex-1 h-9 bg-[#4C158D] hover:bg-[#3f2bc2] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#4C158D]/20 flex items-center justify-center gap-1.5 animate-pulse"
                              >
                                <CheckCircle size={14} />
                                <span>Request CFO Approval</span>
                              </button>
                            );
                          }
                          return null;
                        })()}
                        
                        <button 
                          onClick={(e) => { e.stopPropagation(); flagUser.mutate({ userId: user.user_id, flagged: user.flagged }); }}
                          className={`h-9 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                            user.flagged 
                              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                              : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                        >
                          <Flag size={12} /> 
                          <span>{user.flagged ? 'Unflag' : 'Flag'}</span>
                        </button>

                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedUser(user); }}
                          className="flex-1 sm:flex-initial h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                        >
                          <Eye size={12} /> 
                          <span>View Details</span>
                        </button>
                      </div>

                    </div>
                  );
                })
              )}

              {((activeFilter === 'cfo_requests' && cfoRequests.length === 0) || (activeFilter !== 'cfo_requests' && filteredUsers.length === 0)) && (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                  <Users size={32} className="text-slate-300 mx-auto mb-3 animate-pulse" />
                  <p className="text-sm font-bold text-slate-500">No records found</p>
                  <p className="text-xs text-slate-400 mt-1">Adjust filters or search parameters</p>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Right Side: Real-time platform activity (4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-md shadow-slate-100 p-6">
            <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2 mb-6">
              <Activity size={18} className="text-[#4C158D]" />
              Platform Payments Feed
            </h3>

            <div className="flow-root">
              <div className="relative pl-6 border-l border-slate-100 space-y-6 max-h-[600px] overflow-y-auto pr-1">
                {allTransactions.map((tx: any, idx: number) => (
                  <div key={tx.id || idx} className="relative">
                    <span className="absolute -left-8 top-1 bg-emerald-500 w-4.5 h-4.5 rounded-full border-4 border-white flex items-center justify-center"></span>
                    <div className="space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-extrabold text-slate-800 text-xs">{tx.userName}</span>
                        <span className="text-[10px] font-black text-emerald-600 whitespace-nowrap">+{formatUGX(tx.amount)}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold">{tx.userPhone}</p>
                      <div className="flex justify-between items-center text-[9px] text-slate-400 pt-1">
                        <span className="capitalize bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-600">{tx.method}</span>
                        <span>{new Date(tx.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {allTransactions.length === 0 && (
                  <div className="text-center py-12 text-slate-400">
                    <History size={24} className="mx-auto text-slate-200 mb-2" />
                    <p className="text-xs font-bold">No payments detected</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Customer details modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6" onClick={() => setSelectedUser(null)}>
            <motion.div 
              initial={{ y: '100%' }} 
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full max-w-xl rounded-t-[32px] sm:rounded-[32px] p-6 max-h-[85vh] overflow-y-auto shadow-2xl relative"
              onClick={e => e.stopPropagation()}
            >
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedUser(null)}
                className="absolute top-6 right-6 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-6">
                <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center text-[#4C158D]">
                  <UserIcon size={28} />
                </div>
                <div>
                  <h2 className="font-extrabold text-xl text-slate-900">{selectedUser.name}</h2>
                  <p className="text-xs font-semibold text-slate-400">{selectedUser.phone}</p>
                </div>
              </div>

              {/* Stats overview list */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Wallet Balance</p>
                  <p className="text-lg font-black text-slate-800">{formatUGX(selectedUser.wallet_balance)}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Growth Accrued</p>
                  <p className="text-lg font-black text-slate-800">{formatUGX(selectedUser.growth_earned)}</p>
                </div>
              </div>

              {/* Details table block */}
              <div className="space-y-3.5 text-xs font-semibold border-b border-slate-100 pb-6">
                <div className="flex justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5"><Calendar size={14} /> Member Since:</span>
                  <span className="text-slate-800">{new Date(selectedUser.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5"><Car size={14} /> Selected Car:</span>
                  <span className="text-slate-800">
                    {CARS.find(c => c.id === selectedUser.selected_car_id)?.name || 'None Selected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5"><FileText size={14} /> Credit Status:</span>
                  <span className={`capitalize font-bold ${
                    selectedUser.financing_status === 'approved' ? 'text-emerald-500' :
                    selectedUser.financing_status === 'pending' ? 'text-amber-500' :
                    'text-slate-400'
                  }`}>
                    {selectedUser.financing_status === 'none' ? 'Saving' : selectedUser.financing_status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5"><Users size={14} /> Referral Code:</span>
                  <span className="text-slate-800">{selectedUser.referral_code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5"><UserCheck size={14} /> Assigned Agent:</span>
                  <span className="text-slate-800">{selectedUser.assigned_agent || 'None Assigned'}</span>
                </div>
              </div>

              {/* Assign Agent Section */}
              <div className="my-6 border-b border-slate-100 pb-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Assign Regional Agent</p>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={agentName} 
                    onChange={e => setAgentName(e.target.value)} 
                    placeholder="Enter Agent Name..."
                    className="flex-1 h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold outline-none focus:bg-white focus:border-[#4C158D] transition-colors" 
                  />
                  <button 
                    onClick={() => { assignAgent.mutate({ userId: selectedUser.user_id, agent: agentName }); setAgentName(''); }}
                    className="h-11 px-5 gradient-primary text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-md shadow-indigo-500/20"
                  >
                    <UserCheck size={14} /> 
                    <span>Assign</span>
                  </button>
                </div>
              </div>

              {/* Transaction History for Specific User */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <History size={14} /> User Ledger
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {userTransactionsWithBalance.map((tx: any, idx: number) => (
                    <div key={tx.id || idx} className="flex justify-between items-center text-xs p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <p className="capitalize font-bold text-slate-800">{tx.type} ({tx.method})</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{new Date(tx.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-emerald-600 block">+{formatUGX(tx.amount)}</span>
                        <span className="text-[10px] font-semibold text-slate-500 block mt-0.5">Bal: {formatUGX(tx.runningBalance)}</span>
                      </div>
                    </div>
                  ))}
                  {userTransactionsWithBalance.length === 0 && (
                    <p className="text-xs text-slate-400 italic text-center py-4">No transactions found for this user.</p>
                  )}
                </div>
              </div>

              <button 
                onClick={() => setSelectedUser(null)}
                className="mt-6 w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Close Profile
              </button>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CFO Request Modal */}
      <AnimatePresence>
        {requestModalOpen && requestUser && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4" onClick={() => { setRequestModalOpen(false); setRequestUser(null); }}>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => { setRequestModalOpen(false); setRequestUser(null); }}
                className="absolute top-6 right-6 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors"
              >
                <X size={20} />
              </button>

              <h3 className="text-lg font-extrabold text-slate-800 mb-2 flex items-center gap-1.5 mt-2">
                <Unlock size={18} className="text-[#4C158D]" />
                Submit CFO Approval Request
              </h3>
              <p className="text-xs text-slate-400 font-semibold mb-4">
                This request will be sent to the Chief Financial Officer for credit check and final approval.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Customer Name</label>
                  <p className="text-sm font-extrabold text-slate-800">{requestUser.name}</p>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Request Details</label>
                  <textarea 
                    value={requestDetails}
                    onChange={e => setRequestDetails(e.target.value)}
                    className="w-full h-32 px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-100 text-xs font-semibold outline-none focus:bg-white focus:border-[#4C158D] transition-colors resize-none text-slate-700 leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={async () => {
                    try {
                      await submitCfoRequest.mutateAsync({
                        userId: requestUser.user_id,
                        userName: requestUser.name,
                        userPhone: requestUser.phone,
                        type: 'financing_approval',
                        details: requestDetails
                      });
                      setRequestModalOpen(false);
                      setRequestUser(null);
                      toast.success("Approval request sent to the CFO.");
                    } catch (err: any) {
                      toast.error(err.message || "Failed to submit request.");
                    }
                  }}
                  className="flex-1 h-11 bg-[#4C158D] hover:bg-[#3f2bc2] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-500/20"
                >
                  Submit to CFO
                </button>
                <button
                  onClick={() => { setRequestModalOpen(false); setRequestUser(null); }}
                  className="h-11 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminPage;
