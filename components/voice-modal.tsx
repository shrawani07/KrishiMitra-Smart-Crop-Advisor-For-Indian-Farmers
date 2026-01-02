"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, Volume2, VolumeX, MessageCircle, Loader2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult
  length: number
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative
  isFinal: boolean
  length: number
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onend: ((this: SpeechRecognition, ev: Event) => any) | null
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
  onerror: ((this: SpeechRecognition, ev: Event) => any) | null
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

interface VoiceMessage {
  id: string
  type: "user" | "assistant"
  text: string
  timestamp: Date
  language: string
}

export default function VoiceModal() {
  const { language, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [isListening, setIsListening] = useState(false) // Fixed: Initialize with a boolean value
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [currentTranscript, setCurrentTranscript] = useState("")
  const [messages, setMessages] = useState<VoiceMessage[]>([])
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Language codes for speech recognition
  const speechLanguageCodes: { [key: string]: string } = {
  en: "en-IN",
  hi: "hi-IN",
  mr: "mr-IN",
  ta: "ta-IN",
  te: "te-IN",
  as: "as-IN",
  bn: "bn-IN",
  brx: "brx-IN", // Bodo may not be directly supported, fallback needed
  doi: "doi-IN",
  gu: "gu-IN",
  kn: "kn-IN",
  ks: "ks-IN",
  kok: "kok-IN",
  mai: "mai-IN",
  ml: "ml-IN",
  mni: "mni-IN",
  ne: "ne-IN",
  or: "or-IN",
  pa: "pa-IN",
  sa: "sa-IN",
}


  // Initialize speech recognition and synthesis
  useEffect(() => {
    const initializeSpeech = () => {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        const speechSynthesis = window.speechSynthesis

        if (!SpeechRecognition) {
          setError("Speech recognition not supported in this browser")
          return
        }

        if (!speechSynthesis) {
          setError("Speech synthesis not supported in this browser")
          return
        }

        setIsSupported(true)
        synthRef.current = speechSynthesis

        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = true
        recognition.lang = speechLanguageCodes[language] || "en-IN"

        recognition.onstart = () => {
          console.log("Speech recognition started")
          setIsListening(true)
          setError(null)
          setCurrentTranscript("")
        }

        recognition.onend = () => {
          console.log("Speech recognition ended")
          setIsListening(false)
        }

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = ""
          let interimTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i]
            if (result.isFinal) {
              finalTranscript += result[0].transcript
            } else {
              interimTranscript += result[0].transcript
            }
          }

          const displayTranscript = finalTranscript || interimTranscript
          setCurrentTranscript(displayTranscript)

          if (finalTranscript.trim()) {
            console.log("Final transcript:", finalTranscript)
            handleVoiceInput(finalTranscript.trim())
          }
        }

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
          setIsProcessing(false)

          let errorMessage = "Voice recognition error"
          switch (event.error) {
            case "no-speech":
              errorMessage = "No speech detected. Please try again."
              break
            case "audio-capture":
              errorMessage = "Microphone not accessible. Please check permissions."
              break
            case "not-allowed":
              errorMessage = "Microphone permission denied. Please allow microphone access."
              break
            case "network":
              errorMessage = "Network error. Please check your connection."
              break
            default:
              errorMessage = `Speech recognition error: ${event.error}`
          }

          setError(errorMessage)
        }

        recognitionRef.current = recognition
      } catch (err) {
        console.error("Error initializing speech:", err)
        setError("Failed to initialize speech recognition")
      }
    }

    if (isOpen) {
      const timer = setTimeout(initializeSpeech, 100)
      return () => clearTimeout(timer)
    }
  }, [language, isOpen])

  const handleVoiceInput = useCallback(
    async (text: string) => {
      if (!text.trim()) return

      // Add user message
      const userMessage: VoiceMessage = {
        id: Date.now().toString(),
        type: "user",
        text: text,
        timestamp: new Date(),
        language: language,
      }
      setMessages((prev) => [...prev, userMessage])

      setIsProcessing(true)
      setError(null)
      setCurrentTranscript("")

      try {
        console.log("Processing voice input:", text)

        const response = await fetch("/api/voice-chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: text,
            language: language,
          }),
        })

        if (!response.ok) {
          let errorContent: string
          const contentType = response.headers.get("content-type")
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json()
            errorContent = errorData.error || errorData.debugError || JSON.stringify(errorData)
          } else {
            // If not JSON, read as plain text
            errorContent = await response.text()
          }
          throw new Error(errorContent || "Failed to get response from server.")
        }

        const data = await response.json()
        if (data.content) {
          console.log("AI response:", data.content)

          // Add assistant message
          const assistantMessage: VoiceMessage = {
            id: (Date.now() + 1).toString(),
            type: "assistant",
            text: data.content,
            timestamp: new Date(),
            language: language,
          }
          setMessages((prev) => [...prev, assistantMessage])

          // Speak the response
          speakText(data.content)
        } else {
          throw new Error("No response content")
        }
      } catch (error) {
        console.error("Error processing voice input:", error)
        const fallbackMessage = getFallbackMessage(language)

        const errorMessageText = error instanceof Error ? error.message : fallbackMessage

        const errorMessage: VoiceMessage = {
          id: (Date.now() + 2).toString(),
          type: "assistant",
          text: errorMessageText,
          timestamp: new Date(),
          language: language,
        }
        setMessages((prev) => [...prev, errorMessage])

        speakText(errorMessageText) // Speak the error message or fallback
        setError("Failed to process voice input. Using fallback response.")
      } finally {
        setIsProcessing(false)
      }
    },
    [language],
  )

  const getFallbackMessage = (lang: string): string => {
    const messages = {
      en: "I'm sorry, I couldn't process your request right now. Please try again or type your question.",
      hi: "माफ करें, मैं अभी आपके अनुरोध को संसाधित नहीं कर सका। कृपया पुनः प्रयास करें।",
      mr: "माफ करा, मी आत्ता तुमची विनंती प्रक्रिया करू शकलो नाही. कृपया पुन्हा प्रयत्न करा。",
      ta: "மன்னிக்கவும், உங்கள் கோரிக்கையை இப்போது செயலாக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்。",
      te: "క్షమించండి, మీ అభ్యర్థనను ఇప్పుడు ప్రాసెస్ చేయలేకపోయాను. దయచేసి మళ్లీ ప్రయత్నించండి。",
    }
    return messages[lang] || messages.en
  }

const speakText = useCallback(
  (text: string) => {
    if (!synthRef.current || !text) return

    try {
      synthRef.current.cancel()

      const utterance = new SpeechSynthesisUtterance(text)

      // Force Marathi to fallback to Hindi if no suitable Marathi voice is found
      const effectiveLang = language === "mr" ? "hi-IN" : speechLanguageCodes[language] || "en-IN"
      utterance.lang = effectiveLang

      const voices = synthRef.current.getVoices()

      // Prefer voice for the effective language (fallback to Hindi if needed)
      const preferredVoice =
        voices.find((voice) => voice.lang === effectiveLang) ||
        (language === "mr" && voices.find((voice) => voice.lang.startsWith("hi"))) ||
        voices.find((voice) => voice.lang.startsWith("en"))

      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event.error)
        setError(`Speech synthesis failed: ${event.error}`)
      }

      synthRef.current.speak(utterance)
    } catch (error) {
      console.error("Error in speech synthesis:", error)
      setIsSpeaking(false)
      setError("Failed to speak text")
    }
  },
  [language],
)



  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening || isProcessing) return

    try {
      setCurrentTranscript("")
      setError(null)
      recognitionRef.current.lang = speechLanguageCodes[language] || "en-IN"
      recognitionRef.current.start()

      // Set a timeout to stop listening after 15 seconds
      timeoutRef.current = setTimeout(() => {
        if (recognitionRef.current && isListening) {
          recognitionRef.current.stop()
          setError("Listening timeout. Please try again.")
        }
      }, 15000)
    } catch (error) {
      console.error("Error starting recognition:", error)
      setError("Failed to start voice recognition")
    }
  }, [language, isListening, isProcessing])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [isListening])

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }, [])

  const clearMessages = () => {
    setMessages([])
    setCurrentTranscript("")
    setError(null)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
  <Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2 bg-transparent text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
    >
      <MessageCircle className="w-4 h-4" />
      <span className="hidden sm:inline">{t("voice.title")}</span>
    </Button>
  </DialogTrigger>

  <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300">
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
        <MessageCircle className="w-5 h-5" />
        {t("voice.title2")} {language.toUpperCase()}
      </DialogTitle>
    </DialogHeader>

    <div className="flex-1 flex flex-col overflow-y-auto max-h-screen space-y-4">
      {/* Current Transcript Display */}
      {(isListening || currentTranscript) && (
        <Card className="border border-blue-200 bg-blue-50 dark:bg-blue-900 dark:border-blue-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isListening ? "bg-red-500 animate-pulse" : "bg-gray-400 dark:bg-gray-600"
                }`}
              />
              <span className="text-sm font-medium">
                {isListening ? "Listening..." : "Recognized:"}
              </span>
              <Badge variant="outline" className="text-xs">
                {language.toUpperCase()}
              </Badge>
            </div>
            <p className="text-lg font-medium text-blue-800 dark:text-blue-300">
              {currentTranscript || "Speak now..."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Messages History */}
      <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
        {messages.length === 0 && !isListening && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-green-600 dark:text-green-400" />
            <p className="text-lg font-medium">{t("voice.ready")}</p>
            <p className="text-sm">{t("voice.desc")}</p>
          </div>
        )}

        {messages.map((message) => (
          <Card
            key={message.id}
            className={`${
              message.type === "user"
                ? "bg-blue-50 border border-blue-200 ml-8 dark:bg-blue-900 dark:border-blue-700"
                : "bg-green-50 border border-green-200 mr-8 dark:bg-green-900 dark:border-green-700"
            }`}
          >
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">
                      {message.type === "user" ? "You" : "AgriBot"}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {message.language.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground dark:text-gray-400">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm">{message.text}</p>
                </div>
                {message.type === "assistant" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => speakText(message.text)}
                    className="p-1 h-auto"
                  >
                    <Volume2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {isProcessing && (
          <Card className="bg-green-50 border border-green-200 mr-8 dark:bg-green-900 dark:border-green-700">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-green-600 dark:text-green-400" />
                <span className="text-sm">{t("voice.think")}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border border-red-200 bg-red-50 dark:bg-red-900 dark:border-red-700">
          <CardContent className="p-3">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Button
            variant={isListening ? "destructive" : "default"}
            size="lg"
            onClick={isListening ? stopListening : startListening}
            disabled={!isSupported || isProcessing}
            className="flex items-center gap-2"
          >
            {isListening ? (
              <>
                <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
                {t("voice.stopp")}
              </>
            ) : isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("voice.processing")}
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                {t("voice.start")}
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={stopSpeaking}
            disabled={!isSpeaking}
            className="flex items-center gap-2 bg-transparent text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            {isSpeaking ? "Stop" : "Speak"}
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={clearMessages}
          disabled={messages.length === 0}
          className="text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
        >
          {t("voice.clear")}
        </Button>
      </div>

      {!isSupported && (
        <Card className="border border-yellow-200 bg-yellow-50 dark:bg-yellow-900 dark:border-yellow-700">
          <CardContent className="p-3">
            <p className="text-sm text-yellow-600 dark:text-yellow-400">{t("voice.desc2")}</p>
          </CardContent>
        </Card>
      )}
    </div>
  </DialogContent>
</Dialog>

  )
}
