"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useParams } from "next/navigation"
import { generateId } from "@/lib/utils"

interface Message {
  role: "ai" | "user"
  text: string
  timestamp: Date
}

interface Study {
  id: string
  name: string
  goal: string
  researchQuestions: string[]
  questionFramework: string[]
}

export default function InterviewPage() {
  const params = useParams()
  const studyId = params.id as string

  const [study, setStudy] = useState<Study | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [followUpCount, setFollowUpCount] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Load study from localStorage
  useEffect(() => {
    const studies = JSON.parse(localStorage.getItem("studies") || "[]")
    const foundStudy = studies.find((s: Study) => s.id === studyId)
    if (foundStudy) {
      setStudy(foundStudy)
    }
  }, [studyId])

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

  const startInterview = useCallback(() => {
    if (!study) return

    setHasStarted(true)
    setIsTyping(true)

    setTimeout(() => {
      setMessages([
        {
          role: "ai",
          text: "Thanks for participating! I'll be asking you a few questions about your experience. This should take about 5-10 minutes. Just respond naturally — there are no right or wrong answers.",
          timestamp: new Date()
        }
      ])

      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            role: "ai",
            text: study.questionFramework[0],
            timestamp: new Date()
          }
        ])
        setIsTyping(false)
      }, 1200)
    }, 600)
  }, [study])

  const saveInterview = useCallback(() => {
    if (!study) return

    const interview = {
      id: generateId(),
      studyId: study.id,
      messages,
      status: "complete",
      duration: Math.floor((new Date().getTime() - messages[0].timestamp.getTime()) / 1000),
      completedAt: new Date()
    }

    const interviews = JSON.parse(localStorage.getItem("interviews") || "[]")
    interviews.push(interview)
    localStorage.setItem("interviews", JSON.stringify(interviews))
  }, [study, messages])

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isTyping || !study) return

    const userMessage = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", text: userMessage, timestamp: new Date() }])
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
      const shouldMoveToNext =
        followUpCount >= maxFollowUps ||
        (hasGoodDepth && !isInteresting) ||
        (followUpCount >= 3 && wordCount >= 20)

      let instruction = ""
      if (shouldMoveToNext && remainingQuestions > 0) {
        instruction = `You've explored this well. Briefly acknowledge, then smoothly transition to: "${study.questionFramework[currentQuestion + 1]}"`
      } else if (shouldMoveToNext && remainingQuestions === 0) {
        instruction = `Final question complete. Warmly acknowledge and close: "Thank you so much for sharing — this has been really valuable."`
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

RESEARCH GOAL: ${study.goal}

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
      setMessages(prev => [...prev, { role: "ai", text: aiText, timestamp: new Date() }])

      // Update state based on decision
      if (shouldMoveToNext) {
        if (remainingQuestions === 0) {
          setIsComplete(true)
          saveInterview()
        } else {
          setCurrentQuestionIndex(prev => prev + 1)
          setFollowUpCount(0)
        }
      } else {
        setFollowUpCount(prev => prev + 1)
      }

    } catch (error) {
      console.error("API Error:", error)
      setIsTyping(false)

      // Fallback behavior
      const fallback = followUpCount < 3
        ? "That's really interesting — can you tell me more about that?"
        : currentQuestionIndex < study.questionFramework.length - 1
        ? `Thank you for sharing that. ${study.questionFramework[currentQuestionIndex + 1]}`
        : "Thank you so much for sharing your experience — this has been really valuable."

      setMessages(prev => [...prev, { role: "ai", text: fallback, timestamp: new Date() }])

      if (followUpCount >= 3) {
        if (currentQuestionIndex >= study.questionFramework.length - 1) {
          setIsComplete(true)
          saveInterview()
        } else {
          setCurrentQuestionIndex(prev => prev + 1)
          setFollowUpCount(0)
        }
      } else {
        setFollowUpCount(prev => prev + 1)
      }
    }
  }, [input, isTyping, messages, study, currentQuestionIndex, followUpCount, saveInterview])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
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
              <strong className="text-foreground">Note:</strong> This is an AI-moderated interview. Your responses will help inform research on: {study.goal}
            </p>
          </div>

          <button
            onClick={startInterview}
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
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
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
