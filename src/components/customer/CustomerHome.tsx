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
  HelpCircle,
  CheckCircle2,
  Calendar,
  Briefcase,
} from 'lucide-react';

interface CustomerHomeProps {
  onSelectCategory: (category: ServiceCategory) => void;
  onSelectWorker: (worker: WorkerProfile) => void;
  onOpenBookingFlow: (worker?: WorkerProfile) => void;
  onOpenLocationModal: () => void;
  onNavigateToBookings: () => void;
  onNavigateToSearch: (query?: string) => void;
}

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

  // Check if customer has an active in-progress or accepted booking
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
    <div className="space-y-5 pb-24">
      {/* Top Location Bar & Welcome */}
      <div className="flex items-center justify-between">
        <button
          onClick={onOpenLocationModal}
          className="flex items-center gap-1.5 text-left py-1 px-2.5 bg-white border border-gray-200 rounded-full shadow-xs hover:border-brand-dark transition-colors"
        >
          <MapPin className="w-4 h-4 text-brand-accent shrink-0" />
          <div className="truncate max-w-[200px]">
            <span className="block text-[10px] text-gray-400 font-semibold uppercase leading-tight">
              Location
            </span>
            <span className="text-xs font-bold text-gray-900 truncate">
              {selectedLocation.split(',')[0]}
            </span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        </button>

        <button
          onClick={() => {
            setAuthModalMode('SIGN_UP');
            setIsAuthModalOpen(true);
          }}
          className="text-right p-1 rounded-xl hover:bg-gray-100 transition-colors"
          title="Sign in or Register new account"
        >
          <span className="text-[10px] text-gray-500 block leading-tight">Namaskara,</span>
          <p className="text-xs font-bold text-gray-900 flex items-center justify-end gap-1">
            <span>{currentUser.name.split(' ')[0]}</span>
            <span className="text-[9px] bg-brand-bg text-brand-dark px-1.5 py-0.2 rounded border border-gray-200">
              Account ▾
            </span>
          </p>
        </button>
      </div>

      {/* Hero Banner / Search Bar */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark to-brand-light p-5 text-white shadow-lifted">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold text-brand-accent border border-white/10">
            <Sparkles className="w-3 h-3" />
            <span>Bengaluru Verified Home Services</span>
          </div>

          <h1 className="text-lg font-extrabold leading-snug">
            Need an Electrician, Plumber or Cleaner today?
          </h1>

          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search 'fan repair', 'AC service', 'deep cleaning'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2.5 pl-9 pr-20 bg-white text-gray-900 rounded-xl text-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent shadow"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-brand-accent hover:bg-brand-accent-hover text-white font-semibold rounded-lg text-xs transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Decorative corner glow */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-brand-accent/20 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* Active Booking Banner (if exists) */}
      {activeBooking && (
        <div
          onClick={onNavigateToBookings}
          className="p-3.5 bg-gradient-to-r from-emerald-900 to-brand-dark text-white rounded-2xl shadow-md cursor-pointer hover:shadow-lg transition-all border border-emerald-500/30"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Active Job in Progress</span>
            </div>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-mono">
              {activeBooking.referenceNumber}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-white text-sm">{activeBooking.serviceName}</p>
              <p className="text-white/70 text-[11px]">
                {activeBooking.workerName ? `With ${activeBooking.workerName}` : 'Awaiting worker arrival'} •{' '}
                <span className="text-brand-accent font-semibold">{activeBooking.status.replace('_', ' ')}</span>
              </p>
            </div>
            <span className="text-xs text-brand-accent font-semibold flex items-center gap-1">
              View Status <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      )}

      {/* Service Categories Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-900">Explore Services</h2>
          <button
            onClick={() => onNavigateToSearch()}
            className="text-[11px] font-semibold text-brand-dark hover:underline flex items-center gap-0.5"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {categories.slice(0, 6).map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat)}
              className="flex flex-col items-center p-3 rounded-2xl bg-white border border-gray-100 shadow-soft hover:shadow-medium hover:border-brand-dark/20 transition-all text-center group"
            >
              <div className="w-11 h-11 rounded-xl bg-brand-bg text-brand-dark group-hover:bg-brand-dark group-hover:text-brand-accent flex items-center justify-center transition-colors mb-1.5">
                <CategoryIcon name={cat.iconName} className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-gray-800 leading-tight line-clamp-2">
                {cat.name}
              </span>
              <span className="text-[10px] text-gray-400 mt-0.5">
                {cat.subcategories.length} services
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* "Don't know what to pick? Post a General Request" Card */}
      <div className="p-4 bg-brand-accent-light border border-amber-200/80 rounded-2xl flex items-center justify-between gap-3 shadow-soft">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-brand-dark uppercase tracking-wider bg-white/80 px-2 py-0.5 rounded">
            Fast Broadcast
          </span>
          <h3 className="text-xs font-bold text-brand-charcoal">
            Unsure which pro to pick?
          </h3>
          <p className="text-[11px] text-gray-600">
            Post your problem and let qualified nearby professionals accept your request.
          </p>
        </div>
        <button
          onClick={() => onOpenBookingFlow()}
          className="shrink-0 py-2.5 px-3.5 bg-brand-dark hover:bg-brand-darker text-white font-semibold rounded-xl text-xs shadow-sm transition-all flex items-center gap-1.5"
        >
          <PlusCircle className="w-3.5 h-3.5 text-brand-accent" />
          <span>Post Request</span>
        </button>
      </div>

      {/* Top Verified Bengaluru Professionals */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Recommended Verified Pros</h2>
            <p className="text-[11px] text-gray-500">Background checked & skill certified</p>
          </div>
          <button
            onClick={() => onNavigateToSearch()}
            className="text-[11px] font-semibold text-brand-dark hover:underline"
          >
            View All ({approvedWorkers.length})
          </button>
        </div>

        <div className="space-y-3">
          {approvedWorkers.slice(0, 4).map((worker) => (
            <div
              key={worker.id}
              className="p-3.5 bg-white rounded-2xl border border-gray-100 shadow-soft hover:shadow-medium transition-all flex items-center justify-between gap-3"
            >
              <div
                onClick={() => onSelectWorker(worker)}
                className="flex items-center gap-3 cursor-pointer flex-1"
              >
                <div className="relative shrink-0">
                  <img
                    src={worker.avatarUrl}
                    alt={worker.fullName}
                    className="w-13 h-13 rounded-xl object-cover border border-gray-200"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-brand-accent text-white p-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-gray-900 text-xs hover:text-brand-dark">
                      {worker.fullName}
                    </h3>
                  </div>
                  <p className="text-[11px] text-gray-500 line-clamp-1">{worker.headline}</p>

                  <div className="flex items-center gap-2 mt-1 text-[11px]">
                    <span className="flex items-center gap-0.5 text-brand-accent font-bold">
                      <Star className="w-3 h-3 fill-brand-accent" />
                      {worker.rating.toFixed(1)}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-600 font-medium">
                      {worker.completedJobsCount} jobs
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="font-bold text-brand-dark">
                      From {APP_CONFIG.currencySymbol}{worker.baseFare}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onOpenBookingFlow(worker)}
                className="shrink-0 py-2 px-3 bg-brand-bg hover:bg-brand-dark hover:text-white text-brand-dark font-semibold rounded-xl text-xs border border-gray-200 transition-colors"
              >
                Book
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Partner / Worker Registration Banner */}
      <div className="p-4 bg-gradient-to-r from-emerald-950 via-brand-dark to-brand-light text-white rounded-2xl shadow-lifted flex items-center justify-between gap-3 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-accent text-brand-charcoal px-2 py-0.5 rounded-full inline-block">
            Earn with {APP_CONFIG.parentCompany}
          </span>
          <h3 className="text-xs font-bold text-white">
            Register as a Verified Service Partner
          </h3>
          <p className="text-[11px] text-white/80 leading-tight">
            Join 500+ Bengaluru pros. Direct weekly payouts, Aadhaar DigiLocker verification, and smart job broadcasts.
          </p>
        </div>
        <button
          onClick={() => setIsWorkerRegModalOpen(true)}
          className="shrink-0 py-2.5 px-3.5 bg-brand-accent hover:bg-brand-accent-hover text-brand-charcoal font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 relative z-10"
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Register Now</span>
        </button>
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-brand-accent/20 rounded-full blur-lg pointer-events-none"></div>
      </div>

      {/* Trust & Safety Highlights */}
      <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-soft space-y-2.5">
        <h3 className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>The {APP_CONFIG.parentCompany} Trust Promise</span>
        </h3>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600">
          <div className="flex items-start gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>DigiLocker Verified ID & Aadhaar</span>
          </div>
          <div className="flex items-start gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>Upfront Fixed Diagnostic Quotes</span>
          </div>
          <div className="flex items-start gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>Dedicated Bengaluru Dispute Desk</span>
          </div>
          <div className="flex items-start gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>Escrow Payment Protection</span>
          </div>
        </div>
      </div>
    </div>
  );
};

