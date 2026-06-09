import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CreditCard, AlertTriangle, PiggyBank, Car, LogOut } from 'lucide-react';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const links = [
    { name: 'Executive', path: '/admin/executive', icon: LayoutDashboard },
    { name: 'Loans', path: '/admin/loans', icon: CreditCard },
    { name: 'Recovery', path: '/admin/recovery', icon: AlertTriangle },
    { name: 'Savings', path: '/admin/savings', icon: PiggyBank },
    { name: 'Dealers', path: '/admin/dealers', icon: Car },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-6">
          <h1 className="font-chewy text-2xl tracking-wide text-white">Welile Admin</h1>
          <p className="text-indigo-400 font-bold uppercase tracking-wider text-[10px] mt-1">Operations Portal</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {links.map(link => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  isActive 
                    ? 'bg-[#4e158e] text-white shadow-lg shadow-[#4e158e]/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} />
                {link.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} />
            Exit Portal
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
