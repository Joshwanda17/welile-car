import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Gift, ArrowUpRight, ArrowDownLeft, 
  Download, LayoutGrid, DollarSign, Home, 
  Activity, Fingerprint, CreditCard, User, X
} from 'lucide-react';

import vitzImg from '@/assets/car-vitz.jpg';

// Initial Mock Data
const INITIAL_LOAN = 16380000;

interface Transaction {
  id: string;
  date: string;
  time: string;
  amount: number;
  type: string;
  category: string;
  icon: any;
  iconColor: string;
}

export default function LogbookPage() {
  const navigate = useNavigate();
  const [totalPaid] = useState<number>(0);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedMerchant, setSelectedMerchant] = useState<string | null>(null);
  const remainingBalance = INITIAL_LOAN - totalPaid;

  const formatCurrency = (num: number) => {
    return 'Shs ' + new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(num));
  };

  const transactions: Transaction[] = [
    { id: '1', date: 'Today', time: '10:00 AM', amount: -45000, type: 'Daily Installment', category: 'Auto-deduct', icon: ArrowUpRight, iconColor: 'text-[#ff4e6b]' },
    { id: '2', date: 'Yesterday', time: '4:15 PM', amount: 150000, type: 'Wallet Top up', category: 'Deposit', icon: DollarSign, iconColor: 'text-[#3bcfdb]' },
    { id: '3', date: 'Yesterday', time: '10:00 AM', amount: -45000, type: 'Daily Installment', category: 'Auto-deduct', icon: ArrowUpRight, iconColor: 'text-[#ff4e6b]' },
    { id: '4', date: 'Jan 12', time: '9:30 AM', amount: -4914000, type: 'Downpayment (30%)', category: 'Initial Payment', icon: ArrowUpRight, iconColor: 'text-[#ff4e6b]' },
  ];

  return (
    <div className="min-h-screen bg-slate-200 flex justify-center selection:bg-[#4c35e6]/20 font-sans sm:py-8">
      
      {/* Mobile Device Simulator Container */}
      <main className="w-full max-w-[400px] bg-white min-h-screen sm:min-h-[850px] relative sm:rounded-[40px] shadow-2xl sm:border-[8px] sm:border-slate-800 overflow-hidden flex flex-col">
        
        {/* Content Area (scrollable) */}
        <div className="flex-1 overflow-y-auto pb-32 px-6 pt-12 scrollbar-hide">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-[22px] font-extrabold text-slate-900 tracking-tight leading-tight">Hi, John!</h1>
              <p className="text-[13px] text-slate-400 font-medium">How are you today?</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full border border-emerald-100 shadow-sm">
                <Gift size={14} />
                <span className="text-xs font-bold">Reward</span>
              </div>
              <div className="relative cursor-pointer">
                <Bell size={24} className="text-slate-800" />
                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
              </div>
            </div>
          </div>

          {/* Active Vehicle Pill */}
          <div className="bg-[#f4f5f9] p-2 pr-5 rounded-2xl border border-slate-100 flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center p-1.5 shrink-0">
              <img src={vitzImg} alt="Toyota Vitz" className="w-full h-full object-contain mix-blend-multiply" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Active Vehicle</p>
              <p className="font-extrabold text-slate-800 text-[13px] tracking-tight">Toyota Vitz (UBM 492X)</p>
            </div>
          </div>

          {/* Main Balance Card with Cutout Design */}
          <div className="relative mb-8 mt-2">
            {/* Main Purple Card */}
            <div className="bg-[#310c87] text-white p-6 rounded-[32px] shadow-lg relative overflow-hidden z-10 h-[200px]">
              <p className="text-[11px] text-white/60 font-bold uppercase tracking-wider mb-1">Remaining Balance</p>
              <p className="text-3xl font-bold tracking-tight mb-10">{formatCurrency(remainingBalance)}</p>
              
              {/* Decorative Intersecting Circles */}
              <div className="absolute top-6 right-6 opacity-40 flex items-center">
                <div className="w-5 h-5 rounded-full border-[1.5px] border-white"></div>
                <div className="w-5 h-5 rounded-full border-[1.5px] border-white -ml-2"></div>
              </div>
            </div>

          </div>

          {/* Quick Actions Grid */}
          <div className="flex justify-center gap-12 mb-10">
            <div onClick={() => setActiveModal('deposit')} className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-700 group-hover:bg-[#310c87] group-hover:text-white transition-all shadow-sm">
                <ArrowDownLeft size={24} strokeWidth={2.5} />
              </div>
              <span className="text-[12px] font-bold text-slate-400 group-hover:text-slate-700">Deposit</span>
            </div>
            <div onClick={() => setActiveModal('withdraw')} className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-700 group-hover:bg-[#310c87] group-hover:text-white transition-all shadow-sm">
                <Download size={24} strokeWidth={2.5} />
              </div>
              <span className="text-[12px] font-bold text-slate-400 group-hover:text-slate-700">Withdraw</span>
            </div>
          </div>

          {/* Transactions Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[17px] font-extrabold text-slate-900 tracking-tight">Transactions</h3>
            <button className="text-[13px] font-bold text-[#310c87]">See All</button>
          </div>

          {/* Transactions List */}
          <div className="space-y-3">
            {transactions.map((txn, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={txn.id}
                className="flex items-center justify-between p-4 bg-[#f4f5f9] rounded-[20px] cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-white rounded-[14px] flex items-center justify-center shadow-sm">
                    <txn.icon size={20} className={txn.iconColor} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-[14px] mb-0.5 tracking-tight">{txn.type}</p>
                    <p className="text-[11px] font-medium text-slate-400">{txn.date} {txn.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-[14px] mb-0.5 tracking-tight text-slate-900`}>
                    {txn.amount > 0 ? '+' : '-'}{formatCurrency(txn.amount)}
                  </p>
                  <p className="text-[11px] font-medium text-slate-400">{txn.category}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

        {/* Modals */}
        <AnimatePresence>
          {activeModal && (
            <>
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => { setActiveModal(null); setSelectedMerchant(null); }}
                className="absolute inset-0 bg-slate-900/40 z-[60]"
              />
              {/* Bottom Sheet */}
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] p-6 z-[70] shadow-2xl flex flex-col"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight capitalize">{activeModal}</h3>
                  <button onClick={() => { setActiveModal(null); setSelectedMerchant(null); }} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
                    <X size={18} />
                  </button>
                </div>
                
                <div className="pb-8">
                  {activeModal === 'deposit' && (
                    <div className="space-y-4 text-sm text-slate-600">
                      {!selectedMerchant ? (
                        <>
                          <p>To deposit funds into your Welile wallet, use the merchant codes below:</p>
                          <div className="space-y-3">
                            <div onClick={() => setSelectedMerchant('MTN')} className="bg-[#ffcc00]/10 border border-[#ffcc00]/20 p-4 rounded-xl flex justify-between items-center cursor-pointer hover:bg-[#ffcc00]/20 transition-colors">
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">MTN Merchant Code</p>
                                <p className="font-extrabold text-slate-900 text-[18px] tracking-tight">090777</p>
                              </div>
                              <button className="text-[#310c87] font-bold text-[12px] bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100 pointer-events-none">Select</button>
                            </div>
                            <div onClick={() => setSelectedMerchant('Airtel')} className="bg-[#ff0000]/5 border border-[#ff0000]/10 p-4 rounded-xl flex justify-between items-center cursor-pointer hover:bg-[#ff0000]/10 transition-colors">
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Airtel Merchant Code</p>
                                <p className="font-extrabold text-slate-900 text-[18px] tracking-tight">4380664</p>
                              </div>
                              <button className="text-[#310c87] font-bold text-[12px] bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100 pointer-events-none">Select</button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                          <div className="flex items-center gap-3 mb-2">
                            <button onClick={() => setSelectedMerchant(null)} className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 transition-colors shrink-0">
                              <ArrowDownLeft size={16} className="rotate-45" />
                            </button>
                            <h4 className="font-bold text-slate-900">Verify {selectedMerchant} Deposit</h4>
                          </div>
                          <p>Enter the details from your mobile money confirmation message.</p>
                          <input type="tel" placeholder="Phone Number used" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#310c87] transition-colors" />
                          <input type="text" placeholder="Transaction ID (e.g. 1234567890)" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#310c87] transition-colors" />
                          <button onClick={() => { setActiveModal(null); setSelectedMerchant(null); }} className="w-full bg-[#310c87] text-white font-bold py-3.5 rounded-xl hover:bg-[#20075c] transition-colors mt-2">Verify Deposit</button>
                        </motion.div>
                      )}
                    </div>
                  )}
                  {activeModal === 'receive' && (
                    <div className="space-y-4 text-center">
                      <div className="w-32 h-32 mx-auto bg-slate-100 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center text-slate-400 mb-2">
                        [ QR Code ]
                      </div>
                      <p className="text-sm text-slate-600">Show this code to receive funds instantly.</p>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center text-sm font-bold text-slate-800">
                        <span>Wallet ID: 893-492-11</span>
                        <button className="text-[#310c87] text-xs">Copy</button>
                      </div>
                    </div>
                  )}
                  {activeModal === 'withdraw' && (
                    <div className="space-y-4 text-sm text-slate-600">
                      <p>Withdraw funds to your linked bank or mobile money account.</p>
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#310c87] transition-colors appearance-none">
                        <option>MTN Mobile Money (**** 1423)</option>
                        <option>Airtel Money (**** 9901)</option>
                        <option>Stanbic Bank (**** 0988)</option>
                      </select>
                      <input type="number" placeholder="Amount (Shs)" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#310c87] transition-colors" />
                      <button onClick={() => setActiveModal(null)} className="w-full bg-[#310c87] text-white font-bold py-3.5 rounded-xl hover:bg-[#20075c] transition-colors mt-2">Withdraw</button>
                    </div>
                  )}
                  {activeModal === 'more' && (
                    <div className="space-y-2">
                      <button onClick={() => setActiveModal(null)} className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-sm font-bold text-slate-800">
                        <span>Account Statement</span>
                        <ArrowUpRight size={16} className="text-slate-400" />
                      </button>
                      <button onClick={() => setActiveModal(null)} className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-sm font-bold text-slate-800">
                        <span>Linked Accounts</span>
                        <ArrowUpRight size={16} className="text-slate-400" />
                      </button>
                      <button onClick={() => setActiveModal(null)} className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-sm font-bold text-slate-800">
                        <span>Support & Help</span>
                        <ArrowUpRight size={16} className="text-slate-400" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Bottom Navigation Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-50 pt-3 pb-8 px-8 flex justify-center items-center z-50">
          <button onClick={() => navigate('/vehicles')} className="flex flex-col items-center gap-1.5 text-slate-900 hover:text-[#310c87] transition-colors">
            <Home size={28} className="stroke-[2.5px]" />
            <span className="text-[12px] font-bold">Home</span>
          </button>
        </div>

      </main>
    </div>
  );
}
