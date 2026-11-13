import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomerHome } from './CustomerHome';
import { CustomerSearch } from './CustomerSearch';
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
  Search,
  Calendar,
  Bell,
  User,
} from 'lucide-react';

type CustomerTab = 'HOME' | 'SEARCH' | 'BOOKINGS' | 'NOTIFICATIONS' | 'PROFILE';

export const CustomerLayout: React.FC = () => {
  const {
    currentUser,
    notifications,
    bookings,
    markNotificationRead,
    markAllNotificationsRead,
    triggerAndroidHaptic,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<CustomerTab>('HOME');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedWorkerForProfile, setSelectedWorkerForProfile] = useState<WorkerProfile | null>(null);
  const [bookingFlowWorker, setBookingFlowWorker] = useState<WorkerProfile | null>(null);
  const [isBookingFlowOpen, setIsBookingFlowOpen] = useState(false);
  const [searchInitialQuery, setSearchInitialQuery] = useState('');
  const [isWorkerOnboardingOpen, setIsWorkerOnboardingOpen] = useState(false);

  // Active bookings count for badge
  const activeBookingsCount = bookings.filter(
    (b) =>
      b.customerId === currentUser.id &&
      (b.status === 'REQUESTED' || b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS' || b.status === 'WORKER_ARRIVED')
  ).length;

  // Unread notifications for customer
  const myNotifications = notifications.filter((n) => n.userId === currentUser.id);
  const unreadNotifsCount = myNotifications.filter((n) => !n.isRead).length;

  const handleOpenBookingFlow = (worker?: WorkerProfile) => {
    setBookingFlowWorker(worker || null);
    setIsBookingFlowOpen(true);
  };

  const handleCategorySelectFromHome = (cat: ServiceCategory) => {
    setSearchInitialQuery(cat.name);
    setActiveTab('SEARCH');
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
      headerTheme="dark"
    >
      {/* Main Content Area */}
      <main className="flex-1 p-4 overflow-y-auto overscroll-contain">
        {activeTab === 'HOME' && (
          <CustomerHome
            onSelectCategory={handleCategorySelectFromHome}
            onSelectWorker={(w) => setSelectedWorkerForProfile(w)}
            onOpenBookingFlow={handleOpenBookingFlow}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
            onNavigateToBookings={() => setActiveTab('BOOKINGS')}
            onNavigateToSearch={(q) => {
              setSearchInitialQuery(q || '');
              setActiveTab('SEARCH');
            }}
          />
        )}

        {activeTab === 'SEARCH' && (
          <CustomerSearch
            initialQuery={searchInitialQuery}
            onSelectWorker={(w) => setSelectedWorkerForProfile(w)}
            onBookWorker={(w) => handleOpenBookingFlow(w)}
            onSelectCategory={(c) => setSearchInitialQuery(c.name)}
          />
        )}

        {activeTab === 'BOOKINGS' && <MyBookings />}

        {activeTab === 'NOTIFICATIONS' && (
          <div className="space-y-4 pb-24 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-base font-bold text-gray-900">Notifications</h1>
                <p className="text-[11px] text-gray-500">Live booking updates and alerts</p>
              </div>
              {unreadNotifsCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="text-brand-dark font-semibold hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>

            {myNotifications.length === 0 ? (
              <div className="py-12 bg-white rounded-2xl border border-gray-100 text-center p-6 space-y-2">
                <Bell className="w-8 h-8 text-gray-300 mx-auto" />
                <h3 className="font-bold text-gray-900">No notifications</h3>
                <p className="text-gray-400 text-[11px]">You are all caught up!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {myNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      markNotificationRead(notif.id);
                      if (notif.targetRoute?.includes('bookings')) {
                        setActiveTab('BOOKINGS');
                      }
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      notif.isRead
                        ? 'bg-white border-gray-100 text-gray-700'
                        : 'bg-emerald-50/50 border-emerald-200 text-emerald-950 font-medium shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">{notif.title}</span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(notif.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-gray-600 line-clamp-2">{notif.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'PROFILE' && (
          <CustomerProfile
            onStartWorkerOnboarding={() => setIsWorkerOnboardingOpen(true)}
          />
        )}
      </main>

      {/* Material 3 Styled Android Bottom Navigation Bar */}
      <nav className="shrink-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-40 select-none">
        <div className="grid grid-cols-5 py-1 px-1">
          <button
            onClick={() => switchTab('HOME')}
            className="flex flex-col items-center gap-1 group focus:outline-none"
          >
            <div
              className={`px-3 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
                activeTab === 'HOME'
                  ? 'bg-brand-dark text-brand-accent shadow-xs scale-105'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Home className="w-5 h-5" />
            </div>
            <span
              className={`text-[10px] tracking-tight ${
                activeTab === 'HOME' ? 'font-extrabold text-brand-dark' : 'font-medium text-gray-500'
              }`}
            >
              Home
            </span>
          </button>

          <button
            onClick={() => switchTab('SEARCH')}
            className="flex flex-col items-center gap-1 group focus:outline-none"
          >
            <div
              className={`px-3 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
                activeTab === 'SEARCH'
                  ? 'bg-brand-dark text-brand-accent shadow-xs scale-105'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Search className="w-5 h-5" />
            </div>
            <span
              className={`text-[10px] tracking-tight ${
                activeTab === 'SEARCH' ? 'font-extrabold text-brand-dark' : 'font-medium text-gray-500'
              }`}
            >
              Search
            </span>
          </button>

          <button
            onClick={() => switchTab('BOOKINGS')}
            className="flex flex-col items-center gap-1 group focus:outline-none"
          >
            <div className="relative">
              <div
                className={`px-3 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
                  activeTab === 'BOOKINGS'
                    ? 'bg-brand-dark text-brand-accent shadow-xs scale-105'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Calendar className="w-5 h-5" />
              </div>
              {activeBookingsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-accent text-brand-charcoal text-[9px] font-black rounded-full flex items-center justify-center shadow-xs">
                  {activeBookingsCount}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] tracking-tight ${
                activeTab === 'BOOKINGS' ? 'font-extrabold text-brand-dark' : 'font-medium text-gray-500'
              }`}
            >
              Bookings
            </span>
          </button>

          <button
            onClick={() => switchTab('NOTIFICATIONS')}
            className="flex flex-col items-center gap-1 group focus:outline-none"
          >
            <div className="relative">
              <div
                className={`px-3 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
                  activeTab === 'NOTIFICATIONS'
                    ? 'bg-brand-dark text-brand-accent shadow-xs scale-105'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Bell className="w-5 h-5" />
              </div>
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs">
                  {unreadNotifsCount}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] tracking-tight ${
                activeTab === 'NOTIFICATIONS' ? 'font-extrabold text-brand-dark' : 'font-medium text-gray-500'
              }`}
            >
              Alerts
            </span>
          </button>

          <button
            onClick={() => switchTab('PROFILE')}
            className="flex flex-col items-center gap-1 group focus:outline-none"
          >
            <div
              className={`px-3 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
                activeTab === 'PROFILE'
                  ? 'bg-brand-dark text-brand-accent shadow-xs scale-105'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <User className="w-5 h-5" />
            </div>
            <span
              className={`text-[10px] tracking-tight ${
                activeTab === 'PROFILE' ? 'font-extrabold text-brand-dark' : 'font-medium text-gray-500'
              }`}
            >
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
        onBookingSuccess={(booking) => {
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
