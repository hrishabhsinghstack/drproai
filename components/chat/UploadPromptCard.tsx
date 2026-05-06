'use client'
import { FileUp, FileText, ImageIcon, ShieldCheck } from 'lucide-react'
import { useRef } from 'react'
import { useFileUpload } from '@/hooks/useFileUpload'

interface Props {
  type: 'lab_report' | 'prescription' | 'skin_analysis' | 'medicine_id'
  onUpload: (base64: string, mimeType: string, name: string, previewUrl: string) => void
}

const TYPE_CONFIG = {
  lab_report: {
    title: 'Upload Lab Report',
    description: 'Upload your blood test or diagnostic report for AI analysis.',
    icon: FileText,
    accept: '.pdf,image/*',
    color: 'text-purple-600',
    bg: 'bg-purple-50'
  },
  prescription: {
    title: 'Upload Prescription',
    description: 'Upload a photo of your doctor\'s prescription to understand it better.',
    icon: FileUp,
    accept: 'image/*',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50'
  },
  skin_analysis: {
    title: 'Upload Skin Photo',
    description: 'Upload a clear photo of the affected skin area.',
    icon: ImageIcon,
    accept: 'image/*',
    color: 'text-orange-600',
    bg: 'bg-orange-50'
  },
  medicine_id: {
    title: 'Identify Medicine',
    description: 'Upload a photo of the tablet or medicine strip.',
    icon: FileText,
    accept: 'image/*',
    color: 'text-green-600',
    bg: 'bg-green-50'
  }
}

export function UploadPromptCard({ type, onUpload }: Props) {
  const config = TYPE_CONFIG[type]
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { processFile, uploading } = useFileUpload()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const result = await processFile(file)
        onUpload(result.base64, result.mimeType, result.name, result.previewUrl)
      } catch (err) {
        console.error('Upload error:', err)
      }
    }
  }

  const Icon = config.icon

  return (
    <div className="w-full bg-white dark:bg-card border border-slate-100 rounded-2xl p-5 shadow-sm my-2">
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${config.bg} ${config.color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">{config.title}</h3>
          <p className="text-[13px] text-slate-500 leading-snug">{config.description}</p>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={config.accept}
        className="hidden"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full h-11 bg-[#5048E5] text-white rounded-xl text-sm font-bold hover:bg-[#4338CA] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        {uploading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <FileUp className="w-4 h-4" />
            <span>Select File to Upload</span>
          </>
        )}
      </button>

      <div className="mt-3 flex items-center justify-center gap-1.5 opacity-60">
        <ShieldCheck className="w-3 h-3 text-emerald-600" />
        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">End-to-end encrypted</span>
      </div>
    </div>
  )
}
