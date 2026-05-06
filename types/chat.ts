export type FeatureMode =
  | 'health_qa'
  | 'symptom_checker'
  | 'lab_report'
  | 'medicine_id'
  | 'skin_analysis'
  | 'prescription'
  | 'doctor_finder'
  | 'lab_finder'
  | 'exercise_suggest'
  | 'period_tracker'

export type CardType = 'doctor' | 'lab' | 'exercise' | 'medicine' | 'supplement' | 'symptom_log'

export interface CardPayload {
  type: CardType
  data: unknown[]
}

export interface FileAttachment {
  name: string
  type: string
  previewUrl: string
  base64?: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  attachments?: FileAttachment[]
  cards?: CardPayload[]
  featureMode: FeatureMode
  isStreaming?: boolean
}

export interface ToolCall {
  name: string
  input: Record<string, unknown>
}

export type SSEEvent =
  | { type: 'text_delta'; delta: string }
  | { type: 'tool_use'; name: string; input: Record<string, unknown> }
  | { type: 'end' }
  | { type: 'error'; message: string }
