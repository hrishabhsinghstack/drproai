'use client'
import { Supplement } from '@/types/medical'
import { AlertTriangle } from 'lucide-react'

export function SupplementCard({ supplement }: { supplement: Supplement }) {
  return (
    <div className="bg-white dark:bg-card border border-border rounded-2xl p-4 shadow-sm w-full max-w-sm">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-2xl shrink-0">
          💊
        </div>
        <div>
          <h3 className="font-semibold text-sm text-foreground">{supplement.name}</h3>
          <p className="text-xs text-muted-foreground">{supplement.dosage} · {supplement.form}</p>
        </div>
      </div>

      <div className="mt-2">
        <p className="text-xs font-medium text-foreground mb-1">Benefits:</p>
        <ul className="space-y-0.5">
          {supplement.benefits.slice(0, 3).map((b, i) => (
            <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
              <span className="text-green-600">✓</span><span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">When to take: </span>{supplement.when_to_take}
      </p>

      {supplement.caution && (
        <div className="mt-2 flex items-start gap-1.5 bg-amber-50 border border-amber-200 rounded-xl p-2">
          <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">{supplement.caution}</p>
        </div>
      )}

      {supplement.brand_suggestions.length > 0 && (
        <p className="mt-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Brands: </span>
          {supplement.brand_suggestions.join(', ')}
        </p>
      )}
    </div>
  )
}
