# Graph Report - front-pedidos-3D  (2026-08-19)

## Corpus Check
- 47 files · ~115,084 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 280 nodes · 637 edges · 15 communities (13 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.6)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8c5d19cd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ThemeContext.jsx
- useAuth
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
2. `AdminPage()` - 19 edges
3. `useCompany()` - 16 edges
4. `useCart()` - 14 edges
5. `PlanoEditor()` - 13 edges
6. `compilerOptions` - 12 edges
7. `AdminConfigView()` - 11 edges
8. `useNotify()` - 11 edges
9. `getMesas()` - 10 edges
10. `useSSE()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `AdminConfigView()` --indirect_call--> `soundEnabled()`  [INFERRED]
  src/components/admin/AdminConfigView.jsx → src/components/adminUtils.js
- `ProtectedRoute()` --calls--> `useAuth()`  [EXTRACTED]
  src/App.jsx → src/context/AuthContext.jsx
- `ThemeToggle()` --calls--> `useTheme()`  [EXTRACTED]
  src/App.jsx → src/context/ThemeContext.jsx
- `Navbar()` --calls--> `useCart()`  [EXTRACTED]
  src/App.jsx → src/context/CartContext.jsx
- `DemoModal()` --calls--> `useCart()`  [EXTRACTED]
  src/App.jsx → src/context/CartContext.jsx

## Import Cycles
- None detected.

## Communities (15 total, 2 thin omitted)

### Community 0 - "ThemeContext.jsx"
Cohesion: 0.29
Nodes (8): ThemeToggle(), AdminSidebar(), ITEMS, getScope(), getStoredThemes(), ThemeContext, ThemeProvider(), useTheme()

### Community 1 - "useAuth"
Cohesion: 0.33
Nodes (8): login(), registrarEmpresa(), RegistroModal(), AuthContext, AuthProvider(), useAuth(), getSlugFromPath(), LoginPage()

### Community 2 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, devDependencies, eslint, @eslint/js (+9 more)

### Community 3 - "client.js"
Cohesion: 0.14
Nodes (36): cancelarPedido(), createCupon(), createPlato(), createStaff(), deleteCupon(), deletePlato(), deleteStaff(), getCupones() (+28 more)

### Community 4 - "App.jsx"
Cohesion: 0.09
Nodes (34): atenderLlamado(), getLlamados(), getPedido(), llamarMozo(), getBase(), useSSE(), Navbar(), ProtectedRoute() (+26 more)

### Community 5 - "MenuPage.jsx"
Cohesion: 0.10
Nodes (26): createPedido(), getMenu(), registrarArVista(), validarCupon(), DemoModal(), ARViewer(), EMPTY, formatear() (+18 more)

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

- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `request()` connect `client.js` to `useAuth`, `App.jsx`, `MenuPage.jsx`, `PlanoEditor.jsx`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _75 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `client.js` be split into smaller, more focused modules?**
  _Cohesion score 0.13902439024390245 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `MenuPage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10084033613445378 - nodes in this community are weakly interconnected._