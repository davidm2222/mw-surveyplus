"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Textarea, Button } from "@/components/ui"
import { useStudy } from "@/hooks/useStudy"
import { StudyTabs } from "@/components/features/study-tabs"
import { StudyContext } from "@/components/features/study-context"

export default function EditStudyPage() {
  const params = useParams()
  const router = useRouter()
  const studyId = params.id as string

  const { study: existingStudy, saveStudy, loading } = useStudy(studyId)

  const [activeTier, setActiveTier] = useState(0)
  const [name, setName] = useState("")
  const [goal, setGoal] = useState("")
  const [researchQuestions, setResearchQuestions] = useState(["", "", ""])
  const [questionFramework, setQuestionFramework] = useState(["", "", "", ""])
  const [saving, setSaving] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const savingRef = useRef(false)

  // Load existing study data
  useEffect(() => {
    if (existingStudy && !name && !goal) {
      setName(existingStudy.name)
      setGoal(existingStudy.researchGoal)
      setResearchQuestions(existingStudy.researchQuestions.length > 0 ? existingStudy.researchQuestions : ["", "", ""])
      setQuestionFramework(existingStudy.questionFramework.length > 0 ? existingStudy.questionFramework : ["", "", "", ""])
    }
  }, [existingStudy?.id])

  // Auto-save draft whenever data changes
  const handleSaveDraft = useCallback(() => {
    if (savingRef.current) return

    try {
      savingRef.current = true
      setSaving(true)
      const filledQuestions = researchQuestions.filter(q => q.trim())
      const filledPrompts = questionFramework.filter(q => q.trim())

      saveStudy({
        id: studyId,
        name: name.trim() || "Untitled Study",
        researchGoal: goal.trim(),
        researchQuestions: filledQuestions,
        questionFramework: filledPrompts,
        status: existingStudy?.status || "draft",
      })
    } catch (err) {
      console.error("Auto-save failed:", err)
    } finally {
      savingRef.current = false
      setSaving(false)
    }
  }, [name, goal, researchQuestions, questionFramework, studyId, saveStudy, existingStudy?.status])

  useEffect(() => {
    const hasContent = name.trim() || goal.trim() ||
                       researchQuestions.some(q => q.trim()) ||
                       questionFramework.some(q => q.trim())

    if (!hasContent) return

    const autoSave = setTimeout(() => {
      handleSaveDraft()
    }, 1500)

    return () => clearTimeout(autoSave)
  }, [name, goal, researchQuestions, questionFramework, handleSaveDraft])

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

  const handleSaveAndContinue = () => {
    if (!validateForm()) {
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

      saveStudy({
        id: studyId,
        name: name.trim(),
        researchGoal: goal.trim(),
        researchQuestions: filledQuestions,
        questionFramework: filledPrompts,
        status: "active",
      })

      router.push(`/study/${studyId}/monitor`)
    } catch (err) {
      console.error("Failed to save study:", err)
      alert("Failed to save study. Please try again.")
    }
  }

  if (loading || !existingStudy) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading study...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Study Tabs Navigation */}
      <StudyTabs study={existingStudy} />

      {/* Study Context (shareable link, etc) */}
      <StudyContext study={existingStudy} />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-3xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">Study Setup</h2>
            <p className="text-sm text-muted-foreground">
              Edit your research framework below. Changes auto-save.
              {saving && <span className="ml-2 text-primary">Saving...</span>}
            </p>
          </div>

          {/* Tier 0: Study Name & Research Goal */}
          <div className="rounded-lg border border-border bg-card">
            <button
              onClick={() => setActiveTier(activeTier === 0 ? -1 : 0)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="text-left">
                <h3 className="font-medium text-foreground">Study Name & Research Goal</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {name || "What are you trying to learn?"}
                </p>
              </div>
              <span className="text-muted-foreground text-xl">
                {activeTier === 0 ? "−" : "+"}
              </span>
            </button>

            {activeTier === 0 && (
              <div className="px-6 pb-6 space-y-4 border-t border-border">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Study Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Q1 2025 Onboarding Study"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  {validationErrors.name && (
                    <p className="text-sm text-destructive mt-1">{validationErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Research Goal
                  </label>
                  <Textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="Example: Understand why users abandon the onboarding flow before completing account setup"
                    rows={4}
                    className="resize-none"
                  />
                  {validationErrors.goal && (
                    <p className="text-sm text-destructive mt-1">{validationErrors.goal}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Tier 1: Research Questions */}
          <div className="rounded-lg border border-border bg-card">
            <button
              onClick={() => setActiveTier(activeTier === 1 ? -1 : 1)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="text-left">
                <h3 className="font-medium text-foreground">Research Questions</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {researchQuestions.filter(q => q.trim()).length} questions defined
                </p>
              </div>
              <span className="text-muted-foreground text-xl">
                {activeTier === 1 ? "−" : "+"}
              </span>
            </button>

            {activeTier === 1 && (
              <div className="px-6 pb-6 space-y-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  What specific questions are you trying to answer through this research?
                </p>
                {researchQuestions.map((question, index) => (
                  <div key={index} className="flex gap-2">
                    <Textarea
                      value={question}
                      onChange={(e) => updateQuestion(index, e.target.value)}
                      placeholder={`Research question ${index + 1}`}
                      rows={2}
                      className="flex-1 resize-none"
                    />
                    {researchQuestions.length > 1 && (
                      <button
                        onClick={() => removeQuestion(index)}
                        className="px-3 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                {validationErrors.questions && (
                  <p className="text-sm text-destructive">{validationErrors.questions}</p>
                )}
                {researchQuestions.length < 6 && (
                  <Button variant="outline" onClick={addQuestion} className="w-full">
                    + Add Question
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Tier 2: Question Framework */}
          <div className="rounded-lg border border-border bg-card">
            <button
              onClick={() => setActiveTier(activeTier === 2 ? -1 : 2)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="text-left">
                <h3 className="font-medium text-foreground">Interview Question Framework</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {questionFramework.filter(q => q.trim()).length} interview prompts
                </p>
              </div>
              <span className="text-muted-foreground text-xl">
                {activeTier === 2 ? "−" : "+"}
              </span>
            </button>

            {activeTier === 2 && (
              <div className="px-6 pb-6 space-y-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  What questions will the AI ask participants? Drag to reorder.
                </p>
                {questionFramework.map((prompt, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    className="flex gap-2 items-start cursor-move"
                  >
                    <span className="text-muted-foreground mt-3 select-none">
                      {index + 1}.
                    </span>
                    <Textarea
                      value={prompt}
                      onChange={(e) => updatePrompt(index, e.target.value)}
                      placeholder={`Interview question ${index + 1}`}
                      rows={2}
                      className="flex-1 resize-none"
                    />
                    {questionFramework.length > 1 && (
                      <button
                        onClick={() => removePrompt(index)}
                        className="px-3 text-muted-foreground hover:text-destructive transition-colors mt-2"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                {validationErrors.framework && (
                  <p className="text-sm text-destructive">{validationErrors.framework}</p>
                )}
                {questionFramework.length < 8 && (
                  <Button variant="outline" onClick={addPrompt} className="w-full">
                    + Add Question
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => router.push(`/study/${studyId}/monitor`)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveAndContinue}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
