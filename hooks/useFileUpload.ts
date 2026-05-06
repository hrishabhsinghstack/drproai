'use client'
import { useState, useCallback } from 'react'

export interface UploadedFile {
  base64: string
  mimeType: string
  name: string
  previewUrl: string
  size: number
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf']
const MAX_SIZE_MB = 15

export function useFileUpload() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const processFile = useCallback((file: File): Promise<UploadedFile> => {
    return new Promise((resolve, reject) => {
      setError(null)
      setUploading(true)

      if (!ALLOWED_TYPES.includes(file.type)) {
        const err = 'Unsupported file type. Please upload JPEG, PNG, WebP, HEIC, or PDF.'
        setError(err)
        setUploading(false)
        return reject(new Error(err))
      }

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        const err = `File too large. Maximum size is ${MAX_SIZE_MB}MB.`
        setError(err)
        setUploading(false)
        return reject(new Error(err))
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        const base64 = dataUrl.split(',')[1]
        const previewUrl = file.type === 'application/pdf'
          ? '' // No image preview for PDF
          : URL.createObjectURL(file)

        setUploading(false)
        resolve({ base64, mimeType: file.type, name: file.name, previewUrl, size: file.size })
      }
      reader.onerror = () => {
        setUploading(false)
        reject(new Error('Failed to read file'))
      }
      reader.readAsDataURL(file)
    })
  }, [])

  return { processFile, uploading, error, setError }
}
