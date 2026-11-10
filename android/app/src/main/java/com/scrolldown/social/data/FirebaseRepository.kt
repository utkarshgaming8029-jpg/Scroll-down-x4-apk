package com.scrolldown.social.data

import android.net.Uri
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.google.firebase.storage.FirebaseStorage
import com.scrolldown.social.model.*
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await
import java.util.UUID

class FirebaseRepository {
    private val auth: FirebaseAuth = FirebaseAuth.getInstance()
    private val firestore: FirebaseFirestore = FirebaseFirestore.getInstance()
    private val storage: FirebaseStorage = FirebaseStorage.getInstance()

    val currentUser: FirebaseUser?
        get() = auth.currentUser

    // 1. Authentication
    suspend fun signIn(email: String, pass: String): Result<FirebaseUser> = runCatching {
        val result = auth.signInWithEmailAndPassword(email, pass).await()
        result.user ?: error("Sign in failed")
    }

    suspend fun signUp(email: String, pass: String, username: String): Result<FirebaseUser> = runCatching {
        val result = auth.createUserWithEmailAndPassword(email, pass).await()
        val user = result.user ?: error("Sign up failed")
        // Initialize user document in Firestore
        val profile = User(
            uid = user.uid,
            username = username,
            displayName = username,
            email = email,
            bio = "Scroll Down into my world ✨"
        )
        firestore.collection("users").document(user.uid).set(profile).await()
        user
    }

    fun signOut() {
        auth.signOut()
    }

    // 2. Home Feed & Posts
    fun getFeedPosts(): Flow<List<Post>> = callbackFlow {
        val subscription = firestore.collection("posts")
            .orderBy("createdAt", Query.Direction.DESCENDING)
            .limit(50)
            .addSnapshotListener { snapshot, err ->
                if (err != null) {
                    close(err)
                    return@addSnapshotListener
                }
                val posts = snapshot?.toObjects(Post::class.java) ?: emptyList()
                trySend(posts)
            }
        awaitClose { subscription.remove() }
    }

    suspend fun toggleLikePost(postId: String, currentLikes: Int, isLiked: Boolean) {
        val uid = currentUser?.uid ?: return
        val postRef = firestore.collection("posts").document(postId)
        val likeRef = postRef.collection("likes").document(uid)

        if (isLiked) {
            likeRef.delete().await()
            postRef.update("likesCount", (currentLikes - 1).coerceAtLeast(0)).await()
        } else {
            likeRef.set(mapOf("likedAt" to com.google.firebase.Timestamp.now())).await()
            postRef.update("likesCount", currentLikes + 1).await()
        }
    }

    // 3. Reels
    fun getReels(): Flow<List<Reel>> = callbackFlow {
        val subscription = firestore.collection("reels")
            .orderBy("createdAt", Query.Direction.DESCENDING)
            .limit(30)
            .addSnapshotListener { snapshot, err ->
                if (err != null) {
                    close(err)
                    return@addSnapshotListener
                }
                val reels = snapshot?.toObjects(Reel::class.java) ?: emptyList()
                trySend(reels)
            }
        awaitClose { subscription.remove() }
    }

    // 4. Stories
    fun getStories(): Flow<List<Story>> = callbackFlow {
        val subscription = firestore.collection("stories")
            .orderBy("expiresAt", Query.Direction.DESCENDING)
            .addSnapshotListener { snapshot, err ->
                if (err != null) {
                    close(err)
                    return@addSnapshotListener
                }
                val stories = snapshot?.toObjects(Story::class.java) ?: emptyList()
                trySend(stories)
            }
        awaitClose { subscription.remove() }
    }

    // 5. Real-time Chat
    fun getChatMessages(chatId: String): Flow<List<ChatMessage>> = callbackFlow {
        val subscription = firestore.collection("chats")
            .document(chatId)
            .collection("messages")
            .orderBy("timestamp", Query.Direction.ASCENDING)
            .addSnapshotListener { snapshot, err ->
                if (err != null) {
                    close(err)
                    return@addSnapshotListener
                }
                val messages = snapshot?.toObjects(ChatMessage::class.java) ?: emptyList()
                trySend(messages)
            }
        awaitClose { subscription.remove() }
    }

    suspend fun sendMessage(chatId: String, text: String, mediaUrl: String? = null) {
        val user = currentUser ?: return
        val msg = ChatMessage(
            messageId = UUID.randomUUID().toString(),
            senderId = user.uid,
            senderUsername = user.displayName ?: "User",
            senderAvatarUrl = user.photoUrl?.toString() ?: "",
            text = text,
            mediaUrl = mediaUrl
        )
        firestore.collection("chats")
            .document(chatId)
            .collection("messages")
            .document(msg.messageId)
            .set(msg)
            .await()
    }

    // 6. Media Upload to Firebase Storage
    suspend fun uploadMedia(fileUri: Uri, folder: String = "posts"): String {
        val user = currentUser ?: error("Not logged in")
        val filename = "${UUID.randomUUID()}"
        val storageRef = storage.reference.child("$folder/${user.uid}/$filename")
        storageRef.putFile(fileUri).await()
        return storageRef.downloadUrl.await().toString()
    }
}
