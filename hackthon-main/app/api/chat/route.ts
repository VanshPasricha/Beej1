import { NextRequest, NextResponse } from 'next/server'
import { OPENROUTER } from '@/lib/config'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages = [], model, language } = body || {}

    // If API key is missing, return a friendly mocked response to avoid 500s in local/dev
    if (!OPENROUTER.apiKey) {
      const reply = language
        ? `I'm running in local demo mode without an API key. Here's a sample response in your selected language. If you add OPENROUTER_API_KEY, I'll give real answers.`
        : `I'm running in local demo mode without an API key. Add OPENROUTER_API_KEY to get real answers.`
      return NextResponse.json({
        id: 'mock-chat-1',
        object: 'chat.completion',
        choices: [
          {
            index: 0,
            message: { role: 'assistant', content: reply },
            finish_reason: 'stop',
          },
        ],
        model: model || 'openai/gpt-4o-mini',
      })
    }

    const getSpeechLocale = (lang: string) => {
      switch (lang) {
        case 'hi':
          return 'hi-IN'
        case 'ml':
          return 'ml-IN'
        case 'ta':
          return 'ta-IN'
        case 'kn':
          return 'kn-IN'
        case 'gom': // Konkani
          return 'kok-IN'
        case 'tcy': // Tulu (fallback)
          return 'kn-IN'
        case 'en':
        default:
          return 'en-US'
      }
    }

    const getLanguageName = (lang: string) => {
      switch (lang) {
        case 'hi':
          return 'Hindi'
        case 'ml':
          return 'Malayalam'
        case 'ta':
          return 'Tamil'
        case 'kn':
          return 'Kannada'
        case 'gom':
          return 'Konkani'
        case 'tcy':
          return 'Tulu'
        case 'en':
        default:
          return 'English'
      }
    }

    // Ensure a language-focused system instruction is present
    const systemInstruction = language
      ? [{
          role: 'system',
          content: `You are a helpful farming assistant. Always reply in ${getLanguageName(language)} (${getSpeechLocale(language)}). Use simple, clear wording.`,
        }]
      : [{ role: 'system', content: 'You are a helpful assistant.' }]

    const mergedMessages = Array.isArray(messages) && messages.length > 0
      ? (messages[0]?.role === 'system' ? messages : [...systemInstruction, ...messages])
      : systemInstruction

    const res = await fetch(`${OPENROUTER.apiBase}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER.apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': process.env.NEXT_PUBLIC_APP_NAME || 'BeejSetu',
      },
      body: JSON.stringify({
        model: model || OPENROUTER.defaultModel || 'openai/gpt-4o-mini',
        messages: mergedMessages,
      }),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      const fallback = text && text.length > 0 ? text.slice(0, 600) : res.statusText
      return NextResponse.json({
        id: 'mock-chat-error',
        object: 'chat.completion',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: `I'm having trouble reaching the chat service right now. Here is a friendly fallback response. Error details: ${fallback}`,
            },
            finish_reason: 'stop',
          },
        ],
        model: model || OPENROUTER.defaultModel || 'openai/gpt-4o-mini',
      })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err: any) {
    const fallbackMsg = typeof err?.message === 'string' ? err.message : 'Server error'
    return NextResponse.json({
      id: 'mock-chat-exception',
      object: 'chat.completion',
      choices: [
        {
          index: 0,
          message: { role: 'assistant', content: `Temporary issue: ${fallbackMsg}. Showing a fallback response.` },
          finish_reason: 'stop',
        },
      ],
      model: 'openai/gpt-4o-mini',
    })
  }
}
