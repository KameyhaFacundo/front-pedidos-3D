import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import ErrorBoundary from './components/ErrorBoundary';
import App from './App';
import '@tabler/icons-webfont/dist/tabler-icons.min.css';

// Browsers (Chrome) autofill inputs by heuristics on their label/placeholder
// ("Nombre y apellido", "Teléfono"...) and auto-focus the first field, filling
// it with the saved user profile. That is unwanted on every screen except
// login/registro, so strip autofill from every field not explicitly opted in
// via data-allow-autocomplete. Runs on a MutationObserver so it also covers
// inputs rendered later (modals, dynamic forms).
function disableAutofill() {
  const walk = () => {
    document.querySelectorAll('input, select, textarea').forEach((el) => {
      if (!el.closest('[data-allow-autocomplete]')) {
        el.setAttribute('autocomplete', 'off');
      }
    });
  };
  walk();
  const observer = new MutationObserver(walk);
  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('beforeunload', () => observer.disconnect(), { once: true });
}
disableAutofill();

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <CartProvider>
          <App />
        </CartProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
