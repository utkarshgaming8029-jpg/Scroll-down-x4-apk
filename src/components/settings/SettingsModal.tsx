import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  Database,
  Cloud,
  FileCode,
  Copy,
  Check,
  Sparkles,
  Sliders,
  Smartphone,
  ExternalLink,
} from "lucide-react";
import { User } from "../../types";

interface SettingsModalProps {
  currentUser: User;
  onClose: () => void;
  onOpenAndroidInspector: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  currentUser,
  onClose,
  onOpenAndroidInspector,
}) => {
  const [copiedRules, setCopiedRules] = useState(false);
  const [copiedConfig, setCopiedConfig] = useState(false);

  const firestoreRules = `rules_version = '2';
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
    match /reels/{reelId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.authorId;
    }
    match /stories/{storyId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /chats/{chatId}/messages/{msgId} {
      allow read, write: if request.auth != null;
    }
    match /notifications/{notifId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
  }
}`;

  const sampleGoogleServices = `{
  "project_info": {
    "project_number": "54689880125",
    "project_id": "scrolldown-social-app",
    "storage_bucket": "scrolldown-social-app.firebasestorage.app"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "1:54689880125:android:c5az5cd4qfu3qf7zicmcq7",
        "android_client_info": {
          "package_name": "com.scrolldown.social"
        }
      }
    }
  ]
}`;

  const copyToClipboard = (text: string, type: "rules" | "config") => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (type === "rules") {
        setCopiedRules(true);
        setTimeout(() => setCopiedRules(false), 2000);
      } else {
        setCopiedConfig(true);
        setTimeout(() => setCopiedConfig(false), 2000);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#120724] border border-purple-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.3)] flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-3.5 bg-[#190A33] border-b border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white tracking-wide">
              Profile Settings & Firebase Hub
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-purple-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar text-xs">
          {/* User Account Info */}
          <div className="p-3.5 rounded-2xl bg-[#1A0B2E] border border-purple-500/25 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.username}
                className="w-12 h-12 rounded-full object-cover border-2 border-purple-400"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">{currentUser.displayName}</span>
                <span className="text-purple-300 font-mono">@{currentUser.username}</span>
                <span className="text-[10px] text-purple-400/60">{currentUser.email}</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
              Authenticated
            </span>
          </div>

          {/* Quick link to Native Android Project */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/80 to-[#1F0C3B] border border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-5 h-5 text-cyan-400" />
              <div className="flex flex-col">
                <span className="font-bold text-white">Native Android Project Source</span>
                <span className="text-[10px] text-purple-300">
                  Inspect Kotlin code, Gradle scripts & download APK bundle
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenAndroidInspector();
              }}
              className="px-3 py-1.5 rounded-full bg-cyan-600 text-black text-xs font-bold hover:bg-cyan-500 transition-colors shadow-[0_0_10px_#06B6D4] cursor-pointer"
            >
              Open Inspector
            </button>
          </div>

          {/* Firebase Cloud Services Status */}
          <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-[#1A0B2E] border border-purple-500/25">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Database className="w-4 h-4 text-purple-400" />
                Firebase Backend Configuration
              </span>
              <span className="text-[10px] font-mono text-cyan-400">Package: com.scrolldown.social</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="p-2.5 rounded-xl bg-[#0D0714] border border-purple-500/20 flex flex-col">
                <span className="text-[10px] text-purple-300/80">Firebase Auth</span>
                <span className="text-xs font-bold text-emerald-400">Email & Password (Active)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0D0714] border border-purple-500/20 flex flex-col">
                <span className="text-[10px] text-purple-300/80">Cloud Firestore</span>
                <span className="text-xs font-bold text-emerald-400">6 Collections Monitored</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0D0714] border border-purple-500/20 flex flex-col">
                <span className="text-[10px] text-purple-300/80">Firebase Storage</span>
                <span className="text-xs font-bold text-emerald-400">Bucket: /posts & /reels</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0D0714] border border-purple-500/20 flex flex-col">
                <span className="text-[10px] text-purple-300/80">Gemini Nano Banana 2.1</span>
                <span className="text-xs font-bold text-pink-400">Server-Side Proxy</span>
              </div>
            </div>
          </div>

          {/* Firestore Security Rules */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-200 flex items-center gap-1">
                <FileCode className="w-3.5 h-3.5 text-pink-400" />
                Cloud Firestore Security Rules (firestore.rules)
              </span>
              <button
                onClick={() => copyToClipboard(firestoreRules, "rules")}
                className="flex items-center gap-1 text-[10px] text-purple-300 hover:text-white cursor-pointer"
              >
                {copiedRules ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedRules ? "Copied" : "Copy Rules"}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-[#0D0714] border border-purple-500/30 text-[10px] font-mono text-purple-200 overflow-x-auto leading-relaxed">
              {firestoreRules}
            </pre>
          </div>

          {/* google-services.json template */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-200 flex items-center gap-1">
                <Cloud className="w-3.5 h-3.5 text-cyan-400" />
                google-services.json Setup
              </span>
              <button
                onClick={() => copyToClipboard(sampleGoogleServices, "config")}
                className="flex items-center gap-1 text-[10px] text-purple-300 hover:text-white cursor-pointer"
              >
                {copiedConfig ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedConfig ? "Copied" : "Copy Config"}</span>
              </button>
            </div>
            <p className="text-[11px] text-purple-300/70">
              To connect your own Firebase project in Android Studio, place your downloaded{" "}
              <code>google-services.json</code> inside <code>android/app/google-services.json</code>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#190A33] border-t border-purple-500/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-full bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 transition-colors shadow-[0_0_10px_#A855F7] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
