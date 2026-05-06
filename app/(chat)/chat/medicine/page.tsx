import { ChatPage } from '@/components/chat/ChatPage'

export default function MedicinePage() {
  return (
    <ChatPage
      featureMode="medicine_id"
      title="Medicine Identification"
      description="Upload a photo of any medicine — tablet, capsule, or strip — I'll identify it and explain its use"
      placeholder="Upload a medicine photo or ask about a medicine..."
    />
  )
}
