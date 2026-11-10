# SCROLL DOWN — Native Android Social Media Application

[![Android Debug APK Build](https://github.com/utkarshgaming8029-jpg/Scroll-down-x-apk/actions/workflows/android-build-apk.yml/badge.svg)](https://github.com/utkarshgaming8029-jpg/Scroll-down-x-apk/actions/workflows/android-build-apk.yml)
[![Download Latest APK](https://img.shields.io/badge/Download-Debug%20APK-06B6D4?style=flat&logo=android)](https://github.com/utkarshgaming8029-jpg/Scroll-down-x-apk/releases/latest/download/scrolldown-debug.apk)
[![GitHub Releases](https://img.shields.io/badge/GitHub-Releases-EC4899?style=flat&logo=github)](https://github.com/utkarshgaming8029-jpg/Scroll-down-x-apk/releases)

- **Repository**: `utkarshgaming8029-jpg/Scroll-down-x-apk`
- **Package ID**: `com.scrolldown.social`
- **Theme**: Dark Purple Neon (`#0A0512`, `#A855F7`, `#EC4899`, `#06B6D4`)
- **Framework**: Kotlin 2.2.10, Jetpack Compose, Material 3, Android SDK 36 (minSdk 26)
- **Backend**: Firebase Auth, Cloud Firestore, Firebase Storage, Gemini AI Nano Banana 2.1 & Argon

---

## 📲 Direct APK Download (GitHub Releases)

Once pushed to `utkarshgaming8029-jpg/Scroll-down-x-apk`, GitHub Actions automatically compiles the Android application and publishes the debug APK directly to GitHub Releases:

🔗 **[Direct Download Link: scrolldown-debug.apk](https://github.com/utkarshgaming8029-jpg/Scroll-down-x-apk/releases/latest/download/scrolldown-debug.apk)**

Or visit the **[Releases Page](https://github.com/utkarshgaming8029-jpg/Scroll-down-x-apk/releases)** to download from any build.

---

## 🚀 Pushing to GitHub to Trigger Automatic Build

Run these commands in your project root:

```bash
git init
git add .
git commit -m "feat: complete SCROLL DOWN Android app with GitHub Actions"
git branch -M main
git remote add origin https://github.com/utkarshgaming8029-jpg/Scroll-down-x-apk.git
git push -u origin main
```

Every push will automatically:
1. Trigger the workflow in [GitHub Actions](https://github.com/utkarshgaming8029/Scroll-down-x-apk/actions)
2. Compile `app-debug.apk` using Java 21 & Gradle 8.10
3. Upload `scrolldown-debug-apk` artifact
4. Publish a release to [GitHub Releases](https://github.com/utkarshgaming8029/Scroll-down-x-apk/releases) with direct download!

---

## 🛠 Local Build Instructions

### 1. Build Debug APK locally
```bash
cd android
./gradlew assembleDebug
```
Output: `android/app/build/outputs/apk/debug/app-debug.apk`

### 2. Build Release APK / Play Store Bundle (AAB)
```bash
cd android
./gradlew assembleRelease
./gradlew bundleRelease
```
Output:
- APK: `android/app/build/outputs/apk/release/app-release.apk`
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`

---

## 📱 Modules Built

1. **Authentication**: `FirebaseRepository.kt` with Auth & Firestore
2. **Home Feed**: `FeedScreen.kt` with double-tap heart particle animation, stories bar, rich media cards
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
