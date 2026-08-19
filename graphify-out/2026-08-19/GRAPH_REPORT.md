# Graph Report - front-pedidos-3D  (2026-08-18)

## Corpus Check
- 36 files · ~111,938 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 227 nodes · 486 edges · 13 communities (12 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `467c0e88`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.jsx
- dependencies
- CartContext.jsx
- AdminPage.jsx
- PedidoTrackingPage.jsx
- useCompany
- TypeScript Config
- client.js
- package.json
- LandingPage.jsx
- CLAUDE.md
- MenuPage.jsx
- ThemeContext.jsx

## God Nodes (most connected - your core abstractions)
1. `request()` - 32 edges
2. `AdminPage()` - 18 edges
3. `useCart()` - 14 edges
4. `useCompany()` - 14 edges
5. `PlanoEditor()` - 13 edges
6. `compilerOptions` - 12 edges
7. `getMesas()` - 10 edges
8. `useSSE()` - 10 edges
9. `useNotify()` - 9 edges
10. `CheckoutPage()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `ProtectedRoute()` --calls--> `useCompany()`  [EXTRACTED]
  src/App.jsx → src/context/CompanyContext.jsx
- `ThemeToggle()` --calls--> `useTheme()`  [EXTRACTED]
  src/App.jsx → src/context/ThemeContext.jsx
- `Navbar()` --calls--> `useCompany()`  [EXTRACTED]
  src/App.jsx → src/context/CompanyContext.jsx
- `DemoModal()` --calls--> `useCart()`  [EXTRACTED]
  src/App.jsx → src/context/CartContext.jsx
- `CompanyProvider()` --calls--> `getEmpresa()`  [EXTRACTED]
  src/context/CompanyContext.jsx → src/api/client.js

## Import Cycles
- None detected.

## Communities (13 total, 1 thin omitted)

### Community 0 - "App.jsx"
Cohesion: 0.12
Nodes (21): login(), registrarEmpresa(), DemoModal(), Navbar(), ProtectedRoute(), Footer(), REDES, RegistroModal() (+13 more)

### Community 1 - "dependencies"
Cohesion: 0.12
Nodes (17): @google/model-viewer, dependencies, @google/model-viewer, qrcode, react, react-dom, react-router-dom, recharts (+9 more)

### Community 2 - "CartContext.jsx"
Cohesion: 0.20
Nodes (7): App(), ErrorBoundary, CartContext, CartProvider(), itemKey(), loadCart(), unitPrice()

### Community 3 - "AdminPage.jsx"
Cohesion: 0.14
Nodes (25): cancelarPedido(), createPlato(), deletePlato(), getMetricas(), getPedidos(), getPlatos(), togglePlatoDisponible(), updatePedidoEstado() (+17 more)

### Community 4 - "PedidoTrackingPage.jsx"
Cohesion: 0.36
Nodes (7): getPedido(), llamarMozo(), ESTADO_COLORS, ESTADO_INFO, ESTADOS, formatear(), PedidoTrackingPage()

### Community 5 - "useCompany"
Cohesion: 0.13
Nodes (22): createPedido(), getMesas(), validarCupon(), fixStyle(), mesaSize(), mesaStyle(), PLANO_ASPECT, PLANO_PADDING (+14 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.11
Nodes (17): DOM, ES2023, src, vite/client, compilerOptions, allowArbitraryExtensions, allowJs, checkJs (+9 more)

### Community 7 - "client.js"
Cohesion: 0.20
Nodes (21): atenderLlamado(), createMesa(), deleteMesa(), getEmpresa(), getEmpresaSlug(), getLlamados(), getMe(), getToken() (+13 more)

### Community 8 - "package.json"
Cohesion: 0.12
Nodes (16): devDependencies, typescript, vite, engines, node, name, private, scripts (+8 more)

### Community 9 - "LandingPage.jsx"
Cohesion: 0.17
Nodes (15): AnimatedStat(), COMPARACION, FAQS, FEATURES, fmt(), LandingPage(), PALABRAS, PASOS (+7 more)

### Community 11 - "MenuPage.jsx"
Cohesion: 0.21
Nodes (9): getMenu(), registrarArVista(), ARViewer(), formatear(), PlatoDetailModal(), AdminSkeleton(), MenuSkeleton(), CATEGORIAS (+1 more)

### Community 12 - "ThemeContext.jsx"
Cohesion: 0.32
Nodes (7): ThemeToggle(), getScope(), getStoredThemes(), ThemeContext, ThemeProvider(), useTheme(), AdminSidebar()

## Knowledge Gaps
- **66 isolated node(s):** `name`, `private`, `version`, `type`, `node` (+61 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AdminPage()` connect `AdminPage.jsx` to `App.jsx`, `useCompany`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _66 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11693548387096774 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `AdminPage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13793103448275862 - nodes in this community are weakly interconnected._
- **Should `useCompany` be split into smaller, more focused modules?**
  _Cohesion score 0.13227513227513227 - nodes in this community are weakly interconnected._