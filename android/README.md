# SCROLL DOWN — Native Android Social Media Application

- **Package ID**: `com.scrolldown.social`
- **Theme**: Dark Purple Neon (`#0A0512`, `#A855F7`, `#EC4899`, `#06B6D4`)
- **Framework**: Kotlin 2.2.10, Jetpack Compose, Material 3, Android SDK 36 (minSdk 26)
- **Backend**: Firebase Auth, Cloud Firestore, Firebase Storage, Gemini AI Nano Banana 2.1 & Argon

---

## Architecture & Modules

1. **Authentication**: `FirebaseRepository.signIn()`, `signUp()`, `signOut()`
2. **Home Feed**: `FeedScreen.kt` with double-tap like particle animation, stories bar, rich media cards
3. **Photo & Video Posts**: High-res image caching via Coil, video playback via AndroidX Media3 ExoPlayer
4. **Reels**: Fullscreen vertical swipe video player with audio disc animation and engagement sidebar
5. **Stories**: Ephemeral 24-hour stories with 5-second animated progress timer and quick reply
6. **User Profiles**: Dynamic creator stats (Posts, Followers, Following), Bio, and 3-tab content grid
7. **Followers & Following**: Real-time Firestore relationships with follow/unfollow toggle
8. **Real-time Chat**: Real-time Firestore snapshot listeners on `chats/{chatId}/messages`
9. **Notifications**: Push & in-app notification center for likes, comments, follows, mentions
10. **Explore & Search**: Live query filtering and trending hashtag discovery grid
11. **Settings**: Theme intensity, account security, and Firebase backend inspector
12. **Download & Media Upload + Gemini AI**:
    - `gemini-nano-banana-2.1`: Text-to-image prompt generation and image editing
    - `gemini-4-argon`: Multimodal image understanding, object analysis, aesthetic score, and viral caption generation

---

## Building the APK & Google Play Store Release

### 1. Build Debug APK
```bash
cd android
./gradlew assembleDebug
```
Output: `app/build/outputs/apk/debug/app-debug.apk`

### 2. Build Release APK / Play Store Bundle (AAB)
```bash
cd android
# Build universal release APK
./gradlew assembleRelease

# Build Google Play App Bundle (recommended for Play Store)
./gradlew bundleRelease
```
Output:
- APK: `app/build/outputs/apk/release/app-release.apk`
- AAB: `app/build/outputs/bundle/release/app-release.aab`

---

## Backend Configuration Checklist

1. **Firebase Project Setup**:
   - Create project at [console.firebase.google.com](https://console.firebase.google.com)
   - Add an Android App with package name: `com.scrolldown.social`
   - Download `google-services.json` and place in `android/app/google-services.json`
   - Enable **Firebase Authentication** (Email/Password)
   - Enable **Cloud Firestore** and deploy security rules:
     ```javascript
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /users/{userId} {
           allow read: if true;
           allow write: if request.auth != null && request.auth.uid == userId;
         }
         match /posts/{postId} {
           allow read: if true;
           allow create: if request.auth != null;
           allow update, delete: if request.auth != null && request.auth.uid == resource.data.authorId;
         }
         match /chats/{chatId}/messages/{msgId} {
           allow read, write: if request.auth != null;
         }
       }
     }
     ```
   - Enable **Firebase Storage** for media uploads (`posts/` and `avatars/`)

2. **Gemini AI API Configuration**:
   - Provide `GEMINI_API_KEY` in AI Studio Settings > Secrets
   - Supported models: `gemini-nano-banana-2.1` and `gemini-4-argon`
