// SERVER ONLY — never import in client components
import { GoogleGenerativeAI } from '@google/generative-ai'

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables')
}

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export const GEMINI_MODEL = 'gemini-2.5-flash-lite'
