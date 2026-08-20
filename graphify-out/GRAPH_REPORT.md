# Graph Report - front-pedidos-3D  (2026-08-20)

## Corpus Check
- 54 files · ~121,546 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 347 nodes · 798 edges · 18 communities (16 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.75)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4f36dadb`
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
- MenuPage.jsx
- CocinaPage.jsx
- manifest.json
- adminUtils.js
- sw.js

## God Nodes (most connected - your core abstractions)
1. `request()` - 46 edges
2. `useCompany()` - 21 edges
3. `AdminPage()` - 21 edges
4. `CocinaPage()` - 18 edges
5. `useAuth()` - 15 edges
6. `LlamadosPage()` - 15 edges
7. `useCart()` - 14 edges
8. `PlanoEditor()` - 13 edges
9. `compilerOptions` - 12 edges
10. `useNotify()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `ProtectedRoute()` --calls--> `useAuth()`  [EXTRACTED]
  src/App.jsx → src/context/AuthContext.jsx
- `ThemeToggle()` --calls--> `useTheme()`  [EXTRACTED]
  src/App.jsx → src/context/ThemeContext.jsx
- `DemoModal()` --calls--> `useCart()`  [EXTRACTED]
  src/App.jsx → src/context/CartContext.jsx
- `App()` --calls--> `useCompany()`  [EXTRACTED]
  src/App.jsx → src/context/CompanyContext.jsx
- `AdminPage()` --calls--> `logout()`  [EXTRACTED]
  src/pages/AdminPage.jsx → src/api/client.js

## Import Cycles
- None detected.

## Communities (18 total, 2 thin omitted)

### Community 0 - "PedidoTrackingPage.jsx"
Cohesion: 0.15
Nodes (16): login(), registrarEmpresa(), RegistroModal(), NotificationContext, NotificationProvider(), TYPE_ICONS, useNotify(), defaultRouteForRole() (+8 more)

### Community 1 - "mock.js"
Cohesion: 0.21
Nodes (10): crearPedido(), DEMO_EMPRESA, DEMO_MESAS, DEMO_PLATOS, estadoSegunElapsed(), guardarDemoPedido(), handleMock(), leerDemoPedido() (+2 more)

### Community 2 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, devDependencies, eslint, @eslint/js (+9 more)

### Community 3 - "CartContext.jsx"
Cohesion: 0.18
Nodes (10): App(), ErrorBoundary, CartContext, CartProvider(), getCartKey(), getSlugFromPath(), itemKey(), loadCart() (+2 more)

### Community 4 - "client.js"
Cohesion: 0.12
Nodes (40): cancelarPedido(), createCupon(), createPlato(), createStaff(), deleteCupon(), deletePlato(), deleteStaff(), getCupones() (+32 more)

### Community 5 - "App.jsx"
Cohesion: 0.09
Nodes (33): crearPreferencia(), createPedido(), validarCupon(), defaultRouteForRole(), DemoModal(), Navbar(), ProtectedRoute(), ThemeToggle() (+25 more)

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

### Community 12 - "MenuPage.jsx"
Cohesion: 0.16
Nodes (12): getMenu(), llamarMozo(), registrarArVista(), ARViewer(), EMPTY, formatear(), PlatoDetailModal(), AdminSkeleton() (+4 more)

### Community 13 - "CocinaPage.jsx"
Cohesion: 0.17
Nodes (25): atenderLlamado(), getLlamados(), logout(), getBase(), useSSE(), DIAS, LocalSettingsModal(), AdminSidebar() (+17 more)

### Community 14 - "manifest.json"
Cohesion: 0.12
Nodes (15): background_color, categories, description, display, icons, lang, name, orientation (+7 more)

### Community 15 - "adminUtils.js"
Cohesion: 0.20
Nodes (19): getPedidosRango(), AdminMenuView(), AdminMetricasView(), AdminPedidosView(), FILTROS, hoyLocal(), beep(), calcularMetricas() (+11 more)

## Knowledge Gaps
- **97 isolated node(s):** `name`, `private`, `version`, `type`, `node` (+92 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `request()` connect `client.js` to `PedidoTrackingPage.jsx`, `mock.js`, `App.jsx`, `PlanoEditor.jsx`, `MenuPage.jsx`, `CocinaPage.jsx`, `adminUtils.js`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `useCompany()` connect `App.jsx` to `PedidoTrackingPage.jsx`, `CartContext.jsx`, `client.js`, `PlanoEditor.jsx`, `MenuPage.jsx`, `CocinaPage.jsx`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `CocinaPage()` (e.g. with `soundEnabled()` and `notifEnabled()`) actually correct?**
  _`CocinaPage()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _97 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `client.js` be split into smaller, more focused modules?**
  _Cohesion score 0.11884057971014493 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08773784355179703 - nodes in this community are weakly interconnected._