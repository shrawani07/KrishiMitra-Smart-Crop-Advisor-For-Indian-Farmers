import { google } from "@ai-sdk/google"
import { streamText } from "ai"
import { type NextRequest, NextResponse } from "next/server"
import { StreamingTextResponse } from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

const languageInstructions = {
  en: "Respond in English.",
  hi: "हिंदी में उत्तर दें। कृषि और खेती की शब्दावली का उपयोग करें।",
  mr: "मराठीत उत्तर द्या. शेती आणि कृषी संज्ञा वापरा.",
  ta: "தமிழில் பதிலளிக்கவும். விவசாயம் மற்றும் வேளாண்மை சொற்களைப் பயன்படுத்தவும்.",
  te: "తెలుగులో సమాధానం ఇవ్వండి. వ్యవసాయం మరియు కృషి పదాలను ఉపయోగించండి।",
}

const fallbackResponses = {
  en: {
    general:
      "Sorry, I'm having trouble connecting to the AI model right now. Please ensure your API key is correct and try again.",
  },
  hi: {
    general: "क्षमा करें, मुझे अभी AI मॉडल से जुड़ने में समस्या हो रही है। कृपया सुनिश्चित करें कि आपकी API कुंजी सही है और पुनः प्रयास करें।",
  },
  mr: {
    general:
      "माफ करा, मला सध्या AI मॉडेलशी कनेक्ट करण्यात समस्या येत आहे. कृपया तुमची API की योग्य असल्याची खात्री करा आणि पुन्हा प्रयत्न करा。",
  },
  ta: {
    general:
      "மன்னிக்கவும், AI மாதிரியுடன் இணைப்பதில் எனக்கு தற்போது சிக்கல் உள்ளது. உங்கள் API விசை சரியாக உள்ளதா என்பதை உறுதிசெய்து மீண்டும் முயற்சிக்கவும்。",
  },
  te: {
    general: "క్షమించండి, AI మోడల్‌కు కనెక్ట్ చేయడంలో నాకు ప్రస్తుతం సమస్య ఉంది. దయచేసి మీ API కీ సరైనదని నిర్ధారించుకుని మళ్ళీ ప్రయత్నించండి।",
  },
}

export async function POST(req: NextRequest) {
  let requestBody: { messages?: any[]; language?: string } = {}
  try {
    requestBody = await req.json()
    const { messages, language = "en" } = requestBody

    const GOOGLE_AI_STUDIO_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY

    console.log("Chat API: Request received.")
    console.log("Chat API: Language:", language)
    console.log("Chat API: Messages count:", messages?.length)
    console.log(
      "Chat API: Using Google AI Studio API Key (first 5 chars):",
      GOOGLE_AI_STUDIO_API_KEY ? GOOGLE_AI_STUDIO_API_KEY.substring(0, 5) + "..." : "Not set",
    )

    if (!GOOGLE_AI_STUDIO_API_KEY) {
      console.error(
        "Chat API Error: GOOGLE_GENERATIVE_AI_API_KEY is NOT set. Please configure it in your .env.local file or environment variables.",
      )
      throw new Error("Google AI Studio API Key is not configured.")
    }

    if (!messages || messages.length === 0) {
      console.warn("Chat API Warning: No messages provided in the request. Returning 400.")
      return NextResponse.json({ error: "No messages provided" }, { status: 400 })
    }

    const systemPrompt = `You are AgriBot, an intelligent agricultural assistant designed to help farmers with:

1. Crop management and farming techniques
2. Soil health and fertilizer recommendations  
3. Pest and disease identification and treatment
4. Weather-related farming advice
5. Sustainable agriculture practices
6. Irrigation and water management
7. Harvest timing and post-harvest handling
8. Market trends and crop pricing guidance

You should provide practical, actionable advice tailored to farming conditions. Always consider:
- Local climate and seasonal factors
- Sustainable and eco-friendly practices
- Cost-effective solutions for small to medium farmers
- Safety precautions when recommending chemicals or treatments

Be conversational, helpful, and encouraging. Use simple language that farmers can easily understand.

IMPORTANT: ${languageInstructions[language] || languageInstructions.en}

Focus on Indian agricultural practices, crops commonly grown in India, and solutions suitable for Indian farmers. Use local examples and references when possible.`

    console.log("Chat API: Attempting to call streamText with Google Gemini 1.5 Flash model.")
    const result = await streamText({
      model: google("gemini-2.5-flash"), // ✅ no apiKey here
      system: systemPrompt,
      messages,
    })
    console.log("Chat API: streamText call successful. Returning AIStreamResponse.")

    return new StreamingTextResponse(result.toDataStream())
  } catch (error) {
    console.error("Chat API Error: An unexpected error occurred during processing.", error)
    console.error(
      "Chat API Error Details (JSON stringified):",
      JSON.stringify(error, Object.getOwnPropertyNames(error)),
    )

    const currentLanguage = requestBody.language || "en"
    const errorMessage = fallbackResponses[currentLanguage]?.general || fallbackResponses.en.general

    // Return a streaming error response with a fallback message
    return new Response(
      new ReadableStream({
        start(controller) {
          // Send a JSON-formatted error message as a stream chunk
          controller.enqueue(`data: ${JSON.stringify({ content: errorMessage, error: true })}\n\n`)
          controller.close()
        },
      }),
      {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
        status: 500, // Indicate server error
      },
    )
  }
}
