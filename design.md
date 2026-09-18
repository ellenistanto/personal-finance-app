# Design System — Personal Finance Dashboard

## Design Direction

Design a modern personal finance dashboard with a **dark minimalist interface**.

The visual direction should feel:

- Calm
- Premium
- Technical
- Mature
- Clean
- Functional
- Intentionally designed

The interface must **not look like a generic AI-generated SaaS dashboard**.

Avoid excessive decoration. Every visual element should have a clear purpose.

The design should work naturally on both **desktop and mobile**, with mobile treated as a first-class layout rather than a compressed desktop version.

---

## Core Principles

### 1. Minimalism Over Decoration

Use visual hierarchy instead of decorative elements.

Do not add:

- unnecessary gradients
- glowing effects
- excessive glassmorphism
- floating decorative shapes
- excessive shadows
- random illustrations
- oversized rounded cards
- unnecessary badges
- decorative icons
- excessive animations

The interface should feel spacious without wasting screen space.

---

### 2. Dark-First Interface

Use a dark color system as the foundation.

Suggested palette:

```text
Background:
#0A0A0A

Primary Surface:
#111111

Secondary Surface:
#161616

Elevated Surface:
#1C1C1C

Border:
#262626

Primary Text:
#F5F5F5

Secondary Text:
#A1A1AA

Muted Text:
#71717A

Positive:
#4ADE80

Negative:
#F87171

Accent:
#E5E5E5
```

Do not use a large number of accent colors.

Financial colors should primarily communicate meaning:

- Green → income / positive balance
- Red → expense / negative value
- Neutral → balance / general information

Colors should remain muted and sophisticated rather than neon.

---

## Typography

Use a modern sans-serif typeface.

Preferred:

```text
Inter
```

Fallback:

```text
system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

Typography should prioritize readability.

### Hierarchy

Page title:

- 28–32px desktop
- 24–28px mobile
- semibold

Section title:

- 18–20px
- semibold

Card title:

- 14–16px
- medium

Body:

- 14–15px

Secondary information:

- 12–13px

Financial numbers:

- use strong weight
- avoid unnecessarily huge typography
- use tabular numbers when appropriate

Avoid oversized typography commonly found in generic landing pages.

---

# Layout

## Desktop

Use a structured dashboard layout.

Recommended structure:

```text
┌───────────────────────────────────────────────────────┐
│ Sidebar / Navigation                                  │
├───────────────┬───────────────────────────────────────┤
│               │ Header                                │
│ Navigation    ├───────────────────────────────────────┤
│               │ Summary                                │
│               ├───────────────────────────────────────┤
│               │ Main Analytics / Transactions         │
│               │                                       │
│               │                                       │
└───────────────┴───────────────────────────────────────┘
```

Use a fixed or sticky sidebar on large screens when appropriate.

The content area should have a reasonable maximum width and should not stretch excessively on ultrawide monitors.

Recommended content width:

```text
max-width: 1400px
```

Use consistent spacing based on a small spacing scale.

Example:

```text
4px
8px
12px
16px
24px
32px
48px
```

Avoid arbitrary spacing values unless required by the layout.

---

# Mobile

Mobile must be treated as a separate responsive composition.

Do not simply shrink the desktop dashboard.

Recommended mobile structure:

```text
┌─────────────────────────┐
│ Header                  │
├─────────────────────────┤
│ Balance                 │
│ Income / Expense        │
├─────────────────────────┤
│ Main Chart              │
├─────────────────────────┤
│ Transactions            │
├─────────────────────────┤
│                         │
├─────────────────────────┤
│ Bottom Navigation       │
└─────────────────────────┘
```

Use:

- bottom navigation instead of a permanent sidebar
- full-width cards
- horizontal scrolling only when genuinely useful
- compact filters
- touch-friendly controls
- appropriate spacing around screen edges

Recommended mobile horizontal padding:

```text
16px
```

Do not make mobile cards excessively tall.

---

# Navigation

Desktop:

Use a simple sidebar with:

- Dashboard
- Transactions
- Analytics
- Budget
- Goals
- Settings

The sidebar should be visually quiet.

Do not use giant navigation buttons.

Active navigation should be communicated through:

- subtle background
- text contrast
- small indicator if necessary

Avoid colorful navigation states.

Mobile:

Use a bottom navigation bar for the most important destinations.

Keep it limited to approximately 4–5 primary items.

Secondary navigation can be placed inside menus or dedicated pages.

---

# Cards

Cards should be functional containers, not decorative objects.

Use:

```text
background: #111111
border: 1px solid #262626
border-radius: 12px
```

Avoid excessive rounding.

Do not make every section look like a floating glass card.

Cards should visually merge into the overall layout where possible.

Use elevation sparingly.

---

# Glassmorphism

If glass effects are used, keep them extremely subtle.

Allowed:

- slight transparency
- subtle border
- minimal blur

Avoid:

- strong blur
- glowing borders
- colorful glass
- heavy transparency
- multiple overlapping glass layers

The interface should still look good if the blur effect is removed.

---

# Dashboard

The dashboard should prioritize financial information.

Recommended hierarchy:

### Primary

Current balance / net balance.

### Secondary

- Income
- Expenses
- Savings
- Budget status

### Supporting

- Spending trends
- Category breakdown
- Recent transactions
- Financial goals

Do not make every metric equally prominent.

The most important information should visually dominate.

---

# Financial Summary

Use a clean summary section.

Example:

```text
Total Balance

Rp 12.450.000

+ Rp 4.200.000 income
− Rp 2.150.000 expenses
```

Use strong typography for the main value.

Avoid excessive decorative charts around simple numbers.

---

# Charts

Charts should communicate information, not decorate the dashboard.

Preferred:

- line charts
- bar charts
- simple area charts
- restrained donut charts

Charts should use a limited visual palette.

Avoid:

- 3D charts
- excessive gradients
- glowing chart lines
- unnecessary animation
- decorative chart backgrounds

Charts should remain readable on mobile.

On mobile:

- simplify chart labels
- allow horizontal scrolling when necessary
- prioritize the most important data points

---

# Transactions

Transactions should be highly scannable.

Desktop:

```text
Date | Description | Category | Amount
```

Mobile:

```text
Netflix
Entertainment

18 Sep 2026
− Rp 59.000
```

Do not force desktop tables onto small screens.

Use responsive transaction layouts instead.

Income and expense should be visually distinguishable without relying exclusively on color.

---

# Forms

Forms should be simple and compact.

Inputs should have:

- clear labels
- readable text
- subtle borders
- strong focus states
- sufficient touch target size

Avoid:

- oversized inputs
- unnecessary floating labels
- decorative icons inside every field
- excessive helper text

Primary actions should be visually clear.

---

# Buttons

Buttons should have a clear hierarchy.

### Primary

Solid neutral button.

### Secondary

Subtle bordered button.

### Destructive

Use red only when the action is destructive.

Avoid pill-shaped buttons everywhere.

Use rounded rectangles with modest corner radius.

Buttons should feel like application controls, not marketing CTAs.

---

# Icons

Use one consistent icon library.

Preferred style:

```text
Lucide / outline icons
```

Icons should be:

- simple
- thin
- consistent
- functional

Do not use emojis as interface icons.

Do not mix multiple icon styles.

---

# Filters

Filters should remain compact.

Desktop:

```text
[Search] [Category] [Date] [Type] [Filter]
```

Mobile:

Use a compact filter button that opens a bottom sheet or modal.

Do not place a large filter panel permanently on mobile.

---

# Modals / Dialogs

Dialogs should be focused and minimal.

Use:

- dark surface
- subtle border
- modest radius
- clear title
- clear primary action

Avoid excessive backdrop blur.

For mobile, dialogs may become bottom sheets when appropriate.

---

# Empty States

Empty states should be extremely simple.

Example:

```text
No transactions yet

Add your first transaction to start tracking your finances.

[Add transaction]
```

Avoid illustrations unless they provide meaningful value.

---

# Loading States

Use skeleton loading instead of excessive spinners where possible.

Skeletons should match the actual layout.

Avoid animated glowing placeholders.

---

# Feedback

Success:

- subtle green indicator
- concise message

Error:

- muted red
- clear explanation
- actionable recovery

Do not use giant alert boxes for small events.

Toast notifications should be compact.

---

# Motion

Animation should be subtle and functional.

Use animation for:

- page transitions
- modal opening
- dropdowns
- hover states
- loading states
- chart transitions

Recommended duration:

```text
150–250ms
```

Use easing that feels natural.

Avoid:

- excessive bouncing
- parallax
- floating cards
- constant movement
- animated gradients

If removing an animation does not reduce usability, it probably does not need to exist.

---

# Responsive Breakpoints

Use practical responsive breakpoints.

Example:

```text
Mobile:
< 640px

Tablet:
640px – 1024px

Desktop:
> 1024px

Large Desktop:
> 1440px
```

Do not design around exact device dimensions.

The layout should gracefully adapt between breakpoints.

---

# Accessibility

Maintain good accessibility throughout the interface.

Requirements:

- sufficient text contrast
- visible focus states
- keyboard navigation
- semantic HTML
- accessible form labels
- meaningful button labels
- touch targets of approximately 44px or larger
- do not rely on color alone to communicate financial state

Dark mode must remain readable at low brightness.

---

# Anti AI-Slop Rules

This is a critical part of the design.

Do NOT use common generic AI-dashboard patterns such as:

- excessive purple/blue gradients
- glowing neon borders
- giant rounded rectangles
- floating glass cards everywhere
- gradient text
- random abstract blobs
- excessive icons
- emoji-based UI
- excessive shadows
- huge dashboard headings
- unnecessary badges
- fake data visualizations
- excessive pills
- every section inside a separate card
- excessive whitespace with no functional reason
- decorative elements that do not communicate information

Do not make the application look like a generic:

```text
AI SaaS Landing Page
Crypto Dashboard
Startup Template
Dribbble Concept
```

The goal is a **real financial application**, not a visual showcase.

Prioritize:

```text
Hierarchy
Clarity
Consistency
Information density
Usability
Restraint
```

---

# Desktop vs Mobile Philosophy

Desktop should feel:

```text
Structured
Efficient
Information-rich
Calm
```

Mobile should feel:

```text
Focused
Compact
Touch-friendly
Easy to scan
```

Both should feel like the same product.

Do not create completely different visual identities between desktop and mobile.

---

# Design Quality Checklist

Before considering the design complete, verify:

- [ ] Dark theme is consistent
- [ ] Desktop layout feels intentional
- [ ] Mobile layout is genuinely responsive
- [ ] Navigation works naturally on both
- [ ] Financial hierarchy is immediately understandable
- [ ] Charts remain readable
- [ ] Transactions are easy to scan
- [ ] Typography is consistent
- [ ] Spacing follows a coherent scale
- [ ] Icons use one style
- [ ] Colors have semantic meaning
- [ ] Animations are subtle
- [ ] No unnecessary gradients
- [ ] No excessive glassmorphism
- [ ] No decorative AI-generated visual patterns
- [ ] No unnecessary cards
- [ ] No excessive rounded corners
- [ ] Accessibility requirements are respected

## Final Design Goal

The final product should feel like a **well-designed financial tool that someone could actually use every day**.

It should be visually refined without trying too hard to look impressive.

**Minimal, dark, precise, functional, and intentional.**
