import { jsx as r, jsxs as d, Fragment as N } from "react/jsx-runtime";
import { useState as b, useEffect as j } from "react";
const u = {
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
}, O = [
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
], R = [400, 500, 600, 700, 800, 900], k = {
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
};
function I(t) {
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
const f = () => document.documentElement, C = "tn-storm-active", P = "tn-editor-light";
function z(t) {
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
function F(t, e) {
  return t === "maxWidth" || t === "topPadding" ? `${e}px` : String(e);
}
function h(t, e) {
  const o = z(t);
  o !== null && f().style.setProperty(o, F(t, e));
}
function S(t, e) {
  f().style.setProperty(`--tokyo-night-icon-${t}`, e);
}
function W(t) {
  document.querySelectorAll(".nimbalyst-editor").forEach((e) => {
    e.classList.toggle(P, t);
  }), t ? f().setAttribute("data-tn-editor-light", "1") : f().removeAttribute("data-tn-editor-light");
}
function A(t) {
  const e = f();
  if (t) {
    for (const [o, i] of Object.entries(k))
      e.style.setProperty(o, i);
    e.classList.add(C);
  } else {
    for (const o of Object.keys(k))
      e.style.removeProperty(o);
    e.classList.remove(C);
  }
}
function D() {
  return f().classList.contains(C);
}
function M() {
  if (D())
    for (const [t, e] of Object.entries(k))
      f().style.setProperty(t, e);
}
async function L(t) {
  const e = await T(t);
  h("maxWidth", e.maxWidth), h("topPadding", e.topPadding), h("h1Weight", e.h1Weight), h("h2Weight", e.h2Weight), h("h3Weight", e.h3Weight);
  for (const [o, i] of Object.entries(e.iconColors))
    S(o, i);
  W(e.editorLight), A(e.stormTone);
}
async function T(t) {
  const e = { ...u, iconColors: { ...u.iconColors } }, o = await t.get("editorLight");
  typeof o == "boolean" && (e.editorLight = o);
  const i = await t.get("stormTone");
  typeof i == "boolean" && (e.stormTone = i);
  const a = await t.get("maxWidth");
  typeof a == "number" && (e.maxWidth = a);
  const s = await t.get("topPadding");
  typeof s == "number" && (e.topPadding = s);
  const m = await t.get("h1Weight");
  typeof m == "number" && (e.h1Weight = m);
  const l = await t.get("h2Weight");
  typeof l == "number" && (e.h2Weight = l);
  const n = await t.get("h3Weight");
  typeof n == "number" && (e.h3Weight = n);
  const c = await t.get("iconColors");
  return c && typeof c == "object" && (e.iconColors = { ...e.iconColors, ...c }), e;
}
async function B(t) {
  const e = ["editorLight", "stormTone", "maxWidth", "topPadding", "h1Weight", "h2Weight", "h3Weight", "iconColors"];
  for (const o of e)
    await t.set(o, u[o]);
  await L(t);
}
const _ = "file-ext-";
function H(t) {
  const o = t.querySelector("[name]")?.getAttribute("name");
  if (o) return o;
  const i = t.textContent?.trim() ?? "";
  if (!i) return null;
  const a = i.split(/\s+/);
  return a[a.length - 1] || null;
}
function $(t) {
  const e = [];
  t.classList.forEach((o) => {
    o.startsWith(_) && e.push(o);
  }), e.forEach((o) => t.classList.remove(o));
}
function y(t) {
  const e = H(t);
  if ($(t), !e) return;
  const o = I(e);
  o && t.classList.add(`${_}${o}`);
}
function q() {
  document.querySelectorAll(".file-tree-file").forEach(y);
}
function G() {
  q();
  const t = new MutationObserver((e) => {
    for (const o of e) {
      for (const i of Array.from(o.addedNodes))
        i instanceof Element && (i.classList?.contains("file-tree-file") && y(i), i.querySelectorAll?.(".file-tree-file").forEach(y));
      if (o.type === "characterData" || o.type === "childList") {
        const i = o.target instanceof Element ? o.target : o.target.parentElement;
        if (!i) continue;
        const a = i.closest?.(".file-tree-file");
        a && y(a);
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
function K() {
  const t = document.documentElement, e = new MutationObserver((i) => {
    for (const a of i)
      a.type === "attributes" && a.attributeName === "data-theme" && (M(), t.hasAttribute("data-tn-editor-light") && W(!0));
  });
  e.observe(t, {
    attributes: !0,
    attributeFilter: ["data-theme"]
  });
  const o = new MutationObserver((i) => {
    if (t.hasAttribute("data-tn-editor-light"))
      for (const a of i)
        for (const s of Array.from(a.addedNodes))
          s instanceof Element && (s.classList?.contains("nimbalyst-editor") && s.classList.add("tn-editor-light"), s.querySelectorAll?.(".nimbalyst-editor").forEach((m) => {
            m.classList.add("tn-editor-light");
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
const U = [
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
function V({ value: t, onChange: e }) {
  const [o, i] = b(!1), [a, s] = b(t);
  j(() => {
    s(t);
  }, [t]);
  const m = () => {
    const l = a.trim();
    /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(l) && (e(l), i(!1));
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
    o && /* @__PURE__ */ d(N, { children: [
      /* @__PURE__ */ r(
        "div",
        {
          onClick: () => i(!1),
          style: {
            position: "fixed",
            inset: 0,
            zIndex: 1
          }
        }
      ),
      /* @__PURE__ */ d(
        "div",
        {
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
            zIndex: 2,
            minWidth: 200
          },
          children: [
            /* @__PURE__ */ r("div", { style: { display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6 }, children: O.map((l) => /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                onClick: () => {
                  e(l), i(!1);
                },
                style: {
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  border: l === t ? "2px solid var(--nim-text)" : "1px solid var(--nim-border)",
                  backgroundColor: l,
                  cursor: "pointer",
                  padding: 0
                },
                title: l
              },
              l
            )) }),
            /* @__PURE__ */ d("div", { style: { marginTop: 10, display: "flex", gap: 6, alignItems: "center" }, children: [
              /* @__PURE__ */ r(
                "input",
                {
                  type: "text",
                  value: a,
                  onChange: (l) => s(l.target.value),
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
                  onKeyDown: (l) => {
                    l.key === "Enter" && m();
                  }
                }
              ),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  onClick: m,
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
function w({ label: t, value: e, min: o, max: i, step: a, unit: s, onChange: m }) {
  return /* @__PURE__ */ d("div", { style: { marginBottom: 12 }, children: [
    /* @__PURE__ */ d("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }, children: [
      /* @__PURE__ */ r("label", { style: { fontSize: 13, color: "var(--nim-text)" }, children: t }),
      /* @__PURE__ */ d("span", { style: { fontSize: 12, color: "var(--nim-text-muted)", fontFamily: "monospace" }, children: [
        e,
        s
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
        onChange: (l) => m(Number(l.target.value)),
        style: { width: "100%" }
      }
    )
  ] });
}
function E({ label: t, description: e, checked: o, onChange: i }) {
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
function x({ title: t, children: e }) {
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
function X({ storage: t }) {
  const [e, o] = b(u), [i, a] = b(!0);
  j(() => {
    let n = !1;
    return (async () => {
      try {
        const c = await T(t);
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
  const s = async (n, c) => {
    if (o((p) => ({ ...p, [n]: c })), await t.set(n, c), n === "editorLight")
      W(c);
    else if (n === "stormTone")
      A(c);
    else if (n === "iconColors")
      for (const [p, g] of Object.entries(c))
        S(p, g);
    else
      h(n, c);
  }, m = async (n, c) => {
    const p = { ...e.iconColors, [n]: c };
    o((g) => ({ ...g, iconColors: p })), await t.set("iconColors", p), S(n, c);
  }, l = async () => {
    if (!confirm("Reset all Tokyo Night settings to defaults?")) return;
    await B(t);
    const n = await T(t);
    o(n);
  };
  return i ? /* @__PURE__ */ r("div", { style: { padding: 20, color: "var(--nim-text-muted)" }, children: "Loading settings…" }) : /* @__PURE__ */ d("div", { style: { padding: 20, maxWidth: 720, color: "var(--nim-text)" }, children: [
    /* @__PURE__ */ r("h2", { style: { fontSize: 18, fontWeight: 600, marginTop: 0, marginBottom: 6 }, children: "Tokyo Night" }),
    /* @__PURE__ */ r("p", { style: { fontSize: 13, color: "var(--nim-text-muted)", marginTop: 0, marginBottom: 24 }, children: "Configure the theme's appearance, markdown editor typography, and file icon colors. Changes apply immediately." }),
    /* @__PURE__ */ d(x, { title: "Appearance", children: [
      /* @__PURE__ */ r(
        E,
        {
          label: "Light editor for markdown files",
          description: "Keep the UI chrome dark, but render the markdown editor pane with a light background.",
          checked: e.editorLight,
          onChange: (n) => s("editorLight", n)
        }
      ),
      /* @__PURE__ */ r(
        E,
        {
          label: "Use Storm tone (lighter dark background)",
          description: "Shift the chrome from canonical Tokyo Night to the Storm palette — a slightly lighter dark.",
          checked: e.stormTone,
          onChange: (n) => s("stormTone", n)
        }
      )
    ] }),
    /* @__PURE__ */ d(x, { title: "Markdown editor", children: [
      /* @__PURE__ */ r(
        w,
        {
          label: "Editor max-width",
          value: e.maxWidth,
          min: 400,
          max: 1200,
          step: 20,
          unit: "px",
          onChange: (n) => s("maxWidth", n)
        }
      ),
      /* @__PURE__ */ r(
        w,
        {
          label: "Doc top padding",
          value: e.topPadding,
          min: 0,
          max: 200,
          step: 8,
          unit: "px",
          onChange: (n) => s("topPadding", n)
        }
      ),
      /* @__PURE__ */ r(
        v,
        {
          label: "H1 weight",
          value: e.h1Weight,
          onChange: (n) => s("h1Weight", n)
        }
      ),
      /* @__PURE__ */ r(
        v,
        {
          label: "H2 weight",
          value: e.h2Weight,
          onChange: (n) => s("h2Weight", n)
        }
      ),
      /* @__PURE__ */ r(
        v,
        {
          label: "H3 weight",
          value: e.h3Weight,
          onChange: (n) => s("h3Weight", n)
        }
      )
    ] }),
    /* @__PURE__ */ d(x, { title: "File icon colors", children: [
      /* @__PURE__ */ r("p", { style: { fontSize: 12, color: "var(--nim-text-muted)", marginTop: 0, marginBottom: 12 }, children: "Click a color swatch to change. Custom hex supported." }),
      /* @__PURE__ */ r("div", { style: {
        maxHeight: 360,
        overflowY: "auto",
        border: "1px solid var(--nim-border)",
        borderRadius: 6
      }, children: /* @__PURE__ */ r("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 13 }, children: /* @__PURE__ */ r("tbody", { children: U.map((n, c) => {
        const p = e.iconColors[n.key] || u.iconColors[n.key] || "var(--nim-text-muted)";
        return /* @__PURE__ */ d("tr", { style: {
          borderTop: c === 0 ? "none" : "1px solid var(--nim-border)"
        }, children: [
          /* @__PURE__ */ r("td", { style: { padding: "6px 12px", fontFamily: "monospace", color: "var(--nim-text-muted)", width: 140 }, children: n.label }),
          /* @__PURE__ */ r("td", { style: { padding: "6px 12px", color: p, fontFamily: "monospace", fontSize: 12 }, children: n.sample }),
          /* @__PURE__ */ r("td", { style: { padding: "6px 12px", textAlign: "right", width: 60 }, children: /* @__PURE__ */ r(
            V,
            {
              value: p,
              onChange: (g) => m(n.key, g)
            }
          ) })
        ] }, n.key);
      }) }) }) })
    ] }),
    /* @__PURE__ */ r("div", { style: { borderTop: "1px solid var(--nim-border)", paddingTop: 16 }, children: /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        onClick: l,
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
function v({ label: t, value: e, onChange: o }) {
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
        children: R.map((i) => /* @__PURE__ */ r("option", { value: i, children: i }, i))
      }
    )
  ] });
}
const ee = {
  TokyoNightSettingsPanel: X
};
async function te(t) {
  console.log("[TokyoNight] Extension activated");
  const e = Y(t);
  if (e)
    try {
      await L(e);
    } catch (a) {
      console.error("[TokyoNight] Failed to apply initial settings:", a);
    }
  else
    console.warn(
      "[TokyoNight] No storage available — CSS defaults will apply, but user settings cannot be persisted or read on startup."
    );
  const o = G(), i = K();
  t.subscriptions && t.subscriptions.push(
    { dispose: () => o.dispose() },
    { dispose: () => i.dispose() }
  ), globalThis.__tokyoNightDisposers = [
    () => o.dispose(),
    () => i.dispose()
  ];
}
async function oe() {
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
function Y(t) {
  if (t.storage) return t.storage;
  const e = t.services;
  if (e && typeof e == "object") {
    const o = e.storage;
    if (J(o)) return o;
  }
  return null;
}
function J(t) {
  return typeof t == "object" && t !== null && typeof t.get == "function" && typeof t.set == "function";
}
export {
  te as activate,
  oe as deactivate,
  ee as settingsPanel
};
