'use client'

interface Props {
  onSelect: (text: string) => void
  featureMode: string
}

const CHIPS: Record<string, string[]> = {
  health_qa: ['I have a headache', 'What foods are good for diabetes?', 'How to improve sleep?', 'Is my BMI normal?', 'What causes high BP?'],
  symptom_checker: ['I have a fever', 'My stomach is hurting', 'I feel dizzy', 'I have a rash', 'I have chest discomfort'],
  lab_report: ['Explain my CBC report', 'What does high TSH mean?', 'My Vitamin D is low', 'What should I do about high cholesterol?'],
  medicine_id: ['Upload a medicine photo', 'What is Metformin used for?', 'Is this medicine safe with my allergies?'],
  skin_analysis: ['I have a red rash', 'I have acne on my face', 'My skin is very dry and flaky', 'I have a suspicious mole'],
  prescription: ['Upload my prescription', 'Explain my medications', 'Are there any interactions?'],
  doctor_finder: ['Find me a cardiologist', 'I need a skin doctor', 'I need a gynecologist', 'Find a general physician nearby', 'I need a diabetes specialist'],
  lab_finder: ['I need a CBC test', 'Where can I get Vitamin D test done?', 'I need HbA1c test with home collection', 'Find thyroid test labs'],
  exercise_suggest: ['Exercises for diabetes', 'Yoga for PCOD', 'Back pain exercises', 'Stress relief exercises', 'Exercises for weight loss'],
  period_tracker: ['My periods are irregular', 'I have bad cramps', 'What is PCOD?', 'How to track my cycle?', 'PMS remedies'],
}

export function QuickAskChips({ onSelect, featureMode }: Props) {
  const chips = CHIPS[featureMode] ?? CHIPS.health_qa

  return (
    <div className="flex flex-wrap gap-2 px-4 py-3">
      {chips.map((chip) => (
        <button
          key={chip}
          onClick={() => onSelect(chip)}
          className="text-[13px] font-medium bg-white hover:bg-[#EEF2FF] text-[#00a99d] border border-[#00a99d]/30 hover:border-[#00a99d] px-3.5 py-1.5 rounded-full transition-all cursor-pointer shadow-sm"
        >
          {chip}
        </button>
      ))}
    </div>
  )
}
