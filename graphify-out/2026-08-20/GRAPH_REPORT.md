# Graph Report - front-pedidos-3D  (2026-08-20)

## Corpus Check
- 53 files · ~120,955 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 335 nodes · 757 edges · 17 communities (15 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `500808c1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- PedidoTrackingPage.jsx
- mock.js
- devDependencies
- CartContext.jsx
- client.js
- App.jsx
- TypeScript Config
- PlanoEditor.jsx
- package.json
- LandingPage.jsx
- CLAUDE.md
- adminUtils.js
- getEmpresa
- manifest.json
- AdminPage.jsx
- sw.js

## God Nodes (most connected - your core abstractions)
1. `request()` - 46 edges
2. `AdminPage()` - 21 edges
3. `useCompany()` - 21 edges
4. `useAuth()` - 15 edges
5. `useCart()` - 14 edges
6. `CocinaPage()` - 13 edges
7. `PlanoEditor()` - 13 edges
8. `compilerOptions` - 12 edges
9. `CheckoutPage()` - 11 edges
10. `useNotify()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `LocalSettingsModal()` --indirect_call--> `soundEnabled()`  [INFERRED]
  src/components/admin/LocalSettingsModal.jsx → src/components/adminUtils.js
- `PedidoTrackingPage()` --calls--> `useSSE()`  [EXTRACTED]
  src/pages/PedidoTrackingPage.jsx → src/api/useSSE.js
- `PedidoTrackingPage()` --calls--> `useCompany()`  [EXTRACTED]
  src/pages/PedidoTrackingPage.jsx → src/context/CompanyContext.jsx
- `PedidoTrackingPage()` --calls--> `useNotify()`  [EXTRACTED]
  src/pages/PedidoTrackingPage.jsx → src/context/NotificationContext.jsx
- `LlamadosPage()` --calls--> `atenderLlamado()`  [EXTRACTED]
  src/pages/LlamadosPage.jsx → src/api/client.js

## Import Cycles
- None detected.

## Communities (17 total, 2 thin omitted)

### Community 0 - "PedidoTrackingPage.jsx"
Cohesion: 0.33
Nodes (8): getPedido(), llamarMozo(), ESTADO_COLORS, ESTADO_INFO, ESTADOS, formatear(), PedidoTrackingPage(), precioItem()

### Community 1 - "mock.js"
Cohesion: 0.21
Nodes (10): crearPedido(), DEMO_EMPRESA, DEMO_MESAS, DEMO_PLATOS, estadoSegunElapsed(), guardarDemoPedido(), handleMock(), leerDemoPedido() (+2 more)

### Community 2 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, devDependencies, eslint, @eslint/js (+9 more)

### Community 3 - "CartContext.jsx"
Cohesion: 0.19
Nodes (9): ErrorBoundary, CartContext, CartProvider(), getCartKey(), getSlugFromPath(), itemKey(), loadCart(), RESERVED (+1 more)

### Community 4 - "client.js"
Cohesion: 0.11
Nodes (36): atenderLlamado(), createCupon(), createPlato(), createStaff(), deleteCupon(), deletePlato(), deleteStaff(), getCupones() (+28 more)

### Community 5 - "App.jsx"
Cohesion: 0.08
Nodes (41): crearPreferencia(), createPedido(), getMesas(), validarCupon(), App(), defaultRouteForRole(), DemoModal(), Navbar() (+33 more)

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
Cohesion: 0.19
Nodes (18): getPedidosRango(), AdminMenuView(), AdminMetricasView(), AdminPedidosView(), FILTROS, hoyLocal(), DIAS, LocalSettingsModal() (+10 more)

### Community 13 - "getEmpresa"
Cohesion: 0.60
Nodes (5): getEmpresa(), login(), defaultRouteForRole(), getSlugFromPath(), LoginPage()

### Community 14 - "manifest.json"
Cohesion: 0.12
Nodes (15): background_color, categories, description, display, icons, lang, name, orientation (+7 more)

### Community 15 - "AdminPage.jsx"
Cohesion: 0.12
Nodes (31): cancelarPedido(), getPedidos(), logout(), registrarEmpresa(), updatePedidoEstado(), getBase(), useSSE(), AdminSidebar() (+23 more)

## Knowledge Gaps
- **97 isolated node(s):** `ENTREGAS`, `ESTADO_COLORS`, `ESTADO_INFO`, `ESTADOS`, `DEMO_EMPRESA` (+92 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `request()` connect `client.js` to `PedidoTrackingPage.jsx`, `mock.js`, `App.jsx`, `PlanoEditor.jsx`, `adminUtils.js`, `getEmpresa`, `AdminPage.jsx`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `useCompany()` connect `App.jsx` to `PedidoTrackingPage.jsx`, `PlanoEditor.jsx`, `AdminPage.jsx`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `ENTREGAS`, `ESTADO_COLORS`, `ESTADO_INFO` to the rest of the system?**
  _97 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `client.js` be split into smaller, more focused modules?**
  _Cohesion score 0.10975609756097561 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07826694619147449 - nodes in this community are weakly interconnected._
- **Should `TypeScript Config` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._