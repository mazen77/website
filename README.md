# Mazen Cinematic Website (GitHub-ready)

## Run locally
Open `index.html` in your browser (or use a local server).

### Local server (recommended)
```bash
python -m http.server 5500
```
Then open: http://localhost:5500

## Deploy to GitHub Pages
1) Create a new repo on GitHub (e.g. `mazen-site`)

2) In this folder run:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/mazen-site.git
git push -u origin main
```

3) On GitHub:
- Settings → Pages
- Source: `Deploy from a branch`
- Branch: `main` / root
- Save

Your site will be live on GitHub Pages.
