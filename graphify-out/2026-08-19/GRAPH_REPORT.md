# Graph Report - front-pedidos-3D  (2026-08-19)

## Corpus Check
- 47 files · ~114,137 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 267 nodes · 582 edges · 14 communities (12 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.6)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8c5d19cd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ThemeContext.jsx
- useNotify
- devDependencies
- client.js
- CocinaPage.jsx
- App.jsx
- TypeScript Config
- PlanoEditor.jsx
- package.json
- LandingPage.jsx
- CLAUDE.md
- adminUtils.js
- Skeletons.jsx

## God Nodes (most connected - your core abstractions)
1. `request()` - 33 edges
2. `AdminPage()` - 18 edges
3. `useCompany()` - 16 edges
4. `useCart()` - 14 edges
5. `PlanoEditor()` - 12 edges
6. `compilerOptions` - 12 edges
7. `useNotify()` - 11 edges
8. `useSSE()` - 10 edges
9. `getMesas()` - 10 edges
10. `useAuth()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `AdminPage()` --calls--> `useSSE()`  [EXTRACTED]
  src/pages/AdminPage.jsx → src/api/useSSE.js
- `AdminPage()` --calls--> `playNewOrderSound()`  [EXTRACTED]
  src/pages/AdminPage.jsx → src/components/adminUtils.js
- `AdminPage()` --calls--> `soundEnabled()`  [EXTRACTED]
  src/pages/AdminPage.jsx → src/components/adminUtils.js
- `AdminPage()` --calls--> `useAuth()`  [EXTRACTED]
  src/pages/AdminPage.jsx → src/context/AuthContext.jsx
- `AdminPage()` --calls--> `useCompany()`  [EXTRACTED]
  src/pages/AdminPage.jsx → src/context/CompanyContext.jsx

## Import Cycles
- None detected.

## Communities (14 total, 2 thin omitted)

### Community 0 - "ThemeContext.jsx"
Cohesion: 0.29
Nodes (8): ThemeToggle(), AdminSidebar(), ITEMS, getScope(), getStoredThemes(), ThemeContext, ThemeProvider(), useTheme()

### Community 1 - "useNotify"
Cohesion: 0.19
Nodes (13): login(), registrarEmpresa(), ProtectedRoute(), RegistroModal(), AuthContext, AuthProvider(), useAuth(), NotificationContext (+5 more)

### Community 2 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, devDependencies, eslint, @eslint/js (+9 more)

### Community 3 - "client.js"
Cohesion: 0.17
Nodes (25): cancelarPedido(), createPlato(), deletePlato(), getEmpresa(), getEmpresaSlug(), getMe(), getMesas(), getMetricas() (+17 more)

### Community 4 - "CocinaPage.jsx"
Cohesion: 0.17
Nodes (16): atenderLlamado(), getLlamados(), getPedido(), llamarMozo(), getBase(), useSSE(), playNewOrderSound(), ESTADO_COLORS (+8 more)

### Community 5 - "App.jsx"
Cohesion: 0.08
Nodes (33): createPedido(), getMenu(), validarCupon(), App(), DemoModal(), Navbar(), ErrorBoundary, REDES (+25 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.11
Nodes (17): DOM, ES2023, src, vite/client, compilerOptions, allowArbitraryExtensions, allowJs, checkJs (+9 more)

### Community 7 - "PlanoEditor.jsx"
Cohesion: 0.16
Nodes (20): createMesa(), deleteMesa(), saveLayout(), toggleMesaActiva(), updateMesa(), ESTADO_DOT, ESTADO_LABELS, formatPrecio() (+12 more)

### Community 8 - "package.json"
Cohesion: 0.07
Nodes (28): @google/model-viewer, dependencies, @google/model-viewer, qrcode, react, react-dom, react-router-dom, serve (+20 more)

### Community 9 - "LandingPage.jsx"
Cohesion: 0.17
Nodes (15): AnimatedStat(), COMPARACION, FAQS, FEATURES, fmt(), LandingPage(), PALABRAS, PASOS (+7 more)

### Community 12 - "adminUtils.js"
Cohesion: 0.22
Nodes (16): AdminConfigView(), AdminMenuView(), AdminMetricasView(), AdminPedidosView(), FILTROS, calcularMetricas(), CATE_LABELS, categoriaIcon() (+8 more)

## Knowledge Gaps
- **73 isolated node(s):** `ITEMS`, `FILTROS`, `ESTADOS`, `ESTADO_COLORS`, `ESTADO_LABELS` (+68 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useCompany()` connect `App.jsx` to `useNotify`, `client.js`, `CocinaPage.jsx`, `PlanoEditor.jsx`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `ITEMS`, `FILTROS`, `ESTADOS` to the rest of the system?**
  _73 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07619738751814223 - nodes in this community are weakly interconnected._
- **Should `TypeScript Config` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._