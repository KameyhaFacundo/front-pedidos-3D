# Graph Report - .  (2026-08-15)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 222 nodes · 481 edges · 9 communities (8 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 36,862 input · 174 output

## Graph Freshness
- Built from commit: `02e4760b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Auth & App Shell
- Project Dependencies
- Menu & AR Viewer
- Admin API Client
- Notifications & SSE
- Table Layout Editor
- TypeScript Config
- Checkout & Cart Flow
- App Entry & Errors

## God Nodes (most connected - your core abstractions)
1. `request()` - 32 edges
2. `AdminPage()` - 18 edges
3. `useCart()` - 15 edges
4. `PlanoEditor()` - 13 edges
5. `useCompany()` - 12 edges
6. `compilerOptions` - 12 edges
7. `getMesas()` - 10 edges
8. `useSSE()` - 10 edges
9. `useNotify()` - 9 edges
10. `CheckoutPage()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Navbar()` --calls--> `useCart()`  [EXTRACTED]
  src/App.jsx → src/context/CartContext.jsx
- `Navbar()` --calls--> `useCompany()`  [EXTRACTED]
  src/App.jsx → src/context/CompanyContext.jsx
- `ProtectedRoute()` --calls--> `useCompany()`  [EXTRACTED]
  src/App.jsx → src/context/CompanyContext.jsx
- `ThemeToggle()` --calls--> `useTheme()`  [EXTRACTED]
  src/App.jsx → src/context/ThemeContext.jsx
- `RegistroModal()` --calls--> `useNotify()`  [EXTRACTED]
  src/components/RegistroModal.jsx → src/context/NotificationContext.jsx

## Import Cycles
- None detected.

## Communities (9 total, 1 thin omitted)

### Community 0 - "Auth & App Shell"
Cohesion: 0.09
Nodes (29): login(), registrarEmpresa(), Navbar(), ProtectedRoute(), ThemeToggle(), Footer(), REDES, RegistroModal() (+21 more)

### Community 1 - "Project Dependencies"
Cohesion: 0.06
Nodes (33): @google/model-viewer, dependencies, @google/model-viewer, qrcode, react, react-dom, react-router-dom, recharts (+25 more)

### Community 2 - "Menu & AR Viewer"
Cohesion: 0.12
Nodes (22): getMenu(), registrarArVista(), ARViewer(), formatear(), PlatoDetailModal(), AdminSkeleton(), MenuSkeleton(), Toast() (+14 more)

### Community 3 - "Admin API Client"
Cohesion: 0.19
Nodes (24): cancelarPedido(), createPlato(), deletePlato(), getEmpresaSlug(), getMe(), getMesas(), getMetricas(), getPedidos() (+16 more)

### Community 4 - "Notifications & SSE"
Cohesion: 0.14
Nodes (20): atenderLlamado(), getLlamados(), getPedido(), llamarMozo(), getBase(), useSSE(), NotificationContext, NotificationProvider() (+12 more)

### Community 5 - "Table Layout Editor"
Cohesion: 0.17
Nodes (20): createMesa(), deleteMesa(), saveLayout(), toggleMesaActiva(), updateMesa(), ESTADO_DOT, ESTADO_LABELS, formatPrecio() (+12 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.11
Nodes (17): DOM, ES2023, src, vite/client, compilerOptions, allowArbitraryExtensions, allowJs, checkJs (+9 more)

### Community 7 - "Checkout & Cart Flow"
Cohesion: 0.21
Nodes (13): createPedido(), getEmpresa(), validarCupon(), CompanyContext, CompanyProvider(), getSlugFromPath(), RESERVED, useCompany() (+5 more)

## Knowledge Gaps
- **65 isolated node(s):** `REDES`, `AuthContext`, `ThemeContext`, `FAQS`, `FEATURES` (+60 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AdminPage()` connect `Admin API Client` to `Auth & App Shell`, `Notifications & SSE`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `REDES`, `AuthContext`, `ThemeContext` to the rest of the system?**
  _65 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Auth & App Shell` be split into smaller, more focused modules?**
  _Cohesion score 0.08502024291497975 - nodes in this community are weakly interconnected._
- **Should `Project Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._
- **Should `Menu & AR Viewer` be split into smaller, more focused modules?**
  _Cohesion score 0.11612903225806452 - nodes in this community are weakly interconnected._
- **Should `Notifications & SSE` be split into smaller, more focused modules?**
  _Cohesion score 0.13666666666666666 - nodes in this community are weakly interconnected._
- **Should `TypeScript Config` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._