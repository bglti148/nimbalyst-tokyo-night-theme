/**
 * Theme observer.
 *
 * Watches <html> for `data-theme` attribute changes. When Nimbalyst
 * re-applies its theme (e.g., user picks a different theme), inline-style
 * CSS variables on <html> are overwritten — including our Storm tone
 * overrides. This observer detects that and re-applies if needed.
 *
 * Also re-applies the editor-light class to any newly mounted
 * `.nimbalyst-editor` containers when the toggle is on.
 */

import { reapplyStormToneIfActive, setEditorLightActive } from './cssVariables';

/**
 * Set up the theme observer. Returns a dispose function.
 */
export function createThemeObserver(): { dispose: () => void } {
  const root = document.documentElement;

  // Watch <html> for data-theme attribute changes. Nimbalyst writes
  // data-theme + inline styles synchronously in useTheme.ts; we re-apply
  // immediately after detecting the change.
  const attrObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== 'attributes') continue;
      if (mutation.attributeName !== 'data-theme') continue;

      // Re-apply Storm tone overrides (they were just wiped)
      reapplyStormToneIfActive();

      // Re-apply editor-light marker check: if our marker is set on <html>,
      // ensure all .nimbalyst-editor containers have the class.
      if (root.hasAttribute('data-tn-editor-light')) {
        setEditorLightActive(true);
      }
    }
  });

  attrObserver.observe(root, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  // Also watch for new .nimbalyst-editor containers being mounted, so the
  // editor-light class can be applied to them if the toggle is on.
  // (When the user opens a markdown file, a new container is mounted.)
  const mountObserver = new MutationObserver((mutations) => {
    if (!root.hasAttribute('data-tn-editor-light')) return;

    for (const mutation of mutations) {
      for (const added of Array.from(mutation.addedNodes)) {
        if (!(added instanceof Element)) continue;

        if (added.classList?.contains('nimbalyst-editor')) {
          added.classList.add('tn-editor-light');
        }
        added.querySelectorAll?.('.nimbalyst-editor').forEach((el) => {
          el.classList.add('tn-editor-light');
        });
      }
    }
  });

  mountObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return {
    dispose: () => {
      attrObserver.disconnect();
      mountObserver.disconnect();
    },
  };
}
