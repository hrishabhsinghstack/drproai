import Link from 'next/link'
import { Stethoscope, FlaskConical, Pill, Eye, FileText, UserSearch, TestTube, Dumbbell, Bell } from 'lucide-react'

const EXPLORE_CARDS = [
  { href: '/chat/symptoms', label: 'Symptom Checker', icon: Stethoscope, description: 'Analyze your symptoms', color: 'bg-blue-50 text-blue-600' },
  { href: '/chat/lab-report', label: 'Lab Reports', icon: FlaskConical, description: 'Upload & understand tests', color: 'bg-purple-50 text-purple-600' },
  { href: '/chat/medicine', label: 'Medicine ID', icon: Pill, description: 'Identify medicines', color: 'bg-green-50 text-green-600' },
  { href: '/chat/skin', label: 'Skin Analysis', icon: Eye, description: 'Check skin concerns', color: 'bg-orange-50 text-orange-600' },
  { href: '/chat/prescription', label: 'Prescriptions', icon: FileText, description: 'Explain prescriptions', color: 'bg-indigo-50 text-indigo-600' },
  { href: '/chat/find-doctor', label: 'Find Doctor', icon: UserSearch, description: 'Book appointments', color: 'bg-teal-50 text-teal-600' },
  { href: '/chat/find-lab', label: 'Find Lab', icon: TestTube, description: 'Book lab tests', color: 'bg-rose-50 text-rose-600' },
  { href: '/chat/exercises', label: 'Yoga & Exercise', icon: Dumbbell, description: 'Personalized fitness', color: 'bg-yellow-50 text-yellow-600' },
  { href: '/chat/reminders', label: 'Reminders', icon: Bell, description: 'Health alerts', color: 'bg-slate-50 text-slate-600' },
]

export default function ExplorePage() {
  return (
    <div className="flex-1 overflow-y-auto p-4 pb-24 bg-slate-50 dark:bg-background">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-1">Explore Features</h1>
        <p className="text-sm text-muted-foreground mb-6">Discover all the ways DrPro Assistant can help you.</p>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3">
          {EXPLORE_CARDS.map((card, i) => {
            const Icon = card.icon
            return (
              <Link 
                key={i} 
                href={card.href}
                className="bg-white dark:bg-card border border-border p-4 rounded-2xl flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{card.label}</h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2">{card.description}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
