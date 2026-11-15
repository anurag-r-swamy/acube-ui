import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Battery } from 'lucide-react';

interface AndroidAppShellProps {
  children: React.ReactNode;
  activeApp: 'CUSTOMER' | 'WORKER';
  onBackPress?: () => void;
  onHomePress?: () => void;
  headerTheme?: 'dark' | 'light';
}

export const AndroidAppShell: React.FC<AndroidAppShellProps> = ({
  children,
}) => {
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

  return (
    <div className="w-full min-h-screen bg-[#F4F4EE] flex items-center justify-center p-2 sm:p-4 select-none">
      {/* Authentic Android Mobile Screen Simulation Container */}
      <div className="w-full max-w-[412px] h-[840px] max-h-[94vh] rounded-[46px] border-[10px] border-[#0A0D0B] shadow-2xl bg-white flex flex-col overflow-hidden relative ring-1 ring-black/30">
        
        {/* Top Speaker Ear-piece & Camera Notch */}
        <div className="h-4 bg-[#0A0D0B] flex items-center justify-center shrink-0 z-30">
          <div className="w-12 h-1 bg-[#222523] rounded-full"></div>
        </div>

        {/* Subtle, Clean Native Android Status Bar */}
        <div className="h-7 px-5 bg-white border-b border-[#EBECE7] flex items-center justify-between text-xs font-semibold text-black select-none shrink-0 z-30">
          {/* Time on left */}
          <span className="font-bold tracking-tight text-[12px] text-black">{currentTime}</span>

          {/* Android Center Camera Hole-punch */}
          <div className="w-2.5 h-2.5 rounded-full bg-[#0A0D0B] ring-1 ring-black/50"></div>

          {/* Connectivity Icons on right (No alerts) */}
          <div className="flex items-center gap-1.5 text-black">
            <Signal className="w-3.5 h-3.5 text-black" />
            <span className="text-[10px] font-black text-black">5G</span>
            <Wifi className="w-3.5 h-3.5 text-black" />
            <Battery className="w-4 h-4 fill-black text-black" />
          </div>
        </div>

        {/* Main Application Screen Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative bg-[#FBFBFA]">
          {children}
        </div>

        {/* Android Native Gesture Navigation Handle */}
        <div className="h-4 bg-white border-t border-[#EBECE7] flex items-center justify-center shrink-0 z-20">
          <div className="w-28 h-1 bg-[#222] rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
