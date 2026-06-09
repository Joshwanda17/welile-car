import AdminLayout from '@/components/admin/AdminLayout';
import { Car, Key } from 'lucide-react';

const DealerDashboard = () => {
  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Dealer & Inventory Portal</h1>
        <p className="text-slate-500 font-medium mb-8">Manage vehicle inventory and track sales.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <Car size={24} className="text-blue-500 mb-4" />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Available Inventory</p>
            <p className="text-2xl font-black text-slate-800">42 Vehicles</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <Key size={24} className="text-emerald-500 mb-4" />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Vehicles Financed & Delivered</p>
            <p className="text-2xl font-black text-slate-800">18</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-8 text-center text-slate-400 font-bold">
          [Vehicle Inventory Table Scaffold]
        </div>
      </div>
    </AdminLayout>
  );
};

export default DealerDashboard;
