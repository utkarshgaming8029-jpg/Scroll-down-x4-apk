package com.scrolldown.social.model

import com.google.firebase.Timestamp

data class User(
    val uid: String = "",
    val username: String = "",
    val displayName: String = "",
    val email: String = "",
    val bio: String = "",
    val avatarUrl: String = "",
    val bannerUrl: String = "",
    val followersCount: Int = 0,
    val followingCount: Int = 0,
    val postsCount: Int = 0,
    val isVerified: Boolean = false,
    val createdAt: Timestamp = Timestamp.now()
)

data class Post(
    val id: String = "",
    val authorId: String = "",
    val authorUsername: String = "",
    val authorAvatarUrl: String = "",
    val caption: String = "",
    val mediaUrls: List<String> = emptyList(),
    val isVideo: Boolean = false,
    val videoUrl: String? = null,
    val likesCount: Int = 0,
    val commentsCount: Int = 0,
    val sharesCount: Int = 0,
    val tags: List<String> = emptyList(),
    val isLikedByMe: Boolean = false,
    val isSavedByMe: Boolean = false,
    val createdAt: Timestamp = Timestamp.now(),
    val aiGeneratedWith: String? = null
)

data class Reel(
    val id: String = "",
    val authorId: String = "",
    val authorUsername: String = "",
    val authorAvatarUrl: String = "",
    val videoUrl: String = "",
    val thumbnailUrl: String = "",
    val caption: String = "",
    val musicTrackName: String = "SCROLL DOWN • Neon Wave Beats",
    val likesCount: Int = 0,
    val commentsCount: Int = 0,
    val sharesCount: Int = 0,
    val isLikedByMe: Boolean = false,
    val createdAt: Timestamp = Timestamp.now()
)

data class Story(
    val id: String = "",
    val authorId: String = "",
    val authorUsername: String = "",
    val authorAvatarUrl: String = "",
    val mediaUrl: String = "",
    val isVideo: Boolean = false,
    val caption: String = "",
    val expiresAt: Timestamp = Timestamp.now(),
    val hasSeen: Boolean = false
)

data class ChatMessage(
    val messageId: String = "",
    val senderId: String = "",
    val senderUsername: String = "",
    val senderAvatarUrl: String = "",
    val text: String = "",
    val mediaUrl: String? = null,
    val timestamp: Timestamp = Timestamp.now(),
    val isRead: Boolean = false
)

data class ChatConversation(
    val chatId: String = "",
    val participants: List<String> = emptyList(),
    val participantUser: User? = null,
    val lastMessage: String = "",
    val lastMessageTime: Timestamp = Timestamp.now(),
    val unreadCount: Int = 0
)

data class NotificationItem(
    val id: String = "",
    val type: NotificationType = NotificationType.LIKE,
    val actorUsername: String = "",
    val actorAvatarUrl: String = "",
    val targetPostId: String? = null,
    val text: String = "",
    val timestamp: Timestamp = Timestamp.now(),
    val isRead: Boolean = false
)

enum class NotificationType {
    LIKE,
    COMMENT,
    FOLLOW,
    MENTION
}

data class CommentItem(
    val id: String = "",
    val postId: String = "",
    val authorUsername: String = "",
    val authorAvatarUrl: String = "",
    val text: String = "",
    val timestamp: Timestamp = Timestamp.now(),
    val likesCount: Int = 0
)
