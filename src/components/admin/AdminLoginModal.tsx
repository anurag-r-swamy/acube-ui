import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/branding';
import { Shield, Lock, User, KeyRound, CheckCircle2, ArrowRight, X } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const { switchPersona, adminStaff, setCurrentRoute, showToast } = useApp();

  const [selectedStaffId, setSelectedStaffId] = useState('user-admin-super');
  const [password, setPassword] = useState('••••••••••••');
  const [twoFactorCode, setTwoFactorCode] = useState('749102');

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    switchPersona(selectedStaffId);
    setCurrentRoute('/admin');
    showToast('Admin authentication token verified. Welcome to Operations Console.', 'success');
    onClose();
  };

  const staffProfiles = [
    {
      id: 'user-admin-super',
      name: 'Ayesha Sen',
      role: 'SUPER_ADMIN',
      department: 'Executive Operations',
      badgeColor: 'bg-brand-dark text-white',
    },
    {
      id: 'user-admin-disputes',
      name: 'Vikram Rao',
      role: 'DISPUTES_VERIFICATION',
      department: 'Trust & Safety / Quality Assurance',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'user-admin-finance',
      name: 'Suresh Patel',
      role: 'ACCOUNTS_FINANCE',
      department: 'Finance, Payouts & Commission Operations',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'user-admin-ops',
      name: 'Kavita Nair',
      role: 'OPERATIONS_SUPPORT',
      department: 'City Operations & Partner Support',
      badgeColor: 'bg-purple-100 text-purple-800',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lifted overflow-hidden animate-in zoom-in-95 text-xs">
        {/* Header */}
        <div className="bg-brand-charcoal text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-dark border border-white/10 flex items-center justify-center text-brand-accent">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">{APP_CONFIG.parentCompany} Staff Portal</h3>
              <p className="text-[10px] text-gray-400">Restricted Operations Console Simulation</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSignIn} className="p-6 space-y-4">
          <div>
            <label className="block font-bold text-gray-700 mb-1.5">
              Select Staff Member / Role to Authenticate
            </label>
            <div className="space-y-1.5">
              {staffProfiles.map((s) => (
                <label
                  key={s.id}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    selectedStaffId === s.id
                      ? 'border-brand-dark bg-brand-bg shadow-xs font-semibold'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="staff_select"
                    checked={selectedStaffId === s.id}
                    onChange={() => setSelectedStaffId(s.id)}
                    className="mt-0.5 text-brand-dark"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 font-bold">{s.name}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${s.badgeColor}`}>
                        {s.role.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500">{s.department}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 pl-7 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
                />
                <Lock className="w-3.5 h-3.5 text-gray-400 absolute left-2 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Simulated 2FA Token</label>
              <div className="relative">
                <input
                  type="text"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  className="w-full p-2 pl-7 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
                />
                <KeyRound className="w-3.5 h-3.5 text-gray-400 absolute left-2 top-2.5" />
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-brand-bg rounded-xl text-[11px] text-gray-500">
            *Visual simulation: Single Sign-On (SSO) and Multi-Factor Authentication are mocked.
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 border border-gray-200 text-gray-700 rounded-xl font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-brand-dark hover:bg-brand-darker text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5"
            >
              <span>Sign In as Staff Member</span>
              <ArrowRight className="w-4 h-4 text-brand-accent" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

