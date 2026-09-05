# Break Your Own Site — Findings

## What I tried
- Submitted the contact form empty
- Submitted the contact form with invalid email (missing @)
- Clicked every link on the site (LinkedIn, GitHub, StudyBuddy live app)
- Ran a Lighthouse speed check
- Searched my own name on Google

## Findings (fix-now vs known-limitation)

**Fix-now:** None found. The contact form's built-in browser validation correctly caught both empty submission ("please fill this field") and an invalid email ("missing @"), preventing bad submissions from going through.

**Known limitation:**
- The site doesn't yet rank on Google search for my name — expected, since it's a newly deployed site that hasn't been crawled/indexed yet. This should improve over time now that basic SEO meta tags have been added.
- Form validation relies on the browser's native validation messages rather than custom-styled error messages — acceptable for a simple one-page portfolio, but a nice-to-have for later.

## What I fixed
Added SEO meta tags (description, Open Graph title/description, type) to `index.html` so the site is more discoverable in search and shows a proper title/description preview when shared on social media or messaging apps.

## Speed check
Lighthouse scores (mobile): Performance 88, Accessibility 97 — both comfortably above the 80 minimum bar.