# Graph Report - front-pedidos-3D  (2026-08-20)

## Corpus Check
- 53 files · ~119,774 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 327 nodes · 721 edges · 16 communities (14 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d4f04471`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- mock.js
- devDependencies
- client.js
- AdminPage.jsx
- useCompany
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
1. `request()` - 44 edges
2. `useCompany()` - 21 edges
3. `AdminPage()` - 19 edges
4. `useAuth()` - 15 edges
5. `useCart()` - 14 edges
6. `PlanoEditor()` - 13 edges
7. `compilerOptions` - 12 edges
8. `useNotify()` - 11 edges
9. `CocinaPage()` - 11 edges
10. `getEmpresa()` - 10 edges

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

## Communities (16 total, 2 thin omitted)

### Community 1 - "mock.js"
Cohesion: 0.21
Nodes (10): crearPedido(), DEMO_EMPRESA, DEMO_MESAS, DEMO_PLATOS, estadoSegunElapsed(), guardarDemoPedido(), handleMock(), leerDemoPedido() (+2 more)

### Community 2 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, devDependencies, eslint, @eslint/js (+9 more)

### Community 3 - "client.js"
Cohesion: 0.11
Nodes (35): atenderLlamado(), createCupon(), createPlato(), createStaff(), deleteCupon(), deletePlato(), deleteStaff(), getCupones() (+27 more)

### Community 4 - "AdminPage.jsx"
Cohesion: 0.16
Nodes (24): cancelarPedido(), getPedidos(), logout(), registrarEmpresa(), updatePedidoEstado(), getBase(), useSSE(), AdminSidebar() (+16 more)

### Community 5 - "useCompany"
Cohesion: 0.11
Nodes (27): createPedido(), getMenu(), getMesas(), getPedido(), llamarMozo(), validarCupon(), fixStyle(), AdminSkeleton() (+19 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.11
Nodes (17): DOM, ES2023, src, vite/client, compilerOptions, allowArbitraryExtensions, allowJs, checkJs (+9 more)

### Community 7 - "PlanoEditor.jsx"
Cohesion: 0.18
Nodes (17): createMesa(), deleteMesa(), saveLayout(), toggleMesaActiva(), updateMesa(), ESTADO_DOT, ESTADO_LABELS, formatPrecio() (+9 more)

### Community 8 - "package.json"
Cohesion: 0.07
Nodes (28): @google/model-viewer, dependencies, @google/model-viewer, qrcode, react, react-dom, react-router-dom, serve (+20 more)

### Community 9 - "LandingPage.jsx"
Cohesion: 0.17
Nodes (15): AnimatedStat(), COMPARACION, FAQS, FEATURES, fmt(), LandingPage(), PALABRAS, PASOS (+7 more)

### Community 12 - "adminUtils.js"
Cohesion: 0.22
Nodes (15): AdminMenuView(), AdminMetricasView(), AdminPedidosView(), FILTROS, LocalSettingsModal(), calcularMetricas(), CATE_LABELS, categoriaIcon() (+7 more)

### Community 13 - "App.jsx"
Cohesion: 0.07
Nodes (29): App(), defaultRouteForRole(), DemoModal(), Navbar(), ProtectedRoute(), ThemeToggle(), ErrorBoundary, REDES (+21 more)

### Community 14 - "manifest.json"
Cohesion: 0.12
Nodes (15): background_color, categories, description, display, icons, lang, name, orientation (+7 more)

### Community 15 - "CompanyContext.jsx"
Cohesion: 0.29
Nodes (9): getEmpresa(), login(), CompanyContext, CompanyProvider(), getSlugFromPath(), RESERVED, defaultRouteForRole(), getSlugFromPath() (+1 more)

## Knowledge Gaps
- **95 isolated node(s):** `DEMO_EMPRESA`, `DEMO_PLATOS`, `DEMO_MESAS`, `ITEMS`, `EMPTY_CUPON` (+90 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useCompany()` connect `useCompany` to `AdminPage.jsx`, `App.jsx`, `CompanyContext.jsx`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `request()` connect `client.js` to `mock.js`, `AdminPage.jsx`, `useCompany`, `PlanoEditor.jsx`, `CompanyContext.jsx`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `DEMO_EMPRESA`, `DEMO_PLATOS`, `DEMO_MESAS` to the rest of the system?**
  _95 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `client.js` be split into smaller, more focused modules?**
  _Cohesion score 0.11282051282051282 - nodes in this community are weakly interconnected._
- **Should `useCompany` be split into smaller, more focused modules?**
  _Cohesion score 0.10634920634920635 - nodes in this community are weakly interconnected._
- **Should `TypeScript Config` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._