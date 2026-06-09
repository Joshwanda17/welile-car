import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  // Reveal Animation Logic
  useEffect(() => {
    const reveal = () => {
      const reveals = document.querySelectorAll('.reveal');
      reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const revealTop = el.getBoundingClientRect().top;
        const revealPoint = 150;
        if (revealTop < windowHeight - revealPoint) {
          el.classList.add('active');
        }
      });
    };
    window.addEventListener('scroll', reveal);
    reveal(); // Trigger on mount
    return () => window.removeEventListener('scroll', reveal);
  }, []);

  // Stats Counters
  const [stats, setStats] = useState({ stat1: 0, stat2: 0, stat3: 0.0, stat4: 0 });
  const statsTriggered = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.getElementById('stats-section');
      if (el && !statsTriggered.current && el.getBoundingClientRect().top < window.innerHeight) {
        statsTriggered.current = true;
        animateStats();
      }
    };

    const animateStats = () => {
        const targets = { stat1: 2450, stat2: 8200, stat3: 1.2, stat4: 145 };
        const duration = 2000;
        const startTime = performance.now();

        const step = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setStats({
                stat1: Math.round(targets.stat1 * ease),
                stat2: Math.round(targets.stat2 * ease),
                stat3: Number((targets.stat3 * ease).toFixed(1)),
                stat4: Math.round(targets.stat4 * ease),
            });
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check in case it's in view
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculator Logic
  const [price, setPrice] = useState(450000);
  const [depositPercent, setDepositPercent] = useState(30);
  const [monthlySavings, setMonthlySavings] = useState(5000);

  const depositNeeded = price * (depositPercent / 100);
  const financeAmount = price - depositNeeded;
  
  // 5% interest on savings calculation
  const monthlyRate = 0.05 / 12;
  const rawMonths = Math.log((depositNeeded * monthlyRate / monthlySavings) + 1) / Math.log(1 + monthlyRate);
  const targetMonths = isNaN(rawMonths) || !isFinite(rawMonths) ? 0 : Math.ceil(rawMonths);
  
  // Estimated repayment (10% APR over 60 months)
  const repay = (financeAmount * 1.10) / 60;
  const targetRepay = Math.round(repay);

  // SVG Progress Ring
  const circumference = 2 * Math.PI * 32;
  const offset = circumference - (depositPercent / 100) * circumference;

  return (
    <div className="bg-background text-on-surface font-body-md overflow-x-hidden">
      
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-xl shadow-sm dark:bg-surface-container-high transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop py-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">directions_car</span>
            <span className="font-display-lg text-headline-sm md:text-headline-md text-primary tracking-tight">Welile Car</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link className="font-label-md text-label-md text-primary border-b-2 border-primary font-bold" to="/">Home</Link>
            <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" to="/vehicles">Vehicles</Link>
            <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" to="/about">How It Works</Link>
            <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" to="/financing">Financing</Link>
          </nav>
          <button onClick={() => navigate('/auth')} className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-md text-label-md hover:shadow-lg transition-all">Get Started</button>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            alt="Hero Background" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuARR4aYRe1IMbxevQIQdgZibVigHO3oJW21upeowN2VoEqSriT9bCveZBQqnfOreFYfl22xwRHqioINeNG4HtsTALXiDNb5iH_t3z-U0sDovYXXNwpsH4eOn2VzMKYe0MtzWfisJrStB1tz3kkqDamu7g95UqTG1vinLoX4mwZSNE_Ec5H3F66h-guc4J7zztz0LAtfhwwgkXYlfUmM3R0mAYkxKIMo2rMhh2LS-6N0kquw9qSkZq3kbnxlK4H0bPC7KHwPMX9sjoBv"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-primary/20 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop py-16 grid lg:grid-cols-2 gap-12 items-center w-full">
          <div className="text-white">
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg mb-6 leading-tight">
              Own Your Dream Vehicle Without Paying Everything Upfront
            </h1>
            <p className="font-body-lg text-body-lg mb-10 text-white/90 max-w-lg">
              Smart vehicle acquisition for the modern African professional. Save while earning a 5% return, and let us finance the rest.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => navigate('/auth')} className="bg-secondary-container text-on-secondary-container px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform">
                Start Saving
              </button>
              <button onClick={() => navigate('/vehicles')} className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all">
                Explore Vehicles
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-6 rounded-3xl shadow-xl transform hover:-translate-y-2 transition-transform">
              <span className="material-symbols-outlined text-primary mb-2 text-3xl">trending_up</span>
              <div className="text-primary font-bold text-2xl">5%</div>
              <div className="text-on-surface-variant text-sm">Savings Growth</div>
            </div>
            <div className="glass-card p-6 rounded-3xl shadow-xl transform hover:-translate-y-2 transition-transform mt-8">
              <span className="material-symbols-outlined text-primary mb-2 text-3xl">payments</span>
              <div className="text-primary font-bold text-2xl">70%</div>
              <div className="text-on-surface-variant text-sm">Vehicle Financing</div>
            </div>
            <div className="glass-card p-6 rounded-3xl shadow-xl transform hover:-translate-y-2 transition-transform">
              <span className="material-symbols-outlined text-primary mb-2 text-3xl">groups</span>
              <div className="text-primary font-bold text-2xl">1000+</div>
              <div className="text-on-surface-variant text-sm">Customers</div>
            </div>
            <div className="glass-card p-6 rounded-3xl shadow-xl transform hover:-translate-y-2 transition-transform mt-8">
              <span className="material-symbols-outlined text-primary mb-2 text-3xl">calendar_month</span>
              <div className="text-primary font-bold text-2xl">Flexible</div>
              <div className="text-on-surface-variant text-sm">Repayment</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section (Animated) */}
      <section id="stats-section" className="bg-surface-container py-12">
        <div className="max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-primary font-headline-md text-headline-md mb-1">{stats.stat1}+</div>
              <div className="text-on-surface-variant font-label-md">Vehicles Financed</div>
            </div>
            <div>
              <div className="text-primary font-headline-md text-headline-md mb-1">{stats.stat2}+</div>
              <div className="text-on-surface-variant font-label-md">Active Customers</div>
            </div>
            <div>
              <div className="text-primary font-headline-md text-headline-md mb-1">{stats.stat3}B</div>
              <div className="text-on-surface-variant font-label-md">Billion Saved</div>
            </div>
            <div>
              <div className="text-primary font-headline-md text-headline-md mb-1">{stats.stat4}</div>
              <div className="text-on-surface-variant font-label-md">Dealer Partners</div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-section-gap">
        <div className="max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop">
          <div className="calculator-card bg-white rounded-[32px] shadow-2xl overflow-hidden grid lg:grid-cols-5 gap-0">
            <div className="lg:col-span-3 p-8 md:p-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-headline-md text-headline-md text-primary">Plan Your Journey</h2>
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full">
                    <circle className="text-surface-container" cx="40" cy="40" fill="transparent" r="32" stroke="currentColor" strokeWidth="6"></circle>
                    <circle 
                      className="progress-ring text-primary" 
                      cx="40" cy="40" fill="transparent" r="32" stroke="currentColor" 
                      strokeDasharray="201.06" 
                      strokeDashoffset={offset} 
                      strokeLinecap="round" strokeWidth="6">
                    </circle>
                  </svg>
                  <div className="absolute text-[10px] font-bold text-primary flex flex-col items-center">
                    <span>{depositPercent}%</span>
                    <span className="text-[8px] uppercase tracking-tighter opacity-60">Deposit</span>
                  </div>
                </div>
              </div>

              <div className="space-y-10">
                <div>
                  <div className="flex justify-between mb-3">
                    <span className="font-label-md text-on-surface-variant">Vehicle Price</span>
                    <span className="font-bold text-primary">R {price.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" min="100000" max="2000000" step="10000" value={price} 
                    onChange={e => setPrice(Number(e.target.value))}
                    className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary premium-transition" 
                  />
                  <div className="flex justify-between mt-2 text-[10px] text-on-surface-variant/40 uppercase font-bold tracking-widest">
                    <span>R100k</span>
                    <span>R2m</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-3">
                    <span className="font-label-md text-on-surface-variant">Deposit Goal</span>
                    <span className="font-bold text-primary">R {Math.round(depositNeeded).toLocaleString()} ({depositPercent}%)</span>
                  </div>
                  <input 
                    type="range" min="30" max="100" step="1" value={depositPercent} 
                    onChange={e => setDepositPercent(Number(e.target.value))}
                    className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary premium-transition" 
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-3">
                    <span className="font-label-md text-on-surface-variant">Monthly Savings</span>
                    <span className="font-bold text-primary">R {monthlySavings.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" min="1000" max="50000" step="500" value={monthlySavings} 
                    onChange={e => setMonthlySavings(Number(e.target.value))}
                    className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary premium-transition" 
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-primary p-8 md:p-12 text-white flex flex-col justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent)]"></div>
              <h3 className="font-headline-sm text-headline-sm mb-8 text-secondary-container relative z-10">Your Outlook</h3>
              
              <div className="space-y-8 relative z-10">
                <div className="pb-6 border-b border-white/10 premium-transition hover:translate-x-2">
                  <div className="text-white/60 text-sm mb-1">Time to Qualify</div>
                  <div className="text-4xl font-bold">
                    <span className="tabular-nums">{targetMonths}</span> <span className="text-xl opacity-60">Months</span>
                  </div>
                </div>
                
                <div className="pb-6 border-b border-white/10 premium-transition hover:translate-x-2">
                  <div className="text-white/60 text-sm mb-1">Estimated Finance Amount</div>
                  <div className="text-4xl font-bold">
                    <span className="text-xl opacity-60">R</span> <span className="tabular-nums">{Math.round(financeAmount).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="premium-transition hover:translate-x-2">
                  <div className="text-white/60 text-sm mb-1">Monthly Repayment</div>
                  <div className="text-4xl font-bold">
                    <span className="text-xl opacity-60">R</span> <span className="tabular-nums">{targetRepay.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <button onClick={() => navigate('/auth')} className="shimmer-btn mt-10 bg-secondary-container text-on-secondary-container w-full py-5 rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/20 z-10">
                Secure This Plan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-section-gap bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-headline-md text-headline-md text-primary mb-4">Five Steps to Ownership</h2>
            <p className="text-on-surface-variant">Our unique fintech model empowers you to move from saving to driving with institutional support every step of the way.</p>
          </div>
          <div className="relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-primary/10 -translate-x-1/2 hidden md:block"></div>
            <div className="space-y-16">
              
              {/* Step 1 */}
              <div className="reveal relative flex flex-col md:flex-row items-center md:justify-between group">
                <div className="md:w-5/12 text-left md:text-right">
                  <h3 className="font-headline-sm text-headline-sm text-primary mb-2">Save</h3>
                  <p className="text-on-surface-variant">Open a high-yield vehicle savings account. Watch your deposit grow with a guaranteed 5% annual return.</p>
                </div>
                <div className="z-10 bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl my-6 md:my-0 shadow-lg group-hover:scale-110 transition-transform">1</div>
                <div className="md:w-5/12">
                  <span className="material-symbols-outlined text-6xl text-primary/20">savings</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="reveal relative flex flex-col md:flex-row-reverse items-center md:justify-between group">
                <div className="md:w-5/12 text-left">
                  <h3 className="font-headline-sm text-headline-sm text-primary mb-2">Qualify</h3>
                  <p className="text-on-surface-variant">Once you hit your 30% deposit target, you instantly unlock access to our premium vehicle financing pool.</p>
                </div>
                <div className="z-10 bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl my-6 md:my-0 shadow-lg group-hover:scale-110 transition-transform">2</div>
                <div className="md:w-5/12 flex md:justify-end">
                  <span className="material-symbols-outlined text-6xl text-primary/20">verified_user</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="reveal relative flex flex-col md:flex-row items-center md:justify-between group">
                <div className="md:w-5/12 text-left md:text-right">
                  <h3 className="font-headline-sm text-headline-sm text-primary mb-2">Finance</h3>
                  <p className="text-on-surface-variant">We bridge the remaining 70% with low-interest, transparent financing tailored to your income profile.</p>
                </div>
                <div className="z-10 bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl my-6 md:my-0 shadow-lg group-hover:scale-110 transition-transform">3</div>
                <div className="md:w-5/12">
                  <span className="material-symbols-outlined text-6xl text-primary/20">account_balance</span>
                </div>
              </div>

              {/* Step 4 */}
              <div className="reveal relative flex flex-col md:flex-row-reverse items-center md:justify-between group">
                <div className="md:w-5/12 text-left">
                  <h3 className="font-headline-sm text-headline-sm text-primary mb-2">Own</h3>
                  <p className="text-on-surface-variant">Select your vehicle from our verified dealer network. We handle all paperwork and logistics.</p>
                </div>
                <div className="z-10 bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl my-6 md:my-0 shadow-lg group-hover:scale-110 transition-transform">4</div>
                <div className="md:w-5/12 flex md:justify-end">
                  <span className="material-symbols-outlined text-6xl text-primary/20">key</span>
                </div>
              </div>

              {/* Step 5 */}
              <div className="reveal relative flex flex-col md:flex-row items-center md:justify-between group">
                <div className="md:w-5/12 text-left md:text-right">
                  <h3 className="font-headline-sm text-headline-sm text-primary mb-2">Repay</h3>
                  <p className="text-on-surface-variant">Enjoy your ride while making manageable monthly repayments with no hidden fees or penalties.</p>
                </div>
                <div className="z-10 bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl my-6 md:my-0 shadow-lg group-hover:scale-110 transition-transform">5</div>
                <div className="md:w-5/12">
                  <span className="material-symbols-outlined text-6xl text-primary/20">check_circle</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="py-section-gap overflow-hidden">
        <div className="max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-headline-md text-headline-md text-primary mb-2">Explore Our Range</h2>
              <div className="flex gap-4 mt-6 overflow-x-auto no-scrollbar pb-2">
                <button className="whitespace-nowrap bg-primary text-on-primary px-6 py-2 rounded-full text-sm font-bold">Personal</button>
                <button className="whitespace-nowrap bg-surface-container text-on-surface-variant px-6 py-2 rounded-full text-sm font-bold hover:bg-primary/5">Commercial</button>
                <button className="whitespace-nowrap bg-surface-container text-on-surface-variant px-6 py-2 rounded-full text-sm font-bold hover:bg-primary/5">Motorcycles</button>
                <button className="whitespace-nowrap bg-surface-container text-on-surface-variant px-6 py-2 rounded-full text-sm font-bold hover:bg-primary/5">Agricultural</button>
              </div>
            </div>
            <div className="hidden md:flex gap-2">
              <button className="w-12 h-12 rounded-full border border-outline flex items-center justify-center hover:bg-primary hover:text-white transition-all"><span className="material-symbols-outlined">arrow_back</span></button>
              <button className="w-12 h-12 rounded-full border border-outline flex items-center justify-center hover:bg-primary hover:text-white transition-all"><span className="material-symbols-outlined">arrow_forward</span></button>
            </div>
          </div>

          <div className="flex gap-gutter overflow-x-auto no-scrollbar snap-x pb-8">
            {/* Sedan Card */}
            <div className="snap-start min-w-[320px] md:min-w-[400px] bg-white rounded-[24px] shadow-lg group overflow-hidden border border-outline-variant/30 cursor-pointer" onClick={() => navigate('/vehicles')}>
              <div className="h-56 overflow-hidden">
                <img alt="Tesla Model S Sedan" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7gtQN3wBYDDlTrZDT5j-0fej-ZR6GG-2w6b8AvAE7Z3fpqvqwmjpq-U250axsri9mk067W5VmKY32b0M0R-D-NEcgk6WymVOFgWrh7QzCjwN3Xp82pTSC7NzZ7yNfXlssEY9ev5AMNr5fBcTTwNMvLDIeaXr7s31jgatILywQPxXu9WMpzQWbKG0HIUOhz74lB3kfBItdsK_Sr1gMvVCAivLxWtFgxfn7gEwLY-XVEbLRhg7dWirvHXy90wUz3tR-_u7IveDaJoU6"/>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl text-primary">Luxury Sedan</h3>
                    <span className="text-sm text-on-surface-variant">Tesla Model S or similar</span>
                  </div>
                  <span className="bg-secondary-fixed text-on-secondary-fixed text-xs font-bold px-2 py-1 rounded">PREMIUM</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-6">
                  <div className="bg-surface-container p-2 rounded-lg text-center">
                    <div className="text-[10px] text-on-surface-variant uppercase">Deposit</div>
                    <div className="font-bold text-sm">30%</div>
                  </div>
                  <div className="bg-surface-container p-2 rounded-lg text-center">
                    <div className="text-[10px] text-on-surface-variant uppercase">Range</div>
                    <div className="font-bold text-sm">600km</div>
                  </div>
                  <div className="bg-surface-container p-2 rounded-lg text-center">
                    <div className="text-[10px] text-on-surface-variant uppercase">Rating</div>
                    <div className="font-bold text-sm">5.0</div>
                  </div>
                </div>
                <button className="w-full py-3 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all">View Details</button>
              </div>
            </div>

            {/* Van Card */}
            <div className="snap-start min-w-[320px] md:min-w-[400px] bg-white rounded-[24px] shadow-lg group overflow-hidden border border-outline-variant/30 cursor-pointer" onClick={() => navigate('/vehicles')}>
              <div className="h-56 overflow-hidden">
                <img alt="Ford Transit Commercial Van" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKFSe0EWSzSmALhi5vZFKK6nHJIui6TkB7tGEr2Qs9Fx9_3yb298W0ck5nqFzDydX14RTsIxKZ7zaqRjRwiVVi9QyWLvSa3kySV_oEmtOu4uVcAHBaEihyNffrL0AYbO1eaA5PiDOnwl2WRv6X4VdJmjmPZAVgAfsQrO7H5sDzk7g9W6CeS5c2boVsSCXl4J-jD5Kx5r0cA0uA6aD_oikkqR6B3z3UttMCufLZtYmj_mN5njhKm9wfMz6dCsF8YHOqCy10aAoV62WO"/>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl text-primary">Commercial Van</h3>
                    <span className="text-sm text-on-surface-variant">Ford Transit or similar</span>
                  </div>
                  <span className="bg-surface-variant text-on-surface-variant text-xs font-bold px-2 py-1 rounded">BUSINESS</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-6">
                  <div className="bg-surface-container p-2 rounded-lg text-center">
                    <div className="text-[10px] text-on-surface-variant uppercase">Deposit</div>
                    <div className="font-bold text-sm">30%</div>
                  </div>
                  <div className="bg-surface-container p-2 rounded-lg text-center">
                    <div className="text-[10px] text-on-surface-variant uppercase">Load</div>
                    <div className="font-bold text-sm">1.5 Ton</div>
                  </div>
                  <div className="bg-surface-container p-2 rounded-lg text-center">
                    <div className="text-[10px] text-on-surface-variant uppercase">Year</div>
                    <div className="font-bold text-sm">2023+</div>
                  </div>
                </div>
                <button className="w-full py-3 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all">View Details</button>
              </div>
            </div>

            {/* Dynamic Placeholder */}
            <div onClick={() => navigate('/vehicles')} className="snap-start min-w-[320px] md:min-w-[400px] bg-surface-container-low border-2 border-dashed border-outline-variant rounded-[24px] flex flex-col items-center justify-center p-12 text-center cursor-pointer hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-5xl text-outline mb-4">add_circle</span>
              <h4 className="font-bold text-primary">More Vehicles</h4>
              <p className="text-on-surface-variant text-sm mt-2">Check our full inventory of over 1000+ vehicles</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Welile Section (Bento) */}
      <section className="py-section-gap bg-primary-container text-white">
        <div className="max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop">
          <div className="text-center mb-16">
            <h2 className="font-headline-md text-headline-md mb-4 text-secondary-container">The Welile Advantage</h2>
            <p className="text-white/70">Engineered for security and financial growth.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-[24px] hover:bg-white/10 transition-all">
              <span className="material-symbols-outlined text-secondary-container text-4xl mb-4">speed</span>
              <h3 className="font-bold text-xl mb-3">Fast Approval</h3>
              <p className="text-white/60 text-sm">Pre-qualification happens in under 24 hours once your savings target is achieved.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-[24px] hover:bg-white/10 transition-all">
              <span className="material-symbols-outlined text-secondary-container text-4xl mb-4">security</span>
              <h3 className="font-bold text-xl mb-3">Secure Savings</h3>
              <p className="text-white/60 text-sm">Your savings are protected by institutional-grade security and financial guarantees.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-[24px] hover:bg-white/10 transition-all">
              <span className="material-symbols-outlined text-secondary-container text-4xl mb-4">show_chart</span>
              <h3 className="font-bold text-xl mb-3">5% Guaranteed Growth</h3>
              <p className="text-white/60 text-sm">We don't just hold your money; we grow it. Beat inflation while you plan your purchase.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-[24px] hover:bg-white/10 transition-all">
              <span className="material-symbols-outlined text-secondary-container text-4xl mb-4">edit_calendar</span>
              <h3 className="font-bold text-xl mb-3">Flexible Financing</h3>
              <p className="text-white/60 text-sm">Choose repayment periods that match your cash flow, from 24 to 72 months.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-[24px] hover:bg-white/10 transition-all">
              <span className="material-symbols-outlined text-secondary-container text-4xl mb-4">verified</span>
              <h3 className="font-bold text-xl mb-3">Dealer Verification</h3>
              <p className="text-white/60 text-sm">Every car in our network undergoes a rigorous 150-point technical inspection.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-[24px] hover:bg-white/10 transition-all">
              <span className="material-symbols-outlined text-secondary-container text-4xl mb-4">headset_mic</span>
              <h3 className="font-bold text-xl mb-3">Dedicated Support</h3>
              <p className="text-white/60 text-sm">A personal concierge to guide you through registration, insurance, and maintenance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-section-gap">
        <div className="max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop">
          <h2 className="font-headline-md text-headline-md text-primary mb-12 text-center">Voices of Success</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-[32px] shadow-lg flex flex-col md:flex-row gap-6 items-center">
              <img alt="Happy Taxi Driver Testimonial" className="w-24 h-24 rounded-full object-cover shadow-md" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8IpPyE-Dm8e8csTi1Ho2EVPYMGAn-MmDHyqWlpn-gS7ztjZofsGeceC3sLmqOy1MhkslLb9E_1vfJt71r4VmfB4-risaH5e48rj7Vzdsgbh6IrQ9WvGrDREt4TEf6NRNXl0N9ZhO3mArOoEk8bNZJbTivSbNEkeQWCGTFnVRSnALQDdO50_Zws0aaQe0jRb2AKFFyflXNI8qfH4dnjLZZKJHjWbo57BrXbcb6DMFD9u9k75X9Jgut5409UrRaGP3l_L04zaslicO2"/>
              <div>
                <div className="text-primary mb-2 flex">
                  <span className="material-symbols-outlined">star</span>
                  <span className="material-symbols-outlined">star</span>
                  <span className="material-symbols-outlined">star</span>
                  <span className="material-symbols-outlined">star</span>
                  <span className="material-symbols-outlined">star</span>
                </div>
                <p className="italic text-on-surface-variant mb-4">"Welile Car helped me get my first taxi without the massive upfront burden. The 5% growth on my savings was the cherry on top!"</p>
                <div className="font-bold text-primary">Sipho M.</div>
                <div className="text-xs text-on-surface-variant">Fleet Entrepreneur</div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-[32px] shadow-lg flex flex-col md:flex-row gap-6 items-center">
              <img alt="Small Business Owner Testimonial" className="w-24 h-24 rounded-full object-cover shadow-md" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpZmKbSfPrJNRR1y5Co3tQkOO2uR1OcESrkOPvPGIjlArhBQhvPiuvvjhSpAG_65w_ioDubh6YPM5PZzePYWk-NcrZipntQkLGeI9Nrtx_gvLljXTLEaYsHt5xY4e_HZrBjZZg_2hCWRuuKXu1GFOPk7mUyYt1WF8xjuj5FTa1B-kqGff9C4g4OkoBQddnI0buz67RB6KDn7PsP-J80uhAPFFh-rZHcc52rfAChnULx6ykWhz8bY-tg2LImV7BWg8D3vLj6j0Vr2LQ"/>
              <div>
                <div className="text-primary mb-2 flex">
                  <span className="material-symbols-outlined">star</span>
                  <span className="material-symbols-outlined">star</span>
                  <span className="material-symbols-outlined">star</span>
                  <span className="material-symbols-outlined">star</span>
                  <span className="material-symbols-outlined">star</span>
                </div>
                <p className="italic text-on-surface-variant mb-4">"Scaling my delivery business was a challenge until I found their commercial van program. The process was fast and transparent."</p>
                <div className="font-bold text-primary">Zanele K.</div>
                <div className="text-xs text-on-surface-variant">Logistics Manager</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-section-gap bg-background pb-32">
        <div className="max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop">
          <div className="bg-primary-container rounded-[40px] p-12 md:p-24 text-center relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary-container/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="font-display-lg-mobile md:font-display-lg text-white mb-8">Ready to Own Your Next Vehicle?</h2>
              <p className="text-white/70 font-body-lg mb-12 max-w-2xl mx-auto">Join thousands of smart owners who are saving and financing with Welile Car. Start your 5% growth journey today.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button onClick={() => navigate('/auth')} className="bg-secondary-container text-on-secondary-container px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-black/20">
                  Open Savings Account
                </button>
                <button onClick={() => navigate('/about')} className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all">
                  Talk to a Consultant
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      </main>
      
      {/* Footer is handled by the global layout, but we can add one here if needed */}
      <footer className="bg-surface-container-highest dark:bg-inverse-surface w-full border-t border-outline-variant dark:border-outline">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-gutter max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop py-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary text-2xl">directions_car</span>
              <span className="font-display-lg text-headline-sm text-primary dark:text-primary-fixed-dim">Welile Car</span>
            </div>
            <p className="text-on-surface-variant text-sm mb-6 max-w-xs">Pioneering a secure, transparent way for every South African to own the vehicles they need for life and business.</p>
            <div className="flex gap-4">
              <a className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all" href="#"><span className="material-symbols-outlined">public</span></a>
              <a className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all" href="#"><span className="material-symbols-outlined">alternate_email</span></a>
              <a className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all" href="#"><span className="material-symbols-outlined">smartphone</span></a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-primary mb-6">Links</h4>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              <li><Link className="hover:underline hover:text-primary transition-colors" to="/">Home</Link></li>
              <li><Link className="hover:underline hover:text-primary transition-colors" to="/about">How It Works</Link></li>
              <li><Link className="hover:underline hover:text-primary transition-colors" to="/vehicles">Vehicles</Link></li>
              <li><Link className="hover:underline hover:text-primary transition-colors" to="/financing">Financing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-primary mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              <li><Link className="hover:underline hover:text-primary transition-colors" to="/about">About Us</Link></li>
              <li><Link className="hover:underline hover:text-primary transition-colors" to="/about">Contact</Link></li>
              <li><Link className="hover:underline hover:text-primary transition-colors" to="/auth">Login</Link></li>
            </ul>
          </div>
          <div className="col-span-2 lg:col-span-1">
            <h4 className="font-bold text-primary mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              <li><a className="hover:underline hover:text-primary transition-colors" href="#">Terms of Service</a></li>
              <li><a className="hover:underline hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop py-8 border-t border-outline-variant/30 text-center">
          <p className="text-sm text-on-surface-variant">© 2026 Welile Car. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
