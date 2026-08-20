# Graph Report - front-pedidos-3D  (2026-08-20)

## Corpus Check
- 53 files · ~120,657 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 334 nodes · 744 edges · 16 communities (14 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `483a8de9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- PedidoTrackingPage.jsx
- mock.js
- devDependencies
- client.js
- App.jsx
- TypeScript Config
- PlanoEditor.jsx
- package.json
- LandingPage.jsx
- CLAUDE.md
- adminUtils.js
- CartContext.jsx
- manifest.json
- useAuth
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
- `MenuPage()` --calls--> `getMenu()`  [EXTRACTED]
  src/pages/MenuPage.jsx → src/api/client.js
- `PlanoEditor()` --calls--> `getEmpresa()`  [EXTRACTED]
  src/components/PlanoEditor.jsx → src/api/client.js
- `CompanyProvider()` --calls--> `getEmpresa()`  [EXTRACTED]
  src/context/CompanyContext.jsx → src/api/client.js
- `LoginPage()` --calls--> `getEmpresa()`  [EXTRACTED]
  src/pages/LoginPage.jsx → src/api/client.js
- `ModeSelectPage()` --calls--> `getPedido()`  [EXTRACTED]
  src/pages/ModeSelectPage.jsx → src/api/client.js

## Import Cycles
- None detected.

## Communities (16 total, 2 thin omitted)

### Community 0 - "PedidoTrackingPage.jsx"
Cohesion: 0.15
Nodes (18): createPlato(), deletePlato(), getPedido(), llamarMozo(), updatePlato(), PlatoModal(), CATEGORIAS, EMPTY_PLATO (+10 more)

### Community 1 - "mock.js"
Cohesion: 0.21
Nodes (10): crearPedido(), DEMO_EMPRESA, DEMO_MESAS, DEMO_PLATOS, estadoSegunElapsed(), guardarDemoPedido(), handleMock(), leerDemoPedido() (+2 more)

### Community 2 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, devDependencies, eslint, @eslint/js (+9 more)

### Community 4 - "client.js"
Cohesion: 0.09
Nodes (50): atenderLlamado(), cancelarPedido(), createCupon(), createStaff(), deleteCupon(), deleteStaff(), getCupones(), getEmpresa() (+42 more)

### Community 5 - "App.jsx"
Cohesion: 0.08
Nodes (37): crearPreferencia(), createPedido(), registrarArVista(), validarCupon(), defaultRouteForRole(), DemoModal(), Navbar(), ProtectedRoute() (+29 more)

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
Cohesion: 0.26
Nodes (14): getPedidosRango(), AdminMenuView(), AdminMetricasView(), AdminPedidosView(), FILTROS, calcularMetricas(), CATE_LABELS, categoriaIcon() (+6 more)

### Community 13 - "CartContext.jsx"
Cohesion: 0.18
Nodes (10): App(), ErrorBoundary, CartContext, CartProvider(), getCartKey(), getSlugFromPath(), itemKey(), loadCart() (+2 more)

### Community 14 - "manifest.json"
Cohesion: 0.12
Nodes (15): background_color, categories, description, display, icons, lang, name, orientation (+7 more)

### Community 15 - "useAuth"
Cohesion: 0.16
Nodes (17): login(), registrarEmpresa(), ThemeToggle(), AdminSidebar(), ITEMS, RegistroModal(), AuthContext, AuthProvider() (+9 more)

## Knowledge Gaps
- **97 isolated node(s):** `DEMO_EMPRESA`, `DEMO_PLATOS`, `DEMO_MESAS`, `FILTROS`, `DIAS` (+92 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `request()` connect `client.js` to `PedidoTrackingPage.jsx`, `mock.js`, `App.jsx`, `PlanoEditor.jsx`, `adminUtils.js`, `useAuth`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `useCompany()` connect `App.jsx` to `PedidoTrackingPage.jsx`, `client.js`, `CartContext.jsx`, `PlanoEditor.jsx`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `DEMO_EMPRESA`, `DEMO_PLATOS`, `DEMO_MESAS` to the rest of the system?**
  _97 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `PedidoTrackingPage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14761904761904762 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `client.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09435028248587571 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0784313725490196 - nodes in this community are weakly interconnected._