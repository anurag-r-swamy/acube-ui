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
import { WorkerProfile, ServiceCategory, Booking } from '../../types';
import {
  Home,
  Search,
  Calendar,
  Bell,
  User,
  CheckCircle2,
} from 'lucide-react';

type CustomerTab = 'HOME' | 'SEARCH' | 'BOOKINGS' | 'NOTIFICATIONS' | 'PROFILE';

export const CustomerLayout: React.FC = () => {
  const {
    currentUser,
    notifications,
    bookings,
    markNotificationRead,
    markAllNotificationsRead,
    viewMode,
    setCurrentRoute,
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

  const containerClass =
    viewMode === 'MOBILE_CONTAINER'
      ? 'max-w-[420px] mx-auto min-h-[844px] bg-white shadow-lifted border-x border-gray-200'
      : 'max-w-4xl mx-auto min-h-screen bg-white shadow-soft';

  return (
    <div className="min-h-screen bg-brand-bg py-0 sm:py-4">
      <div className={`${containerClass} flex flex-col relative`}>
        {/* Main Content Area */}
        <main className="flex-1 p-4 overflow-y-auto">
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
                      <p className="text-[11px] text-gray-600">{notif.message}</p>
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

        {/* Mobile Sticky Bottom Navigation Bar */}
        <nav className="sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 safe-bottom">
          <div className="grid grid-cols-5 py-2">
            <button
              onClick={() => setActiveTab('HOME')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                activeTab === 'HOME' ? 'text-brand-dark font-bold' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px]">Home</span>
            </button>

            <button
              onClick={() => setActiveTab('SEARCH')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                activeTab === 'SEARCH' ? 'text-brand-dark font-bold' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Search className="w-5 h-5" />
              <span className="text-[10px]">Search</span>
            </button>

            <button
              onClick={() => setActiveTab('BOOKINGS')}
              className={`flex flex-col items-center gap-1 relative transition-colors ${
                activeTab === 'BOOKINGS' ? 'text-brand-dark font-bold' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="relative">
                <Calendar className="w-5 h-5" />
                {activeBookingsCount > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-brand-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {activeBookingsCount}
                  </span>
                )}
              </div>
              <span className="text-[10px]">Bookings</span>
            </button>

            <button
              onClick={() => setActiveTab('NOTIFICATIONS')}
              className={`flex flex-col items-center gap-1 relative transition-colors ${
                activeTab === 'NOTIFICATIONS' ? 'text-brand-dark font-bold' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="relative">
                <Bell className="w-5 h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadNotifsCount}
                  </span>
                )}
              </div>
              <span className="text-[10px]">Alerts</span>
            </button>

            <button
              onClick={() => setActiveTab('PROFILE')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                activeTab === 'PROFILE' ? 'text-brand-dark font-bold' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px]">Profile</span>
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
      </div>
    </div>
  );
};

