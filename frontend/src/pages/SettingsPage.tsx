import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Bell, Monitor, Lock, CreditCard, Globe, AlertCircle, LogOut,
  ChevronRight, ArrowLeft, Camera, Phone, Mail, MapPin, 
  ShieldCheck, Smartphone, CheckCircle2, Search, Send, MessageSquare, FileText
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/lib/translations';

type SettingsSection = 'Menu' | 'Account' | 'Notification' | 'Display' | 'Privacy' | 'Payment' | 'Language' | 'Help';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { data: profile } = useProfile();
  const [activeSection, setActiveSection] = useState<SettingsSection>('Menu');
  
  // Toggles state
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [helpMessage, setHelpMessage] = useState('');
  const [helpSearchQuery, setHelpSearchQuery] = useState('');
  const { language: selectedLanguage, setLanguage: setSelectedLanguage, t } = useLanguage();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const slideVariants = {
    initial: { x: '10%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '10%', opacity: 0 }
  };

  const renderAccount = () => (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center py-6">
        <div className="relative w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-[#4e158e] shadow-sm mb-4">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover rounded-full" />
          ) : (
            <User size={40} />
          )}
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#4e158e] text-white rounded-full flex items-center justify-center border-2 border-white">
            <Camera size={14} />
          </button>
        </div>
        <h2 className="text-xl font-bold text-slate-900">{profile?.name || 'John Doe'}</h2>
        <p className="text-sm text-slate-500">Member since 2026</p>
      </div>

      <div className="space-y-3">
        <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-4 border border-slate-100">
          <Mail size={20} className="text-[#4e158e]" />
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">Email</p>
            <p className="font-medium text-slate-800">{profile?.email || 'john.doe@example.com'}</p>
          </div>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-4 border border-slate-100">
          <Phone size={20} className="text-[#4e158e]" />
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">Phone</p>
            <p className="font-medium text-slate-800">{profile?.phone || '+256 700 123 456'}</p>
          </div>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-4 border border-slate-100">
          <MapPin size={20} className="text-[#4e158e]" />
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">Residence</p>
            <p className="font-medium text-slate-800">{profile?.residence || 'Ntinda, Kampala'}</p>
          </div>
        </div>
      </div>
      
      <button className="w-full py-4 bg-[#4e158e] hover:bg-[#3f2bc2] transition-colors text-white font-bold rounded-xl mt-4">
        Save Changes
      </button>
    </div>
  );

  const renderNotification = () => (
    <div className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-slate-800">Push Notifications</p>
            <p className="text-xs text-slate-500">Receive alerts on your device</p>
          </div>
          <button 
            onClick={() => setPushEnabled(!pushEnabled)}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${pushEnabled ? 'bg-[#4e158e]' : 'bg-slate-300'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${pushEnabled ? 'translate-x-6' : ''}`} />
          </button>
        </div>
        <div className="h-[1px] bg-slate-200"></div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-slate-800">Email Alerts</p>
            <p className="text-xs text-slate-500">Receive weekly summaries</p>
          </div>
          <button 
            onClick={() => setEmailEnabled(!emailEnabled)}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${emailEnabled ? 'bg-[#4e158e]' : 'bg-slate-300'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${emailEnabled ? 'translate-x-6' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderDisplay = () => (
    <div className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Monitor size={20} className="text-[#4e158e]" />
            <span className="font-bold text-slate-800">Dark Mode</span>
          </div>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${darkMode ? 'bg-slate-800' : 'bg-slate-300'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-6' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="space-y-4">
      <button className="w-full bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100 p-4 rounded-xl flex items-center justify-between text-left group">
        <div className="flex items-center gap-3">
          <Lock size={20} className="text-[#4e158e]" />
          <div>
            <p className="font-bold text-slate-800">Change Password</p>
            <p className="text-xs text-slate-500">Update your security key</p>
          </div>
        </div>
        <ChevronRight size={18} className="text-slate-400 group-hover:text-slate-600" />
      </button>
      <button className="w-full bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100 p-4 rounded-xl flex items-center justify-between text-left group">
        <div className="flex items-center gap-3">
          <ShieldCheck size={20} className="text-[#4e158e]" />
          <div>
            <p className="font-bold text-slate-800">Two-Factor Auth</p>
            <p className="text-xs text-slate-500">Extra layer of security</p>
          </div>
        </div>
        <ChevronRight size={18} className="text-slate-400 group-hover:text-slate-600" />
      </button>
    </div>
  );

  const renderPayment = () => (
    <div className="space-y-4">
      <div className="bg-[#4e158e]/5 border border-[#4e158e]/20 p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Smartphone size={20} className="text-[#4e158e]" />
          <div>
            <p className="font-bold text-slate-800">MTN Mobile Money</p>
            <p className="text-xs text-slate-500">077* *** *12</p>
          </div>
        </div>
        <CheckCircle2 size={18} className="text-[#4e158e]" />
      </div>
      
      <button className="w-full py-4 bg-white border-2 border-dashed border-slate-200 text-slate-500 hover:text-[#4e158e] hover:border-[#4e158e] font-bold rounded-xl transition-colors">
        + Add Payment Method
      </button>
    </div>
  );

  const renderLanguage = () => {
    const languages = [
      'English (US)',
      'Luganda',
      'Swahili',
      'Runyankore',
      'Lusoga',
      'Kinyarwanda',
      'French'
    ];

    return (
      <div className="space-y-2 h-[60vh] overflow-y-auto pr-2 pb-10">
        {languages.map((lang, idx) => {
          const isSelected = selectedLanguage === lang;
          return (
            <button 
              key={idx} 
              onClick={() => {
                setSelectedLanguage(lang as Language);
                toast.success(`Language changed to ${lang}`);
              }}
              className={`w-full p-4 rounded-xl flex items-center justify-between transition-all border ${
                isSelected 
                  ? 'bg-[#4e158e]/5 border-[#4e158e]/20' 
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-100'
              }`}
            >
              <span className={isSelected ? 'font-bold text-[#4e158e]' : 'font-medium text-slate-700'}>
                {lang}
              </span>
              {isSelected && <CheckCircle2 size={18} className="text-[#4e158e]" />}
            </button>
          );
        })}
      </div>
    );
  };

  const handleSendMessage = () => {
    if (!helpMessage.trim()) return;
    toast.success("Message sent! Our support team will contact you shortly.");
    setHelpMessage('');
  };

  const renderHelp = () => {
    const articles = [
      { title: "What vehicles are available for financing?", body: "We offer motorcycles (Bajaj, TVS), sedans, and commercial trucks. Visit the Vehicles tab to browse the full catalog.", color: "bg-emerald-500" },
      { title: "How do I track my vehicle logbook process?", body: "You can track your logbook processing status directly from your dashboard at any time.", color: "bg-[#4e158e]" },
      { title: "What are the requirements for a vehicle loan?", body: "You will need a valid National ID, a registered guarantor, and a minimum initial deposit (usually 15%).", color: "bg-rose-400" },
      { title: "What happens if I miss an installment?", body: "A grace period is provided. Contact us immediately to arrange an alternative payment schedule.", color: "bg-blue-400" },
      { title: "Can I upgrade my vehicle?", body: "Yes, we offer flexible upgrade plans once you hit 50% repayment. Contact support for details.", color: "bg-amber-400" },
      { title: "Are the vehicles insured?", body: "All financed vehicles come with comprehensive insurance for the first year of the loan period.", color: "bg-teal-500" }
    ];

    const discussions = [
      { title: "Which motorcycle is best for Boda Boda?", date: "15 Oct 2026 • Vehicles", icon: Smartphone, color: "bg-emerald-500", shadow: "shadow-emerald-500/30" },
      { title: "How do I change my vehicle model?", date: "12 Oct 2026 • Financing", icon: FileText, color: "bg-[#4e158e]", shadow: "shadow-[#4e158e]/30" },
      { title: "Can I transfer ownership easily?", date: "08 Oct 2026 • Account", icon: User, color: "bg-rose-500", shadow: "shadow-rose-500/30" },
      { title: "What is the typical delivery time for a new car?", date: "02 Oct 2026 • Vehicles", icon: FileText, color: "bg-blue-400", shadow: "shadow-blue-400/30" }
    ];

    const filteredArticles = articles.filter(a => a.title.toLowerCase().includes(helpSearchQuery.toLowerCase()) || a.body.toLowerCase().includes(helpSearchQuery.toLowerCase()));
    const filteredDiscussions = discussions.filter(d => d.title.toLowerCase().includes(helpSearchQuery.toLowerCase()));

    return (
    <div className="space-y-6 pb-6 text-left h-[75vh] overflow-y-auto pr-2">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-[#4e158e]/10 text-[#4e158e] rounded-full flex items-center justify-center mx-auto mb-4 relative">
          <MessageSquare size={36} fill="currentColor" />
          <div className="absolute top-0 right-0 w-8 h-8 bg-[#310c87] text-white rounded-full flex items-center justify-center translate-x-1 -translate-y-1 border-2 border-white shadow-sm">
            <span className="font-black text-lg">?</span>
          </div>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">How can we<br/>help you today?</h2>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text" 
          value={helpSearchQuery}
          onChange={(e) => setHelpSearchQuery(e.target.value)}
          placeholder="How Can we Help..." 
          className="w-full bg-slate-50 border border-slate-100 rounded-full py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#4e158e]/20"
        />
      </div>

      {(filteredArticles.length > 0 || filteredDiscussions.length > 0) ? (
        <>
          {filteredArticles.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase mb-3 px-1">Top Articles</p>
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x pr-4 -mr-2">
                {filteredArticles.map((article, idx) => (
                  <div key={idx} className="min-w-[220px] snap-center bg-white border border-slate-100 rounded-2xl p-4 shadow-sm relative overflow-hidden">
                    <div className={`absolute top-0 left-0 right-0 h-1 ${article.color}`}></div>
                    <h4 className="font-bold text-slate-900 text-sm mb-2 leading-tight">{article.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{article.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredDiscussions.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase mb-3 px-1">Latest discussions</p>
              <div className="space-y-3">
                {filteredDiscussions.map((discussion, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-3 bg-slate-50 rounded-xl">
                    <div className={`w-10 h-10 ${discussion.color} rounded-full flex items-center justify-center text-white shrink-0 shadow-sm ${discussion.shadow}`}>
                      <discussion.icon size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-tight mb-1">{discussion.title}</h4>
                      <p className="text-[11px] text-slate-500">{discussion.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-slate-500 text-sm">No results found for "{helpSearchQuery}".</p>
          <p className="text-slate-400 text-xs mt-1">Try adjusting your search or send us an inquiry below.</p>
        </div>
      )}

      <div className="pt-2">
        <p className="text-xs font-bold text-slate-400 uppercase mb-3 px-1">Send an Inquiry</p>
        <p className="text-[11px] text-slate-500 mb-3 px-1">This message will be securely identified as coming from <strong>{profile?.name || 'you'}</strong> ({profile?.email || 'your email'}).</p>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={helpMessage}
            onChange={(e) => setHelpMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..." 
            className="flex-1 bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4e158e]/20"
          />
          <button 
            onClick={handleSendMessage}
            className="w-12 h-12 bg-[#4e158e] hover:bg-[#3f2bc2] text-white rounded-xl flex items-center justify-center transition-colors shrink-0 shadow-md shadow-[#4e158e]/25"
          >
            <Send size={18} className="-ml-0.5" />
          </button>
        </div>
      </div>
    </div>
    );
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'Account': return renderAccount();
      case 'Notification': return renderNotification();
      case 'Display': return renderDisplay();
      case 'Privacy': return renderPrivacy();
      case 'Payment': return renderPayment();
      case 'Language': return renderLanguage();
      case 'Help': return renderHelp();
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center selection:bg-[#4e158e]/20">
      <main className="w-full max-w-md bg-white min-h-screen shadow-2xl overflow-hidden relative">
        <div className="p-4 pt-10">
          <div className="flex items-center justify-center relative mb-8">
            <button 
              onClick={() => activeSection === 'Menu' ? navigate(-1) : setActiveSection('Menu')} 
              className="absolute left-0 p-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors z-10"
            >
              <ArrowLeft size={20} className="stroke-[2.5px]" />
            </button>
            <motion.h3 
              key={activeSection}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[17px] font-extrabold text-slate-900 tracking-tight"
            >
              {activeSection === 'Menu' ? t('settings.title.menu') : 
               activeSection === 'Account' ? t('settings.title.account') : 
               activeSection === 'Language' ? t('settings.title.language') : 
               activeSection === 'Help' ? t('settings.help') : activeSection}
            </motion.h3>
          </div>
          
          <AnimatePresence mode="wait">
            {activeSection === 'Menu' ? (
              <motion.div 
                key="menu"
                initial={{ x: '-10%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '-10%', opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="space-y-1"
              >
                {[
                  { icon: User, label: t('settings.account'), section: 'Account' },
                  { icon: Bell, label: t('settings.notification'), section: 'Notification' },
                  { icon: Monitor, label: t('settings.display'), section: 'Display' },
                  { icon: Lock, label: t('settings.privacy'), section: 'Privacy' },
                  { icon: CreditCard, label: t('settings.payment'), section: 'Payment' },
                  { icon: Globe, label: t('settings.language'), section: 'Language' },
                  { icon: AlertCircle, label: t('settings.help'), section: 'Help' },
                ].map((item, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveSection(item.section as SettingsSection)}
                    className="w-full flex items-center justify-between py-3.5 px-4 bg-white hover:bg-slate-50 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-4 text-slate-700 group-hover:text-slate-900">
                      <item.icon size={22} className="stroke-[1.5px]" />
                      <span className="font-semibold text-[15px]">{item.label}</span>
                    </div>
                    <ChevronRight size={20} className="text-slate-400 group-hover:text-slate-600" />
                  </button>
                ))}
                
                <button onClick={handleLogout} className="w-full flex items-center justify-between py-3.5 px-4 bg-white hover:bg-red-50 rounded-xl transition-colors group mt-4">
                  <div className="flex items-center gap-4 text-red-500 group-hover:text-red-600">
                    <LogOut size={22} className="stroke-[1.5px]" />
                    <span className="font-semibold text-[15px]">Logout</span>
                  </div>
                  <ChevronRight size={20} className="text-red-300 group-hover:text-red-500" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="subview"
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="px-2"
              >
                {renderActiveSection()}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}
