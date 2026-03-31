# crew

## Subcontractor compensation report

Web app for building compensation packages: crews, work lines, installation cost, in-app PDF preview & signing (Compensation + Waiver), Submit/Paid flags, and a timeline of Sign / Submit / Paid (US Eastern).

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
npm run build
npm start
```

## GitHub Pages

This app is a static export (`output: "export"` in `next.config.ts`). GitHub Pages only serves static files, so there is no Node server — that setup is correct.

**Project site** (default): live URL is `https://<username>.github.io/<repo>/`. The build must set `NEXT_BASE_PATH=/<repo>` so scripts and CSS load under that path.

**Deploy with GitHub Actions** (recommended): enable **Settings → Pages → Source: GitHub Actions**. Pushes to `main` run [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml), which builds with `NEXT_BASE_PATH` = your repo name and uploads the `out/` folder.

**Manual / local check** (repo named `crew`):

```bash
npm run build:pages
```

Deploy the contents of `out/` (not the whole monorepo). `public/.nojekyll` is copied into `out/` so GitHub does not ignore `_next/`.

If you **rename the repo**, change `build:pages` in `package.json` to use the new name, or run:

```bash
NEXT_BASE_PATH=/<your-repo-name> npm run build
```

**User site** (`<username>.github.io` with no repo path): build with no `NEXT_BASE_PATH` and deploy `out/` to that repo’s root.

## Stack

| Layer      | Choice                                      |
| ---------- | ------------------------------------------- |
| Framework  | [Next.js](https://nextjs.org) (App Router)  |
| UI         | React, TypeScript, Bootstrap 5              |
| PDF in-app | [`@react-pdf/renderer`](https://react-pdf.org) |

## Repo layout (short)

- `app/` — routes, global styles, `components/` for screens and modals
- `app/lib/` — helpers (e.g. payment timeline formatting)
