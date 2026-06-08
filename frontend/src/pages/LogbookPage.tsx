import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, TrendingDown, History, CheckCircle2, ChevronRight, CreditCard, Banknote } from 'lucide-react';

import vitzImg from '@/assets/car-vitz.jpg';

// Initial Mock Data based on the Toyota Vitz 18M UGX financing
const INITIAL_LOAN = 16380000;
const DAILY_RATE = Math.round(INITIAL_LOAN / 365);
const WEEKLY_RATE = Math.round(INITIAL_LOAN / 52);
const MONTHLY_RATE = Math.round(INITIAL_LOAN / 12);

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: string;
  status: 'Completed' | 'Pending';
  balanceAfter: number;
}

export default function LogbookPage() {
  const [totalPaid, setTotalPaid] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentModal, setPaymentModal] = useState<{isOpen: boolean, amount: number, type: string} | null>(null);
  const [processing, setProcessing] = useState(false);
  const [merchantCode, setMerchantCode] = useState('');
  const [merchantProvider, setMerchantProvider] = useState<string | null>(null);
  const [pinCode, setPinCode] = useState('');
  const [modalStep, setModalStep] = useState(1);

  const remainingBalance = INITIAL_LOAN - totalPaid;
  const progressPercent = Math.min(100, Math.max(0, (totalPaid / INITIAL_LOAN) * 100));

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const openPaymentModal = (amount: number, type: string) => {
    if (remainingBalance <= 0) return;
    setMerchantCode('');
    setMerchantProvider(null);
    setPinCode('');
    setModalStep(1);
    setPaymentModal({ isOpen: true, amount: Math.min(amount, remainingBalance), type });
  };

  const processPayment = (method: string) => {
    if (!paymentModal) return;
    setProcessing(true);
    
    // Simulate network delay for funding the wallet
    setTimeout(() => {
      const paymentAmount = paymentModal.amount;
      const newTotalPaid = totalPaid + paymentAmount;
      const newBalance = INITIAL_LOAN - newTotalPaid;
      
      setTotalPaid(newTotalPaid);
      
      const newTxn: Transaction = {
        id: `TXN-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        date: new Date().toLocaleDateString(),
        amount: paymentAmount,
        type: method === 'Merchant Code' ? `${merchantProvider} Merchant (${merchantCode.toUpperCase()})` : paymentModal.type,
        status: 'Completed',
        balanceAfter: newBalance
      };
      
      setTransactions(prev => [newTxn, ...prev]);
      setProcessing(false);
      setModalStep(4);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#4c35e6]/20 flex flex-col pb-24">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12 flex-grow w-full">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">My Wallet</h1>
            <p className="text-slate-500 font-medium mt-2">Track your active vehicle loan and payments.</p>
          </div>
          
          <div className="bg-white p-3 pr-6 rounded-full border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center p-2">
              <img src={vitzImg} alt="Toyota Vitz" className="w-full h-full object-contain mix-blend-multiply" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Vehicle</p>
              <p className="font-bold text-slate-800 text-sm">Toyota Vitz (UBM 492X)</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Dashboard Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Balance Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-[#4c35e6] rounded-[32px] p-8 text-white shadow-xl shadow-[#4c35e6]/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                
                <p className="text-sm font-bold uppercase tracking-wider text-white/80 mb-2">Remaining Balance</p>
                <p className="text-4xl font-black mb-8">{formatCurrency(remainingBalance)}</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-white/70">Loan Progress</span>
                    <span>{progressPercent.toFixed(1)}% Paid</span>
                  </div>
                  <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-white rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-[32px] p-8 border border-slate-100 flex flex-col justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Total Financed</p>
                  <p className="text-3xl font-black text-slate-800 mb-6">{formatCurrency(INITIAL_LOAN)}</p>
                </div>
                
                <div className="flex justify-between items-end border-t border-slate-100 pt-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Total Paid</p>
                    <p className="text-xl font-bold text-emerald-500">{formatCurrency(totalPaid)}</p>
                  </div>
                  <TrendingDown className="text-emerald-500 opacity-20" size={48} />
                </div>
              </div>
            </div>

            {/* Payment Schedule breakdown */}
            <div className="bg-white rounded-[32px] border border-slate-100 p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Payment Schedule</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 mb-4">
                    <Banknote size={20} />
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Daily Due</p>
                  <p className="text-xl font-black text-slate-800">{formatCurrency(DAILY_RATE)}</p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 mb-4">
                    <Banknote size={20} />
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Weekly Due</p>
                  <p className="text-xl font-black text-slate-800">{formatCurrency(WEEKLY_RATE)}</p>
                </div>

                <div className="bg-[#4c35e6]/5 rounded-2xl p-6 border border-[#4c35e6]/20">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#4c35e6] mb-4">
                    <Banknote size={20} />
                  </div>
                  <p className="text-xs font-bold text-[#4c35e6] uppercase tracking-wider mb-1">Monthly Due</p>
                  <p className="text-xl font-black text-slate-800">{formatCurrency(MONTHLY_RATE)}</p>
                </div>

              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-[32px] border border-slate-100 p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <History size={20} className="text-slate-400" />
                  Payment History
                </h3>
                <button className="text-sm font-bold text-[#4c35e6] hover:underline">View All</button>
              </div>

              <div className="space-y-4">
                {transactions.map((txn, index) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={txn.id} 
                    className="flex justify-between items-center p-4 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                        <CheckCircle2 size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{txn.type}</p>
                        <p className="text-xs font-medium text-slate-400">{txn.date} • {txn.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600">+{formatCurrency(txn.amount)}</p>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">Bal: {formatCurrency(txn.balanceAfter)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar / Payment Simulator Column */}
          <div className="space-y-6">
            
            <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl">
              <h3 className="text-xl font-bold mb-2">Make a Payment</h3>
              <p className="text-sm text-slate-400 mb-8">Simulate paying your loan to watch your balance update in real-time.</p>
              
              <div className="space-y-4">
                <button 
                  onClick={() => openPaymentModal(DAILY_RATE, 'Daily Installment')}
                  className="w-full bg-white/10 hover:bg-white/20 border border-white/10 p-4 rounded-2xl flex justify-between items-center transition-colors"
                >
                  <div className="text-left">
                    <p className="font-bold">Pay Daily Amount</p>
                    <p className="text-xs text-slate-400">{formatCurrency(DAILY_RATE)}</p>
                  </div>
                  <ChevronRight size={20} className="text-slate-400" />
                </button>

                <button 
                  onClick={() => openPaymentModal(WEEKLY_RATE, 'Weekly Installment')}
                  className="w-full bg-white/10 hover:bg-white/20 border border-white/10 p-4 rounded-2xl flex justify-between items-center transition-colors"
                >
                  <div className="text-left">
                    <p className="font-bold">Pay Weekly Amount</p>
                    <p className="text-xs text-slate-400">{formatCurrency(WEEKLY_RATE)}</p>
                  </div>
                  <ChevronRight size={20} className="text-slate-400" />
                </button>

                <button 
                  onClick={() => openPaymentModal(MONTHLY_RATE, 'Monthly Installment')}
                  className="w-full bg-[#4c35e6] hover:bg-[#3f2bc2] p-4 rounded-2xl flex justify-between items-center transition-colors shadow-lg shadow-[#4c35e6]/20"
                >
                  <div className="text-left">
                    <p className="font-bold">Pay Monthly Amount</p>
                    <p className="text-xs text-white/70">{formatCurrency(MONTHLY_RATE)}</p>
                  </div>
                  <CreditCard size={20} className="text-white" />
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-xs text-slate-500 text-center">Powered by Welile Secure Pay</p>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
              <p className="text-sm font-bold text-orange-800 mb-2">Next Payment Due</p>
              <p className="text-2xl font-black text-orange-900 mb-1">Tomorrow</p>
              <p className="text-xs text-orange-700">Please ensure your mobile money wallet is funded to avoid late penalties.</p>
            </div>

          </div>

        </div>
      </main>

      {/* Payment Source Modal */}
      <AnimatePresence>
        {paymentModal?.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => !processing && setPaymentModal(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden p-8"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#4c35e6]/10 text-[#4c35e6] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wallet size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Fund Welile Wallet</h3>
                <p className="text-slate-500 font-medium mt-2">Enter the Merchant Code provided by your local Welile agent to pay <span className="font-bold text-slate-900">{formatCurrency(paymentModal.amount)}</span>.</p>
              </div>

              {processing ? (
                <div className="py-12 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 border-4 border-slate-200 border-t-[#4c35e6] rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-600 font-bold">Verifying code & processing...</p>
                </div>
              ) : modalStep === 1 ? (
                <div className="space-y-3">
                  <p className="text-sm font-bold text-slate-700 mb-4 text-center">Select your Merchant Provider:</p>
                  
                  <button onClick={() => { setMerchantProvider('MTN'); setModalStep(2); }} className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-slate-100 hover:border-[#ffcc00] hover:bg-[#ffcc00]/5 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#ffcc00] rounded-full flex items-center justify-center font-black text-slate-900">M</div>
                      <span className="font-bold text-slate-900">MTN Merchant</span>
                    </div>
                    <ChevronRight className="text-slate-400 group-hover:text-[#ffcc00]" />
                  </button>

                  <button onClick={() => { setMerchantProvider('Airtel'); setModalStep(2); }} className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-slate-100 hover:border-red-500 hover:bg-red-50 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center font-black text-white">A</div>
                      <span className="font-bold text-slate-900">Airtel Merchant</span>
                    </div>
                    <ChevronRight className="text-slate-400 group-hover:text-red-500" />
                  </button>

                  <button onClick={() => { setMerchantProvider('Equity Bank'); setModalStep(2); }} className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-slate-100 hover:border-[#a32a29] hover:bg-[#a32a29]/5 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#a32a29] rounded-full flex items-center justify-center font-black text-white">E</div>
                      <span className="font-bold text-slate-900">Equity Bank Merchant</span>
                    </div>
                    <ChevronRight className="text-slate-400 group-hover:text-[#a32a29]" />
                  </button>
                </div>
              ) : modalStep === 2 ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{merchantProvider} Merchant Code</label>
                    <input 
                      type="text" 
                      value={merchantCode}
                      onChange={(e) => setMerchantCode(e.target.value)}
                      placeholder={`e.g. ${merchantProvider === 'MTN' ? 'M-4920' : merchantProvider === 'Airtel' ? 'A-4920' : 'EQ-4920'}`}
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:border-[#4c35e6] focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setModalStep(1)}
                      className="px-4 py-4 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      Back
                    </button>
                    <button 
                      onClick={() => setModalStep(3)} 
                      disabled={!merchantCode.trim()}
                      className="flex-1 bg-[#4c35e6] hover:bg-[#3f2bc2] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors shadow-lg"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              ) : modalStep === 3 ? (
                <div className="space-y-4 text-center">
                  <p className="text-sm font-bold text-slate-700 mb-2">Enter your 4-digit PIN to confirm</p>
                  <div className="flex justify-center">
                    <input 
                      type="password" 
                      maxLength={4}
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••"
                      className="w-32 text-center tracking-[0.5em] bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-2xl font-black text-slate-900 focus:outline-none focus:border-[#4c35e6] focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button 
                      onClick={() => setModalStep(2)}
                      className="px-4 py-4 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      Back
                    </button>
                    <button 
                      onClick={() => processPayment('Merchant Code')} 
                      disabled={pinCode.length !== 4}
                      className="flex-1 bg-[#4c35e6] hover:bg-[#3f2bc2] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors shadow-lg"
                    >
                      Confirm Payment
                    </button>
                  </div>
                </div>
              ) : modalStep === 4 ? (
                <div className="space-y-4 text-center py-6">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 size={40} />
                  </motion.div>
                  <h3 className="text-2xl font-black text-slate-900">Thank You!</h3>
                  <p className="text-slate-600 font-medium">
                    <span className="font-bold text-emerald-600">{formatCurrency(paymentModal.amount)}</span> has been successfully sent to your Welile Wallet.
                  </p>
                  <button 
                    onClick={() => setPaymentModal(null)}
                    className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-colors shadow-lg"
                  >
                    Done
                  </button>
                </div>
              ) : null}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
