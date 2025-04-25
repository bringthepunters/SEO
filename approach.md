# 🔧 Technical Approach: Pre-rendered Event Pages for SEO

## 🎯 Goal

Build a fast, low-cost, SEO-optimized static events site at **https://livemusiclocator.com.au** that:

- Updates **hourly** from our **public** events API  
- Produces **flat HTML** with **no runtime server**  
- Is **fully crawlable** and **indexable** by Google  
- Embeds **JSON-LD** structured data for rich results  
- Surfaces inside our Google Sites page via an `<iframe>`

---

## 🧰 Tech Stack

| Component                   | Role                                                         |
|-----------------------------|--------------------------------------------------------------|
| **Events API**              | Open source of gig data (date, “tonight,” location, genre)  |
| **Eleventy**                | Static-site generator that fetches API & outputs HTML        |
| **GitHub Actions**          | Cron-driven CI/CD: build & deploy every hour                 |
| **Firebase Hosting**        | Serves the generated site under our custom domain            |
| **Google Sites**            | Embeds the live events page via `<iframe>`                   |

---

## 🔄 System Workflow

1. **API Data Changes**  
   Your backend publishes new/updated events (with date, suburb, genre fields).

2. **Hourly CI Trigger**  
   GitHub Actions runs on `0 * * * *`:

   - Installs dependencies  
   - Executes Eleventy build  
   - Fetches latest JSON from the **public** API  
   - Generates:
     - **Index pages** (e.g. `/events/`, `/events/tonight/fitzroy/ska/`)  
     - **Detail pages** (`/events/<slug>/index.html`)  
   - Injects `<script type="application/ld+json">` per **schema.org/Event**

3. **Deploy to Firebase**  
   The new static files (HTML, CSS, `sitemap.xml`, `robots.txt`) replace the old ones.

4. **Embed in Google Sites**  
   Editors add:
   ```html
   <iframe
     src="https://livemusiclocator.com.au/events/"
     width="100%" height="800" style="border:none;">
   </iframe>
