# Consistency, Not Talent (and Frame, Not Upstage)

## Visual Identity for StudyBuddy

### Colors
- **Primary:** Purple `#7C3AED` — used for the logo, links, and key interactive elements
- **Background:** Soft gray `#F5F5F7` — calm, non-distracting canvas
- **Text:** Dark charcoal `#1F2028` — softer than pure black, easier to read
- **Success/accent:** Green `#22C55E` — reserved for positive states (e.g. correct quiz answers)

These were set once in `globals.css` as CSS variables and reused everywhere (Navbar, buttons, icon), rather than picking colors page-by-page. That's the "consistency" the task title points at — the same four colors show up on every screen instead of each page inventing its own palette.

### Typography
Kept the existing Geist Sans font that ships with Next.js rather than adding a second display font. One font family, used consistently for headings and body text, reads as more intentional than mixing two fonts without a clear reason.

### Judging the image: why a custom SVG instead of an AI-generated illustration

I looked at AI-generated illustration options for the homepage (student-with-laptop style images), and considered stock illustration sites too. I rejected both routes:

- **AI-generated illustrations** tend to default to a generic "corporate-illustration" style with random color choices — getting one that matched the exact purple/gray palette without looking like a mismatched sticker on the page would have taken many regenerations, and even then the extra detail in a full illustration risked pulling attention away from the actual product (the "frame, not upstage" rule from the brief).
- **Stock icons** (searched via image search) are copyrighted and not something I can legally reuse in the app.

Instead, I hand-built a small SVG icon: two overlapping flashcards in the app's own purple, plus a green checkmark badge. It's deliberately plain — it echoes the product (flashcards + correct answers) without competing with the headline text underneath it, and it's built entirely from the app's existing three colors, so it can never clash with the rest of the design the way an imported image could.

**Takeaway:** the "real work" of this task wasn't making an image — it was deciding an image wasn't the right call here, and picking the more disciplined option that reinforces the identity already set by the colors.

## Live links
- Live app: https://study-buddy-umber-nine.vercel.app
- GitHub repo: https://github.com/tahir786408/study_buddy
