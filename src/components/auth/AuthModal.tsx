import React, { useState } from "react";
import { X, Lock, Mail, User as UserIcon, Sparkles, Check, ArrowRight } from "lucide-react";
import { User } from "../../types";
import { MOCK_USERS } from "../../data/initialData";

interface AuthModalProps {
  currentUser: User;
  onClose: () => void;
  onLoginAsUser: (user: User) => void;
  onCreateAccount: (email: string, username: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  currentUser,
  onClose,
  onLoginAsUser,
  onCreateAccount,
}) => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signin") {
      setSuccessMsg(`Welcome back to SCROLL DOWN! 💜`);
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      if (!username.trim() || !email.trim()) return;
      onCreateAccount(email, username);
      setSuccessMsg(`Account created for @${username}! 🚀`);
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md bg-[#120724] border border-purple-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.3)] flex flex-col">
        {/* Header */}
        <div className="p-4 bg-[#190A33] border-b border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center">
              <span className="text-white text-xs font-black">▼</span>
            </div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              {mode === "signin" ? "Login to SCROLL DOWN" : "Create Account"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-purple-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Container */}
        <div className="p-5 flex flex-col gap-4 text-xs">
          {successMsg ? (
            <div className="p-4 rounded-2xl bg-purple-900/40 border border-purple-400 text-center text-sm font-bold text-purple-200 flex flex-col items-center gap-2 animate-in zoom-in-90 duration-200">
              <Check className="w-8 h-8 text-pink-400" />
              <span>{successMsg}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {mode === "signup" && (
                <div>
                  <label className="text-purple-300 font-semibold mb-1 block">Username</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="neon_creator"
                      required
                      className="w-full bg-[#0D0714] border border-purple-500/30 rounded-xl pl-9 pr-3 py-2 text-white placeholder-purple-400/40 focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-purple-300 font-semibold mb-1 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="creator@scrolldown.social"
                    required
                    className="w-full bg-[#0D0714] border border-purple-500/30 rounded-xl pl-9 pr-3 py-2 text-white placeholder-purple-400/40 focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-purple-300 font-semibold mb-1 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#0D0714] border border-purple-500/30 rounded-xl pl-9 pr-3 py-2 text-white placeholder-purple-400/40 focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-[0_0_15px_#EC4899] cursor-pointer"
              >
                {mode === "signin" ? "Sign In with Firebase" : "Sign Up"}
              </button>

              <div className="flex items-center justify-between text-[11px] text-purple-300/80 mt-1">
                <button
                  type="button"
                  onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                  className="hover:underline text-pink-400 font-semibold cursor-pointer"
                >
                  {mode === "signin"
                    ? "New to SCROLL DOWN? Create account"
                    : "Already have an account? Sign in"}
                </button>
              </div>
            </form>
          )}

          {/* Quick Demo Accounts Switcher */}
          <div className="pt-3 border-t border-purple-500/20 flex flex-col gap-2">
            <span className="text-[10px] font-bold text-purple-300/80 uppercase tracking-wider">
              Quick Switch Profile
            </span>
            <div className="grid grid-cols-2 gap-2">
              {MOCK_USERS.slice(0, 4).map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    onLoginAsUser(u);
                    onClose();
                  }}
                  className={`p-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer text-left ${
                    currentUser.id === u.id
                      ? "bg-purple-600/30 border border-purple-400 shadow-[0_0_8px_#A855F7]"
                      : "bg-[#0D0714] border border-purple-500/20 hover:bg-purple-950/40"
                  }`}
                >
                  <img
                    src={u.avatarUrl}
                    alt={u.username}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <div className="flex flex-col truncate">
                    <span className="text-[11px] font-bold text-white truncate">@{u.username}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
