"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Interview } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/features/theme-toggle"
import { useStudy } from "@/hooks/useStudy"
import { useInterviews } from "@/hooks/useInterview"
import { saveInterview } from "@/lib/storage"
import { StudyTabs } from "@/components/features/study-tabs"
import { StudyContext } from "@/components/features/study-context"

export default function MonitorPage() {
  const params = useParams()
  const router = useRouter()
  const studyId = params.id as string

  const { study, loading: studyLoading } = useStudy(studyId)
  const { interviews, stats, refresh, deleteInterview } = useInterviews(studyId)

  const [expandedInterviews, setExpandedInterviews] = useState<Set<string>>(new Set())
  const [loadingSummaries, setLoadingSummaries] = useState<Set<string>>(new Set())
  const [generatingReport, setGeneratingReport] = useState(false)

  const generateSummary = useCallback(async (interview: Interview) => {
    setLoadingSummaries(prev => new Set(prev).add(interview.id))

    try {
      // Build conversation context for summary
      const transcript = interview.messages
        .map(m => `${m.role === "user" ? "Participant" : "AI"}: ${m.text}`)
        .join("\n\n")

      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript,
          researchGoal: study?.researchGoal || ""
        })
      })

      if (!response.ok) throw new Error("Failed to generate summary")

      const data = await response.json()
      const summary = data.summary

      // Update interview with summary using storage layer
      saveInterview({
        ...interview,
        aiSummary: summary
      })

      // Refresh interviews to show updated summary
      refresh()
    } catch (error) {
      console.error("Error generating summary:", error)
    } finally {
      setLoadingSummaries(prev => {
        const next = new Set(prev)
        next.delete(interview.id)
        return next
      })
    }
  }, [study, refresh])

  // Generate summaries for interviews that don't have one
  useEffect(() => {
    if (interviews.length > 0 && study) {
      interviews.forEach((interview: Interview) => {
        if (!interview.aiSummary && interview.status === "complete" && !loadingSummaries.has(interview.id)) {
          generateSummary(interview)
        }
      })
    }
  }, [interviews, study, generateSummary, loadingSummaries])

  const toggleExpanded = (interviewId: string) => {
    setExpandedInterviews(prev => {
      const next = new Set(prev)
      if (next.has(interviewId)) {
        next.delete(interviewId)
      } else {
        next.add(interviewId)
      }
      return next
    })
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const copyShareableLink = () => {
    const link = `${window.location.origin}/interview/${studyId}`
    navigator.clipboard.writeText(link)
    alert("Interview link copied to clipboard!")
  }

  const handleGenerateReport = async () => {
    if (stats.complete < 3) {
      alert("You need at least 3 completed interviews to generate a report")
      return
    }

    router.push(`/study/${studyId}/report`)
  }

  const handleDeleteInterview = (interviewId: string) => {
    if (confirm("Are you sure you want to delete this interview? This cannot be undone.")) {
      deleteInterview(interviewId)
    }
  }

  if (studyLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!study) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Study not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Study Navigation */}
      <StudyTabs study={study} />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10 max-w-5xl">
        {/* Study Context */}
        <StudyContext study={study} />
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="text-3xl font-semibold text-foreground mb-1">
              {stats.complete}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="text-3xl font-semibold text-foreground mb-1">
              {formatDuration(stats.avgDuration)}
            </div>
            <div className="text-sm text-muted-foreground">Avg Duration</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="text-3xl font-semibold text-foreground mb-1">
              {stats.completionRate}%
            </div>
            <div className="text-sm text-muted-foreground">Completion Rate</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-1">
              <Badge variant={stats.complete >= 3 ? "success" : "default"}>
                {stats.complete >= 3 ? "Ready" : "In Progress"}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">Report Status</div>
          </div>
        </div>

        {/* Shareable Link */}
        <div className="rounded-lg border border-border bg-card p-6 mb-8">
          <h3 className="font-medium text-foreground mb-3">Shareable Interview Link</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={`${typeof window !== "undefined" ? window.location.origin : ""}/interview/${studyId}`}
              readOnly
              className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground"
            />
            <Button onClick={copyShareableLink}>
              Copy Link
            </Button>
          </div>
        </div>

        {/* Interviews List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-normal text-foreground">
              Interviews <span className="font-sans text-sm text-muted-foreground">({stats.complete} complete)</span>
            </h2>
            {stats.complete >= 3 && (
              <Button onClick={handleGenerateReport}>
                Generate Report →
              </Button>
            )}
          </div>

          {interviews.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-12 text-center">
              <p className="text-lg font-medium text-foreground mb-2">No interviews yet</p>
              <p className="text-muted-foreground mb-6">
                Share the interview link above to start collecting responses
              </p>
            </div>
          ) : (
            interviews.map((interview, index) => {
              const isExpanded = expandedInterviews.has(interview.id)
              const isLoadingSummary = loadingSummaries.has(interview.id)

              return (
                <div
                  key={interview.id}
                  className="rounded-lg border border-border bg-card overflow-hidden"
                >
                  {/* Interview Header */}
                  <div className="p-6 border-b border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-foreground mb-1">
                          Interview {index + 1}
                        </h3>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{formatDuration(interview.duration)}</span>
                          <span>
                            {interview.completedAt?.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit"
                            })}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(interview.id)}
                      >
                        {isExpanded ? "Hide" : "View"} Transcript
                      </Button>
                    </div>

                    {/* AI Summary */}
                    <div className="rounded-lg bg-muted/30 p-4">
                      {isLoadingSummary ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="flex gap-1">
                            <span className="typing-dot"></span>
                            <span className="typing-dot"></span>
                            <span className="typing-dot"></span>
                          </div>
                          <span>Generating summary...</span>
                        </div>
                      ) : interview.aiSummary ? (
                        <p className="text-sm text-foreground">{interview.aiSummary}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          Summary not available
                        </p>
                      )}
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteInterview(interview.id)}
                      className="text-sm text-red-600 hover:text-red-700 hover:underline"
                    >
                      Delete Interview
                    </button>
                  </div>

                  {/* Transcript (Expandable) */}
                  {isExpanded && (
                    <div className="p-6 space-y-3 bg-background">
                      {interview.messages
                        .filter(m => !m.text.startsWith("Thanks for participating"))
                        .map((msg, i) => (
                          <div
                            key={i}
                            className={`flex ${
                              msg.role === "user" ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg px-4 py-3 ${
                                msg.role === "user"
                                  ? "bg-primary/10 text-foreground"
                                  : "bg-muted text-foreground"
                              }`}
                            >
                              <div className="text-xs font-medium text-muted-foreground mb-1">
                                {msg.role === "user" ? "Participant" : "AI"}
                              </div>
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {msg.text}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}
