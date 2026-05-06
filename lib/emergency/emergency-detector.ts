const EMERGENCY_KEYWORDS = [
  'chest pain', 'heart attack', 'cardiac arrest',
  "can't breathe", 'cannot breathe', 'difficulty breathing', 'trouble breathing', 'shortness of breath',
  'stroke', 'face drooping', 'arm weakness', 'speech difficulty',
  'unconscious', 'not responding', 'unresponsive',
  'fainted', 'collapsed', 'seizure', 'convulsion',
  'severe bleeding', 'heavy bleeding', 'blood loss',
  'poisoning', 'overdose', 'drug overdose',
  'suicidal', 'want to die', 'end my life', 'kill myself',
  'anaphylaxis', 'severe allergic reaction', 'throat closing',
  'head injury', 'severe head pain', 'worst headache',
]

export function detectEmergency(text: string): boolean {
  const lower = text.toLowerCase()
  return EMERGENCY_KEYWORDS.some((kw) => lower.includes(kw))
}
