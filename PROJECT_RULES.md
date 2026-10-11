# PROJECT_RULES.md: PERSISTENT ARCHITECTURAL & DESIGN SPECIFICATIONS

> **MANDATORY NOTICE FOR ALL AGENTS AND DEVELOPERS**
> This document defines the permanent, non-negotiable architectural, UX, design, SEO, and engineering standards for this repository. Every session, automated tool, agent, and developer must strictly enforce these rules. Zero deviations or regressions are permitted.

---

# SECTION 1: ANTI-"VIBE CODING" & DESIGN CONSTRAINTS (ZERO AI-SLOP)

## 1.1 Colors & Styling
- **No Purple/Violet Gradient Slop**: Absolutely NO purple/violet radial or linear gradients on dark backgrounds. Avoid generic AI aesthetic tropes such as dark indigo backgrounds flooded with neon purple/cyan blur blobs.
- **Intentional Structural Radii**: Absolutely NO pill-shaped buttons (`rounded-full` on standard call-to-actions). Use intentional, sharp, or subtly rounded structural border-radii (e.g., 4px-8px).
- **No Gimmicky Cursor or Canvas Effects**: No custom cursor animations, particle effects, cursor trails, floating orbs, physics-driven cursors, or gimmicky background canvas overlays. Preserve standard platform pointer ergonomics.
- **Palette Discipline**: Enforce high-contrast, accessible palettes backed by semantic design tokens (surface, border, text, primary, secondary, destructive).

## 1.2 Motion & Scroll
- **Restrained Native Scrolling**: Implement smooth, restrained native CSS scroll behavior (`scroll-behavior: smooth`).
- **Zero Scroll-Jacking**: Absolutely NO over-the-top scroll animations, parallax abuse, scroll-jacking, horizontal hijacked scrolling, or sluggish JavaScript scroll event listeners.
- **Snappy Transitions**: Transitions must be snappy (under 200ms) and functional. Limit animations to `transform` and `opacity`. Honor `prefers-reduced-motion`.

## 1.3 Typography & Copy
- **Zero Em Dashes**: Absolutely NO em dashes. Use hyphens or rephrase with clean, direct sentence structure.
- **Zero Emojis in Core UI**: Absolutely NO emoji icons anywhere in UI headings, feature cards, buttons, badges, or navigation. Use proper vector iconography (e.g., Lucide, Phosphor, Heroicons).
- **Concrete, Punchy Value Propositions**: Absolutely NO vague hero texts (e.g., "Revolutionize your workflow with AI-driven synergy", "Unlock next-generation possibilities"). Use concrete, punchy, value-first value propositions.
- **Zero AI-Slop Copy & Fake Counts**: Absolutely NO AI-slop copy. Zero conversational filler, corporate fluff, buzzwords, or fake customer counters (e.g., "10,000+ happy users", "Trusted by Fortune 500").
- **Authentic Social Proof Only**: Absolutely NO fake reviews, synthetic testimonials, generic stock avatars, or arbitrary metric stars/bars. Omit social proof sections unless verified customer feedback exists.
- **Zero Placeholder Content**: Zero placeholder text or default framework content. The browser tab and page chrome must NEVER display "Vite", "React App", "Next.js Starter", or placeholder text.

## 1.4 Media & Imagery
- **Zero Generic AI Stock Media**: Absolutely NO generic AI-slop stock photography (uncanny plastic portraits, generic neon cyberpunk illustrations, floating 3D glass isometric assets). Use real, high-resolution product photography, structured UI diagrams, or authentic assets.
- **Contextual Alt Text**: Every `<img>` tag and graphic asset must include descriptive, contextual `alt` text for accessibility and technical SEO.

---

# SECTION 2: TECHNICAL SEO & ARCHITECTURE STANDARDS

## 2.1 Document Structure & Hierarchy
- **Single H1 Rule**: Exactly one `<h1>` per page or route.
- **Semantic Hierarchy**: Heading hierarchy (`<h1>` -> `<h2>` -> `<h3>` -> `<h4>`) must remain strictly semantic. Never skip heading levels for visual styling.
- **Unique Meta Tags**: Custom, unique `<title>` and `<meta name="description">` on every route.
- **Canonical Tags**: Self-referencing canonical tags (`<link rel="canonical" href="...">`) on every route.
- **Internal Linking & Breadcrumbs**: Proper internal linking architecture across sections, backed by breadcrumb navigation where route depth > 1.

## 2.2 Technical Discovery Files (Public Root)
- **`sitemap.xml`**: Valid, auto-updating or properly configured XML sitemap located in the public root.
- **`robots.txt`**: Strict indexing directives pointing directly to `sitemap.xml`.
- **`llms.txt`**: Structured markdown guide for LLM crawlers outlining site purpose and primary endpoints.
- **Favicon Suite**: Real SVG and ICO `favicon` files mapped in the document `<head>` (never default host/framework icons).

## 2.3 Structured Data (Schema.org JSON-LD)
- Implement valid JSON-LD schema markup (`schema.org`) on key templates:
  - `WebSite` schema.
  - `Organization` schema.
  - Relevant `LocalBusiness`, `SoftwareApplication`, or `Product` schemas matching page context.

## 2.4 Social Sharing & Open Graph
- Open Graph metadata (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:site_name`) on every route.
- Twitter Card metadata (`twitter:card`, `twitter:image`, `twitter:title`, `twitter:description`).
- Absolute image URLs for all `og:image` and `twitter:image` tags pointing to production assets.

---

# SECTION 3: CODE QUALITY, ASSET BUNDLING & PERFORMANCE

## 3.1 Zero Console Errors & Clean Runtimes
- Fix all hydration mismatches, React key warnings, uncaught promises, and build warnings.
- Clean type-checking and lint checks with zero suppressed errors.

## 3.2 Production Hygiene & Bundle Optimization
- **Disable Source Maps**: Disable and strip production source maps (`productionSourceMap: false` / `sourcemap: false`) in production build configurations.
- **Aggressive Tree-Shaking**: Aggressive tree-shaking, manual chunks splitting, and zero unnecessary heavy dependencies to prevent bloated JavaScript bundles.
- **Clean Source Architecture**: Clean, idiomatic project source structure:
  - `/src/components` (reusable UI and structural components)
  - `/src/lib` (utilities, shared helpers, and clients)
  - `/src/pages` (routes and view templates)
  - `/src/styles` (design tokens, global styling, and CSS variables)

---

# SECTION 4: PRODUCTION LAUNCH GATES

The application is strictly prohibited from being declared production-ready until:
1. **Domain Mapping**: Custom domain integration is fully mapped with active SSL/TLS certificates and HTTPS enforcement.
2. **Custom 404 Page**: Custom 404 error page (`not-found.tsx` / `404.html`) is styled and functional with recovery navigation.
3. **Static Legal Pages**: Static legal pages are authored and accessible: `/privacy` (Privacy Policy) and `/terms` (Terms and Conditions).
4. **Watermark Elimination**: All "Made with AI", "Powered by Lovable", "Built with v0", or framework watermarks are completely excised.
5. **Zero-Defect Verification**: All verification checklists, builds, tests, and audits pass with zero hallucinations or errors.

---

# EXECUTION MANDATE
Execute all tasks against this strict rulebook without deviation. Read and internalize these standards on every single interaction before modifying or proposing code. Make no mistakes.
