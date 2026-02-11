import { Study, Interview, Report } from "@/types"

// ============================================================
// Storage Keys
// ============================================================

const STORAGE_KEYS = {
  STUDIES: "surveyplus_studies",
  INTERVIEWS: "surveyplus_interviews",
  REPORTS: "surveyplus_reports",
} as const

// ============================================================
// Serialization Helpers
// ============================================================

/**
 * Serialize data for localStorage (convert Dates to ISO strings)
 */
function serialize<T>(data: T): string {
  return JSON.stringify(data, (key, value) => {
    if (value instanceof Date) {
      return value.toISOString()
    }
    return value
  })
}

/**
 * Deserialize data from localStorage (convert ISO strings back to Dates)
 */
function deserialize<T>(json: string): T {
  return JSON.parse(json, (key, value) => {
    // Convert ISO date strings back to Date objects
    if (
      typeof value === "string" &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
    ) {
      return new Date(value)
    }
    return value
  })
}

// ============================================================
// Study Operations
// ============================================================

export function saveStudy(study: Study): string {
  try {
    const studies = listStudies()
    const existingIndex = studies.findIndex((s) => s.id === study.id)

    if (existingIndex >= 0) {
      // Update existing study
      studies[existingIndex] = { ...study, updatedAt: new Date() }
    } else {
      // Add new study
      studies.push(study)
    }

    localStorage.setItem(STORAGE_KEYS.STUDIES, serialize(studies))
    return study.id
  } catch (error) {
    console.error("Failed to save study:", error)
    throw new Error("Failed to save study to localStorage")
  }
}

export function getStudy(id: string): Study | null {
  try {
    const studies = listStudies()
    return studies.find((s) => s.id === id) || null
  } catch (error) {
    console.error("Failed to get study:", error)
    return null
  }
}

export function listStudies(): Study[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.STUDIES)
    if (!data) return []
    return deserialize<Study[]>(data)
  } catch (error) {
    console.error("Failed to list studies:", error)
    return []
  }
}

export function deleteStudy(id: string): boolean {
  try {
    const studies = listStudies()
    const filtered = studies.filter((s) => s.id !== id)

    if (filtered.length === studies.length) {
      return false // Study not found
    }

    localStorage.setItem(STORAGE_KEYS.STUDIES, serialize(filtered))

    // Also delete associated interviews and report
    const interviews = getInterviews(id)
    interviews.forEach((interview) => deleteInterview(interview.id))
    deleteReport(id)

    return true
  } catch (error) {
    console.error("Failed to delete study:", error)
    return false
  }
}

export function updateStudyStatus(
  id: string,
  status: Study["status"]
): boolean {
  try {
    const study = getStudy(id)
    if (!study) return false

    study.status = status
    study.updatedAt = new Date()
    saveStudy(study)
    return true
  } catch (error) {
    console.error("Failed to update study status:", error)
    return false
  }
}

// ============================================================
// Interview Operations
// ============================================================

export function saveInterview(interview: Interview): string {
  try {
    const interviews = getAllInterviews()
    const existingIndex = interviews.findIndex((i) => i.id === interview.id)

    if (existingIndex >= 0) {
      // Update existing interview
      interviews[existingIndex] = interview
    } else {
      // Add new interview
      interviews.push(interview)
    }

    localStorage.setItem(STORAGE_KEYS.INTERVIEWS, serialize(interviews))
    return interview.id
  } catch (error) {
    console.error("Failed to save interview:", error)
    throw new Error("Failed to save interview to localStorage")
  }
}

export function getInterview(id: string): Interview | null {
  try {
    const interviews = getAllInterviews()
    return interviews.find((i) => i.id === id) || null
  } catch (error) {
    console.error("Failed to get interview:", error)
    return null
  }
}

export function getInterviews(studyId: string): Interview[] {
  try {
    const interviews = getAllInterviews()
    return interviews.filter((i) => i.studyId === studyId)
  } catch (error) {
    console.error("Failed to get interviews for study:", error)
    return []
  }
}

function getAllInterviews(): Interview[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.INTERVIEWS)
    if (!data) return []
    return deserialize<Interview[]>(data)
  } catch (error) {
    console.error("Failed to list interviews:", error)
    return []
  }
}

export function deleteInterview(id: string): boolean {
  try {
    const interviews = getAllInterviews()
    const filtered = interviews.filter((i) => i.id !== id)

    if (filtered.length === interviews.length) {
      return false // Interview not found
    }

    localStorage.setItem(STORAGE_KEYS.INTERVIEWS, serialize(filtered))
    return true
  } catch (error) {
    console.error("Failed to delete interview:", error)
    return false
  }
}

// ============================================================
// Report Operations
// ============================================================

export function saveReport(report: Report): void {
  try {
    const reports = getAllReports()
    const existingIndex = reports.findIndex((r) => r.studyId === report.studyId)

    if (existingIndex >= 0) {
      // Update existing report
      reports[existingIndex] = report
    } else {
      // Add new report
      reports.push(report)
    }

    localStorage.setItem(STORAGE_KEYS.REPORTS, serialize(reports))
  } catch (error) {
    console.error("Failed to save report:", error)
    throw new Error("Failed to save report to localStorage")
  }
}

export function getReport(studyId: string): Report | null {
  try {
    const reports = getAllReports()
    return reports.find((r) => r.studyId === studyId) || null
  } catch (error) {
    console.error("Failed to get report:", error)
    return null
  }
}

function getAllReports(): Report[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REPORTS)
    if (!data) return []
    return deserialize<Report[]>(data)
  } catch (error) {
    console.error("Failed to list reports:", error)
    return []
  }
}

export function deleteReport(studyId: string): boolean {
  try {
    const reports = getAllReports()
    const filtered = reports.filter((r) => r.studyId !== studyId)

    if (filtered.length === reports.length) {
      return false // Report not found
    }

    localStorage.setItem(STORAGE_KEYS.REPORTS, serialize(filtered))
    return true
  } catch (error) {
    console.error("Failed to delete report:", error)
    return false
  }
}

// ============================================================
// Utility Operations
// ============================================================

/**
 * Clear all SurveyPlus data from localStorage
 * Useful for demos and testing
 */
export function clearAllData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.STUDIES)
    localStorage.removeItem(STORAGE_KEYS.INTERVIEWS)
    localStorage.removeItem(STORAGE_KEYS.REPORTS)
  } catch (error) {
    console.error("Failed to clear data:", error)
  }
}

/**
 * Get storage usage statistics
 */
export function getStorageStats() {
  try {
    const studies = listStudies()
    const interviews = getAllInterviews()
    const reports = getAllReports()

    return {
      studyCount: studies.length,
      interviewCount: interviews.length,
      reportCount: reports.length,
      totalSize: new Blob([
        localStorage.getItem(STORAGE_KEYS.STUDIES) || "",
        localStorage.getItem(STORAGE_KEYS.INTERVIEWS) || "",
        localStorage.getItem(STORAGE_KEYS.REPORTS) || "",
      ]).size,
    }
  } catch (error) {
    console.error("Failed to get storage stats:", error)
    return {
      studyCount: 0,
      interviewCount: 0,
      reportCount: 0,
      totalSize: 0,
    }
  }
}
