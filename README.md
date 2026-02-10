# SurveyPlus

> AI-moderated research interviews that deliver interview-quality depth at survey-level scale and speed.

## Overview

SurveyPlus is an AI-powered research tool for UX researchers that transforms traditional online surveys into intelligent, conversational interviews, then automatically synthesizes findings into structured research reports.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm (recommended) or npm

### Installation

```bash
# Install pnpm globally (if not already installed)
npm install -g pnpm

# Install dependencies
pnpm install

# Copy environment variables template
cp .env.example .env.local
# Then edit .env.local with your API keys
```

### Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start

# Lint code
pnpm lint
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Deployment

This project is configured for automatic deployment to GitHub Pages.

### Initial Setup

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/mw-surveyplus.git
   git push -u origin main
   ```

2. Configure GitHub Pages:
   - Go to your repo Settings → Pages
   - Source: "GitHub Actions"

3. Add your Anthropic API key as a secret:
   - Go to Settings → Secrets and variables → Actions
   - New repository secret: `ANTHROPIC_API_KEY`
   - Paste your API key

4. The GitHub Action will automatically build and deploy on every push to `main`

Your site will be live at: `https://YOUR_USERNAME.github.io/mw-surveyplus/`

## Project Structure

```
surveyplus/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles + design tokens
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── ui/                # Generic UI components
│   └── features/          # Feature-specific components
├── lib/                   # Utilities and configs
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript types
├── public/                # Static assets
├── DESIGN-SPEC.md         # Design system documentation
├── UX-SPEC.md            # UX flows and decisions
└── ENHANCEMENTS.md       # Future feature ideas
```

## Design System

See [DESIGN-SPEC.md](./DESIGN-SPEC.md) for the complete design system including:
- Color palette (light + dark mode)
- Typography (Instrument Serif + DM Sans)
- Spacing, borders, shadows
- Design tokens and usage guidelines

## Documentation

- [Product Specification](./surveyplus-product-spec.md) - Full product requirements
- [UX Specification](./UX-SPEC.md) - User flows and design decisions
- [Design System](./DESIGN-SPEC.md) - Visual design guidelines
- [Future Enhancements](./ENHANCEMENTS.md) - Roadmap and ideas

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Firebase Firestore
- **Auth:** Firebase Auth
- **AI:** Anthropic Claude API
- **Deployment:** GitHub Pages (static export)

## License

Private - Internal use only
