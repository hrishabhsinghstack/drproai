'use client'
import { useState } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { BloodGroup, Gender } from '@/types/profile'
import { User, Save, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const COMMON_CONDITIONS = ['Type 2 Diabetes', 'Hypertension', 'Hypothyroidism', 'PCOD/PCOS', 'Asthma', 'Arthritis', 'Heart Disease', 'Anemia']
const COMMON_ALLERGIES = ['Penicillin', 'Sulfa drugs', 'Aspirin', 'Ibuprofen', 'Latex', 'Peanuts', 'Shellfish', 'Eggs']

export default function ProfilePage() {
  const { profile, updateProfile } = useProfile()
  const [newAllergy, setNewAllergy] = useState('')
  const [newCondition, setNewCondition] = useState('')
  const [newMed, setNewMed] = useState('')

  if (!profile) return <div className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>

  const save = (patch: Parameters<typeof updateProfile>[0]) => {
    updateProfile(patch)
    toast.success('Profile saved')
  }

  const addChip = (field: 'allergies' | 'conditions' | 'current_medications', value: string) => {
    if (!value.trim()) return
    const list = profile[field] ?? []
    if (!list.includes(value.trim())) {
      updateProfile({ [field]: [...list, value.trim()] })
    }
  }

  const removeChip = (field: 'allergies' | 'conditions' | 'current_medications', value: string) => {
    updateProfile({ [field]: (profile[field] ?? []).filter((v: string) => v !== value) })
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-3xl">
          {profile.name ? profile.name[0].toUpperCase() : '👤'}
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground">{profile.name || 'My Health Profile'}</h2>
          <p className="text-xs text-muted-foreground">Your profile helps AI personalize responses</p>
        </div>
      </div>

      {/* Basic Info */}
      <Section title="Basic Information" icon={User}>
        <Field label="Full Name">
          <input
            defaultValue={profile.name}
            onBlur={(e) => save({ name: e.target.value })}
            placeholder="Enter your name"
            className={inputClass}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Age">
            <input
              type="number"
              defaultValue={profile.age ?? ''}
              onBlur={(e) => save({ age: parseInt(e.target.value) || null })}
              placeholder="Years"
              className={inputClass}
            />
          </Field>
          <Field label="Gender">
            <select
              defaultValue={profile.gender ?? ''}
              onChange={(e) => save({ gender: e.target.value as Gender || null })}
              className={inputClass}
            >
              <option value="">Select</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Height (cm)">
            <input
              type="number"
              defaultValue={profile.height_cm ?? ''}
              onBlur={(e) => save({ height_cm: parseFloat(e.target.value) || null })}
              placeholder="e.g. 165"
              className={inputClass}
            />
          </Field>
          <Field label="Weight (kg)">
            <input
              type="number"
              defaultValue={profile.weight_kg ?? ''}
              onBlur={(e) => save({ weight_kg: parseFloat(e.target.value) || null })}
              placeholder="e.g. 65"
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="Blood Group">
          <div className="flex flex-wrap gap-2">
            {BLOOD_GROUPS.map((bg) => (
              <button
                key={bg}
                onClick={() => save({ blood_group: bg })}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors',
                  profile.blood_group === bg
                    ? 'bg-primary text-white border-primary'
                    : 'border-border text-foreground hover:bg-secondary'
                )}
              >
                {bg}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Emergency Contact">
          <input
            defaultValue={profile.emergency_contact ?? ''}
            onBlur={(e) => save({ emergency_contact: e.target.value || null })}
            placeholder="Phone number"
            className={inputClass}
          />
        </Field>
      </Section>

      {/* Allergies */}
      <ChipSection
        title="Known Allergies"
        emoji="⚠️"
        items={profile.allergies}
        suggestions={COMMON_ALLERGIES.filter((a) => !profile.allergies.includes(a))}
        inputValue={newAllergy}
        onInputChange={setNewAllergy}
        onAdd={() => { addChip('allergies', newAllergy); setNewAllergy('') }}
        onRemove={(v) => removeChip('allergies', v)}
        onSuggest={(v) => addChip('allergies', v)}
        placeholder="Add allergy..."
        badgeClass="bg-red-50 text-red-700 border-red-200"
      />

      {/* Conditions */}
      <ChipSection
        title="Existing Conditions"
        emoji="🏥"
        items={profile.conditions}
        suggestions={COMMON_CONDITIONS.filter((c) => !profile.conditions.includes(c))}
        inputValue={newCondition}
        onInputChange={setNewCondition}
        onAdd={() => { addChip('conditions', newCondition); setNewCondition('') }}
        onRemove={(v) => removeChip('conditions', v)}
        onSuggest={(v) => addChip('conditions', v)}
        placeholder="Add condition..."
        badgeClass="bg-amber-50 text-amber-700 border-amber-200"
      />

      {/* Medications */}
      <ChipSection
        title="Current Medications"
        emoji="💊"
        items={profile.current_medications}
        suggestions={[]}
        inputValue={newMed}
        onInputChange={setNewMed}
        onAdd={() => { addChip('current_medications', newMed); setNewMed('') }}
        onRemove={(v) => removeChip('current_medications', v)}
        onSuggest={() => {}}
        placeholder="e.g. Metformin 500mg"
        badgeClass="bg-blue-50 text-blue-700 border-blue-200"
      />

      <div className="pb-6" />
    </div>
  )
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-card rounded-2xl p-4 border border-border shadow-sm space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground block mb-1">{label}</label>
      {children}
    </div>
  )
}

function ChipSection({ title, emoji, items, suggestions, inputValue, onInputChange, onAdd, onRemove, onSuggest, placeholder, badgeClass }: {
  title: string; emoji: string; items: string[]; suggestions: string[]
  inputValue: string; onInputChange: (v: string) => void; onAdd: () => void; onRemove: (v: string) => void
  onSuggest: (v: string) => void; placeholder: string; badgeClass: string
}) {
  return (
    <div className="bg-white dark:bg-card rounded-2xl p-4 border border-border shadow-sm space-y-3">
      <h3 className="text-sm font-semibold text-foreground">{emoji} {title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge key={item} variant="outline" className={cn('gap-1', badgeClass)}>
            {item}
            <button onClick={() => onRemove(item)} className="ml-0.5 hover:opacity-70">
              <X className="w-2.5 h-2.5" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onAdd()}
          placeholder={placeholder}
          className="flex-1 text-xs border border-border rounded-xl px-3 py-2 bg-background outline-none focus:border-primary"
        />
        <Button size="sm" variant="outline" onClick={onAdd} className="h-8 w-8 p-0">
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </div>
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {suggestions.slice(0, 5).map((s) => (
            <button key={s} onClick={() => onSuggest(s)} className="text-[11px] border border-dashed border-border text-muted-foreground px-2.5 py-1 rounded-full hover:border-primary hover:text-primary transition-colors">
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const inputClass = 'w-full text-sm border border-border rounded-xl px-3 py-2.5 bg-background outline-none focus:border-primary placeholder:text-muted-foreground'
