import React from 'react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/branding';
import {
  User,
  RotateCcw,
  Smartphone,
  Maximize2,
  ShieldAlert,
  ArrowRightLeft,
  ChevronDown,
  Info,
  Briefcase,
} from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const {
    currentUser,
    users,
    switchPersona,
    switchUserMode,
    resetDemoData,
    viewMode,
    setViewMode,
    currentRoute,
    setCurrentRoute,
    setIsAuthModalOpen,
    setAuthModalMode,
    setIsAdminLoginModalOpen,
    setIsWorkerRegModalOpen,
    androidNavMode,
    setAndroidNavMode,
  } = useApp();

  const isDualRole = currentUser.availableRoles.includes('CUSTOMER') && currentUser.availableRoles.includes('WORKER');
  const isWorkerMode = currentUser.activeMode === 'WORKER';

  return (
    <header className="sticky top-0 z-50 bg-[#0A192F] text-white border-b border-cyan-950/80 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Left: Parent Branding & Configurable App Name */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-cyan-950/40 px-2.5 py-1 rounded-lg border border-cyan-500/20">
            <span className="font-extrabold text-cyan-400 tracking-wider uppercase text-[10px]">
              {APP_CONFIG.parentCompany}
            </span>
            <span className="text-white/30">|</span>
            <span className="text-white/95 font-semibold">
              [{APP_CONFIG.appDisplayNamePlaceholder}]
            </span>
          </div>

          <span className="hidden md:inline-flex items-center gap-1 text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            Prototype Simulation
          </span>
        </div>

        {/* Center: Quick Persona Switcher & Dual Role Toggle */}
        <div className="flex items-center gap-2">
          {/* Persona selector */}
          <div className="flex items-center gap-1 bg-white/10 hover:bg-white/15 transition-colors rounded-lg px-2 py-1 border border-white/10">
            <User className="w-3.5 h-3.5 text-brand-accent" />
            <span className="text-white/60 hidden sm:inline">Demo Role:</span>
            <select
              aria-label="Switch demo persona"
              className="bg-transparent text-white font-semibold cursor-pointer outline-none border-none text-xs pr-2"
              value={currentUser.id}
              onChange={(e) => switchPersona(e.target.value)}
            >
              <optgroup label="Customers & Workers">
                <option value="user-cust-1" className="text-gray-900 bg-white">
                  👤 Priya Sharma (Customer • Koramangala)
                </option>
                <option value="user-wrk-1" className="text-gray-900 bg-white">
                  ⚡ Rajesh Kumar (Worker • Indiranagar • Approved)
                </option>
                <option value="user-cust-worker-prospect" className="text-gray-900 bg-white">
                  🚀 Ananya Gowda (Customer • Onboarding Prospect)
                </option>
              </optgroup>
              <optgroup label="Admin Staff Roles (UI Permissions)">
                <option value="user-admin-super" className="text-gray-900 bg-white">
                  👑 Ayesha Sen (Super Admin)
                </option>
                <option value="user-admin-disputes" className="text-gray-900 bg-white">
                  ⚖️ Vikram Rao (Disputes & Verification)
                </option>
                <option value="user-admin-finance" className="text-gray-900 bg-white">
                  💳 Suresh Patel (Accounts & Finance)
                </option>
                <option value="user-admin-ops" className="text-gray-900 bg-white">
                  ⚙️ Kavita Nair (Operations & Support)
                </option>
              </optgroup>
            </select>
          </div>

          {/* Auth Simulation: Sign In / Register Modal Trigger */}
          <button
            onClick={() => {
              setAuthModalMode('SIGN_UP');
              setIsAuthModalOpen(true);
            }}
            className="flex items-center gap-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-2.5 py-1 rounded shadow-xs transition-colors"
            title="Open Customer Registration & Sign-In Simulation"
          >
            <span>Customer Sign In</span>
          </button>

          {/* Dedicated Worker & Partner Registration Wizard Trigger */}
          <button
            onClick={() => setIsWorkerRegModalOpen(true)}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-bold px-2.5 py-1 rounded shadow-xs transition-colors"
            title="Open 5-Step Worker & Service Partner Registration Wizard"
          >
            <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
            <span>Worker Reg</span>
          </button>

          {/* Admin Login Simulation Button */}
          <button
            onClick={() => setIsAdminLoginModalOpen(true)}
            className="hidden sm:flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white font-medium px-2 py-1 rounded transition-colors"
            title="Open Admin Staff Login Simulation"
          >
            <span>Staff Login</span>
          </button>

          {/* Dual Role Switcher Button if user has customer + worker capabilities */}
          {isDualRole && (
            <button
              onClick={() => switchUserMode(isWorkerMode ? 'CUSTOMER' : 'WORKER')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded font-bold transition-all ${
                isWorkerMode
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 shadow-sm'
              }`}
              title="Toggle between Customer and Worker view"
            >
              <ArrowRightLeft className="w-3 h-3" />
              <span>{isWorkerMode ? 'Switch to Customer View' : 'Switch to Worker View'}</span>
            </button>
          )}

          {/* Direct quick jump to Admin for testing if not already in admin */}
          {!currentRoute.startsWith('/admin') && (
            <button
              onClick={() => setCurrentRoute('/admin')}
              className="hidden lg:flex items-center gap-1 text-white/70 hover:text-white px-2 py-1 rounded hover:bg-white/10"
              title="Jump to Desktop Admin Dashboard"
            >
              <span>Admin Portal →</span>
            </button>
          )}

          {currentRoute.startsWith('/admin') && (
            <button
              onClick={() => setCurrentRoute('/customer')}
              className="hidden lg:flex items-center gap-1 text-white/70 hover:text-white px-2 py-1 rounded hover:bg-white/10"
              title="Jump to Customer Mobile View"
            >
              <span>← Customer App</span>
            </button>
          )}
        </div>

        {/* Right: Viewport Toggle & Reset Demo State */}
        <div className="flex items-center gap-2">
          {/* Frame Toggle (only active on mobile apps screens) */}
          {!currentRoute.startsWith('/admin') && (
            <>
              {/* Android Nav Mode Switcher */}
              <button
                onClick={() => setAndroidNavMode(androidNavMode === '3_BUTTON' ? 'GESTURE' : '3_BUTTON')}
                className="hidden md:flex items-center gap-1 text-white/80 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
                title="Toggle between 3-Button and Gesture Nav"
              >
                <span>Nav: {androidNavMode === '3_BUTTON' ? '3-Button' : 'Gestures'}</span>
              </button>

              <button
                onClick={() => setViewMode(viewMode === 'MOBILE_CONTAINER' ? 'RESPONSIVE_FULL' : 'MOBILE_CONTAINER')}
                className="flex items-center gap-1 text-white/80 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
                title="Toggle between Android phone frame and full screen view"
              >
                {viewMode === 'MOBILE_CONTAINER' ? (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Full Screen</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-3.5 h-3.5 text-brand-accent" />
                    <span className="hidden sm:inline">Android Phone Frame</span>
                  </>
                )}
              </button>
            </>
          )}

          {/* Reset Demo Data */}
          <button
            onClick={() => {
              if (window.confirm('Reset all demo state to initial seed data?')) {
                resetDemoData();
              }
            }}
            className="flex items-center gap-1 bg-red-900/50 hover:bg-red-800 text-red-200 border border-red-500/30 px-2.5 py-1 rounded font-medium transition-colors"
            title="Reset localStorage demo state"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Demo Data</span>
          </button>
        </div>
      </div>
    </header>
  );
};

