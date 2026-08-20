import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import ErrorBoundary from './components/ErrorBoundary';
import App from './App';
import '@tabler/icons-webfont/dist/tabler-icons.min.css';

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
