# Graph Report - front-pedidos-3D  (2026-08-19)

## Corpus Check
- 38 files · ~112,425 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 241 nodes · 499 edges · 14 communities (12 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6c19c607`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ThemeContext.jsx
- useAuth
- devDependencies
- client.js
- App.jsx
- MenuPage.jsx
- TypeScript Config
- PlanoEditor.jsx
- package.json
- LandingPage.jsx
- CLAUDE.md
- main.jsx

## God Nodes (most connected - your core abstractions)
1. `request()` - 33 edges
2. `AdminPage()` - 22 edges
3. `useCompany()` - 16 edges
4. `useCart()` - 14 edges
5. `PlanoEditor()` - 13 edges
6. `compilerOptions` - 12 edges
7. `useSSE()` - 10 edges
8. `getMesas()` - 10 edges
9. `useAuth()` - 9 edges
10. `useNotify()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `DemoModal()` --calls--> `useCart()`  [EXTRACTED]
  src/App.jsx → src/context/CartContext.jsx
- `ProtectedRoute()` --calls--> `useCompany()`  [EXTRACTED]
  src/App.jsx → src/context/CompanyContext.jsx
- `ThemeToggle()` --calls--> `useTheme()`  [EXTRACTED]
  src/App.jsx → src/context/ThemeContext.jsx
- `PlanoEditor()` --calls--> `getEmpresa()`  [EXTRACTED]
  src/components/PlanoEditor.jsx → src/api/client.js
- `AdminPage()` --calls--> `getEmpresa()`  [EXTRACTED]
  src/pages/AdminPage.jsx → src/api/client.js

## Import Cycles
- None detected.

## Communities (14 total, 2 thin omitted)

### Community 0 - "ThemeContext.jsx"
Cohesion: 0.29
Nodes (8): ThemeToggle(), AdminSidebar(), ITEMS, getScope(), getStoredThemes(), ThemeContext, ThemeProvider(), useTheme()

### Community 1 - "useAuth"
Cohesion: 0.29
Nodes (9): login(), registrarEmpresa(), ProtectedRoute(), RegistroModal(), AuthContext, AuthProvider(), useAuth(), getSlugFromPath() (+1 more)

### Community 2 - "devDependencies"
Cohesion: 0.13
Nodes (15): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, devDependencies, eslint, @eslint/js (+7 more)

### Community 3 - "client.js"
Cohesion: 0.12
Nodes (36): atenderLlamado(), cancelarPedido(), createPlato(), deletePlato(), getEmpresaSlug(), getLlamados(), getMe(), getMetricas() (+28 more)

### Community 4 - "App.jsx"
Cohesion: 0.10
Nodes (17): getEmpresa(), getPedido(), llamarMozo(), DemoModal(), REDES, CompanyContext, CompanyProvider(), getSlugFromPath() (+9 more)

### Community 5 - "MenuPage.jsx"
Cohesion: 0.11
Nodes (28): createPedido(), getMenu(), getMesas(), validarCupon(), Navbar(), EMPTY, formatear(), PlatoDetailModal() (+20 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.11
Nodes (17): DOM, ES2023, src, vite/client, compilerOptions, allowArbitraryExtensions, allowJs, checkJs (+9 more)

### Community 7 - "PlanoEditor.jsx"
Cohesion: 0.17
Nodes (20): createMesa(), deleteMesa(), saveLayout(), toggleMesaActiva(), updateMesa(), ESTADO_DOT, ESTADO_LABELS, formatPrecio() (+12 more)

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

- **Why does `AdminPage()` connect `client.js` to `useAuth`, `App.jsx`, `MenuPage.jsx`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _73 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `client.js` be split into smaller, more focused modules?**
  _Cohesion score 0.12181616832779624 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10256410256410256 - nodes in this community are weakly interconnected._
- **Should `MenuPage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10810810810810811 - nodes in this community are weakly interconnected._