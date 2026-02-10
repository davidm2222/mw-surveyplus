# SurveyPlus — Product Specification

**AI-Moderated Research Interviews**

*Interview-quality depth at survey-level scale and speed.*

Version 1.0 • February 2026 • DRAFT — For Internal Review

---

## 1. Executive Summary

> **Product Vision:** SurveyPlus is an AI-powered research tool that transforms traditional online surveys into intelligent, conversational interviews — then automatically synthesizes findings into structured research reports.

UX researchers face a persistent trade-off: surveys are cheap and scalable but produce shallow data, while moderated interviews yield rich insights but are expensive, time-consuming, and difficult to scale. SurveyPlus occupies the space between these two methods, delivering interview-quality depth at survey-level speed and cost.

The tool is built around a three-tier research framework. The researcher defines a research goal, research questions, and a participant question framework. An AI interviewer then conducts conversational sessions with each participant, autonomously generating follow-up questions guided by the research objective. After all interviews are complete, the AI synthesizes results into a structured report that directly addresses the original research questions.

### 1.1 Key Differentiators

- **Autonomous AI follow-ups:** The AI decides when and what to probe based on the research goal — no researcher intervention required during sessions.
- **Three-tier research framework:** Research goal → research questions → question framework creates a clear chain from purpose to execution.
- **Full-loop delivery:** From interview to structured report in one tool. No transcription, no manual coding, no separate analysis phase.
- **Participant-friendly:** 5–10 minute chat-style sessions that feel like a conversation, not a form.

---

## 2. Problem Statement

### 2.1 The Core Trade-Off

UX researchers currently choose between two imperfect methods:

| Dimension | Online Surveys | Moderated Interviews |
|---|---|---|
| Depth of insight | Shallow — no ability to probe | Rich — skilled follow-up |
| Cost per participant | Low ($0–50) | High ($100–500+) |
| Time to results | Days | Weeks |
| Scale | Unlimited | 6–15 typical |
| Analysis burden | Minimal (quantitative) | Heavy (transcribe, code, synthesize) |
| Participant experience | Impersonal, often tedious | Engaging but time-intensive |

SurveyPlus creates a third option: AI-moderated interviews that combine the depth of human interviews with the scale and speed of surveys.

### 2.2 Target User

**Primary:** UX researchers at mid-to-large companies who regularly conduct qualitative studies. They understand research methodology, value rigor, and are frustrated by the time and cost constraints that limit their research scope.

**Characteristics:** Familiar with survey tools (Qualtrics, SurveyMonkey, Typeform). Has conducted moderated interviews. Writes research reports for stakeholders. Under pressure to deliver insights faster.

### 2.3 What They'll Switch From

- **Surveys alone:** When they need depth but can't justify interview costs.
- **Reduced interview panels:** When they interview 5 people instead of 15 due to budget/time.
- **DIY analysis:** When they spend days manually coding and synthesizing interview transcripts.

---

## 3. Product Scope

### 3.1 What SurveyPlus Is

- A focused AI research tool for conducting and analyzing qualitative interviews at scale.
- A bridge between surveys and moderated interviews — not a replacement for either.
- A complete research workflow: setup → data collection → analysis → report.

### 3.2 What SurveyPlus Is Not (Anti-Goals)

> **Explicit Anti-Goals:**
> - **Not a general survey tool.** No Likert scales, matrix questions, or quantitative-first approaches. This is for qualitative depth.
> - **Not a replacement for all interviews.** Sensitive topics, complex B2B contexts, and usability testing still benefit from a human moderator.
> - **Not a participant recruitment platform.** Researchers bring their own participants. SurveyPlus provides a link to share.

---

## 4. Three-Tier Research Framework

The research framework is the intellectual backbone of the product. It creates a clear chain from strategic purpose to tactical execution, and the AI uses all three tiers to guide its behavior during interviews and analysis.

| Tier | Definition | Who Writes It | How the AI Uses It |
|---|---|---|---|
| **1. Research Goal** | The overarching purpose of the study. A single statement describing what the researcher wants to understand. | Researcher | North star for all AI decisions. Determines when to probe deeper vs. move on. |
| **2. Research Questions** | The specific questions that, if answered, will fulfill the research goal. Typically 3–6 questions. | Researcher | Structures the final report. Guides the AI's probing priorities. Maps findings to objectives. |
| **3. Question Framework** | The starter questions participants actually see. Conversational, open-ended prompts. Typically 5–8 questions. | Researcher | Conversation script. The AI starts here and follows up autonomously. |

### 4.1 Example: Research Framework in Practice

**Research Goal**

*"Understand why new users abandon the onboarding flow in the first week and identify the key friction points that prevent them from reaching their first successful project."*

**Research Questions**

1. What expectations do new users bring to the product, and where does the experience fail to meet them?
2. At what specific moments do users feel confused, frustrated, or lost during onboarding?
3. What would "success" in the first week look like from the user's perspective?
4. What external resources (if any) do users seek out, and what does that reveal about gaps in our onboarding?

**Question Framework (What Participants See)**

1. Tell me about your first experience with the product. What were you trying to accomplish?
2. Walk me through a moment where you felt stuck or unsure what to do next.
3. How did you try to figure things out when you got stuck?
4. Describe what a successful first week with the product would have looked like for you.
5. If you could change one thing about the getting-started experience, what would it be?

Note how each tier connects: the question framework generates participant stories, the AI's follow-ups pursue depth relevant to the research questions, and the analysis report directly addresses the research goal.

---

## 5. User Journeys

### 5.1 Researcher Journey

The researcher's experience spans the full lifecycle of a study:

| Stage | Action | Key Design Principle |
|---|---|---|
| Create Study | Name the study, set basic metadata | Fast start — don't front-load decisions |
| Define Research Goal | Write a single goal statement with guided prompt | Help them write a good one — this drives everything |
| Define Research Questions | Write 3–6 research questions | Show connection to goal; suggest improvements |
| Build Question Framework | Write 5–8 participant-facing questions | Reorder via drag-and-drop; AI tone preview |
| Preview & Test | Take the interview yourself | Essential for trust; lets researcher feel the experience |
| Configure & Launch | Set participant metadata fields; get share link | Sensible defaults; launch in one click |
| Monitor | Watch responses come in; see summaries per interview | Live progress; no action required |
| Review Report | Read structured analysis; dig into individual transcripts | Report directly answers research questions |
| Share & Export | Export report; share link with stakeholders | Multiple formats; stakeholder-friendly |

### 5.2 Participant Journey

The participant experience must be effortless, conversational, and respectful of time:

| Stage | Experience | Duration |
|---|---|---|
| Arrival | Open shared link → brief intro: who's running this, what it's about, that they're talking to an AI, estimated time | 15 seconds |
| Optional Identity | If configured: enter name / metadata fields | 15–30 seconds |
| Interview | Chat-style conversation. AI asks question → participant responds → AI follows up or moves on | 5–10 minutes |
| Completion | Thank you screen with optional comments | 10 seconds |

> **Critical Participant Experience Principles:**
> - **Transparency:** Participants know they're talking to an AI. This is non-negotiable for both ethics and data quality.
> - **Time respect:** A subtle progress indicator shows participants they're not in an endless loop. The 5–10 minute promise is kept.
> - **Escape hatch:** Participants can end early if they want. Partial data is still valuable.
> - **Conversational tone:** The AI sounds like a thoughtful human interviewer, not a chatbot. Warm, curious, and never interrogative.

---

## 6. AI Behavior Specification

The AI interviewer is the core of the product. Its behavior must feel like a skilled junior researcher who has been thoroughly briefed on the study.

### 6.1 Follow-Up Decision Logic

For each participant response, the AI evaluates:

| Signal | AI Action | Example |
|---|---|---|
| Vague or surface-level answer | Probe for specifics | "You mentioned it was confusing — can you walk me through exactly what happened?" |
| Rich, detailed answer | Acknowledge and move on | "That's really helpful, thank you. Let me ask about something else." |
| Unexpected insight relevant to research goal | Explore the tangent briefly | "That's interesting — you mentioned [X]. Can you tell me more about that?" |
| Participant seems frustrated or terse | Ease off, move to next topic | "No worries — let's move on to something different." |
| Sufficient depth reached overall | Wrap up gracefully | "I think I have a good picture. One last question…" |

### 6.2 Constraints

- **Maximum 1–2 follow-ups per framework question.** This enforces the 5–10 minute time target.
- **Never ask leading questions.** The AI probes for clarity and depth, never suggests answers.
- **Never go off-topic from the research goal.** Even interesting tangents are only pursued if they serve the objective.
- **Mirror the researcher's tone.** The question framework establishes the conversational register.
- **Graceful time management.** If a participant is verbose, the AI adjusts by asking fewer follow-ups on remaining questions.

### 6.3 Example Interview Flow

*Given the onboarding research framework from Section 4:*

> **AI:** "Tell me about your first experience with the product. What were you trying to accomplish?"
>
> **Participant:** "I was trying to set up a dashboard for my team."
>
> **AI (follow-up):** "What did you expect that process to look like before you started?"
>
> **Participant:** "I thought there'd be templates or something. I ended up staring at a blank screen."
>
> **AI (moves on):** "That's really helpful — the gap between expectation and reality is exactly what we're trying to understand. Let me ask about another moment…"

---

## 7. Screens & Interface

SurveyPlus has five primary screens. The interface should be clean, professional, and research-focused — it's a tool for professionals, not a consumer app.

### 7.1 Screen Inventory

| Screen | Purpose | Key Elements |
|---|---|---|
| Dashboard | Study management hub | List of studies (draft, active, completed); quick-create button; status indicators |
| Study Setup | Define the three-tier research framework and configure study settings | Three-section form: Goal → Research Questions → Question Framework; metadata config; preview button |
| Study Monitor | Track data collection progress | Participant count / completion rate; live transcript previews; individual interview summaries |
| Report View | Present synthesized findings | Structured report following template; expandable evidence quotes; individual transcript access |
| Interview Experience | Participant-facing chat interface | Minimal chrome; chat bubbles; progress indicator; intro and completion screens |

### 7.2 Study Setup (Critical Path)

The setup screen is the most important researcher touchpoint. The quality of everything downstream depends on the quality of input here. It is organized as three sequential sections, each building on the last:

**Section 1: Research Goal**

- **Guided prompt:** "Complete this sentence: After this study, I want to understand…"
- Single text input — encourages a focused, specific statement.
- Helper text with examples of strong vs. weak goals.
- AI validation: flags goals that are too vague or too broad and suggests refinements.

**Section 2: Research Questions**

- **Guided prompt:** "What specific questions, if answered, would fulfill this research goal?"
- 3–6 text fields. Researcher adds questions one at a time.
- Visual connection to the research goal (displayed above for reference).
- AI suggestions: based on the goal, the system can suggest starter research questions the researcher can edit or discard.

**Section 3: Question Framework**

- **Guided prompt:** "These are the questions participants will actually see. Write them in a conversational, open-ended tone."
- 5–8 text fields with drag-to-reorder.
- AI suggestions: based on the research questions, the system can suggest starter participant questions.
- Tone preview: shows how the AI might follow up on each question, so the researcher can calibrate expectations.

### 7.3 Interview Experience (Participant-Facing)

This screen must feel like a messaging app, not a survey form:

- **Visual design:** Clean chat interface. No sidebar, no navigation, no distractions. Just the conversation.
- **Message pacing:** AI messages appear with a brief typing indicator (500ms–1s) to feel natural, not instant.
- **Progress:** Subtle indicator (e.g., "Question 3 of 6" or a thin progress bar) so participants know they're progressing.
- **Input:** Multi-line text field that auto-grows. Large enough to encourage multi-sentence responses. Send on Enter, Shift+Enter for newlines.
- **Mobile-first:** Many participants will do this on their phone. The experience must work flawlessly on mobile.

### 7.4 Report View

The report is the deliverable the researcher shows to stakeholders. Its structure directly mirrors the research framework:

> **Report Template:**
> - **Header:** Research goal (restated), participant count, average session duration, date range.
> - **Executive Summary:** 3–4 sentence answer to the research goal. This is the "TLDR" for busy stakeholders.
> - **Findings by Research Question:** For each research question: a synthesized answer, key themes with participant counts (e.g., "8 of 12 participants"), and representative quotes.
> - **Unexpected Insights:** Themes that emerged outside the question framework but are relevant to the research goal.
> - **Areas for Further Research:** Questions the data raised but could not answer — natural next studies.
> - **Appendix:** Individual interview summaries with links to full transcripts.

---

## 8. Technical Considerations

### 8.1 AI Model Requirements

- **Interview engine:** Requires a model capable of multi-turn conversation with strong contextual reasoning. Must maintain awareness of the research goal, research questions, and full conversation history within each session.
- **Analysis engine:** Requires ability to process multiple full transcripts simultaneously and perform cross-participant thematic analysis. Must handle long context windows.
- **Suggestion engine:** Lighter-weight model for real-time suggestions during study setup (research question and question framework suggestions).

### 8.2 Data Architecture (Conceptual)

| Entity | Description | Key Relationships |
|---|---|---|
| Study | Container for one research initiative | Has one goal, many research questions, one question framework |
| Research Goal | Single text statement | Belongs to one study |
| Research Question | 3–6 specific questions | Belongs to one study; maps to report findings |
| Question Framework | 5–8 participant-facing questions | Belongs to one study; ordered sequence |
| Interview Session | One participant's conversation | Belongs to one study; contains messages |
| Message | Single chat message (AI or participant) | Belongs to one session; ordered by timestamp |
| Participant | Optional identity + metadata | Has one or more sessions |
| Report | Generated analysis document | Belongs to one study; generated after sessions complete |

### 8.3 Distribution (v1)

- **Shareable link:** Each study generates a unique URL. Researcher shares via email, Slack, user panels, etc.
- No authentication required for participants (reduces friction).
- Optional: researcher can set a participant cap or close date.
- **Future (v2+):** Email invitations with tracking, panel integrations.

### 8.4 Participant Identity

- By default, participants are anonymous (identified only by session ID).
- Researcher can configure optional metadata fields (e.g., name, role, company, tenure).
- Metadata fields appear on the intro screen before the interview begins.
- Metadata is used in analysis (e.g., "Users with <6 months tenure were more likely to report confusion").

---

## 9. Risks & Mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| AI follow-ups feel robotic or generic | High | Extensive prompt engineering; researcher preview/test mode; ongoing quality monitoring; feedback loop on individual interviews. |
| Participants give terse responses to AI | Medium | Warm conversational design; clear intro setting expectations; progress indicator to encourage completion. |
| Analysis report misses key themes | High | Allow researcher to review individual transcripts; flag confidence levels on findings; provide "unexpected insights" section. |
| Researchers don't trust AI-generated findings | High | Every finding is backed by direct quotes; full transcripts available; transparent methodology description in report. |
| Interview runs too long / too short | Medium | Time-aware follow-up logic; hard limit on follow-ups per question; progress indicator for participants. |
| Data privacy and consent concerns | High | Clear disclosure that AI is conducting the interview; transparent data handling; easy data deletion. |
| Cold start: setup feels like too much work | Medium | AI suggestions for research questions and question framework; templates for common study types. |

---

## 10. Success Metrics

### 10.1 Product Metrics

| Metric | Target | Why It Matters |
|---|---|---|
| Interview completion rate | >80% | Participants stay and finish — the experience works |
| Average session duration | 5–10 minutes | Hitting the time target without sacrificing depth |
| Report usefulness (researcher rating) | >4/5 | The output is actually valuable to the researcher |
| Time from launch to report | <48 hours (with sufficient responses) | Dramatically faster than manual research cycle |
| Study repeat rate | >50% within 90 days | Researchers find enough value to use it again |

### 10.2 Quality Metrics

- **Follow-up relevance score:** Human-rated assessment of whether AI follow-ups were appropriate and useful.
- **Theme accuracy:** Comparison of AI-identified themes vs. human researcher analysis on the same data.
- **Quote attribution accuracy:** Are quotes in the report correctly attributed and contextually appropriate?

---

## 11. Future Considerations (v2+)

These features are explicitly out of scope for v1 but represent natural extensions:

- **Email invitations with response tracking.** Know who's been invited, who's completed, and send reminders.
- **Panel integrations.** Connect to Prolific, UserTesting, or similar platforms for participant recruitment.
- **Multi-language support.** Conduct interviews in the participant's preferred language.
- **Longitudinal studies.** Re-interview the same participants over time to track changes.
- **Template library.** Pre-built research frameworks for common study types (onboarding, feature discovery, churn analysis).
- **Team collaboration.** Multiple researchers on one study; shared analysis and annotations.
- **Interactive report dashboard.** Filterable, explorable findings (by participant segment, theme, etc.).
- **Voice input for participants.** Speak responses instead of typing for richer, more natural data.
- **Mid-study adaptation.** Researcher reviews early interviews and adjusts the question framework for remaining participants.

---

*End of Specification*
