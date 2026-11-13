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
  } = useApp();

  const isDualRole = currentUser.availableRoles.includes('CUSTOMER') && currentUser.availableRoles.includes('WORKER');
  const isWorkerMode = currentUser.activeMode === 'WORKER';

  return (
    <header className="sticky top-0 z-50 bg-brand-dark text-white border-b border-brand-light shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Left: Parent Branding & Configurable App Name */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-black/30 px-2 py-1 rounded border border-white/10">
            <span className="font-semibold text-brand-accent tracking-wide uppercase text-[10px]">
              {APP_CONFIG.parentCompany}
            </span>
            <span className="text-white/40">|</span>
            <span className="text-white/90 font-medium">
              [{APP_CONFIG.appDisplayNamePlaceholder}]
            </span>
          </div>

          <span className="hidden md:inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Simulated Demo Prototype
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
            className="flex items-center gap-1 bg-brand-accent hover:bg-brand-accent-hover text-brand-charcoal font-extrabold px-2.5 py-1 rounded shadow-xs transition-colors"
            title="Open Customer Registration & Sign-In Simulation"
          >
            <span>Customer Sign In</span>
          </button>

          {/* Dedicated Worker & Partner Registration Wizard Trigger */}
          <button
            onClick={() => setIsWorkerRegModalOpen(true)}
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 py-1 rounded shadow-xs transition-colors"
            title="Open 5-Step Worker & Service Partner Registration Wizard"
          >
            <Briefcase className="w-3.5 h-3.5 text-brand-accent" />
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
              className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium transition-all ${
                isWorkerMode
                  ? 'bg-amber-500 hover:bg-amber-600 text-brand-charcoal font-semibold shadow-sm'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
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
            <button
              onClick={() => setViewMode(viewMode === 'MOBILE_CONTAINER' ? 'RESPONSIVE_FULL' : 'MOBILE_CONTAINER')}
              className="flex items-center gap-1 text-white/80 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
              title="Toggle between 390px mobile frame and full-width responsive preview"
            >
              {viewMode === 'MOBILE_CONTAINER' ? (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Full Width</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-brand-accent" />
                  <span className="hidden sm:inline">390×844 Mobile Frame</span>
                </>
              )}
            </button>
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

