import { useState, useRef, useEffect } from 'react';
import { ChevronRight, Search, CheckCircle2, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import vitzImg from '@/assets/car-vitz.jpg';
import premioImg from '@/assets/car-premio.jpg';
import wishImg from '@/assets/car-wish.jpg';
import harrierImg from '@/assets/harrier-white.png';
import heroCarImg from '@/assets/hero-car.png';

const carsData = [
  {
    id: 'vitz',
    name: 'Toyota Vitz',
    tagline: 'Perfect for Ride-Hailing',
    priceUgx: 18000000,
    priceStr: '18M UGX',
    image: vitzImg,
    specs: { year: 2016, engine: '1.0L', transmission: 'Automatic', mileage: '65,000 km' }
  },
  {
    id: 'premio',
    name: 'Toyota Premio',
    tagline: 'Premium Sedan',
    priceUgx: 28000000,
    priceStr: '28M UGX',
    image: premioImg,
    specs: { year: 2015, engine: '1.8L', transmission: 'Automatic', mileage: '50,000 km' }
  },
  {
    id: 'wish',
    name: 'Toyota Wish',
    tagline: 'Ideal for Cargo/Family',
    priceUgx: 25000000,
    priceStr: '25M UGX',
    image: wishImg,
    specs: { year: 2014, engine: '1.8L', transmission: 'Automatic', mileage: '70,000 km' }
  },
  {
    id: 'harrier',
    name: 'Toyota Harrier',
    tagline: 'Luxury SUV',
    priceUgx: 85000000,
    priceStr: '85M UGX',
    image: harrierImg,
    specs: { year: 2017, engine: '2.0L Turbo', transmission: 'Automatic', mileage: '35,000 km' }
  },
  {
    id: 'noah',
    name: 'Toyota Noah',
    tagline: 'Spacious 7-Seater',
    priceUgx: 35000000,
    priceStr: '35M UGX',
    image: heroCarImg,
    specs: { year: 2015, engine: '2.0L', transmission: 'Automatic', mileage: '60,000 km' }
  },
  {
    id: 'passo',
    name: 'Toyota Passo',
    tagline: 'Compact & Efficient',
    priceUgx: 16000000,
    priceStr: '16M UGX',
    image: vitzImg,
    specs: { year: 2017, engine: '1.0L', transmission: 'Automatic', mileage: '48,000 km' }
  },
  {
    id: 'sienta',
    name: 'Toyota Sienta',
    tagline: 'Family Mini-Van',
    priceUgx: 22000000,
    priceStr: '22M UGX',
    image: wishImg,
    specs: { year: 2016, engine: '1.5L', transmission: 'Automatic', mileage: '55,000 km' }
  }
];

export default function VehiclesPage() {
  const navigate = useNavigate();
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [showFinancing, setShowFinancing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCars = carsData.filter(car => 
    car.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCar = carsData.find(c => c.id === selectedCarId);

  const carPrice = selectedCar ? selectedCar.priceUgx : 0;
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

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-purple-500/20 flex flex-col pb-24">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-16 flex-grow flex flex-col justify-start">
        <div className="max-w-3xl mx-auto w-full text-center space-y-6 mb-16">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight">Find your perfect car</h1>
            <p className="text-slate-500 text-lg font-medium mt-4">in just a few clicks</p>
          </div>
          
          <div className="flex items-center gap-2 max-w-lg mx-auto bg-white p-2 rounded-full border border-slate-200 shadow-sm shadow-slate-100">
            <div className="flex-1 flex items-center gap-2 px-4 text-slate-400">
              <Search size={20} />
              <input 
                type="text" 
                placeholder="Search vehicles..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 font-medium"
              />
            </div>
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition-colors">
              Search
            </button>
          </div>
        </div>

        {filteredCars.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-slate-500 font-medium">No vehicles found matching "{searchQuery}"</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car) => {
            const isSelected = selectedCarId === car.id;
            return (
              <div 
                key={car.id}
                onClick={() => setSelectedCarId(car.id)}
                className={`bg-white rounded-[32px] p-6 pb-8 flex flex-col justify-between cursor-pointer transition-all duration-300 ${
                  isSelected 
                    ? 'ring-4 ring-[#4c35e6] shadow-xl shadow-[#4c35e6]/20 -translate-y-2' 
                    : 'border border-slate-100 hover:border-slate-300 hover:shadow-lg hover:-translate-y-1'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">{car.name}</h3>
                    <p className="text-[#4c35e6] font-bold mt-1 text-sm">{car.tagline}</p>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="text-[#4c35e6] drop-shadow-sm" size={28} />
                  )}
                </div>
                <div className="py-8 relative">
                  <img src={car.image} alt={car.name} className="w-full h-40 rounded-2xl object-contain mix-blend-multiply drop-shadow-lg" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Price</span>
                    <span className="text-lg font-black text-slate-800">{car.priceStr}</span>
                  </div>
                  <button 
                    className={`px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all ${
                      isSelected 
                        ? 'bg-[#4c35e6] text-white shadow-[#4c35e6]/30' 
                        : 'bg-slate-100 text-slate-700 hover:bg-[#4c35e6] hover:text-white'
                    }`}
                  >
                    {isSelected ? 'Selected' : 'Select'}
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
                    <span className="text-[#4c35e6] bg-[#4c35e6]/10 px-3 py-1 rounded-full text-sm">{selectedCar.priceStr}</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowFinancing(true)}
                className="w-full sm:w-auto bg-[#4c35e6] hover:bg-[#3f2bc2] text-white px-8 py-4 rounded-xl font-bold text-[15px] shadow-lg shadow-[#4c35e6]/30 transition-all"
              >
                View Payment Schedule
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
              onClick={() => setShowFinancing(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setShowFinancing(false)}
                className="absolute top-6 right-6 w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors z-10"
              >
                <X size={24} />
              </button>

              <div className="p-8 md:p-12 lg:flex gap-12">
                <div className="lg:w-1/3 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-slate-100 pb-8 lg:pb-0 lg:pr-12">
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-2">{selectedCar.name}</h2>
                  <p className="text-lg text-[#4c35e6] font-bold mb-8">{selectedCar.priceStr}</p>
                  <img src={selectedCar.image} alt={selectedCar.name} className="w-full h-auto object-contain mix-blend-multiply drop-shadow-xl mb-8" />
                  
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Target Deposit (30%)</p>
                    <p className="text-3xl font-black text-[#4c35e6] mb-2">{formatCurrency(targetAmount)}</p>
                    <p className="text-sm font-medium text-slate-500">Required before handing over the vehicle. We finance the remaining 70%.</p>
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
                  <div className="mb-8 pr-12">
                    <h3 className="text-2xl font-bold text-slate-900">Choose your repayment schedule</h3>
                    <p className="text-slate-500 font-medium mt-2">Based on a 12-month loan for the 70% financed amount (with 30% flat interest).</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                    <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 hover:border-[#4c35e6] hover:shadow-lg transition-all cursor-pointer">
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Daily</p>
                      <p className="text-xl font-black text-slate-900">{formatCurrency(dailyPayment)}</p>
                      <p className="text-xs font-bold text-slate-400 mt-2">365 payments</p>
                    </div>
                    <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 hover:border-[#4c35e6] hover:shadow-lg transition-all cursor-pointer">
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Weekly</p>
                      <p className="text-xl font-black text-slate-900">{formatCurrency(weeklyPayment)}</p>
                      <p className="text-xs font-bold text-slate-400 mt-2">52 payments</p>
                    </div>
                    <div className="bg-white border-2 border-[#4c35e6] shadow-md shadow-[#4c35e6]/10 rounded-2xl p-6 cursor-pointer relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-[#4c35e6] text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-lg">POPULAR</div>
                      <p className="text-sm font-bold text-[#4c35e6] uppercase tracking-wider mb-2">Monthly</p>
                      <p className="text-xl font-black text-slate-900">{formatCurrency(monthlyPayment)}</p>
                      <p className="text-xs font-bold text-slate-400 mt-2">12 payments</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate('/logbook')}
                    className="w-full bg-slate-900 hover:bg-[#4c35e6] text-white font-bold py-4 rounded-2xl transition-colors shadow-xl"
                  >
                    Confirm & Proceed to KYC
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
