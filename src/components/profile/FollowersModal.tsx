import React, { useState } from "react";
import { X, Search, Check, UserPlus } from "lucide-react";
import { User } from "../../types";

interface FollowersModalProps {
  user: User;
  usersList: User[];
  type: "followers" | "following";
  onClose: () => void;
  onToggleFollow: (targetUserId: string) => void;
  onSelectUser: (userId: string) => void;
}

export const FollowersModal: React.FC<FollowersModalProps> = ({
  user,
  usersList,
  type,
  onClose,
  onToggleFollow,
  onSelectUser,
}) => {
  const [search, setSearch] = useState("");

  const filteredUsers = usersList.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.displayName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-[#120724] border border-purple-500/30 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.3)] flex flex-col max-h-[70vh]">
        {/* Header */}
        <div className="p-3.5 bg-[#190A33] border-b border-purple-500/20 flex items-center justify-between">
          <div className="w-6" />
          <h3 className="text-sm font-bold text-white capitalize tracking-wide">
            {type} • @{user.username}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-purple-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-purple-500/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-purple-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full bg-[#0D0714] border border-purple-500/30 rounded-full pl-9 pr-3 py-1.5 text-xs text-white placeholder-purple-400/50 focus:outline-none focus:border-pink-500"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-purple-500/10 custom-scrollbar">
          {filteredUsers.map((u) => (
            <div
              key={u.id}
              className="p-2.5 flex items-center justify-between gap-3 hover:bg-purple-950/20 rounded-xl transition-colors"
            >
              <div
                className="flex items-center gap-2.5 cursor-pointer"
                onClick={() => {
                  onSelectUser(u.id);
                  onClose();
                }}
              >
                <img
                  src={u.avatarUrl}
                  alt={u.username}
                  className="w-9 h-9 rounded-full object-cover border border-purple-400"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-white">@{u.username}</span>
                    {u.isVerified && <span className="text-[10px] text-cyan-400">✓</span>}
                  </div>
                  <span className="text-[10px] text-purple-300/60">{u.displayName}</span>
                </div>
              </div>

              {u.id !== user.id && (
                <button
                  onClick={() => onToggleFollow(u.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    u.isFollowing
                      ? "bg-purple-950 text-purple-300 border border-purple-500/40 hover:bg-purple-900/50"
                      : "bg-purple-600 text-white hover:bg-purple-500 shadow-[0_0_8px_#A855F7]"
                  }`}
                >
                  {u.isFollowing ? (
                    <>
                      <Check className="w-3 h-3 text-cyan-400" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3 h-3" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
