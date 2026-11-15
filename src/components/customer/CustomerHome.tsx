import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/branding';
import { WorkerProfile, ServiceCategory } from '../../types';
import { CategoryIcon } from '../common/Icons';
import {
  MapPin,
  Search,
  ChevronDown,
  Star,
  ShieldCheck,
  ArrowRight,
  Clock,
  PlusCircle,
  CheckCircle2,
  Briefcase,
  ChevronRight,
  Sparkles,
  BadgeCheck,
} from 'lucide-react';

interface CustomerHomeProps {
  onSelectCategory: (category: ServiceCategory) => void;
  onSelectWorker: (worker: WorkerProfile) => void;
  onOpenBookingFlow: (worker?: WorkerProfile) => void;
  onOpenLocationModal: () => void;
  onNavigateToBookings: () => void;
  onNavigateToSearch: (query?: string) => void;
}

const POPULAR_SEARCH_CHIPS = [
  'AC Servicing',
  'Deep Cleaning',
  'Electrician',
  'Plumber',
  'Water Purifier',
  'Carpentry',
];

const CURATED_SERVICES = [
  {
    id: 'srv-1',
    name: 'Split AC Deep Clean (Power Jet)',
    category: 'Electrical & Appliances',
    rating: 4.88,
    reviewsCount: '84k',
    price: 499,
    originalPrice: 799,
    discount: '37% off',
    tag: 'Bestseller',
    timeEst: '45 mins',
  },
  {
    id: 'srv-2',
    name: 'Bathroom Deep Cleaning & Stain Removal',
    category: 'Cleaning & Housekeeping',
    rating: 4.84,
    reviewsCount: '62k',
    price: 399,
    originalPrice: 599,
    discount: '33% off',
    tag: 'Popular',
    timeEst: '60 mins',
  },
  {
    id: 'srv-3',
    name: 'Switchboard, Socket & MCB Diagnostic',
    category: 'Electrical & Appliances',
    rating: 4.92,
    reviewsCount: '31k',
    price: 199,
    originalPrice: 299,
    discount: '33% off',
    tag: 'Quick Fix',
    timeEst: '30 mins',
  },
  {
    id: 'srv-4',
    name: 'Tap Leakage & Pipe Unclogging Repair',
    category: 'Plumbing & Sanitary',
    rating: 4.81,
    reviewsCount: '19k',
    price: 249,
    originalPrice: 399,
    discount: '38% off',
    tag: 'Standard',
    timeEst: '40 mins',
  },
];

export const CustomerHome: React.FC<CustomerHomeProps> = ({
  onSelectCategory,
  onSelectWorker,
  onOpenBookingFlow,
  onOpenLocationModal,
  onNavigateToBookings,
  onNavigateToSearch,
}) => {
  const {
    categories,
    workerProfiles,
    selectedLocation,
    bookings,
    currentUser,
    setIsAuthModalOpen,
    setAuthModalMode,
    setIsWorkerRegModalOpen,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  const activeBooking = bookings.find(
    (b) =>
      b.customerId === currentUser.id &&
      (b.status === 'IN_PROGRESS' || b.status === 'WORKER_ARRIVED' || b.status === 'ACCEPTED')
  );

  const approvedWorkers = workerProfiles.filter((w) => w.verificationStatus === 'APPROVED');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigateToSearch(searchQuery.trim());
    }
  };

  return (
    <div className="space-y-5 pb-24 text-slate-900 bg-white">
      {/* ================= CLEAN TOP LOCATION & PROFILE HEADER ================= */}
      <div className="flex items-center justify-between pt-2 px-1">
        {/* Location Selector */}
        <button
          onClick={onOpenLocationModal}
          className="flex items-center gap-2 py-1 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full transition-colors text-left"
        >
          <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
          <div className="truncate max-w-[170px]">
            <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">
              Location
            </span>
            <span className="text-xs font-bold text-slate-800 truncate block mt-0.5">
              {selectedLocation.split(',')[0]}
            </span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        </button>

        {/* User Account / Profile Button */}
        <button
          onClick={() => {
            setAuthModalMode('SIGN_UP');
            setIsAuthModalOpen(true);
          }}
          className="flex items-center gap-2 py-1 px-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full transition-colors"
          title="Account profile & sign-in"
        >
          <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-[11px] flex items-center justify-center">
            {currentUser.name.charAt(0)}
          </div>
          <span className="text-xs font-semibold text-slate-800">
            {currentUser.name.split(' ')[0]}
          </span>
        </button>
      </div>

      {/* ================= SEARCH INPUT & QUICK CHIPS ================= */}
      <div className="space-y-2 px-1">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Search for 'AC service', 'cleaning', 'plumber'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3 pl-11 pr-20 bg-slate-50 text-slate-900 rounded-2xl text-xs placeholder:text-slate-400 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 px-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-colors"
          >
            Search
          </button>
        </form>

        {/* Quick Search Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {POPULAR_SEARCH_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => onNavigateToSearch(chip)}
              className="shrink-0 py-1 px-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* ================= ACTIVE SERVICE IN PROGRESS BANNER ================= */}
      {activeBooking && (
        <div
          onClick={onNavigateToBookings}
          className="mx-1 p-4 bg-slate-900 text-white rounded-2xl shadow-soft cursor-pointer hover:bg-slate-800 transition-colors border border-slate-800 flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Service in Progress
              </span>
            </div>
            <h4 className="text-xs font-bold text-white">{activeBooking.serviceName}</h4>
            <p className="text-[11px] text-slate-400">
              {activeBooking.workerName ? `With ${activeBooking.workerName}` : 'Technician dispatched'} •{' '}
              <span className="text-slate-200 font-semibold">{activeBooking.status.replace('_', ' ')}</span>
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>
      )}

      {/* ================= EDITORIAL HERO CARD ================= */}
      <div className="mx-1 p-5 rounded-2xl bg-slate-900 text-white shadow-soft relative overflow-hidden">
        <div className="space-y-3 relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
              Verified Home Services
            </span>
            <span className="text-[10px] font-semibold bg-blue-600 text-white px-2 py-0.5 rounded-md">
              Fixed Rates
            </span>
          </div>

          <div>
            <h2 className="text-base font-extrabold text-white leading-tight">
              Professional AC Servicing & Power Jet Wash
            </h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Thorough indoor & outdoor jet clean, filter disinfection, and pressure check with 30-day warranty.
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-extrabold text-white">
                {APP_CONFIG.currencySymbol}499
              </span>
              <span className="text-xs text-slate-400 line-through">
                {APP_CONFIG.currencySymbol}799
              </span>
            </div>

            <button
              onClick={() => onOpenBookingFlow()}
              className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5"
            >
              <span>Book Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= SERVICE CATEGORIES (CLEAN GRID) ================= */}
      <div className="px-1">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900">Categories</h3>
          <button
            onClick={() => onNavigateToSearch()}
            className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-0.5"
          >
            <span>All</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {categories.slice(0, 8).map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat)}
              className="flex flex-col items-center p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-center group"
            >
              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-800 flex items-center justify-center mb-1.5 shadow-2xs group-hover:border-blue-500">
                <CategoryIcon name={cat.iconName} className="w-5 h-5 text-slate-700" />
              </div>
              <span className="text-[11px] font-semibold text-slate-800 leading-tight line-clamp-2">
                {cat.name.split('&')[0].trim()}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ================= CURATED SERVICES (URBAN COMPANY LEVEL) ================= */}
      <div className="px-1">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900">Most Booked Services</h3>
          <button
            onClick={() => onNavigateToSearch()}
            className="text-[11px] font-semibold text-blue-600 hover:underline"
          >
            View All
          </button>
        </div>

        <div className="space-y-2.5">
          {CURATED_SERVICES.map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                    {item.tag}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {item.timeEst}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 leading-tight">
                  {item.name}
                </h4>

                <div className="flex items-center gap-2 text-[11px]">
                  <span className="flex items-center gap-0.5 font-bold text-slate-800">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    {item.rating}
                  </span>
                  <span className="text-slate-400 text-[10px]">({item.reviewsCount})</span>
                </div>

                <div className="flex items-baseline gap-1.5 pt-0.5">
                  <span className="font-extrabold text-xs text-slate-900">
                    {APP_CONFIG.currencySymbol}{item.price}
                  </span>
                  <span className="text-[10px] text-slate-400 line-through">
                    {APP_CONFIG.currencySymbol}{item.originalPrice}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-600">
                    {item.discount}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onOpenBookingFlow()}
                className="shrink-0 py-1.5 px-3.5 bg-white hover:bg-slate-50 border border-blue-600 text-blue-600 font-bold rounded-lg text-xs transition-colors shadow-2xs"
              >
                Add +
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ================= GENERAL REQUEST BROADCAST ================= */}
      <div className="mx-1 p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold text-slate-900">Need a custom repair or quote?</h4>
          <p className="text-[11px] text-slate-500">
            Post your requirement and let available nearby experts respond.
          </p>
        </div>
        <button
          onClick={() => onOpenBookingFlow()}
          className="shrink-0 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl text-xs transition-colors flex items-center gap-1"
        >
          <PlusCircle className="w-3.5 h-3.5 text-blue-400" />
          <span>Post Request</span>
        </button>
      </div>

      {/* ================= TOP VERIFIED PROFESSIONALS ================= */}
      <div className="px-1">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900">Verified Local Technicians</h3>
          <button
            onClick={() => onNavigateToSearch()}
            className="text-[11px] font-semibold text-blue-600 hover:underline"
          >
            All ({approvedWorkers.length})
          </button>
        </div>

        <div className="space-y-2.5">
          {approvedWorkers.slice(0, 3).map((worker) => (
            <div
              key={worker.id}
              className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3"
            >
              <div
                onClick={() => onSelectWorker(worker)}
                className="flex items-center gap-3 cursor-pointer flex-1"
              >
                <div className="relative shrink-0">
                  <img
                    src={worker.avatarUrl}
                    alt={worker.fullName}
                    className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-0.5 rounded-full">
                    <BadgeCheck className="w-3 h-3" />
                  </div>
                </div>

                <div className="space-y-0.5">
                  <h4 className="font-bold text-slate-900 text-xs">
                    {worker.fullName}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{worker.headline}</p>

                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="flex items-center gap-0.5 text-slate-900 font-bold">
                      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                      {worker.rating.toFixed(1)}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-600">
                      {worker.completedJobsCount} jobs
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="font-semibold text-slate-800">
                      From {APP_CONFIG.currencySymbol}{worker.baseFare}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onOpenBookingFlow(worker)}
                className="shrink-0 py-1.5 px-3 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-800 font-semibold rounded-lg text-xs border border-slate-200 transition-colors"
              >
                Book
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ================= PARTNER REGISTRATION ENTRY ================= */}
      <div className="mx-1 p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <span className="text-[9px] font-bold uppercase tracking-wider text-blue-400 block">
            Partner Network
          </span>
          <h4 className="text-xs font-bold text-white">Join as a Service Partner in Bengaluru</h4>
          <p className="text-[11px] text-slate-400">
            DigiLocker verified pro onboarding with weekly settlements.
          </p>
        </div>
        <button
          onClick={() => setIsWorkerRegModalOpen(true)}
          className="shrink-0 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5"
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Join as Pro</span>
        </button>
      </div>

      {/* ================= QUALITY & TRUST PROMISE ================= */}
      <div className="mx-1 p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <h4 className="font-bold text-slate-900 text-xs">
            The {APP_CONFIG.parentCompany} Service Guarantee
          </h4>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
          <div className="flex items-start gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
            <span>DigiLocker Verified ID & Police Checked</span>
          </div>
          <div className="flex items-start gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
            <span>Standardized Upfront Pricing Quotes</span>
          </div>
          <div className="flex items-start gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
            <span>30-Day Service Re-work Warranty</span>
          </div>
          <div className="flex items-start gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
            <span>Escrow Payment Release After Work</span>
          </div>
        </div>
      </div>
    </div>
  );
};
