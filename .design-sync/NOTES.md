# design-sync notes - TRAILBLAZER (blaze-frontend)

Claude Design project: **TRAILBLAZER Design System** (`projectId` in config.json).
First sync: 2026-09-13 (package shape, incremental upload path).

## Layout / how the build is wired

- This is a Next.js 16 app, not a library. The DS is served through a **shim package** at
  `.design-sync/pkg/` (`package.json` name `trailblazer-ui`, `types`/`module` = `index.ts`):
  `index.ts` explicitly re-exports the real components from `components/` (relative paths - ts-morph
  must be able to follow them; `@/` aliases would resolve to nothing for the `.d.ts` extractor).
  Adding a component to the DS = adding an `export` line there (+ a `.design-sync/docs/<Name>.md`).
- `theme.tsx` (`TrailblazerTheme`) is the only non-app code in the bundle: the provider that renders
  the `.dark` scope and puts `dark` on `<html>` (mirrors `app/layout.tsx`). Needed for portals.
- `toast` (sonner) and `tbToast` (`utils/tbToast.ts`) are exported so designs use the same sonner
  instance the bundled `Toaster` listens to.
- CSS: `.design-sync/pkg/tailwind.css` imports `app/globals.css` + `fonts/fonts.css`, adds
  `@source` for `components/ app/ features/ .design-sync/previews` and an inline utility safelist,
  and defines `--font-sans/--font-kanit/--font-geist-mono` (next/font sets these at runtime in the app).
  `node .design-sync/build-css.mjs` (cfg.buildCmd) compiles it with the repo's `@tailwindcss/postcss`
  into `.design-sync/pkg/styles.css` (gitignored) = cfg.cssEntry. **Run it before the converter whenever
  globals.css, component classes, previews or the safelist change.**
- Fonts: Anuphan 400-700 + Kanit 400/700/800, latin+thai woff2, fetched once from Google Fonts
  (fonts.googleapis.com css2 API, Chrome UA) into `.design-sync/pkg/fonts/` and committed (OFL).
  The four Anuphan latin files are byte-identical (variable font served per weight) - harmless.
- Docs: `.design-sync/docs/<Name>.md` for all 171 exports (cfg.docsDir = `../docs`). The frontmatter
  `category` is what groups the cards (actions/forms/layout/overlays/feedback/navigation/data-display/
  brand/app/widgets/landing); `srcDir` is pinned to `components/ui` so every component starts in the
  generic group and the doc category wins (a dir-derived group would beat it). A doc body replaces
  the synthesized examples, so root docs carry their own `## Usage` snippet; sub-part docs repeat the
  family snippet. New component without a doc -> lands in `general` with a synthesized prompt.
- Forks (`.design-sync/overrides/`, declared in cfg.libOverrides):
  - `dts.mjs`: `isOwnProp` treats any workspace path (no `node_modules/` segment) as the DS's own API.
    Without it every `on*`/`aria-*` prop declared in `components/` was dropped from the `.d.ts`
    (sources live outside the shim pkgDir). One added line, marked `FORK:`.
  - `story-imports.mjs`: skips the plugin's async `b.resolve` round-trip for imports whose importer
    is inside `node_modules`. Without it each preview that imports `lucide-react` took ~12 s to compile
    on Windows (1500 icon modules x plugin IPC) -> full build 10+ min; with it ~35 s. Same outcome.
  - On re-sync diff both against `.ds-sync/lib/` and re-apply the one-line changes if upstream moved.
  - Forks need `.design-sync/node_modules` -> `.ds-sync/node_modules` (a **junction** on Windows:
    `New-Item -ItemType Junction`; `ln -s` in Git Bash copies the tree instead).
- Playwright: cached chromium build 1234 in `%LOCALAPPDATA%\ms-playwright` = playwright **1.62.1**
  (installed in `.ds-sync/`). 1.63 wants chromium 1243 - don't bump without installing the browser.
- `.design-sync/.cache/manifest.mjs` (gitignored) lists ds-bundle upload paths; `montage.py` tiles
  raw per-cell captures for grading; `check-conventions.py` validates conventions.md names.

## Deliberately excluded (re-sync candidates)

Not exported from the shim because they need things the bundle cannot provide statically:
- Next.js router/`next/link`/`next/image`: `Navbar`, `FloatingSupport`, `ReferralTracker`, `TierGuard`,
  `Hero`, `StreamerShowcase`, `UpgradeToProPlanDialog`, `WidgetQuotaDialog`, `ConditionalFooter`.
- Live API / auth context (`services/*`, `UserProvider`): `ReferralDialog`, `QuotaMeter`,
  `WidgetConfigLayout`, `WidgetStatusSwitch`, `WidgetSettingsCard`, `WidgetOverviewCard`,
  `BotProfileSelector`, `TwitchRewardSelector`, `SmartOverlayUrlInput`, `SmartAudioFileUploader`,
  `AudioFileUploader*`, `CompactAudioFileUploader`.
- `TwitchLoginButton` imports node `crypto` (esbuild browser build fails).
- `LightPillar` (three.js WebGL), `workflow/*` nodes (`@xyflow/react`, need ReactFlowProvider),
  `example.tsx` / `component-example.tsx` (demo pages), everything under `features/` (page-level).
  Pulling any of these in needs shims for `next/*` or a mock provider - decide per component.

## Known render warns (validate prints these; all triaged benign)

- `[RENDER_THIN] components/brand/{Discord,Spotify,Twitch,YouTube}.html: mounted text is just "<Name>"` -
  the icon cells contain SVGs plus one button label; the icons render (checked on the sheets).

## Preview notes

- Overlay components use `cardMode: single` with explicit viewports (config `overrides`); open state
  is forced with `open` / `defaultOpen`. Radix popper/Base UI positioners measure against the real
  viewport, so the single-card viewport must be tall enough (Select/Combobox 560px) or lists shrink/flip.
- Arbitrary Tailwind values (`min-h-[320px]`) are NOT compiled - previews and designs must use
  safelisted steps (`min-h-80`, `w-96`, ...). The safelist lives in `pkg/tailwind.css`.
- Slider: the shipped component has no visible disabled state (its `disabled:` classes sit on a span),
  so no Disabled cell.
- Avatar / ChannelRewardSelector previews load images from static-cdn.jtvnw.net (network); the
  fallback renders when offline.
- Grades cleared once when the `story-imports.mjs` fork was added (documented: any fork add/delete
  moves the grade contract) - expected, re-graded from fresh sheets.

## Re-sync risks

- `.design-sync/pkg/index.ts` is a hand-maintained export list: a new file in `components/` is NOT
  picked up automatically. Diff `components/` against the entry on each sync.
- `.design-sync/docs/*.md` are hand-written and can drift from the source (variant names, props).
  The `.d.ts` is always regenerated; the prose is not. Spot-check families whose source changed.
- The utility safelist in `pkg/tailwind.css` and the family table in `conventions.md` must move
  together; `check-conventions.py` (cache) verifies the table against the compiled CSS.
- Fonts were fetched from Google once; a new weight in `app/layout.tsx` needs a re-fetch.
- The two lib forks must be re-diffed against the staged `.ds-sync/lib/` copies after a skill update.
- `styles.css` is compiled from the whole app (`@source app/ features/`): app-only classes ride along,
  and a class the app stops using disappears from the DS - conventions table names only safelisted ones.
