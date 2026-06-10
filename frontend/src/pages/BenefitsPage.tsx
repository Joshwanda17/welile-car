import { Wallet, BadgePercent, ShieldCheck, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BenefitsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500/20">

      <main className="max-w-7xl mx-auto px-6 py-16 flex-grow flex flex-col justify-center">
        <div className="text-center mb-16">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight max-w-2xl mx-auto leading-tight text-primary">
            Why choose Welile Cars?
          </h1>
          <p className="text-slate-500 mt-4 text-sm sm:text-base">Discover why thousands choose Welile Cars.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary bg-primary/10/50">
              <Wallet size={28} />
            </div>
            <h3 className="text-2xl font-bold">Flexible Saving</h3>
            <p className="text-slate-500 leading-relaxed font-medium">
              Save dynamically on a Daily, Weekly, or Monthly basis. Adjust the amount on the fly as your cashflow dictates.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary bg-primary/10/50">
              <BadgePercent size={28} />
            </div>
            <h3 className="text-2xl font-bold">30/70 Co-Financing</h3>
            <p className="text-slate-500 leading-relaxed font-medium">
              Save the initial 30% and we pay the full remaining 70% upfront, applying a flat interest rate solely on our portion.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary bg-primary/10/50">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-2xl font-bold">Full Ownership</h3>
            <p className="text-slate-500 leading-relaxed font-medium">
              No complex legal loopholes. Once the remaining loan portion is amortized, the logbook is fully handed over to you.
            </p>
          </div>
        </div>
      </main>

      <div className="flex justify-center pb-12 mt-4">
        <button 
          onClick={() => navigate('/auth')}
          className="flex items-center gap-2 px-10 py-4 bg-primary hover:bg-primary text-white rounded-full font-bold transition-all shadow-lg shadow-primary/30"
        >
          Next
          <ChevronRight size={20} />
        </button>
      </div>

      <footer className="border-t border-slate-100 py-8 text-center text-sm font-medium text-slate-400 mt-auto">
        © 2026 Welile Cars. All rights reserved.
      </footer>
    </div>
  );
}
