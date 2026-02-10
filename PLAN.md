# SurveyPlus — Build Plan & Progress

**Product:** AI-moderated research interviews at scale
**Stack:** Next.js 14, TypeScript, Tailwind CSS, Firebase (later), Claude API
**Status:** 🚧 In Progress

**Build Philosophy:** Horizontal slices - working end-to-end at each phase, then iterative polish

---

## 📊 Overall Progress

**Phase 1: Working MVP (End-to-End)**
- [x] Project Setup (100%)
- [x] Dashboard (100%)
- [ ] Study Setup (Simple, 1 page) (50%)
- [ ] Interview Page (Basic chat + Claude API) (0%)
- [ ] Monitor (View interviews) (0%)
- [ ] Report (Display analysis) (0%)

**Phase 2: Polish & Features**
- [ ] Firebase Integration
- [ ] Authentication
- [ ] Advanced Features (see Phase 2 section)

**Current Phase Completion: ~30%**
**Overall Completion: ~15%**

---

## Build Philosophy: Horizontal Slices

**Phase 1 Goal:** Working end-to-end prototype in localStorage
- ✅ Create study → conduct interview → see results
- ✅ Test with real Claude API
- ✅ 3-5 files per feature
- ✅ Can demo the full flow

**Phase 2 Goal:** Production-ready polish
- Add Firebase for persistence
- Add authentication
- Add advanced features (auto-save, validation, export, etc.)
- Refactor and optimize

**Phase 3 Goal:** Scale & enhance
- Advanced AI features
- Team collaboration
- Analytics
- Performance optimization

---

## Phase 1: Working MVP End-to-End 🚧

### What We're Building
A complete but simple version of the entire user journey:
1. **Dashboard** → List studies, create new study
2. **Study Setup** → Simple accordion form (goal, questions, framework)
3. **Interview** → Chat interface with Claude API
4. **Monitor** → View completed interviews
5. **Report** → AI-generated analysis

### What We're Skipping (for Phase 1)
- ❌ Firebase (use localStorage)
- ❌ Authentication (single user)
- ❌ Auto-save drafts
- ❌ AI suggestions during setup
- ❌ Complex validation
- ❌ Metadata fields
- ❌ Preview mode
- ❌ Export features
- ❌ Perfect error handling

**Success Criteria:** Can create study → run interview → see report in 10 minutes

---

## 1. Foundation & Setup ✅

### 1.1 Project Scaffold
- [x] Next.js 14 with App Router
- [x] TypeScript configuration
- [x] Tailwind CSS setup
- [x] Design system implementation (colors, typography, spacing)
- [x] Global styles with dark mode support
- [x] Base animations (fade-up, fade-in, typing dots)

### 1.2 Core Utilities
- [x] `lib/utils.ts` - Helper functions (cn, formatDate, timeAgo, etc.)
- [x] `types/index.ts` - TypeScript type definitions
- [x] Design tokens in globals.css

### 1.3 UI Component Library
- [x] Button component (5 variants, 3 sizes)
- [x] Card component system
- [x] Badge component
- [ ] Input component (text, textarea)
- [ ] Select/Dropdown component
- [ ] Modal/Dialog component
- [ ] Progress indicator component
- [ ] Toast/notification system
- [ ] Loading states & skeletons

---

## 2. Dashboard (Study Management Hub) ✅

### 2.1 Layout & Structure
- [x] Header with branding and CTA
- [x] Study list organized by status (Active, Drafts, Completed)
- [x] Empty state for new users
- [x] Responsive layout (mobile-first)

### 2.2 Study Card Component
- [x] Display study metadata (name, goal, status)
- [x] Status badges (draft/active/complete)
- [x] Quick stats (questions, responses, completion)
- [x] Last updated timestamp
- [x] Context-aware action buttons
- [x] Hover states and animations

### 2.3 Dashboard Actions
- [ ] "New Study" button → navigate to study setup
- [ ] "Continue Setup" → navigate to study setup (edit mode)
- [ ] "Monitor" → navigate to study monitor
- [ ] "View Report" → navigate to report view
- [ ] Delete study (with confirmation)
- [ ] Duplicate study
- [ ] Archive study

### 2.4 Data Integration
- [x] Sample data for demonstration
- [ ] Connect to Firebase Firestore
- [ ] Real-time updates for active studies
- [ ] Study filtering and search

---

## 3. Study Setup Flow ✅

**Phase 1 Scope:** Simple accordion form, all on one page, save to localStorage

### 3.1 Core Setup Page (1 file: `app/study/new/page.tsx`)
- [x] Study name input
- [x] Research Goal textarea (Tier 1)
- [x] Research Questions list (Tier 2) - add/remove
- [x] Question Framework list (Tier 3) - add/remove
- [x] Accordion collapse/expand (from prototype)
- [x] Save to localStorage on "Launch"
- [x] Basic validation (name required, at least 1 question)
- [x] "Launch Study" button → creates study, redirects to dashboard

### 3.2 Skipped for Phase 1 (Move to Phase 2)
- Description field
- Character counters
- AI validation/suggestions
- Preview mode requirement
- Drag-to-reorder
- Metadata configuration
- Auto-save drafts
- Complex validation rules

---

## 4. Interview Experience (Participant-Facing) ✅

**Phase 1 Scope:** Chat interface with Claude API, save to localStorage

### 4.1 Interview Page (1 file: `app/interview/[id]/page.tsx`)
- [x] Load study from localStorage by ID
- [x] API key management (localStorage)
- [x] Simple intro screen ("Let's start" button)
- [x] Chat interface
  - [x] Message bubbles (AI vs participant)
  - [x] Auto-scroll to latest
  - [x] Typing indicator
  - [x] Multi-line input (auto-grow)
  - [x] Send on Enter, Shift+Enter for new line
- [x] Claude API integration
  - [x] System prompt with study context (goal, questions, framework)
  - [x] Ask framework questions in order
  - [x] 1-2 follow-ups per question (smart decision logic)
  - [x] Graceful wrap up when done
- [x] Save interview to localStorage
- [x] Completion screen ("Thank you!")

### 4.2 Skipped for Phase 1 (Move to Phase 2)
- Metadata collection
- Time-based progress indicator
- Advanced AI logic (time-aware pacing)
- Partial save on exit
- Resume capability
- Feedback rating

---

## 5. Study Monitor 🔲

**Phase 1 Scope:** View interviews, expand for transcript

### 5.1 Monitor Page (1 file: `app/study/[id]/monitor/page.tsx`)
- [ ] Load study + interviews from localStorage
- [ ] Simple stats (total interviews, avg duration)
- [ ] List of interviews
  - [ ] Expand/collapse for transcript
  - [ ] Show messages (AI vs participant)
  - [ ] Duration display
- [ ] "Generate Report" button

### 5.2 Skipped for Phase 1 (Move to Phase 2)
- Real-time updates
- AI summary per interview
- Export transcripts
- Share link display
- Advanced stats
- Close study functionality

---

## 6. Report View 🔲

**Phase 1 Scope:** Display AI-generated analysis from Claude API

### 6.1 Report Page (1 file: `app/study/[id]/report/page.tsx`)
- [ ] Load study + interviews from localStorage
- [ ] Call Claude API for analysis
  - [ ] Send all transcripts
  - [ ] Send research goal + questions
  - [ ] Get structured analysis
- [ ] Display report:
  - [ ] Executive summary
  - [ ] Findings per research question
    - [ ] Themes with participant counts
    - [ ] Representative quotes
  - [ ] Unexpected insights
  - [ ] Further research suggestions

### 6.2 Skipped for Phase 1 (Move to Phase 2)
- Export (PDF, Markdown)
- Shareable links
- Visual theme indicators
- Expandable quote blocks
- Appendix with individual summaries

---

## 7. AI Integration (Claude API) 🔲

**Phase 1 Scope:** Direct API calls from client (simple, no API routes yet)

### 7.1 Interview Engine (Client-side)
- [ ] Direct Claude API calls from interview page
- [ ] System prompt with study context
- [ ] Basic follow-up logic (1-2 per question)
- [ ] Store API key in localStorage for now
- [ ] Error handling for API failures

### 7.2 Analysis Engine (Client-side)
- [ ] Direct Claude API call from report page
- [ ] Send all interview transcripts
- [ ] Request structured JSON output
- [ ] Parse and display findings

### 7.3 Skipped for Phase 1 (Move to Phase 2)
- API routes (server-side)
- Streaming responses
- Advanced follow-up logic
- Suggestion engine
- Time-aware pacing

---

---

## Phase 2: Production Polish & Features 🔲

**Move to Phase 2 after Phase 1 MVP is working end-to-end**

### 8. Firebase Integration
- [ ] Replace localStorage with Firestore
- [ ] Study/Interview/Report collections
- [ ] Real-time listeners
- [ ] Security rules

### 9. Authentication
- [ ] Firebase Auth setup
- [ ] Login/signup pages
- [ ] Protected routes
- [ ] Multi-user support

### 10. Advanced Setup Features
- [ ] Accordion UI for study setup
- [ ] Auto-save drafts
- [ ] AI suggestions for questions
- [ ] Preview mode requirement
- [ ] Drag-to-reorder framework
- [ ] Metadata field configuration

### 11. Advanced Interview Features
- [ ] Metadata collection
- [ ] Time-based progress
- [ ] Advanced AI pacing
- [ ] Partial save on exit
- [ ] Resume capability

### 12. Advanced Monitor Features
- [ ] Real-time updates
- [ ] AI summary per interview
- [ ] Export transcripts
- [ ] Share link management

### 13. Advanced Report Features
- [ ] Export (PDF, Markdown)
- [ ] Shareable public links
- [ ] Visual theme indicators
- [ ] Report regeneration

---

## 10. Polish & Production Readiness 🔲

### 10.1 Error Handling
- [ ] Global error boundary
- [ ] API error handling with user-friendly messages
- [ ] Network error recovery
- [ ] Validation error displays
- [ ] 404 page improvements
- [ ] 500 error page

### 10.2 Loading States
- [ ] Page-level loading skeletons
- [ ] Button loading states
- [ ] Optimistic UI updates
- [ ] Smooth transitions

### 10.3 Accessibility
- [ ] ARIA labels
- [ ] Keyboard navigation
- [ ] Focus management
- [ ] Screen reader testing
- [ ] Color contrast validation (WCAG AA)

### 10.4 Performance
- [ ] Image optimization
- [ ] Code splitting
- [ ] Lazy loading
- [ ] API response caching
- [ ] Database query optimization

### 10.5 SEO & Meta
- [ ] Page titles and descriptions
- [ ] Open Graph tags
- [ ] Favicon
- [ ] Sitemap
- [ ] robots.txt

### 10.6 Testing
- [ ] Unit tests (critical utilities)
- [ ] Component tests (UI components)
- [ ] Integration tests (API routes)
- [ ] E2E tests (critical flows)
- [ ] Manual QA checklist

### 10.7 Documentation
- [ ] README with setup instructions
- [ ] API documentation
- [ ] Component storybook (optional)
- [ ] Deployment guide

---

## 11. Deployment 🔲

### 11.1 Environment Setup
- [ ] Environment variables (.env.local)
- [ ] Firebase config (production)
- [ ] Claude API key management
- [ ] Secrets management

### 11.2 Build & Deploy
- [ ] Production build testing
- [ ] GitHub Pages setup (if static export)
- [ ] Vercel/Netlify deployment (if SSR needed)
- [ ] Custom domain configuration
- [ ] SSL/HTTPS

### 11.3 Monitoring
- [ ] Error tracking (Sentry or similar)
- [ ] Analytics (optional)
- [ ] Performance monitoring
- [ ] API usage monitoring (Claude API costs)

---

## 🎯 Immediate Next Steps (Phase 1 MVP)

**Current Focus:** Complete working end-to-end flow

### Sprint 1: Core Pages (Today)
1. ✅ Simplify study setup to accordion pattern (from prototype)
2. ⬜ Build interview page with Claude API
3. ⬜ Build monitor page (view interviews)
4. ⬜ Build report page (Claude API analysis)

### Sprint 2: Integration (Next)
5. ⬜ Wire up navigation between pages
6. ⬜ Test full flow: create → interview → monitor → report
7. ⬜ Add API key management (localStorage)
8. ⬜ Basic error handling

### Sprint 3: Polish (After MVP works)
9. ⬜ Improve styling consistency
10. ⬜ Add loading states
11. ⬜ Mobile responsiveness
12. ⬜ Demo-ready state

**Success Metric:** Can walk through full flow in 10 minutes

---

## 📝 Notes & Decisions

### Design Decisions Made
- Warm neutrals over pure white/black for reduced eye strain
- Indigo + Cyan two-color system (researcher vs participant)
- Serif + Sans pairing (editorial warmth + UI clarity)
- Border-heavy, shadow-light elevation
- Time-based progress in interviews (not question count)

### Technical Decisions Made
- Next.js 14 App Router (modern, optimized)
- Tailwind CSS (rapid development, design system alignment)
- Firebase (scalable, real-time, auth included)
- Claude API (best-in-class conversational AI)

### Open Questions
- [ ] Report regeneration: Replace old or version?
- [ ] Metadata field limits: How many? What types?
- [ ] Share link mechanics: Simple URL or tracking params?
- [ ] Interview timeout: Auto-save and resume or mark abandoned?
- [ ] Dark mode toggle: Nav bar or settings page?
- [ ] Export formats: PDF, Markdown, both?
- [ ] Individual transcript sharing: Yes or only full reports?
- [ ] AI follow-up transparency: Show dynamic vs seamless?

---

**Last Updated:** 2026-02-09
**Current Focus:** Dashboard Complete → Study Setup Flow Next
