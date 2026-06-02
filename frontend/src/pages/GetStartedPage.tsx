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
  ArrowLeft,
  Lock,
  Calendar,
  Layers,
  MapPin,
  Flame,
  Check,
  AlertCircle
} from 'lucide-react';

// Import images or use local asset fallback paths
import vitzImg from '@/assets/car-vitz.jpg';
import premioImg from '@/assets/car-premio.jpg';
import wishImg from '@/assets/car-wish.jpg';

interface CarModel {
  id: string;
  name: string;
  type: string;
  priceUgx: number;
  weeklyBase: number;
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
    type: 'Hatchback (Efficient & Compact)',
    priceUgx: 18000000,
    weeklyBase: 150000,
    image: vitzImg,
    specs: { engine: '1.3L VVT-i', fuel: '20 km/L', seats: 5 }
  },
  {
    id: 'wish',
    name: 'Toyota Wish',
    type: 'MPV (Spacious & Family Friendly)',
    priceUgx: 25000000,
    weeklyBase: 220000,
    image: wishImg,
    specs: { engine: '1.8L Valvematic', fuel: '14 km/L', seats: 7 }
  },
  {
    id: 'premio',
    name: 'Toyota Premio',
    type: 'Sedan (Premium & Elegant)',
    priceUgx: 28000000,
    weeklyBase: 250000,
    image: premioImg,
    specs: { engine: '1.8L D4-D', fuel: '16 km/L', seats: 5 }
  }
];

const ONBOARDING_STEPS = [
  {
    icon: <CarIcon className="text-primary" size={28} />,
    title: "Choose Your Perfect Vehicle",
    description: "Browse from our handpicked, premium range of highly efficient vehicles tailored for Ugandan roads."
  },
  {
    icon: <Wallet className="text-primary" size={28} />,
    title: "Flexible Financing Plans",
    description: "No huge upfront payments. Select a customized weekly installment plan that aligns with your income."
  },
  {
    icon: <ShieldCheck className="text-primary" size={28} />,
    title: "Own Your Car Fully",
    description: "Every payment brings you closer. Complete your plan and receive full vehicle ownership with no hidden fees."
  }
];

export default function GetStartedPage() {
  const navigate = useNavigate();
  const [selectedCar, setSelectedCar] = useState<CarModel>(CARS[0]);
  const [weeklyPayment, setWeeklyPayment] = useState<number>(CARS[0].weeklyBase);
  const [activeStep, setActiveStep] = useState(0);

  // Portal & Lock States
  const [showPortal, setShowPortal] = useState(false);
  const [isPlanLocked, setIsPlanLocked] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Dynamic calculations
  const totalWeeks = Math.ceil(selectedCar.priceUgx / weeklyPayment);
  const totalMonths = Math.ceil(totalWeeks / 4.3);
  const dailyEquivalent = Math.round(weeklyPayment / 7);

  // 30% Down Payment Calculations
  const deposit30 = Math.round(selectedCar.priceUgx * 0.3);
  const depositStep1 = Math.round(deposit30 * 0.4); // 40% of deposit
  const depositStep2 = Math.round(deposit30 * 0.3); // 30% of deposit
  const depositStep3 = Math.round(deposit30 * 0.3); // 30% of deposit

  // Handle car model change
  const handleCarSelect = (car: CarModel) => {
    if (isPlanLocked) return; // Prevent change if plan is locked
    setSelectedCar(car);
    setWeeklyPayment(car.weeklyBase);
  };

  const handleWeeklyPaymentChange = (value: number) => {
    if (isPlanLocked) return; // Prevent change if plan is locked
    setWeeklyPayment(value);
  };

  const handleLockPlan = () => {
    if (!agreeTerms) return;
    setIsPlanLocked(true);
  };

  const handleContinueToAuth = () => {
    // Pass selection parameters through route state or let them signup
    navigate('/auth', { state: { carId: selectedCar.id, weeklyPayment, locked: true } });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden font-sans selection:bg-primary/20">
      
      {/* Premium Ambient Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-accent/20 blur-[150px] pointer-events-none" />
      <div className="absolute top-[30%] right-[10%] w-[300px] h-[300px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <CarIcon className="text-primary-foreground" size={20} />
          </div>
          <span className="text-xl font-bold font-heading tracking-tight">Welile Cars</span>
        </div>
        
        {showPortal ? (
          <button 
            disabled={isPlanLocked}
            onClick={() => setShowPortal(false)}
            className={`text-sm font-semibold flex items-center gap-2 py-2.5 px-4 rounded-xl transition ${
              isPlanLocked 
                ? 'opacity-40 cursor-not-allowed text-muted-foreground' 
                : 'hover:bg-secondary/80 text-foreground'
            }`}
          >
            <ArrowLeft size={16} />
            <span>Back to Calculator</span>
          </button>
        ) : (
          <button 
            onClick={() => navigate('/auth')}
            className="text-sm font-medium hover:text-primary transition-colors duration-200 flex items-center gap-1.5 py-2.5 px-4 rounded-xl hover:bg-secondary/50"
          >
            <span>Sign In</span>
            <UserCheck size={16} />
          </button>
        )}
      </header>

      {/* Main Switchable Portal & Calculator Workspace */}
      <AnimatePresence mode="wait">
        {!showPortal ? (
          /* Standard Calculator & Vision Screen */
          <motion.main 
            key="calculator-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="max-w-7xl mx-auto px-6 py-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            {/* Left Column: Vision & Stepper */}
            <section className="lg:col-span-6 space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 border border-primary/10 backdrop-blur-sm shadow-sm"
              >
                <Sparkles className="text-primary" size={14} />
                <span className="text-xs font-semibold text-secondary-foreground tracking-wider uppercase">Smart Vehicle Ownership</span>
              </motion.div>

              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-heading leading-[1.1] tracking-tight">
                  Start Small.<br />
                  <span className="text-gradient">Own Your Car.</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-xl">
                  Welile Cars makes vehicle ownership accessible to everyone in Uganda. Pay in lightweight weekly installments and own your brand-new vehicle fully.
                </p>
              </div>

              {/* Onboarding Stepper */}
              <div className="space-y-4">
                {ONBOARDING_STEPS.map((step, idx) => (
                  <motion.div
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex gap-4 ${
                      activeStep === idx 
                      ? 'bg-card border-primary/20 shadow-md card-shadow' 
                      : 'bg-transparent border-transparent hover:bg-secondary/30'
                    }`}
                    whileHover={{ x: 4 }}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                      activeStep === idx ? 'bg-secondary' : 'bg-muted'
                    }`}>
                      {step.icon}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-base flex items-center gap-2">
                        {step.title}
                        {activeStep === idx && (
                          <motion.span layoutId="active-dot" className="w-1.5 h-1.5 rounded-full bg-primary" />
                        )}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                <button
                  onClick={() => setShowPortal(true)}
                  className="gradient-primary text-primary-foreground font-semibold px-8 py-4 rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <span>Select Plan & See Details</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                </button>
                <a
                  href="#calculator-section"
                  className="bg-card hover:bg-secondary/50 border border-border/80 text-foreground font-medium px-8 py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Configure Plan
                </a>
              </div>
            </section>

            {/* Right Column: Calculator Card */}
            <section id="calculator-section" className="lg:col-span-6 relative">
              <div className="bg-card border border-border/60 rounded-3xl p-6 md:p-8 card-shadow-lg relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-gradient-to-bl from-primary/10 to-transparent pointer-events-none rounded-bl-full" />

                <div className="flex flex-col gap-6">
                  <div className="flex justify-between items-start border-b border-border/60 pb-5">
                    <div>
                      <h2 className="text-xl font-bold font-heading">Ownership Planner</h2>
                      <p className="text-muted-foreground text-xs mt-0.5">Customize your weekly plan options</p>
                    </div>
                    <div className="bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <BadgePercent size={14} />
                      <span>0% Hidden Fees</span>
                    </div>
                  </div>

                  {/* Car Tabs */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Select Car Model</label>
                    <div className="grid grid-cols-3 gap-2">
                      {CARS.map((car) => {
                        const isSelected = selectedCar.id === car.id;
                        return (
                          <button
                            key={car.id}
                            onClick={() => handleCarSelect(car)}
                            className={`py-3 px-2 rounded-xl border text-center transition-all duration-300 flex flex-col items-center gap-1 ${
                              isSelected 
                                ? 'bg-primary/5 border-primary text-foreground font-semibold shadow-sm' 
                                : 'bg-muted/50 border-border/40 text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                          >
                            <span className="text-sm tracking-tight">{car.name.split(' ')[1]}</span>
                            <span className="text-[10px] opacity-75">
                              {(car.priceUgx / 1000000).toFixed(1)}M UGX
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Spec Visualizer */}
                  <div className="relative rounded-2xl overflow-hidden border border-border/60 bg-muted/30 aspect-[16/9] flex items-center justify-center">
                    <div className="absolute inset-0 w-full h-full">
                      <img 
                        src={selectedCar.image} 
                        alt={selectedCar.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
                      
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                        <div>
                          <h4 className="font-bold text-base tracking-tight">{selectedCar.name}</h4>
                          <p className="text-[10px] text-gray-300 font-medium">{selectedCar.type}</p>
                        </div>
                        <div className="flex gap-2.5 text-[11px] bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                          <span>{selectedCar.specs.engine}</span>
                          <span className="opacity-40">|</span>
                          <span>{selectedCar.specs.fuel}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Weekly Installment</label>
                      <span className="text-base font-bold text-primary">
                        {weeklyPayment.toLocaleString()} UGX <span className="text-xs font-medium text-muted-foreground">/wk</span>
                      </span>
                    </div>
                    
                    <input
                      type="range"
                      min={selectedCar.weeklyBase}
                      max={selectedCar.weeklyBase * 2.5}
                      step={10000}
                      value={weeklyPayment}
                      onChange={(e) => handleWeeklyPaymentChange(Number(e.target.value))}
                      className="w-full h-2 rounded-lg bg-secondary accent-primary cursor-pointer"
                    />

                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>Min: {selectedCar.weeklyBase.toLocaleString()} UGX</span>
                      <span>Max: {(selectedCar.weeklyBase * 2.5).toLocaleString()} UGX</span>
                    </div>
                  </div>

                  {/* Quick Outputs */}
                  <div className="grid grid-cols-2 gap-3 bg-secondary/40 border border-secondary/50 rounded-2xl p-4">
                    <div className="space-y-0.5 border-r border-border/50 pr-3">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold block">Ownership Duration</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-foreground">{totalMonths}</span>
                        <span className="text-xs font-bold text-muted-foreground">months</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground block">({totalWeeks} weeks)</span>
                    </div>

                    <div className="space-y-0.5 pl-3">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold block">Daily Equivalent</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-foreground">{dailyEquivalent.toLocaleString()}</span>
                        <span className="text-xs font-bold text-muted-foreground">UGX</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground block">(Easy daily saving)</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowPortal(true)}
                    className="w-full py-4 gradient-primary hover:opacity-95 text-primary-foreground font-bold rounded-2xl transition flex items-center justify-center gap-2 group shadow-md"
                  >
                    <span>Analyze Deposit & Details</span>
                    <ChevronRight className="group-hover:translate-x-0.5 transition-transform" size={16} />
                  </button>
                </div>
              </div>
            </section>
          </motion.main>
        ) : (
          /* High Fidelity Plan Activation & 30% Deposit Portal */
          <motion.main 
            key="portal-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="max-w-7xl mx-auto px-6 py-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            
            {/* Left Column: Car Specifics & locked state badge */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Selected Car Details Card */}
              <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-md card-shadow relative overflow-hidden">
                <div className="absolute top-3 right-3 z-10 bg-black/60 backdrop-blur-md text-white text-xs font-extrabold px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
                  <Flame size={12} className="text-orange-400 fill-orange-400" />
                  <span>30% Deposit Required</span>
                </div>

                <div className="space-y-5">
                  <div className="rounded-2xl overflow-hidden border border-border/50 bg-muted aspect-[16/10]">
                    <img 
                      src={selectedCar.image} 
                      alt={selectedCar.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  <div>
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">{selectedCar.type}</span>
                    <h2 className="text-2xl font-black font-heading text-foreground mt-1">{selectedCar.name}</h2>
                    <p className="text-muted-foreground text-sm mt-0.5">High efficiency model fully prepared for delivery.</p>
                  </div>

                  {/* Core specifications grid */}
                  <div className="grid grid-cols-3 gap-3 border-y border-border/60 py-4">
                    <div className="text-center">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Engine Capacity</span>
                      <span className="text-sm font-extrabold text-foreground block mt-1">{selectedCar.specs.engine}</span>
                    </div>
                    <div className="text-center border-x border-border/60">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Fuel Economy</span>
                      <span className="text-sm font-extrabold text-foreground block mt-1">{selectedCar.specs.fuel}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Seating Capacity</span>
                      <span className="text-sm font-extrabold text-foreground block mt-1">{selectedCar.specs.seats} Passenger</span>
                    </div>
                  </div>

                  {/* Value specs details */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Plan Terms Breakdown</h4>
                    
                    <div className="flex justify-between items-center text-sm border-b border-border/40 pb-2">
                      <span className="text-muted-foreground">Retail Value:</span>
                      <span className="font-extrabold text-foreground">{selectedCar.priceUgx.toLocaleString()} UGX</span>
                    </div>

                    <div className="flex justify-between items-center text-sm border-b border-border/40 pb-2">
                      <span className="text-muted-foreground">Financing Period:</span>
                      <span className="font-extrabold text-foreground">{totalMonths} Months ({totalWeeks} weeks)</span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Standard Weekly Installment:</span>
                      <span className="font-extrabold text-primary">{weeklyPayment.toLocaleString()} UGX</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Status information panel */}
              <div className="bg-secondary/40 border border-secondary rounded-2xl p-4 flex gap-3.5">
                <AlertCircle className="text-primary flex-shrink-0 mt-0.5" size={20} />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-foreground">Why the 30% Deposit?</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    The 30% commitment deposit secures your vehicle chassis allocation, covers comprehensive 1-year local insurance, and registers the car details under your name.
                  </p>
                </div>
              </div>

            </div>

            {/* Right Column: 30% Deposit Interactive timeline & Selection locking */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="bg-card border border-border/80 rounded-3xl p-6 md:p-8 shadow-md card-shadow relative overflow-hidden">
                
                {isPlanLocked && (
                  <div className="absolute inset-0 bg-background/5 border border-primary/20 backdrop-blur-[2px] z-10 pointer-events-none rounded-3xl" />
                )}

                <div className="space-y-6">
                  
                  {/* Dynamic Header based on locked status */}
                  <div className="flex items-center justify-between border-b border-border/60 pb-5">
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold font-heading text-foreground flex items-center gap-2.5">
                        <span>30% Deposit Payment Schedule</span>
                        {isPlanLocked && (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                            <Check size={10} /> Locked
                          </span>
                        )}
                      </h3>
                      <p className="text-muted-foreground text-xs">
                        {isPlanLocked 
                          ? "This selection has been secured and locked under your session." 
                          : "A total 30% deposit of the retail value is split into 3 steps."
                        }
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Total 30% Deposit</span>
                      <span className="text-lg md:text-xl font-black text-primary block mt-0.5">{deposit30.toLocaleString()} UGX</span>
                    </div>
                  </div>

                  {/* High Fidelity Schedule Timeline */}
                  <div className="space-y-5 relative">
                    
                    {/* Visual Vertical line connector */}
                    <div className="absolute left-[23px] top-[15px] bottom-[15px] w-[2px] bg-border/80" />

                    {/* Step 1: Initial Deposit */}
                    <div className="flex gap-4 relative">
                      <div className="w-12 h-12 rounded-full border-2 border-primary bg-background flex items-center justify-center font-bold text-sm text-primary flex-shrink-0 shadow-sm relative z-10">
                        1
                      </div>
                      <div className="bg-secondary/35 border border-border/40 p-4 rounded-2xl flex-grow space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">Phase 1: Initial Deposit (40%)</span>
                            <h4 className="font-extrabold text-sm text-foreground mt-1.5">Commitment Allocation Invoice</h4>
                          </div>
                          <span className="text-sm font-black text-foreground">{depositStep1.toLocaleString()} UGX</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Payable immediately upon application submission to lock this specific vehicle ID from public listings.
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <Calendar size={12} />
                          <span>Due Date: Immediate / Instant Assignment</span>
                        </div>
                      </div>
                    </div>

                    {/* Step 2: Second Installment */}
                    <div className="flex gap-4 relative">
                      <div className="w-12 h-12 rounded-full border-2 border-border/80 bg-background flex items-center justify-center font-bold text-sm text-muted-foreground flex-shrink-0 shadow-sm relative z-10">
                        2
                      </div>
                      <div className="bg-secondary/10 border border-border/30 p-4 rounded-2xl flex-grow space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] bg-muted text-muted-foreground font-bold px-2 py-0.5 rounded-full">Phase 2: Milestone Payment (30%)</span>
                            <h4 className="font-extrabold text-sm text-foreground mt-1.5">Vetting & Documentation Payment</h4>
                          </div>
                          <span className="text-sm font-black text-foreground">{depositStep2.toLocaleString()} UGX</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Due within 7 days after initial booking to cover registration paperwork, vetting processes, and number plate assignment.
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <Calendar size={12} />
                          <span>Due Date: 7 Days after booking</span>
                        </div>
                      </div>
                    </div>

                    {/* Step 3: Delivery Installment */}
                    <div className="flex gap-4 relative">
                      <div className="w-12 h-12 rounded-full border-2 border-border/80 bg-background flex items-center justify-center font-bold text-sm text-muted-foreground flex-shrink-0 shadow-sm relative z-10">
                        3
                      </div>
                      <div className="bg-secondary/10 border border-border/30 p-4 rounded-2xl flex-grow space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] bg-muted text-muted-foreground font-bold px-2 py-0.5 rounded-full">Phase 3: Final Delivery (30%)</span>
                            <h4 className="font-extrabold text-sm text-foreground mt-1.5">Handover & Drive-Away Payment</h4>
                          </div>
                          <span className="text-sm font-black text-foreground">{depositStep3.toLocaleString()} UGX</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Payable on the physical delivery day at our Kampala depot when you collect keys, logbook documentation, and drive away!
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <Calendar size={12} />
                          <span>Due Date: Handover & Delivery Day</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Agree checkbox & Lock Selection once CTA */}
                  <div className="border-t border-border/60 pt-5 space-y-4">
                    
                    {!isPlanLocked ? (
                      /* Unlock mode terms agreement & Lock CTA */
                      <>
                        <label className="flex items-start gap-3.5 cursor-pointer select-none">
                          <input 
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                            className="mt-1 w-4 h-4 rounded text-primary border-border focus:ring-primary accent-primary"
                          />
                          <div className="text-xs text-muted-foreground leading-relaxed">
                            I understand that <strong className="text-foreground">this is a once-off vehicle assignment selection</strong>. Once locked, this specific chassis allocation and 30% deposit payment timeline cannot be changed or edited.
                          </div>
                        </label>

                        <button
                          disabled={!agreeTerms}
                          onClick={handleLockPlan}
                          className="w-full py-4 gradient-primary disabled:opacity-50 hover:opacity-95 text-primary-foreground font-extrabold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 group shadow-md shadow-primary/10"
                        >
                          <Lock size={16} />
                          <span>Lock Selection Once & Generate Invoice</span>
                        </button>
                      </>
                    ) : (
                      /* Secured Plan Details & Redirection */
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-5 space-y-4 text-center md:text-left"
                      >
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0 shadow-sm">
                            <Lock size={20} className="fill-emerald-100" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-extrabold text-sm text-emerald-900">Your Selection is Securely Locked!</h4>
                            <p className="text-xs text-emerald-700 leading-relaxed">
                              Chassis allocation ID: <strong className="font-mono">W-CAR-{(selectedCar.id).toUpperCase()}-4022</strong>. This choice is linked to your device session. Proceed to create your account and complete Phase 1 deposit.
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={handleContinueToAuth}
                          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/10"
                        >
                          <span>Proceed to Account Creation & Payment</span>
                          <ChevronRight size={16} />
                        </button>
                      </motion.div>
                    )}

                  </div>

                </div>

              </div>

              {/* Secure transaction assurance footer banner */}
              <div className="flex justify-between items-center text-xs text-muted-foreground px-4">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={14} className="text-emerald-500" /> Secure SSL Encryption
                </span>
                <span>MTN / AIRTEL / VISA / BANK Supported</span>
              </div>

            </div>

          </motion.main>
        )}
      </AnimatePresence>

      {/* Trust & Stats Footer (Only visible on Main Page for clutter control) */}
      {!showPortal && (
        <footer className="border-t border-border/60 bg-card/30 backdrop-blur-sm py-10 mt-16 relative z-10 animate-fade-in">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
            <div className="space-y-1">
              <p className="text-2xl font-black font-heading text-gradient">2,500+</p>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Drivers in UG</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-black font-heading text-gradient">0%</p>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Hidden Interest Rates</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-black font-heading text-gradient">24 Hours</p>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fast Plan Approval</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-black font-heading text-gradient">100%</p>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ownership Guaranteed</p>
            </div>
          </div>
        </footer>
      )}

    </div>
  );
}
