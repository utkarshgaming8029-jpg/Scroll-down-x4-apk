import React, { useState } from "react";
import { Search, TrendingUp, Sparkles, Film, Heart } from "lucide-react";
import { Post, Reel, User } from "../../types";
import { TRENDING_TAGS } from "../../data/initialData";

interface ExploreViewProps {
  posts: Post[];
  reels: Reel[];
  users: User[];
  onSelectUser: (userId: string) => void;
  onSelectPost: (post: Post) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  posts,
  reels,
  users,
  onSelectUser,
  onSelectPost,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Filter items based on search query or selected tag
  const filteredPosts = posts.filter((p) => {
    if (selectedTag) {
      return p.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.caption.toLowerCase().includes(q) ||
        p.authorUsername.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const matchedUsers = searchQuery.trim()
    ? users.filter(
        (u) =>
          u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="w-full flex flex-col pb-20 bg-[#0A0512]">
      {/* Search Header */}
      <div className="p-3 bg-[#100720] border-b border-purple-500/20 sticky top-12 z-20">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedTag(null);
            }}
            placeholder="Search creators, #tags, or cyber reels..."
            className="w-full bg-[#1A0B2E] border border-purple-500/30 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-purple-400/50 focus:outline-none focus:border-pink-500 transition-colors"
          />
        </div>

        {/* Trending Hashtag Pills */}
        <div className="flex items-center gap-2 mt-2.5 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-1 text-[10px] text-pink-400 font-bold uppercase tracking-wider flex-shrink-0">
            <TrendingUp className="w-3 h-3" />
            <span>Hot</span>
          </div>

          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold flex-shrink-0 transition-colors cursor-pointer ${
              selectedTag === null
                ? "bg-purple-600 text-white shadow-[0_0_10px_#A855F7]"
                : "bg-purple-950/60 text-purple-300 border border-purple-500/20"
            }`}
          >
            All
          </button>

          {TRENDING_TAGS.map((item) => {
            const isSelected = selectedTag?.toLowerCase() === item.tag.toLowerCase();
            return (
              <button
                key={item.tag}
                onClick={() => setSelectedTag(isSelected ? null : item.tag)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold flex-shrink-0 transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_10px_#EC4899]"
                    : "bg-purple-950/60 text-purple-300 hover:text-white border border-purple-500/20"
                }`}
              >
                {item.tag}
                <span className="text-[9px] text-purple-400/70 ml-1 font-mono">({item.postsCount})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Matching Creators Preview (if searching) */}
      {matchedUsers.length > 0 && (
        <div className="p-3 bg-[#130726] border-b border-purple-500/20">
          <span className="text-[11px] font-bold text-purple-300/80 uppercase tracking-wider">
            Creators
          </span>
          <div className="flex flex-col gap-2 mt-2">
            {matchedUsers.map((u) => (
              <div
                key={u.id}
                onClick={() => onSelectUser(u.id)}
                className="flex items-center justify-between p-2 rounded-xl bg-purple-950/30 hover:bg-purple-900/40 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={u.avatarUrl}
                    alt={u.username}
                    className="w-8 h-8 rounded-full object-cover border border-purple-400"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">@{u.username}</span>
                    <span className="text-[10px] text-purple-300/60">{u.displayName}</span>
                  </div>
                </div>
                <span className="text-[10px] text-pink-400 font-mono">
                  {u.followersCount.toLocaleString()} followers
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Staggered Explore Media Grid */}
      <div className="p-1 grid grid-cols-3 gap-1">
        {filteredPosts.map((post, idx) => {
          const isLarge = idx % 5 === 0;
          return (
            <div
              key={post.id}
              onClick={() => onSelectPost(post)}
              className={`relative overflow-hidden group cursor-pointer bg-purple-950/40 ${
                isLarge ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
              }`}
            >
              <img
                src={post.mediaUrls[0]}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Hover / Tap Overlay with Stats */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-white text-xs font-bold backdrop-blur-[2px]">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                  <span>{post.likesCount}</span>
                </div>
              </div>

              {/* Tag indicator if AI Generated */}
              {post.aiModelUsed && (
                <div className="absolute top-1.5 left-1.5 p-1 rounded-full bg-black/60 backdrop-blur-md">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
