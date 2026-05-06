import { ChatPage } from '@/components/chat/ChatPage'

export default function FindDoctorPage() {
  return (
    <ChatPage
      featureMode="doctor_finder"
      title="Find a Doctor"
      description="Tell me your symptoms or the specialist you need — I'll find the right doctors nearby"
    />
  )
}
