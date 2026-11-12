import React from 'react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/branding';
import { BarChart3, TrendingUp, Users, Calendar, CheckCircle2 } from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { bookings, transactions, categories, workerProfiles } = useApp();

  const totalGMV = transactions.reduce((acc, t) => acc + (t.isRefunded ? 0 : t.amount), 0);
  const completedCount = bookings.filter((b) => b.status === 'COMPLETED').length;
  const completionRate = bookings.length > 0 ? Math.round((completedCount / bookings.length) * 100) : 0;

  return (
    <div className="space-y-6 text-xs">
      <div>
        <h1 className="text-base font-bold text-gray-900">Marketplace Analytics & Reports</h1>
        <p className="text-gray-500 text-xs">
          High-level operational performance, category contribution, and fulfillment rates in Bengaluru
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-soft space-y-2">
          <span className="text-[10px] text-gray-400 uppercase font-bold">Total Platform Volume</span>
          <p className="text-2xl font-extrabold text-brand-dark">
            {APP_CONFIG.currencySymbol}{totalGMV.toLocaleString('en-IN')}
          </p>
          <p className="text-emerald-600 font-semibold text-[11px]">↑ +18.4% month-over-month (Simulated)</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-soft space-y-2">
          <span className="text-[10px] text-gray-400 uppercase font-bold">Job Fulfillment Rate</span>
          <p className="text-2xl font-extrabold text-brand-dark">{completionRate}%</p>
          <p className="text-gray-500 text-[11px]">{completedCount} of {bookings.length} jobs finalized</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-soft space-y-2">
          <span className="text-[10px] text-gray-400 uppercase font-bold">Active Bengaluru Fleet</span>
          <p className="text-2xl font-extrabold text-brand-dark">{workerProfiles.length} Pros</p>
          <p className="text-emerald-600 text-[11px] font-semibold">94% background verified</p>
        </div>
      </div>

      {/* Visual Bar Chart: Category Volume Breakdown */}
      <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-sm text-gray-900">Category Demand Distribution</h2>
            <p className="text-gray-500 text-[11px]">Percentage of total marketplace requests</p>
          </div>
          <span className="text-xs font-mono font-bold text-brand-dark">Bengaluru Metro</span>
        </div>

        <div className="space-y-3 pt-2">
          {[
            { name: 'Electrical & Appliances', pct: 36, color: 'bg-brand-dark' },
            { name: 'Plumbing & Sanitary', pct: 28, color: 'bg-emerald-700' },
            { name: 'Cleaning & Pest Control', pct: 18, color: 'bg-brand-accent' },
            { name: 'AC & Refrigeration', pct: 12, color: 'bg-blue-600' },
            { name: 'Carpentry & Furniture', pct: 6, color: 'bg-purple-600' },
          ].map((item) => (
            <div key={item.name} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-800">{item.name}</span>
                <span className="text-gray-600">{item.pct}%</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-500`}
                  style={{ width: `${item.pct}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

