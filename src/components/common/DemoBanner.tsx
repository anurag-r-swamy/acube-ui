import React from 'react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/branding';
import {
  User,
  RotateCcw,
  Smartphone,
  Maximize2,
  ArrowRightLeft,
  Briefcase,
  Shield,
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
    setIsAdminLoginModalOpen,
    setIsWorkerRegModalOpen,
  } = useApp();

  const isDualRole = currentUser.availableRoles.includes('CUSTOMER') && currentUser.availableRoles.includes('WORKER');
  const isWorkerMode = currentUser.activeMode === 'WORKER';

  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white border-b border-slate-800/80 shadow-xs text-xs">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Branding & Prototype Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-blue-400 tracking-wider uppercase text-[11px]">
              {APP_CONFIG.parentCompany}
            </span>
            <span className="text-slate-600 text-xs">/</span>
            <span className="text-slate-100 font-semibold text-xs">
              {APP_CONFIG.appDisplayNamePlaceholder}
            </span>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md text-[10px] font-medium border border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Prototype Mode
          </span>
        </div>

        {/* Center: Persona Switcher & Fast Actions */}
        <div className="flex items-center gap-2">
          {/* Persona selector */}
          <div className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700/80 transition-colors rounded-lg px-2.5 py-1 border border-slate-700">
            <User className="w-3.5 h-3.5 text-blue-400" />
            <select
              aria-label="Switch demo persona"
              className="bg-transparent text-slate-200 font-medium cursor-pointer outline-none border-none text-xs pr-1"
              value={currentUser.id}
              onChange={(e) => switchPersona(e.target.value)}
            >
              <optgroup label="Customers & Workers">
                <option value="user-cust-1" className="text-slate-900 bg-white">
                  Priya Sharma (Customer • Koramangala)
                </option>
                <option value="user-wrk-1" className="text-slate-900 bg-white">
                  Rajesh Kumar (Technician • Indiranagar)
                </option>
                <option value="user-cust-worker-prospect" className="text-slate-900 bg-white">
                  Ananya Gowda (Customer • Onboarding)
                </option>
              </optgroup>
              <optgroup label="Admin Roles">
                <option value="user-admin-super" className="text-slate-900 bg-white">
                  Ayesha Sen (Super Admin)
                </option>
                <option value="user-admin-disputes" className="text-slate-900 bg-white">
                  Vikram Rao (Disputes & Verification)
                </option>
                <option value="user-admin-finance" className="text-slate-900 bg-white">
                  Suresh Patel (Accounts & Finance)
                </option>
                <option value="user-admin-ops" className="text-slate-900 bg-white">
                  Kavita Nair (Operations & Support)
                </option>
              </optgroup>
            </select>
          </div>

          {/* Customer Sign In Trigger */}
          <button
            onClick={() => {
              setAuthModalMode('SIGN_UP');
              setIsAuthModalOpen(true);
            }}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white font-medium px-2.5 py-1 rounded-lg transition-colors"
          >
            <span>Sign In</span>
          </button>

          {/* Worker / Partner Registration Trigger */}
          <button
            onClick={() => setIsWorkerRegModalOpen(true)}
            className="hidden sm:flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium px-2.5 py-1 rounded-lg transition-colors"
          >
            <Briefcase className="w-3.5 h-3.5 text-blue-400" />
            <span>Join as Pro</span>
          </button>

          {/* Staff Login Trigger */}
          <button
            onClick={() => setIsAdminLoginModalOpen(true)}
            className="hidden md:flex items-center gap-1 text-slate-400 hover:text-slate-200 px-2 py-1 rounded transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Staff</span>
          </button>

          {/* Dual Role Switcher */}
          {isDualRole && (
            <button
              onClick={() => switchUserMode(isWorkerMode ? 'CUSTOMER' : 'WORKER')}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-lg font-medium transition-colors"
            >
              <ArrowRightLeft className="w-3 h-3" />
              <span>{isWorkerMode ? 'Customer View' : 'Worker View'}</span>
            </button>
          )}

          {/* Direct jump to Admin */}
          {!currentRoute.startsWith('/admin') ? (
            <button
              onClick={() => setCurrentRoute('/admin')}
              className="hidden lg:flex items-center gap-1 text-slate-400 hover:text-white px-2 py-1 rounded"
            >
              <span>Admin Portal →</span>
            </button>
          ) : (
            <button
              onClick={() => setCurrentRoute('/customer')}
              className="hidden lg:flex items-center gap-1 text-slate-400 hover:text-white px-2 py-1 rounded"
            >
              <span>← App View</span>
            </button>
          )}
        </div>

        {/* Right: View Mode Toggle & Reset */}
        <div className="flex items-center gap-2">
          {!currentRoute.startsWith('/admin') && (
            <button
              onClick={() => setViewMode(viewMode === 'MOBILE_CONTAINER' ? 'RESPONSIVE_FULL' : 'MOBILE_CONTAINER')}
              className="flex items-center gap-1 text-slate-300 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
              title="Toggle mobile device width vs full responsive view"
            >
              {viewMode === 'MOBILE_CONTAINER' ? (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden sm:inline">Full Width</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden sm:inline">Mobile Frame</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => {
              if (window.confirm('Reset all demo state to fresh seed data?')) {
                resetDemoData();
              }
            }}
            className="flex items-center gap-1 text-slate-400 hover:text-rose-400 px-2 py-1 rounded transition-colors"
            title="Reset simulated data"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
