import { jsx as r, jsxs as d, Fragment as I } from "react/jsx-runtime";
import { useState as k, useEffect as j } from "react";
const y = {
  editorLight: !1,
  stormTone: !1,
  maxWidth: 800,
  topPadding: 80,
  h1Weight: 800,
  h2Weight: 700,
  h3Weight: 600,
  iconColors: {
    md: "#a4df2e",
    markdown: "#a4df2e",
    json: "#ae81ff",
    ts: "#7aa2f7",
    tsx: "#7aa2f7",
    js: "#e0af68",
    jsx: "#e0af68",
    mjs: "#e0af68",
    cjs: "#e0af68",
    py: "#bb9af7",
    java: "#ff9e64",
    go: "#ff9e64",
    rs: "#ff9e64",
    cpp: "#9ece6a",
    c: "#9ece6a",
    h: "#9ece6a",
    hpp: "#9ece6a",
    html: "#f7768e",
    htm: "#f7768e",
    css: "#7dcfff",
    scss: "#7dcfff",
    sass: "#7dcfff",
    less: "#7dcfff",
    xml: "#e0af68",
    svg: "#bb9af7",
    yaml: "#73daca",
    yml: "#73daca",
    toml: "#73daca",
    csv: "#9ece6a",
    // Special-file synthetic keys
    _readme: "#7aa2f7",
    _package: "#f7768e",
    _gitignore: "#787c99",
    _license: "#787c99"
  }
}, P = [
  "#7aa2f7",
  // blue (TypeScript brand)
  "#bb9af7",
  // purple
  "#7dcfff",
  // cyan (CSS brand)
  "#73daca",
  // teal
  "#9ece6a",
  // green
  "#a4df2e",
  // bright green (markdown default)
  "#e0af68",
  // yellow (JavaScript brand)
  "#ff9e64",
  // orange
  "#f7768e",
  // red/coral (HTML brand)
  "#ae81ff",
  // bright purple (JSON default)
  "#787c99",
  // muted gray
  "#a9b1d6"
  // light blue-gray
], D = [400, 500, 600, 700, 800, 900], _ = {
  "--nim-bg": "#24283b",
  "--nim-bg-secondary": "#1f2335",
  "--nim-bg-tertiary": "#1b1e2e",
  "--nim-bg-hover": "#2c324a",
  "--nim-bg-active": "#363c54",
  "--nim-text-muted": "#8089b3",
  "--nim-code-bg": "#1f2335",
  "--nim-code-gutter": "#1b1e2e",
  "--nim-scrollbar-track": "#1f2335",
  "--nim-table-header": "#1f2335",
  "--nim-table-cell": "#24283b",
  "--nim-table-stripe": "#1b1e2e",
  "--nim-toolbar-bg": "#1f2335",
  "--nim-toolbar-hover": "#2c324a",
  "--nim-toolbar-active": "#363c54",
  "--nim-terminal-bg": "#1f2335",
  "--nim-terminal-cursor-accent": "#24283b"
}, z = {
  "--nim-bg": "#1a1b26",
  "--nim-bg-secondary": "#16161e",
  "--nim-bg-tertiary": "#13131a",
  "--nim-bg-hover": "#202330",
  "--nim-bg-active": "#2a2e42",
  "--nim-text-muted": "#787c99",
  "--nim-code-bg": "#16161e",
  "--nim-code-gutter": "#13131a",
  "--nim-scrollbar-track": "#16161e",
  "--nim-table-header": "#16161e",
  "--nim-table-cell": "#1a1b26",
  "--nim-table-stripe": "#13131a",
  "--nim-toolbar-bg": "#16161e",
  "--nim-toolbar-hover": "#202330",
  "--nim-toolbar-active": "#2a2e42",
  "--nim-terminal-bg": "#16161e",
  "--nim-terminal-cursor-accent": "#1a1b26"
};
function F(t) {
  const e = t.toLowerCase();
  if (e === "readme.md" || e === "readme.markdown") return "_readme";
  if (e === "package.json") return "_package";
  if (e === ".gitignore" || e === ".gitattributes") return "_gitignore";
  if (e === "license" || e === "license.md" || e === "license.txt") return "_license";
  const o = e.lastIndexOf(".");
  if (o === -1 || o === 0) return null;
  const i = e.slice(o + 1);
  return i.length > 0 ? i : null;
}
const h = () => document.documentElement, S = "tn-storm-active", u = "data-tn-editor-light", C = "data-tn-light-editor-active";
function M(t) {
  switch (t) {
    case "maxWidth":
      return "--tokyo-night-max-width";
    case "topPadding":
      return "--tokyo-night-top-padding";
    case "h1Weight":
      return "--tokyo-night-h1-weight";
    case "h2Weight":
      return "--tokyo-night-h2-weight";
    case "h3Weight":
      return "--tokyo-night-h3-weight";
    default:
      return null;
  }
}
function H(t, e) {
  return t === "maxWidth" || t === "topPadding" ? `${e}px` : String(e);
}
function f(t, e) {
  const o = M(t);
  if (o === null) return;
  const i = H(t, e);
  h().style.setProperty(o, i), console.log(`[TokyoNight] CSS var set: ${o} = ${i}`);
}
function A(t, e) {
  h().style.setProperty(`--tokyo-night-icon-${t}`, e);
}
function L(t) {
  const e = document.querySelectorAll(".nimbalyst-editor");
  console.log(
    `[TokyoNight] setEditorLightActive(${t}) — found ${e.length} .nimbalyst-editor element(s)`
  ), e.forEach((o) => {
    t ? o.setAttribute(u, "") : o.removeAttribute(u);
  }), t ? h().setAttribute(C, "1") : h().removeAttribute(C), e.length === 0 && console.warn(
    "[TokyoNight] No .nimbalyst-editor elements found. Open a markdown file to verify the selector still matches your Nimbalyst version. Inspect a markdown editor in DevTools to confirm the outermost wrapper has class 'nimbalyst-editor'."
  );
}
function E() {
  return h().hasAttribute(C);
}
function O(t) {
  const e = h(), o = t ? _ : z;
  for (const [i, a] of Object.entries(o))
    e.style.setProperty(i, a);
  t ? e.classList.add(S) : e.classList.remove(S), console.log(`[TokyoNight] setStormToneActive(${t})`);
}
function $() {
  return h().classList.contains(S);
}
function B() {
  if ($())
    for (const [t, e] of Object.entries(_))
      h().style.setProperty(t, e);
}
async function R(t) {
  const e = await w(t);
  console.log("[TokyoNight] Applying all settings from storage:", e), f("maxWidth", e.maxWidth), f("topPadding", e.topPadding), f("h1Weight", e.h1Weight), f("h2Weight", e.h2Weight), f("h3Weight", e.h3Weight);
  for (const [o, i] of Object.entries(e.iconColors))
    A(o, i);
  L(e.editorLight), O(e.stormTone);
}
async function w(t) {
  const e = {
    ...y,
    iconColors: { ...y.iconColors }
  }, o = await t.get("editorLight");
  typeof o == "boolean" && (e.editorLight = o);
  const i = await t.get("stormTone");
  typeof i == "boolean" && (e.stormTone = i);
  const a = await t.get("maxWidth");
  typeof a == "number" && (e.maxWidth = a);
  const l = await t.get("topPadding");
  typeof l == "number" && (e.topPadding = l);
  const m = await t.get("h1Weight");
  typeof m == "number" && (e.h1Weight = m);
  const s = await t.get("h2Weight");
  typeof s == "number" && (e.h2Weight = s);
  const n = await t.get("h3Weight");
  typeof n == "number" && (e.h3Weight = n);
  const c = await t.get("iconColors");
  return c && typeof c == "object" && (e.iconColors = {
    ...e.iconColors,
    ...c
  }), e;
}
async function q(t) {
  const e = [
    "editorLight",
    "stormTone",
    "maxWidth",
    "topPadding",
    "h1Weight",
    "h2Weight",
    "h3Weight",
    "iconColors"
  ];
  for (const o of e)
    await t.set(o, y[o]);
  await R(t);
}
const x = "data-tn-file-ext";
function G(t) {
  const o = t.querySelector("[name]")?.getAttribute("name");
  if (o) return o;
  const i = t.textContent?.trim() ?? "";
  if (!i) return null;
  const a = i.split(/\s+/);
  return a[a.length - 1] || null;
}
function b(t) {
  const e = G(t);
  if (!e) {
    t.removeAttribute(x);
    return;
  }
  const o = F(e);
  o ? t.setAttribute(x, o) : t.removeAttribute(x);
}
function V() {
  document.querySelectorAll(".file-tree-file").forEach(b);
}
function K() {
  V(), console.log("[TokyoNight] File tree observer initialized");
  const t = new MutationObserver((e) => {
    for (const o of e) {
      for (const i of Array.from(o.addedNodes))
        i instanceof Element && (i.classList?.contains("file-tree-file") && b(i), i.querySelectorAll?.(".file-tree-file").forEach(b));
      if (o.type === "characterData" || o.type === "childList") {
        const i = o.target instanceof Element ? o.target : o.target.parentElement;
        if (!i) continue;
        const a = i.closest?.(".file-tree-file");
        a && b(a);
      }
    }
  });
  return t.observe(document.body, {
    childList: !0,
    subtree: !0,
    characterData: !0
  }), {
    dispose: () => t.disconnect()
  };
}
function U() {
  const t = document.documentElement, e = new MutationObserver((i) => {
    for (const a of i)
      a.type === "attributes" && a.attributeName === "data-theme" && (console.log("[TokyoNight] data-theme changed — re-applying Storm/light if active"), B(), E() && document.querySelectorAll(".nimbalyst-editor").forEach((l) => {
        l.setAttribute(u, "");
      }));
  });
  e.observe(t, {
    attributes: !0,
    attributeFilter: ["data-theme"]
  });
  const o = new MutationObserver((i) => {
    if (E())
      for (const a of i)
        for (const l of Array.from(a.addedNodes))
          l instanceof Element && (l.classList?.contains("nimbalyst-editor") && l.setAttribute(u, ""), l.querySelectorAll?.(".nimbalyst-editor").forEach((m) => {
            m.setAttribute(u, "");
          }));
  });
  return o.observe(document.body, {
    childList: !0,
    subtree: !0
  }), {
    dispose: () => {
      e.disconnect(), o.disconnect();
    }
  };
}
const Y = [
  { key: "md", label: ".md", sample: "README.md" },
  { key: "markdown", label: ".markdown", sample: "doc.markdown" },
  { key: "json", label: ".json", sample: "data.json" },
  { key: "ts", label: ".ts", sample: "index.ts" },
  { key: "tsx", label: ".tsx", sample: "App.tsx" },
  { key: "js", label: ".js", sample: "index.js" },
  { key: "jsx", label: ".jsx", sample: "App.jsx" },
  { key: "mjs", label: ".mjs", sample: "module.mjs" },
  { key: "cjs", label: ".cjs", sample: "common.cjs" },
  { key: "py", label: ".py", sample: "main.py" },
  { key: "java", label: ".java", sample: "Main.java" },
  { key: "go", label: ".go", sample: "main.go" },
  { key: "rs", label: ".rs", sample: "main.rs" },
  { key: "cpp", label: ".cpp", sample: "main.cpp" },
  { key: "c", label: ".c", sample: "main.c" },
  { key: "h", label: ".h", sample: "header.h" },
  { key: "hpp", label: ".hpp", sample: "header.hpp" },
  { key: "html", label: ".html", sample: "index.html" },
  { key: "htm", label: ".htm", sample: "page.htm" },
  { key: "css", label: ".css", sample: "styles.css" },
  { key: "scss", label: ".scss", sample: "styles.scss" },
  { key: "sass", label: ".sass", sample: "styles.sass" },
  { key: "less", label: ".less", sample: "styles.less" },
  { key: "xml", label: ".xml", sample: "config.xml" },
  { key: "svg", label: ".svg", sample: "icon.svg" },
  { key: "yaml", label: ".yaml", sample: "config.yaml" },
  { key: "yml", label: ".yml", sample: "config.yml" },
  { key: "toml", label: ".toml", sample: "config.toml" },
  { key: "csv", label: ".csv", sample: "data.csv" },
  { key: "_readme", label: "README.md", sample: "README.md" },
  { key: "_package", label: "package.json", sample: "package.json" },
  { key: "_gitignore", label: ".gitignore", sample: ".gitignore" },
  { key: "_license", label: "LICENSE", sample: "LICENSE" }
];
function X({ value: t, onChange: e }) {
  const [o, i] = k(!1), [a, l] = k(t);
  j(() => {
    l(t);
  }, [t]);
  const m = () => {
    const s = a.trim();
    /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(s) && (e(s), i(!1));
  };
  return /* @__PURE__ */ d("div", { style: { position: "relative", display: "inline-block" }, children: [
    /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        onClick: () => i(!o),
        style: {
          width: 28,
          height: 22,
          borderRadius: 4,
          border: "1px solid var(--nim-border)",
          backgroundColor: t,
          cursor: "pointer",
          padding: 0
        },
        "aria-label": `Color: ${t}`,
        title: t
      }
    ),
    o && /* @__PURE__ */ d(I, { children: [
      /* @__PURE__ */ r(
        "div",
        {
          onClick: (s) => {
            s.stopPropagation(), i(!1);
          },
          style: {
            position: "fixed",
            inset: 0,
            zIndex: 999998
          }
        }
      ),
      /* @__PURE__ */ d(
        "div",
        {
          onClick: (s) => s.stopPropagation(),
          style: {
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: 4,
            padding: 10,
            backgroundColor: "var(--nim-bg-secondary)",
            border: "1px solid var(--nim-border)",
            borderRadius: 6,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            zIndex: 999999,
            minWidth: 200
          },
          children: [
            /* @__PURE__ */ r("div", { style: { display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6 }, children: P.map((s) => /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                onClick: (n) => {
                  n.stopPropagation(), e(s), i(!1);
                },
                style: {
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  border: s === t ? "2px solid var(--nim-text)" : "1px solid var(--nim-border)",
                  backgroundColor: s,
                  cursor: "pointer",
                  padding: 0
                },
                title: s
              },
              s
            )) }),
            /* @__PURE__ */ d("div", { style: { marginTop: 10, display: "flex", gap: 6, alignItems: "center" }, children: [
              /* @__PURE__ */ r(
                "input",
                {
                  type: "text",
                  value: a,
                  onChange: (s) => l(s.target.value),
                  placeholder: "#hex",
                  style: {
                    flex: 1,
                    padding: "4px 8px",
                    backgroundColor: "var(--nim-bg)",
                    color: "var(--nim-text)",
                    border: "1px solid var(--nim-border)",
                    borderRadius: 4,
                    fontSize: 12,
                    fontFamily: "monospace"
                  },
                  onKeyDown: (s) => {
                    s.key === "Enter" && m();
                  }
                }
              ),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  onClick: (s) => {
                    s.stopPropagation(), m();
                  },
                  style: {
                    padding: "4px 10px",
                    backgroundColor: "var(--nim-primary)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: 12
                  },
                  children: "Apply"
                }
              )
            ] })
          ]
        }
      )
    ] })
  ] });
}
function W({ label: t, value: e, min: o, max: i, step: a, unit: l, onChange: m }) {
  return /* @__PURE__ */ d("div", { style: { marginBottom: 12 }, children: [
    /* @__PURE__ */ d("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }, children: [
      /* @__PURE__ */ r("label", { style: { fontSize: 13, color: "var(--nim-text)" }, children: t }),
      /* @__PURE__ */ d("span", { style: { fontSize: 12, color: "var(--nim-text-muted)", fontFamily: "monospace" }, children: [
        e,
        l
      ] })
    ] }),
    /* @__PURE__ */ r(
      "input",
      {
        type: "range",
        min: o,
        max: i,
        step: a,
        value: e,
        onChange: (s) => m(Number(s.target.value)),
        style: { width: "100%" }
      }
    )
  ] });
}
function N({ label: t, description: e, checked: o, onChange: i }) {
  return /* @__PURE__ */ d("label", { style: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    padding: "8px 0",
    cursor: "pointer"
  }, children: [
    /* @__PURE__ */ r(
      "input",
      {
        type: "checkbox",
        checked: o,
        onChange: (a) => i(a.target.checked),
        style: { marginTop: 2 }
      }
    ),
    /* @__PURE__ */ d("div", { children: [
      /* @__PURE__ */ r("div", { style: { fontSize: 13, color: "var(--nim-text)" }, children: t }),
      e && /* @__PURE__ */ r("div", { style: { fontSize: 12, color: "var(--nim-text-muted)", marginTop: 2 }, children: e })
    ] })
  ] });
}
function v({ title: t, children: e }) {
  return /* @__PURE__ */ d("section", { style: { marginBottom: 28 }, children: [
    /* @__PURE__ */ r("h3", { style: {
      fontSize: 14,
      fontWeight: 600,
      color: "var(--nim-text)",
      marginTop: 0,
      marginBottom: 12,
      paddingBottom: 6,
      borderBottom: "1px solid var(--nim-border)"
    }, children: t }),
    e
  ] });
}
function J({ storage: t }) {
  const [e, o] = k(y), [i, a] = k(!0);
  j(() => {
    let n = !1;
    return (async () => {
      try {
        const c = await w(t);
        n || o(c);
      } catch (c) {
        console.error("[TokyoNight] Failed to load settings:", c);
      } finally {
        n || a(!1);
      }
    })(), () => {
      n = !0;
    };
  }, [t]);
  const l = async (n, c) => {
    if (o((g) => ({ ...g, [n]: c })), await t.set(n, c), n === "editorLight")
      L(c);
    else if (n === "stormTone")
      O(c);
    else if (n === "iconColors")
      for (const [g, p] of Object.entries(c))
        A(g, p);
    else
      f(n, c);
  }, m = async (n, c) => {
    const g = { ...e.iconColors, [n]: c };
    o((p) => ({ ...p, iconColors: g })), A(n, c), console.log(`[TokyoNight] Icon color set: ${n} → ${c}`);
    try {
      await t.set("iconColors", g);
    } catch (p) {
      console.error("[TokyoNight] Failed to persist icon color:", p);
    }
  }, s = async () => {
    if (!confirm("Reset all Tokyo Night settings to defaults?")) return;
    await q(t);
    const n = await w(t);
    o(n);
  };
  return i ? /* @__PURE__ */ r("div", { style: { padding: 20, color: "var(--nim-text-muted)" }, children: "Loading settings…" }) : /* @__PURE__ */ d("div", { style: { padding: 20, maxWidth: 720, color: "var(--nim-text)" }, children: [
    /* @__PURE__ */ r("h2", { style: { fontSize: 18, fontWeight: 600, marginTop: 0, marginBottom: 6 }, children: "Tokyo Night" }),
    /* @__PURE__ */ r("p", { style: { fontSize: 13, color: "var(--nim-text-muted)", marginTop: 0, marginBottom: 24 }, children: "Configure the theme's appearance, markdown editor typography, and file icon colors. Changes apply immediately." }),
    /* @__PURE__ */ d(v, { title: "Appearance", children: [
      /* @__PURE__ */ r(
        N,
        {
          label: "Light editor for markdown files",
          description: "Keep the UI chrome dark, but render the markdown editor pane with a light background.",
          checked: e.editorLight,
          onChange: (n) => l("editorLight", n)
        }
      ),
      /* @__PURE__ */ r(
        N,
        {
          label: "Use Storm tone (lighter dark background)",
          description: "Shift the chrome from canonical Tokyo Night to the Storm palette — a slightly lighter dark.",
          checked: e.stormTone,
          onChange: (n) => l("stormTone", n)
        }
      )
    ] }),
    /* @__PURE__ */ d(v, { title: "Markdown editor", children: [
      /* @__PURE__ */ r(
        W,
        {
          label: "Editor max-width",
          value: e.maxWidth,
          min: 400,
          max: 1200,
          step: 20,
          unit: "px",
          onChange: (n) => l("maxWidth", n)
        }
      ),
      /* @__PURE__ */ r(
        W,
        {
          label: "Doc top padding",
          value: e.topPadding,
          min: 0,
          max: 200,
          step: 8,
          unit: "px",
          onChange: (n) => l("topPadding", n)
        }
      ),
      /* @__PURE__ */ r(
        T,
        {
          label: "H1 weight",
          value: e.h1Weight,
          onChange: (n) => l("h1Weight", n)
        }
      ),
      /* @__PURE__ */ r(
        T,
        {
          label: "H2 weight",
          value: e.h2Weight,
          onChange: (n) => l("h2Weight", n)
        }
      ),
      /* @__PURE__ */ r(
        T,
        {
          label: "H3 weight",
          value: e.h3Weight,
          onChange: (n) => l("h3Weight", n)
        }
      )
    ] }),
    /* @__PURE__ */ d(v, { title: "File icon colors", children: [
      /* @__PURE__ */ r("p", { style: { fontSize: 12, color: "var(--nim-text-muted)", marginTop: 0, marginBottom: 12 }, children: "Click a color swatch to change. Custom hex supported." }),
      /* @__PURE__ */ r("div", { style: {
        maxHeight: 360,
        overflowY: "auto",
        border: "1px solid var(--nim-border)",
        borderRadius: 6
      }, children: /* @__PURE__ */ r("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 13 }, children: /* @__PURE__ */ r("tbody", { children: Y.map((n, c) => {
        const g = e.iconColors[n.key] || y.iconColors[n.key] || "var(--nim-text-muted)";
        return /* @__PURE__ */ d("tr", { style: {
          borderTop: c === 0 ? "none" : "1px solid var(--nim-border)"
        }, children: [
          /* @__PURE__ */ r("td", { style: { padding: "6px 12px", fontFamily: "monospace", color: "var(--nim-text-muted)", width: 140 }, children: n.label }),
          /* @__PURE__ */ r("td", { style: { padding: "6px 12px", color: g, fontFamily: "monospace", fontSize: 12 }, children: n.sample }),
          /* @__PURE__ */ r("td", { style: { padding: "6px 12px", textAlign: "right", width: 60 }, children: /* @__PURE__ */ r(
            X,
            {
              value: g,
              onChange: (p) => m(n.key, p)
            }
          ) })
        ] }, n.key);
      }) }) }) })
    ] }),
    /* @__PURE__ */ r("div", { style: { borderTop: "1px solid var(--nim-border)", paddingTop: 16 }, children: /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        onClick: s,
        style: {
          padding: "8px 14px",
          backgroundColor: "var(--nim-bg-secondary)",
          color: "var(--nim-text)",
          border: "1px solid var(--nim-border)",
          borderRadius: 4,
          cursor: "pointer",
          fontSize: 13
        },
        children: "Reset all to defaults"
      }
    ) })
  ] });
}
function T({ label: t, value: e, onChange: o }) {
  return /* @__PURE__ */ d("div", { style: { marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
    /* @__PURE__ */ r("label", { style: { fontSize: 13, color: "var(--nim-text)" }, children: t }),
    /* @__PURE__ */ r(
      "select",
      {
        value: e,
        onChange: (i) => o(Number(i.target.value)),
        style: {
          padding: "4px 8px",
          backgroundColor: "var(--nim-bg)",
          color: "var(--nim-text)",
          border: "1px solid var(--nim-border)",
          borderRadius: 4,
          fontSize: 13,
          minWidth: 80
        },
        children: D.map((i) => /* @__PURE__ */ r("option", { value: i, children: i }, i))
      }
    )
  ] });
}
const oe = {
  TokyoNightSettingsPanel: J
};
async function ie(t) {
  console.log("[TokyoNight] Extension activated (v2.0.3)"), console.log("[TokyoNight] context:", t), console.log(
    "[TokyoNight] DOM check: .nimbalyst-editor count =",
    document.querySelectorAll(".nimbalyst-editor").length,
    "| .file-tree-file count =",
    document.querySelectorAll(".file-tree-file").length
  );
  const e = Q(t);
  if (e) {
    console.log("[TokyoNight] Storage resolved, applying initial settings");
    try {
      await R(e);
    } catch (a) {
      console.error("[TokyoNight] Failed to apply initial settings:", a);
    }
  } else
    console.warn(
      "[TokyoNight] No storage available — CSS defaults will apply, but user settings cannot be persisted or read on startup."
    );
  const o = K(), i = U();
  t.subscriptions && t.subscriptions.push(
    { dispose: () => o.dispose() },
    { dispose: () => i.dispose() }
  ), globalThis.__tokyoNightDisposers = [
    () => o.dispose(),
    () => i.dispose()
  ];
}
async function ne() {
  console.log("[TokyoNight] Extension deactivated");
  const t = globalThis.__tokyoNightDisposers;
  if (Array.isArray(t))
    for (const e of t)
      try {
        e();
      } catch (o) {
        console.error("[TokyoNight] Disposer error:", o);
      }
}
function Q(t) {
  if (t.storage) return t.storage;
  const e = t.services;
  if (e && typeof e == "object") {
    const o = e.storage;
    if (Z(o)) return o;
  }
  return null;
}
function Z(t) {
  return typeof t == "object" && t !== null && typeof t.get == "function" && typeof t.set == "function";
}
export {
  ie as activate,
  ne as deactivate,
  oe as settingsPanel
};
