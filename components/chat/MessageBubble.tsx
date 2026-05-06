'use client'
import { Message } from '@/types/chat'
import { StreamingText } from './StreamingText'
import { TypingIndicator } from './TypingIndicator'
import { DoctorCard } from '@/components/cards/DoctorCard'
import { LabCard } from '@/components/cards/LabCard'
import { ExerciseCard } from '@/components/cards/ExerciseCard'
import { SupplementCard } from '@/components/cards/SupplementCard'
import { Doctor, Lab, Exercise, Supplement } from '@/types/medical'
import { UploadPromptCard } from './UploadPromptCard'
import { FileText, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  message: Message
  onQuickAsk?: (text: string) => void
  onSendFile?: (base64: string, mimeType: string, name: string, previewUrl: string, prompt?: string) => void
}

export function MessageBubble({ message, onQuickAsk, onSendFile }: Props) {
  const isUser = message.role === 'user'

  if (message.isStreaming && !message.content) {
    return <TypingIndicator />
  }

  // Parse follow-ups and upload prompts if present
  let cleanContent = message.content || ''
  let followups: string[] = []
  let uploadPromptType: string | null = null

  if (!isUser) {
    // Parse follow-ups
    const followupMatch = cleanContent.match(/\[FOLLOWUP\](.*?)\[\/FOLLOWUP\]/s)
    if (followupMatch) {
      cleanContent = cleanContent.replace(followupMatch[0], '').trim()
      followups = followupMatch[1].split('|').map((q) => q.trim()).filter(Boolean)
    }

    // Parse upload prompts
    const uploadMatch = cleanContent.match(/\[UPLOAD_PROMPT:\s*(\w+)\]/)
    if (uploadMatch) {
      cleanContent = cleanContent.replace(uploadMatch[0], '').trim()
      uploadPromptType = uploadMatch[1]
    }
  }

  return (
    <div className={cn('flex items-end gap-3 px-4 py-2 group', isUser && 'flex-row-reverse')}>
      {/* Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full overflow-hidden bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0 mb-1">
          <img 
            src="https://api.dicebear.com/7.x/bottts/svg?seed=drpro&backgroundColor=ffffff" 
            alt="DrPro" 
            className="w-6 h-6"
          />
        </div>
      )}

      <div className={cn('flex flex-col gap-2 max-w-[85%] sm:max-w-[75%]', isUser ? 'items-end' : 'items-start')}>
        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.attachments.map((att, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-white dark:bg-card border border-slate-200 rounded-xl px-3 py-2 text-xs shadow-sm"
              >
                {att.type === 'application/pdf' ? (
                  <FileText className="w-4 h-4 text-red-500" />
                ) : att.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={att.previewUrl} alt={att.name} className="w-10 h-10 rounded object-cover" />
                ) : (
                  <ImageIcon className="w-4 h-4 text-[#5048E5]" />
                )}
                <span className="max-w-[120px] truncate text-slate-700 font-medium">{att.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Text bubble */}
        {cleanContent && (
          <div
            className={cn(
              'px-4 py-3 shadow-sm text-[15px] leading-relaxed',
              isUser
                ? 'bg-[#5048E5] text-white rounded-2xl rounded-br-sm'
                : 'bg-white dark:bg-card border border-slate-100 text-slate-800 rounded-2xl rounded-bl-sm'
            )}
          >
            {isUser ? (
              <p>{cleanContent}</p>
            ) : (
              <StreamingText text={cleanContent} isStreaming={message.isStreaming} />
            )}
          </div>
        )}

        {/* Upload Prompt Card */}
        {uploadPromptType && !message.isStreaming && (
          <UploadPromptCard
            type={uploadPromptType as any}
            onUpload={(base64, mime, name, preview) => onSendFile?.(base64, mime, name, preview)}
          />
        )}

        {/* Cards */}
        {message.cards && message.cards.length > 0 && (
          <div className="flex flex-col gap-3 w-full mt-1">
            {message.cards.map((payload, i) => {
              if (payload.type === 'doctor') {
                const doctors = payload.data as Doctor[]
                return (
                  <div key={i} className="flex flex-col gap-3 w-full">
                    {doctors.map((d) => (
                      <DoctorCard key={d.id} doctor={d} />
                    ))}
                    {doctors.length >= 3 && (
                      <button 
                        className="w-full py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-[13px] font-semibold text-[#5048E5] bg-white dark:bg-slate-900/50 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                        onClick={() => window.location.href = '/chat/explore'} // Or a specific search page
                      >
                        See more doctors
                        <span className="text-[16px]">→</span>
                      </button>
                    )}
                  </div>
                )
              }
              if (payload.type === 'lab') {
                return (
                  <div key={i} className="flex flex-col gap-3 w-full">
                    {(payload.data as Lab[]).map((l) => (
                      <LabCard key={l.id} lab={l} />
                    ))}
                  </div>
                )
              }
              if (payload.type === 'exercise') {
                return (
                  <div key={i} className="flex flex-col gap-3 w-full">
                    {(payload.data as Exercise[]).map((e) => (
                      <ExerciseCard key={e.id} exercise={e} />
                    ))}
                  </div>
                )
              }
              if (payload.type === 'supplement') {
                return (
                  <div key={i} className="flex flex-col gap-3 w-full">
                    {(payload.data as Supplement[]).map((s) => (
                      <SupplementCard key={s.id} supplement={s} />
                    ))}
                  </div>
                )
              }
              return null
            })}
          </div>
        )}

        {/* Follow-up Pills */}
        {!isUser && followups.length > 0 && !message.isStreaming && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {followups.map((q, i) => (
              <button
                key={i}
                onClick={() => onQuickAsk?.(q)}
                className="text-[12px] font-medium bg-white text-[#5048E5] border border-[#5048E5]/30 hover:bg-[#EEF2FF] hover:border-[#5048E5] px-3 py-1.5 rounded-full transition-all shadow-sm text-left leading-tight max-w-xs"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div className={cn("flex items-center gap-1 mt-0.5", isUser ? "justify-end" : "justify-start")}>
          <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
            {new Date(message.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
          </span>
          {isUser && (
            <span className="text-[10px] text-[#5048E5] opacity-0 group-hover:opacity-100 transition-opacity">
              ✓✓
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
