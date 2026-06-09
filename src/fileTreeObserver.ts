/**
 * File tree observer.
 *
 * Watches the DOM for `.file-tree-file` rows and adds a `file-ext-{key}`
 * class to each based on the row's filename. Enables per-file-type icon
 * coloring via CSS rules like:
 *
 *   .file-ext-md  .file-tree-icon { color: var(--tokyo-night-icon-md); }
 *
 * Cleanup is via the returned dispose() function.
 */

import { getExtensionKey } from './defaults';

const FILE_EXT_CLASS_PREFIX = 'file-ext-';

/**
 * Extract the filename from a .file-tree-file row.
 * Strategy: prefer an explicit attribute if Nimbalyst exposes one; fall
 * back to textContent (file rows are typically only the filename text).
 */
function extractFilename(row: Element): string | null {
  // Strategy 1: a `name` attribute on a child (FileTreeRow puts node.name
  // on the file-name span as a non-standard `name` attribute in some
  // builds — try this first because it's the most stable signal).
  const named = row.querySelector('[name]');
  const nameAttr = named?.getAttribute('name');
  if (nameAttr) return nameAttr;

  // Strategy 2: any text content inside the row (file rows are
  // typically just the icon + filename + optional git status badge).
  const text = row.textContent?.trim() ?? '';
  if (!text) return null;

  // Strip a leading git-status code if present (single letter then space,
  // e.g., "M index.ts" → "index.ts"). FileTreeRow renders status codes
  // M/S/?/D inside a child span — they appear concatenated in textContent.
  // We match the longest reasonable filename token rather than splitting,
  // which would be fragile.
  // For now, take the last whitespace-separated token as the most likely
  // filename — git status badges are at the start, filename at the end.
  const tokens = text.split(/\s+/);
  return tokens[tokens.length - 1] || null;
}

/**
 * Remove all `file-ext-*` classes from an element. Used before re-applying
 * a new class so renamed files get re-classified correctly.
 */
function clearExtClasses(row: Element): void {
  const toRemove: string[] = [];
  row.classList.forEach((cls) => {
    if (cls.startsWith(FILE_EXT_CLASS_PREFIX)) toRemove.push(cls);
  });
  toRemove.forEach((cls) => row.classList.remove(cls));
}

/**
 * Classify a single row: extract its filename, derive the extension key,
 * and apply the `file-ext-{key}` class.
 */
function classifyRow(row: Element): void {
  const filename = extractFilename(row);
  clearExtClasses(row);
  if (!filename) return;

  const key = getExtensionKey(filename);
  if (key) row.classList.add(`${FILE_EXT_CLASS_PREFIX}${key}`);
}

/**
 * Classify all .file-tree-file rows currently in the DOM. Called once at
 * startup and after large mutation batches.
 */
function classifyAllRows(): void {
  document.querySelectorAll('.file-tree-file').forEach(classifyRow);
}

/**
 * Set up the file tree observer. Returns a dispose function that
 * disconnects the observer.
 */
export function createFileTreeObserver(): { dispose: () => void } {
  // Initial classification of any rows already in the DOM
  classifyAllRows();

  // Observe the entire document body for added/removed file rows.
  // Scoping to a more specific container would be more efficient, but the
  // file tree container's exact class/ID isn't documented and may vary —
  // observing body with a targeted callback keeps us resilient to changes.
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      // New nodes added: classify any new file rows
      for (const added of Array.from(mutation.addedNodes)) {
        if (!(added instanceof Element)) continue;

        // The added node itself might be a file row
        if (added.classList?.contains('file-tree-file')) {
          classifyRow(added);
        }
        // Or it might contain file rows (e.g., expanded folder)
        added.querySelectorAll?.('.file-tree-file').forEach(classifyRow);
      }

      // Existing nodes mutated (renames update text content via React).
      // If the target itself is a file row OR contains file rows, reclassify.
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
