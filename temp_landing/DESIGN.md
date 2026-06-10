---
name: Royal Velocity Narrative
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#4b4452'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#7c7483'
  outline-variant: '#cdc3d4'
  surface-tint: '#7543b7'
  primary: '#340069'
  on-primary: '#ffffff'
  primary-container: '#4e158f'
  on-primary-container: '#bc8cff'
  inverse-primary: '#d8b9ff'
  secondary: '#7c5800'
  on-secondary: '#ffffff'
  secondary-container: '#ffc24a'
  on-secondary-container: '#725000'
  tertiary: '#242424'
  on-tertiary: '#ffffff'
  tertiary-container: '#3a3939'
  on-tertiary-container: '#a4a3a2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#eddcff'
  primary-fixed-dim: '#d8b9ff'
  on-primary-fixed: '#290055'
  on-primary-fixed-variant: '#5c289d'
  secondary-fixed: '#ffdea8'
  secondary-fixed-dim: '#f9bc45'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5e4200'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding-desktop: 32px
  container-padding-mobile: 20px
  gutter: 24px
  section-gap: 80px
---

## Brand & Style

This design system is engineered to bridge the gap between high-end automotive retail and sophisticated financial services. The brand personality is **Visionary, Secure, and Prestigious**, evoking the feeling of a private concierge for vehicle acquisition. 

The aesthetic leverages a **Modern Corporate** style with subtle **Glassmorphism** cues to represent transparency in fintech. It prioritizes clean white space to emphasize high-fidelity automotive photography, while using deep regal tones to establish an institutional sense of trust. The visual language is distinctly African-contemporary—combining global fintech standards with a warmth and vibrance that feels local yet world-class.

## Colors

The palette is anchored by **Deep Purple**, symbolizing luxury, wisdom, and the stability of a financial institution. This is complemented by **Gold** accents, used sparingly to draw attention to high-value actions, success states, and premium tier indicators.

- **Primary (Deep Purple):** Used for main navigation, primary buttons, and critical branding elements.
- **Secondary (Gold):** Reserved for "Golden Moments" such as CTA accents, verification badges, and interest rates.
- **Surface Tones:** A "Clean White" (#FFFFFF) base is used for content cards, contrasted against a "Soft Neutral" (#F8F9FA) background to create depth without clutter.
- **Functional Grays:** A scale of cool slates is used for secondary text and borders to maintain a crisp, professional appearance.

## Typography

The typography strategy employs a dual-font system to balance authority with accessibility. 

**Inter** is utilized for all headlines and display text. Its geometric precision and high X-height convey a technical, fintech-first impression. For display sizes, a tight letter-spacing is applied to create a "bold automotive" feel.

**Manrope** is used for body copy and UI labels. It offers a softer, more humanist touch that improves legibility during long-form reading, such as viewing loan terms or vehicle specifications. 

**Responsive Scaling:** On mobile devices, display headings scale down by approximately 30% to ensure visual impact without compromising the layout's structural integrity.

## Layout & Spacing

The layout follows a **Fixed-Grid** philosophy for desktop (1280px max-width) and a **Fluid-Grid** for mobile devices. A 12-column system is used across all platforms to maintain alignment of complex financial data and car specifications.

- **Spacing Rhythm:** Based on an 8px linear scale. 
- **Margins:** Desktop views utilize generous 32px outer margins to evoke a "boutique" premium feel. 
- **Gutters:** 24px gutters provide ample breathing room between vehicle cards and data tables.
- **Sectioning:** Large vertical gaps (80px+) are used between major content blocks to prevent the UI from feeling "crowded," maintaining the minimalist luxury aesthetic.

## Elevation & Depth

Depth in this design system is achieved through **Ambient Shadows** rather than harsh outlines. This creates a tactile, layered environment that feels high-end.

- **Level 1 (Surface):** Default background (#F8F9FA).
- **Level 2 (Cards):** Pure white (#FFFFFF) with a soft, multi-layered shadow (0px 4px 20px rgba(78, 21, 143, 0.05)). The purple tint in the shadow prevents it from looking "muddy."
- **Level 3 (Interactive):** Elements like "Active Cards" or "Hovered Buttons" increase their shadow spread and slightly lift (Y-axis offset) to provide immediate haptic-style feedback.
- **Glassmorphism:** Navigation bars use a high-blur backdrop (20px) with 80% opacity to maintain context of the scroll position while ensuring text legibility.

## Shapes

The shape language is defined by large, inviting radii. The use of **2XL rounding (1.5rem / 24px)** for primary cards creates a "friendly-fintech" atmosphere, softening the inherent seriousness of finance.

- **Small Components:** Buttons and input fields use a consistent 0.5rem (8px) radius to remain professional.
- **Large Components:** Vehicle image containers and pricing cards use the 1.5rem (24px) radius.
- **Icons:** Use a rounded-cap style (2px stroke) to align with the soft-cornered UI.

## Components

### Buttons
- **Primary:** Deep Purple background, white text. Bold weight. Slight elevation on hover.
- **Secondary:** Transparent with a 2px Purple border or Gold text for specific calls to action.
- **Tertiary:** Text-only with an arrow icon, used for "View Details" on car listings.

### Cards (Premium Automotive)
- Cards must feature a 24px corner radius. 
- High-quality car imagery should always be top-aligned with no padding against the card edge, while the content area below maintains a 24px internal padding.

### Input Fields
- Use a "Floating Label" style to maximize vertical space. 
- The border-bottom thickens and changes to Deep Purple when focused.

### Chips
- Used for vehicle features (e.g., "Automatic", "Electric"). 
- Low-contrast purple backgrounds with dark purple text to keep the UI clean.

### Trust Indicators
- Financial badges and "Verified Dealer" stamps should always utilize the Gold accent color to signify high-tier status and security.