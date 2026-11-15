import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldX, AlertTriangle, ArrowLeft, Lock } from 'lucide-react';
import { RoleType } from '../../types';

interface AccessDeniedProps {
  requiredRoles: RoleType[];
  moduleName: string;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({ requiredRoles, moduleName }) => {
  const { currentUser } = useApp();

  return (
    <div className="min-h-[450px] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-red-200 p-8 text-center shadow-soft">
        <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100">
          <ShieldX className="w-7 h-7" />
        </div>

        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100 inline-block mb-2">
          HTTP 403 Forbidden
        </span>

        <h2 className="text-lg font-bold text-slate-900 mb-1">Access Restricted</h2>
        <p className="text-xs text-slate-600 mb-4">
          You are currently signed in as <strong className="text-slate-900">{currentUser.name}</strong> with role{' '}
          <span className="font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
            {currentUser.role.replace('_', ' ')}
          </span>
          .
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-left text-xs text-slate-700 mb-6 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <Lock className="w-3.5 h-3.5 text-red-600" />
            <span>Role-Based Access Guard</span>
          </div>
          <p className="text-slate-500 text-[11px]">
            The module <strong className="text-slate-800">{moduleName}</strong> requires one of the following authorized administrator privileges:
          </p>
          <ul className="list-disc pl-5 space-y-0.5 text-slate-800 font-semibold text-[11px]">
            {requiredRoles.map((r) => (
              <li key={r}>{r.replace('_', ' ')}</li>
            ))}
          </ul>
        </div>

        <p className="text-[11px] text-slate-400">
          If you require access to this operational area, please contact the Lead Super Administrator or Security Officer to update your role permissions.
        </p>
      </div>
    </div>
  );
};
