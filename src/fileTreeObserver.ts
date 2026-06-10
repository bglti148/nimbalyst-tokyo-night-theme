/**
 * File tree observer.
 *
 * Watches the DOM for `.file-tree-file` rows and sets a `data-tn-file-ext`
 * attribute on each based on the row's filename. CSS uses the attribute
 * selector `[data-tn-file-ext="md"] .file-tree-icon` to color icons
 * per file type.
 *
 * Attribute (not class) because React owns the .file-tree-file element's
 * className and replaces it wholesale every time the row's selected /
 * focused state changes — that would strip any class we added. Attributes
 * are not part of React's className update path, so they survive
 * re-renders.
 */

import { getExtensionKey } from './defaults';

const FILE_EXT_ATTR = 'data-tn-file-ext';

/**
 * Extract the filename from a .file-tree-file row.
 */
function extractFilename(row: Element): string | null {
  // Strategy 1: a `name` attribute on a child (FileTreeRow puts node.name
  // as a non-standard `name` attribute on the file-name element).
  const named = row.querySelector('[name]');
  const nameAttr = named?.getAttribute('name');
  if (nameAttr) return nameAttr;

  // Strategy 2: textContent — file rows typically contain only the
  // filename text plus optional git status badges (M/S/?/D).
  const text = row.textContent?.trim() ?? '';
  if (!text) return null;

  // Status badges appear at the start of textContent; the filename is
  // usually the last whitespace-separated token.
  const tokens = text.split(/\s+/);
  return tokens[tokens.length - 1] || null;
}

/**
 * Classify a single row: extract its filename, derive the extension key,
 * and set the `data-tn-file-ext` attribute.
 */
function classifyRow(row: Element): void {
  const filename = extractFilename(row);
  if (!filename) {
    row.removeAttribute(FILE_EXT_ATTR);
    return;
  }

  const key = getExtensionKey(filename);
  if (key) row.setAttribute(FILE_EXT_ATTR, key);
  else row.removeAttribute(FILE_EXT_ATTR);
}

/**
 * Classify all .file-tree-file rows currently in the DOM.
 */
function classifyAllRows(): void {
  document.querySelectorAll('.file-tree-file').forEach(classifyRow);
}

/**
 * Set up the file tree observer. Returns a dispose function.
 */
export function createFileTreeObserver(): { dispose: () => void } {
  classifyAllRows();
  // eslint-disable-next-line no-console
  console.log('[TokyoNight] File tree observer initialized');

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const added of Array.from(mutation.addedNodes)) {
        if (!(added instanceof Element)) continue;

        if (added.classList?.contains('file-tree-file')) {
          classifyRow(added);
        }
        added.querySelectorAll?.('.file-tree-file').forEach(classifyRow);
      }

      // Handle existing rows whose filename text mutated (rename, etc.)
      if (mutation.type === 'characterData' || mutation.type === 'childList') {
        const target = mutation.target instanceof Element
          ? mutation.target
          : mutation.target.parentElement;
        if (!target) continue;

        const row = target.closest?.('.file-tree-file');
        if (row) classifyRow(row);
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  return {
    dispose: () => observer.disconnect(),
  };
}
