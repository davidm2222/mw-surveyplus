import { useState, useEffect, useCallback } from "react"
import { Interview, Message } from "@/types"
import {
  saveInterview as storeSaveInterview,
  getInterview as storeGetInterview,
  getInterviews as storeGetInterviews,
  deleteInterview as storeDeleteInterview,
} from "@/lib/storage"
import { generateId } from "@/lib/utils"

/**
 * Hook for managing a single interview
 * Returns interview data and operations for conducting an interview
 */
export function useInterview(interviewId?: string) {
  const [interview, setInterview] = useState<Interview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load interview on mount or when ID changes
  useEffect(() => {
    if (!interviewId) {
      setInterview(null)
      setLoading(false)
      return
    }

    try {
      const loadedInterview = storeGetInterview(interviewId)
      if (loadedInterview) {
        setInterview(loadedInterview)
        setError(null)
      } else {
        setError("Interview not found")
      }
    } catch (err) {
      setError("Failed to load interview")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [interviewId])

  // Create new interview
  const startInterview = useCallback(
    (studyId: string, participantMetadata?: Record<string, string>): string => {
      try {
        const now = new Date()
        const newInterview: Interview = {
          id: generateId(),
          studyId,
          participantMetadata,
          messages: [],
          status: "in_progress",
          duration: 0,
          startedAt: now,
        }

        const savedId = storeSaveInterview(newInterview)
        setInterview(newInterview)
        setError(null)
        return savedId
      } catch (err) {
        const errorMsg = "Failed to start interview"
        setError(errorMsg)
        console.error(err)
        throw new Error(errorMsg)
      }
    },
    []
  )

  // Add message to interview
  const addMessage = useCallback(
    (message: Omit<Message, "timestamp">) => {
      if (!interview) return

      try {
        const newMessage: Message = {
          ...message,
          timestamp: new Date(),
        }

        const updatedInterview: Interview = {
          ...interview,
          messages: [...interview.messages, newMessage],
          duration: Math.floor(
            (new Date().getTime() - interview.startedAt.getTime()) / 1000
          ),
        }

        storeSaveInterview(updatedInterview)
        setInterview(updatedInterview)
        setError(null)
      } catch (err) {
        setError("Failed to add message")
        console.error(err)
      }
    },
    [interview]
  )

  // Complete interview
  const completeInterview = useCallback(() => {
    if (!interview) return

    try {
      const now = new Date()
      const updatedInterview: Interview = {
        ...interview,
        status: "complete",
        completedAt: now,
        duration: Math.floor(
          (now.getTime() - interview.startedAt.getTime()) / 1000
        ),
      }

      storeSaveInterview(updatedInterview)
      setInterview(updatedInterview)
      setError(null)
    } catch (err) {
      setError("Failed to complete interview")
      console.error(err)
    }
  }, [interview])

  // Abandon interview
  const abandonInterview = useCallback(() => {
    if (!interview) return

    try {
      const now = new Date()
      const updatedInterview: Interview = {
        ...interview,
        status: "abandoned",
        completedAt: now,
        duration: Math.floor(
          (now.getTime() - interview.startedAt.getTime()) / 1000
        ),
      }

      storeSaveInterview(updatedInterview)
      setInterview(updatedInterview)
      setError(null)
    } catch (err) {
      setError("Failed to abandon interview")
      console.error(err)
    }
  }, [interview])

  // Update AI summary
  const updateSummary = useCallback(
    (summary: string) => {
      if (!interview) return

      try {
        const updatedInterview: Interview = {
          ...interview,
          aiSummary: summary,
        }

        storeSaveInterview(updatedInterview)
        setInterview(updatedInterview)
        setError(null)
      } catch (err) {
        setError("Failed to update summary")
        console.error(err)
      }
    },
    [interview]
  )

  return {
    interview,
    loading,
    error,
    startInterview,
    addMessage,
    completeInterview,
    abandonInterview,
    updateSummary,
  }
}

/**
 * Hook for managing interviews for a specific study
 * Returns interviews array and statistics
 */
export function useInterviews(studyId: string) {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load interviews on mount or when study ID changes
  const loadInterviews = useCallback(() => {
    if (!studyId) {
      setInterviews([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const loadedInterviews = storeGetInterviews(studyId)
      setInterviews(loadedInterviews)
      setError(null)
    } catch (err) {
      setError("Failed to load interviews")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [studyId])

  useEffect(() => {
    loadInterviews()
  }, [loadInterviews])

  // Refresh interviews from storage
  const refresh = useCallback(() => {
    loadInterviews()
  }, [loadInterviews])

  // Delete interview
  const deleteInterview = useCallback(
    (interviewId: string): boolean => {
      try {
        const success = storeDeleteInterview(interviewId)
        if (success) {
          setInterviews(interviews.filter((i) => i.id !== interviewId))
        }
        setError(null)
        return success
      } catch (err) {
        setError("Failed to delete interview")
        console.error(err)
        return false
      }
    },
    [interviews]
  )

  // Calculate statistics
  const stats = {
    total: interviews.length,
    complete: interviews.filter((i) => i.status === "complete").length,
    inProgress: interviews.filter((i) => i.status === "in_progress").length,
    abandoned: interviews.filter((i) => i.status === "abandoned").length,
    avgDuration:
      interviews.length > 0
        ? Math.floor(
            interviews.reduce((sum, i) => sum + i.duration, 0) /
              interviews.length
          )
        : 0,
    completionRate:
      interviews.length > 0
        ? Math.round(
            (interviews.filter((i) => i.status === "complete").length /
              interviews.length) *
              100
          )
        : 0,
  }

  // Filter helpers
  const completeInterviews = interviews.filter((i) => i.status === "complete")
  const inProgressInterviews = interviews.filter(
    (i) => i.status === "in_progress"
  )
  const abandonedInterviews = interviews.filter((i) => i.status === "abandoned")

  return {
    interviews,
    completeInterviews,
    inProgressInterviews,
    abandonedInterviews,
    stats,
    loading,
    error,
    refresh,
    deleteInterview,
  }
}
