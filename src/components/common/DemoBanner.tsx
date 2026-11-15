import React from 'react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/branding';
import {
  User,
  RotateCcw,
  Smartphone,
  Maximize2,
  Monitor,
  ShieldCheck,
  Briefcase,
  UserCheck,
} from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const {
    currentUser,
    switchPersona,
    switchUserMode,
    resetDemoData,
    viewMode,
    setViewMode,
    currentRoute,
    setCurrentRoute,
    setIsAuthModalOpen,
    setAuthModalMode,
    setIsWorkerRegModalOpen,
  } = useApp();

  const isAdminPlatform = currentRoute.startsWith('/admin');
  const isWorkerMode = currentRoute.startsWith('/worker') || currentUser.activeMode === 'WORKER';

  return (
    <header className="sticky top-0 z-50 bg-slate-950 text-white border-b border-slate-800 shadow-md text-xs select-none">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Two-Platform Architecture Tabs */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 pr-2 border-r border-slate-800">
            <span className="font-black text-blue-400 tracking-wider uppercase text-[11px]">
              {APP_CONFIG.parentCompany}
            </span>
          </div>

          {/* Strict Platform Selector */}
          <div className="flex items-center gap-1 bg-slate-900 rounded-xl p-1 border border-slate-800">
            {/* Platform 1: Mobile App (Customer & Worker) */}
            <button
              onClick={() => {
                if (isAdminPlatform) {
                  // Switch to mobile platform (preserve worker or customer mode)
                  setCurrentRoute(currentUser.role === 'WORKER' ? '/worker' : '/customer');
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                !isAdminPlatform
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Mobile Application Platform (Customer & Worker Only)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile App Platform</span>
              <span className="text-[9px] px-1.5 py-0.2 bg-white/20 rounded font-normal">
                {isWorkerMode ? 'Worker' : 'Customer'}
              </span>
            </button>

            {/* Platform 2: Web Admin Dashboard (Admin Only) */}
            <button
              onClick={() => {
                if (!isAdminPlatform) {
                  // If switching to admin platform, ensure an admin persona is active
                  if (!currentUser.role.endsWith('ADMIN') && !currentUser.role.includes('DISPUTES') && !currentUser.role.includes('ACCOUNTS') && !currentUser.role.includes('OPERATIONS')) {
                    switchPersona('user-admin-super');
                  }
                  setCurrentRoute('/admin');
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                isAdminPlatform
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Web Administrator Platform (Admin Only)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Web Admin Platform</span>
              <span className="text-[9px] px-1.5 py-0.2 bg-white/20 rounded font-mono">
                /admin
              </span>
            </button>
          </div>
        </div>

        {/* Center/Right: Role-Specific Controls & Fast Testing Actions */}
        <div className="flex items-center gap-2.5">
          {!isAdminPlatform ? (
            /* ================= MOBILE APP PLATFORM CONTROLS ================= */
            <div className="flex items-center gap-2">
              {/* Mobile Role Switcher (Customer vs Worker ONLY - No Admin!) */}
              <div className="flex items-center gap-1.5 bg-slate-900 rounded-lg px-2 py-1 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Mobile Role:</span>
                <select
                  aria-label="Switch mobile demo persona"
                  className="bg-transparent text-slate-200 font-bold cursor-pointer outline-none border-none text-xs pr-1"
                  value={currentUser.id}
                  onChange={(e) => {
                    const newId = e.target.value;
                    switchPersona(newId);
                  }}
                >
                  <option value="user-cust-1" className="text-slate-900 bg-white">
                    👤 Customer: Priya Sharma (Koramangala)
                  </option>
                  <option value="user-wrk-1" className="text-slate-900 bg-white">
                    ⚡ Worker: Rajesh Kumar (Electrician)
                  </option>
                  <option value="user-cust-worker-prospect" className="text-slate-900 bg-white">
                    👤 Customer: Ananya Gowda (HSR Layout)
                  </option>
                </select>
              </div>

              {/* Mobile Sign In Trigger (Customer entry point) */}
              <button
                onClick={() => {
                  setAuthModalMode('SIGN_UP');
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
              >
                <User className="w-3 h-3 text-blue-400" />
                <span>Customer Sign In</span>
              </button>

              {/* Mobile Worker Registration Trigger (Worker entry point) */}
              <button
                onClick={() => setIsWorkerRegModalOpen(true)}
                className="hidden sm:flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white font-bold px-2.5 py-1 rounded-lg transition-colors shadow-xs"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Join as Pro</span>
              </button>

              {/* Mobile Container View Toggle */}
              <button
                onClick={() => setViewMode(viewMode === 'MOBILE_CONTAINER' ? 'RESPONSIVE_FULL' : 'MOBILE_CONTAINER')}
                className="flex items-center gap-1 text-slate-300 hover:text-white px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 transition-colors border border-slate-800"
                title="Toggle mobile device width vs full responsive view"
              >
                {viewMode === 'MOBILE_CONTAINER' ? (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
                    <span className="hidden md:inline">Full Width</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                    <span className="hidden md:inline">Mobile Frame</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* ================= WEB ADMIN PLATFORM CONTROLS ================= */
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg text-xs font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="font-bold">Desktop Admin Web App Active</span>
              </div>
            </div>
          )}

          {/* Reset Demo State Button */}
          <button
            onClick={() => {
              if (window.confirm('Reset all demo state to fresh seed data?')) {
                resetDemoData();
              }
            }}
            className="flex items-center gap-1 text-slate-500 hover:text-rose-400 px-2 py-1 rounded transition-colors"
            title="Reset simulated data"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden lg:inline text-[11px]">Reset Data</span>
          </button>
        </div>
      </div>
    </header>
  );
};
