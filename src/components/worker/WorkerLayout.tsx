import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WorkerDashboard } from './WorkerDashboard';
import { WorkerJobs } from './WorkerJobs';
import { WorkerEarnings } from './WorkerEarnings';
import { WorkerProfileView } from './WorkerProfileView';
import {
  Zap,
  Briefcase,
  DollarSign,
  User,
  Bell,
  ArrowRightLeft,
} from 'lucide-react';

type WorkerTab = 'DASHBOARD' | 'JOBS' | 'EARNINGS' | 'NOTIFICATIONS' | 'PROFILE';

export const WorkerLayout: React.FC = () => {
  const { currentUser, notifications, bookings, currentWorkerProfile, workerProfiles, viewMode } =
    useApp();

  const [activeTab, setActiveTab] = useState<WorkerTab>('DASHBOARD');
  const worker = currentWorkerProfile || workerProfiles[0];

  // Assigned jobs count
  const myAssignedJobsCount = bookings.filter(
    (b) => b.workerId === worker?.id && (b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS' || b.status === 'WORKER_ARRIVED')
  ).length;

  const myNotifications = notifications.filter((n) => n.userId === currentUser.id);
  const unreadNotifsCount = myNotifications.filter((n) => !n.isRead).length;

  const containerClass =
    viewMode === 'MOBILE_CONTAINER'
      ? 'max-w-[420px] mx-auto min-h-[844px] bg-white shadow-lifted border-x border-gray-200'
      : 'max-w-4xl mx-auto min-h-screen bg-white shadow-soft';

  return (
    <div className="min-h-screen bg-brand-bg py-0 sm:py-4">
      <div className={`${containerClass} flex flex-col relative`}>
        {/* Main Content Area */}
        <main className="flex-1 p-4 overflow-y-auto">
          {activeTab === 'DASHBOARD' && (
            <WorkerDashboard
              onNavigateToJobs={() => setActiveTab('JOBS')}
              onNavigateToEarnings={() => setActiveTab('EARNINGS')}
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

        {/* Worker Sticky Bottom Navigation */}
        <nav className="sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 safe-bottom">
          <div className="grid grid-cols-5 py-2">
            <button
              onClick={() => setActiveTab('DASHBOARD')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                activeTab === 'DASHBOARD'
                  ? 'text-brand-dark font-bold'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Zap className="w-5 h-5 text-brand-accent" />
              <span className="text-[10px]">Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('JOBS')}
              className={`flex flex-col items-center gap-1 relative transition-colors ${
                activeTab === 'JOBS'
                  ? 'text-brand-dark font-bold'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="relative">
                <Briefcase className="w-5 h-5" />
                {myAssignedJobsCount > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-brand-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {myAssignedJobsCount}
                  </span>
                )}
              </div>
              <span className="text-[10px]">Jobs</span>
            </button>

            <button
              onClick={() => setActiveTab('EARNINGS')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                activeTab === 'EARNINGS'
                  ? 'text-brand-dark font-bold'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <DollarSign className="w-5 h-5" />
              <span className="text-[10px]">Earnings</span>
            </button>

            <button
              onClick={() => setActiveTab('NOTIFICATIONS')}
              className={`flex flex-col items-center gap-1 relative transition-colors ${
                activeTab === 'NOTIFICATIONS'
                  ? 'text-brand-dark font-bold'
                  : 'text-gray-400 hover:text-gray-600'
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
                activeTab === 'PROFILE'
                  ? 'text-brand-dark font-bold'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px]">Profile</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

