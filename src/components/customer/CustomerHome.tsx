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
  Sparkles,
  Clock,
  PlusCircle,
  CheckCircle2,
  Briefcase,
  Zap,
  Award,
  ChevronRight,
  Flame,
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
  'AC Deep Clean',
  'Bathroom Scrub',
  'Switchboard Fix',
  'Water Purifier',
  'Plumber',
  'Fan Installation',
];

const CURATED_BESTSELLERS = [
  {
    id: 'bs-1',
    name: 'Split AC Power Jet Servicing',
    category: 'Electrical & Appliances',
    rating: 4.88,
    reviewsCount: '84k',
    price: 499,
    originalPrice: 799,
    discount: '37% OFF',
    tag: 'Bestseller',
    timeEst: '45 mins',
  },
  {
    id: 'bs-2',
    name: 'Intense Bathroom Deep Cleaning',
    category: 'Cleaning & Housekeeping',
    rating: 4.84,
    reviewsCount: '62k',
    price: 389,
    originalPrice: 599,
    discount: '35% OFF',
    tag: 'Popular',
    timeEst: '60 mins',
  },
  {
    id: 'bs-3',
    name: 'Smart Switch & MCB Diagnostics',
    category: 'Electrical & Appliances',
    rating: 4.92,
    reviewsCount: '31k',
    price: 199,
    originalPrice: 299,
    discount: '33% OFF',
    tag: 'Quick Fix',
    timeEst: '30 mins',
  },
  {
    id: 'bs-4',
    name: 'Kitchen Sink & Pipe Unclogging',
    category: 'Plumbing & Sanitary',
    rating: 4.81,
    reviewsCount: '19k',
    price: 249,
    originalPrice: 399,
    discount: '38% OFF',
    tag: 'Same Day',
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

  // Active in-progress or accepted booking
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
    <div className="space-y-6 pb-28 text-slate-900 bg-slate-50/50">
      {/* ================= TOP EDITORIAL HEADER ================= */}
      <div className="flex items-center justify-between pt-1">
        {/* Location Dropdown */}
        <button
          onClick={onOpenLocationModal}
          className="flex items-center gap-2 py-1 px-3 bg-white border border-slate-200/90 rounded-full shadow-xs hover:border-cyan-500 transition-all text-left group"
        >
          <div className="w-6 h-6 rounded-full bg-cyan-50 flex items-center justify-center shrink-0">
            <MapPin className="w-3.5 h-3.5 text-cyan-600" />
          </div>
          <div className="truncate max-w-[170px]">
            <span className="block text-[9px] text-slate-400 font-extrabold uppercase tracking-wider leading-none">
              Location
            </span>
            <span className="text-xs font-bold text-slate-900 truncate block mt-0.5 group-hover:text-cyan-700">
              {selectedLocation.split(',')[0]}
            </span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 group-hover:text-slate-600" />
        </button>

        {/* User Account / Welcome Pill */}
        <button
          onClick={() => {
            setAuthModalMode('SIGN_UP');
            setIsAuthModalOpen(true);
          }}
          className="flex items-center gap-2 py-1 px-2.5 bg-white border border-slate-200/90 rounded-full shadow-xs hover:border-cyan-500 transition-colors"
          title="Account Profile & Sign-In"
        >
          <div className="w-6 h-6 rounded-full bg-[#0A192F] text-cyan-400 font-extrabold text-[11px] flex items-center justify-center shrink-0">
            {currentUser.name.charAt(0)}
          </div>
          <span className="text-xs font-bold text-slate-800">
            {currentUser.name.split(' ')[0]}
          </span>
        </button>
      </div>

      {/* ================= URBAN COMPANY SEARCH EXPERIENCE ================= */}
      <div className="space-y-2.5">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Search for 'AC service', 'deep cleaning', 'electrician'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3.5 pl-11 pr-24 bg-white text-slate-900 rounded-2xl text-xs placeholder:text-slate-400 border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-3.5 bg-[#0A192F] hover:bg-slate-800 text-cyan-400 font-bold rounded-xl text-xs transition-colors flex items-center gap-1 shadow-xs"
          >
            <span>Find</span>
          </button>
        </form>

        {/* Quick Search Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {POPULAR_SEARCH_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => onNavigateToSearch(chip)}
              className="shrink-0 py-1 px-2.5 bg-white hover:bg-cyan-50 hover:border-cyan-400/60 border border-slate-200/90 rounded-full text-[11px] font-semibold text-slate-600 transition-all shadow-2xs"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* ================= ACTIVE BOOKING BANNER (IF IN PROGRESS) ================= */}
      {activeBooking && (
        <div
          onClick={onNavigateToBookings}
          className="p-4 bg-gradient-to-r from-[#0A192F] via-[#0F172A] to-slate-900 text-white rounded-3xl shadow-lifted cursor-pointer border border-cyan-500/30 hover:border-cyan-400 transition-all relative overflow-hidden group"
        >
          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                Live Active Service
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {activeBooking.referenceNumber}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                  {activeBooking.serviceName}
                </h4>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  {activeBooking.workerName ? `Assigned to ${activeBooking.workerName}` : 'Dispatching technician'} •{' '}
                  <span className="text-cyan-400 font-bold">{activeBooking.status.replace('_', ' ')}</span>
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-cyan-500/10 rounded-full blur-xl pointer-events-none"></div>
        </div>
      )}

      {/* ================= APPLE APP STORE STYLE FEATURED SPOTLIGHT CARD ================= */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#0A192F] via-[#0E2038] to-[#122A48] text-white p-5 shadow-lifted overflow-hidden border border-slate-800">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400">
              FEATURED SPOTLIGHT • BENGALURU
            </span>
            <span className="text-[10px] font-bold bg-cyan-500 text-slate-950 px-2 py-0.5 rounded-full shadow-xs">
              40% OFF
            </span>
          </div>

          <div>
            <h2 className="text-lg font-black text-white leading-tight">
              Master Split AC Power-Jet Overhaul
            </h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              High-pressure indoor & outdoor jet clean, cooling coil sterilization, and gas pressure check with a 30-day warranty.
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-cyan-300">
                {APP_CONFIG.currencySymbol}499
              </span>
              <span className="text-xs text-slate-400 line-through">
                {APP_CONFIG.currencySymbol}799
              </span>
            </div>

            <button
              onClick={() => onOpenBookingFlow()}
              className="py-2.5 px-4 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5 active:scale-95"
            >
              <span>Book Service</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Ambient Cyan glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* ================= SERVICE CATEGORIES (URBAN COMPANY GRID) ================= */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Categories
            </h3>
            <p className="text-[11px] text-slate-500">Standardized fixed-price local services</p>
          </div>
          <button
            onClick={() => onNavigateToSearch()}
            className="text-[11px] font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-0.5"
          >
            <span>See All</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {categories.slice(0, 8).map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat)}
              className="flex flex-col items-center p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-cyan-500/60 hover:shadow-soft hover:bg-cyan-50/20 transition-all text-center group"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-[#0A192F] text-slate-800 group-hover:text-cyan-400 flex items-center justify-center transition-all duration-200 mb-1.5 border border-slate-100 group-hover:border-slate-800 shadow-2xs">
                <CategoryIcon name={cat.iconName} className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-800 leading-tight line-clamp-2">
                {cat.name.split('&')[0].trim()}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ================= CURATED BESTSELLERS (URBAN COMPANY FORMAT) ================= */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-cyan-600" />
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Most Booked in Bengaluru
            </h3>
          </div>
          <button
            onClick={() => onNavigateToSearch()}
            className="text-[11px] font-bold text-cyan-700 hover:underline"
          >
            View Directory
          </button>
        </div>

        <div className="space-y-2.5">
          {CURATED_BESTSELLERS.map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-soft transition-all flex items-center justify-between gap-3"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200">
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
                    <Star className="w-3 h-3 text-cyan-500 fill-cyan-500" />
                    {item.rating}
                  </span>
                  <span className="text-slate-400 text-[10px]">({item.reviewsCount} reviews)</span>
                </div>

                <div className="flex items-baseline gap-1.5 pt-0.5">
                  <span className="font-extrabold text-xs text-slate-900">
                    {APP_CONFIG.currencySymbol}{item.price}
                  </span>
                  <span className="text-[10px] text-slate-400 line-through">
                    {APP_CONFIG.currencySymbol}{item.originalPrice}
                  </span>
                  <span className="text-[9px] font-extrabold text-cyan-700">
                    {item.discount}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onOpenBookingFlow()}
                className="shrink-0 py-2 px-3.5 bg-white hover:bg-cyan-50 border border-cyan-500 text-cyan-700 font-extrabold rounded-xl text-xs transition-colors shadow-2xs hover:shadow-xs active:scale-95"
              >
                Add +
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ================= GENERAL REQUEST BROADCAST PROMPT ================= */}
      <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3">
        <div className="space-y-1">
          <span className="text-[9px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
            Instant Match
          </span>
          <h4 className="text-xs font-bold text-slate-900">
            Unsure which pro to choose?
          </h4>
          <p className="text-[11px] text-slate-500 leading-tight">
            Describe your requirement and let available nearby experts accept your slot.
          </p>
        </div>
        <button
          onClick={() => onOpenBookingFlow()}
          className="shrink-0 py-2.5 px-3.5 bg-[#0A192F] hover:bg-slate-800 text-cyan-400 font-bold rounded-xl text-xs transition-all shadow-xs flex items-center gap-1.5"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Post Request</span>
        </button>
      </div>

      {/* ================= TOP VERIFIED PROFESSIONALS (APPLE APP STORE CARDS) ================= */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Top Rated Verified Pros
            </h3>
            <p className="text-[11px] text-slate-500">Background checked & skill certified</p>
          </div>
          <button
            onClick={() => onNavigateToSearch()}
            className="text-[11px] font-bold text-cyan-700 hover:underline"
          >
            All Pros ({approvedWorkers.length})
          </button>
        </div>

        <div className="space-y-3">
          {approvedWorkers.slice(0, 4).map((worker) => (
            <div
              key={worker.id}
              className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-soft transition-all flex items-center justify-between gap-3"
            >
              <div
                onClick={() => onSelectWorker(worker)}
                className="flex items-center gap-3 cursor-pointer flex-1"
              >
                <div className="relative shrink-0">
                  <img
                    src={worker.avatarUrl}
                    alt={worker.fullName}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-cyan-500 text-slate-950 p-0.5 rounded-full ring-2 ring-white">
                    <BadgeCheck className="w-3 h-3" />
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1">
                    <h4 className="font-bold text-slate-900 text-xs hover:text-cyan-700">
                      {worker.fullName}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{worker.headline}</p>

                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="flex items-center gap-0.5 text-cyan-700 font-extrabold">
                      <Star className="w-2.5 h-2.5 fill-cyan-500 text-cyan-500" />
                      {worker.rating.toFixed(1)}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-600 font-medium">
                      {worker.completedJobsCount} jobs
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="font-bold text-slate-900">
                      From {APP_CONFIG.currencySymbol}{worker.baseFare}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onOpenBookingFlow(worker)}
                className="shrink-0 py-1.5 px-3 bg-slate-50 hover:bg-[#0A192F] hover:text-cyan-400 text-slate-800 font-bold rounded-xl text-xs border border-slate-200 transition-colors"
              >
                Book
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ================= PARTNER REGISTRATION BANNER ================= */}
      <div className="p-4 bg-gradient-to-r from-[#0A192F] via-[#0E2038] to-[#122A48] text-white rounded-3xl shadow-lifted flex items-center justify-between gap-3 relative overflow-hidden border border-slate-800">
        <div className="space-y-1 relative z-10">
          <span className="text-[9px] font-extrabold uppercase tracking-widest bg-cyan-500 text-slate-950 px-2 py-0.5 rounded-full inline-block">
            PARTNER NETWORK
          </span>
          <h4 className="text-xs font-bold text-white">
            Are you a service professional in Bengaluru?
          </h4>
          <p className="text-[11px] text-slate-300 leading-tight">
            Register your trade, submit Aadhaar DigiLocker verification, and start receiving job requests.
          </p>
        </div>
        <button
          onClick={() => setIsWorkerRegModalOpen(true)}
          className="shrink-0 py-2.5 px-3.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 relative z-10"
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Register Now</span>
        </button>
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none"></div>
      </div>

      {/* ================= URBAN COMPANY STYLE TRUST PROMISE ================= */}
      <div className="p-4 bg-white rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-600" />
          <h4 className="font-extrabold text-slate-900 text-xs">
            The {APP_CONFIG.parentCompany} Quality Guarantee
          </h4>
        </div>
        <div className="grid grid-cols-2 gap-2.5 text-[11px] text-slate-600">
          <div className="flex items-start gap-2 p-2 bg-slate-50/80 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0 mt-0.5" />
            <span className="font-medium leading-tight">DigiLocker Verified ID & Aadhaar</span>
          </div>
          <div className="flex items-start gap-2 p-2 bg-slate-50/80 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0 mt-0.5" />
            <span className="font-medium leading-tight">Upfront Fixed Diagnostic Quotes</span>
          </div>
          <div className="flex items-start gap-2 p-2 bg-slate-50/80 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0 mt-0.5" />
            <span className="font-medium leading-tight">30-Day Service Re-work Warranty</span>
          </div>
          <div className="flex items-start gap-2 p-2 bg-slate-50/80 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0 mt-0.5" />
            <span className="font-medium leading-tight">Escrow Payment Protection</span>
          </div>
        </div>
      </div>
    </div>
  );
};
