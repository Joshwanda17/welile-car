import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useSelectCar, CARS } from '@/hooks/useProfile';
import { motion } from 'framer-motion';
import { formatUGX } from '@/lib/format';
import BottomNav from '@/components/BottomNav';
import { Check } from 'lucide-react';
import carWish from '@/assets/car-wish.jpg';
import carPremio from '@/assets/car-premio.jpg';
import carVitz from '@/assets/car-vitz.jpg';

const carImages: Record<string, string> = {
  wish: carWish,
  premio: carPremio,
  vitz: carVitz,
};

const CarsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading } = useProfile();
  const selectCar = useSelectCar();

  if (!authLoading && !user) { navigate('/'); return null; }
  if (isLoading || !profile) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-6 pt-12 pb-4">
        <h1 className="text-2xl font-bold font-heading">Choose Your Car</h1>
        <p className="text-muted-foreground text-sm mt-1">Save 30% and unlock financing</p>
      </div>

      <div className="px-6 space-y-4">
        {CARS.map((car, i) => {
          const isSelected = profile.selected_car_id === car.id;
          const target = car.price * 0.3;

          return (
            <motion.div key={car.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-card rounded-2xl overflow-hidden card-shadow ${isSelected ? 'ring-2 ring-primary' : ''}`}>
              <img src={carImages[car.id]} alt={car.name} className="w-full h-44 object-cover" />
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold font-heading text-lg">{car.name}</h3>
                  {isSelected && (
                    <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center">
                      <Check size={14} className="text-primary-foreground" />
                    </div>
                  )}
                </div>
                <p className="text-xl font-bold font-heading text-gradient mt-1">{formatUGX(car.price)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Required 30%: <span className="font-semibold text-foreground">{formatUGX(target)}</span>
                </p>
                <button onClick={() => selectCar.mutate(car.id)}
                  className={`mt-3 w-full h-11 rounded-2xl text-sm font-semibold transition ${
                    isSelected ? 'bg-secondary text-secondary-foreground' : 'gradient-primary text-primary-foreground'
                  }`}>
                  {isSelected ? 'Selected' : 'Select Car'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
};

export default CarsPage;
