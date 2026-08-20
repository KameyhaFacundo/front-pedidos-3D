# Graph Report - front-pedidos-3D  (2026-08-19)

## Corpus Check
- 50 files · ~117,316 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 303 nodes · 706 edges · 13 communities (12 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1d511cbf`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- PedidoTrackingPage.jsx
- mock.js
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
1. `request()` - 44 edges
2. `useCompany()` - 20 edges
3. `AdminPage()` - 19 edges
4. `useAuth()` - 15 edges
5. `useCart()` - 14 edges
6. `PlanoEditor()` - 13 edges
7. `CocinaPage()` - 12 edges
8. `compilerOptions` - 12 edges
9. `useNotify()` - 11 edges
10. `getMesas()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `RegistroModal()` --calls--> `login()`  [EXTRACTED]
  src/components/RegistroModal.jsx → src/api/client.js
- `LlamadosPage()` --calls--> `logout()`  [EXTRACTED]
  src/pages/LlamadosPage.jsx → src/api/client.js
- `PlanoEditor()` --calls--> `getEmpresa()`  [EXTRACTED]
  src/components/PlanoEditor.jsx → src/api/client.js
- `CompanyProvider()` --calls--> `getEmpresa()`  [EXTRACTED]
  src/context/CompanyContext.jsx → src/api/client.js
- `ModeSelectPage()` --calls--> `getPedido()`  [EXTRACTED]
  src/pages/ModeSelectPage.jsx → src/api/client.js

## Import Cycles
- None detected.

## Communities (13 total, 1 thin omitted)

### Community 0 - "PedidoTrackingPage.jsx"
Cohesion: 0.18
Nodes (14): getPedido(), llamarMozo(), registrarEmpresa(), RegistroModal(), NotificationContext, NotificationProvider(), TYPE_ICONS, useNotify() (+6 more)

### Community 1 - "mock.js"
Cohesion: 0.29
Nodes (10): crearPedido(), DEMO_EMPRESA, DEMO_MESAS, DEMO_PLATOS, estadoSegunElapsed(), guardarDemoPedido(), handleMock(), leerDemoPedido() (+2 more)

### Community 2 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, devDependencies, eslint, @eslint/js (+9 more)

### Community 3 - "client.js"
Cohesion: 0.12
Nodes (40): cancelarPedido(), createCupon(), createPlato(), createStaff(), deleteCupon(), deletePlato(), deleteStaff(), getCupones() (+32 more)

### Community 4 - "CocinaPage.jsx"
Cohesion: 0.12
Nodes (24): atenderLlamado(), getLlamados(), login(), getBase(), useSSE(), ThemeToggle(), AdminSidebar(), ITEMS (+16 more)

### Community 5 - "App.jsx"
Cohesion: 0.06
Nodes (46): createPedido(), getMenu(), getMesas(), validarCupon(), App(), defaultRouteForRole(), DemoModal(), Navbar() (+38 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.11
Nodes (17): DOM, ES2023, src, vite/client, compilerOptions, allowArbitraryExtensions, allowJs, checkJs (+9 more)

### Community 7 - "PlanoEditor.jsx"
Cohesion: 0.16
Nodes (19): createMesa(), deleteMesa(), saveLayout(), toggleMesaActiva(), updateMesa(), AdminMesasView(), ESTADO_DOT, ESTADO_LABELS (+11 more)

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
- **80 isolated node(s):** `DEMO_EMPRESA`, `DEMO_PLATOS`, `DEMO_MESAS`, `CartContext`, `RESERVED` (+75 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `request()` connect `client.js` to `PedidoTrackingPage.jsx`, `mock.js`, `CocinaPage.jsx`, `App.jsx`, `PlanoEditor.jsx`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `useCompany()` connect `App.jsx` to `PedidoTrackingPage.jsx`, `client.js`, `CocinaPage.jsx`, `PlanoEditor.jsx`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `DEMO_EMPRESA`, `DEMO_PLATOS`, `DEMO_MESAS` to the rest of the system?**
  _80 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `client.js` be split into smaller, more focused modules?**
  _Cohesion score 0.11840888066604996 - nodes in this community are weakly interconnected._
- **Should `CocinaPage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12258064516129032 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06386946386946386 - nodes in this community are weakly interconnected._