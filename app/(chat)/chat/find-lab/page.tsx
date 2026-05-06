import { ChatPage } from '@/components/chat/ChatPage'

export default function FindLabPage() {
  return (
    <ChatPage
      featureMode="lab_finder"
      title="Find a Lab"
      description="Tell me which test you need — I'll find nearby labs with pricing and home collection options"
    />
  )
}
