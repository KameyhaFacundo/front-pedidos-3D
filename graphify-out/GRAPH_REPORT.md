# Graph Report - front-pedidos-3D  (2026-08-20)

## Corpus Check
- 53 files · ~120,657 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 336 nodes · 754 edges · 18 communities (16 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9ecd4366`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- PedidoTrackingPage.jsx
- mock.js
- devDependencies
- client.js
- AdminPage.jsx
- MenuPage.jsx
- TypeScript Config
- PlanoEditor.jsx
- package.json
- LandingPage.jsx
- CLAUDE.md
- adminUtils.js
- App.jsx
- manifest.json
- CompanyContext.jsx
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
- `LocalSettingsModal()` --indirect_call--> `soundEnabled()`  [INFERRED]
  src/components/admin/LocalSettingsModal.jsx → src/components/adminUtils.js
- `ProtectedRoute()` --calls--> `useAuth()`  [EXTRACTED]
  src/App.jsx → src/context/AuthContext.jsx
- `ProtectedRoute()` --calls--> `useCompany()`  [EXTRACTED]
  src/App.jsx → src/context/CompanyContext.jsx
- `ThemeToggle()` --calls--> `useTheme()`  [EXTRACTED]
  src/App.jsx → src/context/ThemeContext.jsx
- `Navbar()` --calls--> `useCompany()`  [EXTRACTED]
  src/App.jsx → src/context/CompanyContext.jsx

## Import Cycles
- None detected.

## Communities (18 total, 2 thin omitted)

### Community 0 - "PedidoTrackingPage.jsx"
Cohesion: 0.18
Nodes (14): getPedido(), llamarMozo(), registrarEmpresa(), RegistroModal(), NotificationContext, NotificationProvider(), TYPE_ICONS, useNotify() (+6 more)

### Community 1 - "mock.js"
Cohesion: 0.21
Nodes (10): crearPedido(), DEMO_EMPRESA, DEMO_MESAS, DEMO_PLATOS, estadoSegunElapsed(), guardarDemoPedido(), handleMock(), leerDemoPedido() (+2 more)

### Community 2 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, devDependencies, eslint, @eslint/js (+9 more)

### Community 3 - "client.js"
Cohesion: 0.14
Nodes (28): atenderLlamado(), createCupon(), createPlato(), createStaff(), deleteCupon(), deletePlato(), deleteStaff(), getCupones() (+20 more)

### Community 4 - "AdminPage.jsx"
Cohesion: 0.15
Nodes (29): cancelarPedido(), getMetricas(), getPedidos(), getPlatos(), logout(), reordenarPlatos(), updateEmpresa(), updatePedidoEstado() (+21 more)

### Community 5 - "MenuPage.jsx"
Cohesion: 0.13
Nodes (20): crearPreferencia(), createPedido(), getMenu(), getMesas(), validarCupon(), EMPTY, formatear(), PlatoDetailModal() (+12 more)

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
Cohesion: 0.17
Nodes (19): getPedidosRango(), AdminMenuView(), AdminMetricasView(), AdminPedidosView(), FILTROS, DIAS, LocalSettingsModal(), calcularMetricas() (+11 more)

### Community 13 - "App.jsx"
Cohesion: 0.08
Nodes (28): App(), defaultRouteForRole(), DemoModal(), Navbar(), ProtectedRoute(), ThemeToggle(), ErrorBoundary, Footer() (+20 more)

### Community 14 - "manifest.json"
Cohesion: 0.12
Nodes (15): background_color, categories, description, display, icons, lang, name, orientation (+7 more)

### Community 15 - "CompanyContext.jsx"
Cohesion: 0.29
Nodes (9): getEmpresa(), login(), CompanyContext, CompanyProvider(), getSlugFromPath(), RESERVED, defaultRouteForRole(), getSlugFromPath() (+1 more)

## Knowledge Gaps
- **97 isolated node(s):** `name`, `private`, `version`, `type`, `node` (+92 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `request()` connect `client.js` to `PedidoTrackingPage.jsx`, `mock.js`, `AdminPage.jsx`, `MenuPage.jsx`, `PlanoEditor.jsx`, `adminUtils.js`, `CompanyContext.jsx`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `useCompany()` connect `AdminPage.jsx` to `PedidoTrackingPage.jsx`, `MenuPage.jsx`, `PlanoEditor.jsx`, `App.jsx`, `CompanyContext.jsx`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _97 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `client.js` be split into smaller, more focused modules?**
  _Cohesion score 0.13725490196078433 - nodes in this community are weakly interconnected._
- **Should `MenuPage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13230769230769232 - nodes in this community are weakly interconnected._
- **Should `TypeScript Config` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._