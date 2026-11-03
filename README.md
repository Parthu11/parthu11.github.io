# Parth Patel – Portfolio

One-page portfolio. Plain HTML, CSS and JavaScript, no build step, so any free static host can serve it.

## Put it online for free, for good (GitHub Pages)

GitHub Pages is free with no time limit. Your link will be `https://YOUR-USERNAME.github.io`.

1. Sign up or log in at https://github.com (free).
2. Click **+** (top right) → **New repository**.
   - Repository name: **`YOUR-USERNAME.github.io`** (your exact username, all lowercase).
   - Choose **Public**. Leave everything else as it is. Click **Create repository**.
3. On the new page, click **uploading an existing file**.
4. Open the `~/Projects/portfolio` folder in Finder, select **everything inside it** (index.html, 404.html, the `assets` folder, the PDF, README.md) and drag it into the browser.
   - Finder hides `.nojekyll`. Press **Cmd + Shift + .** to show it and drag it in too (it stops GitHub from changing the files).
5. Click **Commit changes**.
6. Go to **Settings → Pages**. Under "Build and deployment", Source = **Deploy from a branch**, Branch = **main**, folder **/ (root)** → **Save**.
7. Wait 1–2 minutes and open `https://YOUR-USERNAME.github.io`.

To update the site later: open the repository, click **Add file → Upload files**, drag the changed files in, and commit.

## Preview on your Mac

```
cd ~/Projects/portfolio
python3 -m http.server 8000
```
Open http://localhost:8000

## Files

```
index.html                                   the page
404.html                                     sends broken links back to the home page
assets/style.css                             design, themes, animations
assets/app.js                                phone screens, demos, menus
assets/photo/                                headshot (site + full size)
assets/og-image.jpg                          preview image shown when the link is shared
assets/resume/                               page images for "Preview Resume"
Parth_Patel_Mobile_Application_Developer.pdf résumé for the download buttons
```

## Editing content

- Text for projects, experience and awards is in `index.html`.
- The skills list and "where I used it" links are in `assets/app.js` (search for `GROUPS`).
- Years of experience update by themselves from Feb 2022.
- When the résumé changes: replace the PDF (same file name) and the preview images in `assets/resume/` (`page-1.jpg`, `page-2.jpg`), or ask Claude to re-render them.
