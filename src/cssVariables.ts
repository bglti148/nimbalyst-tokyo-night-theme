/**
 * CSS variable runtime layer.
 *
 * Reads settings from storage (or accepts them directly) and writes them
 * to CSS custom properties on the document, so changes take effect
 * immediately without rebuilding the stylesheet.
 *
 * Variable namespace: `--tokyo-night-*` for our own settings.
 * Nimbalyst's chrome variables (`--nim-bg`, etc.) are only touched by
 * Storm tone since chrome reads those directly from inline styles on <html>.
 */

import type { ExtensionStorage } from '@nimbalyst/runtime';
import {
  DEFAULT_SETTINGS,
  STORM_TONE_OVERRIDES,
  type TokyoNightSettings,
} from './defaults';

const ROOT = () => document.documentElement;
const STORM_MARKER_CLASS = 'tn-storm-active';
const EDITOR_LIGHT_CLASS = 'tn-editor-light';

/**
 * Map a setting key to the CSS variable name it controls (on :root).
 * Returns null for keys that don't drive a single root variable
 * (e.g., editorLight is a class toggle; stormTone is a multi-variable bulk).
 */
function rootVarFor(key: keyof TokyoNightSettings): string | null {
  switch (key) {
    case 'maxWidth':
      return '--tokyo-night-max-width';
    case 'topPadding':
      return '--tokyo-night-top-padding';
    case 'h1Weight':
      return '--tokyo-night-h1-weight';
    case 'h2Weight':
      return '--tokyo-night-h2-weight';
    case 'h3Weight':
      return '--tokyo-night-h3-weight';
    default:
      return null;
  }
}

/**
 * Format a numeric setting value with the appropriate unit for its CSS
 * variable (px for dimensions, unitless for weights).
 */
function formatValue(key: keyof TokyoNightSettings, value: unknown): string {
  if (key === 'maxWidth' || key === 'topPadding') return `${value}px`;
  return String(value);
}

/**
 * Apply a single setting to its CSS variable.
 * No-op for keys that aren't variable-driven (editorLight, stormTone,
 * iconColors — those have their own setters).
 */
export function applySettingToCSS(
  key: keyof TokyoNightSettings,
  value: unknown
): void {
  const varName = rootVarFor(key);
  if (varName === null) return;
  ROOT().style.setProperty(varName, formatValue(key, value));
}

/**
 * Apply a single file-type icon color to its CSS variable.
 * Variable name pattern: --tokyo-night-icon-{ext}
 */
export function applyIconColor(extensionKey: string, color: string): void {
  ROOT().style.setProperty(`--tokyo-night-icon-${extensionKey}`, color);
}

/**
 * Toggle the editor-light visual mode. Adds/removes `tn-editor-light` on
 * the .nimbalyst-editor container; CSS handles the rest via class scoping.
 * The class is added to all current .nimbalyst-editor elements and we
 * also toggle a marker class on <html> so newly mounted editors pick up
 * the state.
 */
export function setEditorLightActive(active: boolean): void {
  // Toggle on existing editor containers
  document.querySelectorAll('.nimbalyst-editor').forEach((el) => {
    el.classList.toggle(EDITOR_LIGHT_CLASS, active);
  });
  // Track state on <html> so a MutationObserver can re-apply to new editors
  if (active) {
    ROOT().setAttribute('data-tn-editor-light', '1');
  } else {
    ROOT().removeAttribute('data-tn-editor-light');
  }
}

/**
 * Toggle the Storm tone chrome palette. Writes inline styles on <html>
 * for each chrome variable, since chrome reads those from <html>'s inline
 * style declarations (set by Nimbalyst's useTheme.ts). A marker class
 * `tn-storm-active` indicates we own these overrides — used by the theme
 * observer to know whether to re-apply after Nimbalyst overwrites.
 */
export function setStormToneActive(active: boolean): void {
  const root = ROOT();
  if (active) {
    for (const [varName, value] of Object.entries(STORM_TONE_OVERRIDES)) {
      root.style.setProperty(varName, value);
    }
    root.classList.add(STORM_MARKER_CLASS);
  } else {
    for (const varName of Object.keys(STORM_TONE_OVERRIDES)) {
      root.style.removeProperty(varName);
    }
    root.classList.remove(STORM_MARKER_CLASS);
  }
}

/**
 * Returns true if our Storm tone overrides are currently active.
 */
export function isStormToneActive(): boolean {
  return ROOT().classList.contains(STORM_MARKER_CLASS);
}

/**
 * Re-apply Storm tone overrides if the toggle is on. Called by the theme
 * observer after Nimbalyst re-applies its theme (which clears our inline
 * styles).
 */
export function reapplyStormToneIfActive(): void {
  if (isStormToneActive()) {
    for (const [varName, value] of Object.entries(STORM_TONE_OVERRIDES)) {
      ROOT().style.setProperty(varName, value);
    }
  }
}

/**
 * Bulk-apply all settings from storage to the document. Used on activate()
 * for startup initialization. Reads each setting, falling back to defaults.
 */
export async function applyAllSettings(storage: ExtensionStorage): Promise<void> {
  const settings = await readAllSettings(storage);

  // Numerics → :root CSS vars
  applySettingToCSS('maxWidth', settings.maxWidth);
  applySettingToCSS('topPadding', settings.topPadding);
  applySettingToCSS('h1Weight', settings.h1Weight);
  applySettingToCSS('h2Weight', settings.h2Weight);
  applySettingToCSS('h3Weight', settings.h3Weight);

  // File icon colors → individual :root CSS vars
  for (const [ext, color] of Object.entries(settings.iconColors)) {
    applyIconColor(ext, color);
  }

  // Class-based toggles
  setEditorLightActive(settings.editorLight);
  setStormToneActive(settings.stormTone);
}

/**
 * Read all settings from storage with defaults. Used by both the settings
 * panel (for initial state) and activate() (for startup application).
 */
export async function readAllSettings(
  storage: ExtensionStorage
): Promise<TokyoNightSettings> {
  const settings: TokyoNightSettings = { ...DEFAULT_SETTINGS, iconColors: { ...DEFAULT_SETTINGS.iconColors } };

  // Read each setting; storage.get() returns the value or null/undefined
  const editorLight = await storage.get('editorLight');
  if (typeof editorLight === 'boolean') settings.editorLight = editorLight;

  const stormTone = await storage.get('stormTone');
  if (typeof stormTone === 'boolean') settings.stormTone = stormTone;

  const maxWidth = await storage.get('maxWidth');
  if (typeof maxWidth === 'number') settings.maxWidth = maxWidth;

  const topPadding = await storage.get('topPadding');
  if (typeof topPadding === 'number') settings.topPadding = topPadding;

  const h1Weight = await storage.get('h1Weight');
  if (typeof h1Weight === 'number') settings.h1Weight = h1Weight as TokyoNightSettings['h1Weight'];

  const h2Weight = await storage.get('h2Weight');
  if (typeof h2Weight === 'number') settings.h2Weight = h2Weight as TokyoNightSettings['h2Weight'];

  const h3Weight = await storage.get('h3Weight');
  if (typeof h3Weight === 'number') settings.h3Weight = h3Weight as TokyoNightSettings['h3Weight'];

  const iconColors = await storage.get('iconColors');
  if (iconColors && typeof iconColors === 'object') {
    settings.iconColors = { ...settings.iconColors, ...(iconColors as Record<string, string>) };
  }

  return settings;
}

/**
 * Reset all settings to defaults: clears stored values and re-applies
 * default CSS variables.
 */
export async function resetAllSettings(storage: ExtensionStorage): Promise<void> {
  const keys = ['editorLight', 'stormTone', 'maxWidth', 'topPadding', 'h1Weight', 'h2Weight', 'h3Weight', 'iconColors'];
  for (const key of keys) {
    // Set to undefined (or default) — storage interface may or may not support delete.
    // Setting to the default value is portable.
    await storage.set(key, (DEFAULT_SETTINGS as unknown as Record<string, unknown>)[key]);
  }
  await applyAllSettings(storage);
}
