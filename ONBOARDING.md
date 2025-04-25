# Onboarding Checklist: Provision Hosting & Domain

This checklist documents all manual steps required to provision Firebase Hosting and connect the custom domain for the Pre-rendered Event Pages for SEO project.

## Story 1: Provision Hosting & Domain

### 1. Create Firebase Project
- [ ] Go to [Firebase Console](https://console.firebase.google.com/) and create a new project (e.g., "Live Music Locator").
- [ ] Disable Google Analytics (optional).

### 2. Initialize Firebase Hosting
- [ ] Install Firebase CLI if not already installed:
  ```sh
  npm install -g firebase-tools
  ```
- [ ] Authenticate with your Google account:
  ```sh
  firebase login
  ```
- [ ] In your project directory, initialize Firebase Hosting:
  ```sh
  firebase init hosting
  ```
  - Select the new Firebase project.
  - Set `public` as the directory (or another directory containing your static files).
  - Configure as a single-page app: **No**.
  - Overwrite `index.html`: **Yes** (for initial setup).

### 3. Add "Hello World" Page
- [ ] Ensure `public/index.html` (or your chosen public directory) contains a minimal "Hello World" HTML file.

### 4. Deploy to Firebase Hosting
- [ ] Deploy the site:
  ```sh
  firebase deploy --only hosting
  ```

### 5. Connect Custom Domain (livemusiclocator.com.au)
- [ ] In the Firebase Console, go to Hosting > Add custom domain.
- [ ] Enter `livemusiclocator.com.au` and follow the prompts.
- [ ] Copy the DNS verification TXT record provided by Firebase.

### 6. Update DNS Records
- [ ] Log in to your domain registrar (where livemusiclocator.com.au is managed).
- [ ] Add the TXT record to verify domain ownership.
- [ ] Add the A records and AAAA records provided by Firebase to point the domain to Firebase Hosting.

### 7. Wait for DNS Propagation
- [ ] Wait for DNS changes to propagate (can take up to 24 hours, but often much faster).
- [ ] Firebase will automatically provision an SSL certificate once DNS is correct.

### 8. Verify Deployment
- [ ] Visit https://livemusiclocator.com.au in your browser.
- [ ] Confirm the "Hello World" page loads over HTTPS with a valid SSL certificate.

---

**If you encounter issues, refer to the [Firebase Hosting documentation](https://firebase.google.com/docs/hosting/custom-domain) for troubleshooting.**