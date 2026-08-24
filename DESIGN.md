# DESIGN.md — Universal Design System

> The single source of truth for all UI/UX decisions in the application.
> Every component, page, and interaction must follow this document.
> Written to be directly implementable with no interpretation required.

---

## 0. Design Philosophy

The application serves high-pressure, time-sensitive workflows. Every design decision must answer one question: **does this help users complete their tasks faster and with fewer mistakes?**

Four principles govern every choice:

**1. Clarity over cleverness.** Labels are plain language. Icons always have text. No feature requires a tooltip to understand its purpose.

**2. Trust through consistency.** The same status color means the same thing on every page. The same action always appears in the same place. Familiarity builds confidence.

**3. Real-time, no refresh.** The UI must feel live — stat cards update as new data arrives, badges update as events complete. Never show stale data.

**4. Mobile is a first-class surface.** Users work from phones. Every page must work at 375px, not just scale down.

---

## 1. Design Tokens

These are the only values you should use for colour, spacing, and radius.
Set them in configuration under `theme.extend` and as CSS variables in the global stylesheet.

### 1.1 Colour Palette

```ts
colors: {
  brand: {
    primary:        '#0F2D52',  // Primary — headings, primary buttons, focus rings
    'primary-hover': '#0A2240',  // Hover state for primary elements
    accent:         '#127CDD',  // Accent — active states, highlights, active links
    'accent-light': '#EBF5FF',  // Light accent backgrounds (active nav, badge bg)
  },
  surface: {
    page:         '#F8FAFC',  // Page background
    card:         '#FFFFFF',  // Card, dialog, sheet background
    muted:        '#F1F5F9',  // Muted backgrounds, skeleton loaders
    border:       '#E2E8F0',  // All borders and dividers
    'border-focus': '#0F2D52', // Input focus ring colour
  },
  text: {
    primary:   '#0F172A',  // Headings, important labels, primary content
    secondary: '#475569',  // Subheadings, meta text, placeholder
    disabled:  '#94A3B8',  // Disabled inputs, muted content
    inverse:   '#FFFFFF',  // Text on dark/primary backgrounds
  },
}
```

### 1.2 Status Colour Map

Status badges follow a consistent visual pattern: `rounded-full px-2.5 py-0.5 text-xs font-semibold` with `bg-*-100 text-*-700` colour pairs.

**Primary status variants:**

- **Success/Active:** `bg-green-100 text-green-700` — for completed, confirmed, active states
- **Pending/Warning:** `bg-amber-100 text-amber-700` — for pending, in-progress, awaiting action
- **Error/Failure:** `bg-red-100 text-red-600` — for failed, cancelled, error states
- **Neutral/Inactive:** `bg-slate-100 text-slate-600` — for completed, resolved, neutral states
- **Accent:** `bg-blue-100 text-blue-700` — for information, active selections
- **Info/Alternate:** `bg-teal-100 text-teal-700` — for alternative states or channels
- **Archived/Muted:** `bg-zinc-100 text-zinc-600` — for archived, muted, or deprecated states

Define domain-specific badge components with their own STATUS_CONFIG maps, but always follow the colour contract above.

### 1.3 Typography Scale

| Role            | Font Weight & Size                | Used For                              |
|-----------------|-----------------------------------|-----------------------------------------|
| Page title      | Bold, 1.5rem (24px)               | `h1` at top of every page             |
| Section heading | Semibold, 1rem (16px)             | Card titles, section labels (h2)      |
| Label           | Semibold, 0.875rem (14px)         | Form labels, table column headers     |
| Body            | Normal, 0.875rem (14px)           | Table values, descriptions, messages  |
| Small / meta    | Normal, 0.6875rem (11px)          | Timestamps, sub-labels, helper text   |
| Micro           | Normal, 0.75rem (12px)            | Badge labels, icon captions           |
| Button          | Semibold, 0.875rem (14px)         | All buttons                           |

Rules: never go below 11px in dense contexts (table rows, badge text). Use primary text colour for emphasis, secondary for supporting info.

### 1.4 Border Radius

| Element                   | Value   |
|---------------------------|---------|
| Cards, dialogs, sheets    | Large   |
| Buttons, inputs           | Medium  |
| Badges, chips, tags       | Full    |
| Table rows                | None    |

### 1.5 Shadows

| Context       | Intensity |
|---------------|-----------|
| Cards on page | Extra-small |
| Dialogs       | Extra-large |
| Dropdowns     | Large       |

---

## 2. Layout Shell

The shell is built once in the primary layout and applied to all authenticated routes.

### 2.1 Desktop Layout (≥ 768px)

- **Sidebar:** Collapsible sidebar (240px full, 3rem collapsed). Persists state in session/local storage.
- **Sidebar contents:** Branded logo/icon at top, primary navigation links with icon + label, active state highlighting, collapsible sections for sub-navigation
- **Top bar:** Fixed header spanning full width. Left: breadcrumb or page title. Right: user menu, org/context switcher, help button
- **Main content:** Flex-grow area. Apply consistent padding (24px), max-width for readability on ultra-wide screens (1400px)
- **Sidebar active state:** Highlight active link with accent background + bold text. The active link's section expands if collapsible.

### 2.2 Mobile Layout (< 768px)

- **Sidebar:** Hidden by default. Bottom navigation bar (48px) with 4–5 icon buttons (icon only, no labels)
- **Top bar:** Fixed 56px header with hamburger menu (left), page title (center), user menu (right)
- **Hamburger menu:** Slide-in drawer from left showing full navigation (same as desktop sidebar)
- **Main content:** Full-width, padding 16px. No max-width constraint.
- **Bottom bar:** Sticky, shows section or primary action (e.g., "New Appointment" button)

### 2.3 Sidebar Navigation

- Group related sections logically (e.g., "Core", "Admin", "Resources")
- Icon + label for every nav item (icon 18–20px, label 14px)
- Active link: accent background (`bg-accent-light`), primary text, bold
- Collapsed state: icon only (48px width), tooltip on hover with full label
- Collapsible sections: expand/collapse arrow, smooth height transition, remember open state per session

### 2.4 Top Bar

- **Left:** Breadcrumb navigation or page title (2xl bold heading)
- **Right:** Help icon, notifications bell (if applicable), user avatar with dropdown menu
- **Height:** 56px (mobile) / 64px (desktop)
- **Shadow:** Apply subtle shadow to separate from main content

---

## 3. Typography & Spacing

### 3.1 Spacing Scale

Use a consistent spacing scale (base unit = 4px or 8px):

```
2px   — hairlines, ultra-dense UI
4px   — compact spacing (gap between adjacent small elements)
8px   — standard button padding, tight component spacing
12px  — medium spacing (between sections within a card)
16px  — card padding, section spacing
24px  — page padding, large section spacing
32px  — hero spacing, major section separation
48px  — landmark spacing (nav, modals)
64px  — full-page spacing
```

### 3.2 Line Height

- **Headings:** 1.2 (tight)
- **Body:** 1.5 (comfortable reading)
- **Form labels:** 1.4 (slightly tight, prevents wrapping)

### 3.3 Letter Spacing

- **Headings:** 0% (default)
- **All caps labels:** +0.5% (subtle, improves readability)

---

## 4. Common Component Patterns

### 4.1 Forms & Inputs

- **Input height:** 40px (desktop), 44px (mobile for easier touch)
- **Input padding:** 10px horizontal, 8px vertical
- **Input border:** 1px solid `surface-border`, rounded medium
- **Input focus:** Outline none, box-shadow with `border-focus` colour
- **Label:** Semibold, 14px, placed above input (not inside)
- **Validation:** Inline text (12px, red) below input. Show immediately on blur.
- **Placeholder:** 14px, `text-secondary`

### 4.2 Buttons

- **Primary button:** solid brand primary background, inverse text, rounded medium
- **Secondary button:** transparent background, brand primary text, brand primary border
- **Destructive button:** solid red background, white text
- **Disabled button:** muted background, disabled text colour, cursor not-allowed
- **Height:** 40px (desktop), 44px (mobile)
- **Padding:** 12px horizontal minimum
- **Font:** semibold, 14px
- **State transitions:** 150ms ease-out for background and text color

### 4.3 Badges & Status Indicators

- **Badge format:** `rounded-full px-2.5 py-0.5 text-xs font-semibold`
- **Icon + badge:** Place icon left of label, 2px gap
- **Standalone:** icon only (18px, primary colour) with optional tooltip
- **Colour:** Follow status colour map (section 1.2)

### 4.4 Cards

- **Layout:** padding 16px, border 1px `surface-border`, rounded large
- **Header (optional):** title (section heading) + optional icon or action (top-right)
- **Body:** default padding, stacked sections with 12px vertical gap
- **Footer (optional):** secondary actions, 16px top border
- **Shadow:** Extra-small shadow, subtle 2px elevation
- **Interaction:** Subtle hover state (slightly darker border or background lift)

### 4.5 Tables

- **Row height:** 44px (including padding)
- **Row hover:** subtle background highlight (`surface-muted`)
- **Header:** bold labels, `text-primary`, background `surface-muted`
- **Borders:** 1px `surface-border` between rows, no radius
- **Padding:** 12px horizontal per cell
- **Alignment:** Text left-aligned by default, numbers right-aligned
- **Empty state:** Centered message in a tall cell (100px+ height)

### 4.6 Modals & Dialogs

- **Width:** 90vw (mobile), 500px (desktop), max 90% viewport height
- **Padding:** 24px
- **Border radius:** Large
- **Shadow:** Extra-large (significant depth)
- **Overlay:** Semi-transparent dark background (rgba(0,0,0,0.5))
- **Close button:** Top-right corner, icon only (X, 20px)
- **Header:** Bold heading (page title size)
- **Body:** Standard typography, 12px vertical gap between sections
- **Footer:** Action buttons (primary + secondary), right-aligned
- **Dismiss on outside click:** Yes (unless form is dirty)

### 4.7 Dropdowns & Menus

- **Trigger:** Button or icon
- **Panel:** Positioned below trigger, min-width 200px, rounded large
- **Items:** 40px height per item, 12px horizontal padding, 8px vertical padding
- **Hover:** `bg-accent-light`
- **Active:** `text-accent`, bold
- **Divider:** 1px `surface-border`
- **Shadow:** Large shadow, sits above content
- **Animation:** Fade-in 150ms ease-out

### 4.8 Empty States

- **Icon:** 64px, secondary colour
- **Heading:** Section heading size, `text-primary`
- **Description:** Body text, `text-secondary`, 1–2 sentences
- **CTA (optional):** Primary button below
- **Layout:** Centered, vertical stack, 24px gap

### 4.9 Loading States

- **Skeleton loader:** Pulse animation on `surface-muted` background
- **Skeleton shape:** Match the element's aspect ratio (rounded for cards/avatars, rectangular for text)
- **Spinner:** Centered, 24–32px, brand primary colour
- **Duration:** 800ms per rotation

---

## 5. Interaction & Animation

### 5.1 Transitions

- **Hover states:** 150ms ease-out (colour, background)
- **Focus states:** Instant, with focus ring (3px `border-focus`)
- **Collapse/expand:** 200ms ease-in-out (height, opacity)
- **Route changes:** 200ms fade transition
- **Overlay appear:** 150ms fade-in

### 5.2 Real-Time Updates

- **Stat card updates:** Subtle colour flash + number highlight on change
- **Badge status change:** Smooth colour transition (200ms)
- **List item insert:** Slide-in from top or bottom (250ms)
- **Count badge:** Brief scale animation (1 → 1.2 → 1) on increment

### 5.3 Feedback

- **Toast/notification:** Slide-in from top-right (200ms), auto-dismiss after 3–5 seconds
- **Button click:** Subtle press feedback (2px scale down, 100ms)
- **Submission loading:** Disable button, show spinner inside
- **Error message:** Red text, appears immediately, dismissible after 5 seconds or on correction

---

## 6. Accessibility & Readability

### 6.1 Colour Contrast

- **Text on light backgrounds:** Minimum 4.5:1 (AA standard)
- **Text on coloured backgrounds:** Ensure sufficient contrast using status colour map
- **Icon + text badges:** Both icon and text meet contrast requirements independently
- **Focus indicators:** 3px solid ring, easily distinguishable from page background

### 6.2 Focus Management

- **Tab order:** Natural left-to-right, top-to-bottom
- **Focus trap:** Keep focus inside modals when open
- **Skip links (optional):** Direct to main content on first tab
- **Focus indicator:** Always visible, rounded ring around element

### 6.3 ARIA Labels

- **Buttons:** Use descriptive text or `aria-label` if icon-only
- **Form fields:** Associate `<label>` with `<input id>`
- **Live regions:** Use `aria-live="polite"` for real-time updates (stat cards, badges)
- **Headings:** Proper nesting (h1 → h2 → h3), no skipping levels

### 6.4 Readability

- **Line length:** 60–80 characters for body text (max-width 600px for dense text areas)
- **Line height:** 1.5 for body paragraphs
- **Font size minimum:** 14px for body text, 12px for dense tables/helper text, 11px for metadata
- **All caps:** Use sparingly; sentence case preferred for labels

---

## 7. Data & Real-Time Updates

### 7.1 Stat Cards

- **Format:** Large number (bold, 28px), label (secondary, 14px), optional trend indicator
- **Trend indicator:** Up/down arrow + % change, green for positive, red for negative (or opposite based on context)
- **Update state:** Subtle background flash on number change, smooth colour transition
- **Timestamp (optional):** "Last updated: X mins ago" (12px, `text-secondary`)

### 7.2 Lists & Tables

- **Reordering:** Items insert/remove with slide animation (250ms)
- **Badge update:** Smooth colour transition on status change (200ms)
- **Highlight new items:** Brief background highlight (2-second duration)
- **Virtual scrolling:** Implement for lists > 100 items

### 7.3 Error States

- **Input validation:** Red border + inline error text, appears on blur
- **Network error:** Full-page banner or in-card message, "Something went wrong. Retry?" CTA
- **Query error boundary:** Graceful fallback UI, link to settings/support
- **Timeout:** After 10 seconds, show "Taking longer than expected" message with retry button

---

## 8. Domain-Specific Patterns

### 8.1 Status Badge System

Create domain-specific badge components (e.g., `AppointmentStatusBadge`, `CallLogStatusBadge`). Each component:

- Defines its own `STATUS_CONFIG` map with label and className pairs
- Always follows the colour contract from section 1.2
- Can include a leading Lucide icon for clarity
- Exports a single component that takes a `status` prop

Example structure:

```ts
const STATUS_CONFIG = {
  pending:   { label: "Pending",   className: "bg-amber-100 text-amber-700" },
  confirmed: { label: "Confirmed", className: "bg-green-100 text-green-700" },
  failed:    { label: "Failed",    className: "bg-red-100 text-red-600" },
  // ...
}
```

### 8.2 Timeline & History Views

- **Event item:** Vertical line, circle/icon at left, event content to the right
- **Timestamp:** Small text, secondary colour, positioned above or right of content
- **Event type:** Icon (16–18px) + label (14px, bold)
- **Expandable details:** Click to show/hide additional information (smooth height transition)
- **Reversed order:** Most recent at top by default

### 8.3 Detail Sheets & Sidebars

- **Width:** 90vw (mobile), 400–500px (desktop)
- **Position:** Slide in from right (mobile) or overlay (desktop)
- **Header:** Bold title, close button (top-right)
- **Body:** Scrollable, standard padding
- **Footer (optional):** Action buttons, sticky if scrollable body
- **Animation:** Slide-in 250ms ease-out, slide-out 150ms ease-in

### 8.4 Wizard / Multi-Step Forms

- **Progress indicator:** Horizontal line or numbered steps at top
- **Current step highlight:** Bold, accent colour
- **Completed steps:** Check mark or tick
- **Next/Previous buttons:** Bottom-right, primary + secondary layout
- **Step validation:** Disable Next if current step has errors
- **Confirmation step (final):** Summary of all entries, option to edit previous steps

---

## 9. Mobile-Specific Considerations

### 9.1 Touch Targets

- **Minimum size:** 44px × 44px
- **Spacing:** 8px gap between adjacent targets
- **Buttons:** Ensure primary action is prominently sized

### 9.2 Mobile Navigation

- **Bottom bar:** 48px fixed height, 4–5 sections max
- **Hamburger drawer:** Full-height, slides from left, includes all sections
- **Breadcrumbs:** Show only parent + current (collapse if too long)
- **Tabs:** Horizontal scroll if > 4 tabs, snap alignment

### 9.3 Scrolling & Overflow

- **Horizontal scroll:** Minimal; prefer vertical layouts
- **Virtual scroll:** Implement for lists > 100 items
- **Floating action button (FAB):** Bottom-right, 56px diameter, clear of bottom nav
- **Sticky headers:** Section titles remain visible when scrolling table/list

### 9.4 Input Sizing

- **Input height:** 44px minimum (easier touch target)
- **Select/dropdown:** 44px height, large enough for touch
- **Date picker:** Full-screen modal on mobile (not inline calendar)
- **Keyboard avoidance:** Modal + input should scroll up to avoid keyboard overlap

---

## 10. Security & Compliance Patterns

### 10.1 Sensitive Data Display

- **Masking by default:** Display partial/redacted values (e.g., `+91 98••• •••67`)
- **Reveal on action:** Icon button (Eye) toggles full visibility
- **Timestamp on reveal:** Log when PII was accessed (optional, for audit trails)
- **Copy button:** For values that require copying (phone, email, ID)

### 10.2 Consent & Privacy

- **Consent badge:** Always visible on relevant sections with timestamp tooltip
- **GDPR/DPDP section:** Clearly labelled in settings, export/download capabilities
- **Data retention:** Display retention policy in settings
- **Opt-in toggles:** Clear on/off state, immediate feedback on change

### 10.3 Quota & Rate Limiting

- **Usage banner:** Top of all pages when usage ≥ 80%, dismissible for 24h
- **Usage widget (settings):** Visual progress bar + percentage + limits
- **Quota exhausted:** Clear message, suggest upgrade or contact support
- **Rate limit error:** "Too many requests. Please wait X seconds." + retry button

### 10.4 Audit & Logging

- **Action badges:** Visually indicate sensitive actions (delete, export, access)
- **Confirmation dialogs:** Required for destructive actions with clear description
- **Undo toast:** "Undone. Undo again?" option for reversible actions (5-second window)
- **Activity log (optional):** Searchable/filterable list of user actions

---

## 11. Internationalization (i18n)

### 11.1 Text Handling

- **All user-facing text:** Externalize to translation files
- **Pluralization:** Use `i18n` library's plural rules
- **Numbers & dates:** Format using locale-aware functions (not hardcoded)
- **RTL support (if needed):** Use CSS logical properties (`margin-inline`, `padding-inline`)

### 11.2 Dynamic Content

- **Helper text & errors:** Derived from backend or config, not hardcoded
- **Labels & placeholders:** Use consistent terminology across features
- **Tooltips & hints:** Keep to 50 words or less, clear and actionable

---

## 12. Build & Implementation

### 12.1 Setup Checklist

- [ ] Define design tokens in config (colours, spacing, shadows, border radius)
- [ ] Set up typography (font families, sizes, weights)
- [ ] Configure CSS variables for theme support
- [ ] Initialize component library (buttons, inputs, cards, dialogs, etc.)
- [ ] Create sidebar + header shell
- [ ] Set up navigation structure (routes, breadcrumbs)
- [ ] Implement mobile layout (bottom nav, hamburger)

### 12.2 Implementation Order

1. **Foundation:** Tokens, typography, base components
2. **Layout:** Dashboard shell, sidebar, top bar, navigation
3. **Pages:** Placeholder pages for all routes
4. **Tables & lists:** Data display, filters, sorting
5. **Forms & dialogs:** Input validation, multi-step forms
6. **Status badges & indicators:** Domain-specific variants
7. **Real-time updates:** Live data, animations, feedback
8. **Mobile optimizations:** Touch targets, overflow handling, responsive layout
9. **Accessibility:** Focus management, ARIA labels, contrast
10. **Polish:** Animations, transitions, edge cases
11. **Testing:** Desktop + mobile, multiple browsers, accessibility audit

### 12.3 Quality Gates

- [ ] All interactive elements have focus indicators
- [ ] Touch targets are ≥ 44px
- [ ] Text contrast meets WCAG AA (4.5:1 minimum)
- [ ] Mobile layout works at 320px, 375px, 768px, 1920px
- [ ] Real-time updates don't flicker or jump
- [ ] Error messages are helpful and actionable
- [ ] Empty states are present and on-brand
- [ ] Loading states are clear and brief
- [ ] Animations respect `prefers-reduced-motion`

---

*This document establishes the core design system. Feature-specific extensions and edge cases should be documented in feature briefs or component documentation, not here.*