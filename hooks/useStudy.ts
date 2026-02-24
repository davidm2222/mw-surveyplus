import { useState, useEffect, useCallback } from "react"
import { Study } from "@/types"
import {
  saveStudy as dbSaveStudy,
  getStudy as dbGetStudy,
  listStudies as dbListStudies,
  deleteStudy as dbDeleteStudy,
  updateStudyStatus as dbUpdateStudyStatus,
} from "@/lib/db"
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

    const load = async () => {
      try {
        const loadedStudy = await dbGetStudy(studyId)
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
    }

    load()
  }, [studyId])

  // Create or update study
  const saveStudy = useCallback(
    async (studyData: Partial<Study> & { researcherId: string }): Promise<string> => {
      try {
        const now = new Date()
        const studyToSave: Study = {
          id: studyData.id || generateId(),
          researcherId: studyData.researcherId,
          name: studyData.name || "",
          status: studyData.status || "draft",
          researchGoal: studyData.researchGoal || "",
          researchQuestions: studyData.researchQuestions || [],
          questionFramework: studyData.questionFramework || [],
          metadataFields: studyData.metadataFields,
          shareableLink: studyData.shareableLink,
          createdBy: studyData.createdBy || studyData.researcherId,
          createdAt: studyData.createdAt || now,
          updatedAt: now,
        }

        const savedId = await dbSaveStudy(studyToSave)
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
    async (newStatus: Study["status"]): Promise<boolean> => {
      if (!study) return false

      try {
        await dbUpdateStudyStatus(study.id, newStatus)
        setStudy({ ...study, status: newStatus, updatedAt: new Date() })
        setError(null)
        return true
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
    async (id: string): Promise<boolean> => {
      try {
        await dbDeleteStudy(id)
        if (study?.id === id) {
          setStudy(null)
        }
        setError(null)
        return true
      } catch (err) {
        setError("Failed to delete study")
        console.error(err)
        return false
      }
    },
    [study]
  )

  // Reload study from Firestore
  const reload = useCallback(async () => {
    if (!studyId) return

    try {
      const loadedStudy = await dbGetStudy(studyId)
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
 * Filters by researcherId so each researcher sees only their own studies.
 */
export function useStudies(researcherId: string) {
  const [studies, setStudies] = useState<Study[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadStudies = useCallback(async () => {
    if (!researcherId) {
      setStudies([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const loadedStudies = await dbListStudies(researcherId)
      setStudies(loadedStudies)
      setError(null)
    } catch (err) {
      setError("Failed to load studies")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [researcherId])

  useEffect(() => {
    loadStudies()
  }, [loadStudies])

  const refresh = useCallback(() => {
    loadStudies()
  }, [loadStudies])

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
