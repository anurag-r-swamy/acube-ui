import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/branding';
import {
  User,
  MapPin,
  Briefcase,
  HelpCircle,
  FileText,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Plus,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';

interface CustomerProfileProps {
  onStartWorkerOnboarding: () => void;
}

export const CustomerProfile: React.FC<CustomerProfileProps> = ({ onStartWorkerOnboarding }) => {
  const { currentUser, switchPersona, showToast, setIsAuthModalOpen, setAuthModalMode } = useApp();
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'ADDRESSES' | 'HELP' | 'LEGAL'>('DETAILS');
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);

  const isAlreadyWorker = currentUser.availableRoles.includes('WORKER');

  return (
    <div className="space-y-4 pb-24 text-xs">
      {/* Profile Card Header */}
      <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-soft flex items-center gap-3.5">
        <img
          src={currentUser.avatarUrl}
          alt={currentUser.name}
          className="w-14 h-14 rounded-2xl object-cover border-2 border-brand-accent shadow-xs"
        />
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <h2 className="text-base font-bold text-gray-900">{currentUser.name}</h2>
            <span className="text-[10px] bg-brand-bg text-brand-dark px-2 py-0.5 rounded-full font-bold">
              Customer
            </span>
          </div>
          <p className="text-gray-500 text-[11px]">{currentUser.phone}</p>
          <p className="text-gray-400 text-[10px]">{currentUser.email}</p>
        </div>
      </div>

      {/* Prominent "Become a Worker" Banner (if not already worker) */}
      {!isAlreadyWorker && (
        <div className="p-4 bg-gradient-to-r from-brand-dark to-brand-light text-white rounded-2xl shadow-lifted relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <span className="inline-flex items-center gap-1 bg-brand-accent text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              Partner Opportunity
            </span>
            <h3 className="font-extrabold text-sm leading-snug">
              Earn with {APP_CONFIG.parentCompany} in Bengaluru
            </h3>
            <p className="text-white/80 text-[11px] leading-relaxed">
              Are you an electrician, plumber, cleaner, or technician? Register your skills, pass our digital verification, and start receiving job requests.
            </p>
            <button
              onClick={onStartWorkerOnboarding}
              className="mt-2 py-2.5 px-4 bg-brand-accent hover:bg-brand-accent-hover text-white font-bold rounded-xl text-xs shadow transition-all flex items-center gap-1.5"
            >
              <span>Start Worker Onboarding</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-brand-accent/20 rounded-full blur-xl pointer-events-none"></div>
        </div>
      )}

      {/* Sub-Navigation Pills */}
      <div className="grid grid-cols-4 gap-1.5 bg-gray-100 p-1 rounded-xl">
        {[
          { key: 'DETAILS', label: 'Details' },
          { key: 'ADDRESSES', label: 'Addresses' },
          { key: 'HELP', label: 'Help & FAQ' },
          { key: 'LEGAL', label: 'Policies' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`py-2 text-center font-bold text-[11px] rounded-lg transition-all ${
              activeTab === tab.key ? 'bg-white text-brand-dark shadow-xs' : 'text-gray-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Details */}
      {activeTab === 'DETAILS' && (
        <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-soft space-y-3">
          <h3 className="font-bold text-gray-900 text-xs">Customer Account Overview</h3>
          <div className="space-y-2 text-gray-600">
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-400">Account Type</span>
              <span className="font-semibold text-gray-900">Consumer Account</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-400">Default City</span>
              <span className="font-semibold text-gray-900">{APP_CONFIG.cityDefault}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-400">Linked Capabilities</span>
              <span className="font-semibold text-brand-dark">
                {currentUser.availableRoles.join(' & ')}
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-gray-400">Member Since</span>
              <span className="font-semibold text-gray-900">
                {new Date(currentUser.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setAuthModalMode('SIGN_UP');
                setIsAuthModalOpen(true);
              }}
              className="w-full py-2.5 px-3 bg-brand-dark hover:bg-brand-darker text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs"
            >
              <User className="w-3.5 h-3.5 text-brand-accent" />
              <span>Register New Customer Account</span>
            </button>

            <button
              onClick={() => {
                setAuthModalMode('SIGN_IN');
                setIsAuthModalOpen(true);
              }}
              className="w-full py-2 px-3 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5"
            >
              <span>Sign In with Another Account</span>
            </button>

            <button
              onClick={() => {
                setAuthModalMode('WELCOME');
                setIsAuthModalOpen(true);
              }}
              className="w-full py-1.5 text-gray-500 hover:text-brand-dark font-medium text-[11px] underline text-center"
            >
              View Onboarding Walkthrough Slides
            </button>
          </div>
        </div>
      )}

      {/* Tab: Saved Addresses */}
      {activeTab === 'ADDRESSES' && (
        <div className="space-y-2.5">
          {currentUser.addresses.map((addr) => (
            <div
              key={addr.id}
              className="p-3.5 bg-white rounded-2xl border border-gray-100 shadow-soft flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-brand-bg text-brand-dark flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-gray-900">{addr.label}</h4>
                  {addr.isDefault && (
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mt-0.5 leading-relaxed">
                  {addr.street}, {addr.area}, {addr.city} - {addr.pincode}
                </p>
              </div>
            </div>
          ))}
          <button
            onClick={() => showToast('Address creation simulated in prototype state.', 'info')}
            className="w-full py-2.5 bg-white border border-dashed border-gray-300 rounded-xl text-gray-600 font-semibold hover:border-brand-dark flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-brand-accent" />
            <span>Add New Bengaluru Address</span>
          </button>
        </div>
      )}

      {/* Tab: Help & FAQ */}
      {activeTab === 'HELP' && (
        <div className="space-y-3">
          <div className="p-3.5 bg-white rounded-2xl border border-gray-100 shadow-soft space-y-2.5">
            <h3 className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-brand-accent" />
              <span>Frequently Asked Questions</span>
            </h3>
            <div className="space-y-2 text-gray-700">
              <div className="p-2.5 bg-gray-50 rounded-xl">
                <p className="font-bold text-gray-900">How does payment protection work?</p>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  Your funds are held in platform escrow until the service technician finishes the task and you tap "Confirm Work Done".
                </p>
              </div>
              <div className="p-2.5 bg-gray-50 rounded-xl">
                <p className="font-bold text-gray-900">Are workers verified?</p>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  Yes, every pro undergoes identity authentication (Aadhaar/PAN), trade skill review, and criminal background checks.
                </p>
              </div>
              <div className="p-2.5 bg-gray-50 rounded-xl">
                <p className="font-bold text-gray-900">What if property is damaged?</p>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  You can immediately raise a formal Dispute from your booking view. Our Bengaluru resolution team investigates within 4 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Legal & Policies */}
      {activeTab === 'LEGAL' && (
        <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-soft space-y-3">
          <h3 className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Platform Guidelines & Terms</span>
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {APP_CONFIG.parentCompany} operates this prototype marketplace. All payments, verifications, and dispatches in this prototype are local UI simulations.
          </p>
          <div className="space-y-1.5 text-gray-500 text-[11px]">
            <p>• Zero Cash Extortion Policy: Providers are forbidden from charging unauthorized cash.</p>
            <p>• Cancellation SLA: Full refund if cancelled 2+ hours prior to slot.</p>
            <p>• Privacy: Masked phone proxies protect both customer and provider telephone numbers.</p>
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
          <span>Sign Out (Simulation)</span>
        </button>
      </div>

      {showSignOutDialog && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/75 p-4">
          <div className="max-w-xs w-full bg-white rounded-2xl p-5 text-center space-y-3 shadow-lifted">
            <h4 className="font-bold text-gray-900 text-sm">Sign Out Confirmation</h4>
            <p className="text-gray-600 text-xs">
              This is a prototype demo. You can switch personas anytime using the top demo bar.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowSignOutDialog(false)}
                className="flex-1 py-2 border border-gray-200 text-gray-700 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSignOutDialog(false);
                  switchPersona('user-cust-1');
                  showToast('Signed out of demo session.', 'info');
                }}
                className="flex-1 py-2 bg-brand-dark text-white rounded-lg font-semibold"
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

