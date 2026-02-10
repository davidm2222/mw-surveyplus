import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { transcript, researchGoal } = await request.json()

    if (!transcript) {
      return NextResponse.json(
        { error: "Transcript is required" },
        { status: 400 }
      )
    }

    const apiKey = process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      )
    }

    const systemPrompt = `You are a research analyst creating concise interview summaries.

RESEARCH GOAL: ${researchGoal}

Your task: Read this interview transcript and write a 1-2 sentence summary capturing the key insights or patterns that emerged. Focus on what the participant revealed about the research goal.

Be specific and concrete. Avoid generic statements like "the participant shared their experience." Instead, capture what they actually said or revealed.

Format: Just write the 1-2 sentence summary, nothing else.`

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 200,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: transcript
          }
        ]
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("Claude API error:", error)
      return NextResponse.json(
        { error: "Failed to generate summary" },
        { status: response.status }
      )
    }

    const data = await response.json()
    const summary = data.content?.map((c: any) => c.text || "").join("") || "No summary generated."

    return NextResponse.json({ summary })

  } catch (error) {
    console.error("Summarize API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
