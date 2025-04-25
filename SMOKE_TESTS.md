# Smoke Tests for Pre-rendered Event Pages for SEO

Each smoke test below corresponds to a story in `stories.txt` and is designed to verify the successful completion of that story.

---

## 1. Provision Hosting & Domain

**Smoke Test:**  
- Visit https://livemusiclocator.com.au and confirm that a "Hello World" page is served over HTTPS with a valid SSL certificate.  
- Verify that the domain is connected to Firebase Hosting.

---

## 2. Scaffold Eleventy Project

**Smoke Test:**  
- Confirm that a GitHub repository exists with Eleventy installed and a minimal project structure (`/src`, `/_site`, `.eleventy.js`, and a "Hello World" template).
- Push a commit to the `main` branch and verify that GitHub Actions build and deploy the site to Firebase Hosting automatically.

---

## 3. Design & Implement Site Styling

**Smoke Test:**  
- Load the site and verify the presence of global layouts (header, footer, navigation) and responsive event listings.
- Check that the site uses the chosen CSS approach and that HTML is semantic and accessible (including ARIA roles and sufficient color contrast).

---

## 4. Define Content Structure & Routing

**Smoke Test:**  
- Navigate to `/events/` and `/events/<slug>/` URLs and confirm that both index and individual event pages are accessible with clean, human-readable URLs (no hash fragments).
- Verify that Firebase rewrites are configured to support these routes.

---

## 5. Pull & Render Real API Data

**Smoke Test:**  
- Trigger a site build and confirm that the event index and detail pages display live data fetched from the open events API (not placeholder content).

---

## 6. Inject JSON-LD Structured Data

**Smoke Test:**  
- Inspect the HTML of an event detail page and verify the presence of a `<script type="application/ld+json">` block containing valid schema.org/Event data with required properties (name, startDate, location.addressLocality, offers, genre, etc.).

---

## 7. Local Build & QA

**Smoke Test:**  
- Follow the documented local development workflow to install dependencies, build the site, and preview it locally.
- Validate the generated HTML, CSS, and JSON-LD using Google’s Rich Results Test and confirm there are no critical errors.

---

## 8. CI on Push: Build & Deploy

**Smoke Test:**  
- Push a commit to the `main` branch and verify that GitHub Actions install dependencies, build the site with Eleventy, and deploy to Firebase Hosting using a stored Firebase token.

---

## 9. Add Hourly Schedule (Cron)

**Smoke Test:**  
- Confirm that the CI workflow is configured to trigger a build and deploy every hour via a cron schedule, and that the site updates with new API data automatically.

---

## 10. Generate & Publish sitemap.xml + robots.txt

**Smoke Test:**  
- After a build, verify that `sitemap.xml` and `robots.txt` are generated and deployed alongside the HTML.
- Confirm that `sitemap.xml` lists all index and detail URLs, and that `robots.txt` references the sitemap.

---

## 11. Embed in Google Sites via <iframe>

**Smoke Test:**  
- Embed `<iframe src="https://livemusiclocator.com.au/events/" width="100%" height="800" style="border:none;">` in a Google Sites page.
- Confirm that the events listing loads and displays correctly within the iframe, and that any required header adjustments for framing are in place.

---