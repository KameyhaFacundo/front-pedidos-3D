# Graph Report - front-pedidos-3D  (2026-08-19)

## Corpus Check
- 36 files · ~112,327 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 227 nodes · 498 edges · 15 communities (12 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `278885eb`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ThemeContext.jsx
- AuthContext.jsx
- CartContext.jsx
- client.js
- PedidoTrackingPage.jsx
- App.jsx
- TypeScript Config
- PlanoEditor.jsx
- package.json
- LandingPage.jsx
- CLAUDE.md
- CompanyContext.jsx
- Skeletons.jsx
- registrarArVista

## God Nodes (most connected - your core abstractions)
1. `request()` - 33 edges
2. `AdminPage()` - 23 edges
3. `useCompany()` - 16 edges
4. `useCart()` - 14 edges
5. `PlanoEditor()` - 13 edges
6. `compilerOptions` - 12 edges
7. `getMesas()` - 10 edges
8. `useSSE()` - 10 edges
9. `useAuth()` - 10 edges
10. `useNotify()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `ThemeToggle()` --calls--> `useTheme()`  [EXTRACTED]
  src/App.jsx → src/context/ThemeContext.jsx
- `DemoModal()` --calls--> `useCart()`  [EXTRACTED]
  src/App.jsx → src/context/CartContext.jsx
- `RegistroModal()` --calls--> `login()`  [EXTRACTED]
  src/components/RegistroModal.jsx → src/api/client.js
- `PlanoEditor()` --calls--> `getEmpresa()`  [EXTRACTED]
  src/components/PlanoEditor.jsx → src/api/client.js
- `AdminPage()` --calls--> `getEmpresa()`  [EXTRACTED]
  src/pages/AdminPage.jsx → src/api/client.js

## Import Cycles
- None detected.

## Communities (15 total, 3 thin omitted)

### Community 0 - "ThemeContext.jsx"
Cohesion: 0.32
Nodes (7): ThemeToggle(), getScope(), getStoredThemes(), ThemeContext, ThemeProvider(), useTheme(), AdminSidebar()

### Community 1 - "AuthContext.jsx"
Cohesion: 0.38
Nodes (5): login(), AuthContext, AuthProvider(), getSlugFromPath(), LoginPage()

### Community 2 - "CartContext.jsx"
Cohesion: 0.20
Nodes (7): App(), ErrorBoundary, CartContext, CartProvider(), itemKey(), loadCart(), unitPrice()

### Community 3 - "client.js"
Cohesion: 0.14
Nodes (33): atenderLlamado(), cancelarPedido(), createPlato(), deletePlato(), getEmpresaSlug(), getLlamados(), getMe(), getMetricas() (+25 more)

### Community 4 - "PedidoTrackingPage.jsx"
Cohesion: 0.36
Nodes (7): getPedido(), llamarMozo(), ESTADO_COLORS, ESTADO_INFO, ESTADOS, formatear(), PedidoTrackingPage()

### Community 5 - "App.jsx"
Cohesion: 0.11
Nodes (28): createPedido(), getMenu(), getMesas(), validarCupon(), DemoModal(), Navbar(), ProtectedRoute(), Footer() (+20 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.11
Nodes (17): DOM, ES2023, src, vite/client, compilerOptions, allowArbitraryExtensions, allowJs, checkJs (+9 more)

### Community 7 - "PlanoEditor.jsx"
Cohesion: 0.19
Nodes (18): createMesa(), deleteMesa(), saveLayout(), toggleMesaActiva(), updateMesa(), ESTADO_DOT, ESTADO_LABELS, formatPrecio() (+10 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (31): @google/model-viewer, dependencies, @google/model-viewer, qrcode, react, react-dom, react-router-dom, serve (+23 more)

### Community 9 - "LandingPage.jsx"
Cohesion: 0.12
Nodes (21): registrarEmpresa(), RegistroModal(), NotificationContext, NotificationProvider(), TYPE_ICONS, useNotify(), AnimatedStat(), COMPARACION (+13 more)

### Community 11 - "CompanyContext.jsx"
Cohesion: 0.47
Nodes (5): getEmpresa(), CompanyContext, CompanyProvider(), getSlugFromPath(), RESERVED

## Knowledge Gaps
- **65 isolated node(s):** `name`, `private`, `version`, `type`, `node` (+60 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AdminPage()` connect `client.js` to `LandingPage.jsx`, `CompanyContext.jsx`, `App.jsx`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `useCompany()` connect `App.jsx` to `client.js`, `CompanyContext.jsx`, `PedidoTrackingPage.jsx`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _65 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `client.js` be split into smaller, more focused modules?**
  _Cohesion score 0.13765182186234817 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11463414634146342 - nodes in this community are weakly interconnected._
- **Should `TypeScript Config` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._