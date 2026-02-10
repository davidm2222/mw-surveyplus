// ============================================================
// Core Data Types (based on product spec Section 8.2)
// ============================================================

export interface Study {
  id: string
  name: string
  status: 'draft' | 'active' | 'complete'
  researchGoal: string
  researchQuestions: string[]
  questionFramework: string[]
  metadataFields?: MetadataField[]
  shareableLink?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface MetadataField {
  id: string
  label: string
  type: 'text' | 'select'
  options?: string[]
  required: boolean
}

export interface Interview {
  id: string
  studyId: string
  participantMetadata?: Record<string, string>
  messages: Message[]
  status: 'in_progress' | 'complete' | 'abandoned'
  duration: number // seconds
  aiSummary?: string
  startedAt: Date
  completedAt?: Date
}

export interface Message {
  role: 'ai' | 'user'
  text: string
  timestamp: Date
}

export interface Report {
  id: string
  studyId: string
  participantCount: number
  avgDuration: string // formatted, e.g., "6.4 min"
  executiveSummary: string
  findings: Finding[]
  unexpectedInsights: string[]
  furtherResearch: string[]
  generatedAt: Date
}

export interface Finding {
  researchQuestion: string
  answer: string
  themes: Theme[]
}

export interface Theme {
  theme: string
  count: number
  total: number
  quotes: string[]
}

// ============================================================
// Common Types
// ============================================================

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface User {
  id: string
  email: string
  name?: string
  createdAt: Date
}

// ============================================================
// UI Component Types
// ============================================================

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'accent'
}

// ============================================================
// Study Setup Form Types
// ============================================================

export interface StudyFormData {
  basicInfo: {
    name: string
    description?: string
  }
  researchGoal: string
  researchQuestions: string[]
  questionFramework: string[]
  configuration: {
    participantCap?: number
    closeDate?: string
  }
}
