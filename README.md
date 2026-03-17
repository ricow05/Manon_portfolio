# Art Portfolio (Standalone)

This is a separate React + Vite portfolio project intended for GitHub Pages.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages (Custom Domain)

1. Create a new GitHub repository for this `portfolio` folder.
2. Push this folder contents to that repository root.
3. Run:

```bash
npm install
npm run deploy
```

4. In GitHub repo settings:
- Go to `Settings -> Pages`
- Set source to branch `gh-pages` and folder `/ (root)`.
- In `Settings -> Pages`, set custom domain to `onsmanon.be`.

5. DNS checklist (at your domain provider):
- Add `A` records for `@` pointing to GitHub Pages IPs.
- Add a `CNAME` record for `www` pointing to `ricow05.github.io`.

Your site will publish from the generated `dist` build.
