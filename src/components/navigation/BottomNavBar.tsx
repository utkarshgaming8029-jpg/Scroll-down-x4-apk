import React from "react";
import { Home, Search, PlusCircle, Film, User as UserIcon } from "lucide-react";
import { User, ActiveTab } from "../../types";

interface BottomNavBarProps {
  currentUser: User;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenCreate: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenCreate,
}) => {
  return (
    <nav className="sticky bottom-0 z-30 w-full bg-[#0A0512]/95 backdrop-blur-md border-t border-purple-500/20 px-4 py-2 flex items-center justify-around">
      {/* Home / Feed */}
      <button
        onClick={() => setActiveTab("feed")}
        className={`flex flex-col items-center gap-0.5 p-1 transition-all cursor-pointer ${
          activeTab === "feed"
            ? "text-purple-400 scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]"
            : "text-slate-400 hover:text-purple-300"
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-medium tracking-tight">Home</span>
      </button>

      {/* Explore */}
      <button
        onClick={() => setActiveTab("explore")}
        className={`flex flex-col items-center gap-0.5 p-1 transition-all cursor-pointer ${
          activeTab === "explore"
            ? "text-purple-400 scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]"
            : "text-slate-400 hover:text-purple-300"
        }`}
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px] font-medium tracking-tight">Explore</span>
      </button>

      {/* Create / Gemini Studio Button (Center Highlight) */}
      <button
        onClick={onOpenCreate}
        className="relative -top-2 flex flex-col items-center group cursor-pointer"
        title="Create Post or Generate with Gemini Nano Banana 2.1"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-400 p-[2px] shadow-[0_0_20px_rgba(168,85,247,0.6)] group-hover:shadow-[0_0_25px_rgba(236,72,153,0.9)] transition-all group-active:scale-95">
          <div className="w-full h-full bg-[#0D0714] rounded-2xl flex items-center justify-center">
            <PlusCircle className="w-6 h-6 text-white group-hover:text-pink-300 transition-colors" />
          </div>
        </div>
        <span className="text-[9px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mt-0.5">
          Create
        </span>
      </button>

      {/* Reels */}
      <button
        onClick={() => setActiveTab("reels")}
        className={`flex flex-col items-center gap-0.5 p-1 transition-all cursor-pointer ${
          activeTab === "reels"
            ? "text-pink-400 scale-110 drop-shadow-[0_0_8px_rgba(236,72,153,0.7)]"
            : "text-slate-400 hover:text-purple-300"
        }`}
      >
        <Film className="w-5 h-5" />
        <span className="text-[10px] font-medium tracking-tight">Reels</span>
      </button>

      {/* Profile */}
      <button
        onClick={() => setActiveTab("profile")}
        className={`flex flex-col items-center gap-0.5 p-1 transition-all cursor-pointer ${
          activeTab === "profile"
            ? "text-purple-400 scale-110"
            : "text-slate-400 hover:text-purple-300"
        }`}
      >
        <div
          className={`w-6 h-6 rounded-full overflow-hidden border-2 transition-all ${
            activeTab === "profile"
              ? "border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.7)]"
              : "border-purple-500/40"
          }`}
        >
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.username}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-[10px] font-medium tracking-tight">Profile</span>
      </button>
    </nav>
  );
};
