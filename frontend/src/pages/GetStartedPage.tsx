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
  UserCheck
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

  // Dynamic calculations
  const totalWeeks = Math.ceil(selectedCar.priceUgx / weeklyPayment);
  const totalMonths = Math.ceil(totalWeeks / 4.3);
  const dailyEquivalent = Math.round(weeklyPayment / 7);

  // Handle car model change
  const handleCarSelect = (car: CarModel) => {
    setSelectedCar(car);
    setWeeklyPayment(car.weeklyBase);
  };

  const handleGetStarted = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden font-sans selection:bg-primary/20">
      
      {/* Premium Ambient Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-accent/20 blur-[150px] pointer-events-none" />
      <div className="absolute top-[30%] right-[10%] w-[300px] h-[300px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <CarIcon className="text-primary-foreground" size={20} />
          </div>
          <span className="text-xl font-bold font-heading tracking-tight">Welile Cars</span>
        </div>
        <button 
          onClick={handleGetStarted}
          className="text-sm font-medium hover:text-primary transition-colors duration-200 flex items-center gap-1.5 py-2 px-4 rounded-xl hover:bg-secondary/50"
        >
          <span>Sign In</span>
          <UserCheck size={16} />
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Vision, Features & Onboarding Stepper */}
        <section className="lg:col-span-6 space-y-8">
          
          {/* Dynamic Welcoming Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 border border-primary/10 backdrop-blur-sm shadow-sm"
          >
            <Sparkles className="text-primary" size={14} />
            <span className="text-xs font-semibold text-secondary-foreground tracking-wider uppercase">Smart Vehicle Ownership</span>
          </motion.div>

          {/* Catchy Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-heading leading-[1.1] tracking-tight">
              Start Small.<br />
              <span className="text-gradient">Own Your Car.</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Welile Cars makes vehicle ownership accessible to everyone in Uganda. Pay in lightweight weekly installments and own your brand-new vehicle fully.
            </p>
          </div>

          {/* Interactive Stepper / Onboarding Value Proposition */}
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

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <button
              onClick={handleGetStarted}
              className="gradient-primary text-primary-foreground font-semibold px-8 py-4 rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <span>Get Started Now</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </button>
            <a
              href="#calculator"
              className="bg-card hover:bg-secondary/50 border border-border/80 text-foreground font-medium px-8 py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              Calculate Ownership
            </a>
          </div>

        </section>

        {/* Right Column: High Fidelity Ownership Calculator & Interactive Card */}
        <section id="calculator" className="lg:col-span-6 relative">
          
          {/* Glassmorphic Background Card Container */}
          <div className="bg-card border border-border/60 rounded-3xl p-6 md:p-8 card-shadow-lg relative overflow-hidden backdrop-blur-md">
            
            {/* Corner Decorative Gradient */}
            <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-gradient-to-bl from-primary/10 to-transparent pointer-events-none rounded-bl-full" />

            <div className="flex flex-col gap-6">
              
              {/* Header inside Card */}
              <div className="flex justify-between items-start border-b border-border/60 pb-5">
                <div>
                  <h2 className="text-xl font-bold font-heading">Ownership Planner</h2>
                  <p className="text-muted-foreground text-xs mt-0.5">Pick a car and customize your weekly plan</p>
                </div>
                <div className="bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <BadgePercent size={14} />
                  <span>0% Hidden Fees</span>
                </div>
              </div>

              {/* Car Model Selector with Tabs */}
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

              {/* Interactive Car Image & Specs Block */}
              <div className="relative rounded-2xl overflow-hidden border border-border/60 bg-muted/30 aspect-[16/9] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedCar.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <img 
                      src={selectedCar.image} 
                      alt={selectedCar.name} 
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    
                    {/* Dark overlay for specs legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
                    
                    {/* Bottom Floating specs inside image */}
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
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Slider for Installments */}
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
                  onChange={(e) => setWeeklyPayment(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-secondary accent-primary cursor-pointer transition-all duration-300"
                />

                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Min: {selectedCar.weeklyBase.toLocaleString()} UGX</span>
                  <span>Max: {(selectedCar.weeklyBase * 2.5).toLocaleString()} UGX</span>
                </div>
              </div>

              {/* Calculated Outputs (High Fidelity Presentation) */}
              <div className="grid grid-cols-2 gap-3 bg-secondary/40 border border-secondary/50 rounded-2xl p-4">
                
                <div className="space-y-0.5 border-r border-border/50 pr-3">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold block">Ownership Duration</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-foreground">{totalMonths}</span>
                    <span className="text-xs font-bold text-muted-foreground">months</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground block">({totalWeeks} weekly payments)</span>
                </div>

                <div className="space-y-0.5 pl-3">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold block">Daily Equivalent</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-foreground">{dailyEquivalent.toLocaleString()}</span>
                    <span className="text-xs font-bold text-muted-foreground">UGX</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground block">(Lightweight savings plan)</span>
                </div>

              </div>

              {/* Progress visualizer */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Progress to full ownership</span>
                  <span className="text-primary font-bold">100% Owned</span>
                </div>
                <div className="w-full h-3.5 bg-secondary rounded-full overflow-hidden p-[2px] border border-border/40">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full rounded-full gradient-primary relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                  </motion.div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-semibold mt-1">
                  <CheckCircle2 size={12} />
                  <span>Includes Comprehensive Insurance & Routine Maintenance</span>
                </div>
              </div>

              {/* Action Button inside Card */}
              <button
                onClick={handleGetStarted}
                className="w-full py-4 gradient-primary hover:opacity-95 text-primary-foreground font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 group shadow-md"
              >
                <span>Select Plan & Sign Up</span>
                <ChevronRight className="group-hover:translate-x-0.5 transition-transform" size={16} />
              </button>

            </div>

          </div>

          {/* Floating dynamic stat bubble */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="absolute bottom-[-20px] left-[-20px] bg-white border border-border/80 rounded-2xl p-3 shadow-xl flex items-center gap-3 max-w-[200px]"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Popular Selection</p>
              <p className="text-xs font-extrabold text-foreground">Toyota Vitz @ 30k/day</p>
            </div>
          </motion.div>

        </section>

      </main>

      {/* Trust & Stats Footer */}
      <footer className="border-t border-border/60 bg-card/30 backdrop-blur-sm py-10 mt-16 relative z-10">
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

    </div>
  );
}
