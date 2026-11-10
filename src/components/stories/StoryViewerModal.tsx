import React, { useState, useEffect, useRef } from "react";
import { X, Send, Heart, Pause, Play } from "lucide-react";
import { Story } from "../../types";

interface StoryViewerModalProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
  onReply: (story: Story, message: string) => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  stories,
  initialIndex,
  onClose,
  onReply,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [hasLikedStory, setHasLikedStory] = useState(false);

  const currentStory = stories[currentIndex] || stories[0];
  const timerRef = useRef<any>(null);

  useEffect(() => {
    setProgress(0);
    setHasLikedStory(false);
  }, [currentIndex]);

  useEffect(() => {
    if (isPaused) {
      clearInterval(timerRef.current);
      return;
    }

    const intervalMs = 50;
    const totalDurationMs = 5000;
    const increment = (intervalMs / totalDurationMs) * 100;

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((idx) => idx + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + increment;
      });
    }, intervalMs);

    return () => clearInterval(timerRef.current);
  }, [currentIndex, isPaused, stories.length, onClose]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((idx) => idx + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((idx) => idx - 1);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onReply(currentStory, replyText);
    setReplyText("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl">
      {/* Container simulating vertical mobile story */}
      <div className="relative w-full max-w-md h-full md:h-[90vh] md:max-h-[820px] md:rounded-3xl overflow-hidden bg-[#0A0512] flex flex-col justify-between shadow-[0_0_50px_rgba(168,85,247,0.3)] border border-purple-500/30">
        {/* Background Image / Video */}
        <img
          src={currentStory.mediaUrl}
          alt={currentStory.authorUsername}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark gradient scrims */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />

        {/* Top Header & Progress Bars */}
        <div className="relative z-20 p-4 flex flex-col gap-3">
          {/* Segmented Progress Bars */}
          <div className="flex items-center gap-1.5 w-full">
            {stories.map((st, idx) => {
              let barProgress = 0;
              if (idx < currentIndex) barProgress = 100;
              else if (idx === currentIndex) barProgress = progress;

              return (
                <div key={st.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-75"
                    style={{ width: `${barProgress}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* Story Author Info & Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={currentStory.authorAvatarUrl}
                alt={currentStory.authorUsername}
                className="w-9 h-9 rounded-full object-cover border border-purple-400"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white leading-tight">
                  {currentStory.authorUsername}
                </span>
                <span className="text-[10px] text-purple-200/80 leading-tight">
                  {currentStory.createdAt}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Tap Zones (Left = Prev, Right = Next) */}
        <div className="relative z-10 flex-1 flex">
          <div
            className="w-1/3 h-full cursor-pointer"
            onClick={handlePrev}
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          />
          <div
            className="w-2/3 h-full cursor-pointer"
            onClick={handleNext}
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          />
        </div>

        {/* Story Caption (if any) */}
        {currentStory.caption && (
          <div className="relative z-20 px-4 py-2 text-center">
            <p className="text-sm font-medium text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] bg-black/40 backdrop-blur-md py-1.5 px-3 rounded-full inline-block border border-purple-500/30">
              {currentStory.caption}
            </p>
          </div>
        )}

        {/* Bottom Reply Bar */}
        <div className="relative z-20 p-4">
          <form onSubmit={handleSendReply} className="flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${currentStory.authorUsername}...`}
              onFocus={() => setIsPaused(true)}
              onBlur={() => setIsPaused(false)}
              className="flex-1 bg-black/50 backdrop-blur-md border border-purple-500/40 rounded-full px-4 py-2 text-sm text-white placeholder-purple-300/50 focus:outline-none focus:border-pink-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => setHasLikedStory(!hasLikedStory)}
              className="p-2.5 rounded-full bg-black/50 text-white border border-purple-500/30 hover:border-pink-500 transition-colors cursor-pointer"
            >
              <Heart
                className={`w-5 h-5 ${
                  hasLikedStory ? "text-pink-500 fill-pink-500" : "text-white"
                }`}
              />
            </button>
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="p-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white disabled:opacity-40 transition-opacity cursor-pointer shadow-[0_0_12px_#EC4899]"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
