"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Study, Interview } from "@/types"
import { Button } from "@/components/ui/button"

export default function MonitorPage() {
  const params = useParams()
  const router = useRouter()
  const studyId = params.id as string

  const [study, setStudy] = useState<Study | null>(null)
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [expandedInterviews, setExpandedInterviews] = useState<Set<string>>(new Set())
  const [loadingSummaries, setLoadingSummaries] = useState<Set<string>>(new Set())

  // Load study and interviews
  useEffect(() => {
    const studies = JSON.parse(localStorage.getItem("studies") || "[]")
    const foundStudy = studies.find((s: any) => s.id === studyId)
    if (foundStudy) {
      setStudy({
        ...foundStudy,
        createdAt: new Date(foundStudy.createdAt),
        updatedAt: new Date(foundStudy.updatedAt)
      })
    }

    const allInterviews = JSON.parse(localStorage.getItem("interviews") || "[]")
    const studyInterviews = allInterviews
      .filter((i: any) => i.studyId === studyId)
      .map((i: any) => ({
        ...i,
        completedAt: i.completedAt ? new Date(i.completedAt) : undefined,
        startedAt: i.startedAt ? new Date(i.startedAt) : new Date(i.messages[0]?.timestamp || new Date()),
        messages: i.messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }))
      }))
    setInterviews(studyInterviews)

    // Generate summaries for interviews that don't have one
    studyInterviews.forEach((interview: Interview) => {
      if (!interview.aiSummary && interview.status === "complete") {
        generateSummary(interview)
      }
    })
  }, [studyId])

  const generateSummary = async (interview: Interview) => {
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

      // Update interview with summary
      const allInterviews = JSON.parse(localStorage.getItem("interviews") || "[]")
      const updatedInterviews = allInterviews.map((i: any) =>
        i.id === interview.id ? { ...i, aiSummary: summary } : i
      )
      localStorage.setItem("interviews", JSON.stringify(updatedInterviews))

      // Update local state
      setInterviews(prev =>
        prev.map(i => (i.id === interview.id ? { ...i, aiSummary: summary } : i))
      )
    } catch (error) {
      console.error("Error generating summary:", error)
    } finally {
      setLoadingSummaries(prev => {
        const next = new Set(prev)
        next.delete(interview.id)
        return next
      })
    }
  }

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

  const avgDuration = interviews.length > 0
    ? Math.floor(interviews.reduce((sum, i) => sum + i.duration, 0) / interviews.length)
    : 0

  if (!study) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Study not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-6 py-6 max-w-5xl">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-foreground mb-2">{study.name}</h1>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {study.researchGoal}
              </p>
            </div>
            <Button variant="ghost" onClick={() => router.push("/")}>
              ← Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10 max-w-5xl">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="text-3xl font-semibold text-foreground mb-1">
              {interviews.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Interviews</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="text-3xl font-semibold text-foreground mb-1">
              {formatDuration(avgDuration)}
            </div>
            <div className="text-sm text-muted-foreground">Average Duration</div>
          </div>
        </div>

        {/* Interviews List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Interviews</h2>
            {interviews.length > 0 && (
              <Button onClick={() => router.push(`/study/${studyId}/report`)}>
                Generate Report →
              </Button>
            )}
          </div>

          {interviews.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-12 text-center">
              <p className="text-muted-foreground mb-4">No interviews yet</p>
              <Button
                variant="outline"
                onClick={() => {
                  const link = `${window.location.origin}/interview/${studyId}`
                  navigator.clipboard.writeText(link)
                  alert("Interview link copied!")
                }}
              >
                Copy Interview Link
              </Button>
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
