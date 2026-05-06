import { ChatPage } from '@/components/chat/ChatPage'

export default function PrescriptionPage() {
  return (
    <ChatPage
      featureMode="prescription"
      title="Prescription Analysis"
      description="Upload your prescription — I'll explain each medication, dosage and check for allergy conflicts"
      placeholder="Upload a prescription image or ask about your medications..."
    />
  )
}
