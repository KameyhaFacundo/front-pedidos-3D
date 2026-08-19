# Graph Report - front-pedidos-3D  (2026-08-19)

## Corpus Check
- 47 files · ~113,873 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 266 nodes · 570 edges · 15 communities (13 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.6)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bd531c05`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ThemeContext.jsx
- useNotify
- devDependencies
- client.js
- PedidoTrackingPage.jsx
- App.jsx
- TypeScript Config
- PlanoEditor.jsx
- package.json
- LandingPage.jsx
- CLAUDE.md
- adminUtils.js
- CartContext.jsx
- Footer.jsx

## God Nodes (most connected - your core abstractions)
1. `request()` - 33 edges
2. `AdminPage()` - 18 edges
3. `useCompany()` - 16 edges
4. `useCart()` - 14 edges
5. `PlanoEditor()` - 12 edges
6. `compilerOptions` - 12 edges
7. `useNotify()` - 11 edges
8. `getMesas()` - 10 edges
9. `useSSE()` - 10 edges
10. `useAuth()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `AdminConfigView()` --indirect_call--> `soundEnabled()`  [INFERRED]
  src/components/admin/AdminConfigView.jsx → src/components/adminUtils.js
- `AdminPage()` --calls--> `soundEnabled()`  [EXTRACTED]
  src/pages/AdminPage.jsx → src/components/adminUtils.js
- `AdminPage()` --calls--> `getMesas()`  [EXTRACTED]
  src/pages/AdminPage.jsx → src/api/client.js
- `AdminPage()` --calls--> `useSSE()`  [EXTRACTED]
  src/pages/AdminPage.jsx → src/api/useSSE.js
- `AdminPage()` --calls--> `useAuth()`  [EXTRACTED]
  src/pages/AdminPage.jsx → src/context/AuthContext.jsx

## Import Cycles
- None detected.

## Communities (15 total, 2 thin omitted)

### Community 0 - "ThemeContext.jsx"
Cohesion: 0.29
Nodes (8): ThemeToggle(), AdminSidebar(), ITEMS, getScope(), getStoredThemes(), ThemeContext, ThemeProvider(), useTheme()

### Community 1 - "useNotify"
Cohesion: 0.21
Nodes (12): login(), registrarEmpresa(), RegistroModal(), AuthContext, AuthProvider(), useAuth(), NotificationContext, NotificationProvider() (+4 more)

### Community 2 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, devDependencies, eslint, @eslint/js (+9 more)

### Community 3 - "client.js"
Cohesion: 0.13
Nodes (31): cancelarPedido(), createPedido(), createPlato(), deletePlato(), getEmpresa(), getEmpresaSlug(), getMe(), getMenu() (+23 more)

### Community 4 - "PedidoTrackingPage.jsx"
Cohesion: 0.23
Nodes (12): atenderLlamado(), getLlamados(), getPedido(), llamarMozo(), getBase(), useSSE(), LlamadosPage(), ESTADO_COLORS (+4 more)

### Community 5 - "App.jsx"
Cohesion: 0.10
Nodes (28): getMesas(), DemoModal(), Navbar(), ProtectedRoute(), EMPTY, formatear(), PlatoDetailModal(), QRInstructionsModal() (+20 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.11
Nodes (17): DOM, ES2023, src, vite/client, compilerOptions, allowArbitraryExtensions, allowJs, checkJs (+9 more)

### Community 7 - "PlanoEditor.jsx"
Cohesion: 0.18
Nodes (18): createMesa(), deleteMesa(), saveLayout(), toggleMesaActiva(), updateMesa(), ESTADO_DOT, ESTADO_LABELS, formatPrecio() (+10 more)

### Community 8 - "package.json"
Cohesion: 0.07
Nodes (28): @google/model-viewer, dependencies, @google/model-viewer, qrcode, react, react-dom, react-router-dom, serve (+20 more)

### Community 9 - "LandingPage.jsx"
Cohesion: 0.17
Nodes (15): AnimatedStat(), COMPARACION, FAQS, FEATURES, fmt(), LandingPage(), PALABRAS, PASOS (+7 more)

### Community 12 - "adminUtils.js"
Cohesion: 0.23
Nodes (15): AdminConfigView(), AdminMenuView(), AdminMetricasView(), AdminPedidosView(), calcularMetricas(), CATE_LABELS, categoriaIcon(), COLUMNAS (+7 more)

### Community 13 - "CartContext.jsx"
Cohesion: 0.22
Nodes (7): App(), ErrorBoundary, CartContext, CartProvider(), itemKey(), loadCart(), unitPrice()

## Knowledge Gaps
- **72 isolated node(s):** `ITEMS`, `ThemeContext`, `AuthContext`, `NotificationContext`, `TYPE_ICONS` (+67 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useCompany()` connect `App.jsx` to `client.js`, `PedidoTrackingPage.jsx`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `ITEMS`, `ThemeContext`, `AuthContext` to the rest of the system?**
  _72 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `client.js` be split into smaller, more focused modules?**
  _Cohesion score 0.12944523470839261 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10042283298097252 - nodes in this community are weakly interconnected._
- **Should `TypeScript Config` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._