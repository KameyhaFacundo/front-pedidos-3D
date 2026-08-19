# Graph Report - front-pedidos-3D  (2026-08-19)

## Corpus Check
- 47 files · ~115,084 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 278 nodes · 631 edges · 14 communities (11 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.6)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5ec5bc79`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ThemeContext.jsx
- registrarArVista
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
- ErrorBoundary

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
- `PlanoEditor()` --calls--> `getEmpresa()`  [EXTRACTED]
  src/components/PlanoEditor.jsx → src/api/client.js
- `CompanyProvider()` --calls--> `getEmpresa()`  [EXTRACTED]
  src/context/CompanyContext.jsx → src/api/client.js
- `CheckoutPage()` --calls--> `getMesas()`  [EXTRACTED]
  src/pages/CheckoutPage.jsx → src/api/client.js
- `MenuPage()` --calls--> `getMesas()`  [EXTRACTED]
  src/pages/MenuPage.jsx → src/api/client.js
- `ModeSelectPage()` --calls--> `getMesas()`  [EXTRACTED]
  src/pages/ModeSelectPage.jsx → src/api/client.js

## Import Cycles
- None detected.

## Communities (14 total, 3 thin omitted)

### Community 0 - "ThemeContext.jsx"
Cohesion: 0.29
Nodes (8): ThemeToggle(), AdminSidebar(), ITEMS, getScope(), getStoredThemes(), ThemeContext, ThemeProvider(), useTheme()

### Community 2 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, devDependencies, eslint, @eslint/js (+9 more)

### Community 3 - "client.js"
Cohesion: 0.13
Nodes (40): atenderLlamado(), cancelarPedido(), createCupon(), createStaff(), deleteCupon(), deleteStaff(), getCupones(), getEmpresa() (+32 more)

### Community 4 - "PedidoTrackingPage.jsx"
Cohesion: 0.14
Nodes (19): getPedido(), llamarMozo(), login(), registrarEmpresa(), RegistroModal(), AuthContext, AuthProvider(), useAuth() (+11 more)

### Community 5 - "App.jsx"
Cohesion: 0.08
Nodes (37): createPedido(), getMenu(), validarCupon(), App(), DemoModal(), Navbar(), ProtectedRoute(), Footer() (+29 more)

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
Cohesion: 0.18
Nodes (19): createPlato(), deletePlato(), updatePlato(), AdminMenuView(), AdminMetricasView(), AdminPedidosView(), FILTROS, PlatoModal() (+11 more)

## Knowledge Gaps
- **75 isolated node(s):** `EMPTY_CUPON`, `EMPTY_STAFF`, `FILTROS`, `ITEMS`, `ThemeContext` (+70 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ErrorBoundary` connect `ErrorBoundary` to `App.jsx`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `request()` connect `client.js` to `registrarArVista`, `PedidoTrackingPage.jsx`, `App.jsx`, `PlanoEditor.jsx`, `adminUtils.js`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `EMPTY_CUPON`, `EMPTY_STAFF`, `FILTROS` to the rest of the system?**
  _75 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `client.js` be split into smaller, more focused modules?**
  _Cohesion score 0.12588652482269502 - nodes in this community are weakly interconnected._
- **Should `PedidoTrackingPage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13768115942028986 - nodes in this community are weakly interconnected._