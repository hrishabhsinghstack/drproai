import { NextRequest, NextResponse } from 'next/server'
import { genAI, GEMINI_MODEL } from '@/lib/gemini/client'
import { buildSystemPrompt } from '@/lib/gemini/system-prompt'
import { PatientProfile } from '@/types/profile'
import { FeatureMode } from '@/types/chat'

const encoder = new TextEncoder()
function sse(data: object): Uint8Array {
  return encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
}

const DEFAULT_PROMPTS: Partial<Record<FeatureMode, string>> = {
  lab_report:
    'Please analyze this lab report. For each test result, explain the value, whether it is normal or abnormal, and what it means in plain language. Be thorough and structured.',
  prescription:
    'Please analyze this prescription. List each medication with its generic name, what it treats, dosage, key side effects, and important instructions. Also check for any allergy concerns.',
  medicine_id:
    'Please identify this medicine. Tell me: its name (generic and brand), what it is used for, standard dosage, common side effects, and important warnings.',
  skin_analysis:
    'Please analyze this skin condition photo. Describe what you observe and suggest what it could be, along with self-care advice. Recommend if a doctor visit is needed.',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      base64,
      mimeType,
      userPrompt,
      profile,
      featureMode,
    }: {
      base64: string
      mimeType: string
      userPrompt?: string
      profile: PatientProfile | null
      featureMode: FeatureMode
    } = body

    if (!base64 || !mimeType) {
      return NextResponse.json({ error: 'base64 and mimeType are required' }, { status: 400 })
    }

    const systemPrompt = buildSystemPrompt(profile, featureMode)

    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: systemPrompt,
    })

    const textPart = userPrompt || DEFAULT_PROMPTS[featureMode] || 'Please analyze this file.'

    const result = await model.generateContentStream([
      textPart,
      { inlineData: { data: base64, mimeType } },
    ])

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text()
            if (text) controller.enqueue(sse({ type: 'text_delta', delta: text }))
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
