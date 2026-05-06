'use client'
import { Lab } from '@/types/medical'
import { Button } from '@/components/ui/button'

export function LabCard({ lab }: { lab: Lab }) {
  // The reference card shows:
  // Icon | Title
  //      | Price (strike-through price) OFF%
  //      | "Home Collection Available"
  //      | [Book Test] button
  
  // Fake original price logic for demonstration
  const originalPrice = lab.home_collection_charge ? lab.home_collection_charge * 1.5 : 600;
  const currentPrice = lab.home_collection_charge || 399;
  const discount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);

  return (
    <div className="bg-white dark:bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-all w-full max-w-sm">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
          <img src="https://api.iconify.design/lucide:test-tube-2.svg?color=%23ef4444" alt="Lab Test" className="w-5 h-5" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[15px] text-foreground tracking-tight">{lab.name}</h3>
          
          <div className="flex items-center gap-2 mt-1">
            <span className="font-bold text-[15px]">₹{currentPrice}</span>
            <span className="text-[13px] text-muted-foreground line-through">₹{originalPrice}</span>
            <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm">{discount}% OFF</span>
          </div>

          {lab.home_collection && (
            <p className="text-[12px] text-slate-500 mt-1">Home Collection Available</p>
          )}

          <div className="mt-3">
            <Button size="sm" variant="outline" className="h-8 text-xs font-medium text-[#00a99d] border-[#00a99d] hover:bg-[#00a99d] hover:text-white rounded-lg w-[100px]">
              Book Test
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
