import React, { useState } from "react";
import {
  Code2,
  Download,
  Copy,
  Check,
  FileCode,
  FolderTree,
  Terminal,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { downloadAndroidProjectZip } from "../../services/zipExporter";

interface AndroidProjectInspectorProps {
  onBackToApp: () => void;
}

const ANDROID_FILES: { path: string; name: string; lang: string; content: string }[] = [
  {
    path: "android/app/build.gradle.kts",
    name: "app/build.gradle.kts",
    lang: "kotlin",
    content: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
    id("com.google.gms.google-services")
}

android {
    namespace = "com.scrolldown.social"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.scrolldown.social"
        minSdk = 26
        targetSdk = 36
        versionCode = 1
        versionName = "1.0.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    signingConfigs {
        create("release") {
            storeFile = file("scrolldown-release.keystore")
            storePassword = System.getenv("KEYSTORE_PASSWORD") ?: "scrolldown_pass"
            keyAlias = System.getenv("KEY_ALIAS") ?: "scrolldown_key"
            keyPassword = System.getenv("KEY_PASSWORD") ?: "scrolldown_pass"
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            signingConfig = signingConfigs.getByName("release")
        }
        debug {
            applicationIdSuffix = ".debug"
            isDebuggable = true
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_21
        targetCompatibility = JavaVersion.VERSION_21
    }

    buildFeatures {
        compose = true
        buildConfig = true
    }
}

dependencies {
    implementation(platform("androidx.compose:compose-bom:2024.10.01"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.navigation:navigation-compose:2.8.4")

    // Firebase (Auth, Firestore, Storage)
    implementation(platform("com.google.firebase:firebase-bom:33.6.0"))
    implementation("com.google.firebase:firebase-auth-ktx")
    implementation("com.google.firebase:firebase-firestore-ktx")
    implementation("com.google.firebase:firebase-storage-ktx")

    // Media & Network
    implementation("io.coil-kt:coil-compose:2.7.0")
    implementation("androidx.media3:media3-exoplayer:1.5.0")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
}`,
  },
  {
    path: "android/app/src/main/AndroidManifest.xml",
    name: "AndroidManifest.xml",
    lang: "xml",
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.scrolldown.social">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="SCROLL DOWN"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.ScrollDown">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="SCROLL DOWN"
            android:theme="@style/Theme.ScrollDown"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`,
  },
  {
    path: "android/app/src/main/java/com/scrolldown/social/MainActivity.kt",
    name: "MainActivity.kt",
    lang: "kotlin",
    content: `package com.scrolldown.social

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.*
import androidx.navigation.compose.*
import com.scrolldown.social.ui.theme.ScrollDownTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ScrollDownTheme {
                ScrollDownApp()
            }
        }
    }
}`,
  },
  {
    path: "android/app/src/main/java/com/scrolldown/social/data/FirebaseRepository.kt",
    name: "FirebaseRepository.kt",
    lang: "kotlin",
    content: `package com.scrolldown.social.data

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.storage.FirebaseStorage
import com.scrolldown.social.model.*
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow

class FirebaseRepository {
    private val auth = FirebaseAuth.getInstance()
    private val firestore = FirebaseFirestore.getInstance()
    private val storage = FirebaseStorage.getInstance()

    // Real-time Firestore Feed stream
    fun getFeedPosts(): Flow<List<Post>> = callbackFlow { ... }

    // Real-time Chat message listener
    fun getChatMessages(chatId: String): Flow<List<ChatMessage>> = callbackFlow { ... }

    // Upload photo/video to Firebase Storage
    suspend fun uploadMedia(uri: android.net.Uri): String { ... }
}`,
  },
  {
    path: "android/app/src/main/java/com/scrolldown/social/data/GeminiService.kt",
    name: "GeminiService.kt",
    lang: "kotlin",
    content: `package com.scrolldown.social.data

import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody

class GeminiService {
    // 1. Text-to-Image & AI Editing via gemini-nano-banana-2.1
    suspend fun generateOrEditImage(prompt: String, aspectRatio: String = "1:1"): Result<String> {
        // Calls server route with User-Agent: aistudio-build
    }

    // 2. Multimodal Image Analysis via gemini-4-argon
    suspend fun analyzeImageWithArgon(base64: String): Result<String> {
        // Multimodal image understanding and caption generation
    }
}`,
  },
  {
    path: "android/settings.gradle.kts",
    name: "settings.gradle.kts",
    lang: "kotlin",
    content: `rootProject.name = "SCROLL DOWN"
include(":app")`,
  },
];

export const AndroidProjectInspector: React.FC<AndroidProjectInspectorProps> = ({
  onBackToApp,
}) => {
  const [selectedFile, setSelectedFile] = useState(ANDROID_FILES[0]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleDownloadZip = async () => {
    setIsDownloading(true);
    try {
      await downloadAndroidProjectZip();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(selectedFile.content);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-112px)] bg-[#07030C] text-white flex flex-col p-4 pb-20">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-[#1E0E38] via-[#140826] to-[#0A0512] border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-600/30 border border-purple-400 shadow-[0_0_15px_#A855F7]">
            <Code2 className="w-6 h-6 text-cyan-400" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-black tracking-wide text-white">
              Native Android Project Center • com.scrolldown.social
            </h1>
            <p className="text-xs text-purple-300">
              Kotlin 2.2 • Jetpack Compose • Material 3 • Android SDK 36 • Firebase • Gemini
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          <a
            href="https://github.com/utkarshgaming8029-jpg/Scroll-down-x-apk/releases"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white text-xs font-bold hover:shadow-[0_0_15px_#06B6D4] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download APK (GitHub Releases)</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
          </a>
          <button
            onClick={handleDownloadZip}
            disabled={isDownloading}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold hover:shadow-[0_0_15px_#EC4899] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? "Zipping..." : "Source (.ZIP)"}</span>
          </button>
          <button
            onClick={onBackToApp}
            className="px-3.5 py-2 rounded-xl bg-[#1C0E34] border border-purple-500/40 text-purple-200 text-xs font-semibold hover:bg-purple-900/40 transition-colors cursor-pointer"
          >
            Back to App
          </button>
        </div>
      </div>

      {/* GitHub Repository & Actions Integration Card */}
      <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-[#140826] via-[#1B0B33] to-[#0E061A] border border-purple-500/30 flex flex-col gap-3 shadow-[0_0_25px_rgba(168,85,247,0.15)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-white">
              GitHub Repository Identity:{" "}
              <a
                href="https://github.com/utkarshgaming8029-jpg/Scroll-down-x-apk"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline font-mono"
              >
                utkarshgaming8029-jpg/Scroll-down-x-apk
              </a>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/utkarshgaming8029-jpg/Scroll-down-x-apk/actions"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded-lg bg-purple-950/70 border border-purple-500/30 text-purple-200 text-[11px] font-semibold hover:text-white flex items-center gap-1"
            >
              <span>GitHub Actions</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://github.com/utkarshgaming8029-jpg/Scroll-down-x-apk/releases"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold hover:text-white flex items-center gap-1"
            >
              <span>Releases & APK</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Git Push & Direct APK Download Commands */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#090312] border border-purple-500/20 font-mono flex flex-col justify-between gap-2">
            <div>
              <span className="text-purple-300 font-bold block mb-1">🚀 1. Push Code to GitHub:</span>
              <p className="text-slate-300 text-[11px] leading-relaxed select-all">
                git init<br />
                git add .<br />
                git commit -m "feat: complete SCROLL DOWN Android app with GitHub Actions"<br />
                git branch -M main<br />
                git remote add origin https://github.com/utkarshgaming8029-jpg/Scroll-down-x-apk.git<br />
                git push -u origin main
              </p>
            </div>
            <span className="text-[10px] text-purple-400/70">
              Triggering this push automatically compiles the APK via GitHub Actions!
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#090312] border border-emerald-500/20 font-mono flex flex-col justify-between gap-2">
            <div>
              <span className="text-emerald-400 font-bold block mb-1">📦 2. Direct Debug APK URL:</span>
              <a
                href="https://github.com/utkarshgaming8029-jpg/Scroll-down-x-apk/releases/latest/download/scrolldown-debug.apk"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-300 text-[11px] break-all hover:underline block mb-1.5"
              >
                https://github.com/utkarshgaming8029-jpg/Scroll-down-x-apk/releases/latest/download/scrolldown-debug.apk
              </a>
              <p className="text-[11px] text-slate-300">
                Direct download link published automatically to GitHub Releases on every push!
              </p>
            </div>
            <span className="text-[10px] text-emerald-400/80">
              Install directly on your phone or Android emulator.
            </span>
          </div>
        </div>
      </div>

      {/* Code Browser Grid */}
      <div className="mt-4 flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Sidebar File Tree */}
        <div className="p-3 rounded-2xl bg-[#120724] border border-purple-500/25 flex flex-col gap-1.5 h-fit">
          <span className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <FolderTree className="w-3.5 h-3.5 text-pink-400" />
            Project Tree
          </span>
          {ANDROID_FILES.map((file) => {
            const isSelected = selectedFile.path === file.path;
            return (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left p-2 rounded-xl text-xs font-mono transition-colors flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? "bg-purple-600/30 text-cyan-300 border border-purple-400/60 font-bold"
                    : "text-purple-200/70 hover:bg-purple-950/40 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <FileCode className="w-3.5 h-3.5 flex-shrink-0 text-purple-400" />
                  <span className="truncate">{file.name}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Code Content Viewer */}
        <div className="md:col-span-3 rounded-2xl bg-[#0C0517] border border-purple-500/30 overflow-hidden flex flex-col">
          <div className="p-3 bg-[#16082B] border-b border-purple-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs text-purple-200">
              <span className="text-pink-400">📄</span>
              <span>{selectedFile.path}</span>
            </div>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 text-xs text-purple-300 hover:text-white px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-500/30 cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? "Copied" : "Copy Code"}</span>
            </button>
          </div>

          <pre className="p-4 flex-1 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed custom-scrollbar">
            {selectedFile.content}
          </pre>
        </div>
      </div>
    </div>
  );
};
