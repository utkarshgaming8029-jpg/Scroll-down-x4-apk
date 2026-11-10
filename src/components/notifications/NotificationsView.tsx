import React, { useState } from "react";
import { Heart, MessageCircle, UserPlus, AtSign, Check } from "lucide-react";
import { NotificationItem, User } from "../../types";

interface NotificationsViewProps {
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onSelectUser: (userId: string) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkAllAsRead,
  onSelectUser,
}) => {
  const [filter, setFilter] = useState<"all" | "like" | "comment" | "follow" | "mention">("all");

  const filteredNotifs = notifications.filter((n) => {
    if (filter === "all") return true;
    return n.type === filter;
  });

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "like":
        return <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />;
      case "comment":
        return <MessageCircle className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />;
      case "follow":
        return <UserPlus className="w-3.5 h-3.5 text-cyan-400" />;
      case "mention":
        return <AtSign className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <div className="w-full flex flex-col pb-20 bg-[#0A0512]">
      {/* Header */}
      <div className="p-3.5 bg-[#100720] border-b border-purple-500/20 flex items-center justify-between">
        <h2 className="text-base font-bold text-white tracking-wide">Activity</h2>
        <button
          onClick={onMarkAllAsRead}
          className="flex items-center gap-1 text-[11px] font-semibold text-purple-300 hover:text-pink-300 transition-colors cursor-pointer"
        >
          <Check className="w-3 h-3" />
          <span>Mark all read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-2.5 bg-[#130726] border-b border-purple-500/15 overflow-x-auto no-scrollbar">
        {(["all", "like", "comment", "follow"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-colors cursor-pointer ${
              filter === t
                ? "bg-purple-600 text-white shadow-[0_0_8px_#A855F7]"
                : "bg-purple-950/40 text-purple-300 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="flex flex-col divide-y divide-purple-500/10">
        {filteredNotifs.length === 0 ? (
          <div className="py-16 text-center text-purple-300/50 text-xs">
            No notifications in this filter.
          </div>
        ) : (
          filteredNotifs.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 flex items-center justify-between gap-3 transition-colors ${
                !item.isRead ? "bg-purple-950/20" : "hover:bg-purple-950/10"
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Actor Avatar with Type Badge */}
                <div
                  className="relative cursor-pointer"
                  onClick={() => onSelectUser(item.actor.id)}
                >
                  <img
                    src={item.actor.avatarUrl}
                    alt={item.actor.username}
                    className="w-10 h-10 rounded-full object-cover border border-purple-500/40"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#0A0512] flex items-center justify-center border border-purple-500/30">
                    {getIcon(item.type)}
                  </div>
                </div>

                {/* Text Description */}
                <div className="flex flex-col">
                  <p className="text-xs text-slate-200 leading-snug">
                    <span
                      className="font-bold text-white hover:underline cursor-pointer mr-1"
                      onClick={() => onSelectUser(item.actor.id)}
                    >
                      {item.actor.username}
                    </span>
                    <span className="text-purple-200/80">{item.text}</span>
                  </p>
                  <span className="text-[10px] text-purple-400/50 mt-0.5">{item.timestamp}</span>
                </div>
              </div>

              {/* Target Post Thumbnail (if applicable) or Follow Button */}
              {item.targetPostImage ? (
                <img
                  src={item.targetPostImage}
                  alt="Post preview"
                  className="w-10 h-10 rounded-lg object-cover border border-purple-500/20 flex-shrink-0"
                />
              ) : item.type === "follow" ? (
                <button
                  onClick={() => onSelectUser(item.actor.id)}
                  className="px-3 py-1 rounded-full bg-purple-600 text-white text-[11px] font-bold hover:bg-purple-500 transition-colors shadow-[0_0_8px_#A855F7] flex-shrink-0"
                >
                  Profile
                </button>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
