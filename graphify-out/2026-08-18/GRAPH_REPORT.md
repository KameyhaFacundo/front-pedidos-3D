# Graph Report - front-pedidos-3D  (2026-08-18)

## Corpus Check
- 36 files · ~111,938 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 226 nodes · 473 edges · 11 communities (10 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7e43d1d8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.jsx
- dependencies
- MenuPage.jsx
- client.js
- PedidoTrackingPage.jsx
- PlanoEditor.jsx
- TypeScript Config
- CheckoutPage.jsx
- package.json
- LandingPage.jsx
- CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `request()` - 32 edges
2. `AdminPage()` - 17 edges
3. `useCompany()` - 14 edges
4. `useCart()` - 14 edges
5. `PlanoEditor()` - 13 edges
6. `compilerOptions` - 12 edges
7. `getMesas()` - 10 edges
8. `useSSE()` - 10 edges
9. `useNotify()` - 9 edges
10. `useAuth()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `ThemeToggle()` --calls--> `useTheme()`  [EXTRACTED]
  src/App.jsx → src/context/ThemeContext.jsx
- `Navbar()` --calls--> `useCart()`  [EXTRACTED]
  src/App.jsx → src/context/CartContext.jsx
- `DemoModal()` --calls--> `useCart()`  [EXTRACTED]
  src/App.jsx → src/context/CartContext.jsx
- `CartPage()` --calls--> `useCompany()`  [EXTRACTED]
  src/pages/CartPage.jsx → src/context/CompanyContext.jsx
- `CheckoutPage()` --calls--> `useCompany()`  [EXTRACTED]
  src/pages/CheckoutPage.jsx → src/context/CompanyContext.jsx

## Import Cycles
- None detected.

## Communities (11 total, 1 thin omitted)

### Community 0 - "App.jsx"
Cohesion: 0.12
Nodes (17): login(), Navbar(), ProtectedRoute(), ThemeToggle(), REDES, AuthContext, AuthProvider(), useAuth() (+9 more)

### Community 1 - "dependencies"
Cohesion: 0.12
Nodes (17): @google/model-viewer, dependencies, @google/model-viewer, qrcode, react, react-dom, react-router-dom, recharts (+9 more)

### Community 2 - "MenuPage.jsx"
Cohesion: 0.10
Nodes (19): getMenu(), App(), DemoModal(), ErrorBoundary, formatear(), PlatoDetailModal(), AdminSkeleton(), MenuSkeleton() (+11 more)

### Community 3 - "client.js"
Cohesion: 0.15
Nodes (29): cancelarPedido(), createPlato(), deletePlato(), getEmpresaSlug(), getMe(), getMesas(), getMetricas(), getPedido() (+21 more)

### Community 4 - "PedidoTrackingPage.jsx"
Cohesion: 0.13
Nodes (19): atenderLlamado(), getLlamados(), registrarEmpresa(), getBase(), useSSE(), RegistroModal(), NotificationContext, NotificationProvider() (+11 more)

### Community 5 - "PlanoEditor.jsx"
Cohesion: 0.13
Nodes (22): createMesa(), deleteMesa(), saveLayout(), toggleMesaActiva(), updateMesa(), ESTADO_DOT, ESTADO_LABELS, formatPrecio() (+14 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.11
Nodes (17): DOM, ES2023, src, vite/client, compilerOptions, allowArbitraryExtensions, allowJs, checkJs (+9 more)

### Community 7 - "CheckoutPage.jsx"
Cohesion: 0.24
Nodes (10): createPedido(), getEmpresa(), validarCupon(), CompanyContext, CompanyProvider(), getSlugFromPath(), RESERVED, CheckoutPage() (+2 more)

### Community 8 - "package.json"
Cohesion: 0.12
Nodes (16): devDependencies, typescript, vite, engines, node, name, private, scripts (+8 more)

### Community 9 - "LandingPage.jsx"
Cohesion: 0.17
Nodes (15): AnimatedStat(), COMPARACION, FAQS, FEATURES, fmt(), LandingPage(), PALABRAS, PASOS (+7 more)

## Knowledge Gaps
- **66 isolated node(s):** `graphify`, `name`, `private`, `version`, `type` (+61 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useCart()` connect `MenuPage.jsx` to `App.jsx`, `CheckoutPage.jsx`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `graphify`, `name`, `private` to the rest of the system?**
  _66 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1225071225071225 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `MenuPage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1032258064516129 - nodes in this community are weakly interconnected._
- **Should `PedidoTrackingPage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._