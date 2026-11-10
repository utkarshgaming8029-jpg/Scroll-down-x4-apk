import React from "react";
import {
  Heart,
  Send,
  Smartphone,
  Maximize2,
  Code2,
  ShieldCheck,
  Settings as SettingsIcon,
} from "lucide-react";
import { User, ActiveTab } from "../../types";

interface TopNavBarProps {
  currentUser: User;
  unreadNotifications: number;
  unreadMessages: number;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isDeviceMode: boolean;
  setIsDeviceMode: (val: boolean) => void;
  onOpenSettings: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  currentUser,
  unreadNotifications,
  unreadMessages,
  activeTab,
  setActiveTab,
  isDeviceMode,
  setIsDeviceMode,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#0A0512]/95 backdrop-blur-md border-b border-purple-500/20 px-3 py-2.5 flex items-center justify-between transition-colors">
      {/* Brand Logo */}
      <button
        onClick={() => setActiveTab("feed")}
        className="flex items-center gap-1.5 group text-left cursor-pointer transition-transform active:scale-95"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)] group-hover:shadow-[0_0_20px_rgba(236,72,153,0.7)] transition-shadow">
          <span className="text-white text-xs font-black">▼</span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-sm font-black tracking-wider text-white">SCROLL</span>
            <span className="text-sm font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              DOWN
            </span>
          </div>
          <span className="text-[9px] text-purple-400/80 -mt-1 font-mono tracking-tight">
            Kotlin • Jetpack Compose
          </span>
        </div>
      </button>

      {/* Action Controls */}
      <div className="flex items-center gap-1.5 md:gap-2">
        {/* 1-Click Download Project / APK Link */}
        <a
          href="/api/download/android-project.zip"
          download="scrolldown-android-project.zip"
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.5)] hover:shadow-[0_0_16px_rgba(6,182,212,0.8)] transition-all cursor-pointer"
          title="1-Click Direct Download Android Project (.ZIP)"
        >
          <span className="text-xs">⬇️</span>
          <span className="hidden sm:inline">1-Click Download</span>
        </a>

        {/* Android Source Inspector Quick Button */}
        <button
          onClick={() => setActiveTab("android-code")}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
            activeTab === "android-code"
              ? "bg-purple-600/30 text-purple-200 border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.4)]"
              : "bg-purple-950/40 text-purple-300 border-purple-500/30 hover:bg-purple-900/40"
          }`}
          title="Inspect Native Android Kotlin code & APK exporter"
        >
          <Code2 className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Android APK</span>
        </button>

        {/* Device Frame View Toggle */}
        <button
          onClick={() => setIsDeviceMode(!isDeviceMode)}
          className="p-1.5 rounded-lg text-purple-300 hover:text-white bg-purple-950/30 hover:bg-purple-900/40 border border-purple-500/20 transition-colors cursor-pointer"
          title={isDeviceMode ? "Switch to Fullscreen Dashboard" : "Switch to Android Device Frame"}
        >
          {isDeviceMode ? (
            <Maximize2 className="w-4 h-4 text-purple-300" />
          ) : (
            <Smartphone className="w-4 h-4 text-purple-300" />
          )}
        </button>

        {/* Notifications Heart */}
        <button
          onClick={() => setActiveTab("notifications")}
          className={`relative p-2 rounded-xl transition-colors cursor-pointer ${
            activeTab === "notifications"
              ? "bg-purple-600/30 text-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.3)]"
              : "text-purple-200 hover:text-white hover:bg-purple-900/30"
          }`}
          title="Activity & Notifications"
        >
          <Heart className="w-5 h-5" />
          {unreadNotifications > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_#EC4899] animate-ping" />
          )}
          {unreadNotifications > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-500" />
          )}
        </button>

        {/* Direct Messages Send */}
        <button
          onClick={() => setActiveTab("chat")}
          className={`relative p-2 rounded-xl transition-colors cursor-pointer ${
            activeTab === "chat"
              ? "bg-purple-600/30 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
              : "text-purple-200 hover:text-white hover:bg-purple-900/30"
          }`}
          title="Direct Messages"
        >
          <Send className="w-5 h-5 -rotate-12" />
          {unreadMessages > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-cyan-500 text-[10px] font-black text-black flex items-center justify-center shadow-[0_0_8px_#06B6D4]">
              {unreadMessages}
            </span>
          )}
        </button>

        {/* Settings & Firebase Hub */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl text-purple-300 hover:text-white hover:bg-purple-900/30 transition-colors cursor-pointer"
          title="Settings & Firebase Cloud Hub"
        >
          <SettingsIcon className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
