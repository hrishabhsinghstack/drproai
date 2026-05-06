import { ChatPage } from '@/components/chat/ChatPage'

export default function ExercisesPage() {
  return (
    <ChatPage
      featureMode="exercise_suggest"
      title="Yoga & Exercise"
      description="Tell me your health condition — I'll suggest the best exercises and yoga poses for you"
    />
  )
}
