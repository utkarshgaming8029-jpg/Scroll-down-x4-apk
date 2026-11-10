package com.scrolldown.social.data

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.util.concurrent.TimeUnit

class GeminiService(private val apiEndpoint: String = "https://scrolldown.social/api/gemini") {
    private val client = OkHttpClient.Builder()
        .connectTimeout(60, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .build()

    // 1. Gemini Nano Banana 2.1: Image Generation & Editing
    suspend fun generateOrEditImage(
        prompt: String,
        aspectRatio: String = "1:1",
        imageSize: String = "1K",
        base64Image: String? = null
    ): Result<String> = withContext(Dispatchers.IO) {
        runCatching {
            val jsonBody = JSONObject().apply {
                put("prompt", prompt)
                put("aspectRatio", aspectRatio)
                put("imageSize", imageSize)
                if (base64Image != null) {
                    put("base64Image", base64Image)
                }
            }
            val requestBody = jsonBody.toString().toRequestBody("application/json".toMediaType())
            val request = Request.Builder()
                .url("$apiEndpoint/generate-image")
                .post(requestBody)
                .build()

            val response = client.newCall(request).execute()
            val responseString = response.body?.string() ?: error("Empty response")
            val jsonResponse = JSONObject(responseString)

            if (jsonResponse.has("imageUrl")) {
                jsonResponse.getString("imageUrl")
            } else {
                error(jsonResponse.optString("error", "Failed to generate image"))
            }
        }
    }

    // 2. Gemini 4 Argon: Multimodal Image Understanding & Analysis
    suspend fun analyzeImageWithArgon(
        base64Image: String,
        customPrompt: String? = null
    ): Result<String> = withContext(Dispatchers.IO) {
        runCatching {
            val jsonBody = JSONObject().apply {
                put("base64Image", base64Image)
                if (customPrompt != null) {
                    put("prompt", customPrompt)
                }
            }
            val requestBody = jsonBody.toString().toRequestBody("application/json".toMediaType())
            val request = Request.Builder()
                .url("$apiEndpoint/analyze-image")
                .post(requestBody)
                .build()

            val response = client.newCall(request).execute()
            val responseString = response.body?.string() ?: error("Empty response")
            val jsonResponse = JSONObject(responseString)

            if (jsonResponse.has("analysis")) {
                jsonResponse.getString("analysis")
            } else {
                error(jsonResponse.optString("error", "Analysis failed"))
            }
        }
    }
}
