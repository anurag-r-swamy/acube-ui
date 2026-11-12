import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/branding';
import { WorkerProfile, ServiceCategory } from '../../types';
import {
  Search,
  SlidersHorizontal,
  X,
  Star,
  ShieldCheck,
  MapPin,
  Briefcase,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';

interface CustomerSearchProps {
  initialQuery?: string;
  onSelectWorker: (worker: WorkerProfile) => void;
  onBookWorker: (worker: WorkerProfile) => void;
  onSelectCategory: (category: ServiceCategory) => void;
}

export const CustomerSearch: React.FC<CustomerSearchProps> = ({
  initialQuery = '',
  onSelectWorker,
  onBookWorker,
  onSelectCategory,
}) => {
  const { categories, workerProfiles, selectedLocation } = useApp();

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<'RECOMMENDED' | 'RATING' | 'PRICE_ASC' | 'JOBS_DESC'>('RECOMMENDED');
  const [showFiltersModal, setShowFiltersModal] = useState<boolean>(false);

  // Filtered workers
  const filteredWorkers = useMemo(() => {
    return workerProfiles
      .filter((w) => w.verificationStatus === 'APPROVED')
      .filter((w) => {
        // Query search
        if (query.trim()) {
          const q = query.toLowerCase();
          const matchName = w.fullName.toLowerCase().includes(q);
          const matchCat = w.primaryCategory.toLowerCase().includes(q);
          const matchSkills = w.skills.some((s) => s.toLowerCase().includes(q));
          const matchAbout = w.about.toLowerCase().includes(q);
          if (!matchName && !matchCat && !matchSkills && !matchAbout) return false;
        }

        // Category filter
        if (selectedCategory !== 'ALL' && w.primaryCategory !== selectedCategory) {
          return false;
        }

        // Rating filter
        if (minRating > 0 && w.rating < minRating) {
          return false;
        }

        // Price filter
        if (w.baseFare > maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'RATING') return b.rating - a.rating;
        if (sortBy === 'PRICE_ASC') return a.baseFare - b.baseFare;
        if (sortBy === 'JOBS_DESC') return b.completedJobsCount - a.completedJobsCount;
        return 0; // Default
      });
  }, [workerProfiles, query, selectedCategory, minRating, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setQuery('');
    setSelectedCategory('ALL');
    setMinRating(0);
    setMaxPrice(1000);
    setSortBy('RECOMMENDED');
  };

  const activeFiltersCount =
    (selectedCategory !== 'ALL' ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (maxPrice < 1000 ? 1 : 0) +
    (sortBy !== 'RECOMMENDED' ? 1 : 0);

  return (
    <div className="space-y-4 pb-24 text-xs">
      {/* Search Header */}
      <div className="space-y-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search providers, skills, services (e.g. 'fan', 'leak')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-2.5 pl-9 pr-8 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-brand-dark shadow-xs"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-2.5 top-2.5 p-0.5 text-gray-400 hover:text-gray-600 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Chips Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setShowFiltersModal(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-colors ${
              activeFiltersCount > 0
                ? 'bg-brand-dark text-white border-brand-dark'
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-brand-accent text-white text-[10px] flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-xl border whitespace-nowrap text-xs font-semibold transition-colors ${
              selectedCategory === 'ALL'
                ? 'bg-brand-dark text-white border-brand-dark'
                : 'bg-white text-gray-700 border-gray-200'
            }`}
          >
            All Services
          </button>

          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.name)}
              className={`px-3 py-1.5 rounded-xl border whitespace-nowrap text-xs font-medium transition-colors ${
                selectedCategory === c.name
                  ? 'bg-brand-dark text-white border-brand-dark font-semibold'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Sort bar */}
      <div className="flex items-center justify-between text-gray-500 text-[11px] px-1">
        <span>
          Showing <strong>{filteredWorkers.length}</strong> verified professionals
        </span>
        <div className="flex items-center gap-1">
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent font-semibold text-gray-900 border-none outline-none cursor-pointer pr-1"
          >
            <option value="RECOMMENDED">Recommended</option>
            <option value="RATING">Highest Rating</option>
            <option value="PRICE_ASC">Lowest Base Fare</option>
            <option value="JOBS_DESC">Most Completed Jobs</option>
          </select>
        </div>
      </div>

      {/* Results List */}
      {filteredWorkers.length === 0 ? (
        <div className="py-12 bg-white rounded-2xl border border-gray-100 text-center p-6 space-y-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-sm">No matching professionals found</h3>
          <p className="text-gray-500 max-w-xs mx-auto text-xs">
            Try adjusting your search terms or lowering your filter criteria.
          </p>
          <button
            onClick={handleResetFilters}
            className="py-2 px-4 bg-brand-bg hover:bg-gray-100 text-brand-dark font-semibold rounded-xl text-xs border border-gray-200 inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredWorkers.map((worker) => (
            <div
              key={worker.id}
              className="p-4 bg-white rounded-2xl border border-gray-100 shadow-soft hover:shadow-medium transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="relative shrink-0 cursor-pointer" onClick={() => onSelectWorker(worker)}>
                  <img
                    src={worker.avatarUrl}
                    alt={worker.fullName}
                    className="w-14 h-14 rounded-2xl object-cover border border-gray-200"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-brand-accent text-white p-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="flex-1 cursor-pointer" onClick={() => onSelectWorker(worker)}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 text-sm hover:text-brand-dark">
                      {worker.fullName}
                    </h3>
                    <span className="font-extrabold text-brand-dark text-xs">
                      {APP_CONFIG.currencySymbol}{worker.baseFare}
                      <span className="text-[10px] text-gray-400 font-normal"> base</span>
                    </span>
                  </div>

                  <p className="text-gray-500 text-[11px] mt-0.5 line-clamp-1">{worker.headline}</p>

                  <div className="flex flex-wrap items-center gap-2.5 mt-2 text-[11px]">
                    <span className="flex items-center gap-0.5 text-brand-accent font-bold">
                      <Star className="w-3.5 h-3.5 fill-brand-accent" />
                      {worker.rating.toFixed(1)}
                      <span className="text-gray-400 font-normal">({worker.reviewCount})</span>
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-600 font-medium">
                      {worker.completedJobsCount} jobs
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold text-[10px]">
                      {worker.experienceYears}+ yrs exp
                    </span>
                  </div>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1 mt-3 pt-2.5 border-t border-gray-50">
                {worker.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="text-[10px] bg-brand-bg text-gray-700 px-2 py-0.5 rounded-md font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-3 pt-2">
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-brand-accent" />
                  <span className="truncate max-w-[150px]">{worker.serviceAreas.join(', ')}</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectWorker(worker)}
                    className="py-1.5 px-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => onBookWorker(worker)}
                    className="py-1.5 px-3.5 bg-brand-dark hover:bg-brand-darker text-white font-semibold rounded-xl shadow-xs"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filter Modal Drawer */}
      {showFiltersModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-6 shadow-lifted animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-gray-900 text-sm">Filter Search Results</h3>
              <button
                onClick={() => setShowFiltersModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">Minimum Rating</label>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 4.0, 4.5, 4.8].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setMinRating(r)}
                      className={`py-2 rounded-xl border text-center font-semibold ${
                        minRating === r
                          ? 'bg-brand-dark text-white border-brand-dark'
                          : 'bg-white border-gray-200 text-gray-700'
                      }`}
                    >
                      {r === 0 ? 'Any' : `${r}★ & up`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-gray-700">Max Base Rate</label>
                  <span className="font-bold text-brand-dark">
                    Up to {APP_CONFIG.currencySymbol}{maxPrice}
                  </span>
                </div>
                <input
                  type="range"
                  min={199}
                  max={1000}
                  step={50}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-brand-dark"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="py-2.5 px-4 border border-gray-200 text-gray-700 font-semibold rounded-xl"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setShowFiltersModal(false)}
                  className="flex-1 py-2.5 bg-brand-dark text-white font-semibold rounded-xl shadow"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

