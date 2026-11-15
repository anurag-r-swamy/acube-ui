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

      {/* Clean Professional Worker Bottom Navigation Bar */}
      <nav className="shrink-0 bg-[#FBFBFA]/95 backdrop-blur-md border-t border-[#E3E6DF] z-40 select-none shadow-soft">
        <div className="grid grid-cols-5 py-2 px-1">
          <button
            onClick={() => switchTab('DASHBOARD')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'DASHBOARD' ? 'text-forest-800' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Zap className="w-5 h-5" />
            <span className={`text-[10px] ${activeTab === 'DASHBOARD' ? 'font-bold' : 'font-medium'}`}>
              Dashboard
            </span>
          </button>

          <button
            onClick={() => switchTab('JOBS')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'JOBS' ? 'text-forest-800' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className="relative">
              <Briefcase className="w-5 h-5" />
              {myAssignedJobsCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-forest-800 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {myAssignedJobsCount}
                </span>
              )}
            </div>
            <span className={`text-[10px] ${activeTab === 'JOBS' ? 'font-bold' : 'font-medium'}`}>
              My Jobs
            </span>
          </button>

          <button
            onClick={() => switchTab('EARNINGS')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'EARNINGS' ? 'text-forest-800' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <DollarSign className="w-5 h-5" />
            <span className={`text-[10px] ${activeTab === 'EARNINGS' ? 'font-bold' : 'font-medium'}`}>
              Earnings
            </span>
          </button>

          <button
            onClick={() => switchTab('NOTIFICATIONS')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'NOTIFICATIONS' ? 'text-forest-800' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className="relative">
              <Bell className="w-5 h-5" />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadNotifsCount}
                </span>
              )}
            </div>
            <span className={`text-[10px] ${activeTab === 'NOTIFICATIONS' ? 'font-bold' : 'font-medium'}`}>
              Alerts
            </span>
          </button>

          <button
            onClick={() => switchTab('PROFILE')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'PROFILE' ? 'text-forest-800' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <User className="w-5 h-5" />
            <span className={`text-[10px] ${activeTab === 'PROFILE' ? 'font-bold' : 'font-medium'}`}>
              Profile
            </span>
          </button>
        </div>
      </nav>
    </AndroidAppShell>
  );
};
