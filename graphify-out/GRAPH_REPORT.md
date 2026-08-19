# Graph Report - front-pedidos-3D  (2026-08-19)

## Corpus Check
- 47 files · ~113,703 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 265 nodes · 566 edges · 14 communities (13 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d507c0ce`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ThemeContext.jsx
- useNotify
- devDependencies
- client.js
- PedidoTrackingPage.jsx
- App.jsx
- TypeScript Config
- PlanoEditor.jsx
- package.json
- LandingPage.jsx
- CLAUDE.md
- adminUtils.js

## God Nodes (most connected - your core abstractions)
1. `request()` - 33 edges
2. `AdminPage()` - 17 edges
3. `useCompany()` - 16 edges
4. `useCart()` - 14 edges
5. `PlanoEditor()` - 12 edges
6. `compilerOptions` - 12 edges
7. `useNotify()` - 11 edges
8. `useSSE()` - 10 edges
9. `getMesas()` - 10 edges
10. `useAuth()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `PlatoModal()` --calls--> `useNotify()`  [EXTRACTED]
  src/components/admin/PlatoModal.jsx → src/context/NotificationContext.jsx
- `AdminPage()` --calls--> `useSSE()`  [EXTRACTED]
  src/pages/AdminPage.jsx → src/api/useSSE.js
- `AdminPage()` --calls--> `useAuth()`  [EXTRACTED]
  src/pages/AdminPage.jsx → src/context/AuthContext.jsx
- `AdminPage()` --calls--> `useCompany()`  [EXTRACTED]
  src/pages/AdminPage.jsx → src/context/CompanyContext.jsx
- `AdminPage()` --calls--> `useNotify()`  [EXTRACTED]
  src/pages/AdminPage.jsx → src/context/NotificationContext.jsx

## Import Cycles
- None detected.

## Communities (14 total, 1 thin omitted)

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
Cohesion: 0.12
Nodes (31): cancelarPedido(), createPlato(), deletePlato(), getEmpresa(), getEmpresaSlug(), getMe(), getMesas(), getMetricas() (+23 more)

### Community 4 - "PedidoTrackingPage.jsx"
Cohesion: 0.23
Nodes (12): atenderLlamado(), getLlamados(), getPedido(), llamarMozo(), getBase(), useSSE(), LlamadosPage(), ESTADO_COLORS (+4 more)

### Community 5 - "App.jsx"
Cohesion: 0.07
Nodes (35): createPedido(), getMenu(), validarCupon(), App(), DemoModal(), Navbar(), ErrorBoundary, REDES (+27 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.11
Nodes (17): DOM, ES2023, src, vite/client, compilerOptions, allowArbitraryExtensions, allowJs, checkJs (+9 more)

### Community 7 - "PlanoEditor.jsx"
Cohesion: 0.18
Nodes (20): createMesa(), deleteMesa(), saveLayout(), toggleMesaActiva(), updateMesa(), ESTADO_DOT, ESTADO_LABELS, formatPrecio() (+12 more)

### Community 8 - "package.json"
Cohesion: 0.07
Nodes (28): @google/model-viewer, dependencies, @google/model-viewer, qrcode, react, react-dom, react-router-dom, serve (+20 more)

### Community 9 - "LandingPage.jsx"
Cohesion: 0.17
Nodes (15): AnimatedStat(), COMPARACION, FAQS, FEATURES, fmt(), LandingPage(), PALABRAS, PASOS (+7 more)

### Community 12 - "adminUtils.js"
Cohesion: 0.30
Nodes (12): AdminMenuView(), AdminMetricasView(), AdminPedidosView(), calcularMetricas(), CATE_LABELS, categoriaIcon(), COLUMNAS, descargarCSV() (+4 more)

## Knowledge Gaps
- **72 isolated node(s):** `name`, `private`, `version`, `type`, `node` (+67 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useCompany()` connect `App.jsx` to `useNotify`, `client.js`, `PedidoTrackingPage.jsx`, `PlanoEditor.jsx`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _72 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `client.js` be split into smaller, more focused modules?**
  _Cohesion score 0.12307692307692308 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06892230576441102 - nodes in this community are weakly interconnected._
- **Should `TypeScript Config` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._