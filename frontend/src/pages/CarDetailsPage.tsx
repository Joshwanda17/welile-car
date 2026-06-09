import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '@/config';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { carsData, Car } from '@/data/cars';
import { formatUGX } from '@/lib/format';
import { 
  ChevronLeft, CheckCircle2, ShieldCheck, MapPin, Star, 
  Settings, Fuel, Calendar, Car as CarIcon, Gauge, Users, 
  Droplet, AlertCircle, PhoneCall, CalendarPlus, ChevronRight 
} from 'lucide-react';

const CarDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  
  const [car, setCar] = useState<Car | null>(null);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [userSavings, setUserSavings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundCar = carsData.find(c => c.id === id);
    if (foundCar) {
      setCar(foundCar);
    } else {
      navigate('/vehicles');
    }
  }, [id, navigate]);

  useEffect(() => {
    if (session?.access_token) {
      fetch(`${API_URL}/dashboard/summary`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.savings) {
          setUserSavings(data.savings.totalSaved);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [session]);

  if (!car || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const requiredDeposit = car.priceUgx * 0.3;
  const financedAmount = car.priceUgx * 0.7;
  const remainingNeeded = Math.max(0, requiredDeposit - userSavings);
  const isEligible = remainingNeeded === 0;
  
  // Mock monthly installment (Financed amount + 30% interest spread over 36 months)
  const monthlyInstallment = (financedAmount * 1.3) / 36;

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans text-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-4 flex items-center gap-4">
        <button onClick={() => navigate('/vehicles')} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-bold text-lg">{car.name}</h1>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        
        {/* 1. Vehicle Images */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
          <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden relative mb-4 flex items-center justify-center">
            <img src={car.gallery[currentImageIdx]} alt={car.name} className="object-contain w-full h-full mix-blend-multiply" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {car.gallery.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setCurrentImageIdx(idx)}
                className={`w-20 h-14 rounded-xl border-2 flex items-center justify-center shrink-0 overflow-hidden ${currentImageIdx === idx ? 'border-primary' : 'border-transparent bg-slate-50'}`}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-contain mix-blend-multiply" />
              </button>
            ))}
          </div>
        </div>

        {/* Top Recommendation Info (Most important stuff first) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Basic Info & Pricing */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 leading-tight">{car.name}</h2>
                  <p className="text-slate-500 font-medium">{car.specs.year} Model • {car.type} • {car.specs.transmission}</p>
                </div>
              </div>
              <div className="mt-6 mb-8">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Vehicle Price</p>
                <p className="text-4xl font-black text-primary">{formatUGX(car.priceUgx)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 rounded-2xl p-4 flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500">Required Deposit (30%)</span>
                <span className="font-bold text-slate-900">{formatUGX(requiredDeposit)}</span>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500">Welile Financing (70%)</span>
                <span className="font-bold text-slate-900">{formatUGX(financedAmount)}</span>
              </div>
              <div className="bg-primary/5 rounded-2xl p-4 flex justify-between items-center border border-primary/10">
                <span className="text-sm font-bold text-primary">Est. Monthly Payment (36m)</span>
                <span className="font-black text-primary">{formatUGX(monthlyInstallment)}</span>
              </div>
            </div>
          </div>

          {/* Financing Eligibility Widget */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><ShieldCheck className="text-primary" /> Financing Eligibility</h3>
            
            <div className="space-y-6 flex-1">
              <div className="flex justify-between items-end border-b border-slate-100 pb-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Required Deposit</p>
                  <p className="text-xl font-bold text-slate-900">{formatUGX(requiredDeposit)}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-end border-b border-slate-100 pb-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Your Current Savings</p>
                  <p className="text-xl font-bold text-slate-900">{formatUGX(userSavings)}</p>
                </div>
              </div>

              {!isEligible ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Still Needed</p>
                  <p className="text-2xl font-black text-amber-600 mb-2">{formatUGX(remainingNeeded)}</p>
                  <p className="text-sm font-medium text-amber-800 flex items-center gap-2">
                    <AlertCircle size={16} /> Save {formatUGX(remainingNeeded)} more to qualify.
                  </p>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-emerald-700">Eligible for Financing</p>
                    <p className="text-sm text-emerald-600 font-medium">You have met the deposit requirement!</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-3">
              {!isEligible && (
                <button onClick={() => navigate('/wallet')} className="w-full bg-primary hover:bg-[#3f2bc2] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20">
                  Start Saving For This Vehicle
                </button>
              )}
              <button 
                disabled={!isEligible}
                className={`w-full font-bold py-4 rounded-xl transition-all ${isEligible ? 'bg-primary hover:bg-[#3f2bc2] text-white shadow-lg shadow-primary/20' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
              >
                Apply For Financing
              </button>
            </div>
          </div>
        </div>

        {/* Condition & Verification */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {car.condition.verified && (
            <div className="bg-blue-50 text-blue-700 border border-blue-100 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shrink-0">
              <CheckCircle2 size={16} /> Verified
            </div>
          )}
          {car.condition.inspected && (
            <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shrink-0">
              <CheckCircle2 size={16} /> Inspected
            </div>
          )}
          {car.condition.serviceRecords && (
            <div className="bg-purple-50 text-purple-700 border border-purple-100 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shrink-0">
              <CheckCircle2 size={16} /> Service Records Available
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Specifications */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Vehicle Specifications</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex gap-3">
                <Settings className="text-slate-400 shrink-0" size={20} />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Engine</p>
                  <p className="font-bold text-slate-900 text-sm">{car.specs.engine}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Fuel className="text-slate-400 shrink-0" size={20} />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Fuel</p>
                  <p className="font-bold text-slate-900 text-sm">{car.specs.fuel}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Gauge className="text-slate-400 shrink-0" size={20} />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Transmission</p>
                  <p className="font-bold text-slate-900 text-sm">{car.specs.transmission}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CarIcon className="text-slate-400 shrink-0" size={20} />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Mileage</p>
                  <p className="font-bold text-slate-900 text-sm">{car.specs.mileage}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Users className="text-slate-400 shrink-0" size={20} />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Seats</p>
                  <p className="font-bold text-slate-900 text-sm">{car.specs.seats}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Droplet className="text-slate-400 shrink-0" size={20} />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Color</p>
                  <p className="font-bold text-slate-900 text-sm">{car.specs.color}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Key Features</h3>
            <div className="flex flex-wrap gap-2">
              {car.features.map((feature, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Estimated Costs */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Estimated Monthly Costs</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 font-medium">Loan Payment</span>
                <span className="font-bold text-slate-900">{formatUGX(monthlyInstallment)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 font-medium">Insurance</span>
                <span className="font-bold text-slate-900">{formatUGX(car.estimatedCosts.insurance)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 font-medium">Fuel Estimate</span>
                <span className="font-bold text-slate-900">{formatUGX(car.estimatedCosts.fuel)}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-4">
                <span className="text-slate-600 font-medium">Maintenance</span>
                <span className="font-bold text-slate-900">{formatUGX(car.estimatedCosts.maintenance)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900">Total Monthly Cost</span>
                <span className="font-black text-primary text-lg">{formatUGX(monthlyInstallment + car.estimatedCosts.insurance + car.estimatedCosts.fuel + car.estimatedCosts.maintenance)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Dealer Info */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Dealer</p>
                <h4 className="font-bold text-lg text-slate-900">{car.dealer.name}</h4>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
                    <Star size={14} className="fill-amber-500" /> {car.dealer.rating}
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 text-sm font-medium">
                    <MapPin size={14} /> {car.dealer.location}
                  </div>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                <StoreIcon />
              </div>
            </div>

            {/* Verification Section */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                <ShieldCheck size={24} className="text-emerald-400" />
              </div>
              <div>
                <h4 className="font-bold mb-1">{car.verification.status}</h4>
                <p className="text-sm text-slate-400 font-medium">Inspected by {car.verification.inspector} on {car.verification.date}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all">
            <CalendarPlus size={18} /> Schedule Inspection
          </button>
          <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all">
            <PhoneCall size={18} /> Contact Dealer
          </button>
        </div>

      </div>
    </div>
  );
};

const StoreIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
)

export default CarDetailsPage;
