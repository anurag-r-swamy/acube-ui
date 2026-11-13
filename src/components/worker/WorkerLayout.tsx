import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WorkerDashboard } from './WorkerDashboard';
import { WorkerJobs } from './WorkerJobs';
import { WorkerEarnings } from './WorkerEarnings';
import { WorkerProfileView } from './WorkerProfileView';
import { AndroidAppShell } from '../common/AndroidAppShell';
import {
  Zap,
  Briefcase,
  DollarSign,
  User,
  Bell,
} from 'lucide-react';

type WorkerTab = 'DASHBOARD' | 'JOBS' | 'EARNINGS' | 'NOTIFICATIONS' | 'PROFILE';

export const WorkerLayout: React.FC = () => {
  const {
    currentUser,
    notifications,
    bookings,
    currentWorkerProfile,
    workerProfiles,
    triggerAndroidHaptic,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<WorkerTab>('DASHBOARD');
  const worker = currentWorkerProfile || workerProfiles[0];

  // Assigned jobs count
  const myAssignedJobsCount = bookings.filter(
    (b) =>
      b.workerId === worker?.id &&
      (b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS' || b.status === 'WORKER_ARRIVED')
  ).length;

  const myNotifications = notifications.filter((n) => n.userId === currentUser.id);
  const unreadNotifsCount = myNotifications.filter((n) => !n.isRead).length;

  // Android System Back Navigation Handler
  const handleAndroidBack = () => {
    if (activeTab !== 'DASHBOARD') {
      setActiveTab('DASHBOARD');
      return;
    }
    showToast('Press back again to exit', 'info');
  };

  // Android System Home Button Handler
  const handleAndroidHome = () => {
    setActiveTab('DASHBOARD');
  };

  const switchTab = (tab: WorkerTab) => {
    triggerAndroidHaptic();
    setActiveTab(tab);
  };

  return (
    <AndroidAppShell
      activeApp="WORKER"
      onBackPress={handleAndroidBack}
      onHomePress={handleAndroidHome}
      headerTheme="dark"
    >
      {/* Main Content Area */}
      <main className="flex-1 p-4 overflow-y-auto overscroll-contain">
        {activeTab === 'DASHBOARD' && (
          <WorkerDashboard
            onNavigateToJobs={() => switchTab('JOBS')}
            onNavigateToEarnings={() => switchTab('EARNINGS')}
          />
        )}

        {activeTab === 'JOBS' && <WorkerJobs />}

        {activeTab === 'EARNINGS' && <WorkerEarnings />}

        {activeTab === 'NOTIFICATIONS' && (
          <div className="space-y-4 pb-24 text-xs">
            <h1 className="text-base font-bold text-gray-900">Worker Alerts</h1>
            {myNotifications.length === 0 ? (
              <div className="py-12 bg-white rounded-2xl border border-gray-100 text-center p-6 text-gray-400">
                No alerts right now.
              </div>
            ) : (
              <div className="space-y-2">
                {myNotifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-3.5 bg-white border border-gray-100 rounded-2xl shadow-soft"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-gray-900">{n.title}</span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(n.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-gray-600">{n.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'PROFILE' && <WorkerProfileView />}
      </main>

      {/* Material 3 Styled Android Worker Bottom Navigation Bar */}
      <nav className="shrink-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-40 select-none">
        <div className="grid grid-cols-5 py-1 px-1">
          <button
            onClick={() => switchTab('DASHBOARD')}
            className="flex flex-col items-center gap-1 group focus:outline-none"
          >
            <div
              className={`px-3 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
                activeTab === 'DASHBOARD'
                  ? 'bg-brand-dark text-brand-accent shadow-xs scale-105'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Zap className="w-5 h-5 text-brand-accent" />
            </div>
            <span
              className={`text-[10px] tracking-tight ${
                activeTab === 'DASHBOARD' ? 'font-extrabold text-brand-dark' : 'font-medium text-gray-500'
              }`}
            >
              Dashboard
            </span>
          </button>

          <button
            onClick={() => switchTab('JOBS')}
            className="flex flex-col items-center gap-1 group focus:outline-none"
          >
            <div className="relative">
              <div
                className={`px-3 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
                  activeTab === 'JOBS'
                    ? 'bg-brand-dark text-brand-accent shadow-xs scale-105'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Briefcase className="w-5 h-5" />
              </div>
              {myAssignedJobsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-accent text-brand-charcoal text-[9px] font-black rounded-full flex items-center justify-center shadow-xs">
                  {myAssignedJobsCount}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] tracking-tight ${
                activeTab === 'JOBS' ? 'font-extrabold text-brand-dark' : 'font-medium text-gray-500'
              }`}
            >
              My Jobs
            </span>
          </button>

          <button
            onClick={() => switchTab('EARNINGS')}
            className="flex flex-col items-center gap-1 group focus:outline-none"
          >
            <div
              className={`px-3 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
                activeTab === 'EARNINGS'
                  ? 'bg-brand-dark text-brand-accent shadow-xs scale-105'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <DollarSign className="w-5 h-5" />
            </div>
            <span
              className={`text-[10px] tracking-tight ${
                activeTab === 'EARNINGS' ? 'font-extrabold text-brand-dark' : 'font-medium text-gray-500'
              }`}
            >
              Earnings
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
    </AndroidAppShell>
  );
};
