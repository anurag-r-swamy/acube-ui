import React from 'react';
import { useApp } from '../../context/AppContext';
import { AdminStaffMember, RoleType } from '../../types';
import { UserCheck, Shield, Check, X, Plus } from 'lucide-react';

export const AdminStaff: React.FC = () => {
  const { adminStaff, currentUser, showToast } = useApp();

  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';

  const roleMatrix: {
    permission: string;
    superAdmin: boolean;
    disputes: boolean;
    finance: boolean;
    operations: boolean;
  }[] = [
    { permission: 'Worker Verification Decisions', superAdmin: true, disputes: true, finance: false, operations: false },
    { permission: 'Complaints & Dispute Resolution', superAdmin: true, disputes: true, finance: false, operations: false },
    { permission: 'Issue Customer Refunds', superAdmin: true, disputes: false, finance: true, operations: false },
    { permission: 'Release Weekly Partner Settlements', superAdmin: true, disputes: false, finance: true, operations: false },
    { permission: 'Adjust Commission Percentage Rules', superAdmin: true, disputes: false, finance: true, operations: false },
    { permission: 'Manage Categories & Subcategories', superAdmin: true, disputes: false, finance: false, operations: true },
    { permission: 'Manage Service Localities & Zones', superAdmin: true, disputes: false, finance: false, operations: true },
    { permission: 'Staff Management & Role Assignments', superAdmin: true, disputes: false, finance: false, operations: false },
    { permission: 'View Privileged Audit Log', superAdmin: true, disputes: true, finance: true, operations: true },
  ];

  return (
    <div className="space-y-6 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-gray-900">Staff Administration & Role Permissions</h1>
          <p className="text-gray-500 text-xs">
            Manage staff credentials, assigned operational departments and role access boundaries
          </p>
        </div>
        <span className="text-[10px] bg-brand-dark text-white font-bold px-2.5 py-1 rounded-full">
          Super Admin Management Console
        </span>
      </div>

      {/* Staff Members List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-sm text-gray-900">Current Staff Directory ({adminStaff.length})</h2>
          <button
            onClick={() => showToast('Staff invitation simulated in prototype.', 'info')}
            className="py-1.5 px-3 bg-brand-dark text-white font-bold rounded-xl flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Invite Staff Member</span>
          </button>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 text-[10px] text-gray-400 uppercase tracking-wider bg-gray-50/50">
              <th className="py-3 px-4">Staff Member</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Assigned Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Last Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {adminStaff.map((staff) => (
              <tr key={staff.id} className="hover:bg-gray-50">
                <td className="py-3.5 px-4 font-bold text-gray-900">
                  <p>{staff.name}</p>
                  <p className="text-[10px] text-gray-400 font-normal">{staff.email}</p>
                </td>
                <td className="py-3.5 px-4 text-gray-700">{staff.department}</td>
                <td className="py-3.5 px-4">
                  <span className="font-bold text-[10px] bg-brand-bg text-brand-dark px-2 py-0.5 rounded-full">
                    {staff.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                    Active
                  </span>
                </td>
                <td className="py-3.5 px-4 text-gray-500">{staff.lastActive}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Permission Matrix Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-soft p-5 space-y-4">
        <div>
          <h2 className="font-bold text-sm text-gray-900">Role & Capability Permission Matrix</h2>
          <p className="text-gray-500 text-[11px]">
            Frontend route and action protection enforces these boundaries across all operational panels.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-gray-100 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-brand-bg text-[11px] text-brand-charcoal font-bold border-b border-gray-200">
                <th className="p-3">Platform Capability / Action</th>
                <th className="p-3 text-center">Super Admin</th>
                <th className="p-3 text-center">Disputes & Verification</th>
                <th className="p-3 text-center">Accounts & Finance</th>
                <th className="p-3 text-center">Operations & Support</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {roleMatrix.map((row) => (
                <tr key={row.permission} className="hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-800">{row.permission}</td>
                  <td className="p-3 text-center">
                    <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                  </td>
                  <td className="p-3 text-center">
                    {row.disputes ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300 mx-auto" />
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {row.finance ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300 mx-auto" />
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {row.operations ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

