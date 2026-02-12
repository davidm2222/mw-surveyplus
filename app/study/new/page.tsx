"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Textarea, Button } from "@/components/ui"
import { ThemeToggle } from "@/components/features/theme-toggle"
import { useStudy } from "@/hooks/useStudy"
import { Study } from "@/types"

export default function NewStudyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editingId = searchParams.get("id")

  const { study: existingStudy, saveStudy, error: studyError } = useStudy(editingId || undefined)

  const [activeTier, setActiveTier] = useState(0)
  const [studyId, setStudyId] = useState<string | null>(editingId)
  const [name, setName] = useState("")
  const [goal, setGoal] = useState("")
  const [researchQuestions, setResearchQuestions] = useState(["", "", ""])
  const [questionFramework, setQuestionFramework] = useState(["", "", "", ""])
  const [saving, setSaving] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const savingRef = useRef(false)

  // Load existing study data if editing (only on mount)
  useEffect(() => {
    if (existingStudy && !name && !goal) {
      setName(existingStudy.name)
      setGoal(existingStudy.researchGoal)
      setResearchQuestions(existingStudy.researchQuestions.length > 0 ? existingStudy.researchQuestions : ["", "", ""])
      setQuestionFramework(existingStudy.questionFramework.length > 0 ? existingStudy.questionFramework : ["", "", "", ""])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingStudy?.id]) // Only run when study ID changes, not on every update

  // Auto-save draft whenever data changes
  const handleSaveDraft = useCallback(() => {
    if (savingRef.current) return

    try {
      savingRef.current = true
      setSaving(true)
      const filledQuestions = researchQuestions.filter(q => q.trim())
      const filledPrompts = questionFramework.filter(q => q.trim())

      const id = saveStudy({
        id: studyId || undefined,
        name: name.trim() || "Untitled Study",
        researchGoal: goal.trim(),
        researchQuestions: filledQuestions,
        questionFramework: filledPrompts,
        status: "draft",
      })

      if (!studyId) {
        setStudyId(id)
      }
    } catch (err) {
      console.error("Auto-save failed:", err)
    } finally {
      savingRef.current = false
      setSaving(false)
    }
  }, [name, goal, researchQuestions, questionFramework, studyId, saveStudy])

  useEffect(() => {
    // Only auto-save if there's meaningful content (not just empty arrays)
    const hasContent = name.trim() || goal.trim() ||
                       researchQuestions.some(q => q.trim()) ||
                       questionFramework.some(q => q.trim())

    if (!hasContent) return

    const autoSave = setTimeout(() => {
      handleSaveDraft()
    }, 1500) // Debounce by 1.5 seconds to avoid conflicts

    return () => clearTimeout(autoSave)
  }, [name, goal, researchQuestions, questionFramework, handleSaveDraft])

  // Validation function
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!name.trim()) {
      errors.name = "Study name is required"
    }

    if (!goal.trim()) {
      errors.goal = "Research goal is required"
    } else if (goal.trim().length < 10) {
      errors.goal = "Research goal must be at least 10 characters"
    }

    const filledQuestions = researchQuestions.filter(q => q.trim())
    if (filledQuestions.length < 1) {
      errors.questions = "Add at least 1 research question"
    } else if (filledQuestions.length > 6) {
      errors.questions = "Maximum 6 research questions allowed"
    }

    const filledPrompts = questionFramework.filter(q => q.trim())
    if (filledPrompts.length < 1) {
      errors.framework = "Add at least 1 interview prompt"
    } else if (filledPrompts.length > 8) {
      errors.framework = "Maximum 8 interview prompts allowed"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const updateQuestion = (index: number, value: string) => {
    const updated = [...researchQuestions]
    updated[index] = value
    setResearchQuestions(updated)
  }

  const addQuestion = () => {
    if (researchQuestions.length >= 6) return
    setResearchQuestions([...researchQuestions, ""])
  }

  const removeQuestion = (index: number) => {
    if (researchQuestions.length <= 1) return
    setResearchQuestions(researchQuestions.filter((_, i) => i !== index))
  }

  const updatePrompt = (index: number, value: string) => {
    const updated = [...questionFramework]
    updated[index] = value
    setQuestionFramework(updated)
  }

  const addPrompt = () => {
    if (questionFramework.length >= 8) return
    setQuestionFramework([...questionFramework, ""])
  }

  const removePrompt = (index: number) => {
    if (questionFramework.length <= 1) return
    setQuestionFramework(questionFramework.filter((_, i) => i !== index))
  }

  // Drag and drop handlers for framework questions
  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === dropIndex) return

    const items = [...questionFramework]
    const draggedItem = items[draggedIndex]
    items.splice(draggedIndex, 1)
    items.splice(dropIndex, 0, draggedItem)

    setQuestionFramework(items)
    setDraggedIndex(null)
  }

  const handleLaunch = () => {
    // Validate form
    if (!validateForm()) {
      // Navigate to the first tier with errors
      if (validationErrors.name || validationErrors.goal) {
        setActiveTier(0)
      } else if (validationErrors.questions) {
        setActiveTier(1)
      } else if (validationErrors.framework) {
        setActiveTier(2)
      }
      return
    }

    try {
      const filledQuestions = researchQuestions.filter(q => q.trim())
      const filledPrompts = questionFramework.filter(q => q.trim())

      const id = saveStudy({
        id: studyId || undefined,
        name: name.trim(),
        researchGoal: goal.trim(),
        researchQuestions: filledQuestions,
        questionFramework: filledPrompts,
        status: "active",
      })

      // Navigate to monitor page
      router.push(`/study/${id}/monitor`)
    } catch (err) {
      console.error("Failed to launch study:", err)
      alert("Failed to save study. Please try again.")
    }
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
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h1 className="font-serif text-3xl font-normal text-foreground mb-2">
                Study Setup
              </h1>
              <p className="text-muted-foreground">
                Define your research framework. Each tier informs the next.
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Study Name */}
        <div className="mb-6 fade-up" style={{ animationDelay: "0.05s" }}>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-foreground">
              Study Name
            </label>
            {saving && (
              <span className="text-xs text-muted-foreground">Saving...</span>
            )}
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Customer Onboarding Research"
            className={`w-full rounded-lg border ${
              validationErrors.name ? "border-red-500" : "border-border"
            } bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary`}
          />
          {validationErrors.name && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.name}</p>
          )}
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
                className={validationErrors.goal ? "border-red-500" : ""}
              />
              {validationErrors.goal && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.goal}</p>
              )}

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

              <div className="flex items-center justify-between mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={addQuestion}
                  disabled={researchQuestions.length >= 6}
                >
                  + Add Question
                </Button>
                <span className="text-xs text-muted-foreground">
                  {researchQuestions.filter(q => q.trim()).length} of 1-6 questions
                </span>
              </div>
              {validationErrors.questions && (
                <p className="mt-2 text-sm text-red-500">{validationErrors.questions}</p>
              )}
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

              <div className="mb-3 text-xs text-muted-foreground">
                💡 Drag to reorder questions
              </div>

              <div className="space-y-3">
                {questionFramework.map((prompt, i) => (
                  <div
                    key={i}
                    draggable
                    onDragStart={() => handleDragStart(i)}
                    onDragOver={(e) => handleDragOver(e, i)}
                    onDrop={(e) => handleDrop(e, i)}
                    className={`flex gap-3 items-start transition-opacity ${
                      draggedIndex === i ? "opacity-50" : "opacity-100"
                    } cursor-move`}
                  >
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

              <div className="flex items-center justify-between mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={addPrompt}
                  disabled={questionFramework.length >= 8}
                >
                  + Add Prompt
                </Button>
                <span className="text-xs text-muted-foreground">
                  {questionFramework.filter(q => q.trim()).length} of 1-8 prompts
                </span>
              </div>
              {validationErrors.framework && (
                <p className="mt-2 text-sm text-red-500">{validationErrors.framework}</p>
              )}
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
                Launch Study →
              </Button>
            )}
          </div>
        </div>

        {/* Show errors at bottom if validation fails */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm font-medium text-red-800 mb-2">
              Please fix the following issues:
            </p>
            <ul className="text-sm text-red-700 space-y-1">
              {Object.values(validationErrors).map((error, i) => (
                <li key={i}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
