import { PlayCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';


export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-purple-500/20 flex flex-col">

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-20 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-8 text-center lg:text-left z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight"
          >
            Your Journey <br/> Starts Here.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-xl md:text-2xl font-bold text-purple-600 tracking-tight"
          >
            Own your dream car with welile - the smarter way to save!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-lg mx-auto lg:mx-0 space-y-6"
          >
            <p className="text-lg text-slate-500 leading-relaxed font-medium">
              Save up to 30% through flexible daily or weekly installments. Once you hit the target, we finance the remaining 70%. Drive your dream car today.
            </p>

            <div className="bg-purple-50/50 border border-purple-200 p-6 rounded-2xl text-left shadow-sm">
              <p className="text-lg font-black text-purple-600 flex items-center gap-3 mb-2">
                <span className="w-3 h-3 rounded-full bg-purple-600"></span>
                5% Compounding Installment Bonus!
              </p>
              <p className="text-base text-slate-600 font-medium leading-relaxed pl-6">
                Every savings installment you pay compounds by 5% until the 30% target is completed, helping you reach your target faster.
              </p>
            </div>
          </motion.div>

        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex-1 relative w-full flex justify-end"
        >
          <img 
            src="/FLYER.jpeg" 
            alt="Welile Flyer" 
            className="w-full h-auto object-contain max-w-2xl drop-shadow-2xl translate-x-4 rounded-2xl" 
          />
        </motion.div>
      </main>

      <div className="flex justify-center pb-12 mt-4">
        <button 
          onClick={() => navigate('/benefits')}
          className="flex items-center gap-2 px-10 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold transition-all shadow-lg shadow-purple-600/30"
        >
          Get Started Now
        </button>
      </div>

      <footer className="border-t border-slate-100 py-8 text-center text-sm font-medium text-slate-400 mt-auto">
        © 2026 Welile Cars. All rights reserved.
      </footer>
    </div>
  );
}
