import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Plus, CheckCircle2 } from 'lucide-react';

export const AdminServiceAreas: React.FC = () => {
  const { serviceAreas, showToast } = useApp();

  return (
    <div className="space-y-5 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-gray-900">Bengaluru Service Coverage Zones</h1>
          <p className="text-gray-500 text-xs">Manage operational zones, active partner density and dispatch areas</p>
        </div>
        <button
          onClick={() => showToast('Zone addition simulated in prototype state.', 'info')}
          className="py-2 px-3.5 bg-brand-dark text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4 text-brand-accent" />
          <span>Add Bengaluru Locality</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {serviceAreas.map((zone) => (
          <div
            key={zone.id}
            className="p-4 bg-white rounded-2xl border border-gray-200 shadow-soft space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-accent" />
                <h3 className="font-bold text-sm text-gray-900">{zone.zoneName}</h3>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  zone.status === 'ACTIVE'
                    ? 'bg-emerald-100 text-emerald-800'
                    : zone.status === 'HIGH_DEMAND'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-purple-100 text-purple-800'
                }`}
              >
                {zone.status.replace('_', ' ')}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-gray-400 block uppercase font-bold mb-1.5">
                Localities ({zone.localities.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {zone.localities.map((loc) => (
                  <span
                    key={loc}
                    className="px-2 py-0.5 bg-brand-bg text-gray-700 rounded-md font-medium text-[11px]"
                  >
                    {loc}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex justify-between text-gray-500 text-[11px]">
              <span>Active Partner Density:</span>
              <span className="font-bold text-brand-dark">{zone.activeWorkerCount} Pros</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

