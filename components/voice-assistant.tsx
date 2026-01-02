"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react"
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

export default function VoiceAssistant() {
  const { language, t } = useLanguage()
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Language codes for speech recognition
  const speechLanguageCodes = {
    en: "en-IN",
    hi: "hi-IN",
    mr: "mr-IN",
    ta: "ta-IN",
    te: "te-IN",
  }

  // Initialize speech recognition and synthesis
  useEffect(() => {
    const initializeSpeech = () => {
      try {
        // Check if speech recognition is supported
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        const speechSynthesis = window.speechSynthesis

        if (!SpeechRecognition) {
          console.warn("Speech Recognition not supported")
          setError("Speech recognition not supported in this browser")
          return
        }

        if (!speechSynthesis) {
          console.warn("Speech Synthesis not supported")
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

          setTranscript(finalTranscript || interimTranscript)

          if (finalTranscript) {
            console.log("Final transcript:", finalTranscript)
            handleVoiceInput(finalTranscript)
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

    // Initialize with a small delay to ensure DOM is ready
    const timer = setTimeout(initializeSpeech, 100)

    return () => {
      clearTimeout(timer)
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [language])

  const handleVoiceInput = useCallback(
    async (text: string) => {
      if (!text.trim()) return

      setIsProcessing(true)
      setError(null)

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

        if (response.ok) {
          const data = await response.json()
          if (data.content) {
            console.log("AI response:", data.content)
            speakText(data.content)
          } else {
            throw new Error("No response content")
          }
        } else {
          throw new Error(`API error: ${response.status}`)
        }
      } catch (error) {
        console.error("Error processing voice input:", error)

        // Fallback response based on language
        const fallbackMessage = getFallbackMessage(language)
        speakText(fallbackMessage)
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
      hi: "माफ करें, मैं अभी आपके अनुरोध को संसाधित नहीं कर सका। कृपया पुनः प्रयास करें या अपना प्रश्न टाइप करें।",
      mr: "माफ करा, मी आत्ता तुमची विनंती प्रक्रिया करू शकलो नाही. कृपया पुन्हा प्रयत्न करा किंवा तुमचा प्रश्न टाइप करा.",
      ta: "மன்னிக்கவும், உங்கள் கோரிக்கையை இப்போது செயலாக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும் அல்லது உங்கள் கேள்வியை தட்டச்சு செய்யவும்.",
      te: "క్షమించండి, మీ అభ్యర్థనను ఇప్పుడు ప్రాసెస్ చేయలేకపోయాను. దయచేసి మళ్లీ ప్రయత్నించండి లేదా మీ ప్రశ్నను టైప్ చేయండి.",
    }
    return messages[lang] || messages.en
  }

  const speakText = useCallback(
    (text: string) => {
      if (!synthRef.current || !text) return

      try {
        // Cancel any ongoing speech
        synthRef.current.cancel()

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = speechLanguageCodes[language] || "en-IN"
        utterance.rate = 0.9
        utterance.pitch = 1
        utterance.volume = 0.8

        // Try to find a voice for the selected language
        const voices = synthRef.current.getVoices()
        const languageVoice = voices.find((voice) =>
          voice.lang.startsWith(speechLanguageCodes[language]?.split("-")[0] || "en"),
        )

        if (languageVoice) {
          utterance.voice = languageVoice
        }

        utterance.onstart = () => {
          console.log("Speech synthesis started")
          setIsSpeaking(true)
        }

        utterance.onend = () => {
          console.log("Speech synthesis ended")
          setIsSpeaking(false)
        }

        utterance.onerror = (event) => {
          console.error("Speech synthesis error:", event)
          setIsSpeaking(false)
          setError("Speech synthesis failed")
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
      setTranscript("")
      setError(null)
      recognitionRef.current.lang = speechLanguageCodes[language] || "en-IN"
      recognitionRef.current.start()

      // Set a timeout to stop listening after 10 seconds
      timeoutRef.current = setTimeout(() => {
        if (recognitionRef.current && isListening) {
          recognitionRef.current.stop()
          setError("Listening timeout. Please try again.")
        }
      }, 10000)
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

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled className="opacity-50 bg-transparent">
          <MicOff className="w-4 h-4" />
          <span className="hidden sm:inline ml-2">{t("voice.not.supported")}</span>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isListening ? "destructive" : "outline"}
        size="sm"
        onClick={isListening ? stopListening : startListening}
        disabled={isProcessing}
        className="flex items-center gap-2"
        title={isListening ? t("voice.stop") : t("voice.speak")}
      >
        {isListening ? (
          <>
            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
            <span className="hidden sm:inline">{t("voice.listening")}</span>
          </>
        ) : isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="hidden sm:inline">{t("voice.processing")}</span>
          </>
        ) : (
          <>
            <Mic className="w-4 h-4" />
            <span className="hidden sm:inline">{t("voice.speak")}</span>
          </>
        )}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={stopSpeaking}
        disabled={!isSpeaking}
        className="flex items-center gap-2 bg-transparent"
        title="Stop speaking"
      >
        {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </Button>

      {transcript && (
        <div className="hidden lg:block max-w-xs">
          <p className="text-xs text-muted-foreground truncate" title={transcript}>
            {transcript}
          </p>
        </div>
      )}

      {error && (
        <div className="hidden lg:block max-w-xs">
          <p className="text-xs text-red-500 truncate" title={error}>
            {error}
          </p>
        </div>
      )}
    </div>
  )
}
