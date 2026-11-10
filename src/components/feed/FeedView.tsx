import React, { useState } from "react";
import { StoriesBar } from "../stories/StoriesBar";
import { PostCard } from "./PostCard";
import { CommentDrawer } from "./CommentDrawer";
import { Post, Story, User } from "../../types";
import { RefreshCw, Sparkles } from "lucide-react";

interface FeedViewProps {
  posts: Post[];
  stories: Story[];
  currentUser: User;
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onSelectStory: (story: Story) => void;
  onAddStory: () => void;
  onSelectUser: (userId: string) => void;
  onOpenCreate: () => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  posts,
  stories,
  currentUser,
  onToggleLike,
  onToggleSave,
  onAddComment,
  onSelectStory,
  onAddStory,
  onSelectUser,
  onOpenCreate,
}) => {
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const activeCommentsPost = posts.find((p) => p.id === activeCommentsPostId);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleShare = (post: Post) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`https://scrolldown.social/p/${post.id}`);
      showToast("Link copied to clipboard! 📋");
    } else {
      showToast("Post shared to network! 🚀");
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast("Feed updated! ✨");
    }, 600);
  };

  return (
    <div className="w-full flex flex-col pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-purple-900/90 text-white text-xs font-semibold px-4 py-2 rounded-full border border-purple-400 shadow-[0_0_20px_#A855F7] animate-in fade-in slide-in-from-top-4 duration-200">
          {toastMessage}
        </div>
      )}

      {/* Stories Tray */}
      <StoriesBar
        stories={stories}
        currentUser={currentUser}
        onSelectStory={onSelectStory}
        onAddStory={onAddStory}
      />

      {/* Quick Refresh banner */}
      <div className="px-3 py-1.5 bg-[#0D0714] border-b border-purple-500/10 flex items-center justify-between text-[11px] text-purple-300/70">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>Home Feed • Latest from creators</span>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Posts List */}
      <div className="flex flex-col divide-y divide-purple-500/10">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUser={currentUser}
            onToggleLike={onToggleLike}
            onToggleSave={onToggleSave}
            onOpenComments={(id) => setActiveCommentsPostId(id)}
            onShare={handleShare}
            onSelectUser={onSelectUser}
          />
        ))}
      </div>

      {/* Bottom Feed Milestone */}
      <div className="py-8 px-4 flex flex-col items-center justify-center text-center text-purple-400/60 text-xs">
        <span className="text-xl mb-1">💜</span>
        <p className="font-bold text-purple-200">You're all caught up!</p>
        <p className="text-[11px] mt-0.5">Scroll back up or explore trending reels</p>
        <button
          onClick={onOpenCreate}
          className="mt-3 px-4 py-1.5 rounded-full bg-purple-950 border border-purple-500/40 text-purple-200 text-xs font-semibold hover:border-pink-500 transition-colors"
        >
          + Create New Post
        </button>
      </div>

      {/* Comments Drawer */}
      {activeCommentsPost && (
        <CommentDrawer
          postId={activeCommentsPost.id}
          comments={activeCommentsPost.comments}
          currentUser={currentUser}
          onClose={() => setActiveCommentsPostId(null)}
          onAddComment={(postId, text) => {
            onAddComment(postId, text);
          }}
        />
      )}
    </div>
  );
};
