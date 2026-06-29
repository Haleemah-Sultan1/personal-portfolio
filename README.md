# Haleemah Malik — Portfolio

VS Code editor-style personal portfolio. Dark, minimal, CS aesthetic.

## Edit your content

**Everything you need to change is in `content.json`.** Do not touch HTML/CSS unless you want to change the layout.

### Add a new blog

Open `content.json` → find the `blogs` section → add a new object inside `"files"`:

```json
{
  "id": "my-new-post",
  "name": "my-new-post.md",
  "url": "https://your-link.com",
  "lines": [
    "Your Blog Title",
    "",
    "A short sarcastic teaser.",
    "",
    "https://your-link.com"
  ]
}
```

Save, push to GitHub — Vercel redeploys automatically.

### Add Google Form for book orders

In `content.json`, set:

```json
"bookOrder": {
  "googleForm": "https://docs.google.com/forms/d/YOUR_FORM_ID/viewform"
}
```

### Add project screenshots

Drop images into `assets/` (see `assets/README.txt`) and set `"image": "assets/your-file.png"` on any project in `content.json`.

### Change text, email, links

Edit the `"lines"` arrays under each file in `content.json`.

---

## Preview locally

```powershell
cd C:\Users\HP\haleemah-portfolio
npx serve .
```

Open `http://localhost:3000` in your browser.

---

## Deploy free on Vercel

1. Create a repo on GitHub (e.g. `haleemah-portfolio`).
2. Push this folder:

```powershell
cd C:\Users\HP\haleemah-portfolio
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/haleemah-portfolio.git
git push -u origin main
```

3. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repo → **Deploy**.
4. Done. Your site will be live at `your-project.vercel.app`.

Every time you edit `content.json` and push, the site updates in ~1 minute.

---

## Project structure

```
haleemah-portfolio/
├── content.json    ← EDIT THIS (all your text, links, blogs, projects)
├── index.html      ← layout (don't touch unless you know what you're doing)
├── css/style.css   ← colors & editor look
├── js/app.js       ← loads content.json into the editor UI
├── assets/         ← your images
└── vercel.json     ← Vercel config
```
