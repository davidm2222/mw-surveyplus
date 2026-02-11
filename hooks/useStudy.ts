import { useState, useEffect, useCallback } from "react"
import { Study } from "@/types"
import {
  saveStudy as storeSaveStudy,
  getStudy as storeGetStudy,
  listStudies as storeListStudies,
  deleteStudy as storeDeleteStudy,
  updateStudyStatus as storeUpdateStudyStatus,
} from "@/lib/storage"
import { generateId } from "@/lib/utils"

/**
 * Hook for managing a single study
 * Returns study data and CRUD operations
 */
export function useStudy(studyId?: string) {
  const [study, setStudy] = useState<Study | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load study on mount or when ID changes
  useEffect(() => {
    if (!studyId) {
      setStudy(null)
      setLoading(false)
      return
    }

    try {
      const loadedStudy = storeGetStudy(studyId)
      if (loadedStudy) {
        setStudy(loadedStudy)
        setError(null)
      } else {
        setError("Study not found")
      }
    } catch (err) {
      setError("Failed to load study")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [studyId])

  // Create or update study
  const saveStudy = useCallback(
    (studyData: Partial<Study>): string => {
      try {
        const now = new Date()
        const studyToSave: Study = {
          id: studyData.id || generateId(),
          name: studyData.name || "",
          status: studyData.status || "draft",
          researchGoal: studyData.researchGoal || "",
          researchQuestions: studyData.researchQuestions || [],
          questionFramework: studyData.questionFramework || [],
          metadataFields: studyData.metadataFields,
          shareableLink: studyData.shareableLink,
          createdBy: studyData.createdBy || "user-1", // Default for local prototype
          createdAt: studyData.createdAt || now,
          updatedAt: now,
        }

        const savedId = storeSaveStudy(studyToSave)
        setStudy(studyToSave)
        setError(null)
        return savedId
      } catch (err) {
        const errorMsg = "Failed to save study"
        setError(errorMsg)
        console.error(err)
        throw new Error(errorMsg)
      }
    },
    []
  )

  // Update study status
  const updateStatus = useCallback(
    (newStatus: Study["status"]): boolean => {
      if (!study) return false

      try {
        const success = storeUpdateStudyStatus(study.id, newStatus)
        if (success) {
          setStudy({ ...study, status: newStatus, updatedAt: new Date() })
          setError(null)
        }
        return success
      } catch (err) {
        setError("Failed to update status")
        console.error(err)
        return false
      }
    },
    [study]
  )

  // Delete study
  const deleteStudy = useCallback(
    (id: string): boolean => {
      try {
        const success = storeDeleteStudy(id)
        if (success && study?.id === id) {
          setStudy(null)
        }
        setError(null)
        return success
      } catch (err) {
        setError("Failed to delete study")
        console.error(err)
        return false
      }
    },
    [study]
  )

  // Reload study from storage
  const reload = useCallback(() => {
    if (!studyId) return

    try {
      const loadedStudy = storeGetStudy(studyId)
      setStudy(loadedStudy)
      setError(null)
    } catch (err) {
      setError("Failed to reload study")
      console.error(err)
    }
  }, [studyId])

  return {
    study,
    loading,
    error,
    saveStudy,
    updateStatus,
    deleteStudy,
    reload,
  }
}

/**
 * Hook for managing list of studies
 * Returns studies array and refresh function
 */
export function useStudies() {
  const [studies, setStudies] = useState<Study[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load studies on mount
  const loadStudies = useCallback(() => {
    try {
      setLoading(true)
      const loadedStudies = storeListStudies()
      setStudies(loadedStudies)
      setError(null)
    } catch (err) {
      setError("Failed to load studies")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadStudies()
  }, [loadStudies])

  // Refresh studies from storage
  const refresh = useCallback(() => {
    loadStudies()
  }, [loadStudies])

  // Filter helpers
  const activeStudies = studies.filter((s) => s.status === "active")
  const draftStudies = studies.filter((s) => s.status === "draft")
  const completeStudies = studies.filter((s) => s.status === "complete")

  return {
    studies,
    activeStudies,
    draftStudies,
    completeStudies,
    loading,
    error,
    refresh,
  }
}
