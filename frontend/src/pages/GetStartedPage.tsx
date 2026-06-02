import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car as CarIcon, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Wallet, 
  Clock, 
  BadgePercent,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  UserCheck,
  Lock,
  Calendar,
  AlertCircle,
  Users,
  Briefcase,
  Check,
  Info,
  HelpCircle,
  Shuffle
} from 'lucide-react';

// Import images
import vitzImg from '@/assets/car-vitz.jpg';
import premioImg from '@/assets/car-premio.jpg';
import wishImg from '@/assets/car-wish.jpg';

interface CarModel {
  id: string;
  name: string;
  type: string;
  priceUgx: number;
  image: string;
  specs: {
    engine: string;
    fuel: string;
    seats: number;
  };
}

const CARS: CarModel[] = [
  {
    id: 'vitz',
    name: 'Toyota Vitz',
    type: 'Hatchback (Perfect for Ride-Hailing)',
    priceUgx: 18000000,
    image: vitzImg,
    specs: { engine: '1.3L VVT-i', fuel: '20 km/L', seats: 5 }
  },
  {
    id: 'wish',
    name: 'Toyota Wish',
    type: 'MPV (Ideal for Business & Cargo)',
    priceUgx: 25000000,
    image: wishImg,
    specs: { engine: '1.8L Valvematic', fuel: '14 km/L', seats: 7 }
  },
  {
    id: 'premio',
    name: 'Toyota Premio',
    type: 'Sedan (Premium Personal Vehicle)',
    priceUgx: 28000000,
    image: premioImg,
    specs: { engine: '1.8L D4-D', fuel: '16 km/L', seats: 5 }
  }
];

export default function GetStartedPage() {
  const navigate = useNavigate();
  const [selectedCar, setSelectedCar] = useState<CarModel>(CARS[0]);
  
  // Savings Configuration
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [savingAmount, setSavingAmount] = useState<number>(150000); // Default weekly saving

  // Auth/Sign-In Overlay State
  const [showAuthSection, setShowAuthSection] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [lockedPlan, setLockedPlan] = useState(false);

  // Dynamic Business Model Calculations
  const deposit30 = Math.round(selectedCar.priceUgx * 0.3);
  const platform70 = Math.round(selectedCar.priceUgx * 0.7);
  
  // 30% Interest on the 70% portion financed by company
  const financeInterest = Math.round(platform70 * 0.3);
  const totalAmountToAmortize = platform70 + financeInterest;

  // 20% penalty fee on missed installment
  const penaltyFee = Math.round(savingAmount * 0.2);

  // Time calculations to reach the 30% target saving
  const totalPeriodsToReach30 = Math.ceil(deposit30 / savingAmount);
  
  let timeTo30Text = '';
  if (frequency === 'daily') {
    const months = (totalPeriodsToReach30 / 30).toFixed(1);
    timeTo30Text = `${totalPeriodsToReach30} Days (~${months} Months)`;
  } else if (frequency === 'weekly') {
    const months = (totalPeriodsToReach30 / 4.3).toFixed(1);
    timeTo30Text = `${totalPeriodsToReach30} Weeks (~${months} Months)`;
  } else {
    timeTo30Text = `${totalPeriodsToReach30} Months`;
  }

  // Adjust sliders limits based on frequency
  const getMinMaxSavings = () => {
    if (frequency === 'daily') return { min: 20000, max: 100000, step: 5000, default: 30000 };
    if (frequency === 'weekly') return { min: 100000, max: 500000, step: 10000, default: 150000 };
    return { min: 400000, max: 2000000, step: 50000, default: 600000 };
  };

  const handleFrequencyChange = (freq: 'daily' | 'weekly' | 'monthly') => {
    setFrequency(freq);
    const limits = freq === 'daily' ? { def: 30000 } : freq === 'weekly' ? { def: 150000 } : { def: 600000 };
    setSavingAmount(limits.def);
  };

  const handleCarSelect = (car: CarModel) => {
    if (lockedPlan) return;
    setSelectedCar(car);
  };

  const handleLockPlan = () => {
    setLockedPlan(true);
    // Smooth scroll to Auth Panel
    const element = document.getElementById('auth-portal-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      setShowAuthSection(true);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden font-sans selection:bg-primary/20">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-primary/8 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <CarIcon className="text-primary-foreground" size={20} />
          </div>
          <span className="text-xl font-bold font-heading tracking-tight">Welile Cars</span>
        </div>
        <a 
          href="#auth-portal-section"
          className="text-sm font-semibold hover:text-primary transition flex items-center gap-2 py-2.5 px-5 rounded-xl hover:bg-secondary/50"
        >
          <span>Sign In</span>
          <UserCheck size={16} />
        </a>
      </header>

      {/* Hero & Interactive Target Calculator */}
      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left: Main Pitch & Business Overview */}
        <section className="lg:col-span-6 space-y-8">
          
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 border border-primary/10 backdrop-blur-sm shadow-sm"
          >
            <Sparkles className="text-primary animate-pulse" size={14} />
            <span className="text-xs font-extrabold text-secondary-foreground tracking-wider uppercase">Structured Path to Ownership</span>
          </motion.div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-heading leading-[1.1] tracking-tight">
              Save 30%.<br />
              <span className="text-gradient">We Finance 70%.</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
              An affordable vehicle ownership solution in Uganda. Save at your own pace—daily, weekly, or monthly. Once you hit your 30% target, we finance the rest and hand over the keys.
            </p>
          </div>

          {/* Quick Target Audience Badges */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tailored for:</h4>
            <div className="flex flex-wrap gap-2.5">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border/80 text-xs font-semibold">
                <Users size={14} className="text-primary" /> Ride-Hailing Drivers (Uber/Bolt)
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border/80 text-xs font-semibold">
                <Briefcase size={14} className="text-primary" /> Business Owners (Transport)
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border/80 text-xs font-semibold">
                <UserCheck size={14} className="text-primary" /> Individuals (Personal Vehicles)
              </span>
            </div>
          </div>

          {/* Stepper overview of the 30/70 model */}
          <div className="bg-secondary/20 border border-secondary/50 rounded-2xl p-5 space-y-4">
            <h3 className="font-extrabold text-sm uppercase text-secondary-foreground tracking-wider">How the co-financing works:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-black flex items-center justify-center">1</span>
                  <span className="font-bold text-xs">Reach 30% Target</span>
                </div>
                <p className="text-[11px] text-muted-foreground pl-7">Save via customized flexible frequency until you secure the 30% deposit.</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center">2</span>
                  <span className="font-bold text-xs">Drive Off & 70% Cover</span>
                </div>
                <p className="text-[11px] text-muted-foreground pl-7">We fund the remaining 70% at 30% flat interest. The car is yours to drive!</p>
              </div>
            </div>
          </div>

        </section>

        {/* Right: Premium Interactive Co-Financing Calculator */}
        <section className="lg:col-span-6">
          <div className="bg-card border border-border/60 rounded-3xl p-6 md:p-8 card-shadow-lg relative overflow-hidden backdrop-blur-md">
            
            {/* Background design accents */}
            <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-gradient-to-bl from-primary/10 to-transparent pointer-events-none rounded-bl-full" />

            <div className="space-y-6">
              
              <div className="flex justify-between items-start border-b border-border/60 pb-4">
                <div>
                  <h2 className="text-xl font-bold font-heading">Co-Financing Planner</h2>
                  <p className="text-muted-foreground text-xs mt-0.5">Calculate your savings goal & co-investment cover</p>
                </div>
                <span className="bg-primary/10 text-primary text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
                  30/70 Plan Active
                </span>
              </div>

              {/* Car Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Select Vehicle Model</label>
                <div className="grid grid-cols-3 gap-2">
                  {CARS.map((car) => {
                    const isSelected = selectedCar.id === car.id;
                    return (
                      <button
                        key={car.id}
                        disabled={lockedPlan}
                        onClick={() => handleCarSelect(car)}
                        className={`py-3 px-2 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                          isSelected 
                            ? 'bg-primary/5 border-primary text-foreground font-semibold shadow-sm' 
                            : 'bg-muted/50 border-border/40 text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        <span className="text-xs font-bold tracking-tight">{car.name.split(' ')[1]}</span>
                        <span className="text-[9px] opacity-75">
                          {(car.priceUgx / 1000000).toFixed(1)}M UGX
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Car Image Preview */}
              <div className="relative rounded-2xl overflow-hidden border border-border/60 bg-muted aspect-[16/9]">
                <img 
                  src={selectedCar.image} 
                  alt={selectedCar.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10" />
                <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-white">
                  <div>
                    <h4 className="font-bold text-sm tracking-tight">{selectedCar.name}</h4>
                    <p className="text-[9px] text-gray-300 font-medium">{selectedCar.type}</p>
                  </div>
                  <div className="flex gap-2 text-[10px] bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                    <span>{selectedCar.specs.engine}</span>
                    <span className="opacity-40">|</span>
                    <span>{selectedCar.specs.fuel}</span>
                  </div>
                </div>
              </div>

              {/* Saving Frequency Selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Choose Savings Frequency</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['daily', 'weekly', 'monthly'] as const).map((freq) => (
                    <button
                      key={freq}
                      disabled={lockedPlan}
                      onClick={() => handleFrequencyChange(freq)}
                      className={`py-2 px-3 rounded-lg border text-xs font-bold uppercase transition ${
                        frequency === freq
                          ? 'bg-secondary text-primary border-primary shadow-sm'
                          : 'bg-transparent border-border/50 text-muted-foreground hover:bg-secondary/40'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              {/* Savings Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-muted-foreground uppercase tracking-wider">Flexible Installment</span>
                  <span className="text-primary font-black">
                    {savingAmount.toLocaleString()} UGX <span className="text-[10px] font-medium text-muted-foreground">/{frequency.substring(0, 3)}</span>
                  </span>
                </div>
                
                <input
                  type="range"
                  disabled={lockedPlan}
                  min={getMinMaxSavings().min}
                  max={getMinMaxSavings().max}
                  step={getMinMaxSavings().step}
                  value={savingAmount}
                  onChange={(e) => setSavingAmount(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-secondary accent-primary cursor-pointer"
                />

                <div className="flex justify-between text-[9px] text-muted-foreground font-semibold">
                  <span>Min: {getMinMaxSavings().min.toLocaleString()}</span>
                  <span>Max: {getMinMaxSavings().max.toLocaleString()}</span>
                </div>
              </div>

              {/* Segmented Co-Financing Graphics */}
              <div className="space-y-2.5 bg-secondary/30 border border-secondary/50 rounded-2xl p-4">
                
                <div className="flex rounded-xl overflow-hidden h-5.5 border border-border/50 p-[1.5px] bg-card">
                  <div className="bg-primary text-[9px] font-black text-primary-foreground flex items-center justify-center rounded-l-lg" style={{ width: '30%' }}>
                    30% YOU SAVE
                  </div>
                  <div className="bg-indigo-600 text-[9px] font-black text-white flex items-center justify-center rounded-r-lg" style={{ width: '70%' }}>
                    70% platform
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-semibold pt-1">
                  <div>
                    <span className="text-[9px] text-muted-foreground uppercase font-extrabold block">Your 30% Target</span>
                    <span className="text-foreground font-black text-sm">{deposit30.toLocaleString()} UGX</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-muted-foreground uppercase font-extrabold block">Platform 70% Cover</span>
                    <span className="text-indigo-600 font-black text-sm">{platform70.toLocaleString()} UGX</span>
                  </div>
                </div>

                {/* Company Interest Structure & Penalty Disclosures */}
                <div className="border-t border-border/20 pt-2.5 grid grid-cols-2 gap-2 text-[10px]">
                  <div className="space-y-0.5">
                    <span className="text-muted-foreground font-semibold flex items-center gap-1">
                      Financing Cost (30% interest)
                      <Info size={11} className="text-muted-foreground" />
                    </span>
                    <span className="font-extrabold text-foreground block">+{financeInterest.toLocaleString()} UGX</span>
                    <span className="text-[9px] text-muted-foreground block">(Charged only on the 70% financed portion)</span>
                  </div>

                  <div className="space-y-0.5 text-right">
                    <span className="text-muted-foreground font-semibold flex items-center gap-1 justify-end">
                      Missed installment Penalty (20%)
                      <AlertCircle size={11} className="text-destructive" />
                    </span>
                    <span className="font-extrabold text-destructive block">+{penaltyFee.toLocaleString()} UGX</span>
                    <span className="text-[9px] text-muted-foreground block">(Applicable per delayed installment)</span>
                  </div>
                </div>

              </div>

              {/* Dynamic Target Accomplishment Duration */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Clock size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">Delivery Target Achieved In</span>
                    <span className="text-sm font-black text-foreground">{timeTo30Text}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-muted-foreground uppercase font-bold block">Final Loan Portion</span>
                  <span className="text-xs font-bold text-foreground">{(totalAmountToAmortize).toLocaleString()} UGX</span>
                </div>
              </div>

              {/* Selection Locking CTA */}
              {!lockedPlan ? (
                <button
                  onClick={handleLockPlan}
                  className="w-full py-4 gradient-primary hover:opacity-95 text-primary-foreground font-extrabold rounded-2xl transition flex items-center justify-center gap-2 group shadow-md"
                >
                  <Lock size={15} />
                  <span>Lock Savings Target & Sign In</span>
                  <ArrowRight className="group-hover:translate-x-0.5 transition-transform" size={15} />
                </button>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center gap-3 text-emerald-800 text-xs">
                  <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                  <div className="flex-grow">
                    <strong>Target locked!</strong> Saving **{savingAmount.toLocaleString()} UGX/{frequency.substring(0,3)}** towards **{selectedCar.name}**.
                  </div>
                  <Check size={14} className="text-emerald-600" />
                </div>
              )}

            </div>

          </div>
        </section>

      </main>

      {/* Vision & Mission, and Why Choose Welile Cars */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-border/50 relative z-10">
        
        {/* Left: Why Choose Welile Cars & Core Flexibility */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-extrabold text-primary uppercase tracking-wider">Benefits</span>
            <h2 className="text-3xl font-black font-heading text-foreground mt-1">Why Choose Welile Cars?</h2>
            <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
              We eliminate the massive barriers to car ownership with custom co-investments and maximum payment flexibility.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="bg-card border border-border/80 rounded-2xl p-5 card-shadow space-y-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Wallet size={20} />
              </div>
              <h4 className="font-extrabold text-sm text-foreground">Extreme Flexibility</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Save daily, weekly, or monthly in varying sizes. Adjust your plans instantly to align with cashflows.
              </p>
            </div>

            <div className="bg-card border border-border/80 rounded-2xl p-5 card-shadow space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <BadgePercent size={20} />
              </div>
              <h4 className="font-extrabold text-sm text-foreground">Flat Financed Charge</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A simple 30% interest rate is applied solely to the remaining 70% portion. Extremely transparent co-investment.
              </p>
            </div>

            <div className="bg-card border border-border/80 rounded-2xl p-5 card-shadow space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <ShieldCheck size={20} />
              </div>
              <h4 className="font-extrabold text-sm text-foreground">Co-Financing Partner</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Our strategic partnerships with dealerships & financing houses guarantee vehicle allocation instantly once you hit 30%.
              </p>
            </div>

            <div className="bg-card border border-border/80 rounded-2xl p-5 card-shadow space-y-2">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                <Shuffle size={20} />
              </div>
              <h4 className="font-extrabold text-sm text-foreground">Seamless Integrations</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Integrated directly with Mobile Money (MTN & Airtel) so you can push savings safely directly from your phone.
              </p>
            </div>

          </div>

        </div>

        {/* Right: Vision, Mission & Company Values */}
        <div className="space-y-8 flex flex-col justify-center">
          
          <div className="bg-card border border-border/60 rounded-3xl p-6 md:p-8 shadow-md card-shadow relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full pointer-events-none" />
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase">
                <Sparkles size={14} />
                <span>Our Vision</span>
              </div>
              <h3 className="text-xl font-bold font-heading">Empowering Every Ugandan Driver</h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                To build Uganda's most structured, inclusive, and accessible vehicle finance network, unlocking economic potential and enabling sustainable transport ownership for riders, businesses, and individuals.
              </p>
            </div>

            <div className="border-t border-border/60 pt-6 space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase">
                <Clock size={14} />
                <span>Our Mission</span>
              </div>
              <h3 className="text-xl font-bold font-heading">Lowering the Barrier of Upfront Capital</h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                To eliminate the high-entry costs of vehicle purchases by offering lightweight micro-savings plans, transparent 30/70 co-financing cover, and strategic financial services partnerships.
              </p>
            </div>

          </div>

          {/* Core regulatory disclosures */}
          <div className="px-4 text-[10px] text-muted-foreground leading-relaxed">
            * Important Note: Failing to meet your pre-allocated savings installment schedule triggers a standard 20% penalty charge calculated on that specific scheduled installment amount. Always adjust plan rates to match your active budget before locking.
          </div>

        </div>

      </section>

      {/* Embedded Sign In / Sign Up Portal */}
      <section id="auth-portal-section" className="max-w-md mx-auto px-6 py-12 relative z-10 border-t border-border/50">
        
        <div className="bg-card border border-border/80 rounded-3xl p-6 md:p-8 shadow-xl card-shadow-lg space-y-6">
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center mb-3 text-white shadow-md shadow-primary/20">
              <CarIcon size={22} />
            </div>
            <h3 className="text-xl font-bold font-heading">Sign In to Welile Portal</h3>
            <p className="text-muted-foreground text-xs mt-0.5">Securely log in to access full car catalog and start saving</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }} className="space-y-4">
            
            {!isLogin && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Welile Kisa"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-border/80 bg-muted/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="E.g., +256 700 123456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-border/80 bg-muted/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition"
                  />
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Email Address</label>
              <input
                type="email"
                required
                placeholder="E.g., welile@kisa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border/80 bg-muted/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border/80 bg-muted/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition"
              />
            </div>

            {lockedPlan && (
              <div className="p-3 bg-secondary/40 border border-secondary rounded-xl text-[11px] text-primary font-semibold flex items-center gap-2">
                <Check size={14} /> Locked targets will be linked to this account automatically.
              </div>
            )}

            <button
              type="submit"
              className="w-full h-12 gradient-primary text-primary-foreground font-bold rounded-2xl hover:opacity-95 transition shadow-md mt-2 flex items-center justify-center gap-2"
            >
              <span>{isLogin ? 'Log In & Access' : 'Create Account & Start Saving'}</span>
              <ArrowRight size={16} />
            </button>

          </form>

          <p className="text-center text-xs text-muted-foreground pt-1">
            {isLogin ? "New to Welile Cars? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-bold hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>

        </div>

      </section>

      {/* Partner Ecosystem */}
      <footer className="border-t border-border/60 bg-card/30 backdrop-blur-sm py-12 relative z-10 text-center space-y-6">
        <div className="max-w-7xl mx-auto px-6 space-y-4">
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Our Strategic Integrations & Partners</h4>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
            <span className="font-extrabold text-sm md:text-base tracking-wider uppercase">MTN Mobile Money</span>
            <span className="font-extrabold text-sm md:text-base tracking-wider uppercase">Airtel Money</span>
            <span className="font-extrabold text-sm md:text-base tracking-wider uppercase">Uganda Vehicle Dealers Ltd</span>
            <span className="font-extrabold text-sm md:text-base tracking-wider uppercase">Co-op Credit Fund</span>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground">© 2026 Welile Cars. All rights reserved. Registered Asset Financing Provider in Uganda.</p>
      </footer>

    </div>
  );
}
