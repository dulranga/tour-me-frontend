# TourMe Design System

**Single Source of Truth for UI Decisions**

This document defines all design tokens, layout rules, and component styling guidelines. Every UI decision must conform to these rules.

---

## Table of Contents

1. [Color System](#color-system)
2. [Typography](#typography)
3. [Spacing & Layout](#spacing--layout)
4. [Component Styling](#component-styling)
5. [Interactive States](#interactive-states)
6. [Component Implementations](#component-implementations)
7. [Do's & Don'ts](#dos--donts)

---

## Color System

### Core Palette (Dark Mode Primary)

#### Neutrals

| Token | Hex | Usage |
|-------|-----|-------|
| `neutral-950` | `#0a0a0a` | **Background Base** (darkest) |
| `neutral-900` | `#1a1a1a` | **Background Layer 1** (cards, elevated surfaces) |
| `neutral-800` | `#2a2a2a` | **Background Layer 2** (hover state) |
| `neutral-700` | `#404040` | **Borders, dividers** |
| `neutral-600` | `#525252` | **Secondary text, icons (muted)** |
| `neutral-500` | `#737373` | **Tertiary text** |
| `neutral-400` | `#a3a3a3` | **Secondary text (lighter)** |
| `neutral-300` | `#d4d4d4` | **Primary text (light)** |
| `neutral-200` | `#e5e5e5` | **Primary text (lighter, high contrast)** |
| `neutral-100` | `#f5f5f5` | **Primary text (brightest)** |

#### Accent Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `accent-teal` | `#5eb3e8` | Primary interactive (buttons, links) |
| `accent-blue` | `#4a90c5` | Secondary actions, hover states |
| `accent-orange` | `#f7a850` | Highlights, warnings, badges |
| `accent-purple` | `#b8a8d8` | Decorative, special features |
| `accent-green` | `#51c77c` | Success, positive feedback |
| `accent-red` | `#e75c5c` | Error, destructive actions |
| `accent-yellow` | `#f5c542` | Warnings, caution |

### Semantic Color Variables

```css
/* Text Hierarchy */
--text-primary: #e5e5e5;        /* Headlines, body text */
--text-secondary: #a3a3a3;      /* Secondary info, subtitles */
--text-muted: #737373;          /* Disabled, placeholder text */
--text-disabled: #525252;       /* Explicitly disabled state */

/* Backgrounds */
--bg-base: #0a0a0a;             /* Page background */
--bg-elevated: #1a1a1a;         /* Card, dialog, elevated surfaces */
--bg-hover: #2a2a2a;            /* Hover state for interactive elements */
--bg-overlay: rgba(10, 10, 10, 0.8); /* Modal overlay (80% opacity) */

/* Borders & Dividers */
--border-default: #404040;      /* Standard border */
--border-subtle: rgba(64, 64, 64, 0.3); /* Minimal divider (30% opacity) */

/* Interactive */
--interactive-default: #5eb3e8; /* Primary button, links */
--interactive-hover: #4a90c5;   /* Hover state for interactive */
--interactive-disabled: #525252; /* Disabled button */

/* Status */
--status-success: #51c77c;
--status-error: #e75c5c;
--status-warning: #f5c542;
```

---

## Typography

### Font Stack

- **Sans**: System fonts (system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue)
- **Mono**: Monaco, Courier New

### Type Scale

| Size | Value | Class | Usage |
|------|-------|-------|-------|
| **XS** | `12px` | `text-xs` | Badge labels, captions |
| **SM** | `14px` | `text-sm` | Secondary text, helper text |
| **Base** | `16px` | `text-base` | Body text, default |
| **LG** | `18px` | `text-lg` | Subheadings, card titles |
| **XL** | `20px` | `text-xl` | Section headers |
| **2XL** | `24px` | `text-2xl` | Page titles |
| **3XL** | `32px` | `text-3xl` | Hero titles |

### Weight Usage

| Weight | Value | Usage |
|--------|-------|-------|
| **Regular** | `400` | Body text |
| **Medium** | `500` | Secondary labels |
| **Semibold** | `600` | Subheadings, card titles |
| **Bold** | `700` | Page titles, emphasized headings |

---

## Spacing & Layout

### Spacing Scale

| Token | Value | Class | Usage |
|-------|-------|-------|-------|
| **XS** | `4px` | `p-1` | Tight component padding |
| **S** | `8px` | `p-2` | Tight spacing |
| **M** | `12px` | `p-3` | Standard padding |
| **L** | `16px` | `p-4` | Card padding |
| **XL** | `24px` | `p-6` | Section padding |
| **2XL** | `32px` | `p-8` | Large gaps |
| **3XL** | `48px` | `p-12` | Hero spacing |

### Component Padding Rules

| Component | Internal Padding | External Margin |
|-----------|---|---|
| **Button** | `8px (h) × 16px (w)` | `8px` gap |
| **Input** | `12px` | `16px` below label |
| **Card** | `16px-20px` | `16px-24px` gap |
| **Dialog** | `24px` | Center, `0` to edges |

### Grid Behavior

```tsx
/* Responsive: 1 col mobile → 2 col tablet → 3 col desktop */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

---

## Component Styling

### Border Radius Scale

| Type | Value | Class | Usage |
|------|-------|-------|-------|
| **Small** | `4px` | `rounded-sm` | Buttons, small elements |
| **Medium** | `8px` | `rounded-md` | Inputs, pills |
| **Large** | `12px` | `rounded-lg` | Cards, dialogs |
| **Full** | `9999px` | `rounded-full` | Avatars, badges |

### Button Variants

All button components export these variants:

```tsx
<Button variant="default">Primary Action</Button>        // Teal, high prominence
<Button variant="secondary">Secondary Action</Button>    // Dark gray, secondary
<Button variant="outline">Outline</Button>               // Border only
<Button variant="ghost">Ghost</Button>                   // Minimal, text only
<Button variant="destructive">Delete</Button>           // Red for dangerous actions
<Button variant="link">Link Button</Button>             // Text link styled as button
```

### Button Sizes

```tsx
<Button size="sm">Small</Button>                         // h-8, px-3
<Button size="default">Default</Button>                 // h-10, px-4 (default)
<Button size="lg">Large</Button>                         // h-12, px-6
<Button size="icon">Icon</Button>                        // h-10, w-10 squared
```

### Input Component

```tsx
import { Input } from '#/components/ui/input'

<Input type="text" placeholder="Enter text..." />
```

**Styling**:
- Border: `border-border-default`
- Background: `bg-bg-elevated`
- Text: `text-text-primary`
- Placeholder: `text-text-muted`
- Focus ring: Teal accent

### Card Component

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '#/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>Content here</CardContent>
  <CardFooter>Footer actions</CardFooter>
</Card>
```

**Styling**:
- Border: `border-border-subtle`
- Background: `bg-bg-elevated`
- Hover: `bg-bg-hover` transition
- Padding: `p-6` standard

### Dialog Component

```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '#/components/ui/dialog'

<Dialog>
  <DialogTrigger>Open Dialog</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

**Styling**:
- Overlay: `bg-bg-overlay` with `backdrop-blur-sm`
- Box: `bg-bg-elevated`, `border-border-default`
- Border-radius: `rounded-lg`
- Max-width: `max-w-lg`

---

## Interactive States

### Hover
- Buttons: Shift to next accent shade (teal → blue)
- Cards: `bg-bg-hover`
- Duration: `transition-colors duration-200`

### Focus
- Ring: `2px solid accent-teal` with `offset-2`
- Used on inputs, buttons, dialogs

### Active
- Darker shade + optional ring
- For buttons and menu items

### Disabled
- Opacity: `opacity-50`
- Cursor: `cursor-not-allowed`
- No hover effects applied

---

## Component Implementations

All components are stored in `src/components/ui/`:

- **Button** (`button.tsx`) - Polymorphic button with variants
- **Input** (`input.tsx`) - Text input field
- **Card** (`card.tsx`) - Card container with subcomponents
- **Dialog** (`dialog.tsx`) - Modal dialog using Radix UI

### Importing Components

```tsx
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '#/components/ui/card'
import { Dialog, DialogTrigger, DialogContent } from '#/components/ui/dialog'
```

---

## Do's & Don'ts

### ✅ Do

- Use semantic color variables (`--text-primary`, `--bg-elevated`)
- Maintain spacing scale (multiples of 4px)
- Apply consistent border radius (8-12px)
- Use subtle borders for separation
- Test dark mode (primary) and light mode
- Verify WCAG AA contrast ratios
- Use Tailwind classes consistently
- Document custom styles with comments

### ❌ Don't

- Use direct hex colors in components (use variables/Tailwind)
- Create arbitrary spacing (always use scale)
- Add heavy shadows (use borders instead)
- Break the color palette without review
- Mix spacing scales in one component
- Ignore accessibility contrast
- Use `!important` to override
- Create one-off component styles

### Common Violations & Fixes

| Wrong | Right |
|-------|--------|
| `bg-[#1a1a1a]` | `bg-bg-elevated` or `bg-neutral-900` |
| `p-[14px]` | `p-3` (12px) |
| `shadow-2xl` | `border border-subtle` |
| `rounded-3xl` | `rounded-lg` (12px) |
| `text-[#e5e5e5]` | `text-text-primary` |

---

## Configuration Files

### Tailwind Config
- **File**: `tailwind.config.ts`
- **Purpose**: Defines color palette, spacing scale, border radius
- **Note**: Custom theme values are extended, not replaced

### CSS Variables
- **File**: `src/styles.css`
- **Purpose**: Root variables for dark/light mode switching
- **Usage**: Used in HTML and linked to Tailwind theme

---

**Version**: 1.0  
**Updated**: April 2026  
**Theme**: Dark Mode Primary  
**Tech Stack**: React 19, Tailwind CSS 4, TypeScript, ShadCN Components
