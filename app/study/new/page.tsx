"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Textarea, Button } from "@/components/ui"
import { generateId } from "@/lib/utils"

interface StudyData {
  id: string
  name: string
  goal: string
  researchQuestions: string[]
  questionFramework: string[]
  status: "draft" | "active"
  createdAt: Date
}

export default function NewStudyPage() {
  const router = useRouter()
  const [activeTier, setActiveTier] = useState(0)
  const [name, setName] = useState("")
  const [goal, setGoal] = useState("")
  const [researchQuestions, setResearchQuestions] = useState(["", "", ""])
  const [questionFramework, setQuestionFramework] = useState(["", "", "", ""])

  const updateQuestion = (index: number, value: string) => {
    const updated = [...researchQuestions]
    updated[index] = value
    setResearchQuestions(updated)
  }

  const addQuestion = () => {
    setResearchQuestions([...researchQuestions, ""])
  }

  const removeQuestion = (index: number) => {
    setResearchQuestions(researchQuestions.filter((_, i) => i !== index))
  }

  const updatePrompt = (index: number, value: string) => {
    const updated = [...questionFramework]
    updated[index] = value
    setQuestionFramework(updated)
  }

  const addPrompt = () => {
    setQuestionFramework([...questionFramework, ""])
  }

  const removePrompt = (index: number) => {
    setQuestionFramework(questionFramework.filter((_, i) => i !== index))
  }

  const handleLaunch = () => {
    // Basic validation
    if (!name.trim()) {
      alert("Please enter a study name")
      return
    }
    if (!goal.trim() || goal.trim().length < 50) {
      alert("Research goal must be at least 50 characters")
      setActiveTier(0)
      return
    }

    const filledQuestions = researchQuestions.filter(q => q.trim())
    if (filledQuestions.length === 0) {
      alert("Please add at least one research question")
      setActiveTier(1)
      return
    }

    const filledPrompts = questionFramework.filter(p => p.trim())
    if (filledPrompts.length === 0) {
      alert("Please add at least one question prompt")
      setActiveTier(2)
      return
    }

    // Create study
    const study: StudyData = {
      id: generateId(),
      name: name.trim(),
      goal: goal.trim(),
      researchQuestions: filledQuestions,
      questionFramework: filledPrompts,
      status: "active",
      createdAt: new Date(),
    }

    // Save to localStorage
    const studies = JSON.parse(localStorage.getItem("studies") || "[]")
    studies.push(study)
    localStorage.setItem("studies", JSON.stringify(studies))

    // Redirect to dashboard
    router.push("/")
  }

  // Collapsed tier preview
  const CollapsedTier = ({
    num,
    title,
    content,
    isList
  }: {
    num: number
    title: string
    content: string | string[]
    isList?: boolean
  }) => (
    <div
      onClick={() => setActiveTier(num - 1)}
      className="cursor-pointer rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Tier {num} — {title}
        </span>
        <span className="text-sm font-medium text-primary">Edit ↗</span>
      </div>

      {!isList && typeof content === "string" && content && (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {content}
        </p>
      )}

      {isList && Array.isArray(content) && content.filter(q => q.trim()).length > 0 && (
        <div className="space-y-1">
          {content.filter(q => q.trim()).map((item, i) => (
            <div key={i} className="text-xs text-muted-foreground truncate">
              <span className="text-muted-foreground/60 mr-2">{i + 1}.</span>
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 fade-up">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Create New Study
          </h1>
          <p className="text-muted-foreground">
            Define your research framework. Each tier informs the next.
          </p>
        </div>

        {/* Study Name */}
        <div className="mb-6 fade-up" style={{ animationDelay: "0.05s" }}>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Study Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Customer Onboarding Research"
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
          />
        </div>

        {/* Tiers */}
        <div className="space-y-3">
          {/* Tier 1: Research Goal */}
          {activeTier === 0 ? (
            <div className="rounded-lg border border-border bg-card p-6 fade-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">
                    Tier 1 — Research Goal
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The overarching purpose of your study.
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Active
                </span>
              </div>

              <p className="text-sm italic text-muted-foreground mb-3">
                After this study, I want to understand...
              </p>

              <Textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="...why new users abandon the onboarding flow in the first week and identify the key friction points."
                rows={4}
                maxCharCount={500}
                showCharCount
              />

              <div className="mt-3 rounded-lg bg-muted/30 p-3 text-sm text-muted-foreground">
                💡 A strong goal is specific enough to guide analysis but broad enough for unexpected discoveries.
              </div>
            </div>
          ) : (
            <CollapsedTier num={1} title="Research Goal" content={goal} />
          )}

          {/* Tier 2: Research Questions */}
          {activeTier === 1 ? (
            <div className="rounded-lg border border-border bg-card p-6 fade-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">
                    Tier 2 — Research Questions
                  </div>
                  <p className="text-sm text-muted-foreground">
                    What questions, if answered, would help move the project forward?
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Active
                </span>
              </div>

              <div className="space-y-3">
                {researchQuestions.map((question, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="flex-shrink-0 w-8 h-10 flex items-center justify-center">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                        {i + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <Textarea
                        value={question}
                        onChange={(e) => updateQuestion(i, e.target.value)}
                        placeholder="e.g., Is the new feature discoverable?"
                        rows={2}
                      />
                    </div>
                    {researchQuestions.length > 1 && (
                      <button
                        onClick={() => removeQuestion(i)}
                        className="flex-shrink-0 text-muted-foreground hover:text-foreground text-xl px-2 mt-2"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <Button variant="ghost" size="sm" onClick={addQuestion} className="mt-3">
                + Add Question
              </Button>
            </div>
          ) : (
            <CollapsedTier num={2} title="Research Questions" content={researchQuestions} isList />
          )}

          {/* Tier 3: Question Framework */}
          {activeTier === 2 ? (
            <div className="rounded-lg border border-border bg-card p-6 fade-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">
                    Tier 3 — Question Framework
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Guide how the AI should ask follow-up questions during interviews.
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Active
                </span>
              </div>

              <div className="space-y-3">
                {questionFramework.map((prompt, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="flex-shrink-0 w-8 h-10 flex items-center justify-center">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-accent/10 text-accent text-sm font-semibold">
                        Q{i + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <Textarea
                        value={prompt}
                        onChange={(e) => updatePrompt(i, e.target.value)}
                        placeholder="e.g., Tell me about your first experience with the product. What were you trying to accomplish?"
                        rows={2}
                      />
                    </div>
                    {questionFramework.length > 1 && (
                      <button
                        onClick={() => removePrompt(i)}
                        className="flex-shrink-0 text-muted-foreground hover:text-foreground text-xl px-2 mt-2"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <Button variant="ghost" size="sm" onClick={addPrompt} className="mt-3">
                + Add Prompt
              </Button>
            </div>
          ) : (
            <CollapsedTier num={3} title="Question Framework" content={questionFramework} isList />
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
          <Button variant="ghost" onClick={() => router.push("/")}>
            Cancel
          </Button>
          <div className="flex items-center gap-3">
            {activeTier > 0 && (
              <Button variant="outline" onClick={() => setActiveTier(activeTier - 1)}>
                ← Previous Tier
              </Button>
            )}
            {activeTier < 2 ? (
              <Button onClick={() => setActiveTier(activeTier + 1)}>
                Next Tier →
              </Button>
            ) : (
              <Button onClick={handleLaunch}>
                Launch Study
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
