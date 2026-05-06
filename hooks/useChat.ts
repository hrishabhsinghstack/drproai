'use client'
import { useCallback } from 'react'
import { nanoid } from 'nanoid'
import { useChatStore } from '@/store/chat-store'
import { useReminderStore } from '@/store/reminder-store'
import { useProfileContext } from '@/contexts/ProfileContext'
import { Message, FeatureMode, SSEEvent, CardPayload } from '@/types/chat'
import { Reminder } from '@/types/reminder'
import { doctorService } from '@/lib/services/doctor-service'
import { labService } from '@/lib/services/lab-service'
import { exerciseService } from '@/lib/services/exercise-service'
import { supplementService } from '@/lib/services/supplement-service'
import { symptomStorage } from '@/lib/storage/symptom-storage'
import { detectEmergency } from '@/lib/emergency/emergency-detector'

export function useChat(featureMode: FeatureMode) {
  const { messages, addMessage, appendDelta, finalizeMessage, appendCards, setStreaming, setEmergency, isStreaming } =
    useChatStore()
  const { add: addReminder } = useReminderStore()
  const { profile } = useProfileContext()

  const dispatchTool = useCallback(
    async (name: string, input: Record<string, unknown>, assistantId: string) => {
      const cards: CardPayload[] = []

      if (name === 'show_doctors') {
        const doctors = await doctorService.getDoctors({
          specialty: input.specialty as string,
          online_only: input.online_only as boolean | undefined,
          max_fee: input.max_fee as number | undefined,
        })
        cards.push({ type: 'doctor', data: doctors })
      } else if (name === 'show_labs') {
        const labs = await labService.getLabs({
          test_name: input.test_name as string | undefined,
          home_collection: input.home_collection as boolean | undefined,
        })
        cards.push({ type: 'lab', data: labs })
      } else if (name === 'show_exercises') {
        const exercises = await exerciseService.getExercises(
          input.condition as Parameters<typeof exerciseService.getExercises>[0]
        )
        cards.push({ type: 'exercise', data: exercises })
      } else if (name === 'show_supplements') {
        const supplements = await supplementService.getSupplements(input.condition as string)
        cards.push({ type: 'supplement', data: supplements })
      } else if (name === 'log_symptom') {
        symptomStorage.append({
          symptoms: (input.symptoms as string[]) ?? [],
          severity: (input.severity as 1 | 2 | 3 | 4 | 5) ?? 3,
          duration: (input.duration as string) ?? 'Not specified',
          notes: '',
          gemini_assessment: (input.gemini_assessment as string) ?? '',
        })
      } else if (name === 'set_reminder') {
        const reminder: Reminder = {
          id: nanoid(),
          type: (input.type as Reminder['type']) ?? 'custom',
          title: input.title as string,
          description: (input.description as string) ?? '',
          time: input.time as string,
          days: (input.days as Reminder['days']) ?? ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
          date: null,
          is_active: true,
          created_at: new Date().toISOString(),
          last_triggered: null,
        }
        addReminder(reminder)
      }

      if (cards.length > 0) {
        appendCards(assistantId, cards)
      }
    },
    [appendCards, addReminder]
  )

  const sendMessage = useCallback(
    async (text: string) => {
      if (isStreaming || !text.trim()) return

      // Check for emergency in user message
      if (detectEmergency(text)) setEmergency(true)

      const userMsg: Message = {
        id: nanoid(),
        role: 'user',
        content: text,
        timestamp: new Date().toISOString(),
        featureMode,
      }
      addMessage(userMsg)

      const assistantId = nanoid()
      const assistantMsg: Message = {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        featureMode,
        isStreaming: true,
      }
      addMessage(assistantMsg)
      setStreaming(true)

      try {
        const allMessages = [...useChatStore.getState().messages.filter((m) => !m.isStreaming)]
        // Remove the empty assistant we just added from history
        const historyMessages = allMessages.slice(0, -1)

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...historyMessages.slice(-20), userMsg],
            profile,
            featureMode,
          }),
        })

        if (!res.ok || !res.body) throw new Error(`API error: ${res.status}`)

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })

          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const raw = line.slice(6).trim()
            if (!raw) continue

            try {
              const event: SSEEvent = JSON.parse(raw)

              if (event.type === 'text_delta') {
                appendDelta(assistantId, event.delta)
                // Check AI response for emergency too
                if (detectEmergency(event.delta)) setEmergency(true)
              } else if (event.type === 'tool_use') {
                await dispatchTool(event.name, event.input, assistantId)
              } else if (event.type === 'end') {
                break
              } else if (event.type === 'error') {
                appendDelta(assistantId, `\n\n*Error: ${event.message}*`)
              }
            } catch {
              // Skip malformed SSE lines
            }
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Something went wrong'
        appendDelta(assistantId, `Sorry, I encountered an error: ${msg}. Please try again.`)
      } finally {
        finalizeMessage(assistantId)
        setStreaming(false)
      }
    },
    [isStreaming, featureMode, profile, addMessage, appendDelta, appendCards, finalizeMessage, setStreaming, setEmergency, dispatchTool]
  )

  const sendFile = useCallback(
    async (base64: string, mimeType: string, fileName: string, previewUrl: string, userPrompt?: string) => {
      if (isStreaming) return

      const userMsg: Message = {
        id: nanoid(),
        role: 'user',
        content: userPrompt || `Uploaded: ${fileName}`,
        timestamp: new Date().toISOString(),
        featureMode,
        attachments: [{ name: fileName, type: mimeType, previewUrl }],
      }
      addMessage(userMsg)

      const assistantId = nanoid()
      addMessage({
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        featureMode,
        isStreaming: true,
      })
      setStreaming(true)

      try {
        const res = await fetch('/api/analyze-file', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64, mimeType, userPrompt, profile, featureMode }),
        })

        if (!res.ok || !res.body) throw new Error(`API error: ${res.status}`)

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const raw = line.slice(6).trim()
            if (!raw) continue
            try {
              const event: SSEEvent = JSON.parse(raw)
              if (event.type === 'text_delta') appendDelta(assistantId, event.delta)
              else if (event.type === 'end') break
              else if (event.type === 'error') appendDelta(assistantId, `\n\n*Error: ${event.message}*`)
            } catch { /* skip */ }
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Something went wrong'
        appendDelta(assistantId, `Sorry, I could not analyze the file: ${msg}`)
      } finally {
        finalizeMessage(assistantId)
        setStreaming(false)
      }
    },
    [isStreaming, featureMode, profile, addMessage, appendDelta, finalizeMessage, setStreaming]
  )

  return { messages, isStreaming, sendMessage, sendFile }
}
