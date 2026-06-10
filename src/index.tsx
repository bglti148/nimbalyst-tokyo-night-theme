/**
 * Tokyo Night Extension for Nimbalyst
 *
 * Entry point. On activate():
 *   1) Reads persisted settings via context.storage and applies them as
 *      CSS variables on the document.
 *   2) Sets up a MutationObserver on the file tree to add per-file-type
 *      classes for icon coloring.
 *   3) Sets up a MutationObserver on <html>'s data-theme attribute to
 *      re-apply Storm tone after Nimbalyst overwrites our inline styles.
 *   4) Registers cleanup via context.subscriptions so reload/uninstall
 *      tears observers down cleanly.
 *
 * The settings panel is exported separately and the host mounts it under
 * Settings → Extensions → Tokyo Night.
 */

import { applyAllSettings } from './cssVariables';
import { createFileTreeObserver } from './fileTreeObserver';
import { createThemeObserver } from './themeObserver';
import { TokyoNightSettingsPanel } from './SettingsPanel';
import type { ExtensionContext, ExtensionStorage } from '@nimbalyst/runtime';

/**
 * Settings panel components exported by this extension.
 * Referenced in manifest.json: settingsPanel.component = "TokyoNightSettingsPanel".
 */
export const settingsPanel = {
  TokyoNightSettingsPanel,
};

/**
 * Extension activation. Called when the extension loads.
 *
 * The exact shape of `context.storage` vs `context.services.configuration`
 * varies across SDK versions. We try both — whichever exists wins — and
 * gracefully no-op if neither is available (the CSS variable defaults
 * baked into the stylesheet still apply, so the extension renders
 * correctly even without persisted state).
 */
export async function activate(context: ExtensionContext): Promise<void> {
  // eslint-disable-next-line no-console
  console.log('[TokyoNight] Extension activated (v2.0.4)');
  // eslint-disable-next-line no-console
  console.log('[TokyoNight] context:', context);

  // Stash context globally for ad-hoc DevTools inspection
  // (paste `__tnContext` into Console to introspect).
  (globalThis as unknown as { __tnContext?: unknown }).__tnContext = context;

  // Log keys of services so we can find where storage actually lives.
  if (context && typeof context === 'object') {
    const services = (context as unknown as { services?: unknown }).services;
    if (services && typeof services === 'object') {
      // eslint-disable-next-line no-console
      console.log('[TokyoNight] context.services keys:', Object.keys(services));
      // eslint-disable-next-line no-console
      console.log('[TokyoNight] context.services full:', services);
    }
  }

  // eslint-disable-next-line no-console
  console.log(
    '[TokyoNight] DOM check: .nimbalyst-editor count =',
    document.querySelectorAll('.nimbalyst-editor').length,
    '| .file-tree-file count =',
    document.querySelectorAll('.file-tree-file').length
  );

  const storage = resolveStorage(context);

  if (storage) {
    // eslint-disable-next-line no-console
    console.log('[TokyoNight] Storage resolved, applying initial settings');
    try {
      await applyAllSettings(storage);
    } catch (err) {
      console.error('[TokyoNight] Failed to apply initial settings:', err);
    }
  } else {
    console.warn(
      '[TokyoNight] No storage in activate() context. The settings panel will apply settings when it mounts. ' +
        'Inspect `__tnContext` in DevTools Console to find where storage actually lives, then we can resolve it at activate-time.'
    );
  }

  // Set up DOM observers
  const fileTreeObs = createFileTreeObserver();
  const themeObs = createThemeObserver();

  // Register cleanup if context provides a subscriptions list
  if (context.subscriptions) {
    context.subscriptions.push(
      { dispose: () => fileTreeObs.dispose() },
      { dispose: () => themeObs.dispose() }
    );
  }
  // Stash disposers globally as a fallback in case context.subscriptions
  // isn't honored — `deactivate()` will read them.
  (globalThis as unknown as { __tokyoNightDisposers?: Array<() => void> }).__tokyoNightDisposers = [
    () => fileTreeObs.dispose(),
    () => themeObs.dispose(),
  ];
}

/**
 * Extension deactivation. Called when the extension is unloaded.
 * Cleanup is handled via context.subscriptions; this is a safety net.
 */
export async function deactivate(): Promise<void> {
  // eslint-disable-next-line no-console
  console.log('[TokyoNight] Extension deactivated');

  const disposers = (globalThis as unknown as { __tokyoNightDisposers?: Array<() => void> }).__tokyoNightDisposers;
  if (Array.isArray(disposers)) {
    for (const dispose of disposers) {
      try {
        dispose();
      } catch (err) {
        console.error('[TokyoNight] Disposer error:', err);
      }
    }
  }
}

/**
 * Try to find an ExtensionStorage-shaped object on the activation context.
 * The Nimbalyst SDK exposes storage either as `context.storage` or under
 * `context.services.storage` depending on version. The settings panel
 * always receives storage directly, but activate() needs to look it up.
 */
function resolveStorage(context: ExtensionContext): ExtensionStorage | null {
  if (context.storage) return context.storage;

  // Probe known/possible paths defensively
  const services = (context as unknown as { services?: Record<string, unknown> }).services;
  if (services && typeof services === 'object') {
    for (const candidate of [
      services.storage,
      services.Storage,
      services.extensionStorage,
      services.settings,
    ]) {
      if (isExtensionStorage(candidate)) return candidate;
    }
  }

  return null;
}

function isExtensionStorage(candidate: unknown): candidate is ExtensionStorage {
  return (
    typeof candidate === 'object' &&
    candidate !== null &&
    typeof (candidate as ExtensionStorage).get === 'function' &&
    typeof (candidate as ExtensionStorage).set === 'function'
  );
}
