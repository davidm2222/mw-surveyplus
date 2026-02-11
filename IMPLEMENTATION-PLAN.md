# Implementation Plan: Complete SurveyPlus Functional Prototype

## Context

The user has a partially-built Next.js app that started from an excellent proof-of-concept (surveyplus-v2.jsx) but needs to be completed into a fully functional end-to-end prototype. The project has strong foundations already in place:

- ✓ Next.js 14 with App Router, TypeScript, Tailwind
- ✓ Design system fully implemented
- ✓ 8 UI components built (Button, Card, Badge, etc.)
- ✓ API routes for Claude integration
- ✓ GitHub Pages deployment configured
- ✓ Anthropic API key already set in .env.local

**What's Missing:** The pages are stubbed but not fully functional. The user needs a working prototype where they can:
1. Create a study (3-tier framework)
2. Get a shareable link for participants
3. Have participants take the AI interview
4. Monitor responses in real-time
5. Generate and view AI-synthesized reports

**The Goal:** Complete the prototype so it's fully usable for testing the SurveyPlus concept, running locally for demos with real data.

---

## Architecture Decisions

### Data Storage: localStorage (Phase 1)
- **Why:** Keeps prototype simple, no backend database setup needed for demo
- **How:** Store studies, interviews, and reports in browser localStorage
- **Trade-off:** Data is device-specific, but acceptable for local prototype demos
- **Migration path:** Replace with Firebase later without changing component APIs

### Participant Access: URL-based routing
- **Pattern:** `/interview/[studyId]` for shareable links
- **Why:** No auth required, reduces friction, matches spec requirements
- **Implementation:** Generate unique study IDs, participants access via link

### API Integration: Next.js API routes
- **Pattern:** Next.js API routes handle Claude API calls server-side
- **Why:** Keeps API key secure in .env.local, clean separation of concerns
- **Deployment:** Local dev server (`npm run dev`) for demos
- **Files:** `/api/interview/route.ts` (already exists, needs completion)

### State Management: React hooks + localStorage
- **Why:** Simple, no external state library needed for prototype
- **Pattern:** Custom hooks in `/hooks` directory (useLocalStorage, useStudy, useInterview)

---

## Implementation Plan

### Phase 1: Core Data Layer
**Goal:** Create reliable data persistence and retrieval

**Files to create/modify:**
- `lib/storage.ts` - localStorage abstraction layer with CRUD operations
- `hooks/useLocalStorage.ts` - React hook for syncing component state with localStorage
- `hooks/useStudy.ts` - Study-specific operations (create, update, list, get)
- `hooks/useInterview.ts` - Interview-specific operations (create, update, get)

**Key functions:**
```typescript
// lib/storage.ts
- saveStudy(study: Study): string // Returns study ID
- getStudy(id: string): Study | null
- listStudies(): Study[]
- saveInterview(studyId: string, interview: Interview): string
- getInterviews(studyId: string): Interview[]
- saveReport(studyId: string, report: Report): void
- getReport(studyId: string): Report | null
```

### Phase 2: Complete Study Setup Flow
**Goal:** Researcher can create a study with the 3-tier framework

**File to complete:** `app/study/new/page.tsx` (currently 50% done)

**Implementation:**
1. **Three-section form** (mirroring surveyplus-v2.jsx design):
   - Section 1: Research Goal (single textarea)
   - Section 2: Research Questions (3-6 items, add/remove)
   - Section 3: Question Framework (5-8 items, add/remove, drag-to-reorder)
2. **Active section highlighting** - one section expanded at a time, others collapsed
3. **Validation:**
   - Goal: minimum 10 characters
   - Research Questions: 2-6 questions, each 5+ chars
   - Question Framework: 3-8 questions, each 5+ chars
4. **Navigation:**
   - "Next Tier" button advances through sections
   - "Preview Interview" button (enabled when valid) → `/interview/preview?studyId={id}`
5. **Data persistence:**
   - Auto-save to localStorage on each change
   - Store as draft until preview is complete

**State management:**
```typescript
const [activeSection, setActiveSection] = useState(0) // 0, 1, or 2
const [study, setStudy] = useStudy() // Custom hook
```

### Phase 3: Build Interview Experience
**Goal:** Participants can take AI-moderated interviews via chat interface

**File to complete:** `app/interview/[id]/page.tsx`

**Implementation:**
1. **Intro screen:**
   - Study name and description
   - AI disclosure message
   - Time estimate (5-10 minutes)
   - "Let's start" button
2. **Chat interface** (mirrors surveyplus-v2.jsx):
   - Message bubbles (AI left, user right)
   - AI typing indicator (3 animated dots)
   - Multi-line textarea with auto-grow
   - Progress indicator: "Question X of Y"
   - Send button (disabled when typing or empty input)
3. **AI conversation logic:**
   - Start with intro message
   - Ask first framework question
   - After user response: send to `/api/interview` endpoint
   - AI decides: follow-up (max 2) or move to next question
   - Continue until all questions covered
   - Graceful wrap-up message
4. **Completion screen:**
   - Thank you message
   - Confirmation that response was saved
5. **Data flow:**
   - Load study from localStorage by ID
   - Save each message to interview record
   - Update interview status (in_progress → complete)

**API Integration:**
```typescript
// POST to /api/interview
const response = await fetch('/api/interview', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    studyId,
    conversationHistory: messages,
    researchGoal: study.researchGoal,
    researchQuestions: study.researchQuestions,
    questionFramework: study.questionFramework,
    currentQuestionIndex: qIdx,
    followUpCount: fuCount,
  })
})
```

### Phase 4: Complete API Routes
**Goal:** Handle AI interactions and report generation

**Files to complete:**
- `app/api/interview/route.ts` (needs full Claude API integration)
- `app/api/report/route.ts` (needs implementation)
- `app/api/summarize/route.ts` (needs implementation)

**Implementation:**

**A) `/api/interview/route.ts`:**
- Accept conversation context from interview page
- Build Claude API prompt with:
  - System message: research goal, questions, framework
  - Conversation history
  - Decision logic for follow-up vs. move on
- Call Anthropic Messages API (claude-sonnet-4-20250514)
- Return AI response with metadata (should_move_on, next_question_index)

**B) `/api/summarize/route.ts`:**
- Accept single interview transcript
- Generate concise summary (2-3 sentences)
- Return summary for monitor page

**C) `/api/report/route.ts`:**
- Accept study ID and all interview transcripts
- Build comprehensive Claude prompt:
  - Research goal and questions
  - All interview transcripts
  - Request structured output matching Report type
- Parse response into Report structure
- Return report object

### Phase 5: Build Monitor Screen
**Goal:** Researcher can track responses and view individual interviews

**File to complete:** `app/study/[id]/monitor/page.tsx`

**Implementation:**
1. **Stats cards** (4 cards across top):
   - Completed count (e.g., "5 of 5 target")
   - Average duration (e.g., "6.4m")
   - Completion rate (e.g., "100%")
   - Status (e.g., "Done - ready for report")
2. **Interview list:**
   - Card per interview
   - Show participant metadata (if configured)
   - Status badge (in_progress, complete, abandoned)
   - Duration
   - Expand/collapse to see transcript
3. **Expandable transcript view:**
   - AI summary at top (call `/api/summarize` on first expand)
   - Full message history (AI/participant back-and-forth)
   - Scrollable if long
4. **Generate Report button:**
   - Enabled when 3+ complete interviews
   - Calls `/api/report` endpoint
   - Redirects to report page when complete
5. **Share link section:**
   - Display shareable link: `{domain}/interview/{studyId}`
   - Copy button
   - Email template suggestion

**Data loading:**
```typescript
const study = getStudy(id)
const interviews = getInterviews(id)
const stats = calculateStats(interviews)
```

### Phase 6: Build Report Screen
**Goal:** Display AI-synthesized research report

**File to complete:** `app/study/[id]/report/page.tsx`

**Implementation:**
1. **Header:**
   - Study name
   - Badges: participant count, avg duration, "AI-synthesized"
2. **Research Goal card:**
   - Display goal statement in styled card
3. **Executive Summary:**
   - 3-4 sentence TLDR
4. **Findings by Research Question:**
   - One card per research question
   - For each theme:
     - Theme title + participant count badge
     - Visual bar showing proportion
     - Representative quotes (styled with left border)
5. **Unexpected Insights:**
   - List of emergent themes (styled with warning color)
6. **Further Research:**
   - Numbered list of follow-up questions

**Data loading:**
```typescript
const study = getStudy(id)
const report = getReport(id)
if (!report) {
  // Show "Generate Report" CTA
}
```

### Phase 7: Navigation & Polish
**Goal:** Connect all screens with smooth navigation

**Tasks:**
1. **Dashboard (`app/page.tsx`):**
   - Load studies from localStorage
   - Display with StudyCard component
   - Show EmptyState if no studies
   - "New Study" button → `/study/new`
   - Study cards link to `/study/[id]/monitor` or `/study/[id]/report` based on status
2. **Nav component updates:**
   - Show study name in nav when on study pages
   - Add tab navigation: Setup | Preview | Monitor | Report
   - Active tab highlighting
3. **Loading states:**
   - Show spinner during API calls
   - Disable buttons during submission
4. **Error handling:**
   - Toast notifications for errors
   - Fallback messages if API fails
5. **Responsive design:**
   - Test on mobile (especially interview chat)
   - Ensure touch targets are 44px minimum

### Phase 8: Local Development Setup & Testing
**Goal:** Ensure prototype runs smoothly for demos

**Setup verification:**
- `.env.local` contains `ANTHROPIC_API_KEY` (already present ✓)
- Dependencies installed: `npm install`
- Dev server runs: `npm run dev`
- API routes accessible at http://localhost:3000/api/*

**Demo preparation:**
- Clear localStorage for fresh demo: `localStorage.clear()` in console
- Test full flow from study creation to report generation
- Prepare sample study data for quick demos
- Document any setup steps for sharing with demo participants

---

## Critical Files to Modify

### New Files to Create:
1. `lib/storage.ts` - Data persistence layer
2. `hooks/useLocalStorage.ts` - localStorage React hook
3. `hooks/useStudy.ts` - Study CRUD operations
4. `hooks/useInterview.ts` - Interview CRUD operations

### Existing Files to Complete:
1. `app/page.tsx` - Load real data from localStorage
2. `app/study/new/page.tsx` - Complete 3-tier form
3. `app/interview/[id]/page.tsx` - Build chat interface
4. `app/study/[id]/monitor/page.tsx` - Build monitor screen
5. `app/study/[id]/report/page.tsx` - Build report display
6. `app/api/interview/route.ts` - Complete Claude integration
7. `app/api/report/route.ts` - Implement report generation
8. `app/api/summarize/route.ts` - Implement interview summarization

### Files to Preserve:
- All files in `components/ui/` (already complete)
- `app/globals.css` (design system complete)
- `tailwind.config.ts` (no changes needed)
- `next.config.js` (already configured)

---

## Verification Plan

### End-to-End Test Flow:

1. **Create Study:**
   - Navigate to "New Study"
   - Fill out research goal, questions, framework
   - Verify auto-save to localStorage
   - Click "Preview Interview"

2. **Preview Interview:**
   - Experience participant flow as researcher
   - Verify AI responses are contextual
   - Complete full interview
   - Verify data saved to localStorage

3. **Monitor Progress:**
   - Return to monitor page
   - Verify interview appears in list
   - Expand interview to see transcript
   - Verify stats update correctly

4. **Generate Report:**
   - Add 2-3 more interviews (using different browser or incognito)
   - Click "Generate Report"
   - Wait for AI synthesis
   - Verify report displays correctly

5. **Share Link:**
   - Copy shareable link from monitor page
   - Open in new incognito window
   - Complete interview as participant
   - Verify it appears in researcher's monitor view

### Development Server Test:
```bash
npm run dev
```
- Verify server starts on http://localhost:3000
- No console errors in terminal or browser
- All pages load correctly
- API routes respond at /api/* endpoints
- Hot reload works for component changes

### Multi-Device Demo Test:
- Start dev server: `npm run dev`
- Get local network IP (e.g., http://192.168.1.x:3000)
- Open on phone/tablet to test participant experience
- Verify localStorage syncs correctly per-device
- Test responsive design on multiple screen sizes

---

## Success Criteria

- ✅ Researcher can create a study with 3-tier framework
- ✅ Study setup auto-saves to localStorage
- ✅ Shareable link is generated for participants
- ✅ Participants can complete AI-moderated interview via link
- ✅ AI asks contextual follow-up questions (1-2 per framework question)
- ✅ Interview progress is tracked and visible to researcher
- ✅ Monitor page displays all interviews with expand/collapse
- ✅ Report generation works with 3+ interviews
- ✅ Report displays structured findings with themes and quotes
- ✅ App runs smoothly on local dev server
- ✅ All styling matches surveyplus-v2.jsx prototype design
- ✅ Mobile-responsive (especially interview chat)
- ✅ No console errors in production build

---

## Known Issues

### CRITICAL: Interview Completion Bug
**Status:** BLOCKING
**Affected Phase:** Phase 3 (Interview Experience)
**File:** `app/interview/[id]/page.tsx`

**Problem:**
Interviews do not complete properly. When the AI wraps up the conversation, the completion screen doesn't appear and the interview status remains "in_progress" instead of updating to "complete".

**Symptoms:**
- AI sends closing message ("Thank you so much for sharing...")
- Chat interface continues instead of showing completion screen
- Monitor page shows interview as "in_progress"
- Interview never marked as complete in localStorage

**Debug Data:**
```
currentQuestionIndex: 2
totalQuestions: 3
shouldMoveToNext: false
remainingQuestions: 0
isFinished: false
```

**Root Cause:**
The `shouldMoveToNext` logic doesn't properly detect when on the final question. Even with `remainingQuestions === 0`, the follow-up logic continues indefinitely because `shouldMoveToNext` stays false.

**Attempted Fix:**
Modified logic to force completion after 2 follow-ups OR 1 detailed follow-up when on last question. Fix did not resolve the issue - interviews still not completing.

**Next Steps:**
- Review entire completion state flow
- Consider whether React state updates are being batched incorrectly
- May need to refactor completion detection to be more explicit
- Consider adding explicit "end interview" signal from AI

---

## Notes

- **Preserve design system:** All styling from surveyplus-v2.jsx is already implemented in Tailwind config and globals.css - use existing components
- **localStorage limitations:** Data persists per-device only; this is acceptable for local demo but will need Firebase for production (Phase 2)
- **API key security:** Stored in .env.local (not committed to git ✓); secure for local development
- **Preview mode:** Use query param `?preview=true` to distinguish researcher preview from participant interview
- **Study IDs:** Use crypto.randomUUID() for unique, shareable IDs
- **Demo sharing:** For remote demos, can use ngrok or similar to temporarily expose local server, or have demo participants join video call to watch screen share
- **Next.js config:** Can remove `output: 'export'` from next.config.js since we're not doing static export anymore
