import React from "react";
import { Wifi, Signal, BatteryCharging } from "lucide-react";

interface AndroidDeviceShellProps {
  children: React.ReactNode;
  isDeviceMode: boolean;
}

export const AndroidDeviceShell: React.FC<AndroidDeviceShellProps> = ({
  children,
  isDeviceMode,
}) => {
  if (!isDeviceMode) {
    return (
      <div className="w-full min-h-screen bg-[#0A0512] text-white flex flex-col items-center">
        <div className="w-full max-w-2xl min-h-screen flex flex-col bg-[#0D0714] border-x border-purple-500/15 shadow-[0_0_50px_rgba(168,85,247,0.15)] relative">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#05020A] py-4 px-2 flex items-center justify-center">
      {/* Outer Phone Hardware Chasis */}
      <div className="relative w-full max-w-[420px] h-[890px] rounded-[52px] bg-gradient-to-b from-[#1C0E34] via-[#100720] to-[#0A0512] p-[10px] shadow-[0_0_60px_rgba(168,85,247,0.35),0_20px_40px_rgba(0,0,0,0.8)] border border-purple-500/30 flex flex-col">
        {/* Hardware side buttons */}
        <div className="absolute -left-[14px] top-28 w-[4px] h-12 bg-purple-900 rounded-l-md border-l border-purple-500/40" />
        <div className="absolute -left-[14px] top-44 w-[4px] h-12 bg-purple-900 rounded-l-md border-l border-purple-500/40" />
        <div className="absolute -right-[14px] top-32 w-[4px] h-16 bg-purple-900 rounded-r-md border-r border-purple-500/40" />

        {/* Screen Glass Bezel */}
        <div className="relative w-full h-full rounded-[44px] bg-[#0A0512] overflow-hidden flex flex-col border border-purple-950">
          {/* Android Status Bar */}
          <div className="w-full bg-[#0A0512] px-6 pt-3 pb-1 flex items-center justify-between text-xs text-purple-300 font-mono z-40 select-none">
            {/* Time */}
            <span className="font-semibold text-slate-200">20:26</span>

            {/* Front Camera Punch-hole */}
            <div className="w-4 h-4 rounded-full bg-black border border-purple-900/60 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-950" />
            </div>

            {/* Status Icons */}
            <div className="flex items-center gap-1.5 text-purple-400">
              <Signal className="w-3.5 h-3.5 text-purple-300" />
              <Wifi className="w-3.5 h-3.5 text-purple-300" />
              <BatteryCharging className="w-3.5 h-3.5 text-cyan-400" />
            </div>
          </div>

          {/* Screen Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col relative custom-scrollbar">
            {children}
          </div>

          {/* Android Bottom Gesture Navigation Bar */}
          <div className="w-full bg-[#0A0512] py-2 flex items-center justify-center select-none z-40">
            <div className="w-32 h-1 bg-purple-400/40 rounded-full hover:bg-purple-300 transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
};
