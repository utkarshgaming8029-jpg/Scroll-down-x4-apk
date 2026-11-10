export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  bannerUrl: string;
  bio: string;
  website?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isVerified?: boolean;
  isFollowing?: boolean;
}

export interface Post {
  id: string;
  authorId: string;
  authorUsername: string;
  authorDisplayName: string;
  authorAvatarUrl: string;
  isVerified?: boolean;
  caption: string;
  mediaUrls: string[];
  isVideo?: boolean;
  videoUrl?: string;
  location?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLikedByMe: boolean;
  isSavedByMe: boolean;
  timestamp: string;
  tags: string[];
  aiModelUsed?: string;
  comments: Comment[];
}

export interface Reel {
  id: string;
  authorId: string;
  authorUsername: string;
  authorAvatarUrl: string;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  audioTrack: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLikedByMe: boolean;
  tags: string[];
}

export interface Story {
  id: string;
  authorId: string;
  authorUsername: string;
  authorAvatarUrl: string;
  mediaUrl: string;
  isVideo?: boolean;
  caption?: string;
  createdAt: string;
  hasSeen?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderUsername: string;
  senderAvatarUrl: string;
  text: string;
  mediaUrl?: string;
  timestamp: string;
  isRead?: boolean;
}

export interface ChatConversation {
  id: string;
  participant: User;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface NotificationItem {
  id: string;
  type: "like" | "comment" | "follow" | "mention";
  actor: User;
  targetPostId?: string;
  targetPostImage?: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface Comment {
  id: string;
  authorId: string;
  authorUsername: string;
  authorAvatarUrl: string;
  text: string;
  timestamp: string;
  likesCount: number;
  isLikedByMe?: boolean;
}

export type ActiveTab =
  | "feed"
  | "explore"
  | "create"
  | "reels"
  | "profile"
  | "chat"
  | "notifications"
  | "settings"
  | "android-code";
