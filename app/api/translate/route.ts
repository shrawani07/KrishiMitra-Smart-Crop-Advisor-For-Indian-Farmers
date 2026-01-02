import { google } from "@ai-sdk/google"
import { generateText } from "ai"
import { NextResponse } from "next/server"

// Simple translation dictionary for basic agricultural terms
const basicTranslations = {
  en: {
    hi: {
      crop: "फसल",
      soil: "मिट्टी",
      disease: "रोग",
      fertilizer: "उर्वरक",
      irrigation: "सिंचाई",
      harvest: "फसल",
      seed: "बीज",
      plant: "पौधा",
      farm: "खेत",
      farmer: "किसान",
    },
    mr: {
      crop: "पीक",
      soil: "माती",
      disease: "रोग",
      fertilizer: "खत",
      irrigation: "पाणी पुरवठा",
      harvest: "कापणी",
      seed: "बियाणे",
      plant: "वनस्पती",
      farm: "शेत",
      farmer: "शेतकरी",
    },
    ta: {
      crop: "பயிர்",
      soil: "மண்",
      disease: "நோய்",
      fertilizer: "உரம்",
      irrigation: "நீர்ப்பாசனம்",
      harvest: "அறுவடை",
      seed: "விதை",
      plant: "தாவரம்",
      farm: "பண்ணை",
      farmer: "விவசாயி",
    },
    te: {
      crop: "పంట",
      soil: "మట్టి",
      disease: "వ్యాధి",
      fertilizer: "ఎరువులు",
      irrigation: "నీటిపారుదల",
      harvest: "కోత",
      seed: "విత్తనం",
      plant: "మొక్క",
      farm: "వ్యవసాయ క్షేత్రం",
      farmer: "రైతు",
    },
  },
}

function basicTranslate(text: string, targetLanguage: string): string {
  const translations = basicTranslations.en[targetLanguage]
  if (!translations) return text

  let translatedText = text
  Object.entries(translations).forEach(([english, translated]) => {
    const regex = new RegExp(`\\b${english}\\b`, "gi")
    translatedText = translatedText.replace(regex, translated)
  })

  return translatedText
}

export async function POST(req: Request) {
  let requestBody: { text?: string; targetLanguage?: string; context?: string } = {}
  try {
    requestBody = await req.json()
    const { text, targetLanguage, context = "agriculture" } = requestBody

    const GOOGLE_AI_STUDIO_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY

    if (!GOOGLE_AI_STUDIO_API_KEY) {
      console.error("Translation API: GOOGLE_GENERATIVE_AI_API_KEY is not set.")
      throw new Error("Google AI Studio API Key is not configured.")
    }

    const languageNames = {
      en: "English",
      hi: "Hindi (हिंदी)",
      mr: "Marathi (मराठी)",
      ta: "Tamil (தமிழ்)",
      te: "Telugu (తెలుగు)",
    }

    const systemPrompt = `You are a professional translator specializing in agricultural and farming terminology for Indian languages.

Translate the given text to ${languageNames[targetLanguage]} while:
1. Maintaining the original meaning and context
2. Using appropriate agricultural terminology
3. Keeping the tone suitable for farmers
4. Preserving any technical accuracy

Context: ${context}

Only return the translated text, nothing else.`

    const result = await generateText({
      model: google("gemini-1.0-pro", { apiKey: GOOGLE_AI_STUDIO_API_KEY }),
      system: systemPrompt,
      prompt: text,
    })

    return NextResponse.json({ translation: result.text })
  } catch (error) {
    console.error("Translation error:", error)

    // Fallback to basic translation on error
    const basicTranslation = basicTranslate(requestBody.text || "", requestBody.targetLanguage || "en")

    // Return a JSON error response with a 500 status code
    return NextResponse.json(
      {
        translation: basicTranslation,
        error: "Translation service temporarily unavailable. Basic translation provided.",
      },
      { status: 500 },
    )
  }
}
