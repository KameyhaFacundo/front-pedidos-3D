# Graph Report - front-pedidos-3D  (2026-08-18)

## Corpus Check
- 36 files · ~111,938 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 226 nodes · 485 edges · 11 communities (10 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `467c0e88`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.jsx
- dependencies
- useCart
- client.js
- PedidoTrackingPage.jsx
- MenuPage.jsx
- TypeScript Config
- PlanoEditor.jsx
- package.json
- LandingPage.jsx
- CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `request()` - 32 edges
2. `AdminPage()` - 18 edges
3. `useCart()` - 14 edges
4. `useCompany()` - 14 edges
5. `PlanoEditor()` - 13 edges
6. `compilerOptions` - 12 edges
7. `useSSE()` - 10 edges
8. `getMesas()` - 10 edges
9. `useNotify()` - 9 edges
10. `CheckoutPage()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `RegistroModal()` --calls--> `login()`  [EXTRACTED]
  src/components/RegistroModal.jsx → src/api/client.js
- `DemoModal()` --calls--> `useCart()`  [EXTRACTED]
  src/App.jsx → src/context/CartContext.jsx
- `Navbar()` --calls--> `useCart()`  [EXTRACTED]
  src/App.jsx → src/context/CartContext.jsx
- `Navbar()` --calls--> `useCompany()`  [EXTRACTED]
  src/App.jsx → src/context/CompanyContext.jsx
- `ProtectedRoute()` --calls--> `useCompany()`  [EXTRACTED]
  src/App.jsx → src/context/CompanyContext.jsx

## Import Cycles
- None detected.

## Communities (11 total, 1 thin omitted)

### Community 0 - "App.jsx"
Cohesion: 0.13
Nodes (18): login(), Navbar(), ProtectedRoute(), ThemeToggle(), Footer(), REDES, AuthContext, AuthProvider() (+10 more)

### Community 1 - "dependencies"
Cohesion: 0.12
Nodes (17): @google/model-viewer, dependencies, @google/model-viewer, qrcode, react, react-dom, react-router-dom, recharts (+9 more)

### Community 2 - "useCart"
Cohesion: 0.14
Nodes (14): App(), DemoModal(), ErrorBoundary, formatear(), PlatoDetailModal(), Toast(), CartContext, CartProvider() (+6 more)

### Community 3 - "client.js"
Cohesion: 0.13
Nodes (33): atenderLlamado(), cancelarPedido(), createPlato(), deletePlato(), getEmpresaSlug(), getLlamados(), getMe(), getMenu() (+25 more)

### Community 4 - "PedidoTrackingPage.jsx"
Cohesion: 0.20
Nodes (12): getEmpresa(), getPedido(), llamarMozo(), CompanyContext, CompanyProvider(), getSlugFromPath(), RESERVED, ESTADO_COLORS (+4 more)

### Community 5 - "MenuPage.jsx"
Cohesion: 0.16
Nodes (17): createPedido(), getMesas(), registrarArVista(), validarCupon(), ARViewer(), AdminSkeleton(), MenuSkeleton(), useCompany() (+9 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.11
Nodes (17): DOM, ES2023, src, vite/client, compilerOptions, allowArbitraryExtensions, allowJs, checkJs (+9 more)

### Community 7 - "PlanoEditor.jsx"
Cohesion: 0.17
Nodes (19): createMesa(), deleteMesa(), saveLayout(), toggleMesaActiva(), updateMesa(), ESTADO_DOT, ESTADO_LABELS, formatPrecio() (+11 more)

### Community 8 - "package.json"
Cohesion: 0.12
Nodes (16): devDependencies, typescript, vite, engines, node, name, private, scripts (+8 more)

### Community 9 - "LandingPage.jsx"
Cohesion: 0.12
Nodes (21): registrarEmpresa(), RegistroModal(), NotificationContext, NotificationProvider(), TYPE_ICONS, useNotify(), AnimatedStat(), COMPARACION (+13 more)

## Knowledge Gaps
- **66 isolated node(s):** `REDES`, `AuthContext`, `NotificationContext`, `TYPE_ICONS`, `@google/model-viewer` (+61 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AdminPage()` connect `client.js` to `App.jsx`, `LandingPage.jsx`, `MenuPage.jsx`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `REDES`, `AuthContext`, `NotificationContext` to the rest of the system?**
  _66 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12923076923076923 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `useCart` be split into smaller, more focused modules?**
  _Cohesion score 0.1383399209486166 - nodes in this community are weakly interconnected._
- **Should `client.js` be split into smaller, more focused modules?**
  _Cohesion score 0.13225371120107962 - nodes in this community are weakly interconnected._