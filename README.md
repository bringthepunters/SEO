# Pre-rendered Event Pages for SEO

This project generates a fast, low-cost, SEO-optimized static events site at **https://livemusiclocator.com.au** that:

- Updates **hourly** from our **public** events API  
- Produces **flat HTML** with **no runtime server**  
- Is **fully crawlable** and **indexable** by Google  
- Embeds **JSON-LD** structured data for rich results  
- Surfaces inside our Google Sites page via an `<iframe>`

## 🧰 Tech Stack

| Component                   | Role                                                         |
|-----------------------------|--------------------------------------------------------------|
| **Events API**              | Open source of gig data (date, "tonight," location, genre)   |
| **Eleventy**                | Static-site generator that fetches API & outputs HTML        |
| **GitHub Actions**          | Cron-driven CI/CD: build & deploy every hour                 |
| **Firebase Hosting**        | Serves the generated site under our custom domain            |
| **Google Sites**            | Embeds the live events page via `<iframe>`                   |

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
   ```

## 🛠️ Development Setup

### Prerequisites

- Node.js and npm
- Firebase CLI (`npm install -g firebase-tools`)

### Local Development

1. **Clone the repository**
   ```sh
   git clone https://github.com/bringthepunters/SEO.git
   cd SEO
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Build the static site with Eleventy**
   ```sh
   npm run build
   ```
   - Output will be generated in the `/_site` directory.

4. **Preview the site locally**
   ```sh
   npx serve ./_site
   ```
   - By default, the site will be available at [http://localhost:3000](http://localhost:3000)

5. **Validate HTML, CSS, and JSON-LD**
   - Open [Google's Rich Results Test](https://search.google.com/test/rich-results)
   - Enter your local server URL or upload an HTML file from the `/_site` directory
   - Check for errors or warnings in the results

## 🚀 Deployment

The site is automatically deployed via GitHub Actions:
- On every push to the `main` branch
- On a hourly schedule (cron: '0 * * * *')

If you need to deploy manually:

```sh
firebase login
npm run build
firebase deploy --only hosting
```

## 📁 Project Structure

- `/.github/workflows/` - GitHub Actions CI/CD configuration
- `/src/` - Source files for Eleventy
  - `/_data/` - Data files (including API fetch logic)
  - `/_includes/` - Layout templates
  - `/events/` - Event pages templates
- `/.eleventy.js` - Eleventy configuration
- `/firebase.json` - Firebase configuration
- `/_site/` - Generated static files (not committed to Git)

## 📝 Documentation

For more detailed information, please refer to:

- [ONBOARDING.md](ONBOARDING.md) - Steps for provisioning hosting and domain
- [approach.md](approach.md) - Technical approach and goals
- [PROJECT_PLAN.md](PROJECT_PLAN.md) - Detailed project plan
- [SMOKE_TESTS.md](SMOKE_TESTS.md) - Tests for each project step

## 📚 Resources

- [Eleventy Documentation](https://www.11ty.dev/docs/)
- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Schema.org Event](https://schema.org/Event)
- [Google's Rich Results Test](https://search.google.com/test/rich-results)