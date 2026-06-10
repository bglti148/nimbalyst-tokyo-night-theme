/**
 * Theme observer.
 *
 * Watches <html> for `data-theme` attribute changes. When Nimbalyst
 * re-applies its theme (e.g., user picks a different theme), inline-style
 * CSS variables on <html> are overwritten — including our Storm tone
 * overrides. This observer detects that and re-applies if needed.
 *
 * Also re-applies the editor-light attribute to any newly mounted
 * `.nimbalyst-editor` containers when the toggle is on.
 */

import {
  EDITOR_LIGHT_ELEMENT_ATTR,
  isEditorLightActive,
  reapplyStormToneIfActive,
} from './cssVariables';

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

      // eslint-disable-next-line no-console
      console.log('[TokyoNight] data-theme changed — re-applying Storm/light if active');

      reapplyStormToneIfActive();

      if (isEditorLightActive()) {
        document.querySelectorAll('.nimbalyst-editor').forEach((el) => {
          el.setAttribute(EDITOR_LIGHT_ELEMENT_ATTR, '');
        });
      }
    }
  });

  attrObserver.observe(root, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  // Watch for newly mounted .nimbalyst-editor containers so the
  // editor-light attribute can be applied when the toggle is on.
  const mountObserver = new MutationObserver((mutations) => {
    if (!isEditorLightActive()) return;

    for (const mutation of mutations) {
      for (const added of Array.from(mutation.addedNodes)) {
        if (!(added instanceof Element)) continue;

        if (added.classList?.contains('nimbalyst-editor')) {
          added.setAttribute(EDITOR_LIGHT_ELEMENT_ATTR, '');
        }
        added.querySelectorAll?.('.nimbalyst-editor').forEach((el) => {
          el.setAttribute(EDITOR_LIGHT_ELEMENT_ATTR, '');
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
