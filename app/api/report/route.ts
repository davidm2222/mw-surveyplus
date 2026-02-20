import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { study, interviews } = body

    const apiKey = process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured. Add ANTHROPIC_API_KEY to .env.local" },
        { status: 500 }
      )
    }

    // Build comprehensive context for Claude
    const transcripts = interviews.map((interview: any, idx: number) => {
      const messages = interview.messages
        .filter((m: any) => !m.text.startsWith("Thanks for participating"))
        .map((m: any) => `${m.role === "user" ? "Participant" : "AI"}: ${m.text}`)
        .join("\n\n")
      return `=== INTERVIEW ${idx + 1} ===\nDuration: ${Math.floor(interview.duration / 60)}m ${interview.duration % 60}s\n\n${messages}`
    }).join("\n\n" + "=".repeat(80) + "\n\n")

    const systemPrompt = `You are an expert qualitative research analyst. You've been given ${interviews.length} interview transcripts from a user research study.

RESEARCH GOAL:
${study.researchGoal}

RESEARCH QUESTIONS WE'RE TRYING TO ANSWER:
${study.researchQuestions.map((q: string, i: number) => `${i + 1}. ${q}`).join("\n")}

YOUR TASK:
Analyze all ${interviews.length} interviews and generate a comprehensive research report.

ANALYSIS APPROACH:
1. Read through all transcripts carefully
2. Identify patterns, themes, and insights across participants
3. Look for both expected findings and surprises
4. Ground your analysis in specific quotes from participants
5. Count how many participants mentioned each theme
6. Be honest about what the data shows - don't overstate or understate

OUTPUT FORMAT:
Respond with a valid JSON object (no markdown formatting, just raw JSON) with this exact structure:
{
  "executiveSummary": "A 2-3 sentence high-level summary of key findings",
  "findings": [
    {
      "researchQuestion": "The original research question",
      "answer": "2-3 sentence answer based on the data",
      "themes": [
        {
          "theme": "Brief theme name (e.g., 'Frustration with manual data entry')",
          "count": 3,
          "total": ${interviews.length},
          "quotes": ["Exact quote from participant", "Another quote"]
        }
      ]
    }
  ],
  "unexpectedInsights": [
    "An insight you didn't expect to find",
    "Another surprising discovery"
  ],
  "furtherResearch": [
    "A question or area to explore in future research",
    "Another research opportunity"
  ]
}

IMPORTANT:
- Include 2-4 themes per research question
- Each theme should have 1-3 representative quotes
- Only include themes mentioned by at least 2 participants (or 1 if total < 3)
- Quotes should be exact, verbatim excerpts from transcripts
- Be specific and actionable in your insights
- Return ONLY valid JSON, no other text or markdown formatting`

    const requestBody = JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Here are the ${interviews.length} interview transcripts to analyze:\n\n${transcripts}\n\nPlease analyze these interviews and return the JSON report as specified.`
        }
      ]
    })

    const maxRetries = 3
    let response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: requestBody
    })

    for (let attempt = 1; attempt <= maxRetries && response.status === 529; attempt++) {
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)))
      response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: requestBody
      })
    }

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json(
        { error: `API error: ${response.status}`, details: error },
        { status: response.status }
      )
    }

    const data = await response.json()
    const reportText = data.content?.map((c: any) => c.text || "").join("") || "{}"

    // Parse the JSON response
    let reportData
    try {
      reportData = JSON.parse(reportText)
    } catch (parseError) {
      // If JSON parsing fails, try to extract JSON from markdown code blocks
      const jsonMatch = reportText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/)
      if (jsonMatch) {
        reportData = JSON.parse(jsonMatch[1])
      } else {
        throw new Error("Failed to parse report JSON")
      }
    }

    return NextResponse.json({ report: reportData })

  } catch (error) {
    console.error("Report API error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
