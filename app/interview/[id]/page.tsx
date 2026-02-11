"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useParams } from "next/navigation"
import { useStudy } from "@/hooks/useStudy"
import { Message, Interview } from "@/types"
import { saveInterview, getInterview } from "@/lib/storage"
import { generateId } from "@/lib/utils"

export default function InterviewPage() {
  const params = useParams()
  const studyId = params.id as string

  const { study, loading: studyLoading } = useStudy(studyId)

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [followUpCount, setFollowUpCount] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [interviewStartTime, setInterviewStartTime] = useState<Date | null>(null)

  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const interviewIdRef = useRef<string | null>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  // Auto-focus input after AI responds
  useEffect(() => {
    if (!isTyping && !isComplete && hasStarted) {
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isTyping, isComplete, hasStarted])

  // Auto-grow textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "44px"
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 140) + "px"
    }
  }, [input])

  const handleStartInterview = useCallback(() => {
    if (!study) return

    // Create interview session
    const now = new Date()
    const interviewId = generateId()
    interviewIdRef.current = interviewId
    setInterviewStartTime(now)

    const newInterview: Interview = {
      id: interviewId,
      studyId: studyId,
      messages: [],
      status: "in_progress",
      duration: 0,
      startedAt: now
    }

    saveInterview(newInterview)
    setHasStarted(true)
    setIsTyping(true)

    setTimeout(() => {
      const welcomeMsg: Message = {
        role: "ai",
        text: "Thanks for participating! I'll be asking you a few questions about your experience. This should take about 5-10 minutes. Just respond naturally — there are no right or wrong answers.",
        timestamp: new Date()
      }
      setMessages([welcomeMsg])

      // Save with first message
      saveInterview({
        ...newInterview,
        messages: [welcomeMsg],
        duration: Math.floor((new Date().getTime() - now.getTime()) / 1000)
      })

      setTimeout(() => {
        const firstQ: Message = {
          role: "ai",
          text: study.questionFramework[0],
          timestamp: new Date()
        }
        const updatedMessages = [welcomeMsg, firstQ]
        setMessages(updatedMessages)

        // Save with both messages
        saveInterview({
          ...newInterview,
          messages: updatedMessages,
          duration: Math.floor((new Date().getTime() - now.getTime()) / 1000)
        })

        setIsTyping(false)
      }, 1200)
    }, 600)
  }, [study, studyId])

  const handleCompleteInterview = useCallback(() => {
    if (!study || !interviewIdRef.current || !interviewStartTime) return

    const interview = getInterview(interviewIdRef.current)
    if (interview) {
      const now = new Date()
      saveInterview({
        ...interview,
        status: "complete",
        completedAt: now,
        duration: Math.floor((now.getTime() - interviewStartTime.getTime()) / 1000)
      })
    }
  }, [study, interviewStartTime])

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isTyping || !study) return

    const userMessage = input.trim()
    setInput("")
    const userMsg: Message = { role: "user", text: userMessage, timestamp: new Date() }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)

    // Save message to interview
    if (interviewIdRef.current && interviewStartTime) {
      const interview = getInterview(interviewIdRef.current)
      if (interview) {
        saveInterview({
          ...interview,
          messages: updatedMessages,
          duration: Math.floor((new Date().getTime() - interviewStartTime.getTime()) / 1000)
        })
      }
    }

    setIsTyping(true)

    try {
      // Prepare conversation history for API
      const conversationHistory = [...messages, { role: "user", text: userMessage, timestamp: new Date() }]
        .filter(m => !m.text.startsWith("Thanks for participating"))
        .map(m => ({
          role: m.role === "ai" ? "assistant" : "user",
          content: m.text
        }))

      const currentQuestion = currentQuestionIndex
      const remainingQuestions = study.questionFramework.length - currentQuestion - 1
      const wordCount = userMessage.split(/\s+/).length
      const lowerText = userMessage.toLowerCase()

      // Detect signals that warrant deeper exploration
      const hasEmotionalSignal = /frustrated|annoying|love|hate|excited|worried|concerned|difficult|easy|helpful|confusing|satisfying|disappointing/i.test(userMessage)
      const hasVagueLanguage = /kind of|sort of|basically|generally|usually|sometimes|stuff|things|a bit|pretty much/i.test(userMessage)
      const mentionsProblem = /problem|issue|challenge|struggle|bug|error|fail|broke|doesn't work|hard to|difficult to/i.test(userMessage)
      const mentionsWorkaround = /instead|workaround|hack|manual|copy|paste|different|another way|found that/i.test(userMessage)
      const isShortResponse = wordCount < 15
      const isReallyShort = wordCount < 8

      // Smart follow-up decision logic
      const maxFollowUps = 4 // Allow more depth
      const isInteresting = hasEmotionalSignal || mentionsProblem || mentionsWorkaround
      const needsClarification = hasVagueLanguage || isShortResponse

      // Move on if: hit max follow-ups OR (got good depth AND response is detailed)
      const hasGoodDepth = followUpCount >= 2 && wordCount >= 30
      const isOnLastQuestion = remainingQuestions === 0

      // CRITICAL: Last question completion logic with hard cap
      // Force completion after MAX 3 follow-ups on last question to prevent infinite loops
      const MAX_LAST_QUESTION_FOLLOWUPS = 3

      let shouldMoveToNext = false
      if (isOnLastQuestion) {
        // On last question: complete after 3 follow-ups OR earlier with good responses
        shouldMoveToNext =
          followUpCount >= MAX_LAST_QUESTION_FOLLOWUPS || // Hard cap at 3 - MUST complete
          (followUpCount >= 2 && wordCount >= 15) ||       // 2 follow-ups + any real response
          (followUpCount >= 1 && wordCount >= 30)          // 1 follow-up + detailed response (lowered from 40)
      } else {
        // On regular questions: standard follow-up logic
        shouldMoveToNext =
          followUpCount >= maxFollowUps ||
          (hasGoodDepth && !isInteresting) ||
          (followUpCount >= 3 && wordCount >= 20)
      }

      let instruction = ""
      if (shouldMoveToNext && remainingQuestions > 0) {
        instruction = `You've explored this well. Briefly acknowledge, then smoothly transition to: "${study.questionFramework[currentQuestion + 1]}"`
      } else if (shouldMoveToNext && remainingQuestions === 0) {
        instruction = `WRAP UP THE INTERVIEW NOW. Warmly acknowledge their response and thank them. Say something like: "Thank you so much for sharing — this has been really valuable. That's all the questions I have for you today."`
      } else if (remainingQuestions === 0) {
        // On last question but not ready to wrap up yet
        const followUpsLeft = MAX_LAST_QUESTION_FOLLOWUPS - followUpCount
        instruction = `This is the FINAL question (follow-up ${followUpCount + 1} of max ${MAX_LAST_QUESTION_FOLLOWUPS}). Ask ONE more thoughtful follow-up to deepen understanding. After ${followUpsLeft} more follow-up(s), you'll wrap up.`
      } else {
        // Contextual follow-up guidance
        let followUpHint = ""
        if (isReallyShort) {
          followUpHint = "Their answer was very brief. Gently invite them to elaborate with an open question like 'Can you tell me more about that?' or 'What was that like for you?'"
        } else if (hasEmotionalSignal) {
          followUpHint = "They mentioned an emotional response. Dig into the root cause: 'What specifically made you feel that way?' or 'Can you walk me through what happened?'"
        } else if (mentionsProblem) {
          followUpHint = "They mentioned a problem. Understand the impact: 'How did that affect you?' or 'What did you end up doing?'"
        } else if (mentionsWorkaround) {
          followUpHint = "They mentioned a workaround. Understand the motivation: 'What made you go with that approach?' or 'How did you figure that out?'"
        } else if (hasVagueLanguage) {
          followUpHint = "Their answer was a bit vague. Ask for a concrete example: 'Can you give me a specific example?' or 'What does that look like in practice?'"
        } else {
          followUpHint = "Look for the most interesting thread in their response and pull on it. What would a curious researcher want to understand better?"
        }

        instruction = `Ask ONE thoughtful follow-up question. ${followUpHint}

RULES:
- Be genuinely curious, not interrogative
- Build on what they just said
- Sound natural and conversational
- 1-2 sentences max
- Don't use the word "why" repeatedly - find natural ways to explore motivation
- If they seem to be repeating themselves or running out of things to say, acknowledge and move to next question`
      }

      const systemPrompt = `You are an expert user researcher conducting a qualitative interview. You're warm, genuinely curious, and skilled at helping people articulate their experiences.

RESEARCH GOAL: ${study.researchGoal}

RESEARCH QUESTIONS WE'RE EXPLORING:
${study.researchQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

INTERVIEW STRUCTURE:
${study.questionFramework.map((q, i) => `Q${i + 1}: ${q}`).join("\n")}

CURRENT STATE: Q${currentQuestion + 1}/${study.questionFramework.length} | Follow-ups: ${followUpCount}/${maxFollowUps} | Remaining: ${remainingQuestions}

YOUR TASK: ${instruction}

INTERVIEWING PRINCIPLES:
- Listen actively: Build on what they just said, show you're paying attention
- Be curious about the 'why': When they mention behaviors, understand motivations
- Seek specifics: If they're abstract, ask for concrete examples or stories
- Notice emotion: When they express feeling, explore what caused it
- Follow interesting threads: If something seems important to them, dig deeper
- Know when to move on: If they're repeating themselves or seem done, gracefully transition
- Stay natural: Sound like a thoughtful human having a conversation, not a bot running a script
- Be concise: 1-2 sentences max. Get to your question quickly.
- Never lead: Don't suggest answers or put words in their mouth

STYLE:
- Conversational and warm, not formal or robotic
- "Can you tell me more about..." not "Why did you..."
- "What was that like?" not "Why?"
- Brief acknowledgment before your question: "That's interesting — how did you..."`

      // Call our API route instead of Claude directly
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: conversationHistory,
          systemPrompt
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "API request failed")
      }

      const data = await response.json()
      const aiText = data.content?.map((c: any) => c.text || "").join("") || "Thank you for sharing that."

      setIsTyping(false)
      const aiMsg: Message = { role: "ai", text: aiText, timestamp: new Date() }
      const allMessages = [...updatedMessages, aiMsg]
      setMessages(allMessages)

      // Determine if interview should complete
      const isFinished = shouldMoveToNext && remainingQuestions === 0

      console.log("🔍 Interview state check:", {
        currentQuestionIndex,
        totalQuestions: study.questionFramework.length,
        followUpCount,
        wordCount,
        remainingQuestions,
        isOnLastQuestion,
        shouldMoveToNext,
        isFinished,
        reason: isFinished
          ? "COMPLETING INTERVIEW"
          : shouldMoveToNext
          ? `Moving to Q${currentQuestionIndex + 2}`
          : `Follow-up #${followUpCount + 1} on Q${currentQuestionIndex + 1}`
      })

      // Save AI message to interview (and mark complete if finished)
      if (interviewIdRef.current && interviewStartTime) {
        const interview = getInterview(interviewIdRef.current)
        if (interview) {
          const now = new Date()
          const duration = Math.floor((now.getTime() - interviewStartTime.getTime()) / 1000)

          console.log("💾 Saving interview:", {
            id: interview.id,
            messageCount: allMessages.length,
            duration,
            isFinished,
            status: isFinished ? "complete" : "in_progress"
          })

          saveInterview({
            ...interview,
            messages: allMessages,
            duration: duration,
            status: isFinished ? "complete" : "in_progress",
            completedAt: isFinished ? now : undefined
          })
        } else {
          console.error("❌ Interview not found:", interviewIdRef.current)
        }
      } else {
        console.error("❌ Missing interview data:", {
          hasId: !!interviewIdRef.current,
          hasStartTime: !!interviewStartTime
        })
      }

      // SAFETY CHECK: If somehow we hit 5 follow-ups on ANY question, force move forward
      // This should never happen with the logic above, but prevents infinite loops
      if (followUpCount >= 5) {
        console.warn("⚠️ SAFETY: Hit max follow-ups (5), forcing completion/next question")
        if (remainingQuestions === 0) {
          setIsComplete(true)
        } else {
          setCurrentQuestionIndex(prev => prev + 1)
          setFollowUpCount(0)
        }
      } else if (shouldMoveToNext) {
        if (remainingQuestions === 0) {
          console.log("✅ Interview complete! Setting isComplete to true")
          setIsComplete(true)
        } else {
          console.log(`➡️ Moving to next question: ${currentQuestionIndex + 1} → ${currentQuestionIndex + 2}`)
          setCurrentQuestionIndex(prev => prev + 1)
          setFollowUpCount(0)
        }
      } else {
        console.log(`🔄 Follow-up #${followUpCount + 1} on question ${currentQuestionIndex + 1}`)
        setFollowUpCount(prev => prev + 1)
      }

    } catch (error) {
      console.error("API Error:", error)
      setIsTyping(false)

      // Fallback behavior (API error scenario)
      const MAX_LAST_QUESTION_FOLLOWUPS = 3
      const isOnLastQuestionFallback = currentQuestionIndex >= study.questionFramework.length - 1
      const shouldCompleteFallback = isOnLastQuestionFallback && followUpCount >= MAX_LAST_QUESTION_FOLLOWUPS - 1

      const fallback = shouldCompleteFallback
        ? "Thank you so much for sharing your experience — this has been really valuable."
        : followUpCount < 2
        ? "That's really interesting — can you tell me more about that?"
        : currentQuestionIndex < study.questionFramework.length - 1
        ? `Thank you for sharing that. ${study.questionFramework[currentQuestionIndex + 1]}`
        : "Thank you so much for sharing — that's helpful. Can you tell me a bit more?"

      const fallbackMsg: Message = { role: "ai", text: fallback, timestamp: new Date() }
      const allMessages = [...updatedMessages, fallbackMsg]
      setMessages(allMessages)

      // Determine if interview should complete (fallback scenario)
      const willComplete = shouldCompleteFallback

      // Save fallback message to interview (and mark complete if finished)
      if (interviewIdRef.current && interviewStartTime) {
        const interview = getInterview(interviewIdRef.current)
        if (interview) {
          const now = new Date()
          const duration = Math.floor((now.getTime() - interviewStartTime.getTime()) / 1000)

          saveInterview({
            ...interview,
            messages: allMessages,
            duration: duration,
            status: willComplete ? "complete" : "in_progress",
            completedAt: willComplete ? now : undefined
          })
        }
      }

      // Match the same state update logic as the successful case
      if (willComplete) {
        console.log("✅ Interview complete (fallback)! Setting isComplete to true")
        setIsComplete(true)
      } else if (followUpCount >= 3 && currentQuestionIndex < study.questionFramework.length - 1) {
        console.log(`➡️ Moving to next question (fallback): ${currentQuestionIndex + 1} → ${currentQuestionIndex + 2}`)
        setCurrentQuestionIndex(prev => prev + 1)
        setFollowUpCount(0)
      } else {
        console.log(`🔄 Follow-up #${followUpCount + 1} (fallback)`)
        setFollowUpCount(prev => prev + 1)
      }
    }
  }, [input, isTyping, messages, study, currentQuestionIndex, followUpCount, handleCompleteInterview, interviewStartTime])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (studyLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!study) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Study not found</p>
        </div>
      </div>
    )
  }

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-card rounded-lg border border-border p-8 space-y-6 fade-up">
          <div className="text-center space-y-3">
            <h1 className="text-2xl font-semibold text-foreground">{study.name}</h1>
            <p className="text-muted-foreground">
              You&rsquo;ll be chatting with an AI interviewer about your experience. This should take about 5-10 minutes.
            </p>
          </div>

          <div className="rounded-lg bg-muted/30 p-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Note:</strong> This is an AI-moderated interview. Your responses will help inform research on: {study.researchGoal}
            </p>
          </div>

          <button
            onClick={handleStartInterview}
            className="w-full rounded-lg bg-primary text-primary-foreground px-6 py-3 font-medium text-lg hover:bg-primary/90 transition-colors"
          >
            Let&rsquo;s start
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header - Sticky */}
      <div className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur px-6 py-4 flex items-center justify-between">
        <h2 className="font-medium text-foreground">{study.name}</h2>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>Question {Math.min(currentQuestionIndex + 1, study.questionFramework.length)} of {study.questionFramework.length}</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex fade-up ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-card border border-border text-foreground rounded-bl-sm"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-5 py-4">
              <div className="flex gap-1">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      {isComplete ? (
        <div className="border-t border-border bg-card px-6 py-8 text-center fade-up">
          <div className="text-4xl mb-3">✓</div>
          <p className="text-lg font-medium text-foreground mb-2">Interview Complete</p>
          <p className="text-sm text-muted-foreground mb-6">Thank you for participating!</p>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-6 py-3 font-medium hover:bg-primary/90 transition-colors"
          >
            Done
          </a>
        </div>
      ) : (
        <div className="border-t border-border bg-card px-6 py-4">
          <div className="flex gap-3 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your response... (Enter to send, Shift+Enter for new line)"
              disabled={isTyping}
              rows={1}
              className="flex-1 rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary disabled:opacity-50"
              style={{ minHeight: "44px", maxHeight: "140px" }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              className="flex-shrink-0 w-11 h-11 rounded-full bg-primary text-primary-foreground disabled:bg-border disabled:cursor-not-allowed flex items-center justify-center text-xl hover:bg-primary/90 transition-colors"
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
