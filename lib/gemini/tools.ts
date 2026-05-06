import { FunctionDeclaration, SchemaType } from '@google/generative-ai'

export const TOOL_DECLARATIONS: FunctionDeclaration[] = [
  {
    name: 'show_doctors',
    description:
      'Show a list of nearby doctors when the user asks to find a doctor, needs a specialist, or describes symptoms that require professional consultation.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        specialty: {
          type: SchemaType.STRING,
          description:
            'Medical specialty e.g. "cardiologist", "dermatologist", "general physician", "gynecologist". Use the most appropriate specialty based on symptoms.',
        },
        online_only: {
          type: SchemaType.BOOLEAN,
          description: 'True if user explicitly wants online/video consultation',
        },
        max_fee: {
          type: SchemaType.NUMBER,
          description: 'Maximum consultation fee in INR if user mentioned a budget',
        },
      },
      required: ['specialty'],
    },
  },
  {
    name: 'show_labs',
    description:
      'Show nearby diagnostic labs when the user needs to book a lab test, blood test, or diagnostic investigation.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        test_name: {
          type: SchemaType.STRING,
          description: 'Specific test the user needs e.g. "CBC", "thyroid profile", "HbA1c", "Vitamin D"',
        },
        home_collection: {
          type: SchemaType.BOOLEAN,
          description: 'True if user wants home blood collection service',
        },
      },
    },
  },
  {
    name: 'show_exercises',
    description:
      'Show exercise and yoga recommendations when the user asks about exercises for a health condition, wants to manage a condition with lifestyle changes, or asks about yoga.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        condition: {
          type: SchemaType.STRING,
          description: "The health condition to get exercises for (e.g. 'diabetes', 'hypertension', 'pcod', 'stress', 'back_pain', 'obesity', 'thyroid', 'general_fitness')",
        },
      },
      required: ['condition'],
    },
  },
  {
    name: 'log_symptom',
    description:
      'Log a symptom entry to the patient\'s health history after gathering enough information through conversation. Call this after you have asked about severity and duration.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        symptoms: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
          description: 'List of symptoms reported by the patient',
        },
        severity: {
          type: SchemaType.NUMBER,
          description: 'Severity on a scale of 1–5 (1=mild, 3=moderate, 5=severe)',
        },
        duration: {
          type: SchemaType.STRING,
          description: 'How long the patient has had the symptoms e.g. "2 days", "since morning"',
        },
        gemini_assessment: {
          type: SchemaType.STRING,
          description: 'Brief one-sentence AI assessment of the symptom pattern',
        },
      },
      required: ['symptoms', 'severity'],
    },
  },
  {
    name: 'set_reminder',
    description:
      'Set a health reminder when the user asks to be reminded about medications, appointments, or health activities.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        type: {
          type: SchemaType.STRING,
          description: "Type of reminder (e.g. 'medication', 'appointment', 'custom')",
        },
        title: {
          type: SchemaType.STRING,
          description: 'Short title for the reminder e.g. "Take Metformin 500mg"',
        },
        description: {
          type: SchemaType.STRING,
          description: 'Additional details about the reminder',
        },
        time: {
          type: SchemaType.STRING,
          description: 'Time in HH:MM 24-hour format e.g. "08:00", "14:30"',
        },
        days: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
          description: 'Days for recurring reminders e.g. ["mon","tue","wed","thu","fri","sat","sun"]',
        },
      },
      required: ['type', 'title', 'time'],
    },
  },
  {
    name: 'show_supplements',
    description:
      'Show supplement recommendations when the user asks about vitamins, supplements, or natural remedies for a specific condition.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        condition: {
          type: SchemaType.STRING,
          description: 'The health concern or condition e.g. "anemia", "pcod", "immunity", "sleep", "b12 deficiency"',
        },
      },
      required: ['condition'],
    },
  },
]
