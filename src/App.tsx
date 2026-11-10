import React, { useState } from "react";
import { SplashScreen } from "./components/splash/SplashScreen";
import { AndroidDeviceShell } from "./components/device/AndroidDeviceShell";
import { TopNavBar } from "./components/navigation/TopNavBar";
import { BottomNavBar } from "./components/navigation/BottomNavBar";
import { FeedView } from "./components/feed/FeedView";
import { ReelsView } from "./components/reels/ReelsView";
import { ExploreView } from "./components/explore/ExploreView";
import { ChatView } from "./components/chat/ChatView";
import { NotificationsView } from "./components/notifications/NotificationsView";
import { ProfileView } from "./components/profile/ProfileView";
import { CreatePostModal } from "./components/upload/CreatePostModal";
import { SettingsModal } from "./components/settings/SettingsModal";
import { StoryViewerModal } from "./components/stories/StoryViewerModal";
import { AuthModal } from "./components/auth/AuthModal";
import { AndroidProjectInspector } from "./components/android/AndroidProjectInspector";

import {
  CURRENT_USER,
  MOCK_USERS,
  INITIAL_POSTS,
  INITIAL_REELS,
  INITIAL_STORIES,
  INITIAL_CONVERSATIONS,
  INITIAL_NOTIFICATIONS,
} from "./data/initialData";
import { User, Post, Reel, Story, ChatConversation, NotificationItem, ActiveTab } from "./types";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isDeviceMode, setIsDeviceMode] = useState(false);

  // Core Data States
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [reels, setReels] = useState<Reel[]>(INITIAL_REELS);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [conversations, setConversations] = useState<ChatConversation[]>(INITIAL_CONVERSATIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Navigation & Modals State
  const [activeTab, setActiveTab] = useState<ActiveTab>("feed");
  const [viewingProfileUserId, setViewingProfileUserId] = useState<string>(CURRENT_USER.id);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Unread badge counts
  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  // 1. Toggle Like on Feed Post
  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLikedByMe;
          return {
            ...p,
            isLikedByMe: isLiked,
            likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
          };
        }
        return p;
      })
    );
  };

  // 2. Toggle Bookmark / Save Post
  const handleToggleSave = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isSavedByMe: !p.isSavedByMe } : p))
    );
  };

  // 3. Toggle Like on Reel
  const handleToggleReelLike = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          const isLiked = !r.isLikedByMe;
          return {
            ...r,
            isLikedByMe: isLiked,
            likesCount: isLiked ? r.likesCount + 1 : Math.max(0, r.likesCount - 1),
          };
        }
        return r;
      })
    );
  };

  // 4. Add Comment to Post
  const handleAddComment = (postId: string, text: string) => {
    const newComment = {
      id: `c_${Date.now()}`,
      authorId: currentUser.id,
      authorUsername: currentUser.username,
      authorAvatarUrl: currentUser.avatarUrl,
      text,
      timestamp: "Just now",
      likesCount: 0,
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [newComment, ...p.comments],
          };
        }
        return p;
      })
    );
  };

  // 5. Send Real-time Chat Message
  const handleSendMessage = (conversationId: string, text: string) => {
    const newMsg = {
      id: `m_${Date.now()}`,
      senderId: currentUser.id,
      senderUsername: currentUser.username,
      senderAvatarUrl: currentUser.avatarUrl,
      text,
      timestamp: "Just now",
      isRead: true,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: text,
            lastMessageTimestamp: "Just now",
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    // Simulated reply after 1.5 seconds for engaging real-time feel
    setTimeout(() => {
      const autoReplyText = `Received! Sending back cyber frequencies from @${conversationId} 💜⚡`;
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === conversationId) {
            return {
              ...c,
              lastMessage: autoReplyText,
              lastMessageTimestamp: "Just now",
              messages: [
                ...c.messages,
                {
                  id: `reply_${Date.now()}`,
                  senderId: c.participant.id,
                  senderUsername: c.participant.username,
                  senderAvatarUrl: c.participant.avatarUrl,
                  text: autoReplyText,
                  timestamp: "Just now",
                  isRead: true,
                },
              ],
            };
          }
          return c;
        })
      );
    }, 1800);
  };

  // 6. Toggle Follow / Unfollow User
  const handleToggleFollow = (targetUserId: string) => {
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === targetUserId) {
          const nextFollowing = !u.isFollowing;
          return {
            ...u,
            isFollowing: nextFollowing,
            followersCount: nextFollowing ? u.followersCount + 1 : Math.max(0, u.followersCount - 1),
          };
        }
        return u;
      })
    );
  };

  // 7. Publish Post
  const handlePublishPost = (partialPost: Partial<Post>) => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      authorId: currentUser.id,
      authorUsername: currentUser.username,
      authorDisplayName: currentUser.displayName,
      authorAvatarUrl: currentUser.avatarUrl,
      isVerified: currentUser.isVerified,
      caption: partialPost.caption || "New post on SCROLL DOWN ✨",
      mediaUrls: partialPost.mediaUrls || [
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&auto=format&fit=crop&q=80",
      ],
      location: partialPost.location || "Neo Shibuya",
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      isLikedByMe: true,
      isSavedByMe: false,
      timestamp: "Just now",
      tags: partialPost.tags || ["#ScrollDown", "#DarkPurpleNeon"],
      aiModelUsed: partialPost.aiModelUsed,
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setActiveTab("feed");
  };

  // 8. Publish Reel
  const handlePublishReel = (partialReel: Partial<Reel>) => {
    const newReel: Reel = {
      id: `reel_${Date.now()}`,
      authorId: currentUser.id,
      authorUsername: currentUser.username,
      authorAvatarUrl: currentUser.avatarUrl,
      videoUrl:
        partialReel.videoUrl ||
        "https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-city-at-night-with-neon-lights-42998-large.mp4",
      thumbnailUrl:
        partialReel.thumbnailUrl ||
        "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80",
      caption: partialReel.caption || "New reel drop! #ScrollDown",
      audioTrack: "SCROLL DOWN • Neon Wave Beats",
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      isLikedByMe: true,
      tags: partialReel.tags || ["#ScrollDown", "#Reels"],
    };

    setReels([newReel, ...reels]);
    setActiveTab("reels");
  };

  // 9. Mark All Notifications Read
  const handleMarkAllNotifsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // 10. Reply to Story directly in Chat
  const handleStoryReply = (story: Story, message: string) => {
    // Find or create conversation with story author
    let conv = conversations.find((c) => c.participant.id === story.authorId);
    if (!conv) {
      const authorUser = allUsers.find((u) => u.id === story.authorId) || MOCK_USERS[1];
      const newConv: ChatConversation = {
        id: `chat_${Date.now()}`,
        participant: authorUser,
        lastMessage: `Replied to story: ${message}`,
        lastMessageTimestamp: "Just now",
        unreadCount: 0,
        messages: [
          {
            id: `msg_${Date.now()}`,
            senderId: currentUser.id,
            senderUsername: currentUser.username,
            senderAvatarUrl: currentUser.avatarUrl,
            text: `Replied to story: "${message}"`,
            timestamp: "Just now",
            isRead: true,
          },
        ],
      };
      setConversations([newConv, ...conversations]);
    } else {
      handleSendMessage(conv.id, `Replied to story: "${message}"`);
    }
  };

  // Select User to view Profile
  const handleSelectUser = (userId: string) => {
    setViewingProfileUserId(userId);
    setActiveTab("profile");
  };

  const viewedUser = allUsers.find((u) => u.id === viewingProfileUserId) || currentUser;

  return (
    <div className="w-full min-h-screen bg-[#07030C] text-white flex flex-col font-sans select-none">
      {/* Initial Splash Screen */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Main App Container wrapped in Device Frame or Responsive Shell */}
      <AndroidDeviceShell isDeviceMode={isDeviceMode}>
        {/* Top App Bar */}
        {activeTab !== "reels" && activeTab !== "android-code" && (
          <TopNavBar
            currentUser={currentUser}
            unreadNotifications={unreadNotificationsCount}
            unreadMessages={unreadMessagesCount}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isDeviceMode={isDeviceMode}
            setIsDeviceMode={setIsDeviceMode}
            onOpenSettings={() => setShowSettingsModal(true)}
          />
        )}

        {/* Dynamic Main View */}
        <main className="flex-1 w-full flex flex-col relative overflow-y-auto overflow-x-hidden">
          {activeTab === "feed" && (
            <FeedView
              posts={posts}
              stories={stories}
              currentUser={currentUser}
              onToggleLike={handleToggleLike}
              onToggleSave={handleToggleSave}
              onAddComment={handleAddComment}
              onSelectStory={(s) => setSelectedStory(s)}
              onAddStory={() => setShowCreateModal(true)}
              onSelectUser={handleSelectUser}
              onOpenCreate={() => setShowCreateModal(true)}
            />
          )}

          {activeTab === "explore" && (
            <ExploreView
              posts={posts}
              reels={reels}
              users={allUsers}
              onSelectUser={handleSelectUser}
              onSelectPost={(p) => {
                // Focus on feed
                setActiveTab("feed");
              }}
            />
          )}

          {activeTab === "reels" && (
            <ReelsView
              reels={reels}
              currentUser={currentUser}
              onToggleLike={handleToggleReelLike}
              onSelectUser={handleSelectUser}
            />
          )}

          {activeTab === "chat" && (
            <ChatView
              conversations={conversations}
              currentUser={currentUser}
              onSendMessage={handleSendMessage}
              onSelectUser={handleSelectUser}
            />
          )}

          {activeTab === "notifications" && (
            <NotificationsView
              notifications={notifications}
              onMarkAllAsRead={handleMarkAllNotifsRead}
              onSelectUser={handleSelectUser}
            />
          )}

          {activeTab === "profile" && (
            <ProfileView
              user={viewedUser}
              currentUser={currentUser}
              allUsers={allUsers}
              posts={posts}
              reels={reels}
              onToggleFollow={handleToggleFollow}
              onOpenSettings={() => setShowSettingsModal(true)}
              onSelectPost={() => setActiveTab("feed")}
              onSelectUser={handleSelectUser}
            />
          )}

          {activeTab === "android-code" && (
            <AndroidProjectInspector onBackToApp={() => setActiveTab("feed")} />
          )}
        </main>

        {/* Bottom Navigation Bar */}
        {activeTab !== "android-code" && (
          <BottomNavBar
            currentUser={currentUser}
            activeTab={activeTab}
            setActiveTab={(tab) => {
              if (tab === "profile") {
                setViewingProfileUserId(currentUser.id);
              }
              setActiveTab(tab);
            }}
            onOpenCreate={() => setShowCreateModal(true)}
          />
        )}
      </AndroidDeviceShell>

      {/* Story Viewer Fullscreen Modal */}
      {selectedStory && (
        <StoryViewerModal
          stories={stories}
          initialIndex={stories.findIndex((s) => s.id === selectedStory.id)}
          onClose={() => setSelectedStory(null)}
          onReply={handleStoryReply}
        />
      )}

      {/* Create / Upload & Gemini Nano Banana 2.1 / Argon Modal */}
      {showCreateModal && (
        <CreatePostModal
          currentUser={currentUser}
          onClose={() => setShowCreateModal(false)}
          onPublishPost={handlePublishPost}
          onPublishReel={handlePublishReel}
        />
      )}

      {/* Settings & Firebase Cloud Hub Modal */}
      {showSettingsModal && (
        <SettingsModal
          currentUser={currentUser}
          onClose={() => setShowSettingsModal(false)}
          onOpenAndroidInspector={() => {
            setShowSettingsModal(false);
            setActiveTab("android-code");
          }}
        />
      )}

      {/* Auth / Switch Profile Modal */}
      {showAuthModal && (
        <AuthModal
          currentUser={currentUser}
          onClose={() => setShowAuthModal(false)}
          onLoginAsUser={(u) => {
            setCurrentUser(u);
            setViewingProfileUserId(u.id);
          }}
          onCreateAccount={(email, username) => {
            const newUser: User = {
              id: `user_${Date.now()}`,
              username,
              displayName: username,
              email,
              avatarUrl:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
              bannerUrl:
                "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&auto=format&fit=crop&q=80",
              bio: "New creator in the neon dark | #ScrollDown",
              followersCount: 0,
              followingCount: 0,
              postsCount: 0,
              isVerified: false,
            };
            setAllUsers([newUser, ...allUsers]);
            setCurrentUser(newUser);
            setViewingProfileUserId(newUser.id);
          }}
        />
      )}
    </div>
  );
}
