import { NextRequest, NextResponse } from 'next/server'
import { genAI, GEMINI_MODEL } from '@/lib/gemini/client'
import { buildSystemPrompt } from '@/lib/gemini/system-prompt'
import { TOOL_DECLARATIONS } from '@/lib/gemini/tools'
import { PatientProfile } from '@/types/profile'
import { FeatureMode, Message } from '@/types/chat'
import { Content } from '@google/generative-ai'

const encoder = new TextEncoder()

function sse(data: object): Uint8Array {
  return encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
}

function toGeminiContent(msg: Message): Content {
  return {
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content || '...' }],
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      messages,
      profile,
      featureMode,
    }: { messages: Message[]; profile: PatientProfile | null; featureMode: FeatureMode } = body

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 })
    }

    const systemPrompt = buildSystemPrompt(profile, featureMode)

    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: systemPrompt,
      tools: [{ functionDeclarations: TOOL_DECLARATIONS }],
    })

    // Convert history (all messages except last)
    const history: Content[] = messages.slice(0, -1).map(toGeminiContent)
    const lastMessage = messages[messages.length - 1]

    const chat = model.startChat({ history })

    const stream = await chat.sendMessageStream(lastMessage.content || '...')

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream.stream) {
            // Text delta
            const text = chunk.text()
            if (text) {
              controller.enqueue(sse({ type: 'text_delta', delta: text }))
            }

            // Function calls
            const fnCalls = chunk.functionCalls()
            if (fnCalls && fnCalls.length > 0) {
              for (const call of fnCalls) {
                controller.enqueue(
                  sse({ type: 'tool_use', name: call.name, input: call.args })
                )
              }
            }
          }
          controller.enqueue(sse({ type: 'end' }))
          controller.close()
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Stream error'
          controller.enqueue(sse({ type: 'error', message }))
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'X-Accel-Buffering': 'no',
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
