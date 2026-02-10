# Design Spec: SurveyPlus

> A warm, professional design system for AI-moderated research interviews — sophisticated enough for UX researchers, accessible enough for participants.

---

## Personality

Where SurveyPlus falls on the design spectrums:

| Spectrum | Position | Notes |
|----------|----------|-------|
| **Tone** | Professional, trustworthy | Research tool for UX professionals — serious but approachable, never playful |
| **Density** | Balanced | Setup screens need clarity and breathing room; reports are information-rich but scannable |
| **Temperature** | Warm | Warm neutrals (#f5f3ef surfaces) create an inviting feel; not cold/technical like pure grays |
| **Weight** | Light to medium | Elegant serif headings (Instrument Serif) paired with clean sans UI (DM Sans) |
| **Shape** | Soft, rounded | 8-12px radius on cards, 22px pill inputs — friendly but professional |
| **Color** | Muted with vibrant accents | Warm neutrals + indigo primary + cyan accent — sophisticated restraint, not rainbow chaos |

---

## Inspiration

**Apps that influenced this direction:**
- **Linear** — Professional tone, clean information hierarchy, sophisticated use of color
- **Notion** — Warm surfaces, balanced density, approachable professionalism
- **Anthropic Claude** — Minimal chrome, conversation-focused, warm color palette

**From the prototype aesthetic (surveyplus-v2.jsx):**
- Instrument Serif + DM Sans pairing for editorial warmth
- Warm off-white surfaces (#fafaf8, #f5f3ef) instead of stark white
- Indigo primary with cyan accent for depth without being corporate-blue boring
- Pill-shaped inputs and smooth animations for polish

---

## Color Palette

### Light Mode (Default)

| Role | Value | Tailwind | Usage |
|------|-------|----------|-------|
| **background** | `hsl(45, 20%, 98%)` | `#fafaf8` | Page canvas — warm, not stark white |
| **foreground** | `hsl(240, 21%, 15%)` | `#1a1a2e` | Primary text — deep ink, excellent contrast |
| **card** | `hsl(40, 18%, 95%)` | `#f5f3ef` | Elevated surfaces, cards, modals — warm off-white |
| **card-foreground** | `hsl(240, 21%, 15%)` | `#1a1a2e` | Text on cards (same as foreground) |
| **muted** | `hsl(40, 15%, 90%)` | `#e8e6e1` | Disabled states, subtle backgrounds |
| **muted-foreground** | `hsl(240, 10%, 45%)` | `#6b6b7c` | Secondary text, captions, metadata |
| **primary** | `hsl(243, 75%, 59%)` | `#4f46e5` | CTA buttons, links, active states (indigo-600) |
| **primary-foreground** | `hsl(0, 0%, 100%)` | `#ffffff` | Text on primary buttons |
| **secondary** | `hsl(240, 5%, 84%)` | `#d4d4d8` | Secondary buttons, tags (zinc-300) |
| **secondary-foreground** | `hsl(240, 21%, 15%)` | `#1a1a2e` | Text on secondary buttons |
| **accent** | `hsl(188, 94%, 37%)` | `#0891b2` | Highlights, badges, interview UI (cyan-600) |
| **accent-foreground** | `hsl(0, 0%, 100%)` | `#ffffff` | Text on accent elements |
| **success** | `hsl(160, 84%, 39%)` | `#059669` | Positive confirmations, completed states (emerald-600) |
| **success-foreground** | `hsl(0, 0%, 100%)` | `#ffffff` | Text on success elements |
| **warning** | `hsl(32, 95%, 44%)` | `#d97706` | Caution states, preview mode (amber-600) |
| **warning-foreground** | `hsl(0, 0%, 100%)` | `#ffffff` | Text on warning elements |
| **destructive** | `hsl(0, 72%, 51%)` | `#dc2626` | Danger actions, errors (red-600) |
| **destructive-foreground** | `hsl(0, 0%, 100%)` | `#ffffff` | Text on destructive buttons |
| **border** | `hsl(40, 12%, 88%)` | `#e8e6e1` | Dividers, card edges, input borders — warm gray |
| **ring** | `hsl(243, 75%, 59%)` | `#4f46e5` | Focus rings (matches primary) |

### Dark Mode

| Role | Value | Tailwind | Usage |
|------|-------|----------|-------|
| **background** | `hsl(240, 15%, 7%)` | `#0f0f14` | Page canvas — very dark with warm tint |
| **foreground** | `hsl(45, 10%, 93%)` | `#edece8` | Primary text — warm off-white, not harsh |
| **card** | `hsl(240, 12%, 10%)` | `#161619` | Elevated surfaces — slightly lighter than background |
| **card-foreground** | `hsl(45, 10%, 93%)` | `#edece8` | Text on cards |
| **muted** | `hsl(240, 10%, 18%)` | `#2a2a30` | Disabled states, subtle backgrounds |
| **muted-foreground** | `hsl(240, 5%, 55%)` | `#8888a0` | Secondary text, captions — matches prototype |
| **primary** | `hsl(243, 75%, 65%)` | `#6366f1` | Primary actions — lighter than light mode for visibility (indigo-500) |
| **primary-foreground** | `hsl(240, 15%, 7%)` | `#0f0f14` | Text on primary (dark for contrast) |
| **secondary** | `hsl(240, 8%, 25%)` | `#3a3a42` | Secondary buttons — subtle lift from background |
| **secondary-foreground** | `hsl(45, 10%, 93%)` | `#edece8` | Text on secondary |
| **accent** | `hsl(188, 85%, 50%)` | `#06b6d4` | Highlights — slightly lighter/vibrant in dark (cyan-500) |
| **accent-foreground** | `hsl(240, 15%, 7%)` | `#0f0f14` | Text on accent |
| **success** | `hsl(160, 75%, 45%)` | `#10b981` | Success states — bumped for visibility (emerald-500) |
| **success-foreground** | `hsl(240, 15%, 7%)` | `#0f0f14` | Text on success |
| **warning** | `hsl(32, 90%, 55%)` | `#f59e0b` | Warning states — lighter for dark bg (amber-500) |
| **warning-foreground** | `hsl(240, 15%, 7%)` | `#0f0f14` | Text on warning |
| **destructive** | `hsl(0, 70%, 60%)` | `#ef4444` | Danger actions — lighter for visibility (red-500) |
| **destructive-foreground** | `hsl(0, 0%, 100%)` | `#ffffff` | Text on destructive |
| **border** | `hsl(240, 8%, 20%)` | `#2e2e36` | Dividers — subtle, low contrast in dark |
| **ring** | `hsl(243, 75%, 65%)` | `#6366f1` | Focus rings (matches primary) |

### Color Rationale

**Why warm neutrals?** Research is inherently human work. Warm surfaces (#fafaf8, #f5f3ef in light; tinted darks in dark mode) feel inviting and reduce eye strain during long sessions. Stark white (#fff) or pure black (#000) feel sterile and harsh.

**Why indigo primary?** Professional but not corporate. Blue conveys trust, but indigo is more sophisticated than generic sky blue. Pairs beautifully with warm neutrals.

**Why cyan accent?** Creates visual contrast with indigo without clashing. Used sparingly for interview UI elements (participant chat bubbles, progress indicators) to distinguish from researcher-facing primary actions.

**Semantic colors:** Standard success/warning/destructive hues, but matched to the overall saturation level (not neon bright). In dark mode, these are bumped 5-10% lighter to maintain visibility on dark backgrounds.

---

## Typography

### Fonts

| Role | Font Family | Weights Used | Rationale |
|------|-------------|--------------|-----------|
| **Display/Headings** | Instrument Serif | 400 (Regular), 400 Italic | Elegant, editorial warmth; used for page titles, section headings, branding |
| **Body/UI** | DM Sans | 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold) | Clean, highly readable; geometric but friendly |

**Font pairing:** The serif + sans combination creates sophistication without stuffiness. Instrument Serif adds personality to headings; DM Sans keeps the UI crisp and functional.

### Type Scale

Using a **1.25 ratio (major third)** for balanced hierarchy:

| Size | rem | px | Use Case |
|------|-----|-----|----------|
| **xs** | 0.75rem | 12px | Fine print, small badges, timestamp metadata |
| **sm** | 0.875rem | 14px | Captions, helper text, secondary metadata |
| **base** | 1rem | 16px | Body text, UI labels, default |
| **lg** | 1.125rem | 18px | Emphasized body text, large labels |
| **xl** | 1.25rem | 20px | Card titles, section labels |
| **2xl** | 1.5rem | 24px | Section headings (e.g., "Findings by Research Question") |
| **3xl** | 1.875rem | 30px | Page titles (e.g., "Study Setup", "Research Report") |
| **4xl** | 2.25rem | 36px | Hero headings (dashboard "Your Studies") — sparse use |

### Font Weight Strategy

| Weight | Value | Usage |
|--------|-------|-------|
| **Light** | 300 | Large display text for elegance (use sparingly) |
| **Regular** | 400 | Body text, default UI text, serif headings |
| **Medium** | 500 | UI labels, buttons, emphasized inline text |
| **Semibold** | 600 | Card titles, navigation items, strong headings |
| **Bold** | 700 | Page titles, critical alerts (use sparingly) |

### Line Height

- **Headings:** 1.2 (tight, for impact)
- **Body text:** 1.6 (comfortable reading)
- **UI labels:** 1.4 (balanced)

### Typography Rationale

Instrument Serif is warm and editorial, perfect for a research tool that values depth and thoughtfulness. DM Sans is a modern geometric sans with humanist touches — readable at small sizes, friendly without being casual. Together they create a professional-yet-approachable voice.

---

## Spacing & Density

### Base Unit
**4px** (Tailwind default) — all spacing is a multiple of 4px.

### Density Approach
**Balanced** — Research setup needs clarity and breathing room; reports are information-dense but still scannable.

### Component Padding

| Component | Padding |
|-----------|---------|
| **Cards** | `p-6` (24px) — generous but not excessive |
| **Buttons (standard)** | `px-5 py-2.5` (20px × 10px) |
| **Buttons (small)** | `px-3 py-1.5` (12px × 6px) |
| **Buttons (large)** | `px-6 py-3` (24px × 12px) |
| **Input fields** | `px-4 py-3` (16px × 12px) — comfortable touch targets |
| **Nav bar** | `px-8` (32px horizontal) |
| **Page containers** | `px-6 py-10` (24px × 40px) on mobile, `px-8 py-12` on desktop |

### Section Spacing

| Context | Spacing |
|---------|---------|
| **Between sections** | `mb-8` to `mb-12` (32-48px) |
| **Between cards in a list** | `gap-3` to `gap-4` (12-16px) |
| **Within cards (between elements)** | `gap-3` to `gap-4` (12-16px) |
| **Page header to content** | `mb-8` to `mb-10` (32-40px) |

### Max Widths

| Screen Type | Max Width |
|-------------|-----------|
| **Dashboard/Monitor** | `max-w-5xl` (1024px) — wide enough for side-by-side content |
| **Setup forms** | `max-w-2xl` (672px) — focused, single-column |
| **Report view** | `max-w-3xl` (768px) — optimal reading width for long-form content |
| **Interview (participant)** | `max-w-2xl` (672px) — comfortable chat width |

---

## Shape & Depth

### Border Radius

| Element | Radius | Tailwind | Rationale |
|---------|--------|----------|-----------|
| **Cards, modals, panels** | `12px` | `rounded-xl` | Primary container radius — soft but not overly round |
| **Buttons (standard)** | `8px` | `rounded-lg` | Slightly less round than containers for differentiation |
| **Inputs (text)** | `8px` | `rounded-lg` | Matches buttons for consistency |
| **Chat input (participant)** | `22px` | `rounded-[22px]` | Pill-shaped for messaging app feel |
| **Badges, tags, avatars** | `full` | `rounded-full` | Always circular/pill |
| **Small elements** | `6px` | `rounded-md` | Dropdowns, tooltips, small cards |

**CSS Variable:**
```css
--radius: 0.75rem; /* 12px — base container radius */
```

Derived radii:
- `md`: `calc(var(--radius) - 2px)` = 10px
- `sm`: `calc(var(--radius) - 4px)` = 8px

### Shadow Style

**Subtle elevation** — Shadows are used sparingly to indicate hierarchy, not for drama.

| Element | Shadow | Usage |
|---------|--------|-------|
| **Cards** | `border-border border` + no shadow | Borders define cards; shadows only on hover/focus if needed |
| **Modals/Dialogs** | `shadow-lg` | Clear elevation above page content |
| **Dropdowns** | `shadow-md` | Floating menus |
| **Sticky nav** | `border-b border-border` | No shadow, just border separation |
| **Hover states (optional)** | `shadow-sm` | Very subtle lift on interactive cards |

**Rationale:** Warm, flat aesthetic with borders doing most of the heavy lifting. Shadows are reserved for truly elevated elements (modals, dropdowns).

### Alternative Depth Techniques

- **Colored left borders:** Used in report view for findings (`border-l-3 border-l-primary`)
- **Background tints:** Muted backgrounds for nested content (`bg-muted`)
- **Backdrop blur:** Sticky header uses `backdrop-blur-sm` for layering effect (optional)

---

## Motion & Transitions

### Transition Duration

**150–200ms** — Balanced, smooth but snappy.

| Element | Duration | Easing |
|---------|----------|--------|
| **Hover states** | `150ms` | `ease-out` |
| **Focus rings** | `150ms` | `ease-out` |
| **Color changes** | `150ms` | `ease-in-out` |
| **Modal/dropdown appearance** | `200ms` | `ease-out` |
| **Page transitions** | `300ms` | `ease-in-out` |

### Animations

From the prototype:
- **Fade up:** Elements enter from below with opacity fade (`fadeUp` keyframe)
- **Fade in:** Simple opacity fade for sequential reveals
- **Typing indicator:** Bouncing dots for AI "thinking" state

**What to animate:**
- Hover states (background, color)
- Focus rings
- Modal/dropdown entrance (fade + scale)
- Accordion expand/collapse
- Progress bar fills
- Chat message appearance (fade-up)

**What NOT to animate:**
- Layout shifts
- Border radius changes
- Font size changes (jarring)

---

## Dark Mode

### Mode Configuration
**Both modes supported, light default.**

**Rationale:** UX researchers work long hours analyzing data and writing reports. Dark mode reduces eye strain in low-light environments. However, light mode is default because:
1. Most research happens during work hours in lit offices
2. Participants completing interviews are often on mobile in varied lighting
3. Light mode is more universally accessible

### Implementation

**Toggle location:** Top-right of navigation bar (sun/moon icon).

**Persistence:** User preference saved to `localStorage` and applied on page load.

**Default behavior:**
1. Check `localStorage` for saved preference
2. If none, fall back to `prefers-color-scheme` media query
3. If neither, default to light mode

**No flash of wrong theme:** Blocking script in `<head>` applies `.dark` class before render.

### Dark Mode Palette Notes

**Background:** `hsl(240, 15%, 7%)` — Not pure black. Tinted with primary hue to maintain warmth and personality.

**Card surfaces:** `hsl(240, 12%, 10%)` — Slightly lighter than background (in dark mode, higher elevation = lighter, opposite of light mode).

**Text:** `hsl(45, 10%, 93%)` — Not pure white. Warm off-white reduces harshness.

**Primary color:** Bumped from indigo-600 to indigo-500 (lighter) in dark mode to maintain vibrancy against dark backgrounds.

**Borders:** Very subtle (`hsl(240, 8%, 20%)`) — 8-12% lightness difference from background. Borders become less prominent in dark mode.

**Semantic colors:** Success/warning/destructive all shifted 5-10% lighter for readability on dark surfaces.

---

## Tailwind Config

Colors are defined as CSS custom properties in `globals.css`, then referenced in Tailwind config:

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  darkMode: "class", // Enable dark mode with .dark class
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)", // 12px
        md: "calc(var(--radius) - 2px)", // 10px
        sm: "calc(var(--radius) - 4px)", // 8px
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
```

---

## Design Decisions

### Decision: Warm Neutrals Over Pure White/Black
**What:** Light mode uses `#fafaf8` and `#f5f3ef` instead of `#ffffff`. Dark mode uses `#0f0f14` instead of `#000000`.
**Why:** Research is human work. Warm surfaces feel inviting and reduce eye strain. Stark extremes feel sterile and harsh.

### Decision: Indigo + Cyan Two-Color System
**What:** Primary actions use indigo (`#4f46e5`), participant-facing elements use cyan accent (`#0891b2`).
**Why:** Creates clear visual distinction between researcher actions (indigo) and participant experience (cyan) without overwhelming the palette. Both colors pair well with warm neutrals.

### Decision: Serif + Sans Pairing
**What:** Instrument Serif for headings, DM Sans for UI.
**Why:** Adds editorial warmth appropriate for a research tool. Serif conveys thoughtfulness and depth; sans ensures UI clarity. Creates visual hierarchy naturally.

### Decision: Pill-Shaped Chat Input
**What:** Participant chat input uses `rounded-[22px]` instead of standard `rounded-lg`.
**Why:** Mimics familiar messaging apps (iMessage, WhatsApp). Signals "this is a conversation" not "this is a form."

### Decision: Border-Heavy, Shadow-Light Elevation
**What:** Cards use borders (`border-border`) instead of shadows for separation.
**Why:** Cleaner, flatter aesthetic that feels modern. Shadows reserved for truly elevated elements (modals) to maintain meaning.

### Decision: Balanced Density, Not Compact
**What:** Cards use `p-6`, sections use `gap-4` to `gap-6`.
**Why:** Setup screens need clarity and breathing room to encourage thoughtful input. Reports are dense with content but need scannable structure. Compact density would feel rushed and cramped.

### Decision: Time-Based Progress in Interviews
**What:** Participant interview shows "~4 min remaining" instead of "Question 3 of 6".
**Why:** (From UX-SPEC.md) Time-based progress matches participant expectations. Question counts create confusion when AI asks follow-ups.

---

## Brand Constraints

**None for v1.** SurveyPlus is a new product with freedom to define its visual identity.

**Future consideration:** If deployed as white-label tool, allow customization of primary color and logo while maintaining the design system structure.

---

*This design system balances warmth and professionalism, creating a tool that feels approachable for participants and sophisticated for researchers.*
