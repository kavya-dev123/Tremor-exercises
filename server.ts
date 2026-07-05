import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = 3000;

// Increase payload limits for base64 image uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Initialize Gemini API Client Server-Side
// Setting User-Agent for telemetry, following API instructions strictly
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper: Fetch URL and convert to Base64 (for presets)
async function fetchImageAsBase64(url: string): Promise<{ data: string; mimeType: string }> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image from URL: ${url}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString('base64');
  
  // Try to extract mime type from response content-type
  let mimeType = response.headers.get('content-type') || 'image/jpeg';
  // sanitize
  if (!mimeType.startsWith('image/')) {
    mimeType = 'image/jpeg';
  }
  
  return {
    data: base64,
    mimeType: mimeType
  };
}

// REST Route: Analyze Medicine Label using Gemini 3.5 Flash
app.post("/api/analyze-medicine", async (req, res) => {
  try {
    const { image, nameHint } = req.body;

    if (!image) {
      return res.status(400).json({ error: "Missing image payload" });
    }

    let base64Data = "";
    let mimeType = "image/jpeg";

    if (image.startsWith("http://") || image.startsWith("https://")) {
      // It's a URL (like our presets), fetch it on the server first
      console.log(`[Server] Fetching external preset URL: ${image}`);
      const fetched = await fetchImageAsBase64(image);
      base64Data = fetched.data;
      mimeType = fetched.mimeType;
    } else {
      // It's a data URI or raw base64
      // e.g., "data:image/png;base64,iVBORw0KGgo..."
      const match = image.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        base64Data = match[2];
      } else {
        base64Data = image; // fallback to raw base64
      }
    }

    console.log(`[Server] Querying Gemini 3.5 Flash for image analysis... (Hint: ${nameHint})`);

    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Data,
      },
    };

    const textPart = {
      text: `You are an expert pharmacist and geriatric healthcare assistant. Analyze this prescription or medicine container label image. 
      Identify the medicine name (use "${nameHint}" as a reference if the text is shaky or blurry).
      Extract and structure the following details into the required JSON schema, written in clean, simple, empathetic language suitable for a senior citizen (grandfather) to understand:
      1. Medicine name.
      2. Recommended dosage (e.g., 'Take 1 tablet').
      3. Frequency schedule (e.g., 'Three times daily after meals').
      4. Crucial safety warnings (e.g., 'Do not take with alcohol', 'Causes drowsiness').
      5. Common minor side effects (e.g., 'Dry mouth', 'Mild drowsiness').
      6. A very friendly, simple explanation of what this medicine is normally used for.`
    };

    // Call Gemini with strict responseSchema parameters
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            medicineName: { 
              type: Type.STRING,
              description: "The official commercial name of the medicine" 
            },
            dosage: { 
              type: Type.STRING,
              description: "Precise instructions on how much to consume in one go (e.g., '1 capsule' or '5ml syrup')"
            },
            frequency: { 
              type: Type.STRING,
              description: "When or how often to take it (e.g., 'Once daily after breakfast')"
            },
            warnings: { 
              type: Type.STRING,
              description: "Severe warnings, precautions, or contraindications written clearly"
            },
            sideEffects: { 
              type: Type.STRING,
              description: "Common mild side effects that might occur"
            },
            simpleExplanation: { 
              type: Type.STRING,
              description: "A warm, humble summary of what this medicine does in simple terms"
            },
          },
          required: [
            "medicineName", 
            "dosage", 
            "frequency", 
            "warnings", 
            "sideEffects", 
            "simpleExplanation"
          ],
        },
      },
    });

    const parsedJson = JSON.parse(response.text.trim());
    console.log(`[Server] Successfully analyzed medicine: ${parsedJson.medicineName}`);
    return res.json(parsedJson);

  } catch (err: any) {
    console.error("[Server Error] Failed to analyze medicine label:", err.message);
    return res.status(500).json({ 
      error: "Failed to perform smart OCR on this label.",
      details: err.message
    });
  }
});

// Configure Vite integration based on environment
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode: Mount Vite middleware
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("[Server] Development mode: Vite dev middleware mounted.");
  } else {
    // Production mode: Serve precompiled assets
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("[Server] Production mode: Serving static files from dist/");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] TremorLens running on http://localhost:${PORT}`);
  });
}

setupServer();
