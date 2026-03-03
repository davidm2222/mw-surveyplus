import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  collection,
  query,
  where,
  getCountFromServer,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Study, Interview, Report } from '@/types'

// ============================================================
// Firestore Timestamp → JS Date conversion
// ============================================================

// Firestore returns Timestamp objects for Date fields. This recursively
// converts them back to JS Dates so our types stay clean.
function convertValue(value: unknown): unknown {
  if (value === null || value === undefined) return value
  if (
    value &&
    typeof value === 'object' &&
    'toDate' in value &&
    typeof (value as { toDate: unknown }).toDate === 'function'
  ) {
    return (value as { toDate: () => Date }).toDate()
  }
  if (Array.isArray(value)) {
    return value.map(convertValue)
  }
  if (typeof value === 'object') {
    const result: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      result[k] = convertValue(v)
    }
    return result
  }
  return value
}

function fromFirestore<T>(data: Record<string, unknown>): T {
  return convertValue(data) as T
}

// Firestore rejects undefined values — strip them before writing
function stripUndefined(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) result[k] = v
  }
  return result
}

// ============================================================
// Study Operations
// ============================================================

export async function saveStudy(study: Study): Promise<string> {
  await setDoc(doc(db, 'studies', study.id), stripUndefined(study as unknown as Record<string, unknown>))
  return study.id
}

export async function getStudy(id: string): Promise<Study | null> {
  const snap = await getDoc(doc(db, 'studies', id))
  if (!snap.exists()) return null
  return fromFirestore<Study>(snap.data() as Record<string, unknown>)
}

export async function listStudies(researcherId: string): Promise<Study[]> {
  const q = query(
    collection(db, 'studies'),
    where('researcherId', '==', researcherId)
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) =>
    fromFirestore<Study>(d.data() as Record<string, unknown>)
  )
}

export async function deleteStudy(id: string): Promise<void> {
  await deleteDoc(doc(db, 'studies', id))
  // Also delete associated interviews and report
  const interviews = await getInterviews(id)
  await Promise.all(interviews.map((i) => deleteInterview(i.id)))
  await deleteReport(id)
}

export async function updateStudyStatus(
  id: string,
  status: Study['status']
): Promise<void> {
  const study = await getStudy(id)
  if (!study) throw new Error('Study not found')
  await setDoc(doc(db, 'studies', id), {
    ...study,
    status,
    updatedAt: new Date(),
  })
}

// ============================================================
// Interview Operations
// ============================================================

export async function saveInterview(interview: Interview): Promise<string> {
  await setDoc(doc(db, 'interviews', interview.id), stripUndefined(interview as unknown as Record<string, unknown>))
  return interview.id
}

export async function getInterview(id: string): Promise<Interview | null> {
  const snap = await getDoc(doc(db, 'interviews', id))
  if (!snap.exists()) return null
  return fromFirestore<Interview>(snap.data() as Record<string, unknown>)
}

export async function getInterviews(studyId: string): Promise<Interview[]> {
  const q = query(
    collection(db, 'interviews'),
    where('studyId', '==', studyId)
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) =>
    fromFirestore<Interview>(d.data() as Record<string, unknown>)
  )
}

export async function getCompletedInterviewCount(studyId: string): Promise<number> {
  const q = query(
    collection(db, 'interviews'),
    where('studyId', '==', studyId),
    where('status', '==', 'complete')
  )
  const snap = await getCountFromServer(q)
  return snap.data().count
}

export async function deleteInterview(id: string): Promise<void> {
  await deleteDoc(doc(db, 'interviews', id))
}

// ============================================================
// Report Operations
// ============================================================

export async function saveReport(report: Report): Promise<void> {
  await setDoc(doc(db, 'reports', report.studyId), stripUndefined(report as unknown as Record<string, unknown>))
}

export async function getReport(studyId: string): Promise<Report | null> {
  const snap = await getDoc(doc(db, 'reports', studyId))
  if (!snap.exists()) return null
  return fromFirestore<Report>(snap.data() as Record<string, unknown>)
}

export async function deleteReport(studyId: string): Promise<void> {
  await deleteDoc(doc(db, 'reports', studyId))
}
