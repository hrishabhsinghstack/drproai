'use client'
import { useRef } from 'react'
import { Paperclip, FileText, ImageIcon, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  onFile: (file: File) => void
  accept?: string
  className?: string
  preview?: { name: string; type: string; previewUrl?: string } | null
  onClear?: () => void
}

export function FileUploadZone({ onFile, accept = 'image/*,.pdf', className, preview, onClear }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFile(file)
    e.target.value = ''
  }

  if (preview) {
    return (
      <div className={cn('flex items-center gap-2 bg-secondary rounded-xl px-3 py-2', className)}>
        {preview.type === 'application/pdf' ? (
          <FileText className="w-4 h-4 text-red-500 shrink-0" />
        ) : preview.previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview.previewUrl} alt="" className="w-8 h-8 rounded object-cover shrink-0" />
        ) : (
          <ImageIcon className="w-4 h-4 text-primary shrink-0" />
        )}
        <span className="text-xs text-foreground truncate flex-1">{preview.name}</span>
        {onClear && (
          <button onClick={onClear} className="text-muted-foreground hover:text-foreground shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className={cn(
        'flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors',
        className
      )}
    >
      <Paperclip className="w-4 h-4" />
      <span>Attach file</span>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </button>
  )
}
