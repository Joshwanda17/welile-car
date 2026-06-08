import { PlayCircle, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import harrierImg from '@/assets/harrier-white.png';

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

      {/* How It Works Section */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">How It Works</h2>
            <p className="text-lg text-slate-500 font-medium">Your journey to vehicle ownership in 5 simple steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              { step: 1, title: 'Save Deposit', desc: 'Start by saving towards your 30% deposit target.' },
              { step: 2, title: 'Earn 5% Growth', desc: 'Watch your savings compound with a 5% bonus.' },
              { step: 3, title: 'Get Approved', desc: 'We verify your details and approve your financing.' },
              { step: 4, title: 'Receive Vehicle', desc: 'Drive away in your new vehicle!' },
              { step: 5, title: 'Repay Monthly', desc: 'Pay off the remaining 70% in flexible installments.' },
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm text-center border border-slate-100 hover:-translate-y-1 transition-transform"
              >
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xl font-black mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle Showcase Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Featured Vehicles</h2>
              <p className="text-lg text-slate-500 font-medium">Explore our top picks for personal and commercial use.</p>
            </div>
            <button 
              onClick={() => navigate('/vehicles')}
              className="hidden md:flex items-center gap-2 text-purple-600 font-bold hover:text-purple-700"
            >
              View All Vehicles <ChevronRight size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Toyota Harrier', type: 'Luxury SUV', price: '85M UGX', image: harrierImg },
              { name: 'Toyota Premio', type: 'Premium Sedan', price: '28M UGX', image: '/car-premio.jpg' },
              { name: 'Toyota Vitz', type: 'Compact / Ride-Hailing', price: '18M UGX', image: '/car-vitz.jpg' },
            ].map((car, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-slate-50 rounded-[28px] p-6 border border-slate-100 hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => navigate('/vehicles')}
              >
                <div className="h-40 flex items-center justify-center mb-6">
                  {car.name === 'Toyota Harrier' ? (
                    <img src={car.image} alt={car.name} className="max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 font-bold">
                      {car.name}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{car.name}</h3>
                  <p className="text-sm text-slate-500 font-medium mb-3">{car.type}</p>
                  <p className="text-lg font-black text-purple-600">{car.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-purple-600 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Why Choose Welile Finance?</h2>
            <ul className="space-y-6">
              {[
                { title: 'Flexible Financing', desc: 'Tailored repayment plans that fit your income.' },
                { title: 'Low Deposit Requirement', desc: 'Start with small, manageable savings goals.' },
                { title: 'Fast Approvals', desc: 'Get your vehicle faster with our quick KYC process.' },
                { title: 'Built-in Vehicle Tracking', desc: 'GPS tracking included for peace of mind.' },
              ].map((benefit, idx) => (
                <li key={idx} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">{benefit.title}</h4>
                    <p className="text-purple-100">{benefit.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-[32px] p-8 text-slate-900 shadow-2xl">
            <h3 className="text-2xl font-black mb-6">See how affordable it is</h3>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-slate-100 pb-4">
                <span className="font-bold text-slate-500">Vehicle Price</span>
                <span className="font-black">50,000,000 UGX</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-4">
                <span className="font-bold text-slate-500">Your Target Deposit</span>
                <span className="font-black text-emerald-600">15,000,000 UGX</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-4">
                <span className="font-bold text-slate-500">Welile Finances</span>
                <span className="font-black text-purple-600">35,000,000 UGX</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="font-bold text-slate-900">Estimated Monthly</span>
                <span className="font-black text-2xl">~ 1,200,000 UGX</span>
              </div>
            </div>
            <button 
              onClick={() => navigate('/auth')}
              className="w-full mt-8 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-colors"
            >
              Start Saving Now
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: 'How does the 5% compounding work?', a: 'Every time you make a deposit towards your target, we add a 5% bonus to that specific deposit, helping you reach your vehicle goal faster.' },
              { q: 'What happens if I miss a payment?', a: 'We offer flexible terms, but missing multiple payments without contacting support may affect your financing agreement and risk level.' },
              { q: 'Can I choose any car?', a: 'Yes! You can choose from our featured marketplace or request financing for a specific vehicle of your choice.' },
            ].map((faq, idx) => (
              <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="text-lg font-bold text-slate-900 mb-2">{faq.q}</h4>
                <p className="text-slate-500 font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-12 text-sm font-medium mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white text-lg font-black mb-4">Welile Cars</h4>
            <p>Start small. Own your car.</p>
          </div>
          <div>
            <h4 className="text-white text-lg font-black mb-4">Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-lg font-black mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 text-center">
          © 2026 Welile Cars. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
