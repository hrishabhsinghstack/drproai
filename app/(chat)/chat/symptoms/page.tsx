import { ChatPage } from '@/components/chat/ChatPage'

export default function SymptomsPage() {
  return (
    <ChatPage
      featureMode="symptom_checker"
      title="Symptom Checker"
      description="Describe your symptoms — I'll ask follow-up questions to help understand your condition"
    />
  )
}
