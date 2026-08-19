# Graph Report - front-pedidos-3D  (2026-08-19)

## Corpus Check
- 48 files · ~115,804 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 283 nodes · 658 edges · 15 communities (13 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.6)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `956f9334`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- PedidoTrackingPage.jsx
- ThemeContext.jsx
- devDependencies
- client.js
- AdminPage.jsx
- App.jsx
- TypeScript Config
- PlanoEditor.jsx
- package.json
- LandingPage.jsx
- CLAUDE.md
- adminUtils.js
- LoginPage.jsx
- Footer.jsx

## God Nodes (most connected - your core abstractions)
1. `request()` - 42 edges
2. `useCompany()` - 20 edges
3. `AdminPage()` - 18 edges
4. `useAuth()` - 15 edges
5. `useCart()` - 14 edges
6. `PlanoEditor()` - 13 edges
7. `compilerOptions` - 12 edges
8. `useNotify()` - 11 edges
9. `CocinaPage()` - 11 edges
10. `useSSE()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `AdminConfigView()` --indirect_call--> `soundEnabled()`  [INFERRED]
  src/components/admin/AdminConfigView.jsx → src/components/adminUtils.js
- `ProtectedRoute()` --calls--> `useAuth()`  [EXTRACTED]
  src/App.jsx → src/context/AuthContext.jsx
- `ThemeToggle()` --calls--> `useTheme()`  [EXTRACTED]
  src/App.jsx → src/context/ThemeContext.jsx
- `DemoModal()` --calls--> `useCart()`  [EXTRACTED]
  src/App.jsx → src/context/CartContext.jsx
- `AdminSidebar()` --calls--> `useTheme()`  [EXTRACTED]
  src/components/AdminSidebar.jsx → src/context/ThemeContext.jsx

## Import Cycles
- None detected.

## Communities (15 total, 2 thin omitted)

### Community 0 - "PedidoTrackingPage.jsx"
Cohesion: 0.21
Nodes (10): getPedido(), llamarMozo(), NotificationContext, NotificationProvider(), TYPE_ICONS, ESTADO_COLORS, ESTADO_INFO, ESTADOS (+2 more)

### Community 1 - "ThemeContext.jsx"
Cohesion: 0.38
Nodes (6): ThemeToggle(), getScope(), getStoredThemes(), ThemeContext, ThemeProvider(), useTheme()

### Community 2 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, devDependencies, eslint, @eslint/js (+9 more)

### Community 3 - "client.js"
Cohesion: 0.15
Nodes (27): createCupon(), createPlato(), createStaff(), deleteCupon(), deletePlato(), deleteStaff(), getCupones(), getEmpresaSlug() (+19 more)

### Community 4 - "AdminPage.jsx"
Cohesion: 0.14
Nodes (29): atenderLlamado(), cancelarPedido(), getLlamados(), getMetricas(), getPedidos(), getPlatos(), logout(), reordenarPlatos() (+21 more)

### Community 5 - "App.jsx"
Cohesion: 0.07
Nodes (39): createPedido(), getEmpresa(), getMenu(), getMesas(), validarCupon(), App(), defaultRouteForRole(), DemoModal() (+31 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.11
Nodes (17): DOM, ES2023, src, vite/client, compilerOptions, allowArbitraryExtensions, allowJs, checkJs (+9 more)

### Community 7 - "PlanoEditor.jsx"
Cohesion: 0.18
Nodes (19): createMesa(), deleteMesa(), saveLayout(), toggleMesaActiva(), updateMesa(), AdminMesasView(), ESTADO_DOT, ESTADO_LABELS (+11 more)

### Community 8 - "package.json"
Cohesion: 0.07
Nodes (28): @google/model-viewer, dependencies, @google/model-viewer, qrcode, react, react-dom, react-router-dom, serve (+20 more)

### Community 9 - "LandingPage.jsx"
Cohesion: 0.15
Nodes (17): registrarEmpresa(), RegistroModal(), AnimatedStat(), COMPARACION, FAQS, FEATURES, fmt(), LandingPage() (+9 more)

### Community 12 - "adminUtils.js"
Cohesion: 0.27
Nodes (13): AdminMenuView(), AdminMetricasView(), AdminPedidosView(), FILTROS, calcularMetricas(), CATE_LABELS, categoriaIcon(), COLUMNAS (+5 more)

### Community 13 - "LoginPage.jsx"
Cohesion: 0.70
Nodes (4): login(), defaultRouteForRole(), getSlugFromPath(), LoginPage()

## Knowledge Gaps
- **76 isolated node(s):** `ITEMS`, `EMPTY_STAFF`, `ROL_LABELS`, `AuthContext`, `NotificationContext` (+71 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useCompany()` connect `App.jsx` to `PedidoTrackingPage.jsx`, `AdminPage.jsx`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `ITEMS`, `EMPTY_STAFF`, `ROL_LABELS` to the rest of the system?**
  _76 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `client.js` be split into smaller, more focused modules?**
  _Cohesion score 0.14516129032258066 - nodes in this community are weakly interconnected._
- **Should `AdminPage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13655761024182078 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07305669199298656 - nodes in this community are weakly interconnected._