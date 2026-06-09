# Tokyo Night for Nimbalyst

A configurable Tokyo Night theme for [Nimbalyst](https://github.com/Nimbalyst/nimbalyst), featuring a settings panel for tuning the editor experience without touching CSS. Includes per-file-type icon colors, heading weight controls, editor width and top padding sliders, plus toggleable light-editor and Storm-tone modes.

Built as a proper Nimbalyst JS extension — React settings panel, runtime CSS variable layer, file-tree MutationObserver.

## Install

1. Clone the repository:
   ```bash
   git clone https://github.com/bglti148/nimbalyst-tokyo-night-theme.git
   ```
2. Load the folder into Nimbalyst via Settings → Extensions ("Install from folder"), or drop the folder into Nimbalyst's user extensions directory (`~/Library/Application Support/Nimbalyst/extensions/` on macOS).
3. Open the theme picker in Nimbalyst's navigation gutter and select **Tokyo Night**.
4. Open Settings → Tokyo Night to configure light-editor mode, Storm tone, file icon colors, heading weights, and editor layout.

The built `dist/index.js` is committed to the repo, so no `npm install` or build step is needed to install — just clone and load.

## Settings panel

Three sections:

### Appearance
- **Light editor for markdown files** — when on, the markdown editor pane renders with a light background (upstream Tokyo Night Day palette) while the UI chrome stays dark
- **Use Storm tone** — switches the chrome from the canonical Tokyo Night to the slightly lighter Storm palette

### Markdown editor
- **Editor max-width** — slider, 400–1200px, default 800
- **Doc top padding** — slider, 0–200px, default 80
- **H1 / H2 / H3 weight** — dropdowns, default 800 / 700 / 600

### File icon colors
Click any swatch to change. Custom hex supported. Defaults map common file types to Tokyo Night palette colors:

| Group | Default |
| --- | --- |
| Markdown (`.md`, `.markdown`) | `#a4df2e` |
| JSON (`.json`) | `#ae81ff` |
| TypeScript (`.ts`, `.tsx`) | `#7aa2f7` |
| JavaScript (`.js`, `.jsx`, `.mjs`, `.cjs`) | `#e0af68` |
| HTML (`.html`, `.htm`) | `#f7768e` |
| CSS family (`.css`, `.scss`, `.sass`, `.less`) | `#7dcfff` |
| Python (`.py`) | `#bb9af7` |
| Compiled languages (`.java`, `.go`, `.rs`) | `#ff9e64` |
| C family (`.c`, `.cpp`, `.h`, `.hpp`) | `#9ece6a` |
| YAML/TOML | `#73daca` |
| Special files (README, package.json, .gitignore, LICENSE) | varies |

All settings persist across app restarts. Use the **Reset all to defaults** button to clear.

## Architecture

| Layer | Responsibility |
| --- | --- |
| `src/SettingsPanel.tsx` | React UI; receives `{ storage, theme }`; dual-writes on change (storage + CSS variable) |
| `src/cssVariables.ts` | Helpers: `applySettingToCSS`, `setEditorLightActive`, `setStormToneActive`, `applyAllSettings` |
| `src/fileTreeObserver.ts` | MutationObserver — adds `file-ext-{key}` classes to file tree rows |
| `src/themeObserver.ts` | MutationObserver — re-applies Storm tone after Nimbalyst overwrites our `<html>` inline styles on theme change |
| `src/index.tsx` | `activate()` reads settings on startup, applies CSS variables, sets up observers, registers cleanup |
| `tokyo-night-markdown.css` | Static stylesheet; every tunable value uses `var(--tokyo-night-*, <default>)` so CSS works before JS runs |

Settings panel writes to storage, also directly calls `documentElement.style.setProperty()` for instant visual feedback (no `onDidChange` event exists in Nimbalyst's storage API).

## Upgrading from v1.x

v2.0.0 consolidates four themes (Tokyo Night, Tokyo Night Storm, both with `(Editor Light)` variants) into a single **Tokyo Night** theme with toggleable settings. Existing v1.x users will see Nimbalyst's standard fallback banner after updating.

To restore your previous setup:
- **"Tokyo Night"** → just select Tokyo Night
- **"Tokyo Night Storm"** → select Tokyo Night, then Settings → Tokyo Night → toggle on "Use Storm tone"
- **"Tokyo Night (Editor Light)"** → select Tokyo Night, then toggle on "Light editor for markdown files"
- **"Tokyo Night Storm (Editor Light)"** → select Tokyo Night, then toggle on both "Use Storm tone" and "Light editor for markdown files"

## Coverage

| Surface | Fidelity |
| --- | --- |
| App chrome (sidebar, tabs, statusbar, panels) | Full — Tokyo Night palette, optional Storm tone |
| Terminal (16-color ANSI + cursor, selection) | Full |
| Markdown editor typography (headings, paragraphs, lists, tables, quotes, links, code) | Full — every value configurable via settings |
| Markdown / Lexical code-token colors | High — 8 syntax buckets from Tokyo Night's TextMate scopes |
| Light-editor mode (hybrid: dark chrome + light editor pane) | Full — toggle via settings |
| File icon colors (per file type) | Full — configurable per extension |
| Diff editor, tables, scrollbars, quotes | Full |
| **Monaco code editor syntax highlighting** | **Not themable** — Nimbalyst does not expose Monaco theming through the extension API. Monaco uses Nimbalyst's built-in palette regardless of the active extension theme. |

## Development

For contributors who want to modify the extension:

```bash
npm install
npm run build         # builds dist/index.js
npm run dev           # watch mode
npm run typecheck     # type-check without emit
```

The built `dist/index.js` is committed so end users don't need to build. Always re-build and commit `dist/` before pushing.

## Credits

- Original palette: [Enkia](https://github.com/enkia) and contributors — [tokyo-night/tokyo-night-vscode-theme](https://github.com/tokyo-night/tokyo-night-vscode-theme)
- Nimbalyst port: [bglti148](https://github.com/bglti148)

## License

[MIT](LICENSE). Includes the upstream Tokyo Night copyright (Enkia, 2018-present) alongside the port's copyright.
