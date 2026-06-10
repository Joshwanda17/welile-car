import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(false);
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
    <div className="bg-surface font-body-md text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen relative overflow-hidden flex items-center justify-center pt-20 pb-16">
      
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-xl shadow-sm">
        <div className="max-w-[1280px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <span className="material-symbols-outlined text-primary text-3xl">directions_car</span>
            <span className="font-display-lg text-headline-sm font-bold text-primary tracking-tight">Welile Car</span>
          </div>
        </div>
      </header>

      {/* Atmospheric Background Element */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-secondary-container/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="container relative z-10 px-container-padding-mobile md:px-container-padding-desktop flex justify-center w-full max-w-[1280px]">
        {/* Auth Container */}
        <div className="bg-white/80 dark:bg-surface-container-highest shadow-[0px_4px_40px_rgba(78,21,143,0.08)] backdrop-blur-md w-full max-w-[500px] rounded-[24px] overflow-hidden border border-outline-variant/30">
          
          {/* Tab Headers */}
          <div className="flex border-b border-outline-variant/20">
            <button 
              type="button"
              className={`flex-1 py-5 font-headline-sm text-center transition-all ${!isLogin ? 'text-primary border-b-2 border-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container'}`}
              onClick={() => { setIsLogin(false); setError(''); }}
            >
              Sign Up
            </button>
            <button 
              type="button"
              className={`flex-1 py-5 font-headline-sm text-center transition-all ${isLogin ? 'text-primary border-b-2 border-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container'}`}
              onClick={() => { setIsLogin(true); setError(''); }}
            >
              Sign In
            </button>
          </div>

          <div className="p-8 md:p-12">
            {/* Header */}
            <div className="mb-8">
              <h1 className="font-display-lg text-headline-md text-primary mb-2">
                {isLogin ? 'Welcome Back' : 'Create an account'}
              </h1>
              <p className="text-on-surface-variant font-body-md">
                {isLogin ? 'Securely access your personalized automotive portal.' : 'Start your journey to car ownership today.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 transition-all duration-300">
              
              {!isLogin && (
                <>
                  <div className="relative border-b-2 border-outline-variant focus-within:border-primary transition-all">
                    <div className="flex items-center gap-3 py-2">
                      <span className="material-symbols-outlined text-outline">person</span>
                      <input 
                        className="w-full bg-transparent border-none focus:ring-0 p-0 text-on-surface placeholder:text-outline-variant font-body-md outline-none" 
                        placeholder="Full Name" 
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="relative border-b-2 border-outline-variant focus-within:border-primary transition-all">
                    <div className="flex items-center gap-3 py-2">
                      <span className="material-symbols-outlined text-outline">call</span>
                      <input 
                        className="w-full bg-transparent border-none focus:ring-0 p-0 text-on-surface placeholder:text-outline-variant font-body-md outline-none" 
                        placeholder="Phone Number" 
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="relative border-b-2 border-outline-variant focus-within:border-primary transition-all">
                    <div className="flex items-center gap-3 py-2">
                      <span className="material-symbols-outlined text-outline">location_on</span>
                      <input 
                        className="w-full bg-transparent border-none focus:ring-0 p-0 text-on-surface placeholder:text-outline-variant font-body-md outline-none" 
                        placeholder="Residence" 
                        type="text"
                        value={residence}
                        onChange={e => setResidence(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="relative border-b-2 border-outline-variant focus-within:border-primary transition-all">
                <div className="flex items-center gap-3 py-2">
                  <span className="material-symbols-outlined text-outline">mail</span>
                  <input 
                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-on-surface placeholder:text-outline-variant font-body-md outline-none" 
                    placeholder="Email Address" 
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="relative border-b-2 border-outline-variant focus-within:border-primary transition-all">
                <div className="flex items-center justify-between gap-3 py-2">
                  <div className="flex items-center gap-3 w-full">
                    <span className="material-symbols-outlined text-outline">lock</span>
                    <input 
                      className="w-full bg-transparent border-none focus:ring-0 p-0 text-on-surface placeholder:text-outline-variant font-body-md outline-none" 
                      placeholder="Password" 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                  <span 
                    className="material-symbols-outlined text-outline cursor-pointer hover:text-primary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </div>
              </div>

              {isLogin && (
                <div className="flex justify-end">
                  <a className="text-primary font-bold text-label-md hover:underline" href="#">Forgot Password?</a>
                </div>
              )}

              {error && <p className="text-error text-sm font-bold text-center">{error}</p>}

              <button 
                className="w-full bg-primary-container text-white py-4 rounded-xl font-bold text-body-lg shadow-lg hover:shadow-primary-container/20 hover:scale-[1.01] active:scale-[0.98] transition-all mt-4 disabled:opacity-50" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
              </button>
            </form>
          </div>

          {/* Social Login Section */}
          <div className="p-8 bg-surface-container-low/50 border-t border-outline-variant/10 text-center">
            <p className="text-label-md text-on-surface-variant mb-4 uppercase tracking-widest">Or continue with</p>
            <div className="flex justify-center gap-4">
              <button className="p-3 bg-white rounded-full border border-outline-variant/30 hover:border-primary/50 transition-all shadow-sm">
                <img alt="Google" className="w-6 h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0kbTo4OFWdzf6hLh25OgrYMywaiqZ4C81omnWRel688SUO-KH2tJ9tvpmskl9ZaqAlJ7Mk9s6iVB1PX8zCrkVAHergenB4jd4xDLQ8TIyrUfeZ4S1MPAh6XM0U1UtWTXwxW0gS5q6sLg6G4nPAAGsN1yEtrVaeeXM3PmEhK9CmVSEbpnTSHDbM6t31NE8hE2rpvVZnC4rX38IpxiTPBHjRkBPOtPVRDdiS6uSHFzsyGb5s7mV5rPDOli61iT_qems_H-F5r97QYfi"/>
              </button>
              <button className="p-3 bg-white rounded-full border border-outline-variant/30 hover:border-primary/50 transition-all shadow-sm flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.093 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.294h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.093 24 12.073z"/>
                </svg>
              </button>
              <button className="p-3 bg-white rounded-full border border-outline-variant/30 hover:border-primary/50 transition-all shadow-sm flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.92 19.38c-.89.87-1.87.73-2.8-.32-.99-.42-1.9-.44-2.95 0-1.31.56-2 .4-2.78-.32-3.13-2.68-2.48-9.67 2.68-9.92 1.23.04 2.3.62 2.86.62.59 0 1.84-.68 3.32-.57 1.36.05 2.51.56 3.2 1.48-2.68 1.54-2.23 5.03.46 6.07-.64 1.6-1.43 3.15-2.57 4.2zm-1.84-16.5c-.55.69-1.35 1.14-2.21 1.11-.15-.96.3-1.89.88-2.48.55-.67 1.4-.14 2.23-.14.12.95-.3 1.85-.9 2.51z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
