"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Study } from "@/types"
import { StudyCard } from "@/components/features/study-card"
import { EmptyState } from "@/components/features/empty-state"
import { Button } from "@/components/ui/button"

// Sample data for demonstration
const SAMPLE_STUDIES: Study[] = [
  {
    id: "1",
    name: "Onboarding Experience Research",
    status: "active",
    researchGoal: "Understand why new users abandon the onboarding flow in the first week and identify the key friction points that prevent them from reaching their first successful project.",
    researchQuestions: [
      "What expectations do new users bring to the product?",
      "At what specific moments do users feel confused or frustrated?",
      "What would success in the first week look like from the user's perspective?",
      "What external resources do users seek out?"
    ],
    questionFramework: [
      "Tell me about your first experience with the product.",
      "Walk me through a moment where you felt stuck.",
      "How did you try to figure things out when you got stuck?",
      "Describe what a successful first week would have looked like.",
      "What would you change about the getting-started experience?"
    ],
    createdBy: "user-1",
    createdAt: new Date("2026-01-15"),
    updatedAt: new Date("2026-02-08")
  },
  {
    id: "2",
    name: "Feature Discovery Study",
    status: "complete",
    researchGoal: "Learn how users discover and adopt advanced features, and what prevents them from exploring beyond basic functionality.",
    researchQuestions: [
      "How do users currently discover new features?",
      "What motivates users to explore beyond the basics?",
      "What barriers prevent feature adoption?"
    ],
    questionFramework: [
      "How do you typically learn about new features?",
      "Tell me about a time you discovered something new in the product.",
      "What stops you from trying new features?"
    ],
    createdBy: "user-1",
    createdAt: new Date("2026-01-10"),
    updatedAt: new Date("2026-01-28")
  },
  {
    id: "3",
    name: "Mobile App Usability",
    status: "draft",
    researchGoal: "Identify usability issues in the mobile app and understand how mobile usage patterns differ from desktop.",
    researchQuestions: [
      "What tasks do users perform on mobile vs desktop?",
      "What are the main pain points in the mobile experience?"
    ],
    questionFramework: [],
    createdBy: "user-1",
    createdAt: new Date("2026-02-05"),
    updatedAt: new Date("2026-02-05")
  }
]

export default function HomePage() {
  const router = useRouter()
  const [studies, setStudies] = useState<Study[]>([])

  // Load studies from localStorage on mount
  useEffect(() => {
    const loadedStudies = JSON.parse(localStorage.getItem("studies") || "[]")
    // Convert date strings back to Date objects
    const studiesWithDates = loadedStudies.map((s: any) => ({
      ...s,
      createdAt: new Date(s.createdAt),
      updatedAt: new Date(s.updatedAt)
    }))
    setStudies(studiesWithDates.length > 0 ? studiesWithDates : SAMPLE_STUDIES)
  }, [])

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

  // Separate studies by status
  const activeStudies = studies.filter(s => s.status === "active")
  const draftStudies = studies.filter(s => s.status === "draft")
  const completedStudies = studies.filter(s => s.status === "complete")

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
            <Button size="lg" onClick={handleCreateStudy}>
              + New Study
            </Button>
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
                <h2 className="text-xl font-semibold mb-4">
                  Active Studies
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
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
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Draft Studies */}
            {draftStudies.length > 0 && (
              <section className="fade-up" style={{ animationDelay: "0.1s" }}>
                <h2 className="text-xl font-semibold mb-4">
                  Drafts
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
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
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Completed Studies */}
            {completedStudies.length > 0 && (
              <section className="fade-up" style={{ animationDelay: "0.2s" }}>
                <h2 className="text-xl font-semibold mb-4">
                  Completed
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({completedStudies.length})
                  </span>
                </h2>
                <div className="grid gap-4">
                  {completedStudies.map((study) => (
                    <StudyCard
                      key={study.id}
                      study={study}
                      onView={handleViewStudy}
                      onEdit={handleEditStudy}
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
