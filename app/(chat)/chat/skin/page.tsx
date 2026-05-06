import { ChatPage } from '@/components/chat/ChatPage'

export default function SkinPage() {
  return (
    <ChatPage
      featureMode="skin_analysis"
      title="Skin Analysis"
      description="Upload a photo of a skin concern — I'll describe what I see and suggest next steps"
      placeholder="Upload a skin photo or describe your skin concern..."
    />
  )
}
