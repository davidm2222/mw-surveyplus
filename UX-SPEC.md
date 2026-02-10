# UX Spec: SurveyPlus

> AI-moderated research interviews that deliver interview-quality depth at survey-level scale and speed.

## Problem

UX researchers face a persistent trade-off: surveys are cheap and scalable but produce shallow data, while moderated interviews yield rich insights but are expensive, time-consuming, and difficult to scale. Researchers often have to choose between breadth and depth, or spend days manually coding and synthesizing interview transcripts.

## Users

**Primary User: UX Researchers at mid-to-large companies**

- **Who they are:** Professional researchers who understand research methodology, value rigor, and are frustrated by time and cost constraints
- **Technical comfort:** Familiar with survey tools (Qualtrics, SurveyMonkey, Typeform), have conducted moderated interviews, write research reports for stakeholders
- **When they use it:** When they need qualitative depth but can't justify interview costs, or when they'd normally interview 5 people but wish they could interview 15
- **What they're trying to accomplish:** Understand user behavior, pain points, and motivations to inform product decisions

**Secondary User: Participants**

- **Who they are:** Current or potential users of the product being researched
- **When they use it:** When invited by a researcher, typically on mobile devices
- **What they're trying to accomplish:** Share their experience quickly and conversationally (not fill out a boring form)

## Current Alternatives

**Researchers currently choose between:**

1. **Online Surveys** — Shallow insights, no probing ability, but cheap and scalable
2. **Moderated Interviews** — Rich insights with skilled follow-up, but expensive ($100-500/participant), time-intensive (weeks to results), limited scale (6-15 typical)
3. **DIY Analysis** — Conducting interviews themselves then spending days transcribing, coding, and synthesizing

**What's frustrating:**
- Can't afford the depth they need at the scale they want
- Manual analysis is tedious and slow
- Have to choose between speed and insight quality

## Unique Value

**SurveyPlus creates a third option:** AI-moderated interviews that combine the depth of human interviews with the scale and speed of surveys.

**The one thing this does better:** Autonomous AI follow-ups that probe for depth based on the research goal, no researcher intervention required during sessions, with automatic synthesis into structured reports.

## User Goals

### Primary Goals (Researcher)

- Define a focused research study using the three-tier framework (Goal → Research Questions → Question Framework)
- Collect rich, qualitative data from participants through AI-moderated conversations
- Get a structured research report that directly answers their research questions
- Complete the full research cycle (setup → collect → analyze) in days, not weeks

### Primary Goals (Participant)

- Understand what they're being asked to do and how long it will take
- Share their experience conversationally without feeling interrogated
- Know they're making progress and won't be stuck forever
- Feel heard and finish with a sense of completion

### Secondary Goals

- Preview the interview experience before launching to participants
- Monitor data collection progress in real-time
- Access individual interview transcripts for deeper analysis
- Export and share findings with stakeholders

### Anti-Goals (What This App Does NOT Do)

- **Not a general survey tool** — No Likert scales, matrix questions, or quantitative-first approaches
- **Not a participant recruitment platform** — Researchers bring their own participants
- **Not a replacement for all interviews** — Sensitive topics, complex B2B contexts, and usability testing may still need human moderators
- **Not a team collaboration tool (v1)** — Single researcher per study; team features are v2+

## User Flows

### Researcher: Create & Launch Study (Core Flow)

1. **Dashboard** → Click "New Study"
2. **Create Study** → Enter study name
3. **Setup: Research Goal** → Write single goal statement ("After this study, I want to understand...")
4. **Setup: Research Questions** → Write 3-6 specific questions that, if answered, fulfill the goal
5. **Setup: Question Framework** → Write 5-8 conversational, participant-facing questions (drag to reorder)
6. **Setup: Configuration** → Set optional participant metadata fields (name, role, etc.)
7. **Preview** → **Required: Take the interview yourself** to experience what participants will see
8. **Launch** → One-click launch → Get shareable link + suggested email draft
9. **Outcome** → Study is live; can share link via email, Slack, panels, etc.

### Researcher: Monitor & Analyze

1. **Monitor Screen** → View live progress (completion count, avg duration, completion rate)
2. **Review Individual Interviews** → Expand any interview to see AI summary + full transcript
3. **Generate Report** → Click "Generate Report" (available after 3+ responses; can regenerate as more come in)
4. **Review Report** → Structured analysis with executive summary, findings by research question, themes, quotes, unexpected insights
5. **Export & Share** → Download report, share link with stakeholders

### Participant: Complete Interview

1. **Arrival (link click)** → See minimal intro screen
   - What this is about
   - AI disclosure (transparency)
   - Time estimate (5-10 min)
   - [Button: Let's start]
2. **Optional Metadata** → If configured by researcher: enter name, role, etc.
3. **Interview** → Chat-style conversation
   - AI asks question from framework
   - Participant responds
   - AI asks 1-2 follow-ups OR moves to next question
   - Time-based progress indicator ("~4 min remaining")
4. **Completion** → Thank you screen with optional quick feedback
   - "How was this experience?" (1-5 star rating)
   - Optional comment field
   - [Button: Done]

### Edge Cases & Error Handling

**Monitor Screen - Empty States:**
- 0 responses: "No interviews yet. Share your link:" [Copy link] [Email draft]
- 1-2 responses: "2 interviews complete. We recommend at least 5 for meaningful analysis." [Share link] [View transcripts]
- 5+ responses: "Ready for analysis!" [Generate Report]

**Participant Interview - Early Exit:**
- If participant closes browser mid-interview: Save partial transcript, mark as incomplete
- If participant clicks "End early" button: Thank them, save partial data
- Partial data is still valuable and can be reviewed by researcher

**Report Generation - Insufficient Data:**
- Block report generation if < 3 complete interviews
- Show message: "At least 3 complete interviews required for meaningful analysis"

## Pages / Screens

| Screen | Purpose | Key Elements |
|--------|---------|--------------|
| **Dashboard** | Study management hub | List of studies (draft, active, completed); "New Study" button; status badges (draft/active/complete); quick stats per study |
| **Study Setup** | Define three-tier research framework | Three sequential sections: (1) Research Goal, (2) Research Questions (3-6), (3) Question Framework (5-8, drag-to-reorder); Metadata configuration; Navigation: Back/Next/Preview |
| **Preview** | Researcher tests the interview | Full interview experience in preview mode; "Preview Mode" badge; Option to edit setup or proceed to launch |
| **Launch** | Get shareable link and launch study | One-click launch; Shareable link with copy button; Suggested email draft; Optional: set participant cap or close date |
| **Monitor** | Track data collection progress | Stats cards (completed count, avg duration, completion rate, status); List of interviews with expand/collapse; Per-interview: participant metadata, AI summary, full transcript; "Generate Report" button (enabled after 3+) |
| **Report** | Present synthesized findings | Header (goal, participant count, avg duration, date range); Executive summary; Findings by research question (themes, participant counts, quotes); Unexpected insights; Further research areas; Appendix: individual interview summaries |
| **Interview (Participant)** | Participant-facing chat interface | Minimal intro screen; Optional metadata form; Chat interface (AI/participant messages); Time-based progress indicator; Typing indicator when AI is "thinking"; Multi-line input (auto-grow); Completion screen with optional feedback |

## Key Design Principles

### Overall Product
- **Research-focused, professional tone** — This is a tool for professionals, not a consumer app
- **Clean, minimal interface** — Remove everything that doesn't serve the user's goal
- **Progressive disclosure** — Show complexity only when needed
- **Transparency** — Participants always know they're talking to AI

### Researcher Experience
- **Fast setup, no friction to launch** — From idea to live study in < 10 minutes
- **Preview builds trust** — Experiencing the interview firsthand is essential
- **Clear mental model** — The three-tier framework creates a logical flow from strategy to execution
- **Researcher stays in control** — Manual triggers for major actions (launch, generate report); no surprises

### Participant Experience
- **Mobile-first** — Many participants will complete on phones; optimize for touch and small screens
- **Conversational, not interrogative** — Chat interface, warm AI tone, no form-like structure
- **Time respect** — Clear time estimate upfront, progress indicator, 5-10 minute promise kept
- **Natural pacing** — Typing indicators, brief delays to feel human (not instant chatbot)
- **Escape hatch** — Can end early; partial data still valuable

### AI Interviewer Behavior
- **Warm, curious, skilled** — Sounds like a thoughtful human researcher, not a chatbot
- **Autonomous but bounded** — 1-2 follow-ups max per question; respects time limits
- **Goal-aware** — All decisions guided by research goal and research questions
- **Never leading** — Probes for clarity and depth, never suggests answers
- **Time-aware** — Adjusts follow-up frequency if participant is verbose

## Design Aesthetic

Based on the prototype (surveyplus-v2.jsx), maintain:

**Typography:**
- Display/headings: Instrument Serif (elegant, professional)
- Body: DM Sans (clean, readable)

**Color Palette (Light Mode):**
- Ink: #1a1a2e (primary text)
- Surface: #fafaf8 (background)
- Primary: #4f46e5 (indigo — actions, links)
- Accent: #0891b2 (cyan — highlights)
- Success: #059669 (green — completions)
- Warning: #d97706 (amber — previews/cautions)
- Borders: #e8e6e1 (subtle separation)

**Add Dark Mode:**
- Define dark mode color palette (TBD during /ui-design phase)
- System preference detection
- Toggle in user settings

**Interactions:**
- Smooth animations (fade-up, fade-in)
- Soft shadows and borders
- Rounded corners (8-12px)
- Gentle hover states
- Progress indicators with eased transitions

## Technical Decisions

### Stack
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS (with design tokens)
- **Database:** Firebase Firestore
- **Auth:** Firebase Auth (for researchers)
- **AI:** Anthropic Claude API (interviews + analysis)
- **Deployment:** GitHub Pages (static export)

### Data Model (Conceptual)

```
Study {
  id, name, status (draft/active/complete)
  researchGoal (string)
  researchQuestions (array)
  questionFramework (array, ordered)
  metadataFields (array, optional)
  shareableLink (generated)
  createdBy (researcher ID)
  createdAt, updatedAt
}

Interview {
  id, studyId
  participantMetadata (optional)
  messages (array of {role, text, timestamp})
  status (in_progress/complete/abandoned)
  duration (seconds)
  aiSummary (generated post-interview)
  completedAt
}

Report {
  id, studyId
  executiveSummary (string)
  findings (array: {researchQuestion, answer, themes[]})
  unexpectedInsights (array)
  furtherResearch (array)
  generatedAt
}
```

### AI Behavior (Interview Engine)

**For each participant response, the AI evaluates:**
- Vague/surface-level → Probe for specifics
- Rich/detailed → Acknowledge and move on
- Unexpected insight relevant to goal → Explore briefly
- Participant seems frustrated/terse → Move to next topic
- Sufficient depth reached → Wrap up gracefully

**Constraints:**
- Max 1-2 follow-ups per framework question
- Never ask leading questions
- Never go off-topic from research goal
- Mirror researcher's tone from question framework
- Time-aware: adjust follow-up frequency if participant is verbose

### Participant Access
- No authentication required (reduces friction)
- Unique shareable link per study
- Optional: participant cap, close date (v2)

## Key Decisions

### Decision: Progress Indicator Style
**What:** Time-based progress ("~4 min remaining") instead of question count ("Question 3 of 6")
**Why:** Question count creates mismatch when AI asks follow-ups; time-based matches participant expectations

### Decision: Required Preview
**What:** Researcher must take the interview themselves before launching
**Why:** Builds trust in AI quality, lets them experience what participants will see, catches issues early

### Decision: Manual Report Generation
**What:** Researcher clicks "Generate Report" (available after 3+ responses)
**Why:** Keeps researcher in control; allows iterative review (check at 5, again at 10, final at 20)

### Decision: No Participant Auth (v1)
**What:** Participants access via shareable link, no login required
**Why:** Reduces friction; researcher tracks via optional metadata fields

### Decision: Partial Interview Data Kept
**What:** If participant exits early, save transcript as incomplete
**Why:** Some data is better than none; researcher can review even partial interviews

### Decision: Completion Feedback Optional
**What:** After interview, ask participant for quick rating + optional comment
**Why:** Lets us track participant satisfaction (success metric), catches issues AI missed, makes participants feel heard

## Open Questions

**To be resolved during building:**

1. **Report regeneration:** If researcher generates report at 8 responses then collects 7 more, can they regenerate? Does the old report get replaced or versioned?

2. **Metadata field configuration:** How many optional fields can researcher configure? What types (text, dropdown, etc.)?

3. **Share link mechanics:** Is it a simple URL with study ID, or does it include tracking parameters?

4. **Interview timeout:** What happens if participant is idle for 10+ minutes? Auto-save and allow resume, or mark abandoned?

5. **Dark mode toggle location:** In nav bar, user settings page, or both?

6. **Export formats:** Report export as PDF, Markdown, both?

7. **Individual transcript sharing:** Can researcher share a single interview transcript (vs full report)?

8. **AI follow-up transparency:** Should participants see that follow-ups are dynamic, or should it feel like a seamless conversation?

---

*This spec captures the validated user flows and design principles. Implementation details will be refined during building.*
