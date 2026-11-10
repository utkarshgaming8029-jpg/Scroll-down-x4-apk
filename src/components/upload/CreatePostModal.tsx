import React, { useState } from "react";
import {
  X,
  Upload,
  Sparkles,
  Wand2,
  Scan,
  Send,
  Image as ImageIcon,
  Film,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { User, Post, Reel } from "../../types";
import {
  generateImageWithGemini,
  analyzeImageWithGemini,
  suggestCaptions,
} from "../../services/geminiService";

interface CreatePostModalProps {
  currentUser: User;
  onClose: () => void;
  onPublishPost: (post: Partial<Post>) => void;
  onPublishReel: (reel: Partial<Reel>) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  currentUser,
  onClose,
  onPublishPost,
  onPublishReel,
}) => {
  // Tabs: "upload" | "gemini-create" | "gemini-analyze"
  const [activeMode, setActiveMode] = useState<"upload" | "gemini-create" | "gemini-analyze">("gemini-create");
  const [mediaType, setMediaType] = useState<"post" | "reel">("post");

  // Media state
  const [mediaUrl, setMediaUrl] = useState<string>(
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&auto=format&fit=crop&q=80"
  );
  const [caption, setCaption] = useState("");
  const [tagsInput, setTagsInput] = useState("#ScrollDown, #DarkPurple, #NeonVibes");
  const [location, setLocation] = useState("Neo Shibuya, Tokyo");

  // Gemini Nano Banana 2.1 Image Generation State
  const [prompt, setPrompt] = useState("A cybernetic neon samurai standing under violet rain in Neo-Tokyo");
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "9:16" | "16:9" | "4:3">("1:1");
  const [imageSize, setImageSize] = useState<"1K" | "2K">("1K");
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  // Gemini 4 Argon Image Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  // Gemini Caption Suggestion
  const [isSuggestingCaption, setIsSuggestingCaption] = useState(false);

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setMediaUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate image using Gemini Nano Banana 2.1
  const handleGenerateImage = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGenError(null);
    try {
      const result = await generateImageWithGemini({
        prompt,
        aspectRatio,
        imageSize,
      });
      setMediaUrl(result.imageUrl);
      if (!caption) {
        setCaption(`✨ Generated with ${result.model}: "${prompt}"`);
      }
    } catch (err: any) {
      setGenError(err.message || "Failed to generate image.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Analyze image using Gemini 4 Argon
  const handleAnalyzeWithArgon = async () => {
    if (!mediaUrl) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeImageWithGemini({
        base64Image: mediaUrl,
        prompt: "Analyze this image for SCROLL DOWN dark purple neon social media. Include aesthetic score, visual breakdown, and 3 viral captions.",
      });
      setAnalysisResult(result.analysis);
    } catch (err: any) {
      setAnalysisResult("Analysis error: " + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Suggest caption with gemini-3.8-flash
  const handleSuggestCaption = async () => {
    setIsSuggestingCaption(true);
    try {
      const suggested = await suggestCaptions(prompt || "neon dark aesthetic vibes");
      setCaption(suggested);
    } catch (err) {
      setCaption("Vibing in the deep purple glow ✨ #ScrollDown");
    } finally {
      setIsSuggestingCaption(false);
    }
  };

  // Publish
  const handlePublish = () => {
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (mediaType === "post") {
      onPublishPost({
        caption,
        mediaUrls: [mediaUrl],
        location,
        tags,
        aiModelUsed: activeMode === "gemini-create" ? "Gemini Nano Banana 2.1" : undefined,
      });
    } else {
      onPublishReel({
        videoUrl: mediaUrl,
        thumbnailUrl: mediaUrl,
        caption,
        tags,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#120724] border border-purple-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.3)] flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-3.5 bg-[#190A33] border-b border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <h2 className="text-sm font-bold text-white tracking-wide">
              Create & Upload • Gemini AI Studio
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-purple-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 bg-[#0D0714] border-b border-purple-500/20 text-xs font-semibold">
          <button
            onClick={() => setActiveMode("gemini-create")}
            className={`py-2.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeMode === "gemini-create"
                ? "bg-purple-900/40 text-pink-400 border-b-2 border-pink-500"
                : "text-purple-300/70 hover:text-white"
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Nano Banana 2.1</span>
          </button>

          <button
            onClick={() => setActiveMode("gemini-analyze")}
            className={`py-2.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeMode === "gemini-analyze"
                ? "bg-purple-900/40 text-cyan-400 border-b-2 border-cyan-400"
                : "text-purple-300/70 hover:text-white"
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>Gemini 4 Argon</span>
          </button>

          <button
            onClick={() => setActiveMode("upload")}
            className={`py-2.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeMode === "upload"
                ? "bg-purple-900/40 text-purple-300 border-b-2 border-purple-500"
                : "text-purple-300/70 hover:text-white"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Device</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
          {/* Mode 1: Gemini Nano Banana 2.1 Image Studio */}
          {activeMode === "gemini-create" && (
            <div className="flex flex-col gap-3 p-3.5 rounded-2xl bg-[#1A0B2E] border border-purple-500/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Model: gemini-nano-banana-2.1
                </span>
                <span className="text-[10px] text-purple-400/80 font-mono">
                  Text-to-Image & AI Editing
                </span>
              </div>

              {/* Text Prompt */}
              <div>
                <label className="text-[11px] font-medium text-purple-200">Creation Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your dark purple neon vision..."
                  rows={2}
                  className="w-full mt-1 bg-[#0D0714] border border-purple-500/30 rounded-xl p-2.5 text-xs text-white placeholder-purple-400/40 focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* Aspect Ratio & Resolution Config */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-purple-300/80">Aspect Ratio</label>
                  <select
                    value={aspectRatio}
                    onChange={(e: any) => setAspectRatio(e.target.value)}
                    className="w-full mt-1 bg-[#0D0714] border border-purple-500/30 rounded-lg p-1.5 text-xs text-purple-200"
                  >
                    <option value="1:1">1:1 Square (Post)</option>
                    <option value="9:16">9:16 Vertical (Reel / Story)</option>
                    <option value="16:9">16:9 Landscape</option>
                    <option value="4:3">4:3 Portrait</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-purple-300/80">Quality Resolution</label>
                  <select
                    value={imageSize}
                    onChange={(e: any) => setImageSize(e.target.value)}
                    className="w-full mt-1 bg-[#0D0714] border border-purple-500/30 rounded-lg p-1.5 text-xs text-purple-200"
                  >
                    <option value="1K">1K High Definition</option>
                    <option value="2K">2K Ultra Definition</option>
                  </select>
                </div>
              </div>

              {genError && (
                <div className="p-2 rounded-lg bg-pink-950/60 border border-pink-500/40 text-[11px] text-pink-300 flex items-start gap-1.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-pink-400 mt-0.5" />
                  <span>{genError}</span>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerateImage}
                disabled={isGenerating || !prompt.trim()}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(236,72,153,0.5)] disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Synthesizing with Gemini Nano Banana 2.1...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Image (gemini-nano-banana-2.1)</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Mode 2: Gemini 4 Argon Multimodal Image Analysis */}
          {activeMode === "gemini-analyze" && (
            <div className="flex flex-col gap-3 p-3.5 rounded-2xl bg-[#1A0B2E] border border-purple-500/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1">
                  <Scan className="w-3.5 h-3.5" />
                  Model: gemini-4-argon
                </span>
                <span className="text-[10px] text-purple-400/80 font-mono">
                  Image Understanding & Analysis
                </span>
              </div>

              <p className="text-[11px] text-purple-200/80 leading-relaxed">
                Upload or select an image to have <strong>gemini-4-argon</strong> analyze its visual
                elements, calculate aesthetic harmony with SCROLL DOWN's neon branding, and generate
                viral captions.
              </p>

              <button
                onClick={handleAnalyzeWithArgon}
                disabled={isAnalyzing || !mediaUrl}
                className="py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 text-white text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing with Gemini 4 Argon...</span>
                  </>
                ) : (
                  <>
                    <Scan className="w-3.5 h-3.5" />
                    <span>Analyze Image (gemini-4-argon)</span>
                  </>
                )}
              </button>

              {analysisResult && (
                <div className="p-3 rounded-xl bg-[#0D0714] border border-cyan-500/30 text-xs text-slate-200 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                  {analysisResult}
                </div>
              )}
            </div>
          )}

          {/* Mode 3: Local File Upload */}
          {activeMode === "upload" && (
            <div className="p-4 rounded-2xl bg-[#1A0B2E] border border-purple-500/30 flex flex-col items-center justify-center text-center gap-2">
              <Upload className="w-8 h-8 text-purple-400" />
              <span className="text-xs font-bold text-white">Choose a photo or video</span>
              <span className="text-[10px] text-purple-300/60">Supports PNG, JPG, MP4, WEBM</span>
              <label className="mt-2 px-4 py-1.5 rounded-full bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500 transition-colors cursor-pointer shadow-[0_0_10px_#A855F7]">
                Browse Files
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Media Preview Container */}
          <div className="relative w-full aspect-video rounded-2xl bg-black overflow-hidden border border-purple-500/40">
            <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-purple-500/30 text-[10px] text-purple-200 font-mono">
              Ready to publish
            </div>
          </div>

          {/* Destination Selector: Post or Reel */}
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="text-purple-300/80">Format:</span>
            <label className="flex items-center gap-1.5 text-white cursor-pointer">
              <input
                type="radio"
                name="mediaType"
                checked={mediaType === "post"}
                onChange={() => setMediaType("post")}
                className="accent-pink-500"
              />
              <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
              <span>Feed Post</span>
            </label>
            <label className="flex items-center gap-1.5 text-white cursor-pointer">
              <input
                type="radio"
                name="mediaType"
                checked={mediaType === "reel"}
                onChange={() => setMediaType("reel")}
                className="accent-pink-500"
              />
              <Film className="w-3.5 h-3.5 text-pink-400" />
              <span>Reel (Short Video)</span>
            </label>
          </div>

          {/* Caption Input with Gemini Suggestion */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-purple-200">Caption</label>
              <button
                type="button"
                onClick={handleSuggestCaption}
                disabled={isSuggestingCaption}
                className="text-[10px] text-pink-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>{isSuggestingCaption ? "Generating..." : "Suggest with Gemini"}</span>
              </button>
            </div>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption... #ScrollDown"
              rows={2}
              className="w-full bg-[#1A0B2E] border border-purple-500/30 rounded-xl p-2.5 text-xs text-white placeholder-purple-400/40 focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* Tags & Location */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[10px] text-purple-300/80">Tags (comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full mt-1 bg-[#1A0B2E] border border-purple-500/30 rounded-lg p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-purple-300/80">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full mt-1 bg-[#1A0B2E] border border-purple-500/30 rounded-lg p-2 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Modal Bottom Publish Action */}
        <div className="p-3 bg-[#190A33] border-t border-purple-500/20 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full text-xs font-semibold text-purple-300 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handlePublish}
            disabled={!mediaUrl}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white text-xs font-bold shadow-[0_0_15px_#EC4899] disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish {mediaType === "post" ? "Post" : "Reel"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
