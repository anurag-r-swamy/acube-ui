import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/branding';
import {
  MapPin,
  Briefcase,
  HelpCircle,
  ShieldCheck,
  LogOut,
  Plus,
  ArrowRightLeft,
  CheckCircle2,
} from 'lucide-react';

interface CustomerProfileProps {
  onStartWorkerOnboarding?: () => void;
}

export const CustomerProfile: React.FC<CustomerProfileProps> = () => {
  const {
    currentUser,
    switchPersona,
    switchUserMode,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'DETAILS' | 'ADDRESSES' | 'HELP' | 'LEGAL'>('DETAILS');
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);

  return (
    <div className="space-y-4 pb-20 text-xs">
      {/* Profile Card Header */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3.5">
        <img
          src={currentUser.avatarUrl}
          alt={currentUser.name}
          className="w-14 h-14 rounded-2xl object-cover border-2 border-[#0D2218] shadow-xs"
        />
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <h2 className="text-base font-bold text-black">{currentUser.name}</h2>
            <span className="text-[10px] bg-[#0D2218] text-white px-2 py-0.5 rounded-full font-bold">
              Customer
            </span>
          </div>
          <p className="text-slate-600 text-[11px]">{currentUser.phone}</p>
          <p className="text-slate-400 text-[10px]">{currentUser.email}</p>
        </div>
      </div>

      {/* Account Type Switcher Card (Customer <-> Worker) */}
      <div className="p-4 bg-[#0D2218] text-white rounded-2xl shadow-sm border border-[#1B4D3E] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-xs text-white">Active Account: Customer</span>
          </div>
          <span className="text-[10px] bg-white/10 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
            Consumer
          </span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          Switch to Worker mode to receive job requests, accept bookings, and manage earnings in Bengaluru.
        </p>
        <button
          onClick={() => switchUserMode('WORKER')}
          className="w-full py-2.5 px-3 bg-white hover:bg-slate-100 text-[#0D2218] font-black rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
        >
          <ArrowRightLeft className="w-4 h-4 text-[#0D2218]" />
          <span>Switch to Worker Account</span>
        </button>
      </div>

      {/* Sub-Navigation Pills */}
      <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-xl">
        {[
          { key: 'DETAILS', label: 'Details' },
          { key: 'ADDRESSES', label: 'Addresses' },
          { key: 'HELP', label: 'Help' },
          { key: 'LEGAL', label: 'Policies' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`py-2 text-center font-bold text-[11px] rounded-lg transition-all ${
              activeTab === tab.key ? 'bg-white text-black shadow-xs' : 'text-slate-500 hover:text-black'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Details */}
      {activeTab === 'DETAILS' && (
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <h3 className="font-bold text-black text-xs">Customer Profile Details</h3>
          <div className="space-y-2 text-slate-600">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-400">Account Type</span>
              <span className="font-semibold text-black">Customer (Personal)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-400">Default City</span>
              <span className="font-semibold text-black">{APP_CONFIG.cityDefault}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-400">Primary Contact</span>
              <span className="font-semibold text-black">{currentUser.phone}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Member Since</span>
              <span className="font-semibold text-black">
                {new Date(currentUser.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Saved Addresses */}
      {activeTab === 'ADDRESSES' && (
        <div className="space-y-2.5">
          {currentUser.addresses.map((addr) => (
            <div
              key={addr.id}
              className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-[#0D2218] text-white flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-black">{addr.label}</h4>
                  {addr.isDefault && (
                    <span className="text-[9px] bg-emerald-100 text-emerald-900 font-bold px-1.5 py-0.5 rounded">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  {addr.street}, {addr.area}, {addr.city} - {addr.pincode}
                </p>
              </div>
            </div>
          ))}
          <button
            onClick={() => showToast('Address creation simulated in prototype state.', 'info')}
            className="w-full py-2.5 bg-white border border-dashed border-slate-300 rounded-xl text-slate-700 font-bold hover:border-black flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-[#0D2218]" />
            <span>Add New Bengaluru Address</span>
          </button>
        </div>
      )}

      {/* Tab: Help & FAQ */}
      {activeTab === 'HELP' && (
        <div className="space-y-3">
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
            <h3 className="font-bold text-black text-xs flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-[#0D2218]" />
              <span>Frequently Asked Questions</span>
            </h3>
            <div className="space-y-2 text-slate-700">
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <p className="font-bold text-black">How does booking confirmation work?</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  When you book a service, an authenticated professional nearby is assigned and arrives at your doorstep in your selected slot.
                </p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <p className="font-bold text-black">Are professionals background verified?</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Yes, every professional undergoes Aadhaar/PAN identity checks and trade skill certification.
                </p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <p className="font-bold text-black">How do I pay?</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  You can pay securely via UPI or Card once the service is completed to your satisfaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Legal & Policies */}
      {activeTab === 'LEGAL' && (
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <h3 className="font-bold text-black text-xs flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#0D2218]" />
            <span>Platform Guidelines & Terms</span>
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {APP_CONFIG.parentCompany} provides verified home and technical services across Bengaluru.
          </p>
          <div className="space-y-1.5 text-slate-500 text-[11px]">
            <p>• Zero Cash Extortion: Providers cannot demand unauthorized cash.</p>
            <p>• Cancellation SLA: Full refund if cancelled 2+ hours prior to slot.</p>
            <p>• Privacy Protection: Phone numbers are masked for security.</p>
          </div>
        </div>
      )}

      {/* Sign Out Simulation */}
      <div className="pt-2">
        <button
          onClick={() => setShowSignOutDialog(true)}
          className="w-full py-2.5 border border-red-200 text-red-600 hover:bg-red-50 font-semibold rounded-xl flex items-center justify-center gap-1.5"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {showSignOutDialog && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/75 p-4">
          <div className="max-w-xs w-full bg-white rounded-2xl p-5 text-center space-y-3 shadow-lifted">
            <h4 className="font-bold text-black text-sm">Sign Out Confirmation</h4>
            <p className="text-slate-600 text-xs">
              Are you sure you want to sign out of this session?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowSignOutDialog(false)}
                className="flex-1 py-2 border border-slate-200 text-slate-700 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSignOutDialog(false);
                  switchPersona('user-cust-1');
                  showToast('Signed out of session.', 'info');
                }}
                className="flex-1 py-2 bg-[#0D2218] text-white rounded-lg font-semibold"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
