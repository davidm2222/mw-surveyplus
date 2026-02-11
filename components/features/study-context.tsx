"use client"

import { useState } from "react"
import { Study } from "@/types"
import { Card } from "@/components/ui/card"

interface StudyContextProps {
  study: Study
}

export function StudyContext({ study }: StudyContextProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <div className="text-left flex-1">
          <h3 className="font-medium text-foreground mb-1">Study Context</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {study.researchGoal}
          </p>
        </div>
        <span className="text-muted-foreground ml-4">
          {isExpanded ? "▲" : "▼"}
        </span>
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 space-y-4 border-t border-border pt-4">
          {/* Research Goal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Research Goal
            </h4>
            <p className="text-sm text-foreground leading-relaxed">
              {study.researchGoal}
            </p>
          </div>

          {/* Research Questions */}
          {study.researchQuestions && study.researchQuestions.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Research Questions ({study.researchQuestions.length})
              </h4>
              <ul className="space-y-2">
                {study.researchQuestions.map((question, i) => (
                  <li key={i} className="flex gap-2 text-sm text-foreground">
                    <span className="text-muted-foreground font-medium">
                      {i + 1}.
                    </span>
                    <span className="flex-1">{question}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Question Framework */}
          {study.questionFramework && study.questionFramework.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Interview Prompts ({study.questionFramework.length})
              </h4>
              <ul className="space-y-2">
                {study.questionFramework.map((prompt, i) => (
                  <li key={i} className="flex gap-2 text-sm text-foreground">
                    <span className="text-accent font-medium">Q{i + 1}.</span>
                    <span className="flex-1">{prompt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
