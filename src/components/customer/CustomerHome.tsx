import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/branding';
import { WorkerProfile, ServiceCategory } from '../../types';
import {
  MapPin,
  Search,
  ChevronDown,
  Star,
  ShieldCheck,
  ArrowRight,
  Clock,
  Sparkles,
  Zap,
  Droplets,
  Wind,
  Hammer,
  Paintbrush,
  Scissors,
  Wrench,
  ChevronRight,
  Briefcase,
  X,
} from 'lucide-react';

interface CustomerHomeProps {
  onSelectCategory: (category: ServiceCategory) => void;
  onSelectWorker: (worker: WorkerProfile) => void;
  onOpenBookingFlow: (
    worker?: WorkerProfile,
    initialDetails?: { name: string; price: number; categoryName?: string }
  ) => void;
  onOpenLocationModal: () => void;
  onNavigateToBookings: () => void;
  onNavigateToProfile: () => void;
}

const POPULAR_SEARCH_CHIPS = [
  'AC Repair',
  'Electrician',
  'Cleaning',
  'Plumber',
  'Carpenter',
  'Painting',
];

const SEARCH_PLACEHOLDERS = [
  "Search for 'AC service & repair'...",
  "Search for 'Bathroom deep cleaning'...",
  "Search for 'Switchboard & fan repair'...",
  "Search for 'Kitchen chimney degreasing'...",
  "Search for 'Plumbing & tap leaks'...",
];

// Clean Service Categories
const UC_CATEGORIES = [
  {
    id: 'cat-4',
    name: 'AC Repair',
    icon: Wind,
  },
  {
    id: 'cat-3',
    name: 'Cleaning',
    icon: Sparkles,
  },
  {
    id: 'cat-1',
    name: 'Electrician',
    icon: Zap,
  },
  {
    id: 'cat-2',
    name: 'Plumber',
    icon: Droplets,
  },
  {
    id: 'cat-5',
    name: 'Carpenter',
    icon: Hammer,
  },
  {
    id: 'cat-6',
    name: 'Painting',
    icon: Paintbrush,
  },
  {
    id: 'cat-water',
    name: 'Purifier',
    icon: Wrench,
  },
  {
    id: 'cat-salon',
    name: 'Salon & Spa',
    icon: Scissors,
  },
];

// The 2 specific offer banners requested by user
const TWO_OFFER_BANNERS = [
  {
    id: 'banner-ac',
    tag: 'HOT SUMMER OFFER',
    title: 'Split AC Deep Clean',
    description: 'High-pressure power jet wash & 30-day warranty',
    price: 499,
    originalPrice: 799,
    discountBadge: '37% OFF',
    bgColor: 'bg-[#0D2218]',
    accentColor: 'text-[#85D2A6]',
    borderColor: 'border-[#1B4D3E]',
    serviceName: 'Split AC Deep Clean (Power Jet)',
  },
  {
    id: 'banner-elec',
    tag: 'INSTANT ASSIST',
    title: 'Electrician Doorstep (30m)',
    description: 'Short circuit, switchboard & fan quick repair',
    price: 199,
    originalPrice: 299,
    discountBadge: '33% OFF',
    bgColor: 'bg-[#0A0D0B]',
    accentColor: 'text-emerald-400',
    borderColor: 'border-slate-800',
    serviceName: 'Switchboard, Socket & MCB Diagnostic',
  },
];

// Curated Most Booked Services
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
    features: ['High-pressure jet wash', 'Antibacterial disinfection', '30-day warranty'],
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=240',
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
    features: ['Mechanized tile scrubbing', 'Hard water stain removal', 'Safe chemicals'],
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=240',
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
    features: ['Short circuit tracing', 'Modular switch repair', 'Load test & grounding check'],
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=240',
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
    features: ['Spindle & gasket resealing', 'P-trap drain clearout', 'Teflon sealing'],
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=240',
  },
  {
    id: 'srv-5',
    name: 'Kitchen Chimney & Baffle Degreasing',
    category: 'Cleaning & Housekeeping',
    rating: 4.86,
    reviewsCount: '22k',
    price: 699,
    originalPrice: 999,
    discount: '30% off',
    tag: 'Intense Clean',
    timeEst: '75 mins',
    features: ['Baffle filter chemical soak', 'Motor housing wipedown', 'Exhaust suction test'],
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=240',
  },
];

export const CustomerHome: React.FC<CustomerHomeProps> = ({
  onSelectCategory,
  onSelectWorker,
  onOpenBookingFlow,
  onOpenLocationModal,
  onNavigateToBookings,
  onNavigateToProfile,
}) => {
  const {
    categories,
    workerProfiles,
    selectedLocation,
    bookings,
    currentUser,
    setIsWorkerRegModalOpen,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Cycle placeholder smoothly
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const activeBooking = bookings.find(
    (b) =>
      b.customerId === currentUser.id &&
      (b.status === 'IN_PROGRESS' || b.status === 'WORKER_ARRIVED' || b.status === 'ACCEPTED')
  );

  const approvedWorkers = workerProfiles.filter((w) => w.verificationStatus === 'APPROVED');

  // Filtered services based on search query
  const filteredServices = searchQuery.trim()
    ? CURATED_SERVICES.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : CURATED_SERVICES;

  return (
    <div className="space-y-4 pb-20 text-slate-900 bg-white">
      {/* ================= TOP HEADER: LOCATION & PROFILE ================= */}
      <div className="flex items-center justify-between pt-1 px-1">
        {/* Location Dropdown */}
        <button
          onClick={onOpenLocationModal}
          className="flex items-center gap-2 py-1 px-2.5 rounded-full hover:bg-slate-50 transition-colors text-left group"
        >
          <div className="w-7 h-7 rounded-full bg-[#0D2218] text-white flex items-center justify-center shrink-0">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="truncate max-w-[200px]">
            <div className="flex items-center gap-1">
              <span className="text-xs font-black text-black tracking-tight">Home Location</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-black transition-colors" />
            </div>
            <span className="text-[11px] text-slate-500 truncate block">
              {selectedLocation.split(',')[0]}
            </span>
          </div>
        </button>

        {/* User Profile Avatar (Directly navigates to Profile) */}
        <button
          onClick={onNavigateToProfile}
          className="w-8 h-8 rounded-full bg-[#0D2218] text-white font-black text-xs flex items-center justify-center hover:opacity-90 transition-opacity ring-2 ring-emerald-500/30"
          title="My Profile"
        >
          {currentUser.name ? currentUser.name.charAt(0) : 'U'}
        </button>
      </div>

      {/* ================= INLINE SEARCH BAR ================= */}
      <div className="space-y-2 px-1">
        <div className="relative">
          <input
            type="text"
            placeholder={SEARCH_PLACEHOLDERS[placeholderIndex]}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2.5 pl-10 pr-10 bg-[#FBFBFA] text-black rounded-xl text-xs placeholder:text-slate-400 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D2218] transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>

        {/* Quick Search Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {POPULAR_SEARCH_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setSearchQuery(chip)}
              className={`shrink-0 py-1 px-2.5 rounded-lg text-[11px] font-semibold transition-colors ${
                searchQuery.toLowerCase() === chip.toLowerCase()
                  ? 'bg-[#0D2218] text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* ================= ACTIVE LIVE BOOKING (IF ANY) ================= */}
      {activeBooking && (
        <div
          onClick={onNavigateToBookings}
          className="mx-1 p-3 bg-[#0A0D0B] text-white rounded-2xl shadow-sm cursor-pointer hover:bg-black transition-colors border border-slate-800 flex items-center justify-between"
        >
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Live Job in Progress
              </span>
            </div>
            <h4 className="text-xs font-bold text-white">{activeBooking.serviceName}</h4>
            <p className="text-[11px] text-slate-400">
              {activeBooking.workerName ? `Technician: ${activeBooking.workerName}` : 'Technician assigned'} •{' '}
              <span className="text-slate-200 font-semibold">{activeBooking.status.replace('_', ' ')}</span>
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>
      )}

      {/* ================= ONLY THE 2 PROMO BANNERS ================= */}
      {!searchQuery && (
        <div className="px-1 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0D2218]">
              Featured Offers
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {TWO_OFFER_BANNERS.map((banner) => (
              <div
                key={banner.id}
                className={`p-3.5 rounded-2xl ${banner.bgColor} text-white border ${banner.borderColor} shadow-sm relative overflow-hidden`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black tracking-wider uppercase ${banner.accentColor}`}>
                        {banner.tag}
                      </span>
                      <span className="text-[9px] font-bold bg-white/10 text-white px-2 py-0.5 rounded-full border border-white/20">
                        {banner.discountBadge}
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-white leading-tight">
                      {banner.title}
                    </h3>
                    <p className="text-[11px] text-slate-300 leading-tight">
                      {banner.description}
                    </p>

                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-sm font-black text-white">
                        {APP_CONFIG.currencySymbol}{banner.price}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        {APP_CONFIG.currencySymbol}{banner.originalPrice}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      onOpenBookingFlow(undefined, {
                        name: banner.serviceName,
                        price: banner.price,
                      })
                    }
                    className="shrink-0 self-end py-1.5 px-4 bg-white text-[#0D2218] hover:bg-emerald-50 font-black rounded-xl text-xs transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <span>Book</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SERVICE CATEGORIES ================= */}
      <div className="px-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-black text-black uppercase tracking-wider">
            Categories
          </h3>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {UC_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const fullCat: ServiceCategory = categories.find((c) => c.id === cat.id) || {
              id: cat.id,
              name: cat.name,
              slug: cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
              description: `${cat.name} doorstep services`,
              iconName: 'Wrench',
              isActive: true,
              baseCommissionPct: 15,
              subcategories: [],
            };

            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(fullCat);
                  setSearchQuery(cat.name);
                }}
                className="flex flex-col items-center p-2.5 bg-[#FBFBFA] hover:bg-slate-100 rounded-xl border border-slate-200 transition-all text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-white text-[#0D2218] border border-slate-200 flex items-center justify-center mb-1.5 shadow-2xs group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5 text-[#0D2218]" />
                </div>
                <span className="text-[11px] font-bold text-black leading-tight">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= SEARCH RESULTS OR MOST BOOKED SERVICES ================= */}
      <div className="px-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-black text-black uppercase tracking-wider">
            {searchQuery ? `Search Results (${filteredServices.length})` : 'Most Booked Services'}
          </h3>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[11px] font-semibold text-[#0D2218] hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        {filteredServices.length === 0 ? (
          <div className="p-6 bg-[#FBFBFA] rounded-2xl border border-slate-200 text-center space-y-1">
            <p className="text-xs font-bold text-black">No services found for "{searchQuery}"</p>
            <p className="text-[11px] text-slate-500">
              Try searching for AC, Electrician, Plumber, or Cleaning
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredServices.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3 hover:border-[#0D2218] transition-all"
              >
                {/* Service Details */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#0D2218] text-white">
                      {item.tag}
                    </span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                      <Clock className="w-3 h-3" />
                      {item.timeEst}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-black leading-snug">
                    {item.name}
                  </h4>

                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="flex items-center gap-0.5 font-bold text-black">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      {item.rating}
                    </span>
                    <span className="text-slate-400 text-[10px]">({item.reviewsCount} reviews)</span>
                  </div>

                  <div className="flex items-baseline gap-1.5 pt-0.5">
                    <span className="font-black text-xs text-black">
                      {APP_CONFIG.currencySymbol}{item.price}
                    </span>
                    <span className="text-[10px] text-slate-400 line-through">
                      {APP_CONFIG.currencySymbol}{item.originalPrice}
                    </span>
                    <span className="text-[10px] font-bold text-[#0D2218]">
                      {item.discount}
                    </span>
                  </div>
                </div>

                {/* Right side: Thumbnail + Direct Book Button (No cart) */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                  />

                  <button
                    onClick={() =>
                      onOpenBookingFlow(undefined, {
                        name: item.name,
                        price: item.price,
                        categoryName: item.category,
                      })
                    }
                    className="py-1 px-4 bg-[#0D2218] hover:bg-black text-white font-bold rounded-lg text-xs transition-colors shadow-2xs"
                  >
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= VERIFIED EXPERTS NEARBY ================= */}
      <div className="px-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-black text-black uppercase tracking-wider">
            Verified Professionals
          </h3>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-0.5">
          {approvedWorkers.slice(0, 4).map((worker) => (
            <div
              key={worker.id}
              onClick={() => onSelectWorker(worker)}
              className="shrink-0 w-44 p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2 cursor-pointer hover:border-[#0D2218] transition-all"
            >
              <div className="flex items-center gap-2">
                <img
                  src={worker.avatarUrl}
                  alt={worker.fullName}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                />
                <div className="truncate">
                  <h4 className="text-xs font-bold text-black truncate">{worker.fullName}</h4>
                  <span className="text-[10px] text-slate-500 truncate block">
                    {worker.primaryCategory.split('&')[0]}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                <span className="flex items-center gap-0.5 font-bold text-black">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  {worker.rating.toFixed(1)}
                </span>
                <span className="font-extrabold text-[#0D2218] text-xs">
                  ₹{worker.hourlyRate}/hr
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= PARTNER OPPORTUNITY CALLOUT ================= */}
      <div className="mx-1 p-3.5 bg-[#0D2218] text-white rounded-2xl flex items-center justify-between gap-3 border border-[#1B4D3E]">
        <div className="space-y-0.5">
          <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400 block">
            Partner Network
          </span>
          <h4 className="text-xs font-bold text-white">Join as a Service Professional</h4>
          <p className="text-[10px] text-slate-300">Earn with ACube in Bengaluru</p>
        </div>
        <button
          onClick={() => setIsWorkerRegModalOpen(true)}
          className="shrink-0 py-1.5 px-3 bg-white hover:bg-slate-100 text-[#0D2218] font-bold rounded-xl text-xs transition-colors flex items-center gap-1 shadow-sm"
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Register</span>
        </button>
      </div>
    </div>
  );
};
