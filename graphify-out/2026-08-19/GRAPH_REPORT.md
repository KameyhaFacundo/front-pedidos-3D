# Graph Report - front-pedidos-3D  (2026-08-19)

## Corpus Check
- 36 files · ~112,240 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 227 nodes · 484 edges · 11 communities (10 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `278885eb`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.jsx
- dependencies
- useCart
- client.js
- PedidoTrackingPage.jsx
- useCompany
- TypeScript Config
- PlanoEditor.jsx
- package.json
- LandingPage.jsx
- CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `request()` - 33 edges
2. `AdminPage()` - 23 edges
3. `useCompany()` - 16 edges
4. `useCart()` - 14 edges
5. `PlanoEditor()` - 12 edges
6. `compilerOptions` - 12 edges
7. `getMesas()` - 10 edges
8. `useAuth()` - 10 edges
9. `useSSE()` - 10 edges
10. `useNotify()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `ProtectedRoute()` --calls--> `useCompany()`  [EXTRACTED]
  src/App.jsx → src/context/CompanyContext.jsx
- `ThemeToggle()` --calls--> `useTheme()`  [EXTRACTED]
  src/App.jsx → src/context/ThemeContext.jsx
- `Navbar()` --calls--> `useCart()`  [EXTRACTED]
  src/App.jsx → src/context/CartContext.jsx
- `Navbar()` --calls--> `useCompany()`  [EXTRACTED]
  src/App.jsx → src/context/CompanyContext.jsx
- `DemoModal()` --calls--> `useCart()`  [EXTRACTED]
  src/App.jsx → src/context/CartContext.jsx

## Import Cycles
- None detected.

## Communities (11 total, 1 thin omitted)

### Community 0 - "App.jsx"
Cohesion: 0.11
Nodes (17): login(), Navbar(), ProtectedRoute(), ThemeToggle(), REDES, AuthContext, AuthProvider(), useAuth() (+9 more)

### Community 1 - "dependencies"
Cohesion: 0.12
Nodes (17): @google/model-viewer, dependencies, @google/model-viewer, qrcode, react, react-dom, react-router-dom, recharts (+9 more)

### Community 2 - "useCart"
Cohesion: 0.14
Nodes (14): App(), DemoModal(), ErrorBoundary, formatear(), PlatoDetailModal(), Toast(), CartContext, CartProvider() (+6 more)

### Community 3 - "client.js"
Cohesion: 0.12
Nodes (35): atenderLlamado(), cancelarPedido(), createPlato(), deletePlato(), getEmpresa(), getEmpresaSlug(), getLlamados(), getMe() (+27 more)

### Community 4 - "PedidoTrackingPage.jsx"
Cohesion: 0.19
Nodes (13): getPedido(), llamarMozo(), registrarEmpresa(), RegistroModal(), NotificationContext, NotificationProvider(), TYPE_ICONS, useNotify() (+5 more)

### Community 5 - "useCompany"
Cohesion: 0.14
Nodes (20): createPedido(), getMenu(), getMesas(), validarCupon(), QRInstructionsModal(), AdminSkeleton(), MenuSkeleton(), CompanyContext (+12 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.11
Nodes (17): DOM, ES2023, src, vite/client, compilerOptions, allowArbitraryExtensions, allowJs, checkJs (+9 more)

### Community 7 - "PlanoEditor.jsx"
Cohesion: 0.19
Nodes (18): createMesa(), deleteMesa(), saveLayout(), toggleMesaActiva(), updateMesa(), ESTADO_DOT, ESTADO_LABELS, formatPrecio() (+10 more)

### Community 8 - "package.json"
Cohesion: 0.12
Nodes (16): devDependencies, typescript, vite, engines, node, name, private, scripts (+8 more)

### Community 9 - "LandingPage.jsx"
Cohesion: 0.17
Nodes (15): AnimatedStat(), COMPARACION, FAQS, FEATURES, fmt(), LandingPage(), PALABRAS, PASOS (+7 more)

## Knowledge Gaps
- **66 isolated node(s):** `CATEGORIAS`, `COLUMNAS`, `EMPTY_PLATO`, `CATEGORIAS`, `AuthContext` (+61 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AdminPage()` connect `client.js` to `App.jsx`, `PedidoTrackingPage.jsx`, `useCompany`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `useCompany()` connect `useCompany` to `App.jsx`, `useCart`, `client.js`, `PedidoTrackingPage.jsx`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `CATEGORIAS`, `COLUMNAS`, `EMPTY_PLATO` to the rest of the system?**
  _66 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11396011396011396 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `useCart` be split into smaller, more focused modules?**
  _Cohesion score 0.1383399209486166 - nodes in this community are weakly interconnected._
- **Should `client.js` be split into smaller, more focused modules?**
  _Cohesion score 0.12292358803986711 - nodes in this community are weakly interconnected._