import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/branding';
import {
  Shield,
  Lock,
  KeyRound,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  UserCheck,
  Building,
  Eye,
  EyeOff,
} from 'lucide-react';

interface AdminLoginPageProps {
  onLoginSuccess: (adminUserId: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess }) => {
  const { users, showToast } = useApp();

  const [selectedStaffId, setSelectedStaffId] = useState('user-admin-super');
  const [emailInput, setEmailInput] = useState('ayesha.sen@acubex-demo.internal');
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [twoFactorCode, setTwoFactorCode] = useState('749102');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const staffProfiles = [
    {
      id: 'user-admin-super',
      name: 'Ayesha Sen',
      role: 'SUPER_ADMIN',
      email: 'ayesha.sen@acubex-demo.internal',
      department: 'Executive Operations & Platform Admin',
      badgeColor: 'bg-[#1B4D3E] text-white border border-[#2D6A4F]',
      permissions: 'Full access to all 15 operational modules',
    },
    {
      id: 'user-admin-disputes',
      name: 'Vikram Rao',
      role: 'DISPUTES_VERIFICATION',
      email: 'vikram.rao@acubex-demo.internal',
      department: 'Trust & Safety / Quality Assurance',
      badgeColor: 'bg-[#2D6A4F] text-white border border-[#3E8565]',
      permissions: 'Worker identity verification & customer dispute resolution',
    },
    {
      id: 'user-admin-finance',
      name: 'Suresh Patel',
      role: 'ACCOUNTS_FINANCE',
      email: 'suresh.patel@acubex-demo.internal',
      department: 'Finance, Payouts & Commission Operations',
      badgeColor: 'bg-emerald-600 text-white',
      permissions: 'Payment oversight, settlements, and financial audits',
    },
    {
      id: 'user-admin-ops',
      name: 'Kavita Nair',
      role: 'OPERATIONS_SUPPORT',
      email: 'kavita.nair@acubex-demo.internal',
      department: 'City Operations & Partner Support',
      badgeColor: 'bg-purple-600 text-white',
      permissions: 'Live booking monitoring, customer/worker directories, categories',
    },
  ];

  const handleSelectStaff = (staffId: string) => {
    setSelectedStaffId(staffId);
    const staff = staffProfiles.find((s) => s.id === staffId);
    if (staff) {
      setEmailInput(staff.email);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(selectedStaffId);
      showToast('Admin credentials & 2FA authenticated. Access granted.', 'success', 'Staff Login Successful');
    }, 600);
  };

  const selectedStaff = staffProfiles.find((s) => s.id === selectedStaffId) || staffProfiles[0];

  return (
    <div className="min-h-screen bg-[#07130D] flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-xl">
        {/* Brand Header */}
        <div className="text-center mb-6 space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0E241A] border border-[#1E4D37] rounded-full mb-2">
            <Shield className="w-4 h-4 text-[#82C3A3]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-100/80">
              {APP_CONFIG.parentCompany} Governance Network
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Administrator Web Console
          </h1>
          <p className="text-xs text-emerald-100/60">
            Dedicated desktop platform for platform governance, verification, and operations
          </p>
        </div>

        {/* Security Warning Banner */}
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-4 flex items-start gap-2.5 text-amber-300 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          <div className="leading-tight">
            <span className="font-bold">Restricted Access System:</span> This web console is strictly reserved for authorized platform staff. Customer and worker mobile accounts cannot authenticate here.
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-[#0E241A] rounded-2xl border border-[#1E4D37] shadow-lifted overflow-hidden">
          {/* Card Top Strip */}
          <div className="p-4 border-b border-[#1E4D37] flex items-center justify-between bg-[#0B1C14]/80">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1B4D3E]/30 border border-[#2D6A4F]/40 flex items-center justify-center text-[#82C3A3]">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-white">Staff Credential Verification</h2>
                <p className="text-[10px] text-emerald-100/60">2-Factor Authentication Required</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
              SSL / TLS 1.3
            </span>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            {/* Quick Demo Staff Profile Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-emerald-100/90 block">
                Select Authorized Staff Persona (Demo Quick-Fill)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {staffProfiles.map((staff) => (
                  <button
                    key={staff.id}
                    type="button"
                    onClick={() => handleSelectStaff(staff.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedStaffId === staff.id
                        ? 'bg-[#163829] border-[#2D6A4F] text-white ring-1 ring-[#2D6A4F]'
                        : 'bg-[#0B1C14] hover:bg-[#122A1F] border-[#1E4D37] text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs truncate">{staff.name}</span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded ${staff.badgeColor}`}>
                        {staff.role.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[10px] text-emerald-100/60 truncate">{staff.department}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Email / Staff ID */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-emerald-100/90 block">Staff Email</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                className="w-full py-2.5 px-3 bg-[#0B1C14] border border-[#1E4D37] text-white rounded-xl text-xs focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F] transition-colors"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-emerald-100/90 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                  className="w-full py-2.5 pl-3 pr-10 bg-[#0B1C14] border border-[#1E4D37] text-white rounded-xl text-xs focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 2FA Token Code */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-emerald-100/90">2FA Security Token</label>
                <span className="text-[10px] text-[#82C3A3]">Demo Code: 749102</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  maxLength={6}
                  required
                  className="w-full py-2.5 pl-9 pr-3 bg-[#0B1C14] border border-[#1E4D37] text-white font-mono tracking-widest text-sm rounded-xl focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F] transition-colors"
                />
                <KeyRound className="w-4 h-4 text-emerald-200/50 absolute left-3 top-3" />
              </div>
            </div>

            {/* Role Permissions Preview */}
            <div className="p-3 bg-[#07130D]/80 rounded-xl border border-[#1E4D37] space-y-1">
              <div className="flex items-center gap-1.5 text-[#82C3A3] text-[10px] font-bold uppercase tracking-wider">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Granted Role Privileges:</span>
              </div>
              <p className="text-[11px] text-emerald-100/80">{selectedStaff.permissions}</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#1B4D3E] hover:bg-[#256653] text-white font-bold rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>Sign In to Admin Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="mt-4 text-center text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} {APP_CONFIG.parentCompany} Enterprise Systems. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};
