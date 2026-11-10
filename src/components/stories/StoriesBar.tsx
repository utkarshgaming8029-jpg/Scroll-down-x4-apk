import React from "react";
import { Plus } from "lucide-react";
import { Story, User } from "../../types";

interface StoriesBarProps {
  stories: Story[];
  currentUser: User;
  onSelectStory: (story: Story) => void;
  onAddStory: () => void;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({
  stories,
  currentUser,
  onSelectStory,
  onAddStory,
}) => {
  return (
    <div className="w-full py-3 px-3 bg-[#0A0512] border-b border-purple-500/15 overflow-x-auto no-scrollbar flex items-center gap-3">
      {/* "Your Story" Add Button */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer group" onClick={onAddStory}>
        <div className="relative w-15 h-15 rounded-full p-[2px] bg-purple-950 border border-purple-500/30 group-hover:border-purple-400 transition-colors">
          <img
            src={currentUser.avatarUrl}
            alt="Your story"
            className="w-full h-full rounded-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center border-2 border-[#0A0512] shadow-[0_0_8px_#EC4899]">
            <Plus className="w-3 h-3 text-white" />
          </div>
        </div>
        <span className="text-[11px] text-slate-300 font-medium tracking-tight">Your story</span>
      </div>

      {/* Other Stories */}
      {stories.map((story) => (
        <div
          key={story.id}
          className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer group"
          onClick={() => onSelectStory(story)}
        >
          {/* Animated Neon Gradient Ring */}
          <div
            className={`w-15 h-15 rounded-full p-[2.5px] transition-transform active:scale-95 ${
              story.hasSeen
                ? "bg-purple-900/40 border border-purple-800"
                : "bg-gradient-to-tr from-purple-500 via-pink-500 to-cyan-400 shadow-[0_0_12px_rgba(168,85,247,0.5)] group-hover:shadow-[0_0_18px_rgba(236,72,153,0.8)]"
            }`}
          >
            <div className="w-full h-full rounded-full p-[2px] bg-[#0A0512]">
              <img
                src={story.authorAvatarUrl}
                alt={story.authorUsername}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
          <span className="text-[11px] text-slate-300 truncate max-w-[64px] font-medium tracking-tight">
            {story.authorUsername}
          </span>
        </div>
      ))}
    </div>
  );
};
