import React, { useState } from "react";
import {
  Grid,
  Film,
  Bookmark,
  Settings,
  Share2,
  ExternalLink,
  Sparkles,
  Check,
  UserPlus,
} from "lucide-react";
import { User, Post, Reel } from "../../types";
import { FollowersModal } from "./FollowersModal";

interface ProfileViewProps {
  user: User;
  currentUser: User;
  allUsers: User[];
  posts: Post[];
  reels: Reel[];
  onToggleFollow: (userId: string) => void;
  onOpenSettings: () => void;
  onSelectPost: (post: Post) => void;
  onSelectUser: (userId: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  currentUser,
  allUsers,
  posts,
  reels,
  onToggleFollow,
  onOpenSettings,
  onSelectPost,
  onSelectUser,
}) => {
  const [activeTab, setActiveTab] = useState<"posts" | "reels" | "saved">("posts");
  const [modalType, setModalType] = useState<"followers" | "following" | null>(null);

  const isMe = user.id === currentUser.id;
  const userPosts = posts.filter((p) => p.authorId === user.id);
  const userReels = reels.filter((r) => r.authorId === user.id);
  const savedPosts = posts.filter((p) => p.isSavedByMe);

  return (
    <div className="w-full flex flex-col pb-20 bg-[#0A0512]">
      {/* Banner */}
      <div className="relative w-full h-36 bg-gradient-to-r from-purple-900 via-pink-900 to-[#100720] overflow-hidden">
        {user.bannerUrl ? (
          <img
            src={user.bannerUrl}
            alt="Banner"
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-900/60 to-pink-900/60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0512] via-transparent to-black/30" />
      </div>

      {/* Header Info Section */}
      <div className="px-4 -mt-14 relative z-10 flex flex-col gap-3">
        {/* Avatar & Action Button Row */}
        <div className="flex items-end justify-between">
          {/* Avatar with Neon Ring */}
          <div className="w-24 h-24 rounded-full p-[3px] bg-gradient-to-tr from-purple-500 via-pink-500 to-cyan-400 shadow-[0_0_25px_rgba(168,85,247,0.6)]">
            <img
              src={user.avatarUrl}
              alt={user.username}
              className="w-full h-full rounded-full object-cover border-2 border-[#0A0512]"
            />
          </div>

          {/* Action Button */}
          {isMe ? (
            <button
              onClick={onOpenSettings}
              className="px-4 py-1.5 rounded-full bg-[#1C0E34] border border-purple-500/40 text-purple-200 text-xs font-bold hover:bg-purple-900/40 transition-colors flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(168,85,247,0.2)]"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <button
              onClick={() => onToggleFollow(user.id)}
              className={`px-5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                user.isFollowing
                  ? "bg-purple-950 text-purple-300 border border-purple-500/40"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_12px_#EC4899]"
              }`}
            >
              {user.isFollowing ? (
                <>
                  <Check className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Follow</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Name & Bio */}
        <div className="flex flex-col mt-1">
          <div className="flex items-center gap-1.5">
            <h1 className="text-lg font-black text-white">{user.displayName}</h1>
            {user.isVerified && <span className="text-xs text-cyan-400 font-bold">✓</span>}
          </div>
          <span className="text-xs text-purple-400/80 font-mono">@{user.username}</span>
          <p className="text-xs text-slate-200 mt-2 leading-relaxed">{user.bio}</p>
          {user.website && (
            <a
              href={user.website}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[11px] text-pink-400 hover:text-pink-300 mt-1.5"
            >
              <ExternalLink className="w-3 h-3" />
              <span>{user.website}</span>
            </a>
          )}
        </div>

        {/* Stats Row (Posts, Followers, Following) */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-purple-500/20 text-center">
          <div className="flex flex-col">
            <span className="text-sm font-black text-white">{userPosts.length}</span>
            <span className="text-[10px] text-purple-300/70 uppercase tracking-wider">Posts</span>
          </div>
          <button
            onClick={() => setModalType("followers")}
            className="flex flex-col hover:opacity-80 transition-opacity cursor-pointer"
          >
            <span className="text-sm font-black text-pink-400">
              {user.followersCount.toLocaleString()}
            </span>
            <span className="text-[10px] text-purple-300/70 uppercase tracking-wider">
              Followers
            </span>
          </button>
          <button
            onClick={() => setModalType("following")}
            className="flex flex-col hover:opacity-80 transition-opacity cursor-pointer"
          >
            <span className="text-sm font-black text-cyan-400">
              {user.followingCount.toLocaleString()}
            </span>
            <span className="text-[10px] text-purple-300/70 uppercase tracking-wider">
              Following
            </span>
          </button>
        </div>

        {/* Segmented Tabs */}
        <div className="flex items-center justify-around border-b border-purple-500/15">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex items-center gap-1.5 py-2.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === "posts"
                ? "text-purple-400 border-b-2 border-purple-500 drop-shadow-[0_0_8px_#A855F7]"
                : "text-slate-400 hover:text-purple-300"
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Posts</span>
          </button>
          <button
            onClick={() => setActiveTab("reels")}
            className={`flex items-center gap-1.5 py-2.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === "reels"
                ? "text-pink-400 border-b-2 border-pink-500 drop-shadow-[0_0_8px_#EC4899]"
                : "text-slate-400 hover:text-purple-300"
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Reels</span>
          </button>
          {isMe && (
            <button
              onClick={() => setActiveTab("saved")}
              className={`flex items-center gap-1.5 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "saved"
                  ? "text-cyan-400 border-b-2 border-cyan-400 drop-shadow-[0_0_8px_#06B6D4]"
                  : "text-slate-400 hover:text-purple-300"
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved</span>
            </button>
          )}
        </div>

        {/* Tab Content Media Grid */}
        <div className="grid grid-cols-3 gap-1 pt-1">
          {activeTab === "posts" &&
            userPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => onSelectPost(post)}
                className="aspect-square bg-purple-950/40 overflow-hidden cursor-pointer group relative"
              >
                <img
                  src={post.mediaUrls[0]}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                {post.aiModelUsed && (
                  <div className="absolute top-1 left-1 p-0.5 rounded-full bg-black/60">
                    <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                  </div>
                )}
              </div>
            ))}

          {activeTab === "reels" &&
            userReels.map((reel) => (
              <div
                key={reel.id}
                className="aspect-[9/16] bg-purple-950/40 overflow-hidden cursor-pointer group relative"
              >
                <img
                  src={reel.thumbnailUrl}
                  alt={reel.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute bottom-1 left-1 flex items-center gap-0.5 text-[10px] text-white font-bold drop-shadow">
                  <Film className="w-3 h-3 text-pink-400" />
                  <span>{reel.likesCount}</span>
                </div>
              </div>
            ))}

          {activeTab === "saved" &&
            savedPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => onSelectPost(post)}
                className="aspect-square bg-purple-950/40 overflow-hidden cursor-pointer group relative"
              >
                <img
                  src={post.mediaUrls[0]}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
            ))}
        </div>
      </div>

      {/* Followers / Following Modal */}
      {modalType && (
        <FollowersModal
          user={user}
          usersList={allUsers}
          type={modalType}
          onClose={() => setModalType(null)}
          onToggleFollow={onToggleFollow}
          onSelectUser={onSelectUser}
        />
      )}
    </div>
  );
};
