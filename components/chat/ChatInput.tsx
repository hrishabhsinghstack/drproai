'use client'
import { useState, useRef, KeyboardEvent } from 'react'
import { Send, Loader2, Mic } from 'lucide-react'
import { FileUploadZone } from './FileUploadZone'
import { useFileUpload } from '@/hooks/useFileUpload'
import { cn } from '@/lib/utils'
import { FeatureMode } from '@/types/chat'

const FILE_MODES: FeatureMode[] = ['lab_report', 'medicine_id', 'skin_analysis', 'prescription']

interface Props {
  onSend: (text: string) => void
  onSendFile: (base64: string, mimeType: string, name: string, previewUrl: string, prompt?: string) => void
  isStreaming: boolean
  featureMode: FeatureMode
  placeholder?: string
}

export function ChatInput({ onSend, onSendFile, isStreaming, featureMode, placeholder }: Props) {
  const [text, setText] = useState('')
  const [pendingFile, setPendingFile] = useState<{ base64: string; mimeType: string; type: string; name: string; previewUrl: string } | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { processFile, uploading, error } = useFileUpload()

  const supportsFile = FILE_MODES.includes(featureMode)

  const handleSend = () => {
    if (isStreaming || uploading) return
    if (pendingFile) {
      onSendFile(pendingFile.base64, pendingFile.mimeType, pendingFile.name, pendingFile.previewUrl, text.trim() || undefined)
      setPendingFile(null)
      setText('')
    } else if (text.trim()) {
      onSend(text.trim())
      setText('')
    }
    textareaRef.current?.focus()
  }

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFile = async (file: File) => {
    try {
      const result = await processFile(file)
      setPendingFile({ ...result, type: result.mimeType })
    } catch { /* error shown by hook */ }
  }

  const defaultPlaceholder = placeholder ?? 'Type a message...'

  return (
    <div className="bg-background pt-2 pb-4 px-4 w-full max-w-3xl mx-auto relative">
      {error && (
        <p className="text-xs text-destructive mb-2 px-1">{error}</p>
      )}
      {pendingFile && (
        <div className="mb-2">
          <FileUploadZone
            onFile={handleFile}
            preview={pendingFile}
            onClear={() => setPendingFile(null)}
          />
        </div>
      )}
      <div className="flex items-end gap-2 bg-white dark:bg-card rounded-full border border-slate-200 shadow-sm pl-4 pr-1.5 py-1.5 focus-within:border-[#00a99d]/50 focus-within:ring-1 focus-within:ring-[#00a99d]/20 transition-all">
        {supportsFile && !pendingFile && (
          <FileUploadZone onFile={handleFile} className="mb-1 shrink-0" />
        )}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder={defaultPlaceholder}
          rows={1}
          className="flex-1 bg-transparent text-[14px] resize-none outline-none placeholder:text-slate-400 max-h-32 leading-relaxed py-2.5 my-auto"
          style={{ minHeight: '40px' }}
        />
        
        {/* Mic Icon (Placeholder) */}
        {!text.trim() && !pendingFile && (
          <button className="p-2.5 mb-0.5 text-slate-400 hover:text-[#00a99d] transition-colors shrink-0">
            <Mic className="w-[18px] h-[18px]" />
          </button>
        )}

        <button
          onClick={handleSend}
          disabled={isStreaming || uploading || (!text.trim() && !pendingFile)}
          className={cn(
            'w-[42px] h-[42px] rounded-full flex items-center justify-center transition-all shrink-0 ml-1',
            (text.trim() || pendingFile) && !isStreaming
              ? 'bg-[#00a99d] text-white hover:bg-[#008e84] shadow-md shadow-indigo-500/20'
              : 'bg-[#00a99d] text-white opacity-90' // The reference shows it's always colored, or just less prominent
          )}
        >
          {isStreaming || uploading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-[18px] h-[18px] ml-0.5" />
          )}
        </button>
      </div>
    </div>
  )
}
