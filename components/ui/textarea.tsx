import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  showCharCount?: boolean
  maxCharCount?: number
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
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
        <textarea
          className={cn(
            "w-full rounded-lg border border-border bg-background px-4 py-3",
            "text-base text-foreground placeholder:text-muted-foreground",
            "transition-colors resize-y",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "min-h-[100px]",
            error && "border-destructive focus:ring-destructive",
            className
          )}
          style={{ width: '100%' }}
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
Textarea.displayName = "Textarea"

export { Textarea }
