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
  ArrowRight,
  TrendingUp,
  User,
  Phone,
  Mail,
  DollarSign,
  ChevronRight,
  Check,
} from 'lucide-react';

interface WorkerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type RegStep = 'PERSONAL' | 'TRADE_SKILLS' | 'RATES_ZONES' | 'DOCUMENTS' | 'BANK' | 'SUCCESS';

const BENGALURU_ZONES = [
  'Koramangala',
  'Indiranagar',
  'HSR Layout',
  'Bellandur',
  'Whitefield',
  'Jayanagar',
  'JP Nagar',
  'Malleshwaram',
  'BTM Layout',
  'Electronic City',
  'Marathahalli',
  'Hebbal',
];

const LANGUAGES = ['Kannada', 'English', 'Hindi', 'Tamil', 'Telugu'];

export const WorkerRegistrationModal: React.FC<WorkerRegistrationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { categories, registerUser, becomeWorker, showToast, setCurrentRoute } = useApp();

  const [step, setStep] = useState<RegStep>('PERSONAL');

  // Step 1: Personal Details
  const [fullName, setFullName] = useState('Manjunath Gowda');
  const [phone, setPhone] = useState('98455 77812');
  const [email, setEmail] = useState('manjunath.electric@example.com');
  const [baseLocality, setBaseLocality] = useState('Koramangala 4th Block');
  const [otpCode, setOtpCode] = useState('5829');
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // Step 2: Trade & Skills
  const [primaryCat, setPrimaryCat] = useState('Electrical & Appliances');
  const [headline, setHeadline] = useState('Certified Master Electrician & Power Backup Specialist');
  const [about, setAbout] = useState(
    'Over 7 years of specialized experience in residential wiring, smart switchboard installations, MCB load balancing, and inverter wiring in Bengaluru.'
  );
  const [skillsText, setSkillsText] = useState('Wiring, Switchboard Repair, MCB Trips, Inverter Setup, Geyser Wiring');
  const [experienceYears, setExperienceYears] = useState(7);

  // Step 3: Rates & Coverage
  const [baseFare, setBaseFare] = useState(249);
  const [hourlyRate, setHourlyRate] = useState(350);
  const [selectedZones, setSelectedZones] = useState<string[]>([
    'Koramangala',
    'HSR Layout',
    'Indiranagar',
    'Bellandur',
  ]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['Kannada', 'English', 'Hindi']);

  // Step 4: Documents (Simulated)
  const [govIdName, setGovIdName] = useState('aadhaar_manjunath_redacted.pdf');
  const [tradeCertName, setTradeCertName] = useState('nsdc_electrical_level4_cert.pdf');

  // Step 5: Bank Account
  const [accountHolder, setAccountHolder] = useState('Manjunath Gowda');
  const [bankName, setBankName] = useState('Canara Bank - Koramangala');
  const [accountNumber, setAccountNumber] = useState('•••• •••• 5519');
  const [ifscCode, setIfscCode] = useState('CNRB0001048');
  const [upiId, setUpiId] = useState('manjunath@okaxis');

  if (!isOpen) return null;

  const toggleZone = (zone: string) => {
    setSelectedZones((prev) =>
      prev.includes(zone) ? prev.filter((z) => z !== zone) : [...prev, zone]
    );
  };

  const toggleLang = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Register the base user with role 'WORKER'
    const newUser = registerUser({
      name: fullName.trim(),
      email: email.trim(),
      phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
      area: baseLocality,
      role: 'WORKER',
    });

    // 2. Attach the detailed WorkerProfile with PENDING_REVIEW
    becomeWorker({
      fullName: fullName.trim(),
      phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
      email: email.trim(),
      headline: headline.trim(),
      about: about.trim(),
      primaryCategory: primaryCat,
      skills: skillsText.split(',').map((s) => s.trim()),
      experienceYears: Number(experienceYears),
      baseFare: Number(baseFare),
      hourlyRate: Number(hourlyRate),
      serviceAreas: selectedZones,
      languages: selectedLanguages,
      documents: [
        {
          id: `doc-${Date.now()}-gov`,
          type: 'GOVERNMENT_ID',
          fileName: govIdName,
          uploadedAt: new Date().toISOString(),
          verified: false,
          notes: 'DigiLocker Aadhaar e-KYC sandbox record attached',
        },
        {
          id: `doc-${Date.now()}-trade`,
          type: 'TRADE_CERTIFICATE',
          fileName: tradeCertName,
          uploadedAt: new Date().toISOString(),
          verified: false,
          notes: 'NSDC Skill India Registry certified',
        },
      ],
      bankDetails: {
        accountHolder: accountHolder.trim() || fullName.trim(),
        bankName: bankName.trim(),
        accountNumberMasked: accountNumber.trim(),
        ifscCode: ifscCode.trim(),
        upiId: upiId.trim(),
      },
    });

    setStep('SUCCESS');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col shadow-lifted animate-in slide-in-from-bottom-4 text-xs">
        {/* Header */}
        <div className="bg-brand-dark text-white p-4 rounded-t-3xl sm:rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-light flex items-center justify-center text-brand-accent">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-brand-accent uppercase tracking-wider block">
                {APP_CONFIG.parentCompany} Partner Network
              </span>
              <h2 className="text-sm font-bold text-white">
                {step === 'PERSONAL' && '1. Partner Contact & Phone Verification'}
                {step === 'TRADE_SKILLS' && '2. Trade Specialization & Skills'}
                {step === 'RATES_ZONES' && '3. Pricing & Bengaluru Localities'}
                {step === 'DOCUMENTS' && '4. DigiLocker ID & Trade Certification'}
                {step === 'BANK' && '5. Weekly Settlement Bank Details'}
                {step === 'SUCCESS' && 'Application Submitted Successfully!'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        {step !== 'SUCCESS' && (
          <div className="grid grid-cols-5 gap-1 p-2 bg-brand-bg border-b border-gray-100">
            {['Personal', 'Skills', 'Rates', 'Docs', 'Payout'].map((label, idx) => {
              const stepIndex =
                step === 'PERSONAL'
                  ? 0
                  : step === 'TRADE_SKILLS'
                  ? 1
                  : step === 'RATES_ZONES'
                  ? 2
                  : step === 'DOCUMENTS'
                  ? 3
                  : 4;
              const isPast = idx <= stepIndex;
              return (
                <div key={label} className="text-center">
                  <div
                    className={`h-1.5 rounded-full mb-1 transition-all ${
                      isPast ? 'bg-brand-accent' : 'bg-gray-200'
                    }`}
                  ></div>
                  <span
                    className={`text-[9px] font-bold uppercase ${
                      isPast ? 'text-brand-dark' : 'text-gray-400'
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* ================= STEP 1: PERSONAL & OTP ================= */}
          {step === 'PERSONAL' && (
            <div className="space-y-3.5">
              {/* Partner Value Props Banner */}
              <div className="p-3 bg-gradient-to-r from-emerald-50 to-brand-bg rounded-xl border border-emerald-200 flex items-start gap-2.5 text-emerald-950">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <p className="font-bold">Join 500+ Top Earners in Bengaluru</p>
                  <p className="text-emerald-800">
                    Direct weekly settlements every Monday, guaranteed job broadcasts, and free platform safety insurance.
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Full Legal Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Manjunath Gowda"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full py-2 px-3 pl-8 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white"
                  />
                  <User className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Mobile Phone Number (WhatsApp Enabled) *</label>
                <div className="relative flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-100 text-gray-600 font-semibold text-xs">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 py-2 px-3 bg-gray-50 border border-gray-200 rounded-r-xl text-xs focus:bg-white"
                  />
                </div>
              </div>

              {/* Simulated OTP verification banner */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-800 text-[11px]">Instant Mobile OTP Verification</p>
                  <p className="text-[10px] text-gray-500">Demo OTP code is pre-verified (5829)</p>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Verified
                </span>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Email Address *</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-2 px-3 pl-8 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white"
                  />
                  <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Home / Workshop Base Locality</label>
                <select
                  value={baseLocality}
                  onChange={(e) => setBaseLocality(e.target.value)}
                  className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                >
                  {BENGALURU_ZONES.map((zone) => (
                    <option key={zone} value={`${zone}, Bengaluru`}>
                      {zone}, Bengaluru
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* ================= STEP 2: TRADE & SKILLS ================= */}
          {step === 'TRADE_SKILLS' && (
            <div className="space-y-3.5">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Primary Trade Category *</label>
                <select
                  value={primaryCat}
                  onChange={(e) => setPrimaryCat(e.target.value)}
                  className="w-full py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Professional Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Electrician with 7+ Years Experience"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Detailed Bio & Experience</label>
                <textarea
                  rows={3}
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Specific Skills (Comma-separated)
                </label>
                <input
                  type="text"
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Total Years in Trade</label>
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                />
              </div>
            </div>
          )}

          {/* ================= STEP 3: RATES & LOCALITIES ================= */}
          {step === 'RATES_ZONES' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-brand-bg rounded-xl border border-gray-200">
                  <label className="block font-bold text-gray-800 text-[11px] mb-1">
                    Base Diagnostic Fare ({APP_CONFIG.currencySymbol})
                  </label>
                  <input
                    type="number"
                    min={99}
                    max={999}
                    value={baseFare}
                    onChange={(e) => setBaseFare(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm font-extrabold text-brand-dark"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Starting callout rate</p>
                </div>

                <div className="p-3 bg-brand-bg rounded-xl border border-gray-200">
                  <label className="block font-bold text-gray-800 text-[11px] mb-1">
                    Hourly Labor Rate ({APP_CONFIG.currencySymbol})
                  </label>
                  <input
                    type="number"
                    min={150}
                    max={1500}
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm font-extrabold text-brand-dark"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Standard hourly bill rate</p>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-accent" />
                  <span>Bengaluru Coverage Localities ({selectedZones.length} Selected)</span>
                </label>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {BENGALURU_ZONES.map((zone) => {
                    const isSelected = selectedZones.includes(zone);
                    return (
                      <button
                        key={zone}
                        type="button"
                        onClick={() => toggleZone(zone)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-brand-dark text-white shadow-xs'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {isSelected && '✓ '}
                        {zone}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-brand-accent" />
                  <span>Languages You Speak</span>
                </label>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {LANGUAGES.map((lang) => {
                    const isSelected = selectedLanguages.includes(lang);
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleLang(lang)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-brand-accent text-white shadow-xs'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {isSelected && '✓ '}
                        {lang}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 4: DOCUMENTS ================= */}
          {step === 'DOCUMENTS' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-[11px] leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-blue-600 inline mr-1" />
                <strong>DigiLocker Verification Sandbox:</strong> All uploads in this prototype are local simulations. Safe fictional filenames are pre-attached for testing.
              </div>

              <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">1. Government ID Proof (Aadhaar / Voter ID)</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    Ready
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200 text-[11px]">
                  <span className="font-mono text-gray-700 truncate">{govIdName}</span>
                  <span className="text-gray-400">PDF • 1.4 MB</span>
                </div>
              </div>

              <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">2. Trade Certificate / Skill India Registry</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    Ready
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200 text-[11px]">
                  <span className="font-mono text-gray-700 truncate">{tradeCertName}</span>
                  <span className="text-gray-400">PDF • 890 KB</span>
                </div>
              </div>

              <div className="p-3 bg-brand-bg rounded-xl text-[11px] text-gray-600">
                ✓ Police Verification Clearance certificate will be scheduled digitally upon initial application approval.
              </div>
            </div>
          )}

          {/* ================= STEP 5: BANK ACCOUNT ================= */}
          {step === 'BANK' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-brand-bg rounded-xl border border-gray-200 text-gray-700 text-[11px]">
                <p className="font-bold text-brand-dark mb-0.5">Weekly Monday Direct Deposit</p>
                Platform commissions (15% baseline) are deducted automatically; net payouts are disbursed to this bank account every Monday morning.
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Account Holder Name *</label>
                <input
                  type="text"
                  required
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Bank Name & Branch *</label>
                <input
                  type="text"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Account Number *</label>
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">IFSC Code *</label>
                  <input
                    type="text"
                    required
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                    className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">UPI ID for Express Settlements</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
                />
              </div>
            </div>
          )}

          {/* ================= STEP 6: SUCCESS ================= */}
          {step === 'SUCCESS' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Clock className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-base">Application Submitted to Verification Desk</h3>
                <p className="text-gray-500 text-xs mt-1">
                  Welcome to the {APP_CONFIG.parentCompany} Partner Network, <strong className="text-brand-dark">{fullName}</strong>!
                </p>
              </div>

              <div className="p-3.5 bg-brand-bg rounded-2xl border border-gray-200 text-left text-[11px] text-gray-700 space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <span>Application Status:</span>
                  <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-bold">
                    PENDING_REVIEW
                  </span>
                </div>
                <p>• Category: <strong>{primaryCat}</strong></p>
                <p>• Localities: <strong>{selectedZones.join(', ')}</strong></p>
                <p>• Your application is now in the Admin Verification Queue assigned to <strong>Vikram Rao</strong>.</p>
              </div>

              <button
                onClick={() => {
                  setCurrentRoute('/worker');
                  onClose();
                }}
                className="w-full py-3 bg-brand-dark hover:bg-brand-darker text-white font-bold rounded-xl text-xs shadow-md"
              >
                Go to Worker Partner Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        {step !== 'SUCCESS' && (
          <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between gap-3">
            {step !== 'PERSONAL' && (
              <button
                type="button"
                onClick={() => {
                  if (step === 'TRADE_SKILLS') setStep('PERSONAL');
                  if (step === 'RATES_ZONES') setStep('TRADE_SKILLS');
                  if (step === 'DOCUMENTS') setStep('RATES_ZONES');
                  if (step === 'BANK') setStep('DOCUMENTS');
                }}
                className="py-2.5 px-4 border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
            )}

            {step === 'PERSONAL' && (
              <button
                type="button"
                onClick={() => setStep('TRADE_SKILLS')}
                className="flex-1 py-3 bg-brand-dark hover:bg-brand-darker text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-1.5"
              >
                <span>Next: Trade & Skills</span>
                <ChevronRight className="w-4 h-4 text-brand-accent" />
              </button>
            )}

            {step === 'TRADE_SKILLS' && (
              <button
                type="button"
                onClick={() => setStep('RATES_ZONES')}
                className="flex-1 py-3 bg-brand-dark hover:bg-brand-darker text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-1.5"
              >
                <span>Next: Rates & Bengaluru Localities</span>
                <ChevronRight className="w-4 h-4 text-brand-accent" />
              </button>
            )}

            {step === 'RATES_ZONES' && (
              <button
                type="button"
                onClick={() => setStep('DOCUMENTS')}
                className="flex-1 py-3 bg-brand-dark hover:bg-brand-darker text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-1.5"
              >
                <span>Next: Document Upload</span>
                <ChevronRight className="w-4 h-4 text-brand-accent" />
              </button>
            )}

            {step === 'DOCUMENTS' && (
              <button
                type="button"
                onClick={() => setStep('BANK')}
                className="flex-1 py-3 bg-brand-dark hover:bg-brand-darker text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-1.5"
              >
                <span>Next: Settlement Payout Details</span>
                <ChevronRight className="w-4 h-4 text-brand-accent" />
              </button>
            )}

            {step === 'BANK' && (
              <button
                type="button"
                onClick={handleSubmitRegistration}
                className="flex-1 py-3 bg-brand-accent hover:bg-brand-accent-hover text-brand-charcoal font-extrabold rounded-xl text-xs shadow-md flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Submit Partner Registration</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
