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
} from 'lucide-react';

type WorkerTab = 'DASHBOARD' | 'JOBS' | 'EARNINGS' | 'PROFILE';

export const WorkerLayout: React.FC = () => {
  const {
    currentUser,
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
      <main className="flex-1 p-3.5 overflow-y-auto overscroll-contain">
        {activeTab === 'DASHBOARD' && (
          <WorkerDashboard
            onNavigateToJobs={() => switchTab('JOBS')}
            onNavigateToEarnings={() => switchTab('EARNINGS')}
          />
        )}

        {activeTab === 'JOBS' && <WorkerJobs />}

        {activeTab === 'EARNINGS' && <WorkerEarnings />}

        {activeTab === 'PROFILE' && <WorkerProfileView />}
      </main>

      {/* Clean Professional Worker Bottom Navigation Bar: Dashboard, My Jobs, Earnings, Profile (No alerts tab) */}
      <nav className="shrink-0 bg-white border-t border-[#E3E6DF] z-40 select-none shadow-soft">
        <div className="grid grid-cols-4 py-2 px-2">
          <button
            onClick={() => switchTab('DASHBOARD')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'DASHBOARD' ? 'text-[#0D2218]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Zap className="w-5 h-5" />
            <span className={`text-[10px] ${activeTab === 'DASHBOARD' ? 'font-black' : 'font-medium'}`}>
              Dashboard
            </span>
          </button>

          <button
            onClick={() => switchTab('JOBS')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'JOBS' ? 'text-[#0D2218]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className="relative">
              <Briefcase className="w-5 h-5" />
              {myAssignedJobsCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-[#0D2218] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {myAssignedJobsCount}
                </span>
              )}
            </div>
            <span className={`text-[10px] ${activeTab === 'JOBS' ? 'font-black' : 'font-medium'}`}>
              Jobs
            </span>
          </button>

          <button
            onClick={() => switchTab('EARNINGS')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'EARNINGS' ? 'text-[#0D2218]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <DollarSign className="w-5 h-5" />
            <span className={`text-[10px] ${activeTab === 'EARNINGS' ? 'font-black' : 'font-medium'}`}>
              Earnings
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
    </AndroidAppShell>
  );
};
