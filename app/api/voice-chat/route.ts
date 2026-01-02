import { GoogleGenerativeAI } from "@google/generative-ai" // Import the direct Google Generative AI client
import { type NextRequest, NextResponse } from "next/server"

// Voice-specific fallback responses
const voiceFallbackResponses = {
  en: "I'm sorry, I couldn't process your request right now. Please try again.",
  hi: "माफ करें, मैं अभी आपके अनुरोध को संसाधित नहीं कर सका। कृपया पुनः प्रयास करें।",
  mr: "माफ करा, मी आत्ता तुमची विनंती प्रक्रिया करू शकलो नाही. कृपया पुन्हा प्रयत्न करा。",
  ta: "மன்னிக்கவும், உங்கள் கோரிக்கையை இப்போது செயலாக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்。",
  te: "క్షమించండి, మీ అభ్యర్థనను ఇప్పుడు ప్రాసెస్ చేయలేకపోయాను. దయచేasi మళ్లీ ప్రయత్నించండి。",
}

function getVoiceFallbackResponse(language = "en") {
  return voiceFallbackResponses[language] || voiceFallbackResponses.en
}

const languageInstructions = {
  en: "Respond in clear, simple English suitable for voice interaction. Keep responses under 80 words.",
  hi: "हिंदी में स्पष्ट और सरल भाषा में उत्तर दें जो आवाज़ की बातचीत के लिए उपयुक्त है। 80 शब्दों से कम में जवाब दें।",
  mr: "मराठीत स्पष्ट आणि सोप्या भाषेत उत्तर द्या जे आवाजाच्या संवादासाठी योग्य आहे। 80 शब्दांपेक्षा कमी उत्तर द्या。",
  ta: "தெளிவான மற்றும் எளிய தமிழில் குரல் உரையாடலுக்கு ஏற்ற வகையில் பதிலளிக்கவும். 80 வார்த்தைகளுக்குள் பதிலளிக்கவும்。",
  te: "స్పష్టమైన మరియు సరళమైన తెలుగులో వాయిస్ సంభాషణకు అనుకూలంగా సమాధానం ఇవ్వండి. 80 పదాలలోపు సమాధానం ఇవ్వండి।",
}

export async function POST(req: NextRequest) {
  let requestBody: { message?: string; language?: string } = {}
  try {
    requestBody = await req.json()
    const { message, language = "en" } = requestBody

    const GOOGLE_AI_STUDIO_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY

    console.log("Voice Chat API received request:")
    console.log("  Message:", message ? message.substring(0, 50) + "..." : "N/A")
    console.log("  Language:", language)
    console.log(
      "  Using Google AI Studio API Key (first 5 chars):",
      GOOGLE_AI_STUDIO_API_KEY ? GOOGLE_AI_STUDIO_API_KEY.substring(0, 5) + "..." : "Not set",
    )

    if (!GOOGLE_AI_STUDIO_API_KEY) {
      console.error("Voice Chat API: GOOGLE_GENERATIVE_AI_API_KEY is NOT set.")
      throw new Error("Google AI Studio API Key is not configured.")
    }

    if (!message || !message.trim()) {
      console.warn("Voice Chat API: Message is empty or whitespace.")
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Initialize the Google Generative AI client
    const genAI = new GoogleGenerativeAI(GOOGLE_AI_STUDIO_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }) // Changed to gemini-1.5-flash

    // Start a new chat session for each request (history can be managed here if needed)
    const chat = model.startChat({
      history: [], // For single turn voice commands, history can be empty
    })

    const systemPrompt = `You are AgriBot, a voice-enabled agricultural assistant for Indian farmers. 

Provide concise, practical farming advice in a conversational tone suitable for voice interaction. Keep responses under 80 words.

Focus on:
- Crop recommendations and farming techniques
- Soil health and fertilizer guidance
- Pest and disease management
- Weather-related farming advice
- Sustainable agriculture practices

IMPORTANT: ${languageInstructions[language] || languageInstructions.en}

Use simple, clear language that farmers can easily understand through voice interaction. Avoid complex technical terms unless necessary.`

    // Combine system prompt with the user message for the current turn
    const fullPrompt = `${systemPrompt}

User: ${message}`

    console.log("Attempting to call chat.sendMessage with Google Gemini 1.5 Flash model.")
    const result = await chat.sendMessage(fullPrompt) // Send the combined prompt
    console.log("chat.sendMessage successful. Result content:", result.response.text().substring(0, 100) + "...")

    return NextResponse.json({ content: result.response.text() })
  } catch (error) {
    console.error("Voice chat API error caught:", error)
    console.error("Error details (JSON stringified):", JSON.stringify(error, Object.getOwnPropertyNames(error)))

    const currentLanguage = requestBody.language || "en"
    const fallbackResponse = getVoiceFallbackResponse(currentLanguage)

    return NextResponse.json(
      {
        content: fallbackResponse,
        fallback: true,
        debugError: error instanceof Error ? error.message : String(error),
        ...(error && typeof error === "object" && "cause" in error ? { cause: String((error as any).cause) } : {}),
        ...(error && typeof error === "object" && "details" in error
          ? { details: String((error as any).details) }
          : {}),
      },
      { status: 500 },
    )
  }
}
