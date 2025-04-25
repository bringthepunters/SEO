# 🗺️ Project Plan: Pre-rendered Event Pages for SEO

## 1. Provision Hosting & Domain
- Set up Firebase project and connect livemusiclocator.com.au.
- Deploy a "Hello World" page to verify DNS and SSL.

## 2. Scaffold Eleventy Project
- Initialize GitHub repo with Eleventy.
- Add minimal structure and a basic template.
- Set up GitHub Actions for build and deploy to Firebase on push.

## 3. Design & Implement Site Styling
- Choose CSS approach (Tailwind or custom).
- Create global layouts and responsive event listing styles.
- Ensure semantic HTML and accessibility.

## 4. Define Content Structure & Routing
- Decide on URL patterns:
  - /events/ (main index, with filters)
  - /events/<slug>/ (event detail pages)
- Configure Eleventy collections and firebase.json rewrites.

## 5. Pull & Render Real API Data
- Implement Eleventy data file to fetch from the public events API.
- Populate templates for index and detail pages.

## 6. Inject JSON-LD Structured Data
- Add schema.org/Event JSON-LD to detail templates.

## 7. Local Build & QA
- Document/test local dev workflow (npm install, build, preview).
- Validate HTML, CSS, and JSON-LD with Google’s Rich Results Test.

## 8. CI on Push: Build & Deploy
- Configure GitHub Actions to build and deploy on push to main.
- Store Firebase token in GitHub Secrets.

## 9. Add Hourly Schedule (Cron)
- Extend CI workflow to run every hour (cron: '0 * * * *').

## 10. Generate & Publish sitemap.xml + robots.txt
- Output sitemap.xml and robots.txt during build.
- Deploy alongside HTML.

## 11. Embed in Google Sites via <iframe>
- Provide editors with iframe embed code.
- Adjust headers if needed to allow framing.

---

## 🧩 Dependencies & Flow

```mermaid
graph TD
    A[Provision Hosting & Domain] --> B[Scaffold Eleventy Project]
    B --> C[Design & Implement Site Styling]
    B --> D[Define Content Structure & Routing]
    D --> E[Pull & Render Real API Data]
    E --> F[Inject JSON-LD Structured Data]
    F --> G[Local Build & QA]
    G --> H[CI on Push: Build & Deploy]
    H --> I[Add Hourly Schedule (Cron)]
    H --> J[Generate & Publish sitemap.xml + robots.txt]
    H --> K[Embed in Google Sites via iframe]