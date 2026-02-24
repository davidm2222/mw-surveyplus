"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { StudyCard } from "@/components/features/study-card"
import { EmptyState } from "@/components/features/empty-state"
import { ThemeToggle } from "@/components/features/theme-toggle"
import { Button } from "@/components/ui/button"
import { useStudies } from "@/hooks/useStudy"
import { deleteStudy } from "@/lib/db"

const RESEARCHER_ID_KEY = "surveyplus_researcher_id"

function getOrCreateResearcherId(): string {
  let id = localStorage.getItem(RESEARCHER_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(RESEARCHER_ID_KEY, id)
  }
  return id
}

export default function HomePage() {
  const router = useRouter()
  const [researcherId, setResearcherId] = useState<string>("")

  // Generate or retrieve researcherId on mount (client-side only)
  useEffect(() => {
    setResearcherId(getOrCreateResearcherId())
  }, [])

  const { studies, activeStudies, draftStudies, completeStudies, loading, refresh } = useStudies(researcherId)

  const handleCreateStudy = () => {
    router.push("/study/new")
  }

  const handleViewStudy = (studyId: string) => {
    console.log("View study:", studyId)
    // TODO: Navigate to report view
  }

  const handleEditStudy = (studyId: string) => {
    router.push(`/study/new?id=${studyId}`)
  }

  const handleDeleteStudy = async (studyId: string) => {
    await deleteStudy(studyId)
    refresh()
  }

  if (!researcherId || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-6 max-w-5xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-normal italic text-foreground mb-1">
                Your Studies
              </h1>
              <p className="text-sm text-muted-foreground">
                AI-moderated research interviews at scale
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button size="lg" onClick={handleCreateStudy}>
                + New Study
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10 max-w-5xl">
        {studies.length === 0 ? (
          <EmptyState onCreateStudy={handleCreateStudy} />
        ) : (
          <div className="space-y-10">
            {/* Active Studies */}
            {activeStudies.length > 0 && (
              <section className="fade-up">
                <h2 className="font-serif text-xl font-normal mb-4">
                  Active Studies
                  <span className="ml-2 text-sm font-sans font-normal text-muted-foreground">
                    ({activeStudies.length})
                  </span>
                </h2>
                <div className="grid gap-4">
                  {activeStudies.map((study) => (
                    <StudyCard
                      key={study.id}
                      study={study}
                      onView={handleViewStudy}
                      onEdit={handleEditStudy}
                      onDelete={handleDeleteStudy}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Draft Studies */}
            {draftStudies.length > 0 && (
              <section className="fade-up" style={{ animationDelay: "0.1s" }}>
                <h2 className="font-serif text-xl font-normal mb-4">
                  Drafts
                  <span className="ml-2 text-sm font-sans font-normal text-muted-foreground">
                    ({draftStudies.length})
                  </span>
                </h2>
                <div className="grid gap-4">
                  {draftStudies.map((study) => (
                    <StudyCard
                      key={study.id}
                      study={study}
                      onView={handleViewStudy}
                      onEdit={handleEditStudy}
                      onDelete={handleDeleteStudy}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Completed Studies */}
            {completeStudies.length > 0 && (
              <section className="fade-up" style={{ animationDelay: "0.2s" }}>
                <h2 className="font-serif text-xl font-normal mb-4">
                  Completed
                  <span className="ml-2 text-sm font-sans font-normal text-muted-foreground">
                    ({completeStudies.length})
                  </span>
                </h2>
                <div className="grid gap-4">
                  {completeStudies.map((study) => (
                    <StudyCard
                      key={study.id}
                      study={study}
                      onView={handleViewStudy}
                      onEdit={handleEditStudy}
                      onDelete={handleDeleteStudy}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
