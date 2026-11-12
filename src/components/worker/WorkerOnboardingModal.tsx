import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/branding';
import {
  X,
  ShieldCheck,
  Upload,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  MapPin,
  Clock,
  CreditCard,
  FileText,
  Sparkles,
} from 'lucide-react';

interface WorkerOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type OnboardingStep = 'PROFILE' | 'SKILLS_RATES' | 'DOCUMENTS' | 'BANK' | 'SUCCESS';

export const WorkerOnboardingModal: React.FC<WorkerOnboardingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentUser, categories, becomeWorker, showToast } = useApp();

  const [step, setStep] = useState<OnboardingStep>('PROFILE');
  const [headline, setHeadline] = useState('Certified Home Electrician & Maintenance Specialist');
  const [about, setAbout] = useState(
    'Experienced technician with over 5 years handling electrical switchboards, inverter wiring, and appliance diagnostics across Bengaluru.'
  );
  const [primaryCat, setPrimaryCat] = useState('Electrical & Appliances');
  const [skillsText, setSkillsText] = useState('Wiring, Switchboard Repair, MCB Replacement, Inverter Setup');
  const [experienceYears, setExperienceYears] = useState(5);
  const [baseFare, setBaseFare] = useState(199);
  const [hourlyRate, setHourlyRate] = useState(350);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([
    'Koramangala',
    'HSR Layout',
    'Indiranagar',
  ]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    'Kannada',
    'English',
    'Hindi',
  ]);

  // Documents simulation
  const [govIdName, setGovIdName] = useState('aadhaar_demo_redacted.pdf');
  const [certName, setCertName] = useState('trade_competency_cert.pdf');

  // Bank details
  const [bankName, setBankName] = useState('HDFC Bank - Koramangala');
  const [accountNumber, setAccountNumber] = useState('•••• •••• 8821');
  const [ifscCode, setIfscCode] = useState('HDFC0001248');
  const [upiId, setUpiId] = useState(`${currentUser.name.toLowerCase().replace(/\s+/g, '')}@okaxis`);

  if (!isOpen) return null;

  const handleSubmitOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    becomeWorker({
      headline,
      about,
      primaryCategory: primaryCat,
      skills: skillsText.split(',').map((s) => s.trim()),
      experienceYears: Number(experienceYears),
      baseFare: Number(baseFare),
      hourlyRate: Number(hourlyRate),
      serviceAreas: selectedAreas,
      languages: selectedLanguages,
      documents: [
        {
          id: `doc-${Date.now()}-gov`,
          type: 'GOVERNMENT_ID',
          fileName: govIdName,
          uploadedAt: new Date().toISOString(),
          verified: false,
          notes: 'DigiLocker sandbox verification token attached',
        },
        {
          id: `doc-${Date.now()}-trade`,
          type: 'TRADE_CERTIFICATE',
          fileName: certName,
          uploadedAt: new Date().toISOString(),
          verified: false,
        },
      ],
      bankDetails: {
        accountHolder: currentUser.name,
        bankName,
        accountNumberMasked: accountNumber,
        ifscCode,
        upiId,
      },
    });

    setStep('SUCCESS');
  };

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-lifted animate-in slide-in-from-bottom-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-accent">
              Partner Registration
            </span>
            <h2 className="text-sm font-bold text-gray-900">
              {step === 'PROFILE' && 'Step 1: Trade Profile & Bio'}
              {step === 'SKILLS_RATES' && 'Step 2: Skills, Rates & Bengaluru Localities'}
              {step === 'DOCUMENTS' && 'Step 3: Identity & Trade Verification'}
              {step === 'BANK' && 'Step 4: Payout Account (Settlements)'}
              {step === 'SUCCESS' && 'Application Submitted for Review'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {step === 'PROFILE' && (
            <div className="space-y-3">
              <div className="p-3 bg-brand-accent-light border border-amber-200 rounded-xl text-brand-dark text-[11px]">
                <p className="font-bold mb-0.5">Dual-Capability Account Model</p>
                You are registered as <strong>{currentUser.name}</strong> ({currentUser.phone}). You will keep your consumer account and gain a linked worker profile.
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Professional Headline</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Primary Trade Category</label>
                <select
                  value={primaryCat}
                  onChange={(e) => setPrimaryCat(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">About Your Experience</label>
                <textarea
                  rows={3}
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs leading-relaxed"
                />
              </div>
            </div>
          )}

          {step === 'SKILLS_RATES' && (
            <div className="space-y-3.5">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Exp (Years)</label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Base Rate ({APP_CONFIG.currencySymbol})</label>
                  <input
                    type="number"
                    value={baseFare}
                    onChange={(e) => setBaseFare(Number(e.target.value))}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Hourly ({APP_CONFIG.currencySymbol})</label>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-center font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-accent" />
                  <span>Bengaluru Service Localities Covered</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Koramangala',
                    'Indiranagar',
                    'HSR Layout',
                    'Bellandur',
                    'Whitefield',
                    'Jayanagar',
                    'JP Nagar',
                    'Malleshwaram',
                  ].map((loc) => {
                    const isSelected = selectedAreas.includes(loc);
                    return (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => toggleArea(loc)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-brand-dark text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {isSelected && '✓ '}
                        {loc}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 'DOCUMENTS' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-[11px] leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-blue-600 inline mr-1" />
                <strong>Prototype Verification Notice:</strong> Document uploads are simulated in prototype state. Do not upload sensitive identity documents. Safe fictional demo files are provided.
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1.5">
                <span className="font-bold text-gray-900 block">1. Government Identity Proof</span>
                <p className="text-[11px] text-gray-500">Aadhaar / Voter ID / PAN Card</p>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200">
                  <span className="font-mono text-gray-700">{govIdName}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    Ready
                  </span>
                </div>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1.5">
                <span className="font-bold text-gray-900 block">2. Trade Certificate / License</span>
                <p className="text-[11px] text-gray-500">NSDC / ITI Diploma / Brand Training</p>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200">
                  <span className="font-mono text-gray-700">{certName}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    Ready
                  </span>
                </div>
              </div>
            </div>
          )}

          {step === 'BANK' && (
            <div className="space-y-3">
              <div className="p-3 bg-brand-bg rounded-xl text-gray-700 text-[11px]">
                <p className="font-bold text-brand-dark mb-0.5">Weekly Settlement Account</p>
                Platform commissions are deducted automatically; net service earnings are settled every Monday to this account.
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Bank Name & Branch</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Account No (Masked)</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">UPI ID for Quick Payouts</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
                />
              </div>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-gray-900 text-base">Application Under Review</h3>
              <p className="text-gray-600 text-xs max-w-sm mx-auto leading-relaxed">
                Your worker profile has been linked to your account with status{' '}
                <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  PENDING_REVIEW
                </span>
                .
              </p>
              <div className="p-3.5 bg-brand-bg rounded-xl text-left text-[11px] text-gray-700 space-y-1">
                <p>
                  • Verification case dispatched to <strong>Vikram Rao (Disputes & Verification)</strong>.
                </p>
                <p>• You can switch between Customer and Worker view from the top demo bar.</p>
                <p>• Try switching to Vikram Rao's role in the Admin dashboard to approve your profile!</p>
              </div>
              <button
                onClick={onClose}
                className="w-full py-3 bg-brand-dark text-white font-bold rounded-xl shadow"
              >
                Go to Worker Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {step !== 'SUCCESS' && (
          <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between gap-3">
            {step !== 'PROFILE' && (
              <button
                type="button"
                onClick={() => {
                  if (step === 'SKILLS_RATES') setStep('PROFILE');
                  if (step === 'DOCUMENTS') setStep('SKILLS_RATES');
                  if (step === 'BANK') setStep('DOCUMENTS');
                }}
                className="py-2.5 px-4 border border-gray-300 text-gray-700 font-semibold rounded-xl text-xs"
              >
                Back
              </button>
            )}

            {step === 'PROFILE' && (
              <button
                type="button"
                onClick={() => setStep('SKILLS_RATES')}
                className="flex-1 py-3 bg-brand-dark text-white font-semibold rounded-xl text-xs shadow"
              >
                Next: Rates & Localities →
              </button>
            )}

            {step === 'SKILLS_RATES' && (
              <button
                type="button"
                onClick={() => setStep('DOCUMENTS')}
                className="flex-1 py-3 bg-brand-dark text-white font-semibold rounded-xl text-xs shadow"
              >
                Next: Documents & ID →
              </button>
            )}

            {step === 'DOCUMENTS' && (
              <button
                type="button"
                onClick={() => setStep('BANK')}
                className="flex-1 py-3 bg-brand-dark text-white font-semibold rounded-xl text-xs shadow"
              >
                Next: Settlement Bank Details →
              </button>
            )}

            {step === 'BANK' && (
              <button
                type="button"
                onClick={handleSubmitOnboarding}
                className="flex-1 py-3 bg-brand-accent hover:bg-brand-accent-hover text-white font-bold rounded-xl text-xs shadow"
              >
                Submit Application for Verification
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

