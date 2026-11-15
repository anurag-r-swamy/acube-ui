import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomerHome } from './CustomerHome';
import { MyBookings } from './MyBookings';
import { CustomerProfile } from './CustomerProfile';
import { LocationModal } from './LocationModal';
import { ProviderProfileModal } from './ProviderProfileModal';
import { BookingFlowModal } from './BookingFlowModal';
import { WorkerOnboardingModal } from '../worker/WorkerOnboardingModal';
import { AndroidAppShell } from '../common/AndroidAppShell';
import { WorkerProfile, ServiceCategory } from '../../types';
import {
  Home,
  Calendar,
  User,
} from 'lucide-react';

type CustomerTab = 'HOME' | 'BOOKINGS' | 'PROFILE';

export const CustomerLayout: React.FC = () => {
  const {
    currentUser,
    bookings,
    triggerAndroidHaptic,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<CustomerTab>('HOME');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedWorkerForProfile, setSelectedWorkerForProfile] = useState<WorkerProfile | null>(null);
  const [bookingFlowWorker, setBookingFlowWorker] = useState<WorkerProfile | null>(null);
  const [initialBookingService, setInitialBookingService] = useState<{ name: string; price: number; categoryName?: string } | null>(null);
  const [isBookingFlowOpen, setIsBookingFlowOpen] = useState(false);
  const [isWorkerOnboardingOpen, setIsWorkerOnboardingOpen] = useState(false);

  // Active bookings count for badge
  const activeBookingsCount = bookings.filter(
    (b) =>
      b.customerId === currentUser.id &&
      (b.status === 'REQUESTED' || b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS' || b.status === 'WORKER_ARRIVED')
  ).length;

  const handleOpenBookingFlow = (
    worker?: WorkerProfile,
    serviceDetails?: { name: string; price: number; categoryName?: string }
  ) => {
    setBookingFlowWorker(worker || null);
    setInitialBookingService(serviceDetails || null);
    setIsBookingFlowOpen(true);
  };

  const handleCategorySelectFromHome = (cat: ServiceCategory) => {
    handleOpenBookingFlow(undefined, {
      name: `${cat.name} Service Visit`,
      price: 299,
      categoryName: cat.name,
    });
  };

  // Android System Back Navigation Handler
  const handleAndroidBack = () => {
    if (isBookingFlowOpen) {
      setIsBookingFlowOpen(false);
      return;
    }
    if (selectedWorkerForProfile) {
      setSelectedWorkerForProfile(null);
      return;
    }
    if (isLocationModalOpen) {
      setIsLocationModalOpen(false);
      return;
    }
    if (isWorkerOnboardingOpen) {
      setIsWorkerOnboardingOpen(false);
      return;
    }
    if (activeTab !== 'HOME') {
      setActiveTab('HOME');
      return;
    }
    showToast('Press back again to exit', 'info');
  };

  // Android System Home Button Handler
  const handleAndroidHome = () => {
    setIsBookingFlowOpen(false);
    setSelectedWorkerForProfile(null);
    setIsLocationModalOpen(false);
    setIsWorkerOnboardingOpen(false);
    setActiveTab('HOME');
  };

  const switchTab = (tab: CustomerTab) => {
    triggerAndroidHaptic();
    setActiveTab(tab);
  };

  return (
    <AndroidAppShell
      activeApp="CUSTOMER"
      onBackPress={handleAndroidBack}
      onHomePress={handleAndroidHome}
      headerTheme="light"
    >
      {/* Main Content Area */}
      <main className="flex-1 p-3 overflow-y-auto overscroll-contain">
        {activeTab === 'HOME' && (
          <CustomerHome
            onSelectCategory={handleCategorySelectFromHome}
            onSelectWorker={(w) => setSelectedWorkerForProfile(w)}
            onOpenBookingFlow={handleOpenBookingFlow}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
            onNavigateToBookings={() => switchTab('BOOKINGS')}
            onNavigateToProfile={() => switchTab('PROFILE')}
          />
        )}

        {activeTab === 'BOOKINGS' && <MyBookings />}

        {activeTab === 'PROFILE' && (
          <CustomerProfile
            onStartWorkerOnboarding={() => setIsWorkerOnboardingOpen(true)}
          />
        )}
      </main>

      {/* Clean Bottom Navigation Bar: Home, Bookings, Profile (Strict dark green, black, white) */}
      <nav className="shrink-0 bg-white border-t border-[#E3E6DF] z-40 select-none shadow-soft">
        <div className="grid grid-cols-3 py-2 px-4">
          <button
            onClick={() => switchTab('HOME')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'HOME' ? 'text-[#0D2218]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className={`text-[10px] ${activeTab === 'HOME' ? 'font-black' : 'font-medium'}`}>
              Home
            </span>
          </button>

          <button
            onClick={() => switchTab('BOOKINGS')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'BOOKINGS' ? 'text-[#0D2218]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className="relative">
              <Calendar className="w-5 h-5" />
              {activeBookingsCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-[#0D2218] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {activeBookingsCount}
                </span>
              )}
            </div>
            <span className={`text-[10px] ${activeTab === 'BOOKINGS' ? 'font-black' : 'font-medium'}`}>
              Bookings
            </span>
          </button>

          <button
            onClick={() => switchTab('PROFILE')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'PROFILE' ? 'text-[#0D2218]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <User className="w-5 h-5" />
            <span className={`text-[10px] ${activeTab === 'PROFILE' ? 'font-black' : 'font-medium'}`}>
              Profile
            </span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />

      <ProviderProfileModal
        worker={selectedWorkerForProfile}
        onClose={() => setSelectedWorkerForProfile(null)}
        onBookNow={(w) => handleOpenBookingFlow(w)}
      />

      <BookingFlowModal
        isOpen={isBookingFlowOpen}
        onClose={() => setIsBookingFlowOpen(false)}
        preselectedWorker={bookingFlowWorker}
        initialServiceDetails={initialBookingService}
        onBookingSuccess={() => {
          setActiveTab('BOOKINGS');
        }}
      />

      <WorkerOnboardingModal
        isOpen={isWorkerOnboardingOpen}
        onClose={() => setIsWorkerOnboardingOpen(false)}
      />
    </AndroidAppShell>
  );
};
