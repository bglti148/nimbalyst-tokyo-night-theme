/**
 * Default values for all Tokyo Night extension settings.
 *
 * Single source of truth — referenced by SettingsPanel.tsx (initial state
 * + Reset button), index.tsx (activate-time initialization), and the CSS
 * variable layer (where defaults are also baked into var() fallbacks for
 * the case before JS runs).
 *
 * Keep this file pure data — no React, no DOM access.
 */

export type FontWeight = 400 | 500 | 600 | 700 | 800 | 900;

export interface TokyoNightSettings {
  // Appearance toggles
  editorLight: boolean;
  stormTone: boolean;

  // Markdown editor numerics
  maxWidth: number;       // px, applied to .editor-shell max-width
  topPadding: number;     // px, applied to .editor padding-top
  h1Weight: FontWeight;
  h2Weight: FontWeight;
  h3Weight: FontWeight;

  // File icon colors keyed by extension (without leading dot)
  // Special files use a synthetic key (e.g., "_readme", "_package", "_gitignore", "_license")
  iconColors: Record<string, string>;
}

export const DEFAULT_SETTINGS: TokyoNightSettings = {
  editorLight: false,
  stormTone: false,
  maxWidth: 800,
  topPadding: 80,
  h1Weight: 800,
  h2Weight: 700,
  h3Weight: 600,
  iconColors: {
    md: '#a4df2e',
    markdown: '#a4df2e',
    json: '#ae81ff',
    ts: '#7aa2f7',
    tsx: '#7aa2f7',
    js: '#e0af68',
    jsx: '#e0af68',
    mjs: '#e0af68',
    cjs: '#e0af68',
    py: '#bb9af7',
    java: '#ff9e64',
    go: '#ff9e64',
    rs: '#ff9e64',
    cpp: '#9ece6a',
    c: '#9ece6a',
    h: '#9ece6a',
    hpp: '#9ece6a',
    html: '#f7768e',
    htm: '#f7768e',
    css: '#7dcfff',
    scss: '#7dcfff',
    sass: '#7dcfff',
    less: '#7dcfff',
    xml: '#e0af68',
    svg: '#bb9af7',
    yaml: '#73daca',
    yml: '#73daca',
    toml: '#73daca',
    csv: '#9ece6a',
    // Special-file synthetic keys
    _readme: '#7aa2f7',
    _package: '#f7768e',
    _gitignore: '#787c99',
    _license: '#787c99',
  },
};

/**
 * Curated swatch palette presented in the color picker. Tokyo Night accent
 * colors plus a few "brand" colors commonly used for file-type identity.
 */
export const SWATCH_PALETTE: string[] = [
  '#7aa2f7', // blue (TypeScript brand)
  '#bb9af7', // purple
  '#7dcfff', // cyan (CSS brand)
  '#73daca', // teal
  '#9ece6a', // green
  '#a4df2e', // bright green (markdown default)
  '#e0af68', // yellow (JavaScript brand)
  '#ff9e64', // orange
  '#f7768e', // red/coral (HTML brand)
  '#ae81ff', // bright purple (JSON default)
  '#787c99', // muted gray
  '#a9b1d6', // light blue-gray
];

/**
 * Font weight options for the heading weight dropdowns.
 */
export const FONT_WEIGHT_OPTIONS: FontWeight[] = [400, 500, 600, 700, 800, 900];

/**
 * Storm tone CSS variable overrides applied to <html> when the toggle is on.
 * These mirror the deltas between the v1.2.x `tokyo-night` and
 * `tokyo-night-storm` theme entries.
 */
export const STORM_TONE_OVERRIDES: Record<string, string> = {
  '--nim-bg': '#24283b',
  '--nim-bg-secondary': '#1f2335',
  '--nim-bg-tertiary': '#1b1e2e',
  '--nim-bg-hover': '#2c324a',
  '--nim-bg-active': '#363c54',
  '--nim-text-muted': '#8089b3',
  '--nim-code-bg': '#1f2335',
  '--nim-code-gutter': '#1b1e2e',
  '--nim-scrollbar-track': '#1f2335',
  '--nim-table-header': '#1f2335',
  '--nim-table-cell': '#24283b',
  '--nim-table-stripe': '#1b1e2e',
  '--nim-toolbar-bg': '#1f2335',
  '--nim-toolbar-hover': '#2c324a',
  '--nim-toolbar-active': '#363c54',
  '--nim-terminal-bg': '#1f2335',
  '--nim-terminal-cursor-accent': '#24283b',
};

/**
 * Extract the file extension from a filename. Returns lowercase without
 * the leading dot, or a synthetic "_special" key for known special files.
 * Returns null if no recognizable extension.
 */
export function getExtensionKey(fileName: string): string | null {
  const lower = fileName.toLowerCase();

  // Special files (must match Nimbalyst's fileIcons.tsx special-case logic)
  if (lower === 'readme.md' || lower === 'readme.markdown') return '_readme';
  if (lower === 'package.json') return '_package';
  if (lower === '.gitignore' || lower === '.gitattributes') return '_gitignore';
  if (lower === 'license' || lower === 'license.md' || lower === 'license.txt') return '_license';

  // Standard extension (after last dot, lowercased, no leading dot)
  const lastDot = lower.lastIndexOf('.');
  if (lastDot === -1 || lastDot === 0) return null;
  const ext = lower.slice(lastDot + 1);
  return ext.length > 0 ? ext : null;
}
