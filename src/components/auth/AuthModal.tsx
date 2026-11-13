import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/branding';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Lock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Clock,
  KeyRound,
  Eye,
  EyeOff,
  Briefcase,
} from 'lucide-react';

const BENGALURU_LOCALITIES = [
  'Koramangala 4th Block',
  'Koramangala 6th Block',
  'Indiranagar 100ft Road',
  'HSR Layout Sector 1',
  'HSR Layout Sector 2',
  'Bellandur Outer Ring Road',
  'Whitefield ITPL Road',
  'Jayanagar 4th Block',
  'JP Nagar 7th Phase',
  'Malleshwaram 8th Cross',
  'Sadashivanagar',
  'BTM Layout 2nd Stage',
  'Electronic City Phase 1',
];

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'WELCOME' | 'SIGN_IN' | 'SIGN_UP' | 'FORGOT_PASSWORD';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'SIGN_UP',
}) => {
  const { registerUser, switchPersona, users, showToast } = useApp();

  const [mode, setMode] = useState<'WELCOME' | 'SIGN_IN' | 'SIGN_UP' | 'OTP' | 'FORGOT_PASSWORD' | 'RESET_SUCCESS'>(
    initialMode
  );

  // Welcome slide index
  const [welcomeSlide, setWelcomeSlide] = useState(0);

  // Registration Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedArea, setSelectedArea] = useState(BENGALURU_LOCALITIES[0]);
  const [promoCode, setPromoCode] = useState('');
  const [isWorkerIntent, setIsWorkerIntent] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Sign In Form State
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP State
  const [otpValue, setOtpValue] = useState(['5', '8', '2', '9']);
  const [otpCountdown, setOtpCountdown] = useState(45);

  // Password Reset State
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  // Handle Sign Up Submission -> Goes to simulated OTP
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      showToast('Please fill all required registration fields.', 'error');
      return;
    }
    if (!agreeTerms) {
      showToast('Please accept the Terms of Service to register.', 'warning');
      return;
    }
    setMode('OTP');
    showToast('Simulated 4-digit OTP sent to ' + phone + '. Demo code: 5829', 'info');
  };

  // Handle OTP Verification -> Registers User
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otpValue.join('');
    if (enteredCode.length !== 4) {
      showToast('Please enter the 4-digit verification code.', 'error');
      return;
    }

    // Register user in central app state
    registerUser({
      name: fullName.trim(),
      email: email.trim(),
      phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
      area: selectedArea,
      role: isWorkerIntent ? 'WORKER' : 'CUSTOMER',
    });

    onClose();
  };

  // Handle Sign In Submission
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInIdentifier.trim()) {
      showToast('Please enter your phone number or email.', 'error');
      return;
    }

    // Check if matches an existing user or fallback to demo
    const foundUser = users.find(
      (u) =>
        u.email.toLowerCase() === signInIdentifier.toLowerCase() ||
        u.phone.includes(signInIdentifier) ||
        u.name.toLowerCase().includes(signInIdentifier.toLowerCase())
    );

    if (foundUser) {
      switchPersona(foundUser.id);
      showToast(`Welcome back, ${foundUser.name}! Signed in successfully.`, 'success');
      onClose();
    } else {
      // Simulate successful login with new session
      showToast(`Signed in successfully as demo user (${signInIdentifier})`, 'success');
      switchPersona('user-cust-1');
      onClose();
    }
  };

  // Handle Password Reset
  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetIdentifier.trim()) {
      showToast('Please enter your registered phone or email.', 'error');
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    setMode('RESET_SUCCESS');
  };

  const welcomeSlides = [
    {
      title: 'Verified Home Services in Bengaluru',
      description: 'Book licensed electricians, expert plumbers, and 5-star home cleaning teams with DigiLocker background checks.',
      badge: '100% Background Checked',
      icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
    },
    {
      title: 'Fixed Pricing & Escrow Protection',
      description: 'Transparent base fares with no hidden surcharges. Your money is protected in platform escrow until work is confirmed complete.',
      badge: 'Zero Cash Extortion',
      icon: <Sparkles className="w-8 h-8 text-brand-accent" />,
    },
    {
      title: 'Live Tracking & Instant Messaging',
      description: 'Track your assigned technician in real time, message inside the app with photo uploads, and enjoy masked phone privacy.',
      badge: 'Private & Secure',
      icon: <Clock className="w-8 h-8 text-blue-400" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col shadow-lifted animate-in slide-in-from-bottom-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xs uppercase tracking-wider text-brand-accent bg-brand-dark px-2 py-0.5 rounded">
              {APP_CONFIG.parentCompany}
            </span>
            <span className="text-gray-400 text-xs">|</span>
            <h2 className="text-xs font-bold text-gray-900">
              {mode === 'WELCOME' && 'Welcome Walkthrough'}
              {mode === 'SIGN_UP' && 'Create Customer Account'}
              {mode === 'OTP' && 'Verify Phone Number'}
              {mode === 'SIGN_IN' && 'Sign In to Account'}
              {mode === 'FORGOT_PASSWORD' && 'Reset Password'}
              {mode === 'RESET_SUCCESS' && 'Password Updated'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* ================= MODE: WELCOME ONBOARDING ================= */}
          {mode === 'WELCOME' && (
            <div className="space-y-5 text-center py-2">
              <div className="p-6 bg-gradient-to-br from-brand-dark to-brand-light text-white rounded-3xl shadow-medium relative overflow-hidden space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto border border-white/20">
                  {welcomeSlides[welcomeSlide].icon}
                </div>
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-brand-accent text-brand-charcoal px-2.5 py-0.5 rounded-full">
                  {welcomeSlides[welcomeSlide].badge}
                </span>
                <h3 className="font-extrabold text-base leading-snug">
                  {welcomeSlides[welcomeSlide].title}
                </h3>
                <p className="text-white/80 text-[11px] leading-relaxed">
                  {welcomeSlides[welcomeSlide].description}
                </p>
                {/* Dots indicator */}
                <div className="flex items-center justify-center gap-1.5 pt-2">
                  {welcomeSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setWelcomeSlide(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        welcomeSlide === idx ? 'w-6 bg-brand-accent' : 'w-1.5 bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setMode('SIGN_UP')}
                  className="w-full py-3 bg-brand-dark hover:bg-brand-darker text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-2"
                >
                  <span>Register New Account</span>
                  <ArrowRight className="w-4 h-4 text-brand-accent" />
                </button>

                <button
                  onClick={() => setMode('SIGN_IN')}
                  className="w-full py-2.5 border border-gray-200 text-gray-700 font-bold rounded-xl text-xs hover:bg-gray-50"
                >
                  I already have an account • Sign In
                </button>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      switchPersona('user-cust-1');
                      onClose();
                    }}
                    className="text-gray-400 hover:text-gray-700 underline text-[11px]"
                  >
                    Skip & continue with demo persona (Priya Sharma)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= MODE: SIGN UP / REGISTRATION ================= */}
          {mode === 'SIGN_UP' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
              <div className="p-3 bg-brand-bg rounded-xl border border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-xs">New to {APP_CONFIG.parentCompany}?</h3>
                  <p className="text-[11px] text-gray-500">Sign up in under 30 seconds</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMode('SIGN_IN')}
                  className="text-brand-dark font-bold text-xs underline"
                >
                  Sign In instead
                </button>
              </div>

              {/* Full Name */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Verma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full py-2 px-3 pl-8 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-brand-dark"
                  />
                  <User className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-3" />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Mobile Number (India) *</label>
                <div className="relative flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-100 text-gray-600 text-xs font-semibold">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="98450 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 py-2 px-3 bg-gray-50 border border-gray-200 rounded-r-xl text-xs focus:bg-white focus:ring-2 focus:ring-brand-dark"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Email Address *</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="rahul.verma@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-2 px-3 pl-8 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-brand-dark"
                  />
                  <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-3" />
                </div>
              </div>

              {/* Bengaluru Locality Selection */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-brand-accent" />
                  <span>Your Bengaluru Area</span>
                </label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-dark"
                >
                  {BENGALURU_LOCALITIES.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Account Intent (Customer vs Worker) */}
              <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-800 text-[11px]">Register as a Service Professional?</p>
                  <p className="text-[10px] text-gray-500">Enable worker onboarding capabilities</p>
                </div>
                <input
                  type="checkbox"
                  checked={isWorkerIntent}
                  onChange={(e) => setIsWorkerIntent(e.target.checked)}
                  className="rounded text-brand-dark focus:ring-brand-dark w-4 h-4"
                />
              </div>

              {/* Referral / Promo Code (Optional) */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Referral / Promo Code <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. BLRFIRST100"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
                />
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded text-brand-dark focus:ring-brand-dark"
                />
                <span className="text-[11px] text-gray-600 leading-tight">
                  I agree to the {APP_CONFIG.parentCompany} Terms of Use, Privacy Policy, and Escrow Protection Policy.
                </span>
              </label>

              <button
                type="submit"
                className="w-full py-3 bg-brand-dark hover:bg-brand-darker text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 mt-2"
              >
                <span>Continue to Phone Verification</span>
                <ArrowRight className="w-4 h-4 text-brand-accent" />
              </button>
            </form>
          )}

          {/* ================= MODE: OTP VERIFICATION ================= */}
          {mode === 'OTP' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 py-2 text-center">
              <div className="w-12 h-12 bg-brand-accent-light text-brand-dark rounded-2xl flex items-center justify-center mx-auto">
                <Phone className="w-6 h-6 text-brand-accent" />
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-sm">Enter Verification Code</h3>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  We sent a 4-digit code to <strong>+91 {phone || '98450 12345'}</strong>
                </p>
              </div>

              {/* 4-digit OTP inputs */}
              <div className="flex justify-center gap-2.5 py-1">
                {otpValue.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otpValue];
                      newOtp[idx] = e.target.value;
                      setOtpValue(newOtp);
                    }}
                    className="w-12 h-12 text-center font-extrabold text-lg bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-brand-dark focus:bg-white outline-none"
                  />
                ))}
              </div>

              {/* Demo auto-fill helper chip */}
              <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-[11px]">
                <span className="font-bold">Demo OTP Simulation:</span> Code is prefilled as{' '}
                <strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-300">5829</strong>
              </div>

              <div className="text-[11px] text-gray-500">
                Didn't receive SMS?{' '}
                <button
                  type="button"
                  onClick={() => showToast('Simulated OTP resent to your phone: 5829', 'info')}
                  className="font-bold text-brand-dark hover:underline"
                >
                  Resend Code
                </button>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMode('SIGN_UP')}
                  className="py-2.5 px-4 border border-gray-200 rounded-xl font-bold text-gray-600"
                >
                  Edit Number
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-dark hover:bg-brand-darker text-white font-bold rounded-xl shadow-md"
                >
                  Verify & Register Account
                </button>
              </div>
            </form>
          )}

          {/* ================= MODE: SIGN IN ================= */}
          {mode === 'SIGN_IN' && (
            <form onSubmit={handleSignInSubmit} className="space-y-3.5">
              <div className="p-3 bg-brand-bg rounded-xl border border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-xs">Sign In to Your Account</h3>
                  <p className="text-[11px] text-gray-500">Access your bookings and saved addresses</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMode('SIGN_UP')}
                  className="text-brand-dark font-bold text-xs underline"
                >
                  Register here
                </button>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Phone Number or Email</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="priya.sharma@example.com or 98450 12345"
                    value={signInIdentifier}
                    onChange={(e) => setSignInIdentifier(e.target.value)}
                    className="w-full py-2 px-3 pl-8 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-brand-dark"
                  />
                  <User className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-gray-700">Password / OTP</label>
                  <button
                    type="button"
                    onClick={() => setMode('FORGOT_PASSWORD')}
                    className="text-brand-dark font-semibold text-[11px] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password or leave blank for demo"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    className="w-full py-2 px-3 pl-8 pr-8 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-brand-dark"
                  />
                  <Lock className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-dark hover:bg-brand-darker text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 text-brand-accent" />
              </button>

              {/* Quick One-Click Demo Sign-in Pills */}
              <div className="pt-2 border-t border-gray-100 space-y-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block text-center">
                  Or 1-Click Sign In as Demo Persona
                </span>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      switchPersona('user-cust-1');
                      onClose();
                    }}
                    className="w-full p-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-left flex items-center justify-between border border-gray-200"
                  >
                    <span className="font-semibold text-gray-800">👤 Priya Sharma (Customer)</span>
                    <span className="text-[10px] text-gray-400">Koramangala</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      switchPersona('user-wrk-1');
                      onClose();
                    }}
                    className="w-full p-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-left flex items-center justify-between border border-gray-200"
                  >
                    <span className="font-semibold text-gray-800">⚡ Rajesh Kumar (Worker)</span>
                    <span className="text-[10px] text-emerald-700 font-bold">Approved</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ================= MODE: FORGOT PASSWORD ================= */}
          {mode === 'FORGOT_PASSWORD' && (
            <form onSubmit={handleResetSubmit} className="space-y-3.5">
              <div className="text-center py-1">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-2">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm">Reset Your Password</h3>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Enter your registered phone or email to receive a recovery code
                </p>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Registered Phone / Email</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 98450 12345"
                  value={resetIdentifier}
                  onChange={(e) => setResetIdentifier(e.target.value)}
                  className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMode('SIGN_IN')}
                  className="py-2.5 px-4 border border-gray-200 rounded-xl font-bold text-gray-600"
                >
                  Back to Sign In
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-dark hover:bg-brand-darker text-white font-bold rounded-xl shadow-md"
                >
                  Simulate Password Reset
                </button>
              </div>
            </form>
          )}

          {/* ================= MODE: RESET SUCCESS ================= */}
          {mode === 'RESET_SUCCESS' && (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">Password Updated!</h3>
              <p className="text-[11px] text-gray-500 max-w-xs mx-auto">
                Your simulated password has been updated. You can now sign in with your credentials.
              </p>
              <button
                onClick={() => setMode('SIGN_IN')}
                className="py-2.5 px-6 bg-brand-dark text-white font-bold rounded-xl text-xs shadow-md mt-2"
              >
                Sign In Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
