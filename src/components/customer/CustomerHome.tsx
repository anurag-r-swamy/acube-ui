import React, { useState, useEffect } from 'react';
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
  ShoppingCart,
  Bell,
  Plus,
  Minus,
  Percent,
  Award,
  Zap,
  Droplets,
  Wind,
  Hammer,
  Paintbrush,
  Scissors,
  Wrench,
  ThumbsUp,
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
  onNavigateToSearch: (query?: string) => void;
  onNavigateToNotifications?: () => void;
}

const POPULAR_SEARCH_CHIPS = [
  'AC Servicing',
  'Bathroom Cleaning',
  'Electrician',
  'Tap Leakage',
  'Water Purifier',
  'Carpentry',
];

const SEARCH_PLACEHOLDERS = [
  "Search for 'AC service & repair'...",
  "Search for 'Bathroom deep cleaning'...",
  "Search for 'Switchboard & fan repair'...",
  "Search for 'Kitchen chimney degreasing'...",
  "Search for 'Plumbing & tap leaks'...",
];

// Urban Company Visual Category Grid with soft pastel icon containers
const UC_CATEGORIES = [
  {
    id: 'cat-4',
    name: 'AC & Appliance',
    subtext: 'Repair & Gas Refill',
    icon: Wind,
    bgTint: 'bg-sky-50 text-sky-600 border-sky-100',
  },
  {
    id: 'cat-3',
    name: 'Cleaning & Pest',
    subtext: 'Deep Home & Bath',
    icon: Sparkles,
    bgTint: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  {
    id: 'cat-1',
    name: 'Electrician',
    subtext: 'Wiring & Fixtures',
    icon: Zap,
    bgTint: 'bg-amber-50 text-amber-600 border-amber-100',
  },
  {
    id: 'cat-2',
    name: 'Plumber',
    subtext: 'Pipes & Drainage',
    icon: Droplets,
    bgTint: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  {
    id: 'cat-5',
    name: 'Carpenter',
    subtext: 'Doors & Furniture',
    icon: Hammer,
    bgTint: 'bg-orange-50 text-orange-600 border-orange-100',
  },
  {
    id: 'cat-6',
    name: 'Painting',
    subtext: 'Waterproofing & Putty',
    icon: Paintbrush,
    bgTint: 'bg-rose-50 text-rose-600 border-rose-100',
  },
  {
    id: 'cat-water',
    name: 'Water Purifier',
    subtext: 'Native RO & Filter',
    icon: Wrench,
    bgTint: 'bg-teal-50 text-teal-600 border-teal-100',
  },
  {
    id: 'cat-salon',
    name: 'Salon & Spa',
    subtext: 'Women & Men',
    icon: Scissors,
    bgTint: 'bg-purple-50 text-purple-600 border-purple-100',
  },
];

// Urban Company Promotional Carousel Banners
const PROMO_BANNERS = [
  {
    id: 'banner-ac',
    tag: 'SUMMER COOLING FEST',
    title: 'Split AC Deep Clean (Powerjet)',
    subtitle: 'Thorough indoor & outdoor jet spray wash + 30-Day cooling warranty',
    price: 499,
    originalPrice: 799,
    discountBadge: '37% OFF',
    bgGradient: 'from-slate-900 via-slate-850 to-blue-950',
    accentColor: 'text-sky-400',
    buttonColor: 'bg-blue-600 hover:bg-blue-500',
  },
  {
    id: 'banner-clean',
    tag: 'HYGIENE SPECIAL',
    title: 'Intensive Bathroom Cleaning',
    subtitle: 'Mechanized hard water tile descaling and mirror buffing by vetted pros',
    price: 399,
    originalPrice: 599,
    discountBadge: '33% OFF',
    bgGradient: 'from-emerald-950 via-slate-900 to-slate-950',
    accentColor: 'text-emerald-400',
    buttonColor: 'bg-emerald-600 hover:bg-emerald-500',
  },
  {
    id: 'banner-elec',
    tag: 'INSTANT ASSIST',
    title: 'Electrician Doorstep in 30 Mins',
    subtitle: 'Short circuit tracing, MCB tripping, chandelier & ceiling fan mounting',
    price: 199,
    originalPrice: 299,
    discountBadge: '33% OFF',
    bgGradient: 'from-amber-950 via-slate-900 to-slate-950',
    accentColor: 'text-amber-400',
    buttonColor: 'bg-amber-600 hover:bg-amber-500',
  },
];

// Curated Most Booked Services (Urban Company Style)
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
    features: ['High-pressure indoor & outdoor jet wash', 'Filter antibacterial disinfection', '30-day cooling warranty'],
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
    features: ['Mechanized tile scrubbing', 'Hard water limescale removal', 'Safe eco-friendly chemicals'],
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
    features: ['Short circuit tracing', 'Modular switch replacement', 'Load test & safety grounding check'],
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
    features: ['Spindle & gasket resealing', 'P-trap drain clearout', 'Teflon thread sealing'],
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
    features: ['Baffle filter chemical soak', 'Motor housing wipedown', 'Exhaust suction testing'],
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=240',
  },
];

// Real Bengaluru Homeowner Testimonials
const CUSTOMER_REVIEWS = [
  {
    id: 'rev-1',
    customerName: 'Anandita Roy',
    area: 'Indiranagar, Bengaluru',
    service: 'Split AC Powerjet Service',
    rating: 5,
    date: '2 days ago',
    comment:
      'The technician arrived in 25 mins with a full uniform, ID badge, and pressure jet kit. The AC is chilling like day one! Completely transparent pricing.',
  },
  {
    id: 'rev-2',
    customerName: 'Vikram Menon',
    area: 'HSR Layout Sector 2',
    service: 'Bathroom Deep Cleaning',
    rating: 5,
    date: 'Yesterday',
    comment:
      'Unbelievable transformation of hard water marks on my shower glass and floor tiles. Cleaned thoroughly without any mess.',
  },
];

export const CustomerHome: React.FC<CustomerHomeProps> = ({
  onSelectCategory,
  onSelectWorker,
  onOpenBookingFlow,
  onOpenLocationModal,
  onNavigateToBookings,
  onNavigateToSearch,
  onNavigateToNotifications,
}) => {
  const {
    categories,
    workerProfiles,
    selectedLocation,
    bookings,
    notifications,
    currentUser,
    setIsAuthModalOpen,
    setAuthModalMode,
    setIsWorkerRegModalOpen,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Cart state: serviceId -> quantity
  const [cartItems, setCartItems] = useState<Record<string, number>>({});

  // Cycle placeholder text smoothly every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  // Cycle promo banner every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % PROMO_BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Compute Cart totals
  const totalCartCount = Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  const totalCartPrice = Object.entries(cartItems).reduce((sum, [srvId, qty]) => {
    const srv = CURATED_SERVICES.find((s) => s.id === srvId);
    return sum + (srv ? srv.price * qty : 0);
  }, 0);

  const handleAddToCart = (serviceId: string) => {
    setCartItems((prev) => ({
      ...prev,
      [serviceId]: (prev[serviceId] || 0) + 1,
    }));
  };

  const handleRemoveFromCart = (serviceId: string) => {
    setCartItems((prev) => {
      const next = { ...prev };
      if (next[serviceId] > 1) {
        next[serviceId] -= 1;
      } else {
        delete next[serviceId];
      }
      return next;
    });
  };

  const handleCheckoutCart = () => {
    if (totalCartCount === 0) {
      onOpenBookingFlow();
      return;
    }
    const addedServices = Object.entries(cartItems)
      .map(([id, qty]) => {
        const item = CURATED_SERVICES.find((s) => s.id === id);
        return item ? `${item.name} (x${qty})` : '';
      })
      .filter(Boolean)
      .join(' + ');

    onOpenBookingFlow(undefined, {
      name: addedServices,
      price: totalCartPrice,
    });
  };

  const activeBooking = bookings.find(
    (b) =>
      b.customerId === currentUser.id &&
      (b.status === 'IN_PROGRESS' || b.status === 'WORKER_ARRIVED' || b.status === 'ACCEPTED')
  );

  const approvedWorkers = workerProfiles.filter((w) => w.verificationStatus === 'APPROVED');
  const unreadNotifsCount = notifications.filter((n) => n.userId === currentUser.id && !n.isRead).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigateToSearch(searchQuery.trim());
    }
  };

  return (
    <div className="space-y-4 pb-28 text-slate-900 bg-white">
      {/* ================= URBAN COMPANY TOP HEADER (LOCATION & ACTIONS) ================= */}
      <div className="flex items-center justify-between pt-1 px-1">
        {/* Location Dropdown */}
        <button
          onClick={onOpenLocationModal}
          className="flex items-center gap-1.5 py-1 px-2.5 rounded-full hover:bg-slate-50 transition-colors text-left group"
        >
          <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="truncate max-w-[170px]">
            <div className="flex items-center gap-1">
              <span className="text-xs font-black text-slate-900 tracking-tight">Home</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-600 transition-colors" />
            </div>
            <span className="text-[11px] text-slate-500 truncate block">
              {selectedLocation.split(',')[0]}
            </span>
          </div>
        </button>

        {/* Top Right Utilities: Cart + Notifications + Profile */}
        <div className="flex items-center gap-1.5">
          {/* Cart Icon Button with dynamic count */}
          <button
            onClick={handleCheckoutCart}
            className="relative p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
            title="View Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute 0 top-0.5 right-0.5 w-4 h-4 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => onNavigateToNotifications?.()}
            className="relative p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
            title="Alerts"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
            )}
          </button>

          {/* User Profile Avatar */}
          <button
            onClick={() => {
              setAuthModalMode('SIGN_UP');
              setIsAuthModalOpen(true);
            }}
            className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center hover:opacity-90 transition-opacity ml-1 ring-2 ring-slate-100"
            title="User Account"
          >
            {currentUser.name.charAt(0)}
          </button>
        </div>
      </div>

      {/* ================= SEARCH INPUT PILL WITH ROTATING PLACEHOLDER ================= */}
      <div className="space-y-2 px-1">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder={SEARCH_PLACEHOLDERS[placeholderIndex]}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3 pl-11 pr-20 bg-slate-50 text-slate-900 rounded-2xl text-xs placeholder:text-slate-400 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs"
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

      {/* ================= ACTIVE LIVE SERVICE BANNER (IF BOOKING IN PROGRESS) ================= */}
      {activeBooking && (
        <div
          onClick={onNavigateToBookings}
          className="mx-1 p-3.5 bg-slate-900 text-white rounded-2xl shadow-soft cursor-pointer hover:bg-slate-850 transition-colors border border-slate-800 flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Live Job in Progress
              </span>
            </div>
            <h4 className="text-xs font-bold text-white">{activeBooking.serviceName}</h4>
            <p className="text-[11px] text-slate-400">
              {activeBooking.workerName ? `Technician: ${activeBooking.workerName}` : 'Technician dispatched'} •{' '}
              <span className="text-slate-200 font-semibold">{activeBooking.status.replace('_', ' ')}</span>
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>
      )}

      {/* ================= URBAN COMPANY HERO PROMO CAROUSEL ================= */}
      <div className="mx-1 relative">
        {PROMO_BANNERS.map((banner, index) => {
          if (index !== activeBannerIndex) return null;
          return (
            <div
              key={banner.id}
              className={`p-4 rounded-2xl bg-gradient-to-br ${banner.bgGradient} text-white shadow-soft relative overflow-hidden transition-all duration-300`}
            >
              <div className="space-y-2 relative z-10">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase tracking-wider ${banner.accentColor}`}>
                    {banner.tag}
                  </span>
                  <span className="text-[10px] font-bold bg-white/10 backdrop-blur-md text-white px-2 py-0.5 rounded-full border border-white/20">
                    {banner.discountBadge}
                  </span>
                </div>

                <div>
                  <h2 className="text-base font-extrabold text-white leading-tight">
                    {banner.title}
                  </h2>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {banner.subtitle}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-black text-white">
                      {APP_CONFIG.currencySymbol}{banner.price}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      {APP_CONFIG.currencySymbol}{banner.originalPrice}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      onOpenBookingFlow(undefined, {
                        name: banner.title,
                        price: banner.price,
                      })
                    }
                    className={`py-1.5 px-3.5 ${banner.buttonColor} text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1 shadow-sm`}
                  >
                    <span>Book Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Carousel Slide Indicators */}
        <div className="flex items-center justify-center gap-1.5 pt-2">
          {PROMO_BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveBannerIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                activeBannerIndex === idx ? 'w-5 bg-blue-600' : 'w-1.5 bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ================= URBAN COMPANY CATEGORIES (WHAT ARE YOU LOOKING FOR?) ================= */}
      <div className="px-1">
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">All Services</h3>
            <p className="text-[11px] text-slate-500">Fixed rate cards & verified local experts</p>
          </div>
          <button
            onClick={() => onNavigateToSearch()}
            className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-0.5"
          >
            <span>See Catalog</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {UC_CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            // Match with mock category if available
            const matchedCategory = categories.find((c) => c.id === cat.id) || categories[0];
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(matchedCategory)}
                className="flex flex-col items-center p-2 rounded-2xl bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all text-center group shadow-2xs"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-1.5 border transition-transform group-hover:scale-105 ${cat.bgTint}`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-slate-800 leading-tight line-clamp-1">
                  {cat.name}
                </span>
                <span className="text-[9px] text-slate-400 leading-none mt-0.5 line-clamp-1">
                  {cat.subtext}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= URBAN COMPANY "UC PLUS" MEMBERSHIP BANNER ================= */}
      <div className="mx-1 p-3.5 bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 text-white rounded-2xl border border-slate-800 flex items-center justify-between shadow-soft">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[9px] font-black uppercase tracking-wider">
              UC Plus
            </span>
            <span className="text-xs font-bold text-white">Save 15% on every booking</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Free ₹10,000 damage protection + Priority weekend slots
          </p>
        </div>
        <button
          onClick={() => onOpenBookingFlow()}
          className="shrink-0 py-1.5 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-2xs"
        >
          Join ₹299
        </button>
      </div>

      {/* ================= MOST BOOKED SERVICES (INTERACTIVE ADD TO CART STEPPER) ================= */}
      <div className="px-1">
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">Most Booked Services</h3>
            <p className="text-[11px] text-slate-500">Trusted by 1.2M+ Bengaluru homeowners</p>
          </div>
          <button
            onClick={() => onNavigateToSearch()}
            className="text-[11px] font-bold text-blue-600 hover:underline"
          >
            View All
          </button>
        </div>

        <div className="space-y-2.5">
          {CURATED_SERVICES.map((item) => {
            const quantity = cartItems[item.id] || 0;
            return (
              <div
                key={item.id}
                className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3 hover:border-slate-300 transition-all"
              >
                {/* Service Details */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                      {item.tag}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                      <Clock className="w-3 h-3" />
                      {item.timeEst}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    {item.name}
                  </h4>

                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="flex items-center gap-0.5 font-bold text-slate-900">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      {item.rating}
                    </span>
                    <span className="text-slate-400 text-[10px]">({item.reviewsCount} reviews)</span>
                  </div>

                  <div className="flex items-baseline gap-1.5 pt-0.5">
                    <span className="font-black text-xs text-slate-900">
                      {APP_CONFIG.currencySymbol}{item.price}
                    </span>
                    <span className="text-[10px] text-slate-400 line-through">
                      {APP_CONFIG.currencySymbol}{item.originalPrice}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600">
                      {item.discount}
                    </span>
                  </div>
                </div>

                {/* Right side: Thumbnail + Interactive Add Stepper */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-100"
                  />

                  {/* Urban Company "+ Add" or "- 1 +" stepper */}
                  {quantity === 0 ? (
                    <button
                      onClick={() => handleAddToCart(item.id)}
                      className="py-1 px-4 bg-white hover:bg-blue-50 border border-blue-600 text-blue-600 font-bold rounded-lg text-xs transition-colors shadow-2xs"
                    >
                      + Add
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-blue-600 text-white rounded-lg px-2 py-0.5 shadow-xs">
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="p-0.5 hover:opacity-80"
                        title="Remove"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-black min-w-[12px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleAddToCart(item.id)}
                        className="p-0.5 hover:opacity-80"
                        title="Add more"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= THE URBAN COMPANY PROMISE (QUALITY & SAFETY) ================= */}
      <div className="mx-1 p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h4 className="font-black text-slate-900 text-xs">
              The {APP_CONFIG.parentCompany} Promise
            </h4>
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Verified Standard
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
          <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1 font-bold text-slate-900">
              <BadgeCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Verified Experts</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Aadhaar authenticated & police background checked
            </p>
          </div>

          <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1 font-bold text-slate-900">
              <Percent className="w-3.5 h-3.5 text-blue-600" />
              <span>Upfront Pricing</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Standardized rate card with no hidden quote bargaining
            </p>
          </div>

          <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1 font-bold text-slate-900">
              <Award className="w-3.5 h-3.5 text-blue-600" />
              <span>30-Day Warranty</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Free rework if service is not 100% satisfactory
            </p>
          </div>

          <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1 font-bold text-slate-900">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Escrow Security</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Funds held safe; released only after completion OTP
            </p>
          </div>
        </div>
      </div>

      {/* ================= VERIFIED HOMEOWNER REVIEWS ================= */}
      <div className="px-1">
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">Customer Testimonials</h3>
            <p className="text-[11px] text-slate-500">4.84 ★ rating from 1.2M+ happy homes</p>
          </div>
          <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            4.84 / 5
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {CUSTOMER_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1.5 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center">
                    {rev.customerName.charAt(0)}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{rev.customerName}</h5>
                    <p className="text-[10px] text-slate-400">{rev.area}</p>
                  </div>
                </div>

                <div className="flex items-center gap-0.5">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed italic">
                "{rev.comment}"
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-400">
                <span className="font-semibold text-blue-600">{rev.service}</span>
                <span>{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= PARTNER NETWORK RECRUITMENT BANNER ================= */}
      <div className="mx-1 p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between gap-3 shadow-soft">
        <div className="space-y-0.5">
          <span className="text-[9px] font-black uppercase tracking-wider text-blue-400 block">
            Partner Network
          </span>
          <h4 className="text-xs font-bold text-white">Join as a Service Partner in Bengaluru</h4>
          <p className="text-[11px] text-slate-400">
            Earn up to ₹45,000/month with DigiLocker verification & weekly bank payouts.
          </p>
        </div>
        <button
          onClick={() => setIsWorkerRegModalOpen(true)}
          className="shrink-0 py-2 px-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Join as Pro</span>
        </button>
      </div>

      {/* ================= STICKY FLOATING CART BAR (URBAN COMPANY BOTTOM BAR) ================= */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-14 left-0 right-0 max-w-[420px] mx-auto p-3 z-30 animate-in slide-in-from-bottom-3 duration-200">
          <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-lifted flex items-center justify-between border border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                {totalCartCount}
              </div>
              <div>
                <p className="text-xs font-black text-white">
                  {totalCartCount} {totalCartCount === 1 ? 'service' : 'services'} added • {APP_CONFIG.currencySymbol}{totalCartPrice}
                </p>
                <p className="text-[10px] text-slate-400">UC 30-Day Guarantee included</p>
              </div>
            </div>

            <button
              onClick={handleCheckoutCart}
              className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1 shadow-sm"
            >
              <span>View Cart</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
