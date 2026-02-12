# SurveyPlus — Build Plan & Progress

**Product:** AI-moderated research interviews at scale
**Stack:** Next.js 14, TypeScript, Tailwind CSS, Claude API, localStorage (Phase 1)
**Status:** 🚀 Phase 1 MVP Near Complete

---

## 📊 Overall Progress

**Phase 1: Working MVP (localStorage)**
- [x] Project Setup & Design System (100%)
- [x] Data Layer (localStorage + hooks) (100%)
- [x] Dashboard (100%)
- [x] Study Setup (100%)
- [x] Interview Experience (95%)
- [x] Monitor Page (100%)
- [x] Report Page (100%)
- [x] API Routes (100%)
- [ ] Bug Fixes & Polish (90%)

**Phase 1 Completion: ~95%**

**Phase 2: Production (Firebase + Auth)**
- [ ] Firebase Integration
- [ ] Authentication
- [ ] Advanced Features

---

## Phase 1: Working MVP ✅

### Goal
Complete end-to-end prototype using localStorage for local demos and testing.

### Architecture Decisions

**Data Storage:** localStorage
- Simple, no backend setup needed for demos
- Studies, interviews, reports stored in browser
- Migration path to Firebase later without changing component APIs

**Participant Access:** URL-based routing
- `/interview/[studyId]` for shareable links
- No auth required, reduces friction

**API Integration:** Next.js API routes
- Server-side Claude API calls
- API key secure in .env.local

**State Management:** React hooks + localStorage
- Custom hooks: `useLocalStorage`, `useStudy`, `useInterview`

---

## Phase 1 Components

### 1. Foundation ✅

**Project Setup**
- [x] Next.js 14 with App Router
- [x] TypeScript configuration
- [x] Tailwind CSS + design system
- [x] Dark mode support
- [x] Base animations

**Core Utilities**
- [x] `lib/utils.ts` - Helper functions
- [x] `lib/storage.ts` - localStorage abstraction with CRUD
- [x] `types/index.ts` - TypeScript definitions

**UI Components**
- [x] Button (5 variants, 3 sizes)
- [x] Card system
- [x] Badge
- [x] Input & Textarea
- [x] Progress indicators
- [x] Loading states

---

### 2. Data Layer ✅

**Files Created:**
- [x] `lib/storage.ts` - CRUD operations for localStorage
- [x] `hooks/useLocalStorage.ts` - React hook for localStorage sync
- [x] `hooks/useStudy.ts` - Study operations
- [x] `hooks/useInterview.ts` - Interview operations

**Key Functions:**
```typescript
// lib/storage.ts
- saveStudy(study: Study): string
- getStudy(id: string): Study | null
- listStudies(): Study[]
- saveInterview(studyId: string, interview: Interview): string
- getInterviews(studyId: string): Interview[]
- saveReport(studyId: string, report: Report): void
- getReport(studyId: string): Report | null
```

---

### 3. Dashboard ✅

**File:** `app/page.tsx`

**Features:**
- [x] Header with branding and "New Study" CTA
- [x] Study list organized by status (Active, Drafts, Completed)
- [x] Empty state for new users
- [x] Study cards with metadata (name, goal, status)
- [x] Status badges (draft/active/complete)
- [x] Quick stats (questions, responses)
- [x] Context-aware action buttons
- [x] Responsive layout

**Actions:**
- [x] New Study → `/study/new`
- [x] Continue Setup → `/study/new?id={id}`
- [x] Monitor → `/study/[id]/monitor`
- [x] View Report → `/study/[id]/report`

---

### 4. Study Setup ✅

**File:** `app/study/new/page.tsx`

**Features:**
- [x] Three-section accordion form
  - [x] Section 1: Research Goal (textarea)
  - [x] Section 2: Research Questions (3-6 items, add/remove)
  - [x] Section 3: Question Framework (5-8 items, add/remove)
- [x] Active section highlighting (one expanded at a time)
- [x] Validation (minimums: goal 10 chars, 2-6 questions, 3-8 framework)
- [x] "Next Tier" button navigation
- [x] "Launch Study" button → saves and redirects to monitor
- [x] Auto-save to localStorage on changes
- [x] Edit mode support (load existing study)

---

### 5. Interview Experience ✅

**File:** `app/interview/[id]/page.tsx`

**Features:**
- [x] Load study from localStorage by ID
- [x] Intro screen with study context and "Let's start" button
- [x] Chat interface
  - [x] Message bubbles (AI left, participant right)
  - [x] AI typing indicator (animated dots)
  - [x] Multi-line textarea with auto-grow
  - [x] Progress indicator: "Question X of Y"
  - [x] Send button (disabled when empty or sending)
- [x] AI conversation logic
  - [x] Start with intro message
  - [x] Ask framework questions in order
  - [x] Smart follow-up decisions (1-2 per question)
  - [x] Move to next question when ready
  - [x] Graceful wrap-up message
- [x] Manual "End Interview" button (escape hatch)
- [x] Completion screen with thank you message
- [x] Save interview to localStorage (status: in_progress → complete)

**API Integration:**
- [x] POST to `/api/interview` with conversation context
- [x] Receive AI response with decision metadata
- [x] Handle follow-up vs. move-on logic

---

### 6. API Routes ✅

**Files:**
- [x] `app/api/interview/route.ts` - Interview AI responses
- [x] `app/api/report/route.ts` - Report generation
- [x] `app/api/summarize/route.ts` - Interview summarization

**A) Interview Route:**
- [x] Accept conversation context
- [x] Build Claude prompt with research framework
- [x] Decision logic for follow-up vs. move on
- [x] Return AI response + metadata

**B) Summarize Route:**
- [x] Accept single interview transcript
- [x] Generate 2-3 sentence summary
- [x] Return for monitor page display

**C) Report Route:**
- [x] Accept study ID and all transcripts
- [x] Build comprehensive Claude prompt
- [x] Request structured output (themes, quotes, insights)
- [x] Parse and return Report object

---

### 7. Monitor Screen ✅

**File:** `app/study/[id]/monitor/page.tsx`

**Features:**
- [x] Stats cards (completed count, avg duration, completion rate, status)
- [x] Interview list with cards per interview
- [x] Participant metadata display
- [x] Status badges (in_progress, complete, abandoned)
- [x] Duration display
- [x] Expand/collapse for full transcript
- [x] AI summary at top of transcript (lazy load)
- [x] Full message history (AI/participant)
- [x] "Generate Report" button (enabled with 3+ complete interviews)
- [x] Share link section with copy button
- [x] Email template suggestion

**Navigation:**
- [x] StudyTabs component (Setup/Monitor/Report)
- [x] Generate Report → redirects to report page

---

### 8. Report Screen ✅

**File:** `app/study/[id]/report/page.tsx`

**Features:**
- [x] Header with study name
- [x] Badges (participant count, avg duration, "AI-synthesized")
- [x] Research Goal card
- [x] Executive Summary (3-4 sentence TLDR)
- [x] Findings by Research Question
  - [x] One card per research question
  - [x] Themes with participant count badges
  - [x] Visual bars showing proportions
  - [x] Representative quotes (styled with left border)
- [x] Unexpected Insights section
- [x] Further Research section (numbered list)
- [x] "Generate Report" CTA if no report exists

---

### 9. Navigation & Polish ✅

**Tasks:**
- [x] Dashboard loads studies from localStorage
- [x] Display with StudyCard component
- [x] Empty state when no studies
- [x] StudyTabs navigation (Setup/Monitor/Report)
- [x] Active tab highlighting
- [x] Loading states during API calls
- [x] Disabled buttons during submission
- [x] Error handling with fallback messages
- [x] Responsive design (mobile-tested)

---

## Known Issues & Next Steps

### 🔴 #1 PRIORITY: Interview Auto-Completion Broken
**Status:** Critical - Manual escape hatch exists but not a real solution

**Issue:**
Interviews frequently don't auto-complete when the AI signals it's done. The AI says "Thank you for your time" or similar wrap-up language in the chat, but the interview stays in `in_progress` state instead of marking complete.

**Current Workaround:**
Manual "End Interview" button added as escape hatch. This works but participants shouldn't need it.

**Root Cause:**
Completion detection logic in `app/interview/[id]/page.tsx` isn't properly recognizing when the AI has finished the interview.

**Next Steps:**
- [ ] Debug completion detection logic - why isn't the AI's "done" signal being caught?
- [ ] Review the instruction/decision flow sent to the AI
- [ ] Test: AI says "we're done" → should immediately show completion screen
- [ ] Remove manual button once auto-completion is reliable

### Polish Tasks
- [ ] Toast notifications for user actions
- [ ] Better error messages for API failures
- [ ] Improved loading states
- [ ] Mobile keyboard handling in interview chat
- [ ] Study deletion with confirmation
- [ ] Study duplication feature

---

## Phase 2: Production Ready (Next)

### Goal
Replace localStorage with Firebase and add authentication for multi-user production deployment.

### Tasks
1. **Firebase Integration**
   - [ ] Firestore collections (studies, interviews, reports)
   - [ ] Real-time listeners for monitor page
   - [ ] Security rules

2. **Authentication**
   - [ ] Firebase Auth setup
   - [ ] Login/signup pages
   - [ ] Protected routes
   - [ ] Multi-user support

3. **Advanced Features**
   - [ ] Auto-save drafts
   - [ ] Study templates/duplication
   - [ ] Export reports (PDF, Markdown)
   - [ ] Email invitations with tracking
   - [ ] Advanced AI follow-up logic (content-based decisions)

---

## Success Criteria (Phase 1) ✅

- ✅ Researcher can create a study with 3-tier framework
- ✅ Study setup auto-saves to localStorage
- ✅ Shareable link generated for participants
- ✅ Participants can complete AI-moderated interview
- ✅ AI asks contextual follow-up questions (1-2 per framework question)
- ✅ Interview progress tracked and visible to researcher
- ✅ Monitor page displays all interviews with expand/collapse
- ✅ Report generation works with 3+ interviews
- ✅ Report displays structured findings with themes and quotes
- ✅ App runs smoothly on local dev server
- ✅ Styling matches design system
- ✅ Mobile-responsive (especially interview chat)
- ✅ Manual completion escape hatch for interviews

---

## Testing & Verification

### End-to-End Flow
1. ✅ Create study with goal, research questions, framework
2. ✅ Copy shareable link from monitor page
3. ✅ Complete interview as participant (different browser/incognito)
4. ✅ View interview in monitor page
5. ✅ Generate report after 3+ interviews
6. ✅ View synthesized report with themes and quotes

### Local Development
```bash
npm run dev
# Verify:
# - Server starts on http://localhost:3000
# - No console errors
# - All pages load
# - API routes respond
# - Hot reload works
```

---

## Notes & Decisions

### Design
- Warm neutrals for reduced eye strain
- Indigo + Cyan two-color system
- Serif + Sans pairing (editorial + UI)
- Border-heavy, shadow-light elevation
- Time-based progress (not question count)

### Technical
- Next.js 14 App Router
- Tailwind CSS for design system
- localStorage for Phase 1 (Firebase for Phase 2)
- Claude API (claude-sonnet-4-20250514)
- Study IDs: crypto.randomUUID()

### Open Questions for Phase 2
- [ ] Report versioning: replace or version history?
- [ ] Interview timeout: auto-save and resume?
- [ ] Export formats: PDF, Markdown, both?
- [ ] Dark mode toggle: nav bar or settings?

---

**Last Updated:** 2026-02-11
**Current Status:** Phase 1 MVP ~95% complete, ready for production planning
