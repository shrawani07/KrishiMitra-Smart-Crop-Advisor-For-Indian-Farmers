"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Send, Bot, User, Loader2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useChat } from "@ai-sdk/react"

export default function ChatInterface() {
  const { t, language } = useLanguage()
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    body: { language },
    initialMessages: [
      {
        id: "initial-welcome",
        role: "assistant",
        content: t("chat.welcome.subtitle"),
      },
    ],
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(e)
  }

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl shadow-md dark:shadow-green-900/20 transition-all duration-500">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {/* Initial Welcome */}
          {messages.length === 0 && (
            <div className="text-center text-gray-600 dark:text-gray-400 py-8">
              <Bot className="w-12 h-12 mx-auto mb-4 text-green-600 dark:text-green-400" />
              <p className="text-lg font-medium">{t("chat.welcome")}</p>
              <p className="text-sm">{t("chat.welcome.subtitle")}</p>
            </div>
          )}

          {/* Message List */}
          {messages.map((message) => (
            <Card
              key={message.id}
              className={`p-4 transition-all ${
                message.role === "user"
                  ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-700 ml-8"
                  : "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-700 mr-8"
              }`}
            >
              <div className="flex items-start gap-3">
                {message.role === "user" ? (
                  <User className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
                ) : (
                  <Bot className="w-6 h-6 text-green-600 dark:text-green-400 mt-1" />
                )}
                <div className="flex-1">
                  <p className="font-medium text-sm mb-1 text-gray-800 dark:text-gray-200">
                    {message.role === "user" ? t("chat.you") : t("chat.agribot")}
                  </p>
                  <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Loading State */}
          {isLoading && (
            <Card className="p-4 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-700 mr-8">
              <div className="flex items-start gap-3">
                <Bot className="w-6 h-6 text-green-600 dark:text-green-400 mt-1" />
                <div className="flex-1">
                  <p className="font-medium text-sm mb-1 text-gray-800 dark:text-gray-200">
                    {t("chat.agribot")}
                  </p>
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-green-600 dark:text-green-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {t("chat.thinking")}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </ScrollArea>

      {/* Input Section */}
      <form
        onSubmit={onSubmit}
        className="flex gap-2 p-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60"
      >
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder={t("chat.placeholder")}
          className="flex-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white transition-all"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </form>
    </div>
  )
}
