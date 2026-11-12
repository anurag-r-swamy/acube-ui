import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Navigation, Check, X, AlertCircle } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BENGALURU_LOCALITIES = [
  'Koramangala 4th Block',
  'Koramangala 6th Block',
  'Indiranagar 100ft Road',
  'Indiranagar Defense Colony',
  'HSR Layout Sector 1',
  'HSR Layout Sector 2',
  'Bellandur Outer Ring Road',
  'Whitefield ITPL Main Road',
  'Jayanagar 4th Block',
  'JP Nagar 7th Phase',
  'Malleshwaram 8th Cross',
  'Sadashivanagar',
  'BTM Layout 2nd Stage',
  'Electronic City Phase 1',
  'Marathahalli Bridge',
  'Hebbal Ring Road',
];

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const { selectedLocation, setSelectedLocation, locationPermission, setLocationPermission, showToast } = useApp();
  const [searchFilter, setSearchFilter] = useState('');
  const [isSimulatingGps, setIsSimulatingGps] = useState(false);

  if (!isOpen) return null;

  const handleSimulateGPS = () => {
    setIsSimulatingGps(true);
    setTimeout(() => {
      setIsSimulatingGps(false);
      setLocationPermission('GRANTED');
      setSelectedLocation('Koramangala 4th Block, Bengaluru');
      showToast('Location accurately determined via simulated GPS.', 'success');
      onClose();
    }, 800);
  };

  const handleDenyPermission = () => {
    setLocationPermission('DENIED');
    showToast('GPS permission denied. Please select a locality manually.', 'info');
  };

  const filteredLocalities = BENGALURU_LOCALITIES.filter((loc) =>
    loc.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-6 shadow-lifted max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-accent-light text-brand-accent flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Choose Your Location</h3>
              <p className="text-[11px] text-gray-500">Serving Bengaluru local areas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Permission Explainer */}
        <div className="py-3">
          {locationPermission === 'DENIED' ? (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mb-3 flex items-start gap-2.5 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Location Access Denied</p>
                <p className="text-[11px] text-amber-800">
                  Using manual Bengaluru locality selection. You can re-enable GPS simulation anytime.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-brand-accent-light border border-amber-200/60 rounded-xl mb-3">
              <div className="flex items-center gap-2.5">
                <Navigation className="w-4 h-4 text-brand-dark shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-brand-dark">Use Current Device Location</p>
                  <p className="text-[11px] text-brand-muted">Simulate high-accuracy GPS fix</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSimulateGPS}
                  disabled={isSimulatingGps}
                  className="px-3 py-1.5 bg-brand-dark hover:bg-brand-darker text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                >
                  {isSimulatingGps ? 'Locating...' : 'Allow GPS'}
                </button>
                <button
                  onClick={handleDenyPermission}
                  className="text-[11px] text-gray-500 hover:text-gray-700 underline"
                >
                  Deny
                </button>
              </div>
            </div>
          )}

          {/* Search Localities */}
          <div className="relative mb-2">
            <input
              type="text"
              placeholder="Search Bengaluru locality (e.g. Indiranagar, HSR...)"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full px-3.5 py-2 pl-9 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark/20 focus:border-brand-dark"
            />
            <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Localities List */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1 divide-y divide-gray-50">
          {filteredLocalities.map((loc) => {
            const isSelected = selectedLocation.startsWith(loc);
            return (
              <button
                key={loc}
                onClick={() => {
                  setSelectedLocation(`${loc}, Bengaluru`);
                  showToast(`Location set to ${loc}`, 'info');
                  onClose();
                }}
                className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-between text-left text-xs transition-colors ${
                  isSelected
                    ? 'bg-brand-dark text-white font-semibold'
                    : 'hover:bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-brand-accent' : 'text-gray-400'}`} />
                  <span>{loc}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-brand-accent" />}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-gray-100 mt-2 text-center text-[11px] text-gray-400">
          Currently serving all major zones in Bengaluru Urban district
        </div>
      </div>
    </div>
  );
};
