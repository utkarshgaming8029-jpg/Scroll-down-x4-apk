import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Server-side Gemini initialization with aistudio-build telemetry header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Status & Configuration endpoint
app.get("/api/status", (_req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: "ok",
    appName: "SCROLL DOWN",
    packageId: "com.scrolldown.social",
    hasGeminiKey: hasKey,
    environment: process.env.NODE_ENV || "development",
  });
});

// 1-Click Direct Download Endpoint for Complete Native Android Project
app.get(["/api/download/android-project.zip", "/download/android-project.zip", "/download"], async (_req, res) => {
  try {
    const fs = await import("fs");
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();

    // Helper to recursively add files from directory
    const addDirectoryToZip = (dirPath: string, zipFolder: any) => {
      if (!fs.existsSync(dirPath)) return;
      const items = fs.readdirSync(dirPath);
      for (const item of items) {
        if (item === "node_modules" || item === ".git" || item === "dist" || item === "build") continue;
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          const subFolder = zipFolder.folder(item);
          addDirectoryToZip(fullPath, subFolder);
        } else {
          const content = fs.readFileSync(fullPath);
          zipFolder.file(item, content);
        }
      }
    };

    // Add android project files
    const androidDir = path.resolve(__dirname, "android");
    if (fs.existsSync(androidDir)) {
      addDirectoryToZip(androidDir, zip);
    }

    // Add GitHub Actions workflow
    const githubDir = path.resolve(__dirname, ".github");
    if (fs.existsSync(githubDir)) {
      const githubFolder = zip.folder(".github");
      addDirectoryToZip(githubDir, githubFolder);
    }

    // Add Root Readme & config
    const readmePath = path.resolve(__dirname, "README.md");
    if (fs.existsSync(readmePath)) {
      zip.file("README.md", fs.readFileSync(readmePath));
    }

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", 'attachment; filename="scrolldown-android-project.zip"');
    res.setHeader("Content-Length", zipBuffer.length);
    res.send(zipBuffer);
  } catch (err: any) {
    console.error("Error generating zip download:", err);
    res.status(500).json({ error: "Failed to generate download zip." });
  }
});

// Gemini Nano Banana 2.1: Image Generation & Editing
app.post("/api/gemini/generate-image", async (req, res) => {
  try {
    const { prompt, aspectRatio = "1:1", imageSize = "1K", base64Image, mimeType = "image/jpeg" } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: "Gemini API key is not configured in Settings > Secrets. Please attach an API key to enable AI generation.",
        requiresKey: true,
      });
    }

    // Model selection: nano banana 2.1 as requested
    const targetModel = "gemini-nano-banana-2.1";

    let parts: any[] = [];
    if (base64Image) {
      // Editing existing image
      parts.push({
        inlineData: {
          data: base64Image.replace(/^data:[^;]+;base64,/, ""),
          mimeType,
        },
      });
      parts.push({
        text: `Edit this image according to: ${prompt}. Maintain high visual quality and dark purple neon aesthetic if suitable.`,
      });
    } else {
      // New image generation
      parts.push({
        text: `${prompt}. High resolution, aesthetic composition, rich colors.`,
      });
    }

    let response;
    try {
      response = await ai.models.generateContent({
        model: targetModel,
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
            imageSize: (imageSize || "1K") as any,
          },
        },
      });
    } catch (primaryErr: any) {
      // Graceful fallback to gemini-3.1-flash-lite-image if nano banana is restricted on current key tier
      console.warn("Primary model error, trying fallback model:", primaryErr.message);
      response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-image",
        contents: { parts },
      });
    }

    let imageUrl: string | null = null;
    let descriptionText = "";

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType ?? "image/png";
        imageUrl = `data:${mime};base64,${part.inlineData.data}`;
      } else if (part.text) {
        descriptionText += part.text;
      }
    }

    if (!imageUrl) {
      return res.status(500).json({
        error: "No image was returned by the model.",
        rawText: descriptionText,
      });
    }

    return res.json({
      imageUrl,
      description: descriptionText || "Generated with Gemini",
      model: targetModel,
    });
  } catch (err: any) {
    console.error("Gemini Image API Error:", err);
    return res.status(500).json({
      error: err.message || "Failed to generate or edit image.",
    });
  }
});

// Gemini 4 Argon: Image Understanding & Analysis
app.post("/api/gemini/analyze-image", async (req, res) => {
  try {
    const { base64Image, mimeType = "image/jpeg", prompt } = req.body;

    if (!base64Image) {
      return res.status(400).json({ error: "base64Image is required for image analysis." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: "Gemini API key is not configured in Settings > Secrets.",
        requiresKey: true,
      });
    }

    const cleanBase64 = base64Image.replace(/^data:[^;]+;base64,/, "");
    const userPrompt = prompt || "Analyze this image for SCROLL DOWN social media. Provide: 1. A short vivid description of key objects, vibe, and aesthetic. 2. Three engaging social media captions with hashtags suitable for a dark purple neon community. 3. Rating of aesthetic quality from 1-10.";

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-4-argon",
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType,
              },
            },
            {
              text: userPrompt,
            },
          ],
        },
      });
    } catch (argonErr: any) {
      console.warn("gemini-4-argon error, falling back to gemini-3.8-flash:", argonErr.message);
      response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType,
              },
            },
            {
              text: userPrompt,
            },
          ],
        },
      });
    }

    const text = response.text || "No analysis generated.";
    return res.json({
      analysis: text,
      model: "gemini-4-argon",
    });
  } catch (err: any) {
    console.error("Gemini Analyze API Error:", err);
    return res.status(500).json({
      error: err.message || "Failed to analyze image.",
    });
  }
});

// Suggest Caption & Hashtags using gemini-3.8-flash
app.post("/api/gemini/suggest-caption", async (req, res) => {
  try {
    const { topic } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: "Gemini API key is not configured.",
        requiresKey: true,
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Generate 3 punchy, creative social media captions and 5 trending hashtags for a post about: "${topic || "late night neon city vibes"}". Keep them trendy, cyber/neon aesthetic, under 25 words each. Format clearly with bullet points.`,
    });

    return res.json({
      caption: response.text || "Vibing in the neon glow ✨ #ScrollDown #NeonLife",
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Mount Vite middleware for dev or serve dist in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SCROLL DOWN server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Error starting server:", err);
});
