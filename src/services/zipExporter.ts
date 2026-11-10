import JSZip from "jszip";

export async function downloadAndroidProjectZip(): Promise<void> {
  const zip = new JSZip();

  // Root files
  zip.file(
    "settings.gradle.kts",
    `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "SCROLL DOWN"
include(":app")
`
  );

  zip.file(
    "build.gradle.kts",
    `plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
    alias(libs.plugins.google.services) apply false
}
`
  );

  zip.file(
    "gradle.properties",
    `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
kotlin.code.style=official
`
  );

  zip.file(
    "README.md",
    `# SCROLL DOWN - Native Android Social Media Application
Package ID: com.scrolldown.social
Theme: Dark Purple Neon (#0A0512, #A855F7, #EC4899, #06B6D4)

## How to build:
1. Open this directory in Android Studio Iguana / Jellyfish / Ladybug or newer.
2. Ensure JDK 21 is selected in Settings > Build, Execution, Deployment > Build Tools > Gradle.
3. Place your 'google-services.json' in 'app/google-services.json'.
4. Build APK:
   ./gradlew assembleDebug
   (Output: app/build/outputs/apk/debug/app-debug.apk)
5. Build Release:
   ./gradlew assembleRelease
`
  );

  // App module
  const appFolder = zip.folder("app");
  if (appFolder) {
    appFolder.file(
      "build.gradle.kts",
      `plugins {
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
        vectorDrawables {
            useSupportLibrary = true
        }
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
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
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

    kotlinOptions {
        jvmTarget = "21"
    }

    buildFeatures {
        compose = true
        buildConfig = true
    }
}

dependencies {
    implementation(platform("androidx.compose:compose-bom:2024.10.01"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.activity:activity-compose:1.9.3")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")
    implementation("androidx.navigation:navigation-compose:2.8.4")

    // Firebase
    implementation(platform("com.google.firebase:firebase-bom:33.6.0"))
    implementation("com.google.firebase:firebase-auth-ktx")
    implementation("com.google.firebase:firebase-firestore-ktx")
    implementation("com.google.firebase:firebase-storage-ktx")

    // Media & Network
    implementation("io.coil-kt:coil-compose:2.7.0")
    implementation("androidx.media3:media3-exoplayer:1.5.0")
    implementation("androidx.media3:media3-ui:1.5.0")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
}
`
    );

    appFolder.file(
      "src/main/AndroidManifest.xml",
      `<?xml version="1.0" encoding="utf-8"?>
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
</manifest>
`
    );

    // Kotlin source code
    const javaFolder = appFolder.folder("src/main/java/com/scrolldown/social");
    if (javaFolder) {
      javaFolder.file(
        "MainActivity.kt",
        `package com.scrolldown.social

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
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
}
`
      );
    }
  }

  // Generate zip blob and trigger browser download
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "scrolldown-android-native-project.zip";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
