import React, { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Post, User } from "../../types";

interface PostCardProps {
  post: Post;
  currentUser: User;
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
  onOpenComments: (postId: string) => void;
  onShare: (post: Post) => void;
  onSelectUser: (userId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  onToggleLike,
  onToggleSave,
  onOpenComments,
  onShare,
  onSelectUser,
}) => {
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [currentMediaIdx, setCurrentMediaIdx] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // Double tap to like gesture
  const handleDoubleTap = () => {
    if (!post.isLikedByMe) {
      onToggleLike(post.id);
    }
    setShowHeartBurst(true);
    setTimeout(() => setShowHeartBurst(false), 900);
  };

  return (
    <article className="w-full bg-[#100720] border-b border-purple-500/15 pb-3">
      {/* Post Header */}
      <div className="p-3 flex items-center justify-between">
        <div
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => onSelectUser(post.authorId)}
        >
          <div className="w-9 h-9 rounded-full p-[1.5px] bg-gradient-to-tr from-purple-500 to-pink-500 group-hover:shadow-[0_0_10px_#A855F7] transition-all">
            <img
              src={post.authorAvatarUrl}
              alt={post.authorUsername}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                {post.authorUsername}
              </span>
              {post.isVerified && (
                <span className="text-[10px] text-cyan-400 font-bold" title="Verified Creator">
                  ✓
                </span>
              )}
            </div>
            {post.location && (
              <span className="text-[10px] text-purple-300/60 leading-tight">
                {post.location}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-purple-300/60">
          <span className="text-[10px]">{post.timestamp}</span>
          <button className="p-1 hover:text-white transition-colors cursor-pointer">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Media Container with Double-tap Listener */}
      <div
        className="relative w-full aspect-square bg-black overflow-hidden cursor-pointer select-none group"
        onDoubleClick={handleDoubleTap}
      >
        {post.isVideo && post.videoUrl ? (
          <div className="relative w-full h-full">
            <video
              src={post.videoUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className="absolute bottom-3 right-3 p-2 rounded-full bg-black/60 text-white backdrop-blur-md border border-purple-500/30"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        ) : (
          <img
            src={post.mediaUrls[currentMediaIdx] || post.mediaUrls[0]}
            alt={post.caption}
            className="w-full h-full object-cover"
          />
        )}

        {/* Gemini AI synthesis badge */}
        {post.aiModelUsed && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-md border border-purple-500/40 rounded-full px-2.5 py-1 text-[10px] font-semibold text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.4)]">
            <Sparkles className="w-3 h-3 text-pink-400 animate-pulse" />
            <span>{post.aiModelUsed}</span>
          </div>
        )}

        {/* Carousel Dots indicator */}
        {post.mediaUrls.length > 1 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full">
            {post.mediaUrls.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${
                  i === currentMediaIdx ? "bg-pink-400" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}

        {/* Double-tap Neon Heart Burst Animation */}
        {showHeartBurst && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-in zoom-in-50 fade-in duration-200">
            <div className="relative flex items-center justify-center">
              <Heart className="w-24 h-24 text-pink-500 fill-pink-500 drop-shadow-[0_0_30px_#EC4899] animate-bounce" />
              <div className="absolute w-32 h-32 rounded-full bg-pink-500/20 blur-xl animate-ping" />
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons Bar */}
      <div className="px-3 pt-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Like Button */}
          <button
            onClick={() => onToggleLike(post.id)}
            className="flex items-center gap-1 text-slate-200 hover:text-pink-400 transition-colors cursor-pointer active:scale-125"
          >
            <Heart
              className={`w-6 h-6 transition-all ${
                post.isLikedByMe
                  ? "text-pink-500 fill-pink-500 drop-shadow-[0_0_10px_#EC4899]"
                  : "hover:text-pink-400"
              }`}
            />
          </button>

          {/* Comments Button */}
          <button
            onClick={() => onOpenComments(post.id)}
            className="flex items-center gap-1 text-slate-200 hover:text-purple-300 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-6 h-6" />
          </button>

          {/* Share Button */}
          <button
            onClick={() => onShare(post)}
            className="flex items-center gap-1 text-slate-200 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Bookmark / Save */}
        <button
          onClick={() => onToggleSave(post.id)}
          className="text-slate-200 hover:text-purple-300 transition-colors cursor-pointer"
        >
          <Bookmark
            className={`w-5 h-5 ${
              post.isSavedByMe
                ? "text-purple-400 fill-purple-400 drop-shadow-[0_0_8px_#A855F7]"
                : ""
            }`}
          />
        </button>
      </div>

      {/* Likes Count */}
      <div className="px-3 pt-1.5">
        <span className="text-xs font-bold text-white tracking-tight">
          {post.likesCount.toLocaleString()} likes
        </span>
      </div>

      {/* Caption & Tags */}
      <div className="px-3 pt-1 text-xs text-slate-200 leading-relaxed">
        <span
          className="font-bold text-purple-200 mr-1.5 cursor-pointer hover:underline"
          onClick={() => onSelectUser(post.authorId)}
        >
          {post.authorUsername}
        </span>
        <span>
          {isExpanded || post.caption.length <= 100
            ? post.caption
            : `${post.caption.slice(0, 100)}... `}
        </span>
        {post.caption.length > 100 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-purple-400 font-medium hover:underline text-[11px] ml-1 cursor-pointer"
          >
            {isExpanded ? "less" : "more"}
          </button>
        )}

        {/* Hashtags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {post.tags.map((t, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium text-pink-400/90 hover:text-pink-300 cursor-pointer"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Comments Preview Trigger */}
      {post.commentsCount > 0 && (
        <div className="px-3 pt-1.5">
          <button
            onClick={() => onOpenComments(post.id)}
            className="text-[11px] text-purple-400/70 hover:text-purple-300 cursor-pointer"
          >
            View all {post.commentsCount} comments
          </button>
        </div>
      )}
    </article>
  );
};
