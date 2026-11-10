import React, { useState, useRef, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Volume2,
  VolumeX,
  Music2,
  Sparkles,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Reel, User } from "../../types";

interface ReelsViewProps {
  reels: Reel[];
  currentUser: User;
  onToggleLike: (reelId: string) => void;
  onSelectUser: (userId: string) => void;
}

export const ReelsView: React.FC<ReelsViewProps> = ({
  reels,
  currentUser,
  onToggleLike,
  onSelectUser,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  const currentReel = reels[currentIndex] || reels[0];
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [currentIndex]);

  const handleNextReel = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex((idx) => idx + 1);
    } else {
      setCurrentIndex(0); // loop back
    }
  };

  const handlePrevReel = () => {
    if (currentIndex > 0) {
      setCurrentIndex((idx) => idx - 1);
    }
  };

  const handleDoubleTap = () => {
    if (!currentReel.isLikedByMe) {
      onToggleLike(currentReel.id);
    }
    setShowHeartBurst(true);
    setTimeout(() => setShowHeartBurst(false), 900);
  };

  const handleShare = () => {
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2000);
  };

  return (
    <div className="relative w-full h-[calc(100vh-112px)] min-h-[580px] bg-black overflow-hidden flex items-center justify-center select-none">
      {/* Toast */}
      {showShareToast && (
        <div className="absolute top-6 z-40 bg-purple-900/90 text-white text-xs font-semibold px-4 py-1.5 rounded-full border border-purple-400 shadow-[0_0_15px_#A855F7]">
          Reel link copied! 🎬
        </div>
      )}

      {/* Main Video Background with Double Tap */}
      <div
        className="relative w-full h-full cursor-pointer flex items-center justify-center"
        onDoubleClick={handleDoubleTap}
      >
        <video
          ref={videoRef}
          src={currentReel.videoUrl}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Gradient Scrims for text contrast */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

        {/* Sound Toggle Overlay Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted(!isMuted);
          }}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-black/50 text-white backdrop-blur-md border border-purple-500/30 hover:bg-black/70 transition-colors z-20 cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-pink-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>

        {/* Vertical Navigation Chevrons */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevReel();
            }}
            disabled={currentIndex === 0}
            className="p-2 rounded-full bg-black/40 text-white disabled:opacity-20 hover:bg-black/70 backdrop-blur-sm border border-purple-500/20 transition-all cursor-pointer"
            title="Previous Reel"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextReel();
            }}
            className="p-2 rounded-full bg-black/40 text-white hover:bg-black/70 backdrop-blur-sm border border-purple-500/20 transition-all cursor-pointer"
            title="Next Reel"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* Double-tap Burst Heart */}
        {showHeartBurst && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-in zoom-in-50 fade-in duration-200">
            <Heart className="w-28 h-28 text-pink-500 fill-pink-500 drop-shadow-[0_0_35px_#EC4899] animate-bounce" />
          </div>
        )}

        {/* Right-Side Action Rail */}
        <div className="absolute right-3 bottom-14 flex flex-col items-center gap-5 z-20">
          {/* Like */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleLike(currentReel.id);
              }}
              className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-purple-500/30 text-white hover:scale-110 active:scale-95 transition-transform cursor-pointer"
            >
              <Heart
                className={`w-6 h-6 ${
                  currentReel.isLikedByMe
                    ? "text-pink-500 fill-pink-500 drop-shadow-[0_0_12px_#EC4899]"
                    : "text-white"
                }`}
              />
            </button>
            <span className="text-[11px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {currentReel.likesCount.toLocaleString()}
            </span>
          </div>

          {/* Comments */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-purple-500/30 text-white hover:scale-110 active:scale-95 transition-transform cursor-pointer"
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </button>
            <span className="text-[11px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {currentReel.commentsCount.toLocaleString()}
            </span>
          </div>

          {/* Share */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-purple-500/30 text-white hover:scale-110 active:scale-95 transition-transform cursor-pointer"
            >
              <Share2 className="w-5 h-5 text-white" />
            </button>
            <span className="text-[11px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {currentReel.sharesCount.toLocaleString()}
            </span>
          </div>

          {/* Spinning Vinyl Audio Disc */}
          <div className="relative mt-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-800 to-pink-600 p-[2px] animate-spin shadow-[0_0_15px_rgba(168,85,247,0.7)]" style={{ animationDuration: "4s" }}>
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-full bg-pink-500" />
              </div>
            </div>
            <Music2 className="absolute -top-1 -left-1 w-3.5 h-3.5 text-cyan-400 animate-bounce" />
          </div>
        </div>

        {/* Bottom Author & Caption Info */}
        <div className="absolute left-4 right-20 bottom-4 z-20 flex flex-col gap-2">
          {/* Author Row */}
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => onSelectUser(currentReel.authorId)}
          >
            <img
              src={currentReel.authorAvatarUrl}
              alt={currentReel.authorUsername}
              className="w-9 h-9 rounded-full object-cover border-2 border-pink-500 shadow-[0_0_10px_#EC4899]"
            />
            <span className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors">
              @{currentReel.authorUsername}
            </span>
            <button className="px-3 py-1 rounded-full bg-purple-600 text-white text-[11px] font-bold hover:bg-purple-500 transition-colors shadow-[0_0_8px_#A855F7] ml-1">
              Follow
            </button>
          </div>

          {/* Caption */}
          <p className="text-xs text-slate-100 font-medium leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            {currentReel.caption}
          </p>

          {/* Audio Marquee */}
          <div className="flex items-center gap-1.5 text-[11px] text-purple-300 font-medium">
            <Music2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="truncate max-w-[200px]">{currentReel.audioTrack}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
