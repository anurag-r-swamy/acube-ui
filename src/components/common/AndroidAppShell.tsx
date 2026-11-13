import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/branding';
import {
  Wifi,
  Signal,
  Battery,
  BatteryCharging,
  Circle,
  Square,
  Minus,
  X,
  Settings,
  Volume2,
  Bluetooth,
  MapPin,
  Moon,
  Sun,
  ShieldCheck,
  Briefcase,
  Layers,
  ChevronDown,
  Bell,
  Trash2,
  Sparkles,
} from 'lucide-react';

interface AndroidAppShellProps {
  children: React.ReactNode;
  activeApp: 'CUSTOMER' | 'WORKER';
  onBackPress?: () => void;
  onHomePress?: () => void;
  headerTheme?: 'dark' | 'light';
}

export const AndroidAppShell: React.FC<AndroidAppShellProps> = ({
  children,
  activeApp,
  onBackPress,
  onHomePress,
  headerTheme = 'dark',
}) => {
  const {
    viewMode,
    setViewMode,
    androidNavMode,
    setAndroidNavMode,
    isAndroidOverviewOpen,
    setIsAndroidOverviewOpen,
    isNotificationShadeOpen,
    setIsNotificationShadeOpen,
    triggerAndroidHaptic,
    notifications,
    currentUser,
    setCurrentRoute,
    switchUserMode,
    showToast,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isAdminLoginModalOpen,
    setIsAdminLoginModalOpen,
    isWorkerRegModalOpen,
    setIsWorkerRegModalOpen,
  } = useApp();

  // Simulated Android Clock
  const [currentTime, setCurrentTime] = useState<string>('10:08');
  const [currentDateStr, setCurrentDateStr] = useState<string>('Fri, 13 Nov');
  const [batteryLevel, setBatteryLevel] = useState<number>(92);
  const [isWifiOn, setIsWifiOn] = useState<boolean>(true);
  const [isBluetoothOn, setIsBluetoothOn] = useState<boolean>(true);
  const [isLocationOn, setIsLocationOn] = useState<boolean>(true);
  const [isDoNotDisturb, setIsDoNotDisturb] = useState<boolean>(false);
  const [brightness, setBrightness] = useState<number>(85);
  const [exitToastCount, setExitToastCount] = useState<number>(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);

      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      setCurrentDateStr(`${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Filter unread notifications for current user
  const userNotifs = notifications.filter((n) => n.userId === currentUser.id);

  // Global Back Button Handler
  const handleSystemBack = () => {
    triggerAndroidHaptic();

    // 1. If notification shade is open, close it
    if (isNotificationShadeOpen) {
      setIsNotificationShadeOpen(false);
      return;
    }

    // 2. If Recent Apps overview is open, close it
    if (isAndroidOverviewOpen) {
      setIsAndroidOverviewOpen(false);
      return;
    }

    // 3. If any global modal is open, close it
    if (isAuthModalOpen) {
      setIsAuthModalOpen(false);
      return;
    }
    if (isAdminLoginModalOpen) {
      setIsAdminLoginModalOpen(false);
      return;
    }
    if (isWorkerRegModalOpen) {
      setIsWorkerRegModalOpen(false);
      return;
    }

    // 4. Delegate to layout's internal back handler if provided
    if (onBackPress) {
      onBackPress();
      return;
    }

    // 5. Default Android double-tap to exit simulation
    if (exitToastCount === 0) {
      setExitToastCount(1);
      showToast('Press back again to exit', 'info');
      setTimeout(() => setExitToastCount(0), 2000);
    } else {
      showToast('Simulated app exit (returned to Home)', 'info');
      setExitToastCount(0);
      if (onHomePress) onHomePress();
    }
  };

  // Global Home Button Handler
  const handleSystemHome = () => {
    triggerAndroidHaptic();
    setIsNotificationShadeOpen(false);
    setIsAndroidOverviewOpen(false);
    setIsAuthModalOpen(false);
    setIsAdminLoginModalOpen(false);
    setIsWorkerRegModalOpen(false);
    if (onHomePress) {
      onHomePress();
    }
  };

  // Global Overview / Multitasking Button Handler
  const handleSystemOverview = () => {
    triggerAndroidHaptic();
    setIsNotificationShadeOpen(false);
    setIsAndroidOverviewOpen(!isAndroidOverviewOpen);
  };

  const isDarkStatus = headerTheme === 'dark';

  return (
    <div className="w-full flex justify-center py-0 sm:py-6 bg-brand-bg transition-all">
      {/* Android Smartphone Chassis Container */}
      <div
        className={`w-full transition-all duration-300 relative ${
          viewMode === 'MOBILE_CONTAINER'
            ? 'max-w-[412px] h-[890px] rounded-[48px] bg-black border-[10px] border-slate-900 shadow-2xl overflow-hidden flex flex-col ring-1 ring-slate-800/60'
            : 'max-w-4xl min-h-screen bg-white shadow-soft flex flex-col'
        }`}
      >
        {/* Hardware side buttons (Only visible in Phone Frame mode) */}
        {viewMode === 'MOBILE_CONTAINER' && (
          <>
            {/* Left Volume Rocker */}
            <div className="absolute -left-[14px] top-28 w-[4px] h-16 bg-slate-700 rounded-l-md pointer-events-none shadow-sm"></div>
            {/* Right Power Button */}
            <div className="absolute -right-[14px] top-24 w-[4px] h-10 bg-slate-700 rounded-r-md pointer-events-none shadow-sm"></div>
          </>
        )}

        {/* ================= ANDROID STATUS BAR ================= */}
        <div
          onClick={() => setIsNotificationShadeOpen(!isNotificationShadeOpen)}
          className={`h-8 px-4 flex items-center justify-between text-[11px] font-medium tracking-tight select-none cursor-pointer z-50 shrink-0 transition-colors ${
            isDarkStatus
              ? 'bg-brand-dark text-white'
              : 'bg-white text-gray-800 border-b border-gray-100'
          }`}
          title="Tap to pull down Android Quick Settings & Notification Shade"
        >
          {/* Left: Live Time & Notification Icons */}
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-normal">{currentTime}</span>
            <div className="flex items-center gap-1 opacity-80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              {userNotifs.some((n) => !n.isRead) && (
                <Bell className="w-2.5 h-2.5 text-brand-accent animate-pulse" />
              )}
            </div>
          </div>

          {/* Center: Punch-Hole Front Camera Cutout */}
          <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center border border-slate-800/80 shadow-inner">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-900 ring-1 ring-slate-700/50"></div>
          </div>

          {/* Right: Connectivity & Battery Icons */}
          <div className="flex items-center gap-1.5 opacity-90 text-[10px]">
            <span className="text-[9px] font-bold px-1 py-0.2 bg-white/20 rounded">5G</span>
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <div className="flex items-center gap-0.5">
              <span className="text-[9px] font-semibold">{batteryLevel}%</span>
              <Battery className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>
        </div>

        {/* ================= ANDROID NOTIFICATION SHADE (PULL-DOWN) ================= */}
        {isNotificationShadeOpen && (
          <div className="absolute inset-0 z-60 bg-slate-950/95 text-white flex flex-col p-4 animate-fadeIn backdrop-blur-md overflow-y-auto">
            {/* Header: Digital Clock & Close */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <p className="text-2xl font-black">{currentTime}</p>
                <p className="text-xs text-slate-400">{currentDateStr}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsNotificationShadeOpen(false)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Settings Grid (Material You Tiles) */}
            <div className="grid grid-cols-2 gap-2 my-3.5">
              <button
                onClick={() => setIsWifiOn(!isWifiOn)}
                className={`p-2.5 rounded-2xl flex items-center gap-2.5 text-left transition-all ${
                  isWifiOn
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-800/80 text-slate-400'
                }`}
              >
                <Wifi className="w-4 h-4 shrink-0" />
                <div className="leading-tight">
                  <p className="text-[11px]">Internet</p>
                  <p className="text-[9px] opacity-80">{isWifiOn ? 'Bengaluru 5G' : 'Offline'}</p>
                </div>
              </button>

              <button
                onClick={() => setIsBluetoothOn(!isBluetoothOn)}
                className={`p-2.5 rounded-2xl flex items-center gap-2.5 text-left transition-all ${
                  isBluetoothOn
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-800/80 text-slate-400'
                }`}
              >
                <Bluetooth className="w-4 h-4 shrink-0" />
                <div className="leading-tight">
                  <p className="text-[11px]">Bluetooth</p>
                  <p className="text-[9px] opacity-80">{isBluetoothOn ? 'Active' : 'Off'}</p>
                </div>
              </button>

              <button
                onClick={() => setIsLocationOn(!isLocationOn)}
                className={`p-2.5 rounded-2xl flex items-center gap-2.5 text-left transition-all ${
                  isLocationOn
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-800/80 text-slate-400'
                }`}
              >
                <MapPin className="w-4 h-4 shrink-0" />
                <div className="leading-tight">
                  <p className="text-[11px]">Location</p>
                  <p className="text-[9px] opacity-80">
                    {isLocationOn ? 'Bengaluru GPS' : 'Disabled'}
                  </p>
                </div>
              </button>

              <button
                onClick={() => setIsDoNotDisturb(!isDoNotDisturb)}
                className={`p-2.5 rounded-2xl flex items-center gap-2.5 text-left transition-all ${
                  isDoNotDisturb
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-slate-800/80 text-slate-400'
                }`}
              >
                <Volume2 className="w-4 h-4 shrink-0" />
                <div className="leading-tight">
                  <p className="text-[11px]">Sound Mode</p>
                  <p className="text-[9px] opacity-80">{isDoNotDisturb ? 'DND' : 'Vibrate'}</p>
                </div>
              </button>
            </div>

            {/* Brightness Slider */}
            <div className="flex items-center gap-3 px-2 py-1 bg-slate-900/80 rounded-xl mb-4 border border-slate-800">
              <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <input
                type="range"
                min="20"
                max="100"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-[10px] text-slate-400 w-7 text-right">{brightness}%</span>
            </div>

            {/* Notifications Header */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 pb-2 border-b border-slate-800">
              <span>Notifications ({userNotifs.length})</span>
              <button
                onClick={() => showToast('Notifications cleared', 'info')}
                className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>

            {/* Notification items */}
            <div className="flex-1 overflow-y-auto space-y-2 py-2">
              {userNotifs.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No active notifications
                </div>
              ) : (
                userNotifs.slice(0, 4).map((n) => (
                  <div
                    key={n.id}
                    className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-start gap-2.5 text-xs"
                  >
                    <div className="w-7 h-7 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-white text-[11px]">{n.title}</p>
                      <p className="text-slate-400 text-[10px] line-clamp-2 mt-0.5">{n.message}</p>
                      <span className="text-[9px] text-slate-500 mt-1 block">
                        {new Date(n.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pull-up Bar to close shade */}
            <div
              onClick={() => setIsNotificationShadeOpen(false)}
              className="py-2 flex justify-center cursor-pointer opacity-70 hover:opacity-100"
            >
              <div className="w-12 h-1 bg-slate-600 rounded-full"></div>
            </div>
          </div>
        )}

        {/* ================= ANDROID OVERVIEW / MULTITASKING (RECENT APPS) ================= */}
        {isAndroidOverviewOpen && (
          <div className="absolute inset-0 z-60 bg-slate-950/95 flex flex-col p-5 animate-fadeIn backdrop-blur-md">
            <div className="flex items-center justify-between pb-4">
              <div className="flex items-center gap-2 text-white">
                <Layers className="w-4 h-4 text-emerald-400" />
                <h3 className="font-extrabold text-sm">Recent Android Apps</h3>
              </div>
              <button
                onClick={() => setIsAndroidOverviewOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* App Cards Deck */}
            <div className="flex-1 flex flex-col justify-center space-y-4 py-2">
              {/* App Card 1: ACubeX Customer App */}
              <div
                onClick={() => {
                  triggerAndroidHaptic();
                  setIsAndroidOverviewOpen(false);
                  setCurrentRoute('/customer');
                  switchUserMode('CUSTOMER');
                }}
                className={`p-4 rounded-3xl border transition-all cursor-pointer transform hover:scale-[1.02] shadow-xl ${
                  activeApp === 'CUSTOMER'
                    ? 'bg-gradient-to-br from-brand-dark to-slate-900 border-emerald-500 ring-2 ring-emerald-500/40'
                    : 'bg-slate-900 border-slate-800 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-brand-accent text-brand-charcoal flex items-center justify-center font-black text-xs shadow-xs">
                      A
                    </div>
                    <div>
                      <p className="font-bold text-white text-xs">{APP_CONFIG.parentCompany} Marketplace</p>
                      <p className="text-[10px] text-emerald-400">Customer Application</p>
                    </div>
                  </div>
                  {activeApp === 'CUSTOMER' && (
                    <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                      Active Now
                    </span>
                  )}
                </div>
                <div className="h-20 bg-black/40 rounded-xl p-2.5 flex items-center justify-center text-center text-slate-300 text-[11px] border border-white/5">
                  Tap to bring Customer App to foreground
                </div>
              </div>

              {/* App Card 2: ACubeX Partner / Worker App */}
              <div
                onClick={() => {
                  triggerAndroidHaptic();
                  setIsAndroidOverviewOpen(false);
                  setCurrentRoute('/worker');
                  switchUserMode('WORKER');
                }}
                className={`p-4 rounded-3xl border transition-all cursor-pointer transform hover:scale-[1.02] shadow-xl ${
                  activeApp === 'WORKER'
                    ? 'bg-gradient-to-br from-brand-dark to-slate-900 border-amber-500 ring-2 ring-amber-500/40'
                    : 'bg-slate-900 border-slate-800 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-brand-charcoal flex items-center justify-center font-black text-xs shadow-xs">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-xs">{APP_CONFIG.parentCompany} Partner</p>
                      <p className="text-[10px] text-amber-400">Worker & Pro Application</p>
                    </div>
                  </div>
                  {activeApp === 'WORKER' && (
                    <span className="text-[9px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40">
                      Active Now
                    </span>
                  )}
                </div>
                <div className="h-20 bg-black/40 rounded-xl p-2.5 flex items-center justify-center text-center text-slate-300 text-[11px] border border-white/5">
                  Tap to bring Worker App to foreground
                </div>
              </div>

              {/* App Card 3: Admin Web Portal */}
              <div
                onClick={() => {
                  triggerAndroidHaptic();
                  setIsAndroidOverviewOpen(false);
                  setCurrentRoute('/admin');
                }}
                className="p-3 bg-slate-900/70 border border-slate-800 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-slate-800 text-xs transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-accent" />
                  <span className="text-white font-medium">Desktop Admin Web Portal</span>
                </div>
                <span className="text-slate-400 text-[11px]">Open →</span>
              </div>
            </div>

            {/* Clear All Apps Button */}
            <div className="pt-3 border-t border-slate-800 flex justify-center">
              <button
                onClick={() => {
                  triggerAndroidHaptic();
                  setIsAndroidOverviewOpen(false);
                }}
                className="py-2 px-5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs"
              >
                Clear all apps
              </button>
            </div>
          </div>
        )}

        {/* ================= MAIN APPLICATION VIEWPORT ================= */}
        <div className="flex-1 flex flex-col overflow-hidden relative bg-white">
          {children}
        </div>

        {/* ================= ANDROID SYSTEM NAVIGATION BAR (BOTTOM) ================= */}
        <div
          className="h-10 bg-black text-white shrink-0 flex items-center justify-around select-none border-t border-slate-900 z-50 px-8 relative"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          {androidNavMode === '3_BUTTON' ? (
            <>
              {/* Back Button (◀ Triangle) */}
              <button
                onClick={handleSystemBack}
                aria-label="Android Back"
                className="w-12 h-8 flex items-center justify-center text-slate-400 hover:text-white active:scale-90 transition-transform"
                title="Android Back: Closes active dialog or navigates to Home"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 12a1 1 0 0 1-.45.83l-12 8a1 1 0 0 1-1.55-.83V4a1 1 0 0 1 1.55-.83l12 8A1 1 0 0 1 19 12z" transform="rotate(180 12 12)" />
                </svg>
              </button>

              {/* Home Button (⚪ Circle) */}
              <button
                onClick={handleSystemHome}
                aria-label="Android Home"
                className="w-12 h-8 flex items-center justify-center text-slate-400 hover:text-white active:scale-90 transition-transform"
                title="Android Home: Returns to app Home screen"
              >
                <Circle className="w-4 h-4 stroke-[2.5]" />
              </button>

              {/* Recent Apps / Overview Button (⏹ Square) */}
              <button
                onClick={handleSystemOverview}
                aria-label="Android Recent Apps"
                className="w-12 h-8 flex items-center justify-center text-slate-400 hover:text-white active:scale-90 transition-transform"
                title="Android Overview: Multi-tasking App Switcher"
              >
                <Square className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </>
          ) : (
            /* Modern Android Gesture Bar */
            <div
              onClick={handleSystemHome}
              className="w-full flex justify-center py-2 cursor-pointer active:scale-95 transition-transform"
              title="Android Gesture Navigation Pill"
            >
              <div className="w-28 h-1 bg-slate-500 hover:bg-white rounded-full transition-colors"></div>
            </div>
          )}

          {/* Quick Nav Toggle Indicator (Discreet Pill) */}
          <button
            onClick={() => {
              triggerAndroidHaptic();
              setAndroidNavMode(androidNavMode === '3_BUTTON' ? 'GESTURE' : '3_BUTTON');
            }}
            className="absolute right-2 top-2.5 text-[8px] font-bold text-slate-600 hover:text-slate-400 px-1 py-0.5 rounded"
            title="Toggle between 3-Button and Gesture Nav"
          >
            {androidNavMode === '3_BUTTON' ? '3-BTN' : 'GESTURE'}
          </button>
        </div>
      </div>
    </div>
  );
};
