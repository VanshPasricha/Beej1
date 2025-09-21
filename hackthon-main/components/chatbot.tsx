"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageCircle,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/contexts/language-context"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

const getSpeechLocale = (lang: string) => {
  switch (lang) {
    case "hi":
      return "hi-IN"
    case "ml":
      return "ml-IN"
    case "ta":
      return "ta-IN"
    case "kn":
      return "kn-IN"
    case "gom":
      return "kok-IN"
    case "tcy":
      return "kn-IN" // fallback
    case "en":
    default:
      return "en-US"
  }
}

const getLanguageName = (lang: string) => {
  switch (lang) {
    case "hi":
      return "Hindi"
    case "ml":
      return "Malayalam"
    case "ta":
      return "Tamil"
    case "kn":
      return "Kannada"
    case "gom":
      return "Konkani"
    case "tcy":
      return "Tulu"
    case "en":
    default:
      return "English"
  }
}

/* --- ChatMessage Component --- */
interface ChatMessageProps {
  message: Message
  onSpeak?: (text: string) => void
}

function ChatMessage({ message, onSpeak }: ChatMessageProps) {
  const isUser = message.sender === "user"

  return (
    <div
      className={`flex items-end gap-2 mb-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-green-500 text-white text-sm font-bold">
          🤖
        </div>
      )}

      <div
        className={`max-w-[75%] p-3 rounded-2xl shadow-sm ${
          isUser
            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-sm"
            : "bg-gray-100 text-gray-900 rounded-bl-sm"
        }`}
      >
        <p className="text-sm">{message.text}</p>

        <div className="flex justify-between items-center mt-1 text-[10px] opacity-70">
          <span>
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {message.sender === "bot" && (
            <button
              onClick={() => onSpeak?.(message.text)}
              className="ml-2 hover:opacity-100 opacity-70"
            >
              <Volume2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {isUser && (
        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-orange-500 text-white text-sm font-bold">
          U
        </div>
      )}
    </div>
  )
}

/* --- Chatbot Component --- */
export function Chatbot() {
  const { t } = useTranslation()
  const { lang } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const didMountRef = useRef(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    setMessages([
      {
        id: "1",
        text: t("chatbot.welcome"),
        sender: "bot",
        timestamp: new Date(),
      },
    ])
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = getSpeechLocale(lang)

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputValue(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => setIsListening(false)
      recognitionRef.current.onend = () => setIsListening(false)
    }
  }, [lang])

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true
      return
    }
    const notice: Message = {
      id: `lang-${Date.now()}`,
      text: `${t("language")} set to ${getLanguageName(lang)}.`,
      sender: "bot",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, notice])
  }, [lang])

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      const locale = getSpeechLocale(lang)
      utterance.lang = locale

      const voices = window.speechSynthesis.getVoices()
      const preferredVoice =
        voices.find((voice) => voice.lang === locale) ||
        voices.find((voice) =>
          voice.lang.startsWith(locale.split("-")[0])
        ) ||
        voices.find((voice) => voice.lang === "en-US")
      if (preferredVoice) utterance.voice = preferredVoice

      utterance.rate = 0.9
      utterance.pitch = 1.1
      utterance.volume = 1.0

      speechSynthesis.speak(utterance)
    }
  }

  const getBotResponse = useCallback(
    async (userMessage: string): Promise<string> => {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content: `You are a helpful farming assistant. Always reply in ${getLanguageName(
                  lang
                )} (${getSpeechLocale(
                  lang
                )}). Use simple, clear wording.`,
              },
              { role: "user", content: userMessage },
            ],
            language: lang,
          }),
        })

        if (!response.ok) {
          throw new Error(`Chat API error: ${response.statusText}`)
        }

        const data = await response.json()
        return (
          data.choices?.[0]?.message?.content ??
          "Sorry, I couldn't generate a response."
        )
      } catch (error) {
        console.error("Error fetching from Chat API:", error)
        return "Sorry, I am having trouble responding right now."
      }
    },
    [lang]
  )

  const handleSendMessage = async () => {
    const messageText = inputValue.trim()
    if (!messageText) return
    setInputValue("")

    const userMessage: Message = {
      id: `user-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const botResponse = await getBotResponse(messageText)
      const botMessage: Message = {
        id: `bot-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      speakText(botResponse)
    } catch (error) {
      console.error("Error in handleSendMessage:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSendMessage()
  }

  return (
    <>
      {/* Floating open button */}
      <Button
        onClick={() => {
          setIsOpen(true)
          setIsCollapsed(false)
        }}
        className={`fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg z-50 ${
          isOpen ? "hidden" : "flex"
        }`}
        aria-label="Open AgriBot Assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 max-w-[95vw] h-[500px] flex flex-col shadow-2xl z-50 border-2 border-orange-200 rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-500 to-green-500 text-white relative">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-semibold">{t("chatbot.title")}</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="absolute -top-3 -right-3 bg-white text-red-500 rounded-full p-1 h-8 w-8 shadow-md hover:bg-red-100 border-2 border-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="bg-white/90 rounded-full px-2 py-1">
                <LanguageSwitcher inline />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed((c) => !c)}
                className="text-white hover:bg-white/20"
                aria-label={isCollapsed ? "Expand" : "Collapse"}
              >
                {isCollapsed ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Messages */}
          {!isCollapsed && (
            <ScrollArea className="flex-1 p-4 bg-white/80">
              <div className="space-y-2">
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    onSpeak={speakText}
                  />
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          )}

          {/* Input */}
          <div className="p-3 border-t bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
            <div className="flex gap-2 items-center">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("chatbot.placeholder")}
                className="flex-1 rounded-full"
              />
              <Button
                onClick={isListening ? stopListening : startListening}
                variant="outline"
                size="sm"
                className={`rounded-full ${
                  isListening
                    ? "bg-red-100 border-red-300"
                    : "hover:bg-gray-50"
                }`}
              >
                {isListening ? (
                  <MicOff className="h-4 w-4 text-red-600" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
              <Button
                onClick={handleSendMessage}
                size="sm"
                className="rounded-full bg-orange-600 hover:bg-orange-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  )
}
