import React, { useState } from "react";
import { X, Send, Heart } from "lucide-react";
import { Comment, User } from "../../types";

interface CommentDrawerProps {
  postId: string;
  comments: Comment[];
  currentUser: User;
  onClose: () => void;
  onAddComment: (postId: string, text: string) => void;
}

export const CommentDrawer: React.FC<CommentDrawerProps> = ({
  postId,
  comments,
  currentUser,
  onClose,
  onAddComment,
}) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddComment(postId, text);
    setText("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg h-[65vh] bg-[#100720] rounded-t-3xl border-t border-x border-purple-500/30 flex flex-col overflow-hidden shadow-[0_-10px_40px_rgba(168,85,247,0.25)] animate-in slide-in-from-bottom duration-200">
        {/* Drawer Handle & Header */}
        <div className="p-3 border-b border-purple-500/20 flex items-center justify-between">
          <div className="w-8" />
          <div className="flex flex-col items-center">
            <div className="w-10 h-1 rounded-full bg-purple-500/30 mb-1" />
            <h3 className="text-sm font-bold text-white tracking-wide">Comments</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-purple-900/40 text-purple-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
          {comments.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-purple-300/60">
              <span className="text-2xl mb-2">💬</span>
              <p className="text-sm font-medium">No comments yet</p>
              <p className="text-xs">Start the neon conversation below!</p>
            </div>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <img
                    src={c.authorAvatarUrl}
                    alt={c.authorUsername}
                    className="w-8 h-8 rounded-full object-cover border border-purple-500/30"
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-purple-200">{c.authorUsername}</span>
                      <span className="text-[10px] text-purple-400/60">{c.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">{c.text}</p>
                  </div>
                </div>

                <button className="flex flex-col items-center text-purple-400/60 hover:text-pink-400 transition-colors p-1 cursor-pointer">
                  <Heart className="w-3.5 h-3.5" />
                  {c.likesCount > 0 && <span className="text-[9px]">{c.likesCount}</span>}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="p-3 bg-[#0A0512] border-t border-purple-500/20 flex items-center gap-2"
        >
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.username}
            className="w-7 h-7 rounded-full object-cover border border-purple-500/40"
          />
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-[#1C0E34] border border-purple-500/30 rounded-full px-3.5 py-1.5 text-xs text-white placeholder-purple-300/40 focus:outline-none focus:border-pink-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="p-2 rounded-full bg-purple-600 text-white disabled:opacity-40 transition-opacity cursor-pointer shadow-[0_0_10px_#A855F7]"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
