# Project Instructions for Claude

## Communication Style

**Be brief.** Keep responses concise and to the point:
- Start with action, not explanation (unless I ask for context)
- Limit responses to 3-5 sentences unless explaining complex topics
- Skip pleasantries and filler ("Great question!", "Let me help you with that")

## Token Management

**Be efficient with tokens:**
- Don't read entire large files when you only need a section
- Use `offset` and `limit` parameters when reading long files
- Use Grep with `head_limit` to avoid massive search results
- Don't re-read files unnecessarily — trust your memory within a session
- If a file is >500 lines and you need specific info, ask me which section to focus on

**Prefer targeted tools:**
- Use Glob for finding files by name/pattern (not `find` or `ls`)
- Use Grep for searching file contents (not reading everything)
- Read specific files only when you need their content

## When to Ask vs. When to Decide

**Ask me when:**
- Multiple valid approaches with different tradeoffs
- Architectural decisions that affect multiple files
- Breaking changes to existing functionality
- Unclear requirements

**Just do it when:**
- Obvious bug fixes
- Code formatting/linting
- Implementing clearly specified features
- Refactoring within a single component
