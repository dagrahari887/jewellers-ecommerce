---
name: Baikunthh Jewellers
description: The Velvet Showcase. Ivory and charcoal display surfaces where gold is the light on the piece.
colors:
  baikunthh-gold: "#C5A059"
  baikunthh-gold-deep: "#8C703B"
  baikunthh-gold-deeper: "#735C30"
  burnished-hover: "#B38F4D"
  gold-leaf-wash: "#F5EDD8"
  champagne: "#F7E7CE"
  velvet-tray: "#1A1A1A"
  pearl-ivory: "#FAF9F6"
  display-cream: "#FDF8F2"
  case-white: "#FFFFFF"
  sandstone: "#8C7B6B"
  quiet-ink: "#6B7280"
  hairline: "#E5E7EB"
typography:
  display:
    fontFamily: "Cormorant Garamond, Playfair Display, Georgia, serif"
    fontSize: "clamp(3rem, 6vw, 4.5rem)"
    fontWeight: 300
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Cormorant Garamond, Playfair Display, Georgia, serif"
    fontSize: "3rem"
    fontWeight: 400
    lineHeight: 1.25
  title:
    fontFamily: "Cormorant Garamond, Playfair Display, Georgia, serif"
    fontSize: "2.25rem"
    fontWeight: 400
    lineHeight: 1.25
  wordmark:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 700
    letterSpacing: "0.1em"
  body:
    fontFamily: "Jost Variable, Jost, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Jost Variable, Jost, system-ui, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 500
    letterSpacing: "0.2em"
rounded:
  none: "0px"
  pill: "9999px"
spacing:
  gutter-mobile: "16px"
  gutter-desktop: "24px"
  container: "1280px"
  header: "97px"
  section: "96px"
components:
  button-primary:
    backgroundColor: "{colors.baikunthh-gold-deep}"
    textColor: "{colors.case-white}"
    rounded: "{rounded.none}"
    padding: "14px 32px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.baikunthh-gold-deeper}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.velvet-tray}"
    rounded: "{rounded.none}"
    padding: "14px 32px"
  button-outline-hover:
    backgroundColor: "{colors.velvet-tray}"
    textColor: "{colors.case-white}"
  input:
    backgroundColor: "{colors.case-white}"
    textColor: "{colors.velvet-tray}"
    rounded: "{rounded.none}"
    padding: "12px 16px"
  chip-filter-selected:
    backgroundColor: "{colors.baikunthh-gold-deep}"
    textColor: "{colors.case-white}"
    rounded: "{rounded.none}"
    padding: "6px 12px"
  badge-gold:
    backgroundColor: "{colors.gold-leaf-wash}"
    textColor: "{colors.baikunthh-gold-deep}"
    rounded: "{rounded.none}"
    padding: "4px 10px"
  card-surface:
    backgroundColor: "{colors.case-white}"
    rounded: "{rounded.none}"
    padding: "24px"
---

# Design System: Baikunthh Jewellers

## Overview

**Creative North Star: "The Velvet Showcase"**

The site is a jeweller's display case. Pearl Ivory and Velvet Tray charcoal are the cloth the pieces rest on. Baikunthh Gold is the glint where light catches metal, so it marks focus and value rather than covering surfaces. Photography is the jewel: images sit on Display Cream, in square or 3:4 frames, with nothing laid over them except at the moment of interaction.

Density is gallery-calm. Pages breathe in generous vertical bands (128px between sections on desktop, 80px on phones), while groups inside them stay tight. Interfaces are hushed: square corners, hairline borders and small spaced capitals carry the brand, so loud colour, heavy shadow or decoration is never needed to say "luxury". The page is one light theme. Content alternates only between Pearl Ivory and Case White; Velvet Tray appears as chrome (the announcement bar and the footer), never as a band in the middle of a page.

Composition is asymmetric and editorial: a split hero with the image opening like a jewellery box, a five-cell category bento, an offset collection pair with captions beneath the photographs, and real data (today's rates, a real price breakdown) used as content rather than decoration.

The buying path is primary wherever it appears. Price is set in the display serif and given real size. The primary action is the one deep-gold surface on screen. Trust facts (hallmarking, buyback, insured bridal shipping) sit close to the commitment, not in decoration.

**Key Characteristics:**
- One light theme: ivory and white content, charcoal only as header and footer chrome. No dark mode.
- High-contrast serif for names, titles and prices; Inter for everything functional.
- Square everything: buttons, inputs, cards, images, chips.
- Gold as light, not paint: rules, focus, selected states and the single primary action.
- Flat at rest; soft gold-tinted lift only on hover and for floating layers.

## Colors

A warm, narrow palette: two velvet neutrals, a family of golds, and soft creams that keep photography warm.

### Primary
- **Baikunthh Gold** (`baikunthh-gold`): the signature accent. Use it for gold rules under section titles, focus rings, active tab underlines, selected borders, icons in trust rows, the live-rate dot, and gold text on dark bands. It is never a background behind white text, because it only reaches 2.46:1.
- **Deep Baikunthh Gold** (`baikunthh-gold-deep`): the gold for surfaces that carry white text. Use it for primary buttons, selected filter chips, the selected size, cart and wishlist count badges, and the "Default" address tag. It reaches 4.67:1 with white.
- **Deepest Gold** (`baikunthh-gold-deeper`): the hover and pressed state of Deep Baikunthh Gold.
- **Burnished Hover** (`burnished-hover`): a legacy mid-gold that survives only in gold-on-gold hovers of the older admin surfaces. Don't use it for new work.

### Secondary
- **Gold-Leaf Wash** (`gold-leaf-wash`): the palest gold. Use it for the size-guide panel, the empty-image placeholder gradient, and the base of gold badges (as a tint of Baikunthh Gold at about 10%).
- **Champagne** (`champagne`): warm light text on charcoal. Use it for the announcement bar, the hero subtitle and footer headings.

### Neutral
- **Velvet Tray** (`velvet-tray`): primary text, dark bands (announcement, ticker, trust strip, brand story, footer), outline buttons and their hover fill.
- **Pearl Ivory** (`pearl-ivory`): the page background everywhere on the storefront.
- **Display Cream** (`display-cream`): the backdrop behind product and category imagery, so letterboxed photos stay warm.
- **Case White** (`case-white`): raised surfaces on ivory, such as forms, order summaries, review cards and the fixed mobile purchase bars.
- **Sandstone** (`sandstone`): category and metal labels on product cards and secondary meta text.
- **Quiet Ink** (`quiet-ink`): secondary body text, helper text and placeholders on light surfaces (about 4.6:1 on ivory). The lightest grey allowed for text on light surfaces.
- **Hairline** (`hairline`): borders on inputs, quantity steppers, size chips and dividers. Use the lighter gray-100 for card edges.

### Named Rules
**The Glint Rule.** Baikunthh Gold appears as lines, outlines, icons and small marks. It fills a surface only in its deep form, and then only for the primary action or a selected state.

**The Readable Gold Rule.** White text sits only on Deep Baikunthh Gold or darker. Never put white text on Baikunthh Gold, and never put Baikunthh Gold text on ivory at body size.

## Typography

**Display Font:** Cormorant Garamond (with Playfair Display, Georgia)
**Wordmark Font:** Playfair Display, bold and tracked, only for "BAIKUNTHH"
**Body Font:** Jost (variable, with system sans)

All three are self-hosted through Fontsource packages imported in `main.tsx`; never link a font CDN.

**Character:** Cormorant's tall, high-contrast serif carries the names of pieces, prices and headings with the gravity of an engraved card. Jost's geometric capitals give labels and buttons the precision of a hallmark stamp, and its calm lowercase keeps forms and summaries quiet.

### Hierarchy
- **Display** (300, 3rem → 4.5rem, line-height 1.05, -0.02em): the home hero title only. Never larger than 4.5rem.
- **Headline** (400, 2.25rem → 3rem): section titles on the home page ("Discover Our Craft", "Signature Pieces") and the product name on large screens.
- **Title** (400, 1.875rem → 2.25rem): every page title through one shared style. Its 2.25rem size is the product price on desktop (2.75rem).
- **Card title** (Cormorant 400, 1.25rem, snug): product names on cards; 1.125rem in related rows.
- **Body** (Jost 400, 0.875rem; 1.125rem for lead paragraphs; relaxed): descriptions, helper copy, summaries. Keep paragraphs to about 65–75 characters per line.
- **Label** (Jost 500, 0.625rem, uppercase, 0.2em tracking): buttons, form labels, filter headings, breadcrumbs and meta lines. Nav links use the same size at 0.2em.

### Named Rules
**The Engraved Name Rule.** Names of pieces, prices and page titles are always set in the display serif. Interface words (buttons, labels, filters) are always set in Jost capitals. Don't swap them.

**The No Kicker Rule.** No small uppercase label above a heading. The heading carries itself; a gold rule beneath it is the only ornament.

**The Aligned Figures Rule.** Totals, summaries and price breakdowns use tabular figures, so rupee amounts line up in a column.

## Layout

One shared container: 1280px maximum, with 16px gutters on phones and 24px from 640px up. Every page, the header, the footer and every section align to it. Readable measures (reviews, forms) nest inside it at a narrower width but keep the same left edge.

The header is one fixed block: a 32px charcoal announcement bar above a 64px navbar, about 97px in total, held in `--header-h`. Every page starts below it through one shared page shell (header + 2rem on phones, header + 3rem from 768px up). Every sticky element (shop toolbar, product gallery, order summaries, account menu) measures from the same variable. Never hard-code a top offset.

Rhythm is a contrast between tight groups and generous bands: sections are separated by 80px on phones and 128px on desktop, while label-to-value and title-to-meta gaps are 4–12px. Product grids are 2 columns on phones, 3 on tablets and 4 on wide screens, with 16–24px gutters and 40px between rows. Short pages end where their content ends, with no viewport-height padding, so the footer follows naturally.

On phones, the structure reflows rather than shrinks:
- Category tiles and size chips become horizontal snap rows.
- Account sections become horizontal tabs.
- Footer link lists pair into two columns.
- The product page and checkout gain a fixed bottom bar holding the price or total and the primary action.

## Elevation & Depth

Flat at rest, lifted by interaction. Depth comes mainly from tonal layering: Case White surfaces on Pearl Ivory, and charcoal bands against light pages. Shadows are soft, low and warm, tinted with gold rather than grey, and appear as a response to hover or for elements that genuinely float.

### Shadow Vocabulary
- **Glint lift** (`box-shadow: 0 4px 24px rgba(197, 160, 89, 0.15)`): the primary button on hover and the hero CTA.
- **Resting card** (Tailwind `shadow-sm`): forms, summaries and review cards on ivory. Barely there; the white surface does the work.
- **Float** (`box-shadow: 0 1px 8px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.04)`): dropdown menus, the sort menu and toasts.
- **Bottom bar** (`box-shadow: 0 -4px 16px rgba(0,0,0,0.06)`): the fixed mobile purchase bars.

### Motion
One authored moment per page, then quiet. On the home page the hero image opens from the bottom (clip-path, 1.2s) while its photograph settles from 1.12 to 1, and the headline, subline and actions rise in sequence; all use the expo-out curve (0.16, 1, 0.3, 1). Below the hero, sections fade up 24px once as they enter the viewport. Hover motion is limited to photographs zooming inside their frame (1.04-1.05) and arrows nudging 4px. All motion goes through Framer Motion with `MotionConfig reducedMotion="user"`, and the hero checks `useReducedMotion` so it renders static when motion is reduced. No scroll listeners, no looping animation, no scroll cues.

### Named Rules
**The Flat-By-Default Rule.** Nothing casts a shadow unless the pointer is on it or it floats above the page. A hover lift may rise by 1px; never more.

## Shapes

Square and precise. Buttons, inputs, cards, chips, badges, images and banners all have 0 radius. Edges are drawn with 1px hairlines (gray-100 for cards, gray-200 for controls), and selection is shown by swapping the hairline to gold, not by thickening it, except the 2px gold underline on active tabs.

Circles are reserved for small functional marks: count badges, the live-rate dot, radio indicators, carousel dots and the trust-icon rings. Images are cropped to fixed frames (1:1 product cards, 3:4 category tiles and phone gallery, 4:5 featured pieces) with `object-cover`, and zoom gently (1.05–1.08) inside their frame on hover.

## Components

### Buttons
Quietly confident: square, tracked capitals, no icons unless they clarify.
- **Shape:** square corners (0px).
- **Primary:** Deep Baikunthh Gold with white Inter labels at 0.75rem, uppercase, 0.2em tracking, 14px × 32px padding. Hovering deepens it to Deepest Gold, adds the glint lift and raises it by 1px.
- **Outline:** a 1px Velvet Tray border with charcoal text that fills charcoal with white text on hover. Use it for secondary actions inside task flows ("Book an Appointment" on the product page, "Move to Bag").
- **Text link:** charcoal text with a 1px underline set 4px below and a 14px arrow that nudges right on hover; both turn Deep Baikunthh Gold. Use it for the secondary action beside a primary button on editorial pages, and for "View All" and collection links.
- **Outline on dark:** a white border that fills white with charcoal text, for charcoal bands.
- **Dark solid:** a charcoal fill that turns Deep Baikunthh Gold on hover. Use it for sign-in, register and in-card "Add to Bag".
- **Disabled:** 50% opacity, with no hover change.
- **Focus:** the global 2px Baikunthh Gold outline, offset 2px.

### Chips
- **Filter chips (metal, purity):** square, 1px hairline, 0.625rem tracked capitals. When selected they fill Deep Baikunthh Gold with white text.
- **Active filter tokens:** a gold wash (10%) with a gold hairline (20%) and a small × icon. Clicking one removes that filter.
- **Size chips:** 40px square cells (48px wide for bangles) that turn Deep Baikunthh Gold with white text when selected. They scroll sideways on phones.

### Cards / Containers
- **Product card:** no box. The 1:1 image on Display Cream with nothing printed over it at rest, then a centred meta line (Sandstone label), the serif name, and the price in Jost medium. Merchandising tags (New, Exclusive) appear on the product page beside the category, never as pills on the photograph. Actions (wishlist heart + "Add to Bag") slide up over the image bottom on hover, on keyboard focus, and always on touch screens.
- **Surface card:** Case White with a gray-100 hairline and the resting shadow, padded 24px (32px from 768px up). Use it for forms, order summaries and reviews. Never nest one inside another.
- **Sticky summaries** (cart, checkout) stay pinned next to their content on desktop, measured from the header.

### Inputs / Fields
- **Style:** a 1px gray-200 border, Case White fill, square corners, 12px × 16px padding, 0.875rem Inter. Every input sits inside its label; the visible caption is a Label-style span.
- **Focus:** the border turns Baikunthh Gold with a 2px gold ring at 10%.
- **Auth forms** (login, register) use the underline variant: no box, a single bottom hairline and a floating uppercase caption that turns gold on focus.

### Navigation
- **Header:** one fixed block. A charcoal announcement bar (Champagne, 0.625rem tracked capitals, one line, truncates on phones) sits above the navbar. The navbar is transparent with blur over the home hero, and white at 95% with a hairline once scrolled or on inner pages.
- **Layout:** back, Instagram, Collections menu and Appointments on the left; the centred Playfair wordmark; search, wishlist, account and bag icons (18px Lucide, 1.5px stroke) on the right, with Deep Baikunthh Gold count badges.
- **Mobile:** a menu drawer of tracked-capital links separated by hairlines.
- **Footer:** a charcoal band. A booking CTA band is shown only where it doesn't compete with a task. Link columns become two columns on phones.

### Price Breakdown (signature)
The transparency panel: a Pearl Ivory box with a hairline, titled with an info icon and a tracked label. It lists metal value (with net weight), making charges and stone charges in tabular figures, then a serif subtotal and "Inclusive of 3% GST". It sits directly under the purchase actions on every rate-based product.

### Mobile Purchase Bar (signature)
On phones, the product page and checkout keep a Case White bar fixed to the bottom of the screen. It carries the serif price or total on the left and the full-width primary action on the right, and the label explains a blocked state ("Select a Size", "Add an Address"). Toasts sit above it.

## Do's and Don'ts

### Do:
- **Do** put white text only on Deep Baikunthh Gold (#8C703B) or darker, and keep Baikunthh Gold (#C5A059) for rules, outlines, icons and focus.
- **Do** start every page with the shared page shell and container, and measure every sticky offset from `--header-h`.
- **Do** set piece names, prices and page titles in Cormorant Garamond, and interface labels in Inter uppercase at 0.2em tracking.
- **Do** keep corners square on every control and container; reserve circles for badges, dots and radio marks.
- **Do** use Quiet Ink (#6B7280) or darker for any text on ivory or white.
- **Do** give every icon-only control an accessible name and every input an enclosing label.
- **Do** use one label per intent across the site: "Book an Appointment" for every booking link.
- **Do** state only the guarantees confirmed in PRODUCT.md, in their confirmed wording.
- **Do** use tabular figures in totals and price breakdowns.

### Don't:
- **Don't** place white text on Baikunthh Gold (#C5A059) or Burnished Hover (#B38F4D); both fail contrast.
- **Don't** add a small uppercase kicker label above a heading.
- **Don't** nest a surface card inside another surface card.
- **Don't** add shadows to resting elements or use grey, hard-offset or coloured-halo shadows.
- **Don't** rely on hover alone for an action; touch and keyboard must reach it too.
- **Don't** use emoji in place of icons; use Lucide icons at a consistent stroke.
- **Don't** put pills, tags or captions on top of photographs, or add scroll cues, eyebrow labels or em dashes to copy.
- **Don't** flip a section to charcoal in the middle of a page; content stays on ivory or white.
- **Don't** pad pages to viewport height; let short pages end where their content ends.
