'use client'
import { Doctor } from '@/types/medical'
import { Star, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  // Try to extract years experience from qualification or use a default if not available
  const expMatch = doctor.qualification?.match(/(\d+)\s*yrs?/i);
  const expText = expMatch ? `${expMatch[1]} yrs exp.` : '10 yrs exp.';

  return (
    <div className="bg-white dark:bg-card border border-border rounded-xl p-3 shadow-sm hover:shadow-md transition-all flex items-center justify-between w-full max-w-sm">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
          <img 
            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${doctor.name}&backgroundColor=e2e8f0`} 
            alt={doctor.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Info */}
        <div className="flex flex-col min-w-0">
          <h3 className="font-semibold text-[15px] text-foreground tracking-tight truncate">{doctor.name}</h3>
          <p className="text-[13px] text-muted-foreground">{doctor.specialty}</p>
          
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
              <span className="text-[12px] font-medium text-foreground">{doctor.rating}</span>
            </div>
            <span className="text-muted-foreground text-[10px]">•</span>
            <span className="text-[12px] text-muted-foreground">{expText}</span>
          </div>

          {doctor.distance_km && (
            <div className="flex items-center gap-1 mt-0.5 text-[12px] text-muted-foreground">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{doctor.distance_km} km away</span>
            </div>
          )}
        </div>
      </div>

      {/* Action */}
      <div className="pl-3 shrink-0">
        <Button size="sm" className="h-8 px-4 text-xs bg-[#5048E5] hover:bg-[#4338CA] text-white rounded-lg font-medium shadow-sm">
          Book
        </Button>
      </div>
    </div>
  )
}
