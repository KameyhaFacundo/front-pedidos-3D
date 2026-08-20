# Graph Report - front-pedidos-3D  (2026-08-19)

## Corpus Check
- 50 files · ~117,359 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 304 nodes · 707 edges · 14 communities (13 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bf182292`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CompanyContext.jsx
- mock.js
- devDependencies
- client.js
- AdminPage.jsx
- App.jsx
- TypeScript Config
- MenuPage.jsx
- package.json
- LandingPage.jsx
- CLAUDE.md
- adminUtils.js
- LoginPage.jsx

## God Nodes (most connected - your core abstractions)
1. `request()` - 44 edges
2. `useCompany()` - 20 edges
3. `AdminPage()` - 19 edges
4. `useAuth()` - 15 edges
5. `useCart()` - 14 edges
6. `PlanoEditor()` - 13 edges
7. `CocinaPage()` - 12 edges
8. `compilerOptions` - 12 edges
9. `useNotify()` - 11 edges
10. `useSSE()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `LocalSettingsModal()` --indirect_call--> `soundEnabled()`  [INFERRED]
  src/components/admin/LocalSettingsModal.jsx → src/components/adminUtils.js
- `ModeSelectPage()` --calls--> `getPedido()`  [EXTRACTED]
  src/pages/ModeSelectPage.jsx → src/api/client.js
- `RegistroModal()` --calls--> `login()`  [EXTRACTED]
  src/components/RegistroModal.jsx → src/api/client.js
- `PlatoModal()` --calls--> `useNotify()`  [EXTRACTED]
  src/components/admin/PlatoModal.jsx → src/context/NotificationContext.jsx
- `PedidoTrackingPage()` --calls--> `useNotify()`  [EXTRACTED]
  src/pages/PedidoTrackingPage.jsx → src/context/NotificationContext.jsx

## Import Cycles
- None detected.

## Communities (14 total, 1 thin omitted)

### Community 0 - "CompanyContext.jsx"
Cohesion: 0.20
Nodes (12): getPedido(), llamarMozo(), CompanyContext, CompanyProvider(), getSlugFromPath(), RESERVED, ESTADO_COLORS, ESTADO_INFO (+4 more)

### Community 1 - "mock.js"
Cohesion: 0.26
Nodes (10): crearPedido(), DEMO_EMPRESA, DEMO_MESAS, DEMO_PLATOS, estadoSegunElapsed(), guardarDemoPedido(), handleMock(), leerDemoPedido() (+2 more)

### Community 2 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, devDependencies, eslint, @eslint/js (+9 more)

### Community 3 - "client.js"
Cohesion: 0.10
Nodes (40): atenderLlamado(), createCupon(), createMesa(), createStaff(), deleteCupon(), deleteMesa(), deleteStaff(), getCupones() (+32 more)

### Community 4 - "AdminPage.jsx"
Cohesion: 0.16
Nodes (26): cancelarPedido(), getPedidos(), logout(), registrarEmpresa(), updatePedidoEstado(), getBase(), useSSE(), AdminSidebar() (+18 more)

### Community 5 - "App.jsx"
Cohesion: 0.08
Nodes (31): App(), defaultRouteForRole(), DemoModal(), Navbar(), ProtectedRoute(), ThemeToggle(), ErrorBoundary, Footer() (+23 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.11
Nodes (17): DOM, ES2023, src, vite/client, compilerOptions, allowArbitraryExtensions, allowJs, checkJs (+9 more)

### Community 7 - "MenuPage.jsx"
Cohesion: 0.11
Nodes (25): createPedido(), getMenu(), getMesas(), validarCupon(), clamp(), fixStyle(), mesaSize(), mesaStyle() (+17 more)

### Community 8 - "package.json"
Cohesion: 0.07
Nodes (28): @google/model-viewer, dependencies, @google/model-viewer, qrcode, react, react-dom, react-router-dom, serve (+20 more)

### Community 9 - "LandingPage.jsx"
Cohesion: 0.17
Nodes (15): AnimatedStat(), COMPARACION, FAQS, FEATURES, fmt(), LandingPage(), PALABRAS, PASOS (+7 more)

### Community 12 - "adminUtils.js"
Cohesion: 0.16
Nodes (21): createPlato(), deletePlato(), updatePlato(), AdminMenuView(), AdminMetricasView(), AdminPedidosView(), FILTROS, LocalSettingsModal() (+13 more)

### Community 13 - "LoginPage.jsx"
Cohesion: 0.70
Nodes (4): login(), defaultRouteForRole(), getSlugFromPath(), LoginPage()

## Knowledge Gaps
- **80 isolated node(s):** `DEMO_EMPRESA`, `DEMO_PLATOS`, `DEMO_MESAS`, `NotificationContext`, `TYPE_ICONS` (+75 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `request()` connect `client.js` to `CompanyContext.jsx`, `mock.js`, `AdminPage.jsx`, `MenuPage.jsx`, `adminUtils.js`, `LoginPage.jsx`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `useCompany()` connect `AdminPage.jsx` to `CompanyContext.jsx`, `App.jsx`, `MenuPage.jsx`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `DEMO_EMPRESA`, `DEMO_PLATOS`, `DEMO_MESAS` to the rest of the system?**
  _80 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `client.js` be split into smaller, more focused modules?**
  _Cohesion score 0.10241545893719807 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07536231884057971 - nodes in this community are weakly interconnected._
- **Should `TypeScript Config` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._