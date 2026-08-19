# Graph Report - front-pedidos-3D  (2026-08-19)

## Corpus Check
- 48 files · ~115,647 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 282 nodes · 663 edges · 15 communities (13 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.6)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8b4b37ca`
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
- CompanyContext.jsx
- package.json
- LandingPage.jsx
- CLAUDE.md
- adminUtils.js
- ErrorBoundary

## God Nodes (most connected - your core abstractions)
1. `request()` - 42 edges
2. `useCompany()` - 20 edges
3. `AdminPage()` - 19 edges
4. `useCart()` - 14 edges
5. `PlanoEditor()` - 13 edges
6. `useAuth()` - 13 edges
7. `CocinaPage()` - 12 edges
8. `compilerOptions` - 12 edges
9. `useNotify()` - 11 edges
10. `getMesas()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `ProtectedRoute()` --calls--> `useAuth()`  [EXTRACTED]
  src/App.jsx → src/context/AuthContext.jsx
- `ThemeToggle()` --calls--> `useTheme()`  [EXTRACTED]
  src/App.jsx → src/context/ThemeContext.jsx
- `DemoModal()` --calls--> `useCart()`  [EXTRACTED]
  src/App.jsx → src/context/CartContext.jsx
- `CompanyProvider()` --calls--> `getEmpresa()`  [EXTRACTED]
  src/context/CompanyContext.jsx → src/api/client.js
- `AdminPage()` --calls--> `getEmpresa()`  [EXTRACTED]
  src/pages/AdminPage.jsx → src/api/client.js

## Import Cycles
- None detected.

## Communities (15 total, 2 thin omitted)

### Community 0 - "PedidoTrackingPage.jsx"
Cohesion: 0.14
Nodes (19): getPedido(), llamarMozo(), login(), registrarEmpresa(), RegistroModal(), AuthContext, AuthProvider(), useAuth() (+11 more)

### Community 1 - "ThemeContext.jsx"
Cohesion: 0.60
Nodes (4): getScope(), getStoredThemes(), ThemeContext, ThemeProvider()

### Community 2 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, devDependencies, eslint, @eslint/js (+9 more)

### Community 3 - "client.js"
Cohesion: 0.12
Nodes (36): createCupon(), createMesa(), createPlato(), createStaff(), deleteCupon(), deleteMesa(), deletePlato(), deleteStaff() (+28 more)

### Community 4 - "AdminPage.jsx"
Cohesion: 0.12
Nodes (28): atenderLlamado(), cancelarPedido(), getLlamados(), getMetricas(), getPedidos(), getPlatos(), logout(), reordenarPlatos() (+20 more)

### Community 5 - "App.jsx"
Cohesion: 0.09
Nodes (34): createPedido(), getMenu(), getMesas(), registrarArVista(), validarCupon(), App(), DemoModal(), Navbar() (+26 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.11
Nodes (17): DOM, ES2023, src, vite/client, compilerOptions, allowArbitraryExtensions, allowJs, checkJs (+9 more)

### Community 7 - "CompanyContext.jsx"
Cohesion: 0.19
Nodes (14): clamp(), fixStyle(), mesaSize(), mesaStyle(), nextNumero(), PLANO_ASPECT, PLANO_PADDING, TIPOS_FIJO (+6 more)

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

- **Why does `useCompany()` connect `App.jsx` to `PedidoTrackingPage.jsx`, `AdminPage.jsx`, `CompanyContext.jsx`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `ErrorBoundary` connect `ErrorBoundary` to `App.jsx`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _75 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `PedidoTrackingPage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13768115942028986 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `client.js` be split into smaller, more focused modules?**
  _Cohesion score 0.12073170731707317 - nodes in this community are weakly interconnected._