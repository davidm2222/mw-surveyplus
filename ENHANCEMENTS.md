# SurveyPlus — Future Enhancements

This document tracks feature ideas and improvements that are out of scope for v1 but represent natural extensions of the product.

---

## Setup & Onboarding Improvements

### Persistent Navigation in Setup Wizard
**Status:** Requested
**Priority:** High

**Description:**
When navigating to the Setup tab from Monitor or Report, the StudyTabs navigation disappears, making it impossible to navigate back without using browser back button.

**Current Behavior:**
- From Monitor/Report, click "Setup" tab
- Taken to `/study/new?id=X` setup wizard
- StudyTabs navigation is gone
- User is stuck in wizard flow, must use browser back to return to Monitor

**Expected Behavior:**
- Setup tab should show StudyTabs at the top
- Can navigate freely between Setup/Monitor/Report
- Setup page should be view-only or clearly editable (not wizard-mode)

**Possible Solutions:**
1. Add StudyTabs to setup wizard page
2. Create separate "Edit Study" view that's not wizard-based
3. Make "Setup" tab link to view-only study details, separate "Edit" button

**Rationale:**
Navigation should be consistent across all study pages. Users should never feel trapped in a flow.

---

### Accordion UI for Study Setup
**Status:** Requested
**Priority:** Medium

**Description:**
Add accordion/collapsible sections to the study setup page for better visual organization.

**Features:**
- Collapsible sections for Research Goal, Research Questions, and Question Framework
- All content remains on one page but sections can collapse for focus
- Reduces visual clutter while maintaining single-page flow
- Similar to original JSX implementation pattern

**Rationale:**
Keeps the simplicity of a single-page form while reducing overwhelming visual density. Users can focus on one section at a time.

---

### AI Coaching During Study Setup
**Status:** Deferred from v1
**Priority:** Medium

**Description:**
Real-time AI validation and suggestions as researchers write their research framework.

**Features:**
- **Goal Validation:** As researcher types research goal, show inline feedback
  - ✓ "This goal is specific and actionable"
  - 💡 "This could be more specific. Try: 'Understand why users abandon [specific action]...'"
- **Research Question Suggestions:** Based on the goal, AI suggests starter research questions researcher can accept/reject
- **Question Framework Suggestions:** Based on research questions, AI suggests conversational participant questions
- **Tone Preview:** For each framework question, show how the AI might follow up

**Rationale:**
Helps researchers write better studies, especially those new to qualitative research. Non-blocking validation (advisory, not mandatory) respects researcher expertise.

**Design Notes:**
- Validation should be gentle and non-intrusive
- Never block progress — researcher can ignore suggestions
- Show confidence level on suggestions ("High confidence" vs "Consider...")

---

### Start from Example Templates
**Status:** Deferred from v1
**Priority:** Medium

**Description:**
Allow researchers to start from pre-built research framework templates for common study types.

**Features:**
- On "New Study" screen, offer choice:
  - [A] Start from scratch (current v1 flow)
  - [B] Start from example → Pick scenario → Edit pre-filled framework
- **Example Templates:**
  - Onboarding friction analysis
  - Feature discovery
  - Churn analysis
  - Usability feedback
  - Product-market fit validation
- Templates include pre-filled Goal, Research Questions, and Question Framework
- Researcher can edit any part before launching

**Rationale:**
Reduces cold start problem. Blank text fields are intimidating; examples provide scaffolding and teach good framework structure.

**Design Notes:**
- Make it easy to switch between modes (start from scratch ↔ start from example)
- Templates should be obviously editable, not prescriptive
- Consider community-contributed templates in v3+

---

## Participant Experience Improvements

### improved 'UX Interview Expertise' for AI
**Description:**
right now the questions the AI asks are OK, but not as good as an expert human interviewer - and it's not clear that the questions are informed not only by responses but by the study's research questions and objectives. We should improve the training of the AI interviewer so that it has the skills of an expert.

### Content-Based Follow-Up Decisions (AI-Driven)
**Status:** Deferred from v1
**Priority:** High
**Requested:** User feedback during testing

**Description:**
Instead of deciding whether to ask follow-ups based on word count and follow-up count, have the AI evaluate the quality and completeness of each response to decide intelligently whether another follow-up is needed.

**Current Behavior:**
- Interview completion logic uses heuristics: word count + follow-up count
- E.g., "1 follow-up + 30 words = complete" OR "3 follow-ups max"
- Simple, predictable, but crude - doesn't understand content

**Proposed Behavior:**
- After each participant response, AI evaluates: "Did I get the information I need for this research question?"
- AI decides: continue with targeted follow-up OR move to next question
- Still respects hard caps (max 3-4 follow-ups) as safety net

**Implementation Approach:**
```typescript
// After user response, call evaluation endpoint
const decision = await fetch('/api/evaluate-response', {
  body: JSON.stringify({
    userResponse,
    researchGoal,
    currentQuestion,
    conversationHistory,
    followUpCount
  })
})

// AI returns decision + reasoning
{
  shouldContinue: true/false,
  reasoning: "User mentioned frustration but didn't explain root cause",
  suggestedFollowUp: "What specifically caused that frustration?"
}

// Use AI decision but respect hard limits
shouldMoveToNext =
  followUpCount >= 3 ||           // Hard cap (safety)
  !decision.shouldContinue ||     // AI says "I'm satisfied"
  (followUpCount >= 2 && wordCount < 10) // User giving up
```

**Benefits:**
- Much more intelligent, natural conversations
- Recognizes when enough information has been gathered
- Stops when beating a dead horse (user repeating themselves)
- Adapts to conversation quality, not just quantity
- Better overall data quality

**Trade-offs:**
- Extra API call per response (~2 seconds latency, 2x cost)
- More complex logic to maintain
- Still needs hard caps as safety net (AI could theoretically ask infinite questions)

**Alternative: Hybrid Approach**
- Use word-count heuristics as default
- Only call AI evaluation if response is ambiguous (moderate length, moderate follow-up count)
- Reduces API costs while improving decision quality

**Rationale:**
User feedback: "I was thinking the AI would actually decide to continue or not based on the content of the response not just the length. Like 'did I get all the info I need for this research?'" This would make interviews feel much more natural and produce higher quality data.

---

### Voice Input for Participants
**Status:** v2+ (from original spec)
**Priority:** Low-Medium

**Description:**
Allow participants to speak their responses instead of typing.

**Rationale:**
More natural, especially on mobile. Produces richer, more conversational data. Reduces friction for participants who prefer talking to typing.

**Technical Considerations:**
- Speech-to-text API integration
- Privacy/consent implications
- Audio storage vs. transcript-only
- Accessibility: still need text input as fallback

---

### Multi-Language Support
**Status:** v2+ (from original spec)
**Priority:** Medium

**Description:**
Conduct interviews in the participant's preferred language.

**Features:**
- Researcher writes framework in their language
- Participant selects preferred language on intro screen
- AI translates questions and conducts interview in participant's language
- Report synthesizes across all languages

**Rationale:**
Expands reach to global user bases. Removes language barrier from qualitative research.

**Technical Considerations:**
- Translation quality for nuanced research questions
- Cultural context in AI follow-ups
- Multi-language quote display in reports

---

## Analysis & Reporting Improvements

### Interactive Report Dashboard
**Status:** v2+ (from original spec)
**Priority:** High

**Description:**
Make the report explorable and filterable, not just a static document.

**Features:**
- Filter findings by participant segment (role, tenure, etc.)
- Search across all interview transcripts
- Highlight themes across multiple participants
- Compare segments ("New users vs. experienced users")
- Drill down from theme → quotes → full transcript

**Rationale:**
Static reports are limiting. Stakeholders often want to slice data different ways. Interactive dashboards make research more accessible.

**Design Notes:**
- Keep static report export for sharing
- Dashboard is supplementary, not replacement
- Maintain research rigor (no cherry-picking quotes)

---

### Mid-Study Adaptation
**Status:** v2+ (from original spec)
**Priority:** Medium

**Description:**
Allow researcher to review early interviews and adjust question framework for remaining participants.

**Example Flow:**
1. Launch study, collect 5 interviews
2. Review transcripts, notice unexpected theme
3. Add/modify framework question to explore that theme
4. Remaining participants get updated question framework
5. Final report notes the change and separates cohorts if needed

**Rationale:**
Real research is iterative. Researchers often discover something unexpected and wish they'd asked about it.

**Design Notes:**
- Must be transparent in report ("Questions 1-5 asked to all; Q6 added after interview 5")
- Consider requiring minimum N before allowing changes
- Prevent gaming (can't change questions to fit a narrative)

---

## Collaboration & Workflow

### Team Collaboration
**Status:** v2+ (from original spec)
**Priority:** High

**Description:**
Multiple researchers can work on the same study.

**Features:**
- Invite team members to study
- Role-based permissions (owner, editor, viewer)
- Shared analysis and annotations
- Comment threads on specific quotes/themes
- Activity log ("Sarah generated report", "Alex added annotation")

**Rationale:**
Research is often collaborative. Teams need to share insights and build on each other's analysis.

---

### Email Invitations with Tracking
**Status:** v2+ (from original spec)
**Priority:** Medium

**Description:**
Send interview invitations via email directly from SurveyPlus.

**Features:**
- Import participant list (CSV or manual entry)
- Customize email template
- Track who's been invited, who's completed, who's pending
- Send automated reminders
- Individual tracking links per participant

**Rationale:**
More professional than just sharing a generic link. Allows follow-up with non-responders.

**Technical Considerations:**
- Email delivery service integration (SendGrid, AWS SES)
- Privacy: participant email addresses need secure storage
- Unsubscribe/opt-out handling

---

### Panel Integrations
**Status:** v2+ (from original spec)
**Priority:** Low

**Description:**
Connect to participant recruitment platforms (Prolific, UserTesting, etc.) for automated participant sourcing.

**Features:**
- Set study criteria (demographics, screening questions)
- Launch to panel with one click
- Automatic participant compensation
- Integrated recruitment + interview in one workflow

**Rationale:**
Removes the "bring your own participants" requirement. Makes SurveyPlus viable for researchers without existing user bases.

---

## Study Management

### Longitudinal Studies
**Status:** v2+ (from original spec)
**Priority:** Low

**Description:**
Re-interview the same participants over time to track changes.

**Example Use Case:**
- Interview new users at onboarding
- Re-interview at 1 month
- Re-interview at 3 months
- Track how perceptions evolve

**Features:**
- Link participants across multiple studies
- "Follow-up study" option when creating new study
- Report shows change over time
- Participant consent for re-contact

**Rationale:**
Behavior and attitudes change. Single-point-in-time interviews miss the evolution.

---

### Study Duplication & Templates
**Status:** v1.5 (quick win)
**Priority:** High

**Description:**
Duplicate an existing study to reuse the research framework.

**Features:**
- "Duplicate Study" button on dashboard
- Copies research goal, questions, framework, metadata config
- Resets participant data (fresh study)
- Rename and launch as new study

**Rationale:**
Researchers often run the same study multiple times (quarterly onboarding checks, etc.). Duplication saves setup time.

---

## Quality & Trust

### Researcher Feedback on AI Quality
**Status:** v1.5 (quick win)
**Priority:** High

**Description:**
Allow researchers to rate individual AI follow-ups and report quality.

**Features:**
- In Monitor screen, expand interview → thumbs up/down on specific AI follow-ups
- In Report screen, "Was this report useful?" rating
- Optional: flag specific follow-ups as "off-topic" or "too surface-level"

**Rationale:**
Continuous feedback loop improves AI quality. Builds trust by showing we care about quality.

**Technical Notes:**
- Flags feed into AI prompt refinement
- Could train fine-tuned models based on high-rated vs low-rated follow-ups

---

### Confidence Scores on Findings
**Status:** v2
**Priority:** Medium

**Description:**
Show AI's confidence level on each finding in the report.

**Example:**
- "8 of 12 participants mentioned onboarding confusion" ← **High confidence**
- "Some participants preferred dark mode" ← **Low confidence** (vague theme, few mentions)

**Rationale:**
Helps researchers calibrate trust. Strong themes are clearly marked; weak signals are flagged.

---

## Privacy & Compliance

### Data Deletion Controls
**Status:** v1.5 (may be required for compliance)
**Priority:** High

**Description:**
Allow researchers to delete studies, interviews, or participant data.

**Features:**
- "Delete Study" (with confirmation)
- "Delete Individual Interview" (if participant requests removal)
- "Export All Data" before deletion (for records)
- Permanent deletion with audit log

**Rationale:**
GDPR, CCPA, and internal data policies may require deletion capabilities.

---

### Participant Consent Management
**Status:** v2
**Priority:** Medium

**Description:**
Formal consent flow for participants before interview begins.

**Features:**
- Customizable consent text
- Required checkbox: "I consent to participate"
- Downloadable consent record
- Option to withdraw consent post-interview

**Rationale:**
Some organizations require formal consent for research. Currently participants just click "Let's start" with no explicit agreement.

---

## Analytics & Insights

### Cross-Study Analysis
**Status:** v3+
**Priority:** Low

**Description:**
Analyze themes across multiple studies.

**Example Use Case:**
- Run 5 studies over 6 months
- Identify recurring themes across all studies
- "Onboarding confusion" appears in 4 of 5 studies → high-priority issue

**Rationale:**
Meta-insights emerge from patterns across studies. Single-study view is limiting.

---

### Export Formats
**Status:** v1.5 (quick win)
**Priority:** Medium

**Description:**
Export reports in multiple formats.

**Options:**
- PDF (for stakeholder sharing)
- Markdown (for documentation)
- CSV (raw data: participant metadata + responses)
- JSON (full data export for custom analysis)

**Rationale:**
Different stakeholders prefer different formats. Researchers may want raw data for custom analysis tools.

---

## Critical Bugs

### Interview Completion Not Triggering
**Status:** BLOCKING
**Priority:** Critical

**Description:**
Interviews are not completing properly. The AI says the interview is done, but the completion screen doesn't appear and the interview remains marked as "in_progress" on the monitor page.

**Current Behavior:**
- AI wraps up the conversation with closing message
- Interview continues to show chat interface instead of completion screen
- Monitor page shows interview as "in_progress" instead of "complete"
- Interview data saves correctly but status never updates to "complete"

**Debug Findings:**
- On last question (remainingQuestions: 0), shouldMoveToNext stays false
- Follow-up logic doesn't force completion even when on final question
- State update `setIsComplete(true)` may not be firing
- Logic attempted: After 2 follow-ups OR 1 detailed follow-up on last question, should complete

**Console Logs from Failed Interview:**
```
🔍 Interview state check: {currentQuestionIndex: 2, totalQuestions: 3, shouldMoveToNext: false, remainingQuestions: 0, isFinished: false}
💾 Saving interview: {id: 'ssxk4q9regmlgyup1w', messageCount: 24, duration: 219, isFinished: false, status: 'in_progress'}
🔄 Follow-up #1 on question 3
```

**Files Affected:**
- `app/interview/[id]/page.tsx` - Interview completion logic around lines 268-323

**Needs Investigation:**
- Why shouldMoveToNext logic isn't triggering on last question
- Whether setIsComplete is actually being called
- If there's a race condition between state updates
- Whether the completion detection logic is fundamentally flawed

---

## Miscellaneous

### Custom Branding
**Status:** v2+
**Priority:** Low

**Description:**
Allow researchers to customize participant-facing branding.

**Features:**
- Upload logo
- Customize intro text
- Set brand colors
- Custom domain (instead of surveyplus.app/study/123)

**Rationale:**
Enterprise clients may want interviews to feel native to their brand.

---

### API Access
**Status:** v3+
**Priority:** Low

**Description:**
Public API for programmatic study creation and data export.

**Use Cases:**
- Integrate SurveyPlus into existing research tools
- Automate study creation based on product events
- Pull data into BI tools

**Rationale:**
Power users and enterprise clients want programmatic access.

---

*This document is living and should be updated as new ideas emerge.*
