import { ChatPage } from '@/components/chat/ChatPage'

export default function LabReportPage() {
  return (
    <ChatPage
      featureMode="lab_report"
      title="Lab Report Analysis"
      description="Upload your lab report (PDF or image) — I'll explain every test result in simple language"
      placeholder="Upload a lab report or ask about a test result..."
    />
  )
}
