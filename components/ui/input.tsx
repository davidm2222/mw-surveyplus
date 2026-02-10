import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  showCharCount?: boolean
  maxCharCount?: number
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      showCharCount,
      maxCharCount,
      value,
      ...props
    },
    ref
  ) => {
    const charCount =
      typeof value === "string" ? value.length : 0

    return (
      <div className="space-y-2">
        {label && (
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              {label}
            </label>
            {showCharCount && maxCharCount && (
              <span className="text-xs text-muted-foreground">
                {charCount}/{maxCharCount}
              </span>
            )}
          </div>
        )}
        <input
          className={cn(
            "w-full rounded-lg border border-border bg-background px-4 py-3",
            "text-base text-foreground placeholder:text-muted-foreground",
            "transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus:ring-destructive",
            className
          )}
          ref={ref}
          value={value}
          {...props}
        />
        {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
