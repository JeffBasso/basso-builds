# Basso Builds

Build logs and videos for my hardware projects. An Astro static site, deployed to GitHub Pages on
every push to `main`.

## Run it locally

```powershell
npm install
npm run dev      # http://localhost:4321
```

## Add or update content

Everything is Markdown under `src/content/`. You can edit a file on github.com, commit, and the site
redeploys in about a minute.

| What | Where |
|---|---|
| A project | `src/content/projects/<slug>.md` |
| A chapter | `src/content/chapters/<project-slug>/<chapter-slug>.md` |

Chapter status is `planned`, `draft` or `published`. Project status is `planning`, `in design`,
`building`, `testing` or `done`.

### Adding a video

Videos are never stored in this repo. Put a link in the front matter instead:

```yaml
video:
  youtube: dQw4w9WgXcQ                          # YouTube id (unlisted works), or
  embed: https://share.descript.com/embed/XXXX  # any embed URL: Descript, Vimeo, Cloudflare Stream
  caption: Optional line under the video
```

Small images go in `public/images/<project>/` and are referenced as `/images/<project>/name.jpg`.

## First-time GitHub setup

1. Create a **public** repo (GitHub Pages on a free plan needs a public repo) and push this folder to `main`.
2. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The site appears at `https://<user>.github.io/<repo>/`.

For a custom domain, add it in Settings → Pages, then set `BASE_PATH: /` in `.github/workflows/deploy.yml`.
