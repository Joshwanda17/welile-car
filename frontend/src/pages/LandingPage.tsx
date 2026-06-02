import { PlayCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import harrierImg from '@/assets/harrier-white.png';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-purple-500/20 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-20 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-8 text-center lg:text-left z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05]"
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

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-slate-500 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium"
          >
            Save up to 30% through flexible daily or weekly installments. Once you hit the target, we finance the remaining 70%. Drive your dream car today.
          </motion.p>

        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex-1 relative w-full flex justify-end"
        >
          <img 
            src={harrierImg} 
            alt="Toyota Harrier" 
            className="w-full h-auto object-contain max-w-2xl drop-shadow-2xl translate-x-4 mix-blend-multiply" 
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
