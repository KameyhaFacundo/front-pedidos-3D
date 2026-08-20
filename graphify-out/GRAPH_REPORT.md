# Graph Report - front-pedidos-3D  (2026-08-20)

## Corpus Check
- 53 files · ~120,898 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 337 nodes · 758 edges · 17 communities (15 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `46e15c32`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- PedidoTrackingPage.jsx
- mock.js
- devDependencies
- ARViewer.jsx
- client.js
- App.jsx
- TypeScript Config
- PlanoEditor.jsx
- package.json
- LandingPage.jsx
- CLAUDE.md
- adminUtils.js
- manifest.json
- LlamadosPage.jsx
- sw.js

## God Nodes (most connected - your core abstractions)
1. `request()` - 46 edges
2. `useCompany()` - 21 edges
3. `AdminPage()` - 21 edges
4. `useAuth()` - 15 edges
5. `useCart()` - 14 edges
6. `PlanoEditor()` - 13 edges
7. `CocinaPage()` - 13 edges
8. `compilerOptions` - 12 edges
9. `useNotify()` - 11 edges
10. `CheckoutPage()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `ProtectedRoute()` --calls--> `useAuth()`  [EXTRACTED]
  src/App.jsx → src/context/AuthContext.jsx
- `ThemeToggle()` --calls--> `useTheme()`  [EXTRACTED]
  src/App.jsx → src/context/ThemeContext.jsx
- `DemoModal()` --calls--> `useCart()`  [EXTRACTED]
  src/App.jsx → src/context/CartContext.jsx
- `RegistroModal()` --calls--> `login()`  [EXTRACTED]
  src/components/RegistroModal.jsx → src/api/client.js
- `LlamadosPage()` --calls--> `logout()`  [EXTRACTED]
  src/pages/LlamadosPage.jsx → src/api/client.js

## Import Cycles
- None detected.

## Communities (17 total, 2 thin omitted)

### Community 0 - "PedidoTrackingPage.jsx"
Cohesion: 0.31
Nodes (8): getBase(), useSSE(), ESTADO_COLORS, ESTADO_INFO, ESTADOS, formatear(), PedidoTrackingPage(), precioItem()

### Community 1 - "mock.js"
Cohesion: 0.21
Nodes (10): crearPedido(), DEMO_EMPRESA, DEMO_MESAS, DEMO_PLATOS, estadoSegunElapsed(), guardarDemoPedido(), handleMock(), leerDemoPedido() (+2 more)

### Community 2 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, devDependencies, eslint, @eslint/js (+9 more)

### Community 3 - "ARViewer.jsx"
Cohesion: 0.50
Nodes (3): registrarArVista(), ARViewer(), ARViewer

### Community 4 - "client.js"
Cohesion: 0.09
Nodes (50): cancelarPedido(), createCupon(), createPlato(), createStaff(), deleteCupon(), deletePlato(), deleteStaff(), getCupones() (+42 more)

### Community 5 - "App.jsx"
Cohesion: 0.07
Nodes (41): crearPreferencia(), createPedido(), getMenu(), llamarMozo(), validarCupon(), App(), defaultRouteForRole(), DemoModal() (+33 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.11
Nodes (17): DOM, ES2023, src, vite/client, compilerOptions, allowArbitraryExtensions, allowJs, checkJs (+9 more)

### Community 7 - "PlanoEditor.jsx"
Cohesion: 0.15
Nodes (23): createMesa(), deleteMesa(), getPedido(), saveLayout(), toggleMesaActiva(), updateMesa(), AdminMesasView(), ESTADO_DOT (+15 more)

### Community 8 - "package.json"
Cohesion: 0.07
Nodes (28): @google/model-viewer, dependencies, @google/model-viewer, qrcode, react, react-dom, react-router-dom, serve (+20 more)

### Community 9 - "LandingPage.jsx"
Cohesion: 0.17
Nodes (15): AnimatedStat(), COMPARACION, FAQS, FEATURES, fmt(), LandingPage(), PALABRAS, PASOS (+7 more)

### Community 12 - "adminUtils.js"
Cohesion: 0.16
Nodes (21): getPedidosRango(), AdminMenuView(), AdminMetricasView(), AdminPedidosView(), FILTROS, hoyLocal(), DIAS, LocalSettingsModal() (+13 more)

### Community 14 - "manifest.json"
Cohesion: 0.12
Nodes (15): background_color, categories, description, display, icons, lang, name, orientation (+7 more)

### Community 15 - "LlamadosPage.jsx"
Cohesion: 0.12
Nodes (23): atenderLlamado(), getEmpresa(), getLlamados(), login(), ThemeToggle(), AdminSidebar(), ITEMS, AuthContext (+15 more)

## Knowledge Gaps
- **97 isolated node(s):** `name`, `private`, `version`, `type`, `node` (+92 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `request()` connect `client.js` to `mock.js`, `ARViewer.jsx`, `App.jsx`, `PlanoEditor.jsx`, `adminUtils.js`, `LlamadosPage.jsx`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `useCompany()` connect `App.jsx` to `PedidoTrackingPage.jsx`, `client.js`, `PlanoEditor.jsx`, `LlamadosPage.jsx`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _97 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `client.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09468147282291058 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06557377049180328 - nodes in this community are weakly interconnected._
- **Should `TypeScript Config` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._