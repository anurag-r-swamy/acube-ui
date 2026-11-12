import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldX, AlertTriangle, ArrowLeft } from 'lucide-react';
import { RoleType } from '../../types';

interface AccessDeniedProps {
  requiredRoles: RoleType[];
  moduleName: string;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({ requiredRoles, moduleName }) => {
  const { currentUser, switchPersona, setCurrentRoute } = useApp();

  return (
    <div className="min-h-[500px] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-red-200 p-8 text-center shadow-medium">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShieldX className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Access Restricted</h2>
        <p className="text-sm text-gray-600 mb-4">
          You are currently signed in as <strong className="text-brand-charcoal">{currentUser.name}</strong> with role{' '}
          <span className="font-semibold px-2 py-0.5 rounded bg-gray-100 text-brand-dark">
            {currentUser.role.replace('_', ' ')}
          </span>
          .
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-left text-xs text-amber-900 mb-6">
          <div className="flex items-center gap-1.5 font-semibold mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>UI Permission Guard Notice</span>
          </div>
          <p>
            The module <strong className="font-semibold">{moduleName}</strong> requires one of the following roles:
          </p>
          <ul className="list-disc pl-5 mt-1 space-y-0.5 text-amber-950 font-medium">
            {requiredRoles.map((r) => (
              <li key={r}>{r.replace('_', ' ')}</li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-amber-800 italic">
            Note: This is a frontend demonstration of role access boundaries and action availability, not a production security enforcement.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {requiredRoles.includes('SUPER_ADMIN') && (
            <button
              onClick={() => switchPersona('user-admin-super')}
              className="w-full py-2.5 px-4 bg-brand-dark hover:bg-brand-darker text-white rounded-xl text-xs font-semibold shadow transition-all"
            >
              Switch to Super Admin (Ayesha Sen)
            </button>
          )}

          {requiredRoles.includes('DISPUTES_VERIFICATION') && (
            <button
              onClick={() => switchPersona('user-admin-disputes')}
              className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow transition-all"
            >
              Switch to Disputes & Verification (Vikram Rao)
            </button>
          )}

          {requiredRoles.includes('ACCOUNTS_FINANCE') && (
            <button
              onClick={() => switchPersona('user-admin-finance')}
              className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow transition-all"
            >
              Switch to Accounts & Finance (Suresh Patel)
            </button>
          )}

          {requiredRoles.includes('OPERATIONS_SUPPORT') && (
            <button
              onClick={() => switchPersona('user-admin-ops')}
              className="w-full py-2.5 px-4 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold shadow transition-all"
            >
              Switch to Operations & Support (Kavita Nair)
            </button>
          )}

          <button
            onClick={() => setCurrentRoute('/admin')}
            className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors mt-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Admin Overview</span>
          </button>
        </div>
      </div>
    </div>
  );
};

