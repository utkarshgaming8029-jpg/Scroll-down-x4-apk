import React, { useState } from "react";
import {
  ArrowLeft,
  Send,
  Image as ImageIcon,
  Smile,
  ShieldCheck,
  CheckCheck,
  Mic,
} from "lucide-react";
import { ChatConversation, User, ChatMessage } from "../../types";

interface ChatViewProps {
  conversations: ChatConversation[];
  currentUser: User;
  onSendMessage: (conversationId: string, text: string) => void;
  onSelectUser: (userId: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  conversations,
  currentUser,
  onSendMessage,
  onSelectUser,
}) => {
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");

  const activeConv = conversations.find((c) => c.id === activeConvId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId) return;
    onSendMessage(activeConvId, inputText);
    setInputText("");
  };

  // If in a specific conversation room
  if (activeConv) {
    return (
      <div className="w-full h-[calc(100vh-112px)] min-h-[580px] bg-[#0A0512] flex flex-col">
        {/* Header */}
        <div className="p-3 bg-[#100720] border-b border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveConvId(null)}
              className="p-1 rounded-full text-purple-300 hover:text-white hover:bg-purple-900/40 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => onSelectUser(activeConv.participant.id)}
            >
              <div className="relative">
                <img
                  src={activeConv.participant.avatarUrl}
                  alt={activeConv.participant.username}
                  className="w-8 h-8 rounded-full object-cover border border-purple-400"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#0A0512]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">
                  {activeConv.participant.displayName}
                </span>
                <span className="text-[10px] text-purple-300/60 font-mono">
                  @{activeConv.participant.username} • Active now
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/30">
              Firebase Synced
            </span>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
          {activeConv.messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[78%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                    isMe
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-tr-none shadow-[0_0_12px_rgba(168,85,247,0.3)]"
                      : "bg-[#1C0E34] text-purple-100 rounded-tl-none border border-purple-500/20"
                  }`}
                >
                  {msg.text}
                </div>
                <div className="flex items-center gap-1 mt-0.5 text-[9px] text-purple-400/50">
                  <span>{msg.timestamp}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-cyan-400" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Input */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-[#100720] border-t border-purple-500/20 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message @${activeConv.participant.username}...`}
            className="flex-1 bg-[#1A0B2E] border border-purple-500/30 rounded-full px-4 py-2 text-xs text-white placeholder-purple-400/50 focus:outline-none focus:border-pink-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white disabled:opacity-40 transition-opacity cursor-pointer shadow-[0_0_10px_#EC4899]"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    );
  }

  // Conversation Inbox List
  return (
    <div className="w-full h-[calc(100vh-112px)] min-h-[580px] bg-[#0A0512] flex flex-col">
      {/* Inbox Header */}
      <div className="p-3.5 bg-[#100720] border-b border-purple-500/20 flex items-center justify-between">
        <h2 className="text-base font-bold text-white tracking-wide">Direct Messages</h2>
        <span className="text-[10px] font-mono text-purple-300/80 bg-purple-900/40 px-2 py-0.5 rounded-full border border-purple-500/30">
          Cloud Firestore Chat
        </span>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto divide-y divide-purple-500/10 custom-scrollbar">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => setActiveConvId(conv.id)}
            className="p-3 flex items-center justify-between gap-3 hover:bg-[#150928] cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={conv.participant.avatarUrl}
                  alt={conv.participant.username}
                  className="w-12 h-12 rounded-full object-cover border border-purple-500/40"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0A0512]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">
                    {conv.participant.displayName}
                  </span>
                  {conv.participant.isVerified && (
                    <span className="text-[10px] text-cyan-400">✓</span>
                  )}
                </div>
                <p className="text-[11px] text-purple-300/70 truncate max-w-[190px] mt-0.5">
                  {conv.lastMessage}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] text-purple-400/50">{conv.lastMessageTimestamp}</span>
              {conv.unreadCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-pink-500 text-[10px] font-black text-black flex items-center justify-center shadow-[0_0_8px_#EC4899]">
                  {conv.unreadCount}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
