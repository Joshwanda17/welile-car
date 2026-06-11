import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

const LogbookPage = () => {
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto pb-24">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Vehicle Logbook</h1>
        <p className="text-slate-500 font-medium">Track and manage your vehicle logbook.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
          <FileText size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">No Logbook Found</h3>
        <p className="text-slate-500 text-center max-w-md">
          You currently don't have an active logbook process. Once your vehicle financing is approved and finalized, logbook tracking will be available here.
        </p>
      </motion.div>
    </div>
  );
};

export default LogbookPage;
