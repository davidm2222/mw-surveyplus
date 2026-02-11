"use client"

import { Study } from "@/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { timeAgo, truncate } from "@/lib/utils"

interface StudyCardProps {
  study: Study
  onView?: (studyId: string) => void
  onEdit?: (studyId: string) => void
  onDelete?: (studyId: string) => void
}

export function StudyCard({ study, onView, onEdit, onDelete }: StudyCardProps) {
  const statusVariant = {
    draft: "secondary" as const,
    active: "default" as const,
    complete: "success" as const,
  }[study.status]

  const statusLabel = {
    draft: "Draft",
    active: "Active",
    complete: "Completed",
  }[study.status]

  const getParticipantText = () => {
    const count = study.researchQuestions?.length || 0
    if (study.status === "draft") {
      return `${count} research questions`
    }
    return `${study.researchQuestions?.length || 0} participants`
  }

  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="font-sans text-lg mb-2">
              {study.name}
            </CardTitle>
            {study.researchGoal && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {truncate(study.researchGoal, 120)}
              </p>
            )}
          </div>
          <Badge variant={statusVariant}>{statusLabel}</Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <div>
            <span className="font-medium text-foreground">
              {study.researchQuestions?.length || 0}
            </span>{" "}
            questions
          </div>
          {study.status !== "draft" && (
            <>
              <div>
                <span className="font-medium text-foreground">
                  {study.questionFramework?.length || 0}
                </span>{" "}
                responses
              </div>
              {study.status === "complete" && (
                <div>
                  <span className="font-medium text-foreground">
                    {Math.round((study.questionFramework?.length || 0) / (study.researchQuestions?.length || 1) * 100)}%
                  </span>{" "}
                  completion
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>

      <CardFooter className="border-t border-border pt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-xs text-muted-foreground">
            Updated {timeAgo(study.updatedAt)}
          </div>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (confirm(`Are you sure you want to delete "${study.name}"? This will delete all interviews and reports. This cannot be undone.`)) {
                  onDelete(study.id)
                }
              }}
              className="text-xs text-red-600 hover:text-red-700 hover:underline"
            >
              Delete
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {study.status === "draft" ? (
            <Button
              size="sm"
              onClick={() => onEdit?.(study.id)}
            >
              Continue Setup
            </Button>
          ) : (
            <>
              {study.status === "active" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    const link = `${window.location.origin}/interview/${study.id}`
                    navigator.clipboard.writeText(link)
                    alert("Interview link copied!")
                  }}
                >
                  Copy Link
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (study.status === "active") {
                    window.location.href = `/study/${study.id}/monitor`
                  } else {
                    onEdit?.(study.id)
                  }
                }}
              >
                {study.status === "active" ? "Monitor" : "View"}
              </Button>
              {study.status === "complete" && (
                <Button
                  size="sm"
                  onClick={() => onView?.(study.id)}
                >
                  View Report
                </Button>
              )}
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
