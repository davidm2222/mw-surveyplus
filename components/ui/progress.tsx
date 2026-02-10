import * as React from "react"
import { cn } from "@/lib/utils"

export interface ProgressProps {
  currentStep: number
  totalSteps: number
  className?: string
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ currentStep, totalSteps, className }, ref) => {
    const steps = Array.from({ length: totalSteps }, (_, i) => i + 1)

    return (
      <div ref={ref} className={cn("space-y-3", className)}>
        {/* Text indicator */}
        <div className="text-sm font-medium text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </div>

        {/* Visual dots */}
        <div className="flex items-center gap-2">
          {steps.map((step) => (
            <React.Fragment key={step}>
              <div
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  step < currentStep && "bg-primary",
                  step === currentStep && "bg-primary w-8",
                  step > currentStep && "bg-border"
                )}
              />
              {step < totalSteps && (
                <div
                  className={cn(
                    "h-0.5 flex-1 transition-colors",
                    step < currentStep ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
