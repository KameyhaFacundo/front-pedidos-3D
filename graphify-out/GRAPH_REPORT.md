# Graph Report - front-pedidos-3D  (2026-08-19)

## Corpus Check
- 47 files · ~115,468 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 280 nodes · 657 edges · 14 communities (12 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.6)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a734cc42`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CompanyContext.jsx
- devDependencies
- client.js
- App.jsx
- MenuPage.jsx
- TypeScript Config
- PlanoEditor.jsx
- package.json
- LandingPage.jsx
- CLAUDE.md
- adminUtils.js
- main.jsx

## God Nodes (most connected - your core abstractions)
1. `request()` - 42 edges
2. `useCompany()` - 20 edges
3. `AdminPage()` - 19 edges
4. `useCart()` - 14 edges
5. `PlanoEditor()` - 13 edges
6. `useAuth()` - 13 edges
7. `CocinaPage()` - 12 edges
8. `compilerOptions` - 12 edges
9. `AdminConfigView()` - 11 edges
10. `useNotify()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `AdminConfigView()` --indirect_call--> `soundEnabled()`  [INFERRED]
  src/components/admin/AdminConfigView.jsx → src/components/adminUtils.js
- `ThemeToggle()` --calls--> `useTheme()`  [EXTRACTED]
  src/App.jsx → src/context/ThemeContext.jsx
- `Navbar()` --calls--> `useCart()`  [EXTRACTED]
  src/App.jsx → src/context/CartContext.jsx
- `DemoModal()` --calls--> `useCart()`  [EXTRACTED]
  src/App.jsx → src/context/CartContext.jsx
- `AdminPage()` --calls--> `logout()`  [EXTRACTED]
  src/pages/AdminPage.jsx → src/api/client.js

## Import Cycles
- None detected.

## Communities (14 total, 2 thin omitted)

### Community 0 - "CompanyContext.jsx"
Cohesion: 0.47
Nodes (5): getEmpresa(), CompanyContext, CompanyProvider(), getSlugFromPath(), RESERVED

### Community 2 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, devDependencies, eslint, @eslint/js (+9 more)

### Community 3 - "client.js"
Cohesion: 0.14
Nodes (35): cancelarPedido(), createCupon(), createPlato(), createStaff(), deleteCupon(), deletePlato(), deleteStaff(), getCupones() (+27 more)

### Community 4 - "App.jsx"
Cohesion: 0.08
Nodes (43): atenderLlamado(), getLlamados(), login(), logout(), registrarEmpresa(), getBase(), useSSE(), Navbar() (+35 more)

### Community 5 - "MenuPage.jsx"
Cohesion: 0.09
Nodes (29): createPedido(), getMenu(), getMesas(), registrarArVista(), validarCupon(), DemoModal(), ARViewer(), EMPTY (+21 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.11
Nodes (17): DOM, ES2023, src, vite/client, compilerOptions, allowArbitraryExtensions, allowJs, checkJs (+9 more)

### Community 7 - "PlanoEditor.jsx"
Cohesion: 0.16
Nodes (21): createMesa(), deleteMesa(), saveLayout(), toggleMesaActiva(), updateMesa(), AdminMesasView(), ESTADO_DOT, ESTADO_LABELS (+13 more)

### Community 8 - "package.json"
Cohesion: 0.07
Nodes (28): @google/model-viewer, dependencies, @google/model-viewer, qrcode, react, react-dom, react-router-dom, serve (+20 more)

### Community 9 - "LandingPage.jsx"
Cohesion: 0.17
Nodes (15): AnimatedStat(), COMPARACION, FAQS, FEATURES, fmt(), LandingPage(), PALABRAS, PASOS (+7 more)

### Community 12 - "adminUtils.js"
Cohesion: 0.27
Nodes (13): AdminMenuView(), AdminMetricasView(), AdminPedidosView(), FILTROS, calcularMetricas(), CATE_LABELS, categoriaIcon(), COLUMNAS (+5 more)

## Knowledge Gaps
- **75 isolated node(s):** `name`, `private`, `version`, `type`, `node` (+70 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useCompany()` connect `App.jsx` to `CompanyContext.jsx`, `client.js`, `MenuPage.jsx`, `PlanoEditor.jsx`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _75 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `client.js` be split into smaller, more focused modules?**
  _Cohesion score 0.1358974358974359 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07924984875983061 - nodes in this community are weakly interconnected._
- **Should `MenuPage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09446693657219973 - nodes in this community are weakly interconnected._