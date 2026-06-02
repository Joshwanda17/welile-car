import Navbar from '@/components/Navbar';
import { User, Phone, Mail, MapPin, ShieldCheck, LogOut, FileText, CheckCircle2, ChevronRight, Car } from 'lucide-react';

export default function ProfilePage() {
  // Mock customer details
  const customer = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+256 700 123 456",
    residence: "Ntinda, Kampala",
    kycStatus: "Verified",
    joinDate: "May 15, 2026",
    activeLoan: "Toyota Vitz (UBM 492X)"
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#4c35e6]/20 flex flex-col pb-24">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full flex-grow">
        
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">My Profile</h1>
          <p className="text-slate-500 font-medium mt-2">Manage your personal details and account settings.</p>
        </div>

        <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          
          {/* Header section with Avatar */}
          <div className="bg-[#4c35e6] p-8 sm:p-12 relative overflow-hidden flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20"></div>
            
            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-4xl sm:text-5xl font-black text-[#4c35e6]">
                  {customer.name.charAt(0)}
                </span>
              </div>
              <div className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1.5 sm:p-2 rounded-full shadow-md border-4 border-[#4c35e6]">
                <ShieldCheck size={20} />
              </div>
            </div>

            <div className="text-center sm:text-left text-white z-10">
              <h2 className="text-3xl font-black">{customer.name}</h2>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 opacity-80">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span className="text-sm font-bold uppercase tracking-wider">KYC {customer.kycStatus}</span>
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-12">
            
            {/* Details Grid */}
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FileText size={20} className="text-[#4c35e6]" />
              Personal Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#4c35e6] shadow-sm">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                  <p className="font-bold text-slate-800">{customer.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#4c35e6] shadow-sm">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</p>
                  <p className="font-bold text-slate-800">{customer.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#4c35e6] shadow-sm">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Residence</p>
                  <p className="font-bold text-slate-800">{customer.residence}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#4c35e6] shadow-sm">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Member Since</p>
                  <p className="font-bold text-slate-800">{customer.joinDate}</p>
                </div>
              </div>
            </div>

            {/* Account Settings / Actions */}
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Car size={20} className="text-[#4c35e6]" />
              Account Activity
            </h3>

            <div className="space-y-4 mb-12">
              <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-[#4c35e6] hover:shadow-md transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#4c35e6]/10 rounded-full flex items-center justify-center text-[#4c35e6] group-hover:bg-[#4c35e6] group-hover:text-white transition-colors">
                    <Car size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-900">Active Vehicle Loan</p>
                    <p className="text-sm font-medium text-slate-500">{customer.activeLoan}</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-400 group-hover:text-[#4c35e6]" />
              </button>
            </div>

            <button className="w-full sm:w-auto bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3.5 px-8 rounded-xl transition-colors flex items-center justify-center sm:justify-start gap-2">
              <LogOut size={18} />
              Log Out Securely
            </button>

          </div>
        </div>

      </main>
    </div>
  );
}
