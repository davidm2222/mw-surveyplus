"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Report } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useStudy } from "@/hooks/useStudy"
import { useInterviews } from "@/hooks/useInterview"
import { getReport, saveReport } from "@/lib/storage"
import { generateId } from "@/lib/utils"
import { StudyTabs } from "@/components/features/study-tabs"
import { StudyContext } from "@/components/features/study-context"

export default function ReportPage() {
  const params = useParams()
  const router = useRouter()
  const studyId = params.id as string

  const { study, loading: studyLoading } = useStudy(studyId)
  const { completeInterviews: interviews, stats } = useInterviews(studyId)

  const [report, setReport] = useState<Report | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load existing report
  useEffect(() => {
    if (studyId) {
      const existingReport = getReport(studyId)
      if (existingReport) {
        setReport(existingReport)
      }
    }
  }, [studyId])

  const generateReport = async () => {
    if (!study || interviews.length === 0) return

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          study: {
            researchGoal: study.researchGoal,
            researchQuestions: study.researchQuestions
          },
          interviews: interviews.map(i => ({
            duration: i.duration,
            messages: i.messages
          }))
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to generate report")
      }

      const data = await response.json()
      const reportData = data.report

      // Calculate avg duration
      const avgSeconds = Math.floor(
        interviews.reduce((sum, i) => sum + i.duration, 0) / interviews.length
      )
      const avgMinutes = Math.floor(avgSeconds / 60)
      const avgSecs = avgSeconds % 60

      const newReport: Report = {
        id: generateId(),
        studyId: study.id,
        participantCount: interviews.length,
        avgDuration: `${avgMinutes}:${avgSecs.toString().padStart(2, "0")}`,
        executiveSummary: reportData.executiveSummary,
        findings: reportData.findings,
        unexpectedInsights: reportData.unexpectedInsights || [],
        furtherResearch: reportData.furtherResearch || [],
        generatedAt: new Date()
      }

      // Save using storage layer
      saveReport(newReport)
      setReport(newReport)
    } catch (error) {
      console.error("Error generating report:", error)
      setError(error instanceof Error ? error.message : "Failed to generate report")
    } finally {
      setIsGenerating(false)
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

  if (interviews.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <StudyTabs study={study} />
        <main className="container mx-auto px-6 py-10 max-w-5xl">
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground mb-4">No completed interviews yet. Run some interviews first!</p>
            <Button onClick={() => router.push(`/study/${studyId}/monitor`)}>
              Go to Monitor
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Study Navigation */}
      <StudyTabs study={study} />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10 max-w-5xl">
        {!report ? (
          <>
            <StudyContext study={study} />
            <div className="rounded-lg border border-border bg-card p-12 text-center space-y-6">
            <div>
              <div className="text-4xl font-semibold text-foreground mb-2">{interviews.length}</div>
              <p className="text-muted-foreground">interviews ready for analysis</p>
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button
              onClick={generateReport}
              disabled={isGenerating}
              size="lg"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <span className="flex gap-1">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </span>
                  Analyzing interviews...
                </span>
              ) : (
                "Generate Report"
              )}
            </Button>
            <p className="text-sm text-muted-foreground">
              This will analyze all {interviews.length} interviews using AI
            </p>
          </div>
          </>
        ) : (
          <div className="space-y-8 fade-up">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3">
              <Badge>{report.participantCount} participants</Badge>
              <Badge>Avg {report.avgDuration}</Badge>
              <Badge variant="secondary">AI-synthesized</Badge>
              <span className="text-sm text-muted-foreground ml-auto">
                Generated {report.generatedAt.toLocaleDateString()}
              </span>
              <button
                onClick={generateReport}
                disabled={isGenerating}
                className="text-sm text-primary dark:text-indigo-400 hover:underline"
              >
                {isGenerating ? "Regenerating..." : "Regenerate"}
              </button>
            </div>

            {/* Executive Summary */}
            <section className="rounded-lg border border-border bg-card p-8">
              <h2 className="font-serif text-xl font-normal text-foreground mb-4">Executive Summary</h2>
              <p className="text-foreground leading-relaxed">{report.executiveSummary}</p>
            </section>

            {/* Findings */}
            <section className="space-y-6">
              <h2 className="font-serif text-2xl font-normal text-foreground">Findings</h2>

              {report.findings.map((finding, idx) => (
                <div key={idx} className="rounded-lg border border-border bg-card p-8 space-y-6">
                  <div>
                    <h3 className="font-serif text-lg font-normal text-foreground mb-3">
                      {finding.researchQuestion}
                    </h3>
                    <p className="text-foreground leading-relaxed">{finding.answer}</p>
                  </div>

                  {/* Themes */}
                  <div className="space-y-4">
                    {finding.themes.map((theme, themeIdx) => (
                      <div
                        key={themeIdx}
                        className="rounded-lg bg-muted/30 p-6 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <h4 className="font-medium text-foreground">{theme.theme}</h4>
                          <Badge>
                            {theme.count} of {theme.total}
                          </Badge>
                        </div>

                        {/* Visual proportion bar */}
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${(theme.count / theme.total) * 100}%` }}
                          />
                        </div>

                        {/* Quotes */}
                        {theme.quotes.length > 0 && (
                          <div className="space-y-2">
                            {theme.quotes.map((quote, quoteIdx) => (
                              <blockquote
                                key={quoteIdx}
                                className="border-l-2 border-primary/40 pl-4 text-sm text-muted-foreground italic"
                              >
                                &ldquo;{quote}&rdquo;
                              </blockquote>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            {/* Unexpected Insights */}
            {report.unexpectedInsights.length > 0 && (
              <section className="rounded-lg border border-border bg-card p-8">
                <h2 className="font-serif text-xl font-normal text-foreground mb-4">Unexpected Insights</h2>
                <ul className="space-y-2">
                  {report.unexpectedInsights.map((insight, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="text-primary mt-1">→</span>
                      <span className="text-foreground">{insight}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Further Research */}
            {report.furtherResearch.length > 0 && (
              <section className="rounded-lg border border-border bg-card p-8">
                <h2 className="font-serif text-xl font-normal text-foreground mb-4">Further Research</h2>
                <ul className="space-y-2">
                  {report.furtherResearch.map((item, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="text-primary mt-1">→</span>
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button onClick={() => router.push(`/study/${studyId}/monitor`)}>
                ← Back to Monitor
              </Button>
              <Button variant="outline" onClick={() => router.push("/")}>
                Dashboard
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
