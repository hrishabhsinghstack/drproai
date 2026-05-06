'use client'
import { Exercise } from '@/types/medical'
import { Clock, PlayCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  // Use a generic placeholder if image_emoji isn't a proper URL.
  // The reference shows a video thumbnail.
  const isVideoOrImage = exercise.image_emoji?.startsWith('http');
  
  return (
    <div className="bg-white dark:bg-card border border-border rounded-xl p-3 shadow-sm hover:shadow-md transition-all flex items-center justify-between w-full max-w-sm">
      <div className="flex items-center gap-3 w-full">
        {/* Video Thumbnail */}
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative flex items-center justify-center">
          {isVideoOrImage ? (
            <img src={exercise.image_emoji} alt={exercise.name} className="w-full h-full object-cover opacity-80" />
          ) : (
            <div className="w-full h-full bg-slate-200 flex items-center justify-center">
              <span className="text-2xl">{exercise.image_emoji || '🧘'}</span>
            </div>
          )}
          <PlayCircle className="absolute text-white/90 w-6 h-6 drop-shadow-md" />
        </div>
        
        {/* Info */}
        <div className="flex flex-col min-w-0 flex-1">
          <h3 className="font-semibold text-[15px] text-foreground tracking-tight truncate">{exercise.name}</h3>
          <p className="text-[13px] text-muted-foreground truncate">{exercise.description || 'Yoga'}</p>
          
          <div className="flex items-center gap-1.5 mt-1 text-[12px] text-muted-foreground">
            <span className="flex items-center gap-0.5">
              <Clock className="w-3 h-3" />
              {exercise.duration_minutes} min
            </span>
            <span>•</span>
            <span className="text-[#00a99d] bg-[#00a99d]/10 px-1.5 py-0.5 rounded-sm">
              {exercise.intensity === 'low' ? 'Beginner Friendly' : 'Advanced'}
            </span>
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="pl-2 shrink-0">
        <Button size="sm" variant="outline" className="h-8 px-3 text-xs font-medium text-[#00a99d] border-[#00a99d] hover:bg-[#00a99d] hover:text-white rounded-lg whitespace-nowrap">
          Start Now
        </Button>
      </div>
    </div>
  )
}
