/**
 * Tokyo Night Settings Panel
 *
 * Rendered inside Settings → Extensions → Tokyo Night. Receives
 * { storage, theme } from Nimbalyst. On every change, dual-writes:
 *   1) persist the new value via storage.set(key, value)
 *   2) directly update the corresponding CSS variable on the document
 *
 * The dual-write pattern is necessary because Nimbalyst's storage API
 * doesn't emit change events — without it, the UI updates but the editor
 * doesn't re-render until the next app reload.
 */

import { useEffect, useState } from 'react';
import type { SettingsPanelProps } from '@nimbalyst/runtime';
import {
  DEFAULT_SETTINGS,
  FONT_WEIGHT_OPTIONS,
  SWATCH_PALETTE,
  type FontWeight,
  type TokyoNightSettings,
} from './defaults';
import {
  applyAllSettings,
  applyIconColor,
  applySettingToCSS,
  readAllSettings,
  resetAllSettings,
  setEditorLightActive,
  setStormToneActive,
} from './cssVariables';

/**
 * Icon color rows grouped by user mental model. Each row's `keys` array
 * lists all file extensions that share the color (a single pick updates
 * every key in the group). Reduces visual noise and prevents the "I
 * picked .md but it didn't change .markdown" confusion.
 */
const ICON_ROWS: Array<{ label: string; keys: string[]; sample: string }> = [
  { label: 'Markdown (.md, .markdown)', keys: ['md', 'markdown'], sample: 'README.md' },
  { label: 'JSON (.json)', keys: ['json'], sample: 'data.json' },
  { label: 'TypeScript (.ts, .tsx)', keys: ['ts', 'tsx'], sample: 'index.ts' },
  { label: 'JavaScript (.js, .jsx, .mjs, .cjs)', keys: ['js', 'jsx', 'mjs', 'cjs'], sample: 'index.js' },
  { label: 'Python (.py)', keys: ['py'], sample: 'main.py' },
  { label: 'Java (.java)', keys: ['java'], sample: 'Main.java' },
  { label: 'Go (.go)', keys: ['go'], sample: 'main.go' },
  { label: 'Rust (.rs)', keys: ['rs'], sample: 'main.rs' },
  { label: 'C / C++ (.c, .cpp, .h, .hpp)', keys: ['c', 'cpp', 'h', 'hpp'], sample: 'main.c' },
  { label: 'HTML (.html, .htm)', keys: ['html', 'htm'], sample: 'index.html' },
  { label: 'CSS family (.css, .scss, .sass, .less)', keys: ['css', 'scss', 'sass', 'less'], sample: 'styles.css' },
  { label: 'XML (.xml)', keys: ['xml'], sample: 'config.xml' },
  { label: 'SVG (.svg)', keys: ['svg'], sample: 'icon.svg' },
  { label: 'YAML (.yaml, .yml)', keys: ['yaml', 'yml'], sample: 'config.yaml' },
  { label: 'TOML (.toml)', keys: ['toml'], sample: 'config.toml' },
  { label: 'CSV (.csv)', keys: ['csv'], sample: 'data.csv' },
  { label: 'README files', keys: ['_readme'], sample: 'README.md' },
  { label: 'package.json', keys: ['_package'], sample: 'package.json' },
  { label: '.gitignore', keys: ['_gitignore'], sample: '.gitignore' },
  { label: 'LICENSE', keys: ['_license'], sample: 'LICENSE' },
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [customHex, setCustomHex] = useState(value);

  useEffect(() => {
    setCustomHex(value);
  }, [value]);

  const applyCustom = () => {
    const trimmed = customHex.trim();
    if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(trimmed)) {
      onChange(trimmed);
      setOpen(false);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: 28,
          height: 22,
          borderRadius: 4,
          border: '1px solid var(--nim-border)',
          backgroundColor: value,
          cursor: 'pointer',
          padding: 0,
        }}
        aria-label={`Color: ${value}`}
        title={value}
      />
      {open && (
        <>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 999998,
            }}
          />
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 4,
              padding: 10,
              backgroundColor: 'var(--nim-bg-secondary)',
              border: '1px solid var(--nim-border)',
              borderRadius: 6,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              zIndex: 999999,
              minWidth: 200,
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
              {SWATCH_PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(c);
                    setOpen(false);
                  }}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                    border: c === value ? '2px solid var(--nim-text)' : '1px solid var(--nim-border)',
                    backgroundColor: c,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                  title={c}
                />
              ))}
            </div>
            <div style={{ marginTop: 10, display: 'flex', gap: 6, alignItems: 'center' }}>
              <input
                type="text"
                value={customHex}
                onChange={(e) => setCustomHex(e.target.value)}
                placeholder="#hex"
                style={{
                  flex: 1,
                  padding: '4px 8px',
                  backgroundColor: 'var(--nim-bg)',
                  color: 'var(--nim-text)',
                  border: '1px solid var(--nim-border)',
                  borderRadius: 4,
                  fontSize: 12,
                  fontFamily: 'monospace',
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') applyCustom();
                }}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  applyCustom();
                }}
                style={{
                  padding: '4px 10px',
                  backgroundColor: 'var(--nim-primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: 12,
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}

function Slider({ label, value, min, max, step, unit, onChange }: SliderProps) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
        <label style={{ fontSize: 13, color: 'var(--nim-text)' }}>{label}</label>
        <span style={{ fontSize: 12, color: 'var(--nim-text-muted)', fontFamily: 'monospace' }}>
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%' }}
      />
    </div>
  );
}

interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function Toggle({ label, description, checked, onChange }: ToggleProps) {
  return (
    <label style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
      padding: '8px 0',
      cursor: 'pointer',
    }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ marginTop: 2 }}
      />
      <div>
        <div style={{ fontSize: 13, color: 'var(--nim-text)' }}>{label}</div>
        {description && (
          <div style={{ fontSize: 12, color: 'var(--nim-text-muted)', marginTop: 2 }}>
            {description}
          </div>
        )}
      </div>
    </label>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h3 style={{
        fontSize: 14,
        fontWeight: 600,
        color: 'var(--nim-text)',
        marginTop: 0,
        marginBottom: 12,
        paddingBottom: 6,
        borderBottom: '1px solid var(--nim-border)',
      }}>
        {title}
      </h3>
      {children}
    </section>
  );
}

export function TokyoNightSettingsPanel({ storage }: SettingsPanelProps) {
  const [settings, setSettings] = useState<TokyoNightSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Load settings on mount AND apply all CSS variables. This serves as a
  // fallback when activate() couldn't resolve storage on app startup — the
  // settings panel becomes the storage owner and is responsible for
  // syncing CSS with stored values. Means: settings only take effect
  // after the user opens the panel once after restart, but they DO take
  // effect, which is better than the defaults-only alternative.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const loaded = await readAllSettings(storage);
        if (!cancelled) {
          setSettings(loaded);
        }
        // Apply CSS from storage so settings are visible immediately
        await applyAllSettings(storage);
      } catch (err) {
        console.error('[TokyoNight] Failed to load settings:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [storage]);

  // Dual-write helper: update local state, persist to storage, apply CSS
  const updateSetting = async <K extends keyof TokyoNightSettings>(
    key: K,
    value: TokyoNightSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    await storage.set(key, value as unknown);

    // Apply CSS side-effect based on the key
    if (key === 'editorLight') {
      setEditorLightActive(value as boolean);
    } else if (key === 'stormTone') {
      setStormToneActive(value as boolean);
    } else if (key === 'iconColors') {
      // Bulk re-apply all icon colors
      for (const [ext, color] of Object.entries(value as Record<string, string>)) {
        applyIconColor(ext, color);
      }
    } else {
      applySettingToCSS(key, value);
    }
  };

  /**
   * Icon color update for a group of extensions (e.g. ['md', 'markdown']
   * for the Markdown row). Writes the same color to every extension key
   * in the group so users don't have to pick the same color for related
   * file types.
   *
   * Applies CSS BEFORE awaiting storage so visual change is independent
   * of storage success.
   */
  const updateIconColors = async (extKeys: string[], color: string) => {
    const next = { ...settings.iconColors };
    for (const key of extKeys) {
      next[key] = color;
    }
    setSettings((prev) => ({ ...prev, iconColors: next }));
    for (const key of extKeys) {
      applyIconColor(key, color);
    }
    // eslint-disable-next-line no-console
    console.log(`[TokyoNight] Icon color set: [${extKeys.join(', ')}] → ${color}`);
    try {
      await storage.set('iconColors', next);
    } catch (err) {
      console.error('[TokyoNight] Failed to persist icon color:', err);
    }
  };

  const handleReset = async () => {
    if (!confirm('Reset all Tokyo Night settings to defaults?')) return;
    await resetAllSettings(storage);
    const reloaded = await readAllSettings(storage);
    setSettings(reloaded);
  };

  if (loading) {
    return (
      <div style={{ padding: 20, color: 'var(--nim-text-muted)' }}>Loading settings…</div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 720, color: 'var(--nim-text)' }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 0, marginBottom: 6 }}>Tokyo Night</h2>
      <p style={{ fontSize: 13, color: 'var(--nim-text-muted)', marginTop: 0, marginBottom: 24 }}>
        Configure the theme&apos;s appearance, markdown editor typography, and file
        icon colors. Changes apply immediately.
      </p>

      {/* Section 1: Appearance */}
      <Section title="Appearance">
        <Toggle
          label="Light editor for markdown files"
          description="Keep the UI chrome dark, but render the markdown editor pane with a light background."
          checked={settings.editorLight}
          onChange={(v) => updateSetting('editorLight', v)}
        />
        <Toggle
          label="Use Storm tone (lighter dark background)"
          description="Shift the chrome from canonical Tokyo Night to the Storm palette — a slightly lighter dark."
          checked={settings.stormTone}
          onChange={(v) => updateSetting('stormTone', v)}
        />
      </Section>

      {/* Section 2: Markdown editor */}
      <Section title="Markdown editor">
        <Slider
          label="Editor max-width"
          value={settings.maxWidth}
          min={400}
          max={1200}
          step={20}
          unit="px"
          onChange={(v) => updateSetting('maxWidth', v)}
        />
        <Slider
          label="Doc top padding"
          value={settings.topPadding}
          min={0}
          max={200}
          step={8}
          unit="px"
          onChange={(v) => updateSetting('topPadding', v)}
        />
        <WeightDropdown
          label="H1 weight"
          value={settings.h1Weight}
          onChange={(v) => updateSetting('h1Weight', v)}
        />
        <WeightDropdown
          label="H2 weight"
          value={settings.h2Weight}
          onChange={(v) => updateSetting('h2Weight', v)}
        />
        <WeightDropdown
          label="H3 weight"
          value={settings.h3Weight}
          onChange={(v) => updateSetting('h3Weight', v)}
        />
      </Section>

      {/* Section 3: File icon colors */}
      <Section title="File icon colors">
        <p style={{ fontSize: 12, color: 'var(--nim-text-muted)', marginTop: 0, marginBottom: 12 }}>
          Click a color swatch to change. Custom hex supported.
        </p>
        <div style={{
          maxHeight: 360,
          overflowY: 'auto',
          border: '1px solid var(--nim-border)',
          borderRadius: 6,
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <tbody>
              {ICON_ROWS.map((row, idx) => {
                const firstKey = row.keys[0];
                const currentColor =
                  settings.iconColors[firstKey] ||
                  DEFAULT_SETTINGS.iconColors[firstKey] ||
                  'var(--nim-text-muted)';
                return (
                  <tr
                    key={row.label}
                    style={{
                      borderTop: idx === 0 ? 'none' : '1px solid var(--nim-border)',
                    }}
                  >
                    <td style={{ padding: '6px 12px', fontSize: 12, color: 'var(--nim-text)', width: 240 }}>
                      {row.label}
                    </td>
                    <td style={{ padding: '6px 12px', color: currentColor, fontFamily: 'monospace', fontSize: 12 }}>
                      {row.sample}
                    </td>
                    <td style={{ padding: '6px 12px', textAlign: 'right', width: 60 }}>
                      <ColorPicker
                        value={currentColor}
                        onChange={(c) => updateIconColors(row.keys, c)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Footer: Reset */}
      <div style={{ borderTop: '1px solid var(--nim-border)', paddingTop: 16 }}>
        <button
          type="button"
          onClick={handleReset}
          style={{
            padding: '8px 14px',
            backgroundColor: 'var(--nim-bg-secondary)',
            color: 'var(--nim-text)',
            border: '1px solid var(--nim-border)',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          Reset all to defaults
        </button>
      </div>
    </div>
  );
}

interface WeightDropdownProps {
  label: string;
  value: FontWeight;
  onChange: (value: FontWeight) => void;
}

function WeightDropdown({ label, value, onChange }: WeightDropdownProps) {
  return (
    <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <label style={{ fontSize: 13, color: 'var(--nim-text)' }}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value) as FontWeight)}
        style={{
          padding: '4px 8px',
          backgroundColor: 'var(--nim-bg)',
          color: 'var(--nim-text)',
          border: '1px solid var(--nim-border)',
          borderRadius: 4,
          fontSize: 13,
          minWidth: 80,
        }}
      >
        {FONT_WEIGHT_OPTIONS.map((w) => (
          <option key={w} value={w}>
            {w}
          </option>
        ))}
      </select>
    </div>
  );
}
