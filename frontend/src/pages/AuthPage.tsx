import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { X, Mail, Lock, EyeOff, Eye, User, Phone, MapPin } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(false); // Default to Sign Up
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [residence, setResidence] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { signIn, signUp, user, authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/vehicles');
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) setError(error);
    } else {
      if (!name || !email || !phone || !residence || !password) {
        setError('All fields are required');
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, name, phone, residence);
      if (error) setError(error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] font-sans text-slate-900 selection:bg-purple-500/20">
      <div className="p-6">
        <button onClick={() => navigate('/')} className="text-slate-900 hover:bg-slate-200 p-2 rounded-full transition">
          <X size={24} />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[420px] bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-slate-900">
              {isLogin ? 'Sign in to Welile Cars' : 'Create an account'}
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              {isLogin ? 'Welcome back! Please enter your details.' : 'Start your journey to car ownership today.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 rounded-xl border border-slate-200 outline-none focus:border-[#4c35e6] focus:ring-1 focus:ring-[#4c35e6] transition font-medium placeholder:text-slate-400"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 rounded-xl border border-slate-200 outline-none focus:border-[#4c35e6] focus:ring-1 focus:ring-[#4c35e6] transition font-medium placeholder:text-slate-400"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Residence"
                    value={residence}
                    onChange={e => setResidence(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 rounded-xl border border-slate-200 outline-none focus:border-[#4c35e6] focus:ring-1 focus:ring-[#4c35e6] transition font-medium placeholder:text-slate-400"
                  />
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-xl border border-slate-200 outline-none focus:border-[#4c35e6] focus:ring-1 focus:ring-[#4c35e6] transition font-medium placeholder:text-slate-400"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full h-14 pl-12 pr-12 rounded-xl border border-slate-200 outline-none focus:border-[#4c35e6] focus:ring-1 focus:ring-[#4c35e6] transition font-medium placeholder:text-slate-400"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>

            {isLogin && (
              <div className="flex justify-start">
                <button type="button" className="text-sm font-bold text-slate-700 hover:text-[#4c35e6] transition">
                  Forgot password? <span className="text-[#4c35e6]">Reset it</span>
                </button>
              </div>
            )}

            {error && <p className="text-red-500 text-sm font-semibold text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 mt-4 bg-[#4c35e6] text-white font-bold text-[15px] rounded-xl hover:bg-[#3f2bc2] transition disabled:opacity-50 shadow-lg shadow-[#4c35e6]/20"
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          {isLogin && (
            <div className="mt-6 space-y-3">
              <button className="w-full h-14 bg-white border border-slate-200 rounded-xl flex items-center justify-center gap-3 font-bold text-[15px] text-slate-700 hover:bg-slate-50 transition">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </button>
              <button className="w-full h-14 bg-white border border-slate-200 rounded-xl flex items-center justify-center gap-3 font-bold text-[15px] text-slate-700 hover:bg-slate-50 transition">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.05 2.53.68 3.14.68.65 0 2.02-.75 3.65-.63 1.5.05 2.76.62 3.52 1.63-2.95 1.69-2.45 5.53.51 6.67-.71 1.76-1.57 3.47-2.82 4.62zM15.03 2.14c-.6.76-1.48 1.25-2.43 1.22-.16-1.06.33-2.08.97-2.73.6-.74 1.54-1.25 2.45-1.25.13 1.05-.33 2.04-.99 2.76z"/>
                </svg>
                Sign in with Apple
              </button>
            </div>
          )}

          <p className="text-center text-sm font-bold text-slate-500 mt-8">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-[#4c35e6] hover:text-[#3f2bc2] transition"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
