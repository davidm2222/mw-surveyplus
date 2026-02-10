"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Study, Interview, Report } from "@/types"
import { Button } from "@/components/ui/button"

export default function ReportPage() {
  const params = useParams()
  const router = useRouter()
  const studyId = params.id as string

  const [study, setStudy] = useState<Study | null>(null)
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [report, setReport] = useState<Report | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      .filter((i: any) => i.studyId === studyId && i.status === "complete")
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

    // Check if report already exists in localStorage
    const reports = JSON.parse(localStorage.getItem("reports") || "[]")
    const existingReport = reports.find((r: any) => r.studyId === studyId)
    if (existingReport) {
      setReport({
        ...existingReport,
        generatedAt: new Date(existingReport.generatedAt)
      })
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
        id: `report-${Date.now()}`,
        studyId: study.id,
        participantCount: interviews.length,
        avgDuration: `${avgMinutes}:${avgSecs.toString().padStart(2, "0")}`,
        executiveSummary: reportData.executiveSummary,
        findings: reportData.findings,
        unexpectedInsights: reportData.unexpectedInsights || [],
        furtherResearch: reportData.furtherResearch || [],
        generatedAt: new Date()
      }

      // Save to localStorage
      const reports = JSON.parse(localStorage.getItem("reports") || "[]")
      const updatedReports = reports.filter((r: any) => r.studyId !== studyId)
      updatedReports.push(newReport)
      localStorage.setItem("reports", JSON.stringify(updatedReports))

      setReport(newReport)
    } catch (error) {
      console.error("Error generating report:", error)
      setError(error instanceof Error ? error.message : "Failed to generate report")
    } finally {
      setIsGenerating(false)
    }
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
        <header className="border-b border-border bg-background/95 backdrop-blur">
          <div className="container mx-auto px-6 py-6 max-w-5xl">
            <Button variant="ghost" onClick={() => router.push("/")}>
              ← Dashboard
            </Button>
          </div>
        </header>
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
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-6 py-6 max-w-5xl">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-foreground mb-2">{study.name}</h1>
              <p className="text-sm text-muted-foreground">Research Report</p>
            </div>
            <Button variant="ghost" onClick={() => router.push("/")}>
              ← Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10 max-w-5xl">
        {!report ? (
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
        ) : (
          <div className="space-y-8 fade-up">
            {/* Meta Info */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>{report.participantCount} participants</span>
              <span>Avg duration: {report.avgDuration}</span>
              <span>Generated {report.generatedAt.toLocaleDateString()}</span>
              <button
                onClick={generateReport}
                disabled={isGenerating}
                className="ml-auto text-primary hover:underline"
              >
                {isGenerating ? "Regenerating..." : "Regenerate"}
              </button>
            </div>

            {/* Executive Summary */}
            <section className="rounded-lg border border-border bg-card p-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">Executive Summary</h2>
              <p className="text-foreground leading-relaxed">{report.executiveSummary}</p>
            </section>

            {/* Findings */}
            <section className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">Findings</h2>

              {report.findings.map((finding, idx) => (
                <div key={idx} className="rounded-lg border border-border bg-card p-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
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
                          <span className="text-sm text-muted-foreground whitespace-nowrap">
                            {theme.count} of {theme.total}
                          </span>
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
                <h2 className="text-xl font-semibold text-foreground mb-4">Unexpected Insights</h2>
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
                <h2 className="text-xl font-semibold text-foreground mb-4">Further Research</h2>
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
