import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/branding';
import { WorkerProfile } from '../../types';
import { HardHat, Search, Star, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';

export const AdminWorkers: React.FC = () => {
  const { workerProfiles } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);

  const filteredWorkers = workerProfiles.filter((w) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      w.fullName.toLowerCase().includes(q) ||
      w.primaryCategory.toLowerCase().includes(q) ||
      w.phone.includes(q) ||
      w.serviceAreas.some((a) => a.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-5 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-gray-900">Worker & Partner Directory</h1>
          <p className="text-gray-500 text-xs">Verified service professionals across trades and Bengaluru zones</p>
        </div>
        <span className="bg-brand-bg text-brand-dark font-bold px-2.5 py-1 rounded-full border border-gray-200">
          {workerProfiles.length} Total Registered Partners
        </span>
      </div>

      <div className="p-3 bg-white rounded-2xl border border-gray-200 shadow-soft flex items-center justify-between">
        <div className="relative min-w-[240px]">
          <input
            type="text"
            placeholder="Search worker by name, trade, area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-1.5 pl-8 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-xs"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 text-[10px] text-gray-400 uppercase tracking-wider bg-gray-50/50">
              <th className="py-3 px-4">Worker Partner</th>
              <th className="py-3 px-4">Primary Category</th>
              <th className="py-3 px-4">Base Rate</th>
              <th className="py-3 px-4">Completed Jobs</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4">Verification</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredWorkers.map((w) => (
              <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={w.avatarUrl}
                      alt={w.fullName}
                      className="w-9 h-9 rounded-xl object-cover border border-gray-200"
                    />
                    <div>
                      <p className="font-bold text-gray-900 text-xs">{w.fullName}</p>
                      <p className="text-[10px] text-gray-400">{w.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-medium text-gray-800">{w.primaryCategory}</td>
                <td className="py-3.5 px-4 font-bold text-gray-900">
                  {APP_CONFIG.currencySymbol}{w.baseFare}
                </td>
                <td className="py-3.5 px-4 font-semibold text-gray-700">{w.completedJobsCount}</td>
                <td className="py-3.5 px-4">
                  <span className="font-bold text-brand-accent flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-brand-accent" />
                    {w.rating.toFixed(1)}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`font-bold text-[10px] px-2 py-0.5 rounded-full ${
                      w.verificationStatus === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : w.verificationStatus === 'PENDING_REVIEW'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {w.verificationStatus.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => setSelectedWorker(w)}
                    className="py-1 px-2.5 bg-brand-bg hover:bg-brand-dark hover:text-white text-brand-dark font-semibold rounded-lg"
                  >
                    Dossier
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="max-w-md w-full bg-white rounded-2xl p-5 shadow-lifted space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2.5">
                <img src={selectedWorker.avatarUrl} alt="" className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{selectedWorker.fullName}</h3>
                  <p className="text-gray-500 text-[11px]">{selectedWorker.headline}</p>
                </div>
              </div>
              <button onClick={() => setSelectedWorker(null)} className="text-gray-400">✕</button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-gray-600 bg-gray-50 p-2.5 rounded-xl">{selectedWorker.about}</p>
              <div>
                <span className="font-bold text-gray-700 block mb-1">Localities Covered:</span>
                <p className="text-gray-600">{selectedWorker.serviceAreas.join(', ')}</p>
              </div>
              <div>
                <span className="font-bold text-gray-700 block mb-1">Bank Account:</span>
                <p className="text-gray-600">
                  {selectedWorker.bankDetails.bankName} ({selectedWorker.bankDetails.accountNumberMasked}) • UPI: {selectedWorker.bankDetails.upiId}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedWorker(null)}
              className="w-full py-2 bg-brand-dark text-white rounded-xl font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

