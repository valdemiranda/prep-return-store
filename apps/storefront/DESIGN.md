# One Stop Liquidation Design System Index

This document records the visual tokens and design rules for the One Stop Liquidation storefront. All styles are derived from the reference design examples under `backend/design_examples`.

## 1. Brand Guidelines & Concept

The **One Stop Liquidation** brand represents maximum value, urgency, and professional retail liquidations.
- **Surfaces**: Flat, off-white, light gray backgrounds that feel industrial yet clean.
- **Accents**: Intense red signals liquidation/discount; professional corporate blue coordinates utility actions and links.
- **Edges**: Low-radius corners (2px-4px) for cards and inputs to match an industrial, warehouse, or wholesale theme.
- **Spacing**: Compact, high density, optimized grid alignments.

---

## 2. Design Tokens

### Colors

| Token Name | Hex Value | Usage / Notes |
| :--- | :--- | :--- |
| `primary` | `#9e0000` | Liquidation Red, main buttons, branding logos, price highlights |
| `primary-container` | `#cc0000` | Hero backdrops, strong promotional callouts |
| `secondary` | `#3a5f94` | Utility blue, secondary CTAs, system notifications, filters |
| `background` / `surface` | `#fcf9f8` | Off-white page base background |
| `surface-container-low` | `#f6f3f2` | Low contrast panels, sidebar filters |
| `surface-container` | `#f0eded` | Inputs, interactive hover bases |
| `surface-container-high` | `#eae7e7` | Cards |
| `surface-container-highest` | `#e5e2e1` | Borders, subtle dividers |
| `on-surface` | `#1c1b1b` | Main text body color |
| `on-surface-variant` | `#5e3f3a` | Muted descriptions, secondary text |
| `outline` | `#926e69` | High contrast borders |
| `outline-variant` | `#e8bdb6` | Low contrast card borders, input borders |

### Typography

| Family Class | Font Face | Weights | Target Elements |
| :--- | :--- | :--- | :--- |
| `font-sans` | `Inter` | 400, 700 | Body paragraphs, buttons, form labels, small details |
| `font-headline` | `Chivo` | 700, 800, 900 | Hero titles, category banners, product names, titles |
| `font-price` | `Chivo` | 800, 900 | Pricing numbers, highlight badges |

### Borders (Low-Radius)

- **Default / Cards**: `rounded-[2px]` (Tailwind `rounded-sm` or custom variable mapped to `0.125rem`)
- **Large Inputs / Small Cards**: `rounded-[4px]` (Tailwind `rounded` or custom variable mapped to `0.25rem`)
- **Interactive Pill Buttons**: `rounded-full` (for icon buttons and search fields only)

### Spacing (Compact)

- **Mobile Margins**: `px-4` (`16px`)
- **Gutter / Grid Spacing**: `gap-6` (`24px`)
- **Vertical Section Stack**: `py-8` (`32px`)

---

## 3. Reusable Component Guidelines

### Buttons
- **Primary**: Flat rectangular with `bg-primary text-white font-bold uppercase rounded-[4px] hover:bg-primary-container hover:scale-[1.02] active:scale-[0.98] transition-all`.
- **Secondary**: `bg-secondary text-white font-bold rounded-[4px] hover:opacity-90 active:scale-95 transition-all`.
- **Outline**: `border border-outline text-on-surface rounded-[4px] hover:bg-surface-container`.

### Product Cards
- Rectangular white container with `border border-outline-variant rounded-[2px] overflow-hidden hover:shadow-lg transition-all`.
- High density content layout with uppercase brand text, truncated title, and distinct red price.

### Form Inputs
- Flat gray container backgrounds with outline borders: `bg-surface-container-low border border-outline-variant text-body-sm px-4 py-2 rounded-[4px] focus:ring-2 focus:ring-primary focus:border-primary`.
