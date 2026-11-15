import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Wifi, Signal, Battery, Bell } from 'lucide-react';

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
}) => {
  const { viewMode, notifications, currentUser } = useApp();

  const [currentTime, setCurrentTime] = useState<string>('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => n.userId === currentUser.id && !n.isRead).length;

  return (
    <div className="w-full flex justify-center py-0 sm:py-6 bg-[#F4F4EE] min-h-screen">
      {/* Clean, Modern Mobile-First Application Container */}
      <div
        className={`w-full transition-all duration-200 flex flex-col bg-[#FBFBFA] ${
          viewMode === 'MOBILE_CONTAINER'
            ? 'max-w-[420px] min-h-[880px] rounded-[36px] border border-[#E3E6DF] shadow-lifted overflow-hidden ring-1 ring-black/5 my-auto'
            : 'max-w-3xl min-h-screen shadow-soft'
        }`}
      >
        {/* Subtle, Clean Native Status Bar */}
        <div className="h-9 px-6 bg-[#FBFBFA] border-b border-[#EBECE7] flex items-center justify-between text-xs font-semibold text-brand-charcoal select-none shrink-0 z-30">
          {/* Time & App Indicator */}
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-[13px] text-brand-charcoal">{currentTime}</span>
            {unreadCount > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-forest-700 animate-pulse"></span>
            )}
          </div>

          {/* Clean Connectivity Icons */}
          <div className="flex items-center gap-2 text-brand-muted">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-brand-charcoal">100%</span>
              <Battery className="w-4 h-4 fill-brand-charcoal text-brand-charcoal" />
            </div>
          </div>
        </div>

        {/* Main Application Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative bg-[#FBFBFA]">
          {children}
        </div>
      </div>
    </div>
  );
};
