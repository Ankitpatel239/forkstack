
"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { checked?: boolean; onCheckedChange?: (checked: boolean) => void }
>(({ className, checked, onCheckedChange, ...props }, ref) => {
  return (
    <div
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-zinc-700 ring-offset-background cursor-pointer flex items-center justify-center transition-all",
        checked ? "bg-emerald-500 border-emerald-500 text-zinc-950" : "hover:border-zinc-500",
        className
      )}
    >
      {checked && <Check className="h-3 w-3" />}
      <input
        type="checkbox"
        ref={ref}
        className="sr-only"
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        {...props}
      />
    </div>
  )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }
