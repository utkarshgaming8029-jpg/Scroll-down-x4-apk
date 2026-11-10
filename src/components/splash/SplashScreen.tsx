import React, { useEffect, useState } from "react";
import { Sparkles, ArrowDown } from "lucide-react";

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setFade(true);
    }, 1800);

    const timer2 = setTimeout(() => {
      onFinish();
    }, 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0A0512] transition-opacity duration-500 ${
        fade ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background ambient neon glow */}
      <div className="absolute w-96 h-96 rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute w-72 h-72 rounded-full bg-pink-500/20 blur-[100px] pointer-events-none -bottom-10" />

      {/* Main Logo & Typography */}
      <div className="relative flex flex-col items-center select-none animate-pulse">
        {/* Neon Icon Container */}
        <div className="relative mb-6 flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-[#1C0E34] to-[#2E1052] border border-purple-500/40 shadow-[0_0_40px_rgba(168,85,247,0.45)]">
          <div className="flex flex-col items-center justify-center">
            <span className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
              ▼
            </span>
            <ArrowDown className="w-8 h-8 text-pink-400 mt-1 animate-bounce" />
          </div>
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-purple-300 animate-spin" style={{ animationDuration: "8s" }} />
        </div>

        {/* Brand Name */}
        <h1 className="text-4xl md:text-5xl font-black tracking-widest text-center">
          <span className="text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]">SCROLL </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-400 drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]">
            DOWN
          </span>
        </h1>

        <p className="mt-3 text-xs md:text-sm tracking-widest uppercase font-medium text-purple-300/80">
          Dark Purple Neon Social • Android Native
        </p>
      </div>

      {/* Loading bar at bottom */}
      <div className="absolute bottom-16 flex flex-col items-center gap-2">
        <div className="w-36 h-1 rounded-full bg-purple-950/80 overflow-hidden border border-purple-500/20">
          <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 animate-[pulse_1s_infinite] w-full" />
        </div>
        <span className="text-[10px] text-purple-400/60 font-mono">com.scrolldown.social</span>
      </div>
    </div>
  );
};
