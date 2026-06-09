import { useState, useRef, useEffect } from 'react';
import { ChevronRight, Search, CheckCircle2, X, Heart, SlidersHorizontal, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSelectCarDetails } from '@/hooks/useProfile';

import vitzImg from '@/assets/car-vitz.jpg';
import premioImg from '@/assets/car-premio.jpg';
import wishImg from '@/assets/car-wish.jpg';
import harrierImg from '@/assets/harrier-white.png';
import heroCarImg from '@/assets/hero-car.png';
import passoImg from '@/assets/car-passo.png';

const carsData = [
  {
    id: 'vitz',
    name: 'Toyota Vitz',
    tagline: 'Perfect for Ride-Hailing',
    priceUgx: 18000000,
    priceStr: '18M UGX',
    oldPriceRange: '14M - 18M UGX',
    oldMin: 14000000,
    oldMax: 18000000,
    newPriceRange: '24M - 28M UGX',
    newMin: 24000000,
    newMax: 28000000,
    image: vitzImg,
    specs: { year: 2016, engine: '1.0L', transmission: 'Automatic', mileage: '65,000 km' },
    category: 'Ride-Hailing',
    rating: 4.8
  },
  {
    id: 'premio',
    name: 'Toyota Premio',
    tagline: 'Premium Sedan',
    priceUgx: 28000000,
    priceStr: '28M UGX',
    oldPriceRange: '22M - 28M UGX',
    oldMin: 22000000,
    oldMax: 28000000,
    newPriceRange: '38M - 45M UGX',
    newMin: 38000000,
    newMax: 45000000,
    image: premioImg,
    specs: { year: 2015, engine: '1.8L', transmission: 'Automatic', mileage: '50,000 km' },
    category: 'Sedan',
    rating: 4.7
  },
  {
    id: 'wish',
    name: 'Toyota Wish',
    tagline: 'Ideal for Cargo/Family',
    priceUgx: 25000000,
    priceStr: '25M UGX',
    oldPriceRange: '18M - 25M UGX',
    oldMin: 18000000,
    oldMax: 25000000,
    newPriceRange: '32M - 38M UGX',
    newMin: 32000000,
    newMax: 38000000,
    image: wishImg,
    specs: { year: 2014, engine: '1.8L', transmission: 'Automatic', mileage: '70,000 km' },
    category: 'Family',
    rating: 4.6
  },
  {
    id: 'harrier',
    name: 'Toyota Harrier',
    tagline: 'Luxury SUV',
    priceUgx: 85000000,
    priceStr: '85M UGX',
    oldPriceRange: '65M - 85M UGX',
    oldMin: 65000000,
    oldMax: 85000000,
    newPriceRange: '110M - 130M UGX',
    newMin: 110000000,
    newMax: 130000000,
    image: harrierImg,
    specs: { year: 2017, engine: '2.0L Turbo', transmission: 'Automatic', mileage: '35,000 km' },
    category: 'SUV',
    rating: 4.9
  },
  {
    id: 'noah',
    name: 'Toyota Noah',
    tagline: 'Spacious 7-Seater',
    priceUgx: 35000000,
    priceStr: '35M UGX',
    oldPriceRange: '28M - 35M UGX',
    oldMin: 28000000,
    oldMax: 35000000,
    newPriceRange: '48M - 58M UGX',
    newMin: 48000000,
    newMax: 58000000,
    image: heroCarImg,
    specs: { year: 2015, engine: '2.0L', transmission: 'Automatic', mileage: '60,000 km' },
    category: 'Family',
    rating: 4.8
  },
  {
    id: 'passo',
    name: 'Toyota Passo',
    tagline: 'Compact & Efficient',
    priceUgx: 16000000,
    priceStr: '16M UGX',
    oldPriceRange: '12M - 16M UGX',
    oldMin: 12000000,
    oldMax: 16000000,
    newPriceRange: '20M - 24M UGX',
    newMin: 20000000,
    newMax: 24000000,
    image: passoImg,
    specs: { year: 2017, engine: '1.0L', transmission: 'Automatic', mileage: '48,000 km' },
    category: 'Ride-Hailing',
    rating: 4.5
  },
  {
    id: 'sienta',
    name: 'Toyota Sienta',
    tagline: 'Family Mini-Van',
    priceUgx: 22000000,
    priceStr: '22M UGX',
    oldPriceRange: '16M - 22M UGX',
    oldMin: 16000000,
    oldMax: 22000000,
    newPriceRange: '28M - 34M UGX',
    newMin: 28000000,
    newMax: 34000000,
    image: wishImg,
    specs: { year: 2016, engine: '1.5L', transmission: 'Automatic', mileage: '55,000 km' },
    category: 'Family',
    rating: 4.6
  }
];

export default function VehiclesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const selectCarDetails = useSelectCarDetails();

  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [showFinancing, setShowFinancing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState<'daily'|'weekly'|'monthly'>('monthly');
  const [kycModalStep, setKycModalStep] = useState<0|1|2|3|4>(0);
  const [mobileNumber, setMobileNumber] = useState('');
  const [paymentSource, setPaymentSource] = useState<'wallet'|'deposit'|null>(null);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [likedCars, setLikedCars] = useState<string[]>(() => {
    const stored = localStorage.getItem('likedCars');
    return stored ? JSON.parse(stored) : [];
  });

  const [carCondition, setCarCondition] = useState<'used' | 'new'>('used');
  const [customPrice, setCustomPrice] = useState<number>(0);

  const selectedCar = carsData.find(c => c.id === selectedCarId);

  const [isQualified, setIsQualified] = useState<boolean>(true);
  const { session } = useAuth();

  useEffect(() => {
    if (session?.access_token) {
      fetch(`http://${window.location.hostname}:3005/api/dashboard/summary`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.health && data.savings) {
          const qualified = data.health.creditScore >= 70 && data.savings.progressPercent >= 30;
          setIsQualified(qualified);
        }
      })
      .catch(console.error);
    }
  }, [session]);

  useEffect(() => {
    if (selectedCar) {
      setCarCondition('used');
      setCustomPrice(selectedCar.priceUgx); // defaults to used max
    }
  }, [selectedCarId]);

  const handleConditionChange = (condition: 'used' | 'new') => {
    setCarCondition(condition);
    if (selectedCar) {
      const defaultPrice = condition === 'used' ? selectedCar.priceUgx : selectedCar.newMin;
      setCustomPrice(defaultPrice);
    }
  };

  const toggleLike = (carId: string) => {
    setLikedCars(prev => {
      const updated = prev.includes(carId) 
        ? prev.filter(id => id !== carId) 
        : [...prev, carId];
      localStorage.setItem('likedCars', JSON.stringify(updated));
      return updated;
    });
  };

  const categories = ['All', 'Ride-Hailing', 'Sedan', 'SUV', 'Family'];

  const carPrice = customPrice || (selectedCar ? selectedCar.priceUgx : 0);
  // Target Deposit: 30% of car price
  const targetAmount = carPrice * 0.3;
  // Financed Amount: 70% of car price
  const financedAmount = carPrice * 0.7;
  // Total Repayment: Financed Amount + 30% flat interest on that amount
  const totalRepayment = financedAmount * 1.3;
  
  // Math for 12 months repayment (365 days, 52 weeks, 12 months)
  const dailyPayment = totalRepayment / 365;
  const weeklyPayment = totalRepayment / 52;
  const monthlyPayment = totalRepayment / 12;

  useEffect(() => {
    if (kycModalStep === 3) {
      const timer = setTimeout(() => {
        setKycModalStep(4);

        if (selectedCar) {
          const loanData = {
            carId: selectedCar.id,
            carName: selectedCar.name,
            condition: carCondition,
            priceUgx: carPrice,
            targetDeposit: targetAmount,
            financedAmount: financedAmount,
            interestAmount: financedAmount * 0.3,
            totalRepayment: totalRepayment,
            dailyPayment: dailyPayment,
            weeklyPayment: weeklyPayment,
            monthlyPayment: monthlyPayment,
            image: selectedCar.image
          };
          localStorage.setItem('selectedVehicleLoan', JSON.stringify(loanData));

          if (user) {
            selectCarDetails.mutate({
              carId: selectedCar.id,
              condition: carCondition,
              price: carPrice
            });
          }
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [kycModalStep, selectedCarId, carCondition, carPrice, targetAmount, financedAmount, totalRepayment, dailyPayment, weeklyPayment, monthlyPayment, user, selectCarDetails]);

  const filteredCars = carsData.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || car.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#4e158e]/20 flex flex-col pb-24">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-grow flex flex-col justify-start w-full">

        {!isQualified && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 mb-6 font-medium text-sm flex items-center gap-3">
            <AlertCircle size={20} className="text-amber-500 shrink-0" />
            Continue building your deposit to unlock financing opportunities. The marketplace remains viewable.
          </div>
        )}

        {/* Search & Filter bar (Foodgo style) */}
        <div className="flex items-center gap-3 w-full mb-6">
          <div className="relative flex-1 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center h-14 pl-12 pr-4">
            <Search className="absolute left-4 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search for cars..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 font-bold text-sm"
            />
          </div>
          <button className="w-14 h-14 bg-[#4e158e] hover:bg-[#3f2bc2] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#4e158e]/20 transition-all">
            <SlidersHorizontal size={20} />
          </button>
        </div>

        {/* Categories horizontal list */}
        <div className="flex gap-2.5 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black tracking-wider transition-all border whitespace-nowrap ${
                  isSelected 
                    ? 'bg-[#4e158e] text-white border-[#4e158e] shadow-md shadow-[#4e158e]/10' 
                    : 'bg-white text-slate-600 border-slate-100 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {filteredCars.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg text-slate-400 font-bold">No vehicles found matching "{searchQuery}"</p>
          </div>
        )}

        {/* 2-column mobile grid, scaling to 3/4 columns on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredCars.map((car) => {
            const isSelected = selectedCarId === car.id;
            const isLiked = likedCars.includes(car.id);
            
            return (
              <div 
                key={car.id}
                onClick={() => setSelectedCarId(car.id)}
                className={`bg-white rounded-[28px] border p-4 pb-5 flex flex-col justify-between cursor-pointer transition-all duration-300 relative ${
                  isSelected 
                    ? 'border-[#4e158e] ring-2 ring-[#4e158e] shadow-lg shadow-[#4e158e]/10 -translate-y-1' 
                    : 'border-slate-100 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                {/* Floating Selection Indicator */}
                {isSelected && (
                  <span className="absolute top-4 left-4 bg-[#4e158e] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                    Selected
                  </span>
                )}

                {/* Car Image centered, slightly floating */}
                <div className="relative w-full h-32 sm:h-40 flex items-center justify-center mb-3">
                  <img 
                    src={car.image} 
                    alt={car.name} 
                    className="max-w-full max-h-full object-contain mix-blend-multiply drop-shadow-md transition-transform duration-300 hover:scale-105" 
                  />
                </div>

                {/* Title & Tagline */}
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight tracking-tight">{car.name}</h3>
                  <p className="text-slate-400 font-bold text-[10px] mt-0.5 tracking-tight line-clamp-1">{car.tagline}</p>
                </div>

                {/* Price range details */}
                <div className="mt-3 pt-3 border-t border-slate-50 text-[11px] space-y-1 text-slate-500 font-semibold">
                  <div className="flex justify-between items-center">
                    <span>Used (Old):</span>
                    <span className="text-slate-800 font-bold">{car.oldPriceRange}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>New:</span>
                    <span className="text-slate-800 font-bold">{car.newPriceRange}</span>
                  </div>
                  <p className="text-[9px] text-amber-600 font-extrabold italic mt-1 leading-none">
                    Depending on the condition
                  </p>
                </div>

                {/* Rating & Favorite Heart Toggle */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-400 font-black text-sm">★</span>
                    <span className="text-xs font-black text-slate-700">{car.rating}</span>
                    <span className="text-slate-300 text-[10px]">|</span>
                    <span className="text-[11px] font-black text-[#4e158e]">{car.priceStr}</span>
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(car.id);
                    }}
                    className="w-8 h-8 rounded-full bg-slate-50 hover:bg-red-50 flex items-center justify-center transition-colors group"
                  >
                    <Heart 
                      size={14} 
                      className={`transition-colors ${
                        isLiked 
                          ? 'fill-red-500 text-red-500' 
                          : 'text-slate-400 group-hover:text-red-500'
                      }`} 
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="border-t border-slate-100 py-8 text-center text-sm font-medium text-slate-400 mt-auto bg-white">
        © 2026 Welile Cars. All rights reserved.
      </footer>

      {/* Floating Bottom Bar for Selected Car */}
      <AnimatePresence>
        {selectedCar && (
          <motion.div
            initial={{ y: 150 }}
            animate={{ y: 0 }}
            exit={{ y: 150 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-20px_50px_-15px_rgba(0,0,0,0.15)] p-4 sm:px-8 z-40"
          >
            <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-6 w-full sm:w-auto">
                <div className="w-20 h-14 bg-slate-50 rounded-lg flex items-center justify-center p-2 border border-slate-100 hidden sm:flex">
                  <img src={selectedCar.image} alt={selectedCar.name} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Selected Car</p>
                  <p className="text-xl font-extrabold text-slate-900 flex items-center gap-3">
                    {selectedCar.name} 
                    <span className="text-[#4e158e] bg-[#4e158e]/10 px-3 py-1 rounded-full text-sm">{selectedCar.priceStr}</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => isQualified && setShowFinancing(true)}
                disabled={!isQualified}
                className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-[15px] transition-all ${
                  isQualified 
                    ? 'bg-[#4e158e] hover:bg-[#3f2bc2] text-white shadow-lg shadow-[#4e158e]/30' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isQualified ? 'View Payment Schedule' : 'Financing Locked'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal for Financing Breakdown */}
      <AnimatePresence>
        {showFinancing && selectedCar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => { setShowFinancing(false); setKycModalStep(0); }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => { setShowFinancing(false); setKycModalStep(0); }}
                className="absolute top-6 right-6 w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors z-10"
              >
                <X size={24} />
              </button>

              <div className="p-8 md:p-12 lg:flex gap-12">
                <div className="lg:w-1/3 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-slate-100 pb-8 lg:pb-0 lg:pr-12">
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-2">{selectedCar.name}</h2>
                  <p className="text-lg text-[#4e158e] font-bold mb-6">
                    {formatCurrency(carPrice)} <span className="text-xs font-semibold text-slate-400 capitalize">({carCondition})</span>
                  </p>
                  <img src={selectedCar.image} alt={selectedCar.name} className="w-full h-auto object-contain mix-blend-multiply drop-shadow-xl mb-6" />
                  
                  {/* Vehicle Type & Amount Selector */}
                  <div className="mb-6 bg-slate-50 border border-slate-100 rounded-2xl p-5">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                      Select Condition & Price
                    </p>
                    
                    {/* Condition Tabs */}
                    <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-200/50 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => handleConditionChange('used')}
                        className={`py-2 rounded-lg text-xs font-black transition-all ${
                          carCondition === 'used'
                            ? 'bg-white text-[#4e158e] shadow-sm'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Used (Old)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleConditionChange('new')}
                        className={`py-2 rounded-lg text-xs font-black transition-all ${
                          carCondition === 'new'
                            ? 'bg-white text-[#4e158e] shadow-sm'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        New
                      </button>
                    </div>

                    {/* Price Range Label & Slider */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span>Range:</span>
                        <span>
                          {carCondition === 'used'
                            ? `${formatCurrency(selectedCar.oldMin || 0)} - ${formatCurrency(selectedCar.oldMax || 0)}`
                            : `${formatCurrency(selectedCar.newMin || 0)} - ${formatCurrency(selectedCar.newMax || 0)}`}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between items-center bg-white border border-slate-200 rounded-xl px-3 py-2">
                          <span className="text-[11px] font-bold text-slate-400 uppercase">Price:</span>
                          <input
                            type="number"
                            min={carCondition === 'used' ? selectedCar.oldMin : selectedCar.newMin}
                            max={carCondition === 'used' ? selectedCar.oldMax : selectedCar.newMax}
                            value={customPrice}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setCustomPrice(val);
                            }}
                            className="bg-transparent text-right font-black text-slate-900 focus:outline-none w-32 text-sm"
                          />
                          <span className="text-xs font-black text-slate-800 ml-1">UGX</span>
                        </div>
                        {(() => {
                          const min = carCondition === 'used' ? selectedCar.oldMin : selectedCar.newMin;
                          const max = carCondition === 'used' ? selectedCar.oldMax : selectedCar.newMax;
                          if (min !== undefined && max !== undefined && (customPrice < min || customPrice > max)) {
                            return (
                              <p className="text-[10px] text-red-500 font-bold mt-1 leading-tight">
                                *Must be between {formatCurrency(min)} and {formatCurrency(max)}
                              </p>
                            );
                          }
                          return null;
                        })()}
                      </div>

                      <input
                        type="range"
                        min={carCondition === 'used' ? selectedCar.oldMin : selectedCar.newMin}
                        max={carCondition === 'used' ? selectedCar.oldMax : selectedCar.newMax}
                        step={500000}
                        value={customPrice}
                        onChange={(e) => setCustomPrice(Number(e.target.value))}
                        className="w-full h-1.5 rounded-lg bg-slate-200 accent-[#4e158e] cursor-pointer"
                      />
                      
                      {/* Presets */}
                      <div className="grid grid-cols-3 gap-1">
                        <button
                          type="button"
                          onClick={() => setCustomPrice(carCondition === 'used' ? (selectedCar.oldMin || 0) : (selectedCar.newMin || 0))}
                          className="py-1 px-1 bg-white border border-slate-100 hover:border-slate-300 rounded-lg text-[9px] font-bold text-slate-600 transition-colors"
                        >
                          Min Price
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const min = carCondition === 'used' ? (selectedCar.oldMin || 0) : (selectedCar.newMin || 0);
                            const max = carCondition === 'used' ? (selectedCar.oldMax || 0) : (selectedCar.newMax || 0);
                            setCustomPrice(Math.round(min + (max - min) / 2));
                          }}
                          className="py-1 px-1 bg-white border border-slate-100 hover:border-slate-300 rounded-lg text-[9px] font-bold text-slate-600 transition-colors"
                        >
                          Mid Price
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomPrice(carCondition === 'used' ? (selectedCar.oldMax || 0) : (selectedCar.newMax || 0))}
                          className="py-1 px-1 bg-white border border-slate-100 hover:border-slate-300 rounded-lg text-[9px] font-bold text-slate-600 transition-colors"
                        >
                          Max Price
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Target Deposit (30%)</p>
                    <p className="text-3xl font-black text-[#4e158e] mb-2">{formatCurrency(targetAmount)}</p>
                    <p className="text-sm font-medium text-slate-500 mb-3">Required before handing over the vehicle. We finance the remaining 70%.</p>
                    <div className="border-t border-slate-200/60 pt-3">
                      <p className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        5% Compounding Installment Bonus!
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Every savings installment you pay compounds by 5% until the 30% target is completed, helping you reach your target faster.
                      </p>
                    </div>
                  </div>

                  {selectedCar.specs && (
                    <div className="mt-8">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Vehicle Details</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 rounded-xl p-4">
                          <p className="text-xs text-slate-500 font-bold uppercase">Year</p>
                          <p className="font-semibold text-slate-900 mt-1">{selectedCar.specs.year}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4">
                          <p className="text-xs text-slate-500 font-bold uppercase">Engine</p>
                          <p className="font-semibold text-slate-900 mt-1">{selectedCar.specs.engine}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4">
                          <p className="text-xs text-slate-500 font-bold uppercase">Transmission</p>
                          <p className="font-semibold text-slate-900 mt-1">{selectedCar.specs.transmission}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4">
                          <p className="text-xs text-slate-500 font-bold uppercase">Mileage</p>
                          <p className="font-semibold text-slate-900 mt-1">{selectedCar.specs.mileage}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="lg:w-2/3 pt-8 lg:pt-0 flex flex-col justify-center">
                  {kycModalStep === 0 ? (
                    <>
                      <div className="mb-8 pr-12">
                        <h3 className="text-2xl font-bold text-slate-900">Choose your repayment schedule</h3>
                        <p className="text-slate-500 font-medium mt-2">Based on a 12-month loan for the 70% financed amount (with 30% flat interest).</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                        <div 
                          onClick={() => setSelectedSchedule('daily')}
                          className={`bg-white border-2 rounded-2xl p-6 transition-all cursor-pointer ${selectedSchedule === 'daily' ? 'border-[#4e158e] shadow-md shadow-[#4e158e]/10' : 'border-slate-100 hover:border-slate-300 hover:shadow-lg'}`}
                        >
                          <p className={`text-sm font-bold uppercase tracking-wider mb-2 ${selectedSchedule === 'daily' ? 'text-[#4e158e]' : 'text-slate-500'}`}>Daily</p>
                          <p className="text-xl font-black text-slate-900">{formatCurrency(dailyPayment)}</p>
                          <p className="text-xs font-bold text-slate-400 mt-2">365 payments</p>
                        </div>
                        
                        <div 
                          onClick={() => setSelectedSchedule('weekly')}
                          className={`bg-white border-2 rounded-2xl p-6 transition-all cursor-pointer ${selectedSchedule === 'weekly' ? 'border-[#4e158e] shadow-md shadow-[#4e158e]/10' : 'border-slate-100 hover:border-slate-300 hover:shadow-lg'}`}
                        >
                          <p className={`text-sm font-bold uppercase tracking-wider mb-2 ${selectedSchedule === 'weekly' ? 'text-[#4e158e]' : 'text-slate-500'}`}>Weekly</p>
                          <p className="text-xl font-black text-slate-900">{formatCurrency(weeklyPayment)}</p>
                          <p className="text-xs font-bold text-slate-400 mt-2">52 payments</p>
                        </div>

                        <div 
                          onClick={() => setSelectedSchedule('monthly')}
                          className={`bg-white border-2 rounded-2xl p-6 transition-all cursor-pointer relative overflow-hidden ${selectedSchedule === 'monthly' ? 'border-[#4e158e] shadow-md shadow-[#4e158e]/10' : 'border-slate-100 hover:border-slate-300 hover:shadow-lg'}`}
                        >
                          <div className="absolute top-0 right-0 bg-[#4e158e] text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-lg">POPULAR</div>
                          <p className={`text-sm font-bold uppercase tracking-wider mb-2 ${selectedSchedule === 'monthly' ? 'text-[#4e158e]' : 'text-slate-500'}`}>Monthly</p>
                          <p className="text-xl font-black text-slate-900">{formatCurrency(monthlyPayment)}</p>
                          <p className="text-xs font-bold text-slate-400 mt-2">12 payments</p>
                        </div>
                      </div>

                      <button 
                        onClick={() => setKycModalStep(1)}
                        className="w-full bg-slate-900 hover:bg-[#4e158e] text-white font-bold py-4 rounded-2xl transition-colors shadow-xl"
                      >
                        Confirm & Proceed
                      </button>
                    </>
                  ) : kycModalStep === 1 ? (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Target Deposit Payment</h3>
                      <p className="text-slate-500 font-medium mb-8">How would you like to pay the initial {formatCurrency(targetAmount)}?</p>
                      
                      <div className="space-y-4">
                        <button 
                          onClick={() => { setPaymentSource('wallet'); setKycModalStep(3); }}
                          className="w-full bg-white border-2 border-slate-100 p-6 rounded-2xl flex items-center gap-4 hover:border-[#4e158e] hover:bg-[#4e158e]/5 transition-all text-left group"
                        >
                          <div className="w-12 h-12 bg-[#4e158e]/10 text-[#4e158e] rounded-full flex items-center justify-center font-black group-hover:bg-[#4e158e] group-hover:text-white transition-colors">
                            W
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-lg">Pay from Welile Wallet</p>
                            <p className="text-sm text-slate-500">Instant transfer from your available balance</p>
                          </div>
                        </button>
                        
                        <button 
                          onClick={() => { setPaymentSource('deposit'); setKycModalStep(2); }}
                          className="w-full bg-white border-2 border-slate-100 p-6 rounded-2xl flex items-center gap-4 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left group"
                        >
                          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-black group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                            M
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-lg">Mobile Money Deposit</p>
                            <p className="text-sm text-slate-500">Pay directly via MTN or Airtel Mobile Money</p>
                          </div>
                        </button>
                      </div>
                      
                      <button onClick={() => setKycModalStep(0)} className="mt-8 text-slate-500 font-bold hover:text-slate-900 transition-colors">
                        ← Back to Schedule
                      </button>
                    </div>
                  ) : kycModalStep === 2 ? (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Mobile Money Deposit</h3>
                      <p className="text-slate-500 font-medium mb-8">Enter your details to initiate a prompt for {formatCurrency(targetAmount)}.</p>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Mobile Number</label>
                          <input 
                            type="text" 
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            placeholder="e.g. 077X XXX XXX"
                            className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-4 font-bold text-slate-900 focus:outline-none focus:border-[#4e158e] focus:bg-white transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Amount (UGX)</label>
                          <input 
                            type="text" 
                            disabled
                            value={formatCurrency(targetAmount)}
                            className="w-full bg-slate-100 border-2 border-slate-200 rounded-xl px-4 py-4 font-bold text-slate-500 cursor-not-allowed"
                          />
                        </div>
                        <button 
                          onClick={() => setKycModalStep(3)}
                          disabled={!mobileNumber}
                          className="w-full mt-4 bg-slate-900 hover:bg-[#4e158e] disabled:bg-slate-300 text-white font-bold py-4 rounded-xl transition-colors shadow-lg"
                        >
                          Send Prompt
                        </button>
                      </div>
                      
                      <button onClick={() => setKycModalStep(1)} className="mt-8 text-slate-500 font-bold hover:text-slate-900 transition-colors">
                        ← Back
                      </button>
                    </div>
                  ) : kycModalStep === 3 ? (
                    <div className="py-20 flex flex-col items-center justify-center animate-in fade-in duration-300">
                      <div className="w-16 h-16 border-4 border-slate-200 border-t-[#4e158e] rounded-full animate-spin mb-6"></div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Processing Payment...</h3>
                      <p className="text-slate-500 font-medium text-center">
                        {paymentSource === 'wallet' 
                          ? 'Deducting from your Welile Wallet securely.' 
                          : 'Waiting for Mobile Money confirmation. Please check your phone.'}
                      </p>
                    </div>
                  ) : (
                    <div className="py-12 flex flex-col items-center justify-center animate-in zoom-in duration-300 text-center">
                      <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 size={48} />
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 mb-2">Deposit Successful!</h3>
                      <p className="text-slate-600 font-medium mb-8">
                        We have successfully received your initial deposit of <span className="font-bold text-emerald-600">{formatCurrency(targetAmount)}</span>.
                        The remaining financed balance is <span className="font-bold text-slate-900">{formatCurrency(financedAmount)}</span>.
                      </p>
                      
                      <button 
                        onClick={() => navigate('/logbook')}
                        className="w-full bg-[#4e158e] hover:bg-[#3f2bc2] text-white font-bold py-4 rounded-xl transition-colors shadow-lg"
                      >
                        Go to My Wallet
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
