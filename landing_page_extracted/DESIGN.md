---
name: Kinetic Journey
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#4d4354'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#7e7386'
  outline-variant: '#cfc2d7'
  surface-tint: '#861fdd'
  primary: '#7800ce'
  on-primary: '#ffffff'
  primary-container: '#9333ea'
  on-primary-container: '#f6e6ff'
  inverse-primary: '#ddb8ff'
  secondary: '#006b5f'
  on-secondary: '#ffffff'
  secondary-container: '#62fae3'
  on-secondary-container: '#007165'
  tertiary: '#754900'
  on-tertiary: '#ffffff'
  tertiary-container: '#965e00'
  on-tertiary-container: '#ffe8d1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#f0dbff'
  primary-fixed-dim: '#ddb8ff'
  on-primary-fixed: '#2c0051'
  on-primary-fixed-variant: '#6800b4'
  secondary-fixed: '#62fae3'
  secondary-fixed-dim: '#3cddc7'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005047'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  gutter: 16px
  margin-mobile: 20px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
  section-gap: 40px
---

## Brand & Style

The design system is anchored in the concept of "forward momentum." It balances the reliability of a financial institution with the aspiration of automotive lifestyle. The aesthetic is **Corporate Modern** with a **Tactile** edge—using subtle depth and purposeful motion to guide users through their savings milestones.

The visual language communicates three core pillars:
1.  **Trust:** Clear typography, structured layouts, and a stable neutral palette.
2.  **Aspiration:** Vibrant purple accents and high-quality lifestyle imagery.
3.  **Progress:** Linear elements, step indicators, and "pathway" metaphors that visualize the car-buying journey.

The system focuses on a mobile-first experience, ensuring high touch-target visibility and frictionless navigation for daily savings check-ins.

## Colors

The color palette centers on a high-energy "Electric Purple" to drive brand recognition. 

-   **Primary (Electric Purple):** Used for primary actions, progress bars, and key branding moments.
-   **Secondary (Teal):** Represents growth and financial health; used for "Success" states and secondary milestones.
-   **Tertiary (Amber):** Used sparingly for urgent notifications or "Milestone Reached" celebrations.
-   **Neutral (Slate):** Provides deep contrast for typography and structural elements, ensuring accessibility and a premium feel.

The background uses a soft **#F8FAFC** (Slate 50) to reduce eye strain while maintaining a clean, open feel.

## Typography

This design system utilizes a dual-font approach to balance personality with readability.

-   **Plus Jakarta Sans** is used for headings. Its modern, slightly rounded geometric forms evoke optimism and friendliness.
-   **Manrope** is used for body text and interface labels. Its high legibility and balanced proportions ensure financial data and terms are easy to digest on mobile screens.

**Scale and Hierarchy:**
Headlines should utilize tight leading and negative letter-spacing to appear bold and impactful. Body text maintains a generous line height (1.6) to ensure the interface feels airy and uncrowded.

## Layout & Spacing

The layout follows a **fluid grid** optimized for mobile viewports. 

-   **Rhythm:** A 4px baseline grid governs all spacing.
-   **Safe Areas:** A 20px horizontal margin is maintained on all mobile screens to prevent content from hitting the edge of the device.
-   **Grouping:** Elements are grouped using the "Law of Proximity"—8px for related items (label + input), 16px for internal card padding, and 24px between distinct functional blocks.
-   **Vertical Flow:** As a progress-oriented app, vertical rhythm is emphasized through the use of "Connected Nodes" (vertical lines connecting cards) to visually represent a chronological journey.

## Elevation & Depth

To emphasize the "journey" and keep the UI feeling light, we use **Tonal Layers** supplemented by **Ambient Shadows**.

1.  **Level 0 (Surface):** The background (#F8FAFC).
2.  **Level 1 (Cards):** Pure white background with a very soft, diffused shadow (0px 4px 20px rgba(15, 23, 42, 0.05)).
3.  **Level 2 (Active Elements):** Primary buttons and active progress nodes use a subtle purple glow/shadow (0px 8px 16px rgba(147, 51, 234, 0.2)) to appear "pressed up" and interactive.
4.  **Glassmorphism:** Use a light backdrop blur (8px) for sticky bottom navigation bars or modal overlays to maintain context of the journey behind the current action.

## Shapes

The shape language is **Rounded**, reflecting the approachability of the brand and the organic curves of modern car design.

-   **Standard Elements:** 0.5rem (8px) for buttons and input fields.
-   **Large Containers:** 1rem (16px) for cards and feature sections to give them a friendly, modern container look.
-   **Circular Elements:** Progress rings, status indicators, and profile avatars should use a full pill/circle radius.

## Components

### Buttons
-   **Primary:** Solid Electric Purple with white text. High-contrast, 56px height for mobile accessibility.
-   **Secondary:** White background with an Electric Purple border (2px).
-   **Ghost:** Transparent background with purple text for low-priority actions like "Cancel" or "Skip."

### Savings Journey Card
-   A specialized component featuring a left-hand vertical progress line.
-   Includes a "Percentage Complete" badge in the top right.
-   Uses Manrope Bold for the dollar amounts to ensure financial clarity.

### Input Fields
-   Outlined style with a 1px Slate-200 border.
-   On focus: Border changes to Electric Purple with a 2px thickness.
-   Floating labels are used to save vertical space on mobile.

### Progress Trackers
-   Thick, horizontal or vertical tracks (8px height/width).
-   Unfilled track: Slate-100.
-   Filled track: Linear gradient from Primary Purple to a lighter lavender shade to indicate movement.

### Chips/Milestones
-   Small, rounded pills used for status (e.g., "On Track", "Milestone Reached").
-   Use Secondary Teal for positive states and Slate-500 for pending states.