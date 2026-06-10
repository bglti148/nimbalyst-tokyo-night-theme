/**
 * CSS variable runtime layer.
 *
 * Reads settings from storage (or accepts them directly) and writes them
 * to CSS custom properties and DOM attributes, so changes take effect
 * immediately without rebuilding the stylesheet.
 *
 * Two scoping mechanisms are used:
 *  - `--tokyo-night-*` and `--nim-*` CSS variables on <html> via
 *    `documentElement.style.setProperty()`. CSS rules read these via
 *    `var(--name, default)`.
 *  - DOM attributes on the .nimbalyst-editor wrapper (for editor-light
 *    mode) and .file-tree-file rows (for per-file-type icon colors).
 *    Attributes are used instead of classes because React replaces the
 *    `className` string on every re-render, which would strip any class
 *    we added. Attributes survive className updates.
 */

import type { ExtensionStorage } from '@nimbalyst/runtime';
import {
  DEFAULT_SETTINGS,
  STORM_TONE_OVERRIDES,
  TOKYO_NIGHT_DARK_OVERRIDES,
  type TokyoNightSettings,
} from './defaults';

const ROOT = () => document.documentElement;
const STORM_MARKER_CLASS = 'tn-storm-active';

/** Attribute placed on .nimbalyst-editor elements to opt them into the
 *  editor-light CSS scoping block. */
export const EDITOR_LIGHT_ELEMENT_ATTR = 'data-tn-editor-light';

/** Attribute placed on <html> to track whether editor-light is globally
 *  active. Used by the theme observer to re-apply the element attribute
 *  to newly mounted .nimbalyst-editor containers. */
const EDITOR_LIGHT_STATE_ATTR = 'data-tn-light-editor-active';

/**
 * Map a setting key to the CSS variable name it controls (on :root).
 * Returns null for keys that don't drive a single root variable.
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

function formatValue(key: keyof TokyoNightSettings, value: unknown): string {
  if (key === 'maxWidth' || key === 'topPadding') return `${value}px`;
  return String(value);
}

/**
 * Apply a single setting to its CSS variable. No-op for keys that aren't
 * variable-driven (editorLight, stormTone, iconColors have their own setters).
 */
export function applySettingToCSS(
  key: keyof TokyoNightSettings,
  value: unknown
): void {
  const varName = rootVarFor(key);
  if (varName === null) return;
  const formatted = formatValue(key, value);
  ROOT().style.setProperty(varName, formatted);
  // eslint-disable-next-line no-console
  console.log(`[TokyoNight] CSS var set: ${varName} = ${formatted}`);
}

/**
 * Apply a single file-type icon color to its CSS variable.
 * Variable name pattern: --tokyo-night-icon-{ext}
 */
export function applyIconColor(extensionKey: string, color: string): void {
  ROOT().style.setProperty(`--tokyo-night-icon-${extensionKey}`, color);
}

/**
 * Toggle the editor-light visual mode by setting/removing the
 * `data-tn-editor-light` attribute on every `.nimbalyst-editor` element.
 * Also sets a state attribute on <html> so the theme observer can
 * re-apply when new editors mount or theme changes.
 *
 * Using an attribute instead of a class is deliberate: React owns the
 * className prop on `.nimbalyst-editor` and replaces it wholesale on
 * every re-render. A class we added would be stripped. An attribute
 * survives.
 */
export function setEditorLightActive(active: boolean): void {
  const editors = document.querySelectorAll('.nimbalyst-editor');
  // eslint-disable-next-line no-console
  console.log(
    `[TokyoNight] setEditorLightActive(${active}) — found ${editors.length} .nimbalyst-editor element(s)`
  );

  editors.forEach((el) => {
    if (active) el.setAttribute(EDITOR_LIGHT_ELEMENT_ATTR, '');
    else el.removeAttribute(EDITOR_LIGHT_ELEMENT_ATTR);
  });

  if (active) {
    ROOT().setAttribute(EDITOR_LIGHT_STATE_ATTR, '1');
  } else {
    ROOT().removeAttribute(EDITOR_LIGHT_STATE_ATTR);
  }

  if (editors.length === 0) {
    // eslint-disable-next-line no-console
    console.warn(
      `[TokyoNight] No .nimbalyst-editor elements found. ` +
        `Open a markdown file to verify the selector still matches your Nimbalyst version. ` +
        `Inspect a markdown editor in DevTools to confirm the outermost wrapper has class 'nimbalyst-editor'.`
    );
  }
}

/** Returns true if editor-light is globally active. */
export function isEditorLightActive(): boolean {
  return ROOT().hasAttribute(EDITOR_LIGHT_STATE_ATTR);
}

/**
 * Toggle the Storm tone chrome palette. Writes inline styles on <html>
 * for each chrome variable. When deactivating, writes back the canonical
 * Tokyo Night dark values instead of `removeProperty` — otherwise the
 * variables would be left undefined and the page would render with no
 * background (browser default = white).
 */
export function setStormToneActive(active: boolean): void {
  const root = ROOT();
  const targetValues = active ? STORM_TONE_OVERRIDES : TOKYO_NIGHT_DARK_OVERRIDES;
  for (const [varName, value] of Object.entries(targetValues)) {
    root.style.setProperty(varName, value);
  }
  if (active) {
    root.classList.add(STORM_MARKER_CLASS);
  } else {
    root.classList.remove(STORM_MARKER_CLASS);
  }
  // eslint-disable-next-line no-console
  console.log(`[TokyoNight] setStormToneActive(${active})`);
}

/** Returns true if our Storm tone overrides are currently active. */
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
 * for startup initialization.
 */
export async function applyAllSettings(storage: ExtensionStorage): Promise<void> {
  const settings = await readAllSettings(storage);
  // eslint-disable-next-line no-console
  console.log('[TokyoNight] Applying all settings from storage:', settings);

  applySettingToCSS('maxWidth', settings.maxWidth);
  applySettingToCSS('topPadding', settings.topPadding);
  applySettingToCSS('h1Weight', settings.h1Weight);
  applySettingToCSS('h2Weight', settings.h2Weight);
  applySettingToCSS('h3Weight', settings.h3Weight);

  for (const [ext, color] of Object.entries(settings.iconColors)) {
    applyIconColor(ext, color);
  }

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
  const settings: TokyoNightSettings = {
    ...DEFAULT_SETTINGS,
    iconColors: { ...DEFAULT_SETTINGS.iconColors },
  };

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
    settings.iconColors = {
      ...settings.iconColors,
      ...(iconColors as Record<string, string>),
    };
  }

  return settings;
}

/**
 * Reset all settings to defaults: clears stored values and re-applies
 * default CSS variables.
 */
export async function resetAllSettings(storage: ExtensionStorage): Promise<void> {
  const keys = [
    'editorLight',
    'stormTone',
    'maxWidth',
    'topPadding',
    'h1Weight',
    'h2Weight',
    'h3Weight',
    'iconColors',
  ];
  for (const key of keys) {
    await storage.set(key, (DEFAULT_SETTINGS as unknown as Record<string, unknown>)[key]);
  }
  await applyAllSettings(storage);
}
