# Graph Report - front-pedidos-3D  (2026-08-19)

## Corpus Check
- 49 files · ~115,947 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 285 nodes · 661 edges · 12 communities (11 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.6)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1ea4c33e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- PedidoTrackingPage.jsx
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
- `LocalSettingsModal()` --indirect_call--> `soundEnabled()`  [INFERRED]
  src/components/admin/LocalSettingsModal.jsx → src/components/adminUtils.js
- `PedidoTrackingPage()` --calls--> `useSSE()`  [EXTRACTED]
  src/pages/PedidoTrackingPage.jsx → src/api/useSSE.js
- `PedidoTrackingPage()` --calls--> `useCompany()`  [EXTRACTED]
  src/pages/PedidoTrackingPage.jsx → src/context/CompanyContext.jsx
- `ThemeToggle()` --calls--> `useTheme()`  [EXTRACTED]
  src/App.jsx → src/context/ThemeContext.jsx
- `LlamadosPage()` --calls--> `logout()`  [EXTRACTED]
  src/pages/LlamadosPage.jsx → src/api/client.js

## Import Cycles
- None detected.

## Communities (12 total, 1 thin omitted)

### Community 0 - "PedidoTrackingPage.jsx"
Cohesion: 0.15
Nodes (17): createPlato(), deletePlato(), getPedido(), llamarMozo(), updatePlato(), PlatoModal(), CATEGORIAS, EMPTY_PLATO (+9 more)

### Community 2 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, devDependencies, eslint, @eslint/js (+9 more)

### Community 3 - "client.js"
Cohesion: 0.16
Nodes (32): cancelarPedido(), createCupon(), createStaff(), deleteCupon(), deleteStaff(), getCupones(), getEmpresa(), getEmpresaSlug() (+24 more)

### Community 4 - "CocinaPage.jsx"
Cohesion: 0.11
Nodes (26): atenderLlamado(), getLlamados(), login(), registrarEmpresa(), getBase(), useSSE(), ThemeToggle(), AdminSidebar() (+18 more)

### Community 5 - "App.jsx"
Cohesion: 0.06
Nodes (39): createPedido(), getMenu(), registrarArVista(), validarCupon(), App(), defaultRouteForRole(), DemoModal(), Navbar() (+31 more)

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
Cohesion: 0.22
Nodes (16): AdminMenuView(), AdminMetricasView(), AdminPedidosView(), FILTROS, LocalSettingsModal(), calcularMetricas(), CATE_LABELS, categoriaIcon() (+8 more)

## Knowledge Gaps
- **76 isolated node(s):** `EMPTY_CUPON`, `EMPTY_STAFF`, `ROL_LABELS`, `NotificationContext`, `TYPE_ICONS` (+71 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useCompany()` connect `App.jsx` to `PedidoTrackingPage.jsx`, `client.js`, `CocinaPage.jsx`, `PlanoEditor.jsx`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `EMPTY_CUPON`, `EMPTY_STAFF`, `ROL_LABELS` to the rest of the system?**
  _76 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `CocinaPage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1140819964349376 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06240084611316764 - nodes in this community are weakly interconnected._
- **Should `TypeScript Config` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._