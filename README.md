# Tokyo Night for Nimbalyst

A port of the [Tokyo Night](https://github.com/tokyo-night/tokyo-night-vscode-theme) Visual Studio Code theme to [Nimbalyst](https://github.com/Nimbalyst/nimbalyst). Includes two dark variants: **Tokyo Night** (canonical `#1a1b26` background) and **Tokyo Night Storm** (lighter `#24283b` background).

Manifest-only extension — no JavaScript, no build step.

## Install

1. Clone or download this repository:
   ```bash
   git clone https://github.com/bglti148/nimbalyst-tokyo-night-theme.git
   ```
2. Load the folder into Nimbalyst via Settings → Extensions ("Install from folder"), or drop it into Nimbalyst's user extensions directory (`~/Library/Application Support/Nimbalyst/extensions/` on macOS — confirm the path in your Settings).
3. Open the theme picker in Nimbalyst's navigation gutter and select **Tokyo Night** or **Tokyo Night Storm** under the *Extension* section.

## Palette

| Token | Tokyo Night | Tokyo Night Storm |
| --- | --- | --- |
| Background | `#1a1b26` | `#24283b` |
| Sidebar / Panels | `#16161e` | `#1f2335` |
| Foreground | `#a9b1d6` | `#a9b1d6` |
| Accent (primary) | `#7aa2f7` | `#7aa2f7` |
| Success / Strings | `#9ece6a` | `#9ece6a` |
| Warning / Numbers | `#e0af68` | `#e0af68` |
| Error / Keywords | `#f7768e` | `#f7768e` |
| Info / Properties | `#7dcfff` | `#7dcfff` |
| Purple / Attributes | `#bb9af7` | `#bb9af7` |
| Comments | `#565f89` | `#565f89` |

The 16-color ANSI terminal palette is ported 1:1 from the upstream theme.

## Coverage

| Surface | Fidelity |
| --- | --- |
| App chrome (sidebar, tabs, statusbar, panels) | Full |
| Terminal (16-color ANSI + cursor, selection) | Full |
| Markdown / Lexical code blocks | High — 8 syntax buckets mapped from Tokyo Night's TextMate scopes |
| Diff editor, tables, scrollbars, quotes | Full |
| **Monaco code editor syntax highlighting** | **Not themable** — Nimbalyst does not expose Monaco theming through the extension API. Monaco uses Nimbalyst's built-in palette regardless of the active extension theme. |

## Credits

- Original palette: [Enkia](https://github.com/enkia) and contributors — [tokyo-night/tokyo-night-vscode-theme](https://github.com/tokyo-night/tokyo-night-vscode-theme)
- Nimbalyst port: [bglti148](https://github.com/bglti148)

## License

[MIT](LICENSE). Includes the upstream Tokyo Night copyright (Enkia, 2018-present) alongside the port's copyright.
