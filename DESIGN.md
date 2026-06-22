---
name: Obsidian & Gold Futurist
colors:
  surface: '#141313'
  surface-dim: '#141313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2b2a2a'
  surface-container-highest: '#353434'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c4c7c7'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c9c6c5'
  primary: '#c9c6c5'
  on-primary: '#313030'
  primary-container: '#0a0a0a'
  on-primary-container: '#7b7979'
  inverse-primary: '#5f5e5e'
  secondary: '#e9c349'
  on-secondary: '#3c2f00'
  secondary-container: '#af8d11'
  on-secondary-container: '#342800'
  tertiary: '#c6c6c7'
  on-tertiary: '#2f3131'
  tertiary-container: '#080a0a'
  on-tertiary-container: '#78797a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c9c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#141313'
  on-background: '#e5e2e1'
  surface-variant: '#353434'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 72px
    fontWeight: '700'
    lineHeight: 80px
    letterSpacing: -0.04em
  headline-xl:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 80px
  margin-mobile: 20px
  stack-sm: 16px
  stack-md: 32px
  stack-lg: 64px
---

## Brand & Style
The design system embodies an ultra-premium, futuristic grooming experience. It blends the precision of high-end technology with the tactile luxury of a master barber's craft. The aesthetic is rooted in **Minimalism** and **Glassmorphism**, creating an interface that feels like a digital concierge.

The target audience consists of discerning clients who value efficiency, technical mastery, and a sophisticated atmosphere. The UI should evoke a sense of calm, exclusivity, and forward-thinking professionalism. High-quality imagery of grooming tools and sharp silhouettes should be framed by expansive whitespace (or "blackspace") to maintain a high-fashion editorial feel.

## Colors
The palette is dominated by **Deep Obsidian (#0A0A0A)**, providing a limitless, high-contrast backdrop that allows photography and gold elements to recede and advance. **Liquid Gold (#D4AF37)** is used sparingly for primary actions, status indicators, and brand accents, reflecting the premium nature of the services.

**Pure White (#FFFFFF)** is reserved for high-priority typography and iconography to ensure legibility against the dark void. A specialized **Neon Glow** accent (a vibrant, diffused version of the gold) is used for "liquid glass" effects and subtle background blurs to suggest a futuristic, high-energy environment.

## Typography
This design system utilizes a dual-sans-serif approach to achieve a technical yet premium feel. **Geist** provides a monospaced-adjacent precision for headlines and labels, evoking a "built-to-spec" engineering vibe. **Inter** handles body copy with neutral, high-legibility grace.

Headlines should use tight letter-spacing and high contrast. Display styles are intended for large-scale marketing sections or service titles. Labels must always use uppercase with tracking (letter-spacing) increased to 5-10% to enhance the "luxury brand" feel.

## Layout & Spacing
The layout follows a **Fluid Grid** model with generous margins to mimic high-end editorial layouts. On desktop, a 12-column grid is used with significant horizontal padding (80px) to center the focus. 

The "stack" spacing tokens (64px, 128px) are critical for maintaining the "Minimalist" breathing room between sections. Use asymmetrical layouts where imagery occupies 7 columns and text 4 columns to create visual interest and a custom-built feel.

## Elevation & Depth
Depth is achieved through **Glassmorphism** and **Tonal Layering**. Instead of traditional drop shadows, use:
1.  **Backdrop Blurs:** 20px to 40px blur on semi-transparent surfaces (10% White or 5% Gold).
2.  **Inner Glows:** 1px subtle gold or white inner borders to define edges against the black background.
3.  **Floating Elements:** Use "Liquid Glass" spheres or floating grooming icons with heavy 80px background blurs to create a sense of three-dimensional space.
4.  **Soft Shadows:** When necessary, use extremely large, low-opacity (15%) black shadows to slightly lift gold buttons from the surface.

## Shapes
The shape language is primarily **Rounded (0.5rem base)**, moving toward **Pill-shaped** for interactive elements like buttons and chips. 

Cards and glass containers should use a `rounded-xl` (1.5rem) radius to feel modern and approachable. Containers that hold high-definition imagery should maintain a consistent 24px corner radius to harmonize with the soft-focus liquid glass background elements.

## Components
- **Buttons:** Primary buttons are Solid Liquid Gold with Black text, using a full pill-shape. Secondary buttons are "Ghost" style with a 1px Gold border and glass background.
- **Glass Cards:** Containers for services or testimonials should have a `0.5px` stroke of White (10% opacity) and a background blur of `32px`.
- **Inputs:** Minimalist bottom-border only or very light glass-filled fields with gold focus states.
- **Service Chips:** Small, uppercase labels with a subtle gold glow when active.
- **Floating Action Menus:** Use a fixed bottom-center position with a glass-morphic background for booking and contact shortcuts.
- **Lists:** Service menus use thin (0.5px) dividers with high-contrast prices in Geist Mono-style weights.