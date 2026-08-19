# Graph Report - front-pedidos-3D  (2026-08-19)

## Corpus Check
- 38 files · ~112,323 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 242 nodes · 510 edges · 13 communities (11 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `85b0392a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.jsx
- useAuth
- devDependencies
- client.js
- PedidoTrackingPage.jsx
- MenuPage.jsx
- TypeScript Config
- registrarArVista
- package.json
- LandingPage.jsx
- CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `request()` - 33 edges
2. `AdminPage()` - 22 edges
3. `useCompany()` - 16 edges
4. `useCart()` - 14 edges
5. `PlanoEditor()` - 13 edges
6. `compilerOptions` - 12 edges
7. `getMesas()` - 10 edges
8. `useSSE()` - 10 edges
9. `useAuth()` - 9 edges
10. `useNotify()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `ProtectedRoute()` --calls--> `useCompany()`  [EXTRACTED]
  src/App.jsx → src/context/CompanyContext.jsx
- `ThemeToggle()` --calls--> `useTheme()`  [EXTRACTED]
  src/App.jsx → src/context/ThemeContext.jsx
- `DemoModal()` --calls--> `useCart()`  [EXTRACTED]
  src/App.jsx → src/context/CartContext.jsx
- `CompanyProvider()` --calls--> `getEmpresa()`  [EXTRACTED]
  src/context/CompanyContext.jsx → src/api/client.js
- `AdminPage()` --calls--> `getMesas()`  [EXTRACTED]
  src/pages/AdminPage.jsx → src/api/client.js

## Import Cycles
- None detected.

## Communities (13 total, 2 thin omitted)

### Community 0 - "App.jsx"
Cohesion: 0.09
Nodes (20): App(), ThemeToggle(), AdminSidebar(), ITEMS, ErrorBoundary, Footer(), REDES, Toast() (+12 more)

### Community 1 - "useAuth"
Cohesion: 0.19
Nodes (13): login(), registrarEmpresa(), ProtectedRoute(), RegistroModal(), AuthContext, AuthProvider(), useAuth(), NotificationContext (+5 more)

### Community 2 - "devDependencies"
Cohesion: 0.13
Nodes (15): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, devDependencies, eslint, @eslint/js (+7 more)

### Community 3 - "client.js"
Cohesion: 0.13
Nodes (38): cancelarPedido(), createMesa(), createPlato(), deleteMesa(), deletePlato(), getEmpresa(), getEmpresaSlug(), getMe() (+30 more)

### Community 4 - "PedidoTrackingPage.jsx"
Cohesion: 0.17
Nodes (15): atenderLlamado(), getLlamados(), getPedido(), llamarMozo(), getBase(), useSSE(), ESTADO_COLORS, ESTADO_LABELS (+7 more)

### Community 5 - "MenuPage.jsx"
Cohesion: 0.09
Nodes (34): createPedido(), getMenu(), getMesas(), validarCupon(), DemoModal(), Navbar(), fixStyle(), mesaSize() (+26 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.11
Nodes (17): DOM, ES2023, src, vite/client, compilerOptions, allowArbitraryExtensions, allowJs, checkJs (+9 more)

### Community 8 - "package.json"
Cohesion: 0.07
Nodes (27): @google/model-viewer, dependencies, @google/model-viewer, qrcode, react, react-dom, react-router-dom, serve (+19 more)

### Community 9 - "LandingPage.jsx"
Cohesion: 0.17
Nodes (15): AnimatedStat(), COMPARACION, FAQS, FEATURES, fmt(), LandingPage(), PALABRAS, PASOS (+7 more)

## Knowledge Gaps
- **73 isolated node(s):** `name`, `private`, `version`, `type`, `node` (+68 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AdminPage()` connect `client.js` to `App.jsx`, `useAuth`, `PedidoTrackingPage.jsx`, `MenuPage.jsx`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _73 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08739495798319327 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `client.js` be split into smaller, more focused modules?**
  _Cohesion score 0.12775842044134728 - nodes in this community are weakly interconnected._
- **Should `MenuPage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0898989898989899 - nodes in this community are weakly interconnected._